from pathlib import Path
from content import ROOT
storage='''import {test,expect,beforeEach} from 'bun:test';
import {read,write,forget,DAY,shuffle,cleanSeed} from '../src/lib/utils';
const memory=new Map<string,string>();
const storage={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>memory.set(key,value),removeItem:(key:string)=>memory.delete(key)};
beforeEach(()=>{memory.clear();Object.defineProperty(globalThis,'document',{value:{body:{dataset:{app:'isolated-test'}}},configurable:true});Object.defineProperty(globalThis,'localStorage',{value:storage,configurable:true});});
test('expired, future, malformed, and incorrectly typed progress is rejected',()=>{const valid=(v:unknown):v is number=>typeof v==='number';for(const raw of ['not JSON',JSON.stringify({at:Date.now()-31*DAY,value:4}),JSON.stringify({at:Date.now()+DAY,value:4}),JSON.stringify({at:Date.now(),value:'wrong'})]){memory.set('isolated-test:progress',raw);expect(read('progress',valid)).toBeNull();}write('progress',4);expect(read('progress',valid)).toBe(4);forget('progress');expect(read('progress',valid)).toBeNull();});
test('blocked storage does not prevent an activity from running',()=>{Object.defineProperty(globalThis,'localStorage',{value:{getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')},removeItem(){throw new Error('blocked')}},configurable:true});expect(write('progress',1)).toBe(false);expect(read('progress',(v):v is number=>typeof v==='number')).toBeNull();expect(()=>forget('progress')).not.toThrow();});
test('saved records stay inside the app namespace',()=>{memory.set('another-app:progress','keep');write('progress',12);forget('progress');expect(memory.get('another-app:progress')).toBe('keep');});
test('shared seeds are constrained and shuffling never loses items',()=>{expect(cleanSeed('<script>')).toBeNull();expect(cleanSeed('a'.repeat(41))).toBeNull();expect(cleanSeed('round_12-A')).toBe('round_12-A');const items=Array.from({length:114},(_,i)=>i+1);expect(shuffle(items,123)).toEqual(shuffle(items,123));expect(new Set(shuffle(items,123))).toEqual(new Set(items));});
'''
for folder in (ROOT/'apps').iterdir():
    if (folder/'src/lib/utils.ts').exists():(folder/'tests/storage.test.ts').write_text(storage,encoding='utf-8')
tests={
'ayah-threads':'''import {test,expect} from 'bun:test';import data from '../src/data/content.json';
test('30 complete puzzles have distinct choices and canonical evidence for all three passages',()=>{expect(data.puzzles.length).toBe(30);expect(new Set(data.puzzles.map(p=>p.id)).size).toBe(30);for(const p of data.puzzles){expect(p.passages.length).toBe(3);expect(new Set([p.theme,...p.distractors]).size).toBe(4);expect(p.commentaryUrl).toMatch(/^https:\\/\\/quran.com\\//);for(const passage of p.passages){expect(passage.arabic.length).toBeGreaterThan(3);expect(passage.translation.length).toBeGreaterThan(3);expect(passage.ref).toMatch(/^\\d+:\\d+(-\\d+)?$/);}}});
''',
'seerah-detective':'''import {test,expect} from 'bun:test';import data from '../src/data/content.json';
test('12 investigations have full evidence, a valid conclusion, and primary report references',()=>{expect(data.cases.length).toBe(12);expect(new Set(data.cases.map(c=>c.id)).size).toBe(12);for(const c of data.cases){expect(c.evidence.length).toBe(3);expect(new Set(c.evidence.map(e=>e.id)).size).toBe(3);expect(c.answers.length).toBe(3);expect(c.correct).toBeGreaterThanOrEqual(0);expect(c.correct).toBeLessThan(c.answers.length);expect(c.conclusion.length).toBeGreaterThan(40);for(const e of c.evidence)expect(e.source.url).toMatch(/^https:\\/\\/sunnah.com\\/(bukhari|muslim):/);}});
''',
'everyday-akhlaq':'''import {test,expect} from 'bun:test';import data from '../src/data/content.json';
test('all 20 scenarios support every first and second response with a consequence',()=>{expect(data.scenarios.length).toBe(20);expect(new Set(data.scenarios.map(s=>s.id)).size).toBe(20);for(const s of data.scenarios){expect(s.options.length).toBe(3);expect(s.options2.length).toBe(3);for(const first of s.options)for(const second of s.options2){expect(first.consequence.length).toBeGreaterThan(20);expect(second.consequence.length).toBeGreaterThan(20);expect(s.followup.length).toBeGreaterThan(10);expect(s.takeaway.length).toBeGreaterThan(20);}expect(s.passage.ref).toBe(s.ref);expect(s.passage.arabic.length).toBeGreaterThan(5);expect(s.passage.translation.length).toBeGreaterThan(5);}});
''',
'seerah-timeline':'''import {test,expect} from 'bun:test';import data from '../src/data/content.json';
test('36 chronological events include source and uncertainty notes',()=>{expect(data.events.length).toBe(36);expect(new Set(data.events.map(e=>e.id)).size).toBe(36);let previous=0;for(const e of data.events){expect(e.year).toBeGreaterThanOrEqual(previous);previous=e.year;expect(e.sources.length).toBeGreaterThan(0);expect(e.uncertainty.length).toBeGreaterThan(30);for(const source of e.sources)expect(source.url).toMatch(/^https:\\/\\/sunnah.com\\/(bukhari|muslim):/);}expect(data.events[0]!.year).toBe(610);expect(Math.floor(data.events.at(-1)!.year)).toBe(632);});
'''}
for slug,text in tests.items():(ROOT/'apps'/slug/'tests/content.test.ts').write_text(text,encoding='utf-8')
print('Prepared Bun tests for all five apps.')
