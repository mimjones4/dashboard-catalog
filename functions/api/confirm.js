// GET /api/confirm?uuid=...&session_id=...
// Immediate, reliable unlock right after the Stripe redirect: retrieves the
// checkout session server-side, verifies it belongs to this uuid and is paid,
// then marks the user unlocked. The webhook is the durable backstop; this
// removes dependence on webhook timing for the happy path.

import { json, error, validUuid } from "../../shared/http.js";
import { markUnlocked, getUser } from "../../shared/db.js";
import { retrieveCheckoutSession } from "../../shared/stripe.js";

export async function onRequestGet({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY) return error("Payments are not configured.", 503);

    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    const sessionId = url.searchParams.get("session_id");
    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);
    if (!sessionId) return error("Missing checkout session id.", 400);

    // Already unlocked (e.g. webhook beat us here) — nothing to do.
    const current = await getUser(env, uuid);
    if (current?.unlocked) return json({ unlocked: true });

    const session = await retrieveCheckoutSession(env, sessionId);
    const matchesUser =
      session.client_reference_id === uuid || session.metadata?.uuid === uuid;
    if (!matchesUser) return error("This payment does not match your session.", 403);
    if (session.payment_status !== "paid") {
      return json({ unlocked: false, pending: true });
    }

    await markUnlocked(env, uuid, session.id);
    return json({ unlocked: true });
  } catch (err) {
    return error(err.message || "Could not confirm payment.", err.status || 502);
  }
}
