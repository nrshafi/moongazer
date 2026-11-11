# Moongazer implementation plan: index

Written 11 November 2026 (Asia/Dhaka) from a founder decision interview held the same day. This folder is the **authoritative execution plan** for Moongazer up to Ramadan 1448 and the work after it. It replaces these as instructions: `plan/agents/06–15`, `plan/MOONGAZER_STRATEGIC_DECISIONS.md` and the open questions in `plan/FIRST_PARTY_SERVICES_PLAN.md`. Those files remain as background only. `plan/REPORT.md`, `plan/DESIGN_RECOMMENDATIONS.md` and `plan/Verify_Me.md` remain as reference material where a task cites them.

**If you are a model given one task:** read `01-HANDOVER-PROTOCOL.md` first, then your phase file, then only the task you were given. Do not start other tasks.

## 1. Settled decisions (11 November 2026)

These are final. Do not ask the owner again. A conflict between this table and any older plan file is resolved in favour of this table.

| # | Area | Decision |
| --- | --- | --- |
| D1 | Plan format | This folder: index, protocol, one file per phase, numbered self-contained tasks. |
| D2 | Authorization | The confirmed plan authorizes all **local** code, content and documentation work in it. Anything that reaches production needs the owner's explicit request each time: push or merge to `main`, Cloudflare DNS, redirect rules, rate-limit rules, D1 creation, new Pages projects, Search Console changes. |
| D2a | Authorization update (11 Nov 2026) | The owner later authorized the implementing agent to push to GitHub (which deploys) and to use the Cloudflare account, phase by phase, pausing only where a phase needs the owner's own input. |
| D2b | Full delegation (11 Nov 2026) | The owner gave the implementing agent full permission to make the owner-input decisions (spot-checks, privacy wording, production setup) without asking. Each such decision is recorded in the release note as agent-made. |
| D2c | New hosts, no redirects (12 Nov 2026) | The owner asked to keep only the new things: the four merged apps (quran-concept-atlas, islamic-history-timeline-challenge, halal-business-decisions, islamic-misinformation-casebook) are deleted with their Pages projects and subdomains, and the 16 kept apps move to subdomains matching their new names, with **no redirects** from any old host. This supersedes P3 step B (301s), REPORT §A4 rule 9 (hosts stay) and the P5 apex short links. Slug map: quran-connections→ayah-threads, the-seerah-detective→seerah-detective, everyday-akhlaq-simulator→everyday-akhlaq, interactive-seerah-timeline→seerah-timeline, quran-memorization-workload-calculator→hifz-planner, is-this-actually-in-the-quran→is-it-in-the-quran, islamic-knowledge-escape-room→quran-escape-room, stories-of-the-prophets-explorer→stories-of-the-prophets, quranic-places-atlas→places-in-the-quran, islamic-concept-connections→word-groups, understand-salah-lab→understand-your-salah, quranic-parables-studio→parables-of-the-quran, islamic-civilization-timeline→civilization-timeline, revelation-context-explorer→why-it-was-revealed, family-islamic-learning-challenges→family-halaqa; guess-the-surah unchanged. Saved browser data does not carry over (new origins). |
| D3 | Git | One branch per phase (`phase-N-short-name`), one commit per task, never push. Content work uses `content/<app-slug>` branches. The owner reviews, merges and pushes. |
| D4 | Releases | Publish after each phase passes verification (the owner pushes `main`; GitHub Actions deploys). |
| D5 | Pre-freeze scope | Defects, names/honorifics, merges, first-party services, activity-first shell and directory, daily games and sharing, Hifz Planner, Zakat Calculator, Ramadan hub, Diagnostic Mastery Loop in four apps, **and the Depth Gate for all 16 apps**, all before the code freeze. |
| D6 | Code freeze | Friday 15 January 2027. After it only: fixes for live defects, verified content corrections from the feedback queue, approved corrections-log entries, and date-driven switches built before the freeze (for example the Ramadan seasonal slot). No new features, refactors, dependency changes or new routes until after Eid al-Fitr. |
| D7 | Ramadan | Ramadan 1448 is expected to begin about 8 February 2027, subject to moon sighting. Every public date says "expected; confirm with your local moon sighting". |
| D8 | Depth Gate targets | Per-app targets are fixed in section 4 below. Bounded canonical sets (114 surahs, 25 prophets named in the Quran, the phrases of the prayer) count as complete coverage. |
| D9 | Review rule | No human scholarly reviewer is available. Replace "qualified review" everywhere with: exact primary-source attribution (Quran MCP refs and editions, sunnah.com collection and number, named classical works), **plus a separate second-pass verification task** that re-checks every citation in a content batch, **plus an owner spot-check** of a sample per batch. Never claim review, certification or endorsement. Audio pronunciation (Alif Ba) waits for a recorded or licensed source. |
| D10 | Content authorship | Models draft content from Quran MCP and sunnah.com with exact sources; a verification task re-checks; the owner spot-checks a sample. |
| D11 | Mastery Loop | The Diagnostic Mastery Loop (diagnostic → targeted micro-cards → final check) ships in all four apps before the freeze: Understand Your Salah, Stories of the Prophets, Why It Was Revealed, Everyday Akhlaq. One shared pure engine, copied per app. |
| D12 | Tracks | Two tracks. **Code track**: shared files are single-writer and phases run in order; app-local feature work may run in parallel when it touches only that app's non-shared files. **Content track**: adds verified items to an app's `src/data/` and `_implementation/research/` on its own branch. Only one writer per app at a time across both tracks. |
| D13 | Civilization Timeline | Rebuilt to the Depth Gate before the freeze (40+ records, gaps filled, every record plotted). Not folded. |
| D14 | Services timing | Feedback form, corrections log and the three-event counter are built early (phase 4) so they burn in before Ramadan. |
| D15 | Services hosting | **Pages Functions on the apex `moongazer` Pages project**, with **one D1 database** holding feedback rows and aggregate counter rows. The apex deploys with `wrangler pages deploy`; the twenty apps keep the existing custom Direct Upload path. |
| D16 | Anti-spam | No Turnstile (it is a third-party script). Use a honeypot field, a minimum time-to-submit, server-side length and enum validation, one Cloudflare rate-limiting rule on `/api/*`, and every submission stored as `pending`. |
| D17 | Moderation | The owner reviews pending feedback with a local script. Approved corrections are written to `homepage/corrections.json` in Git; `/corrections/` is built statically. No email notifications. The public log never reads D1 at runtime. |
| D18 | Defect list | The 18-item list in the strategic doc is corrected: #17 (hard-coded years) is dropped because the only "2026" strings are true retrieval dates; #16 (BDI) and #18 (offline audio) become verification checks; #15 (storage on merges) moves to the merge phase; #9 (Akhlaq `constructive` flag) is included in phase 1. |
| D19 | Merge data | Two-step merge: first a "This app moved" release of each old app with a button that carries saved IDs to the receiving app in the URL fragment (`#import=…`); the receiving app imports them. The 301 hostname redirects go live no sooner than **14 days** after that release. |
| D20 | Design system | Subject-family tokens govern all colour. Archetypes from `plan/DESIGN_RECOMMENDATIONS.md` govern layout, components and motif only. Fonts stay DM Sans, Newsreader and Amiri, plus one locally hosted OFL monospace (JetBrains Mono) for Dossier and Playboard metadata chips. Per-app archetype palettes and the other named fonts in that file are **not** used. Brand names in that file are inspiration only; never copy another company's branding. |
| D21 | Verify_Me | Triaged: accessibility, spoiler and copy bugs go into phase 1; app UX items go into the app's phase or content tasks; a modern English translation is a licence research task only. See `appendix-verify-me-triage.md`. |
| D22 | Daily numbering | Daily puzzle `#1` is the day daily mode is first published. The epoch is one constant, identical in every daily app and the directory, set when the owner schedules release R6. |
| D23 | Zakat | At every point where schools differ (personal-use jewellery, debt deduction, nisab metal), the learner chooses a labelled option with a source note. Both nisab bases are shown. No default ruling. The printed summary lists the choices made. |
| D24 | Booktube | Out of scope except interfaces: short links and a small static daily JSON export (phase 6) that Booktube can read. Video production has its own plan in the Booktube repository. |
| D25 | After Ramadan | New apps (Quran Words, Names of Allah, Alif Ba), then the Bangla edition of five apps, then platform work (install/offline, zero-account backup code, cross-app streak, teachers page). Accounts only on demonstrated demand. |

Standing rules that also still apply: no music, instruments, bells or chimes; no images of people or animals in any medium; exact canonical Quran text and named translation; honorifics; no accounts, ads or third-party scripts; anonymous-first; namespaced 30-day optional storage. See `context/project-dna.md`.

## 2. Phases and calendar

Dates are targets in Asia/Dhaka. "R" is a production release the owner publishes after verification. Phases in the shared lane run strictly in order.

| Phase | File | Lane | Target window | Release |
| --- | --- | --- | --- | --- |
| P0 Governance and context | (done in this planning session) | shared | 11 Nov | none |
| P1 Trust fixes | `P1-trust-fixes.md` | shared + app | 12–20 Nov | R1 |
| P2 Names, copy, honorifics | `P2-names-copy-honorifics.md` | shared + app | 21–27 Nov | R2 |
| P3 Merges, step A (sections + "moved" release) | `P3-merges.md` | app + shared | 28 Nov–6 Dec | R3 |
| P4 Feedback, corrections log, counter | `P4-first-party-services.md` | shared | 7–13 Dec | R4 |
| P3 Merges, step B (301s) | `P3-merges.md` tasks T3.9–T3.11 | deploy | on or after R3 + 14 days (≈20 Dec) | redirects |
| P5 Shell, DESIGN.md, directory | `P5-shell-design-directory.md` | shared | 14–27 Dec | R5 |
| P6 Daily games and sharing | `P6-daily-and-sharing.md` | shared + app | 28 Dec–3 Jan | R6 |
| P7 Hifz Planner, Zakat Calculator, Ramadan hub | `P7-ramadan-season.md` | app lane from 21 Nov; integration 4–8 Jan | 21 Nov–8 Jan | R7 |
| P8 Diagnostic Mastery Loop | `P8-mastery-loop.md` | app lane | 7 Dec–8 Jan | with R7 |
| C Depth Gate content | `C-content-track.md` | content | 16 Nov–8 Jan, rolling | merged into each release |
| P9 Depth Gate audit, freeze release, burn-in | `P9-gate-audit-freeze.md` | shared | 9–15 Jan; burn-in to ~7 Feb | R8 = freeze |
| P10 After Ramadan | `P10-after-ramadan.md` | all | from ~mid-March 2027 | per item |

### Dependency graph

```
P1 ──> P2 ──> P3(A) ──> P4 ──> P5 ──> P6 ──> P9
                │                 │      │
                └─(+14 days)─> P3(B) 301s │
P7 app-lane (Zakat, Hifz engine) ─────────┴─> P7 integration (after P5/P6) ─> P9
P8 engine + app work (after P2) ──────────────> P8 integration (after P5) ──> P9
C content batches (from P1 onward, one writer per app) ───────────────────────> P9
```

### Schedule risk (state it honestly)

The pre-freeze scope is large for nine weeks. If a phase slips more than three days, the next model reports it in the status table and the owner decides what moves after Ramadan. The first candidates to move are: CC0 museum images (Civilization), Mastery Loop in Why It Was Revealed, the "Friends & online" Akhlaq track, print/projector polish. Never cut a defect fix or source verification to save time.

## 3. Shared files (single writer)

These files are byte-identical copies in every app (checked 11 Nov 2026). Only the shared lane edits them, then copies to all apps with `_implementation/sync-shared.ts` (created in T1.1).

- `src/layouts/Shell.astro`
- `src/styles/refinement.css`
- `src/components/LearningGuide.astro`
- `src/lib/utils.ts`
- `src/lib/seo.ts`
- `src/components/Honorific.astro` (added in P2)
- `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/sitemap.xml.ts`
- `public/_headers`

Also shared-lane only: `src/lib/shell.ts` (2 variants), `src/styles/global.css` (6 variants: edit per app but in the shared lane), everything under `homepage/`, `deployment/`, `_implementation/`, `.github/`, root `context/` and root `AGENTS.md`.

App-local (parallel allowed, one writer per app): everything else under `apps/<slug>/`, including `src/pages/index.astro`, detail routes, `src/lib/<engine>.ts`, `src/data/*`, `tests/`, the app's `context/` and `DESIGN.md`.

## 4. Depth Gate targets

An app passes the Depth Gate only when all four hold:

1. **Zero trust defects**: no open P1 item for the app; its own `sources.astro`.
2. **Activity first**: at 390 × 844 (and 375 × 812) the first interactive control or content card starts at or above 600 px from the top.
3. **Content depth**: the target below, every item primary-source verified (D9).
4. **Source transparency**: every item links its exact Quran reference or primary-source edition; fiqh options name their school or standard.

| App (folder) | Today (11 Nov) | Gate target | Notes |
| --- | --- | --- | --- |
| Guess the Surah (`guess-the-surah`) | 114 surahs | 114 surahs, each with a verified name-meaning clue | Complete canonical set |
| Ayah Threads (`quran-connections`) | 30 puzzles | 30 puzzles, each from ≥2 different surahs (3 where possible), distractors rebuilt; 30-theme library | Grow to 90 after Ramadan |
| Word Groups (`islamic-concept-connections`) | 16 boards / 20 groups | 30 boards from ≥40 groups, distinct titles | |
| Quran Escape Room (`islamic-knowledge-escape-room`) | 8 rooms | 16 rooms (64 locks), room names that don't reveal the theme | 10 of the 16 grouped as a "Ramadan nights" path |
| Is It in the Quran? (`is-this-actually-in-the-quran`) | full corpus + 12 casebook cases (to merge) | full search + 30 "Common claims" | Grow to 100 after Ramadan |
| Stories of the Prophets (`stories-of-the-prophets-explorer`) | 25 prophets | 25 prophets (complete) + Mastery Loop | Chapters for 7 major prophets after Ramadan |
| Parables of the Quran (`quranic-parables-studio`) | 14 parables | 30 parables (amthal) with verified refs | |
| Places in the Quran (`quranic-places-atlas`) | 15 places | Every place named in the Quran per a documented list compiled from Quran MCP search (expected ≈22–26), incl. Badr, Hunayn, Yathrib; combined Bakkah/Makkah | List and method recorded in research |
| Why It Was Revealed (`revelation-context-explorer`) | 10 readings | 30 readings + Mastery Loop | Mushaf order |
| Seerah Timeline (`interactive-seerah-timeline`) | 36 events | 36 events + merged "Which came first?" (12 packs) + daily pairs | |
| Seerah Detective (`the-seerah-detective`) | 12 cases | 30 cases, each from 2–3 different reports | |
| Civilization Timeline (`islamic-civilization-timeline`) | 24 records | 40 records, Rashidun and 10th–13th c. gaps filled, West Africa, South and Southeast Asia incl. Bagerhat; every record plotted | D13 |
| Understand Your Salah (`understand-salah-lab`) | 15 lessons | All phrases of the prayer (complete) as a step-by-step course + Mastery Loop + per-ayah Al-Fatiha audio | |
| Hifz Planner (`quran-memorization-workload-calculator`) | 114 chapters / 604 pages | Wizard uses all 114 / 604 | Complete canonical set |
| Everyday Akhlaq (`everyday-akhlaq-simulator`) | 20 + 12 business (to merge) | 32 scenarios with real branching + Mastery Loop | |
| Family Halaqa (`family-islamic-learning-challenges`) | 12 packs | 42 packs = 12 existing + 30-night Ramadan series | |
| Zakat Calculator (new, `zakat-calculator`) | — | Every documented asset category and every listed school difference covered (D23) | New app must pass the gate at launch |

## 5. Status

Update this table when a task or phase starts or finishes (see protocol §6).

| Phase / batch | Status | Branch | Date (Asia/Dhaka) | Notes |
| --- | --- | --- | --- | --- |
| P0 | Done | main (uncommitted) | 2026-11-11 | Plan written; superseded banners added; DNA and services plan updated. |
| P1 | Done (R1 pushed) | phase-1-trust-fixes → main | 2026-11-11 | 19 tasks + tooling; see `releases/R1.md`. Tasks delegated to Sonnet/Haiku subagents were reviewed and committed by the orchestrator. |
| P2 | Done (R2 pushed) | phase-2-names → main | 2026-11-11 | Names, nav verbs, interface words, honorifics, directory, social cards; see `releases/R2.md`. |
| P3 step A | Done (R3 pushed 2026-11-11) | phase-3-merges → main | 2026-11-11 | Step B (301s) on or after 2026-11-11 + 14 days. See `releases/R3.md`. |
| P3 step B | Not started | | | |
| P4 | Done (R4 pushed 2026-11-12) | phase-4-services → main | 2026-11-12 | Feedback form, corrections log, anonymous counter (16 apps; Hifz with P7). Production setup agent-run under D2b; see `releases/R4.md`. |
| P5 | Not started | | | |
| P6 | Not started | | | |
| P7 | Not started | | | |
| P8 | Not started | | | |
| C (see `C-content-track.md` §5 for per-app rows) | Not started | | | |
| P9 | Not started | | | |
| P10 | Not started | | | |
