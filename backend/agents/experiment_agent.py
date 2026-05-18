from backend.models.reallocation import BudgetReallocationPlan
from backend.models.experiment import ExperimentBrief
from backend.prompts.experiment_prompt import SYSTEM_INSTRUCTION, build_experiment_prompt
from backend.services.gemini_service import call_text


def run_experiment(plan: BudgetReallocationPlan) -> ExperimentBrief:
    """Run Agent 3. Returns a validated ExperimentBrief."""
    prompt = build_experiment_prompt(plan)
    raw = call_text(SYSTEM_INSTRUCTION, prompt)
    return ExperimentBrief.model_validate(raw)
