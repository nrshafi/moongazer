# P2 — Names, copy and honorifics

**Branch:** `phase-2-names` · **Target:** 21–27 Nov 2026 · **Release:** R2 · **Depends on:** P1 merged
**Goal:** one name per app everywhere (header, H1, card, title, share text), a plain present-tense descriptor that carries the search phrase, everyday interface words, the right nav verb, and consistent honorifics.
**Background:** `plan/REPORT.md` §A4 (rules, rename table, label table), §A12.4.

Hosts, slugs, ports and Pages project names **do not change**. The four apps that P3 merges (`quran-concept-atlas`, `islamic-history-timeline-challenge`, `halal-business-decisions`, `islamic-misinformation-casebook`) keep their names; only make their H1 and `<title>` agree.

## Name and descriptor table (authoritative)

"Now" descriptors ship in P2. "Later" descriptors are applied by the phase that ships the feature (named in brackets). Never publish a descriptor that promises a feature that is not live.

| Folder | Name | Descriptor now | Descriptor later | Nav verb |
| --- | --- | --- | --- | --- |
| guess-the-surah | Guess the Surah | Find the surah from its clues | A daily Quran quiz: find the surah from its clues [P6] | Play |
| ayah-threads | Ayah Threads | Three ayat, one hidden thread: a Quran puzzle | …: a daily Quran puzzle [P6] | Play |
| word-groups | Word Groups | Sixteen Quran words, four hidden groups | …: a daily puzzle [P6] | Play |
| quran-escape-room | Quran Escape Room | Rooms of Quran puzzles to solve together | — | Play |
| is-it-in-the-quran | Is It in the Quran? | Search every ayah in Arabic and English | …, and check popular claims [P3] | Search |
| stories-of-the-prophets | Stories of the Prophets | The prophets in the Quran: read, reflect and check | — | Read |
| parables-of-the-quran | Parables of the Quran | The Quran's parables, explained | The Quran's parables, drawn and explained [only if diagrams ship] | Read |
| places-in-the-quran | Places in the Quran | A map of the places the Quran names, and where certainty ends | — | Read |
| why-it-was-revealed | Why It Was Revealed | Asbab al-nuzul: the reports behind selected ayat | — | Read |
| seerah-timeline | Seerah Timeline | The Prophet's life ﷺ from 610 to 632 | …, with a "Which came first?" game [P3] | Read |
| seerah-detective | Seerah Detective | Solve cases from the Prophet's life ﷺ using the reports | — | Play |
| civilization-timeline | Civilization Timeline | Islamic civilization across regions | …, from 632 onward [C12 when Rashidun records exist] | Read |
| understand-your-salah | Understand Your Salah | The meaning of the words you say in prayer | The meaning of every phrase you say in prayer [C13 when complete] | Learn |
| hifz-planner | Hifz Planner | Estimate new memorization and revision time for your week | Plan new memorization and revision around your week [P7] | Plan |
| everyday-akhlaq | Everyday Akhlaq | Everyday character dilemmas: choose, then read the sources | Character and halal business dilemmas: choose, then read the sources [P3] | Play |
| family-halaqa | Family Halaqa | Ten-minute Islamic activities to do together | — | Read |

Title tag pattern: `Name — descriptor | Moongazer` on app homes; `Item title | Name` on detail pages (keep the existing helper behaviour, just with the new name).

---

### T2.1 Context first
Lane: shared · Files: `context/ui-context.md`, `context/project-overview.md`, each renamed app's `context/project-overview.md` and `context/ui-context.md`
Steps:
1. `context/ui-context.md`: add a "Naming" section: two layers (name + descriptor), one name everywhere, the title pattern above, no "Islamic"/"The"/format jargon in names, nav verb rule, one word per thing inside an app, the honorifics rule (helper, Amiri glyph, never inside canonical quotations).
2. `context/project-overview.md`: add a "Display name" column to the implemented-projects table. Slugs, ports and hosts unchanged.
3. Each app's local context: replace the old display name where it is used as the product name; keep historical tracker entries as they are.
Verify: `python _implementation/verify-context.py` if it runs; otherwise path/fact check. Record the result honestly.

### T2.2 Honorific helper (shared)
Lane: shared · Depends on: T2.1 · Files: `apps/*/src/components/Honorific.astro` (new, add to the shared list in `sync-shared.ts`), `apps/*/src/lib/utils.ts`, `apps/*/src/styles/refinement.css`
Steps:
1. `Honorific.astro` renders `<span class="honorific" lang="ar" aria-label="peace and blessings be upon him">ﷺ</span>`. Optional prop `kind="other"` renders " (peace be upon him)" as plain English text instead.
2. Add `export const SAW = '<span class="honorific" lang="ar" aria-label="peace and blessings be upon him">ﷺ</span>'` (or a function returning it) to `utils.ts` for strings rendered by client scripts; document that it must only be concatenated into already-escaped HTML.
3. CSS: `.honorific{font-family:Amiri,serif;font-size:1.05em;line-height:1}` in `refinement.css`.
4. Add `src/components/Honorific.astro` to the shared list in `_implementation/sync-shared.ts` and in `00-INDEX.md` §3; sync.
Acceptance: `sync-shared --check` passes; the glyph renders in Amiri in both themes (spot-check one page).
Verify: V2, V3, V7.

### T2.3 Nav verb in the shell
Lane: shared · Depends on: T2.2 · Files: `apps/*/src/layouts/Shell.astro`, `apps/*/src/data/config.json`
Steps: add `"nav": "Play" | "Read" | "Search" | "Plan" | "Learn"` to every app's `config.json` (table above; merge-bound apps: Concept Atlas "Read", Timeline Challenge "Play", Halal Business "Play", Casebook "Read"). The shell's primary nav label uses `config.nav` instead of "Explore". Keep the tagline "Islamic learning, explored." but hide it below 720 px.
Acceptance: each app's nav shows its verb; shell copies identical.
Verify: V2, V3, V7 (header at 390 px: name and logo visible, Family Halaqa included).

### T2.4 Rename each app (one sub-task per app)
Lane: app (16 sub-tasks, parallel allowed) · Depends on: T2.3 · Files per app: `src/data/config.json` (`name`, `description`), `src/data/seo.json` (`title`, `shortName`, descriptions), `src/data/learning.json` (`heading`, related-app names), `src/pages/index.astro` (eyebrow, H1, pill, intro), share/copy strings in `src/lib/*.ts`, `context/`
Steps:
1. Apply the name and "Descriptor now" from the table. H1 = name. Intro paragraph: one or two plain sentences, no caveat-first wording.
2. Replace every old product name in UI strings and share text (for example "Islamic Concept Connections · board N" → "Word Groups · board N").
3. Update related-app names in `learning.json` to the new names of the other apps.
4. Merge-bound apps: only make H1 and `<title>` agree with their current name.
Acceptance: in the build, header brand = H1 = `og:title` name part = JSON-LD name; no old name remains in UI text (grep the app's `dist/` for the old name; historical text in `sources.astro` may keep it only where it describes provenance).
Verify: V1, V6.

### T2.5 Directory names
Lane: shared · Depends on: T2.4 · Files: `deployment/targets.json` (`name`, `kind`, `description`), `homepage/collections.json`, `homepage/index.html`, `homepage/render.mjs` if names are hard-coded, `homepage/about-content.html`
Steps: apply names and "now" descriptors; featured cards say "Open Understand Your Salah" style CTAs; rebuild with `node homepage/build.mjs`; regenerate `llms.txt` (done by the build).
Acceptance: all twenty cards show the right names; no old name in directory pages except merge-bound apps.
Verify: V4, V6.

### T2.6 Interface words
Lane: app (per app) · Depends on: T2.4 · Files: `src/pages/*.astro`, `src/lib/*.ts`
Apply REPORT §A4 "Words to retire" in every app where they occur, including: "Choose a record" → "Choose a case/pack/reading"; "Copy saved reading list" → "Copy my list"; "Save reading" → "Save"; "Editorial feedback: Source-aligned / Needs repair / Clarify first" → "Fair to everyone / Needs putting right / Ask first"; "Transmitted occasion / Response after revelation" → "A reported occasion / What happened after"; "Unpinned / Regional reference / City context / Heritage context" → "Location uncertain / Region known / Exact site known / Exact site known"; "Listen with your eyes" → "The Arabic"; "Makkan classification" → "Revealed in Makkah"; "Source dossier/source shelf/evidence set/fixed case bank" → "Sources/Notes/Clues". One word per thing inside an app (case, scenario, parable, event, pack, reading).
Data labels that are part of `content.json` may change only in editorial fields, never canonical text; update `appContentSha256` after any `content.json` edit.
Acceptance: grep of each app's `dist/` finds none of the retired phrases.
Verify: V1, V5.

### T2.7 Honorifics in editorial text (one sub-task per app)
Lane: app/content · Depends on: T2.2 · Files: `src/data/*.json` editorial fields, `src/pages/*.astro`, `homepage/*` copy
Steps:
1. Find every editorial mention of "the Prophet Muhammad" and "the Prophet" (meaning him) and add ﷺ via the helper (Astro) or the `SAW` string (client scripts). In JSON data, store the plain glyph `ﷺ` and let the renderer wrap it, or add a renderer step that wraps `ﷺ` in the span; choose one approach per app and document it in the app context.
2. Add "(peace be upon him)" after other prophets' names at their first mention per page in editorial text.
3. Never touch fields that hold canonical quotations (`arabic`, `translation` inside `{ref, arabic, translation}` records) or quoted report text.
Acceptance: `python _implementation/verify-static.py` passes (proves canonical text unchanged); a grep of editorial fields shows no "the Prophet" without ﷺ, except inside quotations.
Verify: V1, V5.

### T2.8 Social cards
Lane: shared · Depends on: T2.5 · Files: generated PNGs via `deployment/seo-assets.py`
Steps: read the script and its requirements file; if names appear on the cards, regenerate in an isolated virtual environment (do not install packages globally); otherwise record "not needed".
Verify: open two regenerated cards and check the names.

### T2.9 Phase verification and R2 notes
Lane: shared · Depends on: all P2 tasks
Steps: V2–V7 (header at 390 px for all 20 apps, both themes); write `plan/implementation/releases/R2.md`; update status and trackers.

### T2.10 Release R2
Lane: deploy (owner). Same procedure as T1.21.
