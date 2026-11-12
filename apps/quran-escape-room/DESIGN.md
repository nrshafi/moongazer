# Quran Escape Room: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Family & group** (`violet`). Tokens: root `DESIGN.md` §2.
- `config.json` says `violet`. Matches.
- Check in T5.5: the app's `ui-context.md` lists accent `#7255a0`, which is not the root violet (`#7c3aed`). Use the root values.

## 2. Archetype

**Hearth** (root §6): large friendly cards, readable from across a room, tap-to-reveal answers.

## 3. Motif

Source: `public/favicon.svg` (an arched doorway with a small lock mark). Draw an arched doorway outline with four small open diamonds beneath it, one per lock (`public/motif.svg`, T5.11).
Why: the room is a door, and the four diamonds are its four locks. Plain geometry; no figures.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Quran Escape Room  Play [◐]   |
| Quran Escape Room (H1)               |
| Eight rooms. Four locks each.        |
+--------------------------------------+
| +----------------------------------+ |
| | Room 1 · four locks              | |
| | Room name                        | |
| | One-line room description        | |
| |   ◇ — ◇ — ◇ — ◇                  | |
| | [ Enter room → ]   (46 px high)  | |
| +----------------------------------+ |
| +----------------------------------+ |
| | Room 2 · four locks              | |
| | ...                              | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states (this app)

- **Room card.** Default, hover, focus, and "Enter room" button.
- **Lock diamond.** Three text-labelled states: "Locked", "Open", "Hint used". Each diamond carries a text label (Verify_Me #50), not colour alone.
- **Evidence shelf.** Always reachable; a closed source shows its title first.
- **Correct lock.** `.is-correct` pulse (≤ 250 ms), no sound; reduced motion removes it.
- **Incorrect lock.** Danger border plus the text "Not yet. Check the reading." No shake.

## 6. "How this works" drawer

Currently above the room cards in `index.astro`:
- "Read, connect, arrange, and recognize. Choose a room for a solo challenge or work together on one device." (intro). Move to the drawer.
- Notice: "Every room includes its sources. Open them whenever you need. Hints and solutions are available; this is a reading activity, not a measure of faith or religious merit." Move to the drawer. Keep "not a measure of faith or religious merit" beside the completion result (one limit, where it matters).

## 7. End of session

- **Result:** "Room complete" with the completion explanation. No score.
- **What you learned (1–3 lines):** "Order references follow mushaf order, not revelation order." Reference the room's source.
- **Share (plain text, no answer):** "I finished a room in Quran Escape Room. https://quran-escape-room.moongazer.tech/" Room names do not reveal the theme.
- **Next app:** Guess the Surah (first related app in `learning.json`).
- **New puzzle tomorrow:** none (not a daily app unless P6 says so).

## 8. Print and projector

**Both.** Print button (T5.12). Projector toggle (×1.35 text, simpler chrome, higher contrast; saved only if opted in).

## 9. Depth Gate target

From `00-INDEX.md` §4: "16 rooms (64 locks), room names that don't reveal the theme." Note: "10 of the 16 grouped as a 'Ramadan nights' path."

## 10. Verify_Me layout items

- #50 label the lock diamonds: P5 T5.14.
- #49 theme-revealing room names and lock types: P1 T1.4, C4.
- #57 one limit per page: P5 T5.7.
