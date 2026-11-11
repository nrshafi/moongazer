# Hifz Planner

## Overview

Estimate new memorization and revision time for your week. Learners estimating how new memorization and an expanding revision workload fit their own study time.

Portfolio rank 6 of 20. Project root `apps/quran-memorization-workload-calculator`. The app is implemented and published at https://quran-memorization-workload-calculator.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

The home page is a three-step wizard (P7 T7.2). Each step is a fieldset with a legend and a "Step N of 3" indicator, operable by keyboard, with Back and Next buttons.

1. **What have you memorized?** Pages already memorized (0–603) and new pages you want to add. Choosing by juz or by surah is not available yet: the bundled data has no page boundaries for juz or surahs (see "Page boundaries" below).
2. **Your week.** Days per week (study days are Monday first, in calendar order), minutes per session and start date. A "Ramadan pace" button fills in a suggestion (about half the default new pages per session, review cycle of 7 sessions). It is a suggestion, labelled as one, and every value stays editable.
3. **Your plan.** This week's checklist (new lesson, recent revision, old revision for each study day), the full schedule as a calendar, check-offs, an "I missed a day" re-plan, a printable weekly sheet, a label setting (sabaq/sabqi/manzil or plain words), and `.ics` export.

Per-page minute estimates and the other assumptions sit in an "Adjust assumptions" drawer with plain labels, for example "How many new pages per session?".

## Page boundaries

The bundled `src/data/content.json` holds 114 chapter records (name, verse count, revelation details) and `layoutPages: 604`. It has no page-to-surah or page-to-juz boundaries. The repository research folder has seven manzil metadata responses (`_implementation/research/manzil-1.json` to `manzil-7.json`). Each gives a page range and juz range for one manzil, but not per surah or per juz. No boundary was derived or invented. Juz and surah choosers stay out until a Quran MCP metadata snapshot (per-juz and per-surah page starts) is added to the research folder and recorded here with its tool call, edition and date.

## Features and content

A 604-page-layout model with existing/new pages, user-supplied time estimates, pace limits, study weekdays, start date, revision cycle, schedule pagination, CSV and calendar export.

Bundled list inventory from `src/data/content.json`:

- `chapters`: 114 records.

The app has 1 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

604 pages is the selected Hafs layout, not a universal pagination. Speeds are user assumptions, not validated learning predictions. Distinguish capacity failure from a viable plan beyond the 3,650-session horizon; ICS exports at most 90 sessions.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
