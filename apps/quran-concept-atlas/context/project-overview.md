# Quran Concept Atlas

## Overview

Follow connected themes through carefully cited Quran passages. Readers following a theme from one Quran passage to related selected readings.

Portfolio rank 8 of 20. Project root `apps/quran-concept-atlas`. The app is implemented and published at https://quran-concept-atlas.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Find a theme by name or study area.
2. Open its three source readings and anchor commentary.
3. Follow a related topic, save the reading, or copy the saved reading list.

## Features and content

30 topics, 90 selected readings, study-area/search filters, related-topic paths, source commentary, bookmarks, copied reading lists and 30 static topic pages.

Bundled list inventory from `src/data/content.json`:

- `topics`: 30 records.

The app has 114 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Themes and edges are editorial learning paths, not an exclusive canonical taxonomy or AI interpretation service.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.
