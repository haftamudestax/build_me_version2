"""
Database connection pool for the analytics service.

This module ONLY connects and queries — it does not own or create the
schema. The navigation_events table is defined and migrated through
the database/ package (Drizzle), via `pnpm db:generate` / `pnpm db:migrate`
at the repo root. Run that pipeline before starting this service.

Reads DATABASE_URL from the environment — your Supabase project's
Postgres connection string (Project Settings -> Database -> Connection
string -> URI). Use the direct connection (port 5432), not the
pgbouncer/transaction pooler URL, since this is a single long-running
process, not serverless.
"""

from __future__ import annotations

import os
import asyncpg
from asyncpg import Pool
from dotenv import load_dotenv
load_dotenv()
_pool: Pool | None = None

async def get_pool() -> Pool:
    global _pool
    if _pool is None:
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            raise RuntimeError(
                "DATABASE_URL is not set. Copy .env.example to .env and fill "
                "in your Supabase connection string."
            )
        _pool = await asyncpg.create_pool(database_url, min_size=1, max_size=5)
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None