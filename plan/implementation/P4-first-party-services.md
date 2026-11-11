# P4 — Feedback form, corrections log and the three-event counter

**Branch:** `phase-4-services` · **Target:** 7–13 Dec 2026 · **Release:** R4 · **Depends on:** P3 step A merged
**Goal:** every app and the directory get a first-party "Report an error or suggest something" form and a public corrections log; Moongazer counts three anonymous events. No third-party scripts, no cookies, no stored IPs.
**Decisions:** D14–D17 in `00-INDEX.md`; `context/project-dna.md` §5; `plan/FIRST_PARTY_SERVICES_PLAN.md` (now settled).

## Architecture (settled)

```
apps (*.moongazer.tech) ──native <form method=post>──▶ moongazer.tech/api/feedback ─▶ D1 table feedback (status=pending)
                         ──navigator.sendBeacon────────▶ moongazer.tech/api/event    ─▶ D1 table event_counts (upsert +1)
owner laptop ── scripts/review-feedback.mjs (wrangler d1) ──▶ approve ─▶ homepage/corrections.json ─▶ /corrections/ (static)
```

- **Runtime:** Cloudflare Pages Functions in the apex project `moongazer` (`homepage/functions/`). The apex is deployed with `wrangler pages deploy`; the twenty apps keep the custom Direct Upload path.
- **Storage:** one D1 database `moongazer`, binding `DB`.
- **No fetch in app code.** `_implementation/verify-static.py` forbids `fetch(` in app bundles. Feedback uses a native form POST (works without JS, needs no CORS). The counter uses `navigator.sendBeacon` with a `text/plain` body (no preflight).
- **What is stored.** Feedback: `{id, created_at, app_slug, page_url, category, message, contact?, status, no_js}`. Counter: `{date (UTC, server), app_slug, item_id, event_type, count}`. Never IP, user agent, headers, cookies or fingerprints. Functions must not log request data; leave Workers Logs/observability off for this project.
- **Abuse.** Honeypot field, minimum time-to-submit (3 s, from a render timestamp set by an inline script), allowlists and length limits, one zone rate-limiting rule on `/api/*` (owner), everything `pending`.
- **Privacy signal.** If `navigator.globalPrivacyControl === true`, the counter does not send. (Plan default chosen for consistency with core value 3; the owner can remove it.)

Before starting, verify the current official docs for: Pages Functions file routing and `_routes.json`; `wrangler pages deploy`; Pages `wrangler.toml` (`pages_build_output_dir`, `d1_databases`); D1 migrations; `navigator.sendBeacon` CSP (`connect-src`). Record each URL in `context/architecture.md` (protocol §3, "Dependencies").

---

### T4.1 Context first
Lane: shared · Files: `context/architecture.md`, `context/code-standards.md`, `context/project-overview.md`, `context/project-dna.md` (status line only), `plan/FIRST_PARTY_SERVICES_PLAN.md`
Steps: replace "There is no runtime backend … or database" with the exact service boundary above; add the storage shapes, the no-IP/no-log rule, the CSP changes, the deployment split, and the rule that app bundles may only call `sendBeacon` to `https://moongazer.tech/api/event` and post forms to `https://moongazer.tech/api/feedback`. Update architecture invariant 2 accordingly ("no accounts, no identity, no third-party scripts; first-party aggregate counter and moderated feedback only").

### T4.2 Wrangler tooling and apex config
Lane: shared · Depends on: T4.1 · Files: `deployment/package.json`, `deployment/bun.lock`, `homepage/wrangler.toml` (new), `homepage/functions/_routes.json` or `homepage/_routes.json` (per docs), `homepage/migrations/0001_init.sql` (new)
Steps:
1. Add `wrangler` as an exact-pinned devDependency of `deployment/` (D15 authorizes this one dependency). Record the version and `bunx wrangler --version` output.
2. `homepage/wrangler.toml`: `name = "moongazer"`, `pages_build_output_dir = "dist"`, `compatibility_date` (today's date at implementation), `[[d1_databases]] binding = "DB", database_name = "moongazer", database_id = "<filled by owner in T4.10>"`. Keep the id out of logs; it is not a secret but must be real.
3. `_routes.json`: include only `/api/*` so static pages never invoke Functions.
4. Migration `0001_init.sql`:
   ```sql
   CREATE TABLE feedback (
     id TEXT PRIMARY KEY, created_at TEXT NOT NULL, app_slug TEXT NOT NULL, page_url TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('source_or_text_correction','bug_report','feature_request')),
     message TEXT NOT NULL, contact TEXT, status TEXT NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending','verified','rejected','spam')),
     no_js INTEGER NOT NULL DEFAULT 0, reviewed_at TEXT, review_note TEXT);
   CREATE INDEX feedback_status ON feedback(status, created_at);
   CREATE TABLE event_counts (
     date TEXT NOT NULL, app_slug TEXT NOT NULL, item_id TEXT NOT NULL,
     event_type TEXT NOT NULL CHECK (event_type IN ('activity_started','activity_completed','share_clicked')),
     count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (date, app_slug, item_id, event_type));
   ```
5. Ensure `homepage/build.mjs` copies nothing from `functions/` into `dist/` (Functions are picked up by wrangler from `homepage/functions/`; confirm the expected location in the docs: for `wrangler pages deploy <dir>`, Functions are read from `./functions` relative to the current working directory, so the deploy command runs from `homepage/`).
Acceptance: `bunx wrangler pages dev dist` (from `homepage/`) starts with a local D1 after `wrangler d1 migrations apply moongazer --local`.

### T4.3 Pure validation module and tests
Lane: shared · Depends on: T4.2 · Files: `homepage/functions/_lib/validate.ts` (new), `homepage/tests/validate.test.ts` (new; run with `bun test homepage/tests`)
Rules:
- `app_slug` ∈ allowlist generated from `deployment/targets.json` at build time into `homepage/functions/_lib/apps.json` (include retired apps until P3 step B, plus `directory`).
- `page_url`: absolute `https:` URL whose host is `moongazer.tech` or `<app_slug>.moongazer.tech`; strip query and fragment before storing; max 300 chars.
- `category` ∈ the three values; `message` trimmed 10–2,000 chars; `contact` optional, ≤ 200 chars, must contain `@` if present; honeypot `website` must be empty; `t` (ms timestamp) if present must be ≥ 3,000 ms before now and ≤ 24 h old.
- Event: JSON `{"a":slug,"i":itemId,"e":event}`; `itemId` matches `^[a-z0-9-]{1,64}$` or is `home`; body ≤ 512 bytes.
Acceptance: table-driven tests for every rule, including honeypot and timing.

### T4.4 Functions
Lane: shared · Depends on: T4.3 · Files: `homepage/functions/api/feedback.ts`, `homepage/functions/api/event.ts`
Steps:
1. `POST /api/feedback`: parse `application/x-www-form-urlencoded`; validate; if honeypot or timing fails, **do not store** but respond exactly like success (303 to the thanks page) so bots learn nothing; else insert with `crypto.randomUUID()`, `new Date().toISOString()`, `no_js = t missing ? 1 : 0`. Respond `303 See Other` to `https://moongazer.tech/feedback/thanks/?from=<app_slug>`. Any other method → 405.
2. `POST /api/event`: read text body, `JSON.parse` in try/catch, validate, `INSERT … ON CONFLICT(date, app_slug, item_id, event_type) DO UPDATE SET count = count + 1` with `date` = UTC `YYYY-MM-DD` computed on the server. Respond `204` with no body. Invalid → `204` too (fail silent, nothing stored).
3. Headers on both: `Cache-Control: no-store`. No CORS headers are needed (form navigation and beacons don't read responses); do not add `Access-Control-Allow-Origin: *`.
4. No `console.log` of request data.
Acceptance: local `wrangler pages dev` run: a valid form post creates one pending row and redirects; honeypot post creates nothing and redirects; a valid beacon increments a count; malformed input returns 204/303 without rows.

### T4.5 Directory pages: feedback form, thanks page, corrections log
Lane: shared · Depends on: T4.4 · Files: `homepage/feedback-form.html` (partial) or a function in `homepage/render.mjs`, `homepage/build.mjs`, `homepage/corrections.json` (new), `homepage/styles.css`, `homepage/sitemap` generation
Steps:
1. `/feedback/` page with the form (category radio buttons, message, optional contact, hidden `app_slug=directory` and `page_url`, honeypot `website` in a visually hidden wrapper with `tabindex="-1" autocomplete="off"`, hidden `t` filled by a tiny inline script). Text: what happens next ("We read every message. Corrections we make appear in the corrections log. We don't publish your contact details.").
2. `/feedback/thanks/` page: "Thank you. Your message is waiting for review." plus a link back (to `https://<from>.moongazer.tech/` when `from` is a known slug, read client-side; default to the directory). `noindex`.
3. `/corrections/` built from `corrections.json` entries `{date, app_slug, page_url, change, found_by: "visitor"|"review"}` newest first, with app names from `targets.json`. Seed it with the R1 fixes from `releases/R1.md` (`found_by: "review"`). Indexable, in the sitemap, linked from the footer, About page and the trust row.
4. Directory CSP: `form-action 'self'`; `connect-src 'self'` (same origin).
Acceptance: pages build; corrections page lists the seeded entries; forms work without JS.
Verify: V4, V6.

### T4.6 Shared app components: feedback form and counter
Lane: shared · Depends on: T4.4 · Files: `apps/*/src/components/Feedback.astro` (new, shared), `apps/*/src/lib/counter.ts` (new, shared), `apps/*/src/layouts/Shell.astro`, `apps/*/public/_headers`, `apps/*/src/pages/privacy.astro`, `_implementation/sync-shared.ts` (add the two new files to the shared list), `_implementation/verify-static.py`
Steps:
1. `Feedback.astro`: a footer `<details id="feedback">` with summary "Report an error or suggest something" containing the native form (`action="https://moongazer.tech/api/feedback" method="post"`), hidden `app_slug={config.slug}`, hidden `page_url` = canonical URL of the page, honeypot, `t`. Works without JS. A prop `compact` renders just a link "Report an error →" (`href="#feedback"`) for result panels; a 3-line script opens the details when that link is used.
2. `counter.ts`: `export function track(event: 'activity_started'|'activity_completed'|'share_clicked', itemId: string)`; no-op unless `location.hostname` ends with `moongazer.tech` (so local preview and tests never send); no-op if `navigator.globalPrivacyControl === true` or `sendBeacon` missing; dedupe `activity_started` per item per page load; wrap everything in try/catch; never throws, never logs.
3. Shell includes `<Feedback />` in the footer.
4. `_headers` CSP: `connect-src 'self' https://moongazer.tech; form-action 'self' https://moongazer.tech`.
5. `privacy.astro`: add the disclosure (owner approves wording in T4.9): "When you start, finish or share an activity, the page sends an anonymous count to moongazer.tech: the date, the app, the activity id and the event. No cookie, no IP address or device details are stored, and nothing identifies you. If your browser sends Global Privacy Control, no count is sent. If you send feedback, we store your message, the page address and an optional contact you choose to give."
6. `verify-static.py`: replace the blanket fetch ban with: still no `fetch(`; `sendBeacon(` allowed only with the literal `https://moongazer.tech/api/event`; forms with external `action` only to `https://moongazer.tech/api/feedback`.
7. Sync to all apps; V3.
Acceptance: all app builds contain the footer form; no `fetch(` in bundles; CSP updated in every app; verifier passes.
Verify: V2, V3, V5, V7 (submit the form from one app preview against `wrangler pages dev` running locally; confirm the row; confirm the thanks page).

### T4.7 Wire the three events in every app
Lane: app (one sub-task per app; parallel allowed) · Depends on: T4.6 · Files: the app's main `src/lib/*.ts`
Steps: call `track('activity_started', id)` on the first meaningful interaction with an item (first answer click, first choice, first reveal, first search submitted → `id='search'`, calculator/plan first calculation → `id='plan'`); `track('activity_completed', id)` when the activity ends (correct answer, last lock, reflection reached, quiz answered, plan generated); `track('share_clicked', id)` on every copy/share/WhatsApp button. Use the item's existing stable `id`; never put visitor text or answers into `itemId`.
Record the hook points in the app's `context/architecture.md`.
Acceptance: a unit or DOM test (or a documented manual run on the preview with a stubbed `navigator.sendBeacon`) shows each event fires once at the right moment and never on preview hosts by default.
Verify: V1, V7.

### T4.8 Owner scripts: review feedback, publish a correction, counter report
Lane: shared · Depends on: T4.4 · Files: `deployment/scripts/review-feedback.mjs`, `deployment/scripts/counter-report.mjs`, `deployment/README.md`
Steps:
1. `review-feedback.mjs` (uses `bunx wrangler d1 execute moongazer --remote --json --command …`): `list` (pending, oldest first, prints id/app/page/category/message/contact), `set <id> verified|rejected|spam [--note "…"]`, `publish <id> --change "What changed"` which appends an entry to `homepage/corrections.json` (no contact, `found_by:"visitor"`) and marks the row verified. Never prints the contact unless `--show-contact`.
2. `counter-report.mjs`: totals per app and event for a date range; completion rate = completed/started per app and per item; prints CSV.
3. Document both in `deployment/README.md`.
Acceptance: dry run against the local D1 works.

### T4.9 Phase verification and R4 notes
Lane: shared · V2–V8; `releases/R4.md` with: the privacy wording for owner approval, the owner production checklist (T4.10), and test evidence.

### T4.10 Production setup and release R4
Lane: deploy (owner). Checklist:
1. Create D1: `bunx wrangler d1 create moongazer`; put the id in `homepage/wrangler.toml`; apply migrations `bunx wrangler d1 migrations apply moongazer --remote`.
2. Grant the GitHub Actions token D1 Edit (and confirm Pages Edit) on the account.
3. CI change (prepared by a model, merged by owner): in `.github/workflows/deploy.yml`, deploy the apex with `bunx --cwd deployment wrangler pages deploy dist --project-name moongazer --branch main` run from `homepage/`, and remove `moongazer` from the project list in `deployment/deploy-ci.mjs` (keep its verification in `verify-live.mjs`).
4. Zone rate-limiting rule on `moongazer.tech/api/*` (for example 10 requests per 10 s per client, block 10 s); record the rule id.
5. Approve the privacy wording; merge and push; after deploy, submit one real test feedback and one beacon, verify rows, then mark the test feedback `rejected`.
6. Record results in `releases/R4.md` and `deployment/status.json`.
