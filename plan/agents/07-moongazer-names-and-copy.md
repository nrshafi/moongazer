# Brief 07 — Moongazer: names, headings, labels and honorifics

**Repository:** `I:\Development\moongazer`
**Depends on:** 06. **Authorized:** ask the owner first, and confirm the new names in the table below. The owner may change any name.
**Goal:** one name per app everywhere (header, H1, card, title, share text), a plain descriptor carrying the search phrase, everyday words in the interface, and consistent honorifics.
**Background:** `../REPORT.md`, A4 (rules, rename table, label table).

## First: update context

Per AGENTS.md, update context before the dependent change:
- `context/ui-context.md`: the naming rules (two layers, one name everywhere, title pattern `Name — descriptor | Moongazer`); the nav-label rule; the honorifics rule.
- `context/project-overview.md`: the implemented-projects table with the new display names. Slugs, ports and hosts are unchanged.
- Each app's `context/project-overview.md` and `context/ui-context.md` where the name appears.

## Renames (hosts and slugs do not change)

| App folder | New name | Descriptor |
| --- | --- | --- |
| guess-the-surah | Guess the Surah | A daily Quran quiz: find the surah from its clues |
| quran-connections | Ayah Threads | Three ayat, one hidden thread: a daily Quran puzzle |
| islamic-concept-connections | Word Groups | Sixteen Quran words, four hidden groups: a daily puzzle |
| islamic-knowledge-escape-room | Quran Escape Room | Rooms of Quran puzzles to solve together |
| is-this-actually-in-the-quran | Is It in the Quran? | Search every ayah in Arabic and English, and check popular claims |
| stories-of-the-prophets-explorer | Stories of the Prophets | The prophets in the Quran: read, reflect and check |
| quranic-parables-studio | Parables of the Quran | The Quran's parables, drawn and explained |
| quranic-places-atlas | Places in the Quran | A map of the places the Quran names, and where certainty ends |
| revelation-context-explorer | Why It Was Revealed | Asbab al-nuzul: the reports behind selected ayat |
| interactive-seerah-timeline | Seerah Timeline | The Prophet's life ﷺ from 610 to 632 |
| the-seerah-detective | Seerah Detective | Solve cases from the Prophet's life ﷺ using the reports |
| islamic-civilization-timeline | Civilization Timeline | Islamic civilization across regions |
| understand-salah-lab | Understand Your Salah | The meaning of every phrase you say in prayer |
| quran-memorization-workload-calculator | Hifz Planner | Plan new memorization and revision around your week |
| everyday-akhlaq-simulator | Everyday Akhlaq | Everyday character dilemmas: choose, then read the sources |
| family-islamic-learning-challenges | Family Halaqa | Ten-minute Islamic activities to do together |

The four apps that brief 10 will merge (Quran Concept Atlas, Islamic History Timeline Challenge, Halal Business Decisions, Islamic Misinformation Casebook) keep their names until then. Only fix their H1/title agreement.

Descriptors that promise features from later briefs ("daily", "check popular claims", "Which came first?") must not go live before those features exist. Use present-tense descriptors now and update them in the brief that ships the feature. For example, Guess the Surah stays "Find the surah from its clues" until brief 09.

## Where names live (change all of them)

- Each app's `src/data/config.json` (`name`, `description`) and `src/data/seo.json` (`title`, `shortName`, descriptions).
- `src/data/learning.json` (`heading`, the related-app names and kinds).
- `src/pages/index.astro` hero (eyebrow, H1, pill, intro).
- `deployment/targets.json` (`name`, `kind`, `description`), then rebuild the directory with `node homepage/build.mjs`.
- `homepage/collections.json`: the reasons and questions that name apps.
- `homepage/index.html`: the featured cards ("Explore the lab" becomes "Open Understand Your Salah").
- Share and copy text inside each app's `src/lib/*.ts`, for example "Islamic Concept Connections · board N".
- Social cards: regenerate the local PNG cards with the existing SEO asset tooling (`deployment/seo-assets.py`), if names appear on them.

## Labels and words

- Apply the label table in REPORT.md A4. For example, "Choose a record" becomes "Choose a case", "Choose a pack" or "Choose a reading", and the "Editorial feedback" labels become plain words.
- One word per thing inside each app: "case" in the Detective; "scenario" in Akhlaq; "parable" in Parables; "event" in the Timeline.
- Nav label: "Play" (games), "Read" (readers), "Plan" (Hifz), "Search" (Is It in the Quran?), instead of "Explore" everywhere.
- Footer and header: keep the tagline "Islamic learning, explored." on desktop only.

## Honorifics

- Add one shared helper per app, copied like the other shell helpers, that renders ﷺ in an Amiri-font span.
- Add ﷺ after "the Prophet Muhammad" and "the Prophet" (meaning him) in editorial text in `src/data/*.json`, page copy and the directory. Today it appears in only four apps.
- Add "(peace be upon him)" after other prophets' names in editorial text where natural, at minimum on first mention per page.
- **Never alter canonical quotations or the named translation.** Re-run `python _implementation/verify-static.py` to prove it.

## Verification

Use the checklist in `00-START-HERE.md`. Also:
- SEO checks (titles, `og:` tags and structured-data names must match the visible H1).
- `node homepage/build.mjs`, then confirm all twenty cards show the new names.
- Browser check of the header at 390 px: the name fits and the logo stays visible. The Family app lost its logo with the old long name.

Record tracker entries and update `00-START-HERE.md`. Do not push.
