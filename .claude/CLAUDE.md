# Grocery Stock Comparison — CLAUDE.md

## What This Is
Stock price regression dashboard comparing Publix against grocery sector peers and S&P 500. Internal analytical tool — noindex.

## Stack
- Next.js App Router
- Chart.js + react-chartjs-2
- Yahoo Finance API (`^GSPC`, `KR`, `WMT`, `COST`, `TGT`, `SFM`) via `/api/predict/` routes
- Vercel deploy — push to main = live. Repo: `wesbenterprise/grocery-stock-comparison`

## Key Features
- `PredictionPanel.js` — grocery peers regression (R² = 95.5%)
- `PredictionPanelSP.js` — adds S&P 500 as 6th peer (R² = 96.0%), purple `#a78bfa`
- Toggle: "Grocery Peers Only" | "Include S&P 500"
- Q1 2026 tracker — actual Publix price to be compared May 1st (quarter closed March 31, Publix reports ~1 month later)
- Tooltip fix (commit `2bb6bfb`): mode `nearest`, reads actual x timestamp — do not revert

## Hard Rules
- Never break the original grocery-peers-only panel — it must remain intact alongside the S&P panel
- Tooltip mode must stay `nearest` — `index` mode caused snapping bug on historical data
- May 1st: pull actual Q1 2026 Publix price and compare both models

## Git Workflow
- Push directly to `main`

## Gotchas
- Publix is privately held — no live ticker. Price updates are quarterly (set by board, ~1 month after quarter close)
- AAPL cost basis for Wesley: $257.37 — track gain/loss from this number
- `api/predict-sp/route.js` is the S&P 500 endpoint — separate from `api/predict/route.js`
