import { test, expect, describe } from 'bun:test';
import { readFileSync } from 'node:fs';
import { groups, puzzles, incompatible } from '../src/data/content.json';

// C3 content checks: counts, tiers, kinds, duplicates, alternative groupings and canonical text.
interface Passage { ref: string; arabic: string; translation: string; url: string; translationUrl: string }
interface Group { id: string; title: string; kind: string; tier: number; terms: string[]; passages: Passage[]; note: string }
interface Board { id: string; number: number; title: string; level: string; groups: string[]; alternates?: { terms: string[]; note: string }[] }
const G = groups as Group[];
const P = puzzles as Board[];
const byId = (id: string) => G.find(g => g.id === id)!;
const snapshot = JSON.parse(readFileSync(new URL('../../../_implementation/research/quran-full.json', import.meta.url), 'utf8')) as {
  chapters: { number: number; name_simple: string }[];
  verses: Record<string, { arabic: string; translation: string }>;
};

const norm = (t: string) => t.toLowerCase().replace(/[’‘]/g, "'").replace(/^the /, '').trim();
/** Surah name without its article and punctuation, so "Al-Qari’ah", "Al-Qari'ah" and "Qari'ah" agree. */
const surahKey = (t: string) => t.toLowerCase().replace(/[’‘'`]/g, '').replace(/^(al|an|ar|as|at|az|ad|ash|adh|ath|ad)-/, '').replace(/[^a-z]/g, '');
const chapterKeys = new Set(snapshot.chapters.map(c => surahKey(c.name_simple)));
const ARABIC = /[؀-ۿ]/;

/** Terms of `b` that occur as whole words (or simple plurals) in the passages of `a`. */
function overlap(a: Group, b: Group): string[] {
  const text = a.passages.map(p => p.translation).join(' ').toLowerCase().replace(/[’‘]/g, "'");
  return b.terms.filter(t => {
    if (ARABIC.test(t)) return false;
    const n = norm(t);
    if (n.length < 4) return false;
    return new RegExp(`(?<![a-z'])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es)?(?![a-z'])`).test(text);
  });
}

describe('counts and shape', () => {
  test('at least 40 groups and 30 boards', () => {
    expect(G.length).toBeGreaterThanOrEqual(40);
    expect(P.length).toBeGreaterThanOrEqual(30);
  });
  test('board ids and numbers run 1..N and titles are all distinct', () => {
    P.forEach((p, i) => { expect(p.number).toBe(i + 1); expect(p.id).toBe(`board-${String(i + 1).padStart(2, '0')}`); });
    expect(new Set(P.map(p => p.title)).size).toBe(P.length);
    expect(new Set(P.map(p => p.id)).size).toBe(P.length);
  });
  test('every group has a tier from 1 to 4 and a known kind, and all four kinds are present', () => {
    for (const g of G) { expect([1, 2, 3, 4]).toContain(g.tier); expect(['ayat', 'surah', 'prophet', 'root']).toContain(g.kind); }
    expect(new Set(G.map(g => g.kind))).toEqual(new Set(['ayat', 'surah', 'prophet', 'root']));
    for (const t of [1, 2, 3, 4]) expect(G.some(g => g.tier === t)).toBe(true);
  });
  test('group ids are unique, each has four distinct terms, and every group is on a board', () => {
    expect(new Set(G.map(g => g.id)).size).toBe(G.length);
    for (const g of G) expect(new Set(g.terms).size).toBe(4);
    const used = new Set(P.flatMap(p => p.groups));
    for (const g of G) expect(used.has(g.id)).toBe(true);
  });
  test('each board has four distinct groups and sixteen distinct terms', () => {
    for (const p of P) {
      expect(new Set(p.groups).size).toBe(4);
      const terms = p.groups.flatMap(id => byId(id).terms);
      expect(terms).toHaveLength(16);
      expect(new Set(terms).size).toBe(16);
    }
  });
});

describe('no valid alternative groupings left unhandled', () => {
  test('no exact or normalised duplicate term on a board', () => {
    for (const p of P) expect(new Set(p.groups.flatMap(id => byId(id).terms.map(norm))).size).toBe(16);
  });
  test('at most one surah-name group and one root group per board', () => {
    for (const p of P) {
      const kinds = p.groups.map(id => byId(id).kind);
      expect(kinds.filter(k => k === 'surah').length).toBeLessThanOrEqual(1);
      expect(kinds.filter(k => k === 'root').length).toBeLessThanOrEqual(1);
    }
  });
  test('a surah name in a non-surah group, on a board with a surah-name group, is recorded as an accepted alternate', () => {
    for (const p of P) {
      if (!p.groups.some(id => byId(id).kind === 'surah')) continue;
      for (const id of p.groups.filter(id => byId(id).kind !== 'surah')) {
        for (const t of byId(id).terms) {
          if (ARABIC.test(t) || !chapterKeys.has(surahKey(t))) continue;
          expect(p.alternates?.some(a => a.terms.includes(t)) ?? false).toBe(true);
        }
      }
    }
  });
  test('accepted alternates are four distinct terms of the board and never one of its groups', () => {
    for (const p of P) {
      const terms = new Set(p.groups.flatMap(id => byId(id).terms));
      for (const a of p.alternates ?? []) {
        expect(a.terms).toHaveLength(4);
        expect(new Set(a.terms).size).toBe(4);
        expect(a.terms.every(t => terms.has(t))).toBe(true);
        expect(a.note.length).toBeGreaterThan(10);
        for (const id of p.groups) expect(byId(id).terms.every(t => a.terms.includes(t))).toBe(false);
      }
    }
  });
  test('the pairs found by verification are recorded as incompatible', () => {
    const has = (a: string, b: string) => incompatible.some(x => x.groups.includes(a) && x.groups.includes(b));
    expect(has('prophets', 'prophet-surahs')).toBe(true);
    expect(has('last-day-surahs', 'qualities')).toBe(true);
    expect(has('people-surahs', 'places')).toBe(true);
    expect(has('isa-signs', 'animals')).toBe(true);
  });
  test('every pair recorded as incompatible never shares a board', () => {
    expect(incompatible.length).toBeGreaterThan(10);
    for (const pair of incompatible) {
      expect(pair.reason.length).toBeGreaterThan(5);
      expect(byId(pair.groups[0]!)).toBeDefined();
      expect(byId(pair.groups[1]!)).toBeDefined();
      for (const p of P) expect(pair.groups.every(id => p.groups.includes(id))).toBe(false);
    }
  });
  test('no term of one group occurs in the cited readings of another group on the same board', () => {
    for (const p of P) {
      for (const a of p.groups) for (const b of p.groups) {
        if (a === b) continue;
        expect({ board: p.id, a, b, found: overlap(byId(a), byId(b)) }).toEqual({ board: p.id, a, b, found: [] });
      }
    }
  });
});

describe('canonical text and terms', () => {
  test('every passage equals the verified snapshot, ayah by ayah', () => {
    for (const g of G) for (const p of g.passages) {
      const [s, rest] = p.ref.split(':') as [string, string];
      const [from, to] = rest.includes('-') ? rest.split('-').map(Number) as [number, number] : [Number(rest), Number(rest)];
      const keys = Array.from({ length: to - from + 1 }, (_, i) => `${s}:${from + i}`);
      expect(p.arabic).toBe(keys.map(k => snapshot.verses[k]!.arabic).join('\n'));
      expect(p.translation).toBe(keys.map(k => snapshot.verses[k]!.translation).join('\n'));
      expect(p.url).toBe(`https://quran.com/${p.ref}`);
      expect(p.translationUrl).toBe(`https://quran.com/${p.ref}?translations=19`);
    }
  });
  test('root groups: every Arabic term is a word of one of the cited ayat', () => {
    for (const g of G.filter(g => g.kind === 'root')) {
      const words = new Set(g.passages.flatMap(p => p.arabic.split(/\s+/)));
      for (const t of g.terms) { expect(ARABIC.test(t)).toBe(true); expect(words.has(t)).toBe(true); }
    }
  });
  test('surah-name groups added in C3 use chapter names from the Quran MCP metadata', () => {
    for (const id of ['letter-surahs', 'last-day-surahs', 'prophet-surahs', 'people-surahs', 'place-surahs']) {
      for (const t of byId(id).terms) expect(chapterKeys.has(surahKey(t))).toBe(true);
    }
  });
  test('English terms appear in the cited readings (word-in-ayah groups)', () => {
    const loose = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'");
    const skip = new Set(['qualities', 'divine-names', 'angels', 'prophets', 'places', 'worship', 'scriptures', 'colors', 'neighbors', 'requested-crops', 'textiles', 'body', 'animals', 'fruit', 'metals', 'storm', 'times', 'qul', 'animal-titles', 'day-night']);
    for (const g of G.filter(g => g.kind === 'ayat' || g.kind === 'prophet')) {
      if (skip.has(g.id)) continue;
      const text = loose(g.passages.map(p => p.translation).join(' '));
      for (const t of g.terms) {
        const key = norm(t).replace('clay bird', 'clay').replace('the one', 'one');
        expect({ id: g.id, t, ok: text.includes(key) }).toEqual({ id: g.id, t, ok: true });
      }
    }
  });
});
