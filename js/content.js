/* =================================================================
   Sprout content library
   -----------------------------------------------------------------
   Everything here is keyed to the baby's exact age in weeks.
   Tone rules for all copy: warm, calm, non-judgmental. We suggest,
   we never scold. "You might", "if you feel like it", never
   "you should". Every milestone section ends with reassurance.
   ================================================================= */

const SPROUT = {};

/* ---------- Age bands (in completed weeks) ---------- */

SPROUT.AGE_BANDS = [
  { id: "w0_1",   min: 0,  max: 1,    label: "brand new" },
  { id: "w2_3",   min: 2,  max: 3,    label: "settling in" },
  { id: "w4_6",   min: 4,  max: 6,    label: "waking up to the world" },
  { id: "w7_9",   min: 7,  max: 9,    label: "first smiles" },
  { id: "w10_12", min: 10, max: 12,   label: "finding their hands" },
  { id: "w13_17", min: 13, max: 17,   label: "little scientist" },
  { id: "w18_22", min: 18, max: 22,   label: "reaching out" },
  { id: "w23_26", min: 23, max: 26,   label: "half-year wonder" },
  { id: "w27_34", min: 27, max: 34,   label: "on the move" },
  { id: "w35_43", min: 35, max: 43,   label: "explorer era" },
  { id: "w44_52", min: 44, max: 52,   label: "almost one" },
  { id: "w53_65", min: 53, max: 65,   label: "new walker days" },
  { id: "w66up",  min: 66, max: 9999, label: "busy toddler" }
];

/* ---------- Activities ----------
   Each band has three categories: tummy (motor / tummy-time
   progressions), sensory, language. Each activity has a 5-minute
   and a 15-minute version, and optional notes keyed to a concern. */

SPROUT.ACTIVITIES = [

  /* ============ Weeks 0–1 ============ */
  {
    id: "t-0-chest", band: "w0_1", category: "tummy",
    title: "Chest-to-chest tummy time",
    why: "Tummy time can start this gently — baby resting on your chest counts completely. Your heartbeat is the soundtrack they know best.",
    five: "Recline back on the couch or bed and lay baby tummy-down on your chest, cheek against you. Rest your hand on their back and just breathe together for a few minutes.",
    fifteen: "Do two or three short chest snuggles spread across the day, maybe after a diaper change. Between rounds, hold baby upright over your shoulder for a minute — that's neck practice too.",
    concernNotes: {
      reflux: "For a refluxy baby, chest-to-chest with you reclined (not flat) is often the most comfortable tummy time there is. Waiting 20–30 minutes after a feed can help too."
    }
  },
  {
    id: "t-0-lap", band: "w0_1", category: "tummy",
    title: "Across-the-lap lying",
    why: "Lying tummy-down across your legs gives baby a new view and a tiny bit of gravity work — no floor required.",
    five: "Sit comfortably and lay baby tummy-down across your thighs, head supported on one leg. Rub slow circles on their back. Done when either of you is done.",
    fifteen: "Try a lap round after each of a few diaper changes today. Gently raise the knee under their head an inch to vary the angle, and hum while you pat.",
    concernNotes: {
      reflux: "A slight head-up tilt (knee under the head raised a little) tends to sit better with reflux. Short and frequent beats long and fussy."
    }
  },
  {
    id: "s-0-gaze", band: "w0_1", category: "sensory",
    title: "Face gazing",
    why: "Right now baby sees best about 8–12 inches away — roughly the distance from your arms to your face. Your face is their favorite thing to study.",
    five: "During a calm alert moment, hold baby facing you about a forearm's length away. Slowly raise your eyebrows, open your mouth, smile. See what they lock onto.",
    fifteen: "Do a few gazing sessions through the day. Try slowly moving your face a little left and right and see if their eyes drift after you. Some days they will, some days they're too sleepy — both are normal."
  },
  {
    id: "s-0-touch", band: "w0_1", category: "sensory",
    title: "Gentle touch tour",
    why: "Slow, predictable touch helps baby start building a map of their own body — and it's calming for both of you.",
    five: "After a diaper change, stroke baby's arms from shoulder to hand, then legs from hip to foot, naming each part softly as you go.",
    fifteen: "Turn it into a mini massage: a drop of baby-safe lotion, slow strokes on arms, legs, and tummy (clockwise circles), then gently open and close their fingers. Stop whenever baby seems done — they'll tell you.",
    concernNotes: {
      crying: "Many parents find a slow leg-and-tummy massage helps during the fussy hours. If it revs baby up instead, that's information, not failure — try again another day."
    }
  },
  {
    id: "l-0-narrate", band: "w0_1", category: "language",
    title: "Narrate the ordinary",
    why: "Baby's brain is already soaking in the rhythm of your voice. There's no script — the diaper change commentary counts.",
    five: "Pick one routine moment — a change, a feed, getting dressed — and describe it out loud as you go: 'Here comes the clean diaper. One leg, two legs.'",
    fifteen: "Narrate a few moments across the day, and once, pause after you speak and watch baby's face. Those tiny stills and wiggles are the very beginning of conversation."
  },
  {
    id: "l-0-hum", band: "w0_1", category: "language",
    title: "Humming hello",
    why: "Low, steady humming is one of the most soothing sounds for a newborn — they can feel it as well as hear it when they're against your chest.",
    five: "While holding baby, hum anything — a lullaby, a pop song, something you make up. Slow it down and feel their body settle.",
    fifteen: "Pick one song to be 'your song' and hum or sing it at a few calm moments today. Repetition is the point; babies love a rerun.",
    concernNotes: {
      sleep: "A consistent hummed song before sleep can become a gentle cue that rest is coming — a tiny piece of routine with zero pressure attached."
    }
  },

  /* ============ Weeks 2–3 ============ */
  {
    id: "t-2-towel", band: "w2_3", category: "tummy",
    title: "Rolled-towel chest prop",
    why: "A small roll under the chest takes some of the work out of lifting that heavy head, so floor tummy time feels less frustrating.",
    five: "Roll a hand towel, place it under baby's chest on a blanket with their arms forward over it, and get your face down at their level. One or two minutes is a win.",
    fifteen: "Do three short propped rounds spread through the day. Sing or click your tongue from different sides so baby has a reason to work those neck muscles.",
    concernNotes: {
      reflux: "Try tummy time before feeds or a good half hour after, and keep rounds short. Spit-up during tummy time is common and usually just laundry, not harm."
    }
  },
  {
    id: "t-2-face", band: "w2_3", category: "tummy",
    title: "Your face is the toy",
    why: "At this age, the best tummy-time motivation isn't a toy — it's you, close enough to see.",
    five: "Lie on the floor face-to-face with baby on their tummy, your nose about a foot from theirs. Talk, sing, make faces. When they fuss, scoop and snuggle — that's a complete session.",
    fifteen: "Alternate positions across a few short rounds: face-to-face on the floor, then baby on your chest, then across your lap. Variety keeps it interesting for both of you."
  },
  {
    id: "s-2-contrast", band: "w2_3", category: "sensory",
    title: "High-contrast viewing",
    why: "Bold black-and-white patterns are what young eyes see most clearly, and studying them is genuine workout for baby's visual system.",
    five: "Hold a high-contrast card, a black-and-white book, or even a bold-striped shirt about 10 inches from baby's face during a calm alert window. Let them stare as long as they like.",
    fifteen: "Show two or three different patterns, holding each until baby looks away (that's their 'next slide, please'). Prop one beside them during tummy time later."
  },
  {
    id: "s-2-light", band: "w2_3", category: "sensory",
    title: "Light and shadow watching",
    why: "Babies this age are drawn to windows, lamps, and ceiling fans — contrast and gentle movement are fascinating when the world is new.",
    five: "Hold baby near (not facing into) a window and let them study the light. Narrate what's out there in a soft voice.",
    fifteen: "Take a slow lap around your home, pausing wherever light does something interesting — through curtains, on a wall. Outside on a mild day counts double: dappled light through leaves is baby cinema."
  },
  {
    id: "l-2-coo", band: "w2_3", category: "language",
    title: "Serve and return, newborn edition",
    why: "Even before real coos, baby's little sounds and expressions are 'serves.' Answering them teaches the deep rhythm of conversation.",
    five: "When baby makes any sound or expression, respond as if it meant something: 'Oh really? Tell me more.' Then pause and wait, face open.",
    fifteen: "Do a few rounds through the day and try imitating baby's own sounds back to them once or twice. You're building turn-taking — the skeleton of all language."
  },
  {
    id: "l-2-song", band: "w2_3", category: "language",
    title: "One song on repeat",
    why: "Hearing the same song again and again lets baby start predicting what comes next — and prediction is early learning.",
    five: "Sing the same short song twice through while holding or changing baby. Same tune, same pace.",
    fifteen: "Bring the song back at three different moments today. By the end of the week you may notice baby still-ing or brightening when it starts — that's memory at work."
  },

  /* ============ Weeks 4–6 ============ */
  {
    id: "t-4-pillow", band: "w4_6", category: "tummy",
    title: "Nursing-pillow lookout",
    why: "Propping baby's chest on a nursing pillow gives them a better view, which makes tummy time feel less like work and more like sightseeing.",
    five: "Place baby tummy-down with chest and arms over a nursing pillow (always with you right there). Put your face or a bold toy in front of them.",
    fifteen: "Do two or three propped rounds, moving the interesting thing — your face, a rattle — slowly from the middle to one side, so baby practices turning that wobbly head both ways."
  },
  {
    id: "t-4-track", band: "w4_6", category: "tummy",
    title: "Tummy-time toy sweep",
    why: "Following a slow-moving object during tummy time works neck strength and visual tracking at the same time.",
    five: "With baby on their tummy, hold a contrasting toy at floor level in front of them and drift it slowly toward one side, then back. One or two sweeps is plenty.",
    fifteen: "Across a couple of rounds, sweep the toy to both sides and add sound — a soft shake or your voice. End with a chest snuggle so tummy time keeps its good reputation."
  },
  {
    id: "s-4-texture", band: "w4_6", category: "sensory",
    title: "First texture touches",
    why: "Baby's hands are starting to open more. Brushing different textures against their palms plants the seeds of reaching and grasping.",
    five: "Gather two textures — a soft blanket, a smooth wooden spoon. Brush each gently across baby's palm and name it: 'soft… smooth.'",
    fifteen: "Add a couple more textures (a crinkly wrapper, a nubby washcloth) and try them on palms, forearms, and the soles of feet. Watch which one gets the biggest reaction — you're learning their preferences."
  },
  {
    id: "s-4-rattle", band: "w4_6", category: "sensory",
    title: "Slow rattle tracking",
    why: "Around now, babies start following moving objects past the midline of their face — a genuinely big deal for those little eye muscles.",
    five: "Hold a rattle or bright toy 10–12 inches from baby's face. Shake it gently, then move it slowly in an arc from one side to the other.",
    fifteen: "Do a few rounds in different positions — baby on their back, reclined in your lap, during tummy time. Add a vertical arc (up and down) once the side-to-side feels easy for them."
  },
  {
    id: "l-4-pause", band: "w4_6", category: "language",
    title: "The pause-and-answer game",
    why: "Baby may be starting to coo. Leaving a real gap after you talk gives them room to take their turn — and they often do.",
    five: "Say something to baby, then wait a full five seconds with an expectant, warm face. Any sound, wiggle, or gaze counts as their reply. Respond and repeat.",
    fifteen: "Have a few of these 'conversations' today. Try copying baby's exact coo back to them — many babies find this delightful and keep the volley going."
  },
  {
    id: "l-4-parts", band: "w4_6", category: "language",
    title: "Name the little parts",
    why: "Hearing the same words attached to the same touches — nose, toes, tummy — starts linking sound to meaning long before first words.",
    five: "During a change, touch and name three body parts, same order each time: 'Nose! Tummy! Toes!' A sing-song voice is exactly right.",
    fifteen: "Do it at a few changes today and add a tiny ritual — a kiss on each named part, or a 'beep' for the nose. Predictable and silly is the sweet spot."
  },

  /* ============ Weeks 7–9 ============ */
  {
    id: "t-7-pushup", band: "w7_9", category: "tummy",
    title: "Mini push-up encouragement",
    why: "Baby may be starting to push up on their forearms and hold their head at 45 degrees. Placing things just above eye level invites a little extra lift.",
    five: "During tummy time, hold a toy or your face slightly above baby's natural gaze so they have to lift a bit more to see it. A few seconds of lift is real work — praise softly.",
    fifteen: "Two or three rounds through the day. Between lifts, lay a hand between their shoulder blades for a calming reset. End before frustration wins."
  },
  {
    id: "t-7-side", band: "w7_9", category: "tummy",
    title: "Side-lying play",
    why: "Side-lying is tummy time's gentler cousin — it builds the same core strength and brings baby's hands together where they can see them.",
    five: "Lay baby on their side, a rolled towel behind their back for support, a toy in front at chest height. Let them study and swat.",
    fifteen: "Alternate a few minutes on each side across the day, plus one short classic tummy round. Bonus: side-lying is a lovely position for face-to-face chatting.",
    concernNotes: {
      reflux: "Side-lying (left side, while supervised and awake) is often better tolerated than flat tummy time when reflux is bothering baby. For sleep, back is still the safe way."
    }
  },
  {
    id: "s-7-mirror", band: "w7_9", category: "sensory",
    title: "Mirror meetings",
    why: "Baby won't know that gorgeous face is theirs for many months, but the eye contact, movement, and expressions in a mirror are riveting.",
    five: "Hold baby facing a mirror, or set an unbreakable baby mirror in front of them during tummy time. Point to their reflection: 'Who's that?'",
    fifteen: "Make it a two-part show: some mirror gazing on your lap (wave baby's hand, watch them clock the movement), then the mirror propped for tummy time — one of the all-time great tummy-time motivators."
  },
  {
    id: "s-7-kick", band: "w7_9", category: "sensory",
    title: "Kick at the crinkle",
    why: "Baby is discovering that their movements make things happen — the beginning of cause and effect.",
    five: "Lay crinkly paper or a crinkle toy where baby's feet land while they're on their back. Every kick makes a sound. Watch them figure it out.",
    fifteen: "Rotate what the feet reach: crinkle first, then a soft rattle, then your hands playing 'pedal the bicycle.' Narrate the discoveries: 'You did that!'"
  },
  {
    id: "l-7-copy", band: "w7_9", category: "language",
    title: "Copy their coos",
    why: "When you echo baby's sounds, you show them their voice matters — and they often answer back, stretching the volley longer each week.",
    five: "When baby coos, coo the exact sound back, then wait. Keep the rally going as long as they're enjoying it.",
    fifteen: "Have a few coo conversations today, and once, change your reply slightly — a new vowel, a higher pitch — and see if baby shifts too. That flexibility is language growing in real time."
  },
  {
    id: "l-7-book", band: "w7_9", category: "language",
    title: "Storytime, any book",
    why: "It genuinely doesn't matter what you read — a picture book, a novel, a recipe. Baby is bathing in the melody of your voice.",
    five: "Read anything aloud for a few minutes while baby is snuggled or lying nearby. Let your voice be unhurried.",
    fifteen: "Pick a simple baby book and read it twice, pointing at one picture per page. Then finish with a page or two of whatever *you* feel like reading aloud — that counts fully."
  },

  /* ============ Weeks 10–12 ============ */
  {
    id: "t-10-forearm", band: "w10_12", category: "tummy",
    title: "Forearm prop practice",
    why: "Baby is likely working on propping steadily on forearms with their head at 90 degrees — the sturdy base that rolling and reaching grow from.",
    five: "During tummy time, help baby tuck elbows under shoulders if they've drifted, then park an interesting toy just ahead. Steady propping for a few breaths is the win.",
    fifteen: "A few rounds through the day, gradually placing the toy a touch farther away or higher. Watch for tiny weight shifts side to side — that wobble is skill-building, not failure."
  },
  {
    id: "t-10-reach", band: "w10_12", category: "tummy",
    title: "Just-out-of-reach",
    why: "A toy placed slightly beyond baby's fingertips during tummy time invites weight-shifting and stretching — the raw ingredients of pivoting and, later, crawling.",
    five: "Place a favorite toy an inch or two past baby's reach during tummy time. If frustration builds, slide it into their hand — effort rewarded is the lesson.",
    fifteen: "A couple of rounds, alternating sides you place the toy on. Cheer softly for every scoot, stretch, and swipe. End with the toy 'caught' every time."
  },
  {
    id: "s-10-bat", band: "w10_12", category: "sensory",
    title: "Reach and bat",
    why: "Swiping at dangling toys teaches baby's eyes and hands to team up — clumsy at first, and that's exactly how it's supposed to look.",
    five: "Hold or dangle a light toy within swiping range while baby lies on their back. Every contact, on purpose or not, gets a delighted reaction from you.",
    fifteen: "Use a play gym or dangle two different toys one at a time. Vary the position — slightly left, slightly right, above the chest. Watch their aim improve over the week."
  },
  {
    id: "s-10-hands", band: "w10_12", category: "sensory",
    title: "The great hand discovery",
    why: "Around now many babies find their own hands — staring at them, bringing them together, tasting them. You can make the show even better.",
    five: "Slip a soft wrist rattle or a colorful baby sock onto one of baby's wrists and let them discover the sound and color as they move.",
    fifteen: "Switch the rattle between wrists, then try a soft ankle version. Bring baby's hands gently together in the middle and play a slow pat-a-cake with them."
  },
  {
    id: "l-10-sports", band: "w10_12", category: "language",
    title: "Sportscaster commentary",
    why: "Narrating what baby is doing — not just what you're doing — teaches them that their actions have names.",
    five: "For a few minutes, commentate baby's every move like a friendly announcer: 'She's spotted the rattle… she's going for it… ohh, a solid grab!'",
    fifteen: "Do a couple of commentary sessions in different settings — floor play, bath, the changing table. Keep the tone warm and unhurried; you're describing, not testing."
  },
  {
    id: "l-10-vowel", band: "w10_12", category: "language",
    title: "Vowel volleys",
    why: "Those long 'aaah' and 'oooh' sounds baby makes are the building blocks of speech. Playing with them together stretches baby's repertoire.",
    five: "Make one slow, exaggerated vowel sound — 'aaaah' — with a big open mouth, then pause. Trade sounds back and forth like a gentle tennis rally.",
    fifteen: "Play a few rounds with different vowels and add pitch — high 'eee', low 'ooo'. If baby just watches your mouth, that's still learning; the copying comes later."
  },

  /* ============ Weeks 13–17 (3–4 months) ============ */
  {
    id: "t-13-pivot", band: "w13_17", category: "tummy",
    title: "Pivot practice",
    why: "Before crawling comes pivoting — baby swiveling on their tummy like a little clock hand to reach things beside them.",
    five: "During tummy time, place a toy to baby's side rather than in front. Watch them work their arms and shift weight to angle toward it. Help finish the mission if frustration builds.",
    fifteen: "Do rounds with the toy at different clock positions. Celebrate partial turns — a 10-degree swivel today becomes a full circle in a few weeks."
  },
  {
    id: "t-13-roll", band: "w13_17", category: "tummy",
    title: "Rolling rehearsal",
    why: "Many babies start rolling tummy-to-back around now (back-to-tummy usually comes later). You can make practice feel like play.",
    five: "With baby on their back, hold a toy to one side so they turn head and shoulders toward it. Let them wind up to their side; a gentle hip assist can finish the roll if they're close.",
    fifteen: "Practice both directions across a couple of sessions, always onto a soft surface, always celebrating like it's the Olympics. If baby's not into it today, tummy time as usual is just as good.",
    concernNotes: {
      milestones: "Rolling has one of the widest normal windows there is — anywhere from 3 to 7 months is common. Practice is lovely; pressure isn't needed."
    }
  },
  {
    id: "s-13-grab", band: "w13_17", category: "sensory",
    title: "The grab-and-hold parade",
    why: "Baby's grasp is becoming intentional. Offering one object at a time, in different weights and textures, is a feast for that developing grip.",
    five: "Offer three graspable things one at a time — a rattle, a silicone ring, a clean wooden spoon. Let baby hold, wave, gum, and drop each.",
    fifteen: "Extend the parade to five or six safe objects from around the house. Offer some toward the left hand, some toward the right. Everything will go in the mouth; at this age, that IS the inspection."
  },
  {
    id: "s-13-peek", band: "w13_17", category: "sensory",
    title: "Peekaboo, gentle edition",
    why: "Baby is starting to hold an image in mind for a beat — early peekaboo plays right into that budding memory.",
    five: "Drape a light muslin over your own face and ask 'Where did I go?' then pull it off with a soft 'peekaboo!' Repeat while the giggles (or intent stares) last.",
    fifteen: "Vary it: hide your face behind hands, hide a toy under the muslin and 'find' it together, drape the cloth loosely over baby's feet. Keep it slow and smiley — surprise, not startle."
  },
  {
    id: "l-13-laugh", band: "w13_17", category: "language",
    title: "The laugh laboratory",
    why: "First laughs often arrive around now. Finding what tickles your particular baby's funny bone is legitimate developmental research.",
    five: "Try three bids for a giggle: exaggerated surprised face, gentle 'I'm gonna get you' fingers walking up the tummy, a silly sound like a lip trill. Note what lands.",
    fifteen: "Run the full experiment — sounds, faces, gentle physical comedy like nose-boops and knee bounces. Repeat the winner several times; babies adore a running joke."
  },
  {
    id: "l-13-motion", band: "w13_17", category: "language",
    title: "Songs with hand motions",
    why: "Pairing words with gestures — itsy-bitsy spider, wheels on the bus — gives baby two channels for the same idea, and they start anticipating the moves.",
    five: "Sing one motion song through twice, moving baby's hands gently through the gestures or letting them watch yours.",
    fifteen: "Build a three-song set list and run it at two different times today. By week's end, watch for baby perking up when the first notes start — that's anticipation, a real cognitive step."
  },

  /* ============ Weeks 18–22 (4–5 months) ============ */
  {
    id: "t-18-midline", band: "w18_22", category: "tummy",
    title: "Reach across the middle",
    why: "Reaching across the body's midline during tummy time wires up coordination between the brain's two sides — big prep for crawling.",
    five: "During tummy time, place a toy slightly to baby's right, then encourage a reach with the left hand (a gentle tap on that arm helps), and vice versa.",
    fifteen: "A few rounds mixing midline reaches with regular play. Add a low, stable surface like a couch cushion to reach up onto for variety."
  },
  {
    id: "t-18-airplane", band: "w18_22", category: "tummy",
    title: "Airplane and swimming",
    why: "Around now some babies do the adorable 'swimming' pose — arms and legs up, flying on their tummy. It's a serious core workout disguised as cuteness.",
    five: "During tummy time, hold a toy up and slightly forward to invite that lifted-arms flying pose. Make airplane sounds; this is required.",
    fifteen: "Alternate flying invitations with your own version: lie on your back, shins parallel to the floor, baby resting tummy-down on your shins holding your hands — a gentle, giggly airplane ride (firm grip, low altitude)."
  },
  {
    id: "s-18-mouth", band: "w18_22", category: "sensory",
    title: "The safe mouthing basket",
    why: "At this age, mouthing isn't a habit to redirect — it's how babies gather the richest sensory data. A curated 'yes' basket makes it a game.",
    five: "Offer a small basket of three or four safe, mouthable objects — silicone teether, muslin knot, chilled (not frozen) teething ring. Let baby choose and explore.",
    fifteen: "Rotate six or so objects through the basket, refreshing their interest by swapping items midway. Narrate textures: 'bumpy… cold… soft.'",
    concernNotes: {
      feeding: "Lots of hand-and-toy mouthing, watching you eat with interest, and good head control are some of the readiness signs for solids that usually show up closer to six months — fun to start noticing now."
    }
  },
  {
    id: "s-18-bubbles", band: "w18_22", category: "sensory",
    title: "Bubble watching",
    why: "Bubbles are a full visual-tracking workout — unpredictable, slow, shiny — and reliably one of the best value toys on earth.",
    five: "Blow a few rounds of bubbles at baby's eye level while they're seated in your lap or lying back. Watch those eyes chase.",
    fifteen: "Take bubbles to different settings — near a window, outside if the weather's kind. Catch one on the wand and bring it close for inspection. Pop a few on baby's toes."
  },
  {
    id: "l-18-babble", band: "w18_22", category: "language",
    title: "Babble back and forth",
    why: "Coos are becoming babbles with real consonants mixed in. Answering babble like it's brilliant conversation keeps baby producing more of it.",
    five: "When baby babbles, respond with genuine enthusiasm — repeat their sound, add a real reply ('Is that so? And then what happened?'), and wait for more.",
    fifteen: "Have babble chats at a few points today. Once, try a 'phone call': hold a toy phone or your hand to your ear, babble into it, then hold it to baby. Silly, and secretly serious turn-taking practice."
  },
  {
    id: "l-18-label", band: "w18_22", category: "language",
    title: "Name it as they grab it",
    why: "The moment baby grabs something is the moment their attention is fully on it — the perfect moment for the word to land.",
    five: "During play, name each thing the instant baby takes hold: 'Ball! You've got the ball.' One clear word, warm voice.",
    fifteen: "Keep it going through a play session and a routine (bath: 'cup… duck… water'). Use the same simple word each time rather than synonyms — repetition builds the map."
  },

  /* ============ Weeks 23–26 (5–6 months) ============ */
  {
    id: "t-23-hands", band: "w23_26", category: "tummy",
    title: "Push up to open hands",
    why: "Pushing all the way up onto straight arms with open hands is the next strength milestone after forearm propping — the tripod under future sitting and crawling.",
    five: "During tummy time, hold a toy up high enough that baby pushes up tall to track it. A few seconds on extended arms is real strength work.",
    fifteen: "Mix push-up invitations with rolling games and pivoting across a couple of floor sessions. Variety across positions builds more than any single exercise."
  },
  {
    id: "t-23-roll2", band: "w23_26", category: "tummy",
    title: "Rolling both ways",
    why: "Rolling in both directions often consolidates around now, becoming baby's first real transportation. Making it a game gets them mileage.",
    five: "Place a favorite toy just out of reach to the side while baby's on their back, and cheer on the roll to get it. Move it and repeat the other way.",
    fifteen: "Set up a 'rolling road': a clear blanket-space with a toy a couple of rolls away. Roll alongside them yourself — few things are funnier to a baby than a rolling grown-up.",
    concernNotes: {
      sleep: "When babies are practicing a new motor skill, sleep often gets rockier for a week or two — they literally practice in their sleep. Daytime rolling practice can help it settle sooner."
    }
  },
  {
    id: "s-23-water", band: "w23_26", category: "sensory",
    title: "Water play tray",
    why: "An inch of water and a cup is a complete sensory curriculum: temperature, splash, cause and effect, and the special physics of wet.",
    five: "Sit supported baby with a shallow tray or dish of lukewarm water. Dip their hands, splash together, drip water down their fingers. (Stay within arm's reach, always.)",
    fifteen: "Add a cup, a sponge, and a floating toy. Pour slow waterfalls for baby to catch. Towel nearby, floor forgiven — the mess is the lesson."
  },
  {
    id: "s-23-shake", band: "w23_26", category: "sensory",
    title: "Sound shakers",
    why: "Baby is connecting 'I do this' with 'that happens.' Homemade shakers with different sounds turn that discovery into music.",
    five: "Offer a sealed container with rice or pasta inside (lid taped, supervised). Shake yours, then let baby try. React to every rattle like it's a great song.",
    fifteen: "Make two or three shakers with different fillings — rice for rain sounds, big pasta for clunks. Play loud/quiet, fast/slow. Add a wooden spoon on an upturned pot for the percussion section."
  },
  {
    id: "l-23-consonant", band: "w23_26", category: "language",
    title: "Consonant party",
    why: "Strings like 'ba-ba-ba' and 'ma-ma-ma' often emerge around now. Meeting baby inside those sounds encourages the repetitive babbling that leads to first words.",
    five: "Pick a syllable baby has said and riff on it together: 'Ba! Ba-ba. BA.' Slow, playful, face-to-face.",
    fifteen: "Rotate a few syllables through the day and attach one to a real thing — 'ba' while holding the ball, 'ma-ma' while pointing to Mama. No pressure for baby to copy; you're seeding, not testing."
  },
  {
    id: "l-23-signs", band: "w23_26", category: "language",
    title: "First baby signs",
    why: "Simple signs like 'milk' and 'more' give baby a way to talk months before their mouth can — and now is a lovely time to start planting them.",
    five: "Pick one sign — 'milk' (squeeze a fist) is a classic. Make it every time the word comes up today, saying the word as you sign.",
    fifteen: "Practice two signs ('milk', 'more' — fingertips tapping together) at natural moments: feeds, snacks, games. Expect nothing back for weeks or months; the payoff arrives all at once later."
  },

  /* ============ Weeks 27–34 (6–8 months) ============ */
  {
    id: "t-27-sit", band: "w27_34", category: "tummy",
    title: "Sit, reach, wobble, repeat",
    why: "Sitting is settling in, and reaching from a seated position — with the occasional tip-over onto cushions — is exactly how balance gets built.",
    five: "Sit baby on the floor ringed by cushions and place toys slightly out of easy reach — a bit left, a bit right. Every wobbly reach is balance training.",
    fifteen: "Build a little reaching circuit: toys at different angles and heights around seated baby. Sneak in some tummy time between rounds; floor variety is still the engine of everything."
  },
  {
    id: "t-27-crawl", band: "w27_34", category: "tummy",
    title: "The crawl-chase setup",
    why: "Whether baby is rocking on all fours, army-crawling, or still thinking about it, an irresistible target a few feet away invites forward motion of any kind.",
    five: "Place a beloved toy (or yourself) a few feet from baby on the floor. Cheer every scoot, pivot, lunge, and creative locomotion. Style points don't matter.",
    fifteen: "Make a gentle trail: three toys spaced across a blanket path. Crawl alongside — your crawling is both demonstration and comedy. End the chase with the prize and a cuddle.",
    concernNotes: {
      milestones: "Crawling has a huge normal range, and some perfectly typical babies skip it entirely in favor of bottom-shuffling or going straight to cruising. Floor time and motivation are the helpful parts; the style is baby's call."
    }
  },
  {
    id: "s-27-treasure", band: "w27_34", category: "sensory",
    title: "The treasure basket",
    why: "A basket of safe real-world objects — spoons, fabric, a small pot — out-fascinates most toys, because real things have real weight, sound, and texture.",
    five: "Fill a low basket with four or five safe household objects and set it before seated baby. Your only job: watch what they choose and narrate.",
    fifteen: "Curate eight to ten items across categories — metal (spoon), wood (spatula), fabric (scarf), nature (large smooth pinecone, supervised). Refresh a couple of items midway to reignite interest."
  },
  {
    id: "s-27-bang", band: "w27_34", category: "sensory",
    title: "The banging station",
    why: "Banging things together is a legitimate milestone — it takes two hands doing coordinated work. Loud, yes. Important, also yes.",
    five: "Offer two blocks or stacking cups and demonstrate a joyful clack-clack. Hand them over. An upturned pot with a wooden spoon is the deluxe version.",
    fifteen: "Set up a percussion line: pot, plastic bowl, cushion — things that make different sounds when whacked. Take turns; copy baby's rhythm, then offer a new one."
  },
  {
    id: "l-27-point", band: "w27_34", category: "language",
    title: "Point-and-name walks",
    why: "Carried tours with pointing and naming — light, door, dog — build the word-to-thing map that first words are drawn from.",
    five: "Carry baby on a slow lap of one room, pointing at and naming five things. Same warm word each time: 'Light. Window. Chair.'",
    fifteen: "Tour the house or step outside. Pause at each named thing and let baby look as long as they want; follow their pointing gaze too and name whatever caught them. Their interest is the best curriculum."
  },
  {
    id: "l-27-gesture", band: "w27_34", category: "language",
    title: "Wave, clap, celebrate",
    why: "Gestures like waving and clapping are language before words — and they usually emerge from games, not lessons.",
    five: "Play one round of pat-a-cake or wave 'bye-bye' at every real departure today — the mail carrier, the dog leaving the room, a sock going in the hamper.",
    fifteen: "String together a little gesture medley: pat-a-cake, so-big ('How big is baby? SO big!'), waving, and clapping for anything clap-worthy. Repeat the ones that light baby up."
  },

  /* ============ Weeks 35–43 (8–10 months) ============ */
  {
    id: "t-35-stand", band: "w35_43", category: "tummy",
    title: "Pull-to-stand practice",
    why: "Furniture is about to become gym equipment. Pulling up to stand builds the leg and core strength that cruising and walking grow from.",
    five: "Place a favorite toy on the seat of a sturdy, stable couch or low table so baby is tempted to pull up and get it. Spot them; wobbles are part of the sport.",
    fifteen: "Set up two or three pull-up stations with prizes on top. Practice the getting-down part too — guiding baby to bend knees and plop onto their bottom saves tears all week."
  },
  {
    id: "t-35-course", band: "w35_43", category: "tummy",
    title: "Cushion obstacle course",
    why: "Crawling over uneven, squishy terrain builds strength and body awareness far beyond flat-floor crawling.",
    five: "Lay one couch cushion or folded blanket between baby and a desirable toy. Climbing over it is the whole workout.",
    fifteen: "Build a mini course: cushion mountain, blanket tunnel over two chairs, pillow valley. Crawl it with them. It's a workout for you too — no one said development was only baby's."
  },
  {
    id: "s-35-container", band: "w35_43", category: "sensory",
    title: "In and out, the eternal game",
    why: "Putting things into containers and dumping them back out is baby's current research program: object permanence, spatial reasoning, and gravity, all in one.",
    five: "Give baby a big container and a few blocks or balls. Demonstrate one drop-in ('in!') and one dump-out ('out!'), then hand over the lab.",
    fifteen: "Vary the containers — wide bowl, empty tissue box, muffin tin — and the objects. Add a shape twist: things that barely fit are extra interesting. Expect the dumping to be the favorite part."
  },
  {
    id: "s-35-textures", band: "w35_43", category: "sensory",
    title: "The texture crossing",
    why: "Crawling across different surfaces — rug, wood, a crinkly mat, grass — feeds baby's body-mapping in a way smooth floors can't.",
    five: "Lay two contrasting textures side by side (a fuzzy blanket next to bare floor, bubble wrap taped flat) and lure baby across the border.",
    fifteen: "Build a texture path of three or four patches and take a few crossings, barefoot if it's warm. Outside grass, if available, is the boss level — some babies find it hilarious, some deeply suspicious. Both are correct."
  },
  {
    id: "l-35-pages", band: "w35_43", category: "language",
    title: "Books, with participation",
    why: "Reading now gets physical — baby patting pictures, grabbing pages, choosing the book. That participation is comprehension being born.",
    five: "Read one sturdy board book, letting baby turn (or wrestle) the pages. Point and name one thing per page; pause and let them pat it.",
    fifteen: "Offer a choice of two books and read the chosen one twice — repetition is a feature. Add questions you answer yourself: 'Where's the dog? THERE's the dog!' Their eyes will start beating your finger to it."
  },
  {
    id: "l-35-hide", band: "w35_43", category: "language",
    title: "Where did it go?",
    why: "Object permanence is clicking in — baby now knows hidden things still exist. Hiding games exercise that new superpower and the words that go with it.",
    five: "Hide a toy under a cloth while baby watches, and ask 'Where's the ball?' Cheer the reveal, whoever does it. Repeat until someone's bored (it won't be baby).",
    fifteen: "Level it up: hide under one of two cups and swap slowly; half-hide a toy behind a cushion; play peekaboo where YOU hide behind the doorframe and reappear. Keep asking 'where?' and celebrating 'there!'"
  },

  /* ============ Weeks 44–52 (10–12 months) ============ */
  {
    id: "t-44-cruise", band: "w44_52", category: "tummy",
    title: "The cruising circuit",
    why: "Sideways walking while holding furniture is the bridge to independent steps. Arranging a tempting route makes the miles fly by.",
    five: "Place a toy at the far end of the couch from a standing baby and let them cruise to it. Applaud the journey, not just the arrival.",
    fifteen: "Arrange furniture into a cruising loop with small, safe gaps that invite a brave hand-transfer or — someday soon — a first unassisted step. Spot the gaps; celebrate the attempts."
  },
  {
    id: "t-44-push", band: "w44_52", category: "tummy",
    title: "Push-power walking",
    why: "Pushing a weighted laundry basket or a sturdy push-walker lets baby practice stepping with support they control themselves.",
    five: "Load a laundry basket with a few books for weight and let baby push it across the floor while stepping behind it. Stay close; steering is not yet included.",
    fifteen: "Set up a push route with a destination — push the basket to the window, wave at the world, push back. Add a passenger (a stuffed animal) for narrative flair."
  },
  {
    id: "s-44-scoop", band: "w44_52", category: "sensory",
    title: "Scoop, pour, repeat",
    why: "Scooping and pouring — water, large pasta, oat cereal — is the fine-motor gym where future spoon-feeding and cup-drinking are trained.",
    five: "In the high chair or at a tray: a cup, a bowl, and a scoopable (a splash of water or a handful of dry oat cereal). Demonstrate one scoop-and-pour and hand it over.",
    fifteen: "Full pouring station: two containers, a big spoon, a small cup. Expect spillage — that's data collection, not mess. A towel underneath makes peace with physics.",
    concernNotes: {
      feeding: "Practicing with an open cup and a preloaded spoon at play (not just meals) takes the pressure off and builds the same skills. Messy is the curriculum."
    }
  },
  {
    id: "s-44-ball", band: "w44_52", category: "sensory",
    title: "Ball rolling, together",
    why: "Rolling a ball back and forth is baby's first true cooperative game — my turn, your turn, shared delight.",
    five: "Sit facing baby, legs wide, and roll a soft ball to them. Coax the return roll; any push counts. React to each arrival like a small miracle.",
    fifteen: "Vary the game: different sized balls, rolling toward a tower to knock over, gentle bounces. Add words on rhythm — 'ready… set… roll!' — and pause before 'roll' to let anticipation build."
  },
  {
    id: "l-44-word", band: "w44_52", category: "language",
    title: "Label and wait",
    why: "First words often arrive around the first birthday — earlier for some, later for many. The best invitation is a clear label followed by unhurried silence.",
    five: "When baby shows interest in something, name it simply — 'Dog!' — then wait, watching their face. Any sound they offer gets warmly accepted as an attempt.",
    fifteen: "Do label-and-wait through a play session. If baby says 'ba' for ball, echo the real word back naturally ('Yes! Ball!') — affirm the try, model the target, never correct.",
    concernNotes: {
      milestones: "Understanding runs far ahead of speaking at this age. If baby looks at the right thing when you name it, language is developing beautifully — the mouth just hasn't caught up to the brain yet."
    }
  },
  {
    id: "l-44-request", band: "w44_52", category: "language",
    title: "The little helper game",
    why: "Following a simple request — 'give me the cup' — shows how much language baby understands before they can say much at all.",
    five: "During play, ask for one object with a hand held out: 'Can I have the block?' Cheer any handover (and hand it right back — the return is half the fun).",
    fifteen: "Weave small requests into routines: 'put it in the basket,' 'give the bear a hug,' 'wave bye-bye.' Gesture along with your words; you're building comprehension, and it's fine to help them succeed."
  },

  /* ============ Weeks 53–65 (12–15 months) ============ */
  {
    id: "t-53-steps", band: "w53_65", category: "tummy",
    title: "Open-floor step time",
    why: "Whether baby is taking first steps or still cruising confidently, protected open-floor time — no hands to hold, soft landings — is where walking gets negotiated.",
    five: "Clear a small runway between two soft destinations (you and the couch) and let baby travel it their way — cruise, toddle, speed-crawl. All modes respected.",
    fifteen: "Position yourself a few steps away, arms out, and slowly increase the gap over rounds. Celebrate landings and falls equally; a bold faller is a fast learner.",
    concernNotes: {
      milestones: "Walking anywhere from 9 to 18 months is within the typical range — a fact that surprises many parents. Confident cruising and pulling to stand are the signs the system is coming online."
    }
  },
  {
    id: "t-53-climb", band: "w53_65", category: "tummy",
    title: "Climb and carry",
    why: "New walkers crave two things: climbing onto everything and carrying objects around. Building a safe version of both channels the urge productively.",
    five: "Stack sofa cushions into a low climbing mound and spot baby up and over it. Two crossings equal one grown-up gym session, emotionally.",
    fifteen: "Add carrying missions: 'take the ball to the basket,' walking while holding a (light) prized object. Climbing plus carrying plus walking is the toddler triathlon."
  },
  {
    id: "s-53-crayon", band: "w53_65", category: "sensory",
    title: "First marks",
    why: "A chunky crayon and paper introduce a wild idea: my hand can make something appear. The scribbles are beside the point; the discovery is everything.",
    five: "Tape paper to the table or floor, offer one chunky crayon, and make one slow line yourself. Then let baby experiment. (Tasting the crayon is a predictable side quest — stay close.)",
    fifteen: "Offer two or three colors, one at a time. Narrate without directing: 'A red line! Dots!' Hang the masterpiece somewhere visible; artists notice when their work is honored."
  },
  {
    id: "s-53-bin", band: "w53_65", category: "sensory",
    title: "The oat bin",
    why: "A shallow bin of dry oats with cups and spoons is a beach day in your kitchen — pouring, burying, texture, and glorious repetition.",
    five: "Shallow bin, two cups of dry oats, one scoop, one small toy to bury and find. Sit baby at it (a splat mat or towel underneath earns its keep).",
    fifteen: "Add tools — funnel, muffin tin, big spoon — and hide a few 'treasures' to excavate. Everything stays more or less in the bin for the first three minutes; accept the diaspora after that."
  },
  {
    id: "l-53-expand", band: "w53_65", category: "language",
    title: "Say it back, plus one",
    why: "When you take baby's word and add one more — baby says 'dog,' you say 'big dog!' — you hand them the next rung of the ladder at exactly their height.",
    five: "Listen for any word or word-attempt and expand it by one: 'ba' becomes 'ball! bouncy ball.' Warm, natural, no drilling.",
    fifteen: "Do it across a play session and a book. Keep score privately of how many different words or attempts you hear — not to worry over, just to notice the collection growing week by week."
  },
  {
    id: "l-53-body", band: "w53_65", category: "language",
    title: "Nose, toes, and everything knows",
    why: "'Where's your nose?' is a classic for a reason — body parts are vocabulary baby carries everywhere, and pointing to them shows real comprehension.",
    five: "Ask 'Where's your nose?' and guide baby's hand there, with a happy 'THERE's your nose!' Do nose, tummy, toes.",
    fifteen: "Play it in the mirror, on a stuffed animal ('where's bear's nose?'), and on you. Add a song — 'Head, Shoulders, Knees and Toes' at half speed counts as both curriculum and cardio."
  },

  /* ============ Weeks 66+ (15 months and beyond) ============ */
  {
    id: "t-66-squat", band: "w66up", category: "tummy",
    title: "Walk, squat, carry",
    why: "Toddler movement is now about complexity: squatting to pick things up, walking while carrying, changing direction. Errand-style games train all of it.",
    five: "Scatter a few soft toys on the floor and hand baby a bucket: the mission is walk, squat, retrieve, carry, deposit. Narrate the heroics.",
    fifteen: "Build a collection course through two rooms — items to gather, a couch cushion to climb over en route, a basket finish line. Trade roles and let baby 'send' you on missions too."
  },
  {
    id: "t-66-kick", band: "w66up", category: "tummy",
    title: "Kick and chase",
    why: "Kicking a ball while walking is a genuine coordination feat — balance on one foot, aim with the other, chase the result.",
    five: "Set a lightweight ball at baby's feet and demonstrate one gentle kick-and-chase. Then follow their lead — the chase is usually the favorite part.",
    fifteen: "Make a soft goal (couch cushion gate) and take turns. Add gentle variations: kicking to each other, chasing a rolled ball, big dramatic 'goooal!' celebrations."
  },
  {
    id: "s-66-pretend", band: "w66up", category: "sensory",
    title: "Pretend play starters",
    why: "Feeding a teddy bear or 'talking' on a banana phone marks a leap: baby is now using one thing to stand for another. That's imagination switching on.",
    five: "Hand baby a spoon and an empty bowl near a stuffed animal and 'feed' the bear one bite yourself, with sound effects. Then let the restaurant open.",
    fifteen: "Expand the scene: bear gets fed, washed with a dry cloth, and put to bed with a blanket and a 'shhh.' Follow baby's script wherever it wanders — their plot twists are the development."
  },
  {
    id: "s-66-stack", band: "w66up", category: "sensory",
    title: "Stack and smash",
    why: "Stacking two or three blocks takes serious precision — and knocking towers down teaches cause and effect with maximum joy.",
    five: "Build a three-block tower and slide the blocks to baby for the next one. Any stack of two deserves applause; every demolition deserves a dramatic gasp.",
    fifteen: "Vary the materials — blocks, cups, empty boxes — and build a tower taller than baby to topple together. Count blocks aloud as they stack: numbers hitching a ride on fun."
  },
  {
    id: "l-66-choice", band: "w66up", category: "language",
    title: "This one or that one?",
    why: "Offering choices — 'apple or banana?' — invites baby to communicate a preference by pointing, reaching, or word, and shows them their voice steers the world.",
    five: "At snack or play, hold up two options and name each: 'Ball… or book?' Honor whatever they indicate, instantly and cheerfully.",
    fifteen: "Sprinkle choices through the day — shirts, snacks, books, songs. Model the word for their pick ('Banana! You chose banana') and enjoy the tiny dictator phase this responsibly enables."
  },
  {
    id: "l-66-story", band: "w66up", category: "language",
    title: "Tell me the story",
    why: "Pausing in familiar books to let baby 'read' — point, babble, name, turn pages — flips storytime from performance into conversation.",
    five: "Open a well-worn favorite and instead of reading, ask 'What's happening here?' Accept points and babbles as full answers, and weave them in: 'Yes! The duck IS splashing.'",
    fifteen: "Read two books this way, then let baby take you on a 'reading tour' of pictures around your home — photos, art, cereal boxes. Everything with a picture has a story if the narrator is committed."
  }
];

/* ---------- Milestones per band ----------
   Framed as "you might start noticing" — never a checklist to
   pass or fail. Every band ends with the same core reassurance,
   plus a gentle when-to-mention line. */

SPROUT.MILESTONES = {
  w0_1: {
    heading: "In these very first days, you might notice…",
    items: [
      "Baby briefly focusing on your face when you're 8–12 inches away",
      "Turning toward your voice or a familiar sound",
      "Strong newborn reflexes — grasping your finger, startling at sudden noises",
      "Short stretches of quiet alertness between all that important sleeping"
    ],
    note: "Newborns spend most of their time eating, sleeping, and recalibrating to life outside. If baby does little besides that this week, they're doing the job perfectly."
  },
  w2_3: {
    heading: "Around weeks 2–3, you might start noticing…",
    items: [
      "Longer moments of eye contact and studying your face",
      "Brief head lifts during tummy time — even a wobbly centimeter counts",
      "Beginning to distinguish day from night (very much a work in progress)",
      "Calming, sometimes, to your voice, your smell, or being held close"
    ],
    note: "Crying often increases through these weeks and tends to peak around week six — it's a phase of development, not a reflection of your care."
  },
  w4_6: {
    heading: "Around this age, you might start noticing…",
    items: [
      "The first real social smile — aimed at you, on purpose (worth every 3am)",
      "Cooing and soft vowel sounds",
      "Smoother head control and steadier tummy-time lifts to about 45 degrees",
      "Eyes following you or a toy as it moves slowly side to side"
    ],
    note: "Social smiles arrive on their own schedule, anywhere from around 4 to 8 weeks. If you're still waiting, you're likely days away from the best paycheck of your life."
  },
  w7_9: {
    heading: "Around 2 months, you might start noticing…",
    items: [
      "Smiling back at you reliably, and maybe early giggle precursors",
      "Pushing up on forearms in tummy time, head held around 45 degrees",
      "More varied cooing — little conversations with pauses",
      "Hands unclenching more, batting vaguely at nearby things",
      "Briefly self-soothing by sucking on hands"
    ],
    note: "Babies alternate between motor leaps and social leaps — a week heavy on smiling may be light on push-ups, and vice versa. The system is working."
  },
  w10_12: {
    heading: "Around 3 months, you might start noticing…",
    items: [
      "Steady head control when upright, propping on forearms with head at 90 degrees",
      "Discovering their own hands — staring at them like fascinating strangers",
      "Swiping at and sometimes grabbing dangling toys",
      "Laughing or squealing starting to emerge",
      "Recognizing you across the room and lighting up"
    ],
    note: "That hand-staring phase is real cognition: baby is figuring out those things belong to them. Every baby assembles these pieces in their own order."
  },
  w13_17: {
    heading: "Around 3–4 months, you might start noticing…",
    items: [
      "Rolling from tummy to back (sometimes surprising everyone, including baby)",
      "Real belly laughs — and strong opinions about what's funny",
      "Reaching for and grasping toys on purpose, then straight to the mouth",
      "Bearing weight on legs when held standing, bouncing with delight",
      "Recognizing familiar people and maybe protesting when you leave the room"
    ],
    note: "Rolling can arrive anywhere from 3 to 7 months and still be perfectly typical. The wide range is the norm, not the exception."
  },
  w18_22: {
    heading: "Around 4–5 months, you might start noticing…",
    items: [
      "Rolling becoming more deliberate, maybe in both directions",
      "Babbling with consonants creeping in — 'ba', 'ga', 'ma'",
      "Reaching accurately with one hand and passing things hand to hand",
      "Sitting with support and loving the upright view",
      "Deep interest in watching you eat (foreshadowing!)"
    ],
    note: "This is also prime sleep-shakeup territory as motor skills surge — babies practice new moves in their cribs at 2am. It passes."
  },
  w23_26: {
    heading: "Around 5–6 months, you might start noticing…",
    items: [
      "Sitting with less and less support, tripod-style hands on the floor",
      "Repetitive babble strings — 'bababa', 'mamama' (not addressed to anyone yet, still thrilling)",
      "Pushing up on straight arms in tummy time, maybe rocking or pivoting",
      "Showing readiness signs for solids: good head control, interest in food, less tongue-thrust",
      "Knowing their name and turning when you call it"
    ],
    note: "Sitting solo clicks in anywhere from 4 to 9 months. Wobbling and toppling onto cushions isn't failure — it's literally how balance is learned."
  },
  w27_34: {
    heading: "Around 6–8 months, you might start noticing…",
    items: [
      "Sitting steadily and reaching without toppling (mostly)",
      "Some form of locomotion brewing: rocking on all fours, army crawling, scooting, or rolling everywhere",
      "Passing objects between hands and banging things together with gusto",
      "Responding to their name, babbling back when you talk",
      "Early stranger awareness — suddenly preferring their favorite people"
    ],
    note: "Crawling styles are gloriously varied and some babies skip crawling altogether. Stranger anxiety, if it shows up, is a memory milestone wearing a disguise."
  },
  w35_43: {
    heading: "Around 8–10 months, you might start noticing…",
    items: [
      "Crawling (in some style) with increasing speed and intent",
      "Pulling to stand on furniture and maybe cruising along it",
      "The pincer grasp emerging — picking up small things with thumb and finger",
      "Understanding 'no' and their own name; maybe waving bye-bye",
      "Object permanence in full force: finding hidden toys, protesting when you leave"
    ],
    note: "Separation anxiety around now is a sign of healthy attachment and memory, even though it can be exhausting to be this beloved."
  },
  w44_52: {
    heading: "Approaching the first birthday, you might start noticing…",
    items: [
      "Cruising confidently, standing solo for a beat, maybe first steps",
      "First words or very consistent word-like sounds ('mama', 'dada', 'ba' for ball)",
      "Following simple requests like 'give it to me' or 'wave bye-bye'",
      "Pointing at things they want or find interesting",
      "Playing early games: peekaboo initiated by baby, offering you toys"
    ],
    note: "First steps land anywhere from 9 to 18 months, and first words have a similarly generous window. Understanding always runs ahead of speaking."
  },
  w53_65: {
    heading: "Around 12–15 months, you might start noticing…",
    items: [
      "Walking — brand-new, wide-stanced, arms up like a tiny surfer — or confidently cruising toward it",
      "A handful of words used with meaning, and jargon-babble that sounds like sentences",
      "Pointing to ask, show, and share — a huge communication leap",
      "Simple pretend gestures: 'drinking' from an empty cup, hugging a stuffed animal",
      "Strong preferences, loudly expressed (personality: fully installed)"
    ],
    note: "The walking window stays wide open through 18 months. Meanwhile, comprehension is exploding — watch how much baby understands compared to a month ago."
  },
  w66up: {
    heading: "In these busy toddler months, you might notice…",
    items: [
      "Walking well, starting to run (approximately), climbing everything with a ladder-like ambition",
      "Vocabulary growing — new words appearing weekly, animal sounds as bonus vocabulary",
      "Following two-step-ish instructions on a good day",
      "Real pretend play: feeding bears, stirring pots, phone calls to nobody",
      "Big feelings in a small body — frustration and delight arriving at full volume"
    ],
    note: "Toddler development is jagged by design: a language burst one month, a motor burst the next, and occasional weeks where the main skill practiced is 'no.' All of it counts."
  }
};

/* Shared closing lines for the milestone card. */
SPROUT.MILESTONE_REASSURE =
  "Every baby moves through these on their own timeline — the ranges are wide and 'typical' is a broad, generous country.";
SPROUT.MILESTONE_MENTION =
  "If something ever tugs at your gut, jot it down for the pediatrician — asking is never overreacting, and noticing is a parenting skill, not a worry problem.";

/* ---------- Parent self-care prompts (all under 10 minutes) ----------
   tags: match user concerns to gently prioritize relevant prompts. */

SPROUT.SELF_CARE = [
  { id: "sc-water", text: "Fill your biggest cup with water and drink it somewhere you can see out a window. That's it. That's the whole assignment.", tags: [] },
  { id: "sc-breathe", text: "Try four rounds of slow box breathing: in for 4, hold for 4, out for 4, hold for 4. It quietly resets a nervous system that's been on call all day and night.", tags: ["sleep", "crying"] },
  { id: "sc-shower", text: "Take a shower with zero agenda — not to get ready, just to stand in warm water for five minutes. If baby needs to sit in the bouncer in the doorway, that's a fine audience.", tags: [] },
  { id: "sc-text", text: "Text one person who makes you feel like yourself. No update required, no photo obligation — even just 'thinking of you' reopens a door.", tags: ["parent"] },
  { id: "sc-outside", text: "Step outside — porch, balcony, sidewalk — for five slow minutes. Daylight on your face is one of the cheapest, realest mood and sleep supports there is.", tags: ["sleep", "parent"] },
  { id: "sc-snack", text: "Make yourself an actual snack on an actual plate, and eat it sitting down if the universe allows. You feed everyone; this one's yours.", tags: [] },
  { id: "sc-shoulders", text: "Set a 5-minute timer and stretch the feeding muscles: roll your shoulders back slowly, tip each ear to shoulder, hug your arms across your chest. Your neck carries more than the baby does.", tags: [] },
  { id: "sc-oneline", text: "Write one sentence about today — in your notes app, on a receipt, anywhere. Not a journal habit, just one line. Future you will treasure the archive current you accidentally builds.", tags: [] },
  { id: "sc-song", text: "Play one song you loved before all this, at a volume slightly louder than sensible. Dancing with a baby on your hip counts as both cardio and bonding.", tags: ["parent"] },
  { id: "sc-eyes", text: "Lie down flat for eight minutes with your eyes closed. Not committing to a nap, not scrolling — just horizontal with your eyes shut. Rest counts even when sleep doesn't come.", tags: ["sleep"] },
  { id: "sc-lowerbar", text: "Pick one thing on today's invisible to-do list and formally cancel it. Say it out loud if it helps: 'The laundry can be tomorrow's problem.' Lowering the bar is a skill, not a lapse.", tags: ["parent", "crying"] },
  { id: "sc-warm", text: "Make a hot drink and — this is the hard part — drink it while it's still hot. Sit somewhere comfortable. If it goes cold anyway, microwave it without apology.", tags: [] },
  { id: "sc-lotion", text: "Give your own hands a one-minute massage with lotion — slow circles on the palms, a gentle pull on each finger. Hands that do this much care deserve thirty seconds of it back.", tags: [] },
  { id: "sc-laugh", text: "Watch one thing that reliably makes you laugh — a saved video, a favorite scene, that one group chat thread. Laughter is a legitimate recovery tool, not a distraction from duty.", tags: ["parent", "crying"] },
  { id: "sc-future", text: "Spend five minutes on something for future-you: set out tomorrow's coffee cup, put your phone charger where you actually sit, refill the diaper caddy. Tiny kindness, delayed delivery.", tags: [] },
  { id: "sc-body", text: "Do a slow head-to-toe check-in: unclench your jaw, drop your shoulders, unclench them again (they crept back up), soften your belly. Notice one thing your body did well today — it grew, birthed, fed, or carried a whole person recently.", tags: ["parent"] },
  { id: "sc-honest", text: "Take two minutes to answer honestly, just to yourself: how am I actually doing? If the answer has been 'heavy' for more than a couple of weeks, mentioning it to your own doctor is a strong move, not an admission — postpartum feelings are health, not character.", tags: ["parent"] },
  { id: "sc-nothing", text: "Sit down and do genuinely nothing for five minutes. Not resting-while-planning, not relaxing-productively. Staring at the wall is a time-honored parenting tradition and you have fully earned your turn.", tags: ["sleep", "parent"] }
];

/* ---------- Pediatrician questions ----------
   Filtered by age (weeks), and preferentially matched to the
   family's feeding type and concerns. */

SPROUT.PED_QUESTIONS = [
  /* Early weeks */
  { id: "pq-weight", min: 0, max: 8, text: "Is baby's weight gain tracking the way you'd expect for their curve — and what would you want us to watch for between visits?" },
  { id: "pq-vitd", min: 0, max: 26, feeding: ["breastfed", "combination"], text: "Should we be giving vitamin D drops, and if so, what dose and brand style do you suggest?" },
  { id: "pq-formula-prep", min: 0, max: 12, feeding: ["formula", "combination"], text: "Can you double-check our formula prep — water type, amounts, and how long a prepared bottle can safely sit out or be refrigerated?" },
  { id: "pq-spitup", min: 0, max: 26, concerns: ["reflux"], text: "Baby spits up regularly — how do we tell the difference between normal 'happy spitter' reflux and reflux that needs treatment?" },
  { id: "pq-reflux-comfort", min: 4, max: 34, concerns: ["reflux"], text: "What comfort measures for reflux do you actually recommend — feeding positions, pacing, burping — and which popular ones should we skip?" },
  { id: "pq-daynight", min: 0, max: 8, concerns: ["sleep"], text: "Baby seems to have days and nights mixed up — is there anything you'd suggest to help, or is it just a matter of time at this age?" },
  { id: "pq-crying", min: 0, max: 17, concerns: ["crying"], text: "Baby has long crying stretches most days — can we walk through what's typical, what helps, and what would make you want to look further?" },
  { id: "pq-ppd", min: 0, max: 26, concerns: ["parent"], text: "I'd like to talk about how I'm doing, too — what postpartum mood support do you recommend, and who should I contact if things feel heavier than baby blues?" },
  { id: "pq-tummyhate", min: 2, max: 17, text: "Baby isn't a fan of tummy time — how much should we aim for at this age, and do chest and lap positions count toward it?" },
  { id: "pq-sleep-safe", min: 0, max: 12, concerns: ["sleep"], text: "Can we review our sleep setup — bassinet, swaddle, room temperature — to make sure it's as safe and as restful as possible?" },
  { id: "pq-feeding-enough", min: 0, max: 12, concerns: ["feeding"], text: "How can we tell baby is getting enough to eat — what diaper counts, weight signs, or feeding patterns should reassure us or prompt a call?" },

  /* 2–4 months */
  { id: "pq-vaccine-comfort", min: 6, max: 20, text: "What's the best way to keep baby comfortable after vaccines — and when would post-shot fussiness or fever be worth a call?" },
  { id: "pq-rolling-swaddle", min: 8, max: 22, concerns: ["sleep"], text: "When baby starts rolling, how should we transition out of the swaddle — cold turkey, one arm at a time, or a transitional sleep sack?" },
  { id: "pq-sleep-stretch", min: 10, max: 26, concerns: ["sleep"], text: "What do typical night stretches look like at this age, and when — if ever — would you suggest we start shaping sleep more actively?" },
  { id: "pq-flathead", min: 6, max: 26, text: "We want to keep baby's head shape nicely rounded — how much repositioning and tummy time helps, and what would make you consider it worth monitoring?" },
  { id: "pq-drool", min: 10, max: 30, text: "There's a lot of drooling and hand-chewing — how do we tell teething from just normal baby-of-this-age behavior, and what soothing methods do you like?" },
  { id: "pq-milestone-check", min: 8, max: 22, concerns: ["milestones"], text: "Can we go through the milestone checklist together? I'd love to know what you're seeing and what to enjoy watching for before the next visit." },

  /* 4–6 months */
  { id: "pq-solids-ready", min: 17, max: 28, text: "What readiness signs for solid foods should we watch for, and do you lean toward purees, baby-led weaning, or a mix for us?" },
  { id: "pq-sleep-train", min: 17, max: 44, concerns: ["sleep"], text: "We're thinking about working on independent sleep — which approaches do you consider safe and effective at this age, and what would you suggest for our situation?" },
  { id: "pq-reflux-outgrow", min: 17, max: 34, concerns: ["reflux"], text: "Is baby's reflux following the usual pattern of improving as they sit up and start solids — and if it's not better by a certain age, what's the next step?" },
  { id: "pq-formula-switch", min: 8, max: 30, feeding: ["formula", "combination"], text: "Is there any reason to consider a different formula for us — and what symptoms would actually justify a switch versus normal baby digestion?" },
  { id: "pq-nursing-changes", min: 13, max: 34, feeding: ["breastfed", "combination"], text: "Feeding patterns are changing — more distraction, different spacing. What's normal for this age, and what would suggest a supply or transfer issue worth checking?" },

  /* 6–9 months */
  { id: "pq-allergens", min: 23, max: 40, text: "How should we introduce the big allergens — peanut, egg, and friends — and what reaction signs mean 'call you' versus 'call emergency services'?" },
  { id: "pq-iron", min: 23, max: 44, text: "Is baby getting enough iron from their current mix of milk and solids — and are there foods or supplements you'd suggest?" },
  { id: "pq-nightwake", min: 26, max: 52, concerns: ["sleep"], text: "Baby still wakes at night — at this age, how do we tell hunger from habit, and what would you suggest if we want longer stretches?" },
  { id: "pq-pincer", min: 30, max: 48, concerns: ["milestones"], text: "What finger foods are safest for practicing the pincer grasp, and can we review the difference between gagging (normal) and choking (emergency) one more time?" },
  { id: "pq-constipation", min: 23, max: 44, concerns: ["feeding"], text: "Since starting solids, baby's digestion has changed — what's normal, and which foods help if things get slow or uncomfortable?" },

  /* 9–12 months */
  { id: "pq-milk-transition", min: 40, max: 56, text: "How should we plan the transition around the first birthday — from formula or breastmilk toward whole milk — and what does that timeline look like for us?" },
  { id: "pq-walking-range", min: 40, max: 65, concerns: ["milestones"], text: "Baby's working on standing and cruising — what's the full normal range for walking, and what would you want to see by the 15- or 18-month visit?" },
  { id: "pq-firstwords", min: 40, max: 65, concerns: ["milestones"], text: "What language signs matter most right now — words, pointing, understanding — and what would make you refer us for extra support versus watch and wait?" },
  { id: "pq-selfwean", min: 40, max: 60, feeding: ["breastfed", "combination"], text: "I'm thinking about how long to continue breastfeeding — can we talk through options and how weaning works whenever we choose to start?" },
  { id: "pq-bottlewean", min: 44, max: 60, feeding: ["formula", "combination"], text: "When and how should we phase out bottles in favor of cups — and does it matter for teeth as much as I've heard?" },

  /* 12+ months */
  { id: "pq-appetite", min: 52, max: 900, text: "Baby's appetite has gotten unpredictable — is this the normal toddler slowdown, and how should we think about portions and picky days?" },
  { id: "pq-shoes", min: 52, max: 80, text: "Now that walking is (nearly) here — do they need shoes indoors, and what should we look for in a first pair for outside?" },
  { id: "pq-screens", min: 52, max: 900, text: "What's your practical take on screens at this age — video calls with family, background TV, the occasional survival cartoon?" },
  { id: "pq-tantrum", min: 60, max: 900, text: "Big feelings have arrived — what's your favorite guidance for handling toddler frustration in a way that's realistic for tired parents?" },
  { id: "pq-toddler-sleep", min: 52, max: 900, concerns: ["sleep"], text: "What does typical sleep look like heading into toddlerhood — naps, night waking, early rising — and when should we adjust the schedule?" },

  /* Evergreen fallbacks */
  { id: "pq-general-dev", min: 0, max: 900, text: "Is there anything about baby's growth or development you're keeping an eye on that we should know about — and anything fun to watch for before the next visit?" },
  { id: "pq-when-to-call", min: 0, max: 900, text: "What symptoms or changes would you want a call about between visits, versus things that can safely wait for the next appointment?" }
];

/* ---------- Concern & feeding option labels ---------- */

SPROUT.CONCERN_OPTIONS = [
  { id: "sleep",      label: "Sleep" },
  { id: "reflux",     label: "Reflux / spit-up" },
  { id: "milestones", label: "Milestones" },
  { id: "feeding",    label: "Feeding" },
  { id: "crying",     label: "Crying / colic" },
  { id: "parent",     label: "Taking care of me" }
];

SPROUT.FEEDING_OPTIONS = [
  { id: "breastfed",   label: "Breastfed" },
  { id: "formula",     label: "Formula" },
  { id: "combination", label: "Combination" }
];

SPROUT.CATEGORY_META = {
  tummy:    { label: "Movement & tummy time", icon: "🐛" },
  sensory:  { label: "Sensory play",          icon: "✨" },
  language: { label: "Language & connection", icon: "💬" }
};
