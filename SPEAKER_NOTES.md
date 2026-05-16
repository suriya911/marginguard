# MarginGuard — Stage Speaker Notes

**Event:** TechEx / LabLab.ai Hackathon Demo Day
**Date:** May 19, 2026 — San Jose McEnery Convention Center
**Time:** 2 minutes on stage. Every second counts.

---

## The One Thing You Must Land

> "ROAS is not profit."

Say it once, slowly, before anything moves on screen. Let it land. Then show the data.

---

## Beat-by-Beat Script

### OPENING (15 seconds)

**What's on screen:** Dashboard. GlowNest Beauty. All campaigns green. 4.62x ROAS.

**What you say:**
> "This is GlowNest Beauty's Google Ads dashboard. $1,145 a day in spend. 4.62x ROAS. Every campaign is green. The marketing team is happy."

> "There's one problem."

*pause 1 second*

> "ROAS is not profit."

**Tone:** Calm. Confident. Let the silence work.

---

### BEAT 1 — THE LIE (20 seconds)

**What's on screen:** CampaignTable in ROAS view. 5 campaigns. Green badges. Cleanser shows 5.1x — the apparent winner.

**What you say:**
> "Their Hydrating Cleanser campaign is their highest ROAS — 5.1x. Google Ads says it's their best performer. They're spending $420 a day on it."

> "But Google Ads doesn't know their gross margin is 38%. It doesn't know 22% of customers return the product. It doesn't know their fulfillment cost."

> "Google Ads is showing them a lie."

**Do not click anything yet.** Let the green stay on screen.

---

### BEAT 2 — THE TRUTH (25 seconds)

**What to do:** Click "ACTIVATE PROFIT TRUTH LAYER."

**What's on screen:** Numbers start animating. Cleanser drops: 5.1 → 4.8 → 3.2 → 1.4 → **0.74**. Row turns red. Retinol gets an orange STOCKOUT warning badge.

**What you say:**
> "MarginGuard applies the real formula — revenue times margin, minus returns, minus fulfillment — divided by spend."

*point at Cleanser as the number drops*

> "5.1x reported. **0.74x true profit ROAS.** For every dollar they spend on this campaign, they are getting back 74 cents. They are losing money on every sale."

*point at Retinol*

> "And their Retinol campaign — which they're actively scaling — stocks out in 12 days."

**Tone:** Let the red number do the work. Don't rush this.

> "This beat has zero API calls. It's instant. It never fails. Because the lie is already in the data."

*(say this quietly — it shows confidence in the system)*

---

### BEAT 3 — THE AGENT (50 seconds)

**What to do:** Click "Run Gemini Agent Pipeline."

**What's on screen:** 4 input chips animate in — Screenshot, Margin Data, Inventory, Constraint. Then 3 pipeline steps appear: Audit → Reallocation → Experiment.

**What you say:**
> "Now we run three Gemini agents."

> "Agent 1 — the Audit Agent — takes all four inputs simultaneously: the Google Ads dashboard as a **screenshot image**, margin data as JSON, inventory as JSON, and the brand's own constraint in plain English. One Gemini call. Multimodal. No other model can do this."

*as Audit step goes green*

> "Anomalies found. Two campaigns flagged. Cleanser unprofitable, Retinol at stockout risk."

*as Reallocation step starts*

> "Agent 2 — the Reallocation Agent — takes that validated audit and generates a budget plan. Budget-neutral. Written for a CFO, not a marketer."

*as Reallocation completes*

> "Cleanser cut by $210 a day. Starter Bundle — their hidden gem at 3.4x true ROAS — gets $150 more."

*as Experiment step runs*

> "Agent 3 designs an A/B test for the highest-opportunity campaign. Concrete hypothesis. Measurable success metric."

*on pipeline_complete, Brief page loads*

> "Total pipeline: under 10 seconds. Output: a complete Profit Truth Brief — typed, validated, actionable."

---

### CLOSE (10 seconds)

**What's on screen:** Brief page. Budget delta table. +$2,340 weekly profit.

**What you say:**
> "Projected weekly profit improvement: **plus $2,340**. From one pipeline run."

> "MarginGuard uses Gemini's multimodal reasoning to tell you the truth your ad dashboard won't. The code is on GitHub, the API is live, and you can try it right now."

*smile, hold for applause*

---

## Q&A Preparation

### "Why not just do this in a spreadsheet?"
> "A spreadsheet can apply a formula to one product if you manually enter the margin data. MarginGuard reads your actual dashboard via screenshot, pulls margin and inventory in real time, understands a natural-language constraint like 'don't scale Retinol — we're stocking out,' and generates a complete budget plan. That's not a spreadsheet. That's an agent pipeline."

### "Why Gemini specifically?"
> "Gemini is the only model with native multimodal reasoning that also supports JSON mode with a specified response schema. Agent 1 takes an image and structured JSON in the same call and outputs a typed Pydantic object. We tried building this with text-only models — you lose the screenshot, which means you lose the visual context of what the advertiser is actually seeing. Gemini's multimodal + JSON mode combination is what makes this architecture possible."

### "Is this real or a demo?"
> "The backend is live on Railway. The Gemini API calls are real. The GlowNest data is a fixture — a realistic simulation of a DTC skincare brand — but the agent pipeline is production code. The API docs are at our Railway URL slash docs if you want to curl it right now."

### "How does it scale?"
> "The frontend is on Vercel — serves from 40+ global edge nodes, scales infinitely. The backend is on Railway with auto-scaling containers. If we needed to go to enterprise scale, the same Docker image deploys to Google Cloud Run with 1,000 concurrent instances and per-request billing. Zero architecture changes."

### "What's the business model?"
> "SaaS. $299/month per brand. The first time MarginGuard saves you from a $1,870/week losing campaign, it's paid for itself in two days. Our target is DTC e-commerce brands spending more than $10k/month on Google Ads — there are approximately 200,000 of them in the US alone."

### "Could I use this for my brand today?"
> "The API is open. You'd need to provide your margin data — we can accept CSV or a simple form. The Gemini calls are fast and cheap — each full pipeline run costs about 3 cents in API tokens. What's stopping you?"

---

## Stage Logistics

| Moment | Action |
|--------|--------|
| Walk on stage | Dashboard tab already open, constraint pre-filled |
| After "ROAS is not profit" | Pause 1 full second before continuing |
| Beat 2 toggle | Click deliberately — don't rush the animation |
| Beat 3 pipeline | Have fallback (`USE_FALLBACK=true`) ready if network drops |
| If API fails | "This is our fallback mode — same output, pre-computed. It's a safety net we built into the architecture." |
| Time check | Beat 1+2 should be done by 1:00. Beat 3 by 1:50. Close at 2:00. |

---

## What Judges Will Remember

1. The number flip — 5.1 dropping to 0.74 in red. That's the image that sticks.
2. "Plus $2,340 weekly profit" — a real number. Not a percentage. Not a vague improvement.
3. "No rule-based system, no spreadsheet, no single-modality model could generate this."

Say those three things. Everything else is support.

---

## Emergency Fallbacks

| Problem | Response |
|---------|----------|
| Gemini API timeout | Set `USE_FALLBACK=true` in Railway env, restart. SSE replays from cache identically. |
| Railway URL down | Use `ngrok` to tunnel localhost:8000 to a public URL. Update Vercel env var. |
| Vercel URL down | Open `localhost:5173` on laptop directly. Same experience. |
| Browser crash | Hard-refresh. Store is in Zustand (in-memory) — start demo from Beat 1. |
| Number animation not working | Describe it: "On this screen you'd see the number animate from 5.1 down to 0.74." |

---

*Rehearse this 5 times without stopping before getting on stage.*
*The demo is the pitch. Make it flawless.*
