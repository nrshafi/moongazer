from pathlib import Path
import json, shutil, hashlib
from content import ROOT

research=ROOT/'_implementation/research'
quran=json.loads((research/'quran-snapshot.json').read_text(encoding='utf-8'))
activities=json.loads((research/'activity-seed.json').read_text(encoding='utf-8'))
history=json.loads((research/'history-seed.json').read_text(encoding='utf-8'))
provenance=json.loads((research/'provenance.json').read_text(encoding='utf-8'))

def passage(ref):
    chapter,span=ref.split(':')
    start,end=(span.split('-') if '-' in span else (span,span))
    parts=[quran['verses'][f'{chapter}:{number}'] for number in range(int(start),int(end)+1)]
    assert all(p['arabic'] and p['translation'] for p in parts)
    return dict(ref=ref,arabic='\n'.join(p['arabic'] for p in parts),translation='\n'.join(p['translation'] for p in parts),url=f'https://quran.com/{ref}',translationUrl=f'https://quran.com/{ref}?translations=19')

puzzles=[]
for p in activities['connections']:
    tafsir=quran['tafsir'][p['anchor']]
    puzzles.append(dict(**p,passages=[passage(ref) for ref in p['refs']],commentaryUrl=tafsir['citation_url']))
scenarios=[]
for s in activities['scenarios']:
    scenarios.append(dict(**s,passage=passage(s['ref']),commentaryUrl=quran['tafsir'][s['ref']]['citation_url']))
case_refs={'the-first-witness':['96:1-5'],'two-in-the-cave':['9:40'],'a-direction-changes':['2:144'],'the-archers-instruction':['3:152'],'the-journey-s-purpose':['48:18']}
for c in history['cases']:c['passages']=[passage(ref) for ref in case_refs.get(c['id'],[])]
event_refs={'the-first-revelation':['96:1-5'],'the-cave-during-the-migration':['9:40'],'the-change-of-qiblah':['2:144'],'supplication-at-badr':['3:123'],'the-pledge-beneath-the-tree':['48:18'],'the-death-of-the-prophet':['3:144']}
for e in history['events']:e['passages']=[passage(ref) for ref in event_refs.get(e['id'],[])]
bundles={
 'guess-the-surah':dict(chapters=quran['chapters'],verses={f'{n}:1':quran['verses'][f'{n}:1'] for n in range(1,115)}),
 'ayah-threads':dict(puzzles=puzzles),
 'seerah-detective':dict(cases=history['cases']),
 'everyday-akhlaq':dict(scenarios=scenarios),
 'seerah-timeline':dict(events=history['events']),
}
for slug,data in bundles.items():
    app=ROOT/'apps'/slug
    (app/'src/data/content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    sources={}
    def source(label,url,kind='Quran passage',note=''):
        sources[url]=dict(label=label,url=url,kind=kind,note=note)
    if slug=='guess-the-surah':
        for chapter in quran['chapters']:source(f"{chapter['name_simple']} · {chapter['number']}:1",f"https://quran.com/{chapter['number']}:1?translations=19",note='Opening ayah; Pickthall translation. Structural metadata came from fetch_quran_metadata.')
    if 'puzzles' in data:
        for puzzle in data['puzzles']:
            for p in puzzle['passages']:source(f"Quran {p['ref']} · Pickthall",p['translationUrl'])
            source(f"Al-Tafsir al-Muyassar · {puzzle['anchor']}",puzzle['commentaryUrl'],'Tafsir','Arabic commentary by the King Fahd Quran Printing Complex committee. Retrieved for source checking; full commentary is not republished.')
    if 'scenarios' in data:
        for scenario in data['scenarios']:
            p=scenario['passage'];source(f"Quran {p['ref']} · Pickthall",p['translationUrl'])
            source(f"Al-Tafsir al-Muyassar · {p['ref']}",scenario['commentaryUrl'],'Tafsir','Arabic commentary retrieved for source checking. Fictional applications are separately labeled.')
    for item in data.get('cases',[])+data.get('events',[]):
        for s in item['sources']:source(s['label'],s['url'],s['kind'],'Original concise paraphrase of the identified report. Read the full source for context.')
        for p in item['passages']:source(f"Quran {p['ref']} · Pickthall",p['translationUrl'])
    (app/'src/data/sources.json').write_text(json.dumps(list(sources.values()),ensure_ascii=False,indent=2),encoding='utf-8')
    (app/'src/data/provenance.json').write_text(json.dumps({**provenance,'app':slug,'appContentSha256':hashlib.sha256((app/'src/data/content.json').read_bytes()).hexdigest()},ensure_ascii=False,indent=2),encoding='utf-8')
    for file in (research/'fonts').iterdir():shutil.copyfile(file,app/'public/fonts'/file.name)
    (app/'src/pages/sources.astro').write_text('''---
import Shell from '../layouts/Shell.astro';
import config from '../data/config.json';
import sources from '../data/sources.json';
import provenance from '../data/provenance.json';
---
<Shell title="Sources & methodology" active="sources"><article class="prose"><span class="eyebrow">Follow the reference</span><h1>Sources & methodology</h1><p>Every activity in {config.name} points back to its source. Source text, editorial summaries, and fictional applications are kept distinct.</p><h2>Quran Foundation MCP</h2><p>Canonical Arabic text, selected translations, and structural metadata were retrieved from <a href="https://mcp.quran.ai" target="_blank" rel="noopener noreferrer">Quran Foundation's official Quran MCP</a>. The checked-in snapshot makes the activity usable without a live API connection.</p><ul><li>Arabic edition: Uthmani Hafs, <code>{provenance.quranEdition}</code>. Retrieved Arabic is preserved without rewriting.</li><li>English translation: Marmaduke Pickthall, <code>{provenance.translationEdition}</code>. His historical English wording is retained rather than silently modernized. The original translation is public domain; the source edition is attributed.</li><li>Structural metadata uses the provider's chapter order, ayah counts, and revelation classifications. Classifications are catalog metadata and can differ in scholarly discussions.</li><li>When commentary is referenced, the retrieved source is Al-Tafsir al-Muyassar, the King Fahd Quran Printing Complex committee's concise Arabic commentary. Exact passage links are provided. Full commentary text is not redistributed.</li></ul><p class="micro">Grounded with quran.ai: fetch_quran(used references, ar-uthmani-hafs), fetch_translation(used references, en-pickthall), fetch_quran_metadata(manzil 1–7); referenced commentary was retrieved with fetch_tafsir(used anchors, ar-muyassar). The app's source list below identifies its own references.</p><h2>Reports and editorial work</h2><p>Historical report references use the named Sahih al-Bukhari or Sahih Muslim entries hosted on Sunnah.com. Historical summaries and evidence cards are concise original paraphrases. They do not reproduce modern English hadith translations. No personal blogs or unsourced articles are used.</p><p>Historical date bands are approximate navigation aids. A report supporting an event does not necessarily establish its displayed CE year. Event notes identify uncertainty and disputed placement. The timeline covers the prophetic mission rather than claiming to be an exhaustive biography.</p><p>Activity themes and fictional consequences involve editorial reasoning beyond the fetched canonical text. They are not scholarly rulings or opinions from quran.ai, Quran.com, or Quran Foundation. The apps do not claim independent scholarly certification. A matching answer identifies the intended activity answer, not the only possible observation about a passage.</p><h2>Snapshot and reuse</h2><p>Retrieved on 27 October 2026. Version 1.0.0. The source snapshot, provenance, and content checksum are included in the project folder. DM Sans, Newsreader, and Amiri are hosted locally under the SIL Open Font License; their license files are included with the fonts. Original application code is supplied under MIT.</p><p class="micro">Canonical snapshot SHA-256: <code style="overflow-wrap:anywhere">{provenance.snapshotSha256}</code></p><h2>References used in this app</h2><p>{sources.length} linked sources. Each opens the source provider in a new tab.</p><ul class="source-list">{sources.map(source=><li><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a><small>{source.kind}{source.note ? ` · ${source.note}` : ''}</small></li>)}</ul><div class="actions top-gap"><a class="button" href="/">Return to the activity</a><button class="button secondary" data-print>Print source notes</button></div></article></Shell>
''',encoding='utf-8')
    (app/'LICENSE').write_text('MIT License\n\nCopyright (c) 2026 Islamic Product Lab\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nThird-party material retains its own attribution and terms. Quran text and historical Pickthall translation are attributed in the application. Font licenses are in public/fonts. Full third-party commentary and modern English hadith translations are not republished.\n',encoding='utf-8')
    print(slug,':',len(sources),'sources')
