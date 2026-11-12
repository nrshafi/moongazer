# Progress tracker: Guess the Surah

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase

Implemented, E2E tested and packaged. The latest complete-portfolio audit and source corrections are recorded below. Published at https://guess-the-surah.moongazer.tech/. Current production checks are recorded below.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- All 114 surahs with exact opening-ayah evidence, four progressive clues, filtered rounds, seeded links, scoring, results and optional recovery.
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: 9 passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: 4 HTML pages, 17 files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `IMPLEMENTATION_QA.md`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `2026-10-27T16:07:54.644Z`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Published at https://guess-the-surah.moongazer.tech/. Current production checks are recorded below.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: Verify all 114 chapters, unique answer choices, filtered answer pools, deterministic seeds, wrong answers, clue scoring, results and reload recovery.

## Open questions

No unresolved requirement blocks this context setup. Hosting projects and domains are recorded in the repository deployment inventory. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- Do not describe editorial clues or client-side scores as scholarly assessment. Keep Arabic opening text and fetched chapter metadata intact.

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.

## Portfolio workflow update

The final five shortlist projects are now implemented. Collection verification/preview covers all twenty apps, with `--batch4` selecting apps 16 through 20. All twenty pass 157 tests and the static verifier checks 325 pages. Workflow references in this app were updated; this app’s runtime source, assets and build output remain unchanged. Use `python _implementation/verify-context.py` for current context validation. Earlier evidence above remains a record of this app’s initial implementation.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 12 Bun tests, Astro checks and a production build. Browser coverage: Five-question mixed-result round, four clues, scoring, challenge link, recovery and restart. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:22+06:00 Asia/Dhaka. Published at https://guess-the-surah.moongazer.tech/ in project moongazer-guess-the-surah. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P1.14 clues, answer list and button labels

- Hero pill now reads "51 short surahs"; the default pool (`short`, 30 ayahs or fewer) was confirmed as 51 surahs in code and a test asserts it.
- Clue 1 no longer always uses ayah 1. New `clueAyahs`/`clueVerse` in `src/lib/engine.ts` start every surah at ayah 1 and move surahs whose normalized English or Arabic clue text collides with another surah's clue to the next ayah (higher ayah number moves first). Surahs now using a later ayah: ayah 2 for 2, 3, 29, 30, 31, 32, 40, 41, 42, 59, 61; ayah 3 for 26, 28, 43, 44, 45, 46 (their ayah 2 is also shared: 26/28 and 43/44, and 45:2 equals 39:1 and 46:2). Clue 1 label and source line say "An early ayah"/"ayah N", and the citation link uses the real ref.
- `src/data/content.json` gained 23 verse records (2:2, 3:2, 26:2-3, 28:2-3, 29:2, 30:2, 31:2, 32:2, 40:2, 41:2, 42:2, 43:2-3, 44:2-3, 45:2-3, 46:2-3, 59:2, 61:2) copied unchanged from `_implementation/research/quran-full.json` (verified equal to the source records; existing records untouched; CRLF endings preserved). `appContentSha256` in `src/data/provenance.json` updated to 988cbe847d825a9b2846b7004bb9a730e44074bc671a7de7a346be92aab930cd. The provenance `requests` list and `verseCount` still describe the original opening-ayah fetch.
- The full surah reference list is a `<details>` closed by default below the game, summary "Surah list (contains answers)"; dist/index.html shows no `open` attribute.
- Answer buttons: option letter in its own span, a real space, then the English name, a real space, and the Arabic name in `<small lang="ar" dir="rtl">`.
- Tests added: short pool size 51 and hero text, expected ayah-2/3 surah list, and no shared normalized clue-1 English/Arabic text in any of the four pools.
- Checks (app folder): `bun run check` 0 errors/0 warnings/0 hints; `bun test` 15 pass, 0 fail; `bun run build` 4 pages built. `_implementation/verify-static.py` was not run (needs every app's dist). SEO/learning copy still says "opening ayah" generally and was left unchanged.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics
- Name unchanged (Guess the Surah). config description = "Find the surah from its clues"; seo title "Guess the Surah — Find the surah from its clues | Moongazer" (59 chars), new description; learning heading now exactly "Guess the Surah"; related names updated (Ayah Threads, Quran Escape Room); eyebrow/intro reworded.
- Interface words: "Makkan/Madinan classification" pool options -> "Revealed in Makkah/Madinah"; "Listen with your eyes" -> "The Arabic"; structure clue now "lists it as revealed in Makkah/Madinah".
- Honorifics: no editorial mention of the Prophet or other prophets in this app (only the surah name Muhammad). No content.json change (hash unchanged 60f44c4d...).
- Checks: `bun run check` 0 errors/0 warnings; `bun test` 15 pass, 0 fail; `bun run build` 4 pages; dist grep for retired phrases: none.

## P4.7 counter hook points (11 Nov 2026, Asia/Dhaka 23:30)
- Wired `track()` in the activity code and documented the hook points in `context/architecture.md`; no unit test (wiring only, helper already tested). Checks: `bun run check` 0 errors, 0 warnings; `bun run test` 23 pass, 0 fail; `bun run build` 4 pages. Not run: e2e preview and a live beacon. Deployment not performed.

## 2026-11-12 06:08 (Asia/Dhaka) — P3B docs refresh after the host move

Nothing changed: AGENTS.md and the five context docs already match the current names, hosts and D2c state.
