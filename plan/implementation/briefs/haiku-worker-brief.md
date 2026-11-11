# Brief for Haiku worker agents (worktree + modular commits)

You run in your own git worktree of the Moongazer repo (Windows; use the Bash tool with POSIX syntax; Bun 1.4.4, Node, Python 3.12 — set `PYTHONIOENCODING=utf-8` when Python prints). Other agents work in other worktrees at the same time.

## Git

1. First: `git switch -c <your-branch> phase-3-merges` (your branch name is in your task). Never touch `main`. Never push, rebase, reset --hard, stash or force anything.
2. **Modular commits.** One commit per logical change (a schema, a module + its tests, a page, a context update) — never one big commit for the whole task, never a commit that mixes unrelated files. Stage explicit paths (`git add <paths>`), never `git add -A` across the repo.
3. **Commit messages:**
   ```
   P<phase>.<task>: <imperative summary, max 72 chars>

   <1–3 lines: what changed and why; mention tests added>
   ```
   Example: `P4.3: add feedback and event validation module` / body: `Pure validators for the feedback form and the event beacon, with table-driven tests for every rule (honeypot, timing, allowlists, lengths).`
   Use `git commit -F <file>` or multiple `-m` flags for the body.
4. Before each commit run the checks that cover what you changed; do not commit failing code.
5. Do not commit generated output: `dist/`, `.astro/`, `node_modules/`, `.wrangler/`, `_implementation/qa/`, `deployment/evidence/`.

## Setup in a worktree

`node_modules` is not shared between worktrees. In each app folder you build or test: `bun install --frozen-lockfile`. If Astro fails with a sandbox/thread error, retry with `RAYON_NUM_THREADS=2`.

## Project rules (always)

- Read root `AGENTS.md`, `plan/implementation/00-INDEX.md` §1 and §3, `plan/implementation/01-HANDOVER-PROTOCOL.md`, your phase file and only your tasks.
- Shared files (`00-INDEX.md` §3, plus `src/components/Honorific.astro`, `src/lib/import.ts`, `tests/import.test.ts`) may only be edited if your task says so, and then edited in `apps/guess-the-surah` and copied with `bun _implementation/sync-shared.ts --from guess-the-surah <path>`.
- Sacred text: never retype or change Quran Arabic/English or hadith wording. After editing any `src/data/content.json`, update `appContentSha256` in `provenance.json` with the LF-normalised SHA-256: `python -c "import hashlib,sys;print(hashlib.sha256(open(sys.argv[1],'rb').read().replace(b'\r\n',b'\n')).hexdigest())" src/data/content.json`.
- No images of people or animals; no music. No invented facts, sources, dates or numbers. No third-party scripts, cookies or analytics. No new dependencies unless your task names one.
- Storage only via `read`/`write`/`forget` in `src/lib/utils.ts`; document new keys in the app's `context/architecture.md`.
- Keep LF line endings and each file's existing style.
- Record your work: append a short dated entry (2026-11-11, Asia/Dhaka) to the affected app's `context/progress-tracker.md` (or the root one for shared work) as its own commit.

## Final reply

Branch name, the list of commits (`git log --oneline phase-3-merges..HEAD`), the checks you ran with exact results, and anything you could not do or that needs the orchestrator. Be concise.
