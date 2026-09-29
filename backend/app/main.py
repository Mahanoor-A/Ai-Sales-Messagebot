import secrets
import threading
import time
from collections import defaultdict, deque
from pathlib import Path
from urllib.parse import urlparse

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from openai import OpenAI

from .import ai
from .config import settings
from .schemas import SalesMessageRequest, SalesMessageResponse

DEMO_DIR = Path(__file__).resolve().parents[2] / "demo"


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


app = FastAPI(title="Foundry FX — AI Sales Message", version="0.1.0")

if settings.cors_origin_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["POST", "GET", "OPTIONS"],
        allow_headers=["Authorization", "X-API-Key", "Content-Type"],
        max_age=600,
    )


@app.get("/healthz", tags=["meta"])
def healthz():
    return {
        "status": "ok",
        "key_configured": settings.key_configured,
        "auth_required": settings.auth_required,
    }


@app.post(
    "/v1/ai/sales-message",
    response_model=SalesMessageResponse,
    dependencies=[Depends(require_token)],
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
    dependencies=[Depends(require_same_origin_and_rate_limit)],
    tags=["ui"],
)
def ui_sales_message(
    req: SalesMessageRequest,
    client: OpenAI = Depends(get_client),
):
    return _generate(req, client)


def _generate(req: SalesMessageRequest, client: OpenAI) -> SalesMessageResponse:
    try:
        result = ai.generate_sales_message(
            client, req, model=settings.model, temperature=settings.temperature
        )
    except ai.AiGenerationError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except Exception as exc:  # openai errors, network failures
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            detail=f"The AI provider could not be reached: {exc}",
        ) from exc

    return SalesMessageResponse(
        message=result.message,
        subject=result.subject,
        alternative_message=result.alternative_message,
        model=settings.model,
        generated_at=ai.now_iso(),
    )


if DEMO_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(DEMO_DIR), html=True), name="demo")