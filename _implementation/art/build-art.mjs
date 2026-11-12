// Moongazer art system (2026-11-13 redesign): "a window into the night".
// Generates, for every app:
//   apps/<slug>/public/favicon.svg   emblem: night tile, family star frame, gold glyph
//   apps/<slug>/public/motif.svg     hero scene: arch window, starlit sky, crescent, the app's object in gold
//   homepage/logos/<slug>.svg        same emblem for the directory
//   homepage/art/<slug>.svg          same scene for the directory cards
// and rewrites the pattern/ornament block in apps/guess-the-surah/src/styles/refinement.css
// (then run: bun _implementation/sync-shared.ts --from guess-the-surah src/styles/refinement.css).
// Pure geometry, objects, plants, architecture and sky: no people or animals (DESIGN.md §1).
// Run: node _implementation/art/build-art.mjs
import {writeFileSync, readFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ---------- palette ----------
const GOLD = '#e9c992', GOLD2 = '#f7e6c0', GOLD3 = '#b8894a', PAPER = '#f4e8cf', NIGHT = '#0b1526', INK = '#0a1322';
const FAM = {
  teal: {hue: '#4fd1bf', fold: 8, k: 3},
  gold: {hue: '#f2c25b', fold: 8, k: 2}, // Rub el Hizb (two squares); never a hexagram
  blue: {hue: '#7fb2ff', fold: 12, k: 5},
  violet: {hue: '#b9a2ff', fold: 10, k: 3},
};
const APPS = {
  'guess-the-surah': 'teal', 'ayah-threads': 'teal', 'word-groups': 'teal', 'is-it-in-the-quran': 'teal',
  'stories-of-the-prophets': 'teal', 'parables-of-the-quran': 'teal', 'places-in-the-quran': 'teal', 'why-it-was-revealed': 'teal',
  'seerah-timeline': 'gold', 'seerah-detective': 'gold', 'civilization-timeline': 'gold',
  'understand-your-salah': 'blue', 'hifz-planner': 'blue', 'everyday-akhlaq': 'blue', 'zakat-calculator': 'blue',
  'family-halaqa': 'violet', 'quran-escape-room': 'violet',
};

// ---------- geometry ----------
const f = n => +n.toFixed(2);
const P = (cx, cy, r, deg) => { const a = (deg - 90) * Math.PI / 180; return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))]; };
const poly = pts => 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/** Star with alternating outer/inner radii (n points). */
const star = (cx, cy, R, r, n, rot = 0) => poly(Array.from({length: n * 2}, (_, i) => P(cx, cy, i % 2 ? r : R, rot + i * 180 / n)));
/** Star polygon {n/k}; compound when gcd(n,k) > 1. */
function starPolygon(cx, cy, R, n, k, rot = 0) {
  const g = gcd(n, k), parts = [];
  for (let s = 0; s < g; s++) parts.push(poly(Array.from({length: n / g}, (_, i) => P(cx, cy, R, rot + (s + i * k) * 360 / n))));
  return parts.join('');
}
/** Pointed (two-centred) arch: half-width hw, spring line, base, centre offset d. */
function arch(cx, hw, spring, base, d, close = true) {
  const R = hw + d, apex = f(spring - Math.sqrt(R * R - d * d));
  return `M${cx - hw} ${base}L${cx - hw} ${spring}A${R} ${R} 0 0 1 ${cx} ${apex}A${R} ${R} 0 0 1 ${cx + hw} ${spring}L${cx + hw} ${base}${close ? 'Z' : ''}`;
}
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = s => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
/** Moon phase disc: lit fraction p (0 new → 1 full), lit from the right. */
function phase(x, y, r, p) {
  const rx = f(r * Math.abs(1 - 2 * p));
  const lit = `M${x} ${y - r}A${r} ${r} 0 0 1 ${x} ${y + r}A${rx} ${r} 0 0 ${p < .5 ? 1 : 0} ${x} ${y - r}Z`;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#1c2b44" stroke="${GOLD}" stroke-width=".8" stroke-opacity=".5"/>${p > 0 ? `<path d="${lit}" fill="${GOLD2}"/>` : ''}`;
}
const lantern = (x, y, s = 1, hue) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -92V-40" class="t"/><circle cy="-38" r="3" class="gf"/><path d="M-13 -18Q0 -40 13 -18Z" class="gf"/><path d="M-14 -16H14L19 6 12 30H-12L-19 6Z" fill="${hue}" fill-opacity=".22" class="g"/><path d="M-9 -10H9L13 6 8 24H-8L-13 6Z" fill="url(#lamp)"/><path d="M-19 6H19M0 -16V30" class="t"/><path d="${starPolygon(0, 7, 7, 8, 3)}" class="t"/><path d="M-12 30 0 41 12 30Z" class="gf"/></g>`;
const magnifier = (x, y, r, hue) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hue}" fill-opacity=".14"/><path d="M${x + r * .7} ${y + r * .7}L${x + r * 1.55} ${y + r * 1.55}" stroke="${GOLD3}" stroke-width="13" stroke-linecap="round"/><path d="M${x + r * .74} ${y + r * .74}L${x + r * 1.5} ${y + r * 1.5}" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" opacity=".7"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="7"/><path d="M${x - r * .62} ${y - r * .2}A${r * .66} ${r * .66} 0 0 1 ${x - r * .1} ${y - r * .64}" stroke="${GOLD2}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`;
const palm = (x, base, h, hue) => { const top = base - h; const fr = [[-46, 10], [-38, -14], [-14, -28], [16, -28], [40, -12], [48, 12]]; return `<path d="M${x} ${base}C${x - 4} ${base - h * .4} ${x + 6} ${base - h * .7} ${x - 2} ${top}" stroke="${GOLD3}" stroke-width="6" fill="none" stroke-linecap="round"/>${Array.from({length: 6}, (_, i) => `<path d="M${x - 5} ${base - h * (.15 + i * .14)}h7" stroke="${GOLD}" stroke-width="1.2" opacity=".6"/>`).join('')}${fr.map(([dx, dy]) => `<path d="M${x - 2} ${top}Q${x - 2 + dx * .5} ${top + dy - 14} ${x - 2 + dx} ${top + dy + 8}" stroke="${hue}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`).join('')}<circle cx="${x - 6}" cy="${top + 8}" r="3" class="gf"/><circle cx="${x + 1}" cy="${top + 10}" r="3" class="gf"/><circle cx="${x - 3}" cy="${top + 14}" r="3" class="gf"/>`; };
const lines = (x1, x2, y, n, gap, cls = 'hl') => Array.from({length: n}, (_, i) => `<path d="M${x1} ${y + i * gap}H${x2 - (i % 3 === 2 ? 22 : 0)}" class="${cls}"/>`).join('');

// ---------- the 17 objects (480 × 300 scene, ledge at y = 286) ----------
const OBJECTS = {
  'guess-the-surah': h => `<path d="M240 160L232 96M240 160L206 104M240 160L274 104M240 160L248 96" stroke="${GOLD2}" stroke-width="1.4" opacity=".28"/>
<circle cx="240" cy="90" r="34" fill="url(#lightGlow)"/><path d="${star(240, 90, 17, 7.5, 8)}" fill="${GOLD2}"/><path d="${star(240, 90, 7, 3, 8, 22.5)}" fill="${GOLD3}"/>
<path d="M178 286L298 200M302 286L182 200" stroke="${GOLD3}" stroke-width="10" stroke-linecap="round"/><path d="M178 286L298 200M302 286L182 200" stroke="${GOLD}" stroke-width="2" stroke-linecap="round" opacity=".6"/>
<path d="M240 222C214 206 180 204 146 212L142 158C176 148 212 152 240 168Z" fill="#cdb48a"/><path d="M240 222C266 206 300 204 334 212L338 158C304 148 268 152 240 168Z" fill="#cdb48a"/>
<path d="M240 216C214 200 182 198 150 206L146 152C178 142 212 146 240 162Z" fill="${PAPER}"/><path d="M240 216C266 200 298 198 330 206L334 152C302 142 268 146 240 162Z" fill="${PAPER}"/>
<path d="M240 162V216" stroke="${GOLD3}" stroke-width="2"/>
${[0, 1, 2, 3].map(i => `<path d="M157 ${165 + i * 9}Q196 ${158 + i * 9} 232 ${171 + i * 9}" class="hl"/><path d="M323 ${165 + i * 9}Q284 ${158 + i * 9} 248 ${171 + i * 9}" class="hl"/>`).join('')}
<path d="M160 158Q196 150 230 164" stroke="${GOLD3}" stroke-width="3" fill="none"/><path d="M320 158Q284 150 250 164" stroke="${GOLD3}" stroke-width="3" fill="none"/>`,

  'ayah-threads': h => `${lantern(178, 158, 1, h)}${lantern(240, 124, 1.15, h)}${lantern(302, 168, .95, h)}
<path d="M140 250C170 214 196 262 228 226S286 256 318 222 352 236 352 236" stroke="${h}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M128 266C166 236 200 284 236 248S300 276 340 246" stroke="${GOLD}" stroke-width="2" fill="none" stroke-dasharray="1 6" stroke-linecap="round"/>
${[[178, 199], [240, 172], [302, 208]].map(([x, y]) => `<path d="M${x} ${y}V${y + 22}" stroke="${GOLD}" stroke-width="1" opacity=".5"/>`).join('')}
${[[168, 236], [228, 226], [318, 222]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="gf"/>`).join('')}`,

  'word-groups': h => { const g = [0, 0, 0, 0, 1, 2, 3, 1, 3, 1, 2, 2, 2, 3, 1, 3]; const c = [h, GOLD, PAPER, '#8fb7c9']; return `${g.map((k, i) => { const x = 166 + (i % 4) * 38, y = (i < 4 ? 120 : 132) + Math.floor(i / 4) * 38; return `<rect x="${x}" y="${y}" width="32" height="32" rx="7" fill="${c[k]}" ${i < 4 ? 'fill-opacity="1"' : 'fill-opacity=".9"'}/><path d="${starPolygon(x + 16, y + 16, 9, 8, 3)}" fill="none" stroke="${INK}" stroke-width="1.1" opacity=".35"/>`; }).join('')}<path d="M160 158H318" stroke="${h}" stroke-width="2" stroke-dasharray="2 5" opacity=".7"/><rect x="160" y="114" width="158" height="44" rx="11" fill="none" stroke="${GOLD2}" stroke-width="2"/>`; },

  'is-it-in-the-quran': h => `<g transform="rotate(-7 200 200)"><rect x="140" y="132" width="124" height="148" rx="8" fill="#cdb48a"/><rect x="134" y="126" width="124" height="148" rx="8" fill="${PAPER}"/><rect x="146" y="138" width="100" height="124" rx="4" fill="none" stroke="${GOLD3}" stroke-width="1.5"/>${lines(156, 236, 154, 9, 11)}</g>${magnifier(286, 196, 44, h)}<path d="M256 186H318M252 200H322M258 214H310" stroke="${h}" stroke-width="3.2" stroke-linecap="round"/>`,

  'stories-of-the-prophets': h => `<path d="M240 238V112" stroke="${GOLD}" stroke-width="3.5"/><path d="M246 120Q306 162 246 220Z" fill="${PAPER}"/><path d="M234 138Q192 172 234 214Z" fill="${PAPER}" fill-opacity=".82"/><path d="M246 120Q306 162 246 220" fill="none" stroke="${GOLD3}" stroke-width="1.5"/><path d="M240 112L262 118 240 124Z" fill="${h}"/>
<path d="M152 236H328L302 270H178Z" fill="${GOLD3}"/><path d="M152 236H328L302 270H178Z" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linejoin="round"/><path d="M168 248H312M176 258H304" stroke="${GOLD}" stroke-width="1" opacity=".55"/><rect x="212" y="218" width="56" height="18" rx="3" fill="${h}" fill-opacity=".5" stroke="${GOLD}" stroke-width="1.5"/>
${[0, 1, 2].map(i => `<path d="M${110 + i * 8} ${272 + i * 9}${Array.from({length: 9}, () => 'q15 -8 30 0').join('')}" fill="none" stroke="${h}" stroke-width="${3 - i * .6}" stroke-linecap="round" opacity="${.9 - i * .25}"/>`).join('')}`,

  'parables-of-the-quran': h => `<path d="${arch(240, 58, 204, 286, 18)}" fill="${INK}" stroke="${GOLD}" stroke-width="2.4"/><path d="${arch(240, 48, 206, 286, 16, false)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".55"/>
<circle cx="240" cy="198" r="74" fill="url(#lightGlow)"/><path d="M240 134V170" stroke="${GOLD}" stroke-width="1.5"/><rect x="231" y="168" width="18" height="8" rx="2" class="gf"/><circle cx="240" cy="198" r="23" fill="url(#lamp)" stroke="${GOLD2}" stroke-width="1.5"/><path d="M240 184C247 192 247 201 240 207C233 201 233 192 240 184Z" fill="#fffbea"/>
<path d="M240 224V244M226 244H254" stroke="${GOLD}" stroke-width="2"/>
<path d="M322 286C318 254 330 226 352 196" stroke="${GOLD3}" stroke-width="3" fill="none" stroke-linecap="round"/>${[[326, 256, -40], [330, 236, 30], [336, 222, -50], [344, 208, 35], [350, 198, -30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4.5" transform="rotate(${r} ${x} ${y})" fill="${h}" fill-opacity=".85"/>`).join('')}<circle cx="333" cy="246" r="3.5" class="gf"/><circle cx="341" cy="230" r="3.5" class="gf"/>`,

  'places-in-the-quran': h => `<path d="M118 286L188 198 218 228 262 166 334 256 362 286Z" fill="${h}" fill-opacity=".2" stroke="${GOLD}" stroke-width="2" stroke-linejoin="round"/><path d="M232 232Q262 192 298 238M246 252Q264 222 288 254M168 262Q188 232 206 250" fill="none" stroke="${h}" stroke-width="1.5" opacity=".75"/><path d="${star(262, 158, 9, 3, 4)}" fill="${GOLD2}"/>
<circle cx="182" cy="250" r="34" fill="${INK}" stroke="${GOLD}" stroke-width="2"/><path d="${star(182, 250, 29, 6, 8)}" fill="${PAPER}" fill-opacity=".25"/><path d="${star(182, 250, 29, 6, 4)}" fill="${PAPER}"/><path d="${star(182, 250, 17, 4, 4, 45)}" class="gf"/><circle cx="182" cy="250" r="3" fill="${INK}"/>
<path d="M214 274C246 290 282 248 314 262" stroke="${h}" stroke-width="2.5" fill="none" stroke-dasharray="3 6" stroke-linecap="round"/><path d="M318 262C318 250 328 244 328 236A10 10 0 0 0 308 236C308 244 318 250 318 262Z" fill="${h}" stroke="${GOLD2}" stroke-width="1.2"/><circle cx="318" cy="236" r="3.5" fill="${INK}"/>`,

  'why-it-was-revealed': h => `${palm(352, 286, 132, h)}<rect x="150" y="176" width="168" height="88" fill="${PAPER}"/><path d="M150 176H318M150 264H318" stroke="${GOLD3}" stroke-width="1.5"/>${lines(166, 302, 192, 6, 11)}
<rect x="136" y="168" width="18" height="104" rx="9" fill="${GOLD3}" stroke="${GOLD}" stroke-width="1.5"/><rect x="314" y="168" width="18" height="104" rx="9" fill="${GOLD3}" stroke="${GOLD}" stroke-width="1.5"/><path d="M145 164V176M145 264V276M323 164V176M323 264V276" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/><circle cx="292" cy="252" r="9" fill="${h}"/><path d="${star(292, 252, 5, 2, 8)}" fill="${INK}" opacity=".5"/>`,

  'seerah-timeline': h => { const pts = [0, .12, .38, .62, .88, 1].map(t => [f(140 + 200 * t), f(150 - 4 * 64 * t * (1 - t))]); return `<path d="M140 150Q240 22 340 150" fill="none" stroke="${GOLD}" stroke-width="1.2" stroke-dasharray="2 6" opacity=".7"/>${pts.slice(1, 5).map(([x, y], i) => phase(x, y, 10, [.15, .5, .78, 1][i])).join('')}${phase(140, 150, 8, 0)}<circle cx="340" cy="150" r="5" class="gf"/>
<g fill="${INK}" stroke="${GOLD}" stroke-width="1.6" stroke-linejoin="round"><path d="M168 286V246H232V286Z"/><path d="M172 246A28 28 0 0 1 228 246Z"/><path d="M266 286V176H280V286Z"/><path d="M262 196H284V202H262ZM262 230H284V236H262Z"/><path d="M266 176L273 154 280 176Z"/><path d="M296 286V262H330V286Z"/><path d="M299 262A15 15 0 0 1 327 262Z"/></g>
<path d="M200 214V226M273 146V154M313 244V250" stroke="${GOLD}" stroke-width="1.6"/><circle cx="200" cy="211" r="2.5" class="gf"/>${[[184, 266], [200, 266], [216, 266], [273, 214], [305, 274], [321, 274]].map(([x, y]) => `<path d="M${x - 4} ${y + 8}V${y}A4 4 0 0 1 ${x + 4} ${y}V${y + 8}Z" fill="${h}" fill-opacity=".8"/>`).join('')}${palm(146, 286, 96, h)}`; },

  'seerah-detective': h => `<g transform="rotate(-4 230 220)"><path d="M140 168L200 158 262 170 322 160V266L262 276 200 264 140 274Z" fill="${PAPER}"/><path d="M200 158V264M262 170V276" stroke="#cdb48a" stroke-width="2"/><path d="M140 168L200 158V264L140 274Z" fill="#000" fill-opacity=".06"/><path d="M262 170L322 160V266L262 276Z" fill="#000" fill-opacity=".06"/>
<path d="M162 252C190 244 196 214 226 220S266 196 292 186" stroke="${h}" stroke-width="3" fill="none" stroke-dasharray="4 6" stroke-linecap="round"/><circle cx="162" cy="252" r="6" fill="${h}"/><path d="${star(294, 185, 10, 4, 8)}" fill="${GOLD3}"/><path d="M172 196L178 186 184 196ZM178 196V204M226 240A8 8 0 0 1 242 240Z" fill="none" stroke="${GOLD3}" stroke-width="1.6"/></g>${magnifier(268, 210, 36, h)}`,

  'civilization-timeline': h => `<circle cx="240" cy="198" r="80" fill="${h}" fill-opacity=".1"/><circle cx="240" cy="198" r="80" fill="none" stroke="${GOLD}" stroke-width="5"/><circle cx="240" cy="198" r="67" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
${Array.from({length: 72}, (_, i) => { const [x1, y1] = P(240, 198, 67, i * 5), [x2, y2] = P(240, 198, i % 6 ? 71 : 76, i * 5); return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${GOLD}" stroke-width="${i % 6 ? .8 : 1.4}"/>`; }).join('')}
<circle cx="240" cy="210" r="44" fill="none" stroke="${h}" stroke-width="1" opacity=".7"/><circle cx="240" cy="220" r="32" fill="none" stroke="${h}" stroke-width="1" opacity=".55"/><circle cx="240" cy="228" r="20" fill="none" stroke="${h}" stroke-width="1" opacity=".45"/><path d="M174 198H306" stroke="${h}" stroke-width="1" opacity=".6"/>
<circle cx="240" cy="186" r="38" fill="none" stroke="${GOLD2}" stroke-width="2.2"/>${[20, 80, 140, 200, 260, 320].map(a => { const [x, y] = P(240, 198, 56, a), [bx, by] = P(240, 198, 36, a - 9), [cx, cy] = P(240, 198, 36, a + 9); return `<path d="M${bx} ${by}Q${x} ${y} ${x} ${y}Q${x} ${y} ${cx} ${cy}" fill="none" stroke="${GOLD2}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="2.6" fill="${GOLD2}"/>`; }).join('')}
<path d="M226 120Q240 100 254 120Z" class="gf"/><circle cx="240" cy="100" r="9" fill="none" stroke="${GOLD}" stroke-width="3.5"/><path d="M172 236L308 160" stroke="${GOLD2}" stroke-width="3.5" stroke-linecap="round"/><circle cx="240" cy="198" r="5" fill="${GOLD2}"/><circle cx="240" cy="198" r="2" fill="${INK}"/>`,

  'understand-your-salah': h => `<path d="${arch(240, 66, 200, 286, 20)}" fill="${INK}" stroke="${GOLD}" stroke-width="2.6"/><path d="${arch(240, 56, 202, 286, 17, false)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".6"/>
${[-30, -15, 0, 15, 30].map(dx => `<path d="M${240 + dx - 8} ${150 + Math.abs(dx) * .9}Q${240 + dx} ${138 + Math.abs(dx) * .9} ${240 + dx + 8} ${150 + Math.abs(dx) * .9}" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".65"/>`).join('')}
<circle cx="240" cy="190" r="40" fill="url(#lightGlow)"/><path d="M240 140V168" stroke="${GOLD}" stroke-width="1.2"/><path d="M230 172H250L246 196H234Z" fill="url(#lamp)" stroke="${GOLD2}" stroke-width="1.2"/><path d="M228 172H252" stroke="${GOLD}" stroke-width="2"/>
<path d="M170 292L310 292 290 240 190 240Z" fill="${h}" fill-opacity=".6"/><path d="M170 292L310 292 290 240 190 240Z" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linejoin="round"/><path d="M182 286L298 286 282 246 198 246Z" fill="none" stroke="${GOLD2}" stroke-width="1" opacity=".7"/><path d="${arch(240, 16, 262, 280, 5)}" fill="none" stroke="${GOLD2}" stroke-width="1.4"/><path d="M240 268V276" stroke="${GOLD2}" stroke-width="1"/>`,

  'hifz-planner': h => `<g transform="rotate(-5 220 214)"><rect x="150" y="154" width="128" height="120" rx="6" fill="#bfa47a"/></g><g transform="rotate(3 220 214)"><rect x="152" y="150" width="128" height="120" rx="6" fill="#d8c299"/></g><rect x="154" y="146" width="128" height="120" rx="6" fill="${PAPER}"/><rect x="164" y="156" width="108" height="100" rx="3" fill="none" stroke="${GOLD3}" stroke-width="1.3"/>${lines(174, 262, 172, 7, 11)}
<path d="M236 140V212L244 204 252 212V140Z" fill="${h}"/><path d="M258 140V194L264 188 270 194V140Z" class="gf"/>
<rect x="296" y="184" width="64" height="76" rx="8" fill="${INK}" stroke="${GOLD}" stroke-width="2"/><path d="M296 200H360" stroke="${GOLD}" stroke-width="1.5"/><path d="M308 178V190M348 178V190" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>${Array.from({length: 12}, (_, i) => { const x = 304 + (i % 4) * 13, y = 208 + Math.floor(i / 4) * 16; return i < 7 ? `<path d="M${x} ${y + 5}l3 3 6 -7" fill="none" stroke="${h}" stroke-width="2" stroke-linecap="round"/>` : `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".6"/>`; }).join('')}`,

  'everyday-akhlaq': h => { const r = rng(7); const clusters = [[204, 178, 26], [276, 172, 28], [224, 148, 24], [262, 140, 26], [240, 120, 20], [190, 204, 18], [294, 198, 18], [242, 166, 22]]; const leaves = clusters.flatMap(([cx, cy, rad]) => Array.from({length: 9}, () => { const a = r() * 360, d = r() * rad, [x, y] = P(cx, cy, d, a); return [x, y, f(r() * 180), r()]; })); return `<circle cx="240" cy="170" r="92" fill="url(#lightGlow)" opacity=".6"/><path d="M200 300L232 286M282 300L248 286" stroke="${GOLD}" stroke-width="1.5" opacity=".5"/><path d="M240 286C236 252 246 232 240 196" stroke="${GOLD3}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M240 222L204 180M241 214L276 176M240 200L222 154M240 196L262 146M240 196V126M238 232L188 204M242 228L294 198" stroke="${GOLD3}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
${leaves.map(([x, y, rot, t]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" transform="rotate(${rot} ${x} ${y})" fill="${t > .78 ? GOLD : h}" fill-opacity="${f(.5 + t * .45)}"/>`).join('')}${clusters.map(([x, y]) => `<circle cx="${x + 4}" cy="${y + 6}" r="2.6" fill="${GOLD2}"/>`).join('')}
<path d="M240 286C226 290 214 288 204 294M240 286C254 290 268 288 278 294M240 286V296" stroke="${GOLD3}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; },

  'zakat-calculator': h => `<path d="M206 288H274L260 274H220Z" fill="${GOLD3}"/><path d="M240 274V138" stroke="${GOLD}" stroke-width="5"/><circle cx="240" cy="132" r="7" class="gf"/><path d="${star(240, 132, 4, 1.6, 8)}" fill="${INK}" opacity=".5"/>
<path d="M170 158L310 142" stroke="${GOLD}" stroke-width="4.5" stroke-linecap="round"/><path d="M240 150L232 162H248Z" class="gf"/>
<path d="M170 158L148 214M170 158L192 214M310 142L288 198M310 142L332 198" stroke="${GOLD}" stroke-width="1.3"/>
<path d="M142 214Q170 236 198 214Z" fill="${GOLD3}" stroke="${GOLD}" stroke-width="1.5"/><path d="M282 198Q310 220 338 198Z" fill="${GOLD3}" stroke="${GOLD}" stroke-width="1.5"/>
${[0, 1, 2, 3].map(i => `<ellipse cx="${170 + (i === 3 ? 6 : 0)}" cy="${208 - i * 6}" rx="15" ry="4.5" fill="${GOLD2}" stroke="${GOLD3}" stroke-width="1.2"/>`).join('')}
${[[-9, -30], [0, -36], [9, -30]].map(([dx, dy]) => `<path d="M310 198L${310 + dx} ${198 + dy}" stroke="${GOLD}" stroke-width="1.5"/>${[0, 1, 2, 3].map(j => `<ellipse cx="${f(310 + dx * (.55 + j * .15))}" cy="${f(198 + dy * (.55 + j * .15))}" rx="2.2" ry="4" transform="rotate(${dx * 2} ${f(310 + dx * (.55 + j * .15))} ${f(198 + dy * (.55 + j * .15))})" fill="${GOLD2}"/>`).join('')}`).join('')}
<circle cx="240" cy="230" r="48" fill="url(#glowSoft)"/>`,

  'family-halaqa': h => `<rect x="172" y="212" width="44" height="20" rx="9" fill="${h}" fill-opacity=".5"/><rect x="264" y="212" width="44" height="20" rx="9" fill="${h}" fill-opacity=".5"/>
<circle cx="240" cy="214" r="62" fill="url(#lightGlow)"/>${lantern(240, 214, .72, h).replace('M0 -92V-40', 'M0 -60V-40')}
<path d="M178 262V282M302 262V282M240 268V288" stroke="${GOLD3}" stroke-width="6" stroke-linecap="round"/><ellipse cx="240" cy="256" rx="84" ry="20" fill="${GOLD3}"/><ellipse cx="240" cy="251" rx="84" ry="20" fill="#d4ad70"/><ellipse cx="240" cy="251" rx="70" ry="14" fill="none" stroke="${GOLD2}" stroke-width="1" opacity=".7"/>
${[[198, 246], [282, 246]].map(([x, y]) => `<path d="M${x - 6} ${y - 14}H${x + 6}L${x + 4} ${y - 2}Q${x} ${y + 2} ${x - 4} ${y - 2}Z" fill="${h}" fill-opacity=".7" stroke="${GOLD2}" stroke-width="1"/><ellipse cx="${x}" cy="${y}" rx="8" ry="2.5" fill="${GOLD2}" opacity=".7"/>`).join('')}
<rect x="118" y="266" width="54" height="22" rx="10" fill="${h}" fill-opacity=".75"/><rect x="308" y="266" width="54" height="22" rx="10" fill="${h}" fill-opacity=".75"/><path d="M126 277H164M316 277H354" stroke="${GOLD2}" stroke-width="1" stroke-dasharray="2 4"/>`,

  'quran-escape-room': h => `<path d="${arch(232, 56, 206, 286, 16)}" fill="#4a3220" stroke="${GOLD}" stroke-width="3"/>${[-34, -17, 0, 17, 34].map(dx => `<path d="M${232 + dx} ${dx === 0 ? 140 : 150 + Math.abs(dx) * .8}V286" stroke="#2c1d12" stroke-width="2"/>`).join('')}${[-38, 38].map(dx => [190, 230, 266].map(y => `<circle cx="${232 + dx}" cy="${y}" r="2.6" class="gf"/>`).join('')).join('')}
<path d="M176 210H288M176 256H288" stroke="${GOLD3}" stroke-width="5"/>
<path d="${star(232, 232, 20, 10, 8)}" fill="${GOLD}" stroke="${GOLD2}" stroke-width="1"/><circle cx="232" cy="229" r="4.5" fill="${INK}"/><path d="M230 231H234L236 242H228Z" fill="${INK}"/>
<circle cx="322" cy="168" r="40" fill="url(#lightGlow)"/><g transform="rotate(-20 322 168)"><circle cx="304" cy="168" r="11" fill="none" stroke="${GOLD2}" stroke-width="4.5"/><path d="${star(304, 168, 5, 2, 8)}" fill="${GOLD2}"/><path d="M315 168H356M346 168V178M352 168V176" stroke="${GOLD2}" stroke-width="4.5" stroke-linecap="square"/></g>
<path d="${star(352, 136, 7, 1.6, 4)}" fill="${GOLD2}"/><path d="${star(290, 132, 5, 1.2, 4)}" fill="${h}"/>`,
};

// ---------- scene ----------
function scene(slug) {
  const fam = FAM[APPS[slug]], h = fam.hue, r = rng(hash(slug));
  const win = arch(240, 122, 172, 300, 40);
  const moonLeft = r() < .5, mx = moonLeft ? 168 : 312, my = 70 + r() * 18;
  const stars = Array.from({length: 46}, () => {
    const x = f(124 + r() * 232), y = f(18 + r() * 190), s = r();
    return s > .9 ? `<path d="${star(x, y, 4.5, 1, 4)}" fill="${GOLD2}" opacity="${f(.6 + r() * .4)}"/>` : `<circle cx="${x}" cy="${y}" r="${f(.5 + s * 1.1)}" fill="#fff" opacity="${f(.35 + r() * .6)}"/>`;
  }).join('');
  const sparks = [[60, 70], [96, 196], [404, 64], [432, 180], [72, 262], [412, 258]].map(([x, y], i) => `<path d="${star(x, y, 5 + (i % 2) * 2, 1.2, 4)}" fill="${GOLD}" opacity=".5"/>`).join('');
  const spandrel = [[86, 56], [394, 56]].map(([x, y]) => `<path d="${starPolygon(x, y, 22, fam.fold, fam.k)}" fill="none" stroke="${GOLD}" stroke-width="1.1" opacity=".55"/><circle cx="${x}" cy="${y}" r="5" fill="${h}" opacity=".7"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" aria-hidden="true">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c18"/><stop offset=".6" stop-color="#11223a"/><stop offset="1" stop-color="${h}" stop-opacity=".55"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".85" r=".55"><stop offset="0" stop-color="${h}" stop-opacity=".5"/><stop offset="1" stop-color="${h}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowSoft"><stop offset="0" stop-color="${GOLD2}" stop-opacity=".22"/><stop offset="1" stop-color="${GOLD2}" stop-opacity="0"/></radialGradient>
<radialGradient id="lightGlow"><stop offset="0" stop-color="${GOLD2}" stop-opacity=".55"/><stop offset=".45" stop-color="${GOLD}" stop-opacity=".18"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
<radialGradient id="lamp" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fffbea"/><stop offset=".5" stop-color="${GOLD2}"/><stop offset="1" stop-color="${GOLD}" stop-opacity=".6"/></radialGradient>
<radialGradient id="moonHalo"><stop offset=".35" stop-color="${GOLD2}" stop-opacity=".35"/><stop offset="1" stop-color="${GOLD2}" stop-opacity="0"/></radialGradient>
<pattern id="lat" width="44" height="44" patternUnits="userSpaceOnUse"><path d="${starPolygon(22, 22, 22, 8, 3)}" fill="none" stroke="${GOLD}" stroke-width=".7"/></pattern>
<clipPath id="win"><path d="${win}"/></clipPath>
<mask id="cres"><rect width="480" height="300" fill="#fff"/><circle cx="${f(mx + (moonLeft ? 9 : -9))}" cy="${f(my - 6)}" r="17" fill="#000"/></mask>
</defs>
<style>.g{stroke:${GOLD};stroke-width:2;stroke-linejoin:round}.t{fill:none;stroke:${GOLD};stroke-width:1.2}.gf{fill:${GOLD}}.hl{fill:none;stroke:${h};stroke-width:1.8;stroke-linecap:round;opacity:.85}</style>
${sparks}${spandrel}
<g clip-path="url(#win)"><rect width="480" height="300" fill="url(#sky)"/><rect width="480" height="300" fill="url(#lat)" opacity=".08"/>${stars}
<circle cx="${f(mx)}" cy="${f(my)}" r="42" fill="url(#moonHalo)"/><circle cx="${f(mx)}" cy="${f(my)}" r="20" fill="${GOLD2}" mask="url(#cres)"/>
<ellipse cx="240" cy="300" rx="210" ry="120" fill="url(#glow)"/></g>
<path d="${arch(240, 122, 172, 300, 40, false)}" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="${arch(240, 131, 172, 300, 44, false)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".55"/><path d="${arch(240, 114, 172, 300, 37, false)}" fill="none" stroke="${GOLD}" stroke-width=".8" stroke-dasharray="1 5" stroke-linecap="round" opacity=".8"/>
${OBJECTS[slug](h)}
<path d="M70 287H410" stroke="${GOLD}" stroke-width="1.6"/><path d="M110 293H370" stroke="${GOLD}" stroke-width=".8" opacity=".5"/>
</svg>`.replace(/\n/g, '');
}

// ---------- emblem ----------
// Emblem glyphs (24 × 24 line icons, one per app); formerly _implementation/generate-app-logos.mjs.
const marks = {
  'guess-the-surah': ['#087f75', '<path d="M4 5c3-1 5-.6 8 1v14c-3-1.6-5-2-8-1V5Zm16 0c-3-1-5-.6-8 1v14c3-1.6 5-2 8-1V5Z"/><path d="m16 5 .5 1.5L18 7l-1.5.5L16 9l-.5-1.5L14 7l1.5-.5Z" fill="#fff" stroke="none"/>'],
  'ayah-threads': ['#087f75', '<circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7 8 4 8m6-8-4 8M7 7h10"/>'],
  'seerah-detective': ['#b8860b', '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6M7 10h6m-3-3v6"/>'],
  'everyday-akhlaq': ['#2563eb', '<path d="M12 21c-5-3-8-6.3-8-10a4 4 0 0 1 7-2.5L12 10l1-1.5A4 4 0 0 1 20 11c0 3.7-3 7-8 10Z"/><path d="M12 10v6m0 0 3-3m-3 3-3-3"/>'],
  'seerah-timeline': ['#b8860b', '<path d="M4 3v18m0-15h10M4 12h15M4 19h8"/><circle cx="15" cy="6" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="13" cy="19" r="2"/>'],
  'hifz-planner': ['#2563eb', '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h3m2 0h3M8 15h2m3 0h3M8 19h2m3 0h3"/>'],
  'is-it-in-the-quran': ['#087f75', '<path d="M3 5h11v14H3zM6 9h5m-5 3h3"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>'],
  'quran-escape-room': ['#7c3aed', '<path d="M5 21V8a7 7 0 0 1 14 0v13H5Z"/><circle cx="12" cy="12" r="2"/><path d="m12 14-1 4h2l-1-4Z"/>'],
  'stories-of-the-prophets': ['#087f75', '<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/><path d="m16 8 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/>'],
  'places-in-the-quran': ['#087f75', '<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><path d="m12 6 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>'],
  'word-groups': ['#087f75', '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M10 6.5h4M6.5 10v4m11-4v4M10 17.5h4"/>'],
  'understand-your-salah': ['#2563eb', '<path d="M4 21V10c0-4 8-8 8-8s8 4 8 8v11H4Z"/><path d="M8 21v-9m8 9v-9m-8 4h8"/>'],
  'parables-of-the-quran': ['#087f75', '<path d="M12 2 5 12l7 10 7-10L12 2Z"/><path d="M5 12h14M12 2v20m-4-7 4-3 4 3"/>'],
  'civilization-timeline': ['#b8860b', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18M5 7h14M5 17h14"/>'],
  'why-it-was-revealed': ['#087f75', '<path d="M6 4h10l3 3v14H6V4Zm10 0v4h3M9 11h7m-7 4h7m-7 4h4"/><path d="M3 7v14h2"/>'],
  'family-halaqa': ['#7c3aed', '<ellipse cx="12" cy="18" rx="9" ry="3"/><path d="M12 9c-2-1.3-4-1.3-6-.6v6c2-.7 4-.7 6 .6 2-1.3 4-1.3 6-.6v-6c-2-.7-4-.7-6 .6Zm0 0v6"/><path d="M17.5 2.5a2.6 2.6 0 1 0 2.6 3.1 2.1 2.1 0 0 1-2.6-3.1Z"/>'],
  'zakat-calculator': ['#2563eb', '<path d="M12 4v16M7 20h10M4 7h16"/><path d="M4 7 1.5 13h5L4 7Zm16 0-2.5 6h5L20 7Z"/><circle cx="12" cy="4" r="1.2"/>'],
};
function emblem(slug) {
  const fam = FAM[APPS[slug]], h = fam.hue, glyph = marks[slug][1];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${slug.replaceAll('-', ' ')} logo"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a2f4c"/><stop offset="1" stop-color="#081120"/></linearGradient><radialGradient id="l" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${h}" stop-opacity=".5"/><stop offset="1" stop-color="${h}" stop-opacity="0"/></radialGradient></defs><rect width="64" height="64" rx="15" fill="url(#b)"/><rect width="64" height="64" rx="15" fill="url(#l)"/><path d="${starPolygon(32, 32, 28, fam.fold, fam.k)}" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".45"/><rect x="2.5" y="2.5" width="59" height="59" rx="12.5" fill="none" stroke="${GOLD}" stroke-opacity=".55"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="${GOLD2}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${glyph.replaceAll('fill="#fff"', `fill="${GOLD2}"`)}</g></svg>`;
}

// ---------- CSS patterns and ornaments (shared refinement.css block) ----------
const uri = svg => `url("data:image/svg+xml,${svg.replace(/"/g, "'").replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\s+/g, ' ')}")`;
const tile = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g fill="none" stroke="${GOLD}" stroke-width="1">${body}</g></svg>`;
const hx = 28, hy = f(28 * Math.sqrt(3));
const patterns = {
  teal: tile(64, 64, [[0, 0], [64, 0], [0, 64], [64, 64], [32, 32]].map(([x, y]) => `<path d="${star(x, y, 32, 13.25, 8)}"/>`).join('') + `<path d="${starPolygon(32, 32, 12, 8, 3)}"/>`),
  gold: tile(60, 60, [[0, 0], [60, 0], [0, 60], [60, 60], [30, 30]].map(([x, y]) => `<path d="${starPolygon(x, y, 19, 8, 2)}"/><circle cx="${x}" cy="${y}" r="7"/>`).join('') + `<path d="M30 0V11M30 49V60M0 30H11M49 30H60"/>`),
  blue: tile(64, 64, [[0, 0], [64, 0], [0, 64], [64, 64], [32, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="32"/>`).join('') + `<path d="${star(32, 32, 14, 9, 8)}"/>`),
  violet: tile(56, f(hy * 2), [[0, 0], [56, 0], [28, hy], [0, f(hy * 2)], [56, f(hy * 2)], [-28, hy], [84, hy]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="28"/>`).join('')),
};
const band = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="14" viewBox="0 0 28 14"><path d="M0 7H6M22 7H28" stroke="${GOLD}" stroke-width="1"/><path d="${star(14, 7, 6.5, 2.4, 4)}" fill="${GOLD}"/><circle cx="3" cy="2" r="1" fill="${GOLD}"/><circle cx="3" cy="12" r="1" fill="${GOLD}"/><circle cx="25" cy="2" r="1" fill="${GOLD}"/><circle cx="25" cy="12" r="1" fill="${GOLD}"/></svg>`;
const corner = rot => `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><g transform="rotate(${rot} 17 17)" fill="none" stroke="${GOLD3}" stroke-width="1.2"><path d="M3 31V9Q3 3 9 3H31"/><path d="M8 31V14Q8 8 14 8H31" opacity=".5"/><path d="${star(13, 13, 5.5, 2.2, 8)}" fill="${GOLD3}" stroke="none"/></g></svg>`;
const divider = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="14" viewBox="0 0 96 14"><path d="M0 7H36M60 7H96" stroke="${GOLD3}" stroke-width="1"/><path d="${star(48, 7, 7, 2.6, 8)}" fill="${GOLD3}"/><circle cx="40" cy="7" r="1.6" fill="${GOLD3}"/><circle cx="56" cy="7" r="1.6" fill="${GOLD3}"/></svg>`;
const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="${starPolygon(11, 11, 10, 8, 3)}" fill="none" stroke="${GOLD3}" stroke-width="1"/><circle cx="11" cy="11" r="2.2" fill="${GOLD3}"/></svg>`;
const css = [
  '/* art:start — generated by _implementation/art/build-art.mjs; edit the generator, not this block */',
  ...Object.entries(patterns).map(([k, svg]) => `[data-accent=${k}]{--mg-pattern:${uri(svg)}}`),
  `:root{--mg-band:${uri(band)};--mg-divider:${uri(divider)};--mg-corner-tl:${uri(corner(0))};--mg-corner-tr:${uri(corner(90))};--mg-corner-br:${uri(corner(180))};--mg-corner-bl:${uri(corner(270))};--mg-star:${uri(starIcon)}}`,
  ...Object.entries(FAM).map(([k, v]) => `[data-accent=${k}]{--mg-hue:${v.hue}}`),
  '/* art:end */',
].join('\n');

// ---------- write ----------
mkdirSync(join(root, 'homepage/art'), {recursive: true});
mkdirSync(join(root, 'homepage/logos'), {recursive: true});
for (const slug of Object.keys(APPS)) {
  const e = emblem(slug), s = scene(slug);
  writeFileSync(join(root, 'apps', slug, 'public/favicon.svg'), e + '\n');
  writeFileSync(join(root, 'homepage/logos', slug + '.svg'), e + '\n');
  writeFileSync(join(root, 'apps', slug, 'public/motif.svg'), s + '\n');
  writeFileSync(join(root, 'homepage/art', slug + '.svg'), s + '\n');
}

// ---------- directory hero: a 16-fold shamsa (ring turns slowly; the crescent centre stays still) ----------
function shamsaRing() {
  const c = 300, T = '#4fd1bf';
  const petals = Array.from({length: 16}, (_, i) => { const a = i * 22.5, w = 8.5; const p = (r, d) => P(c, c, r, a + d).join(' ');
    return `<path d="M${p(198, -w)}C${p(238, -w)} ${p(262, -2.5)} ${p(284, 0)}C${p(262, 2.5)} ${p(238, w)} ${p(198, w)}Z" fill="url(#pg)" stroke="${GOLD}" stroke-width="1.1"/>`; }).join('');
  const dots = (r, n, rad, o = 0) => Array.from({length: n}, (_, i) => { const [x, y] = P(c, c, r, o + i * 360 / n); return `<circle cx="${x}" cy="${y}" r="${rad}"/>`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" aria-hidden="true"><defs><radialGradient id="pg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${GOLD}" stop-opacity=".05"/><stop offset="1" stop-color="${GOLD}" stop-opacity=".28"/></radialGradient></defs>
<circle cx="${c}" cy="${c}" r="296" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".55"/><circle cx="${c}" cy="${c}" r="289" fill="none" stroke="${GOLD}" stroke-width="1.2" stroke-dasharray="1.5 7" stroke-linecap="round" opacity=".7"/>
${petals}<g fill="${GOLD2}" opacity=".85">${dots(292, 16, 2.6, 11.25)}${dots(186, 16, 2.2, 11.25)}</g>
<circle cx="${c}" cy="${c}" r="198" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
<path d="${starPolygon(c, c, 196, 16, 7)}" fill="none" stroke="${GOLD}" stroke-width="1.3" opacity=".9"/><path d="${starPolygon(c, c, 196, 16, 5)}" fill="none" stroke="${T}" stroke-width="1" opacity=".55"/>
<path d="${star(c, c, 154, 64, 8)}" fill="#0b1526" fill-opacity=".85" stroke="${GOLD}" stroke-width="2"/><path d="${star(c, c, 154, 64, 8, 22.5)}" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".6"/>
<circle cx="${c}" cy="${c}" r="112" fill="none" stroke="${GOLD}" stroke-width="1.2"/><path d="${starPolygon(c, c, 110, 8, 3)}" fill="none" stroke="${GOLD}" stroke-width="1.3" opacity=".8"/><circle cx="${c}" cy="${c}" r="78" fill="#0b1526" stroke="${GOLD}" stroke-width="1.6"/></svg>`.replace(/\n/g, '');
}
function shamsaCentre() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" aria-hidden="true"><defs><radialGradient id="h"><stop offset=".3" stop-color="${GOLD2}" stop-opacity=".4"/><stop offset="1" stop-color="${GOLD2}" stop-opacity="0"/></radialGradient><mask id="m"><rect width="600" height="600" fill="#fff"/><circle cx="318" cy="290" r="40" fill="#000"/></mask></defs><circle cx="300" cy="300" r="96" fill="url(#h)"/><circle cx="300" cy="300" r="46" fill="${GOLD2}" mask="url(#m)"/><path d="${star(336, 268, 11, 3.6, 8)}" fill="${GOLD2}"/></svg>`;
}
function starfield() {
  const r = rng(1448);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320" viewBox="0 0 420 320">${Array.from({length: 70}, () => { const x = f(r() * 420), y = f(r() * 320), s = r(); return s > .93 ? `<path d="${star(x, y, 4, .9, 4)}" fill="${GOLD2}" opacity="${f(.5 + r() * .5)}"/>` : `<circle cx="${x}" cy="${y}" r="${f(.4 + s * .9)}" fill="#fff" opacity="${f(.25 + r() * .55)}"/>`; }).join('')}</svg>`;
}
writeFileSync(join(root, 'homepage/art/shamsa-ring.svg'), shamsaRing() + '\n');
writeFileSync(join(root, 'homepage/art/shamsa-centre.svg'), shamsaCentre() + '\n');
writeFileSync(join(root, 'homepage/art/stars.svg'), starfield() + '\n');

// ---------- directory ornaments and the Moongazer brand mark ----------
for (const [name, svg] of Object.entries({'pattern.svg': patterns.teal, 'band.svg': band, 'divider.svg': divider, 'star.svg': starIcon})) writeFileSync(join(root, 'homepage/art', name), svg + '\n');
const brand = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Moongazer"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a2f4c"/><stop offset="1" stop-color="#081120"/></linearGradient><radialGradient id="g" cx=".42" cy=".45" r=".5"><stop offset="0" stop-color="${GOLD2}" stop-opacity=".35"/><stop offset="1" stop-color="${GOLD2}" stop-opacity="0"/></radialGradient><mask id="m"><rect width="64" height="64" fill="#fff"/><circle cx="37" cy="27" r="13.5" fill="#000"/></mask></defs><rect width="64" height="64" rx="15" fill="url(#b)"/><path d="${starPolygon(32, 32, 28, 8, 3)}" fill="none" stroke="${GOLD}" stroke-width="1.1" opacity=".4"/><rect x="2.5" y="2.5" width="59" height="59" rx="12.5" fill="none" stroke="${GOLD}" stroke-opacity=".55"/><circle cx="29" cy="33" r="20" fill="url(#g)"/><circle cx="29" cy="33" r="15" fill="${GOLD2}" mask="url(#m)"/><path d="${star(44, 21, 5, 1.8, 8)}" fill="${GOLD2}"/></svg>`;
writeFileSync(join(root, 'homepage/favicon.svg'), brand + '\n');
const refPath = join(root, 'apps/guess-the-surah/src/styles/refinement.css');
let ref = readFileSync(refPath, 'utf8');
ref = ref.includes('/* art:start') ? ref.replace(/\/\* art:start[\s\S]*?\/\* art:end \*\//, css) : ref.trimEnd() + '\n' + css + '\n';
writeFileSync(refPath, ref);
const sizes = Object.keys(APPS).map(s => Math.round(scene(s).length / 102.4) / 10);
console.log(`Art: ${Object.keys(APPS).length} emblems and scenes; scene size ${Math.min(...sizes)}–${Math.max(...sizes)} KB; refinement.css art block ${css.length} chars.`);
