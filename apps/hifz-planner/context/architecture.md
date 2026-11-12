# Architecture context: Hifz Planner

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://hifz-planner.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/lib/` currently contains: `app.ts`, `engine.ts`, `shell.ts`, `utils.ts`, `wizard.ts`.
- `engine.ts` validates assumptions, simulates study sessions and builds ICS text. It is unchanged by the wizard and keeps its tests.
- `pages.ts` (pure) maps juz and surah choices to a distinct page count and validates selections. It reads `src/data/page-boundaries.json`, a compact copy of the Quran MCP metadata record (see project-overview "Page boundaries").
- `wizard.ts` also builds the .ics daily reminder (`withDailyReminder`, one all-day event repeating from the first to the last session) on top of the unchanged `calendar()` output. It is pure: wizard inputs (memorized pages, new-page goal, start date, days per week, minutes per session, assumptions) become an engine `Plan`, a this-week checklist and a calendar grouping. It also validates stored input, rebuilds a plan from today after missed sessions (`replanFrom`), and reports check-off progress. No DOM, storage or `Date.now()` inside it; the caller passes "today".
- `app.ts` renders the wizard steps and results, creates local download blobs, and holds the storage calls. Its results region is an `aria-live` polite region.
- `src/styles/planner.css` (app-local) holds wizard, checklist, drawer and print-sheet rules. Shared `global.css` and `refinement.css` are not edited.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `activity.test.ts`, `calendar-identity.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts` and `wizard.test.ts` (wizard build, validation, checklist split, check-offs, missed-day re-plan, label setting, daily reminder).
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `hifz-planner` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `plan`: the wizard inputs and assumptions (`{at,value}`), written only if the "Remember these assumptions for 30 days" checkbox is enabled. Validated with `isWizardInput` on read. Calculated schedules and exports are otherwise in memory.
- `checkoffs`: an opt-in list of completed sessions, each a `YYYY-MM-DD` date plus one of `new`, `recent`, `old` (no personal content, no free text). Written only when the visitor opts in with "Remember my check-offs for 30 days". Validated with `isCheckoffList` on read, and rejected records are removed. If storage is blocked, check-offs still work in the page and the page says they will not be kept after reload.
- `vocab`: the label setting, `sabaq` or `plain`. Stored as a display preference like `theme`; it holds no activity data and is validated on read.
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: 604 pages is the selected Hafs layout, not a universal pagination. Speeds are user assumptions, not validated learning predictions. Distinguish capacity failure from a viable plan beyond the 3,650-session horizon; ICS exports at most 90 sessions.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4326. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-hifz-planner` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 4 HTML pages and 17 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## Counter hook points (P4.7)

Anonymous aggregate events go through the shared `track(event, itemId)` in `src/lib/counter.ts`. The item id is `plan` for every event in this app. The helper is a silent no-op outside moongazer.tech hosts, under Global Privacy Control, or without sendBeacon. Nothing is stored and no visitor text is sent.

| Event | Hook (`src/lib/app.ts`) | When it fires |
| --- | --- | --- |
| `activity_started` | step-one success path of the wizard, before `showStep(2)` | the first time step 1 is answered (the helper also dedupes per page load) |
| `activity_completed` | `makePlan()`, after a valid plan is built | each plan generated from step 2; not on the missed-day re-plan or on a restore from storage |
| `share_clicked` | CSV export handler | when the CSV download starts |
| `share_clicked` | `.ics` export handler | when the calendar file download starts, with or without the daily reminder |

Print (`print-week`) and the on-screen checklist do not count as sharing. The compact feedback link (`<Feedback compact />`) sits in step 3 after the results and links to `#site-feedback` in the footer form. The source-level wiring check is `tests/events.test.ts`.
