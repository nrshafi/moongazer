// D2c smoke check: every app home page uses its new host and links to no old or deleted host.
// Needs the preview server: bun _implementation/e2e-preview.ts
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launch} from './browser-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origins = JSON.parse(readFileSync(join(root, '_implementation/qa/e2e/origins.json'), 'utf8'));
const old = ['quran-connections', 'the-seerah-detective', 'everyday-akhlaq-simulator', 'interactive-seerah-timeline', 'quran-memorization-workload-calculator', 'is-this-actually-in-the-quran', 'islamic-knowledge-escape-room', 'stories-of-the-prophets-explorer', 'quranic-places-atlas', 'islamic-concept-connections', 'understand-salah-lab', 'quranic-parables-studio', 'islamic-civilization-timeline', 'revelation-context-explorer', 'family-islamic-learning-challenges', 'quran-concept-atlas', 'islamic-history-timeline-challenge', 'halal-business-decisions', 'islamic-misinformation-casebook'];
const b = await launch();
let failed = 0;
try {
  const p = await b.page({width: 390, height: 844});
  for (const app of origins) {
    await p.goto(`http://127.0.0.1:${app.port}/`, 500);
    const r = await p.eval(`({canonical: document.querySelector('link[rel=canonical]')?.href, app: document.body.dataset.app, title: document.title,
      bad: [...document.querySelectorAll('a[href],link[href]')].map(a => a.getAttribute('href')).filter(h => ${JSON.stringify(old)}.some(o => h.includes(o + '.moongazer.tech')))})`);
    const ok = r.canonical === `https://${app.slug}.moongazer.tech/` && r.app === app.slug && r.bad.length === 0 && p.errors.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${app.slug.padEnd(24)} ${r.title.slice(0, 40)} ${ok ? '' : JSON.stringify({...r, errors: p.errors})}`);
    p.errors.length = 0;
  }
} finally { await b.close(); }
console.log(failed ? `${failed} failed` : `All ${origins.length} apps use their new hosts.`);
process.exit(failed ? 1 : 0);
