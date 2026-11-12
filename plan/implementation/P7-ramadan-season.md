# P7 — Hifz Planner, Zakat Calculator and the Ramadan hub

**Branches:** app lane `phase-7-hifz`, `phase-7-zakat` (from 21 Nov); integration `phase-7-ramadan` (4–8 Jan 2027) · **Release:** R7 · **Hard deadline:** merged before the 15 Jan 2027 freeze
**Goal:** be useful at the year's biggest moment: a real hifz plan, a zakat calculator that shows its method without ruling, and a Ramadan hub.
**Background:** `plan/REPORT.md` §A8 entry 14, §A9, §A11.5; D7, D9, D23 in `00-INDEX.md`; `context/project-dna.md` value 1.

App-lane work here must not edit shared files (`00-INDEX.md` §3). After each shared phase merges, run `bun _implementation/sync-shared.ts --from guess-the-surah <shared files>` so the new app receives the latest shell, then rebuild.

## Part 1 — Hifz Planner (`hifz-planner`)

Keep the engine and its tests; build on top.

### T7.1 Context first
Lane: app · Files: app `context/project-overview.md`, `architecture.md` (new storage keys `plan`, `checkoffs`, `vocab`), `ui-context.md`, `DESIGN.md`.

### T7.2 Wizard
Lane: app · Depends on: T7.1 · Files: `src/pages/index.astro`, `src/lib/wizard.ts` (new), `src/lib/engine.ts`, tests
1. Step 1 "What have you memorized?": choose by juz or by surah using the bundled 114 chapters and 604-page layout in `src/data/content.json` (verify the page map exists and is complete; if not, fetch from Quran MCP metadata and record).
2. Step 2 "Your week": days per week and minutes per day; optional "Ramadan pace" preset (more revision, fewer new pages) labelled as a suggestion.
3. Step 3 "Your plan": this week's checklist (new lesson / recent revision / old revision per day) and a calendar view.
4. Per-page minute estimates move into an "Adjust assumptions" drawer with plain labels ("How many new pages per session?" instead of "Maximum new pages per session").
Acceptance: plan generation is a pure tested function of the inputs; every page 1–604 is reachable through the juz/surah choices.

### T7.3 Check-offs, "I missed a day", print, vocabulary, export
Lane: app · Depends on: T7.2
1. Check-offs saved locally (opt-in, key `checkoffs`, validated).
2. "I missed a day" re-plans from today without losing completed check-offs (pure function + tests: missed one day, missed a week, all done).
3. Printable weekly sheet for a teacher (print CSS, no storage needed).
4. Display setting: sabaq / sabqi / manzil labels (new lesson / recent revision / old revision).
5. `.ics` export from the wizard (P1-corrected generator) and "Remind me daily".
6. Events: `activity_started` on step 1, `activity_completed` when a plan is generated (`itemId='plan'`).
7. Descriptor → "Plan new memorization and revision around your week".
Verify: V1, V7 (blocked storage: wizard still works, check-offs explain they won't be kept).

## Part 2 — Zakat Calculator (new app `apps/zakat-calculator`, port 4341)

### T7.4 Research and method record (content lane; second-pass verified)
Lane: content:zakat-calculator · Files: `_implementation/research/zakat/method.json`, `_implementation/research/zakat/verification.json`
Produce a method record with, for each element, the textual basis and where each position is documented:
- Obligation, recipients, rate 1/40 (2.5%), lunar-year (hawl) condition: Quran references via Quran MCP (for example 9:60, 9:103, 2:267; fetch and cite exactly), hadith by collection and number checked on sunnah.com (for example the nisab narrations in Sunan Abi Dawud, kitab al-zakat; confirm the exact numbers on sunnah.com before citing).
- Nisab: 20 mithqal gold / 200 dirham silver (textual basis) and the **modern weight conversions in use** (for example 85 g gold / 595 g silver, and other published conversions); cite where each conversion is published; present both and do not choose.
- Differences, each with labelled options and attributions: personal-use gold/silver jewellery (Hanafi: zakatable; Maliki, Shafi'i, Hanbali: generally not for permitted personal jewellery); deducting debts that are due; receivables you expect to receive vs doubtful; which nisab metal to use for mixed assets. Attribute positions only to sources you can open and cite (AAOIFI Shari'ah Standard 35 if its official text is accessible; named classical works only with an accessible edition reference). If a position cannot be verified, leave the option out and note it.
- Zakat al-fitr explainer facts: who pays, for whom, timing before the Eid prayer, the basis (hadith with collection/number checked on sunnah.com), food vs cash value as a documented difference. **No amounts**: "Ask your local masjid or zakat committee for this year's amount."
Then a separate verification task re-opens every citation and records pass/fail per item (D9). Owner spot-checks before T7.6 is merged.

### T7.5 Scaffold the app
Lane: app:zakat-calculator · Depends on: — (can start 21 Nov) · Files: `apps/zakat-calculator/**`
1. Copy an existing app's skeleton manually (package.json with the same pins and scripts on port 4341, `astro.config.mjs` with `site: 'https://zakat-calculator.moongazer.tech'`, tsconfig, `.gitignore`, public fonts and licences, shared files via `sync-shared.ts`, `_headers`, a new glyph-only logo `favicon.svg`: a balance or coin stack, no figures).
2. `AGENTS.md` and six filled context files (no placeholders), `DESIGN.md` (Sanctuary archetype, blue family).
3. `src/data/config.json` (`slug`, `name: "Zakat Calculator"`, `description: "Work out your zakat step by step, with the method shown"`, `accent: "blue"`, `nav: "Plan"`, `port: 4341`), `seo.json`, `learning.json`, `sources.json`, `provenance.json`, `content.json` (method data from T7.4).
4. `bun install` creates `bun.lock` with the pinned versions (no version changes).
Acceptance: `bun run check`, `test`, `build` pass on an empty-but-complete app.

### T7.6 Calculation engine and UI
Lane: app:zakat-calculator · Depends on: T7.4 verified, T7.5 · Files: `src/lib/zakat.ts` (pure), `src/lib/app.ts`, `src/pages/index.astro`, `src/pages/method/index.astro`, `src/pages/zakat-al-fitr/index.astro`, tests
1. Inputs: cash and bank balances; gold and silver (by weight or value); business stock at current market value; money owed to you that you expect to receive; short-term debts due now; other zakatable assets only as the method record defines them. Currency is whatever the visitor uses (a label field, default "BDT"; no conversion).
2. Nisab: the visitor enters today's gold and silver price per gram (no live API; architecture forbids runtime APIs). Show both nisab values; the visitor picks the metal; show which choice they made.
3. Differences (D23): one labelled choice per difference from the method record, each with a source note and "Learn more" link to `/method/`. No default; the calculate button asks the visitor to choose any unanswered difference.
4. Output: whether total ≥ nisab, zakat due (1/40 of the zakatable total), a line-by-line breakdown, the list of choices made, and a printable summary. Nothing stored unless the visitor opts in (key `inputs`).
5. Pure module with worked examples taken from the method record as test cases (each example cites its source); property tests (zero assets → zero; below nisab → zero; linearity above nisab).
6. Limit sentence beside the result: "This shows the calculation for the choices you made. It is not a fatwa; ask a scholar you trust about your situation."
7. Feedback form (P4) and counter events wired.
Acceptance: all tests pass; every difference shown has a verified source; no default ruling anywhere.
Verify: V1, V5, V6, V7 (phone and desktop, both themes, print preview).

### T7.7 Register the new app (integration)
Lane: shared · Depends on: T7.6 and P6 merged · Files: `deployment/targets.json` (new entry with `time/audience/format` fields), `_implementation/verify.ts` (app list), `_implementation/verify-static.py` (if it expects a fixed count), SEO validator expectations, `.github/workflows/deploy.yml` (no change needed if it loops `apps/*`; confirm), `homepage/_redirects` (`/zakat`), directory copy ("17 free apps" truthfully), `context/project-overview.md` (row: port 4341)
Verify: V2, V4, V5, V6.

### T7.8 Production for the new app
Lane: deploy (owner): create Pages project `moongazer-zakat-calculator`, custom domain `zakat-calculator.moongazer.tech`, DNS; submit its sitemap in Search Console; then release.

## Part 3 — Ramadan hub (`moongazer.tech/ramadan/`)

### T7.9 Expected dates record
Lane: content · Files: `_implementation/research/ramadan/dates.json`
Record the expected start of Ramadan 1448, the last ten nights and Eid al-Fitr from a named published calendar (cite it), with the note "expected; confirm with your local moon sighting". Do not compute dates yourself and present them as fact. If sources differ by a day, show the range.

### T7.10 Hub page
Lane: shared · Depends on: P6, T7.7, T7.9, C16 (Ramadan packs), C4 (Ramadan rooms) · Files: `homepage/ramadan-content.json` (new), `homepage/render.mjs`/`build.mjs`, `homepage/styles.css`, sitemap
1. Route `/ramadan/` built by `homepage/build.mjs` with its own title, description, canonical, sitemap entry and breadcrumb.
2. A 30-night path, one card per night: Guess the Surah Juz N link (Juz mode deep link, for example `https://guess-the-surah.moongazer.tech/?mode=juz&juz=N`; add that URL parameter handling in the app if not present, validated), Family Halaqa Ramadan pack N, the Escape Room "Ramadan nights" room for that night where one exists, and a short ayah (exact text, from `quran-full.json`, verified by the static check).
3. A last-ten-nights section (editorial, sourced: Quran 97 via MCP, hadith on seeking Laylat al-Qadr by collection and number checked on sunnah.com).
4. Zakat Calculator and zakat al-fitr explainer links.
5. Printable Ramadan calendar (print CSS) with dates labelled "expected; confirm with your local moon sighting".
6. No countdown.
Acceptance: V5 passes for hub ayat; no unverified claims; JS not required.

### T7.11 Seasonal slot switch (date-driven, built before the freeze)
Lane: shared · Files: `homepage/app.js`, `homepage/index.html`, `homepage/seasonal.json`
The directory seasonal slot shows the Ramadan hub card between two dates in `seasonal.json` (start ≈ two weeks before the expected start; end ≈ three days after expected Eid). Static default: hidden; JS shows it in range. Changing the dates after the freeze is an allowed "date flip" (D6).

### T7.12 Phase verification and R7
Lane: shared · V2–V7 for Hifz, Zakat, hub; `releases/R7.md`; record the D9 verification status of zakat content honestly (verified by second pass on <date>; owner spot-check on <date>; no scholarly review).

### T7.13 Release R7
Lane: deploy (owner), together with T7.8.
