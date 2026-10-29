import content from '../data/content.json';
import { read, write, copy, announce } from './utils';
import { matchesFilters, type Filters } from './catalog';

const cards = [...document.querySelectorAll<HTMLElement>('[data-item-id]')];
const entries = Object.values(content).filter(Array.isArray).flat() as { id?: string }[];
const known = new Set(entries.map(entry => entry.id).filter((id): id is string => typeof id === 'string'));
const valid = (value: unknown): value is string[] => Array.isArray(value) && value.length <= known.size && new Set(value).size === value.length && value.every(id => typeof id === 'string' && known.has(id));
let saved = read('bookmarks', valid) || [];
const input = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;

function filter() {
  const filters: Filters = { query: input('filter')?.value || '', topic: input('topic')?.value || '', region: input('region')?.value || '', age: input('age')?.value || '', from: input('from-year')?.value || '', to: input('to-year')?.value || '' };
  const invalid = (filters.from !== '' && (!Number.isInteger(Number(filters.from)) || Number(filters.from) < 600 || Number(filters.from) > 1700)) || (filters.to !== '' && (!Number.isInteger(Number(filters.to)) || Number(filters.to) < 600 || Number(filters.to) > 1700)) || (filters.from !== '' && filters.to !== '' && Number(filters.from) > Number(filters.to));
  const error = document.getElementById('filter-error');
  if (error) error.textContent = invalid ? 'Use whole years from 600 to 1700, with the earlier year first.' : '';
  const only = (input('saved-only') as HTMLInputElement | null)?.checked;
  let count = 0;
  for (const card of cards) {
    const show = !invalid && matchesFilters({ search: card.dataset.search || '', topic: card.dataset.topic || '', region: card.dataset.region || '', age: card.dataset.age || '', start: Number(card.dataset.start), end: Number(card.dataset.end) }, filters) && (!only || saved.includes(card.dataset.itemId!));
    card.hidden = !show;
    if (show) count++;
  }
  const counter = document.getElementById('count');
  if (counter) counter.textContent = `${count} of ${cards.length} entries shown`;
  const empty = document.getElementById('empty');
  if (empty) empty.hidden = count !== 0;
}

function updateSaved() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
    const active = saved.includes(button.dataset.save!);
    button.textContent = active ? 'Saved ✓' : 'Save for later';
    button.setAttribute('aria-pressed', String(active));
  });
  filter();
}

document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.save!;
    saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    if (!write('bookmarks', saved)) announce('Storage unavailable. Saved for this visit only.');
    updateSaved();
  });
});
const form = document.getElementById('catalog-filters');
form?.addEventListener('submit', event => event.preventDefault());
form?.addEventListener('input', filter);
form?.addEventListener('change', filter);
form?.addEventListener('reset', event => {
  event.preventDefault();
  for (const id of ['filter', 'topic', 'region', 'age', 'from-year', 'to-year']) {
    const control = input(id);
    if (control) control.value = '';
  }
  const only = input('saved-only') as HTMLInputElement | null;
  if (only) only.checked = false;
  filter();
});
document.querySelectorAll<HTMLButtonElement>('[data-region-filter]').forEach(button => button.addEventListener('click', () => {
  const region = input('region');
  if (region) region.value = button.dataset.regionFilter!;
  filter();
  form?.scrollIntoView({ block: 'start', behavior: 'auto' });
  region?.focus({ preventScroll: true });
}));
document.getElementById('copy-saved')?.addEventListener('click', () => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-reading-link]')].filter(link => saved.includes(link.dataset.readingLink!));
  if (!links.length) { announce('Save an entry before copying a reading list.'); return; }
  void copy(links.map(link => `${link.textContent?.trim()}
${new URL(link.getAttribute('href')!, location.origin).href}`).join('\n\n'), 'Reading list copied');
});
updateSaved();
