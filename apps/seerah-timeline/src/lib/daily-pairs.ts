// Pure logic for the daily "Which came first?" pair (P6 T6.5). No DOM.
import data from '../data/content.json';
import { shuffle, hash } from './utils';
import { DAILY_SEED, dailyPairs, type DailyPair } from './daily-bank';
import { shareText, localDateKey, type Streak } from './daily';

export const APP_NAME = 'Seerah Timeline';
export const APP_HOST = 'seerah-timeline.moongazer.tech';

export type SeerahEvent = (typeof data.events)[number];
const events = new Map(data.events.map(e => [e.id, e]));
export const eventById = (id: string): SeerahEvent => events.get(id)!;

/** Fixed display order for puzzle `n`: deterministic for the day, and not always earlier-first. The seed is hashed because shuffle()'s generator is too regular for the raw DAILY_SEED + n. */
export function dailyOrder(pair: DailyPair, n: number): [string, string] {
  return shuffle([pair.first, pair.second], hash(`order:${DAILY_SEED}:${n}`)) as [string, string];
}

/** Random display order for practice. */
export function practiceOrder(pair: DailyPair, seed?: number): [string, string] {
  return shuffle([pair.first, pair.second], seed) as [string, string];
}

/** A random practice pair that is neither today's pair nor the one just shown. `random` returns [0, 1). */
export function practicePair(excludeIds: readonly (string | undefined)[], random: () => number = Math.random): DailyPair {
  const pool = dailyPairs.filter(p => !excludeIds.includes(p.id));
  const list = pool.length ? pool : dailyPairs;
  return list[Math.min(list.length - 1, Math.floor(random() * list.length))]!;
}

export const isCorrect = (pair: DailyPair, pickedId: string) => pickedId === pair.first;

/** True unless the event date is an exact "NNN CE" or "N AH · NNN CE" with no "c." and no approximating note. */
export function isApproximate(e: Pick<SeerahEvent, 'date' | 'uncertainty'>): boolean {
  if (!/\b\d{3} CE$/.test(e.date) || /\bc\./.test(e.date)) return true;
  return /approximate|conventional/i.test(e.uncertainty);
}

/** "c. 610 CE (approximate)" or "Makkan period (approximate)". */
export function yearLabel(e: Pick<SeerahEvent, 'date' | 'uncertainty'>): string {
  return isApproximate(e) ? `${e.date} (approximate)` : e.date;
}

/** Share text for the daily result. Never contains an event title. */
export function dailyShareText(n: number, correct: boolean): string {
  return shareText({ name: APP_NAME, n, resultLine: correct ? 'correct first try' : 'not this time', host: APP_HOST });
}

export interface DailySave { n: number; result: 'correct' | 'wrong' }
export function isDailySave(v: unknown): v is DailySave {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return Number.isInteger(s.n) && (s.n as number) >= 1 && (s.result === 'correct' || s.result === 'wrong');
}

/** "Streak: 3 days (best 5)". A streak whose last day is older than yesterday shows as 0 days. */
export function streakLine(streak: Streak, now: Date): string {
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const live = streak.last === localDateKey(now) || streak.last === localDateKey(yesterday);
  const days = live ? streak.count : 0;
  return `Streak: ${days} ${days === 1 ? 'day' : 'days'} (best ${streak.best})`;
}
