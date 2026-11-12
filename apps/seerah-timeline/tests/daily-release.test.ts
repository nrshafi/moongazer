import { test, expect } from 'bun:test';
import { DAILY_EPOCH, DAILY_EPOCH_IS_PLACEHOLDER } from '../src/lib/daily';

// P6 T6.9: the epoch is the R6 publication date. Changing it renumbers every daily puzzle, so it never changes after release.
test('DAILY_EPOCH is the real launch date, not the placeholder', () => {
  expect(DAILY_EPOCH_IS_PLACEHOLDER).toBe(false);
  expect(DAILY_EPOCH).toBe('2026-11-12');
});
