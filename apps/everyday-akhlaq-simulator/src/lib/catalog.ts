import {byId} from './utils';
const search=byId<HTMLInputElement>('scenario-search');const topic=byId<HTMLSelectElement>('scenario-topic');const cards=[...document.querySelectorAll<HTMLElement>('[data-search]')];
function filter(){const query=search.value.toLowerCase().trim();let visible=0;for(const card of cards){const match=(!query||card.dataset.search!.includes(query))&&(topic.value==='all'||card.dataset.topic===topic.value);card.hidden=!match;if(match)visible++;}byId('scenario-count').textContent=`${visible} ${visible===1?'scenario':'scenarios'}`;byId('scenario-empty').hidden=visible>0;}
search.addEventListener('input',filter);topic.addEventListener('change',filter);byId('scenario-reset').addEventListener('click',()=>{search.value='';topic.value='all';filter();search.focus();});
