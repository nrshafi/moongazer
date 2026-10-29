from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
if '# Deploy the first ten Astro apps' in (ROOT/'DEPLOYMENT.md').read_text(encoding='utf-8'):
 print('Batch-two documentation already exists. Edit the guides directly.');raise SystemExit(0)
p=ROOT/'DEPLOYMENT.md';s=p.read_text(encoding='utf-8').replace('# Deploy the first five Astro apps','# Deploy the first ten Astro apps').replace('The first five shortlisted projects are independent static applications. The other 15 shortlisted apps are deferred.','The first ten shortlisted projects are independent static applications. Entries 11–20 are deferred.').replace('All five include','All ten include')
marker='| Interactive Seerah Timeline | `apps/interactive-seerah-timeline` | 4325 | 36 event records, period and topic filters, search, source and date notes, bookmarks, print and event pages |'
rows='''
| Quran Memorization Workload Calculator | `apps/quran-memorization-workload-calculator` | 4326 | Time-budget model, growing revision load, feasibility checks, study-day schedule, full CSV, first-90-session calendar export |
| Is This Actually in the Quran? | `apps/is-this-actually-in-the-quran` | 4327 | All 6,236 Arabic and Pickthall ayahs, local wording search, reference ranges, chapter filters, citations and fragment-based sharing |
| Quran Concept Atlas | `apps/quran-concept-atlas` | 4328 | 30 themes, 90 selected readings, connected topic paths, filters, bookmarks, exported reading lists, 30 static topic pages |
| The Islamic Knowledge Escape Room | `apps/islamic-knowledge-escape-room` | 4329 | Eight rooms, four lock types per room, source shelf, hints and solutions, optional timer and recovery |
| Stories of the Prophets Explorer | `apps/stories-of-the-prophets-explorer` | 4330 | 25 profiles, 50 Quran readings, 25 passage-specific questions, filters, bookmarks and reading-list export |'''
s=s.replace(marker,marker+rows)
marker='- [Seerah Timeline upload](release/interactive-seerah-timeline-pages.zip)'
s=s.replace(marker,marker+'''
- [Memorization Calculator upload](release/quran-memorization-workload-calculator-pages.zip)
- [Quran Wording Checker upload](release/is-this-actually-in-the-quran-pages.zip)
- [Quran Concept Atlas upload](release/quran-concept-atlas-pages.zip)
- [Knowledge Escape Room upload](release/islamic-knowledge-escape-room-pages.zip)
- [Prophets Explorer upload](release/stories-of-the-prophets-explorer-pages.zip)''')
s+='''
## Second implementation batch

Apps 6–10 use the same independent build arrangement. The quotation checker loads its complete local corpus on first search, as a static JavaScript chunk of about 3 MB before hosting compression. This chunk is expected to trigger Vite’s generic 500 kB warning; it is below Pages’ 25 MiB asset limit. There are no runtime external API calls.

The official Quran MCP snapshot is `_implementation/research/quran-full.json`; its request and checksum record is `batch2-provenance.json`. Every Arabic/English passage is checked against it by `verify-static.py`, including all 6,236 checker records. Topic and escape-room commentary references reuse the first batch’s retrieved Al-Tafsir al-Muyassar anchors. Story titles and comprehension checks are editorial aids grounded in the selected text; they do not add a full biography or claim scholarly certification.

For batch two only, use `bun _implementation/verify.ts check --batch2`, `test --batch2`, or `build --batch2`. Without that flag, verification covers all ten apps. The batch-two scaffold/page/test generators were one-time preparation tools; edit app sources and tests directly. `batch2-data.py` regenerates content/provenance from the verified full snapshot and the curated question records. After any source change, rebuild and repackage. See [BATCH2_QA.md](BATCH2_QA.md) for verification and screenshots.
'''
p.write_text(s,encoding='utf-8')
p=ROOT/'STATIC_APPS_SHORTLIST.md';s=p.read_text(encoding='utf-8').replace('The first five entries now have independent Astro implementations using Bun. The remaining 15 entries are deferred.','The first ten entries now have independent Astro implementations using Bun. The remaining ten entries (11–20) are deferred.').replace('The first five are implemented in separate `apps/` folders; entries 6 through 20 remain for later implementation.','The first ten are implemented in separate `apps/` folders; entries 11 through 20 remain for later implementation.').replace('The first five Astro applications are implemented and packaged for Cloudflare Pages. Entries 6 through 20 are deferred.','The first ten Astro applications are implemented and packaged for Cloudflare Pages. Entries 11 through 20 are deferred.');p.write_text(s,encoding='utf-8')
p=ROOT/'README.md';s=p.read_text(encoding='utf-8').replace('The first five shortlisted projects','The first ten shortlisted projects').replace('The remaining 15 shortlisted projects are deferred.','The remaining ten shortlisted projects (11–20) are deferred. Batch-two verification is in [BATCH2_QA.md](BATCH2_QA.md).').replace('## Scope','## Earlier demo scope').replace('The Quran quotation checker indexes four verses and cannot establish absence from the complete Quran.','The earlier standalone HTML quotation-checker demo indexes four verses. Its new Astro implementation in `apps/is-this-actually-in-the-quran` includes all 6,236 ayahs in Arabic and Pickthall English.');p.write_text(s,encoding='utf-8')
p=ROOT/'PROJECT_RANKING.md';s=p.read_text(encoding='utf-8').replace('The first five projects from the revised static shortlist are now implemented','The first ten projects from the revised static shortlist are now implemented').replace('The other 15 shortlisted apps are deferred.','The other ten shortlisted apps are deferred.');p.write_text(s,encoding='utf-8')
