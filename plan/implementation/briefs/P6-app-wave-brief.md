# P6 per-app wave brief (T6.2–T6.5, T6.7, and C2/C3 where named)

You own the one app folder named in your prompt, plus the research and plan files your prompt names. Nothing else. In your worktree, first run `git checkout -b <your branch> phase-6-daily`.

## Read first (in order)

1. `plan/implementation/P6-daily-and-sharing.md`: the "Shared rules" and your task(s).
2. Root `DESIGN.md` (binding), then `apps/<slug>/DESIGN.md`.
3. `apps/<slug>/AGENTS.md` and `apps/<slug>/context/*.md`.
4. `apps/<slug>/src/lib/daily.ts` and `tests/daily.test.ts`: the shared daily module. Use it; do not edit it.
5. If your prompt includes a content item (C2 or C3), read `plan/implementation/C-content-track.md` §1–§2 as well.

## Fixed decisions (do not change)

- **Hosts (D2c).** The share text ends with the app's own host, for example `guess-the-surah.moongazer.tech`. Never use an apex short link such as `moongazer.tech/surah`; the P6 doc's examples predate D2c.
- **Selection.** `dailyIndex(n, bank.length, DAILY_SEED)` from `daily.ts`. Export `DAILY_SEED` (the constant in your prompt) and `BANK_VERSION = 1` from a small app module (for example `src/lib/daily-bank.ts`), together with a `dailyItem(n)` function that returns the item for puzzle `n`. Bank order is the data order in `content.json`. The directory (T6.6) imports these numbers, so keep the names exact.
- **Before the epoch.** `dayNumber()` returns 0 before `DAILY_EPOCH`. Show Practice by default, and in Daily show a single line: "The first daily puzzle opens on <epoch date>." Do not hide the Daily tab.
- **Same day, same puzzle.** After the visitor finishes today's puzzle, a reload shows the result, not a fresh puzzle. Store `{n, result}` with the existing `read('daily', validator)` / `write('daily', value)` helpers in `utils.ts`; they already prefix the app namespace, so pass the bare key. Storage may be blocked: the game must still work, with no streak and no saved result.
- **Streak.** Opt in with a checkbox, "Keep a streak on this device". Key `streak` (namespaced by `read`/`write`, validated with `isStreak`) via `updateStreak`. Show it in a line such as "Streak: 3 days (best 5)". Document the key in the drawer.
- **Share.** `shareText()` plus a Copy button and a WhatsApp link (`whatsappUrl`). Put them in the end-of-session block (`renderSessionEnd`). Each share test must call `assertNoAnswer` with the answer strings.
- **T6.7 reminder.** In the end-of-session block (or under the daily puzzle), add a "Remind me daily" control: an `<input type="time">` defaulting to 20:00 and a button that downloads `dailyReminderIcs({name, host, time, now: new Date()})` as `<slug>-daily.ics` (Blob + object URL, `text/calendar`). No permissions and no requests.
- **Counter.** Daily: item id `daily-<N>`. Practice: the existing item id.
- **Drawer.** The "How this works" drawer gets: what Daily is; that `#N` changes at local midnight, so two people in different time zones can be on different numbers; what is stored and under which keys; and that Practice is always available.
- **Layout.** The mode switch is a `role="tablist"` row of 44 px tabs, labelled with text: Daily · Practice (plus Juz in Guess the Surah). Show `#N` and today's local date beside the Daily title. The first control must stay ≤ 600 px at 390 × 844 and 375 × 812, and the phone hero ≤ 140 px. Use family tokens only (`--accent`, `--accent-ink`, `--on-accent`, `--tint`): no new colours. Correct and wrong states carry text.
- **Descriptor.** If your task changes the descriptor, keep it to one line of 12 words or fewer, and update `<meta name="description">` and the SEO config consistently.

## Rules

- Exact Quran text only. Never re-type or alter ayat; copy from `_implementation/research/quran-full.json` or Quran MCP (call `fetch_grounding_rules` first).
- Hadith are paraphrased, with collection and number.
- No new npm packages, no remote requests from the app, no sound, no images of people or animals.
- Keep honorifics, citations, SEO tags and every existing route. No answers in titles, URLs or meta descriptions.
- Shared files are off-limits, as in the P5 brief: `Shell.astro`, the CSS shared set, `shell.ts`, `utils.ts`, `seo.ts`, `counter.ts`, `session-end.ts`, `daily.ts`, the shared components, `404`, `privacy`, `sitemap`, `_headers` and fonts. If you need a shared change, stop and describe it in your reply.

## Verify

In the app:
- `bun install --frozen-lockfile` if `node_modules` is missing;
- `bun run check`: 0 errors;
- `bun run test`: all pass. Add tests for: daily selection is deterministic and matches `dailyItem`; the share text has no answer (`assertNoAnswer`); the before-epoch state; plus the task-specific tests your prompt names.
- `bun run build`.

From the repo root:
- `bun _implementation/sync-shared.ts --check` and `--check --set daily`: both identical;
- `python _implementation/verify-static.py` (needs the app's `dist`; other apps' `dist` may be missing in a worktree, so run its checks for your app, or build the others, and say which you did);
- `PYTHONIOENCODING=utf-8 python _implementation/audit-text-joins.py`: 0.

Browser:
- Start only your own app's preview server, on the port in your prompt: `bun --bun astro preview --host 127.0.0.1 --port <port>` in the app folder (the package script pins 4321). Other agents run in parallel, so do not run `_implementation/e2e-preview.ts`.
- Use `_implementation/browser-check.mjs` (read its exports first).
- Check 390 × 844, 375 × 812 and 1440 × 1000, light and dark: no horizontal scroll, no script errors, first control ≤ 600 px.
- To test the Daily path before the epoch, set the clock in the page with an `init` script that overrides `Date`, so it runs past `DAILY_EPOCH` (it is a placeholder: 2026-12-31).
- Play Daily to the end. Confirm: the end block appears, the share text has no answer, the WhatsApp href is encoded, the reload shows the saved result, and the .ics downloads. Then run once with `localStorage` throwing: the game still works.
- Stop the server.

## Context and commits

- Update `context/ui-context.md`, `context/architecture.md` and `context/progress-tracker.md` in the app. For the tracker timestamp use plain `date` in Git Bash, which already prints Asia/Dhaka time labelled BST. Do not add hours.
- Replace any first-screen numbers in the app's DESIGN.md with newly measured ones.
- Make modular commits. Subjects: `P6.<task>: <imperative summary>` for code, and `C<n>.<batch>: <summary>` for content (at most 10 items per content commit). Each gets a 1–2 line body. Do not push.

## Reply

- Commits.
- What changed, per task.
- The measured first-control top at 390 and 375, light and dark.
- Test, check and build results.
- Anything you could not do, and any shared change you need.
