# Repository architecture

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

All apps are anonymous/public. Local scores are editable by the visitor and are not trusted leaderboards. Source links are optional external reading. Each deploys its dist contents at a domain/project root with local fonts/data/media, CSP and other static headers. Set BUN_VERSION=1.4.4; use the build command and root in DEPLOYMENT.md. No account deployment has occurred.

## Invariants

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
