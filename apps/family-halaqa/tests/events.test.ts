import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
// Source-level wiring check for the P4 counter hooks in the pack session. The session touches the DOM when imported,
// so this test reads it as text; the counter's own behaviour is in counter.test.ts.
const session=readFileSync(new URL('../src/lib/session.ts',import.meta.url),'utf8');
const page=readFileSync(new URL('../src/pages/pack/[id].astro',import.meta.url),'utf8');
const count=(text:string,needle:string)=>text.split(needle).length-1;

test('the first answer, the first step or the facilitator reveal starts the pack; the last step completes it once',()=>{
  expect(count(session,"track('activity_started',pack.id)")).toBe(3);
  expect(count(session,"track('activity_completed',pack.id)")).toBe(1);
  expect(session).toContain('if(state.done.every(Boolean)&&!completed)');
  expect(session).toContain(".print-answer')?.addEventListener('toggle'");
});

test('share_clicked is sent by the shared session-end block, whose share text names no answer',()=>{
  expect(session).toContain("renderSessionEnd(byId('session-end')");
  expect(session).toContain("itemId:pack.id");
  const share=session.match(/shareText:'([^']*)'/)![1]!;
  expect(share).toContain('https://family-halaqa.moongazer.tech/');
  expect(share).not.toMatch(/answer|explanation/i);
  expect(share).not.toContain('${');
});

test('the reading-question panel carries the compact feedback link',()=>{
  expect(page).toContain('<Feedback compact />');
  expect(page).toContain('id="reading-feedback"');
});
