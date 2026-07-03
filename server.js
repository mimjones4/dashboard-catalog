const path = require("path");
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const {
  analysisSchema,
  interviewTurnSchema,
  feedbackSchema,
  patternsSchema
} = require("./lib/schemas");
const {
  analysisSystemPrompt,
  interviewerSystemPrompt,
  KICKOFF_MESSAGE,
  feedbackSystemPrompt,
  patternsSystemPrompt
} = require("./lib/prompts");

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-8";
const PORT = process.env.PORT || 3000;

// Zero-arg client: resolves ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN / an
// `ant auth login` profile from the environment.
const client = new Anthropic();

const app = express();
app.use(express.json({ limit: "40mb" })); // resume PDFs arrive as base64 JSON
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Claude helpers
// ---------------------------------------------------------------------------

async function structuredCall({ system, messages, schema, effort = "high", maxTokens = 16000 }) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages,
    thinking: { type: "adaptive" },
    output_config: {
      effort,
      format: { type: "json_schema", schema }
    }
  });

  if (response.stop_reason === "refusal") {
    const why = response.stop_details?.explanation || "The model declined this request.";
    const err = new Error(why);
    err.status = 422;
    throw err;
  }
  if (response.stop_reason === "max_tokens") {
    const err = new Error("The response was cut off (max_tokens). Please try again.");
    err.status = 502;
    throw err;
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    const err = new Error("The model returned no text content.");
    err.status = 502;
    throw err;
  }
  return JSON.parse(textBlock.text);
}

function apiErrorToHttp(error) {
  if (error instanceof Anthropic.AuthenticationError) {
    return { status: 500, message: "Server is missing a valid ANTHROPIC_API_KEY." };
  }
  if (error instanceof Anthropic.RateLimitError) {
    return { status: 429, message: "Rate limited by the Claude API — wait a moment and try again." };
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return { status: 502, message: "Could not reach the Claude API. Check the server's network connection." };
  }
  if (error instanceof Anthropic.APIError) {
    return { status: 502, message: `Claude API error (${error.status}): ${error.message}` };
  }
  return { status: error.status || 500, message: error.message || "Unexpected server error." };
}

function handleError(res, error, context) {
  const { status, message } = apiErrorToHttp(error);
  console.error(`[${context}]`, error);
  res.status(status).json({ error: message });
}

// Rebuild the interviewer-side message array from the client's transcript.
// The transcript starts with the interviewer's greeting (assistant role), so a
// fixed kickoff user message keeps roles alternating correctly.
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

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Analyze resume + job description → candidate profile, role profile, question plan.
// body: { resume: { kind: "pdf", data: <base64> } | { kind: "text", text }, jobDescription }
app.post("/api/analyze", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body || {};
    if (!resume || !jobDescription?.trim()) {
      return res.status(400).json({ error: "Both a resume and a job description are required." });
    }

    const content = [];
    if (resume.kind === "pdf") {
      if (!resume.data) return res.status(400).json({ error: "Empty PDF upload." });
      content.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: resume.data },
        title: "Candidate resume"
      });
      content.push({ type: "text", text: "The document above is the candidate's resume." });
    } else if (resume.kind === "text") {
      if (!resume.text?.trim()) return res.status(400).json({ error: "Empty resume text." });
      content.push({ type: "text", text: `CANDIDATE RESUME:\n\n${resume.text}` });
    } else {
      return res.status(400).json({ error: "resume.kind must be 'pdf' or 'text'." });
    }
    content.push({
      type: "text",
      text: `JOB DESCRIPTION FOR THE ROLE THEY ARE INTERVIEWING FOR:\n\n${jobDescription}\n\nAnalyze the candidate against this role and design the mock interview.`
    });

    const analysis = await structuredCall({
      system: analysisSystemPrompt(),
      messages: [{ role: "user", content }],
      schema: analysisSchema
    });
    res.json({ analysis });
  } catch (error) {
    handleError(res, error, "analyze");
  }
});

// Next interviewer turn.
// body: { analysis, transcript: [{speaker: "interviewer"|"candidate", text}] }
app.post("/api/interview", async (req, res) => {
  try {
    const { analysis, transcript } = req.body || {};
    if (!analysis?.question_plan?.length) {
      return res.status(400).json({ error: "Missing interview analysis." });
    }

    const turn = await structuredCall({
      system: interviewerSystemPrompt(analysis),
      messages: transcriptToMessages(transcript || []),
      schema: interviewTurnSchema,
      effort: "medium" // conversational turns favor latency; the plan carries the depth
    });
    res.json({ turn });
  } catch (error) {
    handleError(res, error, "interview");
  }
});

// End-of-interview structured feedback.
// body: { analysis, transcript }
app.post("/api/feedback", async (req, res) => {
  try {
    const { analysis, transcript } = req.body || {};
    if (!analysis || !transcript?.length) {
      return res.status(400).json({ error: "Missing analysis or transcript." });
    }

    const transcriptText = transcript
      .map((e) => `${e.speaker === "interviewer" ? "INTERVIEWER" : "CANDIDATE"}: ${e.text}`)
      .join("\n\n");

    const feedback = await structuredCall({
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
      schema: feedbackSchema
    });
    res.json({ feedback });
  } catch (error) {
    handleError(res, error, "feedback");
  }
});

// Cross-session pattern analysis.
// body: { sessions: [{date, role, questions: [{topic, type, strengths, weaknesses}], priorities}] }
app.post("/api/patterns", async (req, res) => {
  try {
    const { sessions } = req.body || {};
    if (!sessions?.length) {
      return res.status(400).json({ error: "No past sessions provided." });
    }

    const patterns = await structuredCall({
      system: patternsSystemPrompt(),
      messages: [
        {
          role: "user",
          content:
            `PAST MOCK INTERVIEW SESSIONS (oldest first):\n${JSON.stringify(sessions, null, 2)}\n\n` +
            `Identify the cross-session patterns.`
        }
      ],
      schema: patternsSchema
    });
    res.json({ patterns });
  } catch (error) {
    handleError(res, error, "patterns");
  }
});

app.listen(PORT, () => {
  console.log(`Mock Interview Simulator running at http://localhost:${PORT}`);
  console.log(`Model: ${MODEL}`);
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.warn(
      "Warning: ANTHROPIC_API_KEY is not set. The SDK will fall back to an `ant auth login` profile if one exists; otherwise API calls will fail."
    );
  }
});
