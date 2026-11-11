import {byId} from './utils';
// Recall first: the meaning starts hidden (via CSS when JavaScript runs) and is shown on request.
byId('practice').onclick=()=>{const panel=byId('meaning');const open=panel.classList.toggle('revealed');byId('practice').textContent=open?'Hide meaning':'Show meaning';byId('practice').setAttribute('aria-expanded',String(open));};
const form=byId<HTMLFormElement>('quiz');form.onsubmit=e=>{e.preventDefault();const ok=new FormData(form).get('answer')===form.dataset.answer;byId('feedback').textContent=ok?'That matches the wording. Read it again with the meaning in mind.':'Show the meaning, read it again, and try another answer.';};
const player=document.querySelector<HTMLAudioElement>('#recitation');if(player){byId('speed').onchange=()=>{player.playbackRate=Number(byId<HTMLSelectElement>('speed').value);};byId('loop').onchange=()=>{player.loop=byId<HTMLInputElement>('loop').checked;};player.addEventListener('error',()=>{byId('audio-error').hidden=false;});}
