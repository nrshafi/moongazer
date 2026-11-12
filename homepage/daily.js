// Directory copy of the shared daily logic (P6 T6.1 / T6.6). Plain ES module; not wired into any page yet.
// Mirrors DAILY_EPOCH, dayNumber and dailyIndex from apps/*/src/lib/daily.ts (and shuffle from utils.ts).
// homepage/tests/daily-parity.test.ts asserts identical output; change both together.

/** Launch day: puzzle #1, local calendar date 'YYYY-MM-DD'. Placeholder until the release step sets the real date. */
export const DAILY_EPOCH = '2026-12-31';

const DAY_MS = 86400000;

/** Seeded Fisher-Yates, identical to shuffle() in the apps' utils.ts. */
export function shuffle(items, seed = Math.floor(Math.random() * 2147483647)) {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Puzzle number for the local calendar date of `date`: epoch day is 1; dates before the epoch return 0. */
export function dayNumber(date) {
  const [y, m, d] = DAILY_EPOCH.split('-').map(Number);
  const epoch = Date.UTC(y, m - 1, d);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const n = Math.floor((today - epoch) / DAY_MS) + 1;
  return n < 1 ? 0 : n;
}

/** Index into a bank for puzzle `n`: seeded permutation read at (n - 1) mod bankLength; -1 for an empty bank. */
export function dailyIndex(n, bankLength, seed) {
  if (!Number.isInteger(bankLength) || bankLength < 1) return -1;
  const order = shuffle(Array.from({ length: bankLength }, (_, i) => i), seed);
  const pos = (((n - 1) % bankLength) + bankLength) % bankLength;
  return order[pos];
}
