import { test, expect } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildMap, retiredApps } from './build-redirect-map';

const root = join(import.meta.dir, '..');
const committed = JSON.parse(readFileSync(join(root, 'deployment/merge-redirects.json'), 'utf8'));

test('the committed map equals the map generated from the retired apps\' builds and the shell rule', () => {
  expect(committed).toEqual(buildMap());
});

test('every retired app has a mapping and every target exists in the receiver build', () => {
  const retired = retiredApps();
  expect(retired.length).toBe(4);
  for (const { slug } of retired) {
    const entry = committed[`https://${slug}.moongazer.tech`];
    expect(entry, slug).toBeDefined();
    expect(entry.paths['/'], slug).toBeDefined();
    expect(entry.paths['*'], slug).toBeDefined();
    for (const [from, to] of Object.entries<string>(entry.paths)) {
      const url = new URL(to);
      expect(retired.some(r => url.hostname === `${r.slug}.moongazer.tech`), `${slug}${from} points back to a retired app`).toBe(false);
      const receiver = url.hostname.replace('.moongazer.tech', '');
      const file = join(root, 'apps', receiver, 'dist', url.pathname.replace(/^\//, ''), url.pathname.endsWith('/') ? 'index.html' : '');
      expect(existsSync(file), `${slug}${from} -> ${to} has no built page`).toBe(true);
    }
  }
});
