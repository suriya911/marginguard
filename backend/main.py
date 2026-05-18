import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

load_dotenv()

from backend.agents.orchestrator import run_pipeline, stream_pipeline
from backend.data.glownest_fixtures import GLOWNEST_CAMPAIGNS, DEFAULT_CONSTRAINT
from backend.models.brief import MarginGuardBrief

app = FastAPI(
    title="MarginGuard API",
    description="Profit Truth Layer — 3-agent Gemini pipeline for Google Ads margin analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FALLBACK_PATH = Path(__file__).parent / "data" / "demo_fallback.json"
USE_FALLBACK = os.getenv("USE_FALLBACK", "false").lower() == "true"


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model": "gemini-2.0-flash",
        "agents": ["audit", "reallocation", "experiment"],
        "version": "1.0.0",
        "fallback_mode": USE_FALLBACK,
    }


# ── GlowNest data ─────────────────────────────────────────────────────────────

@app.get("/api/data/glownest")
def glownest_data():
    return [c.model_dump() for c in GLOWNEST_CAMPAIGNS]


# ── Pipeline — non-streaming ──────────────────────────────────────────────────

class PipelineRequest(BaseModel):
    brand_constraint: str = DEFAULT_CONSTRAINT


@app.post("/api/pipeline/run", response_model=MarginGuardBrief)
async def pipeline_run(body: PipelineRequest):
    if USE_FALLBACK and FALLBACK_PATH.exists():
        return JSONResponse(json.loads(FALLBACK_PATH.read_text()))
    brief = await run_pipeline(body.brand_constraint)
    return brief


# ── Pipeline — SSE streaming ──────────────────────────────────────────────────

@app.get("/api/pipeline/stream")
async def pipeline_stream(brand_constraint: str = Query(default=DEFAULT_CONSTRAINT)):
    if USE_FALLBACK and FALLBACK_PATH.exists():
        return _fallback_stream()

    async def generator():
        async for event in stream_pipeline(brand_constraint):
            yield event

    return EventSourceResponse(generator())


def _fallback_stream():
    """Replay demo_fallback.json as SSE events with realistic delays."""
    import asyncio

    data = json.loads(FALLBACK_PATH.read_text())

    async def generator():
        brief = MarginGuardBrief.model_validate(data)
        yield {"event": "pipeline_start", "data": json.dumps({"brand": "GlowNest Beauty", "agents": 3})}

        for agent, delay, extra in [
            ("audit",       2.3, {"anomalies_found": brief.audit.campaigns_unprofitable + brief.audit.campaigns_at_risk}),
            ("reallocation",1.8, {"weekly_profit_delta": brief.reallocation.projected_weekly_profit_delta}),
            ("experiment",  1.2, {"chosen_product": brief.experiment.product_name}),
        ]:
            yield {"event": "agent_start", "data": json.dumps({"agent": agent, "message": "Gemini reasoning..."})}
            await asyncio.sleep(delay)
            yield {"event": "agent_complete", "data": json.dumps({"agent": agent, "duration_seconds": delay, **extra})}

        yield {"event": "pipeline_complete", "data": json.dumps(data)}

    return EventSourceResponse(generator())
