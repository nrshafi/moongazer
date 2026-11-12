# Architecture context: Guess the Surah

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://guess-the-surah.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/pages/privacy.astro`
- `src/pages/sources.astro`

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: `engine.ts`, `game.ts`, `shell.ts`, `utils.ts`.
- `engine.ts` owns seeded round generation, filtered answer options and clue-sensitive scoring. `game.ts` manages the browser round and recovery.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `engine.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts`.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `guess-the-surah` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `remember` stores the recovery preference; `round` stores validated round state. A supplied challenge seed starts its own reproducible round.
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: Do not describe editorial clues or client-side scores as scholarly assessment. Keep Arabic opening text and fetched chapter metadata intact.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4321. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-guess-the-surah` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 4 HTML pages and 17 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.
- Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## First-party counter events (P4.7, 11 Nov 2026)

`src/lib/counter.ts` (`track(event, itemId)`) sends one anonymous `sendBeacon` to `https://moongazer.tech/api/event`. No cookie, identifier or visitor text is sent. It is a silent no-op on preview hosts (anything not ending in `moongazer.tech`), when `navigator.globalPrivacyControl` is true, or when `sendBeacon` is missing. `activity_started` is de-duplicated per item for the page lifetime.

Hook points in `src/lib/game.ts`:

- Answer click (`[data-answer]` handler): `track('activity_started', 'surah-<n>')` then `track('activity_completed', 'surah-<n>')`, where `<n>` is the answer surah number (1–114). The item is the surah, not the random round, because the surah number is stable across rounds and seeds. Both fire on the same click because the answer reveals immediately, so started and completed coincide in this app.
- Share: the round finish renders `renderSessionEnd` (`src/lib/session-end.ts`), whose Copy and WhatsApp actions call `track('share_clicked', 'round')`. The old `#share-challenge` and `#share-result` buttons were removed; the challenge link is now the link inside the share text. Next app comes from `learning.json` related[0].
- Feedback: the per-answer feedback block and the round finish panel carry a `.feedback-link` with `data-open-feedback`.

No visitor answers, seeds or round text are placed in an item id. No unit test was added: the hook points are wiring only, and the helper's id and gating rules are covered by the shared counter tests.

## P6 daily, Juz and collection (12 November 2026)

- `src/lib/daily-bank.ts` exports `DAILY_SEED = 114`, `BANK_VERSION = 1`, `dailyItem(n)` (all 114 chapters in `content.json` order via `dailyIndex`), `todayNumber`, `beforeEpochLine`. Before `DAILY_EPOCH` `dayNumber` is 0: Practice is the default and Daily shows one line.
- `src/lib/juz.ts` derives juz membership from `src/data/juz-starts.json`, copied programmatically from `_implementation/research/page-boundaries.json` (Quran MCP `fetch_quran_metadata`); recorded in `provenance.json` key `juzStarts`. A surah is in the juz where its first ayah falls (Juz 30 = 78 to 114, Juz 1 = 1 and 2; Juz 2 and 5 have none).
- `engine.ts` `clueLadder`: translation, Arabic, structure, name meaning (never first, no chapter number); "Arabic first" swaps the first two. `nameMeaning` and `nameMeaningSource` come from C1; the source is shown in the answer reveal and the drawer.
- Storage keys (prefix `guess-the-surah:`, via `read`/`write`): `daily` `{n, result:{selected,hints}}`, `streakOn`, `streak` (`isStreak`), `found` (surah numbers for the 114 collection), `arabicFirst`, plus the existing `round` and `remember`.
- Counter item ids: `daily-<N>` in Daily, `surah-<n>` in Practice and Juz; share_clicked uses `daily-<N>` or `round`.
- Share: `Guess the Surah #N · solved on clue K of 4` then `guess-the-surah.moongazer.tech`; no name, number or meaning. T6.7: "Remind me daily" under the Daily result downloads `guess-the-surah-daily.ics` from `dailyReminderIcs` (Blob, no requests).
