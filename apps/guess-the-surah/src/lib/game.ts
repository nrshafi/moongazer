import data from '../data/content.json';
import { byId, read, write, forget, esc, cleanSeed, challengeUrl, focusHeading, announce, pulseCorrect } from './utils';
import { collection, roundIds, options, points, clueVerse, clueLadder, resultLine, meaningSourceLabel, type Pool, type Chapter, type Clue } from './engine';
import { track } from './counter';
import { renderSessionEnd } from './session-end';
import { dailyItem, todayNumber, beforeEpochLine } from './daily-bank';
import { localDateKey, updateStreak, isStreak, shareText, dailyReminderIcs } from './daily';
import { surahsInJuz, DEFAULT_JUZ } from './juz';
import learning from '../data/learning.json';
import './game.css';

const HOST = 'guess-the-surah.moongazer.tech';
const NAME = 'Guess the Surah';
type Mode = 'daily' | 'practice' | 'juz';
type RoundMode = 'practice' | 'juz';
type Result = { answer: number; selected: number; hints: number };
type State = { mode: RoundMode; seed: string; pool: Pool; juz: number; length: number; index: number; hints: number; results: Result[] };
type Daily = { n: number; result: { selected: number; hints: number } };

const pools: Pool[] = ['short', 'all', 'makkah', 'madinah'];
const chapters = data.chapters as Chapter[];
const isBool = (value: unknown): value is boolean => typeof value === 'boolean';
const inRange = (v: unknown, lo: number, hi: number) => Number.isInteger(v) && (v as number) >= lo && (v as number) <= hi;
const validRound = (value: unknown): value is State => {
  if (!value || typeof value !== 'object') return false;
  const v = value as State;
  return (v.mode === 'practice' || v.mode === 'juz') && !!cleanSeed(v.seed) && pools.includes(v.pool) && inRange(v.juz, 1, 30) && [5, 10, 20].includes(v.length)
    && inRange(v.index, 0, v.length) && inRange(v.hints, 1, 4) && Array.isArray(v.results) && v.results.length <= v.length
    && v.results.every(r => r && inRange(r.answer, 1, 114) && inRange(r.selected, 1, 114) && inRange(r.hints, 1, 4)) && v.results.length >= v.index && v.results.length <= v.index + 1;
};
const validDaily = (value: unknown): value is Daily => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Daily;
  return Number.isInteger(v.n) && v.n >= 1 && !!v.result && inRange(v.result.selected, 1, 114) && inRange(v.result.hints, 1, 4);
};
const validFound = (value: unknown): value is number[] => Array.isArray(value) && value.length <= 114 && value.every(n => inRange(n, 1, 114));
const randomSeed = () => Math.random().toString(36).slice(2, 12);

const params = new URLSearchParams(location.search);
const suppliedSeed = cleanSeed(params.get('seed'));
const remembered = read('remember', isBool) === true;
const suppliedJuz = Number(params.get('juz'));
const newRound = (mode: RoundMode, over: Partial<State> = {}): State => ({ mode, seed: randomSeed(), pool: 'short', juz: DEFAULT_JUZ, length: 10, index: 0, hints: 1, results: [], ...over });

const today = new Date();
const dailyN = todayNumber(today);
const rounds: Record<RoundMode, State> = { practice: newRound('practice'), juz: newRound('juz', { pool: 'all' }) };
const challengeMode: RoundMode = params.get('mode') === 'juz' ? 'juz' : 'practice';
if (suppliedSeed) {
  rounds[challengeMode] = newRound(challengeMode, {
    seed: suppliedSeed,
    pool: challengeMode === 'juz' ? 'all' : pools.includes(params.get('pool') as Pool) ? params.get('pool') as Pool : 'short',
    juz: inRange(suppliedJuz, 1, 30) ? suppliedJuz : DEFAULT_JUZ,
    length: [5, 10, 20].includes(Number(params.get('rounds'))) ? Number(params.get('rounds')) : 10,
  });
}
// P7 T7.10: the Ramadan hub links ?mode=juz&juz=N (no seed) to open a fresh round for that juz.
const juzLink = !suppliedSeed && params.get('mode') === 'juz' && inRange(suppliedJuz, 1, 30);
if (juzLink) rounds.juz = newRound('juz', { pool: 'all', juz: suppliedJuz });
let tab: Mode = suppliedSeed ? challengeMode : juzLink ? 'juz' : dailyN >= 1 ? 'daily' : 'practice';

// Round sequences and answer choices per mode. Juz rounds draw from the surahs whose first ayah falls in that juz.
const juzChapters = (juz: number) => { const set = new Set(surahsInJuz(juz)); return chapters.filter(c => set.has(c.number)); };
const ids = (s: State) => s.mode === 'juz' ? roundIds(juzChapters(s.juz), 'all', s.length, `${s.seed}juz${s.juz}`) : roundIds(chapters, s.pool, s.length, s.seed);
const choicePool = (s: State) => { if (s.mode === 'practice') return collection(chapters, s.pool); const j = juzChapters(s.juz); return j.length >= 4 ? j : chapters; };

const saved = remembered && !suppliedSeed ? read('round', validRound) : null;
if (saved) {
  // A stale or edited record must never reference a different answer sequence.
  const expected = ids(saved);
  if (!(saved.results.some((r, i) => r.answer !== expected[i]) || saved.index > expected.length)) rounds[saved.mode] = saved;
}

const stage = byId('game-stage');
const remember = byId<HTMLInputElement>('remember'); remember.checked = remembered;
const poolInput = byId<HTMLSelectElement>('pool');
const juzInput = byId<HTMLSelectElement>('juz');
const lengthInput = byId<HTMLSelectElement>('length');
const arabicFirstInput = byId<HTMLInputElement>('arabic-first');
const streakInput = byId<HTMLInputElement>('streak-opt');
let arabicFirst = read('arabicFirst', isBool) === true; arabicFirstInput.checked = arabicFirst;
let streakOn = read('streakOn', isBool) === true; streakInput.checked = streakOn;
const found = new Set<number>(read('found', validFound) ?? []);

let daily: { hints: number; result: Daily['result'] | null } = { hints: 1, result: null };
if (dailyN >= 1) { const d = read('daily', validDaily); if (d && d.n === dailyN) daily.result = d.result; }

const persist = () => { if (tab !== 'daily' && remember.checked && !write('round', rounds[tab])) announce('Browser storage is unavailable. This round still works.'); };
const markFound = (n: number) => { if (!found.has(n)) { found.add(n); write('found', [...found]); } };
function total(s: State) { return s.results.reduce((sum, r) => sum + points(r.answer === r.selected, r.hints), 0); }

const dateLabel = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const sourceNote = (c: Chapter) => c.nameMeaning ? `<p class="micro name-source">Name meaning: “${esc(c.nameMeaning)}”. Source: ${esc(meaningSourceLabel(c.nameMeaningSource))}.</p>` : '';

function clueHtml(c: Clue, ayah: number) {
  const where = ayah === 1 ? 'opening ayah' : `ayah ${ayah}`;
  if (c.kind === 'translation') return `<p class="opening-translation">${esc(c.text)}</p><span class="micro">Marmaduke Pickthall · ${where}</span>`;
  if (c.kind === 'arabic') return `<p class="arabic" lang="ar" dir="rtl">${esc(c.text)}</p><span class="micro">${where}</span>`;
  return `<p>${esc(c.text)}</p>`;
}

interface Question { chapter: Chapter; hints: number; result: Daily['result'] | null; choices: Chapter[]; seed: string; micro: string; footer: string }
function questionHtml(q: Question) {
  const { chapter, result } = q; const answer = chapter.number;
  const { ayah, ref, verse } = clueVerse(chapters, data.verses, answer);
  const ladder = clueLadder(chapter, { ayah, verse }, arabicFirst);
  const shown = result ? 4 : q.hints;
  const dots = [1, 2, 3, 4].map(n => `<span class="${n <= shown ? 'done' : ''}"></span>`).join('');
  const stack = ladder.slice(0, shown).map((c, i) => `<section class="clue"><span class="clue-index">${i + 1}</span><div><h2>${c.label}</h2>${clueHtml(c, ayah)}</div></section>`).join('');
  const grid = options(q.choices, answer, q.seed).map((s, i) => `<button class="answer-option ${result && s.number === answer ? 'correct' : ''} ${result && s.number === result.selected && s.number !== answer ? 'incorrect' : ''}" data-answer="${s.number}" ${result ? 'disabled' : ''}><span class="answer-letter">${String.fromCharCode(65 + i)}</span> <span>${esc(s.name_simple)} <small lang="ar" dir="rtl">${esc(s.name_arabic)}</small></span>${result && s.number === answer ? '<span class="answer-check">✓</span>' : ''}${result && s.number === result.selected && s.number !== answer ? '<span class="answer-mark">Not this one</span>' : ''}</button>`).join('');
  const feedback = result ? `<div class="feedback ${result.selected === answer ? 'positive' : 'negative'}"><h3>${result.selected === answer ? 'You found it.' : `This one is ${esc(chapter.name_simple)}.`}</h3><p>Chapter ${answer} has ${chapter.verses_count} ayahs. The clue ayah is shown above exactly as retrieved from Quran Foundation.</p>${sourceNote(chapter)}<a class="citation" href="${esc(verse.translationUrl)}" target="_blank" rel="noopener noreferrer">Read ${esc(chapter.name_simple)} ${ref} on Quran.com ↗</a>${q.footer}</div>` : '';
  return `<div class="spread bottom-gap"><span class="overline">Follow the clues</span><span class="step-dots" aria-label="${shown} of 4 clues revealed">${dots}</span></div><div class="clue-stack">${stack}</div>${!result && q.hints < 4 ? `<button class="button ghost clue-button" id="reveal-clue">Reveal another clue <span aria-hidden="true">+</span></button>` : ''}<div class="answer-heading"><h2>Which surah is it?</h2><span class="micro">${q.micro}</span></div><div class="answer-grid">${grid}</div>${feedback}`;
}

function bindQuestion(onReveal: () => void, onAnswer: (selected: number) => void, answer: number) {
  document.getElementById('reveal-clue')?.addEventListener('click', onReveal);
  stage.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(button => button.addEventListener('click', () => {
    onAnswer(Number(button.dataset.answer));
    if (Number(button.dataset.answer) === answer) { const c = stage.querySelector<HTMLElement>('.answer-option.correct'); if (c) pulseCorrect(c); }
    stage.querySelector<HTMLElement>('.feedback')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }));
}

// ---------- Daily ----------
function renderStreak() {
  const line = byId('streak-line');
  if (!streakOn || tab !== 'daily') { line.textContent = ''; return; }
  const s = read('streak', isStreak);
  line.textContent = s ? `Streak: ${s.count} ${s.count === 1 ? 'day' : 'days'} (best ${s.best})` : 'Streak: 0 days. Finish today’s puzzle to start one.';
}
function applyStreak() {
  if (!streakOn) return;
  if (!write('streak', updateStreak(read('streak', isStreak), localDateKey(new Date())))) announce('Browser storage is unavailable. No streak is kept.');
  renderStreak();
}
function downloadReminder(time: string) {
  const ics = dailyReminderIcs({ name: NAME, host: HOST, time, now: new Date() });
  if (!ics) { announce('Choose a time for the reminder first.'); return; }
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a'); a.href = url; a.download = 'guess-the-surah-daily.ics'; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function renderDaily() {
  if (dailyN < 1) {
    byId('round-label').textContent = 'Daily';
    byId('round-subtitle').textContent = 'Practice and Juz are open meanwhile.';
    stage.innerHTML = `<p class="muted before-epoch">${beforeEpochLine()}</p>`;
    return;
  }
  const chapter = dailyItem(dailyN); const answer = chapter.number; const result = daily.result;
  byId('round-label').textContent = `Daily #${dailyN} · ${dateLabel}`;
  byId('round-subtitle').textContent = result ? 'Come back tomorrow for a new surah.' : 'One surah a day. Clues are here to help.';
  const done = result ? `<div id="session-end"></div><div class="reminder" id="reminder"></div>` : '';
  stage.innerHTML = questionHtml({ chapter, hints: daily.hints, result, choices: chapters, seed: `daily-${dailyN}`, micro: result ? 'Answer revealed' : `Clue ${daily.hints} of 4`, footer: '' }) + done;
  bindQuestion(() => { daily.hints++; render(); }, selected => {
    const itemId = `daily-${dailyN}`; track('activity_started', itemId);
    daily.result = { selected, hints: daily.hints }; write('daily', { n: dailyN, result: daily.result } satisfies Daily);
    track('activity_completed', itemId);
    if (selected === answer) markFound(answer);
    applyStreak(); render();
  }, answer);
  if (!result) return;
  const correct = result.selected === answer; const where = chapter.revelation_place === 'makkah' ? 'Makkah' : 'Madinah';
  const next = learning.related[0]!;
  renderSessionEnd(byId('session-end'), {
    result: correct ? `Solved on clue ${result.hints} of 4.` : `Not solved this time. It was ${chapter.name_simple}.`,
    learned: [`${chapter.name_simple} means “${chapter.nameMeaning ?? ''}”, has ${chapter.verses_count} ayahs and is listed as revealed in ${where}.`, 'The Quran.com link above opens the surah to read.'],
    shareText: shareText({ name: NAME, n: dailyN, resultLine: resultLine(correct, result.hints), host: HOST }),
    itemId: `daily-${dailyN}`, next: { name: next.name, url: next.url }, tomorrow: 'A new surah opens at your local midnight.',
  });
  const reminder = byId('reminder');
  reminder.innerHTML = `<label class="field reminder-time">Remind me daily at <input type="time" id="reminder-time" value="20:00" /></label><button class="button secondary small" id="reminder-button" type="button">Remind me daily</button><span class="micro">Saves a calendar file on this device. Nothing is sent anywhere.</span>`;
  byId('reminder-button').addEventListener('click', () => downloadReminder(byId<HTMLInputElement>('reminder-time').value));
}

// ---------- Practice and Juz rounds ----------
function renderRound() {
  const state = rounds[tab as RoundMode]; const sequence = ids(state); const complete = state.index >= sequence.length;
  const juzNote = state.mode === 'juz' ? ` in Juz ${state.juz}` : '';
  byId('round-label').textContent = !sequence.length ? 'No surahs here' : complete ? 'Round complete' : `Surah ${state.index + 1} of ${sequence.length}${juzNote}`;
  byId('score-label').textContent = `${total(state)} points`;
  byId('round-bar').style.width = `${sequence.length ? Math.min(state.index, sequence.length) / sequence.length * 100 : 0}%`;
  byId('round-progress').setAttribute('aria-valuemax', String(sequence.length)); byId('round-progress').setAttribute('aria-valuenow', String(Math.min(state.index, sequence.length)));
  if (!sequence.length) { stage.innerHTML = `<p class="muted">No surah begins in Juz ${state.juz}. Choose another juz.</p>`; return; }
  if (complete) {
    const correct = state.results.filter(r => r.answer === r.selected).length;
    stage.innerHTML = `<div class="round-finish"><span class="pill">A little more learned</span><h2 class="editorial">Every clue was a discovery.</h2><div class="finish-stats"><div><strong>${total(state)}</strong><span>points earned</span></div><div><strong>${correct}/${sequence.length}</strong><span>surahs identified</span></div></div><p class="muted">Explore the references below, or start another round.</p><div class="actions"><button class="button" id="another-round">Play another round</button><button class="button secondary no-print" id="print-round" type="button">Print</button></div></div><div id="session-end"></div><div class="result-list">${state.results.map(r => { const s = chapters.find(s => s.number === r.answer)!; return `<a href="https://quran.com/${s.number}" target="_blank" rel="noopener noreferrer"><span>${r.answer === r.selected ? '✓' : '○'} ${esc(s.name_simple)}</span><span>${points(r.answer === r.selected, r.hints)} pts ↗</span></a>`; }).join('')}</div>`;
    byId('another-round').addEventListener('click', () => start(state.mode));
    byId('print-round').addEventListener('click', () => window.print());
    const next = learning.related[0]!;
    renderSessionEnd(byId('session-end'), { result: `${correct} of ${sequence.length} surahs identified, ${total(state)} points.`, learned: ['Each result above links to the surah on Quran.com.', 'Points reflect how early you answered. They are not a memorization score.'], shareText: `I scored ${total(state)} points in this Guess the Surah round. Try the same clues: ${link(state)}`, itemId: 'round', next: { name: next.name, url: next.url } });
    return;
  }
  const answer = sequence[state.index]!; const chapter = chapters.find(s => s.number === answer)!; const result = state.results[state.index] ?? null;
  const footer = `<div class="actions top-gap"><button class="button" id="next-question">${state.index + 1 === sequence.length ? 'See your round' : 'Next surah'} <span aria-hidden="true">→</span></button><a class="feedback-link" href="#site-feedback" data-open-feedback>Report an error <span aria-hidden="true">→</span></a></div>`;
  stage.innerHTML = questionHtml({ chapter, hints: state.hints, result, choices: choicePool(state), seed: state.seed, micro: result ? 'Answer revealed' : `${points(true, state.hints)} points available`, footer });
  byId('round-subtitle').textContent = result ? 'Keep the reference. Carry the learning forward.' : 'Take your time. Clues are here to help.';
  bindQuestion(() => { state.hints++; persist(); render(); }, selected => {
    if (state.results[state.index]) return;
    const itemId = `surah-${answer}`; track('activity_started', itemId);
    state.results.push({ answer, selected, hints: state.hints }); track('activity_completed', itemId);
    if (selected === answer) markFound(answer);
    persist(); render();
  }, answer);
  document.getElementById('next-question')?.addEventListener('click', () => { state.index++; state.hints = 1; persist(); render(); focusHeading(stage); });
}

// ---------- Collection ----------
function renderCollection() {
  byId('collection-count').textContent = `${found.size} of ${chapters.length} found`;
  document.querySelectorAll<HTMLElement>('#collection-grid [data-n]').forEach(cell => {
    const isFound = found.has(Number(cell.dataset.n));
    cell.classList.toggle('found', isFound);
    cell.querySelector('.state')!.textContent = isFound ? ' found' : ' not found yet';
  });
}

// ---------- Chrome, tabs and setup ----------
function syncForm() {
  if (tab === 'daily') return;
  const s = rounds[tab];
  poolInput.value = s.pool; juzInput.value = String(s.juz); lengthInput.value = String(s.length);
}
function updateChrome() {
  const isDaily = tab === 'daily';
  document.querySelectorAll<HTMLButtonElement>('[role=tab]').forEach(t => { const on = t.dataset.mode === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  byId('game-panel').setAttribute('aria-labelledby', `tab-${tab}`);
  byId('setup-form').hidden = isDaily;
  byId('pool-field').hidden = tab !== 'practice'; byId('juz-field').hidden = tab !== 'juz';
  byId('streak-field').hidden = !isDaily || dailyN < 1;
  byId('score-label').hidden = isDaily; byId('round-progress').hidden = isDaily;
  renderStreak();
}
function render() { updateChrome(); if (tab === 'daily') renderDaily(); else renderRound(); renderCollection(); }
function start(mode: RoundMode) {
  const pool = poolInput.value as Pool; const juz = Number(juzInput.value);
  rounds[mode] = newRound(mode, { pool: mode === 'juz' ? 'all' : pool, juz: mode === 'juz' ? juz : rounds[mode].juz, length: Number(lengthInput.value) });
  history.replaceState(null, '', location.pathname); persist(); render(); focusHeading(stage);
}
function link(s: State) { return challengeUrl(s.mode === 'juz' ? { seed: s.seed, mode: 'juz', juz: String(s.juz), rounds: String(s.length) } : { seed: s.seed, pool: s.pool, rounds: String(s.length) }); }
function select(mode: Mode, focus = false) {
  tab = mode; syncForm(); render();
  if (focus) byId(`tab-${mode}`).focus();
}

const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role=tab]'));
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t.dataset.mode as Mode));
  t.addEventListener('keydown', event => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(tabs[event.key === 'Home' ? 0 : tabs.length - 1]!.dataset.mode as Mode, true); }
    else if (step) { event.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length]!.dataset.mode as Mode, true); }
  });
});
byId<HTMLFormElement>('setup-form').addEventListener('submit', event => { event.preventDefault(); if (tab !== 'daily') start(tab); });
remember.addEventListener('change', () => { if (remember.checked) { if (!write('remember', true)) announce('Browser storage is unavailable.'); persist(); } else { forget('remember'); forget('round'); } });
arabicFirstInput.addEventListener('change', () => { arabicFirst = arabicFirstInput.checked; if (!write('arabicFirst', arabicFirst)) announce('Browser storage is unavailable. This choice lasts for this visit.'); render(); });
streakInput.addEventListener('change', () => {
  streakOn = streakInput.checked;
  if (streakOn) { if (!write('streakOn', true)) announce('Browser storage is unavailable. No streak is kept.'); if (daily.result) applyStreak(); }
  else { forget('streakOn'); forget('streak'); }
  renderStreak();
});
if (suppliedSeed) byId('challenge-banner').hidden = false;
syncForm();
render();
