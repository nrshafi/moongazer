// P4.7 V7 check: the anonymous counter fires the right events once, at the right moment, only on moongazer.tech.
// Needs the preview server running first: bun _implementation/e2e-preview.ts
// Chrome maps <slug>.moongazer.tech to each preview port, so the page sees its production host name.
// navigator.sendBeacon is stubbed: nothing leaves the machine.
import {readFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launch} from './browser-check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origins = JSON.parse(readFileSync(join(root, '_implementation/qa/e2e/origins.json'), 'utf8'));
const allow = JSON.parse(readFileSync(join(root, 'homepage/functions/_lib/apps.json'), 'utf8'));
const port = slug => origins.find(o => o.slug === slug).port;
const sample = ['guess-the-surah', 'everyday-akhlaq-simulator', 'the-seerah-detective', 'stories-of-the-prophets-explorer'];
const rules = sample.map(slug => `MAP ${slug}.moongazer.tech:80 127.0.0.1:${port(slug)}`).join(', ');
const init = `window.__beacons=[];Object.defineProperty(Navigator.prototype,'sendBeacon',{configurable:true,value(url,data){data.text().then(t=>window.__beacons.push({url,body:JSON.parse(t)}));return true;}});`;

const failures = [];
const expect = (ok, message) => { if (!ok) failures.push(message); console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`); };
const beacons = async p => { await new Promise(r => setTimeout(r, 150)); return p.eval('window.__beacons'); };
const firstDir = (slug, dir) => readdirSync(join(root, 'apps', slug, 'dist', dir), {withFileTypes: true}).filter(d => d.isDirectory()).map(d => d.name).sort()[0];

// Plain HTTP on purpose (the previews have no TLS), so Chrome's automatic HTTPS upgrade is switched off.
const b = await launch({args: [`--host-resolver-rules=${rules}`, '--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable']});
try {
  const p = await b.page({width: 390, height: 844, init});

  // Guess the Surah: nothing on load; started + completed on the first answer; share on the challenge link.
  await p.goto('http://guess-the-surah.moongazer.tech/', 800);
  expect((await p.eval('location.hostname')) === 'guess-the-surah.moongazer.tech', 'guess-the-surah served under its production host name');
  expect((await beacons(p)).length === 0, 'guess-the-surah: no beacon on page load');
  if (!(await p.eval('!!document.querySelector("[data-answer]")'))) await p.eval('document.getElementById("setup-form").requestSubmit()');
  await p.click('[data-answer]');
  let got = await beacons(p);
  expect(got.length === 2 && got[0].body.e === 'activity_started' && got[1].body.e === 'activity_completed' && /^surah-\d+$/.test(got[0].body.i), `guess-the-surah: started + completed on first answer (${JSON.stringify(got.map(x => x.body))})`);
  expect(got.every(x => x.url === 'https://moongazer.tech/api/event' && x.body.a === 'guess-the-surah' && allow.includes(x.body.a)), 'guess-the-surah: endpoint and app slug are on the server allowlist');
  await p.click('[data-answer]');
  expect((await beacons(p)).length === 2, 'guess-the-surah: a second click on an answered question sends nothing');
  await p.click('#share-challenge');
  got = await beacons(p);
  expect(got.length === 3 && got[2].body.e === 'share_clicked' && got[2].body.i === 'round', 'guess-the-surah: share_clicked round on the challenge link');
  await p.click('[data-open-feedback]');
  expect(await p.eval('document.getElementById("site-feedback").open'), 'guess-the-surah: "Report an error" opens the footer form');
  expect(await p.eval('document.querySelectorAll("#site-feedback").length === 1 && document.querySelectorAll("[id=feedback]").length <= 1'), 'guess-the-surah: footer form id is unique');

  // Everyday Akhlaq: started once on the first choice.
  const scenario = firstDir('everyday-akhlaq-simulator', 'scenario');
  await p.goto(`http://everyday-akhlaq-simulator.moongazer.tech/scenario/${scenario}/`, 800);
  expect((await beacons(p)).length === 0, 'akhlaq: no beacon on page load');
  await p.click('[data-choice]');
  got = await beacons(p);
  expect(got.length === 1 && got[0].body.e === 'activity_started' && got[0].body.i === scenario, `akhlaq: activity_started ${scenario} on first choice (${JSON.stringify(got.map(x => x.body))})`);

  // Seerah Detective: opening evidence then choosing a conclusion sends one started; share sends share_clicked.
  const kase = firstDir('the-seerah-detective', 'case');
  await p.goto(`http://the-seerah-detective.moongazer.tech/case/${kase}/`, 800);
  await p.eval('const d=document.querySelector("[data-evidence]");d.open=true;return true');
  await new Promise(r => setTimeout(r, 200));
  await p.click('#case-answers input');
  await p.click('#case-share');
  got = await beacons(p);
  expect(got.filter(x => x.body.e === 'activity_started').length === 1 && got.some(x => x.body.e === 'share_clicked' && x.body.i === kase), `detective: one started, one share for ${kase} (${JSON.stringify(got.map(x => x.body))})`);

  // Stories of the Prophets: the reading check sends started + completed.
  const prophet = firstDir('stories-of-the-prophets-explorer', 'prophet');
  await p.goto(`http://stories-of-the-prophets-explorer.moongazer.tech/prophet/${prophet}/`, 800);
  await p.click('#quiz input[name=answer]');
  await p.eval('document.getElementById("quiz").requestSubmit();return true');
  got = await beacons(p);
  expect(got.length === 2 && got.every(x => x.body.i === prophet), `stories: started + completed for ${prophet} (${JSON.stringify(got.map(x => x.body))})`);

  // Preview host: the same answer click sends nothing.
  await p.goto(`http://127.0.0.1:${port('guess-the-surah')}/`, 800);
  if (!(await p.eval('!!document.querySelector("[data-answer]")'))) await p.eval('document.getElementById("setup-form").requestSubmit()');
  await p.click('[data-answer]');
  expect((await beacons(p)).length === 0, 'preview host 127.0.0.1: no beacon');
  expect(p.errors.length === 0, `no script errors (${p.errors.join(' | ')})`);
} finally {
  await b.close();
}
console.log(failures.length ? `\n${failures.length} failed` : '\nAll counter checks passed.');
process.exit(failures.length ? 1 : 0);
