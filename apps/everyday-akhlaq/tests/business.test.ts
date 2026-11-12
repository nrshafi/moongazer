import {test,expect} from 'bun:test';
import {createHash} from 'node:crypto';
import data from '../src/data/content.json';
import {validState} from '../src/lib/choices';
import {validBookmarks} from '../src/lib/business';

const all=[...data.scenarios,...data.business];

test('32 scenarios in total: 20 existing plus 12 business, with unique ids per route',()=>{
 expect(data.scenarios).toHaveLength(20);expect(data.business).toHaveLength(12);expect(all).toHaveLength(32);
 expect(new Set(data.business.map(s=>s.id)).size).toBe(12);expect(new Set(data.business.map(s=>s.number)).size).toBe(12);
 expect(data.scenarios.some(s=>s.track==='business')).toBe(false);
});
test('every scenario has a track; scenarios use home or study, business uses business',()=>{
 for(const s of data.scenarios)expect(['home','study']).toContain(s.track);
 for(const s of data.business)expect(s.track).toBe('business');
 expect(data.scenarios.filter(s=>s.track==='home').length).toBeGreaterThan(0);expect(data.scenarios.filter(s=>s.track==='study').length).toBeGreaterThan(0);
});
test('each business scenario has exactly one constructive option at each stage and specific consequences',()=>{
 for(const s of data.business){
  expect(s.options.filter(o=>o.constructive)).toHaveLength(1);expect(s.options2.filter(o=>o.constructive)).toHaveLength(1);
  expect(s.options).toHaveLength(3);expect(s.options2).toHaveLength(2);
  expect(new Set(s.options.map(o=>o.consequence)).size).toBe(3);
  expect(s.passage.ref).toBe(s.ref);expect(s.takeaway.length).toBeGreaterThan(20);expect(s.commentaryUrl).toContain('/tafsirs/');
 }
});
test('canonical passages, hadith sources and commentary links are unchanged from the pinned snapshot',()=>{
 const text=JSON.stringify(data.business.map(b=>[b.id,b.passage,b.sources,b.commentaryUrl,(b as any).secondCommentaryUrl]));
 expect(createHash('sha256').update(text).digest('hex')).toBe('4463c41bfd58085f4c479abe5e85b4bf10dd79eb51dce525f3cd4806114aab61');
});
test('business bookmarks accept only unique known ids',()=>{
 const ids=data.business.map(b=>b.id);
 expect(validBookmarks([ids[0],ids[1]])).toBe(true);expect(validBookmarks([ids[0],'not-a-case'])).toBe(false);expect(validBookmarks([ids[0],ids[0]])).toBe(false);expect(validBookmarks('x')).toBe(false);
});
test('saved state is bounded by each scenario\'s real option counts',()=>{
 for(const s of data.business){const counts:[number,number]=[s.options.length,s.options2.length];expect(validState({stage:1,choices:[2],seed:5},counts)).toBe(true);expect(validState({stage:2,choices:[0,1]},counts)).toBe(true);expect(validState({stage:2,choices:[0,2]},counts)).toBe(false);expect(validState({stage:1,choices:[3]},counts)).toBe(false);}
});
test('the duplicated "friendly loan" case is kept until content task C15',()=>{
 expect(data.scenarios.some(s=>s.id==='a-loan-between-friends')).toBe(true);expect(data.business.some(s=>s.id==='unclear-loan')).toBe(true);
});
