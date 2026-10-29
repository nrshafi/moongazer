# Architecture: Revelation Context Explorer

## Stack

Astro 7.4.2, TypeScript 6.0.3, @astrojs/check 0.9.12 and Bun 1.4.4. Static output, directory-format routes and trailing slashes. Native Astro/HTML/CSS and browser TypeScript; no React, Tailwind, server adapter, authentication or database.

## System boundaries

`src/layouts/Shell.astro` owns document metadata, theme bootstrap, navigation, footer and storage dialog. `src/lib/shell.ts` manages the theme toggle, app-scoped clear-data and print preparation/restoration. `utils.ts` owns namespaced storage, escaping, copying and accessible announcements.

`assessment.ts` defines three valid relationship labels and bounded grading. `reading.ts` handles wrong/correct feedback without changing source text. `catalog.ts`/`library.ts` manage discovery and known-ID bookmarks. Detail routes render the report, reliability note and both commentary citations statically.

Current library inventory: `assessment.ts`, `catalog.ts`, `library.ts`, `reading.ts`, `shell.ts`, `utils.ts`.

`src/components/Filters.astro` owns labeled catalog controls. `Passage.astro` renders an optional complete Quran passage; `References.astro` renders named reports and exact commentary links. `src/data/config.json` owns display metadata, accent and port; `content.json`, `sources.json` and `provenance.json` separate activity content, references and checksums. `public/` owns local fonts, favicon, robots and security headers.

Route-source inventory:

- `src/pages/404.astro`
- `src/pages/index.astro`
- `src/pages/privacy.astro`
- `src/pages/reading/[id].astro`
- `src/pages/sources.astro`

Detail pages use getStaticPaths and local JSON. No app imports another app or repository preparation code at runtime.

## State and privacy

`bookmarks` stores explicitly saved reading IDs. Quiz selections and feedback remain in memory; no learning record or religious assessment is persisted.

All storage keys have prefix `revelation-context-explorer:` and timestamp envelopes with `at` and `value`. Helpers validate shapes, reject timestamps more than 60 seconds ahead, ignore records at least 30 days old and catch blocked storage. Theme is separate from activity opt-in; the initial bootstrap validates its timestamp and theme value too. Expiry is checked on access; stored bytes do not auto-delete while the site is closed. Clear-data removes only this app namespace and reloads.

## Deployment and invariants

Port 4338. Build `bun install --frozen-lockfile && bun run build`, output `dist`, environment `BUN_VERSION=1.4.4`. Serve at its own Pages project/domain root; absolute asset paths require an explicit migration for subpath hosting. No adapter, Functions, bindings, secrets or runtime service is needed. Archive `release/revelation-context-explorer-pages.zip` contains 29 files and 14 HTML pages.

Preserve literal canonical text, edition attribution, source limits, independent builds, accessible interactions and app namespace isolation. Ten readings include seven transmitted occasions, one general-context record and two responses after revelation. A response must not be relabeled as a cause. Narrator and date uncertainty remain visible. Collection attribution is not independent chain grading. Al-Muyassar notes and full Arabic Ibn Kathir links do not create an invented scholarly consensus.

Research and QA live in repository `_implementation/research/batch4/` and `_implementation/qa/batch4/`. `tests/activity.test.ts` checks behavior/content constraints; `tests/storage.test.ts` checks expiry, corruption, blocked storage and isolation. Normal app builds need none of the research tools.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.
