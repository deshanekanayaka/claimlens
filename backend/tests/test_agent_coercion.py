from __future__ import annotations

import pipeline.agent as agent
import pipeline.extractor as extractor


def test_allowed_parts_building_for_known_object():
    parts = agent._allowed_parts("car")
    # Ensure expected known parts are present
    assert "door" in parts
    assert "unknown" in parts


def test_coerce_allowed_part_passes_through_for_legal_car_part():
    parts = agent._allowed_parts("car")
    assert agent._coerce_allowed("door", parts) == "door"


def test_coerce_disallowed_part_for_package_claim_goes_to_unknown():
    parts = agent._allowed_parts("package")
    # 'body' is not a legal package part (legal: box, package_corner, package_side, seal, label, contents, item, unknown)
    assert agent._coerce_allowed("body", parts) == "unknown"


def test_coerce_issue_type_legal_and_illegal():
    # Legal issue type passes through
    assert agent._coerce_allowed("dent", agent.ALLOWED_ISSUE_TYPES) == "dent"
    # Illegal issue type coerces to unknown
    assert agent._coerce_allowed("shattered", agent.ALLOWED_ISSUE_TYPES) == "unknown"


def test_allowed_parts_for_unrecognised_object_is_unknown_only():
    assert agent._allowed_parts("boat") == {"unknown"}
