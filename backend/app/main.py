from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.staticfiles import StaticFiles
from openai import OpenAI

from . import ai
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
    if not settings.auth_required:
        return
    header = request.headers.get("authorization", "")
    expected = f"Bearer {settings.api_token}"
    if header != expected:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid bearer token.",
        )


app = FastAPI(title="Foundry FX — AI Sales Message", version="0.1.0")


@app.get("/healthz", tags=["meta"])
def healthz():
    return {"status": "ok", "key_configured": settings.key_configured}


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