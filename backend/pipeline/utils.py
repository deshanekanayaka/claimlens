"""CSV loader for the evidence requirements (static data, read once at startup).

No side effects at import time: no file reads, no load_dotenv, no global state.
"""

from __future__ import annotations

import csv
from pathlib import Path

_ALL_OBJECTS = "all"


def load_requirements(path: Path) -> dict[str, list[dict[str, str]]]:
    """Load ``evidence_requirements.csv`` keyed by ``claim_object``.

    Rows scoped to ``all`` are folded into every object's requirement list so
    that the evidence gate sees both the general and object-specific rules.
    """
    by_object: dict[str, list[dict[str, str]]] = {}
    general: list[dict[str, str]] = []
    with path.open(newline="", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            obj = row["claim_object"]
            if obj == _ALL_OBJECTS:
                general.append(row)
            else:
                by_object.setdefault(obj, []).append(row)
    for obj in by_object:
        by_object[obj] = general + by_object[obj]
    by_object[_ALL_OBJECTS] = general
    return by_object
