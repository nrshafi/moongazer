# Family Halaqa: design

## 1. Family and tokens
Family: **Family & group (violet)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
`config.json` `accent` is `violet` today, which matches.

## 2. Archetype
**Hearth** (root `DESIGN.md` §6): large friendly cards, readable from across a room. Projector mode applies (§8).

## 3. Motif
`public/motif.svg`: a ring of three dots on a single arc, a circle of seats drawn as dots. It stands for the gathering without showing anyone. Geometry only.

**Blocker:** the current `public/favicon.svg` draws three human figures (heads and shoulders). That breaks the aniconism rule (root §1). The motif does not use it. Replacing the logo is an owner decision and is not part of T5.3.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Family Halaqa          Read  [o]  |
| Family Halaqa                            |  H1
| Short packs to do together. No names or  |
| profiles needed.                         |  descriptor (10 words)
| [12 packs]                               |
+------------------------------------------+  hero <= 140 px
| [Topic v] [Age v] [Search...........]    |  filters
| [Copy my list]  [Print saved packs]      |  (print: see section 8)
| +--------------------------------------+ |
| | Topic (eyebrow)           10-15 min  | |
| | Pack title                           | |
| | Discussion sentence.                 | |
| | [Open pack] [Save]                   | |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | next pack card                       | |
+------------------------------------------+
```
Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states specific to this app
- **Age chip:** selected = tint fill, accent border, `aria-pressed="true"`. Text shows the band (5–7, 8–11, 12+).
- **Pack progress:** "Read", "Discussed", "Done" as text labels on the session path.
- **Pass:** "Pass this one" is always enabled and never recorded as a mark against anyone.
- **Saved pack:** button shows `aria-pressed="true"` and the word "Saved".
- **Projector on:** text ×1.35, higher contrast, simplified chrome. Saved only if the visitor opts in (`projector` key).
- **Reading check (inside a pack):** the three options show a text result, never colour alone.

## 6. "How this works" drawer
Moves out of the page above the activity (`index.astro`):
- Intro "Choose a pack with one reading question, an open conversation and a shared activity…". The first sentence becomes the descriptor in §4. The rest moves to the drawer.
- Evidence band "About 10–15 minutes · Everyone may pass · Print or use one shared screen". Moves to the drawer. Time stays on each card.
- Note "Age bands are suggestions. An adult can read aloud or adapt the vocabulary…". Moves to the drawer.

## 7. End of session
- **Result:** "Pack complete. Reading check: [n] of 3. Discussion: shared or passed." No score beyond the reading check.
- **What you learned:**
  - Age bands are suggestions, and an adult can adapt the wording.
  - Anyone may pass. No personal story is needed.
- **Share (copy + WhatsApp):** "We finished a Family Halaqa pack together in about 15 minutes: [link]". No names, no answers, no participant details.
- **Next app:** Everyday Akhlaq (first related app).
- **New puzzle tomorrow:** not applicable.

## 8. Print and projector
Both, per T5.12.
- **Print:** on the pack page, and "Print saved packs" on the library page (one print view of all saved packs, Verify_Me #56).
- **Projector:** toggle on the pack and library pages. Text ×1.35, simplified chrome, higher contrast. Opt-in save only.

## 9. Depth Gate target (`00-INDEX.md` §4)
42 packs: the 12 existing plus a 30-night Ramadan series. Today: 12.

## 10. Verify_Me layout items
- #55 Show reference and activity type on cards (P5 T5.14).
- #56 Batch print saved packs (P5 T5.12).
