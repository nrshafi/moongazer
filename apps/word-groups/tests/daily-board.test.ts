import { test, expect, describe } from 'bun:test';
import { groups, puzzles } from '../src/data/content.json';
import { DAILY_EPOCH, dayNumber, dailyIndex, assertNoAnswer, whatsappUrl } from '../src/lib/daily';
import { DAILY_SEED, BANK_VERSION, DAILY_HOST, DAILY_NAME, bank, dailyItem, dailyShare } from '../src/lib/daily-bank';
import { MAX_MISSES, match, matchAlternate, resultLine, mistakesText, tierLabel, tierClass, dailyValidator, solvedValidator, isArabicTerm, type Alternate } from '../src/lib/engine';

const G = groups as { id: string; title: string; terms: string[]; tier: number }[];
const gid = (id: string) => G.find(g => g.id === id)!;
const [ey, em, ed] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
const at = (offset: number) => new Date(ey, em - 1, ed + offset, 12);

describe('daily selection', () => {
  test('constants and the bank are the boards in data order', () => {
    expect(DAILY_SEED).toBe(40);
    expect(BANK_VERSION).toBe(1);
    expect(bank).toBe(puzzles as unknown as typeof bank);
  });
  test('dailyItem(n) is deterministic and equals bank[dailyIndex(n, length, seed)]', () => {
    for (let n = 1; n <= 400; n++) {
      expect(dailyItem(n)).toBe(bank[dailyIndex(n, bank.length, DAILY_SEED)]);
      expect(dailyItem(n)).toBe(dailyItem(n));
    }
  });
  test('every board appears once before any repeat', () => {
    const first = Array.from({ length: bank.length }, (_, i) => dailyItem(i + 1)!.id);
    expect(new Set(first).size).toBe(bank.length);
    expect(Array.from({ length: bank.length }, (_, i) => dailyItem(bank.length + i + 1)!.id)).toEqual(first);
  });
  test('before the epoch there is no daily board (day number 0)', () => {
    expect(dayNumber(at(-1))).toBe(0);
    expect(dailyItem(dayNumber(at(-1)))).toBeUndefined();
    expect(dailyItem(0)).toBeUndefined();
    expect(dailyItem(-3)).toBeUndefined();
    expect(dailyItem(1.5)).toBeUndefined();
    expect(dailyItem(dayNumber(at(0)))).toBeDefined();
  });
});

describe('share text never contains an answer', () => {
  test('every board, every result: no group title, term or board title in the line above the host', () => {
    for (const board of puzzles) {
      const forbidden = board.groups.flatMap(id => [gid(id).title, ...gid(id).terms]);
      for (let solved = 0; solved <= 4; solved++) {
        for (let misses = 0; misses <= MAX_MISSES; misses++) {
          const text = dailyShare(12, solved, misses);
          expect(text.endsWith('\n' + DAILY_HOST)).toBe(true);
          expect(() => assertNoAnswer(text.slice(0, -DAILY_HOST.length), forbidden)).not.toThrow();
          expect(text).not.toContain(board.id);
        }
      }
    }
  });
  test('the format is "Word Groups #N · 4 groups, 1 mistake" then the host', () => {
    expect(dailyShare(7, 4, 1)).toBe('Word Groups #7 · 4 groups, 1 mistake\nword-groups.moongazer.tech');
    expect(dailyShare(7, 4, 0)).toBe('Word Groups #7 · 4 groups, 0 mistakes\nword-groups.moongazer.tech');
    expect(dailyShare(7, 2, 4)).toBe('Word Groups #7 · 2 of 4 groups, 4 mistakes\nword-groups.moongazer.tech');
    expect(DAILY_NAME).toBe('Word Groups');
  });
  test('a leak is caught by assertNoAnswer', () => {
    expect(() => assertNoAnswer('Word Groups #7 · Metals', ['Metals in the selected readings', 'Metals'])).toThrow(/forbidden/);
  });
  test('the WhatsApp link encodes the text', () => {
    const text = dailyShare(3, 4, 1);
    expect(whatsappUrl(text)).toBe('https://wa.me/?text=' + encodeURIComponent(text));
  });
  test('resultLine and mistakesText', () => {
    expect(resultLine(4, 1)).toBe('4 groups, 1 mistake');
    expect(resultLine(3, 4)).toBe('3 of 4 groups, 4 mistakes');
    expect(mistakesText(0)).toBe('0 mistakes');
  });
});

describe('four-mistake limit, tiers and results', () => {
  test('the limit is four', () => expect(MAX_MISSES).toBe(4));
  test('tier labels carry text and a class from the family tokens', () => {
    expect(tierLabel(1)).toBe('Tier 1 · most direct');
    expect(tierLabel(4)).toBe('Tier 4 · least direct');
    expect(tierClass(2)).toBe('tier-2');
    expect(tierClass(9)).toBe('tier-4');
    expect(tierClass(0)).toBe('tier-1');
  });
  test('dailyValidator accepts a finished board and rejects tampering', () => {
    const board = puzzles[0]!;
    const ok = { n: 5, result: { board: board.id, solved: [...board.groups], misses: 2, lost: false } };
    const v = dailyValidator(puzzles);
    expect(v(ok)).toBe(true);
    expect(v({ n: 5, result: { board: board.id, solved: board.groups.slice(0, 2), misses: 4, lost: true } })).toBe(true);
    expect(v({ ...ok, n: 0 })).toBe(false);
    expect(v({ n: 5, result: { ...ok.result, board: 'nope' } })).toBe(false);
    expect(v({ n: 5, result: { ...ok.result, solved: ['absent'] } })).toBe(false);
    expect(v({ n: 5, result: { ...ok.result, misses: 5 } })).toBe(false);
    expect(v({ n: 5, result: { ...ok.result, lost: true } })).toBe(false);
    expect(v({ n: 5, result: { ...ok.result, solved: board.groups.slice(0, 3) } })).toBe(false);
    expect(v(null)).toBe(false);
    expect(v('x')).toBe(false);
  });
  test('solvedValidator', () => {
    const v = solvedValidator(puzzles);
    expect(v([puzzles[0]!.id, puzzles[3]!.id])).toBe(true);
    expect(v(['x'])).toBe(false);
    expect(v([puzzles[0]!.id, puzzles[0]!.id])).toBe(false);
    expect(v('x')).toBe(false);
  });
  test('Arabic terms are detected', () => {
    expect(isArabicTerm('رَحْمَةً')).toBe(true);
    expect(isArabicTerm('Mercy')).toBe(false);
  });
});

describe('accepted alternates', () => {
  const alt: Alternate = { terms: ['Yunus', 'Hud', 'Nuh', 'Yusuf'], note: 'Yusuf is also a surah name.' };
  test('the exact set is acknowledged, in any order', () => {
    expect(matchAlternate(['Yusuf', 'Nuh', 'Hud', 'Yunus'], [alt])).toBe(alt);
  });
  test('other selections and boards without alternates are not', () => {
    expect(matchAlternate(['Yunus', 'Hud', 'Nuh', 'Ibrahim'], [alt])).toBeNull();
    expect(matchAlternate(['Yunus', 'Hud', 'Nuh'], [alt])).toBeNull();
    expect(matchAlternate(['Yunus', 'Hud', 'Nuh', 'Yusuf'], undefined)).toBeNull();
    expect(matchAlternate(['Yunus', 'Yunus', 'Nuh', 'Yusuf'], [alt])).toBeNull();
  });
  test('an alternate is not a group, so match() never solves it and the app does not count it as a miss', () => {
    const board = puzzles.find(p => (p as { alternates?: unknown }).alternates)!;
    const bag = (board as { alternates: Alternate[] }).alternates;
    const remaining = board.groups.map(gid);
    for (const a of bag) {
      expect(matchAlternate([...a.terms].reverse(), bag)).toBe(a);
      expect(match(a.terms, remaining).group).toBeNull();
    }
  });
});
