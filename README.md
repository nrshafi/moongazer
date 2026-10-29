# Islamic Product Lab

Open [Moongazer](https://moongazer.tech/) for the searchable directory of all twenty apps. Each app is published to its own full-name subdomain and independent Cloudflare Pages project. See [DEPLOYMENT.md](DEPLOYMENT.md) for every production URL.

Twenty independent static apps for Islamic learning, reading and practice. The collection includes games, timelines, source explorers and a Quran memorization workload calculator. Each app lives in `apps/` and can be built and deployed on its own.

The apps use Astro 7.4.2, TypeScript 6.0.3 and Bun 1.4.4. They use bundled content and assets, with no accounts, database or runtime API required. Optional browser storage is app-specific; saved activity records expire when accessed after 30 days. Each app describes its sources and the limits of its editorial material.

## Apps

| App | Folder | Local port |
| --- | --- | ---: |
| Guess the Surah | [guess-the-surah](apps/guess-the-surah) | 4321 |
| Quran Connections | [quran-connections](apps/quran-connections) | 4322 |
| The Seerah Detective | [the-seerah-detective](apps/the-seerah-detective) | 4323 |
| Everyday Akhlaq Simulator | [everyday-akhlaq-simulator](apps/everyday-akhlaq-simulator) | 4324 |
| Interactive Seerah Timeline | [interactive-seerah-timeline](apps/interactive-seerah-timeline) | 4325 |
| Quran Memorization Workload Calculator | [quran-memorization-workload-calculator](apps/quran-memorization-workload-calculator) | 4326 |
| Is This Actually in the Quran? | [is-this-actually-in-the-quran](apps/is-this-actually-in-the-quran) | 4327 |
| Quran Concept Atlas | [quran-concept-atlas](apps/quran-concept-atlas) | 4328 |
| The Islamic Knowledge Escape Room | [islamic-knowledge-escape-room](apps/islamic-knowledge-escape-room) | 4329 |
| Stories of the Prophets Explorer | [stories-of-the-prophets-explorer](apps/stories-of-the-prophets-explorer) | 4330 |
| Quranic Places Atlas | [quranic-places-atlas](apps/quranic-places-atlas) | 4331 |
| Islamic Concept Connections | [islamic-concept-connections](apps/islamic-concept-connections) | 4332 |
| Islamic History Timeline Challenge | [islamic-history-timeline-challenge](apps/islamic-history-timeline-challenge) | 4333 |
| Understand Salah Lab | [understand-salah-lab](apps/understand-salah-lab) | 4334 |
| Quranic Parables Studio | [quranic-parables-studio](apps/quranic-parables-studio) | 4335 |
| Islamic Civilization Timeline | [islamic-civilization-timeline](apps/islamic-civilization-timeline) | 4336 |
| Halal Business Decisions | [halal-business-decisions](apps/halal-business-decisions) | 4337 |
| Revelation Context Explorer | [revelation-context-explorer](apps/revelation-context-explorer) | 4338 |
| Family Islamic Learning Challenges | [family-islamic-learning-challenges](apps/family-islamic-learning-challenges) | 4339 |
| Islamic Misinformation Casebook | [islamic-misinformation-casebook](apps/islamic-misinformation-casebook) | 4340 |

## Run an app

Install Bun 1.4.4, then run commands inside the chosen app folder. For example:

```powershell
cd apps/guess-the-surah
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
- [_build/](_build/) contains tooling for earlier HTML prototypes. [islamic_product_atlas.html](islamic_product_atlas.html) is an earlier reference; the old demo catalog and generated demo files are absent from this checkout.
- [STATIC_APPS_SHORTLIST.md](STATIC_APPS_SHORTLIST.md) and [PROJECT_RANKING.md](PROJECT_RANKING.md) record the project selection.

Build output and dependencies are ignored by Git. The `release/` archives and several QA reports mentioned in historical context are absent. Fresh static verification recreates `_implementation/qa/static-results.json`; release-specific logs and HTTP checks are in `deployment/evidence/`.

Hosting uses Cloudflare Pages Direct Upload. Pushes to `main` automatically check, test, build and deploy the homepage and all twenty apps through GitHub Actions. See [deployment/status.json](deployment/status.json) for actual deployment and verification status. The apps retain their source attribution and rights notes and do not claim independent scholarly certification.
