import { test, expect } from 'bun:test';
import data from '../src/data/content.json';
import atlas from '../../quran-concept-atlas/src/data/content.json';
import { encodePayload, decodeFragment, planImport } from '../src/lib/import';
import { rules } from '../src/lib/merge-import';

const norm = (s: string) => s.toLowerCase();

test('30 themes, each id matches a puzzle id and passages equal the puzzle and atlas passages', () => {
  expect(data.themes.length).toBe(30);
  expect(data.themes.map(t => t.id)).toEqual(data.puzzles.map(p => p.id));
  for (const [i, theme] of data.themes.entries()) {
    expect(theme.passages).toEqual(data.puzzles[i]!.passages);
    expect(theme.passages).toEqual(atlas.topics[i]!.passages);
    expect(theme.refs).toEqual(theme.passages.map(p => p.ref));
    expect(theme.theme).toBe(data.puzzles[i]!.theme);
    expect(['Character', 'Community', 'Reflection', 'Worship']).toContain(theme.category);
    expect(theme.commentaryUrl).toMatch(/^https:\/\/quran.com\//);
  }
});

test('neutral titles and descriptions do not reveal the theme or the explanation', () => {
  for (const theme of data.themes) {
    for (const text of [theme.title, theme.description]) {
      expect(norm(text)).not.toContain(norm(theme.theme));
      expect(norm(text)).not.toContain(norm(theme.explanation));
    }
    expect(theme.title).toMatch(/^Thread \d{2}: Quran /);
  }
  expect(new Set(data.themes.map(t => t.title)).size).toBe(30);
});

const wrap = (items: Record<string, unknown>, from = 'quran-concept-atlas') => decodeFragment('#import=' + encodePayload(from, items)!)!;

test('atlas bookmarks merge into theme-bookmarks as a union and drop invalid values', () => {
  const existing = (key: string) => (key === 'theme-bookmarks' ? ['mercy', 'patience'] : null);
  const plan = planImport(wrap({ bookmarks: ['patience', 'gratitude'] }), rules, existing);
  expect(plan.writes).toEqual([['theme-bookmarks', ['mercy', 'patience', 'gratitude']]]);
  expect(plan.accepted).toBe(2);
  expect(planImport(wrap({ bookmarks: ['Bad Id'] }), rules, () => null).writes).toEqual([]);
  expect(planImport(wrap({ bookmarks: 'patience' }), rules, () => null).writes).toEqual([]);
  expect(planImport(wrap({ bookmarks: Array.from({ length: 101 }, () => 'a') }), rules, () => null).writes).toEqual([]);
});

test('other sources and keys are ignored', () => {
  expect(planImport(wrap({ bookmarks: ['patience'] }, 'someone-else'), rules, () => null).writes).toEqual([]);
  expect(planImport(wrap({ progress: ['patience'] }), rules, () => null).writes).toEqual([]);
});
