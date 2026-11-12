# Code standards

## General

- Keep changes within this app's boundary. Preserve independent builds.
- Keep calculation logic pure and separate from DOM rendering. Put it in a focused TypeScript module with tests.
- Do not add dependencies, and do not rewrite shared apps to implement a small feature.

## TypeScript and Astro

- Use Astro's strict TypeScript configuration. Validate unknown browser, URL and storage input before trusting it.
- Keep `output: 'static'`, directory-format output and trailing slashes.
- Use Astro client scripts for browser interaction. Do not add server endpoints, SSR adapters, runtime external APIs, React, Tailwind or a component library.
- Keep the manifest and lockfile independent. Do not add runtime imports from another app or `_implementation`.

## Zakat content (D23)

- No ruling, nisab figure, amount or method option is written into source until its entry is in the verified method record and its second-pass verification. Every method option in source comes from that record, and a test checks each maps to an entry with a source.
- Every school difference is a labelled choice with an attribution and a source note. No default is selected, and both nisab bases are shown.
- Attribute a position only to a source that can be opened and cited. Leave out any position that cannot be verified, and record the omission in the progress tracker.
- Money inputs are visitor-entered. Do not fetch prices, do not convert currencies, and do not assume a currency. The default label is a free-text field (planned default "BDT"), with no conversion.
- Keep the limit sentence beside any result: the output is not a fatwa.

## Styling and accessibility

- Use the CSS tokens and component classes in `context/ui-context.md`.
- Use native links, buttons, forms, fieldsets, labels and status regions. Keep visible focus, reduced motion and readable contrast in both themes.
- Escape variable text before `innerHTML`; prefer `textContent` and form-control values.

## Data and storage

- Storage uses only `read`, `write` and `forget` in `src/lib/utils.ts`, with the app namespace.
- Any new storage key is documented in `context/architecture.md` with its validation and expiry before it is written.
- Content checksums: after a change to `src/data/content.json`, recalculate `appContentSha256` in `provenance.json` as the LF-normalised SHA-256 of the file. `tests/config.test.ts` enforces this.
- All runtime fonts and data are local. No analytics, third-party scripts or cookies.

## Shared files

`src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/components/LearningGuide.astro`, `src/components/Honorific.astro`, `src/lib/utils.ts`, `src/lib/seo.ts`, `src/lib/import.ts`, `tests/import.test.ts`, `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/sitemap.xml.ts` and `public/_headers` are edited only in `apps/guess-the-surah` and copied with `bun _implementation/sync-shared.ts --from guess-the-surah <path>`. Then `bun _implementation/sync-shared.ts --check` must pass. `src/lib/shell.ts` and `src/styles/global.css` are app-specific copies.

## Files and validation

- `src/pages/`: routes. `src/layouts/`, `src/components/`: shared shell and components. `src/lib/`: behaviour, pure logic and helpers. `src/data/`: bundled data and provenance. `src/styles/`: CSS. `public/`: local assets and headers. `tests/`: Bun tests.
- Do not hand-edit `dist/`, `.astro/` or `node_modules/`.
- Run `bun run check`, `bun test` and `bun run build` from this folder for every behaviour or data change.
