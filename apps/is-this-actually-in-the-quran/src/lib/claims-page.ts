import content from '../data/content.json';
import { categories, validBookmarks } from './claims';
import { importSaved } from './merge-import';
import { read, write, announce, esc, byId } from './utils';
import { track } from './counter';

const REPORT_LINK = ' <a class="feedback-link" href="#site-feedback" data-open-feedback>Report an error <span aria-hidden="true">→</span></a>';

const known = content.claims.map(claim => claim.id);
const valid = validBookmarks(known);
importSaved();
let saved = read('claim-bookmarks', valid) || [];

function paint() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
    const on = saved.includes(button.dataset.save!);
    button.textContent = on ? 'Saved ✓' : 'Save';
    button.setAttribute('aria-pressed', String(on));
  });
  const count = document.getElementById('saved-count');
  if (count) count.textContent = saved.length ? `${saved.length} of ${known.length} claims saved` : '';
}
document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.save!;
  saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
  if (!write('claim-bookmarks', saved)) announce('Storage unavailable. Saved for this visit only.');
  paint();
}));
paint();

const form = document.getElementById('claim-form') as HTMLFormElement | null;
if (form) {
  const answer = byId<HTMLDetailsElement>('answer');
  const status = byId('claim-status');
  const expected = form.dataset.category!;
  form.hidden = false;
  answer.hidden = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const choice = new FormData(form).get('answer');
    if (typeof choice !== 'string' || !(categories as readonly string[]).includes(choice)) { status.textContent = 'Choose one option, then press Check.'; return; }
    track('activity_started', form.dataset.claimId!);
    track('activity_completed', form.dataset.claimId!);
    answer.hidden = false;
    answer.open = true;
    answer.querySelector('summary')!.hidden = true;
    status.innerHTML = choice === expected ? `You chose “${esc(choice)}”. That matches the evidence.` : `You chose “${esc(choice)}”. The evidence below points to “${esc(expected)}”.`;
    status.insertAdjacentHTML('beforeend', REPORT_LINK);
    answer.querySelector<HTMLElement>('h2')!.focus();
  });
}
