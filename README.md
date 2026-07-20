# RL Labs website

A production-oriented V1 marketing site for Rocket League coach Kinseh. Built with React, TypeScript, Vite, self-hosted variable fonts, a lightweight WebGL shader, responsive layouts, accessible native interactions, and reduced-motion fallbacks.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Live content and conversion links

Copy `.env.example` to `.env` and supply the live destinations for the free community, Premium checkout, Elite application, coach profile, RL Tracker profile, and verified review page. The current conversion-link fallbacks point to the RL Labs Whop storefront.

Elite availability is read from Whop through the same-origin `/api/elite-availability` server function. Set `WHOP_API_KEY` to an Account API key created for the Rocket League Labs business with `plan:basic:read` permission, and set `WHOP_ELITE_PLAN_ID` to the Elite plan ID. Both variables are server-only and must not use the `VITE_` prefix. The endpoint returns a finite Whop stock count when one is configured, reports unlimited enrollment without inventing a count, and briefly caches successful responses. Until Whop responds successfully, the page uses the manually maintained fallback in `ProgramsSection.tsx`. The function uses Vercel's conventional `api/` directory and is also mounted by the Vite dev server for local development. Use `VITE_ELITE_STOCK_ENDPOINT` only when the production function lives at a different URL.

`VITE_PREMIUM_VIDEO_URL` and `VITE_ELITE_VIDEO_URL` accept YouTube, Vimeo, or direct MP4/WebM sources. The program player is mounted only after a visitor clicks a thumbnail, keeping video work out of the initial page load.

## Content still requiring client approval

- Confirmation of which supplied testimonial belongs to an Elite member
- FAQ copy from the RL Improvement Framework document
- Legal terms for the Elite measurable-improvement guarantee
- Final coach profile and RL Tracker URLs
- Final domain and social metadata image

Rank asset licensing and source notes are in `ATTRIBUTIONS.md`.
