import {byId,pulseCorrect} from './utils';
import {track} from './counter';
import {renderSessionEnd} from './session-end';
const SITE='https://stories-of-the-prophets.moongazer.tech/';
const form=byId<HTMLFormElement>('quiz');
form.onsubmit=e=>{
  e.preventDefault();
  track('activity_started',form.dataset.itemId!);
  track('activity_completed',form.dataset.itemId!);
  const selected=new FormData(form).get('answer');
  const yes=selected===form.dataset.answer;
  const ref=form.dataset.reference!;
  byId('feedback').textContent=yes?`Correct. You can verify the detail in Quran ${ref}.`:`Not quite. Look again at Quran ${ref}, then try another answer.`;
  if(yes)pulseCorrect(byId('feedback'));
  renderSessionEnd(byId('session-end'),{
    result:yes?`Correct. The cited passage is Quran ${ref}.`:`Not quite. See the cited passage, Quran ${ref}.`,
    learned:['The library is a selection of Quranic passages, not a biography.',`The checked detail is in Quran ${ref}.`],
    shareText:`I read about a prophet in Stories of the Prophets. ${SITE}`,
    itemId:form.dataset.itemId!,
    next:{name:form.dataset.nextName!,url:form.dataset.nextUrl!},
    heading:'Reading check complete',
  });
};
