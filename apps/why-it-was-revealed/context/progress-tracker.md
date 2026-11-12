# Progress: Why It Was Revealed

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase and goal

Implemented, verified and packaged. Maintain this independent app within future user requests. Published at https://revelation-context-explorer.moongazer.tech/. Current production checks are recorded below.

## Completed

Choose a passage or report category. Read the complete selected ayahs, the narrator-attributed report summary, what it establishes and its explicit limitations. Compare a relationship classification, follow two exact commentary links, then save or print a dossier.

Added the app’s source/privacy/404 pages, local assets, both themes, optional validated state, clear-data and print behavior. Filled AGENTS.md and all six context files from the actual implementation. Print preparation opens closed evidence/facilitator details and restores their earlier state after printing.

## Verification evidence

- 9 app tests passing. All 20 apps pass 157 tests in `_implementation/qa/batch4/tests.log`.
- Fresh final-batch Astro checks have zero errors, warnings or hints; production builds pass. Logs: `check-final.log` and `build.log` in repository `_implementation/qa/batch4/`.
- 14 HTML pages and 29 files checked by the static verifier. The collection has 325 verified static pages with canonical text, content checksums, local links and no external runtime assets.
- Browser checks cover the complete activity sample, all new detail/source/privacy routes, catalog empty/reset states, desktop/mobile themes and saved recovery where present. Evidence and verification limits are in repository `BATCH4_QA.md` and `_implementation/qa/batch4/`.
- Regression fixes included correct saved-reading-list serialization, explicit form-reset handling, initial-theme timestamp validation and printable collapsed details.

## In progress and next up

No feature work remains in this implementation batch. Hosting projects and domains are recorded in repository DEPLOYMENT.md. Maintain context with later behavior or content changes.

## Open questions and limits

No requirement blocks completion. No independent scholarly certification is recorded. Actual printer output and live Cloudflare deployment are not part of the completed verification.

## Decisions and source evidence

Ten readings include seven transmitted occasions, one general-context record and two responses after revelation. A response must not be relabeled as a cause. Narrator and date uncertainty remain visible. Collection attribution is not independent chain grading. Al-Muyassar notes and full Arabic Ibn Kathir links do not create an invented scholarly consensus.

Quran MCP fetched Al-Muyassar, full Arabic Ibn Kathir for report context, and Al-Qurtubi for further business discussion. Matching canonical text and earlier specifically identified reports are reused. Institutional history uses UNESCO and the Met. Context7 query `/withastro/docs` verified static routes and client scripts; Cloudflare documentation MCP verified static Astro needs no server adapter. Direct report HTML requests encountered HTTP 403; the web reader retrieved the same primary source pages and the evidence is archived in `research/batch4/` at repository level.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 12 Bun tests, Astro checks and a production build. Browser coverage: Wrong/correct report classification, second commentary, filters and bookmark recovery. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:36+06:00 Asia/Dhaka. Published at https://revelation-context-explorer.moongazer.tech/ in project moongazer-revelation-context-explorer. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics

Renamed to Why It Was Revealed (config, seo, learning heading, home page, context, favicon label). SEO title shortened to 'Why It Was Revealed — Asbab al-nuzul reports | Moongazer'. Interface words: Choose a reading, Copy my list, Save, Search, Nothing matches, Print this reading; relationship labels are now 'A reported occasion / General context / What happened after' (stored kind values, assessment.ts and the test updated together, so no display map was needed). Honorifics: plain glyph added to the Prophet in the raised-voices title and teaching note. content.json changed; appContentSha256 a4529eab... -> 8fa3d848.... Checks: bun run check 0 errors; bun test 13 pass 0 fail; bun run build 14 pages; dist grep for old names and retired phrases finds only hostnames.

## 2026-11-11 23:30 (Asia/Dhaka) - P4.7 event wiring

Wired `track` from `src/lib/counter.ts` (activity_started on the first relationship answer, activity_completed on the first submitted check, share_clicked with id home) and added the "Report an error" link under the check result. Hook points are in `context/architecture.md`. Shared files, counter.ts and the shell are unchanged.

Checks: `bun install --frozen-lockfile`, `bun run check` (0 errors, 0 warnings, 0 hints), `bun run test` and `bun run build` in this app.

Limitations: no browser or DOM run with a stubbed `navigator.sendBeacon`; once-per-event behaviour was checked by reading the code. The preview-host guard comes from the existing counter helper and its tests.

## 2026-11-12 06:08 (Asia/Dhaka) — P3B docs refresh after the host move

Nothing changed: AGENTS.md and the five context docs already match the current names, hosts and D2c state.
