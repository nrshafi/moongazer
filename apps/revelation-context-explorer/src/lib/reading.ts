import {checkRelationship} from './assessment';
const form=document.getElementById('relationship') as HTMLFormElement;
const feedback=document.getElementById('relationship-feedback')!;
form.addEventListener('submit',event=>{
  event.preventDefault();
  const selected=new FormData(form).get('answer');
  feedback.textContent=checkRelationship(selected,form.dataset.kind!)?'Yes. '+form.dataset.explanation:'Revisit the sequence. This entry is classified as “'+form.dataset.kind+'”. '+form.dataset.explanation;
});
