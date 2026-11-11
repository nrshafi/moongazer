# Word Groups

## Overview

Find four groups of related Islamic terms in a sixteen-tile puzzle. Learners grouping Islamic terms into intended source-backed categories in a short word game.

Portfolio rank 12 of 20. Project root `apps/islamic-concept-connections`. The app is implemented and published at https://islamic-concept-connections.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a board and select four tiles.
2. Check a group, revise a near match, or use a hint; continue until four groups are found.
3. Read each group’s source passages, share the board link, or choose another board.

## Features and content

16 boards, 20 term groups, four groups of four terms per board, one-away feedback, hints, shuffle, reveal, source readings, seeded links and optional recovery.

Bundled list inventory from `src/data/content.json`:

- `groups`: 20 records.
- `puzzles`: 16 records.

The app has 40 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Categories are intended selections, not exhaustive definitions. Preserve sixteen unique terms per board. Keep this mechanic distinct from Quran Connections’ one-theme passage quiz; no trusted leaderboard is provided.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
