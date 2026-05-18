// Hardcoded truth values for Beat 2 — NEVER calls the API.
// Calculated from glownest_fixtures.py using the True Profit ROAS formula:
// ((conversions * aov * (1 - return_rate) * gross_margin) - (fulfillment_cost * conversions)) / daily_spend

export const GLOWNEST_CAMPAIGNS_ROAS = [
  { campaign_id: 'camp_vc_serum',  product_name: 'Vitamin C Serum',    daily_spend: 180, reported_roas: 4.8,  inventory_days: 94  },
  { campaign_id: 'camp_cleanser',  product_name: 'Hydrating Cleanser', daily_spend: 420, reported_roas: 5.1,  inventory_days: 110 },
  { campaign_id: 'camp_retinol',   product_name: 'Retinol Night Cream',daily_spend: 290, reported_roas: 4.2,  inventory_days: 12  },
  { campaign_id: 'camp_spf',       product_name: 'SPF Moisturizer',    daily_spend: 160, reported_roas: 3.9,  inventory_days: 67  },
  { campaign_id: 'camp_bundle',    product_name: 'Starter Bundle',     daily_spend: 95,  reported_roas: 4.1,  inventory_days: 88  },
]

export const GLOWNEST_CAMPAIGNS_TRUTH = [
  {
    campaign_id: 'camp_vc_serum',
    product_name: 'Vitamin C Serum',
    daily_spend: 180,
    reported_roas: 4.8,
    true_profit_roas: 2.94,
    is_profitable: true,
    anomaly_flags: ['UNDERFUNDED_HIGH_PROFIT'],
    anomaly_severity: 'low',
    inventory_days: 94,
  },
  {
    campaign_id: 'camp_cleanser',
    product_name: 'Hydrating Cleanser',
    daily_spend: 420,
    reported_roas: 5.1,
    true_profit_roas: 0.99,
    is_profitable: false,
    anomaly_flags: ['UNPROFITABLE_TRUE_ROAS_0.99', 'OVERFUNDED_LOW_PROFIT'],
    anomaly_severity: 'critical',
    inventory_days: 110,
  },
  {
    campaign_id: 'camp_retinol',
    product_name: 'Retinol Night Cream',
    daily_spend: 290,
    reported_roas: 4.2,
    true_profit_roas: 1.94,
    is_profitable: true,
    anomaly_flags: ['STOCKOUT_RISK_12_DAYS'],
    anomaly_severity: 'critical',
    inventory_days: 12,
  },
  {
    campaign_id: 'camp_spf',
    product_name: 'SPF Moisturizer',
    daily_spend: 160,
    reported_roas: 3.9,
    true_profit_roas: 2.03,
    is_profitable: true,
    anomaly_flags: [],
    anomaly_severity: 'none',
    inventory_days: 67,
  },
  {
    campaign_id: 'camp_bundle',
    product_name: 'Starter Bundle',
    daily_spend: 95,
    reported_roas: 4.1,
    true_profit_roas: 5.01,
    is_profitable: true,
    anomaly_flags: ['UNDERFUNDED_HIGH_PROFIT'],
    anomaly_severity: 'low',
    inventory_days: 88,
  },
]

export const GLOWNEST_METRICS = {
  reported_roas: 4.62,
  true_profit_roas: 2.02,
  total_daily_spend: 1145,
  campaigns_unprofitable: 1,
  campaigns_at_risk: 1,
}

export const DEFAULT_CONSTRAINT =
  'Do not scale Retinol Night Cream — we have a stockout in approximately 12 days. ' +
  'Also avoid any increases to Hydrating Cleanser until we investigate the return rate.'
