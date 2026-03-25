# Sammich — Design Spec
Date: 2026-03-24

## Overview

Sammich is a satirical web app that translates plain English into absurdly overinflated, self-congratulatory LinkedIn-style posts. The tone is pure parody — no sliders, no modes, no fallbacks. Every translation treats the user's mundane input as a world-historical leadership breakthrough.

---

## Architecture

**Stack:** Next.js 14 (App Router), TypeScript, TailwindCSS
**AI:** Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` SDK
**Deployment:** Vercel, deployed from a new GitHub repository
**State:** Stateless — no database, no auth, no session storage

**Security boundary:** The Gemini API key is stored exclusively in:
- `.env.local` for local development (git-ignored)
- Vercel environment variables for production

The key is never sent to or accessible by the browser. All AI calls are proxied through a Next.js API route (Node.js runtime).

**Data flow:**
```
User types input → clicks "Translate"
  → POST /api/translate (server-side Node.js route)
    → Gemini API called with satirical system prompt
    → returns { post, hashtags }
  → output rendered in right panel
→ user clicks Share
  → share popover opens above the Share button with platform icons
  → each platform triggers its specific share method
  → all text-based shares include attribution footer
```

---

## UI Layout

**Desktop:** Two-column split, full viewport height, Google Translate-style.
- Left panel: input
- Right panel: output
- Thin vertical divider between panels

**Mobile:** Single column, input on top, output below. Full-width stacked layout.

**Header bar:** Full-width, contains "Sammich" wordmark and tagline: *"English → LinkedIn"*

### Left Panel (Input)
- Large borderless `<textarea>` filling the panel
- Placeholder: `"Type anything… (e.g. 'I ate a sandwich')"`
- Character counter shown below textarea (e.g., `142 / 500`)
- Maximum input length: **500 characters**
- **Translate button** pinned to bottom of panel
  - Disabled when input is empty or exceeds 500 characters; counter turns red above limit
  - Shows spinner during API call
  - On click: previous output in right panel is cleared immediately

### Right Panel (Output)
- Empty / greyed placeholder state before first translation
- After translation: styled as a LinkedIn post card
  - Static grey avatar silhouette + hardcoded display name "Alex P." — both are static constants in the component, not configurable
  - Post body rendered with `whitespace-pre-wrap` — line breaks are embedded by the AI as literal `\n` characters
  - Hashtags rendered below the post body in LinkedIn blue, smaller font, space-separated
- **Share button** pinned to bottom-left of panel — disabled until a successful translation is displayed
- **Copy button** to the right of the Share button — acts immediately on click with no popover; label changes to "Copied!" for 2 seconds then reverts to "Copy"

### Copy Format
The Copy button writes the following to the clipboard:
```
[post body]

[hashtags space-separated on one line]

Try Sammich. Plain English to LinkedIn translator — [NEXT_PUBLIC_APP_URL]
```
Blank line between post body and hashtags; blank line between hashtags and attribution footer.

### Share Popover
Opens **above** the Share button when clicked (only available after a successful translation).

**Dismissal:**
- Clicking anywhere outside the popover closes it
- An X button in the top-right corner of the popover closes it
- Clicking a share action closes the popover after triggering the action

**Desktop:** Horizontal row of platform icon buttons.
**Mobile:** Full-width grid (2–3 columns per row) as an inline expansion — no horizontal overflow on small screens.

| Platform | Method |
|---|---|
| LinkedIn | Copies full post body + `\n\n` + hashtags + `\n\n` + attribution to clipboard; opens `https://www.linkedin.com/feed/` in a new tab (`rel="noopener noreferrer"`); shows toast: *"Text copied — paste your post into LinkedIn"*. LinkedIn's share URL scheme does not support pre-filled text. |
| Twitter/X | Opens `https://twitter.com/intent/tweet?text=...` in a new tab (`rel="noopener noreferrer"`). Tweet text is constructed as: user's original input (not the generated post) + `\n\n` + `"Try Sammich: [NEXT_PUBLIC_APP_URL]"`. If the combined string exceeds 280 characters, truncate the user input at the last word boundary that fits, appending `…`. Hashtags are not included in the tweet. The attribution `"Try Sammich: [URL]"` always appears in full; it is never truncated. |
| Facebook | Opens `https://www.facebook.com/sharer/sharer.php?u=[NEXT_PUBLIC_APP_URL]` in a new tab (`rel="noopener noreferrer"`). Facebook's share URL only accepts a URL; no post text is pre-filled. |
| WhatsApp | Opens `https://wa.me/?text=...` URL-encoded with full post body + `\n\n` + hashtags + `\n\n` + attribution |
| Instagram | Immediately on click: copies full text + attribution to clipboard + triggers `html2canvas` screenshot capture + downloads result as `sammich-post.png`; share icon shows a spinner while `html2canvas` runs; on completion shows inline instruction: *"Text copied & image saved — open Instagram and paste"* |
| TikTok | Immediately on click: copies full text + attribution to clipboard + triggers `html2canvas` screenshot capture + downloads result as `sammich-post.png`; share icon shows a spinner while `html2canvas` runs; on completion shows inline instruction: *"Text copied & image saved — open TikTok and paste"* |

All external links open with `window.open(url, '_blank', 'noopener,noreferrer')` to prevent tab-napping.

**Attribution footer appended to all text-based shares (except Twitter/X which uses its own format):**
> Try Sammich. Plain English to LinkedIn translator — [NEXT_PUBLIC_APP_URL]

`NEXT_PUBLIC_APP_URL` is resolved in code as:
```ts
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
```
It is embedded at build time (public, not secret). In production it is set to the Vercel URL.

### Screenshot (Instagram / TikTok)
- `html2canvas` captures only the output post card element (not the full right panel)
- Rendered at `scale: 2` for retina-quality output
- Downloaded as `sammich-post.png`
- No forced aspect ratio — user crops within Instagram/TikTok as needed
- Known limitation: `html2canvas` may not render custom web fonts accurately. Fallback to system sans-serif is acceptable — pixel-perfect font fidelity is not required.

---

## AI Prompt Logic

**Model:** `gemini-2.0-flash`

**System prompt:**
```
You are an elite LinkedIn content creator operating at the highest possible level of self-amplification and narrative exaggeration.

Your task is to transform any user input into an extremely overinflated, self-congratulatory LinkedIn post that reframes even the most trivial action as a profound moment of growth, leadership, or transformation.

Rules:
- No profanity, nothing explicit or sexual
- Maintain a professional tone on the surface; underneath, be absurdly self-important and self-congratulatory
- Treat the user as the central figure in a meaningful journey
- Turn small actions into large philosophical or leadership insights
- Use dramatic structure and pacing

Writing style:
- Open with tension, reflection, or significance (dramatic hook)
- Expand a trivial action into a deep lesson about life, leadership, or success
- Position the author as someone who has grown, evolved, or operates at a higher level of awareness
- Generalize the experience into something that applies to everyone
- Subtly (or not subtly) imply excellence, discipline, or superiority
- End with a reflective or motivational statement
- Use short dramatic line breaks (literal newlines in output)
- Include at least one rhetorical question
- Overuse words like: growth, journey, discipline, consistency, leadership, clarity, alignment, impact, intentionality
- Imply that most people would not understand this level of thinking

Output format — respond ONLY with valid JSON, no markdown fencing, no prose, no explanation:
{
  "post": "the full satirical post text with literal \\n for line breaks",
  "hashtags": ["#Growth", "#Leadership", "#Discipline"]
}

Include 4-8 highly relevant, cliche LinkedIn hashtags.
```

**JSON parsing (server-side):**
- Server strips leading/trailing whitespace and code fences (` ```json ` / ` ``` `) before parsing
- If the raw response string exceeds **4,000 characters**, the server returns HTTP 500 with `{ error: "Response too large" }`
- If `JSON.parse` fails, returns HTTP 500 with `{ error: "Failed to parse AI response" }`
- Hashtag count is not validated server-side — passed through as-is (the prompt governs this)

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Empty input | Translate button disabled |
| Input over 500 chars | Translate button disabled, counter turns red |
| API error / malformed JSON | Inline error in output panel: *"Something went wrong. Try again."* |
| AI response over 4,000 chars | Inline error in output panel: *"Something went wrong. Try again."* |
| Rate limit hit (429) | Inline error in output panel: *"Too many requests. Slow down."* |
| Network failure (fetch rejects) | Inline error in output panel: *"Something went wrong. Try again."* |
| New translation while result shown | Previous output cleared immediately on click |
| Share clicked before translation | Share button disabled until successful translation displayed |
| Copy button clicked | Button label changes to "Copied!" for 2 seconds, reverts to "Copy" |

---

## Environment Variables

| Variable | Visibility | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Server-side only | Gemini API authentication — never exposed to browser |
| `NEXT_PUBLIC_APP_URL` | Public (build-time) | Live app URL in share attribution; code fallback: `http://localhost:3000` |
| `UPSTASH_REDIS_REST_URL` | Server-side only | Upstash Redis endpoint for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Server-side only | Upstash Redis auth token for rate limiting |

---

## Rate Limiting

The `/api/translate` route is publicly accessible with no authentication. To protect the free-tier Gemini API quota:

- **Implementation:** Vercel Edge Middleware (`middleware.ts` at project root, `export const runtime = 'edge'`) intercepts requests to `/api/translate` before they reach the Node.js route handler
- **Store:** Upstash Redis (Edge-compatible) via `@upstash/ratelimit` + `@upstash/redis`
- **Limit:** Max 10 requests per minute per IP address
- **IP extraction:** Use `request.ip` first; fall back to `x-forwarded-for` header. If IP is `undefined` or `::1` (local dev), skip rate limiting entirely
- **Response on limit:** Middleware returns HTTP 429 with `{ error: "Too many requests. Slow down." }` — the Node.js route is never invoked
- Free tier of Upstash Redis is sufficient for this use case

---

## Deployment

1. New GitHub repo created: `sammich`
2. Vercel project linked to repo
3. Environment variables set in Vercel dashboard:
   - `GEMINI_API_KEY` — from Google AI Studio
   - `NEXT_PUBLIC_APP_URL` — set to the assigned Vercel URL (e.g., `https://sammich.vercel.app`)
   - `UPSTASH_REDIS_REST_URL` — from Upstash dashboard
   - `UPSTASH_REDIS_REST_TOKEN` — from Upstash dashboard
4. Push to `main` triggers auto-deploy

---

## Out of Scope

- Multiple tone modes or sliders
- User accounts or history
- Analytics
- Dark mode (can be added later)
- Viral score or length adjustment buttons
- Custom domain (can be configured later in Vercel)
- Pixel-perfect screenshot fidelity for Instagram/TikTok shares
