# FLUX Kontext Pro Prompt Set — "Button Boy" Character Sheet & Scenes

A 10-scene children's storybook sequence rendered in a STEM diagrammatic style,
built for FLUX Kontext Pro's **reference-image + edit-instruction** workflow:
generate Scene 1 fresh as the anchor, then feed its output back in as the
reference image for Scenes 2–10.

---

## Full Character Sheet

Use this block verbatim wherever a prompt says `[full character sheet]`.

> A friendly young boy robot, about 7 years old in proportion, with a smooth
> rounded matte-white head, large expressive teal eyes, short tousled
> copper-brown synthetic hair, and small rounded ear modules. He wears a
> mustard-yellow crew-neck T-shirt and soft navy-blue joggers with white
> sneakers. Centered on his chest, visible through a rectangular cutout in the
> shirt, is a brushed-silver control panel with softly rounded corners
> containing three large round buttons in a horizontal row: a RED button with
> a white speaker icon (left), a YELLOW button with a white clothing-tag icon
> (center), and a BLUE button with a white two-siblings icon (right). Thin
> gray technical callout lines with small circular endpoints label the panel
> edges, diagram-style. Flat storybook illustration with clean uniform
> outlines, soft cel shading, warm muted palette, gentle rounded shapes,
> no text anywhere in the image.

**Secondary character (Scene 6 only):** a human toddler girl, about 2 years
old, with big curly dark-brown hair, brown skin, a coral-pink dress, and a
cheerful oblivious expression, holding the boy robot's toy.

---

## Scene 1 — Anchor (generate fresh)

> Generate: children's storybook character, STEM diagrammatic style. A
> friendly young boy robot, about 7 years old in proportion, with a smooth
> rounded matte-white head, large expressive teal eyes, short tousled
> copper-brown synthetic hair, and small rounded ear modules. He wears a
> mustard-yellow crew-neck T-shirt and soft navy-blue joggers with white
> sneakers. Centered on his chest, visible through a rectangular cutout in the
> shirt, is a brushed-silver control panel with softly rounded corners
> containing three large round buttons in a horizontal row: a RED button with
> a white speaker icon (left), a YELLOW button with a white clothing-tag icon
> (center), and a BLUE button with a white two-siblings icon (right). Thin
> gray technical callout lines with small circular endpoints label the panel
> edges, diagram-style. Flat storybook illustration with clean uniform
> outlines, soft cel shading, warm muted palette, gentle rounded shapes.
> Neutral standing pose, warm sunlit bedroom, calm dim chest panel, gentle
> smile, clean storybook illustration, no text.

## Scenes 2–10 — Edits (feed Scene 1 output back in as reference each time)

2. Using this exact character, show a close-up on his chest panel with three
   labeled buttons (red/speaker icon, yellow/tag icon, blue/sibling icon),
   soft glow, technical callout lines, same art style.

3. Using this exact character, same face and outfit, show him with the red
   button fully lit and glowing, overwhelmed expression, warm red-orange
   energy radiating from the panel, same art style.

4. Using this exact character, show him sitting on the floor with hands over
   his ears, red button glowing, sound-wave lines nearby, same art style.

5. Using this exact character, show him pulling at his shirt collar with a
   scrunched uncomfortable face, yellow button glowing, same art style.

6. Using this exact character, show him alarmed looking at a toddler girl
   with curly hair holding his toy, blue button glowing, same art style.

7. Using this exact character, add soft over-ear headphones and small
   protective cover-flaps over all three chest buttons, calmer expression,
   cooler color palette, same art style.

8. Using this exact character, show him in side profile walking down a school
   hallway, safety covers installed on all buttons, confident posture, same
   art style.

9. Using this exact character, show him celebrating with arms raised and a
   big smile, buttons covered and stable, warm golden lighting, same art
   style.

10. Using this exact character, full-body front-facing hero pose, all buttons
    covered, calm confident expression, balanced lighting, same art style.

---

## Workflow Notes

- **Anchor once, edit many:** always reference the Scene 1 output (not a
  later scene's output) for Scenes 2–10 to avoid identity drift compounding
  across edits.
- **Exception for continuity props:** Scenes 8–10 require the button covers
  introduced in Scene 7; if covers don't render reliably from the Scene 1
  reference, use the Scene 7 output as the reference for Scenes 8–10 only.
- **Consistency levers:** the phrases "using this exact character" and "same
  art style" are load-bearing — keep them at the start and end of every edit
  instruction.
- **No text:** the style forbids in-image text; the button icons (speaker,
  tag, siblings) carry the labeling instead.
