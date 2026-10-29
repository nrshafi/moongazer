# 20 apps for static Cloudflare Pages hosting

Updated 28 October 2026. All twenty entries have independent Astro implementations using Bun, including AGENTS.md and six filled context documents per app. See [DEPLOYMENT.md](DEPLOYMENT.md) for the apps and upload packages, and [BATCH4_QA.md](BATCH4_QA.md) for the final batch. This shortlist replaces the earlier general ranking for the user's current requirements.

## Selection rules

Each app must deliver its main benefit immediately, without an account, personal history, or a daily tracking habit. All calculations, search, games, and rendering run in the browser. Content, images, fonts, and any audio ship as static assets. Optional localStorage can remember a small amount of temporary state. No server-side database, Pages Functions, Workers runtime, API key, paid inference, or live third-party API is required for the versions described here.

The ranking considers likely audience appeal, practical usefulness, sharing potential, differentiation, and the effort needed to finish the app under these constraints. It is a product assessment, not measured demand for these individual projects. The technical fit does not mean the existing demos have complete release content.

## Ranked shortlist

| Rank | Atlas project | What a visitor can do immediately | How the static version works | Exact demo exists |
| --- | --- | --- | --- | --- |
| 1 | Guess the Surah | Reveal clues, identify a surah, see explanations, and share a result. | Bundled clue bank, practice rounds, browser scoring, and optional same-puzzle links. No daily streak is needed. | Yes |
| 2 | Quran Connections | Find the theme connecting passages and learn why they belong together. | Prewritten puzzles, passage references, hints, and reviewed explanations. | Yes |
| 3 | The Seerah Detective | Investigate a historical question, examine evidence cards, and identify the best-supported explanation. | Prewritten source-based cases, clue cards, and browser answer validation. Explanations distinguish evidence from inference. | No |
| 4 | Everyday Akhlaq Simulator | Choose responses to everyday situations involving honesty, anger, promises, and family relationships, then explore consequences. | Bundled branching scenarios, sourced teaching notes, and local interaction. No personal journal or AI advice. | Yes |
| 5 | Interactive Seerah Timeline | Browse a chronology, filter events, and open sources and place context. | Bundled reviewed event records, citations, and static illustrations or maps. | Yes |
| 6 | Quran Memorization Workload Calculator | Enter a goal and time budget, estimate study and revision time, and export a plan. | Browser calculations and downloadable output. No ongoing memorization account or revision tracker. | Yes |
| 7 | Is This Actually in the Quran? | Search a claimed quotation and inspect matching verses and translation sources. | A complete licensed Arabic corpus and selected licensed translations searched locally. Report coverage and unresolved wording clearly; a failed match is not proof that an idea is absent. | Yes, four-verse sample only |
| 8 | Quran Concept Atlas | Select a theme and follow its links to supporting passages. | A bundled editorial topic-to-verse index, local search, and a navigable graph or list. No AI-generated interpretations. | Yes |
| 9 | The Islamic Knowledge Escape Room | Solve a complete educational room, use hints, and share the room link. | Prewritten rooms and a browser puzzle engine. Single-device solo or group play; no synchronized online room. | Yes |
| 10 | Stories of the Prophets Explorer | Open a sourced chapter, explore its sequence, and answer comprehension questions. | Statically published chapters, illustrations where appropriate, citations, and exercises. | Yes |
| 11 | Quranic Places Atlas | Explore locations, linked passages, historical context, and identification uncertainty. | Bundled coordinates and source records over a local SVG map. No external map or tile service. | Yes |
| 12 | Islamic Concept Connections | Group terms into categories and reveal explanations. | A curated local puzzle bank and browser validation. Distinguish its term-grouping mechanic from Quran Connections. | Yes |
| 13 | Islamic History Timeline Challenge | Put events in order and see the historical explanation. | Sourced event packs, local ordering, accessible controls, and local scoring. | Yes |
| 14 | Understand Salah Lab | Select a prayer recitation, explore phrase meanings, listen, and test comprehension. | Bundled lessons and short licensed audio files. Lessons work without saved progress. | No |
| 15 | Quranic Parables Studio | Explore Quranic parables through diagrams, guided explanations, and reflection questions. | Bundled passages, reviewed explanations, interactive SVG diagrams, and browser comprehension checks. | Yes |
| 16 | Islamic Civilization Timeline | Explore major scholarly, cultural, and political developments by era, region, and topic. | Bundled sourced event records, interactive chronology, local filters, and static maps. Covers civilizations beyond the Seerah timeline's scope. | No |
| 17 | Halal Business Decisions | Work through fictional dilemmas involving contracts, disclosure, pricing, and fair dealing, then inspect the consequences and sources. | Prewritten branching cases, reviewed explanations, and local browser state. Educational cases do not issue personalized rulings. | Yes |
| 18 | Revelation Context Explorer | Open a passage and examine reliable reports about its circumstances and historical context. | Bundled source-linked reports with attribution, reliability notes, and disagreements where relevant. Distinguish a transmitted occasion of revelation from general historical context. | Yes |
| 19 | Family Islamic Learning Challenges | Choose an age-appropriate quiz, discussion prompt, or shared activity and complete it together in one sitting. | Bundled reviewed activity packs, age and topic filters, printable prompts, and optional temporary browser progress. No family accounts, child profiles, or ongoing tracking are needed. | Yes |
| 20 | Islamic Misinformation Casebook | Investigate a documented claim, inspect evidence, and reveal an explanation of what the sources support. | Prewritten cases and source excerpts, browser filters, and evidence-reveal interactions. A curated learning resource rather than live judgment of arbitrary claims. | Yes |

Seventeen have exact demos in the current folder. The Seerah Detective, Understand Salah Lab, and Islamic Civilization Timeline are ideas in the original atlas without exact demos.

At the user's request, entries 3, 4, and 15 replace Islamic Geometric Pattern Studio, Zakat Scenario Calculator, and Quran Word Search respectively. Numbering follows the previous 15-app shortlist.

The list has 20 projects. Entries 16, 17, and 19 are Islamic Civilization Timeline, Halal Business Decisions, and Family Islamic Learning Challenges respectively. All twenty are implemented in separate `apps/` folders. The demo column refers to the earlier standalone HTML prototypes.

## Storage behavior

- Every app works with localStorage unavailable or empty.
- Keep active inputs and game state in memory first. Save only small preferences, unfinished rounds, or optional bookmarks when useful.
- If temporary persistence is enabled, use a timestamp and an application-level expiry, proposed at 30 days. Check expiry on opening the app and before reading stored state. localStorage has no automatic time-to-live, and an inactive site's stored bytes are not guaranteed to disappear on a calendar date.
- Offer a clear saved-data control. Scenario choices stay anonymous and local.
- Use downloaded files for workload plans. Saved browser state is optional convenience rather than a requirement for getting a result.

## Hosting and content

One Pages project can serve a catalog and all 20 tools at separate paths. Each tool can also be packaged independently. Publish HTML, CSS, JavaScript, and content assets, with no runtime server component. Code or content updates require rebuilding if applicable and redeploying the static files.

Cloudflare documents support for plain static HTML sites in its [static HTML deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/). Its [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) currently specify 20,000 files on the Free plan and a maximum individual asset size of 25 MiB. Split large corpora, audio, or map resources into appropriately sized files. These limits were checked through Cloudflare's documentation MCP and official web documentation on 27 October 2026.

Core app behavior should use only assets from the deployed site. External source links are optional reading. Religious text, translations, audio, event records, and puzzle explanations need suitable reuse rights and review before release. For the quotation checker, full corpus coverage is an implementation requirement; its existing four-verse sample is insufficient.

Public competitive scores are outside the scope. A visitor can inspect client-side answers and modify local scores. Shareable results are informal and do not require trusted leaderboards.

This is the selection record. All twenty Astro applications are implemented and packaged for Cloudflare Pages. No Cloudflare account deployment has been performed.
