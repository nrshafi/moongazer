// Juz membership (P6 T6.2). Boundaries are copied from verified Quran MCP metadata into src/data/juz-starts.json
// (see provenance.json "juzStarts"); nothing here is hand-typed. A surah belongs to the juz in which its first ayah falls.
import boundaries from '../data/juz-starts.json';

export const JUZ_STARTS: readonly string[] = boundaries.starts;
export const DEFAULT_JUZ = 30;

const parse = (key: string): [number, number] => { const [s, a] = key.split(':'); return [Number(s), Number(a)]; };
const before = (a: [number, number], b: [number, number]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);

/** Surah numbers whose first ayah falls in juz `juz` (1-30), in mushaf order. Empty for juz 2 and 5 and for an invalid juz. */
export function surahsInJuz(juz: number): number[] {
  if (!Number.isInteger(juz) || juz < 1 || juz > JUZ_STARTS.length) return [];
  const lo = parse(JUZ_STARTS[juz - 1]!);
  const hi = juz < JUZ_STARTS.length ? parse(JUZ_STARTS[juz]!) : null;
  const out: number[] = [];
  for (let s = 1; s <= 114; s++) {
    const first: [number, number] = [s, 1];
    if (!before(first, lo) && (!hi || before(first, hi))) out.push(s);
  }
  return out;
}
