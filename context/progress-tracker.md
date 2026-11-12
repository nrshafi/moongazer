# Repository progress tracker

## Grill-me skill merge

2026-11-11T01:09:58+06:00 Asia/Dhaka: Merged the `grilling` skill into `.agents/skills/grill-me/SKILL.md` and removed `.agents/skills/grilling/`. Grill-me now asks every question through the host's structured question tool (`AskUserQuestion` in Claude Code), with the recommended option listed first and the tool's built-in free-text choice for disagreement. It no longer lists questions in chat, and it uses chat formatting only when no such tool exists. It keeps the design-tree/frontier method, asks up to 4 questions per call, and finishes with a summary and a confirmation question. It no longer requires a sub-agent for fact lookups. The model can now invoke it from "grill" phrases, since `disable-model-invocation` was dropped. Validation: the frontmatter parses as YAML with only `name` and `description`, and `git diff --check` passes. No live grilling session or model evaluation was run.

## Design system recommendations and per-app DESIGN.md requirement

2026-11-08T14:08:00+06:00 Asia/Dhaka: Created `plan/DESIGN_RECOMMENDATIONS.md` synthesizing the user-provided design reference library from https://opendesignmd.com/api/designs.json with Moongazer's 20-app portfolio and directory hub across five design archetypes. Established and documented the mandatory requirement across `plan/` (`plan/agents/00-START-HERE.md`, `plan/agents/08-moongazer-shell-and-directory.md`, `plan/REPORT.md`, and `plan/DESIGN_RECOMMENDATIONS.md`) that the repository root (`DESIGN.md`) and all apps built (`apps/<slug>/DESIGN.md`) will each have their own dedicated `DESIGN.md` file governing their portfolio-wide and app-local design fidelity. Documentation only; no runtime code or builds modified.

## Project DNA and first-party service planning

2026-11-08T12:23:00+06:00 Asia/Dhaka: Defined Moongazer's internal business DNA in `context/project-dna.md` (item 0 in root `AGENTS.md` and checked by `_implementation/verify-context.py`). Captured Mission, Vision as a permanently free digital waqf, Booktube's role as a motion-graphics social media companion, Singular Focus on interactive Islamic learning and essential worship tools (refusing fatwa issuance, social feeds, and live AI chat; allowing demand-triggered minimal progress-sync accounts after zero-account backup codes), five rank-ordered Core Values, the four-part Depth Gate (merging the four overlapping apps into sixteen first, then requiring at least 30 verified items or full canonical coverage before launching new apps), and the learning/corrections loop. Added `plan/FIRST_PARTY_SERVICES_PLAN.md` for pending technical planning of the cookie-free three-event counter (`activity_started`, `activity_completed`, `share_clicked`; no `page_view`), the in-app correction and feedback form, and demand-triggered progress sync. Updated `context/project-overview.md`, `plan/agents/00-START-HERE.md`, `plan/agents/11-moongazer-ramadan-season.md`, `plan/agents/14-moongazer-growth-trust-bangla.md`, and `plan/REPORT.md`. This is documentation only; no app runtime, build, storage, or deployment changed, and no builds or tests were run.

## Growth plan and agent briefs

2026-11-07T16:38:00+06:00 Asia/Dhaka: Added `plan/REPORT.md`, which covers Moongazer's defects, naming, portfolio merges, a per-app review and its roadmap, plus the Booktube Islamic rules. Also added `plan/agents/00`–`15`, a set of briefs in execution order. `00-START-HERE.md` holds the owner's decisions, the ground rules, a shared verification checklist and the status table. `plan/NEXT_SESSION_PROMPT.md` holds a handoff prompt for the next session. This is documentation only. No app source, build, storage or deployment changed, and no builds or tests were run for it. Moongazer briefs 06–15 are recommendations; each needs the owner's go-ahead, and the report does not authorize building them. Booktube briefs 01–05 were carried out in that repository and pushed (commit 7c3d96b).

## Generated verification output

2026-10-30T01:26:30+06:00 Asia/Dhaka: Added root-scoped ignore rules for generated QA and deployment evidence. All 61 generated files are now ignored and remain on disk. Eleven protected-path checks confirm that app source/assets, compact deployment/Search Console records, authored Markdown notes, font-conversion metadata and unrelated skill configuration are not ignored. The existing font-conversion record remains tracked. Checked rule behavior with git check-ignore after inspecting its CLI help; whitespace validation passed. No application build, test, deployment or file deletion was needed for this configuration change.

## SEO source checkpoint

2026-10-30T01:20:02+06:00 Asia/Dhaka: The requested Git checkpoint includes the session's SEO source, required local assets, build/CI verification, project context and compact deployment/Search Console records. Generated QA dumps, logs, screenshots and temporary browser scripts stay local. .gitignore is unchanged. Fresh checks pass five SEO helper tests and static SEO validation on 327 pages across 21 hosts, including 286 indexable URLs. No push was requested, and no new live deployment or complete app test run is claimed for this checkpoint.

## Google Search Console setup, 30 October 2026

2026-10-30T00:57:44+06:00 Asia/Dhaka: Completed the user-requested Google Search Console setup with the ego plugin and the existing Cloudflare connector. Google confirmed Domain ownership through a newly added apex TXT record. All 21 sitemap submissions were accepted and every row now shows Success, covering 286 discovered URLs. Performance and indexing reports are still processing. Keep the verification TXT record. Evidence: deployment/search-console.json and deployment/evidence/search-console/. No app source, build, dependency, storage or visitor tracking change was needed, and no fresh application tests or builds are claimed for this administrative setup.

## SEO release, 30 October 2026

2026-10-30T00:33:23+06:00 Asia/Dhaka: Collection-wide SEO is published through 21 successful production deployments. Twenty Astro checks and builds, 217 existing app tests and five SEO helper tests pass. Static SEO passes on 327 HTML pages with 286 indexable URLs; source integrity passes on all 325 app pages. Live HTTP checks pass 769/769; live SEO checks pass 411/411; all 21 deployment-specific Pages URLs return noindex. Google successfully crawled one representative published detail page and found valid breadcrumb markup. Search Console ownership and sitemap submission remain pending the intended Google account. This direct release used uncommitted source; no new GitHub Actions run for the SEO change is claimed. See deployment/seo-release.json and SEO_QA.md. Historical QA below and the separate visual-refresh record retain their original scope.

## Collection visual refresh

2026-10-30T00:29:25+06:00 Asia/Dhaka: Updated all twenty app shells with a larger editorial intro, stronger panel/card hierarchy and responsive refinements in app-local `src/styles/refinement.css`. Created twenty distinct, accent-matched SVG logos for app favicons and headers, and used those marks in the Moongazer directory cards and two featured entries. The directory still builds from its source template.

Fresh validation for this change: all twenty Astro checks passed with zero diagnostics, all twenty production builds passed, all twenty Bun test suites passed, and static verification passed all 325 app pages with canonical text, local links and no external runtime assets. The homepage build passed with twenty app links. Browser inspection covered the directory, Guess the Surah in both themes, Quranic Places Atlas and Understand Salah Lab at desktop width. A fresh phone-width browser audit was not run. This work is local source/output only; no publication or live production verification is claimed.

## Automatic deployment active

Verified 2026-10-30T00:11:32+06:00 Asia/Dhaka. Published commit 90f46d9 to main and configured both Actions secrets. The user explicitly approved the persistent account-scoped Pages Write token and the staged publication after automatic review requested exact approval. GitHub run 40927531499 passed twenty Astro checks and builds, 217 tests, all 21 production deployments and 646/646 HTTP checks across 327 pages. Local checks, tests and builds also passed for all twenty apps on retry outside the sandbox. Earlier blocked/inactive notes below are historical. Current evidence: deployment/automation-result.json and the Actions run linked in deployment/README.md.


## GitHub deployment automation preparation

Retry, 2026-10-30 Asia/Dhaka: GitHub access and a representative Astro production build succeed outside the sandbox. The existing Git sign-in has repository admin access and CLOUDFLARE_ACCOUNT_ID is configured in Actions secrets. Cloudflare reconnection restored token-management permission. Automatic approval review rejected creating a persistent account-scoped Pages Write token because that exact scope needs explicit approval. No deployment token was created. The workflow and source are ready for publication; production activation remains pending the token and a passing Actions run. The workflow now checks and tests every app before building and deploying, and rejects missing credentials before builds.

2026-10-29 23:56 Asia/Dhaka: prepared a main-branch GitHub Actions workflow and Pages API driver for all 21 existing Direct Upload projects, retaining project-scoped asset uploads and live verification. The GitHub connector returned 404 for the configured repository and the available tools do not provide repository secret management. The workflow, homepage and deployment sources remain uncommitted in this checkout; GitHub secrets and a successful production run have not been verified. Automation is therefore not active. Node syntax and workflow YAML parsing passed; homepage build passed. See `deployment/README.md` for activation and failure recovery.

The representative Guess the Surah build failed when Astro could not write `.astro/content.d.ts` (EPERM). A remote Git read also failed because this environment could not connect to GitHub. No automatic deployment or end-to-end CI test was performed.

Last updated: 2026-11-08T12:23:00+06:00 Asia/Dhaka

## Current phase and goal

The collection-wide on-site SEO request is complete and published. Search Console Domain ownership is verified, and all twenty-one submitted sitemaps show Success with 286 discovered URLs. Indexing and search-performance data are still processing. Earlier implementation and hosting records below are historical.

The authorized Moongazer publication is complete. The directory and twenty apps are deployed independently, with the apex, www and all twenty full-name app subdomains active. Two consecutive live checks each pass 646 requests. Earlier no-publication statements below describe historical implementation scopes.

## Completed

- The earlier final implementation batch retained apps 1–15 unchanged. The subsequent E2E audit corrected their theme startup validation and the Quran Connections recovery defect, as recorded below.
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

No implementation or hosting work remains from this request. Maintain sources, provenance and deployment records with later changes.

## Open questions and material limits

No requirement blocks this publication. Hosting is verified; no independent scholarly certification is claimed. Actual printer output was not tested; print preparation and styles are implemented and inspected.

## Architecture and source decisions


## Moongazer publication completed

Verified 2026-10-29T23:45:03+06:00 Asia/Dhaka. Added homepage/ with all twenty links, search, filters and mobile layouts. Published twenty apps plus the directory, with full-name subdomains, HTTPS redirects, www canonicalization, RUM off and no-transform response headers. App content and behavior remain unchanged.

Fresh validation: 217 Bun tests, twenty production builds, canonical/static verification of 325 app pages, and dependency audits with no known vulnerabilities. All app dependency graphs match the audited 319-package graph; the deployment helper has one package. Two consecutive complete HTTP checks each pass 646 requests across 21 sites and 327 HTML pages, including assets, deep routes, headers, custom 404s and redirects. Browser checks cover desktop/mobile directory layouts, filters/search/recovery, no console errors and live game clue/answer feedback. No new Astro check or full repeat of the earlier app E2E audit was run for header changes.

Initial namespace errors, unsupported hostname redirect and platform analytics insertion were corrected. Failures are preserved separately. Per-project uploads and project-scoped hashes now serve every expected file. API references are in deployment/README.md, release IDs in deployment/status.json and results in DEPLOYMENT_QA.md. Source was not pushed and Git auto-deployment is not configured.

JavaScript syntax checks and git diff --check pass. The legacy context-path audit still stops at the absent historical batch-four QA directory; its failure is recorded in deployment/evidence/context-audit.log. Fresh static results were regenerated. This archived-evidence limitation does not affect the live sites or passing source/build checks.
Each app remains a separate Astro 7.4.2/Bun 1.4.4 static project with TypeScript 6.0.3 and @astrojs/check 0.9.12. Normal builds use prepared local content. No account, database, runtime API, secret, shared backend or external font service is introduced.

Official Quran MCP provides canonical Arabic/Pickthall evidence and fetched commentary. Full Arabic Ibn Kathir supports further report-context reading; Al-Qurtubi provides further business discussion. UNESCO and the Metropolitan Museum of Art support later historical records; Natural Earth supplies local land geometry. Modern activities and fixed reading claims remain explicitly editorial. Direct HTML retrieval failures were resolved using the web reader for the same primary/institutional pages, with saved evidence.

## Session notes

Read the six context files in AGENTS.md order, then the affected app’s local context. Use `python _implementation/verify-context.py` for current context checks. The initial population scripts are historical one-time tools and must not overwrite hand-maintained files. Use `--batch4` for final-batch check/test/build or preview; unfiltered verification covers all twenty apps. Keep Asia/Dhaka timestamps and report actual verification. Packaged output is not a deployed site.

## Latest user request: test all twenty apps end to end

Completed the complete-portfolio audit in `E2E_QA.md`. All 20 pass 217 Bun tests, Astro checks and production builds. All 325 pages rendered in the browser; 590 served files passed byte/header checks. All apps completed normal and blocked-storage journeys plus phone-size blocked-storage journeys, both home themes, storage fault/clear tests, navigation and focused control contrast checks.

Corrected strict theme startup validation in apps 1–15, selected-puzzle recovery in Quran Connections, and escape-room timer restart/display behavior. Added 60 theme-bootstrap regression tests across all apps. Updated affected source/context and regenerated release archives. Source quotations/provenance remain unchanged; earlier unchanged-runtime statements describe the previous batch.

No remaining tested failure is open. The report states browser/platform/printer/content-review limits and preserves initial failed attempts separately from passing retests. No live hosting publication occurred.

## Latest UI refinement: selection focus

Removed the accent-colored outer focus ring from pointer interactions. Controls retain their ordinary border; Tab navigation shows a neutral 2px outline. The shell tracks pointer/Tab modality only in the DOM, including dynamically created controls. The Salah app includes its native audio element in the same policy.

All twenty apps passed fresh Astro checks, production builds and 217 existing Bun tests. Focus-specific browser verification passed 40 app/theme cases, covering pointer buttons/selects/text fields where present, Tab focus and switching back to pointer use. The family age filter was changed to 5–7 and correctly showed four entries with no outer ring. Static verification passed all 325 pages, and the twenty release archives were regenerated. Evidence: repository `FOCUS_QA.md` and `_implementation/qa/focus-browser.json`. The earlier full E2E audit was not repeated wholesale for this focused UI change.

## Git preparation

Initialized a root Git repository for the portfolio. Added ignore rules at the root and in every app for dependencies, Astro output, local environment files, caches and debug logs. App lockfiles and source remain eligible for version control. GitHub publication and validation are recorded separately when completed.

Validation: 160 Git ignore checks passed across the twenty app roots, including lockfiles and example environment files. A basic scan of eligible files found no common private-key, GitHub token or AWS access-key patterns; this is not an exhaustive secret audit. The context verifier could not run because `_implementation/qa/static-results.json` is missing in this checkout. No fresh app builds or tests were run for these repository configuration changes.

## README refresh

Updated the root README to describe the twenty app folders, independent development commands and files available in this checkout. The previously referenced demo catalog, release archives and QA reports are absent; older deployment and context records describe historical artifacts. The user authorized replacing the old README in the initial commit and force-pushing the rewritten main branch.

Validation: checked the app inventory, representative package scripts, linked repository paths and Git history. No app tests or builds were run for this documentation-only change. The context verifier remains blocked by the missing `_implementation/qa/static-results.json`.


## Skill verification and maintenance

Reviewed the eleven repository skill entrypoints and relevant references against local files and current primary documentation. Updated nine skills: corrected WCAG large-text units and SVG LCP eligibility; clarified Google sitelinks, How-to and FAQ search-feature limits; repaired missing security references and replaced the incomplete SSRF example with transport requirements; respected existing user authorization; removed fixed navigation/link quotas and tool-name assumptions; aligned Astro documentation lookup with installed versions. The codebase scanner now detects text bun.lock files, and its compatibility/focus hints remain in validator-supported metadata. Updated affected schema, SEO and site-architecture evaluation expectations. Bun and unslop required no change from this review.

Validation: all eleven skills pass skill-creator/scripts/quick_validate.py using PyYAML 6.0.3 installed only in an isolated temporary folder. All 42 relative Markdown file links resolve; all bundled evaluation JSON parses; git diff --check passes. The scanner successfully detected and previewed bun.lock in an isolated temporary fixture. Source links are recorded next to the corrected guidance, including W3C, Google Search Central, web.dev, OWASP and NN/g. No model evaluation runs or app builds/tests were performed for these skill changes. The repository context verifier remains unavailable because its required _implementation/qa/static-results.json is absent. No remaining repair from the verified findings is open; this is a targeted maintenance review, not exhaustive verification of every external link or API example.



## Search content release, 30 October 2026

Verified 2026-10-30T02:16:08+06:00 Asia/Dhaka. Published four subject guides and an About/source-methodology page at moongazer.tech, with nrshafi1@gmail.com as the user-authorized public corrections contact. All twenty app homes now have descriptive headings, static usage guidance, two questions and related-app links. Sources, activities, storage and dependency pins remain intact. Architecture, metadata, sitemap coverage and optional llms.txt are documented in SEO_GROWTH_PLAN.md and SEO_GROWTH_QA.md.

Fresh portfolio validation: 20 Astro checks, 20 production builds, 217 app tests, 6 SEO tests, source/static integrity for 325 app pages, static SEO for 332 HTML pages and 291 indexable URLs, 776 live file/header/redirect checks and 416 live SEO checks all pass. Phone/desktop DOM checks cover six directory pages and twenty app homes. Existing full E2E and scholarly reviews were not repeated; screenshot capture timed out. All 21 production deployment stages succeeded. The verifier's Windows newline comparison was repaired after byte equality proved the sitemap correct.

Search Console accepted the expanded root sitemap and shows Success; all 21 sitemap rows now show Success with 291 discovered URLs, including six directory URLs. Performance/indexing reports have no processed baseline. No ranking improvement is claimed. Follow-up is to assess indexing and query/page performance when data becomes available; no recurring automation was created. Deployment IDs and limitations are recorded in deployment/seo-growth-release.json. This enhancement was locally uncommitted at release verification; user skill edits remain separate.

## SEO source commit

Prepared 2026-10-30T02:18:00+06:00 Asia/Dhaka at the user's request. This commit includes the published SEO source, app-local learning guides, validation helpers, authored QA reports, context, compact release/Search Console records and generated-output ignore rules. User skill changes and generated logs/manifests remain outside the commit. The preceding release verification applies; this Git-only step does not rerun app builds or publish another release. No push was requested.

## Implementation plan refinement, 11 November 2026

Recorded 2026-11-11 Asia/Dhaka. Read the plan folder (REPORT.md, briefs 00–15, strategic decisions, design recommendations, first-party services note, Verify_Me) and ran a decision interview with the owner using the grill-me skill. Fact checks against the code informed the questions: the only "2026" strings in app sources are true retrieval dates; Salah audio already shows a load-error message; no inline Arabic was found inside English data strings; the shared shell files are byte-identical across all twenty apps; the static verifier forbids `fetch(` in app bundles; the apex deploys through a custom Direct Upload script without Functions support; and seven apps fall below a flat 30-item depth target.

Wrote `plan/implementation/`: 00-INDEX (25 settled decisions, calendar, dependency graph, shared-file list, per-app Depth Gate targets, status), 01-HANDOVER-PROTOCOL, phase files P1–P10, the content track C, and the Verify_Me triage appendix. Added superseded banners to the strategic decisions document, the next-session prompt and briefs 06–15. Added a pointer to START-HERE. Marked the services plan's open questions as settled. Added the per-app gate and verification rule to project-dna.md, and added a plan pointer to project-overview.md.

Documentation only. No app code, data, builds or deployments changed, and no tests or builds were run. The schedule is ambitious for nine weeks; the index lists what moves after Ramadan first if a phase slips.

## 2026-11-11 (Asia/Dhaka) — P1.17 text-join audit and P1.19 BDI check

Script: `_implementation/audit-text-joins.py` (Python stdlib `html.parser`; run after building the apps and `node homepage/build.mjs`). Usage: `python _implementation/audit-text-joins.py` lists unexplained joins as app, file and a ~60-character context with the `⟨|⟩` marker; `--summary` prints counts per app; `--all` also lists allowlisted joins; `--bdi` runs the P1.19 check; `--signatures <file>` writes the element pairs involved (tooling aid). It exits 1 while unexplained joins (or BDI findings) remain. It walks every built page in `apps/*/dist` and `homepage/dist`, ignores script/style/template/svg/select content and `aria-hidden`/`hidden` subtrees, flags a boundary where text ending in a letter, digit or closing punctuation meets text starting with a letter or digit with no whitespace, when inline elements sit between them or when block siblings sit inside a link, button, label, summary or a flex/grid container (class lookup in the built CSS). Allowlist: `_implementation/audit-text-joins.allow` (substring plus `  # reason`).

Initial joins (occurrences over 332 built pages; 7,587 in total, 3,811 unique contexts): everyday-akhlaq-simulator 451, family-islamic-learning-challenges 418, guess-the-surah 615, halal-business-decisions 335, homepage 231, interactive-seerah-timeline 530, is-this-actually-in-the-quran 275, islamic-civilization-timeline 632, islamic-concept-connections 102, islamic-history-timeline-challenge 75, islamic-knowledge-escape-room 190, islamic-misinformation-casebook 321, quran-concept-atlas 788, quran-connections 187, quran-memorization-workload-calculator 49, quranic-parables-studio 427, quranic-places-atlas 380, revelation-context-explorer 305, stories-of-the-prophets-explorer 595, the-seerah-detective 357, understand-salah-lab 324. After fixes: 0 in every app and the homepage.

Fix: the cause was that adjacent elements, expression output and `.map()` items had no whitespace between them in the minified-style templates (Astro's compressHTML also drops newline whitespace between tags; `compressHTML: false` was tried on guess-the-surah and only removed about 2% of joins, so it was reverted). Fixed in source by adding a literal space (or `{' '}` where the gap fell at a line break or after an expression) between the specific element pairs the audit reported, and by wrapping reported `.map()` items as `<>…{' '}</>`. Visible wording is unchanged. Shared files were edited in `guess-the-surah` and copied with `sync-shared.ts` (Shell.astro, LearningGuide.astro, 404.astro, privacy.astro).

Files changed (all `apps/<app>/src/...` unless noted):
- Every app: the four shared files above (`layouts/Shell.astro`, `components/LearningGuide.astro`, `pages/404.astro`, `pages/privacy.astro`) plus `pages/index.astro` and `pages/sources.astro` (except where noted).
- everyday-akhlaq-simulator: `pages/scenario/[slug].astro`.
- family-islamic-learning-challenges: `components/Filters.astro`, `Passage.astro`, `References.astro`, `pages/pack/[id].astro`.
- halal-business-decisions: `components/Filters.astro`, `Passage.astro`, `References.astro`, `pages/case/[id].astro`.
- interactive-seerah-timeline: `pages/event/[slug].astro`.
- islamic-civilization-timeline: `components/Filters.astro`, `Passage.astro`, `References.astro`, `pages/event/[id].astro`.
- islamic-knowledge-escape-room: `pages/room/[id].astro`.
- islamic-misinformation-casebook: `components/Filters.astro`, `Passage.astro`, `References.astro`, `pages/case/[id].astro`.
- quran-concept-atlas: `pages/topic/[id].astro`.
- quran-memorization-workload-calculator: `pages/index.astro` (mapped labels).
- quranic-parables-studio: `pages/parable/[id].astro`, `pages/index.astro`.
- quranic-places-atlas: `components/Map.astro`, `pages/place/[id].astro`.
- revelation-context-explorer: `components/Filters.astro`, `Passage.astro`, `References.astro`, `pages/reading/[id].astro`.
- stories-of-the-prophets-explorer: `pages/prophet/[id].astro`.
- the-seerah-detective: `pages/case/[slug].astro`.
- understand-salah-lab: `pages/lesson/[id].astro`.
- homepage: `homepage/build.mjs`, `homepage/render.mjs`, `homepage/index.html` (spaces between template parts; `.join('')` of links and articles changed to `.join(' ')`).
- New: `_implementation/audit-text-joins.py`, `_implementation/audit-text-joins.allow`.

Allowlisted: none (the allowlist file is empty). The audit only sees build-time HTML; text that the apps' scripts render at run time is not covered.

P1.19 BDI: none found. No built page has Arabic-script text (excluding U+FDFA) sharing a text node with Latin letters outside a `dir="rtl"` or `<bdi>` ancestor. A synthetic fixture confirmed the detector flags an unwrapped case and ignores `<bdi>`, `dir="rtl"` and ﷺ. No `<bdi>` wrapper was added.

Checks run: all 20 apps rebuilt twice with `bun _implementation/verify.ts build` (pass) and `node homepage/build.mjs`; audit: 0 unexplained joins across 332 pages; `--bdi`: 0 findings; `bun _implementation/verify.ts check` pass (20 apps); `bun _implementation/verify.ts test` pass (20 apps); `bun _implementation/sync-shared.ts --check` pass; `bun test _implementation/seo.test.ts` 9 pass; `python _implementation/verify-static.py` verified 325 static pages. Not passing: `python deployment/verify-seo.py` aborts with `AssertionError: ('duplicate meta', 'theme-color')`; the shared Shell already had two `theme-color` meta tags (light and dark media) at HEAD, so this is pre-existing and not caused by this change. It is unresolved here, so static SEO and live checks from that script were not completed. No browser or visual check was done; added spaces fall in inline contexts only where text was being joined, and elsewhere in flex or grid containers where whitespace is not rendered.

## 2026-11-11T07:04:26+06:00 — P1 trust fixes complete (R1)

All P1 tasks T1.1–T1.19 implemented on `phase-1-trust-fixes`, one commit per task (T1.11–T1.14, T1.16–T1.19 delegated to Sonnet/Haiku subagents, reviewed by the orchestrator). Also: content checksums now use LF-normalised bytes (`verify-static.py` and every `provenance.json`), `deployment/verify-seo.py` accepts per-media theme-color, and `_implementation/browser-check.mjs` drives headless Chrome for V7 checks. Release note with the full check list: `plan/implementation/releases/R1.md`. Validation: 20/20 check and test, 20/20 build, sync-shared identical, seo tests 9 pass, verify-seo passed (332 pages), verify-static 325 pages, text-join audit 0, BDI 0, browser flows listed in R1.md. The owner authorized pushing and Cloudflare access on 11 Nov 2026 (recorded as D2a).

## 2026-11-11 (Asia/Dhaka) — P2.5 directory names
Directory now uses the P2 display names and "Descriptor now" text. `deployment/targets.json`: name, description and plain `kind` updated for 16 apps (kinds: Quiz, Puzzle x3, Search, Reader x3, Map, Timeline x2, Mystery, Course, Planner, Scenarios, Activities); the four merge-bound apps unchanged; slugs, hosts, categories untouched. `homepage/collections.json` FAQ and path copy use new names, with the Prophet's life followed by the honorific glyph in editorial copy. `homepage/index.html` featured CTAs read "Open Guess the Surah" and "Open Understand Your Salah". `homepage/about-content.html` civilization timeline name fixed. Checks: `node homepage/build.mjs` (6 pages, 20 app links, llms.txt regenerated), `bun test _implementation/seo.test.ts` 9 pass 0 fail, grep of `homepage/dist` for the 15 old names returns none.

## 2026-11-11T07:20:11+06:00 — P2 names, copy and honorifics complete (R2)

Implemented T2.1–T2.8 on `phase-2-names` (per-app work delegated to five subagents and the directory to a sixth; the orchestrator did context, the shared honorific helper, the nav verb, catalogue syncs, social cards and verification). Release note and full check list: `plan/implementation/releases/R2.md`. Validation: 20/20 check, test and build; sync-shared identical; seo tests 9 pass; verify-seo passed; verify-static 325 pages; text-join audit 0; headers of all 20 apps checked at 390 px in both themes.

## 2026-11-11T11:55:39+06:00 — P3.8 redirect map, retired flag, 16-app directory

`_implementation/build-redirect-map.ts` writes `deployment/merge-redirects.json` from the retired apps' `dist/` using the same rule as the shell's moved banner (atlas 36 paths, timeline challenge 6, halal business 18, casebook 18, each with `/sitemap.xml` and `*`). `_implementation/redirect-map.test.ts` checks the committed map equals a fresh build, that every target page exists in the receiver build and that no target points to a retired host (2 pass). `deployment/targets.json` marks the four apps `retired`; the directory lists 16 apps, journeys link to the receiving sections (`/themes/`, `/challenge/`, `/business/`, `/claims/`) and the count copy says sixteen. Deployment still deploys all 20. `deployment/verify-seo.py` expects retired pages' canonical and og:url to equal the mapped URL and counts only active apps in the directory checks. Checks: `node homepage/build.mjs` (6 pages, 16 app links), `python deployment/verify-seo.py` passed (21 sites, 390 pages, 349 indexable).

## 2026-11-11T12:10:36+06:00 — P3 step A verified; R3 held for spot-check

T3.1–T3.8 done on `phase-3-merges` (receiving sections by four subagents; import protocol, shell banner, redirect map, directory and validator by the orchestrator; claims verified by a separate subagent). Full checks in `plan/implementation/releases/R3.md`. Not released: the 12 rebuilt claims need the owner's spot-check before merge to `main`.

## 2026-11-11T18:27:45+06:00 — P4.1–P4.4 and P4.8 built and tested locally (branch phase-4-services)

Tasks done: T4.1 context, T4.2 wrangler pin and apex config, T4.3 validator and tests, T4.4 Functions, T4.8 owner scripts. T4.5–T4.7 (UI, shared components, app wiring) were not in this scope and are not done. T4.9–T4.10 are not started. Nothing was pushed, merged or deployed, and no `--remote` D1 command was run. The branch is based on `phase-3-merges` (P3 step A, not yet merged to `main`).

Commits on the branch, oldest first: 2fbc7c3 wrangler pin; 7f90128 P4.1 context; c5c5503 `.wrangler/` ignore; 58a3c84 wrangler.toml and `_routes.json`; 18d3d04 migration 0001; 33d5684 allowlist script and `apps.json`; 87eaaee validator and tests; 41ab183 feedback Function; ffa627a event Function; 37f05eb owner scripts and README; this entry, the DNA status line and the P4 row in `00-INDEX.md` are in the commit after 37f05eb.

Decisions and documentation:
- Wrangler `4.160.0` is pinned exactly in `deployment/package.json`. `bunx --bun wrangler` failed on Windows (clone error for `wrangler-dist/cli.js`), so wrangler runs as `node deployment/node_modules/wrangler/bin/wrangler.js` from `homepage/`.
- Docs checked (URLs in `context/architecture.md`, "Dependencies and documentation checked"). `_routes.json` sits in the build directory, so `homepage/_routes.json` is copied into `dist/` by `build.mjs`. The Pages get-started page says `/functions` belongs at the project root and not in the static output folder. The docs do not say the functions directory is found from the working directory, so `wrangler pages dev dist` run from `homepage/` was checked locally instead.
- Invalid form fields return a fixed 400 reason; honeypot and timing failures return 303 and store nothing (as specified). Non-POST methods return 405 through a catch-all `onRequest`. The beacon returns 204 for every bad input.
- The local D1 write response does not report `meta.changes`, so `review-feedback.mjs set` checks for the row with a SELECT first.

Checks run and results:
- `bun test homepage/tests`: 51 pass, 0 fail (validator table tests).
- `node homepage/build.mjs`: built 6 directory pages and 16 app links; `dist/_routes.json` present.
- `wrangler d1 migrations apply moongazer --local` (run from `homepage/`): `0001_init.sql` applied, 4 commands successful.
- `wrangler pages dev dist --port 8788 --ip 127.0.0.1` (from `homepage/`): compiled, `env.DB` bound to local D1. Server stopped afterwards. Its log showed no errors.
  - Valid form POST (t 5 s old) → 303, `Location: https://moongazer.tech/feedback/thanks/?from=guess-the-surah`, `Cache-Control: no-store`. Local feedback table: one row, status `pending`, `no_js` 0.
  - Honeypot POST (`website` filled) → 303; too-fast POST (t = now) → 303. Both added no rows.
  - GET and PUT on `/api/feedback` → 405. GET on `/api/event` → 405.
  - Two valid beacons `{"a":"guess-the-surah","i":"home","e":"activity_started"}` → 204 each. Local `event_counts`: one row, count 2.
  - Malformed beacon and unknown-app beacon → 204, no rows added.
- Owner scripts, `--local` only: `list` (pending row shown, contact hidden), `set` success path and missing-id error, `set` with an invalid status error, `publish` (appended one entry to `homepage/corrections.json`, row marked verified; the test file was deleted and not committed), `counter-report` CSV (completion rate 0.000 for 2 started / 0 completed), and an invalid date range error.

Not verified or still open:
- No TypeScript typecheck of `homepage/functions/`. The homepage has no tsconfig, and `bun test` does not typecheck. The Functions use minimal local D1 types and the global `crypto`, `Request` and `Response`.
- Not run: remote D1 migrations, `wrangler pages deploy`, the zone rate-limit rule, and any live request. All are owner steps in T4.10.
- Privacy wording (T4.9 and T4.6 step 5) is not drafted in this scope.
- Local test rows and `homepage/.wrangler/` remain on this machine only (ignored by Git).

## 2026-11-12T00:10:00+06:00 — P4 complete; R4 released by the agent (D2b)

T4.5–T4.7 and T4.9–T4.10 done on `phase-4-services`. The owner gave full delegation on 2026-11-11, so production setup and the privacy wording were agent-approved (`plan/implementation/releases/R4.md`).
- Production setup: D1 `moongazer` was migrated with `migrations apply --remote`. The CI token holds D1 Edit and Pages Edit. Rate-limit rule `017d4ac601c8412a9377b3f144a681cf` covers `/api/*` (10 requests per 10 s per IP, block for 10 s).
- CI: the apex deploys with `wrangler pages deploy` and the apps with Direct Upload `--apps-only`.
- Counter events are wired in 16 apps by four Haiku subagents. Hifz Planner waits for `phase-7-hifz`.
- Found and fixed during verification:
  - The shared footer form's `id="feedback"` clashed with many apps' own status lines; it is now `#site-feedback`.
  - Astro dropped the word gaps inside the form; they are now explicit.
- Validation: 20/20 check, 441 tests and 20/20 build. sync-shared identical; 62 repo tests; verify-static 383 pages; verify-seo passed (393 pages); text-join audit 0. `_implementation/counter-check.mjs` passed 14/14. A local `wrangler pages dev` curl run gave the expected 303/400/405/204 and stored the expected rows.
- Limits:
  - `homepage/functions/` is still not type-checked; esbuild compiles it through `wrangler pages functions build`.
  - The beacon check samples 4 of 16 apps in a browser; the other 12 are covered by source-level tests and the build.
  - Live results are recorded in R4 after CI.

## 2026-11-12T05:50:00+06:00 — P3B: retire the four merged apps (D2c)

Branch `phase-3b-retire` (from `phase-3b-hosts`). The four merged apps are deleted with no redirects, no moved release and no import path; the receiving sections stay.
- Deleted `quran-concept-atlas`, `islamic-history-timeline-challenge`, `halal-business-decisions` and `islamic-misinformation-casebook`. Removed them from targets, seo-catalog, learning-guides, per-app learning guides, the app allowlist (regenerated), logos script, README, DEPLOYMENT and SEARCH_CONSOLE_SETUP. Dropped the `retired` field and the homepage and verify-seo filters.
- Removed the moved banner, `encodePayload` click handler and banner CSS from the shared shell; deleted `import.ts` and its test from all 16 apps and `merge-import.ts` with tests from the four receivers (plus `claimIdMap`, the old-app import rules, and old-app comparisons in tests). `appContentSha256` refreshed for `is-this-actually-in-the-quran`.
- Deleted `merge-redirects.json`, `build-redirect-map.ts` and `redirect-map.test.ts`. `verify.ts` and `preview.ts` lose the batch slices; e2e flows for the deleted apps are gone.
- Corrections log: removed the three entries that pointed at deleted apps.
- Left as history: `_build/`, `_implementation/batch*`, `populate-context.py`, `_implementation/research/`, and the `deployment/` release and status records (`status.json`, `automation-result.json`, `seo-*release.json`, `search-console.json`), which describe what was deployed.
- Validation: verify.ts check 16/16 (0 errors, 0 warnings), test 16/16 (251 pass, 0 fail), build 16/16; sync-shared identical; `bun test _implementation/seo.test.ts homepage/tests` 60 pass; homepage build 8 pages and 16 app links; verify-static 313 pages; verify-seo passed (17 sites, 323 pages); text-join audit 0 unexplained joins. No push and no Cloudflare action.

## 2026-11-12T06:20:00+06:00 — D2c: merged apps deleted, 16 apps on new hosts (R3B)

The owner asked to keep only the new things, with no redirects (decision D2c in `plan/implementation/00-INDEX.md`). Work was split across subagents:
- A Sonnet subagent deleted the four merged apps and the moved, import and redirect machinery.
- The orchestrator renamed the 16 apps to slugs and hosts that match their names, and set up Cloudflare.
- A Haiku subagent refreshed the per-app docs.

Validation: 16/16 check, test and build (251 tests); sync identical; 60 repo tests; verify-static 313 pages; verify-seo passed; text joins 0; `host-smoke.mjs` 16/16; counter check passed.

Two Pages projects carry an `-app` suffix because Cloudflare refused the plain names. Old projects and DNS records are deleted after the live check. Details are in `plan/implementation/releases/R3B.md`.

## 2026-11-12T06:40:00+06:00 — P5.15: directory front door

Branch `phase-5-directory` (from `phase-5-shell`). Directory only; no `apps/*` changes.
- Header nav Apps, Today, Families, About; compact hero (H1 "Free Islamic learning games and tools", two buttons, small crescent mark on phones); static "Tonight on Moongazer" card at `#today`; quick picker chips (`?pick=<id>#library` links, filtered in place by `app.js`); library cards with a 16:9 screenshot slot (`homepage/shots/<slug>.webp` when present, else a styled placeholder), format badge, time, audience; subject guide cards with member logos after the library; empty `#season`; trust row; footer links every app host directly (no short links, D2c).
- `deployment/targets.json` gains `time`, `audience`, `format` (= `kind`) per app; `build.mjs` validates them.
- Fixed a pre-existing break: logo files still had pre-rename names, so 15 card logos 404ed; `render.mjs` now maps slug to logo file. Removed stray literal `{' '}` text from `index.html`. Removed the category filter buttons and search box (superseded by the chips; 16 apps).
- Measured (headless Chrome, 390 x 844): first library card top 703 px, library heading 626 px, no horizontal scroll. Desktop 1440 x 1000: library heading top 722 px (above the fold). JS blocked (CSP `script-src 'none'`): chips are six links and all 16 cards are listed. No script errors, both colour schemes. Chips checked in the browser: kids gives 3 apps, 2 minutes gives 3, prayer and hifz one each.
- Validation: `bun test _implementation/seo.test.ts homepage/tests` 60 pass; text joins 0; `deployment/verify-seo.py` could not run in full here (app `dist/` folders are not built in this worktree). A homepage-only copy passed every per-page SEO, JSON-LD and sitemap assertion on the directory and stopped only at the cross-host link check, which needs the app builds.
- Remaining: screenshots (`homepage/shots/*.webp`) are captured later from the redesigned apps; P6 fills the Tonight card; P7 fills `#season`; run the full `verify-seo.py` after app builds.

## 2026-11-12T06:59:00+06:00 — P5 shared lane: tokens, compact shell, new shared components

Shared-lane tasks T5.4-T5.10, T5.12 (shared part) and T5.13 on branch `phase-5-shared`: family tokens and `config.accent` in all 16 apps; Shell `theme-color` map; compact hero and header with an "All apps" link; `HowItWorks.astro`; `session-end.ts` with tests; learning guide as `<details>`; Arabic typography; print CSS and projector toggle in both `shell.ts` variants; `.is-correct` pulse and `pulseCorrect`; JetBrains Mono v2.304 in eight apps (record in `_implementation/research/fonts/`).
- Validation: verify.ts check 16/16 (0 errors), test 16/16 (315 pass, 0 fail), build 16/16; sync-shared identical; `bun test _implementation/seo.test.ts homepage/tests` 60 pass; verify-static 313 pages; verify-seo passed (17 sites, 323 pages); text-join audit 0; `contrast.py` 0 pairs below 4.5:1. Headless Chrome via `e2e-preview.ts`: all 16 apps at 390 px (no horizontal scroll, logo and name visible, 0 script errors, hero 120-136 px, H1 2.1 rem, `--accent` matches the family) and four family apps at 390 x 844 and 1440 x 1000 in light and dark (desktop H1 3.2 rem); projector toggle checked with and without the `remember` opt-in.
- Open: no app page uses `data-projector`, the drawer, `renderSessionEnd` or `pulseCorrect` yet (per-app lane). The two-line descriptor clamp on phones is a guard until per-app descriptors are shortened. word-groups `.term-tile[aria-pressed=true]` still sets `color:var(--bg)` on an accent fill (per-app CSS; should become `--on-accent`). No push, no deployment.

## 2026-11-12T14:26:59+06:00 — P5 complete (R5)

Orchestrator: the design system (root and directory `DESIGN.md`, contrast script), context rules, the logo and social-card hotfix, the directory honorific font and missing-file check, the Salah reorder, the first-screen sweep, and screenshots.

Subagents:
- One Sonnet agent: the shared lane.
- One Sonnet agent: the directory.
- Two Haiku agents: the per-app `DESIGN.md` files.
- Four Sonnet agents: the per-app wave.

Validation:
- 16/16 check, test and build (343 tests).
- Sync identical; 60 repo tests; verify-static 313; verify-seo passed; text joins 0.
- First-screen sweep 96/96; host smoke 16/16; counter check passed.

Details are in `plan/implementation/releases/R5.md`.

## 2026-11-12T14:37:00+06:00 — C18: ayah of the night list

Branch `content-c18` (from `phase-6-daily`). Content and verifier only; not wired into any page (T6.6 does that).
- `homepage/ayat-of-the-night.json`: 71 records `{ref, arabic, translation, theme}` (single ayat or spans of two), 48 distinct surahs, 12 editorial themes, longest Pickthall text 216 characters. Text is generated by script from `quran-full.json`, never typed. Committed in batches of 10 (C18.01 to C18.08).
- `_implementation/verify-static.py` loads the file, asserts at least 60 records and the record shape, and runs `check_text` (C18.09).
- Research and method: `_implementation/research/daily/ayat-of-the-night.json` (source sha256, refs, themes, Quran MCP calls).
- Validation: `check_text` on the new file passed. App `dist/` folders are not built in this worktree, so the full `verify-static.py` was not run; the new block was executed alone. A separate script confirmed all 71 records equal the snapshot. Quran MCP cross-check of 11 ayat: Pickthall identical; Arabic identical after NFC normalisation, with a combining-mark order difference at byte level that may come from relaying the tool output (unresolved, recorded in the research file).
- Remaining: T6.6 wires the list into the directory. Second pass (separate run) passed text 71/71 and suitability 63/71; the five context-dependent ayat were removed and three were relabelled, leaving 66 (`ayat-of-the-night.verification.json`). Owner spot-check under D2b passed (112:1-2, 33:41, 88:17-18).

## 2026-11-12T17:14:02+06:00 — P6 T6.1 shared daily module

Branch `phase-6-shared`: `src/lib/daily.ts` with `tests/daily.test.ts` and `tests/daily-release.test.ts` in guess-the-surah, ayah-threads, word-groups and seerah-timeline; a `daily` set in `_implementation/sync-shared.ts`; `homepage/daily.js` with `homepage/tests/daily-parity.test.ts`. No app page or behaviour changed. Details in `context/architecture.md`.
- Validation: `bun test` in the four apps passes (one skipped: the release test); `RELEASE=1` makes the release test fail while the epoch is the placeholder; `sync-shared --check` and `--check --set daily` identical; `bun test homepage/tests` 53 pass; `bun run check` 0 errors, 0 warnings in all four apps.
- Remaining: owner picks the real epoch and the release step flips `DAILY_EPOCH_IS_PLACEHOLDER` in all four copies and `homepage/daily.js`; T6.2-T6.6 consume the module. No push.

## 2026-11-12T17:29:25+06:00 — P6 T6.6 Tonight on Moongazer

Branch `phase-6-daily`. The directory's "Tonight" card now holds:
- two puzzle tiles (Guess the Surah #N, Word Groups #N);
- a separate "Ayah of the night" card with exact Arabic, Pickthall's translation and a link to the reference in Is It in the Quran?;
- before launch, a line naming the first day.
Files: `homepage/index.html`, `render.mjs`, `build.mjs`, `app.js` (module), `daily.js`, `styles.css`, `amiri-ayat.woff2`, `_implementation/subset-ayah-font.py`, `homepage/tests/daily-parity.test.ts`, `homepage/preview.mjs` (CSP connect-src 'self', matching production).
- Validation:
  - `node homepage/build.mjs` passes, including the missing-file check.
  - `bun test homepage/tests`: 55 pass.
  - `verify-static.py`: 313 pages.
  - Headless Chrome at 390 × 844, 820, 1060 and 1440, with a page clock before and after the epoch: no overflow and no script errors. Tonight's ayah is fetched and swapped when it differs from the build date. The first library card is at 743 px on phones (limit 844).
- Remaining: T6.8 (Booktube JSON) once the app daily banks are merged; R6 epoch setting.

## 2026-11-12T17:44:30+06:00 - C17 / P7 T7.4: zakat method record

Branch `content-zakat` (from `phase-6-daily`). Research only; no app code. File: `_implementation/research/zakat/method.json`.
- 12 entries (obligation, recipients, rate 1/40, hawl, nisab textual basis, nisab modern conversions, four differences: jewellery, debts, receivables, nisab metal for mixed assets; zakat al-fitr facts, food vs cash) and 5 worked examples for the engine tests (T7.6), each citing its source. Committed as C17.01 (entries 1-10) and C17.02 (entries 11-12, examples).
- Quran: `fetch_grounding_rules` first, then `fetch_quran` and `fetch_translation` (ar-uthmani-hafs, en-pickthall) for 2:43, 9:60, 9:103, 2:267 and 9:34 (9:34 fetched, not used). Text in the record is copied by script from `quran-full.json`. Pickthall matched the MCP output; Arabic matched after normalisation except 9:103 (one extra fatha in the MCP output relayed to this session; unresolved, recorded in the file).
- Hadith: each collection and number opened on sunnah.com with the ego-browser CLI; grading recorded as shown (Bukhari pages show none).
- Positions come only from fatwa-body pages opened in this session: Egypt's Dar al-Ifta, Jordan's General Iftaa' Department, the Mufti of the Federal Territory (Malaysia), the Fatwa Center at Islamweb, Darul Ifta Birmingham. AAOIFI SS 35 is members-only, so no position is attributed to it. Left-out positions and unopened items are listed in the file (`notAccessible`, each entry's `notes`).
- Not done: the second-pass verification (`verification.json`) is a separate run; owner spot-check pending. No scholarly review; the record is educational and neutral.
## 2026-11-12T18:07:51+06:00 — R6 daily games and sharing

`phase-6-daily` is complete (T6.1–T6.10). It was merged to `main` and pushed; CI deploys.
- **Content:** C1, C2, C3, C10 and C18 were each verified by a separate model run, with fixes, and spot-checked by the agent under D2b.
- **Epoch:** `DAILY_EPOCH` is `2026-11-12`.
- **Validation:** all 16 apps pass check, test and build. The other checks passed:
  - `sync-shared` (both sets);
  - `verify-static` (313 pages);
  - text joins (0);
  - `seo.test` (9);
  - `homepage/tests` (55);
  - `verify-seo` (17 sites);
  - first screen (96 of 96);
  - the counter check.
  The details are in `plan/implementation/releases/R6.md`.
- **Not run:** the e2e Playwright flows; the harness is not available here.
- **Remaining:** the production result is recorded in R6 after CI. P7 continues with the zakat method fixes, the Ramadan dates check, then T7.6 and the hub.

## 2026-11-12T23:33:00+06:00 — R7 Ramadan season

`phase-7-season` is complete (T7.4–T7.12; Hifz T7.1–T7.3 shipped in R5). It was merged to `main` and pushed; CI deploys.
- **New app:** Zakat Calculator, the 17th app, at `zakat-calculator.moongazer.tech`. The Pages project, custom domain and proxied CNAME were set up by the agent under D2b. The certificate validates after the first deployment.
- **Hub:** `moongazer.tech/ramadan/` has expected dates from the Umm al-Qura calendar, 30 night cards, the last ten nights, zakat links and a print layout. The directory's seasonal card shows from 2027-01-25 to 2027-03-13.
- **Content:** C16 (30 Family Halaqa Ramadan packs) and C17 (zakat method) were each verified by separate model runs, with fixes and fresh re-checks, and spot-checked by the agent. There was no scholarly review.
- **Validation:** all 17 apps pass check, test and build. The other checks passed:
  - `sync-shared` (all three sets);
  - `verify-static` (349 pages);
  - text joins (0);
  - `seo.test` (9);
  - `homepage/tests` (55);
  - `verify-seo` (18 sites, 360 pages);
  - first screen (102 of 102);
  - the counter check.
  The hub was checked in the browser at phone and desktop widths. The details are in `plan/implementation/releases/R7.md`.
- **Decision:** the plan's `/zakat` short link was left out, because D2c rules out redirects.
- **Remaining:**
  - Escape Room Ramadan rooms (C4).
  - A Family Halaqa series filter and `?night=N`.
  - Removing the retired hosts' sitemaps from Search Console. The new hosts and the zakat sitemap were submitted on 2026-11-12.
  - P8–P10.

## 2026-11-13T01:10:08+06:00 — Redesign: "a window into the night" (R7D)

The owner said the UI looked basic. The agent replaced the visual layer across the 17 apps, the directory and the social cards with a generated art system (`_implementation/art/`) and a new shared CSS layer. `DESIGN.md` §0 records the direction.
- **Validation:** first screen 102/102, the counter check, `verify-static` (349 pages), text joins 0, `seo.test` 9, `homepage/tests` 55 and `verify-seo` (18 sites) all passed. The details are in `plan/implementation/releases/R7D-design.md`.
- **Next:** finish P8, then style the mastery UI in the new language.
