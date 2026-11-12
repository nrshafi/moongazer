# Architecture context: Is It in the Quran?

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://is-it-in-the-quran.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/lib/` currently contains: `app.ts`, `engine.ts`, `shell.ts`, `utils.ts`.
- `engine.ts` owns normalization, reference parsing, the local index and exact/related matching. `app.ts` imports `corpus.json` on first search and handles results.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `activity.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts`.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `is-it-in-the-quran` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `recent` holds at most five queries only after opt-in. Sharing explicitly writes the query into a URL fragment, not a request query string.
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: No wording match is not proof that an idea is absent. Scope English results to Pickthall, keep related terms separate, preserve displayed source text, reject references longer than 30 ayahs and queries shorter than two normalized characters.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4327. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-is-it-in-the-quran` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 4 HTML pages and 18 files.

The checker loads a roughly 3 MB compiled local corpus on first search. Its expected Vite large-chunk warning is documented; keep full coverage and lazy loading when optimizing.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## Common claims (P3 T3.6)

- Routes `/claims/` and `/claims/<id>/` (12 claims). Data: `claims` in `src/data/content.json`; Quran evidence records are byte-copies of `corpus.json`. Logic in `src/lib/claims.ts` (categories, keyword matching, bookmark validator) and `claims-page.ts` (Save toggles, Check form). There is no saved-item import and no moved release (D2c, `plan/implementation/00-INDEX.md`).
- Storage key added: `claim-bookmarks` (list of claim ids, 30-day expiry like every key).
- The verdict stays in a closed `<details>` (Show the answer) without JavaScript; with JavaScript it is hidden until Check.
- `/claims/` is registered by a temporary shim in `src/pages/claims/index.astro` because `seo.ts` has no index-page registration; remove it once seo.ts supports it.

## Anonymous counter hook points (P4 T4.7)

The shared helper `src/lib/counter.ts` (`track(event, itemId)`) sends `{a, i, e}` with `navigator.sendBeacon` to `moongazer.tech/api/event`. It is a silent no-op on preview hosts, with Global Privacy Control, or when sendBeacon is missing. `activity_started` fires once per item per page load. Item ids are stable content ids only; search text, claim answers and selections are never sent.

| Hook | Where | Event and id |
| --- | --- | --- |
| Search submitted | `src/lib/app.ts` `run()` | `activity_started` `search` |
| Search returns at least one ayah | `src/lib/app.ts`, after `render()` | `activity_completed` `search` |
| Copy search link | `src/lib/app.ts`, `#share` | `share_clicked` `search` |
| Copy passage with reference | `src/lib/app.ts`, `[data-copy]` | `share_clicked` `search` |
| Claim checked | `src/lib/claims-page.ts`, form submit (`form[data-claim-id]`) | `activity_started` and `activity_completed` with the claim id |
| Report an error (results and claim status) | `src/lib/app.ts`, `src/lib/claims-page.ts` | none; `a.feedback-link` opens the footer form |

No events on the home notice, the claims index, sources or privacy pages.
