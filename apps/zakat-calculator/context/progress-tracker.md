# Progress tracker: Zakat Calculator

Last updated: 2026-11-11T18:25:00+06:00 Asia/Dhaka

## Scaffold, P7 T7.5

2026-11-11T18:25:00+06:00 Asia/Dhaka: The app is scaffolded as an empty but complete shell on branch `phase-7-zakat`, based on `phase-3-merges`, port 4341. It shows the introduction and the notice "The calculator is being prepared; its method and sources will be shown in full." No zakat ruling, nisab figure, amount, hadith or Quran text is bundled. `src/data/content.json` is `{"method": null}`, `sources.json` is empty and `provenance.json` status is `pending`.

Shared files were copied from `apps/guess-the-surah` with `bun _implementation/sync-shared.ts --from guess-the-surah`; `--check` reports all 12 shared files identical across 21 apps. `bun.lock` was copied from `the-seerah-detective`, so the pinned resolution is the same (astro 7.4.2, @astrojs/check 0.9.12, typescript 6.0.3); `bun install --frozen-lockfile` passes.

Validation in this app folder: `bun install --frozen-lockfile` passed; `bun run check` reported 0 errors, 0 warnings and 0 hints across 13 files; `bun test` passed 19 of 19 tests in 4 files; `bun run build` built 4 pages (home, sources, privacy, 404) plus the sitemap. The sitemap lists the home and sources pages.

## Remaining work

- No social card image (`public/social-card.png`); `og:image` points at a missing file.
- The method record (T7.4: `_implementation/research/zakat/method.json`, `verification.json`) does not exist yet. Method content is pending.
- Not registered in `deployment/targets.json`, `_implementation/verify.ts` or the directory (T7.7). Not deployed (T7.8).
- The shared privacy page's wording was written for other apps. It is shared copy and has not been changed for this app.
- Visual check at 390px width and in both themes was not performed in this step; only the build and the static output were checked.

## Decisions

- Based on `phase-3-merges` as the brief specifies, so the shared files are the current copies.
- The favicon is a white balance-scale glyph on the blue rounded tile (`#316caa`), matching the other apps' logo style rather than a single-colour glyph.
- Blue tokens follow the shared values already in `global.css` (`#316caa`). The P5 family table lists different worship-family blue values (`#2563eb`); that is not applied to any app yet and is recorded as an open question for the owner.
- D23 applies to the planned calculator: labelled choices per school difference, no default ruling, both nisab bases, no pre-selected option (see `AGENTS.md`).
