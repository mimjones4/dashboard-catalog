// POST /api/analyze
// Start of a mock session: resume + job description -> candidate/role analysis
// and question plan. This is the paywall gate (one free session, then unlock)
// and the rate-limit checkpoint, since it's the expensive first Claude call.

import { json, error, validUuid, rateLimited } from "../../shared/http.js";
import { structuredCall, ClaudeError } from "../../shared/claude.js";
import { analysisSystemPrompt } from "../../shared/prompts.js";
import { analysisSchema } from "../../shared/schemas.js";
import { ensureUser, canStartSession, incrementSessionsStarted } from "../../shared/db.js";

export async function onRequestPost({ request, env }) {
  try {
    if (await rateLimited(env, request)) {
      return error("You're going a little fast — please wait a moment and try again.", 429);
    }

    const body = await request.json().catch(() => ({}));
    const { uuid, resume, jobDescription } = body;

    if (!validUuid(uuid)) return error("Missing or invalid session id.", 400);
    if (!resume || !jobDescription || !String(jobDescription).trim()) {
      return error("Both a resume and a job description are required.", 400);
    }

    // Paywall: one free session, then require the one-time unlock.
    const user = await ensureUser(env, uuid);
    if (!canStartSession(user)) {
      return json(
        { error: "You've used your free mock interview. Unlock unlimited sessions to continue.", needsUnlock: true },
        402
      );
    }

    // Build the resume + job-description content.
    const content = [];
    if (resume.kind === "pdf") {
      if (!resume.data) return error("Empty PDF upload.", 400);
      content.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: resume.data },
        title: "Candidate resume"
      });
      content.push({ type: "text", text: "The document above is the candidate's resume." });
    } else if (resume.kind === "text") {
      if (!resume.text || !String(resume.text).trim()) return error("Empty resume text.", 400);
      content.push({ type: "text", text: `CANDIDATE RESUME:\n\n${resume.text}` });
    } else {
      return error("resume.kind must be 'pdf' or 'text'.", 400);
    }
    content.push({
      type: "text",
      text: `JOB DESCRIPTION FOR THE ROLE THEY ARE INTERVIEWING FOR:\n\n${jobDescription}\n\nAnalyze the candidate against this role and design the mock interview.`
    });

    const analysis = await structuredCall({
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.CLAUDE_MODEL,
      system: analysisSystemPrompt(),
      messages: [{ role: "user", content }],
      schema: analysisSchema,
      effort: "high"
    });

    // Consume the free allowance only after a successful analysis, and only for
    // users who aren't unlocked (unlocked users have unlimited sessions).
    if (!user?.unlocked) {
      await incrementSessionsStarted(env, uuid);
    }

    return json({ analysis });
  } catch (err) {
    const status = err instanceof ClaudeError ? err.status : 500;
    return error(err.message || "Unexpected server error.", status);
  }
}
