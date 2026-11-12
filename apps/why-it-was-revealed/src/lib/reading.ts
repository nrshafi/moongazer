import {checkRelationship,relationshipAt} from './assessment';
import {track} from './counter';
const form=document.getElementById('relationship') as HTMLFormElement;
const feedback=document.getElementById('relationship-feedback')!;
// The answer is held as an index so the category label is not printed on the page before the reader answers.
const expected=relationshipAt(form.dataset.answer);
// Anonymous counter (P4): item id is the reading's stable id; never the selected answer or any text.
let checkCounted=false;
form.addEventListener('change',()=>{track('activity_started',form.dataset.id!);});
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!expected){feedback.textContent='This check could not load. Read the report notes above instead.';return;}
  const selected=new FormData(form).get('answer');
  feedback.textContent=checkRelationship(selected,expected)?'Yes: '+expected+'. '+form.dataset.explanation:'Not quite. This report is classified as “'+expected+'”. '+form.dataset.explanation;
  if(!checkCounted){checkCounted=true;track('activity_completed',form.dataset.id!);}
});
