# Word Groups: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Quran** (`teal`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `blue`. Set `teal`, and replace the blue set in `ui-context.md` with the root teal set.

## 2. Archetype

**Playboard** (root §6): crisp, tactile board; instant feedback; numbered runs.

## 3. Motif

Source: `public/favicon.svg` (a 2 × 2 grid of rounded tiles with small connector ticks). Draw four rounded tiles in a square, joined by short ticks between them (`public/motif.svg`, T5.11).
Why: the four tiles are the four groups; the ticks are the connections the learner finds.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Word Groups        Play [◐]   |
| Word Groups (H1)                     |
| Sixteen words, four hidden groups.   |
+--------------------------------------+
| [Board 1 · title ▾]  [Next board]    |
| [ ] Remember this board for 30 days  |
| Solved rows (one named row per group)|
| +------+------+------+------+        |
| | tile | tile | tile | tile |        |
| +------+------+------+------+        |
| (four rows; tile about 72 px square) |
| [Check group] [Deselect] [Hint]      |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812. The board picker is the first control. Keep tiles ≤ 72 px so the action row stays close to the board.

## 5. Component states (this app)

- **Tile.** Default, hover, focus, selected (tint fill, accent border), disabled when the board is complete (opacity .55, `cursor:not-allowed`).
- **Check group.** Disabled until four tiles are selected.
- **One away.** Text "One away: three of these belong together." No shake.
- **Correct group.** Solved row with the group name, `.is-correct` pulse (≤ 250 ms).
- **Incorrect group.** Danger border and text "Not a group. Try again."
- **Hint.** Text reveal in the feedback line, one step at a time.

## 6. "How this works" drawer

Currently in `index.astro`:
- Intro "Sort sixteen words into four groups of four. Each group you reveal opens a source reading…" Shorten to the descriptor; move the rest to the drawer.
- Sidebar notice "A grouping puzzle. Some words can have more than one connection…" and "'One away' means three selected terms belong to one intended group…" Move both to the drawer.
- Noscript "The grouping activity requires JavaScript…" Keep as-is, below the drawer on the page.

## 7. End of session

- **Result:** "Board solved: 4 of 4 groups, N checks." No score ranking.
- **What you learned (1–3 lines):** the explanation of each revealed group, with its cited reading.
- **Share (plain text, no group names):** "I solved a Word Groups board. https://word-groups.moongazer.tech/"
- **Next app:** Ayah Threads (first related app in `learning.json`).
- **New puzzle tomorrow:** slot reserved for P6 (daily boards).

## 8. Print and projector

**Both.** Print button (T5.12). Projector toggle (×1.35 text, simpler chrome, higher contrast; saved only if opted in).

## 9. Depth Gate target

From `00-INDEX.md` §4: "30 boards from ≥40 groups, distinct titles."

## 10. Verify_Me layout items

- #51 Board 1 surah-name overlap: C3, P6 T6.4.
- #52 solved status across boards: P6 T6.4.
- #57 one limit per page: P5 T5.7.
