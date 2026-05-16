# MarginGuard — Claude Guide

**Pitch:** ROAS is not profit. MarginGuard reveals the truth via 3 Gemini agents.
**Demo day:** May 19, 2026 — San Jose McEnery Convention Center.

---

## Commands

```bash
# Backend (from /backend)
cp .env.example .env          # add GEMINI_API_KEY from aistudio.google.com
pip install -r requirements.txt
uvicorn main:app --reload     # localhost:8000
python -m agents.audit_agent  # test Agent 1

# Screenshot (once, needs playwright)
pip install playwright && playwright install chromium
python scripts/capture_screenshot.py

# Frontend (from /frontend)
npm install && npm run dev    # localhost:5173
```

---

## Agent Pipeline

| Agent | Input | Output |
|-------|-------|--------|
| Audit | PNG + CampaignInput JSON + constraint | ProfitAuditReport |
| Reallocation | ProfitAuditReport + constraint | BudgetReallocationPlan |
| Experiment | BudgetReallocationPlan | ExperimentBrief |

**True Profit ROAS formula (never change):**
```
true_profit_roas = ((conversions * aov * (1-return_rate) * gross_margin) - (fulfillment_cost * conversions)) / daily_spend
```

All Gemini calls go through `backend/services/gemini_service.py` only.
Model: `gemini-2.0-flash`, temp `0.2`, `response_mime_type="application/json"`, retry once on JSON failure.

---

## Demo Data — Never Modify

GlowNest Beauty · $1,145/day total · `backend/data/glownest_fixtures.py`

| Campaign | Spend | Reported ROAS | True ROAS | Flag |
|----------|-------|---------------|-----------|------|
| Vitamin C Serum | $180 | 4.8x | ~3.9x | underfunded |
| **Hydrating Cleanser** | **$420** | **5.1x** | **~0.74x** | **UNPROFITABLE ← main reveal** |
| **Retinol Night Cream** | $290 | 4.2x | ~2.8x | **STOCKOUT 12 days** |
| SPF Moisturizer | $160 | 3.9x | ~2.1x | stable |
| **Starter Bundle** | $95 | 4.1x | **~3.4x** | **underfunded gem** |

Expected reallocation: Cleanser −$210 · Bundle +$150 · Serum +$140 · total stays **$1,145**.

---

## Frontend Beats

- **Beat 1** — page load, ROAS view, all green, no API call
- **Beat 2** — Truth Layer toggle, animates to true values from `constants/glownest.js` — **never calls API, must always work**
- **Beat 3** — Run Pipeline → `/api/pipeline/stream` SSE → navigate to BriefPage

---

## Rules

- Do not change data models, fixture data, or demo flow
- Beat 2 must work with backend completely down
- `USE_FALLBACK=true` in `.env` replays `demo_fallback.json` — set before going on stage
- Git: branch per feature → commit as `suriya911` → `--no-ff` merge → delete branch

---

## Team

| | |
|-|-|
| **Suriya** | Day 1 — models, fixtures, Gemini service, Agent 1 |
| **Sabari** | Day 2 — Agents 2+3, orchestrator, FastAPI, Railway deploy |
| **Both** | Days 3–5 — frontend, polish, Vercel, submission |
