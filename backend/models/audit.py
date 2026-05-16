from enum import Enum
from pydantic import BaseModel, Field


class AnomalySeverity(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CampaignTruth(BaseModel):
    campaign_id: str
    product_name: str
    reported_roas: float
    true_contribution_margin_daily: float
    true_profit_roas: float
    is_profitable: bool
    anomaly_flags: list[str]
    anomaly_severity: AnomalySeverity
    recommended_action: str


class ProfitAuditReport(BaseModel):
    brand_name: str
    audit_timestamp: str
    total_reported_roas: float
    total_true_profit_roas: float
    total_daily_true_profit: float
    campaigns_audited: int
    campaigns_unprofitable: int
    campaigns_at_risk: int
    campaign_truths: list[CampaignTruth]
    top_anomaly_summary: str
    data_confidence_score: float = Field(..., ge=0.0, le=1.0)
