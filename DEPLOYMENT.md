# Moongazer hosting

The directory is published at [moongazer.tech](https://moongazer.tech/). Each app has its own Cloudflare Pages project and full-name subdomain. The www hostname redirects to the apex, preserving path and query.

## Hosting inventory

| App | Production URL | Pages project |
| --- | --- | --- |
| Moongazer directory | [moongazer.tech](https://moongazer.tech/) | `moongazer` |
| Guess the Surah | [guess-the-surah.moongazer.tech](https://guess-the-surah.moongazer.tech/) | `moongazer-guess-the-surah` |
| Quran Connections | [quran-connections.moongazer.tech](https://quran-connections.moongazer.tech/) | `moongazer-quran-connections` |
| The Seerah Detective | [the-seerah-detective.moongazer.tech](https://the-seerah-detective.moongazer.tech/) | `moongazer-the-seerah-detective` |
| Everyday Akhlaq | [everyday-akhlaq-simulator.moongazer.tech](https://everyday-akhlaq-simulator.moongazer.tech/) | `moongazer-everyday-akhlaq-simulator` |
| Interactive Seerah Timeline | [interactive-seerah-timeline.moongazer.tech](https://interactive-seerah-timeline.moongazer.tech/) | `moongazer-interactive-seerah-timeline` |
| Quran Memorization Workload Calculator | [quran-memorization-workload-calculator.moongazer.tech](https://quran-memorization-workload-calculator.moongazer.tech/) | `moongazer-quran-memorization-workload-calculator` |
| Is This Actually in the Quran? | [is-this-actually-in-the-quran.moongazer.tech](https://is-this-actually-in-the-quran.moongazer.tech/) | `moongazer-is-this-actually-in-the-quran` |
| Quran Concept Atlas | [quran-concept-atlas.moongazer.tech](https://quran-concept-atlas.moongazer.tech/) | `moongazer-quran-concept-atlas` |
| The Islamic Knowledge Escape Room | [islamic-knowledge-escape-room.moongazer.tech](https://islamic-knowledge-escape-room.moongazer.tech/) | `moongazer-islamic-knowledge-escape-room` |
| Stories of the Prophets Explorer | [stories-of-the-prophets-explorer.moongazer.tech](https://stories-of-the-prophets-explorer.moongazer.tech/) | `moongazer-stories-of-the-prophets-explorer` |
| Quranic Places Atlas | [quranic-places-atlas.moongazer.tech](https://quranic-places-atlas.moongazer.tech/) | `moongazer-quranic-places-atlas` |
| Islamic Concept Connections | [islamic-concept-connections.moongazer.tech](https://islamic-concept-connections.moongazer.tech/) | `moongazer-islamic-concept-connections` |
| Islamic History Timeline Challenge | [islamic-history-timeline-challenge.moongazer.tech](https://islamic-history-timeline-challenge.moongazer.tech/) | `moongazer-islamic-history-timeline-challenge` |
| Understand Salah Lab | [understand-salah-lab.moongazer.tech](https://understand-salah-lab.moongazer.tech/) | `moongazer-understand-salah-lab` |
| Quranic Parables Studio | [quranic-parables-studio.moongazer.tech](https://quranic-parables-studio.moongazer.tech/) | `moongazer-quranic-parables-studio` |
| Islamic Civilization Timeline | [islamic-civilization-timeline.moongazer.tech](https://islamic-civilization-timeline.moongazer.tech/) | `moongazer-islamic-civilization-timeline` |
| Halal Business Decisions | [halal-business-decisions.moongazer.tech](https://halal-business-decisions.moongazer.tech/) | `moongazer-halal-business-decisions` |
| Revelation Context Explorer | [revelation-context-explorer.moongazer.tech](https://revelation-context-explorer.moongazer.tech/) | `moongazer-revelation-context-explorer` |
| Family Islamic Learning Challenges | [family-islamic-learning-challenges.moongazer.tech](https://family-islamic-learning-challenges.moongazer.tech/) | `moongazer-family-islamic-learning-challenges` |
| Islamic Misinformation Casebook | [islamic-misinformation-casebook.moongazer.tech](https://islamic-misinformation-casebook.moongazer.tech/) | `moongazer-islamic-misinformation-casebook` |

## Sources and builds

The directory's authoritative HTML, CSS, JavaScript and illustrations are in `homepage/`. Generate its upload output with `node homepage/build.mjs`. All twenty app sources remain in `apps/<slug>/`; each keeps its independent manifest and lockfile, Astro 7.4.2, TypeScript 6.0.3, Astro Check 0.9.12 and Bun 1.4.4. No server adapter or runtime backend is needed.

Build an app inside its folder with `bun install --frozen-lockfile` and `bun run build`, or build the collection with `bun _implementation/verify.ts build`. Publish the contents of each `dist/`, including local fonts, scripts, media and the original response headers. Never publish research tooling, credentials or node_modules.

GitHub Actions now checks, tests, builds and deploys all 21 Direct Upload projects on pushes to main. The first automatic run passed 646/646 production HTTP checks. See deployment/automation-result.json and deployment/README.md.

## Publication and verification

[deployment/README.md](deployment/README.md) records the repeatable authenticated upload workflow, API references, credential handling, DNS, redirect and response policies. [deployment/status.json](deployment/status.json) records deployment IDs and the latest actual release status. [deployment/evidence/](deployment/evidence/) contains measured builds, tests, audits, HTTP verification and initial failed attempts.

All apps preserve their source notes, privacy controls and local assets. Canonical Quran text and commentary retain their existing editions and attribution. Editorial activities do not claim independent scholarly certification. Understand Salah Lab's bundled Al-Fatiha audio retains its separate CC BY-SA 4.0 attribution. See each app's Sources page and provenance files for exact rights and source limits.

Older implementation reports and release ZIP references in historical context describe earlier artifacts, several of which are absent from this checkout. The current deployment uploads regenerated app directories directly and does not rely on those archives.
