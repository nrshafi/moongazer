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
import {events,landPaths} from '../src/data/content.json';
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
