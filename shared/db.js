// D1 helpers for the anonymous-user paywall.
//
// Phase 1 tracks only what the paywall needs: how many mock sessions a UUID has
// started, and whether it has been unlocked by a one-time payment. Full
// cross-session history (Phase 2) will live in a separate `sessions` table.

export async function getUser(env, uuid) {
  const row = await env.DB.prepare(
    "SELECT uuid, sessions_started, unlocked, unlocked_at FROM users WHERE uuid = ?"
  )
    .bind(uuid)
    .first();
  return row || null;
}

// Insert the user if absent; returns the current row.
export async function ensureUser(env, uuid) {
  await env.DB.prepare(
    "INSERT INTO users (uuid) VALUES (?) ON CONFLICT(uuid) DO NOTHING"
  )
    .bind(uuid)
    .run();
  return getUser(env, uuid);
}

// Called after a new mock interview is successfully started, to consume the
// free allowance. No-op past the first session for locked users (they're
// blocked before reaching here) and irrelevant for unlocked users.
export async function incrementSessionsStarted(env, uuid) {
  await env.DB.prepare(
    "UPDATE users SET sessions_started = sessions_started + 1, updated_at = datetime('now') WHERE uuid = ?"
  )
    .bind(uuid)
    .run();
}

// Idempotent: marks the user unlocked and records the Stripe checkout session
// that paid for it. Safe to call from both the webhook and the confirm route.
export async function markUnlocked(env, uuid, stripeSessionId) {
  await env.DB.prepare(
    `UPDATE users
       SET unlocked = 1,
           unlocked_at = COALESCE(unlocked_at, datetime('now')),
           stripe_session_id = COALESCE(stripe_session_id, ?),
           updated_at = datetime('now')
     WHERE uuid = ?`
  )
    .bind(stripeSessionId || null, uuid)
    .run();
}

// True when the user may start a NEW mock session right now.
// One free session, then unlock required.
export function canStartSession(user) {
  if (!user) return true; // brand-new user gets the free one
  if (user.unlocked) return true;
  return (user.sessions_started || 0) < 1;
}
