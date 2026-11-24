# Islamic Product Lab

## Overview

A portfolio of Islamic learning tools that visitors can use immediately without accounts or personal data histories. Thirteen active independent Astro/Bun static apps remain as of 2026-11-25: originally 20 shortlisted apps, 4 were merged and deleted under D2c (12 Nov 2026) leaving 16, the Zakat Calculator was added in P7 (17 apps), and on 2026-11-25 the owner deleted the 4 core-Arabic apps (`understand-your-salah`, `word-groups`, `guess-the-surah`, `is-it-in-the-quran`) outright and moved all remaining 13 apps plus `homepage/` to an English-only UI (displaying Pickthall translations while preserving canonical Arabic in local JSON data). Each app is deployable at the root of a separate Cloudflare Pages project. Earlier standalone HTML demonstrations remain reference prototypes.

## Goals

1. Keep each app useful on first visit with no sign-in, backend or required saved progress.
2. Ship accessible light/dark interfaces and local runtime content/assets.
3. Preserve canonical Quran evidence, primary-source citations, rights notices and explicit editorial limits.
4. Keep app builds, verification and release packages independent and reviewable.

## Core user flow

1. Open an independently hosted app.
2. Complete its game, search, calculation or reading activity.
3. Inspect sources and explanations; optionally save temporary browser state or explicitly export/share.

## Implemented projects

| Rank | App / project root | Display name (from P2) | Port | Pages | Recorded tests |
| --- | --- | --- | ---: | ---: | ---: |
| - | Removed 2026-11-25 (was Guess the Surah · guess-the-surah) | - | 4321 | - | - |
| 2 | Quran Connections · `apps/ayah-threads` | Ayah Threads | 4322 | 35 | 54 |
| 3 | The Seerah Detective · `apps/seerah-detective` | Seerah Detective | 4323 | 16 | 8 |
| 4 | Everyday Akhlaq · `apps/everyday-akhlaq` | Everyday Akhlaq | 4324 | 24 | 8 |
| 5 | Seerah Timeline · `apps/seerah-timeline` | Seerah Timeline | 4325 | 40 | 8 |
| 6 | Quran Memorization Workload Calculator · `apps/hifz-planner` | Hifz Planner | 4326 | 4 | 14 |
| - | Removed 2026-11-25 (was Is It in the Quran? · is-it-in-the-quran) | - | 4327 | - | - |
| - | Removed under D2c (was Quran Concept Atlas) | - | 4328 | - | - |
| 9 | The Islamic Knowledge Escape Room · `apps/quran-escape-room` | Quran Escape Room | 4329 | 12 | 20 |
| 10 | Stories of the Prophets Explorer · `apps/stories-of-the-prophets` | Stories of the Prophets | 4330 | 29 | 10 |
| 11 | Quranic Places Atlas · `apps/places-in-the-quran` | Places in the Quran | 4331 | 19 | 11 |
| - | Removed 2026-11-25 (was Word Groups · word-groups) | - | 4332 | - | - |
| - | Removed under D2c (was Islamic History Timeline Challenge) | - | 4333 | - | - |
| - | Removed 2026-11-25 (was Understand Your Salah · understand-your-salah) | - | 4334 | - | - |
| 15 | Quranic Parables Studio · `apps/parables-of-the-quran` | Parables of the Quran | 4335 | 18 | 11 |
| 16 | Islamic Civilization Timeline · `apps/civilization-timeline` | Civilization Timeline | 4336 | 28 | 12 |
| - | Removed under D2c (was Halal Business Decisions) | - | 4337 | - | - |
| 18 | Revelation Context Explorer · `apps/why-it-was-revealed` | Why It Was Revealed | 4338 | 14 | 12 |
| 19 | Family Islamic Learning Challenges · `apps/family-halaqa` | Family Halaqa | 4339 | 46 | 29 |
| - | Removed under D2c (was Islamic Misinformation Casebook) | - | 4340 | - | - |
| P7 | Zakat Calculator · `apps/zakat-calculator` (new in R7) | Zakat Calculator | 4341 | 6 | 44 |

## Features and scope

The collection contains games, source readers, local search, family packs, and planners/calculators. Common features are local fonts, light/dark modes, source/privacy/404 pages, optional namespaced storage and static hosting headers. App-local project-overview.md files specify exact content and flows.

In scope (updated 2026-11-25): maintenance of the 13 active apps in an English-only UI (displaying Pickthall translations while preserving canonical Arabic in local JSON data and keeping `ﷺ` honorifics) alongside the directory in `homepage/` and the requested context methodology. Out of scope without a new user request: accounts, runtime AI/API dependencies, identity-based tracking, trusted leaderboards and unrequested automatic publishing to a hosting account. The first-party services (P4, `plan/implementation/P4-first-party-services.md`) are in scope: a feedback form, a public corrections log, and three anonymous aggregate event counts, served by Pages Functions on the apex with one D1 database. They are not accounts, and they store no IP addresses or request logs.

All twenty shortlisted projects are implemented. Each app has AGENTS.md and six filled context documents. The current user request authorizes a new Moongazer directory homepage and publication of that homepage plus all twenty apps to Cloudflare Pages on moongazer.tech and individual subdomains.

## Success criteria

1. Each app can be copied, installed, checked, tested and built from its own folder.
2. Core behavior works without stored personal data or external runtime assets.
3. Canonical data, sources and content checksum records stay consistent.
4. Meaningful behavior changes pass relevant tests, type/build checks and browser verification.
5. Context documents identify current behavior, constraints and actual verification, with no template placeholders or invented completion claims.

## Latest portfolio verification

The complete-portfolio E2E audit is `E2E_QA.md`. All twenty apps pass 217 Bun tests; browser verification covers complete representative journeys and all 325 generated pages. Three discovered behavior defects were corrected. Earlier batch QA reports remain historical records.

## Moongazer publication

## Authorized SEO work

The user requested SEO improvements for the complete published collection: the directory and twenty app subdomains. Audit and fix crawlability, page-specific metadata, canonical URLs, crawlable navigation, truthful structured data and social previews. Preserve religious source text and the existing activities. Search Console Domain verification and all 21 sitemap submissions are complete; no indexing or rankings are claimed.

The directory at https://moongazer.tech/ links all twenty apps on full-name subdomains. Each app has its own Pages project. The new HTML/CSS/JavaScript homepage offers search and subject filters without accounts, analytics or storage. Production IDs and verification are in deployment/status.json and DEPLOYMENT_QA.md.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Google Search Console setup, 30 October 2026

Google Search Console is configured as the verified Domain property sc-domain:moongazer.tech. It covers the directory and all twenty app subdomains. All 21 submitted sitemaps show Success, with 286 discovered URLs. This does not establish that those URLs are indexed or ranked. Current evidence is in deployment/search-console.json.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.

## Project DNA and roadmap governance, 8 November 2026

`context/project-dna.md` defines Moongazer's mission, vision as a permanently free digital waqf, Booktube social media companion role, singular focus on interactive Islamic learning and essential worship tools, five rank-ordered core values, Depth Gate, and learning/corrections loop. Future first-party interaction counters (`activity_started`, `activity_completed`, `share_clicked` without `page_view`), the in-app correction/feedback form, and demand-triggered minimal progress-sync accounts are recorded for further technical planning in `plan/FIRST_PARTY_SERVICES_PLAN.md` and are not yet implemented in runtime code.

## Implementation plan to Ramadan 1448, 11 November 2026

After a founder decision interview, `plan/implementation/` holds the authoritative phase-by-phase plan (P1–P10 plus a content track) that replaces briefs 06–15 and the strategic decisions document as instructions. Pre-freeze scope (code freeze 15 January 2027): trust fixes, names and honorifics, four two-step merges, first-party feedback and counter services, the activity-first shell and directory, daily games, Hifz Planner, Zakat Calculator, the Ramadan hub, the Diagnostic Mastery Loop in four apps, and the Depth Gate for all active apps. Confirmed phases are authorized for local work; every production action still needs the owner's explicit request.

## Portfolio pruning and English-only UI scope, 25 November 2026

Owner decisions confirmed on 2026-11-25 (Asia/Dhaka):
1. **Delete 4 core-Arabic apps outright:** `understand-your-salah`, `word-groups`, `guess-the-surah`, and `is-it-in-the-quran` are removed with no redirects, leaving 13 active apps (`ayah-threads`, `civilization-timeline`, `everyday-akhlaq`, `family-halaqa`, `hifz-planner`, `parables-of-the-quran`, `places-in-the-quran`, `quran-escape-room`, `seerah-detective`, `seerah-timeline`, `stories-of-the-prophets`, `why-it-was-revealed`, `zakat-calculator`).
2. **English-only UI across all remaining surfaces:** Remove Arabic text rendering from all 13 active app UIs and `homepage/`, displaying Pickthall translations in the UI while preserving `ﷺ` honorifics (`Honorific.astro` / `withHonorifics()`) and preserving canonical Arabic in local JSON snapshots/data (`src/data/content.json`, `homepage/ayat-of-the-night.json`, `_implementation/research/quran-full.json`) for static verification. Update affected tests, targets, catalog, and checkers accordingly.
