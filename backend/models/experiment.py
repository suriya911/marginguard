from pydantic import BaseModel


class ExperimentBrief(BaseModel):
    campaign_id: str
    product_name: str
    opportunity_rationale: str
    hypothesis: str
    control_description: str
    variant_description: str
    primary_success_metric: str
    secondary_success_metric: str
    recommended_duration_days: int
    minimum_detectable_effect: str
    estimated_weekly_profit_impact_if_successful: float
    risk_assessment: str
