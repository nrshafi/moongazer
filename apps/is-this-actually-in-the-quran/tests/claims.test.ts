import { test, expect } from 'bun:test';
import { claims, claimIdMap } from '../src/data/content.json';
import corpus from '../src/data/corpus.json';
import { categories, matchClaims } from '../src/lib/claims';
import { getPageMeta, seoPages } from '../src/lib/seo';

const refText = (ref: string) => {
  const [chapter, span] = ref.split(':');
  const [a, b] = span.includes('-') ? span.split('-').map(Number) : [Number(span), Number(span)];
  const parts = Array.from({ length: b - a + 1 }, (_, i) => corpus.find(v => v.ref === `${chapter}:${a + i}`)!);
  return { arabic: parts.map(p => p.arabic).join('\n'), translation: parts.map(p => p.translation).join('\n') };
};

test('there are twelve claims with unique, verdict-free ids', () => {
  expect(claims).toHaveLength(12);
  expect(new Set(claims.map(c => c.id)).size).toBe(12);
  for (const c of claims) {
    expect(c.id).toMatch(/^[a-z0-9-]+$/);
    expect(c.id).not.toMatch(/hadith|paraphrase|exact|misread|not-found|not-in|false|true|myth|fake|authentic/);
  }
});

test('every claim has a known category, a one-line verdict, keywords and two or three check steps', () => {
  for (const c of claims) {
    expect(categories as readonly string[]).toContain(c.category);
    expect(c.verdict.length).toBeGreaterThan(20);
    expect(c.verdict.split(/(?<=[.?!])\s+(?=[A-Z])/)).toHaveLength(1);
    expect(c.keywords.length).toBeGreaterThan(0);
    expect(c.howToCheck.length).toBeGreaterThanOrEqual(2);
    expect(c.howToCheck.length).toBeLessThanOrEqual(3);
  }
});

test('every Quran evidence record equals the corpus text exactly', () => {
  let count = 0;
  for (const c of claims) for (const record of c.evidence.quran) {
    count++;
    const expected = refText(record.ref);
    expect(record.arabic).toBe(expected.arabic);
    expect(record.translation).toBe(expected.translation);
  }
  expect(count).toBe(9);
});

test('hadith evidence is a sunnah.com link with collection and number', () => {
  for (const c of claims) for (const r of c.evidence.hadith) {
    expect(r.url).toBe(`https://sunnah.com/bukhari:${r.number}`);
    expect(r.collection).toBe('Sahih al-Bukhari');
    expect(r.summary.length).toBeGreaterThan(10);
  }
});

test('no title, URL or meta description contains the category or the verdict line', () => {
  for (const c of claims) {
    const meta = getPageMeta(`/claims/${c.id}/`);
    for (const field of [meta.title, meta.description, meta.path, meta.name, c.question]) {
      expect(field).not.toContain(c.verdict);
      for (const category of categories) expect(field.toLowerCase()).not.toContain(category.toLowerCase());
    }
    expect(meta.indexable).toBe(true);
  }
  expect(seoPages.filter(p => p.path.startsWith('/claims/') && p.path !== '/claims/')).toHaveLength(12);
});

test('the id map covers the twelve casebook cases and points at existing claims', () => {
  expect(Object.keys(claimIdMap)).toHaveLength(12);
  const ids = new Set(claims.map(c => c.id));
  for (const id of Object.values(claimIdMap)) expect(ids.has(id)).toBe(true);
  expect(new Set(Object.values(claimIdMap)).size).toBe(12);
});

test('search keywords link whole-word matches and ignore short or unrelated queries', () => {
  expect(matchClaims('spider', claims).map(c => c.id)).toEqual(['web-at-the-cave', 'spider-house-29-41']);
  expect(matchClaims('Frailest', claims).map(c => c.id)).toEqual(['spider-house-29-41']);
  expect(matchClaims('2:158', claims).map(c => c.id)).toEqual(['safa-marwa-no-sin']);
  expect(matchClaims('patience', claims)).toEqual([]);
  expect(matchClaims('a', claims)).toEqual([]);
  expect(matchClaims('spid', claims)).toEqual([]);
});
