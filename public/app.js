/* MockMentor — frontend (Phase 1) */

const UUID_KEY = "mockmentor.uuid";

// ---------------------------------------------------------------------------
// Anonymous identity (no login wall). One UUID per browser, used for the
// paywall check server-side.
// ---------------------------------------------------------------------------
function getUuid() {
  let id = localStorage.getItem(UUID_KEY);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || fallbackUuid();
    localStorage.setItem(UUID_KEY, id);
  }
  return id;
}
function fallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
const UUID = getUuid();

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  resumePdf: null,
  analysis: null,
  transcript: [],
  interviewDone: false,
  unlocked: false,
  freeSessionUsed: false
};

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const views = ["view-setup", "view-analysis", "view-interview", "view-feedback"];

function showView(id) {
  views.forEach((v) => $(v).classList.toggle("hidden", v !== id));
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

// api() always includes the uuid. Throws {message, needsUnlock} on failure.
async function api(path, body, method = "POST") {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (method === "POST") opts.body = JSON.stringify({ uuid: UUID, ...body });
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.needsUnlock = res.status === 402 || data.needsUnlock === true;
    throw err;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Paywall state
// ---------------------------------------------------------------------------
async function refreshStatus() {
  try {
    const s = await api(`/api/status?uuid=${encodeURIComponent(UUID)}`, null, "GET");
    state.unlocked = !!s.unlocked;
    state.freeSessionUsed = !!s.freeSessionUsed;
  } catch {
    /* status is best-effort; server still enforces the gate */
  }
  renderPaywallHints();
}

function renderPaywallHints() {
  $("unlock-pill").classList.toggle("hidden", !state.unlocked);
  const note = $("free-note");
  if (state.unlocked) {
    note.textContent = "Unlimited unlocked — interview as many times as you like.";
  } else if (state.freeSessionUsed) {
    note.textContent = "You've used your free mock. Starting a new one unlocks unlimited for a one-time $5.99.";
  } else {
    note.textContent = "Your first mock interview is free — no account needed.";
  }
}

function openUnlockModal() {
  $("unlock-error").classList.add("hidden");
  $("unlock-modal").classList.remove("hidden");
}
function closeUnlockModal() {
  $("unlock-modal").classList.add("hidden");
}
$("modal-close").addEventListener("click", closeUnlockModal);
$("unlock-modal").addEventListener("click", (e) => {
  if (e.target.id === "unlock-modal") closeUnlockModal();
});

$("btn-unlock").addEventListener("click", async () => {
  $("unlock-error").classList.add("hidden");
  $("btn-unlock").disabled = true;
  try {
    const data = await api("/api/checkout", {});
    if (data.alreadyUnlocked) {
      state.unlocked = true;
      renderPaywallHints();
      closeUnlockModal();
      return;
    }
    window.location.href = data.url; // → Stripe Checkout
  } catch (err) {
    const p = $("unlock-error");
    p.textContent = err.message;
    p.classList.remove("hidden");
    $("btn-unlock").disabled = false;
  }
});

// Handle the return from Stripe Checkout (?checkout=<session_id|cancelled>).
async function handleCheckoutReturn() {
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get("checkout");
  if (!checkout) return;
  // Clean the URL regardless of outcome.
  window.history.replaceState({}, "", window.location.pathname);
  if (checkout === "cancelled") return;

  overlay("Confirming your payment…");
  try {
    const data = await api(
      `/api/confirm?uuid=${encodeURIComponent(UUID)}&session_id=${encodeURIComponent(checkout)}`,
      null,
      "GET"
    );
    if (data.unlocked) {
      state.unlocked = true;
      renderPaywallHints();
    }
  } catch {
    /* webhook will still unlock; status refresh below will catch it */
  } finally {
    overlay(null);
  }
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
    state.resumePdf = reader.result.split(",")[1];
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

  // Client-side courtesy check; the server is the real gate.
  if (!state.unlocked && state.freeSessionUsed) {
    openUnlockModal();
    return;
  }

  overlay("Reading your resume and the job description, designing your interview…");
  try {
    const { analysis } = await api("/api/analyze", { resume, jobDescription: jd });
    state.analysis = analysis;
    state.freeSessionUsed = true; // this consumed the free session (if not unlocked)
    renderAnalysis(analysis);
    showView("view-analysis");
  } catch (err) {
    if (err.needsUnlock) {
      openUnlockModal();
    } else {
      setupError(err.message);
    }
  } finally {
    overlay(null);
    renderPaywallHints();
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
    li.appendChild(el("span", `qtype ${q.type}`, q.type));
    li.appendChild(el("strong", null, q.topic));
    li.appendChild(el("div", "muted small", q.rationale));
    plan.appendChild(li);
  });
}

$("btn-back-setup").addEventListener("click", () => showView("view-setup"));

$("btn-start").addEventListener("click", async () => {
  state.transcript = [];
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
  $("interview-progress").textContent = `Question ${n} of ${total}${isFollowup ? " — follow-up" : ""}`;
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
    renderFeedback(feedback);
    showView("view-feedback");
  } catch (err) {
    overlay(null);
    interviewError(`Couldn't generate feedback: ${err.message}`);
    state.interviewDone = false;
    return;
  }
  overlay(null);
}

// ---------------------------------------------------------------------------
// Voice input (Web Speech API) — carried from the prototype; text stays default
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
  $("feedback-role").textContent = `${state.analysis.role_profile.title} — ${new Date().toLocaleDateString()}`;
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

    const bodyEl = el("div", "qbody");

    const strengths = el("div", "fb-block strengths");
    strengths.appendChild(el("h4", null, "What worked"));
    const sList = el("ul");
    (q.strengths.length ? q.strengths : ["—"]).forEach((s) => sList.appendChild(el("li", null, s)));
    strengths.appendChild(sList);
    bodyEl.appendChild(strengths);

    const weaknesses = el("div", "fb-block weaknesses");
    weaknesses.appendChild(el("h4", null, "What fell short"));
    const wList = el("ul");
    (q.weaknesses.length ? q.weaknesses : ["—"]).forEach((w) => wList.appendChild(el("li", null, w)));
    weaknesses.appendChild(wList);
    bodyEl.appendChild(weaknesses);

    const stronger = el("div", "fb-block stronger");
    stronger.appendChild(el("h4", null, "A stronger answer"));
    stronger.appendChild(el("p", null, q.stronger_answer));
    bodyEl.appendChild(stronger);

    card.appendChild(bodyEl);
    wrap.appendChild(card);
  });
}

$("btn-new-interview").addEventListener("click", () => {
  // Starting another interview: gate here too so the modal appears up front.
  if (!state.unlocked && state.freeSessionUsed) {
    showView("view-setup");
    renderPaywallHints();
    openUnlockModal();
    return;
  }
  showView("view-setup");
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
(async function init() {
  await handleCheckoutReturn();
  await refreshStatus();
})();
