# The Islamic Knowledge Escape Room

## Overview

Read the evidence. Solve four locks. Open a new route through the Quran. Solo learners or a group sharing one device who want a source-reading puzzle activity.

Portfolio rank 9 of 20. Project root `apps/islamic-knowledge-escape-room`. The app is implemented, checked and packaged; Cloudflare deployment has not been performed.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a room and read the source shelf.
2. Solve each of the four locks, using hints or solutions if useful.
3. Read the completion explanation, copy the informal result, or enter another room.

## Features and content

Eight rooms with four locks each: theme choice, reference matching, mushaf ordering and excerpt recognition. Includes a source shelf, hints, solutions, completion sharing, optional timer and recovery.

Bundled list inventory from `src/data/content.json`:

- `rooms`: 8 records.

The app has 32 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Order references in mushaf chapter/ayah order, not revelation or historical order. This is same-device play, not synchronized multiplayer; completion does not measure religious merit.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.
