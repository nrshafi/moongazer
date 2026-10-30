import { test, expect } from 'bun:test';
import { canonicalPath, getPageMeta, seoPages, encodeJsonLd, descriptionSnippet } from '../apps/guess-the-surah/src/lib/seo';
import { metadata } from '../homepage/render.mjs';

test('canonicals discard activity parameters and normalize static paths', () => {
  expect(canonicalPath('/?challenge=one#play')).toBe('/');
  expect(canonicalPath('/sources/index.html?x=1')).toBe('/sources/');
  expect(canonicalPath('/404/')).toBe('/404.html');
});
test('utility pages stay out of the indexable route list', () => {
  expect(seoPages.filter(page => page.indexable).map(page => page.path)).toEqual(['/', '/sources/']);
  expect(getPageMeta('/privacy/').indexable).toBe(false);
});
test('new routes need explicit metadata', () => {
  expect(() => getPageMeta('/unknown/')).toThrow('Add metadata');
});
test('structured data cannot close an inline script and preserves text', () => {
  const value = { name: '</script><script>alert(1)</script>', text: 'القرآن & meaning' };
  const encoded = encodeJsonLd(value);
  expect(encoded).not.toContain('<');
  expect(JSON.parse(encoded)).toEqual(value);
});
test('descriptions normalize whitespace and retain long words', () => {
  expect(descriptionSnippet('  A\n short  description  ')).toBe('A short description');
  expect(descriptionSnippet('One two three four five', 15)).toBe('One two three…');
  expect(descriptionSnippet('abcdefghijklm', 8)).toBe('abcdefg…');
});

test('directory metadata keeps authored content escaped in HTML and JSON-LD', () => {
  const name = '</script><img src=x onerror=alert(1)> & source';
  const output = metadata({path:'/', title:name, heading:name, description:name}, [{slug:'example',name}]);
  expect(output).not.toContain('<img src=x');
  const blocks = [...output.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  expect(blocks).toHaveLength(1);
  const schema = JSON.parse(blocks[0][1]);
  expect(schema['@graph'].find(node=>node['@type']==='ItemList').itemListElement[0].name).toBe(name);
});
