// T5.17: independent first-screen sweep for all 16 app homes.
// For each viewport and theme: top of the first interactive control inside the activity (not header/hero links),
// hero height, horizontal overflow and script errors. Needs: bun _implementation/e2e-preview.ts
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launch} from './browser-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origins = JSON.parse(readFileSync(join(root, '_implementation/qa/e2e/origins.json'), 'utf8'));
const views = [[390, 844, false], [390, 844, true], [375, 812, false], [375, 812, true], [1440, 1000, false], [1440, 1000, true]];
const probe = `(() => {
  const main = document.querySelector('main');
  const intro = main.querySelector('.intro');
  const controls = [...main.querySelectorAll('input:not([type=hidden]), select, textarea, button, [role=button], a.button, .activity-card a, [data-answer]')]
    .filter(el => !intro?.contains(el) && !el.closest('.how-it-works, .site-footer, .feedback-wrap, .learning-guide, nav'))
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const first = controls[0];
  return {
    top: first ? Math.round(first.getBoundingClientRect().top + scrollY) : null,
    what: first ? (first.id ? '#' + first.id : first.tagName.toLowerCase() + (first.className ? '.' + String(first.className).split(' ')[0] : '')) : null,
    hero: intro ? Math.round(intro.getBoundingClientRect().height) : null,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
  };
})()`;
const rows = [];
let failures = 0;
const b = await launch();
try {
  for (const [w, h, dark] of views) {
    const p = await b.page({width: w, height: h, dark, mobile: w < 700});
    for (const app of origins) {
      await p.goto(`http://127.0.0.1:${app.port}/`, 500);
      const r = await p.eval("return " + probe);
      const phone = w < 700;
      const ok = r.top !== null && (!phone || r.top <= 600) && !r.overflow && p.errors.length === 0 && (!phone || r.hero <= 140);
      if (!ok) failures++;
      rows.push({app: app.slug, view: `${w}x${h}${dark ? ' dark' : ''}`, ...r, errors: p.errors.length, ok});
      p.errors.length = 0;
    }
    await p.close();
  }
} finally { await b.close(); }
const by = {};
for (const r of rows) (by[r.app] ??= {})[r.view] = r;
console.log('| App | First control | 390 light | 390 dark | 375 light | 375 dark | 1440 | Phone hero |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const [app, v] of Object.entries(by)) {
  const cell = k => v[k] ? `${v[k].top}${v[k].ok ? '' : ' ✗'}` : '-';
  console.log(`| ${app} | \`${v['390x844'].what}\` | ${cell('390x844')} | ${cell('390x844 dark')} | ${cell('375x812')} | ${cell('375x812 dark')} | ${cell('1440x1000')} | ${v['390x844'].hero} |`);
}
writeFileSync(join(root, '_implementation/qa/first-screen.json'), JSON.stringify(rows, null, 2));
console.log(failures ? `\n${failures} checks failed` : `\nAll ${rows.length} checks passed (first control ≤ 600 px and hero ≤ 140 px on phones; no overflow; no script errors).`);
process.exit(failures ? 1 : 0);
