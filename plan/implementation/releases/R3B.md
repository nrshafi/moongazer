# R3B — New hosts, merged apps removed (decision D2c)

Branch `phase-3b-hosts`, verified 2026-11-12 ~06:20 (Asia/Dhaka). The owner asked to keep only the new things, with no redirects. This release replaces P3 step B (301s) entirely.

## Changes

- **Four merged apps deleted:** Quran Concept Atlas, Islamic History Timeline Challenge, Halal Business Decisions and Islamic Misinformation Casebook. Their content lives on in Ayah Threads `/themes/`, Seerah Timeline `/challenge/`, Everyday Akhlaq `/business/` and Is It in the Quran? `/claims/`.
  - The moved banner, the `#import=` hand-over (`import.ts`, `merge-import.ts`), the redirect map, the `retired` flag and their tests are gone.
  - The three corrections-log entries that pointed at deleted apps were removed.
- **16 apps on new hosts** matching their names. Old hosts are not redirected. Saved browser data does not carry over, because each new host is a new origin.

  | App | New host |
  | --- | --- |
  | Guess the Surah | `guess-the-surah.moongazer.tech` (unchanged) |
  | Ayah Threads | `ayah-threads.moongazer.tech` |
  | Seerah Detective | `seerah-detective.moongazer.tech` |
  | Everyday Akhlaq | `everyday-akhlaq.moongazer.tech` |
  | Seerah Timeline | `seerah-timeline.moongazer.tech` |
  | Hifz Planner | `hifz-planner.moongazer.tech` |
  | Is It in the Quran? | `is-it-in-the-quran.moongazer.tech` |
  | Quran Escape Room | `quran-escape-room.moongazer.tech` |
  | Stories of the Prophets | `stories-of-the-prophets.moongazer.tech` |
  | Places in the Quran | `places-in-the-quran.moongazer.tech` |
  | Word Groups | `word-groups.moongazer.tech` |
  | Understand Your Salah | `understand-your-salah.moongazer.tech` |
  | Parables of the Quran | `parables-of-the-quran.moongazer.tech` |
  | Civilization Timeline | `civilization-timeline.moongazer.tech` |
  | Why It Was Revealed | `why-it-was-revealed.moongazer.tech` |
  | Family Halaqa | `family-halaqa.moongazer.tech` |

- **Repository changes:**
  - Folders, configs, catalogs, cross-app links and current-state docs use the new slugs (`_implementation/rename-hosts.py` records the map). History files keep the old names.
  - `_build/` (pre-Astro prototype tooling) was removed.
  - Apex short links were dropped from the plans, since they are redirects.
- **Cloudflare:**
  - 15 new Pages projects were created, each with a custom domain and a proxied CNAME. Cloudflare refused `moongazer-ayah-threads` and `moongazer-quran-escape-room` (error 8000000), so those two projects carry an `-app` suffix, recorded as `project` in `targets.json`.
  - A temporary 7-day API token (Pages Edit; DNS Edit and Zone Read on moongazer.tech) was used for this migration and is deleted afterwards.

## Checks (local)

- `verify.ts` check, test and build: 16/16 apps, 251 tests pass.
- `sync-shared --check`: identical.
- `seo.test.ts` and `homepage/tests`: 60 pass.
- `verify-static.py`: 313 pages.
- `verify-seo.py`: 17 sites, 323 pages, 289 indexable.
- Text-join audit: 0.
- `_implementation/host-smoke.mjs`: all 16 homes have the new canonical host and matching `data-app`, no link to any old or deleted host, and no script errors.
- `counter-check.mjs`: passed.
- All 16 custom domains report `active`.

## Production

_Filled in after the push._
