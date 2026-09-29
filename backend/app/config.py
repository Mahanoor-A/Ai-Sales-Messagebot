import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings(BaseSettings):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    temperature: float = float(os.getenv("AI_TEMPERATURE", "0.6"))
    # One key, or several comma-separated (e.g. one per consuming app, or old
    # and new during a rotation).
    api_token: str = os.getenv("AI_API_TOKEN", "")
    # Comma-separated browser origins allowed to call the API cross-origin,
    # e.g. "https://builder.foundryfx.com". Empty = same-origin only.
    cors_origins: str = os.getenv("CORS_ORIGINS", "")
    # The built-in web page drafts via /v1/ui/sales-message without a key,
    # limited per visitor IP and overall within a rolling window.
    ui_enabled: bool = os.getenv("UI_ENABLED", "true").lower() not in ("0", "false", "no")
    ui_rate_limit: int = int(os.getenv("UI_RATE_LIMIT", "30"))
    ui_rate_limit_global: int = int(os.getenv("UI_RATE_LIMIT_GLOBAL", "300"))
    ui_rate_window_seconds: int = int(os.getenv("UI_RATE_WINDOW_SECONDS", "600"))

    model_config = {"case_sensitive": False}

    @property
    def api_tokens(self) -> list[str]:
        return [t.strip() for t in self.api_token.split(",") if t.strip()]

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @property
    def key_configured(self) -> bool:
        return bool(self.openai_api_key) and not self.openai_api_key.startswith("sk-...")

    @property
    def auth_required(self) -> bool:
        return bool(self.api_tokens)


settings = Settings()