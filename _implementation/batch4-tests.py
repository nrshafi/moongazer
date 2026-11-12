from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
SLUGS=['civilization-timeline','halal-business-decisions','why-it-was-revealed','family-halaqa','islamic-misinformation-casebook']
COMMON='''import {test,expect} from 'bun:test';
import {matchesFilters,normalize,type Filters} from '../src/lib/catalog';
const blank:Filters={query:'',topic:'',region:'',age:'',from:'',to:''};
test('catalog search combines normalized words and respects independent filters',()=>{
 const entry={search:'Córdoba, gardens and books',topic:'Learning',region:'Iberia',age:'8–11',start:1201,end:1400};
 expect(normalize('  CÓRDOBA ')).toBe('cordoba');
 expect(matchesFilters(entry,{...blank,query:'BOOKS cordoba',topic:'Learning',region:'Iberia'})).toBe(true);
 for(const wrong of [{topic:'Trade'},{region:'West Asia'},{age:'12+'},{query:'books nonexistent'}])expect(matchesFilters(entry,{...blank,...wrong})).toBe(false);
});
test('year filtering keeps overlapping bands instead of testing only their starting year',()=>{
 const entry={search:'',topic:'',region:'',age:'',start:1201,end:1400};
 expect(matchesFilters(entry,{...blank,from:'1350',to:'1450'})).toBe(true);
 expect(matchesFilters(entry,{...blank,from:'1400',to:'1400'})).toBe(true);
 expect(matchesFilters(entry,{...blank,from:'1401'})).toBe(false);
 expect(matchesFilters(entry,{...blank,to:'1200'})).toBe(false);
});
'''
EXTRA={
 'civilization-timeline':'''import {events,landPaths} from '../src/data/content.json';
import {compareBands} from '../src/lib/engine';
test('twenty-four records preserve independent source precision and all nine regions',()=>{
 expect(events).toHaveLength(24);expect(new Set(events.map(item=>item.id)).size).toBe(24);
 expect(new Set(events.map(item=>item.region)).size).toBe(9);
 for(const item of events){expect(item.start).toBeLessThanOrEqual(item.end);expect(item.note.length).toBeGreaterThan(40);expect(item.sources[0]!.url).toMatch(/^https:\/\/(whc.unesco.org|www.metmuseum.org)\//);}
 expect(events.find(item=>item.id==='taj-mahal')).toMatchObject({start:1631,end:1648});
 expect(events.every((item,index)=>index===0||item.start>=events[index-1]!.start)).toBe(true);
 expect(landPaths.length).toBeGreaterThan(20);
});
test('comparison handles a single year, shared boundary and a real gap symmetrically',()=>{
 expect(compareBands({start:750,end:750},{start:750,end:750})).toMatchObject({overlap:true,start:750,end:750});
 expect(compareBands({start:700,end:800},{start:800,end:900})).toMatchObject({overlap:true,start:800,end:800});
 const a={start:762,end:762},b={start:836,end:892};
 expect(compareBands(a,b)).toEqual(compareBands(b,a));expect(compareBands(a,b)).toMatchObject({overlap:false,gap:74});
});
test('comparison rejects impossible or non-finite date bands',()=>{
 for(const a of [{start:800,end:700},{start:NaN,end:900},{start:700.5,end:900},{start:700,end:Infinity}])expect(()=>compareBands(a,{start:900,end:901})).toThrow();
});
''',
 'halal-business-decisions':'''import {cases} from '../src/data/content.json';
import {addDecision,validTrail,decisionLedger,type Trail} from '../src/lib/engine';
test('every first response and follow-up produces a complete two-stage ledger',()=>{
 expect(cases).toHaveLength(12);
 for(const item of cases)for(let first=0;first<item.choices.length;first++)for(let second=0;second<item.repairs.length;second++){
  const start:Trail={version:1,choices:[]};const one=addDecision(start,first,item);const two=addDecision(one,second,item);
  expect(start.choices).toEqual([]);expect(decisionLedger(two,item)).toEqual([item.choices[first]!,item.repairs[second]!]);
  expect(()=>addDecision(two,0,item)).toThrow();
 }
});
test('recovery rejects malformed paths and invalid options at either stage',()=>{
 const item=cases[0]!;
 for(const value of [null,{}, {version:2,choices:[]},{version:1,choices:[-1]},{version:1,choices:[3]},{version:1,choices:[0,2]},{version:1,choices:['0']},{version:1,choices:[0,0,0]}])expect(validTrail(value,item)).toBe(false);
 expect(validTrail({version:1,choices:[2,1]},item)).toBe(true);
 expect(()=>addDecision({version:1,choices:[]},NaN,item)).toThrow();
});
test('case content has specific consequences and a distinct second decision for every path',()=>{
 expect(new Set(cases.map(item=>item.id)).size).toBe(12);
 for(const item of cases){expect(item.choices).toHaveLength(3);expect(item.repairs).toHaveLength(2);expect(new Set(item.choices.map(choice=>choice.consequence)).size).toBe(3);expect(item.facts.length).toBeGreaterThan(1);expect(item.passage.arabic.length).toBeGreaterThan(20);expect(item.commentaryUrl).toContain('/tafsirs/');}
});
''',
 'why-it-was-revealed':'''import {readings} from '../src/data/content.json';
import {checkRelationship,relationships} from '../src/lib/assessment';
test('relationship grading accepts only the three known labels and the intended reading',()=>{
 for(const correct of relationships)for(const answer of [...relationships,'occasion',null,2,{}])expect(checkRelationship(answer,correct)).toBe(answer===correct);
});
test('all ten readings retain narrators, explicit limits and two exact commentary citations',()=>{
 expect(readings).toHaveLength(10);expect(new Set(readings.map(item=>item.id)).size).toBe(10);
 for(const item of readings){expect(item.narrator.length).toBeGreaterThan(4);expect(item.limits.length).toBeGreaterThan(50);expect(item.reliability).toContain('does not independently regrade');expect(item.sources[0]!.url).toMatch(/^https:\/\/sunnah.com\/bukhari:/);expect(item.commentaryUrl).toMatch(/\/tafsirs\/16$/);expect(item.secondCommentaryUrl).toMatch(/\/tafsirs\/14$/);}
});
test('later responses are not silently relabeled as causes of revelation',()=>{
 expect(readings.filter(item=>item.kind==='Response after revelation').map(item=>item.id).sort()).toEqual(['beloved-garden','spilled-drink']);
 expect(readings.find(item=>item.id==='qiblah')!.kind).toBe('General context');
 expect(readings.find(item=>item.id==='safa-marwa')!.sources).toHaveLength(2);
});
''',
 'family-halaqa':'''import {packs} from '../src/data/content.json';
import {newSession,validSession,answerQuestion,finishStep} from '../src/lib/engine';
test('each pack can be completed in order, after retrying a wrong reading answer',()=>{
 for(const pack of packs){
  const fresh=newSession();const wrong=(pack.answer+1)%pack.options.length;
  const retry=answerQuestion(fresh,wrong,pack);expect(retry.done).toEqual([false,false,false]);
  const read=answerQuestion(retry,pack.answer,pack);const talked=finishStep(read,1,pack);const complete=finishStep(talked,2,pack);
  expect(complete.done).toEqual([true,true,true]);expect(validSession(complete,pack)).toBe(true);expect(fresh).toEqual(newSession());
  expect(()=>answerQuestion(complete,0,pack)).toThrow();
 }
});
test('a saved session cannot skip steps or invent a correct answer',()=>{
 const pack=packs[0]!;
 for(const state of [null,{}, {version:2,answer:null,checked:false,done:[false,false,false]},{version:1,answer:null,checked:true,done:[false,false,false]},{version:1,answer:99,checked:true,done:[true,false,false]},{version:1,answer:null,checked:false,done:[false,true,false]},{version:1,answer:pack.answer,checked:true,done:[true,false,true]}])expect(validSession(state,pack)).toBe(false);
 expect(()=>finishStep(newSession(),1,pack)).toThrow();expect(()=>answerQuestion(newSession(),-1,pack)).toThrow();
});
test('family packs have a finite sitting and an unambiguous reading check',()=>{
 expect(packs).toHaveLength(12);expect(new Set(packs.map(pack=>pack.id)).size).toBe(12);
 expect(new Set(packs.map(pack=>pack.age)).size).toBe(3);
 for(const pack of packs){expect(pack.minutes).toBeLessThanOrEqual(15);expect(pack.minutes).toBeGreaterThanOrEqual(10);expect(new Set(pack.options).size).toBe(pack.options.length);expect(pack.answer).toBeLessThan(pack.options.length);expect(pack.discussion.length).toBeGreaterThan(30);expect(pack.activity.length).toBeGreaterThan(40);}
});
''',
 'islamic-misinformation-casebook':'''import {cases} from '../src/data/content.json';
import {assess,verdicts} from '../src/lib/assessment';
test('a conclusion must use a known label and match the expected evidence scope',()=>{
 for(const correct of verdicts)for(const value of verdicts)expect(assess(value,correct)).toEqual({valid:true,correct:value===correct});
 for(const value of [null,undefined,1,'False',{},'<script>'])expect(assess(value,verdicts[0])).toEqual({valid:false,correct:false});
});
test('the casebook keeps finite cited evidence, a correction and a limit in every case',()=>{
 expect(cases).toHaveLength(12);expect(new Set(cases.map(item=>item.id)).size).toBe(12);
 expect(new Set(cases.map(item=>item.verdict)).size).toBe(3);
 for(const item of cases){expect(item.evidence).toHaveLength(2);expect(item.correction.length).toBeGreaterThan(50);expect(item.limit.length).toBeGreaterThan(50);expect(item.skill.length).toBeGreaterThan(20);expect(item.sources.length>0||'passage' in item).toBe(true);}
});
test('missing-detail cases retain the narrower finding instead of a universal falsity claim',()=>{
 for(const id of ['cave-web','night-date','spider-material'])expect(cases.find(item=>item.id===id)!.verdict).toBe('Beyond the cited evidence');
 expect(cases.find(item=>item.id==='safa-wording')!.verdict).toBe('Needs context');
});
''',
}
for slug in SLUGS:
 (ROOT/'apps'/slug/'tests/activity.test.ts').write_text(COMMON+EXTRA[slug],encoding='utf-8')
 print(slug)
