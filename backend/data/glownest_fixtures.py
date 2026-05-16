from backend.models.campaign import CampaignInput, InventoryStatus

GLOWNEST_CAMPAIGNS: list[CampaignInput] = [
    CampaignInput(
        campaign_id="camp_vc_serum",
        product_name="Vitamin C Serum",
        daily_spend=180.0,
        reported_roas=4.8,
        reported_conversions=21,
        avg_order_value=42.0,
        gross_margin_pct=0.72,
        return_rate_pct=0.06,
        fulfillment_cost_per_unit=3.20,
        inventory_days_remaining=94,
        inventory_status=InventoryStatus.HEALTHY,
    ),
    CampaignInput(
        campaign_id="camp_cleanser",
        product_name="Hydrating Cleanser",
        daily_spend=420.0,
        reported_roas=5.1,
        reported_conversions=76,
        avg_order_value=28.0,
        gross_margin_pct=0.38,
        return_rate_pct=0.22,
        fulfillment_cost_per_unit=2.80,
        inventory_days_remaining=110,
        inventory_status=InventoryStatus.HEALTHY,
    ),
    CampaignInput(
        campaign_id="camp_retinol",
        product_name="Retinol Night Cream",
        daily_spend=290.0,
        reported_roas=4.2,
        reported_conversions=19,
        avg_order_value=58.0,
        gross_margin_pct=0.64,
        return_rate_pct=0.09,
        fulfillment_cost_per_unit=4.10,
        inventory_days_remaining=12,
        inventory_status=InventoryStatus.CRITICAL,
    ),
    CampaignInput(
        campaign_id="camp_spf",
        product_name="SPF Moisturizer",
        daily_spend=160.0,
        reported_roas=3.9,
        reported_conversions=22,
        avg_order_value=36.0,
        gross_margin_pct=0.55,
        return_rate_pct=0.08,
        fulfillment_cost_per_unit=3.50,
        inventory_days_remaining=67,
        inventory_status=InventoryStatus.MODERATE,
    ),
    CampaignInput(
        campaign_id="camp_bundle",
        product_name="Starter Bundle",
        daily_spend=95.0,
        reported_roas=4.1,
        reported_conversions=9,
        avg_order_value=89.0,
        gross_margin_pct=0.68,
        return_rate_pct=0.04,
        fulfillment_cost_per_unit=5.20,
        inventory_days_remaining=88,
        inventory_status=InventoryStatus.HEALTHY,
    ),
]

BRAND_NAME = "GlowNest Beauty"
TOTAL_DAILY_BUDGET = sum(c.daily_spend for c in GLOWNEST_CAMPAIGNS)  # 1145.0

DEFAULT_CONSTRAINT = (
    "Do not scale Retinol Night Cream — we have a stockout in approximately 12 days. "
    "Also avoid any increases to Hydrating Cleanser until we investigate the return rate."
)
