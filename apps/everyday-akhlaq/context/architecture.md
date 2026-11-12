# Architecture context: Everyday Akhlaq

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://everyday-akhlaq.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/pages/scenario/[slug].astro`
- `src/pages/business/index.astro` and `src/pages/business/[id].astro` (Business track; both scenario routes render `src/components/ScenarioPage.astro` and the same `src/lib/scenario.ts`)
- `src/pages/sources.astro`

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: `catalog.ts`, `scenario.ts`, `shell.ts`, `utils.ts`.
- `catalog.ts` handles discovery. `scenario.ts` manages the two-decision branch and response-specific consequences.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `content.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts`.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `everyday-akhlaq` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `remember` stores the recovery preference. `scenario-<scenario-id>` stores validated decisions for that scenario: `{stage, choices, seed?}`, where `seed` is an optional integer 0 to 2147483646 driving per-visit option order (missing seed on old records is replaced on load).
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: Situations and consequences are fictional editorial applications. Do not turn them into personalized religious rulings or claims that the source predicts an outcome.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4324. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-everyday-akhlaq` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 24 HTML pages and 38 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## Business track (P3 T3.5, 11 Nov 2026; import removed under D2c)

- `content.json` has two arrays: `scenarios` (20; each has `track` `home` or `study`) and `business` (12; `track` `business`). The 12 business scenarios use the scenario shape (`scene`, `options`, `options2`, `followup`, `prompt`, `prompt2`, `takeaway`, `passage`, `commentaryUrl`) plus `facts`, `sources` (hadith, collection and number with sunnah.com link) and optional `secondCommentaryUrl`. They stay in a separate array so the existing `seo.json` collection (`scenarios`, prefix `scenario`) keeps registering exactly the `/scenario/<id>/` pages; business routes are `/business/` and `/business/<id>/` (12 business ids). `scenario.ts` picks its list from `data-base` on the page (`scenario` or `business`).
- Storage keys added: `business-<id>` (same `{stage, choices, seed?}` shape and validation as `scenario-<id>`, bounded by the scenario's real option counts) and `business-bookmarks` (list of business ids; validated by `validBookmarks` in `src/lib/business.ts`). `remember` is shared.
- There is no saved-item import and no moved release: the four merged apps were deleted outright with no redirects (D2c, `plan/implementation/00-INDEX.md`). `src/lib/import.ts` and `src/lib/merge-import.ts` are gone.
- Home page filters scenario cards by track with a pressed-state button group (All, Home & family, Study & work, Business).
- SEO gap: `src/lib/seo.ts` supports one collection. `/business/` and the 12 `/business/<id>/` paths need a second registration there (see progress tracker); until then Shell throws "Add metadata for the new page" for them.

## Anonymous counter hook points (P4.7)

The shared `src/lib/counter.ts` (`track(event, itemId)`) sends `{a, i, e}` with `navigator.sendBeacon` to `https://moongazer.tech/api/event`. It is a silent no-op off `moongazer.tech`, with Global Privacy Control, or without `sendBeacon`. Item ids are scenario or business case ids; no visitor text or choices are sent.

- `src/lib/scenario.ts` (shared engine for `/scenario/` and `/business/` pages): the first choice sends `activity_started`; the second choice, which reaches the reflection, sends `activity_completed` once per page.
- "Copy scenario link" sends `share_clicked` with the scenario or case id.
- The reflection carries `<a class="feedback-link">` to the footer `#site-feedback` form. The link is rendered by the script, not by Astro.
- Business save toggles and the business index send no counts. Print buttons are plain print and are not counted.
- `tests/events.test.ts` checks the call sites in source. Browser-level firing is not run by the tests.
