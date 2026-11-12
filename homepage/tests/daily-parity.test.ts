import { test, expect } from 'bun:test';
import * as app from '../../apps/guess-the-surah/src/lib/daily';
// @ts-ignore plain-JS module without types
import * as dir from '../daily.js';

test('directory epoch equals the app epoch', () => {
  expect(dir.DAILY_EPOCH).toBe(app.DAILY_EPOCH);
});

test('dayNumber and dailyIndex match the app module for 400 consecutive days', () => {
  const [y, m, d] = app.DAILY_EPOCH.split('-').map(Number) as [number, number, number];
  for (let i = -20; i < 380; i++) {
    const date = new Date(y, m - 1, d + i, 9, 30);
    const n = app.dayNumber(date);
    expect(dir.dayNumber(date)).toBe(n);
    for (const size of [30, 114]) {
      for (const seed of [1, 20261231]) {
        expect(dir.dailyIndex(n, size, seed)).toBe(app.dailyIndex(n, size, seed));
      }
    }
  }
});

test('ayah of the night follows the day number and shows every ayah once before repeating (T6.6)', () => {
  const ayat = JSON.parse(require('node:fs').readFileSync(require('node:path').join(import.meta.dir, '../ayat-of-the-night.json'), 'utf8'));
  const [y, m, d] = app.DAILY_EPOCH.split('-').map(Number) as [number, number, number];
  const seen = new Set<number>();
  for (let i = 0; i < ayat.length; i++) {
    const date = new Date(y, m - 1, d + i, 22, 0);
    const index = dir.ayahIndex(date, ayat.length);
    expect(index).toBe(app.dailyIndex(app.dayNumber(date), ayat.length, dir.AYAH_SEED));
    seen.add(index);
  }
  expect(seen.size).toBe(ayat.length);
  // Before launch the directory still shows an ayah every night (no clamping to puzzle #0).
  for (let i = 1; i <= 30; i++) {
    const index = dir.ayahIndex(new Date(y, m - 1, d - i, 22, 0), ayat.length);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(ayat.length);
  }
});

test('longDate formats the epoch without time-zone conversion', () => {
  expect(dir.longDate('2026-12-31')).toBe('31 December 2026');
  expect(dir.longDate('2027-01-05')).toBe('5 January 2027');
});
