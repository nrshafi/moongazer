# Islamic Product Lab

Open [Moongazer](https://moongazer.tech/) for the searchable directory of all thirteen apps. Each app is published to its own full-name subdomain and independent Cloudflare Pages project. See [DEPLOYMENT.md](DEPLOYMENT.md) for every production URL.

Thirteen independent static apps for Islamic learning, reading and practice in an English-only UI (displaying attributed Pickthall translations while preserving canonical Arabic in local JSON data and keeping `ﷺ` honorifics). The collection includes games, timelines, source readers, family activities, a Quran memorization workload calculator, and a Zakat Calculator. Each app lives in `apps/` and can be built and deployed on its own.

The apps use Astro 7.4.2, TypeScript 6.0.3 and Bun 1.4.4. They use bundled content and assets, with no accounts, database or runtime API required. Optional browser storage is app-specific; saved activity records expire when accessed after 30 days. Each app describes its sources and the limits of its editorial material.

## Apps

| App | Folder | Local port |
| --- | --- | ---: |
| Ayah Threads | [ayah-threads](apps/ayah-threads) | 4322 |
| Seerah Detective | [seerah-detective](apps/seerah-detective) | 4323 |
| Everyday Akhlaq | [everyday-akhlaq](apps/everyday-akhlaq) | 4324 |
| Seerah Timeline | [seerah-timeline](apps/seerah-timeline) | 4325 |
| Hifz Planner | [hifz-planner](apps/hifz-planner) | 4326 |
| Quran Escape Room | [quran-escape-room](apps/quran-escape-room) | 4329 |
| Stories of the Prophets | [stories-of-the-prophets](apps/stories-of-the-prophets) | 4330 |
| Places in the Quran | [places-in-the-quran](apps/places-in-the-quran) | 4331 |
| Parables of the Quran | [parables-of-the-quran](apps/parables-of-the-quran) | 4335 |
| Civilization Timeline | [civilization-timeline](apps/civilization-timeline) | 4336 |
| Why It Was Revealed | [why-it-was-revealed](apps/why-it-was-revealed) | 4338 |
| Family Halaqa | [family-halaqa](apps/family-halaqa) | 4339 |
| Zakat Calculator | [zakat-calculator](apps/zakat-calculator) | 4341 |

## Run an app

Install Bun 1.4.4, then run commands inside the chosen app folder. For example:

```powershell
cd apps/ayah-threads
bun install --frozen-lockfile
bun run dev
```

Open the local address printed by the dev server. Each app has its own package manifest and lockfile; the repository root is not a Bun workspace. To check, test and build that app:

```powershell
bun run check
bun test
bun run build
bun run preview
```

## Repository guide

- [DEPLOYMENT.md](DEPLOYMENT.md) lists production URLs and build settings. [deployment/README.md](deployment/README.md) records the repeatable upload workflow and official API references.
- [homepage/](homepage/) contains the raw HTML, CSS and JavaScript directory. Build it with `node homepage/build.mjs`; preview with `node homepage/preview.mjs` on localhost port 4350.
- [AGENTS.md](AGENTS.md) and [context/](context/) contain repository-wide instructions and project context. Each app also has its own instructions and context.
- [_implementation/](_implementation/) contains content preparation, research snapshots and verification scripts. Some scripts expect missing QA artifacts or generated builds; inspect their requirements before running them.
- [STATIC_APPS_SHORTLIST.md](STATIC_APPS_SHORTLIST.md) and [PROJECT_RANKING.md](PROJECT_RANKING.md) record the project selection.

Build output and dependencies are ignored by Git. The `release/` archives and several QA reports mentioned in historical context are absent. Fresh static verification recreates `_implementation/qa/static-results.json`; release-specific logs and HTTP checks are in `deployment/evidence/`.

Hosting uses Cloudflare Pages Direct Upload. Pushes to `main` automatically check, test, build and deploy the homepage and all thirteen active apps through GitHub Actions. See [deployment/status.json](deployment/status.json) for actual deployment and verification status. The apps retain their source attribution and rights notes and do not claim independent scholarly certification.
