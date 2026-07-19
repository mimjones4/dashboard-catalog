# Deploy runbook — MockMentor (Phase 1)

Everything below is done by **you** with authenticated Cloudflare + Stripe access. The code is already wired to read these bindings/secrets; nothing here needs code changes.

Prereqs: `npm install` (gets `wrangler`), and `wrangler login`.

---

## 1. Create the D1 database

```sh
wrangler d1 create mockmentor
```

Copy the printed `database_id` into `wrangler.toml` → `[[d1_databases]] database_id`.

Create the table (run for both local dev and remote):

```sh
npm run db:init:remote     # production D1
npm run db:init:local      # local `wrangler pages dev`
```

---

## 2. Create the Stripe product/price — LIVE MODE

> ⚠️ Do this with your account **in live mode**. Test-mode product/price IDs do **not** work in live mode, and vice-versa. Confirm the price id begins with `price_` and was created while the dashboard shows "live", not "test".

1. Toggle the Stripe dashboard to **live mode** (top-right).
2. **Products → Add product**: name it (e.g. "MockMentor unlock"), one-time price **$5.99 USD**. Save.
3. Copy the **price ID** (`price_...`). Sanity-check it's live: open it and confirm there's no "TEST" badge.

---

## 3. Create the live webhook endpoint

1. Still in **live mode**: **Developers → Webhooks → Add endpoint**.
2. URL: `https://<your-pages-domain>/api/stripe-webhook`
3. Events: `checkout.session.completed` (and optionally `checkout.session.async_payment_succeeded`).
4. Save, then copy the **Signing secret** (`whsec_...`).

---

## 4. Set the secrets

Set on the Pages project (repeat for `--env preview` if you use preview deploys):

```sh
wrangler pages secret put ANTHROPIC_API_KEY
wrangler pages secret put STRIPE_SECRET_KEY        # sk_live_...
wrangler pages secret put STRIPE_PRICE_ID          # price_...  (live)
wrangler pages secret put STRIPE_WEBHOOK_SECRET    # whsec_...  (live endpoint)
```

`CLAUDE_MODEL` is a non-secret var already set in `wrangler.toml` (defaults to `claude-opus-4-8`).

> Never commit any of these values. Live secret keys stay only in Cloudflare's secret store.

---

## 5. Rate limiting

Two layers, both recommended:

- **Application limiter** — the `RATE_LIMITER` binding in `wrangler.toml` throttles `/api/analyze` to ~12/min per IP. If your plan doesn't support the ratelimit binding, the code fails open (see next).
- **Dashboard WAF rule (authoritative)** — in the Cloudflare dashboard: **Security → WAF → Rate limiting rules → Create rule**. Match `URI Path` starts with `/api/`, e.g. 20 requests / 1 min per IP, action **Block**. This protects the free-session API cost surface even without any binding.

---

## 6. Deploy

Connect the repo to **Cloudflare Pages** (build output dir `public`; Functions are auto-detected from `functions/`), or push directly:

```sh
npm run deploy
```

---

## 7. Smoke test after deploy

1. Open the site → run one full mock interview (free session). Confirm analyze → interview turns → feedback all work.
2. Start a **second** interview → the unlock modal should appear (free session used).
3. Click **Unlock for $5.99** → complete Stripe checkout with a real card in live mode (you can refund yourself after).
4. On return you should land unlocked (the `/api/confirm` route), and a `checkout.session.completed` webhook should also arrive (Stripe dashboard → Webhooks → your endpoint → recent deliveries, 200 OK).
5. Verify D1: `wrangler d1 execute mockmentor --remote --command "SELECT uuid, sessions_started, unlocked FROM users LIMIT 5;"`

---

## AdSense (after Phase 1 is live)

The content pages (`/how-it-works.html`, `/tips/...`) already have reserved ad slots and a commented AdSense loader. Once approved:

1. Paste your `ca-pub-XXXX` loader `<script>` into the `<head>` of each content page (replace the commented block).
2. Replace each `<div class="ad-slot">Advertisement</div>` with your real `<ins class="adsbygoogle">` unit.
3. Leave the app itself (`index.html`) ad-free — ads live only on the content pages, never inside a live interview.
