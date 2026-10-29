import {assess} from './assessment';
import {copy} from './utils';
const form=document.getElementById('conclusion-form') as HTMLFormElement;
const conclusion=document.getElementById('conclusion')!;
const feedback=document.getElementById('verdict-feedback')!;
const evidence=[...document.querySelectorAll<HTMLDetailsElement>('[data-evidence]')];
const counter=document.getElementById('evidence-count')!;
function count(){counter.textContent=`${evidence.filter(item=>item.open).length} of ${evidence.length} evidence cards open`;}
evidence.forEach(item=>item.addEventListener('toggle',count));
form.addEventListener('submit',event=>{
  event.preventDefault();
  const result=assess(new FormData(form).get('answer'),form.dataset.verdict!);
  if(!result.valid)return;
  feedback.textContent=result.correct?'That matches the scope of the cited evidence.':'Compare your conclusion with the evidence limit below. The intended classification is “'+form.dataset.verdict+'”.';
  conclusion.hidden=false;
});
document.getElementById('retry-case')?.addEventListener('click',()=>{form.reset();feedback.textContent='';conclusion.hidden=true;form.querySelector('input')?.focus();});
document.getElementById('copy-correction')?.addEventListener('click',()=>{
  const text=JSON.parse(document.getElementById('share-data')!.textContent!) as string;
  void copy(text+'\nCase: '+location.origin+location.pathname,'Correction and references copied');
});
count();
