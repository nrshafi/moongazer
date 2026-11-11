import { test, expect } from 'bun:test';
import { encodePayload, decodeFragment, planImport, runImport, MAX_PAYLOAD, type ImportRule } from '../src/lib/import';

const ids = (v: unknown): v is string[] => Array.isArray(v) && v.length <= 100 && v.every(x => typeof x === 'string' && /^[a-z-]{1,60}$/.test(x));
const rules: ImportRule[] = [
  { from: 'old-app', key: 'bookmarks', to: () => 'new-bookmarks', validate: ids, merge: 'union' },
  { from: 'old-app', key: /^case-[a-z0-9-]+$/, to: k => k.replace(/^case-/, 'business-'), validate: v => !!v && typeof v === 'object', merge: 'keep' },
  { from: 'old-app', key: 'progress', to: () => 'challenge-progress', validate: v => typeof v === 'number', merge: 'replace' },
];

test('a valid payload round-trips through the fragment, including non-ASCII text', () => {
  const payload = encodePayload('old-app', { bookmarks: ['patience', 'mercy'], note: 'ﷺ' })!;
  expect(payload).toMatch(/^[A-Za-z0-9_-]+$/);
  const decoded = decodeFragment('#import=' + payload)!;
  expect(decoded).toEqual({ v: 1, from: 'old-app', items: { bookmarks: ['patience', 'mercy'], note: 'ﷺ' } });
});

test('nothing saved gives no payload', () => {
  expect(encodePayload('old-app', {})).toBeNull();
  expect(encodePayload('old-app', { bookmarks: null })).toBeNull();
});

test('wrong version, malformed base64, bad JSON and oversize payloads are rejected', () => {
  const b64 = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  expect(decodeFragment('#import=' + b64(JSON.stringify({ v: 2, from: 'old-app', items: {} })))).toBeNull();
  expect(decodeFragment('#import=***')).toBeNull();
  expect(decodeFragment('#import=' + b64('{not json'))).toBeNull();
  expect(decodeFragment('#import=' + b64(JSON.stringify({ v: 1, from: 'old-app', items: [] })))).toBeNull();
  expect(decodeFragment('#import=' + 'A'.repeat(MAX_PAYLOAD + 1))).toBeNull();
  expect(decodeFragment('#other=abc')).toBeNull();
  expect(encodePayload('old-app', { bookmarks: Array.from({ length: 400 }, (_, i) => 'theme-number-' + i) })).toBeNull();
});

test('unknown sources, unknown keys and invalid values are ignored', () => {
  const plan = planImport({ v: 1, from: 'someone-else', items: { bookmarks: ['a'] } }, rules, () => null);
  expect(plan.writes).toEqual([]);
  const plan2 = planImport({ v: 1, from: 'old-app', items: { theme: 'dark', bookmarks: ['BAD ID'], progress: 'x' } }, rules, () => null);
  expect(plan2.writes).toEqual([]);
});

test('bookmark lists merge as a union; existing progress is kept; replace overwrites', () => {
  const existing: Record<string, unknown> = { 'new-bookmarks': ['mercy', 'justice'], 'business-loan': { version: 1, choices: [0] } };
  const plan = planImport({ v: 1, from: 'old-app', items: { bookmarks: ['patience', 'mercy'], 'case-loan': { version: 1, choices: [1, 2] }, 'case-scale': { version: 1, choices: [] }, progress: 7 } }, rules, k => existing[k] ?? null);
  expect(plan.writes).toContainEqual(['new-bookmarks', ['mercy', 'justice', 'patience']]);
  expect(plan.writes.find(([k]) => k === 'business-loan')).toBeUndefined();
  expect(plan.writes).toContainEqual(['business-scale', { version: 1, choices: [] }]);
  expect(plan.writes).toContainEqual(['challenge-progress', 7]);
});

test('runImport clears the fragment, announces, and does not throw when storage is blocked', () => {
  const payload = encodePayload('old-app', { bookmarks: ['patience'] })!;
  let cleared = 0; const messages: string[] = []; const store: Record<string, unknown> = {};
  const n = runImport(rules, { hash: '#import=' + payload, read: k => store[k] ?? null, write: (k, v) => { store[k] = v; return true; }, clearHash: () => cleared++, announce: m => messages.push(m) });
  expect(n).toBe(1); expect(cleared).toBe(1); expect(store['new-bookmarks']).toEqual(['patience']); expect(messages).toEqual(['Saved items moved: 1']);
  const blocked = runImport(rules, { hash: '#import=' + payload, read: () => { throw new Error('blocked'); }, write: () => false, clearHash: () => cleared++, announce: m => messages.push(m) });
  expect(blocked).toBe(0); expect(cleared).toBe(2); expect(messages.at(-1)).toBe('Your saved items could not be stored in this browser.');
  expect(runImport(rules, { hash: '', read: () => null, write: () => true, clearHash: () => cleared++, announce: () => {} })).toBe(0);
  expect(cleared).toBe(2);
});
