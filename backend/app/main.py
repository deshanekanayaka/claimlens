"""ClaimLens API.

Endpoints:
    POST /api/claims               submit a claim (multipart: images + fields)
    GET  /api/claims               reviewer queue (most recent first)
    GET  /api/claims/{id}          full claim detail + verdict
    GET  /api/claims/{id}/events   SSE stream of live pipeline stages
    GET  /uploads/...              submitted images (static)
    GET  /api/health               liveness probe

Run:
    uvicorn app.main:app --reload --port 8000   (from backend/)
"""

from __future__ import annotations

import asyncio
import json
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

from . import db, service
from .config import (
    ALLOWED_UPLOAD_EXTENSIONS,
    CLAIM_OBJECTS,
    CORS_ORIGINS,
    MAX_IMAGE_BYTES,
    MAX_IMAGES_PER_CLAIM,
    UPLOADS_DIR,
)
from .schemas import ClaimCreated, ClaimDetail, ClaimSummary, StageEvent, Verdict


@asynccontextmanager
async def lifespan(app: FastAPI):
    """App lifespan: initialise the database schema on startup."""
    db.init_db()
    yield


app = FastAPI(title="ClaimLens", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/claims", response_model=ClaimCreated, status_code=202)
async def submit_claim(
    background: BackgroundTasks,
    claim_object: str = Form(...),
    user_claim: str = Form(...),
    images: list[UploadFile] = File(...),
) -> ClaimCreated:
    if claim_object not in CLAIM_OBJECTS:
        raise HTTPException(422, f"claim_object must be one of {CLAIM_OBJECTS}")
    if not user_claim.strip():
        raise HTTPException(422, "user_claim must not be empty")
    if not 1 <= len(images) <= MAX_IMAGES_PER_CLAIM:
        raise HTTPException(422, f"submit between 1 and {MAX_IMAGES_PER_CLAIM} images")
    for f in images:
        ext = Path(f.filename or "").suffix.lower()
        if ext and ext not in ALLOWED_UPLOAD_EXTENSIONS:
            raise HTTPException(422, f"unsupported image type: {ext}")
        if f.size and f.size > MAX_IMAGE_BYTES:
            raise HTTPException(413, f"image {f.filename} exceeds {MAX_IMAGE_BYTES} bytes")

    claim_id = uuid.uuid4().hex[:12]
    saved = service.save_uploads(claim_id, [(f.filename or "", f.file) for f in images])
    db.create_claim(
        claim_id,
        claim_object,
        user_claim,
        ";".join(p.name for p in saved),
    )
    # Sync function -> Starlette runs it in the threadpool, keeping the event
    # loop free while the pipeline makes its (blocking) Anthropic calls.
    background.add_task(
        service.run_claim, claim_id, claim_object, user_claim, [str(p) for p in saved]
    )
    return ClaimCreated(id=claim_id, status="pending", events_url=f"/api/claims/{claim_id}/events")


@app.get("/api/claims", response_model=list[ClaimSummary])
def list_claims(limit: int = 50) -> list[ClaimSummary]:
    summaries = []
    for c in db.list_claims(limit=min(limit, 200)):
        result = c.get("result") or {}
        summaries.append(
            ClaimSummary(
                id=c["id"],
                created_at=c["created_at"],
                claim_object=c["claim_object"],
                status=c["status"],
                claim_status=result.get("claim_status"),
                severity=result.get("severity"),
                risk_flags=result.get("risk_flags"),
            )
        )
    return summaries


@app.get("/api/claims/{claim_id}", response_model=ClaimDetail)
def get_claim(claim_id: str) -> ClaimDetail:
    claim = db.get_claim(claim_id)
    if claim is None:
        raise HTTPException(404, "claim not found")
    result = claim.get("result")
    verdict = None
    if result:
        verdict = Verdict(**{k: result[k] for k in Verdict.model_fields if k in result})
    return ClaimDetail(
        id=claim["id"],
        created_at=claim["created_at"],
        claim_object=claim["claim_object"],
        user_claim=claim["user_claim"],
        image_urls=[f"/uploads/{claim_id}/{name}" for name in claim["image_paths"]],
        status=claim["status"],
        error=claim.get("error"),
        verdict=verdict,
    )


@app.get("/api/claims/{claim_id}/events")
async def stream_events(claim_id: str) -> StreamingResponse:
    """Server-sent events: live pipeline progress for one claim.

    Polls the events table (the background worker writes to it from a thread)
    and pushes each new event as an SSE ``message``. Closes after the terminal
    ``complete`` event or a 5-minute safety timeout.
    """
    if db.get_claim(claim_id) is None:
        raise HTTPException(404, "claim not found")

    async def generator():
        last_id = 0
        for _ in range(1500):  # 1500 * 0.2s = 5 min ceiling
            events = db.get_events_after(claim_id, after_id=last_id)
            for event in events:
                last_id = event["id"]
                payload = StageEvent(**event).model_dump()
                yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"
                if event["stage"] == "complete":
                    return
            await asyncio.sleep(0.2)

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )