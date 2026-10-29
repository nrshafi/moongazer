from pathlib import Path
from html import escape
import json,re
from demo_kit import ROOT,CSS,JS

ENTRIES=[
('quran-connections','Quran Connections','Games','Connect three passage summaries through a shared theme.'),
('islamic-knowledge-escape-room','The Islamic Knowledge Escape Room','Games','Solve three source-based locks to open the next room.'),
('interactive-seerah-timeline','Interactive Seerah Timeline','Explorers','Browse events, approximate dates, places, and report references.'),
('revelation-context-explorer','Revelation Context Explorer','Explorers','Inspect passage contexts alongside specific transmitted reports.'),
('quran-concept-atlas','Quran Concept Atlas','Explorers','Follow editorial theme links to their supporting passages.'),
('hadith-narrator-network','Hadith Narrator Network','Explorers','Compare documented chains and highlight shared transmitters.'),
('islamic-scholars-network','Islamic Scholars Network','Explorers','Inspect evidence-backed transmission relationships.'),
('quranic-places-atlas','Quranic Places Atlas','Explorers','Explore a schematic map with identification uncertainty.'),
('islamic-terminology-map','Islamic Terminology Map','Explorers','Select terms and explore their conceptual relationships.'),
('islamic-knowledge-duels','Islamic Knowledge Duels','Games','Play locally or exchange a manual asynchronous challenge code.'),
('guess-the-surah','Guess the Surah','Games','Reveal clues and identify the surah with fewer hints.'),
('islamic-history-timeline-challenge','Islamic History Timeline Challenge','Games','Move sourced events into chronological order.'),
('the-1000-question-journey','The 1000 Question Journey','Games','Try a six-question sample with local progress.'),
('stories-of-the-prophets-explorer','Stories of the Prophets Explorer','Stories','Read three source-backed chapters and answer comprehension questions.'),
('quranic-parables-studio','Quranic Parables Studio','Stories','Explore three parables through diagrams and guided questions.'),
('everyday-akhlaq-simulator','Everyday Akhlaq Simulator','Scenarios','Practice responses to fictional everyday ethical situations.'),
('halal-business-decisions','Halal Business Decisions','Scenarios','Inspect disclosure, debt terms, and a loan-related concern.'),
('zakat-case-study-simulator','Zakat Case Study Simulator','Scenarios','Compare fictional asset and policy cases with transparent arithmetic.'),
('conflict-resolution-scenarios','Conflict Resolution Scenarios','Scenarios','Practice verification, respectful discussion, and fair mediation.'),
('is-this-actually-in-the-quran','Is This Actually in the Quran?','Research','Check four indexed verses and distinguish matches from topic candidates.'),
('islamic-misinformation-casebook','Islamic Misinformation Casebook','Research','Investigate illustrative claims using documented source passages.'),
('zakat-scenario-calculator','Zakat Scenario Calculator','Calculators','Change assets, nisab conventions, and calculation assumptions.'),
('inheritance-share-learning-simulator','Inheritance Share Learning Simulator','Calculators','Inspect exact shares for three supported family configurations.'),
('quran-memorization-workload-calculator','Quran Memorization Workload Calculator','Calculators','Estimate new study and growing revision time, then export your plan.'),
('islamic-concept-connections','Islamic Concept Connections','Games','Group related terms into intended learning categories.'),
('quran-word-search','Quran Word Search','Games','Select Arabic letters along straight paths in three vocabulary grids.'),
('family-islamic-learning-challenges','Family Islamic Learning Challenges','Family','Discuss age-banded lessons and record shared activities locally.')]

source=ROOT.joinpath('islamic_product_atlas.html').read_text(encoding='utf-8-sig')
decoded=json.loads(source) if source.lstrip().startswith('"') else source
ref=ROOT/'_reference';ref.mkdir(exist_ok=True)
(ref/'atlas.html').write_text(decoded,encoding='utf-8')
cards=''.join(f'<article class="card" data-category="{cat}" data-search="{escape((title+" "+desc+" "+cat).lower(),quote=True)}"><span class="tag">{cat}</span><h2><a href="{slug}.html">{escape(title)}</a></h2><p>{escape(desc)}</p><div class="row"><a class="button" href="{slug}.html#demo">Try demo</a><a href="{slug}.html#build">Build guide</a></div></article>' for slug,title,cat,desc in ENTRIES)
options=''.join(f'<option>{cat}</option>' for cat in dict.fromkeys(x[2] for x in ENTRIES))
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>27 working demos | Islamic Product Lab</title><style>{CSS}
.catalog{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:25px}}.catalog .card{{display:flex;flex-direction:column;gap:12px;min-height:280px;border-top:4px solid var(--accent)}}.catalog h2{{font:normal 25px/1.2 Georgia,serif;margin:8px 0 0}}.catalog h2 a{{color:var(--ink);text-decoration:none}}.catalog p{{margin:0 0 12px;color:var(--muted);flex:1}}.catalog .tag{{align-self:start}}.intro{{display:grid;grid-template-columns:1.5fr 1fr;gap:30px;align-items:center;padding:20px 0 28px}}.scope{{padding:24px;border:1px solid var(--line);background:white;border-radius:12px}}.toolbar{{display:grid;grid-template-columns:1fr 220px;gap:18px}}.toolbar label{{margin:0}}@media(max-width:900px){{.catalog{{grid-template-columns:repeat(2,minmax(0,1fr))}}.intro{{grid-template-columns:1fr}}}}@media(max-width:580px){{.catalog,.toolbar{{grid-template-columns:1fr}}}}
</style></head><body><header><strong>Islamic Product Lab</strong><nav aria-label="Main"><a href="#catalog">Explore demos</a><a href="#use">How to use</a><a href="_reference/atlas.html">Original atlas, readable copy</a></nav></header><main><section class="intro"><div><div class="eyebrow">Your shortlist · 16 October 2026</div><h1>Twenty-seven ideas.<br>Try the core of each.</h1><p class="lead">Working local prototypes for your Islamic Product Atlas shortlist. Every app includes its next features, implementation steps, recommended stack, and low-cost deployment guide.</p><a class="button" href="#catalog">Browse all 27 demos</a></div><aside class="scope"><h2>What you can try</h2><p>Play a round, explore a source, make a decision, or change a calculation. Each demo is a standalone HTML file.</p><p>Sample content is deliberately small. Local progress stays in this browser. Accounts, online play, and live prices require production work.</p><span class="tag">Offline interactions · no installation</span></aside></section><section id="use"><details><summary>How to use these prototypes</summary><ol><li>Open an app and complete its core activity.</li><li>Read its Build this app section for implementation and deployment details.</li><li>Use the source links to inspect the referenced passages and reports.</li><li>Test the concept with intended users before expanding the content bank.</li></ol><p>Source links need internet access. Local storage can be unavailable or cleared. The calculators are illustrative learning tools with explicit limits.</p><p>The original atlas file remains unchanged. A decoded HTML copy is in <a href="_reference/atlas.html">_reference/atlas.html</a>.</p></details></section><section id="catalog"><h2 style="margin-top:30px">Explore the shortlist</h2><div class="toolbar"><label>Search apps<input id="search" type="search" placeholder="Try narrator, zakat, Arabic..." style="width:100%"></label><label>Category<select id="category" style="width:100%"><option value="all">All categories</option>{options}</select></label></div><p id="count" role="status">27 demos</p><div class="catalog">{cards}</div><p id="empty" class="notice" hidden>No apps match. Clear the search or choose all categories.</p></section><footer>27 standalone demos plus this catalog. Source content and scholarly interpretations need editorial review before public launch. Hosting facts in each guide were checked on 16 October 2026.</footer></main><script>{JS}
function filter(){{const q=$('#search').value.toLowerCase().trim(),cat=$('#category').value;let count=0;$$('.catalog article').forEach(c=>{{const show=(!q||c.dataset.search.includes(q))&&(cat==='all'||cat===c.dataset.category);c.hidden=!show;if(show)count++}});$('#count').textContent=count+' of 27 demos';$('#empty').hidden=count>0}}$('#search').oninput=filter;$('#category').onchange=filter;
</script></body></html>'''
(ROOT/'index.html').write_text(html,encoding='utf-8')
(ROOT/'demo-manifest.json').write_text(json.dumps([dict(slug=s,title=t,category=c,description=d,file=s+'.html') for s,t,c,d in ENTRIES],ensure_ascii=False,indent=2),encoding='utf-8')
print('Built catalog, 27-entry manifest, and decoded reference copy.')
