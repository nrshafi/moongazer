// T5.15: capture one 16:9 WebP of each app's first screen for the directory cards (homepage/shots/<slug>.webp).
// Needs the production builds and the preview server: bun _implementation/e2e-preview.ts
// Captures at 1280 × 720 in the light theme, scrolled to the top, quality 72.
import {readFileSync, mkdirSync, statSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launch} from './browser-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origins = JSON.parse(readFileSync(join(root, '_implementation/qa/e2e/origins.json'), 'utf8'));
const out = join(root, 'homepage/shots');
mkdirSync(out, {recursive: true});
const b = await launch();
try {
  const p = await b.page({width: 1280, height: 720, mobile: false, dark: false});
  for (const app of origins) {
    await p.goto(`http://127.0.0.1:${app.port}/`, 900);
    await p.eval('window.scrollTo(0,0);return true');
    const file = join(out, `${app.slug}.webp`);
    await p.shot(file, false, {format: 'webp', quality: 72});
    console.log(app.slug, Math.round(statSync(file).size / 1024) + ' KB', p.errors.length ? 'ERRORS ' + p.errors.join(' | ') : '');
    p.errors.length = 0;
  }
} finally { await b.close(); }
