const cards = [...document.querySelectorAll('.app-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('input[type="search"]');
const status = document.querySelector('#result-count');
const empty = document.querySelector('.empty-state');
let category = 'all';

function updateLibrary() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const card of cards) {
    const matches = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) count++;
  }
  for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  status.textContent = `${count} ${count === 1 ? 'app' : 'apps'} ${query || category !== 'all' ? 'found' : 'to explore'}`;
  empty.hidden = count !== 0;
}

for (const button of filters) button.addEventListener('click', () => {
  category = button.dataset.filter;
  updateLibrary();
});
search.addEventListener('input', updateLibrary);
document.querySelector('.reset').addEventListener('click', () => {
  category = 'all';
  search.value = '';
  updateLibrary();
  search.focus();
});
document.querySelector('.library-controls').hidden = false;
