import {rooms} from '../data/content.json';
import {byId,read,write,forget,esc,shuffle,copy,announce} from './utils';
import {canonicalOrder,sameSet,validProgress,withSeed,newSeed,lockSeeds,pickOtherIndex,type Progress} from './engine';
const room=rooms.find(r=>r.id===byId('room').dataset.room)!;const key='room-'+room.id;
const fresh=():Progress=>({step:0,assisted:[],seconds:0,seed:newSeed()});
const stored=read(key,validProgress);let state:Progress=stored?withSeed(stored):fresh();
const excerpt=(text:string)=>text.length>180?text.slice(0,180)+'…':text;
const roomIndex=rooms.indexOf(room);
let order:string[]=[],snippets:{text:string,correct:boolean}[]=[];
function derive(){const seeds=lockSeeds(state.seed);order=shuffle(room.refs,seeds.order);if(order.join()===canonicalOrder(room.refs).join())order.reverse();const other=rooms[pickOtherIndex(rooms.length,roomIndex,seeds.other)]!;snippets=shuffle([{text:excerpt(room.passages[0]!.translation),correct:true},{text:excerpt(room.passages[1]!.translation),correct:true},{text:excerpt(other.passages[0]!.translation),correct:false},{text:excerpt(other.passages[1]!.translation),correct:false}],seeds.snippets);}
derive();
let running=false,last=Date.now();byId<HTMLInputElement>('resume').checked=!!stored;
function persist(){if(byId<HTMLInputElement>('resume').checked&&!write(key,state))announce('Storage unavailable. This room still works for this visit.');}
setInterval(()=>{const now=Date.now();if(running&&state.step<4){state.seconds+=Math.min(5,(now-last)/1000);byId('timer').textContent=`${Math.floor(state.seconds/60)}:${String(Math.floor(state.seconds%60)).padStart(2,'0')}`;if(Math.floor(state.seconds)%10===0)persist();}last=now;},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){running=false;persist();}else running=byId<HTMLInputElement>('timer-toggle').checked;last=Date.now();});
byId('timer-toggle').onchange=()=>{running=byId<HTMLInputElement>('timer-toggle').checked;byId('timer').hidden=!running;last=Date.now();};byId('resume').onchange=()=>{if(byId<HTMLInputElement>('resume').checked)persist();else forget(key);};
byId('restart').onclick=()=>{state=fresh();running=byId<HTMLInputElement>('timer-toggle').checked;last=Date.now();derive();forget(key);persist();render();};
function render(){const root=byId('puzzle');byId('timer').textContent=`${Math.floor(state.seconds/60)}:${String(Math.floor(state.seconds%60)).padStart(2,'0')}`;byId('lock-title').textContent=['Connect the theme','Match the references','Arrange the cards','Recognize the words','Room unlocked'][state.step]!;byId('lock-progress').textContent=state.step===4?'Complete':`Lock ${state.step+1} of 4`;
 if(state.step===4){running=false;root.innerHTML=`<div class="completion"><span class="eyebrow">All four locks open</span><h2>A room explored.</h2><p>${esc(room.explanation)}</p><p>${state.assisted.length} ${state.assisted.length===1?'lock used':'locks used'} a hint or solution. ${state.assisted.length?'Revisit the source shelf whenever you like.':'You can return to the passages for a slower reading.'}</p><div class="actions"><button class="button" id="share">Copy completion</button><a class="button secondary" href="/">Choose another room</a></div></div>`;byId('share').onclick=()=>copy(`I explored ${room.name}: 4 source-reading locks completed, ${state.assisted.length} assisted.\n${location.origin+location.pathname}`);return;}
 let body='';
 if(state.step===0)body=`<p>Which theme connects the three passages on the source shelf?</p><fieldset><legend class="sr-only">Choose a theme</legend>${shuffle(room.options.includes(room.theme)?room.options:[...room.options,room.theme],lockSeeds(state.seed).options).map(t=>`<label class="answer-row"><input type="radio" name="theme" value="${esc(t)}" required/> ${esc(t)}</label>`).join('')}</fieldset>`;
 if(state.step===1)body=`<p>Match each exact English excerpt to its source reference. Open the shelf to compare.</p>${shuffle(room.passages,lockSeeds(state.seed).matches).map((p,i)=>`<label class="field bottom-gap"><span>“${esc(excerpt(p.translation))}”</span><select name="match-${i}" data-ref="${esc(p.ref)}" required><option value="">Choose reference</option>${shuffle(room.refs,lockSeeds(state.seed).refs).map(ref=>`<option>${esc(ref)}</option>`).join('')}</select></label>`).join('')}`;
 if(state.step===2)body=`<p>Arrange these references in <strong>Quran chapter and ayah order</strong>. This is mushaf order, not historical or revelation order.</p><ol class="order-list">${order.map((ref,i)=>`<li><span>Quran ${esc(ref)}</span><div><button type="button" class="icon-button" data-move="${i}" data-direction="-1" aria-label="Move ${esc(ref)} up" ${i===0?'disabled':''}>↑</button><button type="button" class="icon-button" data-move="${i}" data-direction="1" aria-label="Move ${esc(ref)} down" ${i===order.length-1?'disabled':''}>↓</button></div></li>`).join('')}</ol>`;
 if(state.step===3)body=`<p>Select the <strong>two excerpts</strong> that occur in this room’s source shelf. All excerpts use Pickthall’s wording.</p><fieldset><legend class="sr-only">Choose two excerpts</legend>${snippets.map((s,i)=>`<label class="answer-row"><input type="checkbox" name="snippet" value="${i}"/> <span>“${esc(s.text)}”</span></label>`).join('')}</fieldset>`;
 root.innerHTML=`<form id="lock-form">${body}<p id="feedback" role="status"></p><div class="actions top-gap"><button class="button">Check lock</button><button type="button" class="button secondary" id="hint">Show hint</button><button type="button" class="text-button" id="solution">Reveal solution</button></div><p id="hint-text" class="micro"></p></form>`;
 root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach(b=>b.onclick=()=>{const a=Number(b.dataset.move),z=a+Number(b.dataset.direction);[order[a],order[z]]=[order[z]!,order[a]!];render();});
 byId('hint').onclick=()=>{assist();byId('hint-text').textContent=[room.hint,'Compare the wording in each excerpt with the full translations on the shelf.','Sort by chapter number, then the starting ayah number.','Two excerpts are from this room. The other two come from a different room.'][state.step]!;};
 byId('solution').onclick=()=>{assist();byId('hint-text').textContent=['Theme: '+room.theme,'Match each excerpt with the reference shown beside the same passage in the source shelf.','Order: '+canonicalOrder(room.refs).join(' → '),'Choose excerpts '+snippets.map((s,i)=>s.correct?i+1:null).filter(Boolean).join(' and ')+'.'][state.step]!;if(state.step===1){root.querySelectorAll<HTMLSelectElement>('select[data-ref]').forEach(s=>s.value=s.dataset.ref!);} };
 byId<HTMLFormElement>('lock-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget as HTMLFormElement);let yes=false;
  if(state.step===0)yes=f.get('theme')===room.theme;
  if(state.step===1)yes=[...root.querySelectorAll<HTMLSelectElement>('select[data-ref]')].every(s=>s.value===s.dataset.ref);
  if(state.step===2)yes=order.join()===canonicalOrder(room.refs).join();
  if(state.step===3)yes=sameSet(f.getAll('snippet').map(Number),snippets.map((s,i)=>s.correct?i:-1).filter(i=>i>=0));
  if(!yes){byId('feedback').textContent='This lock is still closed. Compare the source shelf and try again.';return;}
  state.step++;persist();render();const h=byId('lock-title');h.tabIndex=-1;h.focus({preventScroll:true});
 };
}
function assist(){if(!state.assisted.includes(state.step)){state.assisted.push(state.step);persist();}}
render();

import '../styles/room.css';
