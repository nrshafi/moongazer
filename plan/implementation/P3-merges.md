# P3 — Merge four apps into their hosts (two-step)

**Branch:** `phase-3-merges` · **Target:** step A 28 Nov–6 Dec 2026 (R3); step B on or after R3 + 14 days (≈20 Dec) · **Depends on:** P2 merged
**Goal:** twenty apps become sixteen stronger ones without losing any URL or any visitor's saved items (D19).
**Background:** `plan/REPORT.md` §A5; D19 in `00-INDEX.md`.

| From (host) | Into (host → route) | Moves |
| --- | --- | --- |
| `quran-concept-atlas` (`/topic/<id>/`) | `quran-connections` → `/themes/<id>/` (Ayah Threads "Theme library") | 30 theme pages |
| `islamic-history-timeline-challenge` (`/`) | `interactive-seerah-timeline` → `/challenge/` ("Which came first?") | 12 four-card packs and engine; events referenced by id |
| `halal-business-decisions` (`/case/<id>/`) | `everyday-akhlaq-simulator` → `/business/<id>/` (Business track) | 12 cases, unified with the scenario engine |
| `islamic-misinformation-casebook` (`/case/<id>/`) | `is-this-actually-in-the-quran` → `/claims/<id>/` ("Common claims") | 12 cases rebuilt as neutral claims |

Saved-data inventory (11 Nov): Concept Atlas `bookmarks`; Timeline Challenge `progress`; Halal Business `bookmarks`, `remember`, `case-<id>`; Casebook `bookmarks`. All use `<slug>:<key>` with `{at,value}`. `theme` (light/dark) is not migrated.

## Step A — build sections and ship the "moved" release

### T3.1 Context first
Lane: shared · Files: `context/architecture.md`, `context/project-overview.md`, each receiving app's `context/`
Steps: document the two-step merge (D19), the import-fragment protocol (T3.2), the receiving routes, the retired-app flag (T3.8), and the redirect method (T3.11). Mark the four apps "merging into …" in the overview table.

### T3.2 Import-fragment protocol (copied into each receiving app)
Lane: app (4 receiving apps; write once in one app, copy) · Files: `apps/<receiver>/src/lib/import.ts` (new), `tests/import.test.ts`
Protocol:
- Old app builds a URL `https://<receiver-host>/<route>#import=<payload>` where payload is base64url of `{"v":1,"from":"<old-slug>","items":{"<oldKey>":<value>}}`, max 1,800 characters.
- Receiver on load: if `location.hash` starts with `#import=`, decode, `JSON.parse` inside try/catch, check `v===1`, `from` in an allowlist, each key in an allowlist for that `from`, each value passes the same validator the old app used. Map to receiver keys (table below), merge with existing values (union for bookmark lists; keep existing progress if newer), write with `write()`, then `history.replaceState(null,'',location.pathname+location.search)` and announce "Saved items moved: N".
- Never `eval`, never put payload text into `innerHTML`.

| From key | Receiver key |
| --- | --- |
| atlas `bookmarks` (theme ids) | quran-connections `theme-bookmarks` |
| challenge `progress` | seerah-timeline `challenge-progress` |
| halal `bookmarks` (case ids) | akhlaq `business-bookmarks` |
| halal `remember`, `case-<id>` | akhlaq `remember`, `business-<id>` (validate against the unified engine's trail shape) |
| casebook `bookmarks` (case ids) | is-it-in-the-quran `claim-bookmarks` (map old case ids to new claim ids via T3.6's id map) |

Acceptance: tests cover valid payload, wrong version, unknown key, oversize payload, malformed base64, and merge with existing data; storage blocked does not throw.
Verify: V1.

### T3.3 Ayah Threads: Theme library
Lane: app:`quran-connections` · Depends on: T3.2 · Files: `src/data/themes.json` (new, copied with provenance from `quran-concept-atlas/src/data/content.json`), `src/pages/themes/index.astro`, `src/pages/themes/[id].astro`, `src/lib/*`, `src/data/seo.json`, sitemap, tests
Steps:
1. Copy the 30 themes with their passages exactly (canonical records keep `{ref, arabic, translation}`) into a `themes` array inside `src/data/content.json`, so the existing verifier checks their text and hash; record provenance in `provenance.json` and update `appContentSha256`. (The static verifier only checks `content.json` and `corpus.json`; do not create a separate data file for canonical text.)
2. A theme page shows passages and "Solve this thread →" until the visitor solves or reveals the matching puzzle (local state); then it shows the explanation and the tafsir link. Without JS, show the explanation inside a closed `<details>` labelled as a spoiler (crawlable, not visible by default).
3. Drop the mechanical "connected readings" (first four in the category). Authored relationships come later.
4. Theme library index shows "N of 30 themes" from local solved state.
5. SEO: titles `Theme title | Ayah Threads`, descriptions that do not contain the explanation; add to sitemap.
Acceptance: 30 theme routes build; no answer visible before solving (JS on) or without opening `<details>` (JS off); V5 passes.
Verify: V1, V5, V6, V7.

### T3.4 Seerah Timeline: "Which came first?"
Lane: app:`interactive-seerah-timeline` · Depends on: T3.2 · Files: `src/pages/challenge/index.astro`, `src/lib/challenge.ts` (port the engine from `islamic-history-timeline-challenge/src/lib/engine.ts` and `app.ts`), `src/data/content.json` (add `packs` referencing event ids), tests
Steps:
1. Map the challenge's 14 events to the timeline's existing event ids; do not duplicate events. If an event has no match, stop and report.
2. Port the 12 packs; fix pack titles that don't match their contents. Hide source clues behind "Open source clue" until requested (Verify_Me).
3. Keep keyboard ↑/↓ controls; add pointer drag only if trivial, otherwise leave for later.
4. Apply the "later" descriptor from P2 now: "The Prophet's life ﷺ from 610 to 632, with a "Which came first?" game".
Acceptance: all 12 packs playable, graded correctly (port the old tests), progress saved under `challenge-progress`.
Verify: V1, V5, V6, V7.

### T3.5 Everyday Akhlaq: Business track
Lane: app:`everyday-akhlaq-simulator` · Depends on: T3.2, P1 T1.7/T1.12 · Files: `src/data/content.json` (add `track` to scenarios; add 12 business cases converted to the scenario shape), `src/pages/business/index.astro`, `src/pages/business/[id].astro`, `src/lib/scenario.ts`, tests
Steps:
1. Convert the 12 Halal Business cases into the scenario data shape (setup → scene, choices → options with `constructive`, repairs → options2). Keep all sources and quotations exact.
2. Replace the duplicate "friendly loan with no record" business case with a commercial case (supplier credit or partnership) only in C15; for now keep it and note the duplication in the tracker.
3. Add track tabs: Home & family, Study & work, Business (Friends & online comes in C15). Real branching comes in C15.
4. Apply the "later" descriptor: "Character and halal business dilemmas: choose, then read the sources".
Acceptance: `/business/<id>/` for 12 cases; options shuffled; constructive feedback works; 32 scenarios total.
Verify: V1, V5, V6, V7.

### T3.6 Is It in the Quran?: Common claims
Lane: app:`is-this-actually-in-the-quran` + content · Depends on: T3.2 · Files: a `claims` array in `src/data/content.json` (so the static verifier checks its canonical text), `src/pages/claims/index.astro`, `src/pages/claims/[id].astro`, `src/lib/claims.ts`, tests, `_implementation/research/merges/casebook-claims.json`
Steps:
1. Rebuild the 12 casebook cases as claims people actually make, with a neutral question title (no verdict in title, URL or meta description), the evidence (exact Quran text from the corpus; hadith by collection and number with sunnah.com link), a one-line verdict revealed only after the reader chooses, and "How to check it yourself".
2. Verdict categories: "In the Quran (exact ayah)", "A hadith, not the Quran", "A paraphrase of an ayah", "Not found in the Quran". Never claim absence beyond "not found by search in the Pickthall/Arabic corpus".
3. Keep an id map old case id → new claim id (used by T3.2 and the redirect map).
4. Search results link to a matching claim page when one exists.
5. Apply the "later" descriptor: "Search every ayah in Arabic and English, and check popular claims".
6. Run a C-track second-pass verification on these 12 claims (see `C-content-track.md` §3) before merge.
Acceptance: 12 claim routes; verdict hidden until choice; no verdict in titles/metas; verification record exists.
Verify: V1, V5, V6, V7.

### T3.7 "Moved" release of the four old apps
Lane: app (4 old apps) · Depends on: T3.3–T3.6 · Files per old app: `src/pages/*.astro`, `src/lib/moved.ts` (new), `src/data/seo.json`
Steps:
1. Every page shows a top banner: "{Old name} is now part of {Receiver name}. Your saved items can move with you." with a primary button "Open in {Receiver name} →" that links to the mapped new URL of the current page (T3.8 map) and appends `#import=<payload>` built from this app's saved keys (T3.2). If nothing is saved, link without the fragment.
2. Each page's `<link rel="canonical">` points to the mapped new URL (cross-host canonical). Keep pages working otherwise.
3. Keep the old app's sitemap until step B so crawlers can see the new canonicals.
Acceptance: with saved bookmarks present, clicking the button lands on the receiver with the items imported (test end to end on preview ports); with storage blocked, the button still opens the new page.
Verify: V1, V6, V7 (cross-port import test: old app on its preview port, receiver on its port; the payload must not depend on origin).

### T3.8 Redirect map, retired flag and directory
Lane: shared · Depends on: T3.3–T3.6 · Files: `deployment/merge-redirects.json` (new), `deployment/targets.json`, `homepage/*`, `_implementation/verify.ts`, `deployment/deploy-ci.mjs`, `deployment/verify-live.mjs`, `deployment/verify-seo.py`
Steps:
1. `merge-redirects.json`: for each old host, every built path (`/`, each detail route, `/sources/`, `/privacy/`, `/sitemap.xml`, unknown paths) → absolute new URL. Generate the list from the old apps' `dist/` so nothing is missed.
2. `targets.json`: add `"retired": "<receiver-slug>"` to the four old apps. Directory rendering skips retired apps (16 cards; update hero count and copy to "16 free apps" truthfully). Deployment still deploys retired apps in step A.
3. Update subject guides in `homepage/collections.json` to point at the receiving routes.
4. Write `_implementation/test-redirect-map.ts`: checks every old built path has a mapping, every target path exists in the receiver's `dist/`.
Acceptance: map test passes; directory shows 16 apps.
Verify: V4, V6, map test.

### T3.9 Phase verification and R3 notes
Lane: shared · Depends on: T3.1–T3.8
V2–V7; `releases/R3.md` including the date R3 goes live (owner fills) and the earliest step-B date (R3 + 14 days).

### T3.10 Release R3
Lane: deploy (owner). As T1.21. Record the go-live date in `releases/R3.md` and `00-INDEX.md`.

## Step B — permanent redirects (no sooner than R3 + 14 days)

### T3.11 Prepare redirect-only builds
Lane: shared · Depends on: R3 live ≥ 14 days
Preferred method: keep each old Pages project and redeploy it with a redirect-only output: a `_redirects` file with path rules and absolute destinations (for example `/case/* https://everyday-akhlaq-simulator.moongazer.tech/business/:splat 301`), plus `/* https://<receiver>/ 301` last. Before using it, verify in Cloudflare's current Pages `_redirects` documentation that absolute destination URLs and splats are supported and record the URL in `context/architecture.md`. Fallback if not supported or limits are exceeded: zone Single Redirect rules (check the plan's rule limit first; the existing www→apex rule lives there).
Steps: add a `redirectOnly` build mode in deployment tooling for retired apps (output `_redirects`, `_headers`, a minimal `404.html` with a link to the receiver). Extend `test-redirect-map.ts` to check the generated `_redirects` covers the whole map.
Verify: local test with `bunx wrangler pages dev` on the redirect-only folder if available; otherwise rule-by-rule review.

### T3.12 Publish redirects and verify live
Lane: deploy (owner) · Steps: owner releases; then run a live check of every map entry (status 301 and `Location` exact). Record results in `deployment/evidence/` and `releases/R3b.md`.

### T3.13 Clean-up after verification
Lane: deploy (owner) + shared
1. Remove the four old sitemaps in Search Console (owner, manual).
2. Remove retired apps from `_implementation/verify.ts`, `verify-static.py` expectations, the SEO validator expectations and the directory catalog (keep them in deployment only as redirect-only projects). Keep the DNS records. Do not delete the Pages projects while they serve redirects.
3. Leave the old app source folders in place until after Ramadan to avoid churn; mark them retired at the top of their `AGENTS.md`. Deleting or archiving them is a P10 decision for the owner.
Verify: V2, V4, V5, V6 with the reduced app list.
