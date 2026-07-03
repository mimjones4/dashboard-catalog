# 🎙️ Mock Interview Simulator

Practice the interview before it counts. Upload your resume (PDF or pasted text) and the full job description for the role you're targeting, and get:

1. **Tailored analysis** — your experience, skills, and gaps extracted from the resume; the role's requirements, likely competencies, and red flags extracted from the job description.
2. **A realistic mock interview** — 8–10 role-specific questions (a mix of behavioral, technical, and situational, tuned to what *this* job actually requires), asked one at a time. Answer by typing or speaking. When an answer is weak, the interviewer asks realistic follow-ups ("Can you give me a specific example?") — just like the real thing.
3. **Structured feedback** — per question: strengths, weaknesses, and a sample stronger answer built from your real background; plus an overall summary and top priorities.
4. **Cross-session pattern tracking** — sessions are saved in your browser, and after two or more mocks the app surfaces recurring patterns ("You've stumbled on conflict-resolution questions in 3 of your last 4 mocks — here's why, and how to fix it").

The interviewer's tone is professional but warm — a senior hiring manager who wants you to succeed.

## Setup

Requires Node.js 18+ and an Anthropic API key.

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # or use `ant auth login`
npm start
```

Then open **http://localhost:3000**.

Optional environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Claude API key (the SDK also accepts `ANTHROPIC_AUTH_TOKEN` or an `ant auth login` profile) |
| `CLAUDE_MODEL` | `claude-opus-4-8` | Model used for all stages |
| `PORT` | `3000` | HTTP port |

## How it works

- **Server** (`server.js`): a small Express app that keeps your API key server-side and exposes four endpoints, each backed by a Claude call with structured outputs (`output_config.format`) so the UI always gets well-formed JSON:
  - `POST /api/analyze` — resume (PDF sent to Claude as a native base64 document block, or plain text) + job description → candidate profile, role profile, and an 8–10 question interview plan.
  - `POST /api/interview` — the interview loop. The client sends the running transcript; Claude, acting as the hiring manager, returns the next question or follow-up plus control flags (`question_number`, `is_followup`, `interview_complete`).
  - `POST /api/feedback` — full transcript → per-question strengths/weaknesses/stronger-answer feedback and an overall summary.
  - `POST /api/patterns` — compact summaries of past sessions → recurring patterns with evidence, root cause, and a concrete fix.
- **Client** (`public/`): vanilla JS single-page app. Voice answers use the browser's Web Speech API (Chrome/Edge). Completed sessions are stored in `localStorage` — nothing about your resume or answers is persisted on the server, and the server itself is stateless.

## Privacy notes

- Resume and transcript data are sent to the Anthropic API for processing and to your local server, but are not stored server-side.
- Cross-session history lives entirely in your browser's `localStorage`; delete individual sessions from the **My Progress** page.
