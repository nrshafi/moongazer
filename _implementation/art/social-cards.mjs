// Social cards (1200 × 630 PNG) built from the art system: night panel, the app's arch scene, emblem, name and host.
// Renders with headless Chrome through _implementation/browser-check.mjs. Writes apps/<slug>/public/social-card.png
// and homepage/social-card.png. Run after build-art.mjs:  node _implementation/art/social-cards.mjs
import {readFileSync, writeFileSync, mkdtempSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {launch} from '../browser-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const targets = JSON.parse(readFileSync(join(root, 'deployment/targets.json'), 'utf8'));
const font = name => pathToFileURL(join(root, 'apps/guess-the-surah/public/fonts', name)).href;
const art = name => pathToFileURL(join(root, 'homepage', name)).href;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const page = ({title, category, host, scene, emblem, hero}) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:N;src:url(${font('newsreader.woff2')})}@font-face{font-family:D;src:url(${font('dm-sans.woff2')})}
*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;font-family:D;color:#f4ecdc;background:radial-gradient(55% 90% at 78% 60%,#24496e88,transparent 70%),linear-gradient(160deg,#16304f,#0b1526 55%,#070f1c)}
body:before{content:'';position:absolute;inset:0;background:url(${art('art/stars.svg')});opacity:.9}
body:after{content:'';position:absolute;inset:0;background:url(${art('art/pattern.svg')});opacity:.06}
.frame{position:absolute;inset:18px;border:1px solid #e9c99255;border-radius:26px}.frame:after{content:'';position:absolute;inset:8px;border:1px solid #e9c99226;border-radius:20px}
.band{position:absolute;left:70px;right:${hero ? 640 : 560}px;bottom:72px;height:14px;background:url(${art('art/band.svg')}) repeat-x center/28px 14px;opacity:.6}
.art{position:absolute;right:${hero ? 40 : 30}px;bottom:${hero ? 15 : 46}px;height:${hero ? 600 : 496}px;z-index:1}
.text{position:absolute;left:72px;top:70px;width:${hero ? 520 : 590}px;z-index:2}
.brand{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700;color:#fbf4e4}.brand img{width:52px;height:52px;border-radius:13px}.brand b{color:#e9c992}
.cat{margin-top:46px;font-size:17px;letter-spacing:.16em;text-transform:uppercase;color:#e9c992}
h1{margin-top:14px;font-family:N;font-weight:430;font-size:${hero ? 76 : 80}px;line-height:1.02;letter-spacing:-.03em;color:#fbf4e4}
.host{position:absolute;left:72px;bottom:104px;font-size:21px;color:#c6d0dc;z-index:2}.free{position:absolute;left:72px;bottom:36px;font-size:16px;color:#e9c992;letter-spacing:.06em;z-index:2}
</style></head><body><div class="frame"></div><img class="art" src="${scene}"><div class="text"><div class="brand"><img src="${emblem}"><span>moongazer<b>.</b></span></div><div class="cat">${esc(category)}</div><h1>${esc(title)}</h1></div><div class="host">${esc(host)}</div><div class="band"></div><div class="free">FREE · NO ACCOUNT · SOURCES ON EVERY PAGE</div></body></html>`;

const cards = [{slug: 'homepage', title: 'Free Islamic learning games and tools', category: 'Quran, Seerah & everyday learning', host: 'moongazer.tech', scene: art('art/shamsa-ring.svg'), emblem: art('favicon.svg'), hero: true},
  ...targets.map(t => ({slug: t.slug, title: t.name, category: t.category, host: `${t.slug}.moongazer.tech`, scene: art(`art/${t.slug}.svg`), emblem: art(`logos/${t.slug}.svg`)}))];
const tmp = mkdtempSync(join(tmpdir(), 'mg-cards-'));
const b = await launch({args: ['--allow-file-access-from-files']});
try {
  const p = await b.page({width: 1200, height: 630, mobile: false});
  for (const card of cards) {
    const file = join(tmp, `${card.slug}.html`);
    let html = page(card);
    if (card.hero) html = html.replace(`<img class="art" src="${card.scene}">`, `<img class="art" src="${card.scene}"><img class="art" src="${art('art/shamsa-centre.svg')}">`);
    writeFileSync(file, html);
    await p.goto(pathToFileURL(file).href, 700);
    const out = card.slug === 'homepage' ? join(root, 'homepage/social-card.png') : join(root, 'apps', card.slug, 'public/social-card.png');
    await p.shot(out);
    if (p.errors.length) throw new Error(card.slug + ': ' + p.errors.join(' | '));
  }
} finally { await b.close(); rmSync(tmp, {recursive: true, force: true}); }
console.log(`Social cards: ${cards.length} written.`);
