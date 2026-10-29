# Guess the Surah

## Overview

A few clues. One surah. Discover how well you know the Quran, one thoughtful round at a time. Learners who want to recognize Quran chapters through a short, immediately usable quiz.

Portfolio rank 1 of 20. Project root `apps/guess-the-surah`. The app is implemented, checked and packaged; Cloudflare deployment has not been performed.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a practice collection and round settings, or open a seeded challenge link.
2. Reveal clues and choose a surah from the available answers.
3. Read the opening passage and explanation, continue the round, then share the informal result.

## Features and content

All 114 surahs with exact opening-ayah evidence, four progressive clues, filtered rounds, seeded links, scoring, results and optional recovery.

Bundled list inventory from `src/data/content.json`:

- `chapters`: 114 records.

The app has 114 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Do not describe editorial clues or client-side scores as scholarly assessment. Keep Arabic opening text and fetched chapter metadata intact.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.
