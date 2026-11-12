# P6 — Daily games and sharing

**Branch:** `phase-6-daily` · **Target:** 28 Dec 2026–3 Jan 2027 · **Release:** R6 · **Depends on:** P5 merged
**Goal:** a reason to come back tomorrow, with no accounts, no server state and no tracking beyond the P4 counter.
**Background:** `plan/REPORT.md` §A10, §A8 entries 1–3 and 10; D22, D24 in `00-INDEX.md`.

## Shared rules

- **Epoch (D22).** One constant `DAILY_EPOCH = 'YYYY-MM-DD'` (the R6 publication date the owner chooses) in every daily app's `src/lib/daily.ts` and in `homepage/app.js`. `_implementation/sync-shared.ts --check` (extended in T6.1) fails if the copies differ. Before R6 is scheduled, use a placeholder and a test that fails if it is still the placeholder at release time (T6.9).
- **Day index.** `dayNumber(localDate) = floor((Date.UTC(y, m, d) − Date.UTC(epoch)) / 86 400 000) + 1`, using the visitor's local calendar date, so `#1` is launch day and the puzzle changes at local midnight. Dates before the epoch show practice mode only.
- **Selection.** A fixed, documented permutation of the bank (seeded Fisher–Yates with a constant seed per app, using the existing `shuffle(items, seed)` in `utils.ts`) indexed by `(dayNumber − 1) mod bank.length`. Every item appears once before any repeats. When the bank grows (content track), append new items to the end of the permutation input and bump a `BANK_VERSION`; document that numbers after a growth event follow the new permutation from the next cycle.
- **Same `#N`, same puzzle** for everyone on the same local date. Document the time-zone edge in the app's "How this works".
- **Practice mode** always available.
- **Share text.** Plain text, no emoji, no tracking parameters, never the answer. Copy button and `https://wa.me/?text=<encodeURIComponent(text)>`. The app's own host at the end (for example `guess-the-surah.moongazer.tech`; no apex short links under D2c).
- **Streaks** (opt-in, per app). Key `<slug>:streak` holding `{last:'YYYY-MM-DD', count, best}` via `read`/`write` (30-day access rule). Same day: unchanged; next day: `count+1`; gap: `count=1`; `best=max`. Document the key.

---

### T6.1 Shared daily module
Lane: shared · Files: `apps/<daily apps>/src/lib/daily.ts` (new, identical copies in guess-the-surah, ayah-threads, word-groups, seerah-timeline), `_implementation/sync-shared.ts` (add a "daily set" checked across those four apps only), tests in each app
Exports: `DAILY_EPOCH`, `localDateKey(date)`, `dayNumber(date)`, `dailyIndex(dayNumber, bankLength, seed)`, `updateStreak(prev, todayKey)`, `shareText({name, n, resultLine, shortLink})`, `whatsappUrl(text)`.
Tests: deterministic output; full coverage before repeat; local-midnight change (simulate time zones by constructing local dates); streak transitions (same day, next day, gap, invalid stored value); share text contains no answer token (caller supplies forbidden strings).
Verify: V1 in four apps, V3.

### T6.2 Guess the Surah: Daily · Practice · Juz
Lane: app:`guess-the-surah` · Depends on: T6.1, C1 (verified name meanings) · Files: `src/lib/game.ts`, `src/lib/engine.ts`, `src/pages/index.astro`, `src/data/content.json`, tests
Steps:
1. Modes as tabs: Daily (default) · Practice · Juz. Daily: one surah per day cycling through all 114. Juz: surahs whose starting ayah falls in the chosen juz (start with Juz 30); derive juz boundaries from verified Quran MCP metadata (`fetch_quran_metadata`), record in research, never hand-typed.
2. Clue ladder: replace the chapter-number clue with the verified meaning of the surah's name (from C1). Keep "The Arabic" clue; offer an "Arabic first" toggle (Verify_Me) that shows the Arabic as the free first clue.
3. Local "114 collection" grid of surahs found (count from data).
4. Share: `Guess the Surah #42 · solved on clue 2 of 4 · moongazer.tech/surah`.
5. Descriptor → "A daily Quran quiz: find the surah from its clues" (P2 "later"); hero pill → "114 surahs" now that Daily covers all 114.
6. Events: `activity_started`/`activity_completed` with item id `daily-<N>` or the surah id in practice.
Acceptance: tests for Juz filtering, clue ladder (no chapter number), share text; V5 passes (canonical text).
Verify: V1, V5, V6, V7.

### T6.3 Ayah Threads daily
Lane: app:`ayah-threads` · Depends on: T6.1, C2 · Files: `src/lib/*`, `src/pages/index.astro`, tests
Steps: daily puzzle from the bank; distractors rebuilt (drawn from real themes, each theme used as a distractor at most three times across the bank, never a near-synonym of the answer; precompute and store distractor sets in data with a test enforcing the limits); solved puzzles show titles and ticks in the compact picker; theme library link after solve. Descriptor → "…: a daily Quran puzzle".

### T6.4 Word Groups daily
Lane: app:`word-groups` · Depends on: T6.1, C3 · Files: `src/lib/app.ts`, `src/lib/engine.ts`, `src/pages/index.astro`, tests
Steps: daily board; four-mistake limit; difficulty tiers per group (data field `tier` 1–4, colours from family tokens with text labels so colour is not the only signal); result card (solved order, mistakes); distinct board titles; valid alternative groupings (for example surah names that also fit another category) are either removed from boards or acknowledged without counting a miss (Verify_Me); 30-pill board selector with solved state. Share: `Word Groups #N · 4 groups, 1 mistake · moongazer.tech/groups` (no group names).

### T6.5 Seerah Timeline: daily "Which came first?"
Lane: app:`seerah-timeline` · Depends on: T6.1, P3 T3.4 · Files: `src/lib/challenge.ts`, `src/data/content.json` (`dailyPairs`), tests, `_implementation/research/daily/seerah-pairs.json`
Steps: a curated list of event pairs whose order is well established (both events dated in the data without "disputed" notes; at least 30 pairs); each answer shows both events' sources and date notes; approximate dates labelled approximate; pairs with disputed conventional dating excluded. The pair list is content and goes through the C-track verification pass.

### T6.6 Directory "Tonight on Moongazer"
Lane: shared · Depends on: T6.2–T6.4 · Files: `homepage/app.js`, `homepage/index.html`, `homepage/ayat-of-the-night.json` (new), `homepage/build.mjs`, `_implementation/verify-static.py` (extend to check the new homepage data file against `quran-full.json`)
Steps:
1. Three tiles: Today's surah (`Guess the Surah #N`), Today's board (`Word Groups #N`), Ayah of the night.
2. Ayah of the night: a local list of ≥ 60 selected ayat (references chosen editorially, short, suitable for families), Arabic and Pickthall copied exactly from `_implementation/research/quran-full.json` with references; picked by the same day number; links to Is It in the Quran? for the reference.
3. Tile selection code must call copies of the same functions as the apps (copy `daily.ts` logic into `app.js` and add a test comparing outputs for 400 consecutive days against the app module).
4. Static HTML shows a sensible default; JS computes today's tiles.
5. "Play today's puzzle" opens Guess the Surah daily mode.
Acceptance: tiles match the apps' `#N` for the same date (test); canonical check passes.
Verify: V4, V5, V6.

### T6.7 "Remind me daily" (.ics)
Lane: app (four daily apps) · Depends on: T6.1, P1 T1.11
A button that downloads a browser-generated `.ics` with a daily `RRULE:FREQ=DAILY` at a time the visitor picks; reuse the corrected PRODID/UID/DTSTAMP logic. No server, no permissions.

### T6.8 Booktube daily export (D24)
Lane: shared · Depends on: T6.2–T6.6 · Files: `homepage/build.mjs`, output `homepage/dist/daily/booktube.json`
At build time write a small JSON for the next 60 days: date, `#N`, Guess the Surah surah id and its clues (exact text with refs), Word Groups board id, Seerah pair ids, ayah of the night ref. `noindex` via header; not linked from pages. Document the format in `context/architecture.md`. (Spoilers here are acceptable: it is a production feed; it is not linked or in the sitemap.)

### T6.9 Phase verification and R6 notes
Lane: shared · V2–V7; blocked-storage run (no streak, game still works); WhatsApp link opens with correctly encoded text; directory tiles match apps. Add a test that fails if `DAILY_EPOCH` is still the placeholder. `releases/R6.md` asks the owner to set the epoch to the publication date, then rebuild.

### T6.10 Release R6
Lane: deploy (owner). Set `DAILY_EPOCH` to the publication date in all copies (a model can do this on request), rebuild, merge, push.
