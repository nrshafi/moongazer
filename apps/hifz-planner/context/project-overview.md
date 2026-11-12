# Hifz Planner

## Overview

Estimate new memorization and revision time for your week. Learners estimating how new memorization and an expanding revision workload fit their own study time.

Portfolio rank 6 of 20. Project root `apps/hifz-planner`. The app is implemented and published at https://hifz-planner.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Enter existing pages, a new-page goal, study time and learning/review estimates.
2. Choose study weekdays, start date and revision cycle, then calculate.
3. Inspect feasibility, the revision curve and schedule; adjust assumptions or export the CSV/calendar.

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
