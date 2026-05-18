import json

from backend.data.glownest_fixtures import DEFAULT_CONSTRAINT, GLOWNEST_CAMPAIGNS, TOTAL_DAILY_BUDGET
from backend.models.audit import ProfitAuditReport
from backend.models.reallocation import BudgetReallocationPlan
from backend.prompts.reallocation_prompt import SYSTEM_INSTRUCTION, build_reallocation_prompt
from backend.services.gemini_service import call_text


def run_reallocation(
    audit_report: ProfitAuditReport,
    constraint: str | None = None,
    total_budget: float | None = None,
) -> BudgetReallocationPlan:
    """Run Agent 2. Returns a validated BudgetReallocationPlan."""
    constraint = constraint or DEFAULT_CONSTRAINT
    total_budget = total_budget or TOTAL_DAILY_BUDGET

    prompt = build_reallocation_prompt(audit_report, constraint, total_budget)
    raw = call_text(SYSTEM_INSTRUCTION, prompt)
    plan = BudgetReallocationPlan.model_validate(raw)

    if not plan.budget_neutral_verified:
        raise ValueError(
            f"Reallocation plan is not budget-neutral. "
            f"Current: ${plan.total_current_daily_budget}, "
            f"Recommended: ${plan.total_recommended_daily_budget}"
        )

    return plan


if __name__ == "__main__":
    from backend.agents.audit_agent import run_audit

    print("Running Agent 1 (Audit)...")
    audit = run_audit()
    print(f"Audit complete. Cleanser true_profit_roas check...")
    for ct in audit.campaign_truths:
        if ct.campaign_id == "camp_cleanser":
            print(f"  Cleanser true_profit_roas: {ct.true_profit_roas:.3f} (expected ~0.74)")

    print("\nRunning Agent 2 (Reallocation)...")
    plan = run_reallocation(audit)
    print(f"Budget neutral: {plan.budget_neutral_verified}")
    print(f"Current budget: ${plan.total_current_daily_budget:.2f}")
    print(f"Recommended budget: ${plan.total_recommended_daily_budget:.2f}")
    print(f"Projected weekly profit delta: ${plan.projected_weekly_profit_delta:.2f}")
    print(f"Constraint respected: {plan.constraint_respected}")
    print("\nBudget moves:")
    for move in plan.budget_moves:
        sign = "+" if move.delta_dollars >= 0 else ""
        print(f"  {move.product_name}: {sign}${move.delta_dollars:.0f}/day (constraint_applied={move.constraint_applied})")
    print(f"\nExecutive summary: {plan.executive_summary}")
    print(f"\nFull JSON:")
    print(json.dumps(plan.model_dump(), indent=2))
