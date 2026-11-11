import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
// Source-level wiring check for the P4 counter hooks. The client modules touch the DOM when imported,
// so this test reads them as text; the counter's own behaviour (preview, GPC, dedupe) is in counter.test.ts.
const source=(path:string)=>readFileSync(new URL(`../src/${path}`,import.meta.url),'utf8');
const count=(text:string,needle:string)=>text.split(needle).length-1;

test('the lesson hooks start on Show meaning or a quiz answer and complete once per page',()=>{
  const lesson=source('lib/lesson.ts');
  expect(count(lesson,"track('activity_started',lessonId)")).toBe(2);
  expect(count(lesson,"track('activity_completed',lessonId)")).toBe(1);
  expect(lesson).toContain('if(!completed)');
});

test('the saved-list export counts as a share only after a non-empty copy',()=>{
  const library=source('lib/library.ts');
  expect(count(library,"track('share_clicked','home')")).toBe(1);
  expect(library.indexOf('if(!links.length)')).toBeLessThan(library.indexOf("track('share_clicked'"));
});

test('the lesson quiz status has its own id and the compact feedback link is present',()=>{
  const page=source('pages/lesson/[id].astro');
  expect(count(page,'id="feedback"')).toBe(0);
  expect(page).toContain('id="quiz-feedback"');
  expect(page).toContain('data-lesson-id={lesson.id}');
  expect(page).toContain('<Feedback compact />');
});
