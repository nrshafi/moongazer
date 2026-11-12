import { test, expect } from 'bun:test';
import { DAILY_EPOCH_IS_PLACEHOLDER } from '../src/lib/daily';

// Runs only when RELEASE=1: the release step must replace the placeholder epoch before publishing.
test.skipIf(process.env.RELEASE !== '1')('DAILY_EPOCH is the real launch date, not the placeholder', () => {
  expect(DAILY_EPOCH_IS_PLACEHOLDER).toBe(false);
});
