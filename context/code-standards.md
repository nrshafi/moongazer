# Code standards

## General

- Keep changes within the requested project boundary. Preserve independent builds and existing source attributions.
- Prefer focused TypeScript modules and Astro pages/components. Keep pure grading/calculation logic separate from DOM rendering where the app already has an engine.
- Fix the cause of a defect; do not add dependencies or rewrite unrelated apps to implement a small feature. Existing compact files are not an instruction to create more dense, unreadable code.

## TypeScript and Astro

- The app uses Astro's strict TypeScript configuration. Use explicit interfaces or inferred data shapes; validate unknown browser/URL/storage input before trusting it.
- Keep `output: 'static'`, directory-format output and trailing slashes. Publish dynamic-looking detail routes with `getStaticPaths` at build time.
- Use Astro client scripts for browser interaction. Do not introduce server endpoints, SSR adapters, runtime external APIs, React, Tailwind or a component library without a scoped reason and user-compatible architecture decision.
- Keep every app's manifest and lockfile independent. Do not add runtime imports from another app or `_implementation`.

## Styling and accessibility

- Use the existing CSS tokens and component classes in `context/ui-context.md`. Keep dynamic-JS markup styles global or in an imported CSS file; Astro-scoped styles do not automatically cover inserted markup.
- Use native links, buttons, forms, fieldsets and details. Label inputs, preserve visible focus, provide status feedback and respect reduced motion. Under the 2026-11-25 English-only UI decision, do not render Arabic passages in app or directory UIs (display Pickthall translations; preserve `ﷺ` honorifics via `Honorific.astro` / `withHonorifics()`).
- Escape variable text before `innerHTML`; prefer `textContent` and form-control values for user text. Never insert a visitor's query or note into unescaped HTML.

## Data and storage

- Preserve fetched Quran Arabic and Pickthall translations literally in local JSON data (`src/data/content.json`, `homepage/ayat-of-the-night.json`, `_implementation/research/quran-full.json`) for static/canonical verification. App and directory UIs render only the English Pickthall translation (no Arabic script passages rendered in UI as of 2026-11-25). Search normalization belongs in the search index, not in canonical JSON data. Interpretive claims need retrieved commentary and attribution.
- Treat themes, fictional consequences, questions, diagrams, approximate dates and informal scores as editorial aids with the app's documented limits.
- Optional localStorage must be app-namespaced, validated, timestamped, ignored after 30 days and resilient to blocked storage. Theme preference is independent of activity opt-in. Do not add identity collection, analytics or hidden synchronization.
- All runtime fonts/media/data must be local. External source links are optional reading. Retain media/font licenses and provenance; update content checksums after a content change.
- First-party services (P4): app bundles may only call `navigator.sendBeacon` to `https://moongazer.tech/api/event` and may only post forms to `https://moongazer.tech/api/feedback`. No `fetch(` in app bundles. Functions under `homepage/functions/` validate every input (pure module in `_lib/validate.ts`, no Workers types there), store nothing but the documented fields, never store IP addresses or user agents, never `console.log` request data, and respond with `Cache-Control: no-store`.

## Files and validation

Keep generated verification output under `_implementation/qa/` and `deployment/evidence/` out of Git. Preserve authored Markdown notes and the compact font-conversion record in those directories. Version source files, required public assets and compact deployment/Search Console records normally; avoid repository-wide JSON or log exclusions.

SEO metadata must come from inspected local names and editorial summaries, never invented source quotations. Escape serialized JSON-LD against closing-script markup. XML sitemaps contain only same-host, canonical, indexable URLs, with no fabricated modification dates. Validate generated metadata, route coverage, structured-data identifiers and the exclusion of privacy/404 routes. Preserve app independence and source checksums.

The directory homepage may use dependency-free HTML, CSS and JavaScript as explicitly requested. Keep authoritative source in `homepage/`, render the catalog from `deployment/targets.json`, and regenerate `homepage/dist/` with `node homepage/build.mjs`. Hosting helpers must fail on unsuccessful API responses, preserve existing unrelated DNS, and never log or persist credentials. Verify the generated catalog matches all 13 active app roots and deployed hostnames.

- `src/pages/`: static routes and page composition. `src/layouts/`: the shared shell copy. `src/lib/`: behavior, pure logic and helpers. `src/data/`: bundled data and provenance. `src/styles/`: CSS. `public/`: local assets and hosting headers. `tests/`: meaningful Bun checks.
- Do not hand-edit generated output or third-party internals. Generators under `_implementation` are preparation tools, several of which overwrite files; inspect their scope before use.
- Run meaningful checks for behavior changes and the affected Astro check/build. For documentation-only changes, validate context completeness, paths and facts; do not rerun builds just to report activity.
- Use Bun commands from the correct app directory. Root orchestration commands are documented in `context/ai-workflow-rules.md`.

## SEO release, 30 October 2026

Keep titles and descriptions specific to the local page. Missing route metadata must fail the build. Serialize JSON-LD with closing-script characters escaped and verify graph identifiers against visible content. Sitemaps contain only same-host, clean, canonical, indexable URLs and no unverified last-modified dates. Preserve source quotations and provenance. Do not apply the Pages-origin noindex header to custom hosts.

## Google Search Console setup, 30 October 2026

Keep Search Console records factual. Distinguish submission acceptance, sitemap fetch Success, discovered pages and actual indexed pages. Preserve the existing verification TXT record; do not replace unrelated DNS records or put Google account credentials into the repository. The verification value is a public DNS ownership proof.

## Search content enhancement scope

Derive route metadata and subject app lists from local authoritative data. Use escaped text and safe JSON-LD serialization. App guidance describes inspected features and limitations; source quotations and provenance stay untouched. Include canonical URLs, sitemap entries, incoming links and truthful structured data for every new indexable directory page. Do not publish unsupported expertise, ratings, invented dates or duplicated keyword variations.
