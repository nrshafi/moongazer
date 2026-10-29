# Everyday Akhlaq

## Overview

Small moments. Thoughtful choices. Explore everyday character through fictional scenarios and authentic sources. Visitors who want to consider everyday choices through short fictional situations and sourced reading notes.

Portfolio rank 4 of 20. Project root `apps/everyday-akhlaq-simulator`. The app is implemented, checked and packaged; Cloudflare deployment has not been performed.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Select a situation from the catalog.
2. Make the first choice, read its consequence, and choose a response at the second decision.
3. Read the final reflection and source passage; restart or explore another situation.

## Features and content

20 fictional scenarios, two decisions per scenario, response-specific consequences, reflection, source notes, sharing and optional recovery.

Bundled list inventory from `src/data/content.json`:

- `scenarios`: 20 records.

The app has 38 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Situations and consequences are fictional editorial applications. Do not turn them into personalized religious rulings or claims that the source predicts an outcome.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.
