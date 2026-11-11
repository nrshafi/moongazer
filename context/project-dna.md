# Moongazer project DNA

Established 8 November 2026 in Asia/Dhaka. This file defines Moongazer's mission, vision, focus boundaries, core values, impact measurement, and learning loop. It is internal governance for the founder and coding agents. Read it before `context/project-overview.md` and before planning, modifying, or proposing any app or brief.

## 1. Mission

Help Muslim households, students, and new learners build a daily habit of understanding the Quran, Seerah, and Salah through short, source-verified interactive activities that work in one tap with zero distractions.

Classroom use by weekend-school teachers and misinformation checking serve this daily learning habit rather than replacing it.

## 2. Vision and sustainability

Grow Moongazer into a trusted, permanently free digital waqf reaching hundreds of thousands of English and Bangla learners, funded by optional community patronage or grants rather than paywalls or advertisements.

Every learning activity stays free, ad-free, and free of third-party tracking scripts.

### Booktube as a social media growth companion

Booktube is a motion-graphics video tool, not a revenue source for Moongazer. Under Booktube's Islamic guidelines, which forbid music, bells, and images of living beings, Booktube acts as Moongazer's short-form visual funnel on YouTube Shorts, Instagram Reels, TikTok, and WhatsApp channels.

Booktube turns verified Moongazer JSON content into three recurring video formats that end on a Moongazer short link such as `moongazer.tech/surah`:

1. **Play-along hooks.** 30-second "Guess the Surah in 3 clues" or "Which event came first?" clips that pause before the final reveal and invite viewers to play today's board on Moongazer.
2. **Source-check explainers.** 45-second typographic and map animations built from the Misinformation Casebook, Stories of the Prophets, or Salah phrase meanings.
3. **Ramadan 30-night companion shorts.** One daily video during Ramadan paired with that night's Moongazer puzzle and Family Halaqa pack.

## 3. Singular focus and boundaries

### What we build

Moongazer specializes in **interactive, browser-based Islamic learning activities and essential worship tools grounded in canonical text**. This includes:

- Daily Quran, Seerah, and Arabic vocabulary games
- Guided primary-source readers for revelation context, parables, prophets, places, and verified claims
- Practical worship and study planners, specifically Salah comprehension, Hifz planning, Family Halaqa packs, and a classical Zakat Calculator

### What we refuse

Even when facing traffic temptations or trends, Moongazer does not build or host:

- Fatwa issuance or original religious rulings
- Social feeds, comment sections, or public user profiles
- Public or competitive leaderboards that turn religious study into status competition
- Live AI chat or unverified generative answers
- Unrelated lifestyle utilities outside interactive learning and essential worship calculations

### Minimal user accounts policy

1. **Anonymous-first default.** Every app must work 100% on first visit without an account, sign-up wall, or personal data history, using local browser storage.
2. **Zero-account backup first.** Before introducing accounts, provide a zero-account export/import backup code so learners can move progress manually.
3. **Demand-triggered progress sync.** Minimal user accounts may be introduced only when user requests via the feedback form show clear demand for cross-device progress saving. Accounts must collect the minimum possible data, store only progress state across `moongazer.tech` apps, never collect real names or social profiles, and include a one-click delete action. Technical planning lives in `plan/FIRST_PARTY_SERVICES_PLAN.md`.

## 4. Core values in priority order

When speed, traffic, or convenience conflict with principle, apply these five values in strict rank order:

1. **Shariah and source fidelity first.** Preserve exact canonical Quran text and named translations, cite primary sources, use proper honorifics such as ﷺ, separate sacred text from editorial exercises, and strictly enforce no music, no bells, and no images of living beings. For fiqh-sensitive tools like the Zakat Calculator, never issue original rulings; present documented classical calculations such as both standard gold and silver nisab thresholds with their textual basis and let the learner choose which standard they follow.
2. **Genuine learning over shallow engagement.** Every activity must build real comprehension, recall, or reflection rather than clickbait trivia or empty gamification.
3. **Zero-friction, privacy-respecting access.** Show the interactive activity on the first screen, move caveats into a compact drawer, never force sign-ups, and never load third-party tracking beacons or ad scripts.
4. **Depth before expansion.** Fold the four overlapping apps into sixteen stronger apps as planned in Brief 10, bring all sixteen apps up to the Depth Gate, and release new apps only after their development satisfies the Depth Gate. A large portfolio is welcome, provided every app meets the depth bar before launch.
5. **Radical honesty about limits.** State clearly what is canonical versus authored, and never invent scholarly review, ratings, dates, or usage metrics.

## 5. Prioritizing impact and the Depth Gate

Moongazer rejects vanity metrics and trend-chasing. We evaluate impact through three concrete signals:

### The Depth Gate for every app

No existing app is considered complete, and no new app may launch, until it passes all four requirements:

1. **Zero trust defects.** Free of spoilers, broken grading, and copied boilerplate defects listed in `plan/REPORT.md` section A0, with an app-specific `sources.astro` page.
2. **Activity-first mobile layout.** The primary interactive element is visible on the first phone screen at 375 by 812 pixels, with editorial disclaimers tucked into a "How this works" drawer.
3. **Minimum content depth.** At least 30 distinct, primary-source-verified items, puzzles, or cases for games and readers so a learner gets a full month of daily use without repeats, or complete canonical coverage for tools such as all 114 surahs and 604 pages for the Hifz Planner and all 28 letters for Alif Ba.
4. **Classical source transparency.** Every item links to its exact Quran reference or primary source edition, and fiqh-sensitive calculators state the classical school or standard used for each option.

### Per-app Depth Gate targets and the verification rule (11 November 2026)

The owner fixed per-app content targets in `plan/implementation/00-INDEX.md` §4. Bounded canonical sets (114 surahs, the 25 prophets named in the Quran, the phrases of the prayer) count as complete coverage; other apps have explicit numbers. All sixteen apps and the new Zakat Calculator must pass the gate before the 15 January 2027 code freeze.

Because no scholarly reviewer is available, "qualified review" is replaced everywhere by: exact primary-source attribution, a separate second-pass verification of every citation in each content batch, and an owner spot-check of a sample. The product never claims review, certification or endorsement. Audio pronunciation guidance waits for a recorded or licensed source.

### Privacy-friendly interaction counters

To measure whether activities actually help learners finish and share without tracking personal identity, Moongazer will use a cookie-free, IP-free first-party counter recording only `{date, app_slug, item_id, event_type}` for three events:

- `activity_started`
- `activity_completed`
- `share_clicked`

`page_view` tracking is excluded. The architecture was settled on 11 November 2026 (Pages Functions on the apex with one D1 database, no Turnstile, no stored IP addresses, a static corrections log). Implementation: `plan/implementation/P4-first-party-services.md`. Status (11 November 2026): the Functions, D1 schema, allowlist and owner scripts are built and tested locally (P4.1–P4.4, P4.8); the app and directory wiring (P4.5–P4.7) and production setup (P4.10) are pending.

### Organic community pull

Track Google Search Console query discovery, direct WhatsApp sharing, and qualitative feedback from parents, students, and teachers.

## 6. Embracing learning, setbacks, and corrections

1. **Prune and merge weak work.** When an app duplicates another or falls short, merge or rebuild it rather than defending sunk cost. Fold `quran-concept-atlas`, `islamic-history-timeline-challenge`, `halal-business-decisions`, and `islamic-misinformation-casebook` into the four host apps specified in Brief 10 with 301 redirects.
2. **Fix defects before adding features.** Trust-damaging defects in Brief 06 take priority over visual redesigns or new apps.
3. **Community-driven corrections in place of an in-house scholar reviewer.** Because recruiting a dedicated Islamic studies reviewer is not currently possible, pair strict primary-source attribution with a built-in first-party **"Report an error or suggest feedback"** form in every app footer and result panel, backed by a public Corrections Log on the directory.
