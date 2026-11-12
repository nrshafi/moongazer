from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
def put(slug,text):(ROOT/'apps'/slug/'tests/activity.test.ts').write_text(text,encoding='utf-8')
put('hifz-planner', '''import {test,expect} from 'bun:test';
import {defaults,valid,schedule,calendar} from '../src/lib/engine';
test('revision grows while sessions remain within budget and reach exact goal',()=>{const p={...defaults,goal:20};const s=schedule(p);expect(s.status).toBe('complete');expect(s.rows.at(-1)!.memorized).toBeCloseTo(20);expect(s.rows.every(r=>r.total<=45.000001&&r.newPages<=.5&&r.newPages>0)).toBe(true);expect(s.rows.at(-1)!.reviewTime).toBeGreaterThan(s.rows[0]!.reviewTime);});
test('structural revision ceiling reports infeasible plans',()=>{expect(schedule({...defaults,memorized:200,goal:20,minutes:20,cycle:10,reviewMinutes:2}).status).toBe('capacity');});
test('invalid page totals, dates, and empty days are rejected',()=>{for(const x of [{...defaults,goal:605},{...defaults,days:[]},{...defaults,start:'2026-02-30'},{...defaults,minutes:NaN},{...defaults,reviewMinutes:0}])expect(valid(x)).toBe(false);});
test('date arithmetic respects leap day and selected weekdays',()=>{const s=schedule({...defaults,start:'2028-02-28',goal:1.5,days:[1,2,3,4,5,6,0]});expect(s.rows.map(r=>r.date)).toEqual(['2028-02-28','2028-02-29','2028-03-01']);});
test('very slow viable plans stop at the advertised horizon',()=>{const s=schedule({...defaults,goal:50,pace:.01});expect(s.status).toBe('horizon');expect(s.rows).toHaveLength(3650);});
test('calendar uses date-only events and limits exports to 90 sessions',()=>{const rows=schedule({...defaults,goal:100}).rows;const ics=calendar(rows);expect(ics.split('BEGIN:VEVENT')).toHaveLength(91);expect(ics).toContain('DTSTART;VALUE=DATE:20261027');expect(ics.endsWith('END:VCALENDAR\\r\\n')).toBe(true);});
''')
put('is-it-in-the-quran','''import {test,expect} from 'bun:test';
import {normalize,index,search,reference} from '../src/lib/engine';
import corpus from '../src/data/corpus.json';import {chapters} from '../src/data/content.json';
const rows=index(corpus);
test('complete local corpus has every ayah exactly once',()=>{expect(corpus).toHaveLength(6236);expect(new Set(corpus.map(v=>v.ref)).size).toBe(6236);for(const c of chapters)expect(corpus.filter(v=>v.ref.startsWith(c.number+':'))).toHaveLength(c.verses_count);});
test('phrase matching ignores punctuation but respects word boundaries',()=>{const mock=index([{ref:'1:1',arabic:'',translation:'The earth, and heaven.',url:''}]);expect(search(mock,'earth and','english').exact).toHaveLength(1);expect(search(mock,'art','english').exact).toHaveLength(0);});
test('Arabic normalization handles diacritics and common alif forms',()=>{expect(normalize('إِنَّ ٱللَّهَ')).toBe(normalize('ان الله'));expect(normalize('عَلَىٰ')).toBe(normalize('علي'));});
test('valid ranges expand and invalid or oversized references fail',()=>{const counts=chapters.map(c=>c.verses_count);expect(reference('94:5-6',counts)).toEqual(['94:5','94:6']);for(const r of ['0:1','115:1','1:8','2:5-3','2:1-31'])expect(()=>reference(r,counts)).toThrow();expect(reference('every soul',counts)).toBeNull();});
test('exact and related results stay separate and chapter filter is enforced',()=>{expect(search(rows,'with hardship','english',94).exact.every(v=>v.ref.startsWith('94:'))).toBe(true);const found=search(rows,'unfindableword patience','english');expect(found.exact).toHaveLength(0);expect(found.related.length).toBeLessThanOrEqual(60);});
''')
put('quran-concept-atlas','''import {test,expect} from 'bun:test';import {topics} from '../src/data/content.json';
test('30 unique topics each expose three complete cited readings',()=>{expect(topics).toHaveLength(30);expect(new Set(topics.map(t=>t.id)).size).toBe(30);for(const t of topics){expect(t.passages).toHaveLength(3);expect(t.passages.every(p=>p.arabic&&p.translation&&p.translationUrl.startsWith('https://quran.com/'))).toBe(true);}});
test('all related paths resolve and exclude the current topic',()=>{const ids=new Set(topics.map(t=>t.id));for(const t of topics){expect(t.related.length).toBeGreaterThan(0);expect(t.related.every(id=>ids.has(id)&&id!==t.id)).toBe(true);expect(new Set(t.related).size).toBe(t.related.length);}});
test('each editorial topic has an exact retrieved commentary anchor',()=>{for(const t of topics)expect(t.commentaryUrl.startsWith('https://quran.com/'+t.anchor+'/tafsirs/')).toBe(true);});
''')
put('quran-escape-room','''import {test,expect} from 'bun:test';import {rooms} from '../src/data/content.json';import {sameSet,canonicalOrder,validProgress} from '../src/lib/engine';
test('eight rooms have three unique references and unambiguous theme options',()=>{expect(rooms).toHaveLength(8);for(const r of rooms){expect(new Set(r.refs).size).toBe(3);expect(new Set(r.options).size).toBe(4);expect(r.options[r.answer]).toBe(r.name);expect(r.passages.map(p=>p.ref)).toEqual(r.refs);}});
test('multi-select requires all and only correct options',()=>{expect(sameSet([2,0],[0,2])).toBe(true);expect(sameSet([0],[0,2])).toBe(false);expect(sameSet([0,0],[0,2])).toBe(false);expect(sameSet([0,1,2],[0,2])).toBe(false);});
test('mushaf order sorts numbers rather than strings',()=>{expect(canonicalOrder(['103:3','16:127','2:153'])).toEqual(['2:153','16:127','103:3']);expect(canonicalOrder(['2:20','2:3'])).toEqual(['2:3','2:20']);});
test('corrupt progress cannot skip outside the four-lock activity',()=>{expect(validProgress({step:4,assisted:[1],seconds:30})).toBe(true);for(const p of [{step:5,assisted:[],seconds:0},{step:0,assisted:[1,1],seconds:0},{step:0,assisted:[],seconds:-1}])expect(validProgress(p)).toBe(false);});
''')
put('stories-of-the-prophets','''import {test,expect} from 'bun:test';import {people} from '../src/data/content.json';
test('25 unique profiles contain 50 fully cited readings',()=>{expect(people).toHaveLength(25);expect(new Set(people.map(p=>p.id)).size).toBe(25);expect(people.flatMap(p=>p.readings)).toHaveLength(50);for(const p of people)expect(p.readings.every(r=>r.arabic&&r.translation&&r.translationUrl.startsWith('https://quran.com/'))).toBe(true);});
test('each reading check has four distinct options and one intended answer',()=>{for(const p of people){expect(new Set(p.options).size).toBe(4);expect(p.options[p.answer]).toBe(p.focus);}});
test('briefly mentioned profiles are explicitly labeled without biographies',()=>{for(const id of ['idris','dhul-kifl','al-yasa'])expect(people.find(p=>p.id===id)!.brief).toBe(true);});
''')
