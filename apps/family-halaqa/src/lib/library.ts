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
  if (counter) counter.textContent = `${count} of ${cards.length} packs shown`;
  const empty = document.getElementById('empty');
  if (empty) empty.hidden = count !== 0;
}

function updateSaved() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(button => {
    const active = saved.includes(button.dataset.save!);
    button.textContent = active ? 'Saved ✓' : 'Save';
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
  if (!links.length) { announce('Save a pack before copying your list.'); return; }
  void copy(links.map(link => `${link.textContent?.trim()}
${new URL(link.getAttribute('href')!, location.origin).href}`).join('\n\n'), 'List copied');
});
updateSaved();

// Print saved packs (P5.12): one print view of every saved pack, built from the same data as the pack pages.
// The prompts and facilitator answers are printed; nothing is stored or sent. Shared print CSS hides the page chrome.
type PrintPack = (typeof content.packs)[number];
function printSection(pack: PrintPack): HTMLElement {
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const section = make('section', undefined, 'saved-pack');
  section.append(make('h2', pack.title), make('p', `${pack.topic} · suggested ages ${pack.age} · about ${pack.minutes} minutes`, 'micro'));
  const passage = (pack as { passage?: { ref: string; translation: string } }).passage;
  if (passage) {
    section.append(make('p', `${passage.translation} (Quran ${passage.ref}, Marmaduke Pickthall)`));
  }
  section.append(make('h3', '1. Read and notice'), make('p', pack.teaching), make('p', pack.question));
  const options = make('ol');
  for (const option of pack.options) options.append(make('li', option));
  section.append(options, make('p', `Facilitator’s answer: ${pack.options[pack.answer]} ${pack.explanation}`, 'micro'));
  section.append(make('h3', '2. Talk it through'), make('p', pack.discussion), make('div', undefined, 'print-line'));
  section.append(make('h3', '3. Try something together'), make('p', pack.activity), make('p', pack.close), make('div', undefined, 'print-line'));
  return section;
}
const savedPrint = document.getElementById('saved-print');
document.getElementById('print-saved')?.addEventListener('click', () => {
  if (!savedPrint) return;
  const chosen = content.packs.filter(pack => saved.includes(pack.id));
  if (!chosen.length) { announce('Save a pack before printing your saved packs.'); return; }
  savedPrint.replaceChildren(...chosen.map(printSection));
  document.documentElement.classList.add('printing-saved');
  window.print();
});
window.addEventListener('afterprint', () => {
  document.documentElement.classList.remove('printing-saved');
  savedPrint?.replaceChildren();
});
