# 🌱 Sprout — a gentle postpartum & baby development companion

Sprout is a small, warm daily companion for a baby's first ~18 months. You tell
it your baby's birth date, how they're fed, and anything that's on your mind —
and every day it quietly assembles a fresh little menu matched to your baby's
exact age in weeks:

1. **Three age-appropriate activities** for the day — one each from
   *movement & tummy time*, *sensory play*, and *language & connection* —
   every one with a **5-minute** and a **15-minute** version, so it fits the
   day you're actually having.
2. **This week's developmental milestones** to watch for, framed as things you
   *might start noticing* — never a checklist to pass or fail.
3. **One parent self-care prompt** that takes under 10 minutes.
4. **One suggested question for the pediatrician** at the next visit, matched
   to baby's age, feeding style, and your concerns.

The tone throughout is warm, calm, and non-judgmental. Skipping a day is fine.
Skipping a week is fine. Sprout will be there with something fresh whenever
you come back.

## Features

- **Auto-updates as baby ages** — content is keyed to the baby's exact age in
  weeks across 13 developmental bands (newborn through toddler), and the daily
  picks rotate deterministically so no two consecutive days repeat. The page
  refreshes itself at midnight and whenever the tab is re-opened.
- **Adjusted age support** — if baby arrived more than 3 weeks early, add the
  due date and activities/milestones follow adjusted age (with both ages shown).
- **Concern-aware tailoring** — pick concerns like *sleep*, *reflux/spit-up*,
  *milestones*, *feeding*, *crying/colic*, or *taking care of me*, and Sprout
  adds gentle activity adaptations (e.g. reflux-friendly tummy-time positions),
  weights relevant self-care prompts, and prioritizes matching pediatrician
  questions.
- **Feeding-aware** — breastfed, formula-fed, and combination families each
  see the pediatrician questions relevant to them.
- **Tried & loved tracking** — mark any activity as *“we tried it”* or
  *“baby loved it 💛”*; the **Journal** tab keeps a dated archive. No streaks,
  no scores, no guilt.
- **Private by design** — everything lives in `localStorage` on the family's
  device. No accounts, no servers, no analytics.
- Responsive, mobile-first layout with automatic light/dark mode.

## Running it

It's a fully static app — no build step, no dependencies.

```bash
# any static file server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Project structure

```
index.html        entry point
css/styles.css    all styling (light + dark, mobile-first)
js/content.js     the content library: age bands, 78 activity variants,
                  weekly milestones, self-care prompts, pediatrician questions
js/app.js         onboarding, age math, deterministic daily selection,
                  tried/loved journal, settings
```

## How daily selection works

Each category's activity pool for the current age band is rotated by
`(days-since-epoch + hash(birth date))`, so:

- the plan changes every day automatically,
- consecutive days never repeat within a band,
- the same family sees a stable plan all day (no reshuffling on refresh),
- different families see different sequences.

Pediatrician questions rotate **weekly** (visits are sparse), filtered to the
baby's age window and preferring questions that match the family's feeding
type and concerns.

## A note on content

Activity and milestone content reflects widely published guidance on infant
development, framed deliberately with wide "typical" ranges and consistent
reassurance. Sprout offers ideas, not medical advice — the pediatrician
question feature exists precisely to route real concerns to real clinicians.
