import { test, expect } from 'bun:test';
import { canonicalPath, getPageMeta, seoPages, encodeJsonLd, descriptionSnippet } from '../apps/ayah-threads/src/lib/seo';
import { metadata } from '../homepage/render.mjs';

test('canonicals discard activity parameters and normalize static paths', () => {
  expect(canonicalPath('/?challenge=one#play')).toBe('/');
  expect(canonicalPath('/sources/index.html?x=1')).toBe('/sources/');
  expect(canonicalPath('/404/')).toBe('/404.html');
});
test('utility pages stay out of the indexable route list', () => {
  const indexable = seoPages.filter(page => page.indexable).map(page => page.path);
  expect(indexable).toContain('/');
  expect(indexable).toContain('/sources/');
  expect(indexable).not.toContain('/privacy/');
  expect(indexable).not.toContain('/404.html');
  expect(getPageMeta('/privacy/').indexable).toBe(false);
  expect(getPageMeta('/404.html').indexable).toBe(false);
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

import { sentence } from '../apps/ayah-threads/src/lib/seo';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
test('labels ending in punctuation are not given a second full stop', () => {
  expect(sentence('Why?')).toBe('Why?');
  expect(sentence('Look!')).toBe('Look!');
  expect(sentence('Done.')).toBe('Done.');
  expect(sentence('A title')).toBe('A title.');
});
test('every app gives each detail page its own description and never writes "?."', async () => {
  const appsDir = join(import.meta.dir, '..', 'apps');
  const apps = readdirSync(appsDir).filter(app => existsSync(join(appsDir, app, 'src/lib/seo.ts')));
  expect(apps.length).toBeGreaterThan(0);
  for (const app of apps) {
    const mod = await import(join(appsDir, app, 'src/lib/seo.ts'));
    const pages = (mod.seoPages as {path:string;description:string}[]);
    for (const page of pages) expect(page.description, `${app} ${page.path}`).not.toMatch(/[?!]\./);
    const details = pages.filter(page => !['/', '/sources/', '/privacy/', '/404.html'].includes(page.path));
    const seen = new Map<string, string>();
    for (const page of details) {
      const previous = seen.get(page.description);
      expect(previous, `${app}: ${page.path} repeats the description of ${previous}`).toBeUndefined();
      seen.set(page.description, page.path);
    }
  }
});
test('each app points summaryField at a non-empty text field of every detail record', async () => {
  const appsDir = join(import.meta.dir, '..', 'apps');
  for (const app of readdirSync(appsDir).filter(app => existsSync(join(appsDir, app, 'src/data/seo.json')))) {
    const profile = await Bun.file(join(appsDir, app, 'src/data/seo.json')).json();
    if (!profile.collection || profile.detailMode) continue;
    const content = await Bun.file(join(appsDir, app, 'src/data/content.json')).json();
    const field = profile.summaryField || 'summary';
    for (const entry of content[profile.collection]) {
      expect(typeof entry[field] === 'string' && entry[field].trim().length > 0, `${app}: ${entry.id} has no text in "${field}"`).toBe(true);
    }
  }
});
