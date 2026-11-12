# Stories of the Prophets: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Quran** (`teal`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `blue`. Set `teal`, and replace the blue set in `ui-context.md` with the root teal set.

## 2. Archetype

**Scriptoria** (root §6): calm reading column (≤ 680 px), Newsreader, generous leading.

## 3. Motif

Source: `public/favicon.svg` (an open book with a four-point star above the spine). Draw an open book outline with one small star above the spine (`public/motif.svg`, T5.11).
Why: the book is the Quranic account; the star marks the reading as a sacred source. No figures.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Stories of the Prophets [◐]   |
| Stories of the Prophets (H1)         |
| 25 prophets · 50 selected readings   |
+--------------------------------------+
| [Find a prophet or reading______]    |
| [Reading area ▾]   [ ] Saved only    |
| Listed A–Z. No historical order.     |
| +----------------------------------+ |
| | Prophet name (A–Z)      [Save]   | |
| | Focus line                       | |
| | Quran ref · ref                  | |
| | [ Open readings → ]              | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

The one-line limit sits under the filter row, not above it.

## 5. Component states (this app)

- **Prophet card.** Default, hover, focus, saved (`aria-pressed`).
- **Passage card.** Arabic in Amiri, `lang="ar" dir="rtl"`, 1.6–1.8 rem, line-height ≥ 1.9. Translation named.
- **Reading check option.** Default, selected, correct (pulse, text "Correct"), incorrect (danger border, text "Not quite. See the cited passage.").
- **Reading check reveal.** "Show the cited detail" opens the passage; closed by default.

## 6. "How this works" drawer

Currently above the cards in `index.astro`:
- Eyebrow "Read the Quranic account" and intro "25 named prophets. 50 selected readings…". Drop the eyebrow; the descriptor replaces the intro.
- Notice: "This is a selected reading library, not a complete biography collection. Prophets are listed alphabetically…" Move to the drawer. Keep one line under the filter row: "Listed A–Z. No historical order is implied."

## 7. End of session

- **Result:** reading check result (correct or not), with the cited passage.
- **What you learned (1–3 lines):** "The library is a selection of Quranic passages, not a biography." Reference the passage.
- **Share (plain text):** "I read about a prophet in Stories of the Prophets. https://stories-of-the-prophets.moongazer.tech/" Do not name the check answer.
- **Next app:** Places in the Quran (first related app in `learning.json`).

## 8. Print and projector

**Both.** Print button (T5.12). Projector toggle (×1.35 text, simpler chrome, higher contrast; saved only if opted in).

## 9. Depth Gate target

From `00-INDEX.md` §4: "25 prophets (complete) + Mastery Loop." Note: "Chapters for 7 major prophets after Ramadan." The Mastery Loop (P8) adds a diagnostic before the check; screen 1 does not change.

## 10. Verify_Me layout items

- #31 "Quranic pairings" sort: P8 T8.5, P10. Keep A–Z now.
- #32 deeper comprehension checks: C6, P8 T8.5.
- #57 one limit per page: P5 T5.7.
