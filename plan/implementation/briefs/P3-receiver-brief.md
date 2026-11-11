# P3 brief for receiving-section subagents (T3.3–T3.6)

Read first: `plan/implementation/P3-merges.md` (your task section and T3.2), `plan/implementation/00-INDEX.md` §1, the receiving app's `AGENTS.md` and `context/`, and the old app's source. Repo: `I:\Development\moongazer` (Windows; Bash tool with POSIX syntax; Bun 1.4.4; `PYTHONIOENCODING=utf-8` for Python output).

## Hard rules (same as every phase)

- No git state changes (no commit/checkout/stash/reset/push). The orchestrator commits.
- Touch only your receiving app folder (and the research file named in your task). Read the old app freely; do not edit it (the "moved" banner is a later task).
- Do not edit shared files: `src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/styles/global.css`, `src/components/LearningGuide.astro`, `src/components/Honorific.astro`, `src/lib/utils.ts`, `src/lib/seo.ts`, `src/lib/import.ts`, `tests/import.test.ts`, `src/pages/404.astro`, `src/pages/privacy.astro`, `src/pages/sitemap.xml.ts`, `public/_headers`. If `seo.ts` cannot express a page you need, put the page's metadata in the data shape `seo.ts` already reads (`seo.json` `collection`/`prefix` and content records) or report the gap — do not edit `seo.ts`. Note: `seo.ts` throws "Add metadata for the new page" for routes it does not know; read it to see how routes are registered (`seo.json` collection + prefix) and how the sitemap is generated.
- **Sacred text:** canonical records `{ref, arabic, translation}` are copied byte-exact from the old app's `content.json` (or `_implementation/research/quran-full.json`); they must live inside the receiver's `src/data/content.json` so `_implementation/verify-static.py` checks them. After editing `content.json`, update `appContentSha256` in `provenance.json` with the LF-normalised hash: `python -c "import hashlib,sys;print(hashlib.sha256(open(sys.argv[1],'rb').read().replace(b'\r\n',b'\n')).hexdigest())" src/data/content.json`. Hadith: keep collection + number + sunnah.com link exactly as in the old app; paraphrase only, never paste modern English translations.
- Honorifics as in P2: `<Honorific />` after the Prophet Muhammad in templates, plain ﷺ in JSON, `withHonorifics(esc(text))` in client scripts.
- Storage only via `read`/`write`/`forget` from `src/lib/utils.ts`; document new keys in the app's `context/architecture.md`.
- No new dependencies. Keep LF endings and each file's style (these apps use compact one-line Astro markup; follow it, but keep a real space between adjacent inline elements so `_implementation/audit-text-joins.py` stays at 0).

## UI rules (the orchestrator owns design; follow these exactly)

- Reuse the receiving app's existing components, classes and panel styles (`panel`, `panel-body`, `eyebrow`, `card-grid`, `activity-card`, `button`, `button secondary`, `notice`, `filters`, `field`). No new colour values, fonts or shadows. New CSS only for layout of new elements, scoped in the page `<style>` or the app's own CSS file, using existing CSS variables (`--accent`, `--accent-ink`, `--tint`, `--line`, `--muted`, `--surface`, `--radius`).
- A new section gets: an `intro` block (eyebrow, H1, one-sentence lead), then the activity first, then supporting text. One H1 per page. Internal links end with ` <span aria-hidden="true">→</span>`; external links open in a new tab with `↗`.
- Add an entry point to the section from the receiving app's home page: a single `notice`-style panel or a card near the top with a plain link ("Theme library →", "Which came first? →", "Business scenarios →", "Common claims →"). Do not restructure the home page (P5 redesigns it).
- Everything keyboard operable; feedback in `role="status"`/`aria-live` regions; works at 390 px width with no horizontal scroll; light and dark themes via existing variables only.
- Spoilers: answers never appear in visible text, `<title>`, meta description or URL before the learner acts.

## Import wiring (T3.2, already written)

`src/lib/import.ts` exports `runImport(rules, io)` and the `ImportRule` type. Create `src/lib/merge-import.ts` in your app with this app's rules and call it from the section's index and detail pages (a `<script>` that imports it):

```ts
import { runImport, type ImportRule } from './import';
import { read, write, announce } from './utils';
const rules: ImportRule[] = [ /* your table from P3-merges.md T3.2 */ ];
runImport(rules, {
  hash: location.hash,
  read: key => read(key, (v): v is unknown => true),
  write: (key, value) => write(key, value),
  clearHash: () => history.replaceState(null, '', location.pathname + location.search),
  announce,
});
```

Validators must be the old app's own validators (copy them; the old app's `src/lib/*.ts` shows them). Add `tests/merge-import.test.ts` that feeds a payload built with `encodePayload(<old slug>, …)` through `planImport` with your rules and checks the mapped keys and values (including an invalid value being dropped).

## Verify

In the receiving app: `bun run check`, `bun test`, `bun run build` (retry with `RAYON_NUM_THREADS=2` on sandbox/thread errors). Then from the repo root: `bun test _implementation/seo.test.ts`, `PYTHONIOENCODING=utf-8 python _implementation/audit-text-joins.py --summary` (look only at your app's line), and confirm the new routes exist in `dist/` and in `dist/sitemap.xml`. Do not run the all-app build (other agents are building).

Append `## 2026-11-11 (Asia/Dhaka) — P3 <task id> <section name>` to the receiving app's `context/progress-tracker.md` with what changed, storage keys, content.json hash and exact check results.

## Final reply

Files changed (one line each), routes added, storage keys, the import rules, content.json hash, judgement calls, exact check results, anything you could not do.
