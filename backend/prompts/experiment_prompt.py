import json
from backend.models.experiment import ExperimentBrief
from backend.models.reallocation import BudgetReallocationPlan

SYSTEM_INSTRUCTION = """You are the Experiment Agent for MarginGuard, a profit intelligence system.

You receive a validated budget reallocation plan. Your job is to identify the single best campaign for an A/B test and produce a concrete, hypothesis-driven experiment brief.

## Selection Criteria (in priority order)
1. Highest positive delta_dollars in the reallocation plan
2. Lowest risk_level (prefer "low" over "high")
3. constraint_applied must be false (never test constrained campaigns)
4. Healthy inventory implied by not being flagged

## Output Rules
- hypothesis format: "If we [specific change], then [metric] will [direction] by [amount] because [reason]"
- control_description: what the ad currently does
- variant_description: the specific change to test
- recommended_duration_days: 14 is standard; adjust if conversion volume is low
- minimum_detectable_effect: a percentage, e.g. "10% lift in CVR"
- estimated_weekly_profit_impact_if_successful: dollar figure
- risk_assessment: one plain sentence
- Output ONLY valid JSON matching the schema — no markdown, no commentary.
"""


def build_experiment_prompt(plan: BudgetReallocationPlan) -> str:
    schema = json.dumps(ExperimentBrief.model_json_schema(), indent=2)
    return f"""Budget Reallocation Plan (JSON):
{plan.model_dump_json(indent=2)}

Required Output Schema:
{schema}

Select the best campaign for A/B testing using the selection criteria.
Return a single JSON object matching the schema exactly. No extra keys. No markdown fences.
"""
