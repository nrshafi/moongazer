# Progress tracker: Zakat Calculator

Last updated: 2026-11-12T18:30:00+06:00 Asia/Dhaka

## Scaffold, P7 T7.5

2026-11-11T18:25:00+06:00 Asia/Dhaka: The app is scaffolded as an empty but complete shell on branch `phase-7-zakat`, based on `phase-3-merges`, port 4341. It shows the introduction and the notice "The calculator is being prepared; its method and sources will be shown in full." No zakat ruling, nisab figure, amount, hadith or Quran text is bundled. `src/data/content.json` is `{"method": null}`, `sources.json` is empty and `provenance.json` status is `pending`.

Shared files were copied from `apps/guess-the-surah` with `bun _implementation/sync-shared.ts --from guess-the-surah`; `--check` reports all 12 shared files identical across 21 apps. `bun.lock` was copied from `the-seerah-detective`, so the pinned resolution is the same (astro 7.4.2, @astrojs/check 0.9.12, typescript 6.0.3); `bun install --frozen-lockfile` passes.

Validation in this app folder: `bun install --frozen-lockfile` passed; `bun run check` reported 0 errors, 0 warnings and 0 hints across 13 files; `bun test` passed 19 of 19 tests in 4 files; `bun run build` built 4 pages (home, sources, privacy, 404) plus the sitemap. The sitemap lists the home and sources pages.

## Calculator and method pages, P7 T7.6

2026-11-12T18:30:00+06:00 Asia/Dhaka: Built on branch `phase-7-zakat-ui` (from `phase-7-season`): pure engine `src/lib/zakat.ts`, calculator UI, `/method/`, `/zakat-al-fitr/`, motif, drawer, optional storage under `inputs`, counter events. Validation: `bun run check` 0 errors; `bun run test` 44 pass (19 in `tests/zakat.test.ts`: all five record examples, properties, needs-choice, no digits in share text, data mapping); `bun run build` ok; `sync-shared --check` identical; `audit-text-joins` 0; browser check at 390, 375 and 1440 in light and dark (no horizontal scroll, no script errors); worked example 1 run in the UI gives 250.00; print emulation checked. `verify-static.py` could not run in the worktree because other apps have no `dist`.
- Differences offered and the record positions behind them: jewellery (count: MY-38 Hanafi; exclude: MY-38 and JO-525 and Egypt), debts (deduct: EG-6754, IW-426541, UK-BHAM; do not deduct: JO-3712, a merchant case), receivables (count now: EG-7746 and JO-3712; count only when received: the doubtful-debt positions), nisab metal (gold only; lower of the two). The "combine gold and silver" positions are not offered as an engine option; no silver-only option because no source opened states one. Nisab conversions offered: 85 g, 85 g of 21-carat, 87.47 g, 96 g gold; 595 g, 612.35 g silver.
- Choice made: the conversion choices are required like the differences (no default weight). Silver conversion is required only with the "lower of the two" choice.
- The "receivables: count only once received" option does not model the one-year or all-years rule, only the timing; the method page shows the split.

## Remaining work

- No social card image (`public/social-card.png`); `og:image` points at a missing file.
- No scholarly review has taken place; the method record is source-checked only.
- Visitors with the browser tab open across Ramadan years: saved inputs expire after 30 days by the shared rule.
- Not registered in `deployment/targets.json`, `_implementation/verify.ts` or the directory (T7.7). Not deployed (T7.8).
- The shared privacy page's wording was written for other apps. It is shared copy and has not been changed for this app.

## Decisions

- Based on `phase-3-merges` as the brief specifies, so the shared files are the current copies.
- The favicon is a white balance-scale glyph on the blue rounded tile (`#316caa`), matching the other apps' logo style rather than a single-colour glyph.
- Blue tokens follow the shared values already in `global.css` (`#316caa`). The P5 family table lists different worship-family blue values (`#2563eb`); that is not applied to any app yet and is recorded as an open question for the owner.
- D23 applies to the planned calculator: labelled choices per school difference, no default ruling, both nisab bases, no pre-selected option (see `AGENTS.md`).
