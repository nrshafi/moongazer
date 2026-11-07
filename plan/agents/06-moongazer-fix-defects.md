# Brief 06 — Moongazer: fix trust-damaging defects

**Repository:** `I:\Development\moongazer`
**Depends on:** nothing. **Authorized:** ask the owner first. This is the recommended first Moongazer brief.
**Goal:** remove defects that give answers away, show the wrong app's text, or break metadata. No redesign, no renames, no new features.
**Background:** `../REPORT.md`, A0 (a 14-row defect table with file paths).

Read the root `AGENTS.md` and six context files, then each affected app's `AGENTS.md` and `context/`. Shared files (`Shell.astro`, `LearningGuide.astro`, `404.astro`, `sources.astro`, `seo.ts`) are copied per app: fix every copy, not one.

## Fixes, in order

1. **Sources pages (all twenty apps).**
   - Today ten apps share two boilerplate `src/pages/sources.astro` files that describe other apps (hadith and timeline text on Guess the Surah; prophets and calculator text on the Escape Room; Salah text on four apps).
   - Rewrite each app's sources page from its own `src/data/` sources and `context/project-overview.md`: what this app quotes, which editions and translations, what is editorial, and its limits.
   - Do not change any source record or canonical quotation.
2. **Escape Room** (`apps/islamic-knowledge-escape-room/src/lib/app.ts`):
   - Lock 1: stop checking against `room.name` (L27). Use the data's intended answer.
   - Card descriptions must not equal the hint. Write distinct one-line descriptions; do not reveal the theme.
   - Lock 4 distractors must not always come from one room (L13-14).
   - Replace the fixed shuffle seeds with a per-play seed, keeping a seed in saved state so a resumed room is stable.
3. **Concept Atlas spoiler** (`apps/quran-concept-atlas`). Until brief 10 merges it, stop it from printing the theme answer to every Quran Connections puzzle in a way that spoils play. Minimum fix: add a note on each theme card linking to the puzzle ("Solve this theme's puzzle first"). Do not remove content; brief 10 restructures it.
4. **Revelation Context quiz** (`apps/revelation-context-explorer`). The answer category is printed in the card eyebrow, the Topic filter and the page eyebrow (`reading/[id].astro:11`, `index.astro:9`):
   - Remove it from the eyebrows.
   - Change the Topic filter to real topics, not the answer categories.
   - Reveal the category only after the reader answers.
5. **Halal Business Decisions** (`src/lib/decision.ts:18-19`): shuffle option order per case, stable within a session, so "Source-aligned" is not always first.
6. **Misinformation Casebook**:
   - Change `src/data/seo.json:9` `summaryField` from `correction` to a field that does not contain the answer, or a neutral template.
   - Fix the "?." double punctuation from `src/lib/seo.ts:73` (all twenty apps share this helper; fix every copy).
7. **Stories of the Prophets**: `src/data/seo.json` `summaryField` points at the boolean `brief`, so all 25 pages share one description. Point it at the profile's `focus` text, or build the summary from name and focus.
8. **Memorization Calculator** calendar export (`src/lib/engine.ts:25`):
   - `PRODID:-//Moongazer//Hifz Plan//EN`
   - UIDs at `@moongazer.tech`
   - `DTSTAMP` at the current UTC time of export, not a fixed date
   - Update its tests.
9. **Shell details (all twenty apps)**:
   - `<meta name="theme-color">` uses the app's own accent, not hard-coded teal (`Shell.astro:46`).
   - `404.astro` says "That page is not here. Go back to {app name}." without the Places Atlas wording.
   - `LearningGuide.astro:7` keeps the collection name's capitals ("Explore Quran learning tools").
   - Use "→" for internal links and "↗" only for external links.
10. **Civilization Timeline**: show the "does not republish modern English hadith translations" line in `References.astro` only on pages that cite hadith.
11. **Guess the Surah**:
    - The hero pill must match the default pool (say "51 short surahs" while that is the default; brief 09 changes the default).
    - For surahs whose opening ayah is identical or nearly identical to another surah's in a round (2, 29, 30, 31; 26, 28; 40–46; 59, 61), make clue 1 distinguishable: use the second ayah for those surahs, or avoid placing two of them in one round. Canonical text stays exact.
12. **Understand Salah**:
    - Hide the meaning by default so "recall, then reveal" works.
    - Change the card label "Audio available" to "Full-surah audio" on the seven Al-Fatiha cards.
13. **Seerah Timeline**: until brief 12 adds real links, remove "connected" from the directory card (`deployment/targets.json`), the hero copy and the guide step.

## Verification

Use the Moongazer verification checklist in `00-START-HERE.md`. In particular:
- Add tests for fixes 2, 4, 5, 6, 7 and 8. They are behaviour or metadata changes.
- Run `python _implementation/verify-static.py` to prove no quotation changed.
- Run the SEO checks for fixes 6 and 7.
- In the browser, check the Escape Room, Revelation and Halal Business flows.

Record a root `context/progress-tracker.md` entry and the affected apps' trackers, then update `00-START-HERE.md`. Do not push.
