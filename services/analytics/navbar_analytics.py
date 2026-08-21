"""
Navbar analytics: event ingestion + KPI calculation.

Implements the logical data model and KPI formulas from the Data &
Analytics spec (Section 16.3, Section 16.10). Owns everything specific to
navbar navigation events — main.py just mounts this router and handles
app-level concerns (CORS, DB pool lifecycle, health check).
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel, Field

from database import get_pool

router = APIRouter(tags=["navbar-analytics"])


class DeviceType(str, Enum):
    desktop = "desktop"
    tablet = "tablet"
    mobile = "mobile"


class NavEventType(str, Enum):
    logo_click = "logo_click"
    nav_link_click = "nav_link_click"
    logo_view = "logo_view"


class NavigationEventIn(BaseModel):
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


class KpiSummary(BaseModel):
    logo_views: int
    logo_clicks: int
    successful_home_navigations: int
    failed_navigation_attempts: int
    logo_click_rate: float
    home_navigation_success_rate: float
    navigation_error_rate: float


def _is_uuid(value: str) -> bool:
    try:
        UUID(value)
        return True
    except ValueError:
        return False


def _row_to_event(row) -> NavigationEvent:
    return NavigationEvent(
        event_id=str(row["event_id"]),
        session_id=str(row["session_id"]),
        source_route=row["source_route"],
        destination_route=row["destination_route"],
        event_type=row["event_type"],
        navigation_success=row["navigation_success"],
        device_type=row["device_type"],
        viewport_type=row["viewport_type"],
        timestamp=row["created_at"],
    )


@router.post("/events", response_model=NavigationEvent, status_code=201)
async def ingest_event(event_in: NavigationEventIn) -> NavigationEvent:
    pool = await get_pool()
    event_id = uuid4()
    session_id = UUID(event_in.session_id) if _is_uuid(event_in.session_id) else uuid4()

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            insert into navigation_events (
                event_id, session_id, source_route, destination_route,
                event_type, navigation_success, device_type, viewport_type
            )
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning event_id, session_id, source_route, destination_route,
                      event_type, navigation_success, device_type, viewport_type,
                      created_at
            """,
            event_id,
            session_id,
            event_in.source_route,
            event_in.destination_route,
            event_in.event_type.value,
            event_in.navigation_success,
            event_in.device_type.value,
            event_in.viewport_type,
        )

    return _row_to_event(row)


@router.get("/events", response_model=list[NavigationEvent])
async def list_events(event_type: NavEventType | None = None) -> list[NavigationEvent]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        if event_type is None:
            rows = await conn.fetch(
                "select * from navigation_events order by created_at desc limit 500"
            )
        else:
            rows = await conn.fetch(
                "select * from navigation_events where event_type = $1 "
                "order by created_at desc limit 500",
                event_type.value,
            )
    return [_row_to_event(row) for row in rows]


@router.get("/kpis", response_model=KpiSummary)
async def kpi_summary() -> KpiSummary:
    """
    Section 16.3:
      Logo Click Rate = Logo Clicks / Logo Views * 100
      Home Navigation Success Rate = Successful Home Navigations / Logo Clicks * 100
      Navigation Error Rate = Failed Navigation Attempts / Logo Clicks * 100
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            select
                count(*) filter (where event_type = 'logo_view') as logo_views,
                count(*) filter (where event_type = 'logo_click') as logo_clicks,
                count(*) filter (
                    where event_type = 'logo_click' and navigation_success
                ) as successful_home_navigations,
                count(*) filter (
                    where event_type = 'logo_click' and not navigation_success
                ) as failed_navigation_attempts
            from navigation_events
            """
        )

    logo_views = row["logo_views"]
    logo_clicks = row["logo_clicks"]
    successful = row["successful_home_navigations"]
    failed = row["failed_navigation_attempts"]

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