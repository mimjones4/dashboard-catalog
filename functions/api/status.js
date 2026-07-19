// GET /api/status?uuid=...
// Returns the paywall state so the client can render the right UI on load.

import { json, error, validUuid } from "../../shared/http.js";
import { getUser } from "../../shared/db.js";

export async function onRequestGet({ request, env }) {
  try {
    const uuid = new URL(request.url).searchParams.get("uuid");
    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);

    const user = await getUser(env, uuid);
    return json({
      unlocked: !!user?.unlocked,
      freeSessionUsed: (user?.sessions_started || 0) >= 1
    });
  } catch (err) {
    return error(err.message || "Unexpected server error.", 500);
  }
}
