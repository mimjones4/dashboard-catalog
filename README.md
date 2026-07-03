# PawPlan — personalized dog training program

A single-file web app that builds a personalized, adaptive 6-week training program
for your dog — positive reinforcement only, 10 minutes a day.

**Run it:** open `index.html` in any browser. No build step, no server, no accounts.
All data lives in your browser's local storage.

## What it does

1. **Setup** — enter your dog's name, breed, age in months, the behaviors they
   already know (sit, stay, recall, …), and the top three problem behaviors you
   want to fix (leash pulling, jumping on guests, separation anxiety, reactive
   barking, counter surfing, nipping, door dashing, ignored recalls).
2. **6-week progressive program** — one 10-minute session per day, rotating
   through your three target behaviors. Each behavior climbs six progressive
   stages. If a prerequisite skill (like sit or go-to-mat) isn't on your dog's
   list, the plan teaches it first automatically.
3. **Exact daily technique** — every day shows a timed session (2-minute warm-up,
   6-minute working block with numbered step-by-step technique, 2-minute wind-down),
   plus a daily progression arc (baseline → repetition → distraction → new location
   → stretch one dial → dress rehearsal → easy-win day).
4. **Behavior frequency tracker** — each evening you log how many times each
   problem behavior happened ("How many times did your dog jump on a person today?").
5. **Week-over-week trend reports** — "Jumping is down 40% this week 🎉" with
   specific reinforcement advice, per-behavior charts (weekly averages, 14-day
   sparkline), and a sessions/streak dashboard.
6. **Adaptive planning** — each week the plan reads the tracker: behaviors that
   improved advance a stage; behaviors that got worse hold their stage and load
   an easier variant until the numbers turn.

## Try it instantly

Open the app and click **Load demo dog** (or open `index.html#demo`) to see
three weeks of sample data, including one behavior that stalled so you can see
the plan adapt.

## Training philosophy

Positive reinforcement only: marker word, treats, management, and life rewards.
No corrections, no punishment. Separation-anxiety work follows the sub-threshold
rule — never push past distress.
