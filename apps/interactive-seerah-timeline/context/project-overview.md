# Seerah Timeline

## Overview

Explore the life of Prophet Muhammad ﷺ through a sourced chronology, one event at a time. Readers who want to browse a sourced chronology of the prophetic mission and open individual event notes.

Portfolio rank 5 of 20. Project root `apps/interactive-seerah-timeline`. The app is implemented and published at https://interactive-seerah-timeline.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Browse or filter the chronological event list.
2. Select an event to read its summary, date band, uncertainty note and sources.
3. Open its detail page, bookmark it, or print a reading view.

## Features and content

36 event records, era/topic filters, text search, date and source limitations, bookmarks, print support and individual static event pages.

Bundled list inventory from `src/data/content.json`:

- `events`: 36 records.

The app has 38 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

Date bands are approximate navigation aids. A report supporting an event does not necessarily establish its displayed CE year. Do not erase disputed placement notes.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
