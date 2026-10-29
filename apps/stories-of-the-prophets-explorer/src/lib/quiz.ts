import {byId} from './utils';
const form=byId<HTMLFormElement>('quiz');form.onsubmit=e=>{e.preventDefault();const selected=new FormData(form).get('answer');const yes=selected===form.dataset.answer;byId('feedback').textContent=yes?`Correct. You can verify the detail in Quran ${form.dataset.reference}.`:`Look again at Quran ${form.dataset.reference}, then try another answer.`;};
