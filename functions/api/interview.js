// POST /api/interview
// Next interviewer turn. The client sends the running transcript; Claude (as the
// hiring manager) returns the next question/follow-up plus control flags.
// Not paywalled: the gate is at /api/analyze (the start of a session).

import { json, error, validUuid } from "../../shared/http.js";
import { structuredCall, ClaudeError } from "../../shared/claude.js";
import { interviewerSystemPrompt, KICKOFF_MESSAGE } from "../../shared/prompts.js";
import { interviewTurnSchema } from "../../shared/schemas.js";

function transcriptToMessages(transcript) {
  const messages = [{ role: "user", content: KICKOFF_MESSAGE }];
  for (const entry of transcript) {
    messages.push({
      role: entry.speaker === "interviewer" ? "assistant" : "user",
      content: entry.text
    });
  }
  return messages;
}

export async function onRequestPost({ request, env }) {
  try {
    const { uuid, analysis, transcript } = await request.json().catch(() => ({}));
    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);
    if (!analysis?.question_plan?.length) return error("Missing interview analysis.", 400);

    const turn = await structuredCall({
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.CLAUDE_MODEL,
      system: interviewerSystemPrompt(analysis),
      messages: transcriptToMessages(transcript || []),
      schema: interviewTurnSchema,
      effort: "medium" // conversational turns favor latency; the plan carries the depth
    });

    return json({ turn });
  } catch (err) {
    const status = err instanceof ClaudeError ? err.status : 500;
    return error(err.message || "Unexpected server error.", status);
  }
}
