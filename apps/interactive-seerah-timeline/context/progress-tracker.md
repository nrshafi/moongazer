# Progress tracker: Seerah Timeline

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase

Implemented, E2E tested and packaged. The latest complete-portfolio audit and source corrections are recorded below. Published at https://interactive-seerah-timeline.moongazer.tech/. Current production checks are recorded below.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- 36 event records, era/topic filters, text search, date and source limitations, bookmarks, print support and individual static event pages.
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: 5 passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: 40 HTML pages, 53 files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `IMPLEMENTATION_QA.md`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `2026-10-27T16:07:54.644Z`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Published at https://interactive-seerah-timeline.moongazer.tech/. Current production checks are recorded below.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: Check all 36 event routes, search, combined filters, empty results, selection, bookmarks, uncertainty notes and print behavior.

## Open questions

No unresolved requirement blocks this context setup. Hosting projects and domains are recorded in the repository deployment inventory. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- Date bands are approximate navigation aids. A report supporting an event does not necessarily establish its displayed CE year. Do not erase disputed placement notes.

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.

## Portfolio workflow update

The final five shortlist projects are now implemented. Collection verification/preview covers all twenty apps, with `--batch4` selecting apps 16 through 20. All twenty pass 157 tests and the static verifier checks 325 pages. Workflow references in this app were updated; this app’s runtime source, assets and build output remain unchanged. Use `python _implementation/verify-context.py` for current context validation. Earlier evidence above remains a record of this app’s initial implementation.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 8 Bun tests, Astro checks and a production build. Browser coverage: Event selection, next/back, filters, bookmark recovery, sharing and detail route. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:22+06:00 Asia/Dhaka. Published at https://interactive-seerah-timeline.moongazer.tech/ in project moongazer-interactive-seerah-timeline. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P1.16 no "connected" promise

Verified 2026-11-11T12:24:24+06:00 Asia/Dhaka (06:24:24 UTC). Copy-only change: the app no longer promises "connected" events. Replaced the directory card description in repository deployment/targets.json (now: "Follow key events from the life of the Prophet Muhammad ﷺ in order, each with its source."), the hero paragraph in src/pages/index.astro ("compare events in order" instead of "notice the connections"), and in src/data/learning.json the summary ("pairs ... with source reports", "Dates and sequence are reading aids") and guide step 3 ("Compare moments in order ..."). Titles, names, event data and runtime logic are unchanged. Source-quote wording in content.json (a historical report describing Waraqa connecting the experience with earlier revelation) was left as the report's own description. Homepage copy was checked and needed no change for this app beyond the directory card.
Checks run: bun run check (0 errors, 0 warnings, 0 hints); bun test (8 pass, 0 fail); bun run build (40 pages built); node homepage/build.mjs regenerated homepage/dist; bun test _implementation/seo.test.ts (9 pass, 0 fail). grep for connected events in the built outputs shows no promise of connected events. Limitations: no browser check of the rendered copy was run. The Is This Actually in the Quran? app source was also changed, its dist is not rebuilt here.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics

Name Seerah Timeline (already in config); heading, title and descriptor aligned: title 'Seerah Timeline — The Prophet's life ﷺ from 610 to 632 | Moongazer'. Moments became events; Find a moment -> Search; No moments match -> Nothing matches; internal links use the arrow. Honorifics added in four content.json fields; timeline.ts wraps innerHTML text with withHonorifics. content.json changed; appContentSha256 bafd02d9... -> dfbfe0ef.... Checks: bun run check 0 errors; bun test 8 pass 0 fail; bun run build 40 pages; dist grep clean.

## 2026-11-11 (Asia/Dhaka) — P3 T3.4 Which came first?

Added the /challenge/ page (eyebrow "Seerah game", pack picker, four cards with up/down buttons, per-card "Open source clue", "Check order", status feedback, and after solving or revealing the correct order with dates and links to each event page). Engine ported to src/lib/challenge.ts, page script src/lib/challenge-app.ts, styles src/styles/challenge.css. content.json gained 12 `packs` of timeline event ids; all 14 challenge events matched existing timeline ids (mapping in architecture.md), no events added. Pack titles rewritten to describe their events without disclosing order. config.json description and seo.json title/description now mention the game; the home page has a notice linking to /challenge/. Storage key `challenge-progress` (old `progress` shape). Import rule from islamic-history-timeline-challenge: progress -> challenge-progress, old validator, merge keep (src/lib/merge-import.ts, tests/merge-import.test.ts). content.json appContentSha256 dfbfe0ef... -> 7a0447c1e8b8a6041ca97b7ce2c8b551e4d9ff33fccccd8b6ad95aba24416a15.
Checks: bun run check 0 errors, 0 warnings, 0 hints; bun test 23 pass, 0 fail (new challenge.test.ts, merge-import.test.ts); bun test _implementation/seo.test.ts 9 pass. bun run build in this app FAILS with "Add metadata for the new page: /challenge/" because seo.ts cannot register an extra page (seo.ts is shared and was not edited). A scratch copy with a one-line seo.ts patch built 41 pages, produced dist/challenge/index.html with title "Which came first? | Seerah Timeline", a sitemap entry and the home link. Required seo.ts change: after the `pages` object (before `export const seoPages`) add `for (const extra of (profile as {extraPages?: SeoPage[]}).extraPages ?? []) pages[extra.path] = extra;` (metadata is already in seo.json `extraPages`).
Limitations: no browser run of the game; pointer drag is not implemented; the app dist/ is partial from the failed build until seo.ts is extended and the app is rebuilt.
