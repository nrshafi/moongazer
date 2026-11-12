# Progress tracker: Understand Your Salah

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase

Implemented, E2E tested and packaged. The latest complete-portfolio audit and source corrections are recorded below. Published at https://understand-salah-lab.moongazer.tech/. Current production checks are recorded below.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- 15 lessons: seven Al-Fatiha ayahs and eight hadith-based recitations, hide/reveal meaning practice, reading checks, bookmarks, print and licensed local full-surah Al-Fatiha audio.
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: 8 passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: 19 HTML pages, 36 files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `BATCH3_QA.md`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `2026-10-27T17:21:30.283Z`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Published at https://understand-salah-lab.moongazer.tech/. Current production checks are recorded below.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: Check all 15 lessons, seven exact Quran ayahs, eight cited prayer recitations, meaning hide/reveal, answer feedback, numeric-ID bookmark recovery, audio decoding/play/pause/speed/repeat and attribution.

## Open questions

No unresolved requirement blocks this context setup. Hosting projects and domains are recorded in the repository deployment inventory. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- This is a meaning lab, not a complete legal prayer manual. Roman guides are approximate and some cover only an opening phrase. Audio is Al-Fatiha in full, not per-ayah clips or audio for all recitations. Preserve Adeel Shaikh’s CC BY-SA 4.0 attribution and audio checksum.

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.

## Portfolio workflow update

The final five shortlist projects are now implemented. Collection verification/preview covers all twenty apps, with `--batch4` selecting apps 16 through 20. All twenty pass 157 tests and the static verifier checks 325 pages. Workflow references in this app were updated; this app’s runtime source, assets and build output remain unchanged. Use `python _implementation/verify-context.py` for current context validation. Earlier evidence above remains a record of this app’s initial implementation.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 11 Bun tests, Astro checks and a production build. Browser coverage: Meaning hide/reveal, retry, numeric bookmark, speed/loop, audio metadata and actual play/pause. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:36+06:00 Asia/Dhaka. Published at https://understand-salah-lab.moongazer.tech/ in project moongazer-understand-salah-lab. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P1.15 recall before reveal; honest audio label

Lesson pages now open with the meaning hidden and a "Show meaning" toggle (`aria-expanded="false"`). The hiding is CSS keyed to `:root[data-theme]`, which the head bootstrap always sets, so without JavaScript the meaning stays visible and the toggle stays hidden; print always shows it. The seven Al-Fatiha cards say "Full-surah audio" instead of "Audio available". Offline audio (D18 #18): checked by code inspection only — `#recitation` has an `error` listener that unhides "Audio could not load…", and the page has no spinner element; a browser offline test is part of the P1 phase verification. Checks: `bun run check` 0 errors, `bun test` 11 pass, `bun run build` complete.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics

Understand Salah Lab -> Understand Your Salah. Title shortened to "Understand Your Salah — Salah words and meanings | Moongazer" (60 chars). Interface words: "Save reading" -> "Save", "Copy saved lesson list" -> "Copy my list", "Find a recitation" -> "Search", "A meaning lab" -> "About these lessons". content.json: quiz question for the tashahhud lesson now reads "Muhammad ﷺ" and the methodology sentence says "guide to meanings" instead of "meaning lab"; quoted wordings untouched. appContentSha256 changed from c7d3523a6b85668a0caa3b480b84ef23e262c99a9438fbf13574f2a84ee458f1 to 8e749e1252b49b8e9cf61b1ae385fe7c38e6c678a5d667f29dd6672017c13a0e. Open issue: the shared src/lib/seo.ts still hard-codes "Understand Salah Lab" in the lesson-page meta description (shared file, not edited here). Honorifics recorded in architecture.md. Checks: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 11 pass / 0 fail (117 expects); `bun run build` 19 pages built. `grep -rli` of dist for the old names and retired phrases finds nothing in the app pages except the lesson-page meta description from shared seo.ts.

## 2026-11-11 (Asia/Dhaka) — P4.7 counter events and error-report link

Wired the three anonymous counter events through the shared `track()` helper: activity started on "Show meaning" or the first quiz answer, activity completed on the first quiz answer per page, share on "Copy my list" (id `home`, after a non-empty copy). Quiz status id changed to `quiz-feedback` so the footer `#feedback` is unique; compact "Report an error" link added to the quiz panel. Hook points recorded in `context/architecture.md`. Not verified: a browser run that confirms each beacon fires once. Checks: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 22 pass / 0 fail (includes new `tests/events.test.ts`, source-level); `bun run build` 19 pages built.

## 2026-11-12 06:08 (Asia/Dhaka) — P3B docs refresh after the host move

Nothing changed: AGENTS.md and the five context docs already match the current names, hosts and D2c state.

## 2026-11-12 14:08 (Asia/Dhaka) - P5 wave: Understand Your Salah

Changed: compact hero and motif (T5.6/T5.11); `How this works` drawer with the intro and "About these lessons" notice on the home page and the instruction sentence on lesson pages (T5.7); reading-check result text, pulse and session-end block (T5.8); first screen measured (T5.14). The CC BY-SA audio attribution stays beside the player. No Print or Projector added (lesson pages keep their existing Print button).
Removed duplicates: the home intro sentence (the descriptor replaces it); the separate notice box. No limit deleted; "Roman guides are approximate" remains beside the Roman guide on lesson pages as well as in the drawer.
Measured first control (audio player) 342 px at 390 and 375; lesson search field 610 px at 390.
Validation: `bun run check` 0 errors; `bun run test` 20 pass; `bun run build` ok; headless Chrome at 390, 375, 1440 light and dark with no script errors or horizontal scroll; one reading check run and its share text checked.
