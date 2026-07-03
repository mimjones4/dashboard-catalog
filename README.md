# IronPlan — progressive strength training program

A single-file web app that builds and runs a progressive barbell strength
program around the five big lifts — squat, bench press, deadlift, overhead
press, and barbell row — adding weight when you win and backing off when you
stall.

**Run it:** open `index.html` in any browser. No build step, no server, no
accounts. All data lives in your browser's local storage.

## What it does

1. **Setup** — pick pounds or kilograms, a 3-day full-body or 4-day
   upper/lower schedule, and a starting work weight for each lift (sensible
   empty-bar-plus-a-little defaults included).
2. **Today's session** — every workout is generated for you: ramped warm-up
   sets, straight work sets (e.g. 3×5 at one weight), and the exact plates to
   load per side. Log each set with one tap; extra taps subtract missed reps.
3. **Automatic progression** — complete every rep and the lift gains 5 lb
   (2.5 kg) next session — 10 lb (5 kg) for deadlift. Miss reps and the
   weight holds; miss three sessions in a row and the lift deloads 10% and
   climbs again.
4. **Program preview** — the next four weeks of sessions with projected
   weights, re-planned automatically after every miss or deload.
5. **Progress dashboard** — estimated 1-rep-max trend charts per lift
   (Epley formula), weekly volume bars, stat tiles (sessions, week streak,
   total weight lifted, rep-max PRs), per-lift status tags
   (on track / holding / deloaded–rebuilding), and a full session-history
   table.

## Try it instantly

Open the app and click **Load demo lifter** (or open `index.html#demo`) to see
seven weeks of sample training — including a bench-press stall and 10% deload,
so you can watch the program adapt in the charts.

## Training philosophy

Simple linear progression, the way novice barbell programs have worked for
decades: few lifts, straight sets, small jumps every session, and a deload
instead of a grind when the bar stops moving. Progress is measured by
estimated one-rep max, so a hard 5-rep set still moves your chart even on a
"holding" week.
