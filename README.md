# Sammich 🥪

> *For when your sandwich deserves a platform.*

LinkedIn is a remarkable place. A place where eating lunch becomes a lesson in discipline. Where missing a bus is a meditation on resilience. Where absolutely anything — no matter how trivial — can be reframed as a leadership breakthrough that will inspire millions.

**Sammich** leans into this completely. It's a satirical translator that converts plain English into exactly that kind of content: absurdly overinflated, self-congratulatory LinkedIn posts that treat your most mundane moments as world-historical events.

Type anything. Get a thought leadership masterpiece.

→ **[sammich.vercel.app](https://sammich.vercel.app)**

---

## What it does

You type something like:

> I ate a sandwich.

Sammich returns:

> *In the relentless pursuit of peak performance, even the seemingly mundane can unlock profound insights. Today, amidst a whirlwind of strategic recalibration, I didn't just "eat lunch." I engaged in a deeply intentional act of fundamental nourishment. 🚀*
>
> *This wasn't merely a sandwich. It was a layered metaphor for the human condition.*
>
> *#Leadership #Growth #Intentionality #Discipline*

Pure satire. No tone sliders. No "professional mode." No mercy. Every translation is maximally overblown — that's the whole point.

---

## Running locally

```bash
npm install
npm run dev
```

Create a `.env.local` file in the project root with the following:

```
GEMINI_API_KEY=your_key_here
```

Open [http://localhost:3000](http://localhost:3000).

### All environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | From [Google AI Studio](https://aistudio.google.com/apikey) — use the "Generative Language Client" project |
| `NEXT_PUBLIC_APP_URL` | No | Your deployed URL. Defaults to `http://localhost:3000` |
| `UPSTASH_REDIS_REST_URL` | No | [Upstash](https://upstash.com) Redis — enables rate limiting. Safe to omit locally |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm test` | Run all tests |
| `npm run build` | Production build |

---

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Google Gemini 2.5 Flash** — the model generating your thought leadership
- **Upstash Redis** — rate limiting (10 req/min/IP)
- **Vercel** — hosting

---

*Sammich takes no responsibility for any unintentional career advancement resulting from its output.*
