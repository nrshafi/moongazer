import {test,expect} from 'bun:test';
import {seoPages} from '../src/lib/seo';
import {cases} from '../src/data/content.json';
test('case meta descriptions never contain the correction (the verdict)',()=>{
 for(const c of cases){const page=seoPages.find(p=>p.path===`/case/${c.id}/`)!;expect(page).toBeDefined();expect(page.description).not.toContain(c.correction.slice(0,60));expect(page.description.startsWith('Read the evidence and decide')).toBe(true);}
});
