import { test, expect } from 'bun:test';
import { packs, events } from '../src/data/content.json';
import { grade, permutation, valid, move, initialOrder, initialProgress, randomSeed } from '../src/lib/challenge';

test('twelve challenges each refer to four distinct timeline events in broad chronology', () => {
  expect(packs).toHaveLength(12);
  expect(new Set(packs.map(p => p.id)).size).toBe(12);
  expect(new Set(packs.map(p => p.title)).size).toBe(12);
  for (const p of packs) {
    expect(p.events).toHaveLength(4);
    expect(new Set(p.events).size).toBe(4);
    const rows = p.events.map(id => events.find(e => e.id === id)!);
    expect(rows.every(Boolean)).toBe(true);
    expect(rows.map(r => r.year)).toEqual([...rows.map(r => r.year)].sort((a, b) => a - b));
    expect(new Set(rows.map(r => r.year)).size).toBe(4);
    expect(rows.every(r => r.sources.length > 0 && r.uncertainty.length > 0)).toBe(true);
  }
});

test('grading counts correct positions and inverted pairs', () => {
  expect(grade(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])).toEqual({ correct: true, positions: [true, true, true, true], inversions: 0 });
  expect(grade(['d', 'c', 'b', 'a'], ['a', 'b', 'c', 'd']).inversions).toBe(6);
  expect(grade(['a', 'c', 'b', 'd'], ['a', 'b', 'c', 'd']).positions).toEqual([true, false, false, true]);
});

test('event permutations cannot contain duplicates, omissions, or foreign IDs', () => {
  expect(permutation(['a', 'a'], ['a', 'b'])).toBe(false);
  expect(permutation(['b'], ['a', 'b'])).toBe(false);
  expect(() => grade(['a', 'x'], ['a', 'b'])).toThrow();
});

test('a stored complete state must have the correct order', () => {
  const pack = packs[0]!;
  const p = { pack: pack.id, order: pack.events, tries: 1, hint: false, revealed: false, complete: true, seed: 'seed' };
  expect(valid(p, packs)).toBe(true);
  expect(valid({ ...p, order: [...pack.events].reverse() }, packs)).toBe(false);
  expect(valid({ ...p, tries: NaN }, packs)).toBe(false);
  expect(valid({ ...p, seed: '<b>' }, packs)).toBe(false);
  expect(valid({ ...p, pack: 'nope' }, packs)).toBe(false);
  expect(valid(null, packs)).toBe(false);
  expect(valid(7, packs)).toBe(false);
});

test('moving a card swaps it with its neighbour and ignores moves off either end', () => {
  expect(move(['a', 'b', 'c', 'd'], 1, -1)).toEqual(['b', 'a', 'c', 'd']);
  expect(move(['a', 'b', 'c', 'd'], 1, 1)).toEqual(['a', 'c', 'b', 'd']);
  expect(move(['a', 'b', 'c', 'd'], 0, -1)).toEqual(['a', 'b', 'c', 'd']);
  expect(move(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'b', 'c', 'd']);
  const order = ['a', 'b'];
  move(order, 0, 1);
  expect(order).toEqual(['a', 'b']);
});

test('a seeded start order is repeatable, complete and never already solved; each pack and play can differ', () => {
  for (const p of packs) {
    for (const seed of ['one', 'two', 'three', 'xyz']) {
      const order = initialOrder(p.events, seed);
      expect(order).toEqual(initialOrder(p.events, seed));
      expect(permutation(order, p.events)).toBe(true);
      expect(grade(order, p.events).correct).toBe(false);
    }
    expect(valid(initialProgress(p, 'seed-1'), packs)).toBe(true);
  }
  expect(randomSeed()).toMatch(/^[a-z0-9]{1,40}$/);
  const starts = new Set(Array.from({ length: 12 }, (_, i) => initialOrder(packs[0]!.events, 'seed' + i).join()));
  expect(starts.size).toBeGreaterThan(1);
});
