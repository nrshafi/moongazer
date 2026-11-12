import {byId,read} from './utils';
const search=byId<HTMLInputElement>('scenario-search');const topic=byId<HTMLSelectElement>('scenario-topic');const cards=[...document.querySelectorAll<HTMLElement>('[data-search]')];const tabs=[...document.querySelectorAll<HTMLButtonElement>('[data-track-tab]')];
let track='all';
function filter(){const query=search.value.toLowerCase().trim();let visible=0;for(const card of cards){const match=(!query||card.dataset.search!.includes(query))&&(topic.value==='all'||card.dataset.topic===topic.value)&&(track==='all'||card.dataset.track===track);card.hidden=!match;if(match)visible++;}byId('scenario-count').textContent=`${visible} ${visible===1?'scenario':'scenarios'}`;byId('scenario-empty').hidden=visible>0;}
search.addEventListener('input',filter);topic.addEventListener('change',filter);byId('scenario-reset').addEventListener('click',()=>{search.value='';topic.value='all';track='all';tabs.forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.trackTab==='all')));filter();search.focus();});
for(const tab of tabs)tab.addEventListener('click',()=>{track=tab.dataset.trackTab!;tabs.forEach(other=>other.setAttribute('aria-pressed',String(other===tab)));filter();});

// Completion state on the cards (Verify_Me #44). Choices are stored only when the visitor ticked "Remember this scenario",
// so this shows "Done" for those scenarios and leaves the default line for the rest. A loose validator keeps in-progress states intact.
const looseState=(value:unknown):value is {stage:number;choices:number[]}=>!!value&&typeof value==='object'&&typeof (value as {stage:unknown}).stage==='number'&&Array.isArray((value as {choices:unknown}).choices);
for(const card of document.querySelectorAll<HTMLElement>('[data-scenario-card]')){
  const saved=read(`${card.dataset.base}-${card.dataset.scenarioCard}`,looseState);
  if(saved&&saved.stage===2&&saved.choices.length===2){const status=card.querySelector('[data-card-status]');if(status)status.textContent='Done: 2 choices made';}
}
