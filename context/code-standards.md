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
- Use native links, buttons, forms, fieldsets and details. Label inputs, preserve visible focus, provide status feedback, respect reduced motion and keep Arabic `lang="ar"` with RTL presentation.
- Escape variable text before `innerHTML`; prefer `textContent` and form-control values for user text. Never insert a visitor's query or note into unescaped HTML.

## Data and storage

- Preserve fetched Quran Arabic/translation literally. Search normalization belongs in the search index, not in displayed canonical text. Interpretive claims need retrieved commentary and attribution.
- Treat themes, fictional consequences, questions, diagrams, approximate dates and informal scores as editorial aids with the app's documented limits.
- Optional localStorage must be app-namespaced, validated, timestamped, ignored after 30 days and resilient to blocked storage. Theme preference is independent of activity opt-in. Do not add identity collection, analytics or hidden synchronization.
- All runtime fonts/media/data must be local. External source links are optional reading. Retain media/font licenses and provenance; update content checksums after a content change.

## Files and validation

- `src/pages/`: static routes and page composition. `src/layouts/`: the shared shell copy. `src/lib/`: behavior, pure logic and helpers. `src/data/`: bundled data and provenance. `src/styles/`: CSS. `public/`: local assets and hosting headers. `tests/`: meaningful Bun checks.
- Do not hand-edit generated output or third-party internals. Generators under `_implementation` are preparation tools, several of which overwrite files; inspect their scope before use.
- Run meaningful checks for behavior changes and the affected Astro check/build. For documentation-only changes, validate context completeness, paths and facts; do not rerun builds just to report activity.
- Use Bun commands from the correct app directory. Root orchestration commands are documented in `context/ai-workflow-rules.md`.
