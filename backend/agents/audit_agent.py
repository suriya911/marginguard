from pathlib import Path

from backend.data.glownest_fixtures import BRAND_NAME, GLOWNEST_CAMPAIGNS
from backend.models.audit import ProfitAuditReport
from backend.models.campaign import CampaignInput
from backend.prompts.audit_prompt import SYSTEM_INSTRUCTION, build_audit_prompt
from backend.services.gemini_service import call_multimodal

SCREENSHOT_PATH = Path(__file__).parent.parent / "data" / "screenshots" / "glownest_ads_dashboard.png"


def run_audit(
    campaigns: list[CampaignInput] | None = None,
    brand_name: str | None = None,
) -> ProfitAuditReport:
    """Run Agent 1. Returns a validated ProfitAuditReport."""
    campaigns = campaigns or GLOWNEST_CAMPAIGNS
    brand_name = brand_name or BRAND_NAME

    if not SCREENSHOT_PATH.exists():
        raise FileNotFoundError(
            f"Dashboard screenshot not found at {SCREENSHOT_PATH}.\n"
            "Run: python scripts/capture_screenshot.py"
        )

    prompt = build_audit_prompt(campaigns, brand_name)
    raw = call_multimodal(SYSTEM_INSTRUCTION, SCREENSHOT_PATH, prompt)
    return ProfitAuditReport.model_validate(raw)


if __name__ == "__main__":
    import json
    report = run_audit()
    print(json.dumps(report.model_dump(), indent=2))
