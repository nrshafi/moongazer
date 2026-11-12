// Daily "Which came first?" bank (P6 T6.5). The directory (T6.6) imports these names.
import data from '../data/content.json';
import { dailyIndex } from './daily';

export const DAILY_SEED = 31;
export const BANK_VERSION = 1;

export interface DailyPair { id: string; first: string; second: string; why: string }
export const dailyPairs: readonly DailyPair[] = (data as { dailyPairs: DailyPair[] }).dailyPairs;

/** The pair for puzzle `n` (data order, permuted once by DAILY_SEED). Null before the epoch (n < 1) or for an empty bank. */
export function dailyItem(n: number): DailyPair | null {
  if (!Number.isInteger(n) || n < 1) return null;
  const i = dailyIndex(n, dailyPairs.length, DAILY_SEED);
  return i < 0 ? null : dailyPairs[i]!;
}
