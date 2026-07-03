/* Mock Interview Simulator — frontend */

const STORAGE_KEY = "mockinterview.sessions.v1";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  resumePdf: null,        // base64 string
  resumePdfName: null,
  analysis: null,         // {candidate_profile, role_profile, question_plan}
  transcript: [],         // [{speaker: "interviewer"|"candidate", text}]
  feedback: null,
  interviewDone: false
};

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const views = ["view-setup", "view-analysis", "view-interview", "view-feedback", "view-progress"];

function showView(id) {
  views.forEach((v) => $(v).classList.toggle("hidden", v !== id));
  $("nav-new").classList.toggle("active", id !== "view-progress");
  $("nav-progress").classList.toggle("active", id === "view-progress");
  window.scrollTo({ top: 0 });
}

function overlay(text) {
  if (text) {
    $("overlay-text").textContent = text;
    $("overlay").classList.remove("hidden");
  } else {
    $("overlay").classList.add("hidden");
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fillList(id, items, wrapSpan = false) {
  const list = $(id);
  list.innerHTML = "";
  (items || []).forEach((item) => {
    const li = el("li");
    if (wrapSpan) li.appendChild(el("span", null, item));
    else li.textContent = item;
    list.appendChild(li);
  });
}

async function api(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ---------------------------------------------------------------------------
// Session storage (cross-session tracking lives in this browser)
// ---------------------------------------------------------------------------
function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSession(record) {
  const sessions = loadSessions();
  sessions.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  updateSessionBadge();
}

function deleteSession(index) {
  const sessions = loadSessions();
  sessions.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  updateSessionBadge();
  renderProgress();
}

function updateSessionBadge() {
  const n = loadSessions().length;
  const badge = $("session-count");
  badge.textContent = n;
  badge.classList.toggle("hidden", n === 0);
}

// Compact per-session summary sent to the patterns endpoint.
function sessionSummaries() {
  return loadSessions().map((s) => ({
    date: s.date,
    role: s.role,
    questions: (s.feedback.per_question || []).map((q) => ({
      topic: q.question,
      type: q.type,
      strengths: q.strengths,
      weaknesses: q.weaknesses
    })),
    priorities: s.feedback.overall?.top_priorities || []
  }));
}

// ---------------------------------------------------------------------------
// Setup view
// ---------------------------------------------------------------------------
$("tab-pdf").addEventListener("click", () => setResumeTab("pdf"));
$("tab-text").addEventListener("click", () => setResumeTab("text"));

function setResumeTab(kind) {
  $("tab-pdf").classList.toggle("active", kind === "pdf");
  $("tab-text").classList.toggle("active", kind === "text");
  $("resume-pdf-panel").classList.toggle("hidden", kind !== "pdf");
  $("resume-text-panel").classList.toggle("hidden", kind !== "text");
}

const dropzone = $("dropzone");
$("resume-file").addEventListener("change", (e) => handlePdfFile(e.target.files[0]));
["dragover", "dragenter"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);
dropzone.addEventListener("drop", (e) => handlePdfFile(e.dataTransfer.files[0]));

function handlePdfFile(file) {
  if (!file) return;
  if (file.type !== "application/pdf") {
    setupError("Please upload a PDF file (or switch to the paste-text tab).");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.resumePdf = reader.result.split(",")[1]; // strip data: prefix
    state.resumePdfName = file.name;
    dropzone.classList.add("has-file");
    $("dropzone-label").textContent = `✓ ${file.name}`;
    setupError(null);
  };
  reader.readAsDataURL(file);
}

function setupError(msg) {
  const p = $("setup-error");
  p.textContent = msg || "";
  p.classList.toggle("hidden", !msg);
}

$("btn-analyze").addEventListener("click", async () => {
  const jd = $("jd-text").value.trim();
  const usingPdf = !$("resume-pdf-panel").classList.contains("hidden");
  const resumeText = $("resume-text").value.trim();

  let resume;
  if (usingPdf && state.resumePdf) {
    resume = { kind: "pdf", data: state.resumePdf };
  } else if (!usingPdf && resumeText) {
    resume = { kind: "text", text: resumeText };
  } else {
    setupError(usingPdf ? "Upload your resume PDF first (or paste it as text)." : "Paste your resume text first.");
    return;
  }
  if (!jd) {
    setupError("Paste the job description for the role you're interviewing for.");
    return;
  }
  setupError(null);

  overlay("Reading your resume and the job description, designing your interview…");
  try {
    const { analysis } = await api("/api/analyze", { resume, jobDescription: jd });
    state.analysis = analysis;
    renderAnalysis(analysis);
    showView("view-analysis");
  } catch (err) {
    setupError(err.message);
  } finally {
    overlay(null);
  }
});

// ---------------------------------------------------------------------------
// Analysis review view
// ---------------------------------------------------------------------------
function renderAnalysis(analysis) {
  $("analysis-title").textContent = `Prepping you for: ${analysis.role_profile.title}`;
  $("candidate-summary").textContent = analysis.candidate_profile.summary;
  fillList("candidate-skills", analysis.candidate_profile.skills);
  fillList("candidate-gaps", analysis.candidate_profile.gaps, true);
  fillList("role-requirements", analysis.role_profile.requirements);
  fillList("role-competencies", analysis.role_profile.competencies);
  fillList("role-redflags", analysis.role_profile.red_flags, true);

  $("plan-count").textContent = analysis.question_plan.length;
  const plan = $("question-plan");
  plan.innerHTML = "";
  analysis.question_plan.forEach((q) => {
    const li = el("li");
    const tag = el("span", `qtype ${q.type}`, q.type);
    li.appendChild(tag);
    li.appendChild(el("strong", null, q.topic));
    li.appendChild(el("div", "muted small", q.rationale));
    plan.appendChild(li);
  });
}

$("btn-back-setup").addEventListener("click", () => showView("view-setup"));

$("btn-start").addEventListener("click", async () => {
  state.transcript = [];
  state.feedback = null;
  state.interviewDone = false;
  $("chat").innerHTML = "";
  $("interview-role").textContent = state.analysis.role_profile.title;
  updateInterviewProgress(1, false);
  showView("view-interview");
  await nextInterviewerTurn();
});

// ---------------------------------------------------------------------------
// Interview view
// ---------------------------------------------------------------------------
function addBubble(speaker, text) {
  const bubble = el("div", `bubble ${speaker}`);
  bubble.appendChild(el("span", "speaker", speaker === "interviewer" ? "Interviewer" : "You"));
  bubble.appendChild(document.createTextNode(text));
  $("chat").appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth", block: "end" });
  return bubble;
}

function updateInterviewProgress(questionNumber, isFollowup) {
  const total = state.analysis.question_plan.length;
  const n = Math.min(questionNumber || 1, total);
  $("interview-progress").textContent =
    `Question ${n} of ${total}${isFollowup ? " — follow-up" : ""}`;
}

function interviewError(msg) {
  const p = $("interview-error");
  p.textContent = msg || "";
  p.classList.toggle("hidden", !msg);
}

async function nextInterviewerTurn() {
  interviewError(null);
  $("btn-send").disabled = true;
  const typing = addBubble("interviewer", "…");
  typing.classList.add("typing");
  try {
    const { turn } = await api("/api/interview", {
      analysis: state.analysis,
      transcript: state.transcript
    });
    typing.remove();
    addBubble("interviewer", turn.message);
    state.transcript.push({ speaker: "interviewer", text: turn.message });
    updateInterviewProgress(turn.question_number, turn.is_followup);
    if (turn.interview_complete) {
      state.interviewDone = true;
      await finishInterview();
    }
  } catch (err) {
    typing.remove();
    interviewError(`${err.message} — your answer wasn't lost; press Send to retry.`);
    // Roll back the last candidate answer into the input so retry re-sends it.
    const last = state.transcript[state.transcript.length - 1];
    if (last && last.speaker === "candidate") {
      state.transcript.pop();
      $("answer-input").value = last.text;
      const bubbles = $("chat").querySelectorAll(".bubble.candidate");
      if (bubbles.length) bubbles[bubbles.length - 1].remove();
    }
  } finally {
    $("btn-send").disabled = false;
  }
}

$("btn-send").addEventListener("click", sendAnswer);
$("answer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendAnswer();
});

async function sendAnswer() {
  if (state.interviewDone) return;
  const text = $("answer-input").value.trim();
  if (!text) return;
  stopMic();
  $("answer-input").value = "";
  addBubble("candidate", text);
  state.transcript.push({ speaker: "candidate", text });
  await nextInterviewerTurn();
}

$("btn-end-early").addEventListener("click", async () => {
  if (state.transcript.filter((t) => t.speaker === "candidate").length === 0) {
    showView("view-setup");
    return;
  }
  if (!confirm("End the interview now and get feedback on what you've answered so far?")) return;
  state.interviewDone = true;
  await finishInterview();
});

async function finishInterview() {
  stopMic();
  overlay("Interview complete — writing up your feedback…");
  try {
    const { feedback } = await api("/api/feedback", {
      analysis: state.analysis,
      transcript: state.transcript
    });
    state.feedback = feedback;
    saveSession({
      date: new Date().toISOString().slice(0, 10),
      role: state.analysis.role_profile.title,
      questionCount: feedback.per_question.length,
      feedback
    });
    renderFeedback(feedback);
    showView("view-feedback");
    loadFeedbackPatterns(); // fire-and-forget; fills in below the feedback
  } catch (err) {
    overlay(null);
    interviewError(`Couldn't generate feedback: ${err.message}`);
    state.interviewDone = false;
    return;
  }
  overlay(null);
}

// ---------------------------------------------------------------------------
// Voice input (Web Speech API)
// ---------------------------------------------------------------------------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let recognizing = false;
let baseText = "";

if (!SpeechRecognition) {
  $("btn-mic").title = "Voice input isn't supported in this browser — try Chrome or Edge.";
  $("btn-mic").style.opacity = "0.4";
}

$("btn-mic").addEventListener("click", () => {
  if (!SpeechRecognition) {
    micStatus("Voice input isn't supported in this browser — try Chrome or Edge.");
    return;
  }
  recognizing ? stopMic() : startMic();
});

function startMic() {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = navigator.language || "en-US";
  baseText = $("answer-input").value ? $("answer-input").value + " " : "";

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = 0; i < event.results.length; i++) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += chunk;
      else interimText += chunk;
    }
    $("answer-input").value = baseText + finalText + interimText;
  };
  recognition.onerror = (event) => {
    micStatus(
      event.error === "not-allowed"
        ? "Microphone access was blocked. Allow it in your browser settings."
        : `Voice input error: ${event.error}`
    );
    stopMic();
  };
  recognition.onend = () => {
    if (recognizing) stopMic();
  };

  recognition.start();
  recognizing = true;
  $("btn-mic").classList.add("recording");
  micStatus("Listening… click the mic again when you're done, then Send.");
}

function stopMic() {
  if (recognition) {
    recognizing = false;
    try { recognition.stop(); } catch { /* already stopped */ }
    recognition = null;
  }
  $("btn-mic").classList.remove("recording");
  micStatus(null);
}

function micStatus(msg) {
  const p = $("mic-status");
  p.textContent = msg || "";
  p.classList.toggle("hidden", !msg);
}

// ---------------------------------------------------------------------------
// Feedback view
// ---------------------------------------------------------------------------
function renderFeedback(feedback) {
  $("feedback-role").textContent =
    `${state.analysis.role_profile.title} — ${new Date().toLocaleDateString()}`;
  $("overall-summary").textContent = feedback.overall.summary;
  fillList("overall-strengths", feedback.overall.top_strengths);
  fillList("overall-priorities", feedback.overall.top_priorities, true);

  const wrap = $("per-question");
  wrap.innerHTML = "";
  feedback.per_question.forEach((q, i) => {
    const card = el("details", "qcard");
    if (i === 0) card.open = true;

    const summary = el("summary");
    summary.appendChild(el("span", `qtype ${q.type}`, q.type));
    summary.appendChild(el("span", null, `Q${i + 1}. ${q.question}`));
    card.appendChild(summary);

    const body = el("div", "qbody");

    const strengths = el("div", "fb-block strengths");
    strengths.appendChild(el("h4", null, "What worked"));
    const sList = el("ul");
    (q.strengths.length ? q.strengths : ["—"]).forEach((s) => sList.appendChild(el("li", null, s)));
    strengths.appendChild(sList);
    body.appendChild(strengths);

    const weaknesses = el("div", "fb-block weaknesses");
    weaknesses.appendChild(el("h4", null, "What fell short"));
    const wList = el("ul");
    (q.weaknesses.length ? q.weaknesses : ["—"]).forEach((w) => wList.appendChild(el("li", null, w)));
    weaknesses.appendChild(wList);
    body.appendChild(weaknesses);

    const stronger = el("div", "fb-block stronger");
    stronger.appendChild(el("h4", null, "A stronger answer"));
    stronger.appendChild(el("p", null, q.stronger_answer));
    body.appendChild(stronger);

    card.appendChild(body);
    wrap.appendChild(card);
  });
}

async function loadFeedbackPatterns() {
  const sessions = sessionSummaries();
  if (sessions.length < 2) return; // patterns need history
  try {
    const { patterns } = await api("/api/patterns", { sessions });
    if (!patterns.patterns.length) return;
    renderPatterns(patterns, $("feedback-patterns"));
    $("feedback-patterns-block").classList.remove("hidden");
  } catch {
    /* pattern insights are best-effort on the feedback page */
  }
}

function renderPatterns(result, container) {
  container.innerHTML = "";
  if (result.overall_trajectory) {
    const traj = el("div", "trajectory");
    traj.appendChild(el("strong", null, "Trajectory: "));
    traj.appendChild(document.createTextNode(result.overall_trajectory));
    container.appendChild(traj);
  }
  result.patterns.forEach((p) => {
    const card = el("div", "pattern-card");
    card.appendChild(el("h3", null, p.title));
    card.appendChild(el("p", "evidence", p.evidence));
    const why = el("p");
    why.appendChild(el("span", "label", "Why it happens: "));
    why.appendChild(document.createTextNode(p.why_it_happens));
    card.appendChild(why);
    const fix = el("p");
    fix.appendChild(el("span", "label", "How to fix it: "));
    fix.appendChild(document.createTextNode(p.how_to_fix));
    card.appendChild(fix);
    container.appendChild(card);
  });
}

$("btn-new-interview").addEventListener("click", () => showView("view-setup"));
$("btn-view-progress").addEventListener("click", () => {
  renderProgress();
  showView("view-progress");
});

// ---------------------------------------------------------------------------
// Progress view
// ---------------------------------------------------------------------------
$("nav-new").addEventListener("click", () => showView("view-setup"));
$("nav-progress").addEventListener("click", () => {
  renderProgress();
  showView("view-progress");
});

function renderProgress() {
  const sessions = loadSessions();
  const list = $("sessions-list");
  list.innerHTML = "";
  $("no-sessions").classList.toggle("hidden", sessions.length > 0);
  $("progress-patterns-wrap").classList.toggle("hidden", sessions.length < 2);

  sessions
    .slice()
    .reverse()
    .forEach((s, revIndex) => {
      const index = sessions.length - 1 - revIndex;
      const row = el("div", "session-row");
      const left = el("div");
      left.appendChild(el("div", "role", s.role));
      left.appendChild(
        el("div", "meta", `${s.date} · ${s.questionCount} questions · priorities: ${(s.feedback.overall?.top_priorities || []).slice(0, 2).join("; ") || "—"}`)
      );
      row.appendChild(left);
      const del = el("button", "del", "✕");
      del.title = "Delete this session";
      del.addEventListener("click", () => {
        if (confirm("Delete this saved session?")) deleteSession(index);
      });
      row.appendChild(del);
      list.appendChild(row);
    });
}

$("btn-analyze-patterns").addEventListener("click", async () => {
  const errEl = $("patterns-error");
  errEl.classList.add("hidden");
  overlay("Looking for patterns across your mock interviews…");
  try {
    const { patterns } = await api("/api/patterns", { sessions: sessionSummaries() });
    renderPatterns(patterns, $("progress-patterns"));
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  } finally {
    overlay(null);
  }
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
updateSessionBadge();
