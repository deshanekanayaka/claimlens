"""Claim-verification pipeline.

Three-call LLM pipeline (extract -> analyze images -> verdict) wrapped in
deterministic gates. Originally built for the HackerRank Orchestrate hackathon,
refactored here into an importable package consumed by the FastAPI backend.
"""

from .agent import process_claim
from .utils import load_requirements, load_user_history

__all__ = ["process_claim", "load_requirements", "load_user_history"]
