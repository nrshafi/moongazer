import {checkRelationship,relationshipAt} from './assessment';
import {track} from './counter';
import {renderSessionEnd} from './session-end';
import {pulseCorrect} from './utils';
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
  const right=checkRelationship(selected,expected);
  if(right)pulseCorrect(feedback);
  if(!checkCounted){checkCounted=true;track('activity_completed',form.dataset.id!);}
  renderSessionEnd(document.getElementById('session-end')!,{
    result:right?`You chose ${selected}. This report is classified as ${expected}.`:`You chose ${typeof selected==='string'?selected:'no category'}. This report is classified as ${expected}.`,
    learned:['A report about what happened after revelation is not the cause of the passage.',`Report attributed to ${form.dataset.narrator}, beside Quran ${form.dataset.ref}.`],
    shareText:'I compared reports on why a Quran passage was revealed. https://why-it-was-revealed.moongazer.tech/',
    itemId:form.dataset.id!,
    next:{name:form.dataset.nextName!,url:form.dataset.nextUrl!},
    heading:'Reading check complete',
  });
});
