import { groups, puzzles } from '../data/content.json';
import { match, valid, matchAlternate, MAX_MISSES, tierLabel, tierClass, mistakesText, dailyValidator, solvedValidator, isArabicTerm, type Alternate, type Progress, type DailyResult } from './engine';
import { byId, read, write, forget, shuffle, hash, esc, cleanSeed, copy, announce, withHonorifics, pulseCorrect } from './utils';
import { track } from './counter';
import { renderSessionEnd } from './session-end';
import { DAILY_EPOCH, dayNumber, localDateKey, updateStreak, isStreak, dailyReminderIcs } from './daily';
import { dailyItem, dailyShare, DAILY_NAME, DAILY_HOST, type Board } from './daily-bank';
import learning from '../data/learning.json';
import '../styles/game.css';

type AnyBoard = Board & { alternates?: Alternate[] };
type Mode = 'daily' | 'practice';
interface Game { board: AnyBoard; state: Progress; done: boolean }

const params = new URLSearchParams(location.search);
const today = dayNumber(new Date());
const todayKey = localDateKey(new Date());
const dateFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const epochDate = (() => { const [y, m, d] = DAILY_EPOCH.split('-').map(Number) as [number, number, number]; return longDate.format(new Date(y, m - 1, d)); })();

const groupOf = (id: string) => groups.find(g => g.id === id)!;
const fresh = (b: AnyBoard, seed = b.id): Progress => ({ puzzle: b.id, solved: [], hints: [], misses: 0, seed, revealed: false });
const wrapTerm = (term: string) => isArabicTerm(term) ? `<span lang="ar" dir="rtl" class="ar-term">${esc(term)}</span>` : esc(term);
const html = (text: string) => withHonorifics(esc(text));

let solvedBoards: string[] = read<string[]>('solved', solvedValidator(puzzles)) ?? [];
function markSolved(id: string) { if (solvedBoards.includes(id)) return; solvedBoards = [...solvedBoards, id]; write('solved', solvedBoards); renderPills(); }

const games: { daily?: Game; practice?: Game } = {};
let mode: Mode = !params.has('puzzle') && today > 0 ? 'daily' : 'practice';
let game: Game;
let selected: string[] = [];

function initPractice(): Game {
  const stored = read<Progress>('progress', (v): v is Progress => valid(v, puzzles));
  const requested = puzzles.find(p => p.id === params.get('puzzle'));
  const board = (requested || puzzles.find(p => p.id === stored?.puzzle) || puzzles[0]!) as AnyBoard;
  const state = stored?.puzzle === board.id && !params.has('seed') ? stored : fresh(board, cleanSeed(params.get('seed')) || board.id);
  byId<HTMLInputElement>('remember').checked = !!stored;
  return { board, state, done: state.solved.length === 4 || state.revealed };
}
function initDaily(): Game | null {
  const board = dailyItem(today) as AnyBoard | undefined;
  if (!board) return null;
  const saved = read('daily', dailyValidator(puzzles));
  if (saved && saved.n === today && saved.result.board === board.id) {
    const r = saved.result;
    return { board, state: { puzzle: board.id, solved: r.solved, hints: [], misses: r.misses, seed: `daily-${today}`, revealed: r.lost }, done: true };
  }
  return { board, state: fresh(board, `daily-${today}`), done: false };
}

const current = () => groups.filter(g => game.board.groups.includes(g.id));
const remaining = () => current().filter(g => !game.state.solved.includes(g.id));
const itemId = () => mode === 'daily' ? `daily-${today}` : game.board.id;
const finished = () => game.state.solved.length === 4 || game.state.revealed;

function persist() {
  if (mode !== 'practice') return;
  if (byId<HTMLInputElement>('remember').checked && !write('progress', game.state)) announce('Storage unavailable. You can keep playing for this visit.');
}

function streakLine() {
  const el = byId('streak-line');
  const s = read('streak', isStreak);
  el.textContent = byId<HTMLInputElement>('streak-opt').checked ? (s ? `Streak: ${s.count} ${s.count === 1 ? 'day' : 'days'} (best ${s.best})` : 'Streak: finish today’s board to start one.') : '';
}

function resultCard() {
  const card = byId('result-card');
  if (mode !== 'daily' || !game.done) { card.replaceChildren(); return; }
  const lost = game.state.revealed && game.state.solved.length < 4;
  const order = game.state.solved.map(id => groupOf(id));
  const missed = game.board.groups.filter(id => !game.state.solved.includes(id)).map(id => groupOf(id));
  card.innerHTML = `<section class="result-card" aria-label="Daily result"><h3>Daily #${today} result</h3><p class="result-line"><strong>${lost ? 'Out of mistakes' : 'Solved'}</strong> · ${esc(mistakesText(game.state.misses))} of ${MAX_MISSES} allowed</p>`
    + (order.length ? `<p class="label">Solved order</p><ol class="result-order">${order.map(g => `<li>${html(g.title)} <span class="tier-chip ${tierClass(g.tier)}">${esc(tierLabel(g.tier))}</span></li>`).join('')}</ol>` : '<p class="muted">No group was found before the board ended.</p>')
    + (missed.length ? `<p class="label">Not found</p><ul class="result-order">${missed.map(g => `<li>${html(g.title)} <span class="tier-chip ${tierClass(g.tier)}">${esc(tierLabel(g.tier))}</span></li>`).join('')}</ul>` : '')
    + '</section>';
}

function complete() {
  if (game.done) return;
  game.done = true;
  const won = game.state.solved.length === 4;
  if (mode === 'daily') {
    const result: DailyResult = { board: game.board.id, solved: [...game.state.solved], misses: game.state.misses, lost: !won };
    write('daily', { n: today, result });
    if (byId<HTMLInputElement>('streak-opt').checked) write('streak', updateStreak(read('streak', isStreak), todayKey));
    streakLine();
  }
  track('activity_completed', itemId());
  if (won) markSolved(game.board.id);
}

function render(message = 'Choose four terms, then check the group.') {
  const { board, state } = game;
  const daily = mode === 'daily';
  const done = finished();
  byId('board-title').textContent = daily ? `Daily #${today} · ${board.title}` : `Board ${board.number} · ${board.title}`;
  byId('progress').textContent = `${state.solved.length} of 4 groups${state.revealed ? ' · revealed' : ''}`;
  const found = [...state.solved.map(groupOf), ...(state.revealed ? remaining() : [])];
  byId('solved').innerHTML = found.map(g => {
    const wasFound = state.solved.includes(g.id);
    return `<div class="solved-row ${tierClass(g.tier)}"><span class="tier-chip ${tierClass(g.tier)}">${esc(tierLabel(g.tier))}${wasFound ? '' : ' · revealed'}</span><strong>${html(g.title)}</strong><span>${g.terms.map(wrapTerm).join(' · ')}</span></div>`;
  }).join('');
  const terms = done ? [] : shuffle(remaining().flatMap(g => g.terms), hash(state.seed));
  byId('tiles').innerHTML = terms.map(term => `<button class="term-tile${isArabicTerm(term) ? ' ar-tile' : ''}"${isArabicTerm(term) ? ' lang="ar" dir="rtl"' : ''} aria-pressed="${selected.includes(term)}" data-term="${esc(term)}" ${selected.length === 4 && !selected.includes(term) ? 'disabled' : ''}>${esc(term)}</button>`).join('');
  byId('tiles').querySelectorAll<HTMLButtonElement>('[data-term]').forEach(b => b.onclick = () => {
    const term = b.dataset.term!;
    selected = selected.includes(term) ? selected.filter(t => t !== term) : [...selected, term];
    render(`${selected.length} of 4 terms selected.`);
    [...byId('tiles').querySelectorAll<HTMLButtonElement>('button')].find(el => el.dataset.term === term)?.focus({ preventScroll: true });
  });
  byId('feedback').textContent = done ? (state.revealed ? (daily && state.solved.length < 4 && state.misses >= MAX_MISSES ? 'Out of mistakes. The groups are revealed below; read their explanations.' : 'Groups revealed. Read the explanations below.') : 'All four groups found. Explore the source readings below.') : message;
  byId('stats').textContent = daily ? `Mistakes: ${state.misses} of ${MAX_MISSES} · ${Math.max(0, MAX_MISSES - state.misses)} left` : `${state.misses} ${state.misses === 1 ? 'miss' : 'misses'} · ${state.hints.length} hinted ${state.hints.length === 1 ? 'group' : 'groups'}`;
  for (const id of ['submit', 'hint', 'reveal', 'shuffle', 'deselect']) byId<HTMLButtonElement>(id).disabled = done || (id === 'submit' && selected.length !== 4);
  byId('hint').hidden = daily;
  byId('reveal').textContent = daily ? 'Give up and reveal' : 'Reveal all groups';
  byId('share').hidden = daily;
  byId('explanations').innerHTML = (found.map(g => `<article class="panel bottom-gap"><div class="panel-head"><h2>${html(g.title)}</h2><span class="tier-chip ${tierClass(g.tier)}">${esc(tierLabel(g.tier))}</span></div><div class="panel-body"><p>${html(g.note)}</p>${g.passages.map(p => `<details class="reading-source"><summary>Quran ${esc(p.ref)} · Arabic and Pickthall</summary><p class="arabic" dir="rtl" lang="ar">${esc(p.arabic)}</p><blockquote class="source-quote">${esc(p.translation)}</blockquote><a href="${esc(p.translationUrl)}" target="_blank" rel="noopener noreferrer">Read context ↗</a></details>`).join('')}</div></article>`).join(''));
  resultCard();
  if (done) {
    const refs = found.flatMap(g => g.passages.map(p => p.ref));
    const next = learning.related[0]!;
    const won = state.solved.length === 4;
    const base = { learned: ['Read each group’s explanation and cited reading above, then compare them in context.', `References: ${refs.join(', ')}.`], itemId: itemId(), next: { name: next.name, url: next.url } };
    if (daily) renderSessionEnd(byId('session-end'), { ...base, result: won ? `Board solved: 4 of 4 groups, ${mistakesText(state.misses)}.` : `Out of mistakes: ${state.solved.length} of 4 groups found, ${mistakesText(state.misses)}.`, shareText: dailyShare(today, state.solved.length, state.misses), tomorrow: 'A new board opens at midnight, your local time.' });
    else renderSessionEnd(byId('session-end'), { ...base, result: state.revealed ? `Groups revealed: ${state.solved.length} of 4 found first, ${state.solved.length + state.misses} checks.` : `Board solved: 4 of 4 groups, ${4 + state.misses} checks.`, shareText: `I ${state.revealed ? 'explored' : 'solved'} a Word Groups board. ${location.origin}/` });
  } else byId('session-end').replaceChildren();
}

byId('submit').onclick = () => {
  if (finished()) return;
  track('activity_started', itemId());
  const alt = matchAlternate(selected, game.board.alternates);
  if (alt) { selected = []; render(`${alt.note} That is not counted as a mistake, so keep looking for this board’s groups.`); return; }
  const result = match(selected, remaining());
  if (result.group) {
    game.state.solved.push(result.group);
    selected = [];
    if (game.state.solved.length === 4) complete();
    persist();
    render('Group found. Try the remaining terms.');
    const rows = byId('solved').querySelectorAll<HTMLElement>('.solved-row');
    const last = rows[game.state.solved.length - 1];
    if (last) pulseCorrect(last);
    return;
  }
  game.state.misses++;
  const left = MAX_MISSES - game.state.misses;
  if (mode === 'daily' && left <= 0) { game.state.revealed = true; selected = []; complete(); render(); return; }
  persist();
  const base = result.near ? 'One away. Three selected terms share an intended group.' : 'That is not one of the intended groups. Try another connection.';
  render(mode === 'daily' ? `${base} ${left} ${left === 1 ? 'mistake' : 'mistakes'} left.` : base);
};
byId('deselect').onclick = () => { selected = []; render(); };
byId('shuffle').onclick = () => { game.state.seed = Math.random().toString(36).slice(2, 12); persist(); render('Tiles shuffled. Your selected terms are kept.'); };
byId('hint').onclick = () => {
  track('activity_started', itemId());
  const group = remaining().find(g => !game.state.hints.includes(g.id)) || remaining()[0];
  if (!group) return;
  if (!game.state.hints.includes(group.id)) game.state.hints.push(group.id);
  persist();
  render(`Hint: look for “${group.title}”. One term is “${group.terms[0]}”.`);
};
byId('reveal').onclick = () => { track('activity_started', itemId()); game.state.revealed = true; selected = []; complete(); persist(); render(); };
byId('print-board').onclick = () => window.print();
byId('restart').onclick = () => { game.state = fresh(game.board); game.done = false; selected = []; forget('progress'); persist(); render(); };
byId('remember').onchange = () => { if (byId<HTMLInputElement>('remember').checked) persist(); else forget('progress'); };
function open(id: string) { const url = new URL(location.pathname, location.origin); url.searchParams.set('puzzle', id); location.assign(url.href); }
byId('new-board').onclick = () => open(puzzles[(puzzles.findIndex(p => p.id === game.board.id) + 1) % puzzles.length]!.id);
byId('share').onclick = () => { track('share_clicked', game.board.id); const u = new URL(location.pathname, location.origin); u.searchParams.set('puzzle', game.board.id); u.searchParams.set('seed', game.state.seed); copy(`Word Groups · board ${game.board.number}\n${u.href}`); };

function renderPills() {
  const grid = byId('pills');
  grid.innerHTML = puzzles.map(p => {
    const solved = solvedBoards.includes(p.id);
    const isCurrent = mode === 'practice' && game?.board.id === p.id;
    return `<button type="button" class="board-pill${solved ? ' is-solved' : ''}" data-board="${esc(p.id)}"${isCurrent ? ' aria-current="true"' : ''} title="Board ${p.number} · ${esc(p.title)} · ${esc(p.level)}${solved ? ' · solved' : ''}" aria-label="Board ${p.number}, ${esc(p.title)}, ${esc(p.level)}${solved ? ', solved' : ', not solved yet'}"><span class="pill-n">${p.number}</span><span class="pill-state" aria-hidden="true">${solved ? '✓ solved' : ''}</span></button>`;
  }).join('');
  grid.querySelectorAll<HTMLButtonElement>('[data-board]').forEach(b => b.onclick = () => open(b.dataset.board!));
  byId('picker-summary').textContent = `Choose a board · ${solvedBoards.length} of ${puzzles.length} solved`;
}

function setMode(next: Mode) {
  mode = next;
  const daily = next === 'daily';
  for (const m of ['daily', 'practice'] as const) {
    const tab = byId<HTMLButtonElement>(`tab-${m}`);
    tab.setAttribute('aria-selected', String(m === next));
    tab.tabIndex = m === next ? 0 : -1;
  }
  const tabpanel = byId('game');
  tabpanel.setAttribute('aria-labelledby', `tab-${next}`);
  byId('practice-controls').hidden = daily;
  byId('daily-extras').hidden = !daily || today < 1;
  byId('reminder').hidden = !daily || today < 1;
  const waiting = daily && today < 1;
  byId('daily-wait').hidden = !waiting;
  byId('daily-wait').textContent = `The first daily puzzle opens on ${epochDate}.`;
  tabpanel.hidden = waiting;
  byId('mode-title').textContent = daily ? (today > 0 ? `Daily #${today}` : 'Daily board') : 'Practice';
  byId('mode-sub').textContent = daily ? (today > 0 ? dateFormat.format(new Date()) : '') : 'Any board, any time, no mistake limit.';
  if (waiting) return;
  game = (games[next] ??= (daily ? initDaily() : initPractice())!);
  selected = [];
  renderPills();
  render();
  streakLine();
}

byId<HTMLInputElement>('streak-opt').checked = read<{ on: boolean }>('streak-opt', (v): v is { on: boolean } => !!v && (v as { on?: unknown }).on === true) !== null;
byId<HTMLInputElement>('streak-opt').onchange = () => { const on = byId<HTMLInputElement>('streak-opt').checked; if (on) { write('streak-opt', { on: true }); if (games.daily?.done) write('streak', updateStreak(read('streak', isStreak), todayKey)); } else { forget('streak-opt'); forget('streak'); } streakLine(); };

byId('remind-btn').onclick = () => {
  const time = byId<HTMLInputElement>('remind-time').value || '20:00';
  const ics = dailyReminderIcs({ name: DAILY_NAME, host: DAILY_HOST, time, now: new Date() });
  if (!ics) { announce('Choose a valid time first.'); return; }
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'word-groups-daily.ics';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Reminder file downloaded.');
};

const tabs = ['daily', 'practice'] as const;
tabs.forEach((m, i) => {
  const tab = byId(`tab-${m}`);
  tab.onclick = () => setMode(m);
  tab.onkeydown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]!;
    setMode(n);
    byId(`tab-${n}`).focus();
  };
});

renderPills();
setMode(mode);
