"""Render shared, accessible static page sources for batch four only."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent.parent
SLUGS=['islamic-civilization-timeline','halal-business-decisions','revelation-context-explorer','family-islamic-learning-challenges','islamic-misinformation-casebook']

PASSAGE='''---
interface Props { passage?: {ref:string; arabic:string; translation:string; translationUrl:string}; }
const {passage:p}=Astro.props;
---
{p&&<section class="panel bottom-gap"><div class="panel-head"><h2>The source reading</h2><a href={p.translationUrl} target="_blank" rel="noopener noreferrer">Quran {p.ref} ↗</a></div><div class="panel-body"><p class="arabic" lang="ar" dir="rtl">{p.arabic}</p><blockquote class="source-quote">{p.translation}</blockquote><p class="micro">Marmaduke Pickthall · Uthmani Hafs Arabic · complete selected ayahs</p></div></section>}
'''
REFERENCES='''---
interface Props { sources: {label:string;url:string;kind?:string;note?:string}[]; commentaryUrl?:string; secondCommentaryUrl?:string; secondLabel?:string; }
const {sources,commentaryUrl,secondCommentaryUrl,secondLabel='Further Arabic commentary'}=Astro.props;
---
<section class="panel panel-body top-gap"><h2>Follow the evidence</h2><ul class="source-list">{sources.map(s=><li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a><small>{s.note}</small></li>)}{commentaryUrl&&<li><a href={commentaryUrl} target="_blank" rel="noopener noreferrer">Al-Tafsir al-Muyassar ↗</a><small>Fetched Arabic commentary. English notes here are original concise paraphrases.</small></li>}{secondCommentaryUrl&&<li><a href={secondCommentaryUrl} target="_blank" rel="noopener noreferrer">{secondLabel} ↗</a><small>Read the full discussion. A source link does not make every activity prompt a scholarly statement.</small></li>}</ul><p class="micro">Reports are summarized in our own words. This app does not republish modern English hadith translations.</p></section>
'''
FILTERS='''---
interface Props {topics:string[];regions?:string[];ages?:string[];timeline?:boolean;}
const {topics,regions=[],ages=[],timeline=false}=Astro.props;
---
<form id="catalog-filters" class="panel panel-body filters top-gap bottom-gap" role="search" aria-label="Find an activity">
 <label class="field search-field">Find an entry<input id="filter" type="search" placeholder="Search titles, places or topics"/></label>
 <label class="field">Topic<select id="topic"><option value="">All topics</option>{topics.map(t=><option>{t}</option>)}</select></label>
 {regions.length>0&&<label class="field">Region<select id="region"><option value="">All regions</option>{regions.map(r=><option>{r}</option>)}</select></label>}
 {ages.length>0&&<label class="field">Suggested age<select id="age"><option value="">All ages</option>{ages.map(a=><option>{a}</option>)}</select></label>}
 {timeline&&<><label class="field year-field">From year CE<input id="from-year" type="number" min="600" max="1700" placeholder="661"/></label><label class="field year-field">To year CE<input id="to-year" type="number" min="600" max="1700" placeholder="1648"/></label></>}
 <label class="check"><input id="saved-only" type="checkbox"/>Saved only</label><button class="button secondary" type="reset">Reset filters</button>
 <p id="filter-error" class="micro" role="status"></p><span id="count" class="micro" aria-live="polite"></span>
</form>
'''
LIBRARY=r'''import content from '../data/content.json';
import { read, write, copy, announce } from './utils';
import { matchesFilters, type Filters } from './catalog';

const cards = [...document.querySelectorAll<HTMLElement>('[data-item-id]')];
const entries = Object.values(content).filter(Array.isArray).flat() as { id?: string }[];
const known = new Set(entries.map(entry => entry.id).filter((id): id is string => typeof id === 'string'));
const valid = (value: unknown): value is string[] => Array.isArray(value) && value.length <= known.size && new Set(value).size === value.length && value.every(id => typeof id === 'string' && known.has(id));
let saved = read('bookmarks', valid) || [];
const input = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;

function filter() {
  const filters: Filters = { query: input('filter')?.value || '', topic: input('topic')?.value || '', region: input('region')?.value || '', age: input('age')?.value || '', from: input('from-year')?.value || '', to: input('to-year')?.value || '' };
  const invalid = (filters.from !== '' && (!Number.isInteger(Number(filters.from)) || Number(filters.from) < 600 || Number(filters.from) > 1700)) || (filters.to !== '' && (!Number.isInteger(Number(filters.to)) || Number(filters.to) < 600 || Number(filters.to) > 1700)) || (filters.from !== '' && filters.to !== '' && Number(filters.from) > Number(filters.to));
  const error = document.getElementById('filter-error');
  if (error) error.textContent = invalid ? 'Use whole years from 600 to 1700, with the earlier year first.' : '';
  const only = (input('saved-only') as HTMLInputElement | null)?.checked;
  let count = 0;
  for (const card of cards) {
    const show = !invalid && matchesFilters({ search: card.dataset.search || '', topic: card.dataset.topic || '', region: card.dataset.region || '', age: card.dataset.age || '', start: Number(card.dataset.start), end: Number(card.dataset.end) }, filters) && (!only || saved.includes(card.dataset.itemId!));
    card.hidden = !show;
    if (show) count++;
  }
  const counter = document.getElementById('count');
  if (counter) counter.textContent = `${count} of ${cards.length} entries shown`;
  const empty = document.getElementById('empty');
  if (empty) empty.hidden = count !== 0;
}

function updateSaved() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
    const active = saved.includes(button.dataset.save!);
    button.textContent = active ? 'Saved ✓' : 'Save for later';
    button.setAttribute('aria-pressed', String(active));
  });
  filter();
}

document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.save!;
    saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    if (!write('bookmarks', saved)) announce('Storage unavailable. Saved for this visit only.');
    updateSaved();
  });
});
const form = document.getElementById('catalog-filters');
form?.addEventListener('submit', event => event.preventDefault());
form?.addEventListener('input', filter);
form?.addEventListener('change', filter);
form?.addEventListener('reset', event => {
  event.preventDefault();
  for (const id of ['filter', 'topic', 'region', 'age', 'from-year', 'to-year']) {
    const control = input(id);
    if (control) control.value = '';
  }
  const only = input('saved-only') as HTMLInputElement | null;
  if (only) only.checked = false;
  filter();
});
document.querySelectorAll<HTMLButtonElement>('[data-region-filter]').forEach(button => button.addEventListener('click', () => {
  const region = input('region');
  if (region) region.value = button.dataset.regionFilter!;
  filter();
  form?.scrollIntoView({ block: 'start', behavior: 'auto' });
  region?.focus({ preventScroll: true });
}));
document.getElementById('copy-saved')?.addEventListener('click', () => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-reading-link]')].filter(link => saved.includes(link.dataset.readingLink!));
  if (!links.length) { announce('Save an entry before copying a reading list.'); return; }
  void copy(links.map(link => `${link.textContent?.trim()}\n${new URL(link.getAttribute('href')!, location.origin).href}`).join('\n\n'), 'Reading list copied');
});
updateSaved();
'''
CATALOG='''export interface Filters { query:string; topic:string; region:string; age:string; from:string; to:string; }
export interface CatalogEntry { search:string; topic:string; region:string; age:string; start:number; end:number; }
export function normalize(value: string) { return value.normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim(); }
export function matchesFilters(entry: CatalogEntry, filters: Filters) {
  const terms = normalize(filters.query).split(/\\s+/).filter(Boolean);
  return terms.every(term => normalize(entry.search).includes(term)) && (!filters.topic || entry.topic === filters.topic) && (!filters.region || entry.region === filters.region) && (!filters.age || entry.age === filters.age) && (!filters.from || entry.end >= Number(filters.from)) && (!filters.to || entry.start <= Number(filters.to));
}
'''
CSS='''
/* Batch four: readable source dossiers and short activities. */
.intro{max-width:880px}.intro h1.editorial{font-size:clamp(2.5rem,5vw,4.4rem);font-weight:450}.collection-tools{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:24px 0 16px}.collection-tools h2{margin:0;font-size:1.2rem}.year-field{max-width:130px}.filters{scroll-margin-top:100px}.filters .check{align-self:center}.dossier{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,1fr);gap:24px}.reading-note{border-left:3px solid var(--accent);padding:4px 0 4px 18px;margin:20px 0}.reading-note p:last-child{margin-bottom:0}.evidence-card{border:1px solid var(--line);border-radius:12px;margin:12px 0;background:var(--surface)}.evidence-card summary{padding:18px;font-weight:650;cursor:pointer;line-height:1.5}.evidence-card>div{padding:0 18px 18px;color:var(--muted);font-size:.9rem;line-height:1.8}.evidence-card>div p:last-child{margin:0}.choice{display:block;width:100%;text-align:left;padding:17px 18px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font-size:.93rem;line-height:1.65;margin:10px 0;overflow-wrap:anywhere}.choice:hover{border-color:var(--accent);background:var(--tint)}.choice[aria-pressed=true]{border-color:var(--accent);background:var(--tint)}.choice span{display:block;color:var(--muted);font-size:.76rem;margin-top:5px}.quiz-option{display:flex;gap:10px;align-items:start;padding:12px 0;font-size:.87rem;line-height:1.7}.quiz-option input{margin-top:7px;flex-shrink:0}.activity-card .eyebrow{margin:0}.activity-card h2 a{color:var(--ink);text-decoration:none}.activity-card h2 a:hover{color:var(--accent-ink);text-decoration:underline}.activity-card .micro{margin:0}.activity-card .actions{width:100%}.tag-row{display:flex;gap:8px;flex-wrap:wrap}.evidence-band{display:flex;align-items:center;flex-wrap:wrap;gap:14px;padding:16px 20px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--muted);font-size:.82rem;margin:26px 0}.stage-track{display:flex;gap:8px;list-style:none;padding:0;margin:0 0 24px}.stage-track li{flex:1;padding:12px 10px;border-top:3px solid var(--line);font-size:.8rem;color:var(--muted)}.stage-track li.current,.stage-track li.done{border-color:var(--accent);color:var(--accent-ink)}.ledger-row{padding:16px 0;border-bottom:1px solid var(--line)}.ledger-row:last-child{border:0}.ledger-row strong{display:block;margin-bottom:7px;font-size:.88rem}.ledger-row p{margin:0;font-size:.88rem;color:var(--muted)}.source-boundary{padding:18px;background:var(--surface-2);border-radius:12px;color:var(--muted);font-size:.84rem;line-height:1.8}.source-boundary p:last-child{margin:0}.reading-actions{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.timeline-list{display:grid;gap:16px;position:relative}.timeline-record{display:grid;grid-template-columns:160px minmax(0,1fr);gap:25px;padding:24px}.timeline-date{border-right:2px solid var(--line);padding-right:22px;font-weight:700;color:var(--accent-ink);line-height:1.6}.timeline-record h2{font-size:1.3rem;margin:0 0 9px}.timeline-record p{font-size:.9rem;color:var(--muted)}.date-ribbon{height:9px;border-radius:8px;background:var(--line);overflow:hidden;margin-top:12px}.date-ribbon span{height:100%;display:block;background:var(--accent);min-width:4px}.world-map{width:100%;height:auto;max-height:260px;display:block;background:var(--surface-2);border-radius:12px}.world-map path{fill:var(--muted);opacity:.45;stroke:none}.region-keys{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.region-keys button{border:1px solid var(--line);padding:8px 12px;border-radius:9px;background:var(--surface);color:var(--accent-ink);font-size:.78rem;min-height:38px}.compare-controls{display:grid;grid-template-columns:1fr 1fr auto;gap:14px;align-items:end}.comparison{padding:20px;margin-top:20px;border-left:3px solid var(--accent);background:var(--tint);border-radius:0 12px 12px 0}.comparison p:last-child{margin:0}.worksheet{display:grid;gap:22px}.worksheet section{break-inside:avoid}.prompt-number{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--tint);color:var(--accent-ink);font-size:.85rem;margin-right:9px}.completion{padding:24px;border:1px solid var(--accent);border-radius:14px;background:var(--tint);margin-top:24px}.completion h2{margin:0 0 12px}.print-lines{height:50px;border-bottom:1px solid var(--line);margin-top:18px}.reading-quiz{border-top:1px solid var(--line);padding-top:24px;margin-top:24px}.field input[type=number]{font-variant-numeric:tabular-nums}.bookmarks-note{max-width:750px;font-size:.8rem;color:var(--muted)}button,select,input,textarea{max-width:100%}code{overflow-wrap:anywhere}
@media(max-width:860px){.dossier{grid-template-columns:1fr}.compare-controls{grid-template-columns:1fr}.compare-controls .button{justify-self:start}.timeline-record{grid-template-columns:125px minmax(0,1fr);gap:17px}.timeline-date{font-size:.8rem;padding-right:15px}}
@media(max-width:580px){.timeline-record{grid-template-columns:1fr;padding:21px}.timeline-date{border-right:0;border-bottom:1px solid var(--line);padding:0 0 12px}.year-field{max-width:none}.evidence-band{padding:14px}.stage-track li{font-size:.7rem}.choice{padding:14px}.region-keys{gap:6px}.intro h1.editorial{font-size:2.55rem}.panel-body{min-width:0}.collection-tools .button{width:100%}}
@media print{.worksheet section{display:block!important}.worksheet .print-lines{display:block}.reading-actions,.stage-track,.activity-controls,.reading-quiz{display:none!important}.dossier{display:block}.evidence-card>div{display:block!important}.world-map{max-height:180px}.timeline-record{break-inside:avoid}.source-boundary{border:1px solid #aaa}}
'''

HERO={
 'islamic-civilization-timeline':('Connected histories','A thousand years.<br/>More than one center.','Follow twenty-four selected records across nine regions. Compare date bands, explore learning and trade, and keep the source beside each event.'),
 'halal-business-decisions':('A business decision lab','Make the choice.<br/>Then inspect the consequences.','Twelve fictional cases put disclosure, promises and fair dealing into ordinary business situations. Read what happens, then return to the sources.'),
 'revelation-context-explorer':('Reports with their limits','A passage has context.<br/>A report has limits.','Explore ten selected readings beside named reports. Distinguish a transmitted occasion from general context or a response after revelation.'),
 'family-islamic-learning-challenges':('Learn together, in one sitting','One sitting.<br/>Something to share.','Choose a short pack with one reading question, an open conversation and a shared activity. No names, profiles or daily streaks.'),
 'islamic-misinformation-casebook':('Read before repeating','Before you share it,<br/>read the evidence.','Investigate twelve source-reading claims. Open the evidence, choose a careful conclusion, and copy a correction with its references.'),
}

for slug in SLUGS:
 app=ROOT/'apps'/slug;cfg=json.loads((app/'src/data/config.json').read_text(encoding='utf-8'));data=json.loads((app/'src/data/content.json').read_text(encoding='utf-8'))
 key='events' if 'events' in data else 'readings' if 'readings' in data else 'packs' if 'packs' in data else 'cases'
 route={'events':'event','readings':'reading','packs':'pack','cases':'case'}[key]
 for name,text in [('Passage.astro',PASSAGE),('References.astro',REFERENCES),('Filters.astro',FILTERS)]: (app/'src/components'/name).write_text(text,encoding='utf-8')
 (app/'src/lib/library.ts').write_text(LIBRARY,encoding='utf-8');(app/'src/lib/catalog.ts').write_text(CATALOG,encoding='utf-8')
 css=app/'src/styles/global.css';css.write_text(css.read_text(encoding='utf-8')+CSS,encoding='utf-8')
 (app/'src/pages/sources.astro').write_text('''---
import Shell from '../layouts/Shell.astro';
import content from '../data/content.json';
import sources from '../data/sources.json';
import provenance from '../data/provenance.json';
const usesQuran=!('events' in content);
---
<Shell title="Sources & methodology" active="sources"><article class="prose"><span class="eyebrow">Evidence and editorial choices</span><h1>Sources & methodology</h1><p>{content.methodology}</p><h2>Where the material comes from</h2>{usesQuran?<><p>Arabic Quran text is the Uthmani Hafs edition, <code>ar-uthmani-hafs</code>, retrieved through <a href="https://mcp.quran.ai">Quran Foundation’s official Quran MCP</a>. English readings preserve Marmaduke Pickthall’s historical public-domain translation, <code>en-pickthall</code>. The complete canonical snapshot was retrieved {provenance.retrievedAt.slice(0,10)}. Selected Arabic commentary was fetched again for this batch using the MCP grounding rules.</p><p>Commentary links identify the exact fetched passage. Short English notes are our own concise paraphrases. Named hadith reports are summarized in original wording; modern English hadith translations are not republished. A collection attribution is not an independent scholarly review of this app.</p></>:<p>Historical records use UNESCO World Heritage Centre and the Metropolitan Museum of Art’s institutional research. Their named records support the displayed dates at their actual precision. Summaries are original and concise. No personal blog is used, and no Quran verse is presented as evidence for a later historical date. Land geometry is public-domain Natural Earth data, bundled locally.</p>}<h2>Limits and reuse</h2><p>Questions, classifications, fictional outcomes and shared activities are editorial learning aids. Applied reasoning and reflections do not constitute a scholarly ruling or opinion from quran.ai, quran.com or quran.foundation. No independent scholarly certification is claimed.</p><p>App code is MIT licensed. Local DM Sans, Newsreader and Amiri fonts keep their SIL Open Font License files in the project. Optional source links are external reading; the app’s content, fonts and interactions are local.</p><p class="micro">Bundled content SHA-256: <code>{provenance.appContentSha256}</code></p><h2>Specific references</h2><ul class="source-list">{sources.map(s=><li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a><small>{s.kind} · {s.note}</small></li>)}</ul><button class="button secondary" data-print>Print sources</button></article></Shell>
''',encoding='utf-8')
 eyebrow,headline,intro=HERO[slug]
 front=f'''---
import Shell from '../layouts/Shell.astro';
import Filters from '../components/Filters.astro';
import {{ {key} }} from '../data/content.json';
const entries={key};
const topics=[...new Set(entries.map(item=>item.topic))];
'''
 front+=('const regions=[...new Set(entries.map(item=>item.region))];\n' if key=='events' else '')
 front+=('const ages=[...new Set(entries.map(item=>item.age))];\n' if key=='packs' else '')
 front+='---\n'
 header=f'<Shell title="{cfg["name"]}"><section class="intro"><span class="eyebrow">{eyebrow}</span><h1 class="editorial">{headline}</h1><p>{intro}</p></section>'
 extra=''
 if key=='events':
  front=front.replace("import Filters", "import Map from '../components/Map.astro';\nimport Filters")
  extra='<section class="panel panel-body"><h2>One connected reading area</h2><Map/><p class="micro">Land outlines give regional orientation. No historical state borders or exact event locations are plotted.</p><div class="region-keys" aria-label="Filter by region">{regions.map(region=><button data-region-filter={region}>{region}</button>)}</div></section><section class="panel panel-body top-gap"><h2>Compare two date bands</h2><p class="micro">Overlapping bands do not prove contact or causation. Broad periods and exact years retain different precision.</p><div class="compare-controls"><label class="field">First record<select id="compare-a">{entries.map(item=><option value={item.id}>{item.title}</option>)}</select></label><label class="field">Second record<select id="compare-b">{entries.map((item,index)=><option value={item.id} selected={index===1}>{item.title}</option>)}</select></label><button class="button" id="compare">Compare periods</button></div><div id="comparison" role="status"></div></section>'
  (app/'src/components/Map.astro').write_text('''---
import {landPaths} from '../data/content.json';
---
<svg class="world-map" viewBox="0 0 840 380" role="img" aria-label="Land outlines from Iberia and Africa to Central, South and Southeast Asia"><defs><clipPath id="map-area"><rect width="840" height="380"/></clipPath></defs><g clip-path="url(#map-area)">{landPaths.map(path=><path d={path}/>)}</g></svg>
''',encoding='utf-8')
 if key=='packs':extra='<div class="evidence-band"><span>About 10–15 minutes</span><span>Everyone may pass</span><span>Print or use one shared screen</span></div><p class="bookmarks-note">Age bands are suggestions. An adult can read aloud or adapt the vocabulary. Keep examples fictional; nobody needs to share a private story.</p>'
 if slug=='halal-business-decisions':extra='<div class="evidence-band"><span>Two decisions per case</span><span>Fictional consequences</span><a href="/sources/">Read the methodology ↗</a></div><p class="bookmarks-note">These cases are educational applied reasoning. They do not certify real transactions, issue personalized rulings or replace legal or financial advice.</p>'
 if slug=='islamic-misinformation-casebook':extra='<div class="evidence-band"><span>Fixed source-reading exercises</span><span>No live claim checker</span><a href="/sources/">How conclusions are bounded ↗</a></div><p class="bookmarks-note">The claims are constructed reading exercises, not a list of measured viral trends. “Beyond the cited evidence” keeps a conclusion narrower than “false everywhere.”</p>'
 if key=='readings':extra='<div class="evidence-band"><span>Transmitted occasion</span><span>General context</span><span>Response after revelation</span></div>'
 filters='<Filters topics={topics}'+(' regions={regions} timeline' if key=='events' else ' ages={ages}' if key=='packs' else '')+'/>'
 tools='<div class="collection-tools"><h2 id="entries">Choose a record</h2><button class="button secondary" id="copy-saved">Copy saved reading list</button></div>'
 if key=='events':
  cards='''<div class="timeline-list">{entries.map(item=><article class="panel timeline-record" data-item-id={item.id} data-search={`${item.title} ${item.place} ${item.summary}`} data-topic={item.topic} data-region={item.region} data-start={item.start} data-end={item.end}><div class="timeline-date">{item.date}<div class="date-ribbon" aria-hidden="true"><span style={`margin-left:${(item.start-650)/1010*100}%;width:${Math.max(.5,(item.end-item.start+1)/1010*100)}%`}></span></div></div><div><div class="tag-row"><span class="pill">{item.region}</span><span class="pill neutral">{item.topic}</span></div><h2 class="top-gap"><a data-reading-link={item.id} href={`/event/${item.id}/`}>{item.title}</a></h2><p>{item.summary}</p><div class="actions"><a class="button" href={`/event/${item.id}/`}>Read the record</a><button class="button secondary" data-save={item.id} aria-pressed="false">Save for later</button></div></div></article>)}</div>'''
 else:
  summary='item.reportSummary' if key=='readings' else 'item.setup' if slug=='halal-business-decisions' else 'item.claim' if slug=='islamic-misinformation-casebook' else 'item.discussion'
  meta='item.passage.ref' if key=='readings' else '`${item.age} · ${item.minutes} minutes`' if key=='packs' else "'Two decisions · source reading'" if slug=='halal-business-decisions' else "'Claim · evidence · conclusion'"
  attrs=' data-age={item.age}' if key=='packs' else ''
  cards=f'''<div class="card-grid">{{entries.map(item=><article class="panel activity-card" data-item-id={{item.id}} data-search={{`${{item.title}} ${{item.topic}} ${{{summary}}}`}} data-topic={{item.topic}}{attrs}><span class="eyebrow">{{item.topic}}</span><h2><a data-reading-link={{item.id}} href={{`/{route}/${{item.id}}/`}}>{{item.title}}</a></h2><p>{{{summary}}}</p><span class="micro">{{{meta}}}</span><div class="actions"><a class="button" href={{`/{route}/${{item.id}}/`}}>Open {'pack' if key=='packs' else 'reading' if key=='readings' else 'case'}</a><button class="button secondary" data-save={{item.id}} aria-pressed="false">Save for later</button></div></article>)}}</div>'''
 footer='<div id="empty" class="empty" hidden><h2>No entries match</h2><p>Try fewer words, change a filter, or turn off “Saved only.”</p></div><script>import "../lib/library";'+('import "../lib/timeline";' if key=='events' else '')+'</script></Shell>'
 (app/'src/pages/index.astro').write_text(front+header+extra+filters+tools+cards+footer,encoding='utf-8')
 print(slug)
