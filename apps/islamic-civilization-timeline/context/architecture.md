# Architecture: Civilization Timeline

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://islamic-civilization-timeline.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

## Stack

Astro 7.4.2, TypeScript 6.0.3, @astrojs/check 0.9.12 and Bun 1.4.4. Static output, directory-format routes and trailing slashes. Native Astro/HTML/CSS and browser TypeScript; no React, Tailwind, server adapter, authentication or database.

## System boundaries

`src/layouts/Shell.astro` owns document metadata, theme bootstrap, navigation, footer and storage dialog. `src/lib/shell.ts` manages the theme toggle, app-scoped clear-data and print preparation/restoration. `utils.ts` owns namespaced storage, escaping, copying and accessible announcements.

`engine.ts` compares valid integer date bands symmetrically. `timeline.ts` handles comparison controls and seeded URL parameters `a`/`b`. `catalog.ts` owns normalized multiword filtering; `library.ts` owns filters, saved readings and clear reset behavior. `Map.astro` displays bundled Natural Earth land geometry.

Current library inventory: `catalog.ts`, `engine.ts`, `library.ts`, `shell.ts`, `timeline.ts`, `utils.ts`.

`src/components/Filters.astro` owns labeled catalog controls. `Passage.astro` renders an optional complete Quran passage; `References.astro` renders named reports and exact commentary links. `src/data/config.json` owns display metadata, accent and port; `content.json`, `sources.json` and `provenance.json` separate activity content, references and checksums. `public/` owns local fonts, favicon, robots and security headers.

Route-source inventory:

- `src/pages/404.astro`
- `src/pages/event/[id].astro`
- `src/pages/index.astro`
- `src/pages/privacy.astro`
- `src/pages/sources.astro`

Detail pages use getStaticPaths and local JSON. No app imports another app or repository preparation code at runtime.

## State and privacy

`bookmarks` stores explicitly saved event IDs. Comparisons and filters stay in memory; copied comparison links contain the two public record IDs.

All storage keys have prefix `islamic-civilization-timeline:` and timestamp envelopes with `at` and `value`. Helpers validate shapes, reject timestamps more than 60 seconds ahead, ignore records at least 30 days old and catch blocked storage. Theme is separate from activity opt-in; the initial bootstrap validates its timestamp and theme value too. Expiry is checked on access; stored bytes do not auto-delete while the site is closed. Clear-data removes only this app namespace and reloads.

## Deployment and invariants

Port 4336. Build `bun install --frozen-lockfile && bun run build`, output `dist`, environment `BUN_VERSION=1.4.4`. Serve at its own Pages project/domain root; absolute asset paths require an explicit migration for subpath hosting. No adapter, Functions, bindings, secrets or runtime service is needed. Production project `moongazer-islamic-civilization-timeline` uses Direct Upload; its current release is recorded in repository deployment/status.json.

Preserve literal canonical text, edition attribution, source limits, independent builds, accessible interactions and app namespace isolation. Twenty-four records span 661 to 1648 CE across nine regions. Century ranges are inclusive editorial filtering bands, not exact event durations. Overlap is not proof of contact, influence or causation. The map gives orientation without borders or exact event markers. No Quran text is used to support a later historical date.

Research and QA live in repository `_implementation/research/batch4/` and `_implementation/qa/batch4/`. `tests/activity.test.ts` checks behavior/content constraints; `tests/storage.test.ts` checks expiry, corruption, blocked storage and isolation. Normal app builds need none of the research tools.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## Anonymous event hook points (P4.7, 2026-11-11 Asia/Dhaka)

Counter events go through `src/lib/counter.ts` (`track`). The civilization timeline uses the stable id `timeline` for all of its activity; no filter text, event choice or visitor text is sent.

- `src/lib/library.ts`: `activity_started` (`timeline`) on the first filter input, filter change or region chip. `share_clicked` (`timeline`) on copy-saved.
- `src/lib/timeline.ts`: `activity_started` (`timeline`) on the first user "Compare" click. `activity_completed` (`timeline`) once per page load when a comparison is shown. `share_clicked` (`timeline`) on "Copy comparison link". The "Report an error" link sits under the comparison result.
