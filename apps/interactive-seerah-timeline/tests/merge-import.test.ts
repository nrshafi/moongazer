import { test, expect } from 'bun:test';
import { encodePayload, decodeFragment, planImport } from '../src/lib/import';
import { rules } from '../src/lib/merge-import';
import { packs } from '../src/data/content.json';

const OLD = 'islamic-history-timeline-challenge';
const pack = packs[3]!;
const progress = { pack: pack.id, order: [...pack.events].reverse(), tries: 2, hint: true, revealed: false, complete: false, seed: 'abc123' };
const plan = (from: string, items: Record<string, unknown>, existing: Record<string, unknown> = {}) =>
  planImport(decodeFragment('#import=' + encodePayload(from, items)!)!, rules, key => existing[key] ?? null);

test('old challenge progress is saved under challenge-progress unchanged', () => {
  expect(plan(OLD, { progress }).writes).toEqual([['challenge-progress', progress]]);
  const done = { ...progress, order: pack.events, complete: true };
  expect(plan(OLD, { progress: done }).writes).toEqual([['challenge-progress', done]]);
});

test('invalid progress is dropped: wrong events, a false completed claim, a bad seed, a wrong type', () => {
  expect(plan(OLD, { progress: { ...progress, order: ['x', 'y', 'z', 'w'] } }).writes).toEqual([]);
  expect(plan(OLD, { progress: { ...progress, complete: true } }).writes).toEqual([]);
  expect(plan(OLD, { progress: { ...progress, seed: '<script>' } }).writes).toEqual([]);
  expect(plan(OLD, { progress: { ...progress, pack: 'challenge-99' } }).writes).toEqual([]);
  expect(plan(OLD, { progress: 'nope' }).writes).toEqual([]);
});

test('an existing local game is kept; other apps and unknown keys are ignored', () => {
  const kept = plan(OLD, { progress }, { 'challenge-progress': { pack: pack.id } });
  expect(kept.writes).toEqual([]);
  expect(kept.accepted).toBe(1);
  expect(plan('some-other-app', { progress }).writes).toEqual([]);
  expect(plan(OLD, { remember: true, other: 1 }).writes).toEqual([]);
});
