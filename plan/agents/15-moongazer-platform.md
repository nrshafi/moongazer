# Brief 15 — Moongazer: install, offline, cross-app streak, projector

> **Superseded (11 November 2026):** this file is background only. The authoritative execution plan is [`plan/implementation/00-INDEX.md`](../implementation/00-INDEX.md). Where they differ, the implementation plan wins.

**Repository:** `I:\Development\moongazer`
**Depends on:** 09 (daily games and per-app streaks). **Authorized:** ask the owner first. Parts 1 and 2 change storage and caching invariants.
**Goal:** let regular players install Moongazer apps, play offline, and keep one streak across apps, without accounts or a server.
**Background:** `../REPORT.md`, A10 items 3 and 6, A14 phase 4.

## Part 1 — Install and offline (architecture decision)

1. **Update context first.**
   - `context/architecture.md`: a per-app web-app manifest and a scoped service worker.
   - The caching interaction with the current headers: `no-transform`, immutable assets, and `must-revalidate` HTML.
   - Update rules: how a new deployment reaches installed users, for example a versioned cache name per build.
2. **Per app:**
   - A `manifest.webmanifest` with the app's name, short name, theme colour and local icons (no people or animals).
   - A service worker that precaches the app shell and its local data, serves cached pages offline, and clears old caches on activation.
   - CSP: confirm `worker-src` or `script-src 'self'` covers it, and record the documentation consulted.
3. **Large data:** Is It in the Quran?'s 3 MB corpus is cached on first search, not at install.
4. **Test:** offline play of a daily game; a new deployment replacing the cache; blocked storage; private windows.

## Part 2 — One streak across apps (storage decision)

1. **Update context first.** `context/architecture.md` (storage invariant) and the About and privacy copy: "If you turn on streaks, we keep one small cookie on moongazer.tech holding your last play date and streak count. No ID, no tracking, never sent anywhere."
   - The cookie is sent with requests to Moongazer hosts. That is acceptable only because it holds no identifier and the static host ignores it. Say so honestly.
2. **Mechanism.**
   - A first-party cookie `mg_streak` scoped to `Domain=moongazer.tech`, readable by every app subdomain in the browser.
   - Contents: `{last: "YYYY-MM-DD", count, best}`, with `SameSite=Lax`, `Secure` and a 30-day max age, refreshed on play.
   - Opt-in only, with an off switch in every app's storage dialog.
3. **Each daily game** updates it on completion, and the directory reads it to show "Day N".
4. **Tests:** parsing invalid cookies; date transitions; opt-out clearing; blocked cookies.

## Part 3 — Projector mode across apps

If brief 08 did not finish it, add the "Projector" toggle (larger text, simplified chrome, high contrast in both themes) to every app used in classrooms: Escape Room, Family Halaqa, Seerah Timeline, Stories of the Prophets, Word Groups and Guess the Surah.

## Verification

Use the checklist in `00-START-HERE.md`. Also test offline in the browser (devtools offline mode), install prompts on Android Chrome, and a second deployment replacing cached files. Run the storage-fault probes from the existing E2E tooling on ports 5321–5340.

Record tracker entries and update `00-START-HERE.md`. Do not push or publish without the owner's request.
