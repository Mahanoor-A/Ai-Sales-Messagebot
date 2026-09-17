import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings(BaseSettings):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    temperature: float = float(os.getenv("AI_TEMPERATURE", "0.6"))
    api_token: str = os.getenv("AI_API_TOKEN", "")

    model_config = {"case_sensitive": False}

    @property
    def key_configured(self) -> bool:
        return bool(self.openai_api_key) and not self.openai_api_key.startswith("sk-...")

    @property
    def auth_required(self) -> bool:
        return bool(self.api_token)


settings = Settings()