// Save toggle for business scenarios (bookmarks live under `business-bookmarks`, same behaviour as the old Halal Business Decisions app).
import { BUSINESS_BOOKMARKS, validBookmarks } from './business';
import { read, write, announce } from './utils';
let saved = read(BUSINESS_BOOKMARKS, validBookmarks) || [];
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-save]')];
const only = document.getElementById('saved-only') as HTMLInputElement | null;
function update() {
  for (const button of buttons) {
    const active = saved.includes(button.dataset.save!);
    button.textContent = active ? 'Saved ✓' : 'Save';
    button.setAttribute('aria-pressed', String(active));
  }
  const cards = [...document.querySelectorAll<HTMLElement>('[data-business-card]')];
  if (!cards.length) return;
  let shown = 0;
  for (const card of cards) { const show = !only?.checked || saved.includes(card.dataset.businessCard!); card.hidden = !show; if (show) shown++; }
  const count = document.getElementById('business-count');
  if (count) count.textContent = `${shown} of ${cards.length} scenarios shown`;
  const empty = document.getElementById('business-empty');
  if (empty) empty.hidden = shown !== 0;
}
for (const button of buttons) button.addEventListener('click', () => {
  const id = button.dataset.save!;
  saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
  if (!write(BUSINESS_BOOKMARKS, saved)) announce('Storage unavailable. Saved for this visit only.');
  update();
});
only?.addEventListener('change', update);
update();
