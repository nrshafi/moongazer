import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import config from '../src/data/config.json';
import seo from '../src/data/seo.json';
import learning from '../src/data/learning.json';
import sources from '../src/data/sources.json';
import provenance from '../src/data/provenance.json';
import {seoPages,productionOrigin} from '../src/lib/seo';

const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')) as {scripts:Record<string,string>};
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const accents=['teal','blue','violet'];

test('config identifies this app and its local port',()=>{
  expect(config.slug).toBe('zakat-calculator');
  expect(config.name).toBe('Zakat Calculator');
  expect(accents).toContain(config.accent);
  expect(config.port).toBe(4341);
  expect(pkg.scripts.dev).toContain('--port 4341');
  expect(pkg.scripts.preview).toContain('--port 4341');
  expect(productionOrigin).toBe('https://zakat-calculator.moongazer.tech/');
  expect(robots).toContain('Sitemap: https://zakat-calculator.moongazer.tech/sitemap.xml');
});

test('SEO profile names match the configured app',()=>{
  expect(seo.shortName).toBe(config.name);
  expect(seo.title).toContain(config.name);
  expect(seo.keyword.toLowerCase()).toContain('zakat');
  expect(seo.description.length).toBeGreaterThan(40);
  expect(seo.description.length).toBeLessThanOrEqual(180);
  expect('collection' in seo).toBe(false);
});

test('learning guide is consistent with the configured app',()=>{
  expect(learning.heading).toBe(config.name);
  expect(learning.steps.length).toBe(3);
  expect(learning.questions.length).toBeGreaterThan(0);
  expect(learning.collection.url).toMatch(/^https:\/\/moongazer\.tech\//);
  const selfHost=`${config.slug}.moongazer.tech`;
  const urls=learning.related.map(app=>app.url);
  expect(new Set(urls).size).toBe(urls.length);
  for(const app of learning.related){
    expect(app.url).toMatch(/^https:\/\/[a-z0-9-]+\.moongazer\.tech\/$/);
    expect(app.url).not.toContain(selfHost);
    expect(app.name.length).toBeGreaterThan(0);
  }
});

test('no ruling, figure or source is claimed while method content is pending',()=>{
  expect(sources).toEqual([]);
  expect(provenance.status).toBe('pending');
  expect(JSON.stringify(learning)).not.toMatch(/\d+(\.\d+)?\s*(g|grams?|dirhams?|dinars?|mithqal)\b/i);
});

test('content checksum matches the LF-normalised content file',()=>{
  const bytes=readFileSync(new URL('../src/data/content.json',import.meta.url)).toString('utf8').replace(/\r\n/g,'\n');
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(provenance.appContentSha256);
});

test('public pages are indexable only where intended',()=>{
  const paths=seoPages.map(page=>page.path);
  expect(paths).toContain('/');
  expect(paths).toContain('/sources/');
  for(const page of seoPages){
    expect(page.path.startsWith('/')).toBe(true);
    expect(page.path.endsWith('/')||page.path==='/404.html').toBe(true);
    expect(page.description.length).toBeGreaterThan(0);
  }
  expect(seoPages.find(page=>page.path==='/privacy/')?.indexable).toBe(false);
});
