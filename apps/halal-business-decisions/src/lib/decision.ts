import type content from '../data/content.json';
import {addDecision,decisionLedger,validTrail,optionOrder,newSeed,type Trail} from './engine';
import {byId,read,write,forget,esc,copy,announce,focusHeading} from './utils';
type Case=(typeof content.cases)[number];
const item=JSON.parse(byId('activity-data').textContent!) as Case;
const root=byId('decision');
const remember=byId<HTMLInputElement>('remember-case');
remember.checked=read('remember',(value):value is boolean=>typeof value==='boolean')||false;
const key=`case-${item.id}`;
// The option order comes from a seed kept for this visit, or in the saved trail when remembering is on.
const fresh=():Trail=>({version:1,choices:[],seed:newSeed()});
let state:Trail=remember.checked?read(key,(value):value is Trail=>validTrail(value,item))||fresh():fresh();
if(state.seed===undefined)state={...state,seed:newSeed()};
function persist(){if(remember.checked&&!write(key,state))announce('Storage unavailable. Your choices still work for this visit.');}
function render(moveFocus=false){
  const stage=state.choices.length;
  const ledger=decisionLedger(state,item);
  root.innerHTML=`<ol class="stage-track" aria-label="Case stages"><li class="${stage===0?'current':'done'}">First decision</li><li class="${stage===1?'current':stage===2?'done':''}">Follow-up</li><li class="${stage===2?'current':''}">Source review</li></ol>`;
  if(ledger.length)root.innerHTML+=`<section class="bottom-gap"><h2>Your decision ledger</h2>${ledger.map((choice,index)=>`<div class="ledger-row"><strong>${index+1}. ${esc(choice.label)}</strong><p>${esc(choice.consequence)}</p><span class="micro">${esc(choice.signal)}</span></div>`).join('')}</section>`;
  if(stage<2){
    const choices=stage===0?item.choices:item.repairs;
    root.innerHTML+=`<h2>${stage===0?'What would you do?':'The next decision'}</h2><p>${esc(stage===0?item.setup:item.followup)}</p><div role="group" aria-label="Available responses">${optionOrder(choices.length,state.seed!,stage===0?0:1).map(index=>`<button class="choice" data-choice="${index}">${esc(choices[index]!.label)}</button>`).join('')}</div>`;
  }else{
    root.innerHTML+=`<section class="completion"><h2>Return to the source</h2><p>${esc(item.teaching)}</p><p class="micro">Outcomes and modern applications are editorial reasoning beyond the fetched canonical text. They do not constitute a scholarly ruling or opinion from quran.ai, quran.com or quran.foundation. No piety score or transaction certification is assigned.</p><button class="button secondary" id="copy-case">Copy choices and sources</button></section>`;
    document.getElementById('copy-case')?.addEventListener('click',()=>void copy(`${item.title}\nFictional educational exercise, not a ruling.\n\n${ledger.map((choice,index)=>`${index+1}. ${choice.label}\n${choice.consequence}`).join('\n\n')}\n\nQuran ${item.passage.ref}: ${item.passage.url}\n${item.commentaryUrl}\n${item.sources.map(source=>source.url).join('\n')}\n${location.origin+location.pathname}`,'Case summary copied'));
  }
  if(moveFocus)focusHeading(root);
}
root.addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]');
  if(!button)return;
  state=addDecision(state,Number(button.dataset.choice),item);persist();render(true);
});
remember.addEventListener('change',()=>{
  if(remember.checked){if(!write('remember',true))announce('Storage unavailable. Continue without saved recovery.');persist();}
  else{forget('remember');forget(key);announce('Saved recovery for this case cleared. Current choices remain for this visit.');}
});
document.getElementById('restart-case')?.addEventListener('click',()=>{state=fresh();forget(key);render(true);});
render();
