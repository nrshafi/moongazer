# Everyday Akhlaq: design

## 1. Family and tokens
Family: **Worship & daily life (blue)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
Mismatch: `config.json` `accent` is `violet` today. Root §2 says blue. T5.5 changes it to `blue`.

## 2. Archetype
**Hearth** (root `DESIGN.md` §6): large friendly cards, readable from across a room, tap-to-reveal answers.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: a leaf with a midrib and a short stem, a sprout. It stands for growth through small daily choices. A plant, so it is allowed. No people, no animals.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Everyday Akhlaq         Play [o]  |
| Everyday Akhlaq                          |  H1
| Short fictional situations. Choose, then |
| read the sources.                        |  descriptor (10 words)
| [20 scenarios]                           |
+------------------------------------------+  hero <= 140 px
| [All] [Home & family] [Study & work]     |  track tabs
| [Business]                               |
| [Search scenarios........] [Setting v]   |
| +--------------------------------------+ |
| | [Home & family]                      | |
| | Scenario title                       | |
| | Situation sentence.                  | |
| | Two decisions | about 3 minutes      | |
| | [Open this scenario ->]              | |
| +--------------------------------------+ |
| > How this works (after the list)        |
+------------------------------------------+
```
Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states specific to this app
- **Track tab:** selected = tint fill, accent border and `aria-pressed="true"`. Business is a tab, so the separate business notice goes.
- **Scenario card, not started:** "Two decisions" line.
- **Scenario card, done (Verify_Me #44):** "Done: [N] choices made" replaces the repeated subtitle. Text, not colour alone.
- **Decision choice:** unselected, selected (tint + border), locked after the choice ("Your choice").
- **Consequence:** shown after the choice. Beside it, one line: "Fictional scenario. Consequences are possibilities, not predictions."
- **Business card:** same card, with the label "Business" as a pill.

## 6. "How this works" drawer
Moves out of the page (`index.astro`):
- Intro "A message, a promise, a difficult conversation, a fair price…". The first sentence becomes the descriptor in §4. The steps move into the drawer.
- Notice "New: a business track. Twelve scenarios about disclosure, promises and fair dealing." Moves to the drawer as a link. The track tab already does the job.
- Bottom notice "Practice, with room to reflect. These are fictional scenarios…" Moves to the drawer. The one-line limit repeats beside the consequence (section 5), so it is stated once where it matters.

## 7. End of session
- **Result:** "You chose [choice] then [choice]. The consequence is fictional." Then the source reading and the reflection prompt.
- **What you learned:**
  - The scenarios and consequences are fictional exercises, not predictions about real people.
  - You can reflect without sharing a personal story.
- **Share:** "I worked through a fictional Everyday Akhlaq scenario: [link]". Does not name the choices.
- **Next app:** Family Halaqa (only related app in `learning.json`).
- **New puzzle tomorrow:** not applicable.

## 8. Print and projector
None per T5.12. Base print styles only.

## 9. Depth Gate target (`00-INDEX.md` §4)
32 scenarios with real branching, plus the Diagnostic Mastery Loop (D11). Today: 20 scenarios and 12 business scenarios (to merge).

## 10. Verify_Me layout items
- #44 Repeated card subtitles: show completion state instead (P5 T5.14).
- #43 Eleven filters become four tracks (P3 T3.5). Already in the track tabs.
