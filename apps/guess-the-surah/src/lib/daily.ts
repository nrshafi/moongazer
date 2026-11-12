// Shared daily-puzzle module (P6 T6.1). Identical copy in guess-the-surah, ayah-threads, word-groups and seerah-timeline.
// homepage/daily.js mirrors DAILY_EPOCH, dayNumber and dailyIndex in plain JS; homepage/tests/daily-parity.test.ts keeps them equal.
import { shuffle } from './utils';
import { whatsappUrl } from './session-end';

export { whatsappUrl };

/** Launch day: puzzle #1. Local calendar date, 'YYYY-MM-DD'. */
export const DAILY_EPOCH = '2026-12-31';
/** True while DAILY_EPOCH is a placeholder. The release step sets the real date and flips this to false (tests/daily-release.test.ts). */
export const DAILY_EPOCH_IS_PLACEHOLDER = true;

const DAY_MS = 86400000;
const KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/** Local calendar date of `date` as 'YYYY-MM-DD' (the visitor's time zone, not UTC). */
export function localDateKey(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;
}

/** UTC midnight (ms) of a valid 'YYYY-MM-DD' key, or null when malformed or not a real calendar date. */
function keyToUtc(key: string): number | null {
  const m = KEY.exec(key);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  return back.getUTCFullYear() === y && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d ? t : null;
}

/**
 * Puzzle number for the local calendar date of `date`: the epoch day is 1, the next day 2, and so on.
 * Dates before the epoch return 0 (documented: no daily puzzle, practice mode only).
 */
export function dayNumber(date: Date): number {
  const epoch = keyToUtc(DAILY_EPOCH)!;
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const n = Math.floor((today - epoch) / DAY_MS) + 1;
  return n < 1 ? 0 : n;
}

/**
 * Index into a bank of `bankLength` items for puzzle `n`. The bank is permuted once with a seeded Fisher-Yates
 * (`shuffle(items, seed)`), then read at `(n - 1) mod bankLength`, so every item appears once before any repeats.
 * Use a constant seed per app. Returns -1 for an empty bank.
 */
export function dailyIndex(n: number, bankLength: number, seed: number): number {
  if (!Number.isInteger(bankLength) || bankLength < 1) return -1;
  const order = shuffle(Array.from({ length: bankLength }, (_, i) => i), seed);
  const pos = (((n - 1) % bankLength) + bankLength) % bankLength;
  return order[pos]!;
}

export interface Streak { last: string; count: number; best: number }

/** Validator for `read('streak', isStreak)`. */
export function isStreak(value: unknown): value is Streak {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.last === 'string' && keyToUtc(v.last) !== null
    && Number.isInteger(v.count) && (v.count as number) >= 1
    && Number.isInteger(v.best) && (v.best as number) >= (v.count as number);
}

/**
 * Streak after the visitor completes the daily puzzle on `todayKey`. Stored under the key `<slug>:streak` via read/write.
 * No valid `prev` (or an invalid `todayKey`): starts at 1. Same day: unchanged. Next day: count + 1. Gap: count resets to 1.
 * A stored `last` later than today (clock change) leaves the streak unchanged. `best` is the maximum count ever reached.
 */
export function updateStreak(prev: unknown, todayKey: string): Streak {
  const today = keyToUtc(todayKey);
  if (today === null) return { last: todayKey, count: 1, best: 1 };
  if (!isStreak(prev)) return { last: todayKey, count: 1, best: 1 };
  const diff = Math.round((today - keyToUtc(prev.last)!) / DAY_MS);
  if (diff <= 0) return { ...prev };
  const count = diff === 1 ? prev.count + 1 : 1;
  return { last: todayKey, count, best: Math.max(prev.best, count) };
}

export interface ShareInput { name: string; n: number; resultLine: string; host: string }

/** Plain share text: "<name> #<n> · <result line>" then the app host. No emoji, no URL parameters; the caller keeps the answer out of `resultLine`. */
export function shareText({ name, n, resultLine, host }: ShareInput): string {
  return `${name} #${n} · ${resultLine}\n${host}`;
}

/** Throws when `text` contains any forbidden string (case-insensitive). Use it in tests to prove a share text never leaks the answer. */
export function assertNoAnswer(text: string, forbidden: readonly string[]): void {
  const lower = text.toLowerCase();
  for (const word of forbidden) {
    if (word && lower.includes(word.toLowerCase())) throw new Error(`Share text contains forbidden string "${word}"`);
  }
}

const icsText = (s: string) => s.replace(/[\\;,]/g, m => '\\' + m).replace(/\r?\n/g, '\\n');

/** UTC stamp for DTSTAMP and the UID, e.g. 20261112T143000Z. */
function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export interface ReminderInput { name: string; host: string; time: string; now: Date }

/**
 * P6 T6.7: a calendar file with one daily repeating event at the visitor's chosen local time ('HH:MM', 24-hour).
 * Floating local time (no TZID), so the reminder follows the device clock, like the puzzle's local-midnight change.
 * Built in the browser; nothing is sent anywhere. Returns null for an invalid time.
 */
export function dailyReminderIcs({ name, host, time, now }: ReminderInput): string | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!m) return null;
  const stamp = icsStamp(now);
  const day = localDateKey(now).replaceAll('-', '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Moongazer//Daily reminder//EN',
    'BEGIN:VEVENT',
    `UID:daily-${host.split('.')[0]}-${stamp}@moongazer.tech`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T${m[1]}${m[2]}00`,
    'DURATION:PT10M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${icsText(`${name}: today's puzzle`)}`,
    `DESCRIPTION:${icsText(`A new puzzle is ready. https://${host}/`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
