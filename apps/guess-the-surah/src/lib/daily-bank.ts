// Daily bank for Guess the Surah (P6 T6.2): all 114 chapters in data order, one per day via the shared daily module.
// The directory (T6.6) imports DAILY_SEED, BANK_VERSION and dailyItem, so keep these names exact.
import data from '../data/content.json';
import { DAILY_EPOCH, dailyIndex, dayNumber } from './daily';

export const DAILY_SEED = 114;
export const BANK_VERSION = 1;

type Chapter = (typeof data.chapters)[number];

/** The chapter for puzzle `n` (n >= 1). Every chapter appears once in each block of 114 days. */
export function dailyItem(n: number): Chapter {
  return data.chapters[dailyIndex(n, data.chapters.length, DAILY_SEED)]!;
}

/** Today's puzzle number for `date`, or 0 before the epoch (Practice only). */
export function todayNumber(date: Date): number { return dayNumber(date); }

/** "31 December 2026": the epoch date as plain text, independent of the visitor's time zone. */
export function epochLabel(): string {
  const [y, m, d] = DAILY_EPOCH.split('-').map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** The single line shown in Daily before the first puzzle. */
export function beforeEpochLine(): string { return `The first daily puzzle opens on ${epochLabel()}.`; }
