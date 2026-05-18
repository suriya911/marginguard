import json

from backend.data.glownest_fixtures import GLOWNEST_CAMPAIGNS
from backend.models.campaign import CampaignInput
from backend.models.experiment import ExperimentBrief
from backend.models.reallocation import BudgetReallocationPlan
from backend.prompts.experiment_prompt import SYSTEM_INSTRUCTION, build_experiment_prompt
from backend.services.gemini_service import call_text


def run_experiment(
    reallocation_plan: BudgetReallocationPlan,
    campaigns: list[CampaignInput] | None = None,
) -> ExperimentBrief:
    """Run Agent 3. Returns a validated ExperimentBrief."""
    campaigns = campaigns or GLOWNEST_CAMPAIGNS

    prompt = build_experiment_prompt(reallocation_plan, campaigns)
    raw = call_text(SYSTEM_INSTRUCTION, prompt)
    return ExperimentBrief.model_validate(raw)


if __name__ == "__main__":
    from backend.agents.audit_agent import run_audit
    from backend.agents.reallocation_agent import run_reallocation

    print("Running Agent 1 (Audit)...")
    audit = run_audit()

    print("Running Agent 2 (Reallocation)...")
    plan = run_reallocation(audit)

    print("\nRunning Agent 3 (Experiment)...")
    brief = run_experiment(plan)
    print(f"Selected campaign: {brief.product_name} (id: {brief.campaign_id})")
    print(f"Expected: Starter Bundle")
    print(f"\nHypothesis: {brief.hypothesis}")
    print(f"Duration: {brief.recommended_duration_days} days")
    print(f"Est. weekly profit impact: ${brief.estimated_weekly_profit_impact_if_successful:.2f}")
    print(f"\nFull JSON:")
    print(json.dumps(brief.model_dump(), indent=2))
