# P2 brief for per-app subagents: rename, interface words, honorifics (T2.4, T2.6, T2.7)

You work in the Moongazer repo at `I:\Development\moongazer` (Windows; use the Bash tool with POSIX syntax; Bun 1.4.4; Python 3.12 — set `PYTHONIOENCODING=utf-8` whenever Python prints). Moongazer is a set of static Astro apps for Islamic learning in `apps/<slug>/`. You are given a fixed list of apps; touch **only those app folders**. Other agents are editing other apps at the same time.

## Hard rules

- Do NOT run `git commit`, `checkout`, `stash`, `reset`, `push` or any state-changing git command. The orchestrator reviews and commits.
- Do NOT edit shared files (identical in every app): `src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/styles/global.css`, `src/components/LearningGuide.astro`, `src/components/Honorific.astro`, `src/lib/utils.ts`, `src/lib/seo.ts`, `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/sitemap.xml.ts`, `public/_headers`. Do not edit anything under `deployment/`, `homepage/`, `_implementation/` or root `context/`.
- **Sacred text.** Never change Quran Arabic/English (`arabic`, `translation` fields of `{ref, arabic, translation}` records), hadith wording, or any quoted report text. Only editorial fields (titles, summaries, notes, prompts, labels) may change.
- After ANY edit to `src/data/content.json`, update `appContentSha256` in `src/data/provenance.json` to the SHA-256 of the file with CRLF normalised to LF:
  `python -c "import hashlib,sys;print(hashlib.sha256(open(sys.argv[1],'rb').read().replace(b'\r\n',b'\n')).hexdigest())" src/data/content.json` (edit the hash string in place; keep the file's formatting).
- Keep each file's existing line endings and formatting. Keep JSON key order. No new dependencies.
- Hosts, slugs, folder names, ports, URLs and routes never change.
- No images of people or animals; no music. No invented facts.

## T2.4 Rename (skip for apps marked "merge-bound")

Name table (authoritative; "nav" is already done by the orchestrator):

| Folder | Name | Descriptor |
| --- | --- | --- |
| guess-the-surah | Guess the Surah | Find the surah from its clues |
| ayah-threads | Ayah Threads | Three ayat, one hidden thread: a Quran puzzle |
| word-groups | Word Groups | Sixteen Quran words, four hidden groups |
| quran-escape-room | Quran Escape Room | Rooms of Quran puzzles to solve together |
| is-it-in-the-quran | Is It in the Quran? | Search every ayah in Arabic and English |
| stories-of-the-prophets | Stories of the Prophets | The prophets in the Quran: read, reflect and check |
| parables-of-the-quran | Parables of the Quran | The Quran's parables, explained |
| places-in-the-quran | Places in the Quran | A map of the places the Quran names, and where certainty ends |
| why-it-was-revealed | Why It Was Revealed | Asbab al-nuzul: the reports behind selected ayat |
| seerah-timeline | Seerah Timeline | The Prophet's life ﷺ from 610 to 632 |
| seerah-detective | Seerah Detective | Solve cases from the Prophet's life ﷺ using the reports |
| civilization-timeline | Civilization Timeline | Islamic civilization across regions |
| understand-your-salah | Understand Your Salah | The meaning of the words you say in prayer |
| hifz-planner | Hifz Planner | Estimate new memorization and revision time for your week |
| everyday-akhlaq | Everyday Akhlaq | Everyday character dilemmas: choose, then read the sources |
| family-halaqa | Family Halaqa | Ten-minute Islamic activities to do together |
| quran-concept-atlas | (merge-bound, keep "Quran Concept Atlas") | |
| islamic-history-timeline-challenge | (merge-bound, keep "Islamic History Timeline Challenge") | |
| halal-business-decisions | (merge-bound, keep "Halal Business Decisions") | |
| islamic-misinformation-casebook | (merge-bound, keep "Islamic Misinformation Casebook") | |

For each renamed app:
1. `src/data/config.json`: `name` = Name; `description` = Descriptor (plain sentence form allowed: may end without a full stop).
2. `src/data/seo.json`: `title` = `Name — Descriptor | Moongazer` (if over ~65 characters, shorten only the descriptor part sensibly and report it); `shortName` = Name; `description` = one or two plain sentences that start with what the learner does and naturally include the old search keyword (`keyword` field) — keep it 120–160 characters, true to what the app does now (no promise of features that don't exist: no "daily" anything).
3. `src/data/learning.json`: `heading` = Name (it is the page H1 and must equal it exactly); update `related[].name` to the new names of the other apps using the table (merge-bound apps keep their names); fix product names in `summary`, `steps`, `questions`.
4. `src/pages/index.astro`: H1 must render the Name (it renders `learning.heading`); eyebrow/pill/intro: one or two plain sentences, no caveat-first wording, no old name. Do not remove features or controls.
5. Replace every old product name in UI strings, share/copy text in `src/lib/*.ts` (e.g. "Islamic Concept Connections · board N" → "Word Groups · board N"), `src/pages/**`, `src/data/*.json` editorial fields, and the app's `context/` files where it is used as the product name (leave dated historical tracker entries alone). `sources.astro` may keep an old name only where it describes provenance.
6. Acceptance: after `bun run build`, `grep -rl "<old name>" dist` finds nothing except provenance mentions; header brand = H1 = title name part.

For merge-bound apps: only make the H1 (`learning.json` heading) and the `<title>` name part agree with the current `config.json` name; do T2.6 and T2.7.

## T2.6 Interface words (all your apps)

Read `plan/REPORT.md` section "A4. The naming system" (its "Words to retire" / label table) and apply it where those words occur in your apps' UI. Including:
- "Choose a record" → "Choose a case" / "Choose a pack" / "Choose a reading" (the app's own item noun)
- "Copy saved reading list" → "Copy my list"; "Save reading" / "Save for later" → "Save" (keep aria-pressed logic; the saved-state text "Saved ✓" may stay)
- "Editorial feedback: Source-aligned / Needs repair / Clarify first" → "Fair to everyone / Needs putting right / Ask first"
- "Transmitted occasion / General context / Response after revelation" → "A reported occasion / General context / What happened after" (display labels only; if these strings are also stored values used for grading, add a display-label map in code instead of changing stored values, and keep tests passing)
- "Unpinned / Regional reference / City context / Heritage context" → "Location uncertain / Region known / Exact site known / Exact site known" (display only, same caution)
- "Listen with your eyes" → "The Arabic"; "Makkan classification" → "Revealed in Makkah" (and "Madinan classification" → "Revealed in Madinah")
- "Source dossier", "source shelf", "evidence set", "fixed case bank" → "Sources" / "Notes" / "Clues" as fits
- "Find an entry" → "Search"; "No entries match" → "Nothing matches"; generic "entry"/"record" → the app's item noun.
- One word per thing inside an app (case, scenario, parable, event, pack, reading, room, board, puzzle, lesson, place, prophet).
Acceptance: `grep -rli` of each app's `dist/` finds none of the retired phrases.

## T2.7 Honorifics (all your apps)

- **The Prophet Muhammad ﷺ:** in editorial text, every mention of "the Prophet Muhammad", "Prophet Muhammad", "Muhammad" (meaning him) and "the Prophet" (meaning him) gets ﷺ right after it (with a normal space before), unless one is already there.
  - In `.astro` templates: `import Honorific from '../components/Honorific.astro'` (adjust the relative path) and write `the Prophet <Honorific />`.
  - In JSON data (editorial fields only): store the plain glyph, e.g. `"the Prophet ﷺ said…"`. Plain ﷺ already renders in the Amiri font via a shared font rule. Where a client script (`src/lib/*.ts`) inserts such JSON text into `innerHTML`, wrap the escaped string: `withHonorifics(esc(text))` (both exported from `./utils`).
  - In page `<title>`, meta descriptions and share text: use the plain glyph ﷺ.
- **Other prophets:** add " (peace be upon him)" after the first mention of the prophet's name in the first editorial paragraph of a page (use `<Honorific kind="other" />` in Astro or plain text in JSON). Not in headings, titles, buttons, card titles, filter options or canonical quotations. For apps where prophets are the subject of every card (Stories of the Prophets), add it once in the intro paragraph of each detail page and leave the grid cards alone.
- Never inside canonical quotations or quoted report text.
- Record the approach in the app's `context/architecture.md` (one line: "Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts").

## Verify (each of your apps)

In the app folder: `bun run check`, `bun test`, `bun run build` — all must pass (retry with `RAYON_NUM_THREADS=2` on a sandbox/thread error). If an app test asserts an old name or label, update the test to the new wording (do not delete assertions). Then grep `dist/` for old names and retired phrases. From the repo root run `bun test _implementation/seo.test.ts` once at the end.

Append to each app's `context/progress-tracker.md`: `## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics` with what changed, any descriptor/title you shortened, content.json changes and the new hash, and the checks with exact results.

## Final reply

Per app: files changed (one line each), old → new name, any judgement calls, content.json hash changes, check results with exact counts, anything you could not do. Be concise.
