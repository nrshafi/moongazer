import data from '../data/content.json';
import { read, write, announce } from './utils';
import { solvedIds } from './state';

/** Saved themes: up to 100 theme ids. */
const themeIds = (value: unknown): value is string[] => Array.isArray(value) && value.length <= 100 && value.every(item => typeof item === 'string' && /^[a-z-]{1,60}$/.test(item));
let saved = read('theme-bookmarks', themeIds) || [];
const solved = solvedIds();
const total = data.themes.length;
const cards = [...document.querySelectorAll<HTMLElement>('[data-item-id]')];
const countOf = (id: string) => data.themes.find(t => t.id === id);

function paintSaved() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
    const yes = saved.includes(button.dataset.save!);
    button.textContent = yes ? 'Saved ✓' : 'Save';
    button.setAttribute('aria-pressed', String(yes));
  });
}

function applyFilters() {
  const category = document.querySelector<HTMLSelectElement>('#category')?.value || '';
  const only = document.querySelector<HTMLInputElement>('#saved-only')?.checked;
  let shown = 0;
  for (const card of cards) {
    const show = (!category || card.dataset.category === category) && (!only || saved.includes(card.dataset.itemId!));
    card.hidden = !show;
    if (show) shown++;
  }
  const status = document.querySelector('#shown-count');
  if (status) status.textContent = `${shown} of ${total} threads shown`;
  const empty = document.querySelector<HTMLElement>('#empty');
  if (empty) empty.hidden = shown !== 0;
}

document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.save!;
  saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
  if (!write('theme-bookmarks', saved)) announce('Storage unavailable. Saved for this visit only.');
  paintSaved();
  applyFilters();
}));
document.querySelector('#category')?.addEventListener('change', applyFilters);
document.querySelector('#saved-only')?.addEventListener('change', applyFilters);

// Solved state: reveal names only for threads the visitor has already solved or revealed.
for (const card of cards) {
  const id = card.dataset.itemId!;
  if (!solved.has(id)) continue;
  card.querySelector<HTMLElement>('.solved-pill')?.removeAttribute('hidden');
  const name = card.querySelector<HTMLElement>('[data-theme-name]');
  const theme = countOf(id);
  if (name && theme) { name.textContent = `Theme: ${theme.theme}`; name.hidden = false; }
}
const countEl = document.querySelector('#solved-count');
if (countEl) countEl.textContent = `${data.themes.filter(t => solved.has(t.id)).length} of ${total} themes solved`;

const page = document.querySelector<HTMLElement>('[data-theme-page]');
if (page && solved.has(page.dataset.themePage!)) {
  document.querySelector<HTMLElement>('#solve-cta')?.setAttribute('hidden', '');
  document.querySelector<HTMLElement>('#solved-note')?.removeAttribute('hidden');
  document.querySelector<HTMLDetailsElement>('#thread')?.setAttribute('open', '');
  const summary = document.querySelector<HTMLElement>('#thread > summary');
  if (summary) summary.textContent = 'The thread';
}
paintSaved();
applyFilters();
