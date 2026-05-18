from enum import Enum
from pydantic import BaseModel, Field


class SuggestionCategory(str, Enum):
    creative     = "creative"
    targeting    = "targeting"
    bidding      = "bidding"
    landing_page = "landing_page"
    audience     = "audience"
    inventory    = "inventory"
    budget       = "budget"


class SuggestionPriority(str, Enum):
    high   = "high"
    medium = "medium"
    low    = "low"


class AdOptimizationSuggestion(BaseModel):
    suggestion_id:                    str
    campaign_id:                      str | None   # None = account-level
    campaign_name:                    str | None
    category:                         SuggestionCategory
    priority:                         SuggestionPriority
    title:                            str
    description:                      str
    expected_impact:                  str          # e.g. "Reduce return rate 10-15%"
    estimated_weekly_profit_impact:   float        # dollar estimate
    action_steps:                     list[str]    # 2-4 concrete steps
    effort:                           str          # "Low (30 min)" / "Medium (2-3 hrs)" / "High (1-2 days)"


class OptimizationReport(BaseModel):
    total_suggestions:                      int
    high_priority_count:                    int
    estimated_total_weekly_profit_impact:   float
    suggestions:                            list[AdOptimizationSuggestion]
    executive_summary:                      str
