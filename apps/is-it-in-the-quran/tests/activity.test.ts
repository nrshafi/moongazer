import {test,expect} from 'bun:test';
import {normalize,index,search,reference} from '../src/lib/engine';
import corpus from '../src/data/corpus.json';import {chapters} from '../src/data/content.json';
const rows=index(corpus);
test('complete local corpus has every ayah exactly once',()=>{expect(corpus).toHaveLength(6236);expect(new Set(corpus.map(v=>v.ref)).size).toBe(6236);for(const c of chapters)expect(corpus.filter(v=>v.ref.startsWith(c.number+':'))).toHaveLength(c.verses_count);});
test('phrase matching ignores punctuation but respects word boundaries',()=>{const mock=index([{ref:'1:1',arabic:'',translation:'The earth, and heaven.',url:''}]);expect(search(mock,'earth and','english').exact).toHaveLength(1);expect(search(mock,'art','english').exact).toHaveLength(0);});
test('Arabic normalization handles diacritics and common alif forms',()=>{expect(normalize('إِنَّ ٱللَّهَ')).toBe(normalize('ان الله'));expect(normalize('عَلَىٰ')).toBe(normalize('علي'));});
test('valid ranges expand and invalid or oversized references fail',()=>{const counts=chapters.map(c=>c.verses_count);expect(reference('94:5-6',counts)).toEqual(['94:5','94:6']);for(const r of ['0:1','115:1','1:8','2:5-3','2:1-31'])expect(()=>reference(r,counts)).toThrow();expect(reference('every soul',counts)).toBeNull();});
test('exact and related results stay separate and chapter filter is enforced',()=>{expect(search(rows,'with hardship','english',94).exact.every(v=>v.ref.startsWith('94:'))).toBe(true);const found=search(rows,'unfindableword patience','english');expect(found.exact).toHaveLength(0);expect(found.related.length).toBeLessThanOrEqual(60);});

test('very short and punctuation-only inputs are explicitly rejected',()=>{expect(()=>search(rows,'?','english')).toThrow('at least two');expect(()=>search(rows,'a','english')).toThrow('at least two');});
