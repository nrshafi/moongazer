import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
// Source-level wiring check for the P4 counter hooks. The client script touches the DOM when imported,
// so this test reads it as text; the counter's own behaviour (preview, GPC, dedupe) is in counter.test.ts.
const source=(path:string)=>readFileSync(new URL(`../src/${path}`,import.meta.url),'utf8');
const count=(text:string,needle:string)=>text.split(needle).length-1;

test('the planner imports the shared counter and starts once on the first answered step',()=>{
  const app=source('lib/app.ts');
  expect(app).toContain("import {track} from './counter';");
  expect(count(app,"track('activity_started','plan')")).toBe(1);
  // The start hook sits in the step-one success path, after validation and before step two shows.
  expect(app.indexOf("track('activity_started','plan')")).toBeLessThan(app.indexOf('showStep(2)'));
});

test('a plan counts as completed only when generated, not on a re-plan or a restore',()=>{
  const app=source('lib/app.ts');
  expect(count(app,"track('activity_completed','plan')")).toBe(1);
  // makePlan is the only generator path; the missed-day re-plan and stored restores do not reach this hook.
  const makePlanBody=app.slice(app.indexOf('function makePlan'),app.indexOf('function statCards'));
  expect(makePlanBody).toContain("track('activity_completed','plan')");
  expect(app.slice(app.indexOf('function missedDay'),app.indexOf('function describeChecks')).includes('activity_completed')).toBe(false);
});

test('share_clicked fires on the CSV and calendar exports only, never on print',()=>{
  const app=source('lib/app.ts');
  expect(count(app,"track('share_clicked','plan')")).toBe(2);
  const printHandler=app.slice(app.indexOf("byId('print-week').onclick"),app.indexOf("byId('print-week').onclick")+200);
  expect(printHandler.includes('track(')).toBe(false);
  const csv=app.indexOf("byId('csv').onclick");
  const ics=app.indexOf("byId('ics').onclick");
  expect(app.indexOf("track('share_clicked','plan')")).toBeGreaterThan(csv);
  expect(app.indexOf("track('share_clicked','plan')",csv+1)).toBeLessThan(app.indexOf("byId('print-week')"));
  expect(app.indexOf("track('share_clicked','plan')",ics)).toBeGreaterThan(ics);
});

test('the compact feedback link sits beside the generated plan result and targets the site feedback form',()=>{
  const page=source('pages/index.astro');
  expect(page).toContain("import Feedback from '../components/Feedback.astro';");
  expect(page).toContain('<Feedback compact />');
  expect(page.indexOf('<Feedback compact />')).toBeGreaterThan(page.indexOf('id="results"'));
  expect(source('components/Feedback.astro')).toContain('href="#site-feedback"');
});
