import {test, expect} from 'bun:test';
import {
  JUZ, SURAHS, LAYOUT_PAGES, EMPTY_SELECTION, countSelectedPages, isSelection, markPages, rangeOfJuz, rangeOfSurah,
} from '../src/lib/pages';

const allJuz = JUZ.map(j => j.juz);
const allSurahs = SURAHS.map(s => s.surah);

test('the bundled data has 30 juz and 114 surahs with ranges inside the 604-page layout', () => {
  expect(JUZ).toHaveLength(30);
  expect(SURAHS).toHaveLength(114);
  for (const j of JUZ) expect(j.pageStart).toBeLessThanOrEqual(j.pageEnd);
  for (const s of SURAHS) {
    expect(s.pageStart).toBeGreaterThanOrEqual(1);
    expect(s.pageEnd).toBeLessThanOrEqual(LAYOUT_PAGES);
    expect(s.juzStart).toBeLessThanOrEqual(s.juzEnd);
  }
});

test('every page 1 to 604 is covered by at least one juz and by at least one surah', () => {
  const byJuz = markPages({juz: allJuz, surahs: []});
  const bySurah = markPages({juz: [], surahs: allSurahs});
  for (let p = 1; p <= LAYOUT_PAGES; p++) {
    expect(byJuz[p]).toBe(1);
    expect(bySurah[p]).toBe(1);
  }
});

test('selecting all 30 juz gives 604 pages', () => {
  expect(countSelectedPages({juz: allJuz, surahs: []})).toBe(604);
});

test('selecting all 114 surahs gives 604 pages', () => {
  expect(countSelectedPages({juz: [], surahs: allSurahs})).toBe(604);
});

test('selecting juz and surahs together still counts each page once', () => {
  expect(countSelectedPages({juz: allJuz, surahs: allSurahs})).toBe(604);
});

test('a page shared by neighbouring juz is counted once (juz 3 ends and juz 4 starts on page 62)', () => {
  expect(rangeOfJuz(3)).toEqual({start: 42, end: 62});
  expect(rangeOfJuz(4)).toEqual({start: 62, end: 81});
  // juz 3 is 21 pages, juz 4 is 20 pages, and page 62 is shared: 40 distinct pages.
  expect(countSelectedPages({juz: [3, 4], surahs: []})).toBe(40);
});

test('a surah and a juz that overlap count their shared pages once', () => {
  // Al-Baqarah covers pages 2 to 49; juz 1 covers pages 1 to 21. Union: pages 1 to 49.
  expect(rangeOfSurah(2)).toEqual({start: 2, end: 49});
  expect(countSelectedPages({juz: [1], surahs: [2]})).toBe(49);
});

test('an empty selection counts zero and a single surah counts its own pages', () => {
  expect(countSelectedPages(EMPTY_SELECTION)).toBe(0);
  expect(countSelectedPages({juz: [], surahs: [114]})).toBe(1);
  expect(rangeOfSurah(999)).toBeNull();
  expect(rangeOfJuz(0)).toBeNull();
});

test('the selection validator accepts whole in-range unique numbers only', () => {
  expect(isSelection({juz: [1, 30], surahs: [1, 114]})).toBe(true);
  expect(isSelection({juz: [], surahs: []})).toBe(true);
  const rejects: unknown[] = [
    null, 'x', {juz: [0], surahs: []}, {juz: [31], surahs: []}, {juz: [1.5], surahs: []},
    {juz: [], surahs: [115]}, {juz: [], surahs: [0]}, {juz: [1, 1], surahs: []}, {juz: [1]}, {juz: '1', surahs: []},
  ];
  for (const raw of rejects) expect(isSelection(raw)).toBe(false);
});
