"""
Analytics service entry point.

Handles app-level concerns only: CORS, DB connection pool lifecycle,
health check, and mounting feature routers. Domain logic (event
ingestion, KPI calculation) lives in navbar_analytics.py — this file
stays a thin wiring layer so it's easy to mount additional analytics
routers here later without main.py growing unbounded.

Run locally:
    uv run uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_pool, get_pool
from navbar_analytics import router as navbar_analytics_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Just opens/closes the connection pool. Schema is owned by
    # database/ (Drizzle) — run `pnpm db:generate && pnpm db:migrate`
    # at the repo root before starting this service, not here.
    await get_pool()
    yield
    await close_pool()


app = FastAPI(title="Build Me — Analytics", version="0.3.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # apps/web dev server (Vite default)
        "http://localhost:5174",  # apps/admin dev server, if run alongside
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(navbar_analytics_router)


@app.get("/health")
def health() -> dict[str, Literal["ok"]]:
    return {"status": "ok"}