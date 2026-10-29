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
import {readings} from '../src/data/content.json';
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
