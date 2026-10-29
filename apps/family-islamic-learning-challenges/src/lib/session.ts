import type content from '../data/content.json';
import {newSession,validSession,answerQuestion,finishStep,type Session} from './engine';
import {byId,read,write,forget,announce,copy} from './utils';
type Pack=(typeof content.packs)[number];
const pack=JSON.parse(byId('activity-data').textContent!) as Pack;
const remember=byId<HTMLInputElement>('remember-pack');
const form=byId<HTMLFormElement>('reading-question');
const feedback=byId('reading-feedback');
const key=`session-${pack.id}`;
remember.checked=read('remember',(value):value is boolean=>typeof value==='boolean')||false;
let state:Session=remember.checked?read(key,(value):value is Session=>validSession(value,pack))||newSession():newSession();
function persist(){if(remember.checked&&!write(key,state))announce('Storage unavailable. The session still works for this visit.');}
function update(){
  for(const radio of form.querySelectorAll<HTMLInputElement>('input[name=answer]'))radio.checked=state.answer===Number(radio.value);
  (form.querySelector('fieldset') as HTMLFieldSetElement).disabled=state.done[0]!;
  (form.querySelector('button[type=submit]') as HTMLButtonElement).disabled=state.done[0]!;
  feedback.textContent=state.checked?(state.done[0]?'Yes. ':'Try again. ')+pack.explanation:'';
  document.querySelectorAll<HTMLElement>('[data-step]').forEach(element=>{
    const index=Number(element.dataset.step);
    element.classList.toggle('done',state.done[index]!);
    element.classList.toggle('current',!state.done[index]&&(index===0||state.done[index-1]!));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-finish]').forEach(button=>{
    const step=Number(button.dataset.finish);
    button.disabled=!state.done[step-1]||state.done[step]!;
    button.textContent=state.done[step]?'Completed ✓':step===1?'We discussed it, or chose to pass':'We tried it, or chose to pass';
  });
  byId('session-count').textContent=`${state.done.filter(Boolean).length} of 3 steps complete`;
  byId('session-complete').hidden=!state.done.every(Boolean);
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const choice=new FormData(form).get('answer');
  if(choice===null)return;
  state=answerQuestion(state,Number(choice),pack);persist();update();
});
document.querySelectorAll<HTMLButtonElement>('[data-finish]').forEach(button=>button.addEventListener('click',()=>{
  state=finishStep(state,Number(button.dataset.finish),pack);persist();update();
}));
remember.addEventListener('change',()=>{
  if(remember.checked){if(!write('remember',true))announce('Storage unavailable. Continue without saved recovery.');persist();}
  else{forget('remember');forget(key);announce('Saved session cleared. Current activity remains for this visit.');}
});
byId('restart-pack').addEventListener('click',()=>{state=newSession();forget(key);update();form.scrollIntoView({block:'center',behavior:'auto'});});
byId('copy-completion').addEventListener('click',()=>void copy(`We explored “${pack.title}” together.\nA reading, a conversation and a shared activity. No personal score or participant details.\n${location.origin+location.pathname}`,'Pack link copied'));
update();
