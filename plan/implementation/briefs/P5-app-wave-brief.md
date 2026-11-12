# P5 per-app wave brief (T5.7 content, T5.8 wiring, T5.11, T5.12 buttons, T5.14)

You own the app folders listed in your prompt and nothing else. In your worktree, first run `git checkout -b <your branch> phase-5-shell`.

## Read first (in order)

1. Root `DESIGN.md`, which is binding.
2. Your app's `apps/<slug>/DESIGN.md`. It already lists the drawer content, end-of-session lines, motif, print and projector decisions, and Verify_Me items.
3. `plan/implementation/P5-shell-design-directory.md`, tasks T5.7, T5.8, T5.11, T5.12 and T5.14.
4. The app's `AGENTS.md` and `context/*.md`.

## Shared pieces (already built; use them, do not edit them)

- **Drawer.** `src/components/HowItWorks.astro` is a `<details class="how-it-works">`. Put it first inside `.sidebar`, which gives top-of-sidebar on desktop and right after the activity on phones.
- **End of session.** `src/lib/session-end.ts` exports `renderSessionEnd`. Read its signature and tests. Use it when an activity ends. The share text must never contain the answer.
- **Pulse.** `pulseCorrect(el)` in `src/lib/utils.ts`. Call it on a correct answer.
- **Projector.** Put `data-projector` on `<main>` or `<body>` in the pages that get Projector. Shell then renders the toggle.
- **Feedback link.** `<Feedback compact />` or the `feedback-link` anchor to `#site-feedback`.
- **Counter.** Keep the existing `track()` calls working.
- **Fonts.** `.mono-chip` uses JetBrains Mono, and only Playboard and Dossier apps have that font.

Shared files are off-limits:
- `Shell.astro`, `refinement.css`, `global.css`, `shell.ts`, `utils.ts`, `seo.ts`, `counter.ts` and `session-end.ts`;
- `Feedback.astro`, `HowItWorks.astro`, `LearningGuide.astro` and `Honorific.astro`;
- `404.astro`, `privacy.astro`, `sitemap.xml.ts`, `public/_headers` and `public/fonts/*`.

If you need a shared change, stop and describe it in your reply. Put app-only CSS in the app's own stylesheet; create `src/styles/app.css` if there is none.

## Tasks per app

1. **T5.7.** Move every notice, caveat and instruction that sits above the first control into `<HowItWorks>`. Do not delete any limit; where the same limit appears twice on a page, keep the clearer one. List any removed duplicates in the app's progress tracker.
2. **T5.6 per-app markup.**
   - The hero H1 is the app name.
   - The descriptor is one line of 12 words or fewer.
   - Remove any per-app dash-eyebrow.
   - An optional count chip is allowed, for example "30 themes".
3. **T5.8.** At the end of each activity, show the end-of-session block: result, then "What you learned" (1–3 lines with references), then share, then the next app, then "Report an error". Take the recommended next app from `src/data/learning.json` related apps. Use the new hosts from `deployment/targets.json`.
4. **T5.11.** Create `public/motif.svg`: decorative, `aria-hidden="true"`, ≤ 8 KB, line art in `currentColor` or family tokens.
   - Draw it as described in the app's DESIGN.md. Use geometry, objects, plants or sky only, **never people or animals**.
   - Show it in the hero on desktop; hide it, or reduce it to a small corner mark, below 580 px.
5. **T5.12.**
   - **Print button** (`window.print()`) on the pages DESIGN.md names. Family Halaqa also gets "Print saved packs" on its library page.
   - **Projector:** add `data-projector` where DESIGN.md says yes.
6. **T5.14. First screen.** Apply the archetype layout and the Verify_Me items from DESIGN.md.
   - Measure the top of the first interactive control or activity card at 390 × 844 and 375 × 812, in light and dark, with `_implementation/browser-check.mjs`.
   - It must be ≤ 600 px.
   - Write the measured numbers into the app's DESIGN.md, replacing `_pending (T5.14)_`.
7. **Small fixes named in your prompt.**
8. **Context.** Update the app's `context/ui-context.md` and `context/architecture.md` where behaviour changed. Add one `context/progress-tracker.md` entry per app.
   - For the timestamp, use plain `date` in Git Bash (it already prints Asia/Dhaka time, labelled BST) or PowerShell `Get-Date -Format o`. Do not add hours.

## Rules

- Exact Quran text only: never re-type or alter ayat.
- Keep honorifics, source citations, SEO tags and every existing route.
- No new npm packages, no remote requests, no sound, no images of people or animals.
- Touch targets must be ≥ 44 px, with visible focus.
- Correct and incorrect states must carry text, not only colour.

## Verify, for each app

- `bun run check`: 0 errors.
- `bun run test`: all pass. Update tests that assert moved markup. Never weaken an assertion about content correctness.
- `bun run build`.

Then, from the repo root:
- `bun _implementation/sync-shared.ts --check`, which must be unchanged;
- `python _implementation/verify-static.py`;
- `PYTHONIOENCODING=utf-8 python _implementation/audit-text-joins.py`, which must report 0.

Browser checks:
- Start `bun _implementation/e2e-preview.ts`; ports are in `_implementation/qa/e2e/origins.json`.
- Check 390 × 844, 375 × 812 and 1440 × 1000, in light and dark.
- Confirm: no horizontal scroll, no script errors, and the first control ≤ 600 px. Then play one activity to its end and confirm the end-of-session block appears and its share text contains no answer.
- Stop the server when done.

## Commits

Make modular commits per app, for example:
- `P5.14: <App> first screen and compact hero`
- `P5.7: <App> How this works drawer`
- `P5.8: <App> end of session`
- `P5.11: <App> motif`
- `P5.12: <App> print and projector`

Each gets a 1–2 line body. Do not push.

## Reply

- Commits.
- A per-app table: first-control top at 390 and 375, light and dark; tests; build.
- Anything you could not do.
- Any shared change you need.
