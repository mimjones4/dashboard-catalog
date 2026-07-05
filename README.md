# Ever After — Wedding Planning Command Center

A warm, single-file wedding planning app. Open `index.html` in any browser — no
build step, no server, no dependencies. Everything is saved privately in the
browser via `localStorage`, so you can close the tab and pick up right where you
left off.

## What it does

Enter your names, wedding date, venue type, total budget, guest count, and
three aesthetic keywords, and the app generates:

- **A 12-month planning timeline** with weekly tasks, personalized to your
  venue type (barn weddings get generator quotes; beach weddings get tide
  charts) and woven through with your three style words. Months open to the
  current one automatically; overdue months get a gentle "catch up" nudge.
- **A vendor research companion** — 5–7 pointed questions for each of ten
  vendor types (venue, caterer, photographer, videographer, florist, band/DJ,
  hair & makeup, officiant, cake, planner), with per-vendor status tracking
  and a notes field for quotes and impressions.
- **A budget breakdown** allocated across 16 categories, with percentages
  shaped by venue type. Log what you've spent per category and watch each
  envelope fill; over-budget categories are flagged.
- **A payment deadline tracker** — typical deposit and balance dates computed
  from your wedding date and sized from your budget, plus custom payments.
  Overdue and due-soon items are labeled.
- **An RSVP tracker** with household-level entries, party sizes, relationship
  groups, and headline stats.
- **A seating chart** that respects relationship groupings: auto-arrange seats
  groups together, honors table capacities, and never seats two guests you've
  marked "seat apart" at the same table. Manual assignment and editable tables
  included.

## Notes

- **Persistence**: all state lives in `localStorage` under `everAfter.v1`.
  "Download a backup" / "Restore a backup" in the footer move your plan
  between browsers or devices.
- **Design**: system serif typography (no webfonts), light and dark mode via
  `prefers-color-scheme`, responsive down to phone widths. The budget chart's
  accent colors were validated for contrast and color-vision-deficiency
  legibility against both surfaces.
