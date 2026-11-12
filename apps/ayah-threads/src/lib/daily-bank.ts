// Daily puzzle selection and share text for Ayah Threads (P6 T6.3). Pure functions: no DOM, so tests can run them.
// The directory (T6.6) imports DAILY_SEED and BANK_VERSION, so keep these names exact.
import data from '../data/content.json';
import { dailyIndex, shareText, type Streak } from './daily';

export { isStreak } from './daily';

/** Seed of the fixed permutation of the bank (see `dailyIndex`). */
export const DAILY_SEED = 30;
/** Bump when puzzles are added to the end of the bank; numbers after a growth event follow the new permutation from the next cycle. */
export const BANK_VERSION = 1;
export const APP_NAME = 'Ayah Threads';
export const APP_HOST = 'ayah-threads.moongazer.tech';

export type DailyPuzzle = (typeof data.puzzles)[number];

/** The puzzle for daily number `n` (bank order is the data order in content.json). `null` before the epoch (n < 1). */
export function dailyItem(n: number): DailyPuzzle | null {
  if (!Number.isInteger(n) || n < 1) return null;
  const index = dailyIndex(n, data.puzzles.length, DAILY_SEED);
  return index < 0 ? null : data.puzzles[index]!;
}

/** What is saved for a finished daily puzzle. `wrong` holds the labels of the wrong guesses. */
export interface DailyResult { outcome: 'solved' | 'revealed'; hint: boolean; wrong: string[] }
export interface DailyRecord { n: number; result: DailyResult }

/** Validator for `read('daily', isDailyRecord)`. */
export function isDailyRecord(value: unknown): value is DailyRecord {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (!Number.isInteger(v.n) || (v.n as number) < 1 || !v.result || typeof v.result !== 'object') return false;
  const r = v.result as Record<string, unknown>;
  return (r.outcome === 'solved' || r.outcome === 'revealed') && typeof r.hint === 'boolean'
    && Array.isArray(r.wrong) && r.wrong.length <= 4 && r.wrong.every(x => typeof x === 'string' && x.length <= 60);
}

/** The result part of the share text. Never contains the theme. */
export function dailyResultLine(result: DailyResult): string {
  if (result.outcome === 'revealed') return 'connection revealed';
  const hints = result.hint ? 'with 1 hint' : 'with no hints';
  const misses = result.wrong.length;
  return `solved ${hints}${misses ? `, ${misses} wrong ${misses === 1 ? 'guess' : 'guesses'}` : ''}`;
}

/** "Ayah Threads #12 · solved with 1 hint" then the app host. */
export function dailyShareText(n: number, result: DailyResult): string {
  return shareText({ name: APP_NAME, n, resultLine: dailyResultLine(result), host: APP_HOST });
}

const dayMs = (key: string) => Date.parse(`${key}T00:00:00Z`);

/** "Streak: 3 days (best 5)". A streak whose last day is before yesterday has ended, so it shows 0 days (the best is kept). */
export function streakLine(streak: Streak | null, todayKey: string): string {
  if (!streak) return 'Streak: 0 days. Solve today’s puzzle to start one.';
  const gap = Math.round((dayMs(todayKey) - dayMs(streak.last)) / 86400000);
  const count = gap <= 1 ? streak.count : 0;
  return `Streak: ${count} ${count === 1 ? 'day' : 'days'} (best ${streak.best})`;
}
