# P9 — Depth Gate audit, freeze release and burn-in

**Branch:** `phase-9-freeze` · **Target:** audit 9–14 Jan 2027; freeze release R8 on Friday 15 Jan 2027; burn-in to Ramadan (~8 Feb) and through Eid · **Depends on:** P1–P8 and all content batches merged
**Goal:** prove every app passes the Depth Gate, ship one stable release, then change nothing but allowed fixes (D6).

### T9.1 Gate audit script
Lane: shared · Files: `_implementation/depth-gate.ts` (new), output `_implementation/qa/depth-gate.json` (not committed) and a summary in `releases/R8.md`
For each live app (16 + Zakat): (1) open P1 items for the app = 0 (read from the tracker list in `releases/R1.md`–`R7.md`); app-specific `sources.astro` (no other app's subject words, checked with a per-app forbidden-word list); (2) first-control offset at 390 × 844 and 375 × 812 in both themes ≤ 600 px (from the browser run); (3) item count from `content.json` ≥ target in `00-INDEX.md` §4; (4) every item has a reference field (Quran ref or source URL), fiqh options name their school/standard. Also: every content batch has a passing `verification.json` and a spot-check record.
Acceptance: script prints pass/fail per app per criterion; all pass.

### T9.2 Full verification
Lane: shared · V2–V7 across all apps and the directory, including the full E2E journeys from `_implementation/qa/e2e/README.md` (normal and blocked storage), the text-join audit (P1 T1.17), the BDI audit (T1.19), redirect map test, and services smoke test against local Functions.

### T9.3 Freeze release R8
Lane: deploy (owner) · After T9.1–T9.2 pass: merge, push, verify live (`verify-live.mjs`, `verify-seo.py --live`), record in `releases/R8.md` and `deployment/status.json`. Tag the commit `freeze-1448` (owner).

### T9.4 Burn-in runbook (15 Jan → Eid)
Lane: owner + models on request. Allowed changes (D6): live defect fixes; verified content corrections from feedback; corrections-log entries; date flips (seasonal slot dates). Each change: branch `hotfix/<short>`, smallest diff, V1/V5/V6 for the app, owner releases.
Routine (owner, about twice a week): run `deployment/scripts/review-feedback.mjs list`; for each item verify against sources (a model may draft the check), publish corrections; run `counter-report.mjs` weekly; watch Search Console for errors.
Not allowed: new features, refactors, dependency changes, new routes, design changes.

### T9.5 Search Console findings note (early February 2027)
Lane: shared (documentation) · After ~90 days of data: write `plan/implementation/releases/search-console-2027-02.md` with top queries and pages, impressions, CTR and position as reported; no missing metric written as zero. Feeds P10 ordering and hostname decisions (REPORT §A4 rule 9).
