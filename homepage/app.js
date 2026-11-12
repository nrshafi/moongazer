import {DAILY_EPOCH, dayNumber, ayahIndex, longDate} from './daily.js';
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

// P6 T6.6: "Tonight on Moongazer". Same day number as the apps (daily.js mirrors their daily.ts; parity is tested).
// Before launch the tiles name the first day instead of a number. The ayah follows the same local day count.

const now = new Date();
const n = dayNumber(now);
for (const el of document.querySelectorAll('[data-daily-n]')) el.textContent = n ? `#${n}` : '';
const when = document.querySelector('[data-tonight-when]');
if (when) when.textContent = n
  ? `Puzzle #${n} for ${now.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'})}. A new one at midnight, your local time.`
  : `Daily puzzles begin on ${longDate(DAILY_EPOCH)}. Practise any time until then.`;

const details = document.querySelector('[data-ayah-details]');
// Open on wider screens, where the ayah has its own column; phones keep the one-line summary until tapped.
if (details && matchMedia('(min-width: 701px)').matches) details.open = true;

async function showTonightsAyah() {
  if (!details || ayahIndex(now, Number(details.dataset.count)) === Number(details.dataset.index)) return;
  try {
    const ayat = await (await fetch('/ayat-of-the-night.json')).json();
    const ayah = ayat[ayahIndex(now, ayat.length)];
    if (!ayah) return;
    for (const el of document.querySelectorAll('[data-ayah-ref]')) el.textContent = ayah.ref;
    document.querySelector('[data-ayah-ar]').textContent = ayah.arabic;
    document.querySelector('[data-ayah-en]').textContent = ayah.translation;
    document.querySelector('[data-ayah-link]').href = `https://is-it-in-the-quran.moongazer.tech/#q=${encodeURIComponent(ayah.ref)}`;
  } catch {
    // Offline or blocked: the build-date ayah stays, which is still exact text with its reference.
  }
}
showTonightsAyah();

// P7 T7.11: seasonal slot. The card is hidden in the static HTML and shown only between its dates (local calendar).
const season = document.querySelector('[data-season-from]');
if (season) {
  const key = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  season.hidden = !(key >= season.dataset.seasonFrom && key <= season.dataset.seasonTo);
}
