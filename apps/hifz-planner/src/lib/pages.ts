import data from '../data/page-boundaries.json';

/**
 * Pure page-selection logic for the wizard's step 1: juz and surah choices become a set of mushaf pages.
 * Source and provenance: src/data/page-boundaries.json (Quran MCP fetch_quran_metadata, see provenance.json).
 * Neighbouring juz and surahs share boundary pages, so a page is counted once.
 */

export const LAYOUT_PAGES = 604;
export const JUZ_COUNT = 30;
export const SURAH_COUNT = 114;

export interface JuzRange {
  juz: number;
  pageStart: number;
  pageEnd: number;
}

export interface SurahRange {
  surah: number;
  /** Transliterated name from the metadata source. No Arabic text is stored here. */
  name: string;
  pageStart: number;
  pageEnd: number;
  juzStart: number;
  juzEnd: number;
}

export interface Selection {
  juz: readonly number[];
  surahs: readonly number[];
}

export const JUZ: readonly JuzRange[] = (data.juz as [number, number, number][]).map(([juz, pageStart, pageEnd]) => ({juz, pageStart, pageEnd}));

export const SURAHS: readonly SurahRange[] = (data.surahs as [number, string, number, number, number, number][]).map(
  ([surah, name, pageStart, pageEnd, juzStart, juzEnd]) => ({surah, name, pageStart, pageEnd, juzStart, juzEnd}),
);

export const EMPTY_SELECTION: Selection = {juz: [], surahs: []};

/** Pages covered by a juz or surah, inclusive. */
export function rangeOfJuz(juz: number): {start: number; end: number} | null {
  const row = JUZ.find(j => j.juz === juz);
  return row ? {start: row.pageStart, end: row.pageEnd} : null;
}

export function rangeOfSurah(surah: number): {start: number; end: number} | null {
  const row = SURAHS.find(s => s.surah === surah);
  return row ? {start: row.pageStart, end: row.pageEnd} : null;
}

/** Returns a marker per page 1..604 (index 0 unused): 1 when any chosen juz or surah covers the page. */
export function markPages(selection: Selection): Uint8Array {
  const marks = new Uint8Array(LAYOUT_PAGES + 1);
  for (const juz of selection.juz) {
    const range = rangeOfJuz(juz);
    if (range) marks.fill(1, range.start, range.end + 1);
  }
  for (const surah of selection.surahs) {
    const range = rangeOfSurah(surah);
    if (range) marks.fill(1, range.start, range.end + 1);
  }
  return marks;
}

/** Number of distinct pages covered by the selection. This is the value the plan's "already memorized" input uses. */
export function countSelectedPages(selection: Selection): number {
  return markPages(selection).reduce((sum, mark) => sum + mark, 0);
}

const isIntIn = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

/** Validates a selection from the form or from storage: whole numbers in range, no duplicates. */
export function isSelection(v: unknown): v is Selection {
  if (!v || typeof v !== 'object') return false;
  const s = v as Partial<Selection>;
  if (!Array.isArray(s.juz) || !Array.isArray(s.surahs)) return false;
  if (!s.juz.every(j => isIntIn(j, 1, JUZ_COUNT)) || !s.surahs.every(n => isIntIn(n, 1, SURAH_COUNT))) return false;
  return new Set(s.juz).size === s.juz.length && new Set(s.surahs).size === s.surahs.length;
}
