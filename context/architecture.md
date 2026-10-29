# Repository architecture

## GitHub Actions deployment

Pushes to main check, test and build all twenty apps and the directory, then deploy all existing Direct Upload projects using project-scoped asset hashes. Account and token credentials stay in GitHub Actions secrets. The first production run passed 646/646 live checks; deployment/automation-result.json records it.

## Stack and project model

Twenty independent Astro 7.4.2 applications use Bun 1.4.4, TypeScript 6.0.3 and @astrojs/check 0.9.12. Every app has its own package.json, bun.lock, strict tsconfig, static Astro configuration, copied layout/styles/helpers, bundled content and public assets. The repository root is not a package workspace. There is no runtime backend, authentication service or database.

## System boundaries

| Directory/file | Responsibility |
| --- | --- |
| `apps/<slug>/` | Independent app source, tests, assets and local context |
| `_implementation/` | Bun/Python source retrieval, authored content preparation, verification and packaging helpers |
| `_implementation/research/` | Canonical snapshots, MCP/tool records, fetched commentary and media attribution |
| `_implementation/qa/` | Recorded test/build/static/browser evidence and context audit |
| `release/` | Generated static upload ZIPs and checksum manifest |
| `_build/`, `_reference/`, root HTML demos | Earlier prototype tooling, readable atlas reference and demonstrations |
| `6_File+Context+Methodology/` | Supplied generic seven-file reference template, preserved |
| `context/`, root `AGENTS.md` | Repo-wide product/architecture/UI/standards/workflow/progress contract |
| `DEPLOYMENT.md`, shortlist and QA reports | Deployment inventory, selected scope and implementation evidence |

Within each app, pages and getStaticPaths generate static routes; the shell owns metadata/navigation/theme/privacy controls; TypeScript modules own browser behavior; JSON owns content/source/provenance data; public assets remain local. A normal app build has no runtime import from research tooling or another app.

## Content and storage

- The full canonical Quran snapshot is `_implementation/research/quran-full.json`, with all 6,236 Arabic/Pickthall ayahs. Earlier `quran-snapshot.json` contains the first 225-ayah subset and 43 commentary records; it is not full corpus coverage.
- Batch-three research adds commentary anchors, full parable context and a second commentary for 24:35. Canonical text and fetched commentary are distinct from authored questions, groupings, fictional consequences and reflections.
- App content/provenance is in each `src/data/`. The checker additionally lazy-loads its local full corpus. Static verification compares canonical quotations and checks hashes.
- In-memory state is primary. Optional localStorage records use `<app-slug>:<key>` with `{at,value}` and access-time 30-day expiry. Theme is separate from activity opt-in; explicit bookmarks count as a save action. Stored bytes do not disappear automatically while a site is closed.
- Exports are visitor-triggered browser downloads/clipboard actions. Parables reflection notes remain in memory until explicitly copied/downloaded. No server history or user identity is stored.

## Access and deployment

All apps are anonymous/public. Local scores are editable by the visitor and are not trusted leaderboards. Source links are optional external reading. Each deploys its dist contents at a domain/project root with local fonts/data/media, CSP and other static headers. Set BUN_VERSION=1.4.4; use the build command and root in DEPLOYMENT.md. The authorized publication uses twenty independent Pages projects plus the directory; see deployment/status.json.

## Authorized hosting expansion, 29 October 2026

The root domain moongazer.tech hosts a buildless HTML/CSS/JavaScript directory in `homepage/`. Its static output is generated into `homepage/dist/`. The twenty Astro apps retain independent builds and their existing sources. `deployment/targets.json` is the authoritative mapping of app roots, Pages projects, subdomains and directory copy. Deployment helpers live in `deployment/`; no deployment credentials enter source, output or logs. The authenticated Cloudflare connector manages projects, deployments, domain associations and DNS; a short-lived upload token is passed to the local asset uploader through stdin only.

The user explicitly authorized publication. No shared backend, visitor tracking or storage is added. Record deployment IDs, domain status and actual HTTP verification separately from historical QA. GitHub Actions now automates the existing Direct Upload projects.

Production verification requires each project's own upload token and asset namespace. Do not treat an upload to one project as an account-wide upload. The www-to-apex redirect belongs in the zone's `http_request_dynamic_redirect` ruleset because Pages `_redirects` does not support domain-level source matching. Keep RUM disabled for this zone to preserve the documented absence of analytics. Validate TLS hostnames when using public DNS answers to bypass a workstation's stale negative DNS cache.

All static responses use `Cache-Control: no-transform` alongside their normal cache policy. Cloudflare's official Web Analytics FAQ identifies this directive as preventing automatic beacon insertion. This preserves exact canonical/source HTML and the no-analytics boundary even if a platform injection setting changes. Immutable app asset caching retains its existing lifetime.

The deployment helper uses deterministic project-scoped asset keys after intermittent empty 500 responses from the earlier uploaded keys. The input includes the project name as well as base64 content and file extension; no content bytes change. Generated manifests identify `blake3-project-v1`. An isolated app passed five consecutive complete production checks, 100 requests total, before applying this key format to the remaining sites. The complete collection subsequently passed two consecutive 646-request checks, with every served file matching its expected hash.

## Invariants

## SEO architecture

Each independent app will own its production Astro site URL, a local SEO profile and server-only metadata helper. The helper derives detail routes and summaries from local editorial content so normal app builds regenerate correct per-page metadata and a static sitemap endpoint without root tooling or runtime APIs. Every host serves its own sitemap and robots declaration; do not publish a cross-host sitemap index before Search Console cross-site submission is configured. Privacy and 404 pages remain accessible but noindex; 404s have no canonical. Other pages self-canonicalize to their custom domain, excluding query parameters. Pages development/preview hosts send noindex headers.

Breadcrumbs and app-directory links are visible, and their JSON-LD mirrors actual navigation. Structured data describes WebSite, WebPage/CollectionPage, educational resources and breadcrumbs without invented reviews, authors, credentials, dates or rich-result promises. Locally generated PNG social cards and WOFF2 derivatives retain local fonts and licenses. There are no dependency upgrades, new server services or visitor tracking. SEO changes will be rebuilt, checked and republished to the existing 21 projects with current live verification.

1. Preserve independent app builds, static output and user-requested Cloudflare Pages compatibility.
2. Do not add accounts, database storage, live AI inference, API keys or external runtime assets by default.
3. Preserve source attribution and literal canonical quotations. No invented Quran text, scholarly certification or precise historical/geographical claims beyond evidence.
4. Keep optional browser state isolated and resilient to expiry/corruption/blocked storage.
5. Edit authoritative source; regenerate release output. Do not hand-edit vendor files, generated dist or ZIP contents.
6. Preserve all twenty apps as independent static projects. Use the existing pinned stack, local assets and source preparation model.

## Final implementation batch

Ports 4336 through 4340 are reserved for `islamic-civilization-timeline`, `halal-business-decisions`, `revelation-context-explorer`, `family-islamic-learning-challenges` and `islamic-misinformation-casebook`. Research and QA for this batch live in `_implementation/research/batch4/` and `_implementation/qa/batch4/`. Historical records use institutional sources. Revelation reports distinguish transmitted occasions from general context and responses after revelation. Business cases remain fictional educational exercises. Family activities collect no child profiles or names. The misinformation reader evaluates a fixed cited case bank, not arbitrary visitor claims.

Batch four adds 24 institutional-source history records, 12 fictional business cases, 10 report-context readings, 12 family packs and 12 fixed evidence-reading claims. Canonical text stays local and exact; source notes retain uncertainty. All twenty app builds remain independent.

## Isolated E2E tooling

`_implementation/e2e-preview.ts` serves existing production builds and their real headers on ports 5321–5340. Storage/clipboard/download probes are test-only injections on those ports, with no deployment imports or dist edits. Reusable CUA journeys live in `_implementation/e2e-flows.mjs` and `_implementation/e2e-shared.mjs`; `_implementation/e2e-http.py` compares all served bytes/headers. Evidence lives in `_implementation/qa/e2e/`. Initial theme validation and saved-state reads use matching time/type constraints.

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and preserves neutral keyboard focus. This attribute is not saved in browser storage; dynamically rendered controls use the same delegated behavior.

## Git repository layout

The portfolio is prepared as one Git repository with all twenty independent apps, shared research, and verification records. Each app retains its own manifest, lockfile, build and deploy settings; this is not a Bun workspace. App-local ignore rules also apply when an app is copied out.
