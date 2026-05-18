# MarginGuard — Build Task Board

**Hackathon:** Transforming Enterprise Through AI — TechEx / LabLab.ai
**Track:** Track 2 — Data & Intelligence
**Demo Day:** May 19, 2026 — San Jose McEnery Convention Center
**Live Build Window:** May 15–19, 2026

---

## Team

| Person | Responsibility |
|--------|---------------|
| **Suriya** | Day 1 — Foundation: Backend models, fixtures, screenshot, Gemini Agent 1 |
| **Sabari** | Day 2 — Full Pipeline: Agents 2 & 3, Orchestrator, FastAPI, SSE streaming |

Days 3–5 are shared and coordinated together.

---

## Day 1 — Suriya (May 15)

Goal: **Agent 1 runs from terminal and produces valid, correct ProfitAuditReport JSON.**

### 1.1 Repo & Environment Setup
- [x] Create GitHub repo `marginguard` — set to **public**
- [x] Create `backend/` and `frontend/` directories at root
- [x] Create `backend/.env` with `GEMINI_API_KEY`, `ENVIRONMENT=development`, `USE_FALLBACK=false`
- [x] Get Gemini API key from [aistudio.google.com](https://aistudio.google.com) (free)
- [x] Create `backend/requirements.txt` (see Section 11 of context doc)
- [x] Run `pip install -r requirements.txt` inside a virtual env (`backend/venv/`)

### 1.2 Pydantic Data Models
Create all files inside `backend/models/`:

- [x] `__init__.py` — re-export all models
- [x] `campaign.py` — `CampaignInput`, `InventoryStatus` enum, `RiskLevel` enum
- [x] `audit.py` — `CampaignTruth`, `ProfitAuditReport`
- [x] `reallocation.py` — `BudgetMove`, `BudgetReallocationPlan`
- [x] `experiment.py` — `ExperimentBrief`
- [x] `brief.py` — `MarginGuardBrief`

### 1.3 GlowNest Demo Fixtures
- [x] Create `backend/data/__init__.py`
- [x] Create `backend/data/glownest_fixtures.py` with all 5 campaigns hardcoded exactly as spec
  - Vitamin C Serum: $180/day, 4.8 ROAS, 72% margin
  - Hydrating Cleanser: $420/day, 5.1 ROAS, 38% margin, 22% returns ← THE LIE
  - Retinol Night Cream: $290/day, 4.2 ROAS, 12 days inventory ← STOCKOUT RISK
  - SPF Moisturizer: $160/day, 3.9 ROAS
  - Starter Bundle: $95/day, 4.1 ROAS, 68% margin ← HIDDEN GEM

### 1.4 Google Ads Screenshot
- [x] Create `assets/glownest_ads_dashboard.html` — replicate Google Ads UI
  - White background, Google blue (#1a73e8), grey borders
  - "GlowNest Beauty" account, "May 8–14, 2026" date range
  - All 5 campaigns showing green status, positive ROAS
  - Total row: $1,145/day, 4.62x ROAS
  - **CRITICAL: Everything must be green — no warnings**
- [x] Open in Chrome, screenshot at 1440×900px
- [x] Save as `backend/data/screenshots/glownest_ads_dashboard.png`

### 1.5 Gemini Service
- [x] Create `backend/services/__init__.py`
- [x] Create `backend/services/gemini_service.py`
  - Model: `gemini-2.0-flash`, temperature 0.2
  - `response_mime_type: "application/json"` (JSON mode — critical)
  - Multimodal call wrapper: base64-encode PNG + text prompt in one call
  - Wrap every call in try/except, retry once on JSON parse failure

### 1.6 Audit Prompt
- [x] Create `backend/prompts/__init__.py`
- [x] Create `backend/prompts/audit_prompt.py`
  - System instruction: role, formula, flags, output format
  - True Profit ROAS formula must be embedded verbatim:
    `((Revenue × (1 - return_rate_pct) × gross_margin_pct) - (fulfillment_cost × conversions)) / daily_spend`
  - Include full Pydantic JSON schema in prompt
  - Flags: `is_unprofitable`, `is_stockout_risk`, `is_overfunded`, `is_underfunded`

### 1.7 Audit Agent
- [x] Create `backend/agents/__init__.py`
- [x] Create `backend/agents/audit_agent.py`
  - Loads PNG as base64
  - Builds multimodal parts list (image + JSON data + text prompt)
  - Calls Gemini, parses response, validates against `ProfitAuditReport`
  - Returns typed `ProfitAuditReport`

### 1.8 Test & Verify Agent 1
- [x] Run Agent 1 from terminal: `python -m agents.audit_agent`
- [x] Verify Cleanser shows `true_profit_roas < 1.0` and `is_profitable: false`
- [x] Verify Retinol shows `STOCKOUT_RISK_12_DAYS` in `anomaly_flags`
- [ ] Verify `total_true_profit_roas ≈ 1.74` with live Gemini ← pending API key fix
- [ ] Run 5 times — output must be consistent ← pending API key fix

**End of Day 1 deliverable:** Agent 1 terminal output showing correct, validated ProfitAuditReport.

---

## Day 2 — Sabari (May 16)

Goal: **All 3 agents running. FastAPI serving all routes. SSE streaming working. Backend deployed.**

### 2.1 Reallocation Agent
- [x] Create `backend/prompts/reallocation_prompt.py`
  - System instruction: budget-neutral constraint, CFO language rules
  - 5 allocation rules embedded
  - Full `BudgetReallocationPlan` schema in prompt
- [x] Create `backend/agents/reallocation_agent.py`
  - Input: `ProfitAuditReport` JSON + constraint string
  - Calls Gemini (text-only, no image)
  - Validates `BudgetReallocationPlan` with Pydantic
  - Verify: `total_recommended_daily_budget == total_current_daily_budget`
- [ ] Test standalone with live Gemini: Cleanser -$210/day, Bundle +$150/day, budget neutral verified ← BLOCKED: API key quota

### 2.2 Experiment Agent
- [x] Create `backend/prompts/experiment_prompt.py`
  - System instruction: selection criteria, hypothesis format
  - Full `ExperimentBrief` schema in prompt
- [x] Create `backend/agents/experiment_agent.py`
  - Input: `BudgetReallocationPlan` JSON + product details
  - Calls Gemini (text-only)
  - Validates `ExperimentBrief`
- [ ] Test standalone with live Gemini: Starter Bundle chosen ← BLOCKED: API key quota

### 2.3 Orchestrator
- [x] Create `backend/agents/orchestrator.py`
  - Chain: Agent 1 → Agent 2 → Agent 3
  - Pydantic validation at each step
  - Retry logic: once on JSON parse failure, raise on second failure
  - SSE event emitter: `pipeline_start`, `agent_start`, `agent_chunk`, `agent_complete`, `pipeline_complete`
  - Per-agent timing recorded
  - Returns `MarginGuardBrief`

### 2.4 FastAPI Backend
- [x] Create `backend/main.py` with all routes:
  - `POST /api/pipeline/run` — full JSON response
  - `GET /api/pipeline/stream` — SSE streaming (query param: `brand_constraint`)
  - `GET /api/data/glownest` — returns campaign array
  - `GET /api/health` — returns `{"status":"ok","model":"gemini-2.0-flash",...}`
  - CORS enabled for all origins
  - `/api/docs` — FastAPI Swagger auto-generated
  - `USE_FALLBACK` env var support

### 2.5 End-to-End Backend Test
- [x] `curl http://localhost:8000/api/health` — 200 OK
- [x] `curl http://localhost:8000/api/data/glownest` — 5 campaigns returned
- [x] All 11 SSE events fire in correct order (via fallback)
- [x] Budget neutral verified ($1,145 = $1,145) via fallback
- [ ] Live Gemini pipeline run end-to-end ← BLOCKED: API key quota

### 2.6 Fallback JSON
- [x] Create `backend/data/demo_fallback.json` (formula-computed, structurally valid)
- [x] `USE_FALLBACK=true` verified — all 11 SSE events fire, full brief returned
- [ ] Replace fallback with real Gemini output (run `scripts/run_pipeline.py` once API is fixed)

### 2.7 Deploy Backend to Railway
- [ ] Create `Procfile` or `railway.toml`: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- [ ] Create `Dockerfile` for Railway (optional but recommended)
- [ ] Push to GitHub, connect Railway to repo
- [ ] Set `GEMINI_API_KEY` env var in Railway dashboard
- [ ] Test production URL: `https://marginguard.railway.app/api/health`

**End of Day 2 deliverable:** `curl` to Railway production URL returns complete MarginGuardBrief JSON.

---

## Day 3 — Both (May 17)

Goal: **Frontend dashboard fully working. All 3 demo beats work end-to-end in browser.**

### Suriya — Frontend Core
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install all dependencies (React, Zustand, Tailwind, etc.)
- [ ] Configure `frontend/.env.local` with Railway backend URL
- [ ] Build Zustand store (`src/store/useMarginStore.js`)
- [ ] Build `constants/glownest.js` — hardcoded truth values for Beat 2
- [ ] Build `BrandHeader`, `MetricBar` components
- [ ] Build `CampaignTable` with ROAS_VIEW and TRUTH_VIEW modes
- [ ] Wire `TruthLayerToggle` — client-side only, no API call (Beat 2 must never fail)

### Sabari — Pipeline UI
- [ ] Build `ConstraintInput` with default pre-fill
- [ ] Build `AgentRunnerPanel` with 4 input chips
- [ ] Build `PipelineProgress` (3-step visual)
- [ ] Build `StreamingOutput` terminal box
- [ ] Wire SSE consumer to backend `/api/pipeline/stream`
- [ ] Test full Beat 3 flow: click → stream → all events fire → navigate to Brief

---

## Day 4 — Both (May 18)

Goal: **Brief page complete. Production design applied. Deployed to Vercel. Zero bugs.**

### Suriya — Brief Page
- [ ] Build `AuditSummary`, `CampaignTruthCard`
- [ ] Build `BudgetDeltaTable` with delta arrows
- [ ] Build `ExperimentCard`, `ExecutiveSummary`
- [ ] Build `ArchitecturePage` for judges
- [ ] Build `Navbar` with links to Dashboard / Brief / Architecture / `/api/docs`

### Sabari — Design Polish + Deploy
- [ ] Apply full dark theme: #0A0E1A background, IBM Plex Mono, color system
- [ ] Add CountUp/CountDown number animations (react-countup)
- [ ] Add 400ms ease-in-out on Truth Layer toggle
- [ ] Add Cleanser ROAS countdown: 800ms, red intensifies as number drops
- [ ] Test on mobile viewport (must not break)
- [ ] Deploy frontend to Vercel
  - Connect GitHub → Vercel, set `VITE_API_BASE_URL` to Railway URL
- [ ] Test full production flow: Vercel → Railway → Gemini → back
- [ ] Run demo 10 times straight — fix every failure

---

## Day 5 — Both (May 19, Submission Day)

Goal: **Everything submitted correctly before deadline.**

- [ ] Write `README.md` with all required sections + live URLs
- [ ] Build 5-slide pitch deck (see Section 16 of context doc)
- [ ] Record 2-minute demo video on **production** URLs (not localhost)
- [ ] Upload video to YouTube (unlisted) or Loom
- [ ] Set `USE_FALLBACK=true` in Railway before going on stage
- [ ] Submit on [lablab.ai](https://lablab.ai): fill ALL fields
- [ ] Add all 8 tags: `gemini`, `google-ai`, `multimodal-ai`, `multi-agent`, `ecommerce`, `data-intelligence`, `profit-optimization`, `enterprise-ai`
- [ ] Verify GitHub repo is public
- [ ] Rehearse demo 5 times straight without stopping

---

## Pre-Submission Checklist

- [ ] Vercel frontend URL loads
- [ ] Railway backend `/api/health` returns 200
- [ ] `/api/docs` loads Swagger UI
- [ ] `/api/pipeline/run` returns valid MarginGuardBrief
- [ ] `/api/pipeline/stream` emits all 11 SSE events
- [ ] Beat 2 (Truth Layer) works with **zero API calls**
- [ ] Budget neutral: recommended total == current total ($1,145)
- [ ] Retinol not scaled (constraint respected)
- [ ] Fallback (`USE_FALLBACK=true`) looks identical to live
- [ ] `demo_fallback.json` committed to repo
- [ ] Demo rehearsed 5 times without stopping

---

## Branch Strategy

Each feature gets its own branch, merged via PR with `suriya911` as author:

| Branch | Owner | Purpose |
|--------|-------|---------|
| `feat/project-documentation` | Suriya | TASKS.md, README.md, SPEAKER_NOTES.md |
| `feat/backend-models` | Suriya | All Pydantic models |
| `feat/glownest-fixtures` | Suriya | GlowNest demo data + screenshot |
| `feat/gemini-service` | Suriya | gemini_service.py |
| `feat/audit-agent` | Suriya | audit_prompt.py + audit_agent.py |
| `feat/reallocation-agent` | Sabari | reallocation prompt + agent |
| `feat/experiment-agent` | Sabari | experiment prompt + agent |
| `feat/orchestrator` | Sabari | orchestrator.py |
| `feat/fastapi-routes` | Sabari | main.py + all routes |
| `feat/backend-deploy` | Sabari | Railway config, Dockerfile |
| `feat/frontend-core` | Suriya | Zustand store, CampaignTable, beats 1+2 |
| `feat/pipeline-ui` | Sabari | AgentRunnerPanel, SSE consumer, beat 3 |
| `feat/brief-page` | Suriya | All brief components |
| `feat/design-polish` | Sabari | Dark theme, animations |
| `feat/vercel-deploy` | Sabari | Vercel config, production test |
