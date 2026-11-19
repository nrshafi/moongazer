# Next steps (paused 20 November 2026, 02:17 Asia/Dhaka)

The owner paused work to save tokens. This file is the single place to resume from. Read it first, then `D-frontend-audit.md` (track D), `briefs/D-design-brief.md`, `briefs/P8-mastery-brief.md` and `C-content-track.md` §3.

**Working model** (owner, 20 Nov):
- The main agent orchestrates: briefs, review, merges, verification and release.
- Grok 4.7 through Cursor and Claude Haiku 5.5 implement.
- Second passes and re-checks run on Grok, a different model from the Haiku authors.
- T3 `delegate_task` targets:
  - Grok: `{providerInstanceId: "cursor", model: "grok-4.7"}`;
  - Haiku: `{providerInstanceId: "claudeAgent", model: "claude-haiku-5-5"}`.

## 1. Where things stand

**Production.** `main` and `origin/main` are at 8239f75 (R7D redesign plus Design.07), live and deployed. Two local plan commits on `main` are not pushed: 31ee0cf (D.01) and 209d851 (D.02). Push them with the next release.

**Release branch `r8`** (worktree `.claude/worktrees/r8`, head 43c47a7) is the base for everything below. It contains:
- **P8 Diagnostic Mastery Loop** in four apps (from `phase-8-int`):
  - **Salah:** `/course/`, lesson pages and a pocket card.
  - **Stories:** a loop per prophet, the "N of 25 mastered" count and an order toggle.
  - **Why It Was Revealed:** `/check/<id>/`.
  - **Everyday Akhlaq:** `/check/<track>/`.
  - **Shared:** one "Remember my progress on this device" opt-in (`src/lib/remember.ts`) and no double counting.
  - **Gate on `phase-8-int`:** check, test (668) and build pass for 17/17 apps; sync, static and text-join checks show 0.
- **Content banks, final:** C9 (Why It Was Revealed) and C15 (Akhlaq).
  - **C15:** re-check 35/36, then the orchestrator fixed `home-q3v` (C15.04).
  - **C9:** re-check 7/10, then the orchestrator fixed three variant keys (C9.04).
  - Neither orchestrator fix has had a fresh Grok confirmation. Say so in the release note, or run a one-item re-check.
- **Content banks, not final:** the C13 (Salah) and C6 (Stories) banks in `r8` are older versions. See §2.
- **D1 shared design system** (branch `design-system`, b319277):
  - **Shared files:** canonical `global.css` and `shell.ts` added to `SHARED`.
  - **Look:** Illuminated Parchment light and Moongazer Night dark tokens; a framed night hero with the full-colour arch; Newsreader headings; the accent focus ring.
  - **Controls:** an A−/A+ Arabic size control.
  - **Clean-up:** the motif masks are removed and the "How this works" copy is shorter.
  - **Gate on that branch:** check, test (548) and build pass; contrast 0 failures; first screen 102/102.

**Worktrees created for the next packages.** These are empty and exactly at `r8`: `d1-polish`, `d2-games`, `d3-maps`, `d3-reading`, `d4-practical`. The workers were cancelled before committing anything.

## 2. Content track: finish the two open banks

The re-check loop is: author fixes on the content branch → fresh Grok re-check on the `-verify` branch, after `git merge content-cN` → repeat until all records pass → agent spot-check → merge into `r8`.

### C13 Salah (`content-c13`, worktree `agent-a61a6eb931b6a4590`, head b0fc7e0)

- **History:** second pass 16/30, then re-checks of 1/15 and 8/15. Round 3 of fixes (C13.06 and C13.06a) is committed.
- **Next:** run "re-check round 3" on Grok in worktree `c13-verify` (branch `content-c13-verify`, already merged up to b0fc7e0). It was cancelled before it ran. Output goes to `understand-your-salah.recheck3.json`. It also confirms Bukhari 757 (recitation right after the takbir) and Muslim 431 (salam to the right, then the left).
- **Open:**
  - closing-salam q-2 and q-3 cite the alifta edition, while q-1 cites sunnah.com. Decide whether to unify.
  - Per-ayah Al-Fatiha audio cuts and the missing phrases remain C13 backlog. The Salah descriptor change (T8.4 step 4) waits for C13 to be complete.

### C6 Stories (`content-c6`, worktree `agent-ab6997d795771938c`, head 21bb08f)

- **History:** second pass 0/25, then a fresh re-check of 6/25 (`stories-of-the-prophets.recheck.json` on `content-c6-verify`).
- **Uncommitted partial work:** C6.07 (the Haiku fix round) was cancelled mid-task. It leaves uncommitted edits to the research bank and `content.json`.
  - Either review the edits and finish them, or discard them with `git checkout -- .` in that worktree and rerun C6.07.
- **C6.07 scope:**
  - **Absurd distractors:** replace about 45 (gold, sea, valley, camel, horses, ants and similar). Each new distractor must be a plausible misreading taken from that prophet's own readings.
  - **Focus-line spoilers** (7): ibrahim-q3v, lut-q3, yusuf-q3, shuayb-q1, musa-q2, dawud-q3 and sulayman-q1. Also drop "wisdom" from Sulayman's focus line.
  - **Card claims** (3):
    - Ismail c2: restore "enjoined worship and almsgiving" (19:55).
    - Dhul-Kifl c3: restore "brought into His mercy" (21:86).
    - Lut c2: remove "warned", which is from 26:173.
  - **Script check:** the worker must write a script that flags any distractor noun not found in that prophet's readings.
- Then run a fresh Grok re-check in worktree `c6-verify`.

### Orchestrator rulings already given (binding for re-checks)

- Several diagnostic questions may share one concept and its single card. The P8 data contract allows this.
- **Absurd distractors fail.** A distractor must be a plausible misreading.
- **Text printed above the loop.** Text there that selects an answer is a fail. That text is:
  - the Salah lesson title and area label;
  - the Stories name, category and focus line.
- **Why It Was Revealed.** The loop runs on `/check/<id>/`, which shows only the title. Questions that recall the reading or its limits are allowed. Do not add hadith details the app does not print.
- **Al-Yasa** may have a two-question diagnostic.
- **Stories variants.** A variant whose key is a short Quran phrase shown on its card is a note, not a fail. It fails only if the card's editorial title or body states the answer.

After both banks pass, spot-check a sample of each (D2b) and record the counts in the C-track table (C6, C9, C13, C15). Then merge `content-c13` and `content-c6` into `r8`. Expect the usual union conflicts in the per-app `context/progress-tracker.md`.

## 3. Design track D: remaining packages

Every worker branches from `r8` in its prepared worktree and follows `briefs/D-design-brief.md`. Only D1b may edit shared files; the others list any shared change they need. Each reports the gate results and screenshots under `_implementation/screens/<wp>/`.

| WP | Worktree / branch | Model | Scope |
| --- | --- | --- | --- |
| D1b | `d1-polish` | Grok | **Desktop hero:** ≤ ~300 px, art vertically centred and larger, text centred on the left. **Phone header:** one row ≤ 56 px at 375–390 px; the A−/A+ in the header causes the wrap, so make it a single "Aa" cycle button or an inline control. **Mastery loop:** crafted shared styling for `mastery__*` in the `refinement.css` mastery block (steps, tactile option states that never rely on colour alone, manuscript cards using `.passage-frame`, result panel); remove the temporary `mastery__*` rules in Salah `app.css`. **`.passage-frame`:** apply it in shared components and document the markup in DESIGN.md. **Runtime text joins:** check the loop in headless Chrome and fix any in `mastery-ui.ts` (mastery set). **Gate:** the full gate. |
| D2 | `d2-games` | Grok | Audit Prompt 3 for guess-the-surah, ayah-threads, word-groups and quran-escape-room. |
| D3a | `d3-maps` | Haiku | Prompt 4 item 3 for places-in-the-quran, civilization-timeline and seerah-timeline: map contrast in both themes, pins and legend, gilded timeline spine, sticky or bottom-sheet inspector. |
| D3b | `d3-reading` | Haiku | Prompt 4 items 1, 2 and 4. **Salah:** speed pills, repeat toggle, posture pills. **Stories:** category pills. **Parables:** path connectors, journal card. **Why It Was Revealed:** two-column dossier. **Is It in the Quran:** hero search with chips and a safe `<mark>` highlighter with a test. Already done on `r8`, so do not redo: Salah truncation, Al-Fatiha banner, Stories quiz and order toggle, Why `/check/`. |
| D4 | `d4-practical` | Haiku | Prompt 5. **Hifz Planner:** single stepper, picker, curve. **Zakat Calculator:** steps, currency prefix, radio cards, printable result; never touch the calculation. **Everyday Akhlaq:** segmented tabs, done badges, story card, decision cards. **Family Halaqa:** badges, worksheet cards. |
| D5 | new worktree from `r8` after D1b–D4 merge | Grok builds, orchestrator verifies | Prompt 6: homepage alignment (`homepage/`), then the full QA gate. |

D1b should land first, or at least before D3b, D4 and the mastery pages are reviewed visually, because it restyles the loop those apps show. D2, D3a, D3b and D4 touch disjoint apps, so they can run in parallel.

## 4. Release R8 (P8 + D track)

1. Merge into `r8`: D1b, D2, D3a, D3b, D4, then the final C13 and C6 banks, then D5.
2. **Gate on `r8`.**
   - **Setup:** install deps in every app first.
   - **Commands:** `sync-shared --check` (plus `--set mastery` and `--set daily`), `verify.ts check/test/build`, `verify-static.py`, `PYTHONIOENCODING=utf-8 python _implementation/audit-text-joins.py --summary` and `--bdi`, `contrast.py`, and `first-screen-check.mjs` against `e2e-preview.ts`. Then `node homepage/build.mjs`, `bun test homepage/tests` and `bun test _implementation/seo.test.ts`.
   - **Watch:** `audit-text-joins.py` needs `PYTHONIOENCODING=utf-8` on Windows. `verify.ts` has no per-app filter.
3. **T8.8 browser verification** (not yet done anywhere for all four apps):
   - the loop by keyboard;
   - light and dark themes, at 390 and 1440 px;
   - storage blocked;
   - opt-in on and off;
   - the "N of 25 mastered" count;
   - runtime text joins.
4. **Docs.**
   - **Release note:** write `releases/R8.md` with the agent-made decisions (D2b). It must:
     - list the orchestrator content fixes that had no fresh re-check (C15.04, C9.04, and C13.06a if round 3 does not cover it);
     - claim no scholarly review.
   - **Tables:** update `C-content-track.md` rows C6, C9, C13 and C15 and the `00-INDEX.md` phase table.
   - **Tracker:** add a `context/progress-tracker.md` entry, timestamped with plain `date` in Git Bash.
5. **Ship.**
   - Fast-forward or merge `r8` into `main` and push. A push deploys through GitHub Actions; watch the run.
   - Smoke-test live: the apex, a few app hosts, the four mastery routes and `/art/*.svg`.
   - Push includes the two local plan commits.

## 5. After R8 (backlog, unchanged)

**Content:**
- C4 Escape Room Ramadan rooms;
- C5, C7, C8, C11, C12;
- C9 +20 readings;
- C15 branching (`options2ByFirst`) and the optional Friends track;
- C13 audio cuts and the remaining phrases.

**Platform and admin:**
- remove the 21 retired-host sitemaps from Search Console;
- per-app DESIGN.md measured numbers;
- P9 (gate, audit and freeze, before 15 January 2027) and P10 (after Ramadan).

**Clean-up:** remove merged worktrees and branches (`design-night`, `phase-8-*`, `worktree-agent-*`, `content-*-verify` after merge) with `git worktree remove`, then delete the branches.

## 6. Standing rules (unchanged)

- **Content:** Quran text is exact and canonical, copied by script from `_implementation/research/quran-full.json` and never typed. Hadith are paraphrased with collection and number. Honorifics follow the house style: "(peace be upon him)" after prophets and ﷺ for the Prophet Muhammad.
- **Media and privacy:** no images of people or animals. No music or sound. No third-party scripts. Never claim scholarly review. Keep the owner's email private and never print secrets or tokens.
- **Dates:** plain `date` in Git Bash prints Dhaka time; do not adjust it.
- **Git:** modular commits with one- or two-line bodies.
