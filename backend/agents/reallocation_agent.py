from backend.models.audit import ProfitAuditReport
from backend.models.reallocation import BudgetReallocationPlan
from backend.prompts.reallocation_prompt import SYSTEM_INSTRUCTION, build_reallocation_prompt
from backend.services.gemini_service import call_text


def run_reallocation(audit: ProfitAuditReport, constraint: str) -> BudgetReallocationPlan:
    """Run Agent 2. Returns a validated BudgetReallocationPlan."""
    prompt = build_reallocation_prompt(audit, constraint)
    raw = call_text(SYSTEM_INSTRUCTION, prompt)
    plan = BudgetReallocationPlan.model_validate(raw)
    if not plan.budget_neutral_verified:
        raise ValueError("Gemini returned a non-budget-neutral plan.")
    return plan
