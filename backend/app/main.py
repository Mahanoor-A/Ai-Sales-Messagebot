import secrets
import json
import logging
import threading
import time
from collections import defaultdict, deque
from pathlib import Path
from urllib.parse import urlparse

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

from .import ai
from .config import settings
from .schemas import SalesMessageRequest, SalesMessageResponse

DEMO_DIR = Path(__file__).resolve().parents[2] / "demo"
logger = logging.getLogger(__name__)


class SmsSummaryRequest(BaseModel):
    sales_pitch: str = Field(..., min_length=1, max_length=8000)
    deal_link: str = Field(..., min_length=1, max_length=1000)


class SmsSummaryResponse(BaseModel):
    message: str


class RankingIndicator(BaseModel):
    id: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=120)
    guidance: str = Field(..., min_length=1, max_length=500)


class RankMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    indicators: list[RankingIndicator] = Field(..., min_length=1, max_length=20)
    client_context: str | None = Field(default=None, max_length=4000)
    deal_context: str | None = Field(default=None, max_length=4000)


class RankedIndicator(BaseModel):
    id: str
    score: int = Field(..., ge=0, le=5)
    evidence: str


class RankMessageResponse(BaseModel):
    indicators: list[RankedIndicator]
    overall_score: float
    band: str


def get_client() -> OpenAI:
    if not settings.key_configured:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "OpenAI API key is not configured. Set OPENAI_API_KEY in the "
                "backend .env file, then restart the service."
            ),
        )
    return OpenAI(api_key=settings.openai_api_key)


def provider_http_error(exc: Exception) -> HTTPException:
    """Log upstream failures for operators without returning SDK internals to browsers."""
    logger.error("OpenAI request failed (%s)", type(exc).__name__, exc_info=True)
    error_name = type(exc).__name__
    if error_name == "APIConnectionError":
        detail = "Could not connect to OpenAI from this service. Check outbound network access and retry."
    elif error_name == "APITimeoutError":
        detail = "The OpenAI request timed out. Please retry."
    elif error_name == "AuthenticationError":
        detail = "OpenAI rejected the configured API key. Update OPENAI_API_KEY in the hosting environment."
    elif error_name == "RateLimitError":
        detail = "OpenAI rejected the request because of a rate or account limit. Check the OpenAI project limits and billing."
    else:
        detail = f"The OpenAI request failed ({error_name}). Check the service logs for details."
    return HTTPException(status.HTTP_502_BAD_GATEWAY, detail=detail)


def require_token(request: Request) -> None:
    """Accept the key as `Authorization: Bearer <key>` or `X-API-Key: <key>`."""
    if not settings.auth_required:
        return
    header = request.headers.get("authorization", "")
    supplied = header[7:].strip() if header[:7].lower() == "bearer " else ""
    supplied = supplied or request.headers.get("x-api-key", "").strip()
    # Compare against every key without short-circuiting, in constant time.
    matched = False
    for token in settings.api_tokens:
        matched |= secrets.compare_digest(supplied.encode(), token.encode())
    if not supplied or not matched:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API key.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def _org_id_from_request(request: Request) -> str | None:
    for header_name in (
        "x-org-id",
        "x-organization-id",
        "organization-id",
        "x-tenant-id",
        "tenant-id",
    ):
        value = request.headers.get(header_name, "").strip()
        if value:
            return value
    return None


def _role_from_request(request: Request) -> str | None:
    for header_name in ("x-user-role", "x-role", "role"):
        value = request.headers.get(header_name, "").strip()
        if value:
            return value.lower()
    return None


def require_ai_access(request: Request) -> None:
    """Allow a global AI off switch and organization-level allow/block checks."""
    if not settings.ai_enabled:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail="AI access is disabled for this environment.",
        )

    org_id = _org_id_from_request(request)
    if settings.org_allowlist:
        if not org_id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="AI access is restricted by organization. Supply X-Org-Id.",
            )
        if org_id not in settings.org_allowlist:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail=f"Organization '{org_id}' is not allowed to use AI.",
            )
    if settings.org_blocklist and org_id and org_id in settings.org_blocklist:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail=f"Organization '{org_id}' has AI disabled.",
        )

    if settings.allowed_roles:
        role = _role_from_request(request)
        if not role or role not in settings.allowed_roles:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="This user role is not permitted to use AI.",
            )


app = FastAPI(title="Foundry FX — AI Sales Message", version="0.1.0")

if settings.cors_origin_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["POST", "GET", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "X-API-Key",
            "X-Org-Id",
            "X-User-Role",
            "Content-Type",
        ],
        max_age=600,
    )


@app.get("/healthz", tags=["meta"])
def healthz():
    return {
        "status": "ok",
        "key_configured": settings.key_configured,
        "auth_required": settings.auth_required,
        "ai_enabled": settings.ai_enabled,
        "org_allowlist": sorted(settings.org_allowlist),
        "org_blocklist": sorted(settings.org_blocklist),
        "allowed_roles": sorted(settings.allowed_roles),
    }


@app.post(
    "/v1/ai/sales-message",
    response_model=SalesMessageResponse,
    dependencies=[Depends(require_token), Depends(require_ai_access)],
    tags=["ai"],
)
def sales_message(
    req: SalesMessageRequest,
    client: OpenAI = Depends(get_client),
):
    """Integration endpoint: requires the API key when AI_API_TOKEN is set."""
    return _generate(req, client)


# ---------------------------------------------------------------------- #
# Built-in web page endpoint: no API key, so the page works in any       #
# browser. Guarded instead by a same-origin check and per-IP and global  #
# rate limits, so it can't be used as a free general-purpose API.        #
# ---------------------------------------------------------------------- #
_ui_hits: dict[str, deque[float]] = defaultdict(deque)
_ui_all: deque[float] = deque()
_ui_lock = threading.Lock()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _allow(bucket: deque[float], limit: int, now: float) -> bool:
    while bucket and now - bucket[0] > settings.ui_rate_window_seconds:
        bucket.popleft()
    return len(bucket) < limit


def require_same_origin_and_rate_limit(request: Request) -> None:
    if not settings.ui_enabled:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Not found.")
    origin = request.headers.get("origin", "")
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    same_origin = request.headers.get("sec-fetch-site") == "same-origin" or (
        bool(origin) and urlparse(origin).netloc == host
    )
    if not same_origin:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for the built-in web page. Integrations should use /v1/ai/sales-message with an API key.",
        )
    now = time.monotonic()
    ip = _client_ip(request)
    with _ui_lock:
        mine = _ui_hits[ip]
        if not _allow(mine, settings.ui_rate_limit, now) or not _allow(
            _ui_all, settings.ui_rate_limit_global, now
        ):
            raise HTTPException(
                status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many drafts in a short time. Please wait a few minutes and try again.",
                headers={"Retry-After": str(settings.ui_rate_window_seconds)},
            )
        mine.append(now)
        _ui_all.append(now)


@app.post(
    "/v1/ui/sales-message",
    response_model=SalesMessageResponse,
    dependencies=[Depends(require_same_origin_and_rate_limit), Depends(require_ai_access)],
    tags=["ui"],
)
def ui_sales_message(
    req: SalesMessageRequest,
    client: OpenAI = Depends(get_client),
):
    return _generate(req, client)


@app.post(
    "/v1/ui/sms-summary",
    response_model=SmsSummaryResponse,
    dependencies=[Depends(require_same_origin_and_rate_limit), Depends(require_ai_access)],
    tags=["ui"],
)
def ui_sms_summary(req: SmsSummaryRequest, client: OpenAI = Depends(get_client)):
    link_suffix = f" Deal: {req.deal_link}"
    if len(link_suffix) > 200:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="The deal link is too long for a 200-character SMS.")
    summary_budget = max(0, 200 - len(link_suffix))
    try:
        completion = client.chat.completions.create(
            model=settings.model,
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Summarize the provided client sales pitch as one concise, "
                        "client-ready SMS sentence. Use only facts in the pitch. "
                        f"Keep it within {summary_budget} characters. Output only the summary."
                    ),
                },
                {"role": "user", "content": req.sales_pitch},
            ],
        )
        summary = (completion.choices[0].message.content or "").strip()
        if len(summary) > summary_budget:
            summary = summary[:summary_budget].rsplit(" ", 1)[0]
        message = f"{summary.rstrip(' .')} {link_suffix.strip()}".strip()
        return SmsSummaryResponse(message=message[:200])
    except Exception as exc:
        raise provider_http_error(exc) from exc


@app.post(
    "/v1/ui/rank-sales-message",
    response_model=RankMessageResponse,
    dependencies=[Depends(require_same_origin_and_rate_limit), Depends(require_ai_access)],
    tags=["ui"],
)
def ui_rank_sales_message(req: RankMessageRequest, client: OpenAI = Depends(get_client)):
    if len({indicator.id for indicator in req.indicators}) != len(req.indicators):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Indicator IDs must be unique.")
    rubric = [{"id": item.id, "name": item.name, "guidance": item.guidance} for item in req.indicators]
    user_data = {
        "sales_message": req.message,
        "client_context": req.client_context or "Not provided",
        "deal_context": req.deal_context or "Not provided",
        "indicators": rubric,
    }
    try:
        completion = client.chat.completions.create(
            model=settings.model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Evaluate a client-facing FX sales message against the supplied organization indicators. "
                        "Score each indicator from 0 to 5: 0 means absent or unsupported, 1 poor, 2 weak, "
                        "3 adequate, 4 strong, 5 excellent. Judge only evidence in the message and supplied "
                        "client/deal context. Never reward invented prices, levels, claims, urgency, or trade "
                        "confirmation links. For each item give one short evidence-based reason. Return one JSON "
                        'object with "indicators": [{"id": string, "score": integer, "evidence": string}] and '
                        'include every supplied indicator exactly once.'
                    ),
                },
                {"role": "user", "content": json.dumps(user_data, ensure_ascii=False)},
            ],
        )
        data = json.loads(completion.choices[0].message.content or "{}")
        raw = {str(item.get("id")): item for item in data.get("indicators", []) if isinstance(item, dict)}
        ranked = []
        for indicator in req.indicators:
            item = raw.get(indicator.id, {})
            try:
                score = max(0, min(5, int(item.get("score", 0))))
            except (TypeError, ValueError):
                score = 0
            evidence = str(item.get("evidence") or "No supporting evidence was identified.")[:300]
            ranked.append(RankedIndicator(id=indicator.id, score=score, evidence=evidence))
        overall = round(sum(row.score for row in ranked) / len(ranked), 1)
        band = "red" if overall < 2.3 else "amber" if overall < 3.8 else "green"
        return RankMessageResponse(indicators=ranked, overall_score=overall, band=band)
    except HTTPException:
        raise
    except Exception as exc:
        raise provider_http_error(exc) from exc


def _generate(req: SalesMessageRequest, client: OpenAI) -> SalesMessageResponse:
    try:
        result = ai.generate_sales_message(
            client, req, model=settings.model, temperature=settings.temperature
        )
    except ai.AiGenerationError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except Exception as exc:  # openai errors, network failures
        raise provider_http_error(exc) from exc

    return SalesMessageResponse(
        message=result.message,
        subject=result.subject,
        alternative_message=result.alternative_message,
        model=settings.model,
        generated_at=ai.now_iso(),
    )


if DEMO_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(DEMO_DIR), html=True), name="demo")
