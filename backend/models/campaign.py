from enum import Enum
from pydantic import BaseModel, Field


class InventoryStatus(str, Enum):
    HEALTHY = "HEALTHY"
    MODERATE = "MODERATE"
    CRITICAL = "CRITICAL"


class RiskLevel(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CampaignInput(BaseModel):
    campaign_id: str
    product_name: str
    daily_spend: float
    reported_roas: float
    reported_conversions: int
    avg_order_value: float
    gross_margin_pct: float = Field(..., ge=0.0, le=1.0)
    return_rate_pct: float = Field(..., ge=0.0, le=1.0)
    fulfillment_cost_per_unit: float
    inventory_days_remaining: int
    inventory_status: InventoryStatus
