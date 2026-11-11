# Brief 09 — Moongazer: daily games and sharing

> **Superseded (11 November 2026):** this file is background only. The authoritative execution plan is [`plan/implementation/00-INDEX.md`](../implementation/00-INDEX.md). Where they differ, the implementation plan wins.

**Repository:** `I:\Development\moongazer`
**Depends on:** 08. **Authorized:** ask the owner first.
**Goal:** give people a reason to come back tomorrow, with no accounts, no server and no tracking.
**Background:** `../REPORT.md`, A10 items 1–5, A8 entries 1–3 and 10.

## Design rules

- **Daily index.** `day = floor((Date.UTC(today, local date) − Date.UTC(2026,10,1)) / 86400000)` gives the puzzle number `#N`. Use the visitor's local calendar date so the puzzle changes at local midnight. Pick the puzzle with a fixed, documented permutation of the bank (seeded shuffle), so consecutive days don't follow bank order. Put this logic in a pure, tested function in each app's `src/lib/`.
- The same `#N` gives the same puzzle for everyone on the same date. Document the time-zone edge: two people in different zones may be one day apart around midnight.
- Practice mode always remains available.
- **Share text.**
  - Plain text with no tracking parameters, for example `Guess the Surah #42 · solved on clue 2 of 4 · moongazer.tech/surah`.
  - Spoiler-free: never the answer.
  - Plain characters only; no emoji.
  - Copy button plus `https://wa.me/?text=` link.
- **Streaks** (opt-in, per app). Use the existing namespaced storage (`<slug>:streak` holding `{last, count, best}`) with the 30-day access-time rule. Playing daily refreshes it. Theme storage stays separate. Context must document the key.

## Per app

1. **Guess the Surah**
   - Modes: Daily (default) · Practice · Juz. Juz mode picks surahs within a chosen juz, starting with Juz 30; use standard juz boundaries from verified data, not invented ones.
   - Daily: one surah per day, cycling through all 114 before repeating.
   - Clue ladder: replace the chapter-number clue with the meaning of the surah's name. Use only a verified source, and record it in `src/data` with provenance.
   - Local "114 collection" grid of surahs found.
   - Update the descriptor to "A daily Quran quiz: find the surah from its clues".
2. **Ayah Threads** (Quran Connections)
   - Daily puzzle from the bank.
   - Distractors rebuilt: drawn from real themes, each used at most three times, never the answer's near-synonym. Keep the bank's intended answers.
   - Solved puzzles show titles and ticks in the picker.
3. **Word Groups** (Concept Connections)
   - Daily board.
   - A four-mistake limit.
   - Group difficulty colours.
   - A result card summarizing solved order and mistakes.
   - Distinct board titles.
4. **Seerah Timeline**
   - A daily "Which came first?" pair, drawn from the 36 events, showing both events' sources and date notes after answering.
   - Use only pairs whose order is well established. Mark approximate dates as approximate. Skip pairs whose conventional dating is disputed.
   - This lands before brief 10 moves the full Challenge in.

## Directory

Fill "Tonight on Moongazer" (brief 08 left the container) with three tiles:
- Today's surah (#N)
- Today's board (Word Groups #N)
- Ayah of the night

For the ayah of the night:
- Build a local `homepage` data file of selected ayat. Arabic and Pickthall must come from `_implementation/research/quran-full.json`, copied exactly, with references.
- Pick by the same day index.
- Link to Is It in the Quran? for the reference.
- Compute the daily tiles in `app.js`. The static HTML shows a sensible default, so the page works without JavaScript.
- Each tile's selection logic must exactly mirror the app's (same function, copied), so tile #N and app #N agree.

The directory hero's "Play today's puzzle" button now opens Guess the Surah's daily mode.

## Optional in this brief

A "Remind me daily" button per daily game that downloads a browser-generated `.ics` event, with a daily recurrence at a time the visitor picks. No server, no permissions. Reuse the calculator's corrected `.ics` code from brief 06.

## Verification

Use the checklist in `00-START-HERE.md`. Plus:
- Unit tests for the day-index and permutation functions: deterministic, all items covered before repeat, local-midnight change.
- Unit tests for the share-text builders (no answer leaks).
- Unit tests for streak transitions (same day, next day, gap).
- In the browser:
  - Daily modes in both themes on phone and desktop.
  - A blocked-storage run (no streak, game still works).
  - The directory tiles matching the apps' #N.
  - Each WhatsApp link opens with correctly encoded text.
- Run `python _implementation/verify-static.py` (the ayah of the night must match canonical text).

Record tracker entries, document the new storage key in context, and update `00-START-HERE.md`. Do not push.
