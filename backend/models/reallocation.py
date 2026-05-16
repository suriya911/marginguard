from enum import Enum
from pydantic import BaseModel, Field


class BudgetRiskLevel(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"


class BudgetMove(BaseModel):
    campaign_id: str
    product_name: str
    current_daily_spend: float
    recommended_daily_spend: float
    delta_dollars: float
    delta_pct: float
    rationale: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_level: BudgetRiskLevel
    constraint_applied: bool


class BudgetReallocationPlan(BaseModel):
    total_current_daily_budget: float
    total_recommended_daily_budget: float
    budget_neutral_verified: bool
    projected_weekly_profit_delta: float
    constraint_respected: bool
    constraint_summary: str
    budget_moves: list[BudgetMove]
    executive_summary: str
    plan_confidence: float = Field(..., ge=0.0, le=1.0)
