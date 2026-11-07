# Brief 10 — Moongazer: merge four apps, with redirects

**Repository:** `I:\Development\moongazer` (plus the Cloudflare zone, when the owner authorizes publication)
**Depends on:** 07 and 08. **Authorized:** ask the owner first. This removes four apps from the directory and changes production URLs.
**Goal:** fold four duplicate apps into the apps they overlap with, so twenty becomes sixteen stronger apps (brief 13 adds four new ones), without losing any URL.
**Background:** `../REPORT.md`, A5 (clusters, decisions, redirect method), A8 entries 2, 5, 10 and 15.

## First: update context

- `context/project-overview.md`: implemented projects; merged apps marked "merged into …".
- `context/architecture.md`: the merge and redirect method; the retired Pages projects.
- `deployment/targets.json`: the catalog without the four merged apps.
- `homepage/collections.json`: subject guides and reasons.
- Each receiving app's `context/` (its new section, routes and data).

## The four merges

Do them one at a time. Each merge is complete only when the old URLs redirect correctly.

| From (host) | Into (host and new route) | What moves |
| --- | --- | --- |
| `quran-concept-atlas` (`/topic/<id>/`) | `quran-connections` → `/themes/<id>/` (Ayah Threads' Theme library) | The 30 theme pages. A theme shows its explanation after the visitor solves or reveals that puzzle; before that, it shows the passages and a "Solve this thread" link. Replace the mechanical "connected readings" (first four in the category) with authored relationships, or drop them. |
| `islamic-history-timeline-challenge` (`/`) | `interactive-seerah-timeline` → `/challenge/` ("Which came first?") | The 12 four-card packs and their engine. The 14 events already exist in the timeline; reference them by id, do not duplicate. Fix pack titles that don't match their contents. |
| `halal-business-decisions` (`/case/<id>/`) | `everyday-akhlaq-simulator` → `/business/<id>/` (Business track) | The 12 cases and the decision engine. Unify with Akhlaq's scenario engine; shuffled options are already fixed in brief 06. The Akhlaq descriptor becomes "Character and halal business dilemmas: choose, then read the sources". |
| `islamic-misinformation-casebook` (`/case/<id>/`) | `is-this-actually-in-the-quran` → `/claims/<id>/` ("Common claims") | The 12 cases, rebuilt around claims people actually make (not strawmen), with neutral titles and a one-line verdict revealed after the reader chooses. Sources, quotations and checksums move intact. Update the descriptor to mention claims. |

For each merge:
1. **Build the section in the receiving app.** Copy data with provenance, add static routes, add tests, update its sitemap and SEO profile.
2. **Run the full verification checklist** in `00-START-HERE.md` for the receiving app.
3. **Write the redirect map:** every old URL to its new URL, including the old home and each detail route. `privacy` and `sources` go to the receiving app's equivalents.
4. **Publish, only after the owner authorizes it:**
   - Deploy the receiving app first.
   - Add hostname redirects (301) in the Cloudflare zone's `http_request_dynamic_redirect` ruleset; architecture.md says hostname redirects live there, not in Pages `_redirects`.
   - Verify every mapped URL live (status and `Location`).
   - Remove the old app's sitemap from Search Console.
   - Remove the old app from `deployment/targets.json`, the GitHub Actions deployment list and the directory.
   - Keep the old DNS record so the redirects keep working.
   - Retire the old Pages project only after the redirects are verified. Never delete the DNS record while redirects depend on it.
5. **Record** each step and its evidence in `deployment/` records and the tracker.

## Verification

Use the checklist in `00-START-HERE.md`, plus:
- `python _implementation/verify-static.py`: moved quotations still match.
- The SEO validator: no orphaned canonicals; sitemaps list only live URLs.
- A redirect test listing every old URL with its expected target, run locally against the map and live after publication.
- The directory shows sixteen apps until brief 13 adds the new ones. Update the hero count and copy ("16 free apps") truthfully in the meantime.

Do not push or publish without the owner's explicit request. Update `00-START-HERE.md`.
