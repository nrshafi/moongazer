# Why It Was Revealed: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Quran** (`teal`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `blue`. Set `teal`, and replace the blue set in `ui-context.md` with the root teal set.

## 2. Archetype

**Scriptoria** (root §6): calm reading column (≤ 680 px), Newsreader, generous leading.

## 3. Motif

Source: `public/favicon.svg` (a folded report sheet with lines and a bracket at its side). Draw a sheet with a folded corner, three text lines, and a bracket in the margin (`public/motif.svg`, T5.11).
Why: the report sits beside the passage. The bracket marks the part of context the report names.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Why It Was Revealed Read [◐]  |
| Why It Was Revealed (H1)             |
| Ten passages beside their reports    |
+--------------------------------------+
| [Topic ▾]          [Search_______]   |
| Choose a reading                     |
| +----------------------------------+ |
| | Topic chip                       | |
| | Reading title                    | |
| | Report summary (1–2 lines)       | |
| | Passage ref · [Open] [Save]      | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top (the search field, 2026-11-12): 272 px at 390 × 844 and 272 px at 375 × 812, identical in light and dark; 345 px at 1440 × 1000. Target ≤ 600 px met.

## 5. Component states (this app)

- **Reading card.** Default, hover, focus, saved (`aria-pressed`).
- **Category.** Text chip: "A reported occasion", "General context", or "What happened after". Never colour alone.
- **Source panel (`.dossier`).** Report beside what it establishes and what stays uncertain. Native `<details>` for the evidence card; open in print.
- **Relationship choice.** Default, selected, correct, incorrect (text "Check the report category.").
- **Copy my list.** Hidden until the first save (Verify_Me #36); done in P5 (`hidden` attribute toggled in `library.ts` `updateSaved`).

## 6. "How this works" drawer

Currently above the filters in `index.astro`:
- Intro "Read ten Quran passages beside the reports about them. See whether each report names an occasion…" Move to the drawer.
- Evidence band "A reported occasion · General context · What happened after". It is a legend. Move to the drawer; the card chip carries the category.
- `Filters.astro` carries no explanatory text above the controls (checked in P5).

## 7. End of session

- **Result:** the category the learner chose beside the report's own category.
- **What you learned (1–3 lines):** "A report about what happened after revelation is not the cause of the passage." Reference the report.
- **Share (plain text, no category):** "I compared reports on why a Quran passage was revealed. https://why-it-was-revealed.moongazer.tech/"
- **Next app:** Is It in the Quran? (only related app in `learning.json`).

## 8. Print and projector

Print: the reading page keeps its existing "Print this reading" button (`data-print`) and dossier print layout. The earlier "Neither" note was a draft and is superseded; no print feature was removed. No Projector on this app.

## 9. Depth Gate target

From `00-INDEX.md` §4: "30 readings + Mastery Loop." Mushaf order.

## 10. Verify_Me layout items

- #36 hide "Copy my list" until something is saved: P5 T5.14.
- #35 grow thin categories: C9 (content).
- #57 one limit per page: P5 T5.7.
