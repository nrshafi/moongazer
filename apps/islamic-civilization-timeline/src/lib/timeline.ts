import {events} from '../data/content.json';
import {compareBands} from './engine';
import {byId,copy,esc} from './utils';
import {track} from './counter';

const first=byId<HTMLSelectElement>('compare-a');
const second=byId<HTMLSelectElement>('compare-b');
const output=byId('comparison');
const params=new URLSearchParams(location.search);
for (const [key,control] of [['a',first],['b',second]] as const) {
  const id=params.get(key);
  if(id&&events.some(event=>event.id===id)) control.value=id;
}
function compare() {
  const a=events.find(event=>event.id===first.value);
  const b=events.find(event=>event.id===second.value);
  if(!a||!b) return false;
  if(a.id===b.id){output.innerHTML='<p class="notice top-gap">Choose two different events to compare.</p>';return false;}
  const relation=compareBands(a,b);
  const description=relation.overlap
    ? `The displayed bands overlap ${relation.start===relation.end?`in ${relation.start}`:`from ${relation.start} to ${relation.end}`} CE.`
    : `The numeric gap between the displayed bands is ${relation.gap} years.`;
  output.innerHTML=`<section class="comparison"><h3>${esc(a.title)} / ${esc(b.title)}</h3><p>${esc(a.date)} · ${esc(b.date)}</p><p>${esc(description)}</p><p class="micro">These bounds compare the dates as displayed. A broad period is not an exact duration. Overlap does not establish contact, influence or causation.</p><div class="actions"><a class="button secondary" href="/event/${a.id}/">Read first event</a><a class="button secondary" href="/event/${b.id}/">Read second event</a><button class="button secondary" id="copy-comparison">Copy comparison link</button></div><p class="micro"><a class="feedback-link" href="#feedback" data-open-feedback>Report an error <span aria-hidden="true">→</span></a></p></section>`;
  document.getElementById('copy-comparison')?.addEventListener('click',()=>{
    track('share_clicked','timeline');
    const url=new URL('/',location.origin);url.searchParams.set('a',a.id);url.searchParams.set('b',b.id);
    void copy(`${a.title} (${a.date})\n${b.title} (${b.date})\n${description}\nDisplayed date bands only; no causal link inferred.\n${url.href}`,'Comparison copied');
  });
  return true;
}
// Anonymous counter (P4): a user's first comparison starts the activity; one completion per page load, once a comparison is shown.
let comparisonCounted=false;
document.getElementById('compare')?.addEventListener('click',()=>{track('activity_started','timeline');if(compare()&&!comparisonCounted){comparisonCounted=true;track('activity_completed','timeline');}});
if(params.has('a')&&params.has('b'))compare();
