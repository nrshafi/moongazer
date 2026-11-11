# Understand Your Salah

## Overview

The meaning of the words you say in prayer. Learners connecting selected prayer recitations with their meaning and original sources.

Portfolio rank 14 of 20. Project root `apps/understand-salah-lab`. The app is implemented and published at https://understand-salah-lab.moongazer.tech/.

## Goals

1. Deliver this activity immediately without sign-in or a stored personal history.
2. Keep the app independently buildable and usable with optional or unavailable browser storage.
3. Preserve source evidence, light/dark accessibility and the app-specific limits below.

## Core user flow

1. Choose a lesson by part of prayer or search.
2. Read the Arabic, recall the meaning, then reveal it; for Al-Fatiha, optionally play the whole-surah recording.
3. Answer a comprehension check, follow its source, and save or open the next lesson.

## Features and content

15 lessons: seven Al-Fatiha ayahs and eight hadith-based recitations, hide/reveal meaning practice, reading checks, bookmarks, print and licensed local full-surah Al-Fatiha audio.

Bundled list inventory from `src/data/content.json`:

- `lessons`: 15 records.

The app has 22 source-list entries, local source/privacy/404 pages and its own fonts, manifest and lockfile.

## Scope

In scope: the implemented activity, its source notes, optional temporary state and independent static deployment. Out of scope: accounts, personal profiles, server storage, live AI answers, synchronized multiplayer, trusted public scores and automatic publication.

This is a guide to meanings, not a complete legal prayer manual. Roman guides are approximate and some cover only an opening phrase. Audio is Al-Fatiha in full, not per-ayah clips or audio for all recitations. Preserve Adeel Shaikh’s CC BY-SA 4.0 attribution and audio checksum.

## Success criteria

1. The complete user flow above works with an empty browser and without localStorage.
2. The content inventory and citations remain consistent; answers/calculations follow the implemented constraints.
3. `bun run check`, `bun test` and `bun run build` pass for behavior changes; changed interactions work in both themes and on narrow screens.
4. A static `dist/` can be served at the root of its own Pages project, with no runtime service dependency.

## SEO release, 30 October 2026

The published SEO scope covers the directory and twenty app subdomains. Search metadata describes existing activities and editorial records. No additional product content, storage, visitor tracking or independent scholarly certification is introduced. See repository SEO_QA.md for the release and SEARCH_CONSOLE_SETUP.md for the completed Google account setup record.

## Search content enhancement scope

The current authorized SEO enhancement adds four useful subject guides and an About/source-methodology page to the directory, plus static product guidance and related-app navigation in each app. The user supplied nrshafi1@gmail.com as the public corrections contact. See SEO_GROWTH_PLAN.md for scope, evidence and limits. No new religious claims, credentials, visitor tracking or product engines are authorized by this documentation.
