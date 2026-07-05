"""API response schemas.

Claim submission arrives as multipart form data (images + fields), so there is
no request body model for it; these models shape everything the API returns.
"""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel

ClaimObject = Literal["car", "laptop", "package"]
ClaimRunStatus = Literal["pending", "running", "done", "failed"]


class Verdict(BaseModel):
    """The pipeline's structured verdict, mirroring the batch output schema."""

    evidence_standard_met: str
    evidence_standard_met_reason: str
    risk_flags: str
    issue_type: str
    object_part: str
    claim_status: str
    claim_status_justification: str
    supporting_image_ids: str
    valid_image: str
    severity: str


class ClaimSummary(BaseModel):
    id: str
    created_at: float
    claim_object: ClaimObject
    status: ClaimRunStatus
    claim_status: str | None = None
    severity: str | None = None
    risk_flags: str | None = None


class ClaimDetail(BaseModel):
    id: str
    created_at: float
    claim_object: ClaimObject
    user_claim: str
    image_urls: list[str]
    status: ClaimRunStatus
    error: str | None = None
    verdict: Verdict | None = None


class StageEvent(BaseModel):
    id: int
    created_at: float
    stage: str
    detail: dict[str, Any]


class ClaimCreated(BaseModel):
    id: str
    status: ClaimRunStatus
    events_url: str
