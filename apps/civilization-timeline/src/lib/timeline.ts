import {events} from '../data/content.json';
import {compareBands} from './engine';
import {byId,esc} from './utils';
import {track} from './counter';
import learning from '../data/learning.json';
import {renderSessionEnd} from './session-end';

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
  const overlap=relation.overlap
    ? `They overlap ${relation.start===relation.end?`in ${relation.start}`:`from ${relation.start} to ${relation.end}`} CE.`
    : `The numeric gap between the displayed bands is ${relation.gap} years.`;
  output.innerHTML=`<section class="comparison"><h3>${esc(a.title)} / ${esc(b.title)}</h3><p class="micro">A broad period is not an exact duration. Overlap shows dates, not contact.</p><div class="actions"><a class="button secondary" href="/event/${a.id}/">Read first event</a><a class="button secondary" href="/event/${b.id}/">Read second event</a></div><div id="comparison-end"></div></section>`;
  const url=new URL('/',location.origin);url.searchParams.set('a',a.id);url.searchParams.set('b',b.id);
  const next=learning.related[0]!;
  renderSessionEnd(byId('comparison-end'),{
    result:`${a.title} runs ${a.date}. ${b.title} runs ${b.date}. ${overlap} Overlap shows dates, not contact.`,
    learned:['Broad periods and exact years are different precision; the app keeps both.','Overlapping periods do not show contact or cause. That needs separate evidence.'],
    shareText:`I compared two periods on Civilization Timeline: ${url.href}`,
    itemId:'timeline',next:{name:next.name,url:next.url},heading:'Comparison complete'});
  return true;
}
// Anonymous counter (P4): a user's first comparison starts the activity; one completion per page load, once a comparison is shown.
let comparisonCounted=false;
document.getElementById('compare')?.addEventListener('click',()=>{track('activity_started','timeline');if(compare()&&!comparisonCounted){comparisonCounted=true;track('activity_completed','timeline');}});
if(params.has('a')&&params.has('b'))compare();
