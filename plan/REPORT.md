# Moongazer growth and naming report, plus Booktube Islamic rules

Prepared 7 November 2026 (Asia/Dhaka). Read-only research; nothing has been changed yet.

**How this folder works.** This file is the complete report, written for the owner. The `agents/` folder holds the same plan split into numbered briefs, in the order agents should carry them out. Agents start at `agents/00-START-HERE.md`. Booktube briefs 01–05 carry decisions the owner has already made. Each Moongazer brief, 06 onward, needs the owner's go-ahead before an agent starts it.

## Context

Moongazer (moongazer.tech) is a published directory of twenty free, static Islamic learning apps, each on its own full-name subdomain. The apps are carefully sourced and technically solid: 217 tests, 325 verified pages, per-host sitemaps, Search Console verified. What they are not yet is *attractive*: they look alike, lead with caveats, hide the activity below the fold on phones, give people no reason to come back tomorrow, and carry long, uneven names. The user asked for a bold plan covering naming, the layout of each app, value to add, and what to add or remove.

Separately, the user wants Islamic rules for the Booktube video-production repository (`I:\Produce_AB\booktube`): agents must remind the user when a requested video, asset, topic or income path is haram or doubtful, and the repository must get an Islamic-rules context file that `AGENTS.md` makes agents read. Existing haram or doubtful material should be flagged for removal.

Deliverables after approval:

1. This report saved into the Moongazer repo as `MOONGAZER_GROWTH_REPORT.md`, with a progress-tracker entry. No Moongazer product code changes: per the repo's AGENTS.md, a documentation update does not authorize features. The user picks which recommendations to build next.
2. In Booktube:
   - a new `context/islamic-guidelines.md` and decision log
   - `AGENTS.md`, `CLAUDE.md` and `GEMINI.md` updated so agents read the guidelines first
   - the stage skills and channel profiles rewritten to apply them
   - an `islamic` review attestation and validator checks in code
   - permanent deletion of the flagged music, bell and meme sounds, the frozen compositions, the presenter character and their renders (exact list in B4)

# Part A — Moongazer: making twenty careful apps attractive

## A1. The short version

Moongazer has earned the hard part: sourced content, exact Quran text, privacy by design, fast static pages. The weak part is the invitation. The bold moves, in order of impact:

1. **Lead with the activity, not the caveats.** On a phone, the first screen of every app must show something to tap. Today several apps show a heading, a paragraph, a facts panel, a caveat paragraph and a filter form before any content. Move limits into one "How this works" drawer and keep one line of limits beside results.
2. **Rename for memory, then describe for search.** Short product names (two or three words, no "Islamic", no "The", no Explorer/Studio/Lab jargon unless the format is the hook) with a plain descriptor line that carries the keywords. Keep the existing subdomains for now and add short share links such as `moongazer.tech/surah`.
3. **Cut twenty apps to sixteen stronger ones, then add four that people already search for.** Fold the Concept Atlas, the Timeline Challenge, Halal Business Decisions and the Misinformation Casebook into the apps they duplicate. Add Quran Words (the vocabulary trainer your own ranking put at #1 and never built), Names of Allah, a Zakat Calculator and Alif Ba (the Arabic letters), and turn the memorization calculator into a real Hifz Planner. The collection stays at twenty, with no thin duplicates.
4. **Give every game a daily number.** A date-seeded puzzle (#1, #2, #3…) works on a static site, gives everyone the same board, and makes results worth sharing. Add spoiler-free share text and a WhatsApp share button.
5. **Make each app look like itself.** All twenty share the same hero, the same star watermark and the same heading style; only a small logo and accent change. Give each subject family its own colour and geometric motif and each app its own hero illustration.
6. **Turn the directory into a front door.** Add a "Tonight on Moongazer" strip (today's surah puzzle, today's board, an ayah of the day), a quick picker ("2 minutes", "with my kids", "for my class"), real app previews on the cards, and a seasonal slot.
7. **Build for Ramadan 1448 now.** Ramadan is expected to begin around 8 February 2027 (subject to moon sighting), about thirteen weeks away. A Ramadan hub with a juz-a-day surah game, nightly family packs and a Zakat Calculator is the single largest audience moment of the year. Ship by mid-January.
8. **Publish a Bangla edition of the five strongest apps.** The owner works in Bangladesh, and Bangla-speaking Muslims are a very large audience with few interactive web tools in their language. It is a real differentiator against English-first incumbents.
9. **Show a human and a review trail.** Name the maintainer, recruit one or two qualified reviewers, state per app what has been reviewed, keep a public corrections log, and use honorifics (ﷺ) consistently.
10. **Use Booktube to distribute.** Under the Islamic rules in Part B, the video pipeline can turn existing Moongazer content into short videos ("Guess the surah in three clues") that end on a Moongazer short link.

## A0. Fix first: defects that cost trust

These are bugs found in the source survey, not opinions. Fix them before any redesign; several give answers away or put the wrong app's text on a page.

| # | App(s) | Defect | Evidence |
| --- | --- | --- | --- |
| 1 | 10 of 20 apps | **Sources pages are copied boilerplate that describe other apps.** Guess the Surah's sources page talks about hadith and a timeline; the Escape Room's talks about the prophets library and the calculator; four apps carry Salah-specific text. For a product whose promise is "sources one tap away", this is the most damaging defect. | Two shared `src/pages/sources.astro` variants (one per batch of five) |
| 2 | Escape Room | Lock 1 is checked against the room's own name, which is the page H1 and card title. Each card's description is the same text as the hint. Lock 4's distractors always come from the Patience room. Shuffle seeds are fixed, so replays are identical. | `islamic-knowledge-escape-room/src/lib/app.ts:27`, `:13-14` |
| 3 | Concept Atlas → Quran Connections | The Atlas uses the same 30 themes and references as Quran Connections and prints every theme name and explanation on its cards, spoiling all 30 puzzles. Its "connected readings" are just the first four other topics in the same category. | `quran-concept-atlas/src/data/content.json` |
| 4 | Revelation Context | The quiz asks for the report's category, but the category is printed in the card eyebrow, the Topic filter and the page eyebrow; 7 of 10 answers are the same category. | `revelation-context-explorer/src/pages/reading/[id].astro:11`, `index.astro:9` |
| 5 | Halal Business | The "Source-aligned" option is always the first button in all 12 cases at both stages; the follow-up is identical whatever you choose. | `halal-business-decisions/src/lib/decision.ts:18-19` |
| 6 | Misinformation Casebook | Meta descriptions contain the answer (`summaryField: "correction"`); question titles render as "?."; 8 of 12 verdicts are the same; several titles state the verdict. | `islamic-misinformation-casebook/src/data/seo.json:9`, `src/lib/seo.ts:73` |
| 7 | Stories of the Prophets | All 25 prophet pages share one generic meta description because `summaryField` points at a boolean. | `stories-of-the-prophets-explorer/src/data/seo.json`, `src/lib/seo.ts:72-73` |
| 8 | Memorization Calculator | The calendar export says `PRODID:-//Islamic Product Lab//…`, uses `@islamic-product.local` UIDs and a fixed 27 October timestamp. | `quran-memorization-workload-calculator/src/lib/engine.ts:25` |
| 9 | Everyday Akhlaq | The `constructive` flag (121 uses in the data) is never read, so no choice is ever distinguished; the second decision and takeaway are the same whatever you choose. | `everyday-akhlaq-simulator/src/data/content.json`, `src/lib/scenario.ts` |
| 10 | All apps | `<meta name="theme-color">` is hard-coded teal in blue and violet apps; the 404 page says "choose a new place to explore" (Places Atlas wording) in every app; the guide prints "Explore quran learning tools" in lower case; "↗" (the external-link arrow) is used on internal links. | `src/layouts/Shell.astro:46`, `src/pages/404.astro`, `src/components/LearningGuide.astro:7` |
| 11 | Civilization Timeline | Event pages show "This app does not republish modern English hadith translations" although they cite no hadith; the map has land shapes but no plotted records. | batch-four `References.astro` |
| 12 | Guess the Surah | The hero pill says "All 114 surahs" while the default pool is the 51 short surahs; 15 surahs share an identical first clue (for example "Alif. Lam. Mim." for 2, 29, 30 and 31), so clue 1 cannot separate them. | `guess-the-surah/src/pages/index.astro:7`, opening-ayah data |
| 13 | Understand Salah | The meaning is visible by default, undermining the "recall, then reveal" lesson; all seven Al-Fatiha cards say "Audio available" but play the whole surah. | `understand-salah-lab/src/lib/lesson.ts` |
| 14 | Seerah Timeline | The card, hero and guide promise "connected" moments, but events have no link fields. | `interactive-seerah-timeline/src/data/content.json` |

## A2. What I observed

Evidence comes from the six context files, the homepage source, `homepage/collections.json`, `PROJECT_RANKING.md`, `SEO_GROWTH_PLAN.md`, a read-only survey of all twenty app sources, and the live sites at desktop and 375 × 812 phone size on 7 November 2026.

**Strengths to keep.** Exact canonical Quran text with named translation, clean source notes, no accounts, fast static pages, accessible controls, working light/dark themes, and an attractive directory hero (night-sky blue, gold crescent, Newsreader headings). The four subject guides and About page are well structured. Guess the Surah already covers all 114 surahs and has a challenge link.

**Ten systemic problems.**

1. **Sameness.** Every app opens with the same pattern: a dash-and-eyebrow line, a very large Newsreader heading, a paragraph and the same eight-point star watermark on the right. Accent colour and a 38 px logo are the only differences. Moving between apps feels like reloading one app.
2. **Caveat-first copy.** Examples on the live pages: Halal Business Decisions shows "These cases are educational applied reasoning. They do not certify real transactions, issue personalized rulings or replace legal or financial advice" above the cases. The Family app says "No names, profiles or daily streaks" in its hero and "Keep examples fictional; nobody needs to share a private story" before the first pack. The Escape Room says the activity is "not a measure of faith or religious merit" before room one. All of this is true. Leading with it tells a newcomer the product is risky and slows them down.
3. **The activity is below the fold on phones.** On the Family app at 375 × 812, the first screen is header, breadcrumb, eyebrow, heading, paragraph, a facts box, a caveat paragraph and the start of a filter form; no pack is visible. On the directory, the first phone screen is copy and a button, the second is the moon illustration, and the first app card appears on the third screen.
4. **Headings written for keywords.** H1s such as "Guess the Surah Quran quiz", "Quran Connections passage puzzles", "Understand Salah: prayer recitation meanings" and "Quran memorization calculator" differ from the app name in the header and read like search strings. Google reads the title tag and page content; it does not need the H1 to be awkward.
5. **Long, uneven names.** "Quran Memorization Workload Calculator", "Family Islamic Learning Challenges", "The Islamic Knowledge Escape Room", "Islamic Misinformation Casebook". Six names repeat "Islamic" inside an Islamic collection. Two start with "The". Format words such as Explorer, Studio, Lab, Atlas, Casebook and Simulator say little to a visitor. On a phone the Family app's long name wraps to two lines and the header loses its logo.
6. **No reason to come back tomorrow.** The games draw from fixed banks with no date-numbered daily puzzle, no streak and no "come back tomorrow" ending. The tools end at a result with no next step except two related links far down the page.
7. **Overlap.** Three timeline apps, two "connections" games, three evidence-reading apps and two Quran theme explorers compete for the same visitor and dilute each other in search.
8. **Thin banks in several apps** (12 cases, 12 packs, 10 readings; see A8). Thin banks end the habit before it forms.
9. **Inconsistent honorifics.** ﷺ or "peace be upon him" appears in the source data of only four apps (16 occurrences), while "the Prophet" appears in 18 files across the apps. Muslim readers notice this immediately and read it as carelessness.
10. **No human face, English only.** The About page has a corrections address but no named maintainer or reviewer. For religious learning, "who made this and who checked it?" is the first trust question. Everything is in English.

## A3. Audience and positioning

| Audience | What they are trying to do | Best entry | Where they gather |
| --- | --- | --- | --- |
| Muslim parents with children 5–14 | "Give my kids something Islamic and fun for ten minutes tonight" | Family packs, Guess the Surah, Prophets stories, Escape Room | WhatsApp family and school groups, Facebook parent groups |
| Weekend-school and madrasa teachers | "A ready activity for Sunday class, no sign-ups" | Escape Room, Timeline, Prophets stories, printables | Teacher networks, school newsletters |
| Young adults and reverts, 16–30 | "Understand what I recite; learn without being judged" | Salah meanings, Quran Words, Quran Check | Search, Reddit, YouTube, Instagram |
| Daily puzzle players | "A two-minute game with my coffee" | Guess the Surah daily, Connections daily | Share text in group chats |
| Hifz students and their parents | "A revision plan that survives missed days" | Hifz Planner | Hifz circles, masjid classes |
| Bangla-speaking learners | All of the above, in Bangla | Bangla edition | Facebook, WhatsApp, YouTube |

**Positioning.** "Small, free Islamic learning games and tools that open in a second. No sign-up. Sources one tap away."

**Tagline candidates.** "Learn a little, every night." / "Islamic learning, one night at a time." Both use the moon idea, since the Islamic calendar is lunar and the new crescent marks each month, without implying astrology.

**Voice.** Warm, confident and short. Use Islamic vocabulary that learners already hear (surah, ayah, Seerah, akhlaq, hifz) with a short gloss the first time. State limits once, plainly, where a reader makes a decision. Never open with what the app does not do.

## A4. The naming system

**Today, names disagree with themselves.** The survey found up to four names per app: directory card, header brand, `<title>` and H1 often differ. Examples: "Seerah Timeline" (header), "Interactive Seerah Timeline" (card), "Interactive Seerah timeline" (H1); "Is This Actually in the Quran?" (card), "Is It in the Quran?" (title), "Quran Wording Search" (short name), "Search Quran wording in Arabic and English" (H1). Only 4 of the first 10 titles end in "| Moongazer". The nav label is "Explore" even in the quiz, the calculator and the search tool.

**Rules.**

1. **Two layers.** A *name* (two or three words, said aloud easily, used in the header, H1, share text and short link) and a *descriptor* (one plain sentence carrying the search phrase, used as the subtitle, directory card text and second half of the title tag).
2. **One name everywhere.** Header = H1 = card = share text. Title tag pattern: `Name — descriptor | Moongazer`.
3. **No "Islamic" in app names.** The collection supplies it. Keep it in descriptors and titles where people search for it ("Islamic civilization").
4. **No "The" and no format jargon** (Explorer, Studio, Lab, Atlas, Casebook, Simulator, Challenge) unless the format is the hook (Escape Room, Detective, Timeline, Planner, Calculator).
5. **Use the Islamic word learners already say**: Surah, Ayah, Seerah, Hifz, Salah, Akhlaq, Halaqa, Zakat, Alif Ba.
6. **Games get playful names; tools get plain ones.**
7. **One word per thing inside an app.** A case is a "case", not also an "investigation" and a "case file"; a scenario is not also a "situation", "moment" and "activity".
8. **Nav says what you do there**: "Play" for games, "Read" for readers, "Plan" for planners, "Search" for search.
9. **Hosts stay for now.** Search Console was set up eight days ago with no data yet. Keep every current subdomain, add short links on the apex, and revisit hostnames after 90 days of data. If a host ever changes, 301 every path and keep the old host redirecting permanently.

**Rename table.**

| # | Current name | New name | Descriptor | Host | Short link |
| --- | --- | --- | --- | --- | --- |
| 1 | Guess the Surah | **Guess the Surah** | A daily Quran quiz: find the surah from its clues | keep | `/surah` |
| 2 | Quran Connections | **Ayah Threads** | Three ayat, one hidden thread: a daily Quran puzzle | keep | `/threads` |
| 3 | Islamic Concept Connections | **Word Groups** | Sixteen Quran words, four hidden groups: a daily puzzle | keep | `/groups` |
| 4 | The Islamic Knowledge Escape Room | **Quran Escape Room** | Rooms of Quran puzzles to solve together | keep | `/escape` |
| 5 | Is This Actually in the Quran? | **Is It in the Quran?** | Search every ayah in Arabic and English, and check popular claims | keep | `/check` |
| 6 | Stories of the Prophets Explorer | **Stories of the Prophets** | The prophets in the Quran: read, reflect and check | keep | `/prophets` |
| 7 | Quranic Parables Studio | **Parables of the Quran** | The Quran's parables, drawn and explained | keep | `/parables` |
| 8 | Quranic Places Atlas | **Places in the Quran** | A map of the places the Quran names, and where certainty ends | keep | `/places` |
| 9 | Revelation Context Explorer | **Why It Was Revealed** | Asbab al-nuzul: the reports behind selected ayat | keep | `/revealed` |
| 10 | Interactive Seerah Timeline | **Seerah Timeline** | The Prophet's life ﷺ from 610 to 632, with a "Which came first?" game | keep | `/seerah` |
| 11 | The Seerah Detective | **Seerah Detective** | Solve cases from the Prophet's life ﷺ using the reports | keep | `/detective` |
| 12 | Islamic Civilization Timeline | **Civilization Timeline** | Islamic civilization across regions, from 632 onward | keep | `/civilization` |
| 13 | Understand Salah Lab | **Understand Your Salah** | The meaning of every phrase you say in prayer | keep | `/salah` |
| 14 | Quran Memorization Workload Calculator | **Hifz Planner** | Plan new memorization and revision around your week | keep | `/hifz` |
| 15 | Everyday Akhlaq | **Everyday Akhlaq** | Character and halal business dilemmas: choose, then read the sources | keep | `/akhlaq` |
| 16 | Family Islamic Learning Challenges | **Family Halaqa** | Ten-minute Islamic activities to do together | keep | `/family` |
| — | Quran Concept Atlas | merged into Ayah Threads as its Theme library | | 301 | |
| — | Islamic History Timeline Challenge | merged into Seerah Timeline as "Which came first?" | | 301 | |
| — | Halal Business Decisions | merged into Everyday Akhlaq as the Business track | | 301 | |
| — | Islamic Misinformation Casebook | merged into Is It in the Quran? as "Common claims" | | 301 | |
| 17 | new | **Quran Words** | Learn the Quran's most frequent words, five minutes a day | new | `/words` |
| 18 | new | **Names of Allah** | Learn Allah's names with the ayat they appear in | new | `/names` |
| 19 | new | **Zakat Calculator** | Work out your zakat step by step, with the method shown | new | `/zakat` |
| 20 | new | **Alif Ba** | Learn the Arabic letters to start reading the Quran | new | `/alif-ba` |

Twenty apps remain, so the "20 free apps" promise holds, but each one is now distinct.

**Subject families and colour.** Colour follows subject; a small badge shows format (Daily game, Game, Reader, Tool, Family).

| Family | Colour | Apps |
| --- | --- | --- |
| Quran | Teal (existing tokens) | Guess the Surah, Ayah Threads, Word Groups, Is It in the Quran?, Stories of the Prophets, Parables, Places, Why It Was Revealed, Quran Words, Alif Ba |
| Seerah and history | Gold (new tokens, contrast-checked in both themes) | Seerah Timeline, Seerah Detective, Civilization Timeline |
| Worship and daily life | Blue (existing tokens) | Understand Your Salah, Hifz Planner, Everyday Akhlaq, Names of Allah, Zakat Calculator |
| Family and group play | Violet (existing tokens) | Family Halaqa, Quran Escape Room |

**Words to retire from the interface.**

| Current label | Replace with |
| --- | --- |
| "Choose a record" (all five batch-four home pages) | "Choose a case" / "Choose a pack" / "Choose a reading" |
| "Copy saved reading list" | "Copy my list" |
| "Save reading" (on lessons, themes, profiles) | "Save" |
| "Editorial feedback: Source-aligned / Needs repair / Clarify first" | "Fair to everyone" / "Needs putting right" / "Ask first" |
| "Transmitted occasion" / "Response after revelation" | "A reported occasion" / "What happened after" |
| "Unpinned" / "Regional reference" / "City context" / "Heritage context" | "Exact site known" / "Region known" / "Location uncertain" |
| "One connected reading area", "Compare two date bands" | "Map", "At the same time…" |
| "Listen with your eyes" (an Arabic text clue) | "The Arabic" |
| "Makkan classification" | "Revealed in Makkah" |
| "Explore" (nav in every app) | "Play", "Read", "Plan" or "Search" |
| "Source dossier", "source shelf", "evidence set", "fixed case bank" | "Sources", "Notes", "Clues" |
| "↗" on internal links | "→" (keep "↗" only for external links) |

**Honorifics.** Add ﷺ after the Prophet Muhammad in editorial text and "(peace be upon him)" or عليه السلام after other prophets, through one shared helper that renders the glyph in Amiri. Never alter canonical quotations or the named translation.

## A5. Portfolio: keep, merge, add

The survey found four clusters where apps share data or mechanics and compete for the same visitor:

| Cluster | Apps today | Evidence | Decision |
| --- | --- | --- | --- |
| Quran themes | Quran Connections, Quran Concept Atlas, Escape Room | Same 30 themes and references; the Atlas prints every Connections answer; the Escape Room reuses 8 of them | Atlas becomes Ayah Threads' Theme library, unlocked as you solve |
| Timelines | Interactive Seerah Timeline, Timeline Challenge, Civilization Timeline | The Challenge's 14 events are copied from the Seerah Timeline; three apps carry "Timeline" | Challenge becomes the Seerah Timeline's "Which came first?" game; Civilization stays, rebuilt |
| Choice scenarios | Everyday Akhlaq, Halal Business Decisions | Same two-decision engine with the same flaws (no real branching, predictable answers); shared refs 2:282, 17:36, 4:58 | One app, Everyday Akhlaq, with Home, Friends & online, Study & work, and Business tracks |
| Evidence and claims | Misinformation Casebook, Is This Actually in the Quran?, Revelation Context, Seerah Detective | Four of ten Revelation passages reappear as casebook claims; the casebook's claims are partly strawmen | Casebook becomes "Common claims" inside Is It in the Quran?; Revelation and Detective stay, fixed |

**How a merge works.** Build the merged section inside the receiving app first. Then add hostname redirects in the Cloudflare zone ruleset (where this repo already keeps hostname redirects) mapping every old path: `halal-business-decisions…/case/<id>/` → `everyday-akhlaq-simulator…/business/<id>/`; `islamic-misinformation-casebook…/case/<id>/` → `is-this-actually-in-the-quran…/claims/<id>/`; `islamic-history-timeline-challenge…/` → `interactive-seerah-timeline…/challenge/`; `quran-concept-atlas…/topic/<id>/` → `quran-connections…/themes/<id>/`. Verify each 301 live, remove the old sitemaps from Search Console, and only then retire the old Pages project. `deployment/targets.json`, the homepage catalog and the subject guides change in the same release.

**Why fewer, better apps attract more people.** A visitor who opens a thin app (10 readings, 12 cases) and finds the end in five minutes leaves with the impression that the whole collection is thin. Merging puts 32 scenarios in one place instead of 20 and 12, gives the claim checker a search engine in front of it, and lets one timeline carry both reading and play.

**Four additions** (details in A9) were chosen because people already search for them and because each creates a habit: Quran Words, Names of Allah, Zakat Calculator, Alif Ba. The Hifz Planner is an upgrade of the existing calculator, not a new app.

## A6. The directory homepage

Top to bottom, phone first:

1. **Header.** Logo; "Apps", "Today", "Families", "Teachers", "About". Later a language switch (English / বাংলা).
2. **Compact hero.** H1 "Free Islamic learning games and tools", one line of copy, two buttons: "Play today's puzzle" (the daily Guess the Surah) and "Browse all apps". On phones, the crescent becomes a background or a 120 px mark beside the heading so the first app is visible on screen one.
3. **Tonight on Moongazer.** Three tiles, rendered with a static default so they work without JavaScript:
   - *Today's surah*: Guess the Surah #N.
   - *Today's board*: Word Groups #N.
   - *Ayah of the night*: the Arabic with the existing Pickthall translation and reference, picked by date from the local full corpus and linking to Is It in the Quran?.
4. **Quick picker.** Chips: "2 minutes", "10 minutes", "With my kids", "For my class", "Understand my prayer", "Plan my hifz". Each filters the library. This replaces abstract subject filters as the first choice; subject filters stay below.
5. **Collections.** Keep the four subject guides, restyled as wide cards with the member app logos.
6. **Library.** Cards gain a real local screenshot (16:9, lazy-loaded), a format badge (Game, Tool, Reader), time ("2 min", "10–15 min") and audience ("Family", "Teens+", "Teachers"). Featured order instead of rank order.
7. **Seasonal slot.** Ramadan, Dhul Hijjah, Muharram. Empty outside seasons.
8. **Trust row.** "Exact Quran text with named translation · Sources on every page · Reviewed by … (when true) · Corrections log".
9. **Footer.** Unchanged links plus short links.

Remove the vague header link "Start with a little curiosity ↗" and the "There is always more to discover." caption; they are mood without information.

## A7. The shared app shell (applies to every app)

1. **Activity within the first screen.** At 390 × 844 the first interactive control or content card must start within 600 px. The hero becomes: name (H1, one or two lines), a descriptor of no more than twelve words, and an optional count chip ("114 surahs").
2. **One "How this works" drawer.** A native `<details>` near the top-right on desktop and below the activity on phones holds method, limits and privacy notes that now appear as separate notices. One plain sentence beside each result keeps the essential limit visible (for example, "A practice case, not a ruling on your own deal").
3. **A face for each app.** Replace the shared star watermark with an app-specific line illustration drawn from its logo motif. Assign colour by subject family (A4) rather than by the old teal/blue/violet split.
4. **An ending that sends people somewhere.** Every session ends on the same pattern: result → "What you learned" (one to three lines with references) → share (spoiler-free text, WhatsApp, copy) → one recommended next app → "New puzzle tomorrow" for daily games.
5. **Learning guide as an accordion.** Keep the static guide text (it is useful and indexable) but present it as "About this app" with collapsible questions after the activity, not as a wall of headings.
6. **Arabic deserves more room.** Ayat in Amiri at about 1.6–1.8 rem with generous line height. Treat ﷺ as an Amiri glyph inside DM Sans text, through one shared helper.
7. **Small delight, within one standard.** A brief, reduced-motion-aware animation on a correct answer, and a soft non-musical sound only if the visitor turns sound on. Moongazer follows the same standard as the Booktube rules in Part B: no music or bells, and no images of people or animals. Use geometry, calligraphy, objects, places, plants and light.
8. **Header.** Short name plus logo on every width; drop the "Islamic learning, explored." tagline on phones; add an "All apps" link that returns to the directory.
9. **Print and projector.** A "Print" button on family, teacher and timeline pages, and a "Projector" toggle that enlarges text for a classroom screen.
10. **Design files (`DESIGN.md`).** The repository root (`DESIGN.md`) and all twenty individual apps (`apps/<slug>/DESIGN.md`) will each have their own dedicated `DESIGN.md` file. Root `DESIGN.md` defines portfolio-wide design tokens, typography, shared archetypes, and Islamic constraints. Each app's local `DESIGN.md` specifies that app's archetype, palette tokens, custom SVG motif, component states, and screen-1 layout.

## A8. App by app

Each entry gives the verdict, the new first screen and layout, what to add, what to remove or fix, and the reason to come back. "Today" facts come from the source survey.

### 1. Guess the Surah (flagship daily game)

**Verdict.** The strongest app: complete content (114 surahs), a clear loop, scoring and a challenge link. It becomes Moongazer's daily front door.

**First screen and layout.** Name, "Daily #N" and mode tabs (Daily · Practice · Juz), then the clue card with clue 1 and the four answers. On desktop, the sidebar holds today's result, the streak and the "How this works" drawer. The round setup moves into Practice.

**Add.**
- A daily surah, the same for everyone, numbered. Practice mode stays.
- A Juz mode (for example Juz 30 for children learning Juz Amma).
- A better clue ladder. For the 15 surahs whose opening ayah is shared or nearly identical, start from ayah 2. Replace the chapter-number clue, which gives the answer away to anyone who knows the order, with the meaning of the surah's name or a distinctive word.
- 114 surah pages at `/surah/<name>/`: name and meaning, ayah count, revelation place, the canonical opening ayah, and a "Play this surah" button. These are the main search pages for the whole collection.
- A local "114 collection" grid that fills in as surahs are found.
- Share text with the daily number.
- An optional audio clue, only after a reciter licence is secured.

**Remove or fix.** The "All 114 surahs" pill over a 51-surah default; the off-site "Browse the surah collection" list (link the new surah pages instead); the clue labels "Listen with your eyes" and "Makkan classification"; the H1 "Guess the Surah Quran quiz".

**Reason to return.** Daily number, streak, a collection to complete.

### 2. Ayah Threads (was Quran Connections; absorbs Quran Concept Atlas)

**Verdict.** A good mechanic undermined by easy distractors and by the Atlas spoiling every answer.

**First screen and layout.** "Ayah Threads #N", then three ayah cards with an Arabic toggle, then "What connects them?" with four options. After solving: the theme, its explanation, a tafsir link, and "Added to your Theme library".

**Add.**
- Daily seeding.
- Distractors drawn from the real theme pool, each used at most three times. Today "Hospitality" and "Privacy" each appear 14 times.
- Three passages from different surahs in every puzzle; one-passage puzzles such as 51:24–27 are too easy.
- Grow the bank from 30 to 90 puzzles, using Quran MCP for text and commentary.
- A Theme library: the Atlas content, where each theme unlocks after its puzzle is solved or revealed. Its "connected readings" must be authored relationships, not the first four topics in the same category.

**Remove or fix.** The standalone Atlas; the opaque "Puzzle 01…30" select (show titles only for solved puzzles); the dead end after puzzle 30.

**Reason to return.** Daily puzzle, library completion ("17 of 30 themes").

### 3. Word Groups (was Islamic Concept Connections)

**Verdict.** The most game-like app in the collection, with too small a bank. Its 16 boards are recombinations of only 20 groups under four repeated titles.

**First screen and layout.** "Word Groups #N", then the 4×4 board immediately, a four-mistake counter, solved rows in colour by difficulty, a result card with share text, and the ayat behind each group below.

**Add.**
- A four-mistake limit, which creates stakes.
- Group difficulty tiers.
- Daily seeding.
- At least 60 groups and 100 boards.
- A mix of trivia groups ("Metals in the selected readings") and real concepts (prophets' qualities, names of surahs, Arabic roots in the ayat).
- A summary card at the end.

**Remove or fix.** Repeated board titles; the "Restart" text link beside "Next board"; "Concept" in the name.

**Reason to return.** Daily board, streak, shareable result.

### 4. Quran Escape Room (was The Islamic Knowledge Escape Room)

**Verdict.** The best group format, currently broken by giveaways (A0 #2) and missing the "unlock the next room" its card promises.

**First screen and layout.** A corridor of rooms where finishing one opens the next. Inside a room: a lock-progress bar at the top, and the source shelf open beside the lock on desktop or as a tab on phones. Today it sits collapsed below the fold.

**Add.**
- Room names that do not reveal the theme.
- A random shuffle per play.
- New lock types: put ayat in order using the Arabic, match a word to its meaning, find the missing ayah, a cipher built from surah numbers.
- Grow from 8 to 16 rooms, with a 10-room Ramadan set.
- An optional hint cost.
- A teacher kit: printable answer sheet and room cards.
- A printable completion certificate where the name is typed into the print view and never stored.

**Remove or fix.** The caveat notice above the rooms (move it into the drawer); "↗" on internal links; fixed shuffle seeds.

**Reason to return.** Room sequence, new rooms, classroom use.

### 5. Is It in the Quran? (absorbs Misinformation Casebook)

**Verdict.** The largest search opportunity in the collection: people type "is X in the Quran" constantly. Today the tool has four names, and the name it uses doesn't match its careful behaviour.

**First screen and layout.** The search box *is* the hero, with example chips, then "Popular checks" (claim pages), then results.

**Add.**
- A "Common claims" section: one static page per popular question, giving a one-line verdict (an ayah, a hadith wording, a paraphrase, or not found), the evidence, and how to check it yourself. Start by rebuilding the casebook's 12 cases around claims people actually make (not strawmen), then grow to 100.
- A synonym index so modern words find Pickthall's archaic wording ("patience" also finds "steadfast").
- A second English translation if Quran MCP offers one whose licence allows it.
- "Reports about why this was revealed" links into Why It Was Revealed.
- A share card ("Found in Quran 94:5–6").

**Remove or fix.** The casebook's verdict-spoiling titles and meta descriptions (A0 #6); the "Fixed source-reading exercises / No live claim checker" bands; the extra names.

**Reason to return.** Utility. This app earns visits from search, not habit.

### 6. Stories of the Prophets (drop "Explorer")

**Verdict.** One of the strongest family subjects, but each profile is two passages and one question.

**First screen and layout.** A grid in the conventional order (with an A–Z toggle). Each card has a symbolic, non-figurative motif (an ark, a well, a staff, a fish), never a figure. A profile becomes a story in scenes: each scene has a Quran passage, a short narration and one check. Then lessons, related places and the timeline.

**Add.**
- Chapters for the major prophets (Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, and Muhammad ﷺ), three to six readings each.
- Honorifics.
- A read-aloud mode.
- Saved answers and "7 of 25 read".
- Fix the identical meta descriptions (A0 #7) and the "Next profile" order contradiction.

**Remove or fix.** "Explorer"; the "not a complete biography collection" notice above the grid (move it into the drawer); "Save reading" on profiles.

**Reason to return.** Chapter progress; a bedtime-story pick each night.

### 7. Parables of the Quran (was Quranic Parables Studio)

**Verdict.** A beautiful subject whose "interactive diagram" is a three-tab text switcher.

**First screen and layout.** A gallery of the parables, each with its own illustration of objects (a spider's web, a rain cloud, a garden, a lamp in a niche). A parable page: the ayat, a stepped illustrated diagram (local SVG), the explanation with tafsir, a reflection, then the next parable.

**Add.** Real illustrated diagrams; next/previous; a printable worksheet (the note download already exists).

**Remove or fix.** "Studio"; the drift between "parable", "comparison" and "reading" (use "parable" throughout); the dead-end detail pages.

**Reason to return.** Low by nature. Value comes from teachers and search.

### 8. Places in the Quran (was Quranic Places Atlas)

**Verdict.** Maps attract people, but this one mostly says "no pin": 5 of 15 places are pinned.

**First screen and layout.** A large map first, then a shelf of "Places we can't pin, and why", then place pages with the ayah, what is known, the map, and the related prophet or event.

**Add.**
- Places the Quran names that are missing today: Badr (3:123), Hunayn (9:25), Yathrib (33:13).
- Links to Stories of the Prophets (Midian with Musa and Shu'ayb, Al-Hijr with Salih, Saba with Sulayman) and to the Seerah Timeline.
- One entry for Bakkah and Makkah, with the relationship explained.

**Remove or fix.** The filter jargon (A4 table).

**Reason to return.** Low. Its job is search, teaching and cross-links.

### 9. Why It Was Revealed (was Revelation Context Explorer)

**Verdict.** A valuable study tool with a broken quiz (A0 #4) and ten readings.

**First screen and layout.** Readings in mushaf order by surah and ayah. A reading page: the ayah, the report (narrator and collection), "What this shows" and "What it doesn't settle", then one check.

**Add.**
- A quiz that asks something not printed on the page (for example "Which ayah does this report concern?"), or hide the category until the reader answers.
- Grow to 50 readings over time, with verified sources.
- Per-surah index pages (people search "asbab al-nuzul surah …").

**Remove or fix.** The jargon (A4 table); the H1 that differs from the name.

**Reason to return.** Study use. A high return rate is not expected.

### 10. Seerah Timeline (absorbs the Timeline Challenge)

**Verdict.** A useful reference that promises "connected" moments it does not have (A0 #14), with one source for 35 of 36 events.

**First screen and layout.** Name and an era strip (Early Makkah … Final year), then a vertical timeline with year markers on phones, a detail drawer, and a "Which came first?" tab.

**Add.**
- Authored connections: related events, people, places and Quran passages.
- A people index for the Companions, with honorifics.
- "Which came first?": the Challenge's 12 packs, plus a daily two-event question ("Badr or Uhud?") that is quick and shareable.
- A second source where one exists.
- A printable classroom timeline poster.

**Remove or fix.** The mix of "moment" and "event"; "Interactive" in the name.

**Reason to return.** The daily "Which came first?" question.

### 11. Seerah Detective (drop "The")

**Verdict.** The best concept for teenagers. Cases are thin: each one's three "evidence cards" are paraphrased pieces of a single report, and distractors such as "The report gives an exact Gregorian day" are obvious.

**First screen and layout.** A case board with solved ticks. A case page: evidence pinned like a board, the conclusion choice, then the reveal.

**Add.**
- Cases built from two or three different reports.
- Plausible distractors.
- An answer reveal after two wrong tries; the hint should not replace feedback.
- Grow from 12 to 30 cases, aligned with Timeline events.
- A playful local rank ("Junior" to "Senior detective").
- A case of the week.

**Remove or fix.** Use "case" only; replace the mixed Topic filter (themes mixed with battle names) with an era filter.

**Reason to return.** Case of the week, rank.

### 12. Civilization Timeline (was Islamic Civilization Timeline)

**Verdict.** The weakest app today:
- 24 records, nothing between 632 and 661, and a gap from the 10th to the 13th century.
- A map with no plotted records.
- A "Compare two date bands" tool that only does arithmetic.

**First screen and layout.** An era ribbon (Rashidun, Umayyad, Abbasid, and on), a map with a plotted marker per record, and record pages with an image.

**Add.**
- Fill the gaps: the Rashidun period, Baghdad, Cordoba, Fatimid Cairo, the Seljuks, Ayyubids and Mamluks, the Ottomans, West Africa (Timbuktu), South and Southeast Asia. Include the UNESCO-listed Historic Mosque City of Bagerhat, which matters to a Bangladeshi audience.
- Grow to 80 records.
- Open-access CC0 images of objects and architecture from the Metropolitan Museum's collection, already a source here. Choose items without human or animal figures. This is the single biggest visual upgrade available.
- "At the same time…": what else was happening in other regions.

**Remove or fix.** The date-band arithmetic tool; the hadith disclaimer on pages without hadith; "Choose a record".

**Reason to return.** Low. If it is not rebuilt by Phase 3, fold it into the Seerah Timeline as an "After 632" era.

### 13. Understand Your Salah (was Understand Salah Lab; featured)

**Verdict.** The clearest learning outcome in the collection. Make it a short course.

**First screen and layout.** "Your prayer, step by step": a vertical path from takbir to salam showing progress. A lesson: large Arabic, tap-to-reveal meaning phrase by phrase, audio per ayah, one check, then "Next".

**Add.**
- Phrase-by-phrase meanings.
- Per-ayah audio for Al-Fatiha, cut from the existing CC BY-SA recording with the same licence and attribution.
- Saved progress ("Lesson 4 of 15").
- Review cards for the phrases.
- A printable pocket card.
- Meaning hidden by default, so the reader recalls before revealing.

**Remove or fix.** "Lab"; the audio player above the lessons (move it into the lesson); "Save reading" on lessons; the "Audio available" label on cards that play the whole surah.

**Reason to return.** Course completion and review.

### 14. Hifz Planner (was Quran Memorization Workload Calculator)

**Verdict.** Keep the engine; build the planner. Your own ranking put a Hifz planner at #3.

**First screen and layout.** A three-step wizard:
1. What you have memorized: choose juz or surahs, using the bundled 114 chapters and 604-page layout, which the UI does not use today.
2. Your week: days and minutes.
3. Your plan: this week's checklist and a calendar.

Per-page minute estimates move into an "Adjust assumptions" drawer.

**Add.**
- Check-offs saved locally.
- "I missed a day": re-plan.
- A printable weekly sheet for a teacher.
- Sabaq / sabqi / manzil labels as an option (new lesson, recent revision, old revision), the vocabulary of many South Asian hifz classes.
- Fix the calendar export branding (A0 #8).

**Remove or fix.** "Workload Calculator"; labels like "Maximum new pages per session 0.5".

**Reason to return.** The weekly plan.

### 15. Everyday Akhlaq (absorbs Halal Business Decisions)

**Verdict.** Relatable, but choices don't matter yet (A0 #5 and #9).

**First screen and layout.** Track tabs (Home & family · Friends & online · Study & work · Business), then scenario cards marked "2 min". A scenario: scene, first choice, consequence, a second choice that depends on the first, then reflection with the ayah.

**Add.**
- Real branching.
- Gentle feedback using the unused `constructive` field ("This choice protects trust").
- Shuffled option order.
- The 12 business cases as the Business track.
- A new Friends & online track (group chats, gaming, sharing photos).
- A one-device class mode that tallies choices locally.
- Grow from 32 to 60 scenarios.

**Remove or fix.** The "Two decisions per case / Fictional consequences" bands and the disclaimer above the cases (move them into the drawer); "Choose a record"; "Editorial feedback: Source-aligned".

**Reason to return.** A new scenario each week; track completion.

### 16. Family Halaqa (was Family Islamic Learning Challenges)

**Verdict.** The right audience in the wrong register. Its hero leads with "No names, profiles or daily streaks". It offers only 2 packs for ages 12+ and no "next pack".

**First screen and layout.** "Tonight's halaqa": one suggested pack with an age-band switch (5–7, 8–11, 12+), then the library by age. A pack: three large step cards for a shared screen, with the answer behind "Show the answer (for the adult)". Today the facilitator's answer sits directly under the question.

**Add.**
- Grow to 52 packs, one a week for a year, plus a 30-night Ramadan series and seasonal packs (Hajj, Ashura).
- A read-aloud mode.
- "Next pack".
- A printable monthly calendar.
- An opt-in *weekly* family streak.

**Remove or fix.** The negative hero line; "Challenges"; "Choose a record"; "Copy saved reading list" (use "Save" and "Share this pack").

**Reason to return.** A pack each week, Ramadan nights.

## A9. New apps worth building

| New app | Why people will come | What it must have | Main risk |
| --- | --- | --- | --- |
| **Quran Words** (vocabulary trainer) | Your own ranking put it at #1. A five-minute daily habit with visible progress; "understand the Quran" is the strongest learner motive. | Frequency-ordered word list, meanings, each word linked to ayat from the local full corpus, spaced repetition in local storage, review queue, export/backup. | Licensing of morphology data (the Quranic Arabic Corpus is GPL; check compatibility or prepare an own list through Quran MCP); meanings need review. |
| **Alif Ba** (Arabic letters for Quran reading) | Every child and every new Muslim starts here; parents search for it constantly. | The 28 letters and their forms, short vowels, joining, tap-to-hear audio, tracing practice on a canvas, simple words taken from the Quran, progress per letter. | Letter audio must be recorded or licensed; a qualified teacher should check pronunciation guidance. |
| **Zakat Calculator** | Very high search demand every Ramadan; practical. | Asset categories, nisab from gold or silver price the user enters (no live API), one documented method with source notes, a reviewed explainer, printable summary. | Fiqh differences; needs qualified review before launch. |
| **Names of Allah** | Large, evergreen search interest; strong for families and reflection. | Each name with Arabic, meaning, Quran occurrences from the local corpus, a short reflection, flashcards and a family activity. | The enumerated list of 99 in some narrations is discussed by scholars; present names with their Quran references and note the list question honestly. |

Two further ideas once the above are done: a **Ramadan hub** on the directory (not a separate app) and a searchable expansion of the casebook into "Is it a hadith?" for popular misattributed sayings, which needs verified hadith gradings for every entry.

## A10. Reasons to return, without accounts

1. **Daily numbered puzzles.** Puzzle index = days since a fixed start date, modulo bank size. Static, identical for everyone, shareable ("Guess the Surah #42"). Practice mode stays available.
2. **Spoiler-free share text.** For example `Guess the Surah #42 · solved on clue 2 of 4 · moongazer.tech/surah`. Plain text, no tracking parameters.
3. **Opt-in streaks.** Per app first, in the existing namespaced storage. Later, a cross-app streak using one small first-party cookie scoped to `.moongazer.tech` (readable by every app subdomain in the browser, no server) holding only the last play date and streak count. This changes a storage invariant and the privacy copy, so it needs an explicit architecture decision first.
4. **A reminder without push.** A "Remind me daily" button that downloads a browser-generated `.ics` calendar event. No server, no permission prompt.
5. **Collections.** Local achievements such as "All 114 surahs found" or "All 25 prophets read" (count from actual data).
6. **Install and offline.** A web-app manifest and a scoped service worker per app give "Add to home screen" and offline play. This also needs an architecture decision because it interacts with the current caching headers.

## A11. Growth and distribution

1. **Short links** in the apex `homepage/_redirects` (currently empty apart from a comment), one per app as listed in A4: `/surah`, `/threads`, `/groups`, `/check`, `/salah`, `/hifz`, `/family`, `/seerah` and the rest. They are easy to say in a class, print on a poster or put at the end of a video. The directory's CSP is unaffected, because these are plain navigations.
2. **WhatsApp first.** A `wa.me/?text=` share button on results, family packs and teacher pages. In South Asia and the Gulf, this is where links travel.
3. **Teachers page** on the directory: which app fits which lesson, projector mode, printable packs, a ready message for parents, and a printable QR poster per app (QR generated at build time, local).
4. **Pages that deserve to rank.** 114 surah pages in Guess the Surah (name and meaning, ayah count, Meccan/Medinan classification from standard mushaf metadata, the canonical opening ayah, "Play this surah"); one page per misattributed claim in the casebook; the existing prophet, place and event pages with better titles. Quality over count: each page must carry content a reader can use.
5. **Seasonal calendar** (dates approximate; confirm by sighting): Isra and Mi'raj, Rajab, early January 2027; Ramadan about 8 February to 9 March 2027; Dhul Hijjah and Eid al-Adha around mid-May 2027; Muharram and Ashura around mid-June 2027.
6. **Short videos via Booktube**, made under the Part B rules: no music or bells, no images of people or animals, exact ayat with reference, typographic thumbnails. Formats: "Guess the surah in three clues", "Which came first?", "Is this really in the Quran?". Each ends on a short link.
7. **Communities.** Islamic school networks, masjid newsletters, Muslim parenting groups. Post something useful (a family pack, a printable) rather than an advert; most Muslim subreddits restrict self-promotion.
8. **Bangla edition.** Start with Guess the Surah, Salah meanings, Prophets, Family packs and Quran Check. Requires a Bangla Quran translation whose rights permit this use (check which editions Quran MCP provides and their licences), Bangla UI strings, and `/bn/` routes inside each app. This is an architecture and UI-context change.

## A12. Trust

1. Name the maintainer on the About page (your decision whether to use a personal or publisher name).
2. Recruit one or two qualified reviewers (a local imam, madrasa teacher or Islamic studies graduate). Show per app what was reviewed, by whom and when, only when it actually happened.
3. Publish a corrections log: date, page, what changed, who reported it.
4. Use honorifics consistently in editorial text: ﷺ after the Prophet Muhammad, "(peace be upon him)" or عليه السلام after other prophets, and optionally رضي الله عنه for Companions. Never alter canonical quotations or the named translation.
5. Cut repeated hedging. One honest limit, stated once, builds more trust than five.
6. **Update, 8 November 2026 (`context/project-dna.md`):** Recruiting a formal Islamic studies reviewer is not currently possible. Instead, pair strict classical source attribution with a first-party in-app correction and feedback form and a public Corrections Log (`plan/FIRST_PARTY_SERVICES_PLAN.md`).

## A13. Measuring without tracking

Keep the no-script promise. Use Search Console for queries and pages, and Cloudflare's server-side traffic analytics in the dashboard (no script on the page) for request counts per host. If you use the latter, update the About wording so it stays truthful: "no tracking scripts or advertising cookies; we look at aggregate request counts from our host". Add a "Was this useful?" email link on results. Accept that returning-visitor rates cannot be measured; use daily-puzzle page requests as a proxy. **Update, 8 November 2026 (`plan/FIRST_PARTY_SERVICES_PLAN.md`):** Plan a cookie-free, IP-free first-party counter for `activity_started`, `activity_completed`, and `share_clicked` (`page_view` excluded), plus demand-triggered minimal progress-sync accounts once learners request cross-device saving through the feedback form.

## A14. Roadmap

| Phase | Window | Work |
| --- | --- | --- |
| 0. Fix the invitation | Weeks 1–2 | New names and H1s, descriptor lines, honorifics helper, "How this works" drawer, activity-first hero, directory hero and quick picker, short links |
| 1. Habit and Ramadan | Weeks 3–10 (by mid-January 2027) | Daily numbered modes and share text for the games, merges with 301 redirects, Hifz Planner, Zakat Calculator (after review), Ramadan hub, family colours and hero art |
| 2. Ramadan campaign | February–March 2027 | Juz-a-day surah set, nightly family packs, teacher page, Booktube shorts, WhatsApp sharing |
| 3. Depth | April–June 2027 | Quran Words, Names of Allah, 114 surah pages, casebook expansion, Bangla edition of five apps |
| 4. Platform | After June 2027 | Install/offline, cross-app streak cookie, projector mode across apps |

## A15. Decisions that need context updates before building

Per the repository's AGENTS.md, each of these changes a documented constraint and needs its context file updated first: display names and the H1 policy (`ui-context.md`, `project-overview.md`); merges and redirects (`architecture.md`, `deployment/targets.json`); new apps and ports 4341+ (`project-overview.md`); a cross-subdomain cookie (`architecture.md` storage invariant); service workers (`architecture.md`); Bangla routes (`architecture.md`, `ui-context.md`); server-side traffic counts (About copy, `project-overview.md`); named maintainer and reviewers (`project-overview.md`).

# Part B — Booktube: Islamic rules for agents

## B1. What the repository contains today

**Decisions taken with the user on 7 November 2026:** no music and no bells; no images of living beings at all; delete flagged material permanently; on RED requests, remind, refuse, and offer a halal alternative.

**Agent instructions.**
- `AGENTS.md` (62 lines) lists six context files in order and ends with invariants.
- `CLAUDE.md` is `@AGENTS.md` plus a skills note, so it is a real Claude Code import.
- `GEMINI.md` is the plain text "Read AGENTS.md".
- `context/agent-guide.md:3` says "Read the six context files"; that count will change.
- `.agents/skills/booktube-operator/SKILL.md:6` reads `AGENTS.md` first.

There is no religious or ethics policy anywhere. Related rules that already exist:
- the licence allow-list (`booktube/assets.py:23-24`)
- truthfulness instructions in the writer brief (`booktube/editorial.py:170-183`)
- "no meme sounds" and "music only from a licensed track" (`AGENTS.md:61`)
- an AI-narration disclosure (`booktube/media.py:242`)
- Openverse `mature=false` (`booktube/assets.py:46`)

**Flagged material.**

| Item | Path | Problem | Tier |
| --- | --- | --- | --- |
| Music bed | `renderer/public/bg-music.mp3` (+ copies in `renderer/build/public/`, `out/data-analyst-2027/generated_audio/`) | A sine-tone C-major-7 chord drone, used by all audio-bearing frozen compositions and baked into their MP4s | RED (music) |
| Bell and chime effects | `renderer/public/sfx/ding.wav`, `check-chime.wav`; manifest ids `ding`, `ding-bell`, `check-chime` | Bells (Sahih Muslim 2113–2114) | RED |
| Riser and meme effects | `sfx/bass-riser.wav`, `sfx/vine-boom.wav`; manifest ids `bass-riser`, `vine-boom`; catalog entries `record-scratch`, `windows-xp-error`, `mac-quack`, `yippee`, `dramatic-boomer`, `fah`, `loading-lag`, `snapchat-notification` in `booktube/sfx_catalog.json` | A musical riser and meme sounds | RED |
| Unchecked sound downloads | `booktube/sfx.py:97` | An unknown name is fetched from `remotion.media/<name>.wav` without any check | Fix |
| Frozen shorts | `renderer/src/shorts/` (Therac, Red Sea, Voyager, Nuclear Volcano + subfolders and tests) | Topics are fine, but every one has the music bed and bell/meme cues | RED (audio) |
| Binance video | `renderer/src/binance-breach-2026/`, `docs/storyboards/binance-breach*.md`, `renderer/public/binance_scene*.mp3`, `out/binance/` | Crypto-exchange and derivatives news that normalizes using the exchange ("Check your withdrawals if you use the platform"); music; cartoon animal characters; piano/marimba/strings cues | RED |
| Data Analyst explainer | `renderer/src/data-analyst-2027-v2/`, `renderer/public/scene1-8.mp3`, `renderer/data-analyst-2027_v1.mp4`, `_v2.mp4`, `renderer/out/`, `out/data-analyst-2027/` | Music, bells, and an animated human presenter with a face | RED |
| Presenter character | `renderer/src/components/RemotionPresenter.jsx` + `.d.ts`, `renderer/src/registry/character/RemotionPresenter.jsx`; used inside `renderer/src/registry/map/RemotionMapScene.jsx:118` | Image of a living being, available to every new video through the registry | RED |
| Old finance, tech and guru renders | `out/consumer-finance/`, `out/tech-sacred-cows/`, `out/business-guru/`, narration in `out/_tmp/shorts_*audio_tmp/` | Riba-based car-loan math; mockery; negative claims about a named living person | RED / AMBER |
| Example short observer | `renderer/src/videos/example-short/index.tsx:363-365` | A head-and-body "You" figure (circle plus stroke) | RED under the no-living-beings rule (replace) |
| `consumer-finance-math` profile | `.agents/skills/consumer-finance-math/` | Targets "brokerages, refinancing, credit cards, and insurance" advertisers; S&P 500/VOO at 8% default benchmark; riba-product idea bank; comment bait | RED (rewrite) |
| `neuro-hijack-autopsy` profile | `.agents/skills/neuro-hijack-autopsy/` | The purpose (quitting pornography) is good. But: idea #38 normalizes drinking; #49 recommends instrumental audio; "bypass YouTube's adult-content filters" framing; an invented "Guaranteed 70%" figure; "Skeptic Debate" comment traps | RED items (rewrite) |
| `tech-sacred-cows` profile | `.agents/skills/tech-sacred-cows/` | "Tribal comment traps"; "mock the status-seeking motive"; audiophile/music gear ideas | AMBER (rewrite) |
| `business-guru-fact-checks` profile | `.agents/skills/business-guru-fact-checks/` | Names living people with negative claims, some unverified; "trigger fans" pinned comments | AMBER (rewrite under §3 conditions) |
| `curiosity-remotion-shorts` profile | `.agents/skills/curiosity-remotion-shorts/SKILL.md:28` | "2-3 SFX" contradicts "none by default" | Fix |
| Book queue | `context/project-overview.md:19`, `docs/operations.md:3` | *Think and Grow Rich*: a "sex transmutation" chapter, "Infinite Intelligence" and manifesting. *A Brief History of Time*: creed-sensitive. *Atomic Habits*: fine | RED / AMBER / GREEN |
| Demo fixture | `booktube/demo.py:32` | "practice a musical instrument" | Fix wording |
| Voices | `booktube/configuration.py:26-27` (`af_heart`), `booktube/storage.py:31-32` (Gemini `Kore`) | Female default voices; this workspace uses the owner's HeyGen voice | AMBER (record decision) |

Not found: horror, occult, astrology, idols, profanity, gossip, romance. There is no upload, advertising, sponsorship or affiliate code. Income is implied YouTube Partner revenue plus the profiles' advertiser targeting and an implied affiliate funnel in `neuro-hijack-autopsy`.

## B2. How the rules work

**Placement.** A new `context/islamic-guidelines.md` becomes item 0 in the `AGENTS.md` reading list, before `project-overview.md`, because it decides whether work should happen at all. `CLAUDE.md` and `GEMINI.md` get the same change (see B1 for how they relate to `AGENTS.md`). Every stage skill (`booktube-operator`, `-research`, `-audio-script`, `-video-direction`, `-review`) and every channel profile gets a one-line pointer: "Apply `context/islamic-guidelines.md` before planning, scripting, choosing visuals or sound, writing titles/thumbnails/descriptions, or arranging income."

**Three tiers.**

| Tier | Meaning | What the agent does |
| --- | --- | --- |
| RED | Clearly impermissible, or set as RED by the owner's policy in this file | Gives the reminder, does not produce, render, upload, schedule or monetize the RED element even if asked again, offers a halal version, and continues with the rest of the work. A chat request cannot lift a RED rule; only an edit to this file can. |
| AMBER | Disputed, doubtful, or permissible only with conditions | Pauses before that step, gives the reminder with the safer option, proceeds only after the user chooses, and records the choice in `context/islamic-decisions.md`. |
| GREEN | Permissible | Proceeds normally. |

When the tier is unclear, the agent treats it as AMBER. Agents do not issue fatwas: where scholars differ, they say so, apply this file's default, and suggest asking a qualified scholar for a personal ruling.

**The reminder.** Short, respectful, specific, and never preachy or judgemental. It follows "And remind, for the reminder benefits the believers" (Quran 51:55) and "The religion is sincere advice" (Sahih Muslim 55):

> **Islamic reminder (RED):** Background music with instruments is something the majority of scholars hold impermissible (Sahih al-Bukhari 5590; Quran 31:6 as explained by Ibn Mas'ud). **Halal alternative:** voice-only narration with natural ambience and a soft whoosh on scene changes. I'll continue with that.

> **Islamic reminder (AMBER):** This sponsor offers a crypto exchange whose main products include leveraged futures and interest-like "earn" yields. Promoting it risks helping others into riba and gambling (Quran 5:2). **Safer option:** decline, or accept only a halal sponsor. Which would you like?

Once the user decides an AMBER item, the agent records it and does not repeat the reminder for the same item.

**Enforcement points.**

1. Planning: `booktube-operator` classifies the request before routing.
2. Research and script: `booktube-research` and `booktube-audio-script` check topic, framing, claims, Quran/hadith citations and named people.
3. Direction: `booktube-video-direction` checks every `visual:` and sound choice and the thumbnail.
4. Review gate: `booktube-review` gains an Islamic checklist, and `approve-project` gains an `islamic` attestation next to `facts audio visuals captions`, so a project cannot be approved without it.
5. Publishing: `export` and `schedule` re-check title, description, links, sponsor and monetization settings.

## B3. Proposed text of `context/islamic-guidelines.md`

The text below summarizes what agents will read. Its defaults follow the owner's choices: no music or bells, no images of living beings, and a firm refusal on RED items. The authoritative copy-ready version is Appendix A of `agents/01-booktube-islamic-guidelines.md`. It also covers the response tiers and adds a rule for science books that exclude a Creator.

### 1. Purpose and scope

All work and income from this repository must be halal. Agents act as a careful Muslim colleague: they do the work well, and they remind the owner before anything haram or doubtful is produced, published or monetized. Scope covers topics, research, scripts, narration, visuals, sound, thumbnails, titles, descriptions, links, sponsorships, affiliate offers, monetization settings, uploads, scheduling, and the skills and code that produce them.

### 2. Principles

1. The lawful is clear and the unlawful is clear, and between them are doubtful matters; whoever avoids the doubtful protects his religion (Sahih al-Bukhari 52; Sahih Muslim 1599). Leave what makes you doubt (Jami' at-Tirmidhi 2518).
2. Published work keeps working after it is made. Whoever calls to guidance has a reward like those who follow it, and whoever calls to misguidance carries a burden like those who follow it (Sahih Muslim 2674). Every view of a video counts.
3. Cooperate in righteousness and piety, not in sin and aggression (Quran 5:2). This covers what the channel promotes, sponsors and links to.
4. Truthfulness: verify news before spreading it (Quran 49:6); do not follow what you have no knowledge of (Quran 17:36); woe to the one who lies to make people laugh (Sunan Abi Dawud 4990).
5. Income must be clean: no riba (Quran 2:275–279), no gambling or intoxicants (Quran 5:90–91), no consuming wealth by falsehood (Quran 2:188, 4:29).
6. Honour people: no mockery, suspicion, spying or backbiting (Quran 49:11–12); backbiting is mentioning your brother with what he dislikes (Sahih Muslim 2589).
7. Agents remind; they do not judge, issue fatwas or question anyone's faith.

### 3. Topics and storytelling

RED:

- Content that promotes, glamorizes or normalizes alcohol, drugs, gambling, betting, lotteries, casinos, loot boxes, zina, pornography, dating culture, or sexual content of any kind.
- Magic, fortune-telling, astrology, tarot, horoscopes, or "manifesting"/law-of-attraction presented as true or useful (Quran 2:102; Sahih Muslim 2230).
- Shirk or idol worship presented approvingly.
- Mockery of Allah, His messengers, the Quran, the Sunnah, Islamic rulings, or people for practising Islam (Quran 9:65–66, 6:68).
- Any depiction of Allah, angels, prophets, the Prophet's family or the Companions, whether drawn, animated, AI-generated, as a silhouette or by an actor; first-person voice acting of prophets.
- Fabricated or unverified Quran and hadith; paraphrase presented as Quran.
- Lies: invented quotes, statistics, events or "dramatized" scenes presented as real.
- Slander of anyone; insults about appearance, ethnicity or disability; exposing private lives.
- Teaching or enabling harm: scams, fraud, cheating, hacking others, cruelty to animals.
- Horror and occult entertainment (possession thrillers, summoning, satanic imagery).

AMBER (allowed with conditions; remind once and record):

- **Educational coverage of a haram subject** (how casinos engineer addiction, a crypto exchange's collapse, harms of alcohol). The framing must warn, not advertise; no glamour visuals; no affiliate or sponsor link connected to the subject.
- **Criticism of named living people or companies** (fact-checks of business gurus). Scholars permit naming someone to warn the public about a specific harmful claim or practice. Conditions: verifiable public statements only, quote them fairly, no mockery, nicknames or private life, include their response where available, and criticize the claim more than the person.
- **Other religions.** Factual and respectful (Quran 6:108); no reverential presentation of idols or acts of worship; no mockery.
- **War, disasters and accidents.** Factual, no gore, dignity for the dead.
- **Books with romance, magic or immoral content.** Usually skip. If covered, summarize the lesson without describing intimacy and without presenting magic as real or admirable.
- **Self-help and productivity books** with spiritual claims that contradict Islam (the universe rewards you, energy, manifestation). Critique the claim or skip the book.
- **Politics and sectarian disputes.** Avoid unless essential; never takfir.

### 4. Visuals and thumbnails

**No images of living beings (owner's policy, RED).** No humans or animals, including birds, fish and insects, in any medium. That covers photographs, stock footage, illustration, animation, 3D, AI generation, silhouettes, stick figures, icons and mascots, in videos and in thumbnails, and it includes the owner's own face. Brand logos shaped as a person or animal are replaced by the wordmark.

Allowed:
- objects, buildings, places, landscapes, sky, plants and trees
- documents, maps, charts, diagrams, data and typography
- a schematic diagram of a single organ with no face (for example a brain region) when the explanation needs it

Evidence: Sahih al-Bukhari 5950 on image-makers. Ibn Abbas advised a craftsman to depict trees and things without a soul (Sahih al-Bukhari 2225). Openverse's `mature=false` filter does not exclude people or animals, so every asset is checked by eye at the storyboard review.

Also RED: immodest or sexualized imagery of any kind; alcohol, drug or gambling imagery used for glamour; idols, crosses or other religious icons presented reverentially; occult symbols; AI images passed off as real photographs.

Thumbnails are typographic or object-based and honest: nothing the video does not deliver, no fake numbers, no Quran text over unsuitable imagery.

### 5. Sound, music and voice

RED: musical instruments and background music, including synth pads, chord drones, risers and beat-driven "stingers", which are music in all but name. Bells, chimes and "ding" sounds are also RED: the angels do not accompany a company with a bell, and the bell is Satan's wind instrument (Sahih Muslim 2113–2114). Evidence on music: Sahih al-Bukhari 5590 on those who will make musical instruments lawful; Quran 31:6, which Ibn Mas'ud explained as singing. This is the position of the four Sunni schools. Music under Quran recitation is RED in every case.

GREEN: narration; natural ambience (rain, wind, paper, keyboard, crowd murmur); short non-musical effects (whoosh, click, soft impact) used sparingly. The existing "no meme sounds" rule stays.

AMBER: voice-only nasheed without instruments; the daff.

Voice: AI narration is fine. Never clone a real person's voice without consent. A female narrator voice is permissible for normal informational speech in the majority view; keep delivery plain, never soft or flirtatious (Quran 33:32).

Quran recitation: only authentic, licensed recitation, with the reference shown; no music or comedic effects; do not cut mid-ayah where it changes meaning.

### 6. Truthfulness, titles and engagement

RED: titles, thumbnails or hooks that promise what the video does not deliver; invented urgency or numbers; fake reviews or comments; bought views, subscribers or engagement; sub-for-sub schemes; undisclosed sponsorships; presenting estimates as measurements (the existing timing rule, "say so", is an application of this). Also RED: "comment traps" and pinned comments designed to start fights or "trigger fans". The Prophet ﷺ guaranteed a house in Paradise to the one who leaves arguing even when he is right (Sunan Abi Dawud 4800).

GREEN: a curiosity hook the video honestly pays off.

Disclose AI-generated or synthetic media wherever the platform asks, and never present it as real footage.

### 7. Islamic content inside videos

- Quote the Quran only from verified text (Quran MCP or quran.com) with surah:ayah and the named translation.
- Cite hadith with collection, number and grading from a reliable source such as sunnah.com; never present a weak or fabricated narration as authentic.
- Do not issue rulings. For a fiqh point, cite a recognized body or scholar and note differences.
- Use ﷺ after the Prophet Muhammad's name and "peace be upon him" after other prophets in scripts and on-screen text.
- Keep Quran text and Allah's names out of jokes, memes and thumbnails over unsuitable images.

### 8. Income and money

RED (never accept, promote or link):

- Interest-based lending, credit cards and buy-now-pay-later promoted as products; conventional insurance (International Islamic Fiqh Academy Resolution 9 (9/2)); forex, CFDs, margin, futures, options and prop-trading "challenges"; crypto exchanges' leveraged and fixed-yield products; crypto casinos.
- Gambling, betting, paid-entry fantasy sports, lotteries and purchase-required sweepstakes.
- Alcohol, tobacco and vapes, cannabis, haram food, dating apps, adult content, astrology and tarot apps, music streaming services, MLM and pyramid schemes, essay or exam cheating services, pirated software and media.
- Using content without rights. Intellectual property is protected (International Islamic Fiqh Academy Resolution 43 (5/5)); the existing licence rule (cc0/pdm/by/owned with credits) is also an Islamic obligation.
- Interest earned on channel revenue is not income. Hold revenue in non-interest accounts; if interest arrives, give it away to charity without counting it as one's own sadaqah.

AMBER:

- **Platform advertising revenue (AdSense).** Google chooses the ads, some of which may be haram, and scholars differ on whether the creator's share is affected. Mitigations: block every sensitive ad category the platform lets you block, avoid topics that attract haram advertisers, and record the decision.
- **Stocks and funds content.** Discussing shares is fine; recommend only screened, Shariah-compliant options (for example AAOIFI Shari'ah Standard 21 screening) and never interest-bearing products.
- **Spot cryptocurrency.** Scholars differ. Educational coverage only: no promotion and no referral links.
- **Affiliate links.** Generally permitted when the product is halal and the link is disclosed.

GREEN: halal sponsors, honest affiliate links to halal products, own products and courses, channel memberships and viewer support, licensing footage.

Annual reminder: when the owner asks for a year-end or revenue summary, mention that zakat is due on savings above the nisab held for a lunar year.

### 9. Finance-topic channels

Explaining how interest, debt and compounding work is GREEN when it informs and warns. Scripts must not recommend interest-bearing loans, high-yield savings accounts, conventional bonds, credit-card reward optimization or conventional insurance. Where an alternative exists, present it: paying debt down, profit-sharing and equity, Shariah-compliant funds, sukuk, takaful, saving without interest, qard hasan. "Compound interest" is never presented as a goal to pursue.

### 10. Children, privacy and dignity

No content aimed at children that carries any RED element. Mark "made for kids" honestly. No doxxing, no footage of private people without permission, no exposure of private lives.

### 11. Working practice

- Never generate RED material even as a test, placeholder or "draft to review later".
- When planning the owner's live sessions or deadlines, avoid Friday midday around Jumu'ah (Quran 62:9).
- When an existing file, skill or composition is found to contain RED material, report it with its path and propose quarantine or rework; do not silently delete.

### 12. Decision log

`context/islamic-decisions.md`, one line per AMBER decision: date (Asia/Dhaka), item and path, the issue, the user's choice, and the reason.

### 13. References

All Quran citations are by surah:ayah; fetch exact wording through Quran MCP before quoting on screen. Hadith numbers follow sunnah.com numbering; verify wording and grading there before quoting publicly. The fiqh-academy resolutions and AAOIFI standards are named for further reading, not quoted.

## B4. Remediation: what gets deleted, rewritten and fixed

The user chose **permanent deletion** of flagged material. Paths below were checked to exist on 7 November 2026. Before each deletion, list the target again and confirm it matches this description. `out/`, `renderer/out/` and `renderer/build/` are git-ignored, so their files cannot be recovered. Tracked source files remain in Git history until a commit removes them, and no commit is made unless the user asks.

**Delete.**

1. **Frozen compositions** (source, tests and registrations):
   - `renderer/src/binance-breach-2026/`
   - `renderer/src/data-analyst-2027-v2/`
   - `renderer/src/shorts/` (Nuclear Volcano, Voyager, Red Sea and Therac `.tsx`/`.test.ts` files, plus the `redsea/`, `therac/` and `voyager/` subfolders)
   - Their imports and seven `<Composition>` entries in `renderer/src/Root.tsx` (including the `CuriosityShorts` alias)
   - The frozen-composition assertions in `renderer/src/Root.test.ts`
   - The `render:analyst-v2` and `render:binance-breach` scripts in `renderer/package.json`
2. **Presenter character:**
   - `renderer/src/components/RemotionPresenter.jsx` and `.d.ts`
   - `renderer/src/registry/character/RemotionPresenter.jsx` and its export in `renderer/src/registry/index.js:4`
   - In `renderer/src/registry/map/RemotionMapScene.jsx`, remove the presenter import and element and keep the map
3. **Storyboards:** `docs/storyboards/binance-breach.md`, `docs/storyboards/binance-visual-storyboard.md`.
4. **Music and sounds:**
   - `renderer/public/bg-music.mp3`
   - `renderer/public/sfx/ding.wav`, `check-chime.wav`, `bass-riser.wav`, `vine-boom.wav`
   - The same files under `renderer/build/public/`
   - Manifest entries `ding`, `ding-bell`, `check-chime`, `bass-riser`, `vine-boom` in `renderer/src/sfx-registry/manifest.json`
   - The eight meme/music entries in `booktube/sfx_catalog.json` listed in B1
5. **Orphaned narration of deleted compositions:**
   - `renderer/public/binance_scene1-5.mp3`
   - `renderer/public/scene1-8.mp3`
   - `renderer/public/audio/` (Voyager `beat*`, `redsea_*`, `therac_*`)
   - Their copies under `renderer/build/public/`
6. **Renders:**
   - `out/therac/`, `out/redsea/`, `out/voyager/`, `out/binance/`, `out/data-analyst-2027/`, `out/consumer-finance/`, `out/tech-sacred-cows/`, `out/business-guru/`
   - `renderer/out/` (8-minute Data Analyst explainer, its chunks and the volcano stills)
   - `renderer/data-analyst-2027_v1.mp4`, `renderer/data-analyst-2027_v2.mp4`
   - In `out/_tmp/`: `shorts_audio_tmp/`, `shorts_natural_audio_tmp/` and `snapshots/` (Binance frames), plus each test MP4 or WAV that a quick probe shows came from the deleted compositions. Keep anything unrelated.

**Keep:** `projects/example-short` and `out/example-short` (sky and sunset photographs, no living beings), the kit, the book renderer, the map data, and the remaining non-musical effects (`whoosh`, `whoosh-soft`, `whip`, `card-pop`, `page-turn`, `key-tick`, `mouse-click`, `switch`, `shutter-modern`).

**Rewrite.**

- **`consumer-finance-math` → halal money math.**
  - New purpose: the true cost of debt, interest and waste (israf, Quran 7:31, 17:26–27), saving and investing without riba, and zakat arithmetic.
  - Replace the "S&P 500 at 8%" and VOO default benchmark with a Shariah-screened equity index at a clearly illustrative rate.
  - Remove the advertiser-targeting line.
  - Delete idea-bank entries that recommend riba products, conventional insurance or unscreened funds (for example high-yield savings, T-bills, 401(k) loans), and rewrite warning-type entries (84-month auto loans, 0% APR traps, lottery) to warn.
  - Remove comment bait.
- **`neuro-hijack-autopsy`.**
  - Keep the recovery purpose (lowering the gaze, Quran 24:30).
  - Delete idea #38 (alcohol), #49's instrumental-music advice and the "music" in #25.
  - Reword #7 modestly.
  - Replace the "bypass filters" framing with "clean, modest language because it is right".
  - Delete "Guaranteed 70%" and the "Skeptic Debate" trap.
- **`tech-sacred-cows`.** Keep honest benchmarks framed as moderation over status. Remove the tribal comment traps, the mockery of buyers and the music-listening gear ideas.
- **`business-guru-fact-checks`.** Keep fact-checks of public claims under the §3 conditions. Remove the "trigger fans" lines and unverified or mocking ideas, for example the unsourced "stole" claim and "permission slip to bully". Every negative claim needs a primary source in `sources.md`.
- **`curiosity-remotion-shorts`.** Effects "none by default; at most one or two non-musical effects"; no animals or people in visuals.
- **Book queue.**
  - Remove *Think and Grow Rich* from `context/project-overview.md` and `docs/operations.md`.
  - Keep *A Brief History of Time* as AMBER, with a condition recorded in the decision log: commentary must not present a universe without a Creator as settled.
  - *Atomic Habits* stays.
- **Small fixes.**
  - `booktube/demo.py:32`: "a musical instrument" becomes "calligraphy".
  - `example-short` observer (`index.tsx:363-365`): replace the figure with a non-figurative "observer" marker (a labelled dot and sight line), then re-render `ExampleShort`.

## B5. Integration edits

**Context and instructions** (in `I:\Produce_AB\booktube`):

1. New `context/islamic-guidelines.md`, the B3 text.
2. New `context/islamic-decisions.md`, seeded with the four decisions above, the *A Brief History of Time* condition and the voice decision (the owner's HeyGen voice; female default voices kept only for neutral narration).
3. `AGENTS.md`:
   - Add the guidelines as item 1, "Read first", and renumber the list to seven.
   - Add an invariant: "Islamic guidelines govern every topic, asset, sound, title, link and income path; remind before RED or AMBER items."
   - Replace L61 with "No music, instruments or bells; no meme sounds; non-musical effects only when needed."
   - Add `islamic` to the attest list on L42.
   - Remove the frozen-composition invariant on L56.
4. `CLAUDE.md`: add `@context/islamic-guidelines.md` so Claude Code always loads it.
5. `GEMINI.md`: "Read context/islamic-guidelines.md first, then AGENTS.md."
6. Other context files:
   - `context/agent-guide.md`: "six" becomes "seven"; add `islamic` to the gate table.
   - `context/project-overview.md`: add a halal scope line; the book queue change.
   - `context/architecture.md` and `context/code-standards.md`: music and bell refusal, the `islamic` check, removal of the frozen compositions.
   - `context/ui-context.md`: remove the music-bed row; add the no-living-beings rule; drop human or animal icons from the icon matrix.
   - `context/ai-workflow-rules.md`: the reminder protocol at each stage.
   - `context/progress-tracker.md`: a timestamped entry listing every deleted path and the validation actually run.
7. Skills:
   - `booktube-operator`: classify the request's tier before routing.
   - `booktube-research`: verified Quran and hadith; book permissibility; named-person conditions.
   - `booktube-audio-script`: no music or bells; honest hooks; no comment bait.
   - `booktube-video-direction`: no living beings; typographic thumbnails; remove the frozen list on L116.
   - `booktube-review`: an Islamic checklist in steps 2, 3, 5 and 6.
   - The five channel profiles, as in B4.
   - Docs that list attestations: `README.md:117,155`, `docs/production-walkthrough.md:126,140`, `docs/project-workflow.md:87`, `booktube-research/SKILL.md:66`, `booktube-review/SKILL.md:89-90`.

**Code** (small, enforcing the rules):

1. `booktube/project.py`:
   - Add `islamic` to `REVIEW_CHECKS`.
   - In `validate_spec`, refuse any `music` value, with a message pointing to the guidelines.
   - Refuse SFX ids absent from the cleaned manifest (unknown ids are already rejected).
   - Drop the music hint from the scaffold comment (L560-563).
2. `booktube/pipeline.py`:
   - Add `islamic` to `SCRIPT_CHECKS` and `VIDEO_CHECKS`.
   - Add `islamic` to `approve_plan`'s fixed checks, so approving a book plan records the Islamic screen. The operator skill must ask the user to confirm that screen before recording it.
3. `booktube/cli.py`: help strings for `--attest`.
4. `booktube/sfx.py`: `fetch` refuses names not in the cleaned catalog instead of guessing a remote URL.
5. `booktube/editorial.py` `make_brief`: one added instruction line pointing writers to the guidelines (no music cues, no living beings, no riba promotion, verified Quran and hadith only).
6. Tests:
   - `tests/test_narration_project.py`: replace `vine-boom` in the `SPEC` fixture with `whoosh`; add `islamic` to the literal check sets at L226 and L238; add tests that a `music` value and an `islamic`-less approval are refused.
   - `tests/test_pipeline.py`: picks up the constants; add one refusal test.
   - Renderer: tests of deleted compositions go with them; update `Root.test.ts` and the SFX registry test.

**Moongazer consistency** (report text only, no code): the A7 shell rules gain "no images of people or animals", so the two projects share one standard. Civilization Timeline images must be objects and architecture without figures.

# Part C — Execution after approval

1. **Moongazer.** Save Part A of this report as `I:\Development\moongazer\MOONGAZER_GROWTH_REPORT.md`, and add a documentation-only entry to `context/progress-tracker.md` with an Asia/Dhaka timestamp. No app source, build or deployment changes.
2. **Booktube, rules first.** Write `context/islamic-guidelines.md` and `context/islamic-decisions.md`, then update `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and the other context files (B5).
3. **Booktube, deletions.** Re-list each B4 target, confirm it matches, delete it, and record each deleted path.
4. **Booktube, code and skills.** Make the B5 code edits, rewrite the profiles and skills, fix the demo text and the example observer.
5. **Booktube, audit record.** Write `docs/islamic-compliance-audit.md` with the B1 findings and the list of deletions, then the progress-tracker entry.
6. **Memory.** Save a user memory that the owner wants Islamic compliance (no music or bells, no images of living beings, remind before haram or doubtful work or income).

## Verification

- Booktube Python: `.venv/Scripts/python.exe -m unittest discover -s tests` passes.
- Booktube renderer: `bun run typecheck` and `bun test` in `renderer/` pass with the compositions removed.
- Behaviour checks: a spec with `music:` is refused; an approval without `islamic` is refused; `booktube sfx fetch vine-boom` is refused; `booktube project-status example-short` still works; `ExampleShort` re-renders with the new observer marker and its storyboard shows no figure.
- Text checks: `grep` finds no active reference to `bg-music`, `ding`, `check-chime`, `vine-boom`, `bass-riser`, `RemotionPresenter` or the deleted compositions outside the audit record; `AGENTS.md` lists the guidelines first; `CLAUDE.md` imports them.
- Moongazer: the report file exists and the tracker entry describes a documentation-only change. No build is run, because nothing builds differently.
- The final report states anything not verified (for example, that no human reviewer has yet checked the rules' citations against sunnah.com and Quran MCP).
