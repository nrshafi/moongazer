# Ayah Threads: design

## 1. Family and tokens
Family: **Quran (teal)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
`config.json` `accent` is `teal` today, which matches.

## 2. Archetype
**Playboard** (root `DESIGN.md` §6): crisp board, instant feedback, numbered runs.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: three knots (small rings) joined by thin threads. It shows the app's idea of a shared thread. Geometry only, `aria-hidden="true"`, hidden below 580 px.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Ayah Threads         Play   [o]   |
| Ayah Threads                             |  H1
| Three passages, one shared theme.        |  descriptor (11 words)
| [30 passage puzzles]                     |  count chip
+------------------------------------------+  hero <= 140 px
| Puzzle [07 v] [ok] 12 solved [Surprise]  |  picker, solved ticks
| [ ] Show Arabic                          |
| +--------------------------------------+ |
| | Passage 1  (Pickthall)               | |
| | Passage 2                            | |
| | Passage 3                            | |
| +--------------------------------------+ |
| Theme: [A] [B] [C] [D]                   |
| > How this works                         |
+------------------------------------------+
```
Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states specific to this app
- **Puzzle picker:** solved puzzles show a tick and the word "Solved" (not colour alone). The 30-button grid collapses into this picker (Verify_Me #28).
- **Theme option:** selected = tint fill and accent border; correct = `--success` border, one pulse, text "Matches the intended theme"; incorrect = `--danger` border, text "Not the intended theme". No shake.
- **Show Arabic:** on = Amiri block, `lang="ar" dir="rtl"`; off = English only. Each state keeps the same card height.
- **Reference chip:** focusable, opens the Quran reference in the source list.
- **Hint used:** a text label on the puzzle card, not a colour change.

## 6. "How this works" drawer
Moves out of the page above the activity (`index.astro`):
- Intro line "Read three ayat, find the thread that connects them…" becomes the one-line descriptor in §4. The full sentence moves into the drawer.
- Notice "Theme library: read all 30 threads after you solve them". Moves to the drawer as a link.
- Sidebar steps "Read all three selections in Pickthall's translation." and the notice "A starting point for reading: Themes are editorial learning prompts…" move into the drawer.

The `noscript` message stays where it is. It is a fallback, not explanation.

## 7. End of session
- **Result:** "You chose [theme]. The intended connection is [theme]." then the puzzle's explanation and reference links.
- **What you learned:**
  - A passage can fit more than one theme; the intended theme is one editorial reading.
  - Use the explanation as a prompt, then read the surrounding passage.
- **Share (copy + WhatsApp):** "Three passages, one connection. Try this Ayah Threads puzzle: [puzzle link]". Never names the theme.
- **Next app:** Guess the Surah (first related app in `learning.json`).
- **New puzzle tomorrow:** slot reserved; filled only if P6 makes this app daily.

## 8. Print and projector
None per T5.12. Base print styles only.

## 9. Depth Gate target (`00-INDEX.md` §4)
30 puzzles, each from at least two different surahs (three where possible), distractors rebuilt; 30-theme library. Grow to 90 after Ramadan.

## 10. Verify_Me layout items
- #28 Collapse the 30-button puzzle grid (P5 T5.14, P6 T6.3).
- #27 Show the shared Arabic root after solving: deferred (P10).
- #26 Dedupe against the Concept Atlas: done by the merge (P3 T3.3).
