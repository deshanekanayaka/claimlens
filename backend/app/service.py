"""Service layer between the API and the pipeline.

Owns three responsibilities:

1. Persisting uploaded images under ``data/uploads/{claim_id}/`` with safe,
   sequential filenames (``img_1.jpg`` ...), matching the image-ID convention
   the pipeline already uses (filename stem = image ID).
2. Running :func:`pipeline.process_claim` for a single web-submitted claim,
   recording every stage event to the DB so the SSE endpoint can stream it.
3. Loading the evidence requirements once at startup (they are static data).

Web-submitted claims have no user history, so the history dict is empty and
history-based risk flags simply never fire. The batch CSV path in the original
repo is unchanged.
"""

from __future__ import annotations

import traceback
from pathlib import Path
from typing import Any, BinaryIO

from pipeline import process_claim
from pipeline.utils import load_requirements

from . import db
from .config import EVIDENCE_REQUIREMENTS_CSV, UPLOADS_DIR

_requirements: dict[str, list[dict[str, str]]] | None = None


def get_requirements() -> dict[str, list[dict[str, str]]]:
    """Evidence requirements, loaded lazily once (static CSV, never mutated)."""
    global _requirements
    if _requirements is None:
        _requirements = load_requirements(EVIDENCE_REQUIREMENTS_CSV)
    return _requirements


def save_uploads(claim_id: str, files: list[tuple[str, BinaryIO]]) -> list[Path]:
    """Persist uploaded images for a claim; returns absolute saved paths.

    Filenames are regenerated (``img_1``, ``img_2`` ...) rather than trusting
    client-supplied names, which both avoids path traversal and keeps image IDs
    consistent with the pipeline's ``filename-stem = image_id`` convention. The
    original extension is kept only as a hint; the pipeline sniffs the real
    format from magic bytes anyway.
    """
    claim_dir = UPLOADS_DIR / claim_id
    claim_dir.mkdir(parents=True, exist_ok=True)
    saved: list[Path] = []
    for i, (original_name, stream) in enumerate(files, start=1):
        ext = Path(original_name or "").suffix.lower() or ".jpg"
        dest = claim_dir / f"img_{i}{ext}"
        with dest.open("wb") as out:
            while chunk := stream.read(1024 * 1024):
                out.write(chunk)
        saved.append(dest)
    return saved


def run_claim(claim_id: str, claim_object: str, user_claim: str, image_paths: list[str]) -> None:
    """Execute the pipeline for one claim. Runs in FastAPI's threadpool.

    All stage events and the terminal state (done/failed) are written to the
    DB; the SSE endpoint reads them independently. Exceptions are captured as a
    ``failed`` status instead of propagating into a background thread void.
    """
    def on_stage(stage: str, detail: dict[str, Any]) -> None:
        db.add_event(claim_id, stage, detail)

    db.set_status(claim_id, "running")
    db.add_event(claim_id, "queue", {"status": "started"})
    try:
        row = {
            "user_id": claim_id,  # web claims are keyed by claim id, no history row
            "user_claim": user_claim,
            "claim_object": claim_object,
            "image_paths": ";".join(Path(p).name for p in image_paths),
            "resolved_image_paths": image_paths,
        }
        result = process_claim(row, history={}, requirements=get_requirements(), on_stage=on_stage)
        db.set_result(claim_id, result)
        db.add_event(claim_id, "complete", {"status": "done"})
    except Exception as exc:  # noqa: BLE001 - terminal state must be recorded
        db.set_status(claim_id, "failed", error=str(exc))
        db.add_event(claim_id, "complete", {"status": "failed", "error": str(exc)})
        traceback.print_exc()
