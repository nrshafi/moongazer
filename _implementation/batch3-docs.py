from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
p=ROOT/'DEPLOYMENT.md';s=p.read_text(encoding='utf-8')
if '# Deploy the first fifteen Astro apps' in s:raise SystemExit('Documentation already updated. Edit the guides directly.')
s=s.replace('# Deploy the first ten Astro apps','# Deploy the first fifteen Astro apps').replace('The first ten shortlisted projects are independent static applications. Entries 11–20 are deferred.','The first fifteen shortlisted projects are independent static applications. Entries 16–20 are deferred.').replace('All ten include','All fifteen include').replace('The preview command serves the five built sites','The preview command serves the fifteen built sites')
marker='| Stories of the Prophets Explorer | `apps/stories-of-the-prophets` | 4330 | 25 profiles, 50 Quran readings, 25 passage-specific questions, filters, bookmarks and reading-list export |'
s=s.replace(marker,marker+'''
| Quranic Places Atlas | `apps/places-in-the-quran` | 4331 | 15 entries, five contextual markers, local Natural Earth map, location evidence notes, filters and bookmarks |
| Islamic Concept Connections | `apps/word-groups` | 4332 | 16 grouping puzzles, 20 source-backed categories, hints, retries, seeded links, optional recovery |
| Islamic History Timeline Challenge | `apps/islamic-history-timeline-challenge` | 4333 | 12 four-event challenges, 14 event records, accessible ordering, source clues, date notes and recovery |
| Understand Salah Lab | `apps/understand-your-salah` | 4334 | 15 meaning lessons, 7 canonical Al-Fatiha ayahs, 8 hadith recitations, local licensed full-surah audio, practice and checks |
| Quranic Parables Studio | `apps/parables-of-the-quran` | 4335 | 14 readings, interactive three-part diagrams, commentary, comprehension, private note copy/download and bookmarks |''')
marker='- [Prophets Explorer upload](release/stories-of-the-prophets-pages.zip)'
s=s.replace(marker,marker+'''
- [Quranic Places Atlas upload](release/places-in-the-quran-pages.zip)
- [Islamic Concept Connections upload](release/word-groups-pages.zip)
- [History Timeline Challenge upload](release/islamic-history-timeline-challenge-pages.zip)
- [Understand Salah Lab upload](release/understand-your-salah-pages.zip)
- [Quranic Parables Studio upload](release/parables-of-the-quran-pages.zip)''')
s=s.replace('The canonical snapshot contains 225 ayahs and 43 Al-Tafsir al-Muyassar commentary records used for source checking.','The first batch snapshot contains 225 ayahs and 43 Al-Tafsir al-Muyassar commentary records. The complete snapshot added in batch two contains all 6,236 ayahs in Arabic and Pickthall English. Batch three adds 40 commentary anchors, full parable context, and Al-Jalalayn for 24:35.')
s+='''
## Third implementation batch

Apps 11–15 were completed on 28 October 2026. Normal builds use only local assets. New source preparation used the official Quran MCP for commentary and existing canonical Arabic/English, UNGEGN and UNESCO for contextual coordinates, Natural Earth for public-domain land geometry, and named Sahih reports for prayer recitations and historical event summaries.

The Salah app bundles an approximately 50-second Al-Fatiha recording by Adeel Shaikh under CC BY-SA 4.0, downloaded as Wikimedia’s MP3 transcode. Attribution and the license link are beside the player, on the Sources page, and in `public/audio/ATTRIBUTION.txt`. It plays the whole surah. Other recitations are text lessons. The recording retains its own license independently of MIT application code.

The history game is explicitly a prophetic-mission edition, not an exhaustive history library. Broad conventional chronology is scored; date/source limitations are shown in each solution. Places markers show city/heritage context, not a claim to have geolocated a Quranic scene. Ten place entries remain unpinned rather than receiving invented coordinates.

For batch three use `bun _implementation/verify.ts check --batch3`, `test --batch3`, or `build --batch3`. Without a batch flag, verification covers all fifteen apps. Earlier `--batch2` is limited to apps 6–10. `python _implementation/verify-static.py` validates every built app. `python _implementation/package-release.py` packages all built apps and writes CRC-checked archive hashes.

New source preparation and design decisions are in `_implementation/batch3-*.py`, `fetch-batch3*.ts`, `research/batch3/`, and `DESIGN_BATCH3.md`. Scaffold/page/test generators were one-time preparation tools. Edit app sources and tests directly. Source data generators can regenerate their own bundles from the verified snapshot; rebuild and repackage after any change. See [BATCH3_QA.md](BATCH3_QA.md) for evidence.

The final five deferred apps are Islamic Civilization Timeline, Halal Business Decisions, Revelation Context Explorer, Family Islamic Learning Challenges, and Islamic Misinformation Casebook.
'''
p.write_text(s,encoding='utf-8')
p=ROOT/'STATIC_APPS_SHORTLIST.md';s=p.read_text(encoding='utf-8').replace('Updated 27 October 2026. The first ten entries now have independent Astro implementations using Bun. The remaining ten entries (11–20) are deferred.','Updated 28 October 2026. The first fifteen entries now have independent Astro implementations using Bun. The remaining five entries (16–20) are deferred.').replace('The first ten are implemented in separate `apps/` folders; entries 11 through 20 remain for later implementation.','The first fifteen are implemented in separate `apps/` folders; entries 16 through 20 remain for later implementation.').replace('The first ten Astro applications are implemented and packaged for Cloudflare Pages. Entries 11 through 20 are deferred.','The first fifteen Astro applications are implemented and packaged for Cloudflare Pages. Entries 16 through 20 are deferred.');p.write_text(s,encoding='utf-8')
p=ROOT/'PROJECT_RANKING.md';s=p.read_text(encoding='utf-8').replace('The first ten projects from the revised static shortlist are now implemented','The first fifteen projects from the revised static shortlist are now implemented').replace('The other ten shortlisted apps are deferred.','The other five shortlisted apps are deferred.');p.write_text(s,encoding='utf-8')
