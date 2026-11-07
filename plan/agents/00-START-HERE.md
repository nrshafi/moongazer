# Agent briefs: start here

These briefs turn `../REPORT.md` into work, in the order it should be done. Read this page fully before starting any brief. Do one brief at a time, in order, unless the dependency column says a brief is independent.

## Owner decisions already made (7 November 2026, Asia/Dhaka)

These came from the owner in chat. Treat them as settled; do not ask again.

1. **Sound.** No music, no instruments, no bells or chimes. Narration, natural ambience and plain non-musical effects only. Vocal-only nasheed needs the owner's approval each time.
2. **Images.** No images of living beings at all: no humans or animals (including birds, fish and insects) in any medium, including photographs, the owner's face, icons and mascots. Objects, places, plants, sky, documents, maps, diagrams and typography only. A schematic diagram of a single organ with no face is allowed when an explanation needs it.
3. **Existing flagged Booktube material.** Delete permanently. The exact list is in brief 02.
4. **RED requests.** Remind, refuse the RED part even if asked again, offer a halal alternative, and continue with the rest. Only an edit to the guidelines file can change a RED rule.

These standards also apply to Moongazer work (briefs 06–15): no music or bells, no images of people or animals.

## Ground rules for every brief

- **Read the target repository's instructions first.**
  - Moongazer: `I:\Development\moongazer\AGENTS.md` and its six context files, in order. For app work, also read the app's own `AGENTS.md` and `context/`.
  - Booktube: `I:\Produce_AB\booktube\AGENTS.md` and its context files, in order. After brief 01 that list starts with `context/islamic-guidelines.md`.
- **Authorization.**
  - Booktube briefs 01–05 are authorized by the owner's decisions above.
  - Moongazer briefs 06–15 are recommendations. Before starting one, confirm in chat that the owner wants that brief done. A report is not authorization, per Moongazer's AGENTS.md.
- **Never commit, push or deploy unless the owner asks.** A push to Moongazer's `main` triggers production deployment through GitHub Actions.
- **Look before deleting.** Before every deletion, list the target and confirm it matches the brief. Record each deleted path.
- **Context before code.** If a brief changes scope, architecture, storage or standards, update the affected context file first, then implement.
- **Record honestly.** When a brief is finished, add an entry with an Asia/Dhaka timestamp to the target repository's `context/progress-tracker.md`. Give the actual validation run and anything not verified. Then update the status table below.
- **Sources.** Quran text comes only from Quran MCP or existing verified snapshots, with surah:ayah and the named translation. Hadith wording and grading are checked on sunnah.com before quoting. Do not invent citations, statistics, dates or credentials.
- **Stay in scope.** If a brief's instructions conflict with what you find in the code, stop and tell the owner. Do not improvise a different design.

## Execution order

| # | Brief | Repository | Depends on | Authorized? | Size |
| --- | --- | --- | --- | --- | --- |
| 01 | [Islamic guidelines and agent instructions](01-booktube-islamic-guidelines.md) | Booktube | — | Yes | Small |
| 02 | [Delete flagged material](02-booktube-delete-flagged.md) | Booktube | 01 | Yes | Medium |
| 03 | [Enforce the rules in code and tests](03-booktube-code-enforcement.md) | Booktube | 02 | Yes | Medium |
| 04 | [Rewrite skills, channel profiles and docs](04-booktube-skills-and-profiles.md) | Booktube | 01 | Yes | Medium |
| 05 | [Verify, re-render the example, record](05-booktube-verify-and-record.md) | Booktube | 02, 03, 04 | Yes | Small |
| 06 | [Fix trust-damaging defects](06-moongazer-fix-defects.md) | Moongazer | — | Ask owner | Medium |
| 07 | [Names, headings, labels and honorifics](07-moongazer-names-and-copy.md) | Moongazer | 06 | Ask owner | Medium |
| 08 | [Activity-first shell and directory front door](08-moongazer-shell-and-directory.md) | Moongazer | 07 | Ask owner | Large |
| 09 | [Daily games and sharing](09-moongazer-daily-and-sharing.md) | Moongazer | 08 | Ask owner | Medium |
| 10 | [Merge four apps, with redirects](10-moongazer-merges.md) | Moongazer | 07, 08 | Ask owner | Large |
| 11 | [Hifz Planner, Zakat Calculator, Ramadan hub](11-moongazer-ramadan-season.md) | Moongazer | 08 | Ask owner; Ramadan deadline mid-January 2027 | Large |
| 12 | [Deepen the existing apps](12-moongazer-app-depth.md) | Moongazer | 09, 10 | Ask owner | Large, in slices |
| 13 | [New apps: Quran Words, Names of Allah, Alif Ba](13-moongazer-new-apps.md) | Moongazer | 08 | Ask owner | Large |
| 14 | [Growth, trust and the Bangla edition](14-moongazer-growth-trust-bangla.md) | Moongazer | 07–10 | Ask owner | Medium |
| 15 | [Install, offline, cross-app streak, projector](15-moongazer-platform.md) | Moongazer | 09 | Ask owner | Medium |

Briefs 01–05 (Booktube) and 06–15 (Moongazer) touch different repositories, so the two tracks can run at the same time. Within a track, follow the order. Moongazer briefs edit the same shared shell files across twenty apps, so only one writer at a time.

## Moongazer verification checklist (used by briefs 06–15)

Commands come from `I:\Development\moongazer\context\ai-workflow-rules.md`. Run what the change affects.

1. In each changed app folder: `bun install --frozen-lockfile`, `bun run check`, `bun test`, `bun run build`.
2. Across all apps from the repository root: `bun _implementation/verify.ts check`, `test`, `build`.
3. Directory: `node homepage/build.mjs`.
4. Source and static integrity: `python _implementation/verify-static.py` (canonical quotations, checksums, local assets).
5. SEO: `bun test _implementation/seo.test.ts` and `python deployment/verify-seo.py`. Titles, canonicals, sitemaps and structured data must match visible content.
6. Browser: serve the production builds with `bun _implementation/e2e-preview.ts` (ports 5321–5340). Check the changed flows at 390 × 844 and 1440 × 1000, in both themes, with blocked storage where storage is involved. Keep test storage on those ports.
7. Windows: if native Astro tooling fails with a sandbox error, retry with `RAYON_NUM_THREADS=2` as the workflow rules describe. Do not change machine-wide settings.
8. Do not push to `main`: a push deploys to production through GitHub Actions. Publishing needs the owner's explicit request, followed by `python deployment/verify-seo.py --live` and the live HTTP verifier.

## Status

Update this table when a brief starts or finishes.

| # | Status | Date (Asia/Dhaka) | Notes |
| --- | --- | --- | --- |
| 01 | Done | 2026-11-07 | Guidelines and decision log copied verbatim; AGENTS.md, CLAUDE.md, GEMINI.md, six context files and docs/operations.md updated; coordinator diff-checked. Tracker entry pending (brief 05). |
| 02 | Done | 2026-11-07 | Six frozen compositions, presenter, music bed, bell/riser/meme sounds, orphaned narration and old renders deleted; Root.tsx keeps kit + book compositions; renderer typecheck clean, `bun test` 30/30. Nine ambiguous `out/_tmp` probe WAVs kept for the owner. |
| 03 | Done | 2026-11-07 | Music refused; `islamic` required on plan/script/video/project approvals; removed SFX ids refused; `sfx fetch` catalog-only; Binance script and PresenterPose types removed. Coordinator re-ran: unittest 70/70, typecheck clean, `bun test` 30/30. |
| 04 | Done | 2026-11-07 | Ten skills carry the guidelines line; profiles rewritten (finance ideas 50→46, tech 50→48, guru and neuro ideas cleaned); docs attest lists include `islamic`. Coordinator spot-checked scope and wording. Open: `docs/motion-dictionary.md` presenter camera moves (folded into 05). |
| 05 | Done | 2026-11-07 | Observer figure replaced by a marker; example short re-rendered (storyboard checked, no figure); renderer build and demo workspace regenerated clean; `docs/islamic-compliance-audit.md` and one consolidated tracker entry written. Refusals verified (music, `ding`, `sfx fetch vine-boom`; approval refusal by unit tests). No approval recorded; nothing committed. |
| 06 | Not started | | |
| 07 | Not started | | |
| 08 | Not started | | |
| 09 | Not started | | |
| 10 | Not started | | |
| 11 | Not started | | |
| 12 | Not started | | |
| 13 | Not started | | |
| 14 | Not started | | |
| 15 | Not started | | |
