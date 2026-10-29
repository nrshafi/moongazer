# Progress tracker: Quranic Parables Studio

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase

Implemented, E2E tested and packaged. The latest complete-portfolio audit and source corrections are recorded below. Published at https://quranic-parables-studio.moongazer.tech/. Current production checks are recorded below.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- 14 readings, three selectable diagram parts each, source-attributed commentary, a second commentary for 24:35, comprehension checks, bookmarks and explicit private-note copy/download.
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: 8 passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: 18 HTML pages, 33 files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `BATCH3_QA.md`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `2026-10-27T17:21:30.283Z`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Published at https://quranic-parables-studio.moongazer.tech/. Current production checks are recorded below.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: Check all 14 readings, three stage controls, hidden/visible explanations, full passage ranges, both Light-verse sources, wrong/correct feedback, bookmark recovery, explicit note copy/download and note clearing on reload.

## Open questions

No unresolved requirement blocks this context setup. Hosting projects and domains are recorded in the repository deployment inventory. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- Diagrams are editorial aids, not complete interpretation or depictions of Allah/prophets. Keep commentary before personal reflection. Preserve both fetched commentary references for 24:35 and complete multi-ayah readings.

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.

## Portfolio workflow update

The final five shortlist projects are now implemented. Collection verification/preview covers all twenty apps, with `--batch4` selecting apps 16 through 20. All twenty pass 157 tests and the static verifier checks 325 pages. Workflow references in this app were updated; this app’s runtime source, assets and build output remain unchanged. Use `python _implementation/verify-context.py` for current context validation. Earlier evidence above remains a record of this app’s initial implementation.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 11 Bun tests, Astro checks and a production build. Browser coverage: Diagram stages, retry, reflection copy/download, bookmark recovery and unsaved-note loss on reload. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:31+06:00 Asia/Dhaka. Published at https://quranic-parables-studio.moongazer.tech/ in project moongazer-quranic-parables-studio. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.
