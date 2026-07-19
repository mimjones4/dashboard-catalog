// POST /api/checkout
// Creates a Stripe Checkout Session for the one-time $5.99 unlock and returns
// its hosted URL for the client to redirect to.

import { json, error, validUuid } from "../../shared/http.js";
import { ensureUser } from "../../shared/db.js";
import { createCheckoutSession } from "../../shared/stripe.js";

export async function onRequestPost({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
      return error("Payments are not configured on this server yet.", 503);
    }

    const { uuid } = await request.json().catch(() => ({}));
    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);

    const existing = await ensureUser(env, uuid);
    if (existing?.unlocked) {
      return json({ alreadyUnlocked: true });
    }

    const origin = new URL(request.url).origin;
    const session = await createCheckoutSession(env, { uuid, origin });
    return json({ url: session.url });
  } catch (err) {
    return error(err.message || "Could not start checkout.", err.status || 502);
  }
}
