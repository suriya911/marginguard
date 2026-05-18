import asyncio
import json
import time
from collections.abc import AsyncIterator
from typing import Callable

from backend.agents.audit_agent import run_audit
from backend.agents.experiment_agent import run_experiment
from backend.agents.reallocation_agent import run_reallocation
from backend.data.glownest_fixtures import (
    BRAND_NAME,
    DEFAULT_CONSTRAINT,
    GLOWNEST_CAMPAIGNS,
    TOTAL_DAILY_BUDGET,
)
from backend.models.brief import MarginGuardBrief


def _sse(event: str, data: dict) -> str:
    return f"event:{event}\ndata:{json.dumps(data)}\n\n"


async def run_pipeline(
    constraint: str | None = None,
    emit: Callable[[str], None] | None = None,
) -> MarginGuardBrief:
    """
    Chain all three agents. emit() is called with each raw SSE string.
    Returns a validated MarginGuardBrief.
    """
    constraint = constraint or DEFAULT_CONSTRAINT
    emit = emit or (lambda _: None)

    pipeline_start = time.time()

    emit(_sse("pipeline_start", {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "brand": BRAND_NAME,
        "agents": 3,
    }))

    # --- Agent 1: Audit ---
    emit(_sse("agent_start", {"agent": "audit", "message": "Reading dashboard + margin data..."}))
    t0 = time.time()
    emit(_sse("agent_chunk", {"agent": "audit", "chunk": "Applying True Profit ROAS formula to all campaigns..."}))

    audit_report = await asyncio.to_thread(run_audit)

    audit_duration = round(time.time() - t0, 2)
    emit(_sse("agent_complete", {
        "agent": "audit",
        "duration_seconds": audit_duration,
        "anomalies_found": audit_report.campaigns_unprofitable + audit_report.campaigns_at_risk,
    }))

    # --- Agent 2: Reallocation ---
    emit(_sse("agent_start", {"agent": "reallocation", "message": "Building budget plan..."}))
    t0 = time.time()
    emit(_sse("agent_chunk", {"agent": "reallocation", "chunk": "Applying budget allocation rules and constraint..."}))

    reallocation_plan = await asyncio.to_thread(run_reallocation, audit_report, constraint, TOTAL_DAILY_BUDGET)

    reallocation_duration = round(time.time() - t0, 2)
    emit(_sse("agent_complete", {
        "agent": "reallocation",
        "duration_seconds": reallocation_duration,
        "weekly_profit_delta": round(reallocation_plan.projected_weekly_profit_delta, 2),
    }))

    # --- Agent 3: Experiment ---
    emit(_sse("agent_start", {"agent": "experiment", "message": "Designing experiment..."}))
    t0 = time.time()
    emit(_sse("agent_chunk", {"agent": "experiment", "chunk": "Selecting best candidate from reallocation plan..."}))

    experiment_brief = await asyncio.to_thread(run_experiment, reallocation_plan, GLOWNEST_CAMPAIGNS)

    experiment_duration = round(time.time() - t0, 2)
    emit(_sse("agent_complete", {
        "agent": "experiment",
        "duration_seconds": experiment_duration,
        "chosen_product": experiment_brief.product_name,
    }))

    pipeline_duration = round(time.time() - pipeline_start, 2)

    brief = MarginGuardBrief(
        audit=audit_report,
        reallocation=reallocation_plan,
        experiment=experiment_brief,
        pipeline_duration_seconds=pipeline_duration,
        agent_timings={
            "audit": audit_duration,
            "reallocation": reallocation_duration,
            "experiment": experiment_duration,
        },
    )

    emit(_sse("pipeline_complete", brief.model_dump()))

    return brief


async def stream_pipeline(constraint: str | None = None) -> AsyncIterator[str]:
    """Async generator that yields SSE strings as they are emitted."""
    queue: asyncio.Queue[str | None] = asyncio.Queue()

    def emit(msg: str) -> None:
        queue.put_nowait(msg)

    async def _run() -> None:
        try:
            await run_pipeline(constraint=constraint, emit=emit)
        except Exception as exc:
            queue.put_nowait(_sse("pipeline_error", {"error": str(exc)}))
        finally:
            queue.put_nowait(None)

    task = asyncio.create_task(_run())

    while True:
        item = await queue.get()
        if item is None:
            break
        yield item

    await task
