"""Fill final-batch contexts and update the portfolio inventory after validation."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import json,re
ROOT=Path(__file__).resolve().parent.parent
SLUGS=['islamic-civilization-timeline','halal-business-decisions','revelation-context-explorer','family-islamic-learning-challenges','islamic-misinformation-casebook']
stamp=datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=6))).isoformat(timespec='seconds')+' Asia/Dhaka'
rows={row['app']:row for row in json.loads((ROOT/'_implementation/qa/static-results.json').read_text(encoding='utf-8'))}
log=(ROOT/'_implementation/qa/batch4/tests.log').read_text(encoding='utf-8')
tests={name:int(re.search(r'\n (\d+) pass\n',part).group(1)) for name,part in re.findall(r'\n([a-z0-9-]+): test\n(.*?)(?=\n[a-z0-9-]+: test\n|\nAll 20 apps passed test\.)',log,re.S)}
assert len(tests)==20 and sum(tests.values())==157
assert len(rows)==20 and sum(row['pages'] for row in rows.values())==325
SPECIAL={
 SLUGS[0]:('events','event','Browse chronological records using topic, region, search and inclusive date-band overlap filters. Compare two records and copy the comparison link; open an event to see its precision note and institutional source. Save bookmarks or copy a saved reading list.','`engine.ts` compares valid integer date bands symmetrically. `timeline.ts` handles comparison controls and seeded URL parameters `a`/`b`. `catalog.ts` owns normalized multiword filtering; `library.ts` owns filters, saved readings and clear reset behavior. `Map.astro` displays bundled Natural Earth land geometry.','`bookmarks` stores explicitly saved event IDs. Comparisons and filters stay in memory; copied comparison links contain the two public record IDs.','Twenty-four records span 661 to 1648 CE across nine regions. Century ranges are inclusive editorial filtering bands, not exact event durations. Overlap is not proof of contact, influence or causation. The map gives orientation without borders or exact event markers. No Quran text is used to support a later historical date.'),
 SLUGS[1]:('cases','case','Choose a fictional business dilemma. Read the known facts, make one of three first decisions and one of two follow-up decisions, and inspect each consequence in the ledger. Return to the full Quran reading and named reports. Restart or copy a citation-rich summary.','`engine.ts` validates versioned two-stage trails, appends bounded choices and derives the ledger without mutating earlier state. `decision.ts` renders stage progression, source review, opt-in recovery and copy output. `catalog.ts`/`library.ts` own discovery and bookmarks.','`bookmarks` stores explicitly saved cases. `remember` stores the recovery preference; `case-<id>` stores `{version:1,choices:number[]}` only after opt-in. Unchecking clears that case’s recovery. Restart clears the case trail.','Twelve cases have six complete paths each, 72 paths total. Choices and consequences are fictional applied reasoning, not transaction certification, predicted rewards, personalized financial advice or a scholarly ruling from quran.ai, quran.com or quran.foundation. Full passages, original paraphrases and modern applications remain distinct.'),
 SLUGS[2]:('readings','reading','Choose a passage or report category. Read the complete selected ayahs, the narrator-attributed report summary, what it establishes and its explicit limitations. Compare a relationship classification, follow two exact commentary links, then save or print a dossier.','`assessment.ts` defines three valid relationship labels and bounded grading. `reading.ts` handles wrong/correct feedback without changing source text. `catalog.ts`/`library.ts` manage discovery and known-ID bookmarks. Detail routes render the report, reliability note and both commentary citations statically.','`bookmarks` stores explicitly saved reading IDs. Quiz selections and feedback remain in memory; no learning record or religious assessment is persisted.','Ten readings include seven transmitted occasions, one general-context record and two responses after revelation. A response must not be relabeled as a cause. Narrator and date uncertainty remain visible. Collection attribution is not independent chain grading. Al-Muyassar notes and full Arabic Ibn Kathir links do not create an invented scholarly consensus.'),
 SLUGS[3]:('packs','pack','Select one of twelve packs by topic, suggested age or search. Read a source, try the three-option reading check and retry if needed. Discuss the open prompt, try a shared activity or choose to pass. Optionally remember the sitting, print all prompts and the facilitator’s answer, or share completion without participant details.','`engine.ts` validates versioned sessions, question bounds and prefix-complete steps. `session.ts` manages retries, locked correct answers, sequential discussion/activity completion, opt-in recovery, restart and anonymous sharing. `catalog.ts`/`library.ts` manage the pack shelf and bookmarks.','`bookmarks` stores explicitly saved packs. `remember` is the recovery preference; `session-<id>` stores `{version:1,answer:number|null,checked:boolean,done:boolean[]}` only after opt-in. There are no names, participant age fields, child profiles, private notes or ongoing behavior histories.','Twelve packs contain 36 activities in total: a reading check, open discussion and shared activity per pack. Suggested age bands are 5–7, 8–11 and 12+, with 10–15 minute editorial estimates. Pickthall’s historical wording may need an adult’s explanation. Open discussions have no single graded answer and anyone may pass.'),
 SLUGS[4]:('cases','case','Choose a fixed claim exercise. Read the precise claim and source reading, open two evidence cards, select a bounded conclusion and reveal the correction with its limit. Retry, save the case, print the evidence or copy a correction that keeps the citations and limit attached.','`assessment.ts` accepts only the three defined conclusion labels and reports validity/correctness separately. `investigate.ts` handles evidence counters, feedback, conclusion reveal/retry and parsed citation-rich copy output. `catalog.ts`/`library.ts` manage discovery and bookmarks.','`bookmarks` stores explicitly saved case IDs. Evidence panels, attempted answers and revealed conclusions stay in memory. The app accepts no freeform visitor claim or identity.','Twelve constructed reading claims are fixed evidence exercises, not measured viral trends or accusations against real people. The three findings are contradicted by the cited text, needs context, and beyond the cited evidence. Omission from one report does not prove absence from every other source. Sharing preserves this limit.'),
}

for rank,slug in enumerate(SLUGS,16):
 app=ROOT/'apps'/slug;cfg=json.loads((app/'src/data/config.json').read_text(encoding='utf-8'));data=json.loads((app/'src/data/content.json').read_text(encoding='utf-8'));key,route,flow,modules,storage,boundary=SPECIAL[slug]
 inventory='\n'.join(f'- `{name}`: {len(value)} records.' for name,value in data.items() if isinstance(value,list))
 routes='\n'.join('- `'+path.relative_to(app).as_posix()+'`' for path in sorted((app/'src/pages').rglob('*.astro')))
 libraries=', '.join('`'+p.name+'`' for p in sorted((app/'src/lib').glob('*.ts')))
 sources=json.loads((app/'src/data/sources.json').read_text(encoding='utf-8'))
 (app/'context/project-overview.md').write_text(f'''# {cfg['name']}

## Overview

{cfg['description']} Portfolio rank {rank} of 20, independent project `apps/{slug}`. Implemented and packaged for static Cloudflare Pages hosting; no account publication has occurred.

## Goals and visitor flow

{flow}

Keep the complete activity usable immediately without an account, personal history, paid inference or a live API. All runtime content/fonts and interactions are local. Explicit bookmarks and temporary recovery are optional.

## Features and content

{inventory}

There are {len(sources)} exact source-list entries, {rows[slug]['pages']} generated HTML pages, source/privacy/404 routes, print controls, both themes and a clear-data dialog. The app has its own manifest, lockfile, fonts and license files.

## Scope and limits

{boundary}

{data['methodology']}

Accounts, databases, user identity, external runtime assets, synchronized multiplayer and automatic publication are outside this implementation.

## Success criteria

Core flows work with empty or blocked storage. Activity logic, source integrity and route links pass verification. Both themes fit desktop and mobile widths with keyboard/native controls. `bun run check`, `bun test` and `bun run build` succeed independently. The release archive contains static files at its root.
''',encoding='utf-8')
 (app/'context/architecture.md').write_text(f'''# Architecture: {cfg['name']}

## Stack

Astro 7.4.2, TypeScript 6.0.3, @astrojs/check 0.9.12 and Bun 1.4.4. Static output, directory-format routes and trailing slashes. Native Astro/HTML/CSS and browser TypeScript; no React, Tailwind, server adapter, authentication or database.

## System boundaries

`src/layouts/Shell.astro` owns document metadata, theme bootstrap, navigation, footer and storage dialog. `src/lib/shell.ts` manages the theme toggle, app-scoped clear-data and print preparation/restoration. `utils.ts` owns namespaced storage, escaping, copying and accessible announcements.

{modules}

Current library inventory: {libraries}.

`src/components/Filters.astro` owns labeled catalog controls. `Passage.astro` renders an optional complete Quran passage; `References.astro` renders named reports and exact commentary links. `src/data/config.json` owns display metadata, accent and port; `content.json`, `sources.json` and `provenance.json` separate activity content, references and checksums. `public/` owns local fonts, favicon, robots and security headers.

Route-source inventory:

{routes}

Detail pages use getStaticPaths and local JSON. No app imports another app or repository preparation code at runtime.

## State and privacy

{storage}

All storage keys have prefix `{slug}:` and timestamp envelopes with `at` and `value`. Helpers validate shapes, reject timestamps more than 60 seconds ahead, ignore records at least 30 days old and catch blocked storage. Theme is separate from activity opt-in; the initial bootstrap validates its timestamp and theme value too. Expiry is checked on access; stored bytes do not auto-delete while the site is closed. Clear-data removes only this app namespace and reloads.

## Deployment and invariants

Port {cfg['port']}. Build `bun install --frozen-lockfile && bun run build`, output `dist`, environment `BUN_VERSION=1.4.4`. Serve at its own Pages project/domain root; absolute asset paths require an explicit migration for subpath hosting. No adapter, Functions, bindings, secrets or runtime service is needed. Archive `release/{slug}-pages.zip` contains {rows[slug]['files']} files and {rows[slug]['pages']} HTML pages.

Preserve literal canonical text, edition attribution, source limits, independent builds, accessible interactions and app namespace isolation. {boundary}

Research and QA live in repository `_implementation/research/batch4/` and `_implementation/qa/batch4/`. `tests/activity.test.ts` checks behavior/content constraints; `tests/storage.test.ts` checks expiry, corruption, blocked storage and isolation. Normal app builds need none of the research tools.
''',encoding='utf-8')
 (app/'context/progress-tracker.md').write_text(f'''# Progress: {cfg['name']}

Last updated: {stamp}

## Current phase and goal

Implemented, verified and packaged. Maintain this independent app within future user requests. No hosting account deployment has occurred.

## Completed

{flow}

Added the app’s source/privacy/404 pages, local assets, both themes, optional validated state, clear-data and print behavior. Filled AGENTS.md and all six context files from the actual implementation. Print preparation opens closed evidence/facilitator details and restores their earlier state after printing.

## Verification evidence

- {tests[slug]} app tests passing. All 20 apps pass 157 tests in `_implementation/qa/batch4/tests.log`.
- Fresh final-batch Astro checks have zero errors, warnings or hints; production builds pass. Logs: `check-final.log` and `build.log` in repository `_implementation/qa/batch4/`.
- {rows[slug]['pages']} HTML pages and {rows[slug]['files']} files checked by the static verifier. The collection has 325 verified static pages with canonical text, content checksums, local links and no external runtime assets.
- Browser checks cover the complete activity sample, all new detail/source/privacy routes, catalog empty/reset states, desktop/mobile themes and saved recovery where present. Evidence and verification limits are in repository `BATCH4_QA.md` and `_implementation/qa/batch4/`.
- Regression fixes included correct saved-reading-list serialization, explicit form-reset handling, initial-theme timestamp validation and printable collapsed details.

## In progress and next up

No feature work remains in this implementation batch. Choose hosting projects/domains when publication is requested. Maintain context with later behavior or content changes.

## Open questions and limits

No requirement blocks completion. No independent scholarly certification is recorded. Actual printer output and live Cloudflare deployment are not part of the completed verification.

## Decisions and source evidence

{boundary}

Quran MCP fetched Al-Muyassar, full Arabic Ibn Kathir for report context, and Al-Qurtubi for further business discussion. Matching canonical text and earlier specifically identified reports are reused. Institutional history uses UNESCO and the Met. Context7 query `/withastro/docs` verified static routes and client scripts; Cloudflare documentation MCP verified static Astro needs no server adapter. Direct report HTML requests encountered HTTP 403; the web reader retrieved the same primary source pages and the evidence is archived in `research/batch4/` at repository level.
''',encoding='utf-8')
 # Keep the local UI description tied to the actual shared tokens and signature.
 p=app/'context/ui-context.md';text=p.read_text(encoding='utf-8');text+='\n## Activity-specific patterns\n\nUse `.dossier` for paired source and limit panels, `.evidence-card` for native details, `.choice` for branching responses, `.stage-track` for actual stages and `.timeline-record` for dated records. These live in global.css so dynamically inserted markup receives them. Reset catalog controls explicitly before filtering. Closed source details open during print and restore afterward.\n';p.write_text(text,encoding='utf-8')

# Update common workflow references without rewriting earlier app histories.
for base in [ROOT]+[p for p in sorted((ROOT/'apps').iterdir()) if (p/'package.json').exists()]:
 p=base/'context/ai-workflow-rules.md';text=p.read_text(encoding='utf-8')
 text=text.replace('all fifteen apps','all twenty apps').replace('all fifteen dist directories','all twenty dist directories').replace('ports 4321 through 4335','ports 4321 through 4340')
 text=text.replace('`--batch3` selects apps 11 through 15.','`--batch3` selects apps 11 through 15; `--batch4` selects apps 16 through 20.')
 text=text.replace('Do not build deferred projects or change unrelated apps as a side effect.','Do not add projects beyond the current user request or change unrelated apps as a side effect.')
 text=text.replace('For this documentation setup, completeness/path/fact checks suffice.','For documentation-only changes, completeness/path/fact checks suffice.')
 text=text.replace('Use its `--verify-only` mode to audit the sets.','Use `python _implementation/verify-context.py` at repository level to audit current context sets. The older generator’s `--verify-only` mode forwards to that audit.')
 text=text.replace('Existing documentation evidence includes','Final-batch documentation evidence includes `_implementation/research/batch4/astro-docs.json`. Earlier evidence includes')
 p.write_text(text,encoding='utf-8')
 p=base/'AGENTS.md';text=p.read_text(encoding='utf-8').replace(' or build deferred apps','')
 if base==ROOT:text=text.replace('This repository contains fifteen independent static apps and five deferred concepts.','This repository contains twenty independent static apps from the completed shortlist.')
 p.write_text(text,encoding='utf-8')

p=ROOT/'context/project-overview.md';text=p.read_text(encoding='utf-8').replace('Fifteen independent Astro/Bun static apps are implemented','Twenty independent Astro/Bun static apps are implemented').replace('maintenance of the fifteen implemented apps','maintenance of the twenty implemented apps')
text=text.replace('The user has now authorized ranks 16 through 20. This batch builds Islamic Civilization Timeline, Halal Business Decisions, Revelation Context Explorer, Family Islamic Learning Challenges, and Islamic Misinformation Casebook as five more independent Astro/Bun static apps. Each receives its own AGENTS.md and six filled context documents. Hosting publication remains outside this implementation request.','All twenty shortlisted projects are implemented. Each app has AGENTS.md and six filled context documents. Hosting publication remains outside this implementation request.')
marker='\n\n## Features and scope'
newrows='\n'.join(f'| {rank} | {json.loads((ROOT/"apps"/slug/"src/data/config.json").read_text(encoding="utf-8"))["name"]} · `apps/{slug}` | {4336+rank-16} | {rows[slug]["pages"]} | {tests[slug]} |' for rank,slug in enumerate(SLUGS,16))
text=text.replace(marker,'\n'+newrows+marker);p.write_text(text,encoding='utf-8')
p=ROOT/'context/architecture.md';text=p.read_text(encoding='utf-8').replace('Fifteen independent Astro','Twenty independent Astro').replace('Preserve the first fifteen apps while adding the authorized ranks 16 through 20 as independent static projects.','Preserve all twenty apps as independent static projects.')
text=text.replace('## Authorized final batch','## Final implementation batch')
text+='\nBatch four adds 24 institutional-source history records, 12 fictional business cases, 10 report-context readings, 12 family packs and 12 fixed evidence-reading claims. Canonical text stays local and exact; source notes retain uncertainty. All twenty app builds remain independent.\n';p.write_text(text,encoding='utf-8')
p=ROOT/'context/progress-tracker.md';p.write_text(f'''# Repository progress tracker

Last updated: {stamp}

## Current phase and goal

All twenty shortlisted applications are implemented, verified and packaged. Maintain the portfolio and its filled context methodology within future user requests. No Cloudflare account deployment has occurred.

## Completed

- Apps 1–15 retain their independent Astro/Bun implementations and runtime source unchanged during this batch.
- Apps 16–20 are Islamic Civilization Timeline, Halal Business Decisions, Revelation Context Explorer, Family Islamic Learning Challenges and Islamic Misinformation Casebook.
- Added 24 institutional-source history records, 12 two-stage business cases, 10 context readings, 12 three-part family packs and 12 evidence-reading cases. Each app includes light/dark modes, source/privacy/404 pages, local fonts and optional validated browser state.
- AGENTS.md plus six filled context files exist at the repository root and every app root, 147 files across 21 sets. Original methodology templates remain unchanged.
- Updated portfolio verification/preview tools, deployment inventory, shortlist, source records and upload packages.

## Verification and evidence

- 157 tests pass across all twenty apps in `_implementation/qa/batch4/tests.log`.
- The five new apps pass fresh Astro checks with zero errors/warnings/hints and production builds. Logs are in `_implementation/qa/batch4/`.
- Static verification covers 325 HTML pages across twenty apps, including canonical quotations, checksums, local references and absence of external runtime assets.
- Browser evidence covers all 70 new detail pages plus ten source/privacy pages, core activities, reset/empty states, recovery, bookmarks, and both themes at desktop/mobile widths. See `BATCH4_QA.md` and browser JSON/screenshots in the batch-four QA directory.
- Release ZIPs are CRC-checked and have SHA-256 records in `release/manifest.json`. Each contains static site files at the archive root.
- Current context verification: `_implementation/qa/context-docs-audit.json`. Initial methodology-only baseline/audit remains historical evidence, not a prohibition on authorized future code changes.

## In progress and next up

No implementation remains from the twenty-app shortlist. Hosting account/project/domain choices belong to a future publication request. Maintain sources, provenance and context with later changes.

## Open questions and material limits

No unresolved requirement blocks completion. No live hosting deployment or independent scholarly certification is claimed. Actual printer output was not tested; print preparation and styles are implemented and inspected.

## Architecture and source decisions

Each app remains a separate Astro 7.4.2/Bun 1.4.4 static project with TypeScript 6.0.3 and @astrojs/check 0.9.12. Normal builds use prepared local content. No account, database, runtime API, secret, shared backend or external font service is introduced.

Official Quran MCP provides canonical Arabic/Pickthall evidence and fetched commentary. Full Arabic Ibn Kathir supports further report-context reading; Al-Qurtubi provides further business discussion. UNESCO and the Metropolitan Museum of Art support later historical records; Natural Earth supplies local land geometry. Modern activities and fixed reading claims remain explicitly editorial. Direct HTML retrieval failures were resolved using the web reader for the same primary/institutional pages, with saved evidence.

## Session notes

Read the six context files in AGENTS.md order, then the affected app’s local context. Use `python _implementation/verify-context.py` for current context checks. The initial population scripts are historical one-time tools and must not overwrite hand-maintained files. Use `--batch4` for final-batch check/test/build or preview; unfiltered verification covers all twenty apps. Keep Asia/Dhaka timestamps and report actual verification. Packaged output is not a deployed site.
''',encoding='utf-8')
print('Updated five local context sets and the twenty-app repository inventory.')
