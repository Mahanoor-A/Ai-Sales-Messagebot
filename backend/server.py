"""Supervisor-compatible ASGI entrypoint for the standalone uploaded service."""

from app.main import app

__all__ = ["app"]