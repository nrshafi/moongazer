# Moongazer hosting

The directory is published at [moongazer.tech](https://moongazer.tech/). Each app has its own Cloudflare Pages project and full-name subdomain. The www hostname redirects to the apex, preserving path and query.

## Hosting inventory

| App | Production URL | Pages project |
| --- | --- | --- |
| Moongazer directory | [moongazer.tech](https://moongazer.tech/) | `moongazer` |
| Guess the Surah | [guess-the-surah.moongazer.tech](https://guess-the-surah.moongazer.tech/) | `moongazer-guess-the-surah` |
| Quran Connections | [ayah-threads.moongazer.tech](https://ayah-threads.moongazer.tech/) | `moongazer-ayah-threads` |
| The Seerah Detective | [seerah-detective.moongazer.tech](https://seerah-detective.moongazer.tech/) | `moongazer-seerah-detective` |
| Everyday Akhlaq | [everyday-akhlaq.moongazer.tech](https://everyday-akhlaq.moongazer.tech/) | `moongazer-everyday-akhlaq` |
| Interactive Seerah Timeline | [seerah-timeline.moongazer.tech](https://seerah-timeline.moongazer.tech/) | `moongazer-seerah-timeline` |
| Quran Memorization Workload Calculator | [hifz-planner.moongazer.tech](https://hifz-planner.moongazer.tech/) | `moongazer-hifz-planner` |
| Is This Actually in the Quran? | [is-it-in-the-quran.moongazer.tech](https://is-it-in-the-quran.moongazer.tech/) | `moongazer-is-it-in-the-quran` |
| The Islamic Knowledge Escape Room | [quran-escape-room.moongazer.tech](https://quran-escape-room.moongazer.tech/) | `moongazer-quran-escape-room` |
| Stories of the Prophets Explorer | [stories-of-the-prophets.moongazer.tech](https://stories-of-the-prophets.moongazer.tech/) | `moongazer-stories-of-the-prophets` |
| Quranic Places Atlas | [places-in-the-quran.moongazer.tech](https://places-in-the-quran.moongazer.tech/) | `moongazer-places-in-the-quran` |
| Islamic Concept Connections | [word-groups.moongazer.tech](https://word-groups.moongazer.tech/) | `moongazer-word-groups` |
| Understand Salah Lab | [understand-your-salah.moongazer.tech](https://understand-your-salah.moongazer.tech/) | `moongazer-understand-your-salah` |
| Quranic Parables Studio | [parables-of-the-quran.moongazer.tech](https://parables-of-the-quran.moongazer.tech/) | `moongazer-parables-of-the-quran` |
| Islamic Civilization Timeline | [civilization-timeline.moongazer.tech](https://civilization-timeline.moongazer.tech/) | `moongazer-civilization-timeline` |
| Revelation Context Explorer | [why-it-was-revealed.moongazer.tech](https://why-it-was-revealed.moongazer.tech/) | `moongazer-why-it-was-revealed` |
| Family Islamic Learning Challenges | [family-halaqa.moongazer.tech](https://family-halaqa.moongazer.tech/) | `moongazer-family-halaqa` |

## Sources and builds

The directory's authoritative HTML, CSS, JavaScript and illustrations are in `homepage/`. Generate its upload output with `node homepage/build.mjs`. All sixteen app sources remain in `apps/<slug>/`; each keeps its independent manifest and lockfile, Astro 7.4.2, TypeScript 6.0.3, Astro Check 0.9.12 and Bun 1.4.4. No server adapter or runtime backend is needed.

Build an app inside its folder with `bun install --frozen-lockfile` and `bun run build`, or build the collection with `bun _implementation/verify.ts build`. Publish the contents of each `dist/`, including local fonts, scripts, media and the original response headers. Never publish research tooling, credentials or node_modules.

GitHub Actions now checks, tests, builds and deploys all 21 Direct Upload projects on pushes to main. The first automatic run passed 646/646 production HTTP checks. See deployment/automation-result.json and deployment/README.md.

## Publication and verification

[deployment/README.md](deployment/README.md) records the repeatable authenticated upload workflow, API references, credential handling, DNS, redirect and response policies. [deployment/status.json](deployment/status.json) records deployment IDs and the latest actual release status. [deployment/evidence/](deployment/evidence/) contains measured builds, tests, audits, HTTP verification and initial failed attempts.

All apps preserve their source notes, privacy controls and local assets. Canonical Quran text and commentary retain their existing editions and attribution. Editorial activities do not claim independent scholarly certification. Understand Salah Lab's bundled Al-Fatiha audio retains its separate CC BY-SA 4.0 attribution. See each app's Sources page and provenance files for exact rights and source limits.

Older implementation reports and release ZIP references in historical context describe earlier artifacts, several of which are absent from this checkout. The current deployment uploads regenerated app directories directly and does not rely on those archives.
