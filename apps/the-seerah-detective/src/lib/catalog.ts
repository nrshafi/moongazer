import {byId} from './utils';
const search=byId<HTMLInputElement>('case-search');const topic=byId<HTMLSelectElement>('case-topic');const cards=[...document.querySelectorAll<HTMLElement>('[data-search]')];
function filter(){const query=search.value.toLocaleLowerCase().trim();let visible=0;for(const card of cards){const match=(!query||card.dataset.search!.includes(query))&&(topic.value==='all'||card.dataset.topic===topic.value);card.hidden=!match;if(match)visible++;}byId('case-count').textContent=`${visible} ${visible===1?'case':'cases'}`;byId('case-empty').hidden=visible>0;}
search.addEventListener('input',filter);topic.addEventListener('change',filter);byId('case-reset').addEventListener('click',()=>{search.value='';topic.value='all';filter();search.focus();});
