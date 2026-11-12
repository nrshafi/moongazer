#!/usr/bin/env node
// Writes homepage/functions/_lib/apps.json: the app slug allowlist the feedback and event
// Functions check against. Source: deployment/targets.json (every app, plus the "directory" origin). Re-run whenever targets.json changes.
// Usage: node deployment/scripts/build-app-allowlist.mjs
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const targets = JSON.parse(await readFile(join(root, 'deployment/targets.json'), 'utf8'));
const slugs = targets.map(target => target.slug);
if (!slugs.length || new Set(slugs).size !== slugs.length || !slugs.every(slug => /^[a-z0-9-]+$/.test(slug))) {
  throw new Error('deployment/targets.json must list unique lowercase app slugs');
}
if (slugs.includes('directory')) throw new Error('"directory" is reserved for the apex and must not be in targets.json');

const allowlist = [...slugs, 'directory'];
const out = join(root, 'homepage/functions/_lib/apps.json');
await mkdir(dirname(out), {recursive: true});
await writeFile(out, JSON.stringify(allowlist, null, 2) + '\n');
console.log(`Wrote ${allowlist.length} slugs to ${out}`);
