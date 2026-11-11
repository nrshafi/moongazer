# Brief 11 — Moongazer: Hifz Planner, Zakat Calculator and the Ramadan hub

> **Superseded (11 November 2026):** this file is background only. The authoritative execution plan is [`plan/implementation/00-INDEX.md`](../implementation/00-INDEX.md). Where they differ, the implementation plan wins.

**Repository:** `I:\Development\moongazer`
**Depends on:** 08. **Authorized:** ask the owner first.
**Deadline:** ready by mid-January 2027. Ramadan 1448 is expected to begin around 8 February 2027, subject to moon sighting.
**Goal:** be useful at the year's biggest moment for Islamic learning, with a planner, a calculator and a seasonal hub.
**Background:** `../REPORT.md`, A8 entry 14 (Hifz Planner), A9 (Zakat Calculator), A11 item 5, A14.

## Part 1 — Hifz Planner (upgrade of `quran-memorization-workload-calculator`)

Keep the engine and its tests. Build on top.

1. **Wizard.**
   1. "What have you memorized?": choose juz or surahs. Use the bundled 114 chapters and the 604-page layout already in `src/data/content.json`; the UI does not use them today.
   2. "Your week": days and minutes.
   3. "Your plan": this week's checklist and a calendar.
   Per-page minute estimates move into an "Adjust assumptions" drawer, with plain labels. For example, "How many new pages per session?" replaces "Maximum new pages per session".
2. **Check-offs** saved locally (opt-in, namespaced storage, documented key).
3. **"I missed a day"** re-plans from today.
4. **Printable weekly sheet** for a teacher.
5. **Optional vocabulary:** sabaq / sabqi / manzil (new lesson, recent revision, old revision), as a display setting.
6. **Calendar export** (fixed in brief 06), now from the wizard.

Context first: the app's `context/` (new flows, storage key) and the root project overview (name already changed in brief 07).

## Part 2 — Zakat Calculator (new app)

**Classical attribution rule (per `context/project-dna.md`, 8 November 2026).** Because recruiting a dedicated Islamic studies reviewer is not currently possible, do not issue original rulings or claim external certification. Present documented classical calculation methods with exact source notes, show both standard gold and silver nisab thresholds with their classical basis, and let the learner choose which standard they follow. Pair the app with the in-app correction and feedback form (`../FIRST_PARTY_SERVICES_PLAN.md`).

1. **New app folder** `apps/zakat-calculator/`.
   - Copy the current shell and stack pins from an existing app (Astro 7.4.2, Bun 1.4.4, TypeScript 6.0.3).
   - Next free port: 4341.
   - Add `AGENTS.md` and six context files.
   - Add it to `deployment/targets.json`, the verification scripts and the GitHub Actions list.
   - Pages project and DNS only on the owner's publication request.
2. **Inputs:** cash and bank balances, gold and silver (weight or value), business stock, money owed to you that you expect to receive, short-term debts due, and other zakatable assets as the reviewed method defines them.
3. **Nisab:** the visitor enters today's gold or silver price. There is no live price API (the architecture forbids runtime APIs). Show both nisab bases and say which the method uses by default.
4. **Method:** one documented method with source notes. AAOIFI Shari'ah Standard 35 (Zakah) is a candidate reference; verify its text before citing it. Note where schools differ, without ruling.
5. **Output:** the zakat due, a breakdown, and a printable summary. Nothing is stored unless the visitor opts in.
6. **Pure, tested calculation module** with worked examples taken from the reviewed method.

## Part 3 — Ramadan hub (on the directory, not a new app)

1. **Route:** `/ramadan/` built by `homepage/build.mjs`, with its own metadata, canonical and sitemap entry, in the directory design.
2. **Contents:**
   - A 30-night path, one card per night.
   - A Guess the Surah juz for that night (Juz mode from brief 09).
   - A Family Halaqa pack per night. The packs come from brief 12's expansion; until then, link existing packs and say how many exist.
   - A last-ten-nights section.
   - Zakat Calculator and a zakat al-fitr explainer. The explainer needs the same qualified review as the calculator.
   - A printable Ramadan calendar. The dates must say "expected; confirm with your local moon sighting".
3. **The directory seasonal slot** (from brief 08) links the hub from about two weeks before Ramadan until Eid.
4. **No countdown that implies a confirmed date.**

## Verification

Use the checklist in `00-START-HERE.md`. Also:
- Engine tests for the planner's re-plan logic and for zakat calculations.
- Browser checks of the wizard, check-offs with blocked storage, printing, and the hub on phone and desktop.
- SEO checks for the new app and route.
- Record the review status of the zakat content honestly.

Do not push or publish without the owner's request. Update `00-START-HERE.md`.
