# Architecture context: Ayah Threads

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://ayah-threads.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Astro 7.4.2 | Static HTML generation and client-script bundling |
| Runtime/tooling | Bun 1.4.4 | Install, dev, check, tests, build and preview |
| Language/checking | TypeScript 6.0.3; @astrojs/check 0.9.12 | Strict source and Astro template checking |
| UI | Astro, native HTML, CSS and inline SVG | App-owned accessible interface; no component framework |
| Content | Local JSON and public assets | Canonical readings, authored exercises and provenance |
| Storage | In-memory state; optional localStorage | Temporary app-local state |
| Auth/database | None | Anonymous public use |
| Hosting | Cloudflare Pages static output | Independent `dist/` deployment at its domain root |

## System boundaries

- `src/pages/` owns static routes. Route-source inventory:

- `src/pages/404.astro`
- `src/pages/index.astro`
- `src/pages/themes/index.astro` and `src/pages/themes/[id].astro` (Theme library, 30 routes)
- `src/pages/privacy.astro`
- `src/pages/sources.astro`

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: `puzzle.ts`, `shell.ts`, `utils.ts`.
- `puzzle.ts` controls the selected puzzle, theme answers, hints and explanations. The puzzle records are in `src/data/content.json`.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `content.test.ts`, `distractors.test.ts`, `daily-bank.test.ts`, `daily.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts` and others.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `ayah-threads` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `remember` stores the recovery preference; `puzzle` stores validated puzzle state (validator shared in `src/lib/state.ts`; the Theme library reads `completed` plus the current solved/revealed puzzle from it, so it knows solved threads only when the visitor ticked "Remember my place").
- `theme-bookmarks`: string list (at most 100 ids matching `/^[a-z-]{1,60}$/`) of saved themes. Written only by the Theme library (`src/lib/themes.ts`). No saved data is imported from other apps (D2c, `plan/implementation/00-INDEX.md`).
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: A matching answer is the intended editorial connection, not the only possible observation about a passage. This app differs from the sixteen-tile grouping game.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4322. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-ayah-threads` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 4 HTML pages and 17 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## E2E recovery correction

A selected puzzle URL preserves restored state when its ID matches that state. A different valid puzzle URL starts the requested puzzle while retaining the explored collection.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.
- Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## Theme library (P3.3, 2026-11-11)

`content.json` has a `themes` array (30 entries; ids equal puzzle ids; passages byte-identical to the puzzles). Each theme has a spoiler-free `title` ("Thread NN: Quran ...") and `description` used by `seo.ts` (collection `themes`, prefix `themes`). The theme name and explanation appear only inside a closed `<details>` on `/themes/<id>/` until the puzzle is solved or revealed. The mechanical "connected readings" were dropped. `/themes/` needs a section-index entry in `seo.ts` (not registered by `seo.json`).

## First-party counter events (P4.7, 11 Nov 2026)

`src/lib/counter.ts` (`track(event, itemId)`) sends one anonymous `sendBeacon` to `https://moongazer.tech/api/event`. No cookie, identifier or visitor text is sent. It is a silent no-op on preview hosts (anything not ending in `moongazer.tech`), when `navigator.globalPrivacyControl` is true, or when `sendBeacon` is missing. `activity_started` is de-duplicated per item for the page lifetime. The item id is the puzzle id (for example `patience`, `hope`).

Hook points in `src/lib/puzzle.ts`:

- Theme option click (`[data-theme]`): `track('activity_started', puzzle.id)` on every click (the helper keeps the first). On the intended theme, `track('activity_completed', puzzle.id)` runs after `complete()`.
- "A little hint" (`#puzzle-hint`): `track('activity_started', puzzle.id)`. A hint is the first meaningful interaction, not a completion.
- "Reveal the connection" (`#reveal-theme`): `track('activity_started', puzzle.id)` then `track('activity_completed', puzzle.id)`.
- Copy result (`#share-result`, completion panel) and Copy puzzle link (`#share-puzzle`, sidebar): `track('share_clicked', <puzzle id>)`.
- Feedback: the completion panel carries a `.feedback-link` with `data-open-feedback`.

Puzzle ids are fixed slugs from `content.json`. No typed text, guessed labels beyond the fixed option labels, or saved state enters an id. No unit test was added: the hook points are wiring only.

## P5 changes

- `puzzle.ts` renders `renderSessionEnd` (Copy and WhatsApp call `track('share_clicked', puzzleId)`); `#share-puzzle` and `#share-result` were removed. Next app is learning.json related[0].
- The `puzzle` query parameter accepts the puzzle number (written by the app) and still accepts old id links, because the id equals the answer theme. Stored state still uses the id.
- The picker option text is rewritten on each render to add the solved tick from `state.completed`.

## P6 changes (T6.3, T6.7)

- `src/lib/daily-bank.ts` exports `DAILY_SEED = 30`, `BANK_VERSION = 1`, `dailyItem(n)` (via `dailyIndex(n, 30, DAILY_SEED)`; bank order is the data order of `puzzles`; `null` before the epoch), `isDailyRecord`, `dailyShareText` and `streakLine`. The share text is `Ayah Threads #N · solved with 1 hint` then `ayah-threads.moongazer.tech`; it never contains the theme (`assertNoAnswer` test over all 30 puzzles).
- `puzzle.ts` has two modes (tabs). Daily uses a separate state; Practice keeps the old state. `?puzzle=` links open Practice.
- Storage keys added (namespaced by `read`/`write`): `daily` = `{n, result:{outcome, hint, wrong[]}}` written when today's puzzle is finished (always, so a reload shows the result); `streak-on` (boolean) and `streak` (`{last,count,best}`) only after the "Keep a streak" opt-in, both deleted on untick. Documented in the drawer. The privacy page (shared) does not list them yet.
- Counter item id: `daily-<N>` in Daily, the puzzle id in Practice. Reminder: `dailyReminderIcs` Blob download `ayah-threads-daily.ics`, `text/calendar`; no request.
- Content (C2): every puzzle has passages from at least 2 surahs (28 from 3); `distractors` hold three bank themes, each theme used exactly three times, with a near-synonym/overlap blocklist in `tests/distractors.test.ts`.
