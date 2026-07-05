"""SQLite persistence for claims and pipeline stage events.

Deliberately dependency-free (stdlib ``sqlite3``). Each operation opens its own
connection, so calls are safe from FastAPI's threadpool without shared-state
locking. WAL mode lets the SSE reader poll events while the background worker
writes them.

Tables:
    claims  - one row per submitted claim; ``result_json`` holds the pipeline's
              14-field verdict once processing completes.
    events  - append-only stage log per claim, consumed by the SSE endpoint.
"""

from __future__ import annotations

import json
import sqlite3
import time
from typing import Any

from .config import DB_PATH

_SCHEMA = """
CREATE TABLE IF NOT EXISTS claims (
    id            TEXT PRIMARY KEY,
    created_at    REAL NOT NULL,
    claim_object  TEXT NOT NULL,
    user_claim    TEXT NOT NULL,
    image_paths   TEXT NOT NULL,      -- ;-joined relative paths, mirrors batch schema
    status        TEXT NOT NULL,      -- pending | running | done | failed
    error         TEXT,
    result_json   TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id   TEXT NOT NULL REFERENCES claims(id),
    created_at REAL NOT NULL,
    stage      TEXT NOT NULL,
    detail     TEXT NOT NULL          -- JSON blob
);

CREATE INDEX IF NOT EXISTS idx_events_claim ON events(claim_id, id);
"""


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.executescript(_SCHEMA)


def create_claim(claim_id: str, claim_object: str, user_claim: str, image_paths: str) -> None:
    with _connect() as conn:
        conn.execute(
            "INSERT INTO claims (id, created_at, claim_object, user_claim, image_paths, status)"
            " VALUES (?, ?, ?, ?, ?, 'pending')",
            (claim_id, time.time(), claim_object, user_claim, image_paths),
        )


def set_status(claim_id: str, status: str, error: str | None = None) -> None:
    with _connect() as conn:
        conn.execute(
            "UPDATE claims SET status = ?, error = ? WHERE id = ?",
            (status, error, claim_id),
        )


def set_result(claim_id: str, result: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            "UPDATE claims SET status = 'done', result_json = ? WHERE id = ?",
            (json.dumps(result, ensure_ascii=False), claim_id),
        )


def get_claim(claim_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM claims WHERE id = ?", (claim_id,)).fetchone()
    return _claim_row_to_dict(row) if row else None


def list_claims(limit: int = 50) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM claims ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [_claim_row_to_dict(r) for r in rows]


def add_event(claim_id: str, stage: str, detail: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            "INSERT INTO events (claim_id, created_at, stage, detail) VALUES (?, ?, ?, ?)",
            (claim_id, time.time(), stage, json.dumps(detail, ensure_ascii=False)),
        )


def get_events_after(claim_id: str, after_id: int = 0) -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT id, created_at, stage, detail FROM events"
            " WHERE claim_id = ? AND id > ? ORDER BY id",
            (claim_id, after_id),
        ).fetchall()
    return [
        {
            "id": r["id"],
            "created_at": r["created_at"],
            "stage": r["stage"],
            "detail": json.loads(r["detail"]),
        }
        for r in rows
    ]


def _claim_row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    d = dict(row)
    d["result"] = json.loads(d.pop("result_json")) if d.get("result_json") else None
    d.pop("result_json", None)
    d["image_paths"] = [p for p in (d.get("image_paths") or "").split(";") if p]
    return d
