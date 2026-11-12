# Guess the Surah: design

## 1. Family and tokens
Family: **Quran (teal)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
`config.json` `accent` is `teal` today, which matches.

## 2. Archetype
**Playboard** (root `DESIGN.md` §6): crisp game board, instant feedback, numbered runs.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: an open book, two facing page curves meeting at a spine, over a baseline. The logo's sparkle becomes one small dot. No eight-point star (the shared star watermark is removed in T5.6). An object, so it is allowed.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Guess the Surah         Play [o]  |
| Guess the Surah                          |  H1
| Read a clue ayah and choose the surah.   |  descriptor (8 words)
| [51 short surahs]                        |
+------------------------------------------+  hero <= 140 px
| Round 3 of 10   [###-------]  Score 4    |  progress, text + bar
| +--------------------------------------+ |
| | Clue ayah (Pickthall)                | |  clue card first
| | Clue 1 of 4        [Reveal Arabic]   | |
| +--------------------------------------+ |
| ( A ) Surah name                         |  answer choices
| ( B ) Surah name                         |
| ( C ) Surah name                         |
| ( D ) Surah name                         |
| > Practice settings (collection, length) |  collapsed (Verify_Me #9)
| > How this works                         |
+------------------------------------------+
```
Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states specific to this app
- **Clue button:** revealed clues are text; the next clue reads "Reveal clue 2 of 4". Disabled after clue 4 (`cursor:not-allowed`, opacity .55).
- **Answer choice:** selected = tint fill, accent border. After answering, the correct choice shows the text "Answer" and the chosen wrong one shows "Your choice".
- **Correct:** `--success` border, one pulse, text "Correct". No confetti.
- **Incorrect:** `--danger` border, text "Not this one". The correct surah is named after the answer, not before.
- **Challenge mode:** banner "Challenge link: same clues for everyone".
- **Arabic-first clue (Verify_Me #10):** Arabic opening ayah shown first, English second.
- **Surah list:** collapsed and labelled "Surah list (shows answers)" (Verify_Me #11).

## 6. "How this works" drawer
Moves out of the page above or beside the activity (`index.astro`):
- Intro sentence "Read a clue ayah, reveal more when you need it…". The first clause becomes the descriptor in §4. The rest moves to the drawer.
- Sidebar steps "Read the clue ayah in Pickthall's translation." and the rest of "A clue at a time". Move to the drawer.
- Note "An informal challenge, with identical clues for anyone using the link." Moves to the drawer and sits beside the challenge link.
- "Copy this challenge link" becomes a share action at session end (section 7).

Round settings move into "Practice settings" below the clue card (Verify_Me #9). They stay as controls, not explanation.

## 7. End of session
- **Result:** "[Surah name] (chapter [N], [count] ayahs). You answered after clue [k]. Points: [p]." Then the opening ayah with its source link.
- **What you learned:**
  - Each answer links to its opening ayah and source.
  - Points reflect how early you answer. They are not a memorization score.
- **Share (copy + WhatsApp):** "I scored [p] in this Guess the Surah round: [challenge link]". The text never names the surah. The link carries identical clues.
- **Next app:** Ayah Threads (first related app).
- **New puzzle tomorrow:** slot filled in P6, when this app becomes the daily puzzle.

## 8. Print and projector
Both, per T5.12.
- **Print:** button on the round result page. Clues and answers print in black on white.
- **Projector:** toggle. Text ×1.35, simplified chrome, higher contrast. Opt-in save only.

## 9. Depth Gate target (`00-INDEX.md` §4)
114 surahs, each with a verified name-meaning clue. Complete canonical set. Today: 114 surahs.

## 10. Verify_Me layout items
- #9 Round settings above the clue card: accepted, moved into Practice mode (P5 T5.14, P6 T6.2).
- #10 Arabic-first clue option (P6 T6.2).
- #11 114-surah list spoils paid clues: collapsed and labelled (P1 T1.14).
- #12 Option letter joined to the name (P1 T1.14).
