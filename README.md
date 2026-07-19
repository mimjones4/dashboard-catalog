# 🎙️ MockMentor

Realistic AI mock interviews tailored to your resume and the exact job you're targeting — with follow-up questions, honest question-by-question feedback, and (Phase 2) cross-session pattern tracking. Built on the Cloudflare stack.

Upload your resume (PDF or text) and paste the full job description. MockMentor extracts your experience, skills, and gaps and the role's requirements, competencies, and red flags, then conducts an 8–10 question interview one question at a time — mixing behavioral, technical, and situational questions, probing with follow-ups when an answer is weak ("Can you give me a specific example?"), and closing with structured feedback: per question, what worked, what fell short, and a stronger sample answer built from your real background. Tone throughout is professional but warm — a senior hiring manager who wants you to succeed.

## Monetization

- **First mock interview is free**, no account or login.
- After that, a **one-time $5.99** (Stripe, live mode) unlocks unlimited interviews forever. No subscription — job hunting is a burst, so you pay once for your search.
- The paywall also serves as bot-abuse protection (a payment wall removes the incentive to hammer the free API).
- **AdSense** runs only on the static content pages (`/how-it-works.html`, `/tips/...`), never inside the app or a live interview. Those pages exist partly to give the site real written content, which AdSense expects.

## Architecture (Cloudflare)

- **Pages** — hosts the static frontend (`public/`) and the content pages.
- **Pages Functions** (`functions/api/*`) — the backend:
  - `analyze` — resume + JD → candidate/role analysis + question plan. **Paywall gate + rate-limit checkpoint.**
  - `interview` — next interviewer turn from the running transcript (control flags: `question_number`, `is_followup`, `interview_complete`).
  - `feedback` — full transcript → structured per-question + overall feedback.
  - `status` / `checkout` / `confirm` / `stripe-webhook` — the paywall: read unlock state, start Stripe Checkout, confirm on return, and durably unlock via signed webhook.
- **D1** — one `users` table keyed by an anonymous browser UUID, tracking free-session usage and unlock status. (Phase 2 adds a `sessions` history table for pattern tracking.)
- **Claude Opus 4.8** via the Anthropic Messages API (called with `fetch` from the Worker, structured outputs, adaptive thinking). The API key is a Worker secret and never reaches the client.

Shared logic lives in `shared/` (ESM modules imported by the Functions): `claude.js`, `prompts.js`, `schemas.js`, `db.js`, `stripe.js`, `http.js`.

## Local development

```sh
npm install
npm run db:init:local          # create the D1 table locally
# set secrets for local dev in a .dev.vars file (gitignored):
#   ANTHROPIC_API_KEY=sk-ant-...
#   STRIPE_SECRET_KEY=sk_test_...    (test mode is fine locally)
#   STRIPE_PRICE_ID=price_...        (a test-mode price)
#   STRIPE_WEBHOOK_SECRET=whsec_...
npm run dev                    # wrangler pages dev at http://localhost:8788
```

The interview loop works with just `ANTHROPIC_API_KEY`; the Stripe vars are only needed to exercise the paywall.

## Deploy

See **[DEPLOY.md](./DEPLOY.md)** for the full runbook: create D1, create the **live-mode** Stripe product/price and webhook, set secrets, configure rate limiting, deploy, and smoke-test.

## Roadmap

- **Phase 1 (this repo):** core loop — resume/JD analysis, 8–10 tailored questions one at a time, follow-ups, structured feedback — plus the free-then-$5.99 paywall (D1 + Stripe), rate limiting, and content pages. Voice input (Web Speech API, text-default fallback) is carried over from the prototype and already works.
- **Phase 2:** cross-session pattern tracking — persist completed sessions in D1 and surface recurring weaknesses ("you've stumbled on conflict-resolution questions in 3 of your last 4 mocks — here's why and how to fix it").
- **Phase 3:** harden voice input (questions read aloud + spoken answers), Chrome-primary, text always the fallback.
