from typing import Optional
from pydantic import BaseModel
from .audit import ProfitAuditReport
from .reallocation import BudgetReallocationPlan
from .experiment import ExperimentBrief
from .optimization import OptimizationReport


class MarginGuardBrief(BaseModel):
    audit: ProfitAuditReport
    reallocation: BudgetReallocationPlan
    experiment: ExperimentBrief
    optimization: Optional[OptimizationReport] = None
    pipeline_duration_seconds: float
    agent_timings: dict[str, float]
