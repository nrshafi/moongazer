# Parables of the Quran

## Overview

Explore Quranic comparisons through passages and interactive reading diagrams. Readers slowing down with Quranic comparisons through complete passages, commentary and guided reflection.

Portfolio rank 15 of 20. Project root `apps/parables-of-the-quran`. The app is implemented and published at https://parables-of-the-quran.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Find a comparison and read its complete Quran passage.
2. Select diagram parts, read the attributed commentary, and answer a detail question.
3. Write an optional reflection in memory, explicitly copy/download it, or save the reading.

## Features and content

14 readings, three selectable diagram parts each, source-attributed commentary, a second commentary for 24:35, comprehension checks, bookmarks and explicit private-note copy/download.

Bundled list inventory from `src/data/content.json`:

- `parables`: 14 records.

The app has 29 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Diagrams are editorial aids, not complete interpretation or depictions of Allah/prophets. Keep commentary before personal reflection. Preserve both fetched commentary references for 24:35 and complete multi-ayah readings.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
