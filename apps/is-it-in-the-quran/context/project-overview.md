# Is It in the Quran?

## Overview

Check wording against the Arabic Quran and Pickthall translation. Readers checking the wording or reference of a claimed Quran quotation before sharing it.

Portfolio rank 7 of 20. Project root `apps/is-it-in-the-quran`. The app is implemented and published at https://is-it-in-the-quran.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Enter a phrase or valid chapter:ayah reference, then select a language and optional chapter filter.
2. Search the local corpus and distinguish exact normalized wording matches from related-word suggestions.
3. Read the full ayahs and context links; explicitly copy a passage or a search link if needed.

## Features and content

All 6,236 ayahs in Uthmani Arabic and Pickthall English, lazy local corpus loading, normalized phrase search, lexical suggestions, chapter filters, direct reference ranges, pagination and fragment-based sharing.

Bundled list inventory from `src/data/content.json`:

- `chapters`: 114 records.

The app has 115 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

No wording match is not proof that an idea is absent. Scope English results to Pickthall, keep related terms separate, preserve displayed source text, reject references longer than 30 ayahs and queries shorter than two normalized characters.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
