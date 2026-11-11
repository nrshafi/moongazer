# Handover protocol for implementing models

Every task in this folder assumes you follow this page. It is written for a model that sees only one task at a time.

## 1. Before you touch anything

1. Read, in order: root `AGENTS.md`; `context/project-dna.md`, `project-overview.md`, `architecture.md`, `ui-context.md`, `code-standards.md`, `ai-workflow-rules.md`, `progress-tracker.md` (the last ~150 lines are enough).
2. Read `plan/implementation/00-INDEX.md` sections 1, 3 and 4.
3. Read your phase file's introduction and **only your task**.
4. For every app your task touches: read `apps/<slug>/AGENTS.md`, its `context/` files and, after P5, its `DESIGN.md`.
5. Check the status table in `00-INDEX.md`. If your task's dependencies are not "Done", stop and report.

## 2. Branch and commit

```sh
git checkout main
git pull --ff-only   # only if the owner has a remote configured and asked you to; otherwise skip
git checkout -b phase-N-short-name     # or: git checkout phase-N-short-name   if it exists
# content track: content/<app-slug>
```

- One commit per task. Message: `P<N>.<task>: <imperative summary>` (for example `P1.4: stop Escape Room lock 1 matching the room title`). Content batches: `C<app-number>.<batch>: <summary>`.
- Never `git push`, never merge into `main`, never force anything. A push to `main` deploys production.
- Never commit generated output (`dist/`, `.astro/`, `node_modules/`, `_implementation/qa/` logs, `deployment/manifests/`).

## 3. Rules that override convenience

- **Sacred text.** Quran Arabic and Pickthall English come only from `_implementation/research/quran-full.json` or Quran MCP (`quran` server), copied exactly. Never retype, trim or "fix" canonical text. `python _implementation/verify-static.py` must pass.
- **Quran MCP use.** Call `fetch_grounding_rules` first and pass its nonce as instructed by the server. Record every tool call you rely on (tool, arguments, edition, date) in the research file your task names.
- **Hadith.** Name collection and number, check the wording/grading on sunnah.com, paraphrase in your own words unless the task says to quote; never paste a modern English translation wholesale.
- **No invention.** No invented citations, dates, statistics, reviewers, ratings or metrics. If a fact cannot be verified, leave it out and note it.
- **Aniconism and sound.** No images of people or animals (including icons, emoji faces, mascots). No music, instruments, bells or chimes.
- **Honorifics.** ﷺ after the Prophet Muhammad in editorial text (via the helper from P2); "(peace be upon him)" after other prophets on first mention per page. Never inside canonical quotations.
- **Privacy.** No third-party scripts, cookies, analytics, fonts or CDNs. Optional storage uses the existing `read`/`write`/`forget` helpers in `src/lib/utils.ts` (keys `<slug>:<key>`, `{at,value}`, 30-day expiry). Document every new key in the app's `context/architecture.md`.
- **Shared files.** If your task is in the app lane, do not edit any file listed in `00-INDEX.md` §3. If you need a shared change, stop and report it.
- **Dependencies.** Keep pins: Astro 7.4.2, Bun 1.4.4, TypeScript 6.0.3, @astrojs/check 0.9.12. Do not add packages unless the task says so. If the task introduces a new API pattern (for example Pages Functions, D1, `wrangler`), check the official docs or the installed types first and record the URL or command in the task's context update.
- **Generators.** Do not run the old one-time generators in `_implementation/` (`*-scaffold.py`, `*-pages.py`, `populate-context.py`, etc.). They overwrite hand-edited files.

## 4. Verification checklist

Run what your change affects. Report exactly what you ran and the result. Never claim a check you did not run.

| # | When | Command (run from repo root unless noted) |
| --- | --- | --- |
| V1 | Any app change | In `apps/<slug>/`: `bun install --frozen-lockfile`, `bun run check`, `bun test`, `bun run build` |
| V2 | Shared-file change or many apps | `bun _implementation/verify.ts check`, then `test`, then `build` |
| V3 | Shared-file change | `bun _implementation/sync-shared.ts --check` (exists after T1.1) |
| V4 | Directory change | `node homepage/build.mjs` |
| V5 | Any content or build change | `python _implementation/verify-static.py` (needs every app's `dist/`; run V2 build first) |
| V6 | Titles, metadata, routes, sitemaps | `bun test _implementation/seo.test.ts` and `python deployment/verify-seo.py` |
| V7 | UI or behaviour change | `bun _implementation/e2e-preview.ts` (serves builds on ports 5321–5340) and check the changed flow at 390 × 844 and 1440 × 1000, light and dark, and with storage blocked if storage is involved. Measure the first control's top offset on phone (must be ≤ 600 px after P5). |
| V8 | Services change (P4) | `bunx wrangler pages dev homepage/dist` with a local D1, plus the service tests the task names |

Windows: if native Astro tooling fails with a sandbox/thread error, retry the same command with `RAYON_NUM_THREADS=2`. Do not change machine settings.

## 5. Stop conditions (report instead of improvising)

Stop and write a short report in your final message, without committing partial work, if:

- the code does not match what the task describes (file moved, line different, behaviour already fixed);
- a source cannot be verified, or Quran MCP is unavailable for text you need;
- the task would require editing a shared file from the app lane, adding a dependency, or a production action;
- a verification fails and the fix is outside your task;
- the task conflicts with `00-INDEX.md` §1.

## 6. Recording

When your task is done and verified:

1. Commit (one commit for the task).
2. Add a short entry to the affected app's `context/progress-tracker.md` (app work) and to root `context/progress-tracker.md` (shared or multi-app work): Asia/Dhaka timestamp, task id, what changed, the exact checks run and results, anything not verified.
3. Update the status row in `00-INDEX.md` (phase row, or the per-app row in `C-content-track.md`).
4. Final message to the owner: task id, branch, commit hash, files changed, checks run with results, open issues.

## 7. Task format used in phase files

```
### T<phase>.<n> Title
Lane: shared | app:<slug> | content:<slug> | deploy (owner)
Depends on: task ids
Files: paths you will edit or create
Steps: numbered, concrete
Acceptance: observable conditions that must all be true
Verify: checklist items (V1–V8) plus task-specific tests
```

Tasks in lane **deploy (owner)** are production actions. A model may prepare commands, files and a checklist for them, but only the owner runs them or explicitly asks a model to run them.
