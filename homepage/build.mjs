import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const apps = JSON.parse(await readFile(join(root, 'deployment/targets.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<span class="card-arrow" aria-hidden="true">↗</span>';
const cards = apps.map(app => `<article class="app-card" data-category="${escape(app.category)}" data-search="${escape(`${app.name} ${app.category} ${app.kind} ${app.description}`.toLowerCase())}">
  <a href="https://${app.slug}.moongazer.tech/" class="app-link">
    <div class="card-top"><span class="app-icon"><img src="/logos/${escape(app.slug)}.svg" alt="" width="48" height="48" loading="lazy"></span><span class="app-kind">${escape(app.kind)}</span>${arrow}</div>
    <h3>${escape(app.name)}</h3><p>${escape(app.description)}</p><span class="card-bottom">${escape(app.category)}<span aria-hidden="true">Open app →</span></span>
  </a></article>`).join('\n');
const template = await readFile(join(root, 'homepage/index.html'), 'utf8');
const out = join(root, 'homepage/dist');
await mkdir(out, {recursive:true});
await writeFile(join(out, 'index.html'), template.replace('<!-- APP_CATALOG -->', cards));
for (const file of ['styles.css','app.js','moon.svg','favicon.svg','_headers','_redirects','robots.txt','sitemap.xml','404.html']) {
  await cp(join(root, 'homepage', file), join(out, file));
}
await cp(join(root, 'homepage', 'logos'), join(out, 'logos'), { recursive: true });
await mkdir(join(out, 'fonts'), {recursive:true});
for (const file of ['dm-sans.ttf','dm-sans-OFL.txt','newsreader.ttf','newsreader-OFL.txt']) {
  await cp(join(root,'apps/guess-the-surah/public/fonts',file),join(out,'fonts',file));
}
console.log(`Built Moongazer homepage with ${apps.length} app links into ${out}`);
