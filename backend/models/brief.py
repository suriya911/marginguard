from pydantic import BaseModel
from .audit import ProfitAuditReport
from .reallocation import BudgetReallocationPlan
from .experiment import ExperimentBrief


class MarginGuardBrief(BaseModel):
    audit: ProfitAuditReport
    reallocation: BudgetReallocationPlan
    experiment: ExperimentBrief
    pipeline_duration_seconds: float
    agent_timings: dict[str, float]
