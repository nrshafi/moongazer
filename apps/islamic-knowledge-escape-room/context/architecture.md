# Architecture context: Quran Escape Room

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://islamic-knowledge-escape-room.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/pages/room/[id].astro`
- `src/pages/sources.astro`

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: `app.ts`, `engine.ts`, `shell.ts`, `utils.ts`.
- `engine.ts` owns set equality, reference order and progress validation. `app.ts` renders the lock types, timer and assisted completion.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `activity.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts`.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `islamic-knowledge-escape-room` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `room-<room-id>` stores validated room progress, assisted locks and elapsed seconds only when recovery is enabled. The timer is optional and pauses when the document is hidden.
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: Order references in mushaf chapter/ayah order, not revelation or historical order. This is same-device play, not synchronized multiplayer; completion does not measure religious merit.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4329. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-islamic-knowledge-escape-room` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 12 HTML pages and 25 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## E2E timer correction

Rendering synchronizes elapsed text with state. Restart resets seconds, the interval anchor and the running flag from the optional timer checkbox, including after completion.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.
- Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## First-party counter events (P4.7, 11 Nov 2026)

`src/lib/counter.ts` (`track(event, itemId)`) sends one anonymous `sendBeacon` to `https://moongazer.tech/api/event`. No cookie, identifier or visitor text is sent. It is a silent no-op on preview hosts (anything not ending in `moongazer.tech`), when `navigator.globalPrivacyControl` is true, or when `sendBeacon` is missing. `activity_started` is de-duplicated per item for the page lifetime. The item id is the room id (for example `patience`, `mercy`).

Hook points in `src/lib/app.ts`:

- Lock form submit (`#lock-form` `onsubmit`): `track('activity_started', room.id)` on every attempt (the helper keeps the first).
- Fourth lock opened (`state.step` becomes 4 after a correct check): `track('activity_completed', room.id)`. Reveal and hint do not complete the room.
- Copy completion (`#share`, completion panel): `track('share_clicked', room.id)`.
- Feedback: the completion panel carries a `.feedback-link` with `data-open-feedback`.

Room ids are fixed slugs from `content.json`. Typed answers, selected options, the seed and saved progress never enter an id. No unit test was added: the hook points are wiring only.
