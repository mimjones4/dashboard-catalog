# FLUX Kontext Pro Prompt Set — Leo (10 Scenes)

Character design source of truth: **`leo-character-sheet.md`** (Leo is a
human boy — the `[LEO]` block below is spliced from that file verbatim).

Kontext Pro workflow: generate Scene 1 fresh as the anchor image, then feed
the Scene 1 output back in as the reference image for Scenes 2–10 with the
edit instructions below.

---

## Scene 1 — Anchor (generate fresh)

> Generate: children's storybook character, STEM diagrammatic style. Leo, a
> 7-year-old human boy with short wavy dark-brown hair, warm light-tan skin,
> a few freckles across his nose, and big expressive brown eyes. He wears a
> mustard-yellow crew-neck T-shirt, soft navy-blue joggers, and white
> sneakers. Set into the front of his T-shirt is a transparent rounded-
> rectangle chest panel — like a clear window over his chest — revealing
> three large round control buttons in a horizontal row: a RED button with a
> white speaker icon (left, for loud noises), a YELLOW button with a white
> clothing-tag icon (centre, for itchy tags), and a BLUE button with a white
> toddler-silhouette icon (right, for his little sister). Thin gray technical
> callout lines with small circular endpoints label the panel edges,
> diagram-style. STEM diagrammatic children's-storybook style: schematic
> overlays on a warm realistic scene, clean uniform outlines, soft cel
> shading, gentle rounded shapes. Neutral standing pose, warm sunlit bedroom,
> calm dim chest panel, gentle smile, clean storybook illustration, no text.

## Scenes 2–10 — Edits (feed Scene 1 output back in as reference each time)

2. Using this exact boy, show a close-up on his transparent chest panel with
   three labeled buttons (red/speaker icon, yellow/tag icon, blue/toddler
   icon), soft glow, technical callout lines, same art style.

3. Using this exact boy, same face and outfit, show him with the red button
   fully lit and glowing, overwhelmed expression, warm red-orange energy
   radiating from the panel, same art style.

4. Using this exact boy, show him sitting on the floor with hands over his
   ears, red button glowing, sound-wave lines nearby, same art style.

5. Using this exact boy, show him pulling at his shirt collar with a
   scrunched uncomfortable face, yellow button glowing, same art style.

6. Using this exact boy, show him alarmed looking at his toddler little
   sister with big curly dark-brown hair and a coral-pink dress holding his
   toy, blue button glowing, same art style.

7. Using this exact boy, add soft over-ear headphones and small protective
   cover-flaps over all three chest buttons, calmer expression, cooler color
   palette, same art style.

8. Using this exact boy, show him in side profile walking down a school
   hallway, safety covers installed on all buttons, confident posture, same
   art style.

9. Using this exact boy, show him celebrating with arms raised and a big
   smile, buttons covered and stable, warm golden lighting, same art style.

10. Using this exact boy, full-body front-facing hero pose, all buttons
    covered, calm confident expression, balanced lighting, same art style.

---

## Workflow Notes

- **Anchor once, edit many:** always reference the Scene 1 output (not a
  later scene's output) for Scenes 2–10 to avoid identity drift compounding
  across edits.
- **Exception for continuity props:** Scenes 8–10 require the button covers
  introduced in Scene 7; if the covers don't render reliably from the
  Scene 1 reference, use the Scene 7 output as the reference for Scenes 8–10
  only.
- **Consistency levers:** the phrases "using this exact boy" and "same art
  style" are load-bearing — keep them at the start and end of every edit
  instruction.
- **No text:** the style forbids in-image text; the button icons (speaker,
  tag, toddler silhouette) carry the labeling instead.
