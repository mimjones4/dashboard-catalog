/* =================================================================
   Sprout content layer 2 — the research-driven additions
   -----------------------------------------------------------------
   Everything here comes from the market & clinical deep dive
   (see RESEARCH.md). It adds: a citation registry surfaced to the
   parent (visible sourcing = the top trust driver), age-scoped
   "good to know" clinical notes, short expert answers behind each
   pediatrician question, and a gentle, non-diagnostic parent
   check-in grounded in the AAP's postpartum-screening cadence.
   ================================================================= */

const SPROUT2 = {};

/* ---------- Citation registry ----------
   Plain-language explanation + the authority + a link. Shown in a
   bottom sheet when a parent taps "Why this / Based on…". */

SPROUT2.SOURCES = {
  "aap-tummy": {
    body: "American Academy of Pediatrics",
    title: "Tummy time, from day one",
    text: "The AAP suggests supervised, awake tummy time starting the day baby comes home — about 2–3 times a day for 3–5 minutes, building toward 15–30 minutes a day by around 7 weeks, and up to 60–90 minutes a day spread out as they grow. Chest-to-chest and across-your-lap both count.",
    cite: "AAP, “Back to Sleep, Tummy to Play”",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/back-to-sleep-tummy-to-play.aspx"
  },
  "aap-sleep": {
    body: "American Academy of Pediatrics",
    title: "Safe sleep basics",
    text: "For every sleep until age 1: on the back, on a firm flat surface (crib, bassinet, or play yard), in your room but not your bed, with nothing soft in the space. A pacifier at sleep, breastfeeding, and staying smoke-free all lower SIDS risk. Couches, armchairs, and swings aren't safe for sleep.",
    cite: "AAP 2022 Safe Sleep recommendations",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/default.aspx"
  },
  "aap-screen": {
    body: "American Academy of Pediatrics",
    title: "Screens before 18 months",
    text: "The AAP suggests avoiding screen time under 18 months apart from live video chat with family — which is lovely, connecting time. Babies learn best from faces, voices, and real objects, and background TV can get in the way of language. No pressure, just good to know.",
    cite: "AAP media-use guidance",
    url: "https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/qa-portal/qa-portal-library/qa-portal-library-questions/screen-time-for-infants/"
  },
  "aap-reading": {
    body: "American Academy of Pediatrics",
    title: "Reading, right from birth",
    text: "The AAP encourages reading aloud starting at birth. It's linked to bigger vocabularies and stronger language at school age — and just as much, it's warm, connected time. With a tiny baby the words matter less than your voice and the closeness.",
    cite: "AAP, Literacy Promotion / HealthyChildren",
    url: "https://www.healthychildren.org/English/news/Pages/beyond-literacy-shared-reading-starting-in-infancy-offers-lifelong-benefits.aspx"
  },
  "serve-return": {
    body: "Center on the Developing Child, Harvard",
    title: "Serve and return",
    text: "When your baby coos, looks, or reaches (a “serve”) and you respond (a “return”), you're building the brain architecture behind language and secure attachment — one back-and-forth at a time. The little pauses where you wait for them to answer are where the magic is.",
    cite: "Harvard Center on the Developing Child",
    url: "https://developingchild.harvard.edu/science/key-concepts/serve-and-return/"
  },
  "cdc-milestones": {
    body: "CDC & AAP",
    title: "How these milestones are framed",
    text: "These reflect the CDC's milestone checklists (updated 2022 with the AAP). They're set at what most babies — about 75% — can do by a given age, so they're a guide, not a test. Babies arrive at each one on their own timeline; the checklists exist to help you and your pediatrician notice, together, if extra support might help.",
    cite: "CDC/AAP milestones, 2022 revision",
    url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html"
  },
  "responsive-feeding": {
    body: "Infant feeding research",
    title: "Feeding on cue",
    text: "Following your baby's hunger and fullness cues — rather than the clock or a set number of ounces — supports healthy growth and their own sense of “I'm full,” and takes pressure off both of you. Rooting, hands to mouth, and fussing are early hunger cues; turning away and relaxing are fullness.",
    cite: "Responsive feeding literature (NIH/PMC)",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10015354/"
  },
  "object-permanence": {
    body: "Developmental science",
    title: "Where sensory play is headed",
    text: "In the first year babies are little scientists working out two big ideas: cause and effect (I do this, that happens) and object permanence (things exist even when I can't see them, emerging around 4–7 months). Peekaboo, dropping games, and hide-and-find are exactly how they practice.",
    cite: "Piaget sensorimotor stage; modern infant-cognition research",
    url: "https://www.webmd.com/baby/what-age-do-babies-have-object-permanence"
  },
  "aap-ppd": {
    body: "American Academy of Pediatrics",
    title: "Why we check in with you",
    text: "The AAP recommends that parents be screened for postpartum depression around the 1-, 2-, 4-, and 6-month marks, because it's common (1 in 7) and very treatable — and because when you're supported, your baby does better too. This check-in is a gentle, private nudge in that spirit; it isn't a diagnosis.",
    cite: "AAP perinatal mental health guidance",
    url: "https://www.aap.org/en/patient-care/perinatal-mental-health-and-social-support/"
  }
};

/* Which source backs each activity category. */
SPROUT2.CATEGORY_SOURCE = {
  tummy: "aap-tummy",
  sensory: "object-permanence",
  language: "aap-reading"
};

/* ---------- Activity hero art (emoji) ---------- */
SPROUT2.ART = {
  tummy: "🤸", sensory: "🌈", language: "💬",
  // a few specifics for variety
  "t-0-chest": "🫶", "s-0-gaze": "👀", "l-0-hum": "🎵",
  "s-2-contrast": "⚫", "s-2-light": "🌤️", "l-2-song": "🎶",
  "s-4-texture": "🧸", "s-4-rattle": "🔔", "l-4-parts": "👣",
  "s-7-mirror": "🪞", "s-7-kick": "🦶", "l-7-book": "📖",
  "s-10-bat": "🎯", "s-10-hands": "🖐️", "l-10-sports": "🎙️",
  "s-13-grab": "✋", "s-13-peek": "🙈", "l-13-laugh": "😄",
  "s-18-mouth": "🧊", "s-18-bubbles": "🫧", "l-18-babble": "🗣️",
  "s-23-water": "💧", "s-23-shake": "🎶", "l-23-signs": "🤟",
  "s-27-treasure": "🧺", "s-27-bang": "🥁", "l-27-point": "👉",
  "s-35-container": "🪣", "s-35-textures": "🌱", "l-35-hide": "🔎",
  "s-44-scoop": "🥄", "s-44-ball": "⚽", "l-44-word": "🔤",
  "s-53-crayon": "🖍️", "s-53-bin": "🌾", "l-53-body": "👃",
  "s-66-pretend": "🧸", "s-66-stack": "🧱", "l-66-story": "📚",
  "t-2-face": "😊", "t-4-track": "🎈", "t-7-side": "↔️",
  "t-10-reach": "🎯", "t-13-roll": "🔄", "t-18-airplane": "✈️",
  "t-23-roll2": "🛼", "t-27-crawl": "🐢", "t-35-stand": "🧍",
  "t-44-cruise": "🛋️", "t-53-steps": "👟", "t-66-kick": "⚽"
};

/* ---------- Age-scoped "good to know" clinical notes ----------
   One surfaces on Today each day (rotating). All are also browsable. */

SPROUT2.CLINICAL_NOTES = [
  { id: "cn-sleep", min: 0, max: 52, title: "Back to sleep, every sleep",
    body: "For naps and nighttime, baby goes down on their back, on a firm flat surface, in your room but their own space — bassinet, crib, or play yard — with nothing soft in it. It's the single biggest thing that lowers SIDS risk.",
    source: "aap-sleep" },
  { id: "cn-tummy", min: 0, max: 26, title: "How much tummy time?",
    body: "A little and often beats one long stretch. Aim for 2–3 short sessions a day now, building toward 15–30 minutes daily by about 7 weeks. Chest-to-chest and across-your-lap absolutely count.",
    source: "aap-tummy" },
  { id: "cn-feeding", min: 0, max: 40, title: "You can feed on cue",
    body: "Following baby's hunger and fullness cues — rather than a strict clock or ounce count — supports healthy growth and their own fullness signals, and eases pressure on you both.",
    source: "responsive-feeding" },
  { id: "cn-reading", min: 0, max: 104, title: "Reading counts from day one",
    body: "You don't need to wait until baby understands words. Reading (or narrating anything) from birth builds language and is warm, close time. With a newborn, your voice matters more than the plot.",
    source: "aap-reading" },
  { id: "cn-screen", min: 8, max: 78, title: "Screens can wait a little",
    body: "The AAP suggests holding off on screen time before 18 months — with one happy exception: live video calls with family, which are real, connected time. Background TV is the part worth minimizing.",
    source: "aap-screen" },
  { id: "cn-serve", min: 4, max: 104, title: "The pause is the point",
    body: "After you talk, sing, or make a face, leave a beat and watch. Baby's sound, wiggle, or gaze back is a “serve and return” — the back-and-forth that wires language and connection.",
    source: "serve-return" }
];

/* ---------- Expert answers behind each pediatrician question ----------
   Short, plain-language, framed as general guidance — not a diagnosis.
   Keyed by the question id in content.js. */

SPROUT2.PED_ANSWERS = {
  "pq-weight": { text: "Most pediatricians track weight along a personal curve rather than one “right” number — steady progress matters more than any single weigh-in. Regular wet/dirty diapers and alertness are reassuring signs between visits.", source: "responsive-feeding" },
  "pq-vitd": { text: "Breastfed and combo-fed babies are usually advised to take a daily vitamin D supplement (commonly 400 IU) since breastmilk is low in it. Your pediatrician can confirm the amount and a brand style that fits.", source: "general" },
  "pq-formula-prep": { text: "Safe prep — right water, correct ratio, and how long a made bottle can sit out (typically ~2 hours at room temp, ~24 hours refrigerated) — is worth confirming directly, as guidance varies by formula.", source: "general" },
  "pq-spitup": { text: "Frequent spit-up in a comfortable, growing baby (“happy spitter”) is usually normal and outgrown as they sit up and start solids. Reflux that causes pain, poor weight gain, or breathing issues is worth a closer look.", source: "responsive-feeding" },
  "pq-reflux-comfort": { text: "Common comfort steps: smaller, more frequent feeds, upright time after eating, and unhurried burping. Your pediatrician can steer you toward what's evidence-based and away from measures that don't help.", source: "general" },
  "pq-daynight": { text: "Mixed-up days and nights are typical in the early weeks. Bright, active days and dark, calm, boring nights gently nudge baby's clock — but time is the biggest factor, so be kind to yourself here.", source: "aap-sleep" },
  "pq-crying": { text: "Crying tends to peak around 6 weeks and eases by 3–4 months. Your pediatrician can help you tell normal “purple crying” from something worth checking, and share soothing approaches that fit your baby.", source: "general" },
  "pq-ppd": { text: "Pediatricians expect and welcome this conversation — the AAP has them screen for parent depression at early visits. It's common and treatable, and getting support helps you and baby both.", source: "aap-ppd" },
  "pq-tummyhate": { text: "Lots of babies protest tummy time at first. Short, frequent sessions — and counting chest-to-chest and lap positions — is exactly right; your pediatrician can suggest a daily target for this age.", source: "aap-tummy" },
  "pq-sleep-safe": { text: "A quick review of your setup against safe-sleep basics — back sleeping, firm flat surface, room-sharing, nothing soft — is always worth doing as baby grows and starts to move.", source: "aap-sleep" },
  "pq-feeding-enough": { text: "Reliable signs baby's getting enough: steady weight gain, regular wet and dirty diapers, and contentment after feeds. Your pediatrician can tell you the diaper counts to expect and when to call.", source: "responsive-feeding" },
  "pq-vaccine-comfort": { text: "Extra feeds, cuddles, and — if your pediatrician okays it — the right dose of infant acetaminophen ease post-shot fussiness. Ask which fever or symptoms would actually warrant a call.", source: "general" },
  "pq-rolling-swaddle": { text: "Once baby shows any sign of rolling, it's time to stop swaddling (arms out) for safety. Many families move to a sleep sack; your pediatrician can suggest a smooth transition.", source: "aap-sleep" },
  "pq-sleep-stretch": { text: "Night stretches vary hugely at this age and aren't a measure of anything you're doing. Your pediatrician can share what's typical now and whether it makes sense to gently shape sleep yet.", source: "aap-sleep" },
  "pq-flathead": { text: "Plenty of tummy time and repositioning usually keep head shape rounded. Your pediatrician can tell you what's normal flattening versus what's worth watching or treating.", source: "aap-tummy" },
  "pq-drool": { text: "Lots of drool and hand-chewing is common and doesn't always mean teeth are imminent. Chilled (not frozen) teethers and clean fingers help; ask your pediatrician which soothers they like.", source: "general" },
  "pq-milestone-check": { text: "The CDC/AAP checklists (set at what ~75% of babies do by an age) are a great shared starting point. Going through them together helps you enjoy what's next and catch any need for support early.", source: "cdc-milestones" },
  "pq-solids-ready": { text: "Readiness usually shows around 6 months: good head control, sitting with support, interest in food, and less tongue-thrust. Your pediatrician can help you choose purees, baby-led weaning, or a mix.", source: "general" },
  "pq-sleep-train": { text: "There are several approaches considered safe and effective from around this age; the “best” one is the one you can do consistently and feel okay about. Your pediatrician can match one to your family.", source: "aap-sleep" },
  "pq-reflux-outgrow": { text: "Reflux commonly improves as babies sit up and start solids. If it isn't easing on the expected timeline or is affecting weight or comfort, that's the moment to talk next steps.", source: "responsive-feeding" },
  "pq-formula-switch": { text: "Most fussiness and spit-up is normal digestion, not a formula problem. Real reasons to switch (like a diagnosed allergy) are specific — worth confirming before changing.", source: "general" },
  "pq-nursing-changes": { text: "Distraction, shorter feeds, and changing spacing are normal as babies get efficient and curious. Steady weight and diapers are reassuring; your provider or a lactation consultant can check transfer if unsure.", source: "responsive-feeding" },
  "pq-allergens": { text: "Current guidance is to introduce common allergens (like peanut and egg) early and regularly once solids are going, often around 6 months. Your pediatrician can tailor this, especially if there's a family history.", source: "general" },
  "pq-iron": { text: "Around 6 months, iron needs rise. Iron-rich first foods (or a supplement if advised) matter; your pediatrician can look at baby's mix of milk and solids and advise.", source: "general" },
  "pq-nightwake": { text: "Night waking is still normal here. Your pediatrician can help you read hunger versus habit and, if you want longer stretches, suggest gentle, age-appropriate options.", source: "aap-sleep" },
  "pq-pincer": { text: "Soft, gum-able finger foods in safe shapes let baby practice the pincer grasp. A quick refresher on gagging (normal and protective) versus choking (emergency) is always worth it.", source: "general" },
  "pq-constipation": { text: "Digestion often shifts with solids. Your pediatrician can tell you what's normal, which foods help things move, and when hard or infrequent stools are worth attention.", source: "general" },
  "pq-milk-transition": { text: "Around the first birthday many babies move from formula/breastmilk toward whole milk. Your pediatrician can lay out the timing and pace that suit your baby.", source: "general" },
  "pq-walking-range": { text: "Walking anywhere from about 9 to 18 months is typical. Confident cruising and pulling to stand are the signs the system is coming online; your pediatrician will note what they'd expect by later visits.", source: "cdc-milestones" },
  "pq-firstwords": { text: "Understanding leads speaking by a lot right now — looking at the right thing when named is a great sign. Words, gestures, and pointing all count; your pediatrician can advise if/when extra support helps.", source: "cdc-milestones" },
  "pq-selfwean": { text: "There's no single “right” length — the AAP supports continued breastfeeding as long as it works for you both. Your provider can talk through options and gentle weaning whenever you choose.", source: "general" },
  "pq-bottlewean": { text: "Many families aim to phase bottles toward cups around 12–18 months, partly for dental health. Your pediatrician can suggest a pace that won't be a battle.", source: "general" },
  "pq-appetite": { text: "Appetite naturally slows and gets choosier as growth slows in the second year. Offering variety without pressure, and trusting their fullness, is usually the approach; your pediatrician can reassure on portions.", source: "responsive-feeding" },
  "pq-shoes": { text: "New walkers do best barefoot or in flexible soft-soled shoes indoors for balance and foot development; sturdier shoes are mainly for outside. Your pediatrician can point out what to look for.", source: "general" },
  "pq-screens": { text: "Before 18 months the AAP suggests avoiding screens beyond video chat; from 18–24 months, small amounts of high-quality content watched together. Background TV is the main thing to minimize.", source: "aap-screen" },
  "pq-tantrum": { text: "Big feelings in a small body are developmentally on time. Staying calm, naming the feeling, and keeping limits kind and consistent is the usual guidance; your pediatrician can share realistic, tired-parent-friendly tips.", source: "general" },
  "pq-toddler-sleep": { text: "Naps consolidate and night sleep shifts through toddlerhood. Your pediatrician can help you read the signs it's time to adjust the schedule and troubleshoot early rising.", source: "aap-sleep" },
  "pq-general-dev": { text: "A great open-ended question — it invites your pediatrician to share what they're watching and what's fun to look for next, and gives you room to raise anything on your mind.", source: "cdc-milestones" },
  "pq-when-to-call": { text: "Knowing the specific symptoms your pediatrician wants a call about — versus what can wait — saves worry at 2am. Fever thresholds, breathing, feeding, and hydration are common ones to clarify.", source: "general" }
};

SPROUT2.SOURCES.general = {
  body: "General pediatric guidance",
  title: "A note on this answer",
  text: "This is a plain-language summary of common pediatric guidance to help you have a good conversation at your visit — not medical advice, and not a substitute for what your own pediatrician recommends for your baby.",
  cite: "Sprout — general guidance",
  url: ""
};

/* ---------- Gentle parent check-in ----------
   Inspired by the domains clinicians ask about, but written fresh and
   deliberately NOT the EPDS and NOT a diagnostic score. It reflects
   feelings back warmly and always surfaces real support. Nudged around
   the AAP screening cadence (≈ weeks 4, 8, 17, 26). */

SPROUT2.CHECKIN = {
  cadenceWeeks: [4, 8, 17, 26],
  intro: "A few gentle questions, just for you — private, on this device, and never a diagnosis. There are no right answers. Think about the last week or so.",
  questions: [
    { q: "Have you been able to laugh and enjoy things, even small ones?",
      options: [
        { label: "As much as I usually do", w: 0 },
        { label: "A little less than usual", w: 1 },
        { label: "A lot less than usual", w: 2 },
        { label: "Hardly at all", w: 3 } ] },
    { q: "Have you been looking forward to things?",
      options: [
        { label: "Mostly, yes", w: 0 },
        { label: "Somewhat less than before", w: 1 },
        { label: "Much less than before", w: 2 },
        { label: "Not really at all", w: 3 } ] },
    { q: "Have you felt anxious, on-edge, or worried?",
      options: [
        { label: "Rarely", w: 0 },
        { label: "Sometimes", w: 1 },
        { label: "Often", w: 2 },
        { label: "Most of the time", w: 3 } ] },
    { q: "When things have been hard, have you been able to cope?",
      options: [
        { label: "I've been managing okay", w: 0 },
        { label: "Coping most of the time", w: 1 },
        { label: "Struggling more than not", w: 2 },
        { label: "Feeling overwhelmed a lot", w: 3 } ] },
    { q: "How has your sleep been when the baby DOES let you rest?",
      options: [
        { label: "I can usually rest", w: 0 },
        { label: "A bit restless", w: 1 },
        { label: "Hard to rest even when I can", w: 2 },
        { label: "I can barely rest at all", w: 3 } ] },
    { q: "Do you feel you have someone to lean on right now?",
      options: [
        { label: "Yes, I feel supported", w: 0 },
        { label: "Somewhat", w: 1 },
        { label: "Not really", w: 2 },
        { label: "I feel quite alone in it", w: 3 } ] }
  ],
  tiers: [
    { max: 4, tone: "light",
      title: "It sounds like you're finding some steady ground.",
      body: "That's genuinely good to hear — and it doesn't mean every day is easy. Keep tending to yourself the way you tend to your baby. Checking in like this now and then is a kind habit." },
    { max: 10, tone: "some",
      title: "It sounds like some days are weighing on you.",
      body: "That's so common in these months, and it doesn't mean you're doing anything wrong. Small things — a little rest, a walk outside, telling one person the honest truth of how you are — really can help. If this feeling sticks around, please consider mentioning it to your doctor; it's a strong, normal thing to do." },
    { max: 99, tone: "heavy",
      title: "It sounds like you're carrying a lot right now.",
      body: "You deserve real support — and reaching for it is a sign of strength, not failure. Please consider talking with your doctor, your baby's pediatrician, or one of the lines below soon. Postpartum feelings this heavy are common and very treatable, and you don't have to white-knuckle through them alone." }
  ],
  // Shown always, and emphasized on the "heavy" tier.
  resourcesNote: "If you're in the US. Outside the US, your doctor or midwife can point you to local support.",
  resources: [
    { icon: "💜", title: "National Maternal Mental Health Hotline", detail: "Call or text 1-833-TLC-MAMA (1-833-852-6262) — free, confidential, 24/7." },
    { icon: "🤝", title: "Postpartum Support International", detail: "Call or text “Help” to 1-800-944-4773 for support and local referrals." },
    { icon: "🆘", title: "988 Suicide & Crisis Lifeline", detail: "If you're in crisis or having scary thoughts, call or text 988 anytime. You matter." },
    { icon: "🩺", title: "Your own care team", detail: "Your OB, midwife, or baby's pediatrician screens for this and can help — it's exactly what they're there for." }
  ],
  crisisAlways: "If you ever have thoughts of harming yourself or your baby, please reach out right now — call or text 988, or go to your nearest emergency room. You are not a bad parent for having these thoughts, and help is available."
};
