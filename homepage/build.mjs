import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const apps = JSON.parse(await readFile(join(root, 'deployment/targets.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const paths = {
  spark: '<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  heart: '<path d="M20.3 5.7a5.5 5.5 0 0 0-7.8 0l-.5.5-.5-.5a5.5 5.5 0 0 0-7.8 7.8L12 22l8.3-8.5a5.5 5.5 0 0 0 0-7.8Z"/>',
  timeline: '<path d="M4 4v16M4 7h6m-6 10h10m0-13v8m0-5h6"/><circle cx="12" cy="7" r="2"/><circle cx="16" cy="17" r="2"/><circle cx="21" cy="7" r="1"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 7h8M8 12h1m6 0h1m-8 5h1m6 0h1"/>',
  check: '<path d="m7 12 3 3 7-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10"/>',
  orbit: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="11" ry="5" transform="rotate(-35 12 12)"/><circle cx="17" cy="4" r="1"/>',
  key: '<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m-1 5 3-3"/>',
  book: '<path d="M12 5v16M12 5C9 2 5 2 2 3v16c3-1 7-1 10 2 3-3 7-3 10-2V3c-3-1-7-1-10 2Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  arch: '<path d="M5 21V10c0-4 7-8 7-8s7 4 7 8v11M3 21h18M9 21v-9m6 9v-9"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 16c7 6 17-1 15-13ZM4 21l12-13"/>',
  balance: '<path d="M12 3v18M6 21h12M3 7h18M5 7l-3 7h6L5 7Zm14 0-3 7h6l-3-7Z"/>',
  people: '<circle cx="9" cy="7" r="3"/><circle cx="18" cy="9" r="2"/><path d="M2 21v-3a7 7 0 0 1 14 0v3m2-7a5 5 0 0 1 5 5v2"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const arrow = '<span class="card-arrow" aria-hidden="true">↗</span>';
const cards = apps.map(app => `<article class="app-card" data-category="${escape(app.category)}" data-search="${escape(`${app.name} ${app.category} ${app.kind} ${app.description}`.toLowerCase())}">
  <a href="https://${app.slug}.moongazer.tech/" class="app-link">
    <div class="card-top"><span class="app-icon tone-${['Quran','Seerah & history','Everyday practice','Games & challenges'].indexOf(app.category)}">${icon(app.icon)}</span><span class="app-kind">${escape(app.kind)}</span>${arrow}</div>
    <h3>${escape(app.name)}</h3><p>${escape(app.description)}</p><span class="card-bottom">${escape(app.category)}<span aria-hidden="true">Open app →</span></span>
  </a></article>`).join('\n');
const template = await readFile(join(root, 'homepage/index.html'), 'utf8');
const out = join(root, 'homepage/dist');
await mkdir(out, {recursive:true});
await writeFile(join(out, 'index.html'), template.replace('<!-- APP_CATALOG -->', cards));
for (const file of ['styles.css','app.js','moon.svg','favicon.svg','_headers','_redirects','robots.txt','sitemap.xml','404.html']) {
  await cp(join(root, 'homepage', file), join(out, file));
}
await mkdir(join(out, 'fonts'), {recursive:true});
for (const file of ['dm-sans.ttf','dm-sans-OFL.txt','newsreader.ttf','newsreader-OFL.txt']) {
  await cp(join(root,'apps/guess-the-surah/public/fonts',file),join(out,'fonts',file));
}
console.log(`Built Moongazer homepage with ${apps.length} app links into ${out}`);
