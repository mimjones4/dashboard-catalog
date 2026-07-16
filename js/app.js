/* =================================================================
   Sprout — app logic (v2, "Nurture & Guide")
   -----------------------------------------------------------------
   Vanilla JS, no build step, no accounts. Everything stays on the
   device. Content is chosen deterministically from (birth date,
   today) so it refreshes as the baby ages, and never repeats two
   days running. This version adds: an activity library, a journal
   with notes, visible clinical sourcing, "good to know" notes, and
   a gentle, private parent check-in. See RESEARCH.md for the why.
   ================================================================= */

(function () {
  "use strict";

  const K_PROFILE = "sprout.profile.v1";
  const K_JOURNAL = "sprout.journal.v2";
  const K_JOURNAL_OLD = "sprout.journal.v1";
  const K_CHECKIN = "sprout.checkins.v1";
  const DAY_MS = 86400000;

  const $app = document.getElementById("app");
  const mem = {};

  /* ---------------- storage (resilient) ---------------- */
  function load(key) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : (mem[key] || null); }
    catch (e) { return mem[key] || null; }
  }
  function save(key, val) { mem[key] = val; try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function remove(key) { delete mem[key]; try { localStorage.removeItem(key); } catch (e) {} }

  /* ---------------- state ---------------- */
  const state = {
    profile: load(K_PROFILE),
    journal: migrateJournal(),
    checkins: load(K_CHECKIN) || [],
    tab: "today",
    libFilter: "all",
    careMode: "home",
    checkinAnswers: []
  };

  function migrateJournal() {
    let j = load(K_JOURNAL);
    if (j) return j;
    // migrate v1 { iso: { actId: mark } } → { iso: { marks:{}, note:"" } }
    const old = load(K_JOURNAL_OLD);
    j = {};
    if (old) {
      Object.keys(old).forEach(iso => { j[iso] = { marks: old[iso] || {}, note: "" }; });
      save(K_JOURNAL, j);
    }
    return j;
  }
  function saveProfile() { save(K_PROFILE, state.profile); }
  function saveJournal() { save(K_JOURNAL, state.journal); }
  function saveCheckins() { save(K_CHECKIN, state.checkins); }

  /* ---------------- dates & age ---------------- */
  function todayISO() {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
  }
  function parseISO(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
  function daysBetween(a, b) { return Math.floor((b - a) / DAY_MS); }

  function getAges() {
    const now = parseISO(todayISO());
    const birth = parseISO(state.profile.birthDate);
    const actualDays = Math.max(0, daysBetween(birth, now));
    const actualWeeks = Math.floor(actualDays / 7);
    let contentWeeks = actualWeeks, adjustedWeeks = null;
    if (state.profile.dueDate) {
      adjustedWeeks = Math.max(0, Math.floor(daysBetween(parseISO(state.profile.dueDate), now) / 7));
      contentWeeks = adjustedWeeks;
    }
    return { actualDays, actualWeeks, adjustedWeeks, contentWeeks };
  }
  function ageSentence(a) {
    const w = a.actualWeeks, months = Math.floor(a.actualDays / 30.44);
    let s;
    if (w === 0) s = a.actualDays + (a.actualDays === 1 ? " day old" : " days old");
    else if (w < 9) s = w + (w === 1 ? " week old" : " weeks old");
    else s = w + " weeks (" + months + " mo)";
    if (a.adjustedWeeks !== null) s += " · " + a.adjustedWeeks + "w adjusted";
    return s;
  }
  function bandForWeeks(w) {
    return SPROUT.AGE_BANDS.find(b => w >= b.min && w <= b.max) || SPROUT.AGE_BANDS[SPROUT.AGE_BANDS.length - 1];
  }

  /* ---------------- deterministic picks ---------------- */
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function dayNumber() { return Math.floor(parseISO(todayISO()).getTime() / DAY_MS); }
  function pickRotating(pool, salt, period) {
    if (!pool.length) return null;
    const offset = hash(state.profile.birthDate + "|" + salt);
    const n = period === "week" ? Math.floor(dayNumber() / 7) : dayNumber();
    return pool[(n + offset) % pool.length];
  }
  function todaysActivities(band) {
    return ["tummy", "sensory", "language"].map(cat =>
      pickRotating(SPROUT.ACTIVITIES.filter(a => a.band === band.id && a.category === cat), cat)
    ).filter(Boolean);
  }
  function todaysSelfCare() {
    const concerns = state.profile.concerns || [];
    const pool = [];
    SPROUT.SELF_CARE.forEach(p => { pool.push(p); if (p.tags.some(t => concerns.includes(t))) pool.push(p); });
    return pickRotating(pool, "selfcare");
  }
  function todaysClinicalNote(weeks) {
    const pool = SPROUT2.CLINICAL_NOTES.filter(n => weeks >= n.min && weeks <= n.max);
    return pickRotating(pool.length ? pool : SPROUT2.CLINICAL_NOTES, "clinical");
  }
  function todaysPedQuestion(weeks) {
    const { feeding, concerns = [] } = state.profile;
    const inAge = SPROUT.PED_QUESTIONS.filter(q => weeks >= q.min && weeks <= q.max);
    const fits = q => (!q.feeding || q.feeding.includes(feeding)) && (!q.concerns || q.concerns.some(c => concerns.includes(c)));
    const matched = inAge.filter(q => fits(q) && (q.concerns || q.feeding));
    const general = inAge.filter(q => !q.concerns && !q.feeding);
    const pool = matched.length ? matched.concat(general) : general;
    if (!pool.length) return SPROUT.PED_QUESTIONS[SPROUT.PED_QUESTIONS.length - 1];
    return pool[(Math.floor(dayNumber() / 7) + hash(state.profile.birthDate + "|ped")) % pool.length];
  }

  /* ---------------- journal helpers ---------------- */
  function day(iso) { if (!state.journal[iso]) state.journal[iso] = { marks: {}, note: "" }; return state.journal[iso]; }
  function getMark(actId, iso) { const d = state.journal[iso || todayISO()]; return d && d.marks ? d.marks[actId] || null : null; }
  function toggleMark(actId, mark) {
    const d = day(todayISO());
    if (d.marks[actId] === mark) delete d.marks[actId]; else d.marks[actId] = mark;
    cleanDay(todayISO()); saveJournal();
  }
  function setNote(iso, text) { const d = day(iso); d.note = text; cleanDay(iso); saveJournal(); }
  function cleanDay(iso) {
    const d = state.journal[iso];
    if (d && !Object.keys(d.marks).length && !(d.note && d.note.trim())) delete state.journal[iso];
  }

  /* ---------------- html helpers ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function babyName() { return state.profile.name || "your baby"; }
  function catMeta(cat) { return SPROUT.CATEGORY_META[cat]; }
  function catColor(cat) { return cat === "tummy" ? "sage" : cat === "sensory" ? "slate" : "terra"; }
  function art(act) { return SPROUT2.ART[act.id] || SPROUT2.ART[act.category] || "🌱"; }

  /* ---------------- source bottom sheet ---------------- */
  function openSource(key) {
    const s = SPROUT2.SOURCES[key];
    if (!s) return;
    const scrim = el(`<div class="sheet-scrim"></div>`);
    const linkHtml = s.url ? `<div class="src-meta"><strong>${esc(s.body)}</strong> — ${esc(s.cite)}<br/><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a></div>` : `<div class="src-meta"><strong>${esc(s.body)}</strong></div>`;
    scrim.appendChild(el(`
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(s.title)}">
        <div class="grab"></div>
        <h3>${esc(s.title)}</h3>
        <p class="src-body">${esc(s.text)}</p>
        ${linkHtml}
        <p class="src-disc">Sprout shares ideas and general guidance, not medical advice. Your pediatrician knows ${esc(cap(babyName()))} best.</p>
        <div style="padding-top:16px"><button class="btn btn-tonal" data-close style="width:100%">Got it</button></div>
      </div>`));
    const close = () => scrim.remove();
    scrim.addEventListener("click", e => { if (e.target === scrim || e.target.hasAttribute("data-close")) close(); });
    document.body.appendChild(scrim);
  }
  function sourceLink(key, label) {
    const b = el(`<button class="source-link" type="button">ⓘ ${esc(label || "Why this")}</button>`);
    b.addEventListener("click", () => openSource(key));
    return b;
  }

  /* ---------------- shared components ---------------- */
  function buildDurBlock(act) {
    const wrap = el(`<div></div>`);
    const row = el(`<div class="dur-row"></div>`);
    const detail = el(`<div class="dur-detail"></div>`);
    let cur = "5";
    const render = () => {
      detail.textContent = cur === "5" ? act.five : act.fifteen;
      row.querySelectorAll(".dur").forEach(b => b.classList.toggle("active", b.dataset.d === cur));
    };
    ["5", "15"].forEach(d => {
      const b = el(`<button class="dur" type="button" data-d="${d}">Got ${d} min</button>`);
      b.addEventListener("click", () => { cur = d; render(); });
      row.appendChild(b);
    });
    render();
    wrap.appendChild(row); wrap.appendChild(detail);
    return wrap;
  }
  function buildTrackRow(actId) {
    const row = el(`<div class="track-row"></div>`);
    const mk = (mark, onLabel, offLabel, onClass) => {
      const b = el(`<button class="chip-track" type="button"></button>`);
      const paint = () => {
        const on = getMark(actId) === mark;
        b.className = "chip-track" + (on ? " " + onClass : "");
        b.innerHTML = on ? onLabel : offLabel;
      };
      b.addEventListener("click", () => { toggleMark(actId, mark); paint(); });
      paint();
      return b;
    };
    row.appendChild(mk("tried", "✓ We tried it", "We tried it", "on-tried"));
    row.appendChild(mk("loved", "💛 Baby loved it", "Baby loved it", "on-loved"));
    return row;
  }
  function concernNote(act) {
    const concerns = state.profile.concerns || [];
    const key = act.concernNotes && Object.keys(act.concernNotes).find(k => concerns.includes(k));
    return key ? el(`<div class="concern-note">${esc(act.concernNotes[key])}</div>`) : null;
  }

  /* ---------------- topbar ---------------- */
  function topbar() {
    const ages = getAges();
    const initial = state.profile.name ? esc(state.profile.name.trim().charAt(0).toUpperCase()) : "";
    const bar = el(`
      <div class="topbar">
        <div class="avatar">${initial ? initial : '<span class="emoji">👶</span>'}</div>
        <div class="who">
          <div class="name">${esc(state.profile.name ? cap(state.profile.name) : "Little one")}</div>
          <div class="age">${esc(ageSentence(ages))}</div>
        </div>
        <button class="icon-btn" data-settings aria-label="Settings">⚙️</button>
      </div>`);
    bar.querySelector("[data-settings]").addEventListener("click", () => go("settings"));
    return bar;
  }

  /* ---------------- render root ---------------- */
  function render() {
    $app.innerHTML = "";
    if (!state.profile || !state.profile.birthDate) { $app.appendChild(viewOnboarding()); return; }
    const v = state.tab === "today" ? viewToday()
      : state.tab === "library" ? viewLibrary()
      : state.tab === "journal" ? viewJournal()
      : state.tab === "care" ? viewCare()
      : viewSettings();
    $app.appendChild(v);
    if (state.tab !== "settings") $app.appendChild(tabbar());
  }
  function go(tab) { state.tab = tab; if (tab === "care") state.careMode = "home"; render(); window.scrollTo(0, 0); }

  /* ================= ONBOARDING ================= */
  function viewOnboarding(existing) {
    const p = existing || { feeding: null, concerns: [] };
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="hero">
        <span class="leaf">🌱</span>
        <h1>${existing ? "Your details" : "Welcome to Sprout"}</h1>
        <p>${existing ? "Change anything below — today will follow along." : "A calm daily companion for you and your baby: a few gentle, age-matched ideas, milestones to enjoy, a little care for you — and everything grounded in trusted guidance. It all stays private on this device."}</p>
      </div>`));
    const form = el(`<form novalidate></form>`);
    form.appendChild(el(`<div class="field"><label for="f-name">Baby's name <span class="hint">or a nickname — optional</span></label><input type="text" id="f-name" maxlength="40" value="${esc(p.name || "")}" placeholder="Little one" /></div>`));
    form.appendChild(el(`<div class="field"><label for="f-birth">Birth date</label><input type="date" id="f-birth" max="${todayISO()}" value="${esc(p.birthDate || "")}" /></div>`));

    const early = el(`
      <div class="field">
        <div class="toggle-row">
          <label class="switch"><input type="checkbox" id="f-early" ${p.dueDate ? "checked" : ""}/><span class="slider"></span></label>
          <label for="f-early" style="margin:0">Baby arrived 3+ weeks early</label>
        </div>
        <div id="due-wrap" style="margin-top:14px; ${p.dueDate ? "" : "display:none"}">
          <label for="f-due">Original due date <span class="hint">we'll match activities & milestones to adjusted age</span></label>
          <input type="date" id="f-due" value="${esc(p.dueDate || "")}" />
        </div>
      </div>`);
    early.querySelector("#f-early").addEventListener("change", e => {
      early.querySelector("#due-wrap").style.display = e.target.checked ? "block" : "none";
    });
    form.appendChild(early);

    const feed = el(`<div class="field"><label>How is baby fed?</label><div class="chips" id="f-feeding"></div></div>`);
    SPROUT.FEEDING_OPTIONS.forEach(o => {
      const c = el(`<button type="button" class="chip${p.feeding === o.id ? " selected" : ""}" data-id="${o.id}">${esc(o.label)}</button>`);
      c.addEventListener("click", () => { feed.querySelectorAll(".chip").forEach(x => x.classList.remove("selected")); c.classList.add("selected"); });
      feed.querySelector("#f-feeding").appendChild(c);
    });
    form.appendChild(feed);

    const conc = el(`<div class="field"><label>What's on your mind? <span class="hint">pick any, or none — we'll gently tailor things</span></label><div class="chips" id="f-conc"></div></div>`);
    SPROUT.CONCERN_OPTIONS.forEach(o => {
      const on = (p.concerns || []).includes(o.id);
      const c = el(`<button type="button" class="chip${on ? " selected" : ""}" data-id="${o.id}">${esc(o.label)}</button>`);
      c.addEventListener("click", () => c.classList.toggle("selected"));
      conc.querySelector("#f-conc").appendChild(c);
    });
    form.appendChild(conc);

    const err = el(`<p class="form-error" role="alert"></p>`);
    form.appendChild(err);
    form.appendChild(el(`<div class="form-actions"><button type="submit" class="btn btn-primary">${existing ? "Save changes" : "Let's begin"}</button></div>`));

    form.addEventListener("submit", e => {
      e.preventDefault();
      const birth = form.querySelector("#f-birth").value;
      const earlyOn = form.querySelector("#f-early").checked;
      const due = earlyOn ? form.querySelector("#f-due").value : "";
      const feeding = feed.querySelector(".chip.selected");
      const fail = m => { err.textContent = m; err.classList.add("visible"); };
      if (!birth) return fail("We just need baby's birth date to begin.");
      if (parseISO(birth) > parseISO(todayISO())) return fail("That birth date is in the future — check the year?");
      if (!feeding) return fail("Pick a feeding style — there's no wrong answer here.");
      if (earlyOn && !due) return fail("Add the original due date, or switch off the early-arrival toggle.");
      if (due && parseISO(due) <= parseISO(birth)) return fail("The due date should be after the birth date for an early arrival.");
      state.profile = {
        name: form.querySelector("#f-name").value.trim(),
        birthDate: birth, dueDate: due || null,
        feeding: feeding.dataset.id,
        concerns: Array.from(conc.querySelectorAll(".chip.selected")).map(c => c.dataset.id)
      };
      saveProfile(); go("today");
    });
    wrap.appendChild(form);
    return wrap;
  }

  /* ================= TODAY ================= */
  function greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }

  function viewToday() {
    const wrap = el(`<div></div>`);
    const ages = getAges();
    const band = bandForWeeks(ages.contentWeeks);
    wrap.appendChild(topbar());
    wrap.appendChild(el(`
      <div class="page-intro">
        <h1>${esc(greeting())}.</h1>
        <p>The “${esc(band.label)}” days. A little menu for today — use what fits, skip the rest. It refreshes tomorrow.</p>
      </div>`));

    // Activities
    wrap.appendChild(el(`<div class="section-head"><h2>Today's activities</h2></div>`));
    const car = el(`<div class="carousel"></div>`);
    todaysActivities(band).forEach(a => car.appendChild(activityCard(a)));
    const viewAll = el(`<button class="activity-card" style="flex-basis:60%;align-items:center;justify-content:center;cursor:pointer;color:var(--primary);gap:8px" type="button"><div style="text-align:center;padding:20px"><div style="font-size:30px">✨</div><div style="font-family:var(--font-display);font-weight:600;margin-top:8px">See all activities<br/>for this age</div></div></button>`);
    viewAll.addEventListener("click", () => go("library"));
    car.appendChild(viewAll);
    wrap.appendChild(car);

    // Milestones
    wrap.appendChild(milestoneCard(band, ages));

    // Good to know
    const note = todaysClinicalNote(ages.contentWeeks);
    if (note) {
      const c = el(`
        <div class="card tint-slate">
          <div class="card-head"><div class="badge slate">💡</div><div><span class="eyebrow">Good to know</span></div></div>
          <h3 style="margin-bottom:8px">${esc(note.title)}</h3>
          <p class="muted" style="font-size:15px">${esc(note.body)}</p>
        </div>`);
      c.appendChild(sourceLink(note.source, "Based on " + SPROUT2.SOURCES[note.source].body));
      wrap.appendChild(c);
    }

    // Self-care teaser
    const sc = todaysSelfCare();
    const scCard = el(`
      <div class="card tint-terra">
        <div class="card-head"><div class="badge terra">🌸</div><div><span class="eyebrow" style="color:var(--secondary)">A little care for you</span></div></div>
        <p class="body-lg" style="margin-bottom:14px">${esc(sc.text)}</p>
      </div>`);
    const scBtn = el(`<button class="link-btn" type="button" style="padding-left:0">More for you →</button>`);
    scBtn.addEventListener("click", () => go("care"));
    scCard.appendChild(scBtn);
    wrap.appendChild(scCard);

    // Pediatrician question
    wrap.appendChild(pedCard(ages.contentWeeks));

    wrap.appendChild(el(`<p class="foot-note">Sprout offers ideas and general guidance, not medical advice — your pediatrician knows ${esc(cap(babyName()))} best. Everything stays on this device.</p>`));
    return wrap;
  }

  function activityCard(act) {
    const meta = catMeta(act.category), color = catColor(act.category);
    const dotColor = color === "sage" ? "var(--primary)" : color === "slate" ? "var(--tertiary)" : "var(--secondary)";
    const heroBg = color === "sage" ? "var(--primary-tint)" : color === "slate" ? "var(--tertiary-tint)" : "var(--secondary-tint)";
    const card = el(`
      <div class="activity-card">
        <div class="activity-hero" style="background:${heroBg}">
          <span class="cat-pill"><span class="dot" style="background:${dotColor}"></span>${esc(meta.label)}</span>
          <span class="art">${art(act)}</span>
        </div>
        <div class="activity-body">
          <h3>${esc(act.title)}</h3>
          <p class="activity-why">${esc(act.why)}</p>
        </div>
      </div>`);
    const body = card.querySelector(".activity-body");
    body.appendChild(buildDurBlock(act));
    const cn = concernNote(act); if (cn) body.appendChild(cn);
    body.appendChild(buildTrackRow(act.id));
    body.appendChild(sourceLink(SPROUT2.CATEGORY_SOURCE[act.category], "Why this helps"));
    return card;
  }

  function milestoneCard(band, ages) {
    const m = SPROUT.MILESTONES[band.id];
    const c = el(`
      <div class="card">
        <div class="card-head"><div class="badge slate">🔭</div><div><span class="eyebrow">This week's milestones</span></div></div>
        <h3 style="margin-bottom:10px">Week ${ages.contentWeeks}${ages.adjustedWeeks !== null ? " (adjusted)" : ""} — ${esc(m.heading)}</h3>
        <ul class="milestone-list">${m.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        <div class="note-soft">${esc(m.note)}</div>
        <p class="reassure">${esc(SPROUT.MILESTONE_REASSURE)}</p>
        <div class="gut-check"><span class="ic">💬</span><span>${esc(SPROUT.MILESTONE_MENTION)}</span></div>
      </div>`);
    c.appendChild(sourceLink("cdc-milestones", "How these are framed"));
    return c;
  }

  function pedCard(weeks) {
    const q = todaysPedQuestion(weeks);
    const ans = SPROUT2.PED_ANSWERS[q.id];
    const tag = q.concerns ? SPROUT.CONCERN_OPTIONS.find(o => (q.concerns || []).includes(o.id)) : null;
    const feedTag = q.feeding ? SPROUT.FEEDING_OPTIONS.find(o => (q.feeding || []).includes(state.profile.feeding)) : null;
    const pill = tag ? tag.label : (feedTag ? feedTag.label : null);
    const c = el(`
      <div class="card">
        <div class="card-head"><div class="badge sage">🩺</div><div><span class="eyebrow">For your next visit</span></div></div>
        ${pill ? `<span class="pill-tag">${esc(pill)}</span>` : ""}
        <p class="q-text">“${esc(q.text)}”</p>
      </div>`);
    if (ans) {
      const btn = el(`<button class="disclose-btn" type="button" aria-expanded="false">Read expert answer <span class="chev">▾</span></button>`);
      const bodyWrap = el(`<div style="display:none"></div>`);
      const body = el(`<div class="disclose-body">${esc(ans.text)}</div>`);
      body.appendChild(sourceLink(ans.source, "Source"));
      bodyWrap.appendChild(body);
      btn.addEventListener("click", () => {
        const open = bodyWrap.style.display === "none";
        bodyWrap.style.display = open ? "block" : "none";
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.querySelector(".chev").textContent = open ? "▴" : "▾";
      });
      c.appendChild(btn); c.appendChild(bodyWrap);
    }
    c.appendChild(el(`<p class="small muted" style="margin-top:12px">Questions rotate weekly — jot down the ones that fit your family.</p>`));
    return c;
  }

  /* ================= LIBRARY ================= */
  function viewLibrary() {
    const wrap = el(`<div></div>`);
    const ages = getAges(), band = bandForWeeks(ages.contentWeeks);
    wrap.appendChild(topbar());
    wrap.appendChild(el(`<div class="page-intro"><h1>Activities</h1><p>Every idea for the “${esc(band.label)}” stage. Browse, repeat a favorite, mark what you try.</p></div>`));

    const filters = el(`<div class="filter-row"></div>`);
    const cats = [{ id: "all", label: "All" }, { id: "tummy", label: "Movement" }, { id: "sensory", label: "Sensory" }, { id: "language", label: "Language" }];
    cats.forEach(cat => {
      const b = el(`<button class="filter-chip${state.libFilter === cat.id ? " active" : ""}" type="button">${esc(cat.label)}</button>`);
      b.addEventListener("click", () => { state.libFilter = cat.id; render(); });
      filters.appendChild(b);
    });
    wrap.appendChild(filters);

    const list = SPROUT.ACTIVITIES.filter(a => a.band === band.id && (state.libFilter === "all" || a.category === state.libFilter));
    list.forEach(a => wrap.appendChild(libItem(a)));
    if (!list.length) wrap.appendChild(el(`<div class="empty"><span class="ic">🍃</span><p>Nothing in this filter for now.</p></div>`));
    return wrap;
  }

  function libItem(act) {
    const meta = catMeta(act.category), color = catColor(act.category);
    const dot = color === "sage" ? "var(--primary)" : color === "slate" ? "var(--tertiary)" : "var(--secondary)";
    const mark = getMark(act.id);
    const item = el(`
      <div class="lib-item">
        <button class="lib-head" type="button" aria-expanded="false">
          <span class="tried-dot" style="background:${mark ? dot : "var(--outline-var)"}"></span>
          <span class="grow"><span class="lt">${esc(act.title)}</span><span class="lc">${esc(meta.label)}${mark ? " · " + (mark === "loved" ? "loved 💛" : "tried ✓") : ""}</span></span>
          <span class="chev">›</span>
        </button>
      </div>`);
    const head = item.querySelector(".lib-head");
    const detail = el(`<div class="lib-detail"></div>`);
    detail.appendChild(el(`<p class="activity-why">${esc(act.why)}</p>`));
    detail.appendChild(buildDurBlock(act));
    const cn = concernNote(act); if (cn) detail.appendChild(cn);
    detail.appendChild(buildTrackRow(act.id));
    detail.appendChild(sourceLink(SPROUT2.CATEGORY_SOURCE[act.category], "Why this helps"));
    let open = false;
    head.addEventListener("click", () => {
      open = !open;
      item.classList.toggle("open", open);
      head.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) item.appendChild(detail); else detail.remove();
    });
    return item;
  }

  /* ================= JOURNAL ================= */
  function viewJournal() {
    const wrap = el(`<div></div>`);
    wrap.appendChild(topbar());
    wrap.appendChild(el(`<div class="page-intro"><h1>Journal</h1><p>A gentle log of ${esc(babyName())}'s moments — what you tried, what they loved, and a line about the day if you like. No streaks, no scores.</p></div>`));

    // today's note box
    const tISO = todayISO();
    const noteBox = el(`<div class="card"><span class="eyebrow" style="margin-bottom:8px;display:block">Add a note for today</span></div>`);
    const ta = el(`<textarea class="note-input" maxlength="400" placeholder="A first, a funny face, a hard night, a small win…">${esc((state.journal[tISO] && state.journal[tISO].note) || "")}</textarea>`);
    const row = el(`<div class="note-box"></div>`);
    const saveBtn = el(`<button class="btn btn-tonal" type="button" style="min-height:52px;padding:0 20px">Save</button>`);
    saveBtn.addEventListener("click", () => { setNote(tISO, ta.value); render(); });
    row.appendChild(saveBtn);
    noteBox.appendChild(ta); noteBox.appendChild(row);
    wrap.appendChild(noteBox);

    const days = Object.keys(state.journal).sort().reverse();
    if (!days.length) { wrap.appendChild(el(`<div class="empty"><span class="ic">🍃</span><p>Your archive starts when you mark or note something.<br/>No rush — it fills up on its own.</p></div>`)); return wrap; }

    const actById = {}; SPROUT.ACTIVITIES.forEach(a => actById[a.id] = a);
    const tl = el(`<div class="timeline"></div>`);
    days.forEach(iso => {
      const d = state.journal[iso];
      const dObj = parseISO(iso);
      let label = dObj.toLocaleDateString(undefined, { weekday: "long" });
      if (iso === tISO) label = "Today";
      else if (iso === new Date(parseISO(tISO) - DAY_MS).toISOString().slice(0, 10)) label = "Yesterday";
      const dayEl = el(`<div class="j-day"><span class="node"></span><h3>${esc(label)}</h3><div class="jdate">${esc(dObj.toLocaleDateString(undefined, { month: "long", day: "numeric" }))}</div></div>`);
      Object.entries(d.marks || {}).forEach(([id, mark]) => {
        const a = actById[id]; if (!a) return;
        const meta = catMeta(a.category), color = catColor(a.category);
        const bg = color === "sage" ? "var(--primary-container)" : color === "slate" ? "var(--tertiary-container)" : "var(--secondary-container)";
        dayEl.appendChild(el(`
          <div class="j-entry">
            <span class="ji" style="background:${bg}">${art(a)}</span>
            <span class="jt"><span class="jc">${esc(meta.label)}</span><span class="jn">${esc(a.title)}</span></span>
            <span class="j-mark ${mark}">${mark === "loved" ? "loved 💛" : "tried ✓"}</span>
          </div>`));
      });
      if (d.note && d.note.trim()) dayEl.appendChild(el(`<div class="j-note"><span class="ic">✎</span><span>“${esc(d.note.trim())}”</span></div>`));
      tl.appendChild(dayEl);
    });
    wrap.appendChild(tl);
    return wrap;
  }

  /* ================= CARE ================= */
  function checkinDue() {
    const ages = getAges();
    const nearWeek = SPROUT2.CHECKIN.cadenceWeeks.some(w => Math.abs(ages.contentWeeks - w) <= 1);
    const last = state.checkins[state.checkins.length - 1];
    const recently = last && daysBetween(parseISO(last.date), parseISO(todayISO())) < 10;
    return nearWeek && !recently;
  }

  function viewCare() {
    if (state.careMode === "checkin") return viewCheckin();
    if (state.careMode === "result") return viewCheckinResult();
    const wrap = el(`<div></div>`);
    wrap.appendChild(topbar());
    wrap.appendChild(el(`<div class="page-intro"><h1>Care for you</h1><p>You're pouring so much into ${esc(babyName())}. This corner is just for you.</p></div>`));

    const sc = todaysSelfCare();
    wrap.appendChild(el(`
      <div class="card tint-terra">
        <div class="card-head"><div class="badge terra">🌸</div><div><span class="eyebrow" style="color:var(--secondary)">Today, under 10 minutes</span></div></div>
        <p class="body-lg">${esc(sc.text)}</p>
      </div>`));

    if (checkinDue()) {
      wrap.appendChild(el(`<div class="card tint-slate" style="border:1.5px solid var(--tertiary-container)"><p class="small" style="margin:0;color:var(--tertiary)"><strong>A gentle nudge:</strong> around now is one of the moments pediatricians check in on how parents are doing. If you have two quiet minutes, the check-in below is here for you.</p></div>`));
    }

    const ci = el(`
      <button class="mini-card" type="button">
        <div class="badge sage">💚</div>
        <div class="grow"><span class="eyebrow">Two private minutes</span><span class="mtitle">Check in with yourself</span></div>
        <span class="chev">›</span>
      </button>`);
    ci.addEventListener("click", () => { state.careMode = "checkin"; state.checkinAnswers = []; render(); window.scrollTo(0, 0); });
    wrap.appendChild(ci);

    if (state.checkins.length) {
      const last = state.checkins[state.checkins.length - 1];
      wrap.appendChild(el(`<p class="small muted" style="text-align:center;margin:-4px 0 16px">Last check-in ${esc(parseISO(last.date).toLocaleDateString(undefined, { month: "long", day: "numeric" }))} · kept private on this device</p>`));
    }

    // Always-available support
    const res = el(`<div class="card"><div class="card-head"><div class="badge slate">🤍</div><div><span class="eyebrow">Support, any time</span></div></div></div>`);
    SPROUT2.CHECKIN.resources.forEach(r => res.appendChild(el(`<div class="resource"><span class="ri">${r.icon}</span><div class="rt"><strong>${esc(r.title)}</strong><p>${esc(r.detail)}</p></div></div>`)));
    res.appendChild(el(`<p class="small muted" style="margin-top:12px">${esc(SPROUT2.CHECKIN.resourcesNote)}</p>`));
    wrap.appendChild(res);
    return wrap;
  }

  function viewCheckin() {
    const wrap = el(`<div></div>`);
    const back = el(`<button class="icon-btn" type="button" aria-label="Back" style="margin:16px 0">←</button>`);
    back.addEventListener("click", () => { state.careMode = "home"; render(); });
    wrap.appendChild(back);
    wrap.appendChild(el(`<div class="page-intro"><h1>Just for you</h1><p>${esc(SPROUT2.CHECKIN.intro)}</p></div>`));

    const answers = state.checkinAnswers;
    SPROUT2.CHECKIN.questions.forEach((q, qi) => {
      const block = el(`<div class="card checkin-q"><p class="qn">${esc(q.q)}</p></div>`);
      const scale = el(`<div class="scale"></div>`);
      q.options.forEach((o, oi) => {
        const b = el(`<button type="button"${answers[qi] === oi ? ' class="picked"' : ""}>${esc(o.label)}</button>`);
        b.addEventListener("click", () => { answers[qi] = oi; scale.querySelectorAll("button").forEach((x, i) => x.classList.toggle("picked", i === oi)); doneBtn.disabled = answers.filter(a => a != null).length < SPROUT2.CHECKIN.questions.length; doneBtn.classList.toggle("btn-primary", !doneBtn.disabled); doneBtn.classList.toggle("btn-tonal", doneBtn.disabled); });
        scale.appendChild(b);
      });
      block.appendChild(scale);
      wrap.appendChild(block);
    });

    const doneBtn = el(`<button class="btn btn-tonal" type="button" disabled style="opacity:1">See my reflection</button>`);
    doneBtn.addEventListener("click", () => {
      if (answers.filter(a => a != null).length < SPROUT2.CHECKIN.questions.length) return;
      let score = 0; SPROUT2.CHECKIN.questions.forEach((q, i) => score += q.options[answers[i]].w);
      const tier = SPROUT2.CHECKIN.tiers.find(t => score <= t.max);
      const rec = { date: todayISO(), week: getAges().contentWeeks, score, tier: tier.tone };
      state.checkins.push(rec); saveCheckins();
      state.lastResult = tier;
      state.careMode = "result"; render(); window.scrollTo(0, 0);
    });
    wrap.appendChild(el(`<div class="form-actions"></div>`)).appendChild(doneBtn);
    wrap.appendChild(el(`<p class="foot-note">This is a private reflection, never a diagnosis. Your answers stay on this device.</p>`));
    return wrap;
  }

  function viewCheckinResult() {
    const tier = state.lastResult || SPROUT2.CHECKIN.tiers[0];
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`<div style="height:20px"></div>`));
    wrap.appendChild(el(`
      <div class="reflect ${tier.tone === "light" ? "" : "warm"}">
        <h2 style="margin-bottom:10px">${esc(tier.title)}</h2>
        <p style="color:var(--on-surface)">${esc(tier.body)}</p>
      </div>`));

    if (tier.tone !== "light") {
      const res = el(`<div class="card"><div class="card-head"><div class="badge slate">🤍</div><div><span class="eyebrow">Reaching out is strength</span></div></div></div>`);
      SPROUT2.CHECKIN.resources.forEach(r => res.appendChild(el(`<div class="resource"><span class="ri">${r.icon}</span><div class="rt"><strong>${esc(r.title)}</strong><p>${esc(r.detail)}</p></div></div>`)));
      res.appendChild(el(`<p class="small muted" style="margin-top:12px">${esc(SPROUT2.CHECKIN.resourcesNote)}</p>`));
      wrap.appendChild(res);
    }
    if (tier.tone === "heavy") wrap.appendChild(el(`<div class="card" style="background:var(--error-container)"><p class="small" style="margin:0;color:var(--on-error-container)">${esc(SPROUT2.CHECKIN.crisisAlways)}</p></div>`));

    const done = el(`<button class="btn btn-primary" type="button">Back to care</button>`);
    done.addEventListener("click", () => { state.careMode = "home"; render(); window.scrollTo(0, 0); });
    wrap.appendChild(el(`<div class="form-actions"></div>`)).appendChild(done);
    return wrap;
  }

  /* ================= SETTINGS ================= */
  function viewSettings() {
    const wrap = el(`<div></div>`);
    const back = el(`<button class="icon-btn" type="button" aria-label="Back" style="margin:16px 0">←</button>`);
    back.addEventListener("click", () => go("today"));
    wrap.appendChild(back);
    wrap.appendChild(viewOnboarding(state.profile));

    const about = el(`
      <div class="card" style="margin-top:8px">
        <div class="card-head"><div class="badge sage">🌱</div><div><span class="eyebrow">About Sprout</span></div></div>
        <p class="small muted">Sprout gives you a few calm, age-matched ideas a day, grounded in guidance from the AAP, CDC, and infant-development research — tap “Why this” on any card to see the source. It's a companion, not a doctor: for anything that worries you, your pediatrician is the best guide. Everything you enter stays private on this device.</p>
      </div>`);
    wrap.appendChild(about);

    const danger = el(`<div style="text-align:center;padding:8px 0 24px"><button class="btn-danger" type="button">Start completely fresh</button></div>`);
    danger.querySelector("button").addEventListener("click", () => {
      if (confirm("This clears the profile, journal, and check-ins from this device. There's no undo — start fresh?")) {
        remove(K_PROFILE); remove(K_JOURNAL); remove(K_JOURNAL_OLD); remove(K_CHECKIN);
        state.profile = null; state.journal = {}; state.checkins = []; state.tab = "today"; render();
      }
    });
    wrap.appendChild(danger);
    return wrap;
  }

  /* ================= TAB BAR ================= */
  function tabbar() {
    const bar = el(`<nav class="tabbar" aria-label="Main"></nav>`);
    [
      { id: "today", ic: "🌤", label: "Today" },
      { id: "library", ic: "✨", label: "Activities" },
      { id: "journal", ic: "📖", label: "Journal" },
      { id: "care", ic: "💚", label: "You" }
    ].forEach(t => {
      const b = el(`<button class="tab${state.tab === t.id ? " active" : ""}" type="button"><span class="ti">${t.ic}</span>${t.label}</button>`);
      b.addEventListener("click", () => go(t.id));
      bar.appendChild(b);
    });
    return bar;
  }

  /* ---------------- rollover refresh ---------------- */
  let renderedFor = todayISO();
  function checkRollover() { if (todayISO() !== renderedFor) { renderedFor = todayISO(); render(); } }
  setInterval(checkRollover, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) checkRollover(); });

  render();
})();
