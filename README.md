# Sammich

Turn any mundane thought into a world-class LinkedIn post.

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in:
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com)
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — from [Upstash](https://upstash.com) (skip for local dev, rate limiting is disabled automatically)
4. `npm run dev` → open `http://localhost:3000`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL, e.g. `https://sammich.vercel.app`)
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Deploy — Vercel auto-deploys on every push to `main`

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm test` | Run all tests |
| `npm run build` | Production build |
