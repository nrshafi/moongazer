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
import {packs} from '../src/data/content.json';
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
 expect(packs.filter(pack=>!('series' in pack))).toHaveLength(12);expect(new Set(packs.map(pack=>pack.id)).size).toBe(packs.length);
 expect(new Set(packs.map(pack=>pack.age)).size).toBe(3);
 for(const pack of packs){expect(pack.minutes).toBeLessThanOrEqual(15);expect(pack.minutes).toBeGreaterThanOrEqual(10);expect(new Set(pack.options).size).toBe(pack.options.length);expect(pack.answer).toBeLessThan(pack.options.length);expect(pack.discussion.length).toBeGreaterThan(30);expect(pack.activity.length).toBeGreaterThan(40);}
});
