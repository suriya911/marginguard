import asyncio
import json
import time
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor

from backend.agents.audit_agent import run_audit
from backend.agents.reallocation_agent import run_reallocation
from backend.agents.experiment_agent import run_experiment
from backend.agents.optimization_agent import run_optimization
from backend.data.glownest_fixtures import BRAND_NAME, GLOWNEST_CAMPAIGNS, DEFAULT_CONSTRAINT
from backend.models.brief import MarginGuardBrief

_executor = ThreadPoolExecutor(max_workers=1)


async def run_pipeline(brand_constraint: str = DEFAULT_CONSTRAINT) -> MarginGuardBrief:
    """Run the full 4-agent pipeline and return a MarginGuardBrief."""
    loop = asyncio.get_event_loop()
    pipeline_start = time.time()
    timings = {}

    t = time.time()
    audit = await loop.run_in_executor(_executor, run_audit, GLOWNEST_CAMPAIGNS, BRAND_NAME)
    timings["audit"] = round(time.time() - t, 2)

    t = time.time()
    reallocation = await loop.run_in_executor(_executor, run_reallocation, audit, brand_constraint)
    timings["reallocation"] = round(time.time() - t, 2)

    t = time.time()
    experiment = await loop.run_in_executor(_executor, run_experiment, reallocation)
    timings["experiment"] = round(time.time() - t, 2)

    # Build partial brief for optimization context
    partial_brief = MarginGuardBrief(
        audit=audit,
        reallocation=reallocation,
        experiment=experiment,
        optimization=None,          # filled below
        pipeline_duration_seconds=0,
        agent_timings=timings,
    )

    t = time.time()
    optimization = await loop.run_in_executor(_executor, run_optimization, partial_brief)
    timings["optimization"] = round(time.time() - t, 2)

    return MarginGuardBrief(
        audit=audit,
        reallocation=reallocation,
        experiment=experiment,
        optimization=optimization,
        pipeline_duration_seconds=round(time.time() - pipeline_start, 2),
        agent_timings=timings,
    )


async def stream_pipeline(brand_constraint: str = DEFAULT_CONSTRAINT):
    """Async generator that yields SSE-compatible dicts for each pipeline event."""
    loop = asyncio.get_event_loop()
    pipeline_start = time.time()
    timings = {}

    def _event(name: str, data: dict) -> dict:
        return {"event": name, "data": json.dumps(data)}

    yield _event("pipeline_start", {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "brand": BRAND_NAME,
        "agents": 4,
    })

    # ── Agent 1 — Audit ──────────────────────────────────────────────────────
    yield _event("agent_start", {"agent": "audit", "message": "Reading dashboard + margin data..."})
    t = time.time()
    try:
        audit = await loop.run_in_executor(_executor, run_audit, GLOWNEST_CAMPAIGNS, BRAND_NAME)
    except Exception as e:
        yield _event("pipeline_error", {"agent": "audit", "error": str(e)})
        return
    timings["audit"] = round(time.time() - t, 2)
    yield _event("agent_complete", {
        "agent": "audit",
        "duration_seconds": timings["audit"],
        "anomalies_found": len([c for c in audit.campaign_truths if c.anomaly_flags]),
    })

    # ── Agent 2 — Reallocation ───────────────────────────────────────────────
    yield _event("agent_start", {"agent": "reallocation", "message": "Building budget reallocation plan..."})
    t = time.time()
    try:
        reallocation = await loop.run_in_executor(_executor, run_reallocation, audit, brand_constraint)
    except Exception as e:
        yield _event("pipeline_error", {"agent": "reallocation", "error": str(e)})
        return
    timings["reallocation"] = round(time.time() - t, 2)
    yield _event("agent_complete", {
        "agent": "reallocation",
        "duration_seconds": timings["reallocation"],
        "weekly_profit_delta": reallocation.projected_weekly_profit_delta,
    })

    # ── Agent 3 — Experiment ─────────────────────────────────────────────────
    yield _event("agent_start", {"agent": "experiment", "message": "Designing A/B experiment brief..."})
    t = time.time()
    try:
        experiment = await loop.run_in_executor(_executor, run_experiment, reallocation)
    except Exception as e:
        yield _event("pipeline_error", {"agent": "experiment", "error": str(e)})
        return
    timings["experiment"] = round(time.time() - t, 2)
    yield _event("agent_complete", {
        "agent": "experiment",
        "duration_seconds": timings["experiment"],
        "chosen_product": experiment.product_name,
    })

    # ── Agent 4 — Optimization ───────────────────────────────────────────────
    partial_brief = MarginGuardBrief(
        audit=audit, reallocation=reallocation, experiment=experiment,
        optimization=None, pipeline_duration_seconds=0, agent_timings=timings,
    )
    yield _event("agent_start", {"agent": "optimization", "message": "Generating ad optimization suggestions..."})
    t = time.time()
    try:
        optimization = await loop.run_in_executor(_executor, run_optimization, partial_brief)
    except Exception as e:
        yield _event("pipeline_error", {"agent": "optimization", "error": str(e)})
        return
    timings["optimization"] = round(time.time() - t, 2)
    yield _event("agent_complete", {
        "agent": "optimization",
        "duration_seconds": timings["optimization"],
        "suggestions_count": optimization.total_suggestions,
        "high_priority": optimization.high_priority_count,
    })

    # ── Complete ─────────────────────────────────────────────────────────────
    brief = MarginGuardBrief(
        audit=audit,
        reallocation=reallocation,
        experiment=experiment,
        optimization=optimization,
        pipeline_duration_seconds=round(time.time() - pipeline_start, 2),
        agent_timings=timings,
    )
    yield _event("pipeline_complete", json.loads(brief.model_dump_json()))
