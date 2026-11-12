import {test, expect} from 'bun:test';
import {existsSync, readFileSync} from 'node:fs';
import {packs} from '../src/data/content.json';

const ramadan = packs.filter(pack => 'series' in pack && pack.series === 'ramadan') as Array<(typeof packs)[number] & {series: string; night: number}>;

test('the Ramadan series has 30 packs, one for each night, each exactly once', () => {
 expect(ramadan).toHaveLength(30);
 expect(ramadan.map(pack => pack.night).sort((a, b) => a - b)).toEqual(Array.from({length: 30}, (_, i) => i + 1));
 expect(packs.filter(pack => 'series' in pack && pack.series !== 'ramadan')).toHaveLength(0);
});

test('every age band meets the family at least 8 times in the month', () => {
 for (const age of ['5–7', '8–11', '12+']) expect(ramadan.filter(pack => pack.age === age).length).toBeGreaterThanOrEqual(8);
});

test('each Ramadan pack has the full set of fields, three distinct options and a passage', () => {
 for (const pack of ramadan) {
  expect(pack.options).toHaveLength(3);
  expect(new Set(pack.options).size).toBe(3);
  expect(pack.answer).toBeGreaterThanOrEqual(0);
  expect(pack.answer).toBeLessThan(3);
  expect(pack.title.length).toBeGreaterThan(5);
  for (const field of ['question', 'explanation', 'discussion', 'activity', 'close', 'teaching'] as const) expect(String(pack[field]).length).toBeGreaterThan(10);
  expect('passage' in pack && pack.passage.arabic.length > 0 && pack.passage.translation.length > 0).toBe(true);
  expect(pack.teaching).toContain('Al-Muyassar');
  // No answer in the title: the correct option text is never contained in the title.
  expect(pack.title.toLowerCase()).not.toContain(pack.options[pack.answer]!.toLowerCase());
 }
});

test('the answer position varies across the month', () => {
 expect(new Set(ramadan.map(pack => pack.answer)).size).toBe(3);
});

// The snapshot lives in the portfolio repository, outside this app. When the app is copied on its own the check is
// skipped; _implementation/verify-static.py performs the same comparison for every passage in the portfolio build.
const snapshotPath = new URL('../../../_implementation/research/quran-full.json', import.meta.url);
test.skipIf(!existsSync(snapshotPath))('Ramadan passages equal the verified quran-full.json snapshot byte for byte', () => {
 const verses = JSON.parse(readFileSync(snapshotPath, 'utf-8')).verses as Record<string, {arabic: string; translation: string}>;
 for (const pack of ramadan) {
  if (!('passage' in pack)) throw new Error(pack.id);
  const [chapter, span] = pack.passage.ref.split(':') as [string, string];
  const [from, to] = span.includes('-') ? span.split('-') as [string, string] : [span, span];
  const parts = [];
  for (let n = Number(from); n <= Number(to); n++) parts.push(verses[`${chapter}:${n}`]!);
  expect(pack.passage.arabic).toBe(parts.map(part => part.arabic).join('\n'));
  expect(pack.passage.translation).toBe(parts.map(part => part.translation).join('\n'));
 }
});
