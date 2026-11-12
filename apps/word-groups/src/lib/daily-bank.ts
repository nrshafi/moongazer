// Daily board selection (P6 T6.4). The bank is the boards in `content.json`, in data order.
// The directory (T6.6) imports DAILY_SEED, BANK_VERSION and dailyItem, so keep these names.
import { puzzles } from '../data/content.json';
import { dailyIndex, shareText } from './daily';
import { resultLine } from './engine';

export const DAILY_SEED = 40;
/** Bump when boards are appended to the bank (content track); numbers follow the new permutation from the next cycle. */
export const BANK_VERSION = 1;
export const DAILY_NAME = 'Word Groups';
export const DAILY_HOST = 'word-groups.moongazer.tech';

export type Board = (typeof puzzles)[number];
export const bank: readonly Board[] = puzzles;

/** The board for puzzle number `n` (1 or more). Returns undefined before the epoch (`n` below 1). */
export function dailyItem(n: number): Board | undefined {
  if (!Number.isInteger(n) || n < 1 || bank.length === 0) return undefined;
  return bank[dailyIndex(n, bank.length, DAILY_SEED)];
}

/** "Word Groups #N · 4 groups, 1 mistake" then the host. No group name, term or board number appears. */
export function dailyShare(n: number, solvedCount: number, misses: number): string {
  return shareText({ name: DAILY_NAME, n, resultLine: resultLine(solvedCount, misses), host: DAILY_HOST });
}
