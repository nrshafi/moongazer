# Parables of the Quran: design

## 1. Family and tokens
Family: **Quran (teal)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
Mismatch: `config.json` `accent` is `blue` today. Root §2 says teal. T5.5 changes it to `teal`.

## 2. Archetype
**Scriptoria** (root `DESIGN.md` §6): calm reading column, Newsreader, generous leading. The reading column (≤ 680 px) is on the parable page, not on this screen.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: a pointed niche (a diamond shape) with a centre line and a short horizontal rule, like a lamp niche. Architecture and geometry, no figures. Matches the T5.11 example.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Parables of the Quran     Read [o]|
| Parables of the Quran                    |  H1 (no eyebrow)
| Fourteen parables, each with a passage,  |
| diagram and question.                    |  descriptor (9 words)
| [14 parables]                            |
+------------------------------------------+  hero <= 140 px
| [Find a parable.............]            |  first control
| [Area v]  [ ] Saved only  [Copy my list] |
| 0 shown (live count)                     |
| +--------------------------------------+ |
| | Area (eyebrow-free label)  Ref       | |
| | Parable title                        | |
| | [mini diagram: 3 nodes]              | |
| | Node path label                      | |
| | [Open parable] [Save]                | |
| +--------------------------------------+ |
| > How this works                         |
+------------------------------------------+
```
Measured first-control top (the search field, 2026-11-12): 265 px at 390 × 844 and 265 px at 375 × 812, identical in light and dark; 323 px at 1440 × 1000. Target ≤ 600 px met.

## 5. Component states specific to this app
- **Diagram node (on the parable page):** selected = tint fill, accent border, text label "Selected: [node]". Three nodes, selectable.
- **Comprehension check:** right or wrong shown as text with the explanation. Not colour alone.
- **Saved:** `aria-pressed="true"` and the word "Saved". "Saved only" filter reads the count.
- **Reflection note:** labelled "Kept on this page until you copy or download it". Not saved automatically (Verify_Me #17 deferred).
- **Empty filter:** "Nothing matches" with the reset action.

## 6. "How this works" drawer
Moves out of the page above the activity (`index.astro`):
- Intro "Fourteen parables, each with a diagram to explore, a source-attributed explanation, and a question…". The first clause becomes the descriptor in §4. The rest moves to the drawer.
- The eyebrow "Image. Contrast. Reflection." is removed (compact hero rule, T5.6).

No other caveat sits above the activity in `index.astro`. The rule that diagrams are editorial aids is in `learning.json`. It is repeated in the drawer so it appears once above the parable page. Owner to confirm this placement.

## 7. End of session
- **Result (parable page):** "Check: [right or wrong]. Commentary: [attributed source]." Then the reflection prompt.
- **What you learned:**
  - The diagram is an editorial aid. The Quran passage is the source.
  - Reflection notes are not saved automatically. Copy or download them to keep them.
- **Share (copy + WhatsApp):** "I read the parable of [title] on Parables of the Quran: [link]". The title is not an answer.
- **Next app:** Is It in the Quran? (only related app).
- **New puzzle tomorrow:** not applicable.

## 8. Print and projector
Print: the parable page keeps its existing "Print reading worksheet" button (`data-print`). The earlier "None per T5.12" note was a draft and is superseded; no print feature was removed. No Projector on this app.

## 9. Depth Gate target (`00-INDEX.md` §4)
30 parables (amthal) with verified references. Today: 14.

## 10. Verify_Me layout items
- #17 Autosave notes to sessionStorage: deferred (P10 10.0). Changes the storage rule.
- #19 Link themes to the Concept Atlas: merged form, link to Ayah Threads' theme library where a theme matches (C7).
- #18 Markdown download: already implemented.
None of these is a P5 layout item.
