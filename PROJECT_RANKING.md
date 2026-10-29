# Islamic product ranking

The user's current requirement is static Cloudflare Pages apps with optional temporary browser storage. Use [the revised 20-app shortlist](STATIC_APPS_SHORTLIST.md) for the current selection. The general ranking below remains background research.

Prepared 27 October 2026. This is the original general assessment. The first fifteen projects from the revised static shortlist are now implemented; see [DEPLOYMENT.md](DEPLOYMENT.md). The other five shortlisted apps are deferred.

## Scope and method

The original atlas contains 85 concepts. The demo catalog contains 27 of those concepts. This ranking considers all 85 and marks the 27 existing demos. A demo is a starting point, not a finished application.

This is a product judgment informed by comparable products, not a measured popularity forecast. There is no traffic, retention, conversion, keyword-volume, or customer-interview data for these projects. Nearby ranks are effectively ties.

The decision priorities, in order, are the size and clarity of the user need, reasons to return, natural sharing or invitations, differentiation from existing products, and the effort needed to deliver dependable content and functionality. Development effort includes content preparation, licensing, editorial review, infrastructure, and ongoing operation. Category-level cost and difficulty labels in the old atlas were not treated as verified estimates.

Assumed audience: mobile users, primarily English-speaking learners, families, and students. Bangla support is a possible differentiator to validate. The ordering may change for a Bangla-only audience, a school-only product, or a revenue-first objective.

The recommended 10 balance useful daily tools, games people can share, and family or classroom learning. Closely overlapping concepts rank lower when another recommended project already covers the same need. For example, the memorization workload calculator can support the Hifz planner, and the two Prophets story explorers substantially overlap.

## Evidence behind the recommendations

- [Tarteel on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=com.mmmoussa.iqra) displays 10M+ downloads and describes memorization, review, and mistake detection. This is evidence for the memorization category and a strong incumbent, not proof that a new planner will acquire users.
- [Quranic's official site](https://www.getquranic.com/) reports 1M+ downloads and offers vocabulary practice, story lessons, quizzes, and family features. Its figures are the publisher's claims. This supports vocabulary and short learning sessions as established product categories.
- [Namaz on Google Play](https://play.google.com/store/apps/details?id=com.nurios.namazapp) displays 1M+ downloads and offers prayer learning with audio and text. It supports demand for prayer education, though understanding prayer meanings is a distinct use case that still needs validation.
- [Quran Era's FAQ](https://quranera.com/FAQ.html) describes a paid family and school product with 100+ games for children aged 4 to 12. It establishes an existing business model and considerable content competition. It does not establish willingness to pay for our product.
- [QuranGuessr's daily game](https://www.quranguessr.com/play) demonstrates a competing daily Quran identification format. We did not obtain its audience or revenue figures. Guess the Surah needs a clear difference, such as progressive theme clues and explanations.
- [Quran.com](https://quran.com/) already provides search, translations, tafsir, audio, and word-by-word study. Generic Quran search and AI chat face substantial existing alternatives.
- [The Quranic Arabic Corpus search guide](https://corpus.quran.com/searchhelp.jsp) documents root, morphology, phrase, and concept search. Arabic research tools need a specific teaching advantage over existing resources.

Sources were accessed on 27 October 2026. Store listings can differ by region and change over time. Install counts are cumulative category signals, not active-user counts or forecasts.

## Recommended 10

| Rank | Project | Why I would select it | Main constraint | Existing demo |
| --- | --- | --- | --- | --- |
| 1 | Quran Vocabulary Trainer | A clear learning goal, short daily sessions, and spaced review give learners a reason to return. | Strong competitors; needs a better learning path or language focus. | No |
| 2 | Guess the Surah | Easy to explain, quick to play, and well suited to daily challenges and shareable results. | Similar games already exist; clue quality determines replay value. | Yes |
| 3 | Hifz Revision Planner | Solves a recurring scheduling problem and can become part of a student's routine. | Must handle missed days and growing review loads realistically. | No; related workload calculator exists |
| 4 | Islamic Knowledge Duels | Friend invitations create a natural distribution path; rematches support repeat play. | Needs reviewed questions and server-verified results. | Yes |
| 5 | Family Islamic Learning Challenges | Gives parents a ready-made shared activity and a reason to recommend it to other families. | Needs age-appropriate content with enough variety. | Yes |
| 6 | Understand Salah Lab | A concrete learning outcome for beginners and people who want to understand familiar recitations. | Needs accurate explanations, licensed audio, and a focused learning sequence. | No |
| 7 | Quran Connections | A short puzzle can encourage daily play while teaching relationships between passages. | Theme links can be subjective; explanations must show the intended reasoning. | Yes |
| 8 | Stories of the Prophets Explorer | Familiar subjects can attract families and teachers; chapters give users a learning path. | Content depth and careful sourcing require substantial work. | Yes |
| 9 | The Islamic Knowledge Escape Room | An engaging group format with potential for school lessons and shared room invitations. | Room production costs more than simple quiz production. | Yes |
| 10 | Interactive Seerah Timeline | A visual reference can serve students, parents, and teachers and attract topic searches. | Likely less daily use; sources and date uncertainty need careful treatment. | Yes |

Seven recommended projects have exact demos. Three are atlas concepts without exact demos. The existing workload calculator can contribute to the Hifz planner.

## What a complete first release would include

These are proposed boundaries to help choose projects. Content quantities and release acceptance checks will be fixed after selection. They are not claims that this work is already complete.

1. **Quran Vocabulary Trainer.** A defined vocabulary syllabus, sourced verse examples, Arabic rendering, meaning exercises, spaced repetition, review queues, progress, offline study, and backup/export. Validate whether English, Bangla, or both should lead. The learning schedule and word meanings need separate correctness checks.
2. **Guess the Surah.** A reviewed clue bank covering all 114 surahs, deterministic daily challenges, practice mode, progressive hints, scoring, answer explanations, streaks, accessible mobile controls, and shareable results. Check factual clues against their sources and prevent the daily answer from changing unexpectedly.
3. **Hifz Revision Planner.** Memorized-range tracking, configurable new-study and review targets, workload estimates, missed-day rescheduling, completion and difficulty logs, calendar export, and data backup. The schedule should remain useful without speech recognition. Check schedule feasibility across long plans and interrupted weeks.
4. **Islamic Knowledge Duels.** Private challenge links, asynchronous matches, reviewed topic packs, difficulty settings, authoritative server scoring, match history, rematches, and abuse limits. Verify that the client cannot submit an invented final score and that invitations expire predictably.
5. **Family Islamic Learning Challenges.** Age bands, a structured activity library, guided discussion, family progress, printable activities, parent controls, and optional household sync. Collect only the household information the product actually needs. Test the activity flow with parents and children in the intended age bands.
6. **Understand Salah Lab.** A defined curriculum of prayer recitations, phrase-level meanings, licensed human audio, matching and recall exercises, lesson progress, review, and offline lessons. Show the source and any relevant variation beside the lesson. Check Arabic, audio alignment, and meanings together.
7. **Quran Connections.** A substantial reviewed puzzle bank, daily and practice modes, visible passage references, explainable intended themes, hints, progress, and spoiler-free result sharing. Support reasonable alternative interpretations in the content review process. Validate that puzzles are solvable from the displayed material.
8. **Stories of the Prophets Explorer.** A declared set of prophets and chapters, cited narratives, reading progress, comprehension activities, glossary, bookmarks, and teacher or family reading paths. Clearly distinguish Quranic passages, reported material, and editorial explanation. Verify every chapter against its cited sources.
9. **The Islamic Knowledge Escape Room.** Multiple complete rooms, a room sequence, source-linked clues, hints, save/resume, optional timers, and a usable group-play flow. Avoid requiring specialist knowledge that the room does not teach. Verify each solution, hint sequence, and resumed game state.
10. **Interactive Seerah Timeline.** A defined chronology spanning the selected life stages, search and filters, event details, citations, date uncertainty, place context, bookmarks, and classroom presentation or print mode. Maps should distinguish documented locations from uncertain identifications. Check chronological ordering and source consistency.

For the selected set, release acceptance should cover complete user flows, the declared content scope, useful empty and error states, keyboard and mobile access, data recovery, security for any account or multiplayer service, and documented deployment. A collection of sample screens would not meet this scope.

## Full ranking of all 85 concepts

The rationale column explains the relative opportunity or the reason to defer. It is an assessment, not a measured market result.

| Rank | Project | Existing demo | Rationale |
| --- | --- | --- | --- |
| 1 | Quran Vocabulary Trainer | No | Strong daily learning loop and a clear personal outcome. |
| 2 | Guess the Surah | Yes | Simple daily game with natural result sharing. |
| 3 | Hifz Revision Planner | Related only | Recurring practical need and useful personal history. |
| 4 | Islamic Knowledge Duels | Yes | Invitations and rematches support discovery and return visits. |
| 5 | Family Islamic Learning Challenges | Yes | Parents can adopt and recommend a shared routine. |
| 6 | Understand Salah Lab | No | Clear learning goal with a broad beginner audience. |
| 7 | Quran Connections | Yes | Distinct short puzzle format with explanation-led learning. |
| 8 | Stories of the Prophets Explorer | Yes | Strong family and classroom fit if chapters are substantial. |
| 9 | The Islamic Knowledge Escape Room | Yes | Memorable group activity with reusable educational rooms. |
| 10 | Interactive Seerah Timeline | Yes | Useful visual reference with search and teaching opportunities. |
| 11 | Is This Actually in the Quran? | Yes | A specific source-checking task with shareable findings; matching is difficult. |
| 12 | Islamic Concept Connections | Yes | Accessible daily puzzle, though it overlaps Quran Connections. |
| 13 | Quran Memorization Workload Calculator | Yes | Useful acquisition tool; stronger as part of the Hifz planner. |
| 14 | The 1000 Question Journey | Yes | Progression supports return visits; a large reviewed bank is expensive. |
| 15 | Arabic Root Quest | No | Game-based vocabulary learning, overlapping the trainer's learning path. |
| 16 | Tajweed Rules Visual Lab | No | Practical learning need; depends on accurate annotated audio. |
| 17 | Meaning-Based Quran Search | No | Useful discovery task; language evaluation and incumbent competition are substantial. |
| 18 | Everyday Akhlaq Simulator | Yes | Relatable scenarios for families and classes; answers need nuance. |
| 19 | Quran Concept Atlas | Yes | Useful thematic discovery, with editorial links as the main content burden. |
| 20 | Islamic History Timeline Challenge | Yes | Easy classroom adoption and short rounds; less routine personal use. |
| 21 | Quran Word Search | Yes | Familiar and inexpensive gameplay; limited differentiation by itself. |
| 22 | Islamic Quote Source Finder | No | Clear verification need, with a much wider and harder source domain. |
| 23 | Quranic Parables Studio | Yes | Strong lesson format for teachers; a finite content collection. |
| 24 | The Seerah Detective | No | Appealing investigation format with demanding case research. |
| 25 | Zakat Scenario Calculator | Yes | Clear practical task and seasonal discovery; reviewed policies are essential. |
| 26 | One Root, Many Meanings | No | A useful lesson format that could extend the vocabulary trainer. |
| 27 | Quran Verse Jigsaw | No | Familiar memorization practice; exact text and Arabic interaction need care. |
| 28 | Digital Muslim Ethics Lab | No | Relatable contemporary cases; needs a clear distribution channel. |
| 29 | Islamic Geometric Pattern Studio | No | Shareable creations and appeal beyond religious study; uncertain learning retention. |
| 30 | Arabic Morphology Sandbox | No | Hands-on learning for motivated students; linguistic data work is substantial. |
| 31 | Quran Study Circle Workspace | No | Group invitations and recurring assignments; needs organizers and reliable collaboration. |
| 32 | Tafsir Comprehension Challenge | No | Structured study practice; depends on licensed excerpts and careful question review. |
| 33 | Islamic Finance Fundamentals Lab | No | Useful specialist education with a clearer learner outcome than a general reference. |
| 34 | Quranic Stories Explorer | No | Promising but substantially duplicates the recommended Prophets explorer. |
| 35 | Revelation Context Explorer | Yes | Valuable context for study; report reliability and disagreements require editorial work. |
| 36 | Quranic Places Atlas | Yes | Visual discovery value; uncertain identifications limit definitive mapping. |
| 37 | Islamic Civilization Timeline | No | Broad teaching resource but less focused than the Seerah timeline. |
| 38 | Conflict Resolution Scenarios | Yes | Useful facilitated activity; harder to establish direct consumer demand. |
| 39 | Comparative Tafsir Explorer | No | Useful to committed students; licensing and editorial presentation are demanding. |
| 40 | Quran Knowledge Graph | No | Attractive exploration, but graph navigation alone gives a weak reason to return. |
| 41 | Quran Research Copilot | No | Broad usefulness, strong incumbents, and a demanding citation-evaluation problem. |
| 42 | Translation Detective | No | A focused Arabic study exercise with a narrower audience. |
| 43 | Journey Through Islamic Civilizations | No | Interesting episodic learning with high content production needs. |
| 44 | Seerah Geography Explorer | No | Good companion to the timeline; weaker as a separate recurring product. |
| 45 | Halal Business Decisions | Yes | Relevant business cases, but transaction-specific questions need specialist review. |
| 46 | Quran Recitation Coach | No | Strong category demand; dependable speech feedback is a major technical undertaking. |
| 47 | Missed Fast Planning Tool | No | A simple personal utility with seasonal use and limited sharing. |
| 48 | Quran Sentence Builder | No | Useful guided practice; overlaps verse jigsaw and needs strong language instruction. |
| 49 | Arabic Grammar Puzzle Grid | No | Engaging for existing Arabic students; narrower beginner appeal. |
| 50 | Islamic Terminology Map | Yes | Helpful reference that may work better inside learning products. |
| 51 | Quran Question Trail | No | Guided discovery could work, but its advantage over search is not yet specific. |
| 52 | AI Quran Quiz Generator | No | Could help teachers prepare; every output still needs factual and answer review. |
| 53 | Surah Structure Puzzle | No | Interesting advanced learning; thematic boundaries can be interpretive. |
| 54 | Quran Translation Comparison Lab | No | Useful research tool facing established side-by-side readers. |
| 55 | Zakat Case Study Simulator | Yes | Good educational supplement; overlaps the calculator and needs reviewed policy cases. |
| 56 | Inheritance Share Learning Simulator | Yes | Clear teaching value; complete rule coverage is substantially harder than demo arithmetic. |
| 57 | Hadith Methodology Lab | No | Valuable introductory course with a specialist audience. |
| 58 | Muslim Scholars’ Lives | No | Good biographical lessons; considerable research for a less frequent use case. |
| 59 | Islamic Scholars Network | Yes | Interesting reference; relationship verification and graph usability are demanding. |
| 60 | Quran Linguistics Observatory | No | Useful to advanced learners; limited mass-market learning flow. |
| 61 | Muslim Scholars Through Time | No | Similar learning value to biographies and the scholars network; duplicates their scope. |
| 62 | Historic Mosque Atlas | No | Visual and searchable topics, with uncertain repeat use and image-rights work. |
| 63 | Hijri Calendar Moon Lab | No | Good seasonal education; astronomical modeling needs independent verification. |
| 64 | Islamic Lunar Date Comparison | No | Clear narrow utility with limited differentiation and return use. |
| 65 | Scholar and Discovery Matching | No | Easy classroom game; disputed contribution claims need care. |
| 66 | A Day in Historical Baghdad | No | An appealing one-off experience with substantial scene research and writing. |
| 67 | Quranic Geography Explorer | No | Substantial overlap with Quranic Places Atlas. |
| 68 | Civilization Builder | No | Broad game appeal, but simulation depth and content make it a large project. |
| 69 | Islamic Misinformation Casebook | Yes | Useful educational cases; sustained audience acquisition and updating are uncertain. |
| 70 | Tafsir Difference Explorer | No | Specialist comparison workflow with demanding attribution and disagreement handling. |
| 71 | Quran Data Analytics Platform | No | Broad technical concept without a single clear mainstream user task. |
| 72 | Hadith Narrator Network | Yes | Specialist value; trustworthy identities and transmission data require deep review. |
| 73 | Quran Theme Distribution Explorer | No | Interesting analysis whose results depend heavily on editorial annotations. |
| 74 | Historical Hajj Route Atlas | No | Attractive research and classroom resource with infrequent use. |
| 75 | Islamic Knowledge Routes | No | Interesting historical connections but a narrow recurring user need. |
| 76 | History of the Quranic Manuscript | No | Valuable educational subject with difficult source and image preparation. |
| 77 | Quran Search Algorithm Lab | No | Good developer or research demonstration; limited consumer audience. |
| 78 | Arabic Morphology Workbench | No | Specialist experimentation that overlaps the more approachable sandbox. |
| 79 | Usul al-Fiqh Concepts Lab | No | Serious study value, but substantial teaching depth for a narrow audience. |
| 80 | Islamic History Data Lab | No | A diffuse research workflow with expensive data normalization. |
| 81 | Hadith Collection Analytics | No | Specialist research utility, dependent on usable licensed datasets and methodology. |
| 82 | Historical Manuscript Comparison | No | Narrow specialist use and difficult image, transcription, and rights preparation. |
| 83 | Collaborative Quran Topic Maps | No | Needs contributors, moderation, and reliable editorial decisions before network value appears. |
| 84 | Islamic Knowledge Contribution Hub | No | Requires both contributors and reviewers; difficult to start with an empty community. |
| 85 | Community Islamic History Archive | No | Worthwhile local preservation, but fragmented participation and permissions complicate broad popularity. |

## If selection is limited to the 27 existing demos

Use this order. The first 10 are the recommended shortlist under that restriction.

| Demo rank | Overall rank | Project |
| --- | --- | --- |
| 1 | 2 | Guess the Surah |
| 2 | 4 | Islamic Knowledge Duels |
| 3 | 5 | Family Islamic Learning Challenges |
| 4 | 7 | Quran Connections |
| 5 | 8 | Stories of the Prophets Explorer |
| 6 | 9 | The Islamic Knowledge Escape Room |
| 7 | 10 | Interactive Seerah Timeline |
| 8 | 11 | Is This Actually in the Quran? |
| 9 | 12 | Islamic Concept Connections |
| 10 | 13 | Quran Memorization Workload Calculator |
| 11 | 14 | The 1000 Question Journey |
| 12 | 18 | Everyday Akhlaq Simulator |
| 13 | 19 | Quran Concept Atlas |
| 14 | 20 | Islamic History Timeline Challenge |
| 15 | 21 | Quran Word Search |
| 16 | 23 | Quranic Parables Studio |
| 17 | 25 | Zakat Scenario Calculator |
| 18 | 35 | Revelation Context Explorer |
| 19 | 36 | Quranic Places Atlas |
| 20 | 38 | Conflict Resolution Scenarios |
| 21 | 45 | Halal Business Decisions |
| 22 | 50 | Islamic Terminology Map |
| 23 | 55 | Zakat Case Study Simulator |
| 24 | 56 | Inheritance Share Learning Simulator |
| 25 | 59 | Islamic Scholars Network |
| 26 | 69 | Islamic Misinformation Casebook |
| 27 | 72 | Hadith Narrator Network |

## Tools and implementation follow-through

The ranking used local filesystem inspection, the atlas dataset, the demo manifest, project documentation, and web research. The Ego Browser command was unavailable, so research used the available web tool. No new product implementation or deployment has started.

After selection, choose the implementation tools from the actual requirements. Check current library documentation, use browser automation for complete flows, and use relevant connected MCP services for source access, repository work, and hosting when needed. A Quran data integration must be checked for access, coverage, and reuse rights before choosing it. The availability of an MCP server does not by itself establish a usable dataset or a production dependency.

For 10 related applications, a shared codebase with separate routes and reusable content, storage, and accessibility components is the starting recommendation. Add a server where a feature needs authoritative state, such as duels or cross-device sync. The final selection will determine whether any projects need separate services.

Reply with 10 project names or overall rank numbers. If choosing from the demo-only table, say "demo ranks" so the numbering is unambiguous. Replacements and a different order are welcome. The final list will determine implementation scope.
