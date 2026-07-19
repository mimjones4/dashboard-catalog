// POST /api/feedback
// End-of-interview structured feedback from the full transcript.

import { json, error, validUuid } from "../../shared/http.js";
import { structuredCall, ClaudeError } from "../../shared/claude.js";
import { feedbackSystemPrompt } from "../../shared/prompts.js";
import { feedbackSchema } from "../../shared/schemas.js";

export async function onRequestPost({ request, env }) {
  try {
    const { uuid, analysis, transcript } = await request.json().catch(() => ({}));
    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);
    if (!analysis || !transcript?.length) return error("Missing analysis or transcript.", 400);

    const transcriptText = transcript
      .map((e) => `${e.speaker === "interviewer" ? "INTERVIEWER" : "CANDIDATE"}: ${e.text}`)
      .join("\n\n");

    const feedback = await structuredCall({
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.CLAUDE_MODEL,
      system: feedbackSystemPrompt(),
      messages: [
        {
          role: "user",
          content:
            `CANDIDATE / ROLE ANALYSIS:\n${JSON.stringify(analysis, null, 2)}\n\n` +
            `FULL INTERVIEW TRANSCRIPT:\n\n${transcriptText}\n\n` +
            `Produce the structured feedback.`
        }
      ],
      schema: feedbackSchema,
      effort: "high"
    });

    return json({ feedback });
  } catch (err) {
    const status = err instanceof ClaudeError ? err.status : 500;
    return error(err.message || "Unexpected server error.", status);
  }
}
