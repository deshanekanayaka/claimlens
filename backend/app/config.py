"""Application configuration.

All filesystem paths resolve from this file, not the working directory, so the
app behaves identically whether launched via uvicorn, a process manager, or
tests. Environment is loaded once here, before any module constructs an
Anthropic client.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "claimlens.db"
EVIDENCE_REQUIREMENTS_CSV = DATA_DIR / "evidence_requirements.csv"

# Web uploads: formats the pipeline's magic-byte sniffer already handles.
ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
MAX_IMAGES_PER_CLAIM = 6
MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8 MB per image

CLAIM_OBJECTS = ("car", "laptop", "package")

# CORS origins for the frontend dev server and deployed UI.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
