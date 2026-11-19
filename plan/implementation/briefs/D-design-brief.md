# D brief: frontend redesign workers (Grok 4.7, Haiku 5.5)

Read this brief, then `plan/implementation/D-frontend-audit.md`, both in full. Section 0 of the audit (the orchestrator notes) overrides the prompts wherever they differ. Then read `AGENTS.md`, `DESIGN.md` (§0 "a window into the night" first) and the target app's `DESIGN.md`.

## Who does what

- **Orchestrator.** The orchestrator (another agent) reviews your branch, merges it, verifies production and releases. Do not push, merge into `main`, deploy or touch Cloudflare.
- **Your work package.** You implement exactly the work package named in your task. Touch only the files it lists, plus `context/progress-tracker.md`; make one entry at the end.

## Git

- **Branch.** Work in the checkout you were given, on the branch named in your task (create it if it is missing). Never commit on `main`.
- **Commits.** One commit per coherent step, with a subject like `D1.03: canonical global.css in SHARED` and a one- or two-line body. Do not make one giant commit.
- **Commit the regenerated output.** After you edit a shared file in `apps/guess-the-surah/`, run `bun _implementation/sync-shared.ts --from guess-the-surah <path>`.
- **Dates.** Run plain `date` in Git Bash for the tracker timestamp. It prints Dhaka time labelled BST; do not adjust it.

## Project rules that override any prompt

- **Quran text and attribution.**
  - Quran Arabic and translations are canonical: never retype, trim or "fix" them.
  - Keep every source link, licence line, attribution, provenance checksum and "not a ruling / editorial" statement. You may move a caveat out of the play area, but it must stay visible on the page or in `/sources/`.
- **No people, animals or sound.** No images of people or animals in any medium. No music, chimes or sound effects.
- **No third-party resources.** No third-party scripts, CDNs, analytics or web fonts. The local fonts are DM Sans, Newsreader, Amiri and JetBrains Mono.
- **Accessibility.**
  - Text contrast meets WCAG AA; check new token pairs with `python _implementation/contrast.py` (update its table when you change tokens).
  - Colour is never the only signal.
  - Keyboard focus is visible.
  - `prefers-reduced-motion` stops all non-essential motion.
- **Storage.** Use the existing namespaced 30-day helper in each app, and only where an opt-in exists. A pure display preference (such as the Arabic size) may use `localStorage` in try/catch, with a working default when storage fails.
- **Do not change behaviour.** Keep the behaviour and the test contracts. Do not rename IDs or data attributes that scripts or tests read without updating those scripts and tests in the same commit.

## The art system (do not regenerate by hand)

- **Generator.** `_implementation/art/build-art.mjs` generates the per-app art (`public/favicon.svg`, `public/motif.svg` 480×300) and the homepage art. It also writes the block between `/* art:start` and `/* art:end */` in `apps/guess-the-surah/src/styles/refinement.css`. That block holds:
  - `--mg-pattern` per family;
  - `--mg-band` and `--mg-divider`;
  - `--mg-corner-{tl,tr,br,bl}`;
  - `--mg-star` and `--mg-hue`.

  Never hand-edit that block or the generated SVGs.
- **The redesign block.** `refinement.css` also has a hand-written `/* redesign:start … redesign:end */` block (night hero, header, panels, buttons, footer) and a mastery block.
  - You may restyle the redesign block.
  - Keep the night hero idea: each app's `.intro` is a lit night panel showing its arch scene.
- **Sharing.** `refinement.css` is shared; edit it only in `apps/guess-the-surah`, then sync it.

## Verification you must run before you report

From the repository root:

```sh
bun _implementation/sync-shared.ts --check
bun _implementation/verify.ts check
bun _implementation/verify.ts test
bun _implementation/verify.ts build
python _implementation/contrast.py
python _implementation/audit-text-joins.py --summary
```

For layout work, also run the built apps and measure them.
- **Serve:** `bun _implementation/e2e-preview.ts` serves every built app at config port + 1000; guess-the-surah, for example, is on 5341.
- **Measure:** `node _implementation/first-screen-check.mjs`. The gate is: phone hero ≤ 220 px, first control ≤ 600 px, no horizontal overflow at 375 px.
- **Screenshot:** use `_implementation/browser-check.mjs` (`launch()` then `page({width,height,dark,mobile})`) to capture at 390 px and 1440 px, in light and dark.
  - Save the screenshots under `_implementation/screens/<wp>/`; that folder is not committed.
  - Look at them, and fix what looks wrong before you report.

Your final message reports:
- the branch and its head commit;
- the commits;
- each command run, with pass/fail counts;
- the screenshot paths;
- anything skipped or not done, and why.

Do not claim a check you did not run.
