from backend.models.brief import MarginGuardBrief
from backend.models.optimization import OptimizationReport
from backend.prompts.optimization_prompt import SYSTEM_INSTRUCTION, build_optimization_prompt
from backend.services.gemini_service import call_text


def run_optimization(brief: MarginGuardBrief) -> OptimizationReport:
    """Run Agent 4. Returns a validated OptimizationReport."""
    prompt = build_optimization_prompt(brief)
    raw = call_text(SYSTEM_INSTRUCTION, prompt)
    return OptimizationReport.model_validate(raw)
