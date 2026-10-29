# First five applications

The first five shortlisted projects are implemented as independent Astro static sites in `apps/`. Bun runs development, checks, tests, and production builds. Each app has its own dependencies, lockfile, content snapshot, and deployable `dist/`.

## Visual direction

The collection uses the readable teal learning palette associated with Quran.com and the quiet borders and spacing of focused productivity interfaces such as Linear. This is an original interface, not a copy of either site.

Shared colors: white `#ffffff`, cool background `#f5f8fa`, dark navy `#101a24`, ink `#172a35`, deep teal `#087f75`, muted text `#60737f`. The case-file app uses a restrained blue accent; ethical scenarios use a muted violet accent. Both light and dark palettes meet the same hierarchy. The first visit follows the operating system, with an explicit accessible theme toggle.

Typography: locally hosted DM Sans for interface text, Newsreader for a small number of editorial headings, and Amiri for Arabic. If the optional font download is unavailable, use system sans, Georgia, and an Arabic serif fallback. Source font licenses accompany hosted files.

Each page opens with the activity, rather than a large marketing banner. A small wordmark, task-focused navigation, and a compact intro frame the activity. Rounded panels are limited to interactive objects. The signature elements are a progressive clue stack, linked passage cards, an evidence board, a branching choice panel, and a chronological event rail.

The default look is a bright white working surface. Dark mode changes surfaces, text, borders, and focus states together. Motion is limited to short state changes and respects reduced-motion preferences.

## Release scope

- Guess the Surah: all 114 surahs, practice filters, seeded challenge links, progressive hints, round scoring, explanations, result sharing, and optional resumable rounds.
- Quran Connections: 30 original passage puzzles with exact Arabic source text, attributed translation, intended themes, hints, explanations, and practice or seeded challenge links.
- The Seerah Detective: 12 sourced investigations, evidence cards, competing explanations, hints, case conclusions, and related references.
- Everyday Akhlaq Simulator: 20 fictional scenarios with two decisions, response-specific consequences, source notes, and a final reflection. Applications are labeled as editorial reasoning rather than religious rulings.
- Interactive Seerah Timeline: 36 sourced event entries, era and topic filters, accessible chronology and detail views, uncertainty notes, bookmarks, event links, and print support.

Every app also has source methodology, privacy/storage controls, 404 handling, accessible keyboard controls, responsive layouts, and a no-JavaScript explanation or readable fallback.

Quran content is retrieved during preparation with the official public Quran MCP. A checked-in snapshot and provenance manifest make normal builds network-independent. Seerah records also use specifically verified Sahih al-Bukhari and Sahih Muslim reports hosted on Sunnah.com. No personal blogs are used.

All five run without accounts or runtime APIs. Browser persistence is optional, namespaced per app, validated, and ignored after 30 days. Clearing storage does not prevent any core task. Client-side scores are informal.
