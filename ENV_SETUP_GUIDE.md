# Environment Variables Setup Guide

Everything you need to set before going live and before going on stage.

---

## Railway (Backend)

Set these in the Railway dashboard → your service → Variables tab.

| Variable | Value | Notes |
|----------|-------|-------|
| `GEMINI_API_KEY` | `AIza...` | Get free key from [aistudio.google.com](https://aistudio.google.com) |
| `ENVIRONMENT` | `production` | |
| `USE_FALLBACK` | `false` | Set to `true` on stage day as safety net |

**How to set on Railway:**
1. Go to railway.app → your project → your service
2. Click **Variables** tab
3. Add each variable above
4. Railway auto-redeploys after saving

---

## Vercel (Frontend)

Set these in the Vercel dashboard → your project → Settings → Environment Variables.

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE_URL` | `https://your-app.railway.app` | Your exact Railway URL — no trailing slash |

**How to set on Vercel:**
1. Go to vercel.com → your project → **Settings** → **Environment Variables**
2. Add `VITE_API_BASE_URL` for **Production** environment
3. Redeploy: Vercel dashboard → Deployments → **Redeploy**

---

## Local Development

```bash
# backend/.env  (copy from backend/.env.example)
GEMINI_API_KEY=AIza...your_key_here
ENVIRONMENT=development
USE_FALLBACK=false

# frontend/.env.local  (already in repo)
VITE_API_BASE_URL=http://localhost:8000
```

---

## Before Going On Stage (Demo Day Checklist)

```
1. Set USE_FALLBACK=true in Railway dashboard
2. Verify Railway URL responds: curl https://your-app.railway.app/api/health
3. Verify Vercel URL loads the dashboard
4. Open demo in Chrome, zoom to 100%, full screen
5. Pre-fill constraint is showing (it's hardcoded — always will be)
6. Test Beat 2 toggle once — confirm numbers animate
7. Test Beat 3 once with fallback — confirm SSE events fire
```

---

## Deployment URLs (fill in after deploy)

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://marginguard.vercel.app` |
| Backend (Railway) | `https://marginguard.railway.app` |
| API Docs | `https://marginguard.railway.app/docs` |

Update `frontend/.env.production` and `README.md` with the actual Railway URL once deployed.
