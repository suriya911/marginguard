"""Run the full pipeline once and save output as demo_fallback.json."""
import asyncio
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

from backend.agents.orchestrator import run_pipeline


async def main():
    print("Starting MarginGuard pipeline...")
    brief = await run_pipeline()

    out_path = Path(__file__).parent.parent / "backend" / "data" / "demo_fallback.json"
    out_path.write_text(json.dumps(brief.model_dump(), indent=2))

    print(f"Saved to {out_path}")
    print(f"Budget neutral: {brief.reallocation.budget_neutral_verified}")
    print(f"Current budget: ${brief.reallocation.total_current_daily_budget:.2f}")
    print(f"Recommended budget: ${brief.reallocation.total_recommended_daily_budget:.2f}")
    print(f"Projected weekly profit delta: ${brief.reallocation.projected_weekly_profit_delta:.2f}")
    print(f"Experiment campaign: {brief.experiment.product_name}")
    print(f"Pipeline duration: {brief.pipeline_duration_seconds:.1f}s")
    print()
    print("Campaign truths:")
    for ct in brief.audit.campaign_truths:
        flag = " *** UNPROFITABLE" if not ct.is_profitable else ""
        print(f"  {ct.product_name}: true_profit_roas={ct.true_profit_roas:.3f}{flag}")
    print()
    print("Budget moves:")
    for move in brief.reallocation.budget_moves:
        sign = "+" if move.delta_dollars >= 0 else ""
        print(f"  {move.product_name}: {sign}${move.delta_dollars:.0f}/day")


if __name__ == "__main__":
    asyncio.run(main())
