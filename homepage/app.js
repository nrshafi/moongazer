// Directory quick picker. Without JavaScript the chips are plain links (/?pick=<id>#library) and the
// library lists every app. With JavaScript the same chips filter the cards in place.
const cards = [...document.querySelectorAll('#library .app-card')];
const chips = [...document.querySelectorAll('.chip[data-pick]')];
const status = document.querySelector('#result-count');
const showAll = document.querySelector('.show-all');
const library = document.querySelector('#library');

function matches(chip, card) {
  if (chip.dataset.maxTime) return Number(card.dataset.time) <= Number(chip.dataset.maxTime);
  if (chip.dataset.audience) return card.dataset.audience === chip.dataset.audience;
  return card.dataset.slug === chip.dataset.slug;
}

function apply(id, { writeUrl }) {
  const chip = chips.find(c => c.dataset.pick === id) || null;
  let count = 0;
  for (const card of cards) {
    const show = !chip || matches(chip, card);
    card.hidden = !show;
    if (show) count++;
  }
  for (const c of chips) {
    if (c === chip) c.setAttribute('aria-current', 'true');
    else c.removeAttribute('aria-current');
  }
  status.textContent = chip
    ? `${count} ${count === 1 ? 'app' : 'apps'} for "${chip.textContent}"`
    : `${cards.length} apps to explore`;
  showAll.hidden = !chip;
  if (writeUrl) history.replaceState(null, '', chip ? `?pick=${chip.dataset.pick}#library` : '/#library');
}

for (const chip of chips) {
  chip.addEventListener('click', event => {
    event.preventDefault();
    // A second tap on the active chip clears the filter.
    apply(chip.getAttribute('aria-current') ? '' : chip.dataset.pick, { writeUrl: true });
    library.scrollIntoView();
  });
}
showAll.addEventListener('click', event => {
  event.preventDefault();
  apply('', { writeUrl: true });
});
apply(new URLSearchParams(location.search).get('pick') || '', { writeUrl: false });
