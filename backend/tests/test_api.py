"""End-to-end API test with LLM calls stubbed (no API key needed).

Covers the full web path: multipart submission, background pipeline execution,
SSE stage streaming, verdict retrieval, and the reviewer queue.

Run from backend/:  pytest tests/ -v
"""

from __future__ import annotations

import io
import json

import pytest
from fastapi.testclient import TestClient

import pipeline.agent as agent
import pipeline.extractor as extractor
import pipeline.image_analyzer as image_analyzer

# 1x1 transparent PNG
_PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d4944415478da63fcffff3f0005fe02fea72d1e5c00"
    "00000049454e44ae426082"
)


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(
        extractor,
        "extract_claim",
        lambda claim, obj: {
            "claimed_parts": [{"part": "door", "issue": "dent"}],
            "primary_part": "door",
            "primary_issue": "dent",
            "claim_summary": "dent on driver door",
        },
    )
    monkeypatch.setattr(
        image_analyzer,
        "analyze_images",
        lambda *a, **k: {
            "per_image_analysis": [{"image_id": "img_1", "quality_flags": []}],
            "overall_part_visible": "door",
            "overall_issue_visible": "dent",
            "image_quality_flags": [],
            "valid_image": True,
            "evidence_standard_met": True,
            "evidence_standard_met_reason": "door clearly visible",
            "candidate_supporting_image_ids": ["img_1"],
        },
    )
    monkeypatch.setattr(
        agent,
        "_finalize_verdict",
        lambda ctx, cands, uid: {
            "claim_status": "supported",
            "severity": "medium",
            "supporting_image_ids": "img_1",
            "claim_status_justification": "Dent visible on door in img_1.",
        },
    )
    from app.main import app

    with TestClient(app) as tc:
        yield tc


def _submit(client) -> str:
    resp = client.post(
        "/api/claims",
        data={"claim_object": "car", "user_claim": "There is a dent on my driver-side door."},
        files=[("images", ("photo.png", io.BytesIO(_PNG), "image/png"))],
    )
    assert resp.status_code == 202, resp.text
    return resp.json()["id"]


def test_full_claim_lifecycle(client):
    claim_id = _submit(client)

    stages = []
    with client.stream("GET", f"/api/claims/{claim_id}/events") as stream:
        for line in stream.iter_lines():
            if line.startswith("data: "):
                event = json.loads(line[6:])
                stages.append((event["stage"], event["detail"].get("status")))
                if event["stage"] == "complete":
                    break

    assert ("extract", "done") in stages
    assert ("analyze_images", "done") in stages
    assert ("verdict", "done") in stages

    detail = client.get(f"/api/claims/{claim_id}").json()
    assert detail["status"] == "done"
    assert detail["verdict"]["claim_status"] == "supported"
    assert detail["image_urls"] == [f"/uploads/{claim_id}/img_1.png"]

    queue = client.get("/api/claims").json()
    assert queue[0]["id"] == claim_id


def test_validation_rejects_bad_object(client):
    resp = client.post(
        "/api/claims",
        data={"claim_object": "boat", "user_claim": "hull scratch"},
        files=[("images", ("p.png", io.BytesIO(_PNG), "image/png"))],
    )
    assert resp.status_code == 422
