// Directory copy of the shared daily logic (P6 T6.1 / T6.6), used by app.js for the "Tonight on Moongazer" tiles.
// Mirrors DAILY_EPOCH, dayNumber and dailyIndex from apps/*/src/lib/daily.ts (and shuffle from utils.ts).
// homepage/tests/daily-parity.test.ts asserts identical output; change both together.

/** Launch day: puzzle #1, local calendar date 'YYYY-MM-DD'. Set at the R6 release to the publication date. */
export const DAILY_EPOCH = '2026-11-12';

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

/** Seed for the directory's ayah of the night permutation (T6.6). */
export const AYAH_SEED = 60;

/**
 * Ayah of the night index for the local date of `date`. Uses the same day count as dayNumber but does not clamp before
 * the epoch, so the directory shows an ayah every night, launch or not. On and after the epoch it equals
 * dailyIndex(dayNumber(date), length, AYAH_SEED).
 */
export function ayahIndex(date, length) {
  const [y, m, d] = DAILY_EPOCH.split('-').map(Number);
  const raw = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(y, m - 1, d)) / DAY_MS) + 1;
  return dailyIndex(raw, length, AYAH_SEED);
}

/** "31 December 2026" for a 'YYYY-MM-DD' key, without time-zone conversion. */
export function longDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}
