import asyncio
import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from backend.agents.orchestrator import run_pipeline, stream_pipeline  # noqa: E402
from backend.data.glownest_fixtures import (  # noqa: E402
    DEFAULT_CONSTRAINT,
    GLOWNEST_CAMPAIGNS,
)
from fastapi import FastAPI, Query  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import JSONResponse, StreamingResponse  # noqa: E402
from pydantic import BaseModel  # noqa: E402

_FALLBACK_PATH = Path(__file__).parent / "data" / "demo_fallback.json"
_USE_FALLBACK = os.getenv("USE_FALLBACK", "false").lower() == "true"

app = FastAPI(
    title="MarginGuard API",
    description="Profit Truth Layer powered by three Gemini agents.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineRequest(BaseModel):
    brand_constraint: str = DEFAULT_CONSTRAINT


def _load_fallback() -> dict:
    with open(_FALLBACK_PATH) as f:
        return json.load(f)


def _sse(event: str, data: dict) -> str:
    return f"event:{event}\ndata:{json.dumps(data)}\n\n"


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "model": "gemini-2.0-flash",
        "agents": ["audit", "reallocation", "experiment", "optimization"],
        "version": "2.0.0",
    }


@app.get("/api/data/glownest")
async def glownest_data():
    return [c.model_dump() for c in GLOWNEST_CAMPAIGNS]


@app.post("/api/pipeline/run")
async def pipeline_run(request: PipelineRequest):
    if _USE_FALLBACK:
        return JSONResponse(content=_load_fallback())
    brief = await run_pipeline(constraint=request.brand_constraint)
    return JSONResponse(content=brief.model_dump())


@app.get("/api/pipeline/stream")
async def pipeline_stream(
    brand_constraint: str = Query(default=DEFAULT_CONSTRAINT),
):
    if _USE_FALLBACK:
        return _fallback_stream()
    return StreamingResponse(
        stream_pipeline(constraint=brand_constraint),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


def _fallback_stream() -> StreamingResponse:
    fallback = _load_fallback()

    async def _gen():
        yield _sse("pipeline_start", {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "brand": "GlowNest Beauty",
            "agents": 3,
        })
        await asyncio.sleep(0.3)

        yield _sse("agent_start", {
            "agent": "audit",
            "message": "Reading dashboard + margin data...",
        })
        await asyncio.sleep(0.4)
        yield _sse("agent_chunk", {
            "agent": "audit",
            "chunk": "Applying True Profit ROAS formula to all campaigns...",
        })
        await asyncio.sleep(1.8)
        audit = fallback["audit"]
        yield _sse("agent_complete", {
            "agent": "audit",
            "duration_seconds": 2.3,
            "anomalies_found": (
                audit["campaigns_unprofitable"] + audit["campaigns_at_risk"]
            ),
        })
        await asyncio.sleep(0.3)

        yield _sse("agent_start", {
            "agent": "reallocation",
            "message": "Building budget plan...",
        })
        await asyncio.sleep(0.4)
        yield _sse("agent_chunk", {
            "agent": "reallocation",
            "chunk": "Applying budget allocation rules and constraint...",
        })
        await asyncio.sleep(1.5)
        yield _sse("agent_complete", {
            "agent": "reallocation",
            "duration_seconds": 1.8,
            "weekly_profit_delta": (
                fallback["reallocation"]["projected_weekly_profit_delta"]
            ),
        })
        await asyncio.sleep(0.3)

        yield _sse("agent_start", {
            "agent": "experiment",
            "message": "Designing experiment...",
        })
        await asyncio.sleep(0.4)
        yield _sse("agent_chunk", {
            "agent": "experiment",
            "chunk": "Selecting best candidate from reallocation plan...",
        })
        await asyncio.sleep(1.0)
        yield _sse("agent_complete", {
            "agent": "experiment",
            "duration_seconds": 1.2,
            "chosen_product": fallback["experiment"]["product_name"],
        })
        await asyncio.sleep(0.3)

        yield _sse("pipeline_complete", fallback)

    return StreamingResponse(
        _gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
