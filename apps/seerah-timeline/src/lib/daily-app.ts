// Daily · Practice "Which came first?" on the home page (P6 T6.5, T6.7). Text-only DOM; no requests.
import learning from '../data/learning.json';
import { byId, read, write, forget, esc, withHonorifics, announce } from './utils';
import { track } from './counter';
import { renderSessionEnd } from './session-end';
import { dayNumber, localDateKey, updateStreak, isStreak, dailyReminderIcs, DAILY_EPOCH, type Streak } from './daily';
import { dailyItem, type DailyPair } from './daily-bank';
import { APP_NAME, APP_HOST, eventById, dailyOrder, practiceOrder, practicePair, isCorrect, yearLabel, dailyShareText, isDailySave, streakLine, type DailySave } from './daily-pairs';

type Mode = 'daily' | 'practice';
const now = new Date();
const N = dayNumber(now);
const today = dailyItem(N);
const root = byId('daily');
const panel = byId('daily-panel');
const tabs = { daily: byId<HTMLButtonElement>('tab-daily'), practice: byId<HTMLButtonElement>('tab-practice') };

let mode: Mode = today ? 'daily' : 'practice';
let saved: DailySave | null = today ? read<DailySave>('daily', isDailySave) : null;
if (saved && saved.n !== N) saved = null;
let wantStreak = !!read<Streak>('streak', isStreak);
let practice: { pair: DailyPair; order: [string, string]; picked: string | null } = freshPractice();
let dailyPicked: string | null = null;

function freshPractice(previous?: string) {
  const pair = practicePair([today?.id, previous]);
  return { pair, order: practiceOrder(pair), picked: null as string | null };
}

const links = (id: string) => eventById(id).sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join(' · ');
const title = (id: string) => withHonorifics(esc(eventById(id).title));

function choices(order: [string, string], disabled: boolean) {
  return `<div class="pair-choices">${order.map(id => `<button type="button" class="pair-choice" data-pick="${id}" ${disabled ? 'disabled' : ''}><span class="pair-choice-title">${title(id)}</span><span class="pair-choice-place">${esc(eventById(id).place)}</span></button>`).join('')}</div>`;
}

function reveal(pair: DailyPair, picked: string | null, correct: boolean) {
  const card = (id: string, rank: string) => {
    const e = eventById(id);
    return `<li class="pair-card"><span class="eyebrow">${rank}${picked === id ? ' · your pick' : ''}</span><h3>${title(id)}</h3><p class="pair-year">${esc(yearLabel(e))}</p><p class="micro">Date note: ${withHonorifics(esc(e.uncertainty))}</p><p class="pair-sources">${links(id)}</p><p class="micro"><a href="/event/${id}/">Read this event <span aria-hidden="true">→</span></a></p></li>`;
  };
  return `<div class="pair-result ${correct ? 'is-right' : 'is-wrong'}" id="pair-result" role="status" tabindex="-1"><p><strong>${correct ? 'Correct.' : 'Not this time.'}</strong> ${correct ? 'You picked' : 'The earlier event was'} ${title(pair.first)}${correct ? ' as the earlier event.' : '.'}</p></div><ol class="pair-cards">${card(pair.first, 'Came first')}${card(pair.second, 'Came second')}</ol><p class="pair-why">${withHonorifics(esc(pair.why))}</p>`;
}

function extras(n: number): HTMLElement {
  const box = document.createElement('div');
  box.className = 'daily-extras';
  box.innerHTML = `<label class="check"><input type="checkbox" id="streak-opt" ${wantStreak ? 'checked' : ''}/> Keep a streak on this device</label><p class="micro" id="streak-line"></p><div class="reminder"><label class="field" for="reminder-time">Remind me daily<input type="time" id="reminder-time" value="20:00"/></label><button type="button" class="button secondary small" id="reminder-download">Download reminder (.ics)</button></div><p class="micro">The reminder is a calendar file made in your browser. Nothing is sent anywhere.</p>`;
  const opt = box.querySelector<HTMLInputElement>('#streak-opt')!;
  const line = box.querySelector<HTMLElement>('#streak-line')!;
  const show = () => { const s = read<Streak>('streak', isStreak); line.textContent = opt.checked && s ? streakLine(s, new Date()) : ''; };
  opt.addEventListener('change', () => {
    wantStreak = opt.checked;
    if (!wantStreak) forget('streak');
    else if (saved && saved.n === n) write('streak', updateStreak(read<Streak>('streak', isStreak), localDateKey(new Date())));
    show();
  });
  show();
  box.querySelector('#reminder-download')!.addEventListener('click', () => {
    const time = box.querySelector<HTMLInputElement>('#reminder-time')!.value;
    const ics = dailyReminderIcs({ name: APP_NAME, host: APP_HOST, time, now: new Date() });
    if (!ics) { announce('Choose a time first.'); return; }
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'seerah-timeline-daily.ics';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Reminder file downloaded.');
  });
  return box;
}

function heading(text: string, meta = '') {
  return `<div class="pair-head"><h2 id="daily-title">${text}</h2>${meta ? `<span class="pair-meta">${meta}</span>` : ''}</div>`;
}

function renderDaily() {
  if (!today) {
    const [y, m, d] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
    const date = new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    panel.innerHTML = `${heading('Which came first?')}<p>The first daily puzzle opens on ${esc(date)}.</p>`;
    return;
  }
  const meta = `#${N} · ${now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const result = saved?.result ?? null;
  if (!result) {
    panel.innerHTML = `${heading('Which came first?', meta)}<p class="pair-prompt">Which of these two events came first?</p>${choices(dailyOrder(today, N), false)}<p class="micro">One pick, then the sources and dates open.</p>`;
    return;
  }
  const correct = result === 'correct';
  panel.innerHTML = `${heading('Which came first?', meta)}${reveal(today, dailyPicked, correct)}<div id="daily-end" class="no-print"></div>`;
  const end = byId('daily-end');
  const next = learning.related[0]!;
  renderSessionEnd(end, {
    result: correct ? 'Correct on the first try.' : 'Not this time.',
    learned: [today.first, today.second].map(id => { const e = eventById(id); return `${e.title}: ${yearLabel(e)} (${e.sources[0]!.label})`; }),
    shareText: dailyShareText(N, correct),
    itemId: `daily-${N}`,
    next: { name: next.name, url: next.url },
    tomorrow: 'A new pair opens at your local midnight.',
    heading: 'Daily pair complete',
  });
  end.append(extras(N));
}

function renderPractice() {
  const p = practice;
  const done = p.picked !== null;
  panel.innerHTML = `${heading('Which came first?', 'Practice')}${done
    ? `${reveal(p.pair, p.picked, isCorrect(p.pair, p.picked!))}<div class="actions top-gap"><button type="button" class="button" id="practice-next">Another pair <span aria-hidden="true">→</span></button></div>`
    : `<p class="pair-prompt">Which of these two events came first?</p>${choices(p.order, false)}<p class="micro">Practice pairs are random and unlimited. They do not count toward the daily puzzle.</p>`}`;
}

function render(focusResult = false) {
  for (const key of ['daily', 'practice'] as const) {
    const on = key === mode;
    tabs[key].setAttribute('aria-selected', String(on));
    tabs[key].tabIndex = on ? 0 : -1;
  }
  panel.setAttribute('aria-labelledby', `tab-${mode}`);
  if (mode === 'daily') renderDaily(); else renderPractice();
  if (focusResult) document.getElementById('pair-result')?.focus({ preventScroll: false });
}

function currentItemId() { return mode === 'daily' ? `daily-${N}` : practice.pair.id; }

function pick(id: string) {
  if (mode === 'daily') {
    if (!today || saved) return;
    const correct = isCorrect(today, id);
    dailyPicked = id;
    saved = { n: N, result: correct ? 'correct' : 'wrong' };
    const stored = write('daily', saved);
    if (wantStreak) write('streak', updateStreak(read<Streak>('streak', isStreak), localDateKey(new Date())));
    track('activity_started', currentItemId());
    track('activity_completed', currentItemId());
    render(true);
    if (!stored) announce('Browser storage unavailable. The result will not be remembered.');
  } else {
    if (practice.picked) return;
    practice.picked = id;
    track('activity_started', currentItemId());
    track('activity_completed', currentItemId());
    render(true);
  }
}

function select(next: Mode) { mode = next; render(); }

root.addEventListener('pointerdown', () => track('activity_started', currentItemId()), { once: true });
tabs.daily.addEventListener('click', () => select('daily'));
tabs.practice.addEventListener('click', () => select('practice'));
for (const key of ['daily', 'practice'] as const) {
  tabs[key].addEventListener('keydown', ev => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft' || ev.key === 'Home' || ev.key === 'End') {
      ev.preventDefault();
      const next: Mode = ev.key === 'Home' ? 'daily' : ev.key === 'End' ? 'practice' : key === 'daily' ? 'practice' : 'daily';
      select(next);
      tabs[next].focus();
    }
  });
}
panel.addEventListener('click', ev => {
  const target = ev.target as HTMLElement;
  const choice = target.closest<HTMLElement>('[data-pick]');
  if (choice) { pick(choice.dataset.pick!); return; }
  if (target.closest('#practice-next')) { practice = freshPractice(practice.pair.id); render(); (panel.querySelector('.pair-choice') as HTMLElement | null)?.focus({ preventScroll: true }); }
});

root.hidden = false;
render();
