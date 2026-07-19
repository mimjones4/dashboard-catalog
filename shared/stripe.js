// Stripe helpers using the REST API over fetch (no SDK) so they run on the
// Workers runtime. Webhook signatures are verified with Web Crypto.
//
// Secrets expected on env:
//   STRIPE_SECRET_KEY      - sk_live_... (Worker secret)
//   STRIPE_PRICE_ID        - price_...   (LIVE-mode one-time price for the $5.99 unlock)
//   STRIPE_WEBHOOK_SECRET  - whsec_...   (Worker secret; from the live webhook endpoint)

const STRIPE_API = "https://api.stripe.com/v1";

function form(params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) body.append(k, String(v));
  }
  return body;
}

async function stripeFetch(env, path, method, params) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params ? form(params) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Stripe API error (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

// Create a one-time-payment Checkout Session for the unlock.
// success_url carries {CHECKOUT_SESSION_ID} so the client can confirm the
// unlock immediately on return (webhook is the durable backstop).
export async function createCheckoutSession(env, { uuid, origin }) {
  return stripeFetch(env, "/checkout/sessions", "POST", {
    mode: "payment",
    "line_items[0][price]": env.STRIPE_PRICE_ID,
    "line_items[0][quantity]": 1,
    client_reference_id: uuid,
    "metadata[uuid]": uuid,
    success_url: `${origin}/?checkout={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancelled`
  });
}

export async function retrieveCheckoutSession(env, sessionId) {
  return stripeFetch(env, `/checkout/sessions/${encodeURIComponent(sessionId)}`, "GET");
}

// --- Webhook signature verification (Web Crypto, constant-time compare) ---

const encoder = new TextEncoder();

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a Stripe webhook signature and return the parsed event.
 * Throws on any verification failure.
 *
 * @param {string} payload   - raw request body text
 * @param {string} sigHeader - value of the Stripe-Signature header
 * @param {string} secret    - STRIPE_WEBHOOK_SECRET
 * @param {number} toleranceSeconds
 */
export async function verifyWebhook(payload, sigHeader, secret, toleranceSeconds = 300) {
  if (!sigHeader) throw new Error("Missing Stripe-Signature header");
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => {
      const idx = kv.indexOf("=");
      return [kv.slice(0, idx), kv.slice(idx + 1)];
    })
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) throw new Error("Malformed Stripe-Signature header");

  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > toleranceSeconds) {
    throw new Error("Webhook timestamp outside tolerance");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = toHex(signed);
  if (!timingSafeEqual(expected, v1)) throw new Error("Signature mismatch");

  return JSON.parse(payload);
}
