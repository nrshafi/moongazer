# Deploy the twenty Astro apps

All twenty shortlisted projects are independent static applications. Existing standalone HTML demos remain available as earlier prototypes.

| App | Project root | Local port | Included content |
| --- | --- | --- | --- |
| Guess the Surah | `apps/guess-the-surah` | 4321 | All 114 surahs, four progressive clues, filtered rounds, seeded challenges, scores, results, optional recovery |
| Quran Connections | `apps/quran-connections` | 4322 | 30 sourced passage puzzles, hints, retries, Arabic display, explanations, and sharing |
| The Seerah Detective | `apps/the-seerah-detective` | 4323 | 12 investigations, three evidence cards each, conclusions, hints, source reports, optional recovery |
| Everyday Akhlaq Simulator | `apps/everyday-akhlaq-simulator` | 4324 | 20 fictional two-decision scenarios, response-specific consequences, reflections, source notes, optional recovery |
| Interactive Seerah Timeline | `apps/interactive-seerah-timeline` | 4325 | 36 event records, period and topic filters, search, source and date notes, bookmarks, print and event pages |
| Quran Memorization Workload Calculator | `apps/quran-memorization-workload-calculator` | 4326 | Time-budget model, growing revision load, feasibility checks, study-day schedule, full CSV, first-90-session calendar export |
| Is This Actually in the Quran? | `apps/is-this-actually-in-the-quran` | 4327 | All 6,236 Arabic and Pickthall ayahs, local wording search, reference ranges, chapter filters, citations and fragment-based sharing |
| Quran Concept Atlas | `apps/quran-concept-atlas` | 4328 | 30 themes, 90 selected readings, connected topic paths, filters, bookmarks, exported reading lists, 30 static topic pages |
| The Islamic Knowledge Escape Room | `apps/islamic-knowledge-escape-room` | 4329 | Eight rooms, four lock types per room, source shelf, hints and solutions, optional timer and recovery |
| Stories of the Prophets Explorer | `apps/stories-of-the-prophets-explorer` | 4330 | 25 profiles, 50 Quran readings, 25 passage-specific questions, filters, bookmarks and reading-list export |
| Quranic Places Atlas | `apps/quranic-places-atlas` | 4331 | 15 entries, five contextual markers, local Natural Earth map, location evidence notes, filters and bookmarks |
| Islamic Concept Connections | `apps/islamic-concept-connections` | 4332 | 16 grouping puzzles, 20 source-backed categories, hints, retries, seeded links, optional recovery |
| Islamic History Timeline Challenge | `apps/islamic-history-timeline-challenge` | 4333 | 12 four-event challenges, 14 event records, accessible ordering, source clues, date notes and recovery |
| Understand Salah Lab | `apps/understand-salah-lab` | 4334 | 15 meaning lessons, 7 canonical Al-Fatiha ayahs, 8 hadith recitations, local licensed full-surah audio, practice and checks |
| Quranic Parables Studio | `apps/quranic-parables-studio` | 4335 | 14 readings, interactive three-part diagrams, commentary, comprehension, private note copy/download and bookmarks |
| Islamic Civilization Timeline | `apps/islamic-civilization-timeline` | 4336 | 24 institutional-source records, nine regions, local land map, date/topic filters, comparison and bookmarks |
| Halal Business Decisions | `apps/halal-business-decisions` | 4337 | 12 fictional two-stage dilemmas, 72 paths, decision ledgers, source readings and optional recovery |
| Revelation Context Explorer | `apps/revelation-context-explorer` | 4338 | 10 report-context readings, relationship checks, narrator/reliability limits, two commentaries and bookmarks |
| Family Islamic Learning Challenges | `apps/family-islamic-learning-challenges` | 4339 | 12 single-sitting packs, 36 activities, age/topic filters, print worksheets and optional sitting recovery |
| Islamic Misinformation Casebook | `apps/islamic-misinformation-casebook` | 4340 | 12 fixed reading claims, 24 evidence cards, bounded conclusions, source-rich sharing and bookmarks |

All twenty include responsive light and dark themes, local fonts, keyboard focus states, source methodology, privacy controls, and custom 404 pages. They run without accounts, server storage, runtime APIs, analytics, or external font services. Persistent activity data is optional; records expire when read after 30 days. Every app root contains AGENTS.md and six filled context files for future work.

## Upload an already-built app

These ZIP archives contain the production static files at the archive root, ready for a separate Cloudflare Pages Direct Upload project:

- [Guess the Surah upload](release/guess-the-surah-pages.zip)
- [Quran Connections upload](release/quran-connections-pages.zip)
- [The Seerah Detective upload](release/the-seerah-detective-pages.zip)
- [Everyday Akhlaq upload](release/everyday-akhlaq-simulator-pages.zip)
- [Seerah Timeline upload](release/interactive-seerah-timeline-pages.zip)
- [Memorization Calculator upload](release/quran-memorization-workload-calculator-pages.zip)
- [Quran Wording Checker upload](release/is-this-actually-in-the-quran-pages.zip)
- [Quran Concept Atlas upload](release/quran-concept-atlas-pages.zip)
- [Knowledge Escape Room upload](release/islamic-knowledge-escape-room-pages.zip)
- [Prophets Explorer upload](release/stories-of-the-prophets-explorer-pages.zip)
- [Quranic Places Atlas upload](release/quranic-places-atlas-pages.zip)
- [Islamic Concept Connections upload](release/islamic-concept-connections-pages.zip)
- [History Timeline Challenge upload](release/islamic-history-timeline-challenge-pages.zip)
- [Understand Salah Lab upload](release/understand-salah-lab-pages.zip)
- [Quranic Parables Studio upload](release/quranic-parables-studio-pages.zip)
- [Islamic Civilization Timeline upload](release/islamic-civilization-timeline-pages.zip)
- [Halal Business Decisions upload](release/halal-business-decisions-pages.zip)
- [Revelation Context Explorer upload](release/revelation-context-explorer-pages.zip)
- [Family Learning Challenges upload](release/family-islamic-learning-challenges-pages.zip)
- [Misinformation Casebook upload](release/islamic-misinformation-casebook-pages.zip)

Create a Pages project and upload one archive. Each app is intended to be deployed at the root of its own Pages project or custom domain. Repeat for the other apps. No deployment has been made to your Cloudflare account as part of this implementation.

The same files are available in each app's `dist/` directory. Upload the **contents** of `dist`, including `_astro`, `fonts`, and `_headers`. Do not upload `node_modules`, research files, or the entire source folder as the static site.

Cloudflare documents [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) and [static HTML hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## Build through Git integration

Use a separate Pages project for each app. Select its project root from the table above.

| Setting | Value |
| --- | --- |
| Build command | `bun install --frozen-lockfile && bun run build` |
| Build output directory | `dist` |
| Environment variable | `BUN_VERSION=1.4.4` |
| Framework output | Astro static |
| Server adapter | None |
| Secrets and service bindings | None |

Dependencies are pinned to Astro 7.4.2, TypeScript 6.0.3, and Astro Check 0.9.12. The scripts explicitly run Astro with Bun. TypeScript 6 is intentional because the installed Astro checker rejects TypeScript 7. Source and lockfiles are included in each app folder. See Cloudflare's [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) and [build environment](https://developers.cloudflare.com/pages/configuration/build-image/) for current build settings.

## Develop one app

Open a terminal in the relevant app folder:

```powershell
bun install --frozen-lockfile
bun run dev
```

Verify and build with:

```powershell
bun run check
bun test
bun run build
bun run preview
```

Each app is self-contained and can be copied to another folder or repository. Normal builds use bundled content and need no Quran credentials or live source requests.

## Verify or preview the collection

From the workspace root:

```powershell
bun _implementation/verify.ts check
bun _implementation/verify.ts test
bun _implementation/verify.ts build
python _implementation/verify-static.py
bun _implementation/preview.ts
```

The preview command serves the twenty built sites on the ports listed above. Add `--batch4` to serve only ports 4336–4340. Stop it with Ctrl+C. Its local server is development tooling and is not deployed. Validate the filled context sets with `python _implementation/verify-context.py`.

## Content provenance

Quran text, Pickthall translation, all 114 chapter records, and commentary anchors were actually retrieved from [Quran Foundation's official public MCP](https://mcp.quran.ai) using Streamable HTTP. The development client reads the grounding rules, acknowledges the nonce, handles rate limits and continuation tokens, and records requests in a provenance manifest. Retrieval is a preparation step, not a browser runtime dependency.

The first batch snapshot contains 225 ayahs and 43 Al-Tafsir al-Muyassar commentary records. The complete snapshot added in batch two contains all 6,236 ayahs in Arabic and Pickthall English. Batch three adds 40 commentary anchors, full parable context, and Al-Jalalayn for 24:35. Each app includes its own content checksum and links only the sources relevant to its activities. Arabic and translation text are checked against the snapshot. Full modern commentary and modern English hadith translations are not republished. Historical summaries refer to specific Sahih al-Bukhari and Sahih Muslim entries on Sunnah.com. No personal blogs are used.

The sources page distinguishes exact source text, editorial themes, fictional applications, and approximate historical dates. The applications do not claim independent scholarly certification.

The `_implementation` folder contains retrieval scripts, original activity content, preparation helpers, and verification artifacts. Keep that folder private to the source workspace; it is unnecessary for hosting. Design notes are in [_implementation/DESIGN.md](_implementation/DESIGN.md), and results are in [IMPLEMENTATION_QA.md](IMPLEMENTATION_QA.md).

## Updating content

Edit the original activity records in `_implementation/content.py` or `_implementation/history.py`, then prepare and package content again. If new Quran references are added, retrieve the corresponding canonical material before packaging. Do not write Arabic verses or translations from memory. Read the returned grounding rules if the provider changes them.

The scaffold script was a one-time setup utility and overwrites common app files. It is not a normal build or update command. Edit the individual app source files directly for UI or behavior changes.

## Second implementation batch

Apps 6–10 use the same independent build arrangement. The quotation checker loads its complete local corpus on first search, as a static JavaScript chunk of about 3 MB before hosting compression. This chunk is expected to trigger Vite’s generic 500 kB warning; it is below Pages’ 25 MiB asset limit. There are no runtime external API calls.

The official Quran MCP snapshot is `_implementation/research/quran-full.json`; its request and checksum record is `batch2-provenance.json`. Every Arabic/English passage is checked against it by `verify-static.py`, including all 6,236 checker records. Topic and escape-room commentary references reuse the first batch’s retrieved Al-Tafsir al-Muyassar anchors. Story titles and comprehension checks are editorial aids grounded in the selected text; they do not add a full biography or claim scholarly certification.

For batch two only, use `bun _implementation/verify.ts check --batch2`, `test --batch2`, or `build --batch2`. Without a batch flag, verification covers all twenty apps. The batch-two scaffold/page/test generators were one-time preparation tools; edit app sources and tests directly. `batch2-data.py` regenerates content/provenance from the verified full snapshot and the curated question records. After any source change, rebuild and repackage. See [BATCH2_QA.md](BATCH2_QA.md) for verification and screenshots.

## Third implementation batch

Apps 11–15 were completed on 28 October 2026. Normal builds use only local assets. New source preparation used the official Quran MCP for commentary and existing canonical Arabic/English, UNGEGN and UNESCO for contextual coordinates, Natural Earth for public-domain land geometry, and named Sahih reports for prayer recitations and historical event summaries.

The Salah app bundles an approximately 50-second Al-Fatiha recording by Adeel Shaikh under CC BY-SA 4.0, downloaded as Wikimedia’s MP3 transcode. Attribution and the license link are beside the player, on the Sources page, and in `public/audio/ATTRIBUTION.txt`. It plays the whole surah. Other recitations are text lessons. The recording retains its own license independently of MIT application code.

The history game is explicitly a prophetic-mission edition, not an exhaustive history library. Broad conventional chronology is scored; date/source limitations are shown in each solution. Places markers show city/heritage context, not a claim to have geolocated a Quranic scene. Ten place entries remain unpinned rather than receiving invented coordinates.

For batch three use `bun _implementation/verify.ts check --batch3`, `test --batch3`, or `build --batch3`. Without a batch flag, verification covers all twenty apps. `--batch2` is limited to apps 6–10 and `--batch3` to apps 11–15. `python _implementation/verify-static.py` validates every built app. `python _implementation/package-release.py` packages all built apps and writes CRC-checked archive hashes.

New source preparation and design decisions are in `_implementation/batch3-*.py`, `fetch-batch3*.ts`, `research/batch3/`, and `DESIGN_BATCH3.md`. Scaffold/page/test generators were one-time preparation tools. Edit app sources and tests directly. Source data generators can regenerate their own bundles from the verified snapshot; rebuild and repackage after any change. See [BATCH3_QA.md](BATCH3_QA.md) for evidence.

## Fourth implementation batch

Apps 16–20 were completed on 28 October 2026. They use the same pinned stack and independent deployment arrangement. Their sources include new official Quran MCP commentary, matching canonical text, named Sahih reports, UNESCO, the Metropolitan Museum of Art and bundled Natural Earth geometry. Source preparation is separate from normal builds.

Use `bun _implementation/verify.ts check --batch4`, `test --batch4` or `build --batch4` for this batch. There are 90 new pages, bringing the portfolio to 325 verified static pages. All twenty apps pass 157 tests; final-batch Astro checks and builds pass. See [BATCH4_QA.md](BATCH4_QA.md) for source evidence, browser checks, screenshots and verification limits.

The civilization comparison preserves broad date bands and does not infer contact from overlap. Business cases are fictional applied reasoning, not certification of a real transaction. Revelation readings distinguish reported occasions, general context and responses after revelation. Family packs collect no child identities or profiles. The casebook is a fixed evidence-reading bank rather than a live arbitrary-claim checker. These limits are stated in the apps and local context sets.

All twenty shortlist projects are now implemented. No hosting account publication has been performed.

## Complete-portfolio E2E audit

The newer [E2E_QA.md](E2E_QA.md) supersedes the implementation-batch counts for current verification. All twenty apps pass 217 Bun tests, Astro checks and production builds. Browser journeys cover normal and blocked storage, phone layouts, both themes, recovery, sharing, exports, native audio and every generated page. Three discovered behavior defects were repaired and retested. Release archives were regenerated from those builds.

For production-header HTTP verification, run `bun _implementation/e2e-preview.ts` and then `python _implementation/e2e-http.py`. The QA preview uses isolated ports 5321–5340. Browser fixtures and reusable CUA journeys are development-only; see `_implementation/qa/e2e/README.md`. They are absent from the upload archives.
