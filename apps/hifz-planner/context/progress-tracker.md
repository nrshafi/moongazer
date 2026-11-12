# Progress tracker: Hifz Planner

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: The verified moongazer.tech Domain property covers this app. Its sitemap was submitted and shows Success in Google Search Console. All 21 collection sitemaps succeeded with 286 discovered URLs. Discovery is distinct from indexing. Keep the apex DNS verification record. See repository deployment/search-console.json. Earlier pending setup statements below describe the previous release.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

Last updated: 2026-10-30T00:57:44+06:00 Asia/Dhaka

## Visual refresh, 30 October 2026

Added a dedicated SVG logo for this app's favicon and header, plus app-local editorial and control refinements. The Moongazer directory uses this logo on its app card. Its activity and source text remain as before. The portfolio run passed all twenty Astro checks, builds and Bun test suites; static verification passed 325 pages. Representative desktop pages were inspected in the browser. A fresh phone-width audit and production deployment were not performed for this change.

## Current phase

Implemented, E2E tested and packaged. The latest complete-portfolio audit and source corrections are recorded below. Published at https://quran-memorization-workload-calculator.moongazer.tech/. Current production checks are recorded below.

## Current goal

Give future work accurate local context while preserving the working independent static app.

## Completed

- A 604-page-layout model with existing/new pages, user-supplied time estimates, pace limits, study weekdays, start date, revision cycle, schedule pagination, CSV and calendar export.
- Source/privacy/404 pages, local fonts, both themes, optional browser state and app-owned clear-data controls.
- Filled this seven-file context set from the current source, manifests, content, deployment guide and recorded QA.

## Verification evidence

- Recorded app tests: 11 passing in repository `_implementation/qa/batch3/tests.log`; all fifteen apps total 112 passing.
- Recorded static output: 4 HTML pages, 17 files. Canonical text/local links were checked by `_implementation/verify-static.py`; all apps total 235 pages.
- Implementation/browser details: repository `BATCH2_QA.md`. These are recorded implementation checks, not fresh runs caused by this documentation-only edit.
- Latest documentation audit: `_implementation/qa/context-docs-audit.json` at repository level. Run `python _implementation/populate-context.py --verify-only` to refresh it.
- Canonical snapshot retrieval recorded by this app: `2026-10-27T17:21:30.283Z`. Content checksum/provenance remain in `src/data/provenance.json`.

## In progress

No feature implementation is in progress. Published at https://quran-memorization-workload-calculator.moongazer.tech/. Current production checks are recorded below.

## Next up

Maintain this app within the user's next requested scope. For behavior changes: Check invalid totals/dates/weekdays, leap days, growing review time, per-session budgets, structural ceilings, the finite horizon, final-goal completion, CSV and all-day ICS limits.

## Open questions

No unresolved requirement blocks this context setup. Hosting projects and domains are recorded in the repository deployment inventory. No independent scholarly certification is recorded.

## Architecture decisions

- Separate Astro/Bun project and local assets preserve independent static hosting.
- Source preparation happens before builds; no browser API key or live content service is required.
- Optional app-namespaced state expires on read after 30 days; no account or server history is introduced.
- 604 pages is the selected Hafs layout, not a universal pagination. Speeds are user assumptions, not validated learning predictions. Distinguish capacity failure from a viable plan beyond the 3,650-session horizon; ICS exports at most 90 sessions.

## Session notes

Use `AGENTS.md` and these six files before implementation. Preserve the supplied template folder and historical QA records. The initial context generator is not a normal update command and refuses overwrites; edit these Markdown files directly as the implementation evolves. Use Asia/Dhaka timestamps and distinguish measured results from planned work.

## Portfolio workflow update

The final five shortlist projects are now implemented. Collection verification/preview covers all twenty apps, with `--batch4` selecting apps 16 through 20. All twenty pass 157 tests and the static verifier checks 325 pages. Workflow references in this app were updated; this app’s runtime source, assets and build output remain unchanged. Use `python _implementation/verify-context.py` for current context validation. Earlier evidence above remains a record of this app’s initial implementation.

## Latest complete-portfolio E2E audit

Verified 2026-10-28T11:22:36+06:00 Asia/Dhaka. This app passes 14 Bun tests, Astro checks and a production build. Browser coverage: Invalid inputs, feasible/capacity plans, recovery, pagination, CSV and 90-event calendar cap. Its complete representative journey passed with normal storage, blocked storage and at phone size with blocked storage. All its generated pages rendered at phone size; both home themes, namespace-only clearing, source/privacy/404 navigation and enabled-control contrast passed.

Repository evidence: `E2E_QA.md` and `_implementation/qa/e2e/`. All twenty apps total 217 passing Bun tests, 387 final passing browser groups and 325 browser-rendered pages. Initial failed attempts remain in the evidence log with passing retests. Theme bootstrap regression tests are now local to every app. No live Cloudflare deployment, physical printer, Safari/Firefox or exhaustive branch-permutation verification is claimed.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Production publication

Verified 2026-10-29T23:45:31+06:00 Asia/Dhaka. Published at https://quran-memorization-workload-calculator.moongazer.tech/ in project moongazer-quran-memorization-workload-calculator. The user authorized publication. Content, behavior and storage are unchanged; public/_headers adds no-transform while preserving cache lifetimes and security headers.

The release passed 217 existing Bun tests, twenty fresh builds and static/canonical verification of 325 app pages. Two consecutive live checks each pass 646 requests across the twenty apps plus the directory, including every served file, deep routes, headers, HTTPS and custom 404s. This is release verification, not a new full E2E audit or scholarly review. IDs and evidence are in repository deployment/status.json and DEPLOYMENT_QA.md. Direct Upload is configured; Git-triggered deployment is not. Earlier no-publication statements in historical audits describe those earlier scopes.


## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement is locally uncommitted and was not pushed; user skill edits remain separate.

## 2026-11-11 (Asia/Dhaka) — P1.11 calendar export identity

- `calendar(rows, now)` now takes the export time. `PRODID` is `-//Moongazer//Hifz Plan//EN`. `DTSTAMP` is the export's UTC time as `YYYYMMDDTHHMMSSZ` via the new `icsStamp` helper, replacing the fixed 27 October timestamp. Each `UID` is `study-<date>-<index>-<stamp>@moongazer.tech`, so it is deterministic within an export and unique across exports. The browser caller passes `new Date()`. Invalid export times throw.
- Tests: the existing calendar test fixes `now`. `tests/calendar-identity.test.ts` asserts PRODID, UID suffix and uniqueness, DTSTAMP format and value, and absence of the old identity strings.
- Checks run in this app: `bun test` 19 pass / 0 fail across 4 files (14 earlier plus 5 new); `bun run check` 0 errors, 0 warnings, 0 hints over 13 files; `bun run build` completed with 4 pages built. Source grep finds the old strings only in the negative assertions; `dist/` has none.
- Not run: browser download verification of the .ics file, and the repository-level static verifier.
- Remaining: none for this item. The ICS still exports at most 90 sessions, and its dates remain user-estimate projections.

## 2026-11-11 (Asia/Dhaka) — P2 rename, interface words, honorifics

Quran Memorization Workload Calculator -> Hifz Planner. Title shortened to "Hifz Planner — Estimate new hifz and revision time | Moongazer" (62 chars). "Calculator" wording in learning.json and sources.astro became "planner"; related name "Is This Actually in the Quran?" -> "Is It in the Quran?". content.json unchanged (hash unchanged). No mentions of the Prophet in editorial text. Honorifics recorded in architecture.md. Checks: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 19 pass / 0 fail (88 expects); `bun run build` 4 pages built. `grep -rli` of dist for the old names and retired phrases finds nothing in the app pages.

## 2026-11-11 (Asia/Dhaka) — P7.1 to P7.3: wizard, check-offs, missed-day re-plan, print sheet, labels, export

Branch `phase-7-hifz` (from `phase-3-merges`). Commits: `70dfdb5` P7.1 context; `7d224aa` P7.2 pure wizard engine and tests; `a3f5f30` P7.2 three-step wizard; `04ba4e0` P7.3 check-offs (opt-in `checkoffs`); `14343f3` P7.3 "I missed a day"; `14ac0e8` P7.3 weekly print sheet; `9d68088` P7.3 sabaq/sabqi/manzil labels (`vocab`); `eda84cb` P7.3 optional daily reminder in `.ics`; `761524a` P7.3 descriptor (config and SEO); `dc3a861` P7.3 `deployment/targets.json` description (one line, this app only; repo file outside the app lane, changed on owner instruction).

What changed:
- Home page is a three-step wizard: step 1 pages memorized and new pages to add; step 2 study days (Monday first), minutes per session, start date, the Ramadan pace suggestion (labelled "a suggestion": 0.25 new pages per session, review cycle of 7 sessions), and an "Adjust assumptions" drawer with plain labels; step 3 this week's checklist (new lesson, recent revision, old revision), calendar grouped by week, check-off boxes, "I missed a day", print button, label setting, CSV and `.ics`.
- `src/lib/wizard.ts` (pure) builds the plan through the unchanged `schedule()`, splits review into recent and old pages for display (a split of the same total), groups weeks, validates stored input and check-offs, re-plans from today (`replanFrom`), and adds the daily reminder to `calendar()` output (`withDailyReminder`).
- Storage: `plan` (remember answers, opt-in), `checkoffs` (opt-in, validated `YYYY-MM-DD:kind`), `vocab` (display preference). Documented in `architecture.md`.
- `src/styles/planner.css` (app-local) holds the wizard, checklist, drawer, and print rules. No new colours or fonts. Shared `global.css` and `refinement.css` not edited.
- Descriptor: "Plan new memorization and revision around your week". SEO title "Hifz Planner — Plan hifz and revision each week | Moongazer" (59 characters).
- Learning-guide steps updated to the wizard.

Not done, with reasons:
- **Juz and surah choosers (T7.2 step 1): not built.** The bundled `content.json` has 114 chapter records (verse counts only) and `layoutPages: 604`, with no page-to-surah or page-to-juz boundaries. The seven manzil files in `_implementation/research/` give page ranges per manzil only. Per the brief, boundaries were not derived or invented and Quran MCP was not called. The acceptance criterion "every page 1–604 reachable through juz/surah choices" is therefore not met. Needed: a Quran MCP metadata snapshot with per-juz and per-surah page starts, recorded with tool, edition and date. The step-1 number entry reaches every count from 0 to 603.
- **Item 6 counter events:** skipped as instructed. `// P4.7: track(...)` comments sit at the first-step (`activity_started`) and plan-generated (`activity_completed`) hook points in `src/lib/app.ts`.
- **Context files:** `DESIGN.md` skipped (P5). 

Checks run in this app (from `apps/quran-memorization-workload-calculator`):
- `bun install --frozen-lockfile`: 259 packages installed, no version changes.
- `bun run check`: 0 errors, 0 warnings, 0 hints (last run after the final code change).
- `bun test`: 40 pass, 0 fail, 390 expect() calls, 6 files (baseline before this work: 25 pass). The existing engine, calendar-identity, storage and theme tests are unchanged.
- `bun run build`: 4 pages built.
- From repo root, `bun test _implementation/seo.test.ts`: 9 pass, 0 fail.

Browser checks (V7), headless Chrome against `astro preview` on port 4326, scenario scripts in the session scratchpad (not committed): wizard flow 30 of 30 at 390 and 1440 px (validation, focus on legend, Ramadan suggestion, back navigation, no horizontal overflow); check-offs 11 of 11 (opt-in storage, reload restore, invalid record rejected and removed, blocked storage explains that check-offs will not be kept); missed-day re-plan 7 of 7 (missed-day, all-done message; a missed-week case is covered by unit tests); print media emulation 7 of 7 (sheet rendered, workspace and learning guide hidden, no overflow); label setting 6 of 6; `.ics` download 6 of 6 (reminder RRULE and event count, PRODID kept, CRLF). Phone first-control offset: 665 px at 390×844 and 663 px at 375×812, above the 600 px target. The offset is driven by the shared shell header and intro, which belongs to P5.

Not run: V2 (`verify.ts`), V4 (`node homepage/build.mjs`; the directory catalog is not regenerated), V5 (`verify-static.py`), `deployment/verify-seo.py`, `_implementation/e2e-preview.ts`, a physical printer, and Safari/Firefox. Quran MCP not called: the wizard quotes no Quran text or hadith.

Remaining in this app: juz/surah choosers (needs page data); counter events (P4.7); DESIGN.md (P5); first-control offset (P5 shell). Shared status row in `plan/implementation/00-INDEX.md` not edited (shared file, app lane).

## 2026-11-11 (Asia/Dhaka) — P7.2 juz and surah choosers (supersedes the blocker above)

The page-boundary research file (`_implementation/research/page-boundaries.json`, commit 83cc262, Quran MCP `fetch_quran_metadata`, 2026-11-11) now exists. It was checked before use: pages 1 to 604 are each covered by a juz and by a surah, the juz chain is unbroken, and the manzil ranges match. This resolves the juz and surah blocker recorded in the entry above.

Commits: `5228d7d` app copy of the data with a provenance record (`src/data/page-boundaries.json`, `src/data/provenance.json`); `c2e4fc4` pure selection function with tests (`src/lib/pages.ts`, `tests/pages.test.ts`); `04fce4e` chooser UI in wizard step 1; then a commit for the context docs (project-overview "Page boundaries", ui-context, architecture).

Behaviour: step 1 keeps the number entry. A "Choose by juz or by surah" drawer holds native checkbox fieldsets (30 juz with page ranges; 114 surahs with transliterated names and page ranges). Ticks set the number to the distinct page count, so a page shared by neighbouring juz or surahs counts once. Typing a number clears the ticks; "Clear ticks" keeps the number. Choosing the whole layout explains that nothing is left to add, because the plan needs at least one new page.

Checks in this app: `bun run check` 0 errors, 0 warnings, 0 hints; `bun test` 49 pass, 0 fail, 1996 expect() calls, 7 files (the new `pages.test.ts` covers the data shape, full page coverage by juz and by surah, 30 juz = 604, 114 surahs = 604, the juz 3/4 shared page (40), a surah/juz overlap (49), an empty selection and validation); `bun run build` 4 pages built. Browser checks in headless Chrome (scratch scripts, not committed): 24 of 24 at 390 and 1440 px, covering the ticks, the number entry, the whole-layout message, clearing, the wizard reaching step 2, no horizontal overflow, and transliterated labels. Screenshot at 390 px: two columns, no nested scroll.

Open: the planner counts pages, not their positions, so a juz or surah choice gives a number of pages and does not record which pages are memorized. The repo-level `_implementation/seo.test.ts` was not re-run in this step (no descriptor or route change here). The first-control offset (665 px on phones) is unchanged and belongs to P5.

## 2026-11-12 06:08 (Asia/Dhaka) — P3B docs refresh after the host move

Nothing changed: AGENTS.md and the five context docs already match the current names, hosts and D2c state.
