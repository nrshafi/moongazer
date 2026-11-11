import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
// Source-level wiring check for the P4 counter hooks in the shared scenario engine (scenarios and business cases).
// The engine touches the DOM when imported, so this test reads it as text; the counter's own behaviour is in counter.test.ts.
const scenario=readFileSync(new URL('../src/lib/scenario.ts',import.meta.url),'utf8');
const count=(text:string,needle:string)=>text.split(needle).length-1;

test('the first choice starts the activity and the reflection completes it once per page',()=>{
  expect(count(scenario,"track('activity_started',item.id)")).toBe(1);
  expect(count(scenario,"track('activity_completed',item.id)")).toBe(1);
  expect(scenario).toContain('if(!reflected)');
});

test('the copy-link button sends share_clicked for the scenario id',()=>{
  expect(count(scenario,"track('share_clicked',item.id)")).toBe(1);
  expect(scenario).toContain("'Scenario link copied'");
});

test('the reflection carries the compact feedback link',()=>{
  expect(scenario).toContain('<a class="feedback-link" href="#site-feedback" data-open-feedback>Report an error <span aria-hidden="true">→</span></a>');
});
