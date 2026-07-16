/* =================================================================
   Sprout — app logic
   -----------------------------------------------------------------
   All data lives in localStorage on the family's device. Content
   for the day is chosen deterministically from (baby's birth date,
   today's date), so it refreshes automatically each day and as the
   baby ages, without ever repeating two days in a row.
   ================================================================= */

(function () {
  "use strict";

  const STORE_KEY = "sprout.profile.v1";
  const LOG_KEY = "sprout.journal.v1";
  const DAY_MS = 24 * 60 * 60 * 1000;

  const $app = document.getElementById("app");

  // localStorage can be unavailable or throw (private mode, sandboxed
  // frames, quota). Fall back to an in-memory store so the app stays
  // fully usable for the session either way.
  const memStore = {};

  let state = {
    profile: loadJSON(STORE_KEY),   // { name, birthDate, dueDate, feeding, concerns[] }
    journal: loadJSON(LOG_KEY) || {}, // { "YYYY-MM-DD": { activityId: "tried" | "loved" } }
    tab: "today"
  };

  /* ---------------- storage ---------------- */

  function loadJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (memStore[key] || null);
    } catch (e) {
      return memStore[key] || null;
    }
  }

  function saveJSON(key, value) {
    memStore[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory-only */ }
  }

  function removeJSON(key) {
    delete memStore[key];
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  function saveProfile() { saveJSON(STORE_KEY, state.profile); }
  function saveJournal() { saveJSON(LOG_KEY, state.journal); }

  /* ---------------- dates & age ---------------- */

  function todayISO() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function parseISO(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d); // local midnight, avoids UTC off-by-one
  }

  function daysBetween(a, b) {
    return Math.floor((b.getTime() - a.getTime()) / DAY_MS);
  }

  // Completed weeks of age. If a due date is set (born 3+ weeks early),
  // content uses adjusted age while the display shows both.
  function getAges() {
    const now = parseISO(todayISO());
    const birth = parseISO(state.profile.birthDate);
    const actualDays = Math.max(0, daysBetween(birth, now));
    const actualWeeks = Math.floor(actualDays / 7);
    let contentWeeks = actualWeeks;
    let adjustedWeeks = null;
    if (state.profile.dueDate) {
      const due = parseISO(state.profile.dueDate);
      adjustedWeeks = Math.max(0, Math.floor(daysBetween(due, now) / 7));
      contentWeeks = adjustedWeeks;
    }
    return { actualDays, actualWeeks, adjustedWeeks, contentWeeks };
  }

  function ageSentence(ages) {
    const w = ages.actualWeeks;
    const months = Math.floor(ages.actualDays / 30.44);
    let s;
    if (w === 0) s = `${ages.actualDays} ${ages.actualDays === 1 ? "day" : "days"} old`;
    else if (w < 9) s = `${w} ${w === 1 ? "week" : "weeks"} old`;
    else s = `${w} weeks old (about ${months} ${months === 1 ? "month" : "months"})`;
    if (ages.adjustedWeeks !== null) {
      s += ` · ${ages.adjustedWeeks} ${ages.adjustedWeeks === 1 ? "week" : "weeks"} adjusted`;
    }
    return s;
  }

  function bandForWeeks(weeks) {
    return SPROUT.AGE_BANDS.find(b => weeks >= b.min && weeks <= b.max) ||
           SPROUT.AGE_BANDS[SPROUT.AGE_BANDS.length - 1];
  }

  /* ---------------- deterministic daily picks ---------------- */

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function dayNumber() {
    return Math.floor(parseISO(todayISO()).getTime() / DAY_MS);
  }

  // Rotate through a pool so consecutive days never repeat, with a
  // per-family offset so two families don't see identical sequences.
  function pickRotating(pool, salt) {
    if (!pool.length) return null;
    const offset = hashString(state.profile.birthDate + "|" + salt);
    return pool[(dayNumber() + offset) % pool.length];
  }

  function todaysActivities(band) {
    return ["tummy", "sensory", "language"].map(cat => {
      const pool = SPROUT.ACTIVITIES.filter(a => a.band === band.id && a.category === cat);
      return pickRotating(pool, cat);
    }).filter(Boolean);
  }

  function todaysSelfCare() {
    const concerns = state.profile.concerns || [];
    // Concern-tagged prompts appear twice in the pool so they surface
    // more often for the families they fit — never exclusively.
    const pool = [];
    SPROUT.SELF_CARE.forEach(p => {
      pool.push(p);
      if (p.tags.some(t => concerns.includes(t))) pool.push(p);
    });
    return pickRotating(pool, "selfcare");
  }

  function todaysPedQuestion(weeks) {
    const { feeding, concerns = [] } = state.profile;
    const inAge = SPROUT.PED_QUESTIONS.filter(q => weeks >= q.min && weeks <= q.max);
    const fits = q =>
      (!q.feeding || q.feeding.includes(feeding)) &&
      (!q.concerns || q.concerns.some(c => concerns.includes(c)));
    // Prefer questions matched to this family's concerns, then feeding
    // type, then general ones. Rotate weekly — pediatrician visits are
    // sparse, so the question holds steady within a week.
    const matched = inAge.filter(q => fits(q) && (q.concerns || q.feeding));
    const general = inAge.filter(q => !q.concerns && !q.feeding);
    const pool = matched.length ? matched.concat(general) : general;
    if (!pool.length) return SPROUT.PED_QUESTIONS[SPROUT.PED_QUESTIONS.length - 1];
    const offset = hashString(state.profile.birthDate + "|ped");
    const weekNumber = Math.floor(dayNumber() / 7);
    return pool[(weekNumber + offset) % pool.length];
  }

  /* ---------------- journal (tried / loved) ---------------- */

  function getMark(activityId) {
    const day = state.journal[todayISO()];
    return day ? day[activityId] || null : null;
  }

  function setMark(activityId, mark) {
    const iso = todayISO();
    if (!state.journal[iso]) state.journal[iso] = {};
    if (state.journal[iso][activityId] === mark) {
      delete state.journal[iso][activityId]; // tap again to unmark
      if (!Object.keys(state.journal[iso]).length) delete state.journal[iso];
    } else {
      state.journal[iso][activityId] = mark;
    }
    saveJournal();
    render();
  }

  /* ---------------- html helpers ---------------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ---------------- views ---------------- */

  function render() {
    $app.innerHTML = "";
    if (!state.profile || !state.profile.birthDate) {
      $app.appendChild(viewOnboarding());
      return;
    }
    if (state.tab === "today") $app.appendChild(viewToday());
    else if (state.tab === "journal") $app.appendChild(viewJournal());
    else $app.appendChild(viewSettings());
    $app.appendChild(viewTabbar());
  }

  /* ----- onboarding ----- */

  function viewOnboarding(existing) {
    const p = existing || { feeding: null, concerns: [] };
    const wrap = el(`<div></div>`);

    wrap.appendChild(el(`
      <div class="hero">
        <span class="leaf">🌱</span>
        <h1>${existing ? "Update your details" : "Welcome to Sprout"}</h1>
        <p>${existing
          ? "Change anything below — today's plan will follow along."
          : "A small daily companion for you and your baby: a few gentle ideas each day, matched to exactly where your little one is. Everything stays on this device."}</p>
      </div>
    `));

    const form = el(`<form novalidate></form>`);

    form.appendChild(el(`
      <div class="field">
        <label for="f-name">Baby's name <span class="hint">or nickname — optional</span></label>
        <input type="text" id="f-name" maxlength="40" value="${esc(p.name || "")}" placeholder="Little one" />
      </div>
    `));

    form.appendChild(el(`
      <div class="field">
        <label for="f-birth">Birth date</label>
        <input type="date" id="f-birth" max="${todayISO()}" value="${esc(p.birthDate || "")}" />
      </div>
    `));

    form.appendChild(el(`
      <div class="field">
        <label for="f-due">Due date <span class="hint">only if baby arrived more than 3 weeks early — we'll match activities to their adjusted age</span></label>
        <input type="date" id="f-due" value="${esc(p.dueDate || "")}" />
      </div>
    `));

    const feedField = el(`
      <div class="field">
        <label>How is baby fed?</label>
        <div class="chips" id="f-feeding"></div>
      </div>
    `);
    SPROUT.FEEDING_OPTIONS.forEach(opt => {
      const chip = el(`<button type="button" class="chip${p.feeding === opt.id ? " selected" : ""}" data-id="${opt.id}">${esc(opt.label)}</button>`);
      chip.addEventListener("click", () => {
        feedField.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
        chip.classList.add("selected");
      });
      feedField.querySelector("#f-feeding").appendChild(chip);
    });
    form.appendChild(feedField);

    const concernField = el(`
      <div class="field">
        <label>Anything on your mind? <span class="hint">pick any — we'll gently tailor things. Totally fine to pick none.</span></label>
        <div class="chips" id="f-concerns"></div>
      </div>
    `);
    SPROUT.CONCERN_OPTIONS.forEach(opt => {
      const on = (p.concerns || []).includes(opt.id);
      const chip = el(`<button type="button" class="chip${on ? " selected" : ""}" data-id="${opt.id}">${esc(opt.label)}</button>`);
      chip.addEventListener("click", () => chip.classList.toggle("selected"));
      concernField.querySelector("#f-concerns").appendChild(chip);
    });
    form.appendChild(concernField);

    const err = el(`<p class="form-error" role="alert"></p>`);
    form.appendChild(err);

    const actions = el(`<div class="form-actions"><button type="submit" class="btn-primary">${existing ? "Save changes" : "Let's begin"}</button></div>`);
    form.appendChild(actions);

    form.addEventListener("submit", e => {
      e.preventDefault();
      const birth = form.querySelector("#f-birth").value;
      const due = form.querySelector("#f-due").value;
      const feeding = feedField.querySelector(".chip.selected");
      const showErr = msg => { err.textContent = msg; err.classList.add("visible"); };

      if (!birth) return showErr("We just need baby's birth date to get started.");
      if (parseISO(birth) > parseISO(todayISO())) return showErr("That birth date is in the future — double-check the year, perhaps?");
      if (!feeding) return showErr("Pick a feeding style — there's no wrong answer here.");
      if (due && parseISO(due) <= parseISO(birth)) return showErr("The due date should come after the birth date for an early arrival.");

      state.profile = {
        name: form.querySelector("#f-name").value.trim(),
        birthDate: birth,
        dueDate: due || null,
        feeding: feeding.dataset.id,
        concerns: Array.from(concernField.querySelectorAll(".chip.selected")).map(c => c.dataset.id)
      };
      saveProfile();
      state.tab = "today";
      render();
      window.scrollTo(0, 0);
    });

    wrap.appendChild(form);
    return wrap;
  }

  /* ----- today ----- */

  function babyName() {
    return state.profile.name || "your baby";
  }

  function viewToday() {
    const wrap = el(`<div></div>`);
    const ages = getAges();
    const band = bandForWeeks(ages.contentWeeks);

    const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

    wrap.appendChild(el(`
      <header class="header">
        <span class="brand">🌱 Sprout</span>
        <span class="date">${esc(dateStr)}</span>
      </header>
    `));

    wrap.appendChild(el(`
      <div class="age-banner">
        <h1>${esc(cap(babyName()))} is ${esc(ageSentence(ages))}</h1>
        <p class="sub">The “${esc(band.label)}” days. Here's a little menu for today — use what fits, skip what doesn't. It refreshes tomorrow either way.</p>
      </div>
    `));

    // 1) Three activities
    todaysActivities(band).forEach(act => wrap.appendChild(activityCard(act)));

    // 2) Milestones this week
    wrap.appendChild(milestoneCard(band, ages));

    // 3) Self-care
    const sc = todaysSelfCare();
    wrap.appendChild(el(`
      <div class="card">
        <span class="eyebrow warm">A little care for you</span>
        <p>${esc(sc.text)}</p>
      </div>
    `));

    // 4) Pediatrician question
    const pq = todaysPedQuestion(ages.contentWeeks);
    wrap.appendChild(el(`
      <div class="card">
        <span class="eyebrow gold">For the next pediatrician visit</span>
        <p>“${esc(pq.text)}”</p>
        <p class="small muted">Questions rotate weekly — screenshot or jot down the ones that fit your family.</p>
      </div>
    `));

    wrap.appendChild(el(`
      <p class="foot-note">Sprout offers ideas, not medical advice — your pediatrician knows ${esc(cap(babyName()))} best. Everything you save stays on this device.</p>
    `));

    return wrap;
  }

  function activityCard(act) {
    const meta = SPROUT.CATEGORY_META[act.category];
    const mark = getMark(act.id);
    const concerns = state.profile.concerns || [];
    const noteKey = act.concernNotes && Object.keys(act.concernNotes).find(k => concerns.includes(k));

    const card = el(`
      <div class="card">
        <span class="eyebrow">${meta.icon} ${esc(meta.label)}</span>
        <h3>${esc(act.title)}</h3>
        <p class="why">${esc(act.why)}</p>
        <div class="versions">
          <div class="version"><span class="vlabel">Got 5 minutes</span>${esc(act.five)}</div>
          <div class="version"><span class="vlabel">Got 15 minutes</span>${esc(act.fifteen)}</div>
        </div>
        ${noteKey ? `<div class="concern-note">${esc(act.concernNotes[noteKey])}</div>` : ""}
        <div class="track-row">
          <button type="button" class="btn-track${mark === "tried" ? " active-tried" : ""}" data-mark="tried">${mark === "tried" ? "✓ We tried it" : "We tried it"}</button>
          <button type="button" class="btn-track${mark === "loved" ? " active-loved" : ""}" data-mark="loved">${mark === "loved" ? "💛 Baby loved it" : "Baby loved it 💛"}</button>
        </div>
      </div>
    `);

    card.querySelectorAll(".btn-track").forEach(btn => {
      btn.addEventListener("click", () => setMark(act.id, btn.dataset.mark));
    });

    return card;
  }

  function milestoneCard(band, ages) {
    const m = SPROUT.MILESTONES[band.id];
    const showMention = (state.profile.concerns || []).includes("milestones");
    return el(`
      <div class="card">
        <span class="eyebrow">🔭 This week's milestones</span>
        <h3>Week ${ages.contentWeeks}${ages.adjustedWeeks !== null ? " (adjusted)" : ""} · ${esc(m.heading)}</h3>
        <ul class="milestone-list">
          ${m.items.map(i => `<li>${esc(i)}</li>`).join("")}
        </ul>
        <p class="small" style="margin-bottom:8px;">${esc(m.note)}</p>
        <p class="reassure">${esc(SPROUT.MILESTONE_REASSURE)}${showMention ? " " + esc(SPROUT.MILESTONE_MENTION) : ""}</p>
      </div>
    `);
  }

  /* ----- journal ----- */

  function viewJournal() {
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <header class="header"><span class="brand">🌱 Sprout</span></header>
    `));
    wrap.appendChild(el(`
      <div class="age-banner">
        <h1>Your little archive</h1>
        <p class="sub">Everything you and ${esc(babyName())} have tried and loved. No streaks, no scores — just a record of showing up.</p>
      </div>
    `));

    const days = Object.keys(state.journal).sort().reverse();
    if (!days.length) {
      wrap.appendChild(el(`
        <div class="empty-state">
          <span class="icon">🍃</span>
          <p>Nothing here yet — and that's fine.<br/>When you mark an activity as tried or loved, it'll live here.</p>
        </div>
      `));
      return wrap;
    }

    const actById = {};
    SPROUT.ACTIVITIES.forEach(a => { actById[a.id] = a; });

    days.forEach(iso => {
      const dayEl = el(`<div class="journal-day"><h3>${esc(parseISO(iso).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }))}</h3></div>`);
      Object.entries(state.journal[iso]).forEach(([actId, mark]) => {
        const act = actById[actId];
        if (!act) return;
        const meta = SPROUT.CATEGORY_META[act.category];
        dayEl.appendChild(el(`
          <div class="journal-entry">
            <span class="mark">${mark === "loved" ? "💛" : "✓"}</span>
            <span class="what"><span class="cat">${esc(meta.label)}</span>${esc(act.title)}</span>
            <span class="small muted">${mark === "loved" ? "loved" : "tried"}</span>
          </div>
        `));
      });
      wrap.appendChild(dayEl);
    });

    return wrap;
  }

  /* ----- settings ----- */

  function viewSettings() {
    const wrap = el(`<div></div>`);
    wrap.appendChild(viewOnboarding(state.profile));

    const danger = el(`
      <div style="text-align:center; padding: 12px 0 24px;">
        <button type="button" class="btn-danger-quiet" id="btn-reset">Start completely fresh</button>
      </div>
    `);
    danger.querySelector("#btn-reset").addEventListener("click", () => {
      if (confirm("This clears baby's profile and the whole journal from this device. There's no undo — start fresh?")) {
        removeJSON(STORE_KEY);
        removeJSON(LOG_KEY);
        state = { profile: null, journal: {}, tab: "today" };
        render();
      }
    });
    wrap.appendChild(danger);
    return wrap;
  }

  /* ----- tab bar ----- */

  function viewTabbar() {
    const bar = el(`<nav class="tabbar" aria-label="Main"></nav>`);
    [
      { id: "today", icon: "🌤", label: "Today" },
      { id: "journal", icon: "📖", label: "Journal" },
      { id: "settings", icon: "🪴", label: "Settings" }
    ].forEach(t => {
      const btn = el(`<button type="button" class="tab${state.tab === t.id ? " active" : ""}"><span class="icon">${t.icon}</span>${t.label}</button>`);
      btn.addEventListener("click", () => {
        state.tab = t.id;
        render();
        window.scrollTo(0, 0);
      });
      bar.appendChild(btn);
    });
    return bar;
  }

  /* ---------------- misc ---------------- */

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Refresh content automatically when the date rolls over — either
  // at midnight while open, or when the tab is foregrounded again.
  let renderedFor = todayISO();
  function checkRollover() {
    if (todayISO() !== renderedFor) {
      renderedFor = todayISO();
      render();
    }
  }
  setInterval(checkRollover, 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkRollover();
  });

  render();
})();
