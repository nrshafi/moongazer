# Quran Connections

## Overview

Three passages. One connection. Follow the words, notice a shared thread, and explore the source. Readers who want to notice a shared theme across Quran passages and inspect the evidence.

Portfolio rank 2 of 20. Project root `apps/quran-connections`. The app is implemented and published at https://quran-connections.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a puzzle or open a puzzle link.
2. Compare the three readings, optionally show Arabic or use a hint, and choose a theme.
3. Read the explanation and cited commentary; retry or move to another puzzle.

## Features and content

30 three-passage puzzles, intended themes, distractors, hints, retries, optional Arabic display, explanations and shareable puzzle links.

Bundled list inventory from `src/data/content.json`:

- `puzzles`: 30 records.

The app has 114 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

A matching answer is the intended editorial connection, not the only possible observation about a passage. This app differs from the sixteen-tile grouping game.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.
