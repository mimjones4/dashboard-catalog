# fal.ai Prompt Set — Leo (10 Scenes, standalone text-to-image)

Character design source of truth: **`leo-character-sheet.md`** (Leo is a
human boy — the character text in every scene below is spliced from that
file verbatim).

Unlike the Kontext set (`flux-kontext-prompts.md`), these prompts are
standalone: no reference image, so the full character sheet is repeated in
every scene. Only the scene direction at the end changes.

The shared spliced block (identical in all 10 prompts):

> Children's storybook illustration, STEM diagrammatic style. Leo, a
> 7-year-old human boy with short wavy dark-brown hair, warm light-tan skin,
> a few freckles across his nose, and big expressive brown eyes. He wears a
> mustard-yellow crew-neck T-shirt, soft navy-blue joggers, and white
> sneakers. Set into the front of his T-shirt is a transparent rounded-
> rectangle chest panel — like a clear window over his chest — revealing
> three large round control buttons in a horizontal row: a RED button with a
> white speaker icon (left), a YELLOW button with a white clothing-tag icon
> (centre), and a BLUE button with a white toddler-silhouette icon (right).
> Thin gray technical callout lines with small circular endpoints label the
> panel edges, diagram-style. Schematic overlays on a warm realistic scene,
> clean uniform outlines, soft cel shading, gentle rounded shapes, no text
> anywhere in the image.

---

## Scene 1

> [shared block] Neutral standing pose in a warm sunlit bedroom, chest panel
> calm and dim, gentle smile.

## Scene 2

> [shared block] Close-up on the transparent chest panel with the three
> labeled buttons (red/speaker, yellow/tag, blue/toddler silhouette), soft
> glow, prominent technical callout lines.

## Scene 3

> [shared block] The red button is fully lit and glowing; Leo has an
> overwhelmed expression, warm red-orange energy radiating from the panel.

## Scene 4

> [shared block] Leo sits on the floor with his hands over his ears, red
> button glowing, sound-wave lines nearby.

## Scene 5

> [shared block] Leo pulls at his shirt collar with a scrunched
> uncomfortable face, yellow button glowing.

## Scene 6

> [shared block] Leo looks alarmed at his little sister — a human toddler
> girl about 2 years old with big curly dark-brown hair and a coral-pink
> dress, cheerful and oblivious, holding Leo's toy — while his blue button
> glows.

## Scene 7

> [shared block] Leo wears soft over-ear headphones, and small protective
> cover-flaps are installed over all three chest buttons; calmer expression,
> cooler color palette.

## Scene 8

> [shared block] Side profile of Leo walking down a school hallway, safety
> covers installed on all buttons, confident posture.

## Scene 9

> [shared block] Leo celebrates with arms raised and a big smile, buttons
> covered and stable, warm golden lighting.

## Scene 10

> [shared block] Full-body front-facing hero pose, all buttons covered, calm
> confident expression, balanced lighting.

---

## Usage

Replace `[shared block]` with the full spliced paragraph at the top when
submitting each prompt (fal.ai text-to-image endpoints take one flat string
per generation). Keeping the block identical across all 10 submissions is
what holds the character together without a reference image — do not
paraphrase it per scene.
