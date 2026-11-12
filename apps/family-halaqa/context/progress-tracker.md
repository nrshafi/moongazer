# Progress: Family Halaqa

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase and goal

Implemented, verified and packaged. Maintain this independent app within future user requests. Published at https://family-islamic-learning-challenges.moongazer.tech/. Current production checks are recorded below.

## Completed

Select one of twelve packs by topic, suggested age or search. Read a source, try the three-option reading check and retry if needed. Discuss the open prompt, try a shared activity or choose to pass. Optionally remember the sitting, print all prompts and the facilitator’s answer, or share completion without participant details.

Added the app’s source/privacy/404 pages, local assets, both themes, optional validated state, clear-data and print behavior. Filled AGENTS.md and all six context files from the actual implementation. Print preparation opens closed evidence/facilitator details and restores their earlier state after printing.

## Verification evidence

- 9 app tests passing. All 20 apps pass 157 tests in `_implementation/qa/batch4/tests.log`.
- Fresh final-batch Astro checks have zero errors, warnings or hints; production builds pass. Logs: `check-final.log` and `build.log` in repository `_implementation/qa/batch4/`.
- 16 HTML pages and 31 files checked by the static verifier. The collection has 325 verified static pages with canonical text, content checksums, local links and no external runtime assets.
- Browser checks cover the complete activity sample, all new detail/source/privacy routes, catalog empty/reset states, desktop/mobile themes and saved recovery where present. Evidence and verification limits are in repository `BATCH4_QA.md` and `_implementation/qa/batch4/`.
- Regression fixes included correct saved-reading-list serialization, explicit form-reset handling, initial-theme timestamp validation and printable collapsed details.

## In progress and next up

No feature work remains in this implementation batch. Hosting projects and domains are recorded in repository DEPLOYMENT.md. Maintain context with later behavior or content changes.

## Open questions and limits

No requirement blocks completion. No independent scholarly certification is recorded. Actual printer output and live Cloudflare deployment are not part of the completed verification.

## Decisions and source evidence

Twelve packs contain 36 activities in total: a reading check, open discussion and shared activity per pack. Suggested age bands are 5–7, 8–11 and 12+, with 10–15 minute editorial estimates. Pickthall’s historical wording may need an adult’s explanation. Open discussions have no single graded answer and anyone may pass.

Quran MCP fetched Al-Muyassar, full Arabic Ibn Kathir for report context, and Al-Qurtubi for further business discussion. Matching canonical text and earlier specifically identified reports are reused. Institutional history uses UNESCO and the Met. Context7 query `/withastro/docs` verified static routes and client scripts; Cloudflare documentation MCP verified static Astro needs no server adapter. Direct report HTML requests encountered HTTP 403; the web reader retrieved the same primary source pages and the evidence is archived in `research/batch4/` at repository level.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 12 Bun tests, Astro checks and a production build. Browser coverage: Reading retry, three completed steps, recovery, completion share, filters and bookmarks. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:22+06:00 Asia/Dhaka. Published at https://family-islamic-learning-challenges.moongazer.tech/ in project moongazer-family-islamic-learning-challenges. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics

Family Islamic Learning Challenges -> Family Halaqa. Title shortened to "Family Halaqa — Ten-minute Islamic family activities | Moongazer" (64 chars). Interface words: "Choose a record" -> "Choose a pack", "Copy saved reading list" -> "Copy my list", "Save for later" -> "Save", "Find an entry" -> "Search", "No entries match" -> "No packs match", "entries shown" -> "packs shown". Related name "The Islamic Knowledge Escape Room" -> "Quran Escape Room". content.json unchanged; no Prophet mentions in editorial text. Honorifics recorded in architecture.md. Checks: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 12 pass / 0 fail (185 expects); `bun run build` 16 pages built. `grep -rli` of dist for the old names and retired phrases finds nothing in the app pages.

## 2026-11-11 (Asia/Dhaka) — P4.7 counter events and error-report link

Wired the three anonymous counter events in the pack session: activity started on the first answer, first step button or facilitator-answer reveal; activity completed once when all three steps are done; share on "Copy pack link", all keyed by the pack id. Compact "Report an error" link added after the reading-question status. Hook points recorded in `context/architecture.md`. Not verified: a browser run that confirms each beacon fires once. Checks: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 23 pass / 0 fail (includes new `tests/events.test.ts`, source-level); `bun run build` 16 pages built.

## 2026-11-12 06:08 (Asia/Dhaka) — P3B docs refresh after the host move

Nothing changed: AGENTS.md and the five context docs already match the current names, hosts and D2c state.

## 2026-11-12 (Asia/Dhaka, 14:02) — P5 wave D: Family Halaqa Hearth first screen, drawer, session end, print, motif

Done: compact hero and library layout, `HowItWorks` drawer on the library and pack pages, end-of-session block, `public/motif.svg`, Projector on both pages, "Print saved packs" on the library page (one print view of all saved packs), "Print this pack" kept. Verify_Me #55: cards show reference and "Read, talk, try".

Removed duplicates: the evidence band ("About 10-15 minutes", "Everyone may pass", "Print or use one shared screen") and the age-band note moved into the drawer; the pack hero line about minutes, shared screen and pass is now in the drawer; the completion paragraph's limit ("not a judgment of anyone's learning or character") now sits in the session-end result. No limit was deleted. Design note: "Reading check: [n] of 3" was not implemented because the pack records one reading question, not a count; the result says "Reading check answered".

First control (`#filter`) top: 300 px at 390 × 844 and 375 × 812, light and dark. `bun run check` 0 errors; `bun run test` 21 pass (events test updated: share now comes from the shared block); `bun run build` ok. Browser: no horizontal scroll or script errors at 390, 375 and 1440, light and dark; saved two packs and the print view held both (window.print stubbed); finished a pack and the session-end block appeared, share text has no answer. Not verified: counter events (production hosts only), real paper print preview.

## 2026-11-12 18:28 (Asia/Dhaka) — C16: 30-night Ramadan series (data only)

Added 30 packs to `src/data/content.json` in three batches (C16.01 nights 1-10, C16.02 nights 11-20, C16.03 nights 21-30). Each has `series: "ramadan"` and `night` 1-30 beside the existing fields; ages are 10 each of 5-7, 8-11 and 12+. Passages (Arabic and Pickthall) are copied by script from `_implementation/research/quran-full.json`. Teaching and explanation attribute Al-Muyassar (`ar-muyassar`), plus the abridged English Ibn Kathir for night 28; hadith go in `sources` as collection and number, paraphrased, opened on sunnah.com. `appContentSha256` updated (LF-normalised). Research records: `_implementation/research/depth/family-halaqa/batch-01.json` to `batch-03.json`.

Validation run: `bun run check` 0 errors, 0 warnings, 0 hints; `bun run test` 26 pass (new `tests/ramadan-series.test.ts`: nights 1-30 once each, every age band at least 8 times, passages equal the snapshot; the general-pack count test now counts packs without a series); `bun run build` 46 pages; `audit-text-joins.py` 0 unexplained joins. `verify-static.py` was not run (it needs a dist for every app); the same passage comparison runs in the new test.

Not done: no second-pass verification (separate run) and no owner spot-check yet; no scholarly review is claimed. The library lists all 42 packs together; a Ramadan list or filter and a `?night=N` deep link are a pending code task, and the topic filter now shows many more topics.


## 2026-11-12 23:15 (Asia/Dhaka) — C16.04: verification fixes

Second pass failed 16 Ramadan packs (14/30 passed): spoiler titles, teaching that stated the answer, night 9 discussion, night 19 honorific. All fixed in `content.json`; `appContentSha256` updated; `followUp` added to each fixed pack in the `batch-0N.verification.json` files (`result` untouched). New test: no title shares a 4+ letter content word with the correct option. `bun run check` 0 errors; `bun run test` 26 pass; `bun run build` 46 pages. Not yet re-verified by a second run.

## 2026-11-12 (Asia/Dhaka) — C16.05: re-check fixes

Re-check (a73dc37) failed six packs. Retitled nights 6 (Two short verses), 11 (Good company), 14 (Respecting others), 16 (Responding to harm), 17 (A shared prayer); reworded teaching for nights 11 and 17 (checked against Al-Muyassar 9:119 and 2:127) and added the honorific after Adam on night 22. The title test now stems words and uses small related-word groups, and includes cases that fail for the old titles. `followUp` in the six verification records is now a list (C16.04 then C16.05); `recheck` untouched. Hash updated.
