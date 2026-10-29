import {test,expect} from 'bun:test';
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
import {cases} from '../src/data/content.json';
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
