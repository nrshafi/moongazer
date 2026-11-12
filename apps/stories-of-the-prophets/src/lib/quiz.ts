import {byId} from './utils';
import {track} from './counter';
const REPORT_LINK=' <a class="feedback-link" href="#site-feedback" data-open-feedback>Report an error <span aria-hidden="true">→</span></a>';
const form=byId<HTMLFormElement>('quiz');form.onsubmit=e=>{e.preventDefault();track('activity_started',form.dataset.itemId!);track('activity_completed',form.dataset.itemId!);const selected=new FormData(form).get('answer');const yes=selected===form.dataset.answer;byId('feedback').textContent=yes?`Correct. You can verify the detail in Quran ${form.dataset.reference}.`:`Look again at Quran ${form.dataset.reference}, then try another answer.`;byId('feedback').insertAdjacentHTML('beforeend',REPORT_LINK);};
