# Seerah Detective: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Seerah & history** (`gold`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `blue`. Set `gold`. The app's `ui-context.md` also lists the blue set; replace it with the root gold set.

## 2. Archetype

**Dossier** (root §6): evidence cards, index-style filters, mono metadata chips.

## 3. Motif

Source: `public/favicon.svg` (a magnifying lens with a crosshair). Draw a lens over a ruled report page, with two faint lines showing through the lens (`public/motif.svg`, T5.11).
Why: the lens is the detective's tool; the ruled page is the report. Together they show that the reports lead.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Seerah Detective  Play [◐]    |
| Seerah Detective (H1)                |
| Cases from the Prophet's life ﷺ      |
+--------------------------------------+
| [Search a person, place, event__]    |
| [Topic ▾]                 12 cases   |
| +----------------------------------+ |
| | CASE 01             [Era pill]   | |
| | ▯ ▯ ▯  (clue ticks)              | |
| | Case title                       | |
| | One-line brief                   | |
| | 3 clues · about 4 minutes        | |
| | [ Open the case → ]              | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states (this app)

- **Case card.** Default, hover, focus, "Open the case".
- **Evidence card.** Report title and reference chip; a clue is paraphrased, the reference links to the full report.
- **Conclusion option.** Default, selected (tint fill, accent border), chosen.
- **Result: supported.** `--success` border, pulse, text "The reports support this conclusion."
- **Result: not supported.** `--danger` border, text "The reports do not support this conclusion." No shake.
- **Filter empty state.** "No cases match those filters." with "Clear filters".

## 6. "How this works" drawer

Currently below the case grid (not above it), so it is not a blocker. It still moves to the drawer:
- Notice "**Read with care.** Clues are concise editorial paraphrases. Open their references to read the full reports…" Move to the drawer.
- Intro: "Solve cases from the Prophet's life ﷺ using the reports. Read carefully, weigh the clues…" Shorten to the descriptor line; the rest goes to the drawer.

Keep one line beside the result: "A case focuses on one question; a correct answer is not a full account of the event."

## 7. End of session

- **Result:** whether the chosen conclusion is supported, with the reason from the cited reports.
- **What you learned (1–3 lines):** "A case covers one question and a few clues." Reference the case's reports.
- **Share (plain text, never the conclusion):** "I worked through a case in Seerah Detective. https://seerah-detective.moongazer.tech/"
- **Next app:** Seerah Timeline (only related app in `learning.json`).

## 8. Print and projector

Neither (not in the T5.12 list).

## 9. Depth Gate target

From `00-INDEX.md` §4: "30 cases, each from 2–3 different reports."

## 10. Verify_Me layout items

- #37 era filter instead of ten topic filters: C11 (content-linked; the topic select stays until then).
- #38 embed full hadith text: rejected. Keep links.
- #57 one limit per page: P5 T5.7.
