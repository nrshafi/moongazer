import { test, expect } from 'bun:test';
import data from '../src/data/content.json';

const norm = (s: string) => s.toLowerCase();

test('30 themes, each id matches a puzzle id and passages equal the puzzle passages', () => {
  expect(data.themes.length).toBe(30);
  expect(data.themes.map(t => t.id)).toEqual(data.puzzles.map(p => p.id));
  for (const [i, theme] of data.themes.entries()) {
    expect(theme.passages).toEqual(data.puzzles[i]!.passages);
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
