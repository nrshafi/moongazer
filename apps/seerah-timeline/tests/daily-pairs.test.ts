import {test,expect} from 'bun:test';
import data from '../src/data/content.json';

const pairs = (data as {dailyPairs: {id: string; first: string; second: string; why: string}[]}).dailyPairs;
const events = new Map(data.events.map((e) => [e.id, e]));

test('at least 30 daily pairs with unique, non-revealing ids', () => {
  expect(pairs.length).toBeGreaterThanOrEqual(30);
  expect(new Set(pairs.map((p) => p.id)).size).toBe(pairs.length);
  for (const p of pairs) {
    expect(p.id).toMatch(/^pair-\d{2,}$/);
    expect(p.why.length).toBeGreaterThan(20);
  }
});

test('every pair references existing events and first is dated before second', () => {
  for (const p of pairs) {
    const a = events.get(p.first);
    const b = events.get(p.second);
    expect(a, p.id + ' first').toBeDefined();
    expect(b, p.id + ' second').toBeDefined();
    expect(p.first).not.toBe(p.second);
    expect(a!.year).toBeLessThan(b!.year);
  }
});

test('no event appears more than three times', () => {
  const counts = new Map<string, number>();
  for (const p of pairs) for (const id of [p.first, p.second]) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, n] of counts) expect(n, id).toBeLessThanOrEqual(3);
});

test('paired events are not disputed and titles do not reveal the order', () => {
  const cue = /\b(first|second|third|last|final|earlier|later|before|after|farewell|beginning)\b|\d/i;
  for (const p of pairs) {
    for (const id of [p.first, p.second]) {
      const e = events.get(id)!;
      expect(e.uncertainty + ' ' + e.date, id).not.toMatch(/disputed|debated/i);
      expect(e.title, id).not.toMatch(cue);
    }
  }
});
