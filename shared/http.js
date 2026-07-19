// Small HTTP helpers shared by the Pages Functions.

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders }
  });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

// A client-supplied UUID identifies an anonymous user (no login wall).
// Accept only a plausible v4-ish UUID to keep the D1 key column clean.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validUuid(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

// Apply the Cloudflare rate-limiting binding if present. Fails open when the
// binding isn't configured (e.g. local dev), so the dashboard WAF rule remains
// the authoritative limiter in production.
export async function rateLimited(env, request) {
  const limiter = env.RATE_LIMITER;
  if (!limiter || typeof limiter.limit !== "function") return false;
  const key = request.headers.get("cf-connecting-ip") || "anon";
  try {
    const { success } = await limiter.limit({ key });
    return !success;
  } catch {
    return false; // never block on limiter failure
  }
}
