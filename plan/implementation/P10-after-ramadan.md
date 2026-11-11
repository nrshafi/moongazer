# P10 — After Ramadan (from about mid-March 2027)

**Order (D25):** 1. new apps → 2. Bangla edition → 3. platform. Each item gets a detailed task file (same format as P1–P9) written at its start, using the then-current code. This page fixes scope and constraints so that planning is quick.
**Before starting:** read the Search Console note (P9 T9.5) and the feedback/counter data; the owner may reorder within a group.

## 10.0 Housekeeping
- Decide (owner) whether to archive the four retired app source folders; if yes, move to `apps/_retired/` and remove from tooling.
- Post-Ramadan depth stretch items deferred from P1–P8 (for example Ayah Threads → 90 puzzles, claims → 100, prophet chapters, Seerah Timeline authored connections and people index, CC0 images, Akhlaq "Friends & online", Word Groups 60 groups/100 boards, Escape Room hint cost and certificate).
- A modern English translation: research task only (Verify_Me). List Quran MCP translation editions with `list_editions`, record each licence, adopt one only if its licence allows redistribution in this product; owner decides.

## 10.1 New apps (each passes the Depth Gate at launch)
Common setup: same as P7 T7.5 (pins, port 4342+, AGENTS.md, six context files, DESIGN.md, glyph-only logo, registration as P7 T7.7, production as P7 T7.8). Review rule D9 applies.
1. **Quran Words** (`quran-words`, Sanctuary, teal). Licensing first: the Quranic Arabic Corpus morphology data is GPL; decide compatibility or build an own frequency list from the canonical text via Quran MCP (`fetch_word_morphology`, `fetch_word_concordance`), record the licence decision in context before building. Spaced repetition (pure tested module), daily five-minute goal, export/import backup file. Gate: the top N frequency words covering a documented share of the Quran's words (owner sets N, at least 300), each meaning sourced and second-pass verified.
2. **Names of Allah** (`names-of-allah`, Scriptoria, blue). Each name with Arabic, meaning, and Quran occurrences from the canonical corpus (exact). Present the enumerated-99 question honestly (sourced). Flashcards, reflection prompt, family activity. No audio unless licensed. Gate: every name in the documented list used, each with ≥1 Quran occurrence or an explicit sourced note.
3. **Alif Ba** (`alif-ba`, Sanctuary, teal). 28 letters, positional forms, harakat, sukun, shadda, joining, simple Quran words (exact text); tracing on `<canvas>` (pointer and touch); recognition game; per-letter progress. **Audio and pronunciation guidance wait for a recorded or licensed source (D9).** Gate: all 28 letters with all forms.
After each: directory count and copy, subject guides, short links (`/words`, `/names`, `/alif-ba`).

## 10.2 Bangla edition
1. Architecture decision recorded first in `context/architecture.md` and `ui-context.md`: `/bn/` routes inside each app via Astro i18n routing at the installed version (check docs), language switch, a locally hosted Bangla font with licence, `hreflang` and canonical rules.
2. Translation rights: list Bangla Quran translations available in Quran MCP and their licences; use one only if the licence permits; record edition and rights notice.
3. Start with five apps: Guess the Surah, Understand Your Salah, Stories of the Prophets, Family Halaqa, Is It in the Quran? (Bangla translation search).
4. UI strings and editorial text translated by a fluent Bangla speaker the owner names; no machine-only translation of religious explanations; record who translated (internal record; public credit only with consent).
5. Directory Bangla landing page.

## 10.3 Platform
1. **Zero-account backup code** (DNA §3 step 2): per app "Back up my progress" → downloads a JSON file (or copyable code) of that app's namespaced keys; "Restore" imports with the same validators (reuse P3 import protocol). Before accounts are ever considered.
2. **Install and offline:** per-app `manifest.webmanifest` and a scoped service worker; versioned cache per build; Is It in the Quran? corpus cached on first search; context update first (caching vs current headers).
3. **Cross-app streak:** opt-in first-party cookie `mg_streak` on `Domain=moongazer.tech` holding only `{last,count,best}`, `SameSite=Lax; Secure; Max-Age=2592000`; privacy copy updated first; off switch in every app.
4. **Teachers page** `/teachers/`: which app fits which lesson, projector mode, printable packs, parent message, build-time QR codes (local generator; any new dependency needs owner approval).
5. **Accounts:** only if feedback shows clear demand for cross-device sync (DNA §3 step 3); requires its own decision interview (auth method: email code vs passkey vs sync key).
