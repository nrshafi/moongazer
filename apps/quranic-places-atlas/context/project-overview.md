# Places in the Quran

## Overview

Read the passages, explore the geography, and see what remains uncertain. Readers connecting Quran place references to geographical context without confusing evidence with speculation.

Portfolio rank 11 of 20. Project root `apps/quranic-places-atlas`. The app is implemented and published at https://quranic-places-atlas.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Explore the regional map and numbered text legend or filter the place list.
2. Open an entry and read its Quran passage, commentary and location evidence.
3. Inspect a mapped context or the reason no pin is assigned; optionally save or print the reading.

## Features and content

15 entries, five sourced city/heritage-context markers, 44 bundled Natural Earth land paths, evidence filters, uncertainty notes, bookmarks and static entry pages.

Bundled list inventory from `src/data/content.json`:

- `places`: 15 records.
- `landPaths`: 44 records.

The app has 36 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Only five modern contexts have pins, using UNGEGN/UNESCO coordinates. Ten entries stay unpinned. Iram is a tribe in the cited commentary, not a claimed excavated city. Do not turn heritage coordinates into exact Quranic event sites.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
