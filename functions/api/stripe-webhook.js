// POST /api/stripe-webhook
// Durable unlock path: Stripe posts checkout.session.completed here. We verify
// the signature (Web Crypto) and mark the user unlocked. Idempotent — safe if
// the /api/confirm route already unlocked them.

import { verifyWebhook } from "../../shared/stripe.js";
import { markUnlocked } from "../../shared/db.js";

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook not configured", { status: 503 });
  }

  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = await verifyWebhook(payload, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    // 400 tells Stripe the delivery failed verification; it will retry.
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      const uuid = session.client_reference_id || session.metadata?.uuid;
      if (uuid && session.payment_status === "paid") {
        await markUnlocked(env, uuid, session.id);
      }
    }
    // Acknowledge everything else so Stripe stops retrying.
    return new Response("ok", { status: 200 });
  } catch (err) {
    // 500 asks Stripe to retry later (e.g. transient D1 error).
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }
}
