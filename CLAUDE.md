# MarginGuard — Claude Code Guide

## What This Project Is

Multi-agent AI system for Google Ads profit analysis. Three sequential Gemini 2.0 Flash agents turn raw ad spend + margin data into a typed, validated `MarginGuardBrief` (audit + budget reallocation + A/B experiment brief).

**One-line pitch:** ROAS is not profit. MarginGuard reveals the truth.

---

## Repo Layout

```
backend/
  agents/          audit_agent.py, reallocation_agent.py, experiment_agent.py, orchestrator.py
  models/          Pydantic v2 schemas — one file per agent output + brief.py
  prompts/         Gemini system instructions and prompt builders
  services/        gemini_service.py — all Gemini calls go through here
  data/            glownest_fixtures.py, demo_fallback.json, screenshots/
frontend/
  src/
    store/         useMarginStore.js — single Zustand store
    pages/         DashboardPage, BriefPage, ArchitecturePage
    components/    dashboard/, brief/, pipeline/, shared/
    constants/     glownest.js — hardcoded truth values (Beat 2, never calls API)
assets/            glownest_ads_dashboard.html — screenshot source
scripts/           capture_screenshot.py
```

---

## Key Commands

### Backend

```bash
cd backend
python -m venv venv && venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Run dev server
uvicorn main:app --reload                         # http://localhost:8000

# Test Agent 1 alone
python -m agents.audit_agent

# Generate dashboard screenshot (once)
pip install playwright && playwright install chromium
python ../scripts/capture_screenshot.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build
```

### Env setup

```bash
cp backend/.env.example backend/.env
# Add: GEMINI_API_KEY=<from aistudio.google.com>
```

---

## Architecture Rules — Do Not Change

These are fixed. Every agent I/O is typed with Pydantic and validated before passing to the next agent.

| Agent | Input | Output |
|-------|-------|--------|
| Audit | PNG screenshot + CampaignInput list + constraint | ProfitAuditReport |
| Reallocation | ProfitAuditReport + constraint string | BudgetReallocationPlan |
| Experiment | BudgetReallocationPlan + product details | ExperimentBrief |
| Orchestrator | chains all three, emits SSE events | MarginGuardBrief |

**True Profit ROAS formula (embed in every audit prompt edit):**
```
true_profit_roas = (
  (conversions * aov * (1 - return_rate) * gross_margin)
  - (fulfillment_cost * conversions)
) / daily_spend
```

---

## Demo Data — Never Modify

The GlowNest fixture in `backend/data/glownest_fixtures.py` is the only dataset. These numbers drive the demo story:

| Campaign | Daily Spend | Reported ROAS | True Profit ROAS | Story |
|----------|-------------|---------------|------------------|-------|
| Vitamin C Serum | $180 | 4.8x | ~3.9x | Underfunded gem |
| **Hydrating Cleanser** | **$420** | **5.1x** | **~0.74x** | **THE LIE — losing money** |
| **Retinol Night Cream** | $290 | 4.2x | ~2.8x | **STOCKOUT in 12 days** |
| SPF Moisturizer | $160 | 3.9x | ~2.1x | Solid, unchanged |
| **Starter Bundle** | $95 | 4.1x | **~3.4x** | **Hidden gem — needs budget** |

Expected reallocation: Cleanser −$210/day, Bundle +$150/day, Serum +$140/day, total stays $1,145.

---

## Frontend Demo Beats — Critical

- **Beat 1** (page load): ROAS view, all green, no API call
- **Beat 2** (Truth Layer toggle): numbers animate to true values, client-side only using `constants/glownest.js` — **must never call the API**
- **Beat 3** (Run Pipeline button): calls `/api/pipeline/stream`, drives SSE state

Beat 2 must always work even if backend is completely down.

---

## Gemini Service Rules

- All Gemini calls go through `backend/services/gemini_service.py` — never call `genai` directly from agents
- Model: `gemini-2.0-flash`, temperature `0.2`, `response_mime_type="application/json"`
- Retry once on `json.JSONDecodeError`, raise `RuntimeError` on second failure
- Agent 1: `call_multimodal(system_instruction, image_path, text_prompt)`
- Agents 2 & 3: `call_text(system_instruction, text_prompt)`

---

## SSE Event Sequence

`/api/pipeline/stream` must emit exactly these events in order:
```
pipeline_start → agent_start(audit) → agent_chunk×N → agent_complete(audit)
→ agent_start(reallocation) → agent_chunk×N → agent_complete(reallocation)
→ agent_start(experiment) → agent_chunk×N → agent_complete(experiment)
→ pipeline_complete
```

---

## Fallback Mode

Set `USE_FALLBACK=true` in `.env` before going on stage. The pipeline endpoints replay `backend/data/demo_fallback.json` with the same SSE timing. Frontend cannot tell the difference. Generate the fallback file by running the live pipeline once and saving the output.

---

## Git Workflow

- Branch per feature: `feat/<name>`
- Commit author: `suriya911`
- Merge to `main` with `--no-ff`, delete branch after merge
- No force-push to `main`

---

## Team

| Person | Owns |
|--------|------|
| Suriya | Day 1 — backend foundation (models, fixtures, Gemini service, Agent 1) |
| Sabari | Day 2 — pipeline completion (Agents 2+3, orchestrator, FastAPI, Railway deploy) |
| Both | Days 3–5 — frontend, brief page, polish, Vercel deploy, submission |

Demo Day: **May 19, 2026** — San Jose McEnery Convention Center.
