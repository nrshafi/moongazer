# Architecture context: Zakat Calculator

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Astro 7.4.2 | Static HTML generation and client-script bundling |
| Runtime/tooling | Bun 1.4.4 | Install, dev, check, tests, build and preview |
| Language/checking | TypeScript 6.0.3; @astrojs/check 0.9.12 | Strict source and Astro template checking |
| UI | Astro, native HTML, CSS and inline SVG | App-owned accessible interface; no component framework |
| Content | Local JSON | Verified method record copied into content.json, sources, provenance (sha256) |
| Storage | Optional localStorage | Theme preference; the form under key `inputs` only if the visitor opts in (30 days) |
| Auth/database | None | Anonymous public use |
| Hosting | Cloudflare Pages static output (planned) | Independent `dist/` deployment at its domain root |

Lockfile: `bun.lock` copied from `apps/the-seerah-detective` with the same resolution (astro 7.4.2, @astrojs/check 0.9.12, typescript 6.0.3); the root workspace name is `zakat-calculator`. `bun install --frozen-lockfile` passes. No dependency has been added.

## System boundaries

- `src/pages/`: `index.astro` (calculator), `method/index.astro`, `zakat-al-fitr/index.astro`, `sources.astro`, `404.astro`, `privacy.astro`, `sitemap.xml.ts` (shared).
- `src/layouts/Shell.astro`, `src/lib/shell.ts` and `src/styles/` provide the shell, theme control and styles. Shell is shared; `shell.ts` and `global.css` are copied unchanged from `the-seerah-detective`.
- `src/lib/utils.ts` (shared) owns storage: `read`, `write`, `forget`, `namespace`.
- `src/lib/seo.ts` (shared) derives page metadata from `config.json` and `seo.json`. Every route needs an entry there. The app has no collections yet, so only `/`, `/sources/`, `/privacy/` and `/404.html` exist in the metadata table.
- `src/lib/import.ts` (shared) is the saved-item import protocol. This app does not yet use it.
- `src/components/LearningGuide.astro` renders the learning section on the home page from `src/data/learning.json`.
- `src/data/`: `config.json` (slug, name, accent `blue`, nav `Plan`, port 4341), `seo.json`, `learning.json`, `sources.json` (empty array), `content.json` (`{"method": null}`), `provenance.json` (status `pending`, `appContentSha256`).
- `public/`: fonts with OFL licence files, `favicon.svg` (balance-scale glyph), `robots.txt`, `_headers`. `social-card.png` is not yet present, so the `og:image` tag points at a missing file.
- `tests/`: `config.test.ts` (this app's consistency checks), `storage.test.ts`, `theme-bootstrap.test.ts`, `import.test.ts` (shared).

## Storage model

Records use the namespace `zakat-calculator` and a colon, with `at` and `value` fields. `read` validates shape and time: it rejects timestamps more than 60 seconds ahead and records at least 30 days old, and it tolerates unavailable storage.

- `theme`: the explicit light/dark preference, written by the shell toggle.

No other key exists. The planned opt-in key `inputs` (T7.6) must be added here, with its validation and expiry, before the calculator stores anything. Until then the calculator, if built, keeps its inputs in memory.

## Method and content model

- The method record is produced in P7 T7.4 at `_implementation/research/zakat/method.json`, with a separate `verification.json` from a second pass. Neither file exists yet.
- When verified content is added to `src/data/content.json`, `provenance.json` `appContentSha256` must be recalculated as the LF-normalised SHA-256 of that file. `tests/config.test.ts` checks the current value.
- Each school difference is a labelled option with its attribution and source note. A position that cannot be attributed to an openable source is left out (D9, D23).

## Auth and access

Public and anonymous. No login, backend, secret or runtime API. The app makes no live price request; visitors enter prices themselves.

## Invariants

1. Keep an independent `bun.lock` and manifest. Do not import from another app or from `_implementation` at runtime.
2. Shared files are edited in `apps/guess-the-surah` and copied with `sync-shared.ts`. `bun _implementation/sync-shared.ts --check` must pass.
3. The app must not state a ruling, a nisab figure or a payable amount until the verified method record backs it.
4. Preserve optional storage, the app namespace and normal operation when storage is blocked.
5. Host `dist/` at the domain root.

## Build and deployment status

Port 4341. Build `bun install --frozen-lockfile && bun run build`; output `dist`; `BUN_VERSION=1.4.4`. No SSR adapter, Functions, bindings or secrets. Not deployed. The app is not yet listed in `deployment/targets.json`, in `_implementation/verify.ts` or in the directory (T7.7), and no Pages project exists (T7.8).

## Input modality for focus styling

The shell listens for pointerdown and Tab keydown and sets a transient `data-input-method` attribute on the document root. Global CSS suppresses pointer focus outlines and keeps neutral keyboard focus. This attribute is not saved.

## Documentation verification

Astro 7.4.2 and the other pins are the versions already used by the shared apps. No new API pattern has been introduced. The checks run for this scaffold were `bun run check`, `bun test` and `bun run build` in this app folder.

## Calculator (P7 T7.6)

- `src/lib/zakat.ts` is pure: `calculate(inputs, choices)` returns `ok`, `needs-choice` (names the unanswered differences) or `invalid`. Differences and their options are declared in `DIFFERENCES`, each option pointing at positions (by index) of a method-record entry; nisab weights come only from the record's `nisab-conversions` positions. Zakat due = total / 40 when total >= chosen nisab.
- `src/lib/app.ts` reads the form, renders the result with text nodes, calls `renderSessionEnd`, and tracks `activity_started` (first input change) and `activity_completed` (calculate) with item `calculator`. Saving uses `read`/`write` key `inputs` only when the visitor ticks the opt-in.
- `src/components/MethodEntry.astro` renders a record entry; `src/lib/editorial.ts` adds the honorific to our own wording.
- `scripts/sync-method.ts` regenerates content.json, sources.json and the provenance hashes from `_implementation/research/zakat/method.json`.
