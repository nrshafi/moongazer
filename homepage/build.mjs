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
const schema = {
  '@context':'https://schema.org',
  '@graph':[
    {'@type':'WebSite','@id':'https://moongazer.tech/#website',url:'https://moongazer.tech/',name:'Moongazer',inLanguage:'en'},
    {'@type':'CollectionPage','@id':'https://moongazer.tech/#webpage',url:'https://moongazer.tech/',name:'Free Islamic learning apps and Quran games',description:'Twenty free Islamic learning apps for Quran, Seerah, history and everyday practice.',inLanguage:'en',isPartOf:{'@id':'https://moongazer.tech/#website'},mainEntity:{'@id':'https://moongazer.tech/#apps'}},
    {'@type':'ItemList','@id':'https://moongazer.tech/#apps',name:'Moongazer app library',numberOfItems:apps.length,itemListOrder:'https://schema.org/ItemListUnordered',itemListElement:apps.map((app,index)=>({'@type':'ListItem',position:index+1,url:`https://${app.slug}.moongazer.tech/`,name:app.name}))}
  ]
};
const schemaMarkup = `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
const out = join(root, 'homepage/dist');
await mkdir(out, {recursive:true});
await writeFile(join(out, 'index.html'), template.replace('<!-- APP_CATALOG -->', cards).replace('<!-- SITE_SCHEMA -->',schemaMarkup));
for (const file of ['styles.css','app.js','moon.svg','favicon.svg','social-card.png','_headers','_redirects','robots.txt','sitemap.xml','404.html']) {
  await cp(join(root, 'homepage', file), join(out, file));
}
await cp(join(root, 'homepage', 'logos'), join(out, 'logos'), { recursive: true });
await mkdir(join(out, 'fonts'), {recursive:true});
for (const file of ['dm-sans.woff2','dm-sans-OFL.txt','newsreader.woff2','newsreader-OFL.txt']) {
  await cp(join(root,'apps/guess-the-surah/public/fonts',file),join(out,'fonts',file));
}
console.log(`Built Moongazer homepage with ${apps.length} app links into ${out}`);
