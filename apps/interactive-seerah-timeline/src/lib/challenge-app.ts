import { events, packs } from '../data/content.json';
import { grade, valid, initialProgress, randomSeed, move, type Progress } from './challenge';
import { importSaved } from './merge-import';
import { byId, read, write, forget, cleanSeed, challengeUrl, esc, withHonorifics, copy, announce } from './utils';
import '../styles/challenge.css';

importSaved();
const KEY = 'challenge-progress';
const params = new URLSearchParams(location.search);
const stored = read<Progress>(KEY, (v): v is Progress => valid(v, packs));
const pack = packs.find(p => p.id === params.get('pack')) || packs.find(p => p.id === stored?.pack) || packs[0]!;
const seedParam = cleanSeed(params.get('seed'));
let state: Progress = stored?.pack === pack.id && !seedParam ? stored : initialProgress(pack, seedParam || randomSeed());
const openClues = new Set<string>();
const event = (id: string) => events.find(e => e.id === id)!;
const links = (e: ReturnType<typeof event>) => e.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join(' · ');

byId<HTMLSelectElement>('pack-select').value = pack.id;
byId<HTMLInputElement>('remember').checked = !!stored;

function persist() {
  if (byId<HTMLInputElement>('remember').checked && !write(KEY, state)) announce('Browser storage unavailable. You can continue for this visit.');
}

function render(message = 'Arrange from earliest to latest, then check your order.', focus?: { id: string; delta: string }) {
  const done = state.complete || state.revealed;
  byId('challenge-title').textContent = `Challenge ${pack.number} · ${pack.title}`;
  byId('order').innerHTML = state.order.map((id, i) => {
    const e = event(id), clue = `clue-${id}`, open = openClues.has(id);
    return `<li><div class="event-card"><div class="spread"><span class="eyebrow">Position ${i + 1}</span><div class="actions"><button type="button" class="icon-button" data-id="${id}" data-delta="-1" aria-label="Move ${esc(e.title)} up" ${i === 0 || done ? 'disabled' : ''}>↑</button><button type="button" class="icon-button" data-id="${id}" data-delta="1" aria-label="Move ${esc(e.title)} down" ${i === state.order.length - 1 || done ? 'disabled' : ''}>↓</button></div></div><h3>${withHonorifics(esc(e.title))}</h3><button type="button" class="text-button clue-toggle" data-clue="${id}" aria-expanded="${open}" aria-controls="${clue}">Open source clue</button><div class="clue" id="${clue}" ${open ? '' : 'hidden'}><p>${withHonorifics(esc(e.summary))}</p><p>${links(e)}</p></div></div></li>`;
  }).join('');
  byId('feedback').textContent = done ? (state.complete ? 'Sequence matched. Read the dates and sources below.' : 'Sequence revealed. Follow the sources below.') : message;
  byId('stats').textContent = `${state.tries} checks · ${state.hint || state.revealed ? 'assisted' : 'unassisted'}`;
  for (const id of ['check', 'hint', 'reveal']) byId<HTMLButtonElement>(id).disabled = done;
  byId('answer').innerHTML = done
    ? `<div class="section-title"><h2>The sourced sequence</h2></div><ol class="answer-timeline">${pack.events.map(id => { const e = event(id); return `<li class="panel panel-body"><span class="eyebrow">${esc(e.date)}</span><h3>${withHonorifics(esc(e.title))}</h3><p>${withHonorifics(esc(e.summary))}</p><p class="micro">Date/source note: ${withHonorifics(esc(e.uncertainty))}</p><p>${links(e)}</p><p><a href="/event/${id}/">Read this event <span aria-hidden="true">→</span></a></p></li>`; }).join('')}</ol><p class="micro">A matched order reflects this activity’s broad chronology, not a score of religious merit or an exact calendar reconstruction.</p>`
    : '';
  if (focus) {
    const list = [...byId('order').querySelectorAll<HTMLButtonElement>('button[data-delta]')].filter(b => b.dataset.id === focus.id && !b.disabled);
    (list.find(b => b.dataset.delta === focus.delta) || list[0])?.focus({ preventScroll: true });
  }
}

byId('order').addEventListener('click', ev => {
  const target = (ev.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!target) return;
  if (target.dataset.clue) {
    const id = target.dataset.clue, open = target.getAttribute('aria-expanded') !== 'true';
    if (open) openClues.add(id); else openClues.delete(id);
    target.setAttribute('aria-expanded', String(open));
    byId(`clue-${id}`).hidden = !open;
    return;
  }
  if (!target.dataset.delta || target.disabled || state.complete || state.revealed) return;
  const id = target.dataset.id!;
  state.order = move(state.order, state.order.indexOf(id), Number(target.dataset.delta));
  persist();
  render(`Moved to position ${state.order.indexOf(id) + 1}. Check the order when ready.`, { id, delta: target.dataset.delta });
});

byId('check').onclick = () => {
  state.tries++;
  const result = grade(state.order, pack.events);
  state.complete = result.correct;
  persist();
  render(result.correct ? '' : `${result.positions.filter(Boolean).length} of ${pack.events.length} cards are in the intended positions. Try changing the order.`);
};
byId('hint').onclick = () => { state.hint = true; persist(); render('Earliest event: ' + event(pack.events[0]!).title); };
byId('reveal').onclick = () => { state.revealed = true; persist(); render(); };
byId('restart').onclick = () => { state = initialProgress(pack, randomSeed()); openClues.clear(); forget(KEY); persist(); render('New order. Arrange from earliest to latest.'); };
byId('remember').onchange = () => { if (byId<HTMLInputElement>('remember').checked) persist(); else forget(KEY); };
function openPack(id: string) { const u = new URL(location.pathname, location.origin); u.searchParams.set('pack', id); location.assign(u.href); }
byId('pack-select').onchange = () => openPack(byId<HTMLSelectElement>('pack-select').value);
byId('next-pack').onclick = () => openPack(packs[(packs.findIndex(p => p.id === pack.id) + 1) % packs.length]!.id);
byId('share').onclick = () => copy(`Which came first? · challenge ${pack.number}\n${challengeUrl({ pack: pack.id, seed: state.seed })}`);
render();
