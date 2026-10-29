# Islamic History Timeline Challenge

## Overview

Arrange sourced events and explore the sequence behind them. Learners practicing broad event sequence using source clues and explicit date limitations.

Portfolio rank 13 of 20. Project root `apps/islamic-history-timeline-challenge`. The app is implemented and published at https://islamic-history-timeline-challenge.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a four-event challenge.
2. Use up/down controls to arrange earliest to latest, opening source clues when useful.
3. Check or reveal the order, read approximate dates and source limitations, then share or try another pack.

## Features and content

A prophetic-mission edition with 12 four-event packs and 14 sourced event records, move buttons, partial feedback, hints, sourced solutions, share links and optional recovery.

Bundled list inventory from `src/data/content.json`:

- `events`: 14 records.
- `packs`: 12 records.

The app has 19 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Score broad conventional chronology, not exact calendar reconstruction. A report may support the event without establishing its CE date. The current edition covers the prophetic mission, not all Islamic history.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.
