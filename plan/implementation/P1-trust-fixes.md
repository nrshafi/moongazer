# P1 — Trust fixes

**Branch:** `phase-1-trust-fixes` · **Target:** 12–20 Nov 2026 · **Release:** R1
**Goal:** remove every defect that gives answers away, shows another app's text, breaks metadata or misleads screen readers. No redesign, no renames (P2), no new features.
**Background:** `plan/REPORT.md` §A0; `plan/Verify_Me.md` (triaged in `appendix-verify-me-triage.md`); D18 in `00-INDEX.md`.

Order: T1.1 first (tooling). Shared-lane tasks (T1.2, T1.9, T1.15, T1.16) run one at a time. App-lane tasks may run in parallel, one writer per app. T1.18 last.

---

### T1.1 Shared-file sync and check tool
Lane: shared · Depends on: — · Files: `_implementation/sync-shared.ts` (new)
Steps:
1. Write a Bun script with two modes:
   - `bun _implementation/sync-shared.ts --check` lists every file in the shared set (`00-INDEX.md` §3: `src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/components/LearningGuide.astro`, `src/lib/utils.ts`, `src/lib/seo.ts`, `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/sitemap.xml.ts`, `public/_headers`) and exits 1 if any app's copy differs from the others, printing the differing apps.
   - `bun _implementation/sync-shared.ts --from <slug> <relative-path>...` copies those files from `apps/<slug>/` to every other app that has `package.json`.
2. App list: discover `apps/*/package.json` (do not hard-code), so new and merged apps are handled.
3. Print a summary; never touch files outside the shared list unless passed explicitly with `--allow-extra`.
Acceptance: `--check` passes on the current tree; changing one copy makes it fail; `--from` restores identity.
Verify: run both modes; V3.

### T1.2 Shared shell details
Lane: shared · Depends on: T1.1 · Files: `apps/*/src/layouts/Shell.astro`, `apps/*/src/pages/404.astro`, `apps/*/src/components/LearningGuide.astro`
Steps (edit in `apps/guess-the-surah`, then sync):
1. `Shell.astro`: `<meta name="theme-color">` must use the app's accent instead of hard-coded teal. Derive it from `config.accent` (`teal` → `#087f75`, `blue` → `#316caa`, `violet` → `#7255a0`; add a dark-scheme `<meta name="theme-color" media="(prefers-color-scheme: dark)">` with `#101a24`). Keep the logic in the shared file so all copies stay identical.
2. `404.astro`: text "That page is not here." plus a link "Go back to {config.name} →". Remove the Places Atlas wording ("choose a new place to explore").
3. `LearningGuide.astro`: keep capitals in the collection name ("Explore Quran learning tools"); do not lowercase the category.
4. In these shared files, use "→" for internal links and "↗" only on links with `target="_blank"` to another host.
Acceptance: `sync-shared --check` passes; built 404 pages of two different apps show their own name; theme-color matches accent in a blue app (`understand-salah-lab`) and a violet app (`family-islamic-learning-challenges`).
Verify: V2, V3, V5, V6.

### T1.3 App-specific sources pages (20 apps)
Lane: app (one sub-task per app; may be split among models) · Depends on: — · Files: `apps/<slug>/src/pages/sources.astro`
Today 4 variants of `sources.astro` describe other apps (for example Guess the Surah's page talks about hadith reports and a timeline).
Steps for each app:
1. Read the app's `src/data/sources.json`, `src/data/provenance.json`, `context/project-overview.md` and its pages, to learn what the app actually quotes.
2. Rewrite `sources.astro` so every paragraph is true for this app only, in this order: what the app quotes (Quran editions by id from `provenance.json`; hadith collections only if the app cites hadith; institutional sources only if used); which commentary is linked (only if used); what is editorial (themes, questions, fictional consequences, diagrams, dates as navigation aids, as applicable); the app's limits (one short paragraph); retrieval date and checksum (keep the existing true values); fonts and licences; the reference list (keep the existing `sources.map` list).
3. Keep "Retrieved on 27 October 2026" and similar dates: they are facts (D18).
4. Keep external links with `target="_blank" rel="noopener noreferrer"` and "↗"; internal links use "→".
Acceptance: no sentence mentions a feature, source type or subject the app does not have (for example no "hadith" on Guess the Surah, no "calculator" on the Escape Room); page still lists all references; one H1.
Verify: V1 per app, V5. Record a one-line diff summary per app in the root tracker entry.

### T1.4 Quran Escape Room: giveaways and fixed seeds
Lane: app:`islamic-knowledge-escape-room` · Depends on: — · Files: `src/lib/app.ts`, `src/lib/engine.ts`, `src/data/content.json`, `src/data/provenance.json`, `src/pages/index.astro`, `src/pages/room/[id].astro` (or the actual room route), `tests/`
Facts (11 Nov): lock 1 checks `f.get('theme')===room.name` and the room name is the page H1 and card title; the solution text prints `'Theme: '+room.name`; `const other=rooms.find(r=>r.id!==room.id)` always picks the first other room (Patience) for lock 4 distractors; shuffles use fixed seeds (`123`, `79`, `64`).
Steps:
1. Data: add a `theme` field to every room holding the current theme answer (copy of today's `name`), and give every room a new display `name` that does not reveal the theme (for example "The Locked Library", "The Lantern Room"; no people or animals, no theme word). Add a distinct one-line `description` that is not equal to `hint` and does not name the theme.
2. Code: lock 1 compares against `room.theme`; options are built from `room.options` (ensure `room.theme` is included). Solution text uses `room.theme`.
3. Lock 4 distractors: choose the "other" room with a seeded random pick among all other rooms (not always the first).
4. Seeds: generate one per-play seed `Math.floor(Math.random()*2**31)` when a room starts; store it in the saved progress object (`Progress` gets `seed:number`, validated); derive the shuffles for options, matches, order and snippets from that seed (for example `seed`, `seed^0x9e37`, …). Restart creates a new seed. Resumed rooms keep their seed so the board is stable.
5. Update `validProgress` to accept old saved records without `seed` (assign a new seed) so existing visitors don't break.
6. Update `src/data/provenance.json` `appContentSha256` to the new SHA-256 of `content.json`.
Acceptance: H1, card title and page title never equal the lock 1 answer; card description ≠ hint; across 20 simulated plays, lock 4 distractors come from more than one room; two fresh plays usually differ; a resumed play is identical.
Verify: new unit tests for the seeded selection, distractor room choice and progress validation (old and new shape); V1, V5, V7 (play one room end to end, then resume).

### T1.5 Quran Concept Atlas: stop spoiling Quran Connections
Lane: app:`quran-concept-atlas` · Depends on: — · Files: `src/pages/index.astro`, `src/pages/topic/[id].astro` (actual detail route)
This app is merged in P3; this is the minimum interim fix.
Steps:
1. On the index cards, remove the theme explanation text and the theme name from the card body where they reveal a Quran Connections answer; show the passages' references and a line "Solve this theme's puzzle first →" linking to `https://quran-connections.moongazer.tech/` (the matching puzzle if its URL exists).
2. On each detail page, put the explanation inside `<details><summary>Show the theme (spoiler for Quran Connections)</summary>…</details>`. Keep the content; do not delete it.
Acceptance: no Quran Connections answer is visible without a click on any Atlas page; metadata descriptions do not contain the theme explanation (check `seo.json` `summaryField: "explanation"` and change it to a neutral template if needed).
Verify: V1, V6.

### T1.6 Why It Was Revealed (Revelation Context): quiz giveaway
Lane: app:`revelation-context-explorer` · Depends on: — · Files: `src/pages/index.astro`, `src/pages/reading/[id].astro`, related `src/lib/*.ts`, `src/data/content.json` (only if adding a topic field), tests
Steps:
1. Remove the answer category from the card eyebrow, the page eyebrow and the reading page heading area.
2. Replace the Topic filter (currently the answer categories) with real subject topics. If no topic field exists, add `topic` to each reading in `content.json` (short editorial subject such as "Prayer direction", "Charity"); update `appContentSha256`.
3. Reveal the category only after the reader answers the check.
Acceptance: before answering, the category string appears nowhere in the reading page's visible text, eyebrow, filter or `<title>`/meta description.
Verify: a test that renders/inspects the built HTML of two readings for the category string before the reveal element; V1, V5, V6, V7.

### T1.7 Halal Business Decisions: option order
Lane: app:`halal-business-decisions` · Depends on: — · Files: `src/lib/decision.ts`, `src/lib/engine.ts`, tests
Fact: the "source-aligned" option is the first button in all 12 cases at both stages.
Steps:
1. Shuffle `choices` and `repairs` per case with a seed stored in session memory (or in the saved `Trail` when "remember" is on), so order is stable within a visit and when resumed, but not always first.
2. Keep choice identity by original index in the saved trail so old saved trails still validate.
Acceptance: across all 12 cases the correct option is not always index 0 in the rendered order; resumed case shows the same order.
Verify: unit test of the order function; V1, V7.

### T1.8 Misinformation Casebook: answers in metadata, verdict titles
Lane: app:`islamic-misinformation-casebook` · Depends on: — · Files: `src/data/seo.json`
Steps:
1. Change `summaryField` from `correction` to a field that does not contain the verdict (for example `claim` or `question`), or set a neutral `detailLead` template ("Read the evidence and decide: …").
2. Titles that state the verdict: leave content changes for P3 (claims are rebuilt during the merge); record the list of affected titles in the app tracker for P3.
Acceptance: no built meta description contains a case's `correction` text.
Verify: a test over built HTML or `seo.ts` output; V1, V6.

### T1.9 Shared SEO helper: "?." and boolean summaries
Lane: shared · Depends on: T1.1 · Files: `apps/*/src/lib/seo.ts`
Steps:
1. In `seo.ts` (edit once, sync): when `label` already ends with `?`, `!` or `.`, do not append another `.` (fixes "?.").
2. Keep the existing fallback to `settings.description` when `entry[summaryField]` is not a non-empty string. Add a unit test that fails if more than one detail page in an app ends up with the same description, so a wrong pointer (as in T1.10) is caught by tests instead of shipping.
Acceptance: `sync-shared --check` passes; casebook question titles no longer render "?.".
Verify: unit test for the description builder (add to `_implementation/seo.test.ts` or an app test); V2, V3, V6.

### T1.10 Stories of the Prophets: identical meta descriptions
Lane: app:`stories-of-the-prophets-explorer` · Depends on: — · Files: `src/data/seo.json`
Fact: `summaryField` is `brief`, which is a boolean, so all 25 pages share one description.
Steps: point `summaryField` at `focus` (a string per prophet).
Acceptance: 25 distinct meta descriptions in the build.
Verify: V1, V6 (count distinct descriptions).

### T1.11 Hifz calculator calendar export
Lane: app:`quran-memorization-workload-calculator` · Depends on: — · Files: `src/lib/engine.ts`, tests
Steps:
1. `PRODID:-//Moongazer//Hifz Plan//EN`.
2. UIDs end in `@moongazer.tech` and are unique per event (keep a deterministic part plus the export timestamp).
3. `DTSTAMP` is the current UTC time at export (`YYYYMMDDTHHMMSSZ`), passed in as a parameter so tests can fix it.
Acceptance: generated `.ics` has no `Islamic Product Lab`, no `islamic-product.local`, no fixed 27 October timestamp.
Verify: update tests; V1.

### T1.12 Everyday Akhlaq: choices that matter (minimum)
Lane: app:`everyday-akhlaq-simulator` · Depends on: — · Files: `src/lib/scenario.ts`, `src/data/content.json` (read only unless noted), tests
Fact: the `constructive` flag on options is never read; the second decision and takeaway are the same whatever the first choice.
Steps:
1. Shuffle option order per scenario with a per-visit seed (as T1.7).
2. After each choice, show gentle feedback based on `constructive` ("This choice protects trust" / "This choice may hurt trust; see what happens next"). Wording is editorial; label it so.
3. In the reflection, show which of the two choices were constructive.
4. Real branching (the second decision depends on the first) is content + code work in `C-content-track.md` C15; do not attempt it here.
Acceptance: feedback differs between a constructive and a non-constructive choice; option order varies.
Verify: unit tests for feedback selection and shuffle; V1, V7.

### T1.13 Civilization Timeline: wrong hadith notice
Lane: app:`islamic-civilization-timeline` · Depends on: — · Files: `src/components/References.astro` (or the actual references component)
Steps: show "This app does not republish modern English hadith translations" only when the page's sources include a hadith source (check the source `kind`).
Acceptance: event pages without hadith sources don't show the line.
Verify: V1, V5.

### T1.14 Guess the Surah: misleading pill, identical first clues, answer list in game view, option labels
Lane: app:`guess-the-surah` · Depends on: — · Files: `src/pages/index.astro`, `src/lib/game.ts`, `src/lib/engine.ts`, tests
Steps:
1. Hero pill says "51 short surahs" while the default pool is short surahs (P6 changes the default).
2. Identical/near-identical opening ayat (2, 29, 30, 31; 26, 28; 40–46; 59, 61; confirm the full list by comparing first ayat in `src/data/content.json`): for those surahs clue 1 uses the second ayah (canonical text from the same data, exact). Write a test that no two surahs in the pool share clue-1 text.
3. Move the full 114-surah reference list out of the game view into `<details>` closed by default below the game, labelled "Surah list (contains answers)". Verify_Me item.
4. Answer buttons: wrap the option letter in its own element followed by a real space, so screen readers read "A, At-Talaq" not "AAt-Talaq".
Acceptance: test passes; built HTML shows the list collapsed; button text content has spaces between letter, English name and Arabic name.
Verify: V1, V5, V7.

### T1.15 Understand Salah: recall before reveal; honest audio label
Lane: app:`understand-salah-lab` · Depends on: — · Files: `src/pages/index.astro`, `src/pages/lesson/[id].astro`, `src/lib/lesson.ts`
Steps:
1. Lesson pages start with the meaning hidden (`#practice` button reads "Show meaning", `aria-expanded="false"`, `#meaning` hidden). Without JavaScript the meaning must still be reachable: render it inside `<details>` or show it when JS is unavailable.
2. Card label "Audio available" becomes "Full-surah audio" on the seven Al-Fatiha cards.
3. Check (D18 #18): with the network offline in devtools, the audio element shows the existing "Audio could not load" message and no endless spinner. Fix only if it doesn't.
Acceptance: meaning hidden on load with JS, visible without JS; labels changed; offline check recorded.
Verify: V1, V7.

### T1.16 Seerah Timeline: remove the "connected" promise
Lane: shared (touches `deployment/targets.json`) + app:`interactive-seerah-timeline` · Depends on: — · Files: `deployment/targets.json`, `apps/interactive-seerah-timeline/src/pages/index.astro`, `src/data/learning.json`
Steps: remove "connected" wording from the directory card description, hero copy and the guide step. Rebuild the directory.
Acceptance: no "connected" claim remains in the app or its directory card.
Verify: V1, V4, V6.

### T1.17 Text that runs together for screen readers (Verify_Me)
Lane: shared (audit tool) + app (fixes) · Depends on: T1.2 · Files: `_implementation/audit-text-joins.py` (new), affected `src/pages/*.astro`, `homepage/render.mjs`/`index.html`
Facts: built pages produce strings like `QuranOpen app`, `AQuran 2:153`, `MakkahCity context`, `Case 01Early Makkah`, `The first revelationHira`, `ExploreSources`.
Steps:
1. Write an audit script that parses every built HTML page (all `apps/*/dist` and `homepage/dist`) and reports places where two adjacent inline elements with text (`span`, `a`, `small`, `strong`, `em`, `b`, `time`, `code`) are joined with no whitespace or separator between them inside the same block. Output file, line context and app.
2. Fix sources so a space or a visible separator (" · ") sits between the joined parts. Prefer a real space in the markup; use CSS `gap` only for layout, never as the only separator.
3. Re-run until the audit reports zero items (or only items listed as intentional with a reason).
Acceptance: audit reports zero unexplained joins across all apps and the directory.
Verify: V2, V4, V5, V6.

### T1.18 Directory copy bugs
Lane: shared · Depends on: — · Files: `homepage/collections.json` and any directory page with the sentence
Steps: replace "No result cannot establish that an idea is absent" with "An empty search result does not mean an idea is absent from the Quran." Search all directory and app sources for other double negatives of the same pattern.
Verify: V4, V6.

### T1.19 BDI check (verification only)
Lane: shared · Depends on: T1.17 · Files: none unless a defect is found
Steps: with the audit script approach, list built pages where Arabic-script text (U+0600–U+06FF) appears inside an element whose surrounding text is English without being in its own element with `lang="ar"` and `dir="rtl"` (or `<bdi>`). Fix only real occurrences by wrapping them in `<bdi lang="ar">`. Record "none found" if none.
Verify: V5, V7 spot check of one page with mixed text on phone width.

### T1.20 Phase verification and R1 release notes
Lane: shared · Depends on: all P1 tasks
Steps:
1. Run V2, V3, V4, V5, V6 and V7 (Escape Room, Revelation, Halal Business, Akhlaq, Guess the Surah, Salah flows).
2. Write `plan/implementation/releases/R1.md`: list of fixes (feeds the corrections log seed in P4), checks run and results, known limits.
3. Update `00-INDEX.md` status and root tracker. Tell the owner the branch is ready for review and release.
Acceptance: all checks pass; release note exists.

### T1.21 Release R1
Lane: deploy (owner) · Depends on: T1.20
Owner merges `phase-1-trust-fixes` into `main` and pushes. GitHub Actions runs check/test/build, deploys, verifies live and SEO. Afterwards a model may run `python deployment/verify-seo.py --live` and record results in `releases/R1.md`.
