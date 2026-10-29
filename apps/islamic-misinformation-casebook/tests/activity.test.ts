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
