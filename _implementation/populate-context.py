"""Create the requested project context sets once; use --verify-only afterwards.

The generated Markdown is maintained by hand after this initial population.
Application source, original templates, and release archives are never edited.
"""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import hashlib, json, os, re, sys

ROOT = Path(__file__).resolve().parent.parent
FILES = ['project-overview.md', 'architecture.md', 'ui-context.md', 'code-standards.md', 'ai-workflow-rules.md', 'progress-tracker.md']
ORDER = ['guess-the-surah','ayah-threads','seerah-detective','everyday-akhlaq','seerah-timeline','hifz-planner','is-it-in-the-quran','quran-concept-atlas','quran-escape-room','stories-of-the-prophets','places-in-the-quran','word-groups','islamic-history-timeline-challenge','understand-your-salah','parables-of-the-quran']
STAMP = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=6))).strftime('%Y-%m-%d %H:%M:%S +06:00 (Asia/Dhaka)')

# These are app-specific descriptions of implemented behavior, not future plans.
DETAILS = {
'guess-the-surah': dict(
 audience='Learners who want to recognize Quran chapters through a short, immediately usable quiz.',
 scope='All 114 surahs with exact opening-ayah evidence, four progressive clues, filtered rounds, seeded links, scoring, results and optional recovery.',
 flow=['Choose a practice collection and round settings, or open a seeded challenge link.','Reveal clues and choose a surah from the available answers.','Read the opening passage and explanation, continue the round, then share the informal result.'],
 ui='A progressive clue stack and answer choices lead the page; the result shows evidence and the effect of clue use.',
 mechanics='`engine.ts` owns seeded round generation, filtered answer options and clue-sensitive scoring. `game.ts` manages the browser round and recovery.',
 storage='`remember` stores the recovery preference; `round` stores validated round state. A supplied challenge seed starts its own reproducible round.',
 boundary='Do not describe editorial clues or client-side scores as scholarly assessment. Keep Arabic opening text and fetched chapter metadata intact.',
 regression='Verify all 114 chapters, unique answer choices, filtered answer pools, deterministic seeds, wrong answers, clue scoring, results and reload recovery.'),
'ayah-threads': dict(
 audience='Readers who want to notice a shared theme across Quran passages and inspect the evidence.',
 scope='30 three-passage puzzles, intended themes, distractors, hints, retries, optional Arabic display, explanations and shareable puzzle links.',
 flow=['Choose a puzzle or open a puzzle link.','Compare the three readings, optionally show Arabic or use a hint, and choose a theme.','Read the explanation and cited commentary; retry or move to another puzzle.'],
 ui='Three linked passage readings and a theme-choice panel are the central interaction.',
 mechanics='`puzzle.ts` controls the selected puzzle, theme answers, hints and explanations. The puzzle records are in `src/data/content.json`.',
 storage='`remember` stores the recovery preference; `puzzle` stores validated puzzle state.',
 boundary='A matching answer is the intended editorial connection, not the only possible observation about a passage. This app differs from the sixteen-tile grouping game.',
 regression='Check all 30 puzzles, all three canonical passages per puzzle, theme choices, Arabic display, retry, hints, sharing and optional recovery.'),
'seerah-detective': dict(
 audience='Learners who want to practice reading historical reports before selecting a supported conclusion.',
 scope='12 investigations, three source-backed evidence cards per case, competing conclusions, hints, graded feedback, source readings and optional case recovery.',
 flow=['Browse the case catalog and open an investigation.','Examine the evidence cards, follow the named reports, and select a conclusion.','Read why the conclusion is or is not supported; retry, restart, share or open another case.'],
 ui='A case-file catalog and evidence board keep reports visible before the final conclusion.',
 mechanics='`catalog.ts` handles the catalog. `investigation.ts` owns case interaction and feedback. Static case routes are generated from the bundled records.',
 storage='`remember` stores the recovery preference. `case-<case-id>` stores validated state for the selected investigation.',
 boundary='Distinguish report text, original paraphrase and inference. A case conclusion must not claim more than the identified report establishes.',
 regression='Check all 12 case routes, evidence reveal, competing conclusions, incorrect/correct feedback, hints, source references and per-case recovery.'),
'everyday-akhlaq': dict(
 audience='Visitors who want to consider everyday choices through short fictional situations and sourced reading notes.',
 scope='20 fictional scenarios, two decisions per scenario, response-specific consequences, reflection, source notes, sharing and optional recovery.',
 flow=['Select a situation from the catalog.','Make the first choice, read its consequence, and choose a response at the second decision.','Read the final reflection and source passage; restart or explore another situation.'],
 ui='A branching choice panel separates the fictional event and consequence from the source reading.',
 mechanics='`catalog.ts` handles discovery. `scenario.ts` manages the two-decision branch and response-specific consequences.',
 storage='`remember` stores the recovery preference. `scenario-<scenario-id>` stores validated decisions for that scenario.',
 boundary='Situations and consequences are fictional editorial applications. Do not turn them into personalized religious rulings or claims that the source predicts an outcome.',
 regression='Check all 20 scenario routes, both decision stages, different response paths, final source notes, restart and scenario-specific recovery.'),
'seerah-timeline': dict(
 audience='Readers who want to browse a sourced chronology of the prophetic mission and open individual event notes.',
 scope='36 event records, era/topic filters, text search, date and source limitations, bookmarks, print support and individual static event pages.',
 flow=['Browse or filter the chronological event list.','Select an event to read its summary, date band, uncertainty note and sources.','Open its detail page, bookmark it, or print a reading view.'],
 ui='A chronological rail and selected-event detail view make the event sequence visible without a game score.',
 mechanics='`timeline.ts` controls filtering, selection and bookmarks. The event route publishes each bundled event as a static page.',
 storage='`bookmarks` stores selected event IDs when the visitor explicitly saves them.',
 boundary='Date bands are approximate navigation aids. A report supporting an event does not necessarily establish its displayed CE year. Do not erase disputed placement notes.',
 regression='Check all 36 event routes, search, combined filters, empty results, selection, bookmarks, uncertainty notes and print behavior.'),
'hifz-planner': dict(
 audience='Learners estimating how new memorization and an expanding revision workload fit their own study time.',
 scope='A 604-page-layout model with existing/new pages, user-supplied time estimates, pace limits, study weekdays, start date, revision cycle, schedule pagination, CSV and calendar export.',
 flow=['Enter existing pages, a new-page goal, study time and learning/review estimates.','Choose study weekdays, start date and revision cycle, then calculate.','Inspect feasibility, the revision curve and schedule; adjust assumptions or export the CSV/calendar.'],
 ui='Editable assumptions lead to a revision-workload curve, estimated totals and a paginated exact schedule.',
 mechanics='`engine.ts` validates assumptions, simulates study sessions and builds ICS text. `app.ts` renders the results and creates local download blobs.',
 storage='`plan` stores assumptions only if the remember checkbox is enabled. Calculated schedules and exports are otherwise in memory.',
 boundary='604 pages is the selected Hafs layout, not a universal pagination. Speeds are user assumptions, not validated learning predictions. Distinguish capacity failure from a viable plan beyond the 3,650-session horizon; ICS exports at most 90 sessions.',
 regression='Check invalid totals/dates/weekdays, leap days, growing review time, per-session budgets, structural ceilings, the finite horizon, final-goal completion, CSV and all-day ICS limits.'),
'is-it-in-the-quran': dict(
 audience='Readers checking the wording or reference of a claimed Quran quotation before sharing it.',
 scope='All 6,236 ayahs in Uthmani Arabic and Pickthall English, lazy local corpus loading, normalized phrase search, lexical suggestions, chapter filters, direct reference ranges, pagination and fragment-based sharing.',
 flow=['Enter a phrase or valid chapter:ayah reference, then select a language and optional chapter filter.','Search the local corpus and distinguish exact normalized wording matches from related-word suggestions.','Read the full ayahs and context links; explicitly copy a passage or a search link if needed.'],
 ui='A search-first workspace places coverage limits next to the controls and full cited results below.',
 mechanics='`engine.ts` owns normalization, reference parsing, the local index and exact/related matching. `app.ts` imports `corpus.json` on first search and handles results.',
 storage='`recent` holds at most five queries only after opt-in. Sharing explicitly writes the query into a URL fragment, not a request query string.',
 boundary='No wording match is not proof that an idea is absent. Scope English results to Pickthall, keep related terms separate, preserve displayed source text, reject references longer than 30 ayahs and queries shorter than two normalized characters.',
 regression='Check corpus completeness/uniqueness, word boundaries, Arabic normalization, valid and invalid ranges, chapter filtering, exact/related separation, empty results, opt-in history and fragment sharing.'),
'quran-concept-atlas': dict(
 audience='Readers following a theme from one Quran passage to related selected readings.',
 scope='30 topics, 90 selected readings, study-area/search filters, related-topic paths, source commentary, bookmarks, copied reading lists and 30 static topic pages.',
 flow=['Find a theme by name or study area.','Open its three source readings and anchor commentary.','Follow a related topic, save the reading, or copy the saved reading list.'],
 ui='Topic cards lead to a focused topic map/list and source-reading detail view.',
 mechanics='`library.ts` filters server-rendered cards and manages bookmarks/list copy. Topic pages are generated from the bundled topic-to-passage index.',
 storage='`bookmarks` stores explicitly saved topic IDs. No private note or learning profile is collected.',
 boundary='Themes and edges are editorial learning paths, not an exclusive canonical taxonomy or AI interpretation service.',
 regression='Check all 30 topic routes, three readings per topic, related links, filters/empty states, exact commentary anchors, saved-only views and reading-list copy.'),
'quran-escape-room': dict(
 audience='Solo learners or a group sharing one device who want a source-reading puzzle activity.',
 scope='Eight rooms with four locks each: theme choice, reference matching, mushaf ordering and excerpt recognition. Includes a source shelf, hints, solutions, completion sharing, optional timer and recovery.',
 flow=['Choose a room and read the source shelf.','Solve each of the four locks, using hints or solutions if useful.','Read the completion explanation, copy the informal result, or enter another room.'],
 ui='A four-lock progression and always-available evidence shelf distinguish the room from a generic quiz.',
 mechanics='`engine.ts` owns set equality, reference order and progress validation. `app.ts` renders the lock types, timer and assisted completion.',
 storage='`room-<room-id>` stores validated room progress, assisted locks and elapsed seconds only when recovery is enabled. The timer is optional and pauses when the document is hidden.',
 boundary='Order references in mushaf chapter/ayah order, not revelation or historical order. This is same-device play, not synchronized multiplayer; completion does not measure religious merit.',
 regression='Check every lock mechanism, wrong answers, hints/solutions, source shelf, ordering buttons, timer pause, room-specific reload recovery and assisted completion.'),
'stories-of-the-prophets': dict(
 audience='Readers exploring selected Quranic accounts through named profiles and short comprehension checks.',
 scope='25 profiles, two readings each for 50 selected passages, 25 passage-specific questions, alphabetical discovery, area/search filters, bookmarks and reading-list copy.',
 flow=['Find a profile by name or reading area.','Read its two complete passages and their source links.','Answer the reading check, revisit the cited detail, then save or open another profile.'],
 ui='An alphabetical reading shelf leads to a two-reading profile with a compact comprehension panel.',
 mechanics='`library.ts` handles discovery and bookmarks; `quiz.ts` provides reading feedback. Profile pages are built statically from `people` records.',
 storage='`bookmarks` stores explicitly saved profile IDs. Quiz answers are kept in memory and are not a personal learning record.',
 boundary='The library is selected Quran passages, not exhaustive biographies or an asserted chronology. Brief mentions stay brief; do not add disputed identities, invented dialogue, dates or portraits.',
 regression='Check all 25 profiles and 50 readings, unique question answers, briefly mentioned figures, alphabetical filters, wrong/correct feedback and bookmark recovery.'),
'places-in-the-quran': dict(
 audience='Readers connecting Quran place references to geographical context without confusing evidence with speculation.',
 scope='15 entries, five sourced city/heritage-context markers, 44 bundled Natural Earth land paths, evidence filters, uncertainty notes, bookmarks and static entry pages.',
 flow=['Explore the regional map and numbered text legend or filter the place list.','Open an entry and read its Quran passage, commentary and location evidence.','Inspect a mapped context or the reason no pin is assigned; optionally save or print the reading.'],
 ui='A local SVG land map and numbered accessible legend sit above evidence-filtered place cards.',
 mechanics='`Map.astro` renders the regional map and contextual markers at build time. `library.ts` filters the cards and manages saved entries.',
 storage='`bookmarks` stores explicitly saved place-entry IDs. The map has no geolocation requests, external tiles or live tracking.',
 boundary='Only five modern contexts have pins, using UNGEGN/UNESCO coordinates. Ten entries stay unpinned. Iram is a tribe in the cited commentary, not a claimed excavated city. Do not turn heritage coordinates into exact Quranic event sites.',
 regression='Check 15 entry routes, the five marker/legend links, coordinate attribution, unpinned entries, evidence filters, empty results and bookmarks.'),
'word-groups': dict(
 audience='Learners grouping Islamic terms into intended source-backed categories in a short word game.',
 scope='16 boards, 20 term groups, four groups of four terms per board, one-away feedback, hints, shuffle, reveal, source readings, seeded links and optional recovery.',
 flow=['Choose a board and select four tiles.','Check a group, revise a near match, or use a hint; continue until four groups are found.','Read each group’s source passages, share the board link, or choose another board.'],
 ui='A four-by-four term board gives way to named solved rows; explanations and source readings follow each solved group.',
 mechanics='`engine.ts` validates progress and matches exact groups/one-away selections. `app.ts` manages selected terms, shuffling, hints and shared seeds.',
 storage='`progress` stores the board ID, solved groups, hints, misses, seed and reveal status only if recovery is enabled.',
 boundary='Categories are intended selections, not exhaustive definitions. Preserve sixteen unique terms per board. Keep this mechanic distinct from Quran Connections’ one-theme passage quiz; no trusted leaderboard is provided.',
 regression='Check every board’s 16 unique tiles, exact and one-away matching, duplicate/foreign selections, shuffle, hints, source reveal, seeded links and reload recovery.'),
'islamic-history-timeline-challenge': dict(
 audience='Learners practicing broad event sequence using source clues and explicit date limitations.',
 scope='A prophetic-mission edition with 12 four-event packs and 14 sourced event records, move buttons, partial feedback, hints, sourced solutions, share links and optional recovery.',
 flow=['Choose a four-event challenge.','Use up/down controls to arrange earliest to latest, opening source clues when useful.','Check or reveal the order, read approximate dates and source limitations, then share or try another pack.'],
 ui='A movable vertical event list becomes a sourced answer timeline with explicit date notes.',
 mechanics='`engine.ts` validates event permutations/progress and grades positions/inversions. `app.ts` manages movement, hints, reveal and recovery.',
 storage='`progress` stores the pack, event order, check count, hint/reveal/completion flags and seed only if recovery is enabled.',
 boundary='Score broad conventional chronology, not exact calendar reconstruction. A report may support the event without establishing its CE date. The current edition covers the prophetic mission, not all Islamic history.',
 regression='Check all 12 packs, four distinct events per pack, correct/incorrect ordering, button limits and focus, earliest-event hints, source/date notes and completed-state recovery.'),
'understand-your-salah': dict(
 audience='Learners connecting selected prayer recitations with their meaning and original sources.',
 scope='15 lessons: seven Al-Fatiha ayahs and eight hadith-based recitations, hide/reveal meaning practice, reading checks, bookmarks, print and licensed local full-surah Al-Fatiha audio.',
 flow=['Choose a lesson by part of prayer or search.','Read the Arabic, recall the meaning, then reveal it; for Al-Fatiha, optionally play the whole-surah recording.','Answer a comprehension check, follow its source, and save or open the next lesson.'],
 ui='A recitation card and meaning toggle sit beside a short check. A native audio player exposes speed and repeat controls on Al-Fatiha lesson pages.',
 mechanics='`library.ts` manages filtering/bookmarks. `lesson.ts` controls meaning visibility, comprehension feedback and native audio speed/loop settings.',
 storage='`bookmarks` stores saved lesson IDs, including numeric IDs such as `fatiha-5`. Meaning visibility, answers and playback settings remain in memory.',
 boundary='This is a meaning lab, not a complete legal prayer manual. Roman guides are approximate and some cover only an opening phrase. Audio is Al-Fatiha in full, not per-ayah clips or audio for all recitations. Preserve Adeel Shaikh’s CC BY-SA 4.0 attribution and audio checksum.',
 regression='Check all 15 lessons, seven exact Quran ayahs, eight cited prayer recitations, meaning hide/reveal, answer feedback, numeric-ID bookmark recovery, audio decoding/play/pause/speed/repeat and attribution.'),
'parables-of-the-quran': dict(
 audience='Readers slowing down with Quranic comparisons through complete passages, commentary and guided reflection.',
 scope='14 readings, three selectable diagram parts each, source-attributed commentary, a second commentary for 24:35, comprehension checks, bookmarks and explicit private-note copy/download.',
 flow=['Find a comparison and read its complete Quran passage.','Select diagram parts, read the attributed commentary, and answer a detail question.','Write an optional reflection in memory, explicitly copy/download it, or save the reading.'],
 ui='Restrained Newsreader headings and three selectable reading-diagram nodes organize imagery, contrasts or sequence before reflection.',
 mechanics='`library.ts` handles discovery/bookmarks. `studio.ts` controls diagram stages, checks and local note exports. Static reading pages retain complete passages.',
 storage='`bookmarks` stores saved reading IDs. Reflection text stays in the textarea/in memory and is not automatically persisted; explicit copy/download is the keep action.',
 boundary='Diagrams are editorial aids, not complete interpretation or depictions of Allah/prophets. Keep commentary before personal reflection. Preserve both fetched commentary references for 24:35 and complete multi-ayah readings.',
 regression='Check all 14 readings, three stage controls, hidden/visible explanations, full passage ranges, both Light-verse sources, wrong/correct feedback, bookmark recovery, explicit note copy/download and note clearing on reload.')
}

def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))

def evidence():
    rows={r['app']:r for r in read_json(ROOT/'_implementation/qa/static-results.json')}
    log=(ROOT/'_implementation/qa/batch3/tests.log').read_text(encoding='utf-8')
    counts={}
    for i,slug in enumerate(ORDER):
        start=log.index(slug+': test')
        end=log.find('\n'+ORDER[i+1]+': test',start) if i+1<len(ORDER) else len(log)
        counts[slug]=int(re.search(r'^ (\d+) pass$',log[start:end],re.M)[1])
    assert sum(counts.values())==112 and sum(r['pages'] for r in rows.values())==235
    return rows,counts

def app_table(configs, rows, counts):
    return '\n'.join(['| Rank | App / project root | Port | Pages | Recorded tests |','| --- | --- | ---: | ---: | ---: |']+[f"| {i+1} | {configs[s]['name']} · `apps/{s}` | {configs[s]['port']} | {rows[s]['pages']} | {counts[s]} |" for i,s in enumerate(ORDER)])

READ_ORDER='\n'.join(f'{i+1}. `context/{name}`' for i,name in enumerate(FILES))
API_RULES='''## Documentation and API verification

- Inspect the relevant `package.json`, `bun.lock` and installed version before dependency-sensitive work. Keep current pins unless the requested task needs a change.
- Reuse matching official documentation already retrieved for the installed version. For a new or unfamiliar pattern, check the package CLI/help, then a documentation MCP such as Context7, then the official website. Resolve a library identifier before querying it when the identifier is not already verified.
- Installed types, interfaces and the checker establish what the installed package supports. Verify unfamiliar CLI flags with help instead of guessing. Read the official migration guide before a major-version migration.
- Core language built-ins do not require repetitive documentation lookups. Documentation-only edits do not require framework research when they describe inspected local files.
- If documentation is unavailable, use verified installed interfaces and existing working examples where sufficient. Do not invent an API. Record the limitation and pause only the dependent change; continue independent authorized work.
- Record the documentation URL, MCP query, CLI help command or inspected type definition when introducing a new API pattern or configuration.
'''
AGENT_TAIL='''## Scope and completion

- Work directly by default. Do not introduce a requirement to delegate or spawn agents. Respect the user's current authorization and applicable tool instructions.
- Resolve routine implementation details with the existing product constraints. Ask for clarification only when missing information materially blocks the work; record the decision in context.
- Keep the six context files synchronized with meaningful changes. Update `context/progress-tracker.md` with an Asia/Dhaka timestamp, actual validation, remaining work and material limitations.
- Do not hand-edit `node_modules/`, `.astro/`, `dist/` or release ZIP contents. Edit authoritative sources, then regenerate the affected output when needed. Do not modify dependency internals in place.
- Reuse verified source snapshots. Fetch missing Quran text/commentary through Quran MCP, preserve canonical quotations and edition attribution, and keep editorial exercises distinct from scholarly claims. Do not replace primary sources with personal blogs.
- Complete the authorized scope and report concrete changes and verification. Do not claim deployment, fresh tests or independent scholarly review that did not occur.
'''

def agent_text(title, app=False):
    intro=('This app also inherits the repository-level instructions when used inside the portfolio. Its local context is self-contained so the app folder can be copied independently.' if app else 'This repository contains fifteen independent static apps and five deferred concepts. For app work, also read that app root\'s AGENTS.md and local context; do not treat the earlier standalone HTML demos as the Astro applications.')
    return f'''# {title} agent instructions

{intro}

## Required context

At the start of work in this scope, read these files in order. Reuse them within the same working context and reread files that change.

{READ_ORDER}

If a requested change alters scope, architecture, storage or standards, update the affected context before implementing the dependent change. A documentation update is not authorization to add product features or build deferred apps.

{API_RULES}
{AGENT_TAIL}'''

def common_standards(local):
    return f'''# Code standards

## General

- Keep changes within the requested {'app' if local else 'project'} boundary. Preserve independent builds and existing source attributions.
- Prefer focused TypeScript modules and Astro pages/components. Keep pure grading/calculation logic separate from DOM rendering where the app already has an engine.
- Fix the cause of a defect; do not add dependencies or rewrite unrelated apps to implement a small feature. Existing compact files are not an instruction to create more dense, unreadable code.

## TypeScript and Astro

- The app uses Astro's strict TypeScript configuration. Use explicit interfaces or inferred data shapes; validate unknown browser/URL/storage input before trusting it.
- Keep `output: 'static'`, directory-format output and trailing slashes. Publish dynamic-looking detail routes with `getStaticPaths` at build time.
- Use Astro client scripts for browser interaction. Do not introduce server endpoints, SSR adapters, runtime external APIs, React, Tailwind or a component library without a scoped reason and user-compatible architecture decision.
- Keep every app's manifest and lockfile independent. Do not add runtime imports from another app or `_implementation`.

## Styling and accessibility

- Use the existing CSS tokens and component classes in `context/ui-context.md`. Keep dynamic-JS markup styles global or in an imported CSS file; Astro-scoped styles do not automatically cover inserted markup.
- Use native links, buttons, forms, fieldsets and details. Label inputs, preserve visible focus, provide status feedback, respect reduced motion and keep Arabic `lang="ar"` with RTL presentation.
- Escape variable text before `innerHTML`; prefer `textContent` and form-control values for user text. Never insert a visitor's query or note into unescaped HTML.

## Data and storage

- Preserve fetched Quran Arabic/translation literally. Search normalization belongs in the search index, not in displayed canonical text. Interpretive claims need retrieved commentary and attribution.
- Treat themes, fictional consequences, questions, diagrams, approximate dates and informal scores as editorial aids with the app's documented limits.
- Optional localStorage must be app-namespaced, validated, timestamped, ignored after 30 days and resilient to blocked storage. Theme preference is independent of activity opt-in. Do not add identity collection, analytics or hidden synchronization.
- All runtime fonts/media/data must be local. External source links are optional reading. Retain media/font licenses and provenance; update content checksums after a content change.

## Files and validation

- `src/pages/`: static routes and page composition. `src/layouts/`: the shared shell copy. `src/lib/`: behavior, pure logic and helpers. `src/data/`: bundled data and provenance. `src/styles/`: CSS. `public/`: local assets and hosting headers. `tests/`: meaningful Bun checks.
- Do not hand-edit generated output or third-party internals. Generators under `_implementation` are preparation tools, several of which overwrite files; inspect their scope before use.
- Run meaningful checks for behavior changes and the affected Astro check/build. For documentation-only changes, validate context completeness, paths and facts; do not rerun builds just to report activity.
- Use Bun commands from the correct app directory. Root orchestration commands are documented in `context/ai-workflow-rules.md`.
'''

def ui_text(title, accent, signature):
    light={'teal':('#087f75','#06665f','#e5f3ef','#06665e'),'blue':('#316caa','#26568a','#eaf1fb','#285c97'),'violet':('#7255a0','#5c4384','#f0ebf8','#694895')}
    dark={'teal':('#78d4c2','#9ce7d7','#203d3c','#99dfcf'),'blue':('#99c5f6','#c0ddff','#21354c','#b3d5ff'),'violet':('#c7b1ef','#dbc9fb','#342d46','#d8c5f8')}
    tokens=[('--bg','#f5f8fa','#101a24'),('--surface','#ffffff','#16232e'),('--surface-2','#eef4f5','#1c2e3a'),('--ink','#172a35','#edf4f7'),('--muted','#5c707b','#a5b7c1'),('--line','#dce6e9','#30434e'),('--accent',light[accent][0],dark[accent][0]),('--accent-hover',light[accent][1],dark[accent][1]),('--tint',light[accent][2],dark[accent][2]),('--accent-ink',light[accent][3],dark[accent][3]),('--danger','#ab353d','#ffb0b4'),('--danger-bg','#fcecee','#44272f'),('--success','#147653','#92dfb8')]
    table='\n'.join(['| CSS token | Light | Dark |','| --- | --- | --- |']+[f'| `{k}` | `{a}` | `{b}` |' for k,a,b in tokens])
    return f'''# UI context: {title}

## Theme and signature

Modern, quiet reading surfaces with light and dark modes. The first visit follows the operating system; the header toggle stores an app-local preference. Accent family: {accent}.

{signature}

## Color tokens

The actual token definitions live in the app's `src/styles/global.css`. Use these names rather than introducing a different token system.

{table}

## Typography

| Role | Local font | Existing implementation |
| --- | --- | --- |
| Interface and body | DM Sans | Root `font-family`; variable font, system sans fallback |
| Restrained editorial headings | Newsreader | `.editorial`, Georgia fallback; not every heading uses it |
| Quran and other Arabic | Amiri | `.arabic`, Arabic serif fallback, RTL and `lang="ar"` |

Fonts are in `public/fonts/` with their SIL Open Font License files. There are no `--font-sans`/`--font-mono` tokens or external font service in the current implementation.

## Radius and components

| Context | Existing rule |
| --- | --- |
| Panels | `--radius: 18px`; narrower layouts use 15px panels |
| Primary buttons | 11px radius, 45px minimum height |
| Fields | 10px radius, 44px minimum height |
| Icon buttons | 12px radius, 38px square |
| Dialogs | 20px radius with backdrop |

There is no installed component or icon library. Reuse the shell's inline SVG mark/theme icons and existing `.panel`, `.panel-body`, `.panel-head`, `.button`, `.field`, `.filters`, `.notice`, `.actions`, `.arabic`, `.source-quote`, `.empty` and `.micro` patterns.

## Layout and interaction

- Desktop content is centered, up to 1160px, with a sticky header. `.workspace` uses a flexible main column plus a 280px sidebar.
- Card grids use three columns, two below 860px and one below 580px. Narrow reading layouts stack controls and sidebars. Long app titles must wrap within the header.
- Keep footer source/privacy links and the app-scoped clear-data dialog available. Empty states explain how to recover. Inline validation/status text must be readable in both themes.
- Preserve keyboard use and semantic labels. Provide buttons for ordering and a text legend for maps; do not rely on dragging, hover or color alone.
- Motion is brief and respects `prefers-reduced-motion`. Print styles simplify surfaces and hide navigation. Native audio, if present, does not autoplay.
'''

def workflow_text(slug=None, port=None, report=None, regression=None):
    location=f'Run app commands from `apps/{slug}` while in this repository, or from this folder after copying the project.' if slug else 'Run package commands from the affected app folder. The repository root has no package.json and is not a Bun workspace.'
    return f'''# AI workflow rules

## Approach and scoping

Read the required context, inspect the current source, then complete the authorized change in a focused unit. Context describes the current implementation; the user's new instructions may change that scope. Resolve routine details with judgment and record meaningful decisions. Do not build deferred projects or change unrelated apps as a side effect.

{location}

## Development and verification

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

{f'Development and preview use http://127.0.0.1:{port}/ for this app.' if slug else 'Development/preview ports are listed in project-overview.md and DEPLOYMENT.md.'}

From the repository root, `bun _implementation/verify.ts check`, `test`, or `build` processes all fifteen apps. `--batch2` selects apps 6 through 10; `--batch3` selects apps 11 through 15. `bun _implementation/preview.ts` serves built output on ports 4321 through 4335 and is development tooling only.

Run `python _implementation/verify-static.py` after affected builds, then `python _implementation/package-release.py` when refreshing upload artifacts. The global static verifier expects all fifteen dist directories and the local research snapshot. A copied app still builds/checks/tests independently; root research tooling is optional for its normal build.

Windows note: earlier native Astro tooling failed under the sandbox. A working run used an approved execution context and `RAYON_NUM_THREADS=2`. Use ordinary execution first; seek the tool's scoped escalation only if the same environment failure occurs. Do not change machine-wide settings or invent CLI flags.

## Verification for this scope

{regression or 'Use the affected app context to select the relevant end-to-end flows. Check canonical content, routing, optional/blocked storage, both themes, narrow layouts and source attribution where changed.'}

For a behavior change, run relevant Bun tests, Astro check/build and browser verification of the changed flow. Do not add implementation-mirroring tests for reversible documentation-only edits. For this documentation setup, completeness/path/fact checks suffice. Separate recorded earlier verification from checks run in the current change.

## Source and architecture changes

- Normal builds use local content; do not put Quran API calls or keys in visitor code. The official Quran MCP endpoint is `https://mcp.quran.ai`. Follow its current grounding rules, reuse matching verified content, and fetch missing canonical text/commentary during preparation.
- Research and preparation live under `_implementation/research/` and `_implementation/`. Preserve fetched text, exact citation URLs, source editions, rights notices and checksum records. Do not run one-time scaffold/page/test generators blindly over edited app sources.
- Verify new dependency/API patterns using the hierarchy in AGENTS.md. Existing documentation evidence includes `_implementation/research/astro-docs-*.json`, `_implementation/research/batch3/astro-docs.json`, and the official Astro and Cloudflare Pages links in DEPLOYMENT.md.
- Relevant official references: https://docs.astro.build/en/guides/deploy/cloudflare/ and https://developers.cloudflare.com/pages/configuration/build-configuration/ . Check current docs before relying on changed external platform behavior.
- Keep deployable apps self-contained. Update context before a dependent architecture/storage change, then update the progress tracker after implementation.

## Protected/generated material and delivery

- Do not patch installed dependencies, generated `.astro/`/`dist/` contents or release ZIP bytes by hand. Regenerate from authoritative sources when the task requires it.
- Preserve the original `6_File+Context+Methodology/` reference template, earlier HTML demonstrations and historical QA evidence during unrelated maintenance.
- Finish with concrete files, validation and any material limits. A ZIP ready for upload is not a deployed Cloudflare project. No deployment is recorded for this portfolio.
- Keep these context files updated manually after initial setup; `_implementation/populate-context.py` refuses to overwrite them by default. Use its `--verify-only` mode to audit the sets.
'''

def write_set(base, texts):
    destinations=[base/'context'/name for name in FILES]+[base/'AGENTS.md']
    if any(p.exists() for p in destinations):raise RuntimeError(f'Refusing to overwrite existing context at {base}')
    (base/'context').mkdir(parents=True,exist_ok=True)
    for name,text in texts.items():
        path=base/'AGENTS.md' if name=='AGENTS.md' else base/'context'/name
        path.write_text(text.strip()+'\n',encoding='utf-8',newline='\n')

def populate():
    rows,counts=evidence()
    configs={s:read_json(ROOT/'apps'/s/'src/data/config.json') for s in ORDER}
    for rank,slug in enumerate(ORDER,1):
        app=ROOT/'apps'/slug;cfg=configs[slug];d=DETAILS[slug];report='IMPLEMENTATION_QA.md' if rank<=5 else 'BATCH2_QA.md' if rank<=10 else 'BATCH3_QA.md'
        data=read_json(app/'src/data/content.json');sources=read_json(app/'src/data/sources.json');provenance=read_json(app/'src/data/provenance.json')
        routes=[p.relative_to(app).as_posix() for p in sorted((app/'src/pages').rglob('*.astro'))]
        libs=[p.name for p in sorted((app/'src/lib').glob('*.ts'))]
        tests=[p.name for p in sorted((app/'tests').glob('*.test.ts'))]
        inventory='\n'.join(f'- `{k}`: {len(v)} records.' for k,v in data.items() if isinstance(v,list))
        route_lines='\n'.join('- `'+p+'`' for p in routes)
        overview=f'''# {cfg['name']}

## Overview

{cfg['description']} {d['audience']}

Portfolio rank {rank} of 20. Project root `apps/{slug}`. The app is implemented, checked and packaged; Cloudflare deployment has not been performed.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

{chr(10).join(f'{i+1}. {step}' for i,step in enumerate(d['flow']))}

## Features and content

{d['scope']}

Bundled list inventory from `src/data/content.json`:

{inventory}

The app has {len(sources)} source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

{d['boundary']}

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.
'''
        architecture=f'''# Architecture context: {cfg['name']}

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Astro 7.4.2 | Static HTML generation and client-script bundling |
| Runtime/tooling | Bun 1.4.4 | Install, dev, check, tests, build and preview |
| Language/checking | TypeScript 6.0.3; @astrojs/check 0.9.12 | Strict source and Astro template checking |
| UI | Astro, native HTML, CSS and inline SVG | App-owned accessible interface; no component framework |
| Content | Local JSON and public assets | Canonical readings, authored exercises and provenance |
| Storage | In-memory state; optional localStorage | Temporary app-local state |
| Auth/database | None | Anonymous public use |
| Hosting | Cloudflare Pages static output | Independent `dist/` deployment at its domain root |

## System boundaries

- `src/pages/` owns static routes. Route-source inventory:

{route_lines}

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: {', '.join('`'+n+'`' for n in libs)}.
- {d['mechanics']}
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains {', '.join('`'+n+'`' for n in tests)}.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `{slug}` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup reads its own lightweight preference check in Shell.astro; subsequent theme reads use the helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- {d['storage']}
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: {d['boundary']}
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port {cfg['port']}. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Collection upload archive: `release/{slug}-pages.zip`. The current recorded output has {rows[slug]['pages']} HTML pages and {rows[slug]['files']} files.

{('The checker loads a roughly 3 MB compiled local corpus on first search. Its expected Vite large-chunk warning is documented; keep full coverage and lazy loading when optimizing.' if slug=='is-it-in-the-quran' else 'App-specific content and media constraints are listed in project-overview.md and the source methodology page.')}
'''
        progress=f'''# Progress tracker: {cfg['name']}

Last updated: {STAMP}

## Current phase

Implemented and packaged. The requested AGENTS.md and six context files are populated for this app. No application behavior was changed by this documentation setup.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- {d['scope']}
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: {counts[slug]} passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: {rows[slug]['pages']} HTML pages, {rows[slug]['files']} files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `{report}`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `{provenance['retrievedAt']}`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Hosting has not been deployed.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: {d['regression']}

## Open questions

No unresolved requirement blocks this context setup. Cloudflare account/project/domain choices are still unspecified because deployment has not been requested. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- {d['boundary']}

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.
'''
        write_set(app,{'AGENTS.md':agent_text(cfg['name'],True),'project-overview.md':overview,'architecture.md':architecture,'ui-context.md':ui_text(cfg['name'],cfg['accent'],d['ui']),'code-standards.md':common_standards(True),'ai-workflow-rules.md':workflow_text(slug,cfg['port'],report,d['regression']),'progress-tracker.md':progress})

    table=app_table(configs,rows,counts)
    deferred='Islamic Civilization Timeline; Halal Business Decisions; Revelation Context Explorer; Family Islamic Learning Challenges; Islamic Misinformation Casebook.'
    root_overview=f'''# Islamic Product Lab

## Overview

A portfolio of Islamic learning tools that visitors can use immediately without accounts or personal data histories. Fifteen independent Astro/Bun static apps are implemented from the ranked twenty-app shortlist. Each is deployable at the root of a separate Cloudflare Pages project. Earlier standalone HTML demonstrations remain reference prototypes.

## Goals

1. Keep each app useful on first visit with no sign-in, backend or required saved progress.
2. Ship accessible light/dark interfaces and local runtime content/assets.
3. Preserve canonical Quran evidence, primary-source citations, rights notices and explicit editorial limits.
4. Keep app builds, verification and release packages independent and reviewable.

## Core user flow

1. Open an independently hosted app.
2. Complete its game, search, calculation or reading activity.
3. Inspect sources and explanations; optionally save temporary browser state or explicitly export/share.

## Implemented projects

{table}

## Features and scope

The collection contains games, source readers, local search and a workload model. Common features are local fonts, light/dark modes, source/privacy/404 pages, optional namespaced storage and static hosting headers. App-local project-overview.md files specify exact content and flows.

In scope: maintenance of the fifteen implemented apps and the requested context methodology. Out of scope without a new user request: accounts, databases, runtime AI/API dependencies, identity-based tracking, trusted leaderboards and automatically publishing to a hosting account.

The final five projects, ranks 16 through 20, remain deferred: {deferred}

## Success criteria

1. Each app can be copied, installed, checked, tested and built from its own folder.
2. Core behavior works without stored personal data or external runtime assets.
3. Canonical data, sources and content checksum records stay consistent.
4. Meaningful behavior changes pass relevant tests, type/build checks and browser verification.
5. Context documents identify current behavior, constraints and actual verification, with no template placeholders or invented completion claims.
'''
    root_arch='''# Repository architecture

## Stack and project model

Fifteen independent Astro 7.4.2 applications use Bun 1.4.4, TypeScript 6.0.3 and @astrojs/check 0.9.12. Every app has its own package.json, bun.lock, strict tsconfig, static Astro configuration, copied layout/styles/helpers, bundled content and public assets. The repository root is not a package workspace. There is no runtime backend, authentication service or database.

## System boundaries

| Directory/file | Responsibility |
| --- | --- |
| `apps/<slug>/` | Independent app source, tests, assets and local context |
| `_implementation/` | Bun/Python source retrieval, authored content preparation, verification and packaging helpers |
| `_implementation/research/` | Canonical snapshots, MCP/tool records, fetched commentary and media attribution |
| `_implementation/qa/` | Recorded test/build/static/browser evidence and context audit |
| `release/` | Generated static upload ZIPs and checksum manifest |
| `_build/`, `_reference/`, root HTML demos | Earlier prototype tooling, readable atlas reference and demonstrations |
| `6_File+Context+Methodology/` | Supplied generic seven-file reference template, preserved |
| `context/`, root `AGENTS.md` | Repo-wide product/architecture/UI/standards/workflow/progress contract |
| `DEPLOYMENT.md`, shortlist and QA reports | Deployment inventory, selected scope and implementation evidence |

Within each app, pages and getStaticPaths generate static routes; the shell owns metadata/navigation/theme/privacy controls; TypeScript modules own browser behavior; JSON owns content/source/provenance data; public assets remain local. A normal app build has no runtime import from research tooling or another app.

## Content and storage

- The full canonical Quran snapshot is `_implementation/research/quran-full.json`, with all 6,236 Arabic/Pickthall ayahs. Earlier `quran-snapshot.json` contains the first 225-ayah subset and 43 commentary records; it is not full corpus coverage.
- Batch-three research adds commentary anchors, full parable context and a second commentary for 24:35. Canonical text and fetched commentary are distinct from authored questions, groupings, fictional consequences and reflections.
- App content/provenance is in each `src/data/`. The checker additionally lazy-loads its local full corpus. Static verification compares canonical quotations and checks hashes.
- In-memory state is primary. Optional localStorage records use `<app-slug>:<key>` with `{at,value}` and access-time 30-day expiry. Theme is separate from activity opt-in; explicit bookmarks count as a save action. Stored bytes do not disappear automatically while a site is closed.
- Exports are visitor-triggered browser downloads/clipboard actions. Parables reflection notes remain in memory until explicitly copied/downloaded. No server history or user identity is stored.

## Access and deployment

All apps are anonymous/public. Local scores are editable by the visitor and are not trusted leaderboards. Source links are optional external reading. Each deploys its dist contents at a domain/project root with local fonts/data/media, CSP and other static headers. Set BUN_VERSION=1.4.4; use the build command and root in DEPLOYMENT.md. No account deployment has occurred.

## Invariants

1. Preserve independent app builds, static output and user-requested Cloudflare Pages compatibility.
2. Do not add accounts, database storage, live AI inference, API keys or external runtime assets by default.
3. Preserve source attribution and literal canonical quotations. No invented Quran text, scholarly certification or precise historical/geographical claims beyond evidence.
4. Keep optional browser state isolated and resilient to expiry/corruption/blocked storage.
5. Edit authoritative source; regenerate release output. Do not hand-edit vendor files, generated dist or ZIP contents.
6. Preserve the first fifteen apps and leave ranks 16 through 20 deferred until the user requests them.
'''
    root_progress=f'''# Repository progress tracker

Last updated: {STAMP}

## Current phase

Fifteen applications implemented and packaged. The requested methodology set is filled at the repository root and all fifteen app roots: sixteen sets of AGENTS.md plus six context files, 112 Markdown files total.

## Current goal

Complete the copied context methodology with accurate project-specific information while preserving app behavior and source templates.

## Completed

- Apps 1 through 5: Guess the Surah, Quran Connections, The Seerah Detective, Everyday Akhlaq and Interactive Seerah Timeline.
- Apps 6 through 10: Memorization Workload Calculator, Quran Wording Checker, Quran Concept Atlas, Knowledge Escape Room and Prophets Explorer.
- Apps 11 through 15: Quranic Places Atlas, Islamic Concept Connections, History Timeline Challenge, Understand Salah Lab and Quranic Parables Studio.
- All fifteen have separate Astro/Bun folders, local content/fonts, both themes, source/privacy pages and static Pages upload packages.
- Supplied methodology adapted to actual architecture, Bun commands, source-grounding constraints and direct autonomous workflow. Original template left intact.
- Added app-specific flows, exact content inventories, route/module ownership, storage keys, actual design tokens, source limits and verification records to each local context set.

## Verification and evidence

- Recorded implementation evidence: 112 Bun tests passing across fifteen apps and 235 static pages checked. Type/build/browser details are in IMPLEMENTATION_QA.md, BATCH2_QA.md and BATCH3_QA.md. These are existing recorded results, not fresh functional runs for this documentation edit.
- Documentation audit checks all sixteen sets, file completeness, placeholder removal, exact app config/content inventories, route references, manifest versions, link targets, and preservation of existing source/template/release bytes. Result: `_implementation/qa/context-docs-audit.json`.
- No runtime source, package manifest, lockfile, source snapshot, generated site or upload ZIP is changed by this documentation setup.

## In progress

No app feature implementation is in progress. Cloudflare hosting has not been deployed.

## Next up

Maintain contexts during future requested work. The five deferred projects remain: {deferred}

## Open questions

None block this context setup. The user has not selected a Cloudflare account/project/domain for actual deployment. No independent scholarly certification is recorded.

## Architecture decisions

- Each app is its own Astro static project rather than a shared runtime or backend.
- Bun runs tools; ordinary app builds use prepared local content and no Quran credentials.
- Quran MCP prepares and verifies source material. Primary named reports/geography datasets and explicit media licenses support app-specific content.
- Optional timestamped localStorage keeps anonymous use possible; no user-specific server data is introduced.
- A repository contract plus local app contexts preserves shared rules and the individual apps' actual constraints. Utility/generated/dependency subdirectories inherit the root guidance rather than receiving duplicate project context sets.

## Session notes

Read the six root files in the order in AGENTS.md, then the local app context for app work. Keep updates manual after initial population; the generator refuses existing destinations. Re-audit with `python _implementation/populate-context.py --verify-only`. Use Asia/Dhaka timestamps and distinguish current checks from historical evidence. Do not infer that the context setup authorizes building the deferred apps or publishing an external site.
'''
    write_set(ROOT,{'AGENTS.md':agent_text('Islamic Product Lab'),'project-overview.md':root_overview,'architecture.md':root_arch,'ui-context.md':ui_text('portfolio defaults','teal','Use the app-specific signature described in each local UI context. Blue and violet apps override the accent family in their own CSS; copied helpers/styles are maintained per app, not through cross-app runtime imports. Blue light/dark accents are #316caa/#99c5f6; violet accents are #7255a0/#c7b1ef.'),'code-standards.md':common_standards(False),'ai-workflow-rules.md':workflow_text(),'progress-tracker.md':root_progress})

def baseline():
    result={}
    # Prune dependencies/caches before traversal; include generated sites and research.
    for base in [ROOT/'apps',ROOT/'release',ROOT/'6_File+Context+Methodology',ROOT/'_implementation/research']:
        for directory,dirs,files in os.walk(base):
            dirs[:]=[d for d in dirs if d not in ['node_modules','.astro'] and not (base.name=='apps' and d=='context')]
            for name in files:
                p=Path(directory)/name
                if name=='AGENTS.md' and base.name=='apps':continue
                result[p.relative_to(ROOT).as_posix()]=hashlib.sha256(p.read_bytes()).hexdigest()
    for p in ROOT.iterdir():
        if p.is_file():result[p.relative_to(ROOT).as_posix()]=hashlib.sha256(p.read_bytes()).hexdigest()
    return result

def verify():
    rows,counts=evidence();sets=[]
    placeholder=re.compile(r'\[(?:Project Name|One paragraph|Goal one|Goal two|Goal three|Step one|Step two|Step three|Feature |What you|e\.g\.|Condition |Rule |Invariant |folder|Font|Layer|Concern|hex|size)[^\]]*\]',re.I)
    for base in [ROOT]+[ROOT/'apps'/s for s in ORDER]:
        paths=[base/'AGENTS.md']+[base/'context'/f for f in FILES]
        assert all(p.is_file() for p in paths),base
        for p in paths:
            text=p.read_text(encoding='utf-8');assert len(text)>300,p
            assert not placeholder.search(text),f'Unfilled placeholder: {p}'
            assert 'npm run build' not in text and 'Next.js' not in text and 'shadcn' not in text,p
            for target in re.findall(r'`((?:context|_implementation|release|apps)/[^`]+)`',text):
                if '<' in target or ' ' in target:continue
                if target=='_implementation/qa/context-docs-audit.json':continue
                parent=base if target.startswith('context/') else ROOT
                assert list(parent.glob(target)) if '*' in target else (parent/target).exists(),f'Missing path {target} in {p}'
        agent=paths[0].read_text(encoding='utf-8');assert all('context/'+name in agent for name in FILES)
        if base!=ROOT:
            slug=base.name;cfg=read_json(base/'src/data/config.json');package=read_json(base/'package.json')
            overview=(base/'context/project-overview.md').read_text(encoding='utf-8');architecture=(base/'context/architecture.md').read_text(encoding='utf-8');progress=(base/'context/progress-tracker.md').read_text(encoding='utf-8');ui=(base/'context/ui-context.md').read_text(encoding='utf-8')
            assert cfg['name'] in overview and slug in architecture and str(cfg['port']) in architecture
            for version in [package['dependencies']['astro'],package['devDependencies']['typescript'],package['devDependencies']['@astrojs/check']]:assert version in architecture
            for route in (base/'src/pages').rglob('*.astro'):assert route.relative_to(base).as_posix() in architecture
            data=read_json(base/'src/data/content.json')
            for key,value in data.items():
                if isinstance(value,list):assert f'`{key}`: {len(value)} records.' in overview
            assert f'{counts[slug]} passing' in progress and f'{rows[slug]["pages"]} HTML pages' in progress
            assert f'Accent family: {cfg["accent"]}' in ui
            assert package['packageManager']=='bun@1.4.4'
            assert str(cfg['port']) in package['scripts']['dev'] and str(cfg['port']) in package['scripts']['preview']
            css=(base/'src/styles/global.css').read_text(encoding='utf-8').lower()
            for token,light,dark in re.findall(r'\| `(--[a-z-]+)` \| `(#[a-f0-9]+)` \| `(#[a-f0-9]+)` \|',ui):
                for value in [light,dark]:
                    options=[value]+(['#fff'] if value=='#ffffff' else [])
                    assert any(re.search(re.escape(token)+r'\s*:\s*'+re.escape(option)+r'(?=[;}\s])',css) for option in options),f'CSS token mismatch {slug} {token} {value}'
        sets.append(dict(root='.' if base==ROOT else base.relative_to(ROOT).as_posix(),files=len(paths),placeholders=False))
    before=ROOT/'_implementation/qa/context-docs-baseline.json'
    changes=[]
    for name,digest in read_json(before).items():
        p=ROOT/name
        if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:changes.append(name)
    assert not changes,changes
    result=dict(verifiedAt=STAMP,sets=sets,projectRoots=len(sets),markdownFiles=sum(s['files'] for s in sets),recordedTests=sum(counts.values()),recordedStaticPages=sum(r['pages'] for r in rows.values()),applicationTemplateReleaseFilesUnchanged=True,preservedFilesChecked=len(read_json(before)),scope='Repository root plus fifteen independent app roots; utility/generated folders inherit root instructions.')
    (ROOT/'_implementation/qa/context-docs-audit.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='sets'},indent=2))

if __name__=='__main__':
    if '--verify-only' in sys.argv and (ROOT/'_implementation/verify-context.py').exists():
        import runpy
        runpy.run_path(str(ROOT/'_implementation/verify-context.py'),run_name='__main__')
        sys.exit(0)
    if '--verify-only' not in sys.argv:
        destinations=[ROOT]+[ROOT/'apps'/s for s in ORDER]
        assert all(not (p/'AGENTS.md').exists() and not (p/'context').exists() for p in destinations),'Existing project context must be edited manually, not overwritten.'
        (ROOT/'_implementation/qa/context-docs-baseline.json').write_text(json.dumps(baseline(),indent=2)+'\n',encoding='utf-8')
        populate()
    verify()
