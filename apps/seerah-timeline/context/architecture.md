# Architecture context: Seerah Timeline

## Authorized SEO scope

The current user request covers published SEO improvements. This independent app owns its production site URL, local SEO profile/helper and static sitemap endpoint. Page metadata derives from local editorial records, without changing canonical quotations. Privacy and 404 pages are noindex and omitted from the sitemap. Other pages self-canonicalize to the custom hostname; Pages-origin/preview responses are noindex. Breadcrumbs and directory links remain visible. Social previews and WOFF2 fonts stay local with licenses. No runtime service, analytics or dependency upgrade is added. The completed SEO validation and production release are recorded in repository SEO_QA.md.

## Publication response policy

The user authorized Cloudflare Pages hosting at https://seerah-timeline.moongazer.tech/. Static responses use Cache-Control no-transform to prevent automatic platform beacon insertion and preserve source HTML. Existing immutable asset lifetimes remain. Build from public/_headers; never edit dist. Project-scoped upload credentials stay outside source and logs.

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
- `src/pages/challenge/index.astro`
- `src/pages/event/[slug].astro`
- `src/pages/index.astro`
- `src/pages/privacy.astro`
- `src/pages/sources.astro`

- `src/layouts/Shell.astro` owns metadata, theme initialization, navigation, footer and storage dialog. `src/lib/shell.ts` implements shell behavior.
- `src/lib/` currently contains: `challenge.ts`, `challenge-app.ts`, `seo.ts`, `shell.ts`, `timeline.ts`, `utils.ts`.
- `challenge.ts` holds the pure "Which came first?" engine (permutation, grade, progress validator, seeded start order, move). `challenge-app.ts` is the `/challenge/` page script.
- `timeline.ts` controls filtering, selection and bookmarks. The event route publishes each bundled event as a static page.
- `src/data/config.json` owns slug, display text, accent and port. `content.json`, `sources.json` and `provenance.json` keep content, citations and checksums distinct.
- `public/` contains local fonts, favicon, robots and `_headers`; app-specific media remains here too. `tests/` contains `content.test.ts`, `storage.test.ts`, `theme-bootstrap.test.ts`.
- Repository `_implementation/` owns research/preparation/collection checks, not runtime services or imports. `dist/`, `.astro/` and `node_modules/` are generated.

## Storage model

Stored records use the body app slug `seerah-timeline` and a colon, with `at` and `value` fields. The read helper validates shape/time, rejects timestamps more than 60 seconds ahead and records at least 30 days old, and tolerates unavailable storage. Initial theme setup validates a finite numeric timestamp, the 30-day age, the 60-second future tolerance and the light/dark value in Shell.astro; subsequent reads use the storage helper. Thirty days is an access-time expiry policy, not automatic deletion while the site is closed.

- `theme`: the explicit light/dark preference, independent of activity recovery.
- `bookmarks` stores selected event IDs when the visitor explicitly saves them.
- `challenge-progress` stores one game `{pack, order, tries, hint, revealed, complete, seed}` only when the visitor ticks "Remember this challenge"; unticking forgets it.
- Core activity state otherwise lives in memory. Clear-data removes this app's namespace and reloads; other apps are unaffected.

## Auth and access

All readings and interactions are public and anonymous. There is no ownership model, login, backend authorization or secret credential. Browser state and scores are visitor-editable. Explicit source links open external primary sources; fonts, media and core behavior do not require external runtime services.

## Invariants

1. Keep independent `bun.lock`/manifest, static output and no cross-app runtime imports.
2. Keep canonical quotations literal and attributed. Content changes must update provenance checksums and appropriate source records.
3. Preserve optional storage, app namespace isolation and operation when storage is blocked.
4. Preserve the app-specific boundary: Date bands are approximate navigation aids. A report supporting an event does not necessarily establish its displayed CE year. Do not erase disputed placement notes.
5. Host `dist/` at the site's root unless an explicit base-path migration also changes absolute asset and route URLs.

## Deployment and known cost

Port 4325. Build `bun install --frozen-lockfile && bun run build`; output `dist`; environment `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Production project `moongazer-seerah-timeline` uses Direct Upload. See repository deployment/status.json for release IDs. The current recorded output has 40 HTML pages and 53 files.

App-specific content and media constraints are listed in project-overview.md and the source methodology page.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## SEO release, 30 October 2026

Each app owns its production Astro site URL, local src/data/seo.json profile, src/lib/seo.ts helper and static sitemap.xml endpoint. Clean HTTPS canonicals use its full-name custom hostname. Local social PNG cards and licensed WOFF2 fonts accompany the build. Noindex rules exclude privacy/404 pages and Pages-hosted copies. The directory owns a separate same-host sitemap and catalog JSON-LD. The verified release is recorded in deployment/seo-release.json.

## Search content enhancement scope

The homepage build renders subject and About routes from authoritative local content and regenerate its sitemap. Each app owns a copied learning-guide JSON record and Astro component; normal app builds retain no cross-app runtime imports. All existing custom hosts, detail URLs, source checksums, static output and dependency pins remain. An optional llms.txt directory index describes the same visible public content. The SEO validator must cover the added routes and navigation before publication.

Honorifics: plain ﷺ in JSON, `<Honorific />` in templates, `withHonorifics` in client scripts.

## "Which came first?" at /challenge/ (P3 T3.4)

The `/challenge/` section. `content.json` gains `packs` (12 packs of four timeline event ids, each `{id, number, title, events}` in chronological order). The game reuses the timeline's events and creates no new ones. Each of the 14 challenge events is an existing timeline event, referenced by the same id:

| Challenge event id (= timeline id) | Timeline no. | Source |
| --- | --- | --- |
| the-first-revelation | 1 | Sahih al-Bukhari 3 |
| calling-the-clans-at-safa | 5 | Sahih al-Bukhari 4770 |
| the-cave-during-the-migration | 11 | Sahih al-Bukhari 3653 |
| supplication-at-badr | 17 | Sahih al-Bukhari 3953 |
| the-archers-at-uhud | 18 | Sahih al-Bukhari 3039 |
| digging-the-trench | 20 | Sahih al-Bukhari 4100 |
| the-journey-to-hudaybiyah | 22 | Sahih al-Bukhari 2731 |
| the-banner-at-khaybar | 25 | Sahih al-Bukhari 4210 |
| the-return-for-umrah | 27 | Sahih al-Bukhari 4251 |
| the-approach-to-makkah | 28 | Sahih al-Bukhari 4280 |
| the-expedition-to-tabuk | 31 | Sahih al-Bukhari 4418 |
| announcements-during-abu-bakr-s-hajj | 33 | Sahih al-Bukhari 4655 |
| the-farewell-hajj | 34 | Sahih Muslim 1218a |
| the-death-of-the-prophet | 36 | Sahih al-Bukhari 4449, 4452 |

Pack titles were rewritten to describe the four events without revealing their order: each lists the events' short names alphabetically (for example "Badr, the Hijrah, Hudaybiyah and the Trench"), so no title discloses the earliest or latest event. Old titles such as "After the migration" for a pack that begins at the Hijrah were inaccurate.

Behaviour: seeded shuffle per play (a fresh random seed on each new play or restart; `?pack=` and `?seed=` reproduce a shared game), up/down buttons with `aria-label="Move <title> up/down"`, "Open source clue" per card (`aria-expanded`, hidden until requested), "Check order" with feedback in `role="status"`, and on completion or reveal the correct order with approximate dates, the date/source note and a link to each event page. Pointer drag is not implemented. Grading counts correct positions and inversions; a completed state is accepted from storage only when its order is correct.

The challenge was merged into this app and the standalone app was removed under D2c (`plan/implementation/00-INDEX.md`). No saved progress is imported. `challenge-progress` is written only by `/challenge/` itself.

SEO: `seo.ts` registers only one `seo.json` collection and throws "Add metadata for the new page: /challenge/" for other routes. The page metadata is kept in `seo.json` under `extraPages` and must be registered by a one-line `seo.ts` change (see progress tracker); until then the production build fails.

## Anonymous event hook points (P4.7, 2026-11-11 Asia/Dhaka)

Counter events go through `src/lib/counter.ts` (`track`). Item ids are the stable pack id or event id; no order, answer or visitor text is sent.

- `src/lib/challenge-app.ts`: `activity_started` (pack id) on the first move. `activity_completed` (pack id) once per page load on a correct check or a reveal. `share_clicked` (pack id) on "Copy challenge link".
- `src/lib/timeline.ts`: `share_clicked` (selected event id) on the event "Copy link" button.
- `src/pages/challenge/index.astro`: the status paragraph is now `#challenge-feedback` (it had duplicated the footer form id `feedback`); the "Report an error" link sits under it.
