# Architecture: Family Halaqa

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://family-islamic-learning-challenges.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

## Stack

Astro 7.4.2, TypeScript 6.0.3, @astrojs/check 0.9.12 and Bun 1.4.4. Static output, directory-format routes and trailing slashes. Native Astro/HTML/CSS and browser TypeScript; no React, Tailwind, server adapter, authentication or database.

## System boundaries

`src/layouts/Shell.astro` owns document metadata, theme bootstrap, navigation, footer and storage dialog. `src/lib/shell.ts` manages the theme toggle, app-scoped clear-data and print preparation/restoration. `utils.ts` owns namespaced storage, escaping, copying and accessible announcements.

`engine.ts` validates versioned sessions, question bounds and prefix-complete steps. `session.ts` manages retries, locked correct answers, sequential discussion/activity completion, opt-in recovery, restart and anonymous sharing. `catalog.ts`/`library.ts` manage the pack shelf and bookmarks.

Current library inventory: `catalog.ts`, `engine.ts`, `library.ts`, `session.ts`, `shell.ts`, `utils.ts`.

`src/components/Filters.astro` owns labeled catalog controls. `Passage.astro` renders an optional complete Quran passage; `References.astro` renders named reports and exact commentary links. `src/data/config.json` owns display metadata, accent and port; `content.json`, `sources.json` and `provenance.json` separate activity content, references and checksums. `public/` owns local fonts, favicon, robots and security headers.

Route-source inventory:

- `src/pages/404.astro`
- `src/pages/index.astro`
- `src/pages/pack/[id].astro`
- `src/pages/privacy.astro`
- `src/pages/sources.astro`

Detail pages use getStaticPaths and local JSON. No app imports another app or repository preparation code at runtime.

## State and privacy

`bookmarks` stores explicitly saved packs. `remember` is the recovery preference; `session-<id>` stores `{version:1,answer:number|null,checked:boolean,done:boolean[]}` only after opt-in. There are no names, participant age fields, child profiles, private notes or ongoing behavior histories.

All storage keys have prefix `family-islamic-learning-challenges:` and timestamp envelopes with `at` and `value`. Helpers validate shapes, reject timestamps more than 60 seconds ahead, ignore records at least 30 days old and catch blocked storage. Theme is separate from activity opt-in; the initial bootstrap validates its timestamp and theme value too. Expiry is checked on access; stored bytes do not auto-delete while the site is closed. Clear-data removes only this app namespace and reloads.

## Deployment and invariants

Port 4339. Build `bun install --frozen-lockfile && bun run build`, output `dist`, environment `BUN_VERSION=1.4.4`. Serve at its own Pages project/domain root; absolute asset paths require an explicit migration for subpath hosting. No adapter, Functions, bindings, secrets or runtime service is needed. Production project `moongazer-family-islamic-learning-challenges` uses Direct Upload; its current release is recorded in repository deployment/status.json.

Preserve literal canonical text, edition attribution, source limits, independent builds, accessible interactions and app namespace isolation. Twelve packs contain 36 activities in total: a reading check, open discussion and shared activity per pack. Suggested age bands are 5–7, 8–11 and 12+, with 10–15 minute editorial estimates. Pickthall’s historical wording may need an adult’s explanation. Open discussions have no single graded answer and anyone may pass.

Research and QA live in repository `_implementation/research/batch4/` and `_implementation/qa/batch4/`. `tests/activity.test.ts` checks behavior/content constraints; `tests/storage.test.ts` checks expiry, corruption, blocked storage and isolation. Normal app builds need none of the research tools.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.
