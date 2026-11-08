# Islamic Product Lab

## Overview

A portfolio of Islamic learning tools that visitors can use immediately without accounts or personal data histories. Twenty independent Astro/Bun static apps are implemented from the ranked twenty-app shortlist. Each is deployable at the root of a separate Cloudflare Pages project. Earlier standalone HTML demonstrations remain reference prototypes.

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

| Rank | App / project root | Port | Pages | Recorded tests |
| --- | --- | ---: | ---: | ---: |
| 1 | Guess the Surah · `apps/guess-the-surah` | 4321 | 4 | 12 |
| 2 | Quran Connections · `apps/quran-connections` | 4322 | 4 | 8 |
| 3 | The Seerah Detective · `apps/the-seerah-detective` | 4323 | 16 | 8 |
| 4 | Everyday Akhlaq · `apps/everyday-akhlaq-simulator` | 4324 | 24 | 8 |
| 5 | Seerah Timeline · `apps/interactive-seerah-timeline` | 4325 | 40 | 8 |
| 6 | Quran Memorization Workload Calculator · `apps/quran-memorization-workload-calculator` | 4326 | 4 | 14 |
| 7 | Is This Actually in the Quran? · `apps/is-this-actually-in-the-quran` | 4327 | 4 | 13 |
| 8 | Quran Concept Atlas · `apps/quran-concept-atlas` | 4328 | 34 | 10 |
| 9 | The Islamic Knowledge Escape Room · `apps/islamic-knowledge-escape-room` | 4329 | 12 | 11 |
| 10 | Stories of the Prophets Explorer · `apps/stories-of-the-prophets-explorer` | 4330 | 29 | 10 |
| 11 | Quranic Places Atlas · `apps/quranic-places-atlas` | 4331 | 19 | 11 |
| 12 | Islamic Concept Connections · `apps/islamic-concept-connections` | 4332 | 4 | 11 |
| 13 | Islamic History Timeline Challenge · `apps/islamic-history-timeline-challenge` | 4333 | 4 | 11 |
| 14 | Understand Salah Lab · `apps/understand-salah-lab` | 4334 | 19 | 11 |
| 15 | Quranic Parables Studio · `apps/quranic-parables-studio` | 4335 | 18 | 11 |
| 16 | Islamic Civilization Timeline · `apps/islamic-civilization-timeline` | 4336 | 28 | 12 |
| 17 | Halal Business Decisions · `apps/halal-business-decisions` | 4337 | 16 | 12 |
| 18 | Revelation Context Explorer · `apps/revelation-context-explorer` | 4338 | 14 | 12 |
| 19 | Family Islamic Learning Challenges · `apps/family-islamic-learning-challenges` | 4339 | 16 | 12 |
| 20 | Islamic Misinformation Casebook · `apps/islamic-misinformation-casebook` | 4340 | 16 | 12 |

## Features and scope

The collection contains games, source readers, local search and a workload model. Common features are local fonts, light/dark modes, source/privacy/404 pages, optional namespaced storage and static hosting headers. App-local project-overview.md files specify exact content and flows.

In scope: maintenance of the twenty implemented apps and the requested context methodology. Out of scope without a new user request: accounts, databases, runtime AI/API dependencies, identity-based tracking, trusted leaderboards and unrequested automatic publishing to a hosting account.

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
