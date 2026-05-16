# MarginGuard — Profit Truth Layer

> **ROAS is not profit.**

MarginGuard is a multi-agent AI system powered by Gemini 2.0 Flash that sits above Google Ads, reveals where ROAS is lying, and delivers a daily budget reallocation plan optimized for actual contribution profit.

**Live Demo:** `https://marginguard.vercel.app` *(available after Day 4 deploy)*
**API Docs:** `https://marginguard.railway.app/docs`

---

## The Problem

Google Ads reports ROAS. ROAS is revenue divided by spend — it knows nothing about your product margins, return rates, or fulfillment costs. A campaign showing 5.1x ROAS can be destroying profit at the same time.

GlowNest Beauty spends $1,145/day on Google Ads. Their Hydrating Cleanser campaign shows the highest ROAS — 5.1x. After accounting for 38% gross margin and 22% return rate, its true profit ROAS is **0.74x**. They are losing money on every single sale. Their dashboard shows all green.

MarginGuard reveals the truth.

---

## What It Does

1. **Audit Agent** — Reads a Google Ads dashboard screenshot + margin data + inventory levels simultaneously, calculates true profit ROAS per campaign, and flags anomalies.
2. **Reallocation Agent** — Takes the audit truth and generates a budget-neutral reallocation plan written for a CFO, not a marketer.
3. **Experiment Agent** — Identifies the single best campaign for A/B testing and generates a concrete, hypothesis-driven experiment brief.

Output: a typed, validated `MarginGuardBrief` — audit + reallocation plan + experiment brief — that a marketing team can act on tomorrow.

---

## Why Gemini Makes This Possible

Gemini is the only model that can simultaneously process a visual Google Ads dashboard screenshot, structured margin data, real-time inventory JSON, and a plain-language brand constraint in a single reasoning context — and produce a typed, validated output that a CFO can act on.

Specifically:
- **Multimodal input** to Agent 1: PNG screenshot + structured JSON + natural language in one call
- **Long context**: all three agents receive full prior-agent JSON output as context
- **JSON mode** (`response_mime_type="application/json"`): forces structured, parseable output every time
- **Sequential agent chaining**: each validated Pydantic output becomes the next agent's typed input
- **SSE streaming**: real-time pipeline visualization as Gemini reasons

No rule-based system, no spreadsheet, and no single-modality model can replicate this.

---

## Three-Agent Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              MarginGuard Pipeline             │
                    └─────────────────────────────────────────────┘
                                          │
          ┌───────────────────────────────┼──────────────────────────────┐
          ▼                               ▼                              ▼
  ┌───────────────┐              ┌───────────────┐              ┌────────────────┐
  │  AUDIT AGENT  │              │ REALLOCATION  │              │  EXPERIMENT    │
  │               │  ──────────► │    AGENT      │  ─────────► │    AGENT       │
  │ Input:        │              │               │              │                │
  │  • PNG screenshot            │ Input:        │              │ Input:         │
  │  • Margin JSON│              │  • AuditReport│              │  • Budget Plan │
  │  • Inventory  │              │  • Constraint │              │  • Product data│
  │  • 7d conv.   │              │               │              │                │
  │               │              │ Rules:        │              │ Selects:       │
  │ Formula:      │              │  Budget-neutral              │  Highest profit│
  │  True ROAS =  │              │  CFO language │              │  delta + lowest│
  │  (Rev × margin│              │               │              │  risk + healthy│
  │  - fulfillment│              │ Output:       │              │  inventory     │
  │  ) / spend    │              │  BudgetPlan   │              │                │
  │               │              │               │              │ Output:        │
  │ Output:       │              └───────────────┘              │  ExperimentBrief
  │  AuditReport  │                                             └────────────────┘
  └───────────────┘
```

---

## Gemini Integration Details

| Parameter | Value |
|-----------|-------|
| Model | `gemini-2.0-flash` |
| Temperature | `0.2` (low — consistent structured output) |
| Output format | `response_mime_type="application/json"` |
| Agent 1 input | Image (PNG) + JSON + natural language |
| Agent 2 input | JSON from Agent 1 + constraint string |
| Agent 3 input | JSON from Agent 2 + product details |
| Validation | Pydantic v2 on every agent output |
| Retry policy | Once on JSON parse failure, raise on second |
| Streaming | SSE endpoint emits 11 events per pipeline run |

---

## Key Data Models

```python
class ProfitAuditReport(BaseModel):
    brand_name: str
    total_reported_roas: float
    total_true_profit_roas: float
    campaigns_unprofitable: int
    campaign_truths: list[CampaignTruth]

class BudgetReallocationPlan(BaseModel):
    total_current_daily_budget: float
    total_recommended_daily_budget: float   # must equal current
    budget_neutral_verified: bool           # must be True
    projected_weekly_profit_delta: float
    budget_moves: list[BudgetMove]

class ExperimentBrief(BaseModel):
    campaign_id: str
    hypothesis: str                         # "If we [X], then [Y] will [Z] because [reason]"
    primary_success_metric: str
    estimated_weekly_profit_impact_if_successful: float
```

---

## API Documentation

All routes auto-documented at `/docs` (FastAPI Swagger UI).

| Route | Method | Description |
|-------|--------|-------------|
| `/api/pipeline/run` | POST | Run full pipeline, return MarginGuardBrief JSON |
| `/api/pipeline/stream` | GET | SSE stream — live pipeline events as Gemini reasons |
| `/api/data/glownest` | GET | GlowNest campaign array |
| `/api/health` | GET | Health check + model info |
| `/docs` | GET | Swagger UI |

**SSE Event Sequence (11 events):**
```
pipeline_start → agent_start(audit) → agent_chunk × N → agent_complete(audit)
              → agent_start(reallocation) → agent_chunk × N → agent_complete(reallocation)
              → agent_start(experiment) → agent_chunk × N → agent_complete(experiment)
              → pipeline_complete
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| AI | Gemini 2.0 Flash | Multimodal + JSON mode + speed |
| Backend | FastAPI (Python) | Async SSE, auto Swagger, Pydantic native |
| Validation | Pydantic v2 | Strict typed inter-agent I/O |
| Frontend | React + Vite | Fast build, HMR |
| State | Zustand | Minimal, no boilerplate |
| Charts | Recharts | Budget delta visualization |
| Animations | react-countup | ROAS number flip effect |
| Backend hosting | Railway | Docker-native, auto-scale, free tier |
| Frontend hosting | Vercel | Edge CDN, instant deploys, free tier |

---

## Deployment — Fully Scalable Setup

### Backend: Railway

Railway auto-scales on demand. Zero configuration required for basic deployment.

```bash
# 1. Create Procfile at project root
echo "web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT" > Procfile

# 2. Push to GitHub
git push origin main

# 3. In Railway dashboard:
#    - New Project → Deploy from GitHub repo → select marginguard
#    - Add env var: GEMINI_API_KEY=your_key
#    - Add env var: USE_FALLBACK=false
#    - Railway auto-detects Python, installs requirements.txt, starts server

# 4. Custom domain (optional): Settings → Domains → Add
```

Railway scales automatically via container replicas. For production load, upgrade to Starter ($5/mo) for always-on instances. Horizontal scaling is available on Pro plan.

### Frontend: Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. From frontend/ directory
cd frontend
vercel

# 3. Set environment variable in Vercel dashboard:
#    VITE_API_BASE_URL = https://your-app.railway.app

# 4. Every git push to main auto-deploys via Vercel GitHub integration
```

Vercel's edge CDN serves the React bundle from 40+ global PoPs — no configuration needed for global scale.

### Scalability Architecture

```
Users → Vercel Edge CDN → React SPA (static, scales infinitely)
                       ↓ API calls
              Railway → FastAPI (auto-scales, containerized)
                       ↓ AI calls
              Google Gemini API (managed, scales with quota)
```

For higher scale, migrate FastAPI to **Google Cloud Run** (same Docker image, 1000 concurrent instances, per-request billing):

```bash
gcloud run deploy marginguard \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

### Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload       # http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

---

## Track 2 Alignment: Data & Intelligence

| Track Focus Area | MarginGuard Feature |
|-----------------|---------------------|
| RAG over multi-source data | Agent 1 combines image + margin JSON + inventory JSON + conversion data |
| AI-powered data validation | Pydantic v2 strict validation on all 3 agent outputs |
| NL analytics agents | Constraint input: plain English → Gemini → structured budget plan |
| Anomaly detection | `is_unprofitable`, `is_stockout_risk`, `is_overfunded`, `is_underfunded` flags |
| Multimodal document reading | Agent 1 reads Google Ads PNG screenshot via Gemini vision |

---

## Business Impact

GlowNest Beauty spends **$420/day** on their Hydrating Cleanser campaign. Reported ROAS: 5.1x. After 38% margin and 22% returns, true profit ROAS: **0.74x**.

They are losing **$1,870/week** on their top-performing campaign.

MarginGuard's reallocation plan moves $210/day away from the cleanser, $150/day into the Starter Bundle (true ROAS 3.4x), and $140/day into Vitamin C Serum (true ROAS 3.9x).

**Projected weekly profit improvement: +$2,340.**

That is the value of one pipeline run. One Gemini call stack. Sub-10 seconds.

---

## The Sentence That Wins

> "MarginGuard uses Gemini's native multimodal reasoning to simultaneously process a visual Google Ads dashboard, structured product margin data, real-time inventory signals, and a plain-language brand constraint — across a three-agent sequential pipeline — producing typed, Pydantic-validated output that no rule-based system, no spreadsheet, and no single-modality model could generate."

---

## Repository Structure

```
marginguard/
├── backend/                  # FastAPI + Gemini agents
│   ├── main.py               # All API routes
│   ├── agents/               # audit, reallocation, experiment, orchestrator
│   ├── models/               # Pydantic schemas
│   ├── prompts/              # Gemini system instructions
│   ├── services/             # gemini_service.py
│   └── data/                 # Fixtures, fallback JSON, screenshot
├── frontend/                 # React + Vite + Tailwind
│   └── src/
│       ├── pages/            # Dashboard, Brief, Architecture
│       ├── components/       # All UI components
│       ├── store/            # Zustand state
│       └── constants/        # Hardcoded truth values for Beat 2
├── assets/                   # Google Ads HTML screenshot source
├── TASKS.md                  # Build task board (Suriya + Sabari)
├── SPEAKER_NOTES.md          # Stage presentation script
└── README.md
```

---

*Built for TechEx / LabLab.ai Hackathon — May 2026*
*Powered by Gemini 2.0 Flash*
