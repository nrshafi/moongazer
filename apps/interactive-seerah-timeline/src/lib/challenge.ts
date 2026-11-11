// "Which came first?" engine: pure functions, ported from the Islamic History Timeline Challenge app.
import { shuffle, hash } from './utils';

export interface Pack { id: string; number: number; title: string; events: string[] }
export interface Progress { pack: string; order: string[]; tries: number; hint: boolean; revealed: boolean; complete: boolean; seed: string }

export function permutation(order: unknown, target: string[]): order is string[] {
  return Array.isArray(order) && order.length === target.length && new Set(order).size === target.length && order.every(id => typeof id === 'string' && target.includes(id));
}

export function grade(order: string[], target: string[]) {
  if (!permutation(order, target)) throw new Error('Order must contain every event exactly once.');
  const positions = order.map((id, i) => target[i] === id);
  let inversions = 0;
  for (let a = 0; a < order.length; a++) for (let b = a + 1; b < order.length; b++) if (target.indexOf(order[a]!) > target.indexOf(order[b]!)) inversions++;
  return { correct: positions.every(Boolean), positions, inversions };
}

/** The old app's progress validator, unchanged, so imported progress is checked the same way. */
export function valid(v: unknown, packs: { id: string; events: string[] }[]): v is Progress {
  const p = v as Progress, pack = packs.find(c => c.id === p?.pack);
  return !!pack && permutation(p.order, pack.events) && Number.isInteger(p.tries) && p.tries >= 0 && p.tries <= 1000000 && typeof p.hint === 'boolean' && typeof p.revealed === 'boolean' && typeof p.complete === 'boolean' && (!p.complete || grade(p.order, pack.events).correct) && typeof p.seed === 'string' && /^[a-zA-Z0-9_-]{1,40}$/.test(p.seed);
}

/** A fresh seed for each play, so replaying a pack gives a different starting order. */
export function randomSeed(): string { return (Math.random().toString(36) + '00000000').slice(2, 10); }

/** Seeded starting order; never starts already solved. */
export function initialOrder(target: string[], seed: string): string[] {
  const order = shuffle(target, hash(seed));
  if (grade(order, target).correct) order.reverse();
  return order;
}

export function initialProgress(pack: { id: string; events: string[] }, seed: string): Progress {
  return { pack: pack.id, order: initialOrder(pack.events, seed), tries: 0, hint: false, revealed: false, complete: false, seed };
}

/** Moves the card at `index` by `delta` places (-1 up, +1 down). Out-of-range moves return the order unchanged. */
export function move(order: string[], index: number, delta: number): string[] {
  const to = index + delta;
  if (!Number.isInteger(index) || !Number.isInteger(delta) || index < 0 || to < 0 || index >= order.length || to >= order.length) return [...order];
  const result = [...order];
  [result[index], result[to]] = [result[to]!, result[index]!];
  return result;
}
