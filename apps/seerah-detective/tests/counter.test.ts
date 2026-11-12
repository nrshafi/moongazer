import { test, expect } from 'bun:test';
import { counterItemId, track } from '../src/lib/counter';

test('counter item ids are limited to stable slugs', () => {
  expect(counterItemId('patience')).toBe('patience');
  expect(counterItemId('Home')).toBe('home');
  for (const bad of ['', 'two words', 'a'.repeat(65), 'x<y', 'ﷺ']) expect(counterItemId(bad)).toBeNull();
});

test('track sends once per started item on moongazer hosts, never elsewhere or with Global Privacy Control', () => {
  const g = globalThis as Record<string, unknown>;
  const saved = { document: g.document, location: g.location, navigator: g.navigator };
  const sent: string[] = [];
  try {
    Object.defineProperty(g, 'document', { value: { body: { dataset: { app: 'guess-the-surah' } } }, configurable: true, writable: true });
    Object.defineProperty(g, 'location', { value: { hostname: 'guess-the-surah.moongazer.tech' }, configurable: true, writable: true });
    Object.defineProperty(g, 'navigator', { value: { sendBeacon: (url: string) => { sent.push(url); return true; } }, configurable: true, writable: true });
    expect(track('activity_started', 'surah-1')).toBe(true);
    expect(track('activity_started', 'surah-1')).toBe(false);
    expect(track('activity_completed', 'surah-1')).toBe(true);
    expect(track('share_clicked', 'not valid!')).toBe(false);
    expect(sent).toEqual(['https://moongazer.tech/api/event', 'https://moongazer.tech/api/event']);
    (g.navigator as Record<string, unknown>).globalPrivacyControl = true;
    expect(track('activity_completed', 'surah-2')).toBe(false);
    Object.defineProperty(g, 'navigator', { value: { sendBeacon: () => true }, configurable: true, writable: true });
    Object.defineProperty(g, 'location', { value: { hostname: '127.0.0.1' }, configurable: true, writable: true });
    expect(track('activity_completed', 'surah-3')).toBe(false);
  } finally {
    for (const [key, value] of Object.entries(saved)) Object.defineProperty(g, key, { value, configurable: true, writable: true });
  }
});
