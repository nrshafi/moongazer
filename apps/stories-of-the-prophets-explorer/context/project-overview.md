# Stories of the Prophets Explorer

## Overview

Explore selected Quran passages about 25 named prophets. Readers exploring selected Quranic accounts through named profiles and short comprehension checks.

Portfolio rank 10 of 20. Project root `apps/stories-of-the-prophets-explorer`. The app is implemented and published at https://stories-of-the-prophets-explorer.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Find a profile by name or reading area.
2. Read its two complete passages and their source links.
3. Answer the reading check, revisit the cited detail, then save or open another profile.

## Features and content

25 profiles, two readings each for 50 selected passages, 25 passage-specific questions, alphabetical discovery, area/search filters, bookmarks and reading-list copy.

Bundled list inventory from `src/data/content.json`:

- `people`: 25 records.

The app has 48 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

The library is selected Quran passages, not exhaustive biographies or an asserted chronology. Brief mentions stay brief; do not add disputed identities, invented dialogue, dates or portraits.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.
