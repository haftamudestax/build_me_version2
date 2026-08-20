"""
Navbar analytics ingestion service.
Run locally:
    uv run uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Build Me — Navbar Analytics", version="0.1.0")

# Dev-time CORS. Tighten this to the real deployed origin(s) before prod.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # apps/web dev server (Vite default)
        "http://localhost:5174",  # apps/admin dev server, if run alongside
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class DeviceType(str, Enum):
    desktop = "desktop"
    tablet = "tablet"
    mobile = "mobile"


class NavEventType(str, Enum):
    logo_click = "logo_click"
    nav_link_click = "nav_link_click"
    logo_view = "logo_view"


class NavigationEventIn(BaseModel):
    """Payload shape the frontend sends. Server assigns event_id + timestamp."""

    session_id: str = Field(..., min_length=1)
    source_route: str
    destination_route: str
    event_type: NavEventType
    navigation_success: bool
    device_type: DeviceType
    viewport_type: str


class NavigationEvent(NavigationEventIn):
    event_id: str
    timestamp: datetime


# TODO: replace with a real table (Supabase/Postgres) once schema is confirmed.
# Matches §16.10's NAVIGATION_EVENT entity 1:1.
EVENT_STORE: list[NavigationEvent] = []


@app.post("/events", response_model=NavigationEvent, status_code=201)
def ingest_event(event_in: NavigationEventIn) -> NavigationEvent:
    event = NavigationEvent(
        event_id=str(uuid4()),
        timestamp=datetime.now(timezone.utc),
        **event_in.model_dump(),
    )
    EVENT_STORE.append(event)
    return event


@app.get("/events", response_model=list[NavigationEvent])
def list_events(event_type: NavEventType | None = None) -> list[NavigationEvent]:
    if event_type is None:
        return EVENT_STORE
    return [e for e in EVENT_STORE if e.event_type == event_type]


class KpiSummary(BaseModel):
    logo_views: int
    logo_clicks: int
    successful_home_navigations: int
    failed_navigation_attempts: int
    logo_click_rate: float
    home_navigation_success_rate: float
    navigation_error_rate: float


@app.get("/kpis", response_model=KpiSummary)
def kpi_summary() -> KpiSummary:
    """
    Implements §16.3's calculation rules exactly:
      Logo Click Rate = Logo Clicks / Logo Views * 100
      Home Navigation Success Rate = Successful Home Navigations / Logo Clicks * 100
      Navigation Error Rate = Failed Navigation Attempts / Logo Clicks * 100
    """
    logo_views = sum(1 for e in EVENT_STORE if e.event_type == NavEventType.logo_view)
    logo_clicks = sum(1 for e in EVENT_STORE if e.event_type == NavEventType.logo_click)
    successful = sum(
        1
        for e in EVENT_STORE
        if e.event_type == NavEventType.logo_click and e.navigation_success
    )
    failed = sum(
        1
        for e in EVENT_STORE
        if e.event_type == NavEventType.logo_click and not e.navigation_success
    )

    def safe_pct(numerator: int, denominator: int) -> float:
        return round((numerator / denominator) * 100, 2) if denominator else 0.0

    return KpiSummary(
        logo_views=logo_views,
        logo_clicks=logo_clicks,
        successful_home_navigations=successful,
        failed_navigation_attempts=failed,
        logo_click_rate=safe_pct(logo_clicks, logo_views),
        home_navigation_success_rate=safe_pct(successful, logo_clicks),
        navigation_error_rate=safe_pct(failed, logo_clicks),
    )


@app.get("/health")
def health() -> dict[str, Literal["ok"]]:
    return {"status": "ok"}