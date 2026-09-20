# Platform 2 — Capacity Building Prototype

Standalone demo of **Platform 2**: a learning / capacity building platform for dairy SMEs.

- **Live demo:** https://muneernas.github.io/dairy-platform2-prototype/
- **Pilot module:** Module 2 — Demand forecasting (full interactive flow)

## What this shows

- Eleven learning modules (from the Platform 2 brief)
- Three-step learning model: AI agent → simulated data → apply to company data
- Custom learning web platform with nexos.ai Gateway API integration (demo fallback without API key)

This repo is separate from [dairy-simulation-prototype](https://github.com/muneernas/dairy-simulation-prototype), which remains the earlier simulation/advisory demo.

## Run locally

```bash
npm install
npm run dev
```

Optional: copy `.env.example` to `.env` and set either:

- `VITE_NEXOS_API_KEY` for real nexos Gateway, or
- `VITE_LLM_API_KEY` for a **free LLM stand-in** (Groq recommended) that uses the same instructions + knowledge-base pattern as a nexos agent.

For the **GitHub Pages demo**, the same `VITE_LLM_*` values are stored as repository secrets and injected at build time so live chat works on the public site. Treat that as demo-only (the key is visible in the browser bundle); rotate the Groq key after client demos.

## Deploy

Pushes to `main` deploy automatically to GitHub Pages via `.github/workflows/deploy-pages.yml`.
