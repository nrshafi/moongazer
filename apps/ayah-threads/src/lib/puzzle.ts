import data from '../data/content.json';
import { byId, read, write, forget, esc, shuffle, hash, challengeUrl, focusHeading, announce, pulseCorrect } from './utils';
import { known, validPuzzleState as valid, type PuzzleState } from './state';
import { track } from './counter';
import { renderSessionEnd } from './session-end';
import { DAILY_EPOCH, dayNumber, localDateKey, updateStreak, isStreak, dailyReminderIcs } from './daily';
import { dailyItem, isDailyRecord, dailyShareText, streakLine, APP_NAME, APP_HOST, type DailyResult } from './daily-bank';
import learning from '../data/learning.json';
import './puzzle.css';

type State = PuzzleState;
type Mode = 'daily' | 'practice';
type Puzzle = (typeof data.puzzles)[number];

const isBool = (v: unknown): v is boolean => typeof v === 'boolean';
const remember = byId<HTMLInputElement>('remember');
remember.checked = read('remember', isBool) === true;
const streakOn = byId<HTMLInputElement>('streak-on');
streakOn.checked = read('streak-on', isBool) === true;

// URLs and share text carry the puzzle number: the id is the answer theme (for example `patience`). Old id links still open.
const rawQuery = new URLSearchParams(location.search).get('puzzle');
const query = data.puzzles.find(p => String(p.number) === rawQuery)?.id ?? rawQuery;
const numberOf = (id: string) => String(data.puzzles.find(p => p.id === id)!.number);
const byPuzzleId = (id: string) => data.puzzles.find(p => p.id === id)!;
const fresh = (id: string): State => ({ id, wrong: [], hint: false, solved: false, revealed: false, completed: [] });

/** The visitor's local clock: today's puzzle number (0 before the epoch) and local date key. */
const clock = () => { const date = new Date(); return { n: dayNumber(date), key: localDateKey(date), date }; };

let state = remember.checked ? read('puzzle', valid) || fresh(data.puzzles[0]!.id) : fresh(data.puzzles[0]!.id);
// Reloading the selected puzzle's own URL must keep its opted-in progress.
if (known(query) && query !== state.id) state = { ...fresh(query!), completed: state.completed };

// Daily state: the puzzle for today's number, and what the visitor has done with it this visit (or saved earlier today).
let dailyN = 0;
let dstate: State | null = null;
let mode: Mode = !known(query) && clock().n > 0 ? 'daily' : 'practice';

const stage = byId('puzzle-stage');
const picker = byId<HTMLSelectElement>('puzzle-picker');
const showArabic = byId<HTMLInputElement>('show-arabic');
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab][data-mode]')];

function persist() { if (remember.checked && !write('puzzle', state)) announce('Storage is unavailable. You can keep playing.'); }

function epochLabel() {
  const [y, m, d] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Loads today's daily puzzle (and any result saved earlier today) into `dstate`. */
function loadDaily() {
  const { n } = clock();
  const puzzle = dailyItem(n);
  if (!puzzle) { dailyN = 0; dstate = null; return; }
  if (dstate && dailyN === n) return;
  dailyN = n;
  dstate = fresh(puzzle.id);
  const saved = read('daily', isDailyRecord);
  if (saved && saved.n === n) {
    dstate = { id: puzzle.id, wrong: [...saved.result.wrong], hint: saved.result.hint, solved: saved.result.outcome === 'solved', revealed: saved.result.outcome === 'revealed', completed: [] };
  }
}

/** Id of today's daily puzzle when its result is saved (so the compact picker can tick it too). */
function dailyDoneId(): string | null {
  const { n } = clock();
  const saved = read('daily', isDailyRecord);
  const puzzle = dailyItem(n);
  return saved && puzzle && saved.n === n ? puzzle.id : null;
}

function paintMode() {
  for (const tab of tabs) {
    const on = tab.dataset.mode === mode;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on) byId('puzzle-panel').setAttribute('aria-labelledby', tab.id);
  }
  document.querySelectorAll<HTMLElement>('[data-for]').forEach(el => { el.hidden = el.dataset.for !== mode; });
  byId('reminder').hidden = mode !== 'daily';
}

function paintStreak() {
  const line = byId('streak-line');
  line.hidden = mode !== 'daily' || !streakOn.checked;
  if (!line.hidden) line.textContent = streakLine(read('streak', isStreak), clock().key);
}

function finishDaily(outcome: DailyResult['outcome']) {
  const st = dstate!;
  const result: DailyResult = { outcome, hint: st.hint, wrong: [...st.wrong] };
  let saved = write('daily', { n: dailyN, result });
  if (outcome === 'solved' && streakOn.checked) saved = write('streak', updateStreak(read('streak', isStreak), localDateKey(new Date()))) && saved;
  if (!saved) announce('Storage is unavailable. You can keep playing; this result and any streak are not saved.');
  if (!state.completed.includes(st.id)) state.completed.push(st.id);
  persist();
}

function render() {
  paintMode();
  if (mode === 'daily') loadDaily();
  const puzzle: Puzzle | null = mode === 'daily' ? (dstate ? byPuzzleId(dstate.id) : null) : byPuzzleId(state.id);
  const st = mode === 'daily' ? dstate : state;

  // The compact picker: solved puzzles show their title and a tick.
  const practiceDone = new Set(state.completed);
  if (state.solved || state.revealed) practiceDone.add(state.id);
  const dailyDone = dailyDoneId();
  if (dailyDone) practiceDone.add(dailyDone);
  Array.from(picker.options).forEach(o => {
    const p = byPuzzleId(o.value);
    o.textContent = `Puzzle ${String(p.number).padStart(2, '0')}${practiceDone.has(o.value) ? ` · ${p.theme} ✓ Solved` : ''}`;
  });
  picker.value = state.id;
  byId('progress-note').textContent = `${practiceDone.size} of ${data.puzzles.length} solved${remember.checked ? ' on this browser' : ''}`;

  const dateEl = byId('puzzle-date');
  if (!puzzle || !st) {
    // Before the epoch: one line, no puzzle.
    byId('puzzle-label').textContent = 'Daily puzzle';
    dateEl.hidden = true;
    stage.innerHTML = `<p class="notice">The first daily puzzle opens on ${esc(epochLabel())}.</p><div class="actions top-gap"><button class="button ghost small" id="go-practice" type="button">Try Practice</button></div>`;
    document.getElementById('go-practice')?.addEventListener('click', () => setMode('practice'));
    paintStreak();
    return;
  }
  if (mode === 'daily') {
    byId('puzzle-label').textContent = `Daily puzzle #${dailyN}`;
    dateEl.hidden = false;
    dateEl.textContent = clock().date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } else {
    byId('puzzle-label').textContent = `Puzzle ${String(puzzle.number).padStart(2, '0')} of ${data.puzzles.length}`;
    dateEl.hidden = true;
  }
  paintStreak();

  const done = st.solved || st.revealed;
  const itemId = mode === 'daily' ? `daily-${dailyN}` : puzzle.id;
  const show = showArabic.checked;
  stage.innerHTML = `<div class="passage-stack">${puzzle.passages.map((passage, i) => `<article class="passage-card"><div class="spread"><span class="passage-index">${String.fromCharCode(65 + i)}</span><a class="citation" href="${esc(passage.url)}" target="_blank" rel="noopener noreferrer">Quran ${esc(passage.ref)} ↗</a></div>${show ? `<p class="arabic" lang="ar" dir="rtl">${esc(passage.arabic)}</p>` : ''}<p class="passage-translation">${esc(passage.translation)}</p><span class="micro">Marmaduke Pickthall</span></article>`).join('')}</div><div class="connection-join" aria-hidden="true"><span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 8a4 4 0 0 1 6-3l3 3a4 4 0 0 1-2 7M16 16a4 4 0 0 1-6 3l-3-3a4 4 0 0 1 2-7M9 9l6 6"/></svg><span></span></div><h2 class="theme-question">What connects these passages?</h2><div class="theme-options">${shuffle([puzzle.theme, ...puzzle.distractors], hash(puzzle.id)).map(label => `<button class="theme-option ${done && label === puzzle.theme ? 'correct' : ''} ${st.wrong.includes(label) ? 'incorrect' : ''}" data-theme="${esc(label)}" ${done || st.wrong.includes(label) ? 'disabled' : ''}>${esc(label)} ${done && label === puzzle.theme ? '<span aria-hidden="true">✓</span>' : ''}</button>`).join('')}</div><div class="actions top-gap">${!done ? `<button class="button ghost small" id="puzzle-hint" ${st.hint ? 'disabled' : ''}>${st.hint ? 'Hint revealed' : 'A little hint'}</button><button class="button ghost small" id="reveal-theme">Reveal the connection</button>` : ''}</div>${st.hint && !done ? `<div class="notice top-gap">${esc(puzzle.hint)}</div>` : ''}${st.wrong.length && !done ? '<p class="micro top-gap" role="status">That is not the intended connection for this set. Look again, or use the hint.</p>' : ''}${done ? `<div class="feedback positive"><span class="eyebrow">The intended connection</span><h2 class="editorial">${esc(puzzle.theme)}</h2><p>${esc(puzzle.explanation)}</p><p class="micro">This is an editorial comparison of the retrieved passages, not a scholarly ruling. The complete ayahs and their contexts may support other observations.</p><a class="citation" href="${esc(puzzle.commentaryUrl)}" target="_blank" rel="noopener noreferrer">Read Al-Tafsir al-Muyassar for ${esc(puzzle.anchor)} ↗</a><p class="top-gap"><a class="citation" href="/themes/${esc(puzzle.id)}/">Read this thread in the theme library <span aria-hidden="true">→</span></a> <span class="micro">· <a href="/themes/">All threads</a></span></p><div class="actions top-gap">${mode === 'daily' ? '<button class="button" id="go-practice" type="button">Practice more puzzles →</button>' : '<button class="button" id="next-puzzle">Next puzzle →</button>'}</div></div><div id="session-end"></div>` : ''}`;

  stage.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach(button => button.addEventListener('click', () => {
    const label = button.dataset.theme!;
    track('activity_started', itemId);
    const hit = label === puzzle.theme;
    if (hit) { st.solved = true; if (mode === 'daily') finishDaily('solved'); else complete(); track('activity_completed', itemId); }
    else if (!st.wrong.includes(label)) st.wrong.push(label);
    if (mode === 'practice') persist();
    render();
    if (hit) { const c = stage.querySelector<HTMLElement>('.theme-option.correct'); if (c) pulseCorrect(c); }
  }));
  document.getElementById('puzzle-hint')?.addEventListener('click', () => { track('activity_started', itemId); st.hint = true; if (mode === 'practice') persist(); render(); });
  document.getElementById('reveal-theme')?.addEventListener('click', () => {
    track('activity_started', itemId); st.revealed = true;
    if (mode === 'daily') finishDaily('revealed'); else complete();
    track('activity_completed', itemId); if (mode === 'practice') persist(); render();
  });
  document.getElementById('next-puzzle')?.addEventListener('click', () => open(data.puzzles[puzzle.number % data.puzzles.length]!.id));
  document.getElementById('go-practice')?.addEventListener('click', () => setMode('practice'));

  if (done) {
    const next = learning.related[0]!;
    const learned = ['A passage can fit more than one theme; the intended theme is one editorial reading.', `Use the explanation as a prompt, then read the surrounding passage (${puzzle.anchor}).`];
    if (mode === 'daily') {
      const result: DailyResult = { outcome: st.revealed ? 'revealed' : 'solved', hint: st.hint, wrong: [...st.wrong] };
      renderSessionEnd(byId('session-end'), { result: result.outcome === 'revealed' ? `Daily #${dailyN}: connection explored.` : `Daily #${dailyN}: connection found${st.hint ? ' with a hint' : ''}.`, learned, shareText: dailyShareText(dailyN, result), itemId, next: { name: next.name, url: next.url }, tomorrow: 'A new puzzle opens at midnight, your local time.' });
    } else {
      renderSessionEnd(byId('session-end'), { result: st.revealed ? `Puzzle ${puzzle.number}: connection explored.` : `Puzzle ${puzzle.number}: connection found${st.hint ? ' with a hint' : ''}.`, learned, shareText: `Three passages, one connection. Try this ${APP_NAME} puzzle: ${challengeUrl({ puzzle: String(puzzle.number) })}`, itemId, next: { name: next.name, url: next.url } });
    }
  }
}

function complete() { if (!state.completed.includes(state.id)) state.completed.push(state.id); }
function open(id: string) { state = { ...fresh(id), completed: state.completed }; history.replaceState(null, '', challengeUrl({ puzzle: numberOf(id) })); persist(); render(); focusHeading(stage); }

function setMode(next: Mode, focusTab = false) {
  if (next === mode) { if (focusTab) tabs.find(t => t.dataset.mode === next)?.focus(); return; }
  mode = next;
  if (mode === 'daily') history.replaceState(null, '', location.pathname);
  else history.replaceState(null, '', challengeUrl({ puzzle: numberOf(state.id) }));
  render();
  if (focusTab) tabs.find(t => t.dataset.mode === next)?.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode as Mode));
  tab.addEventListener('keydown', e => {
    const key = e.key;
    const to = key === 'ArrowRight' ? (i + 1) % tabs.length : key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : key === 'Home' ? 0 : key === 'End' ? tabs.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setMode(tabs[to]!.dataset.mode as Mode, true);
  });
});

picker.addEventListener('change', () => open(picker.value));
byId('random-puzzle').addEventListener('click', () => { const other = data.puzzles.filter(p => p.id !== state.id); open(other[Math.floor(Math.random() * other.length)]!.id); });
showArabic.addEventListener('change', render);
remember.addEventListener('change', () => { if (remember.checked) { write('remember', true); persist(); } else { forget('remember'); forget('puzzle'); } });
streakOn.addEventListener('change', () => {
  if (streakOn.checked) { if (!write('streak-on', true)) announce('Storage is unavailable, so no streak can be kept on this device.'); }
  else { forget('streak-on'); forget('streak'); }
  paintStreak();
});

// T6.7: "Remind me daily". A calendar file built in the browser; no permission, no request.
byId('reminder-download').addEventListener('click', () => {
  const time = byId<HTMLInputElement>('reminder-time').value || '20:00';
  const ics = dailyReminderIcs({ name: APP_NAME, host: APP_HOST, time, now: new Date() });
  if (!ics) { announce('Choose a time first.'); return; }
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ayah-threads-daily.ics';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Reminder file downloaded. Open it to add it to your calendar.');
});

render();
