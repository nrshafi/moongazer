import {calendar} from './engine';
import {byId, read, write, forget, esc, announce} from './utils';
import {
  buildPlan, checkKey, defaultAssumptions, inputError, isCheckoffList, isVocab, isWizardInput, RAMADAN_SUGGESTION, replanFrom,
  sessionViews, thisWeek, weeks, VOCAB, withDailyReminder, type BuildResult, type Kind, type SessionView, type Vocab, type WizardInput,
} from './wizard';

const TOTAL_PAGES = 604;
const form = byId<HTMLFormElement>('wizard');
const results = byId('results');
const stepLabel = byId('step-label');
const stepBar = byId('step-bar');
const progress = document.querySelector<HTMLElement>('[role=progressbar]')!;
const remember = byId<HTMLInputElement>('remember');
const checkRemember = byId<HTMLInputElement>('remember-checks');
const checkNote = byId('check-note');
const printSheet = byId('print-sheet');
const replanNote = byId('replan-note');
let step = 1;
type Built = Extract<BuildResult, {ok: true}>;
let built: Built | null = null;
/** The input behind `built`. It changes after a re-plan. */
let current: WizardInput | null = null;
let views: SessionView[] = [];
/** Label setting for checklist, calendar and weekly sheet. Stored as a display preference under `vocab`. */
let vocab: Vocab = 'plain';
/** Checked-off items as `YYYY-MM-DD:kind`. Kept in memory; written to storage only when the visitor opts in. */
let checked = new Set<string>();

const pad = (n: number) => String(n).padStart(2, '0');
const todayIso = (now = new Date()) => `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const number = (id: string) => Number(byId<HTMLInputElement>(id).value);
const fmt = (n: number, digits = 2) => n.toFixed(digits);

function download(name: string, text: string, type: string) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], {type}));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function readInputs(): WizardInput {
  return {
    memorized: number('memorized'),
    goal: number('goal'),
    start: byId<HTMLInputElement>('start').value,
    daysPerWeek: number('days'),
    minutes: number('minutes'),
    assumptions: {
      newMinutes: number('newMinutes'),
      reviewMinutes: number('reviewMinutes'),
      pace: number('pace'),
      cycle: number('cycle'),
    },
  };
}

function fillInputs(input: WizardInput) {
  byId<HTMLInputElement>('memorized').value = String(input.memorized);
  byId<HTMLInputElement>('goal').value = String(input.goal);
  byId<HTMLInputElement>('start').value = input.start;
  byId<HTMLInputElement>('days').value = String(input.daysPerWeek);
  byId<HTMLInputElement>('minutes').value = String(input.minutes);
  byId<HTMLInputElement>('newMinutes').value = String(input.assumptions.newMinutes);
  byId<HTMLInputElement>('reviewMinutes').value = String(input.assumptions.reviewMinutes);
  byId<HTMLInputElement>('pace').value = String(input.assumptions.pace);
  byId<HTMLInputElement>('cycle').value = String(input.assumptions.cycle);
}

function setError(id: string, message: string | null) {
  byId(id).textContent = message ?? '';
}

function validateStepOne(): string | null {
  const memorized = number('memorized');
  const goal = number('goal');
  if (!Number.isInteger(memorized) || memorized < 0 || memorized > TOTAL_PAGES - 1) return 'Enter the pages already memorized as a whole number from 0 to 603.';
  if (!Number.isInteger(goal) || goal < 1) return 'Enter the new pages you want to add as a whole number, at least 1.';
  if (memorized + goal > TOTAL_PAGES) return `Pages already memorized and new pages can add up to at most 604. You have ${TOTAL_PAGES - memorized} pages left to add.`;
  return null;
}

/** Moves to a step and moves focus to its legend so keyboard and screen-reader users land at the new step. */
function showStep(n: number, focus = true) {
  step = n;
  form.querySelectorAll<HTMLFieldSetElement>('[data-step]').forEach(fieldset => {
    fieldset.hidden = Number(fieldset.dataset.step) !== n;
  });
  const titles = ['What have you memorized?', 'Your week', 'Your plan'];
  stepLabel.textContent = `Step ${n} of 3`;
  stepBar.style.width = `${(n / 3 * 100).toFixed(1)}%`;
  progress.setAttribute('aria-valuenow', String(n));
  progress.setAttribute('aria-valuetext', `Step ${n} of 3: ${titles[n - 1]}`);
  if (focus) form.querySelector<HTMLLegendElement>(`[data-step="${n}"] legend`)?.focus();
}

function makePlan(): boolean {
  const input = readInputs();
  const error = inputError(input);
  setError('error-2', error);
  if (error) return false;
  const result = buildPlan(input);
  if (!result.ok) {
    setError('error-2', result.error);
    return false;
  }
  built = result;
  current = input;
  replanNote.textContent = '';
  views = sessionViews(result.rows, input);
  if (remember.checked) {
    if (!write('plan', input)) announce('Browser storage is unavailable. The plan still works.');
  } else {
    forget('plan');
  }
  // P4.7: track('activity_completed', {itemId: 'plan'}) belongs here once the counter helper exists.
  renderPlan();
  return true;
}

function statCards(rows: Built['rows']) {
  const last = rows.at(-1);
  const hours = rows.reduce((n, r) => n + r.total, 0) / 60;
  return `<div class="card-grid">
    <div><span class="eyebrow">${built?.status === 'complete' ? 'Estimated finish' : 'Projected through'}</span><h3>${esc(last?.date || '—')}</h3></div>
    <div><span class="eyebrow">Study sessions</span><h3>${rows.length}</h3></div>
    <div><span class="eyebrow">Study time</span><h3>${fmt(hours, 1)} hours</h3></div>
  </div>`;
}

/** A check-off box. `text` is shown beside the box; empty text means the label is screen-reader only. */
function checkbox(date: string, kind: Kind, text: string, srText: string): string {
  const key = checkKey(date, kind);
  const visible = text ? `<span>${esc(text)}</span>` : '';
  return `<label class="check"><input type="checkbox" data-check="${esc(key)}"${checked.has(key) ? ' checked' : ''}/>${visible}<span class="sr-only">${esc(srText)}</span></label>`;
}

function checklistHtml(sessions: SessionView[]): string {
  const labels = VOCAB[vocab];
  return sessions.map(session => {
    const items = session.items.filter(item => item.kind === 'new' || item.pages > 1e-9);
    return `<section class="checklist-day"><h3>${esc(session.date)}</h3><ul class="checklist">${items.map(item => `<li>${checkbox(session.date, item.kind, labels[item.kind], `${labels[item.kind]} on ${session.date}`)}<span class="amount">${fmt(item.pages)} pages · ${fmt(item.minutes, 0)} min</span></li>`).join('')}</ul></section>`;
  }).join('');
}

function calendarHtml(all: SessionView[]): string {
  return weeks(all).map(group => `<details class="calendar-week"><summary>Week ${group.week}: ${esc(group.sessions[0]!.date)} to ${esc(group.sessions.at(-1)!.date)}</summary><div class="table-wrap"><table><thead><tr><th>Date</th><th>${esc(VOCAB[vocab].new)}</th><th>${esc(VOCAB[vocab].recent)}</th><th>${esc(VOCAB[vocab].old)}</th><th>Minutes</th><th>${esc(VOCAB[vocab].new)} done</th></tr></thead><tbody>${group.sessions.map(s => {
    const [n, recent, old] = s.items;
    const minutes = s.items.reduce((sum, item) => sum + item.minutes, 0);
    return `<tr><td>${esc(s.date)}</td><td>${fmt(n!.pages)}</td><td>${fmt(recent!.pages)}</td><td>${fmt(old!.pages)}</td><td>${fmt(minutes, 1)}</td><td>${checkbox(s.date, 'new', '', `New lesson on ${s.date} done`)}</td></tr>`;
  }).join('')}</tbody></table></div></details>`).join('');
}

function checkedNewCount(): number {
  if (!built) return 0;
  return built.rows.filter(r => checked.has(checkKey(r.date, 'new'))).length;
}

function renderPlan() {
  if (!built) return;
  const {status, rows, ceiling} = built;
  if (status === 'capacity') {
    results.innerHTML = `<div class="plan-summary"><span class="eyebrow">Time limit reached</span><h2>This review cycle needs more time.</h2><p>Your assumptions leave room for fewer than ${fmt(ceiling, 1)} memorized pages before revision fills the whole session. Add minutes, lengthen the review cycle, or lower the new-page goal.</p><p class="micro">This is a limit of the planner's assumptions, not a judgment about your ability.</p></div>`;
    return;
  }
  const sessionsThisWeek = thisWeek(views);
  results.innerHTML = `<div class="plan-summary"><p class="status-line" role="status">${status === 'complete' ? 'Your plan is ready.' : 'Your plan runs beyond the planner’s 3,650-session horizon.'} ${rows.length} study sessions.</p>${statCards(rows)}<p class="micro" id="checked-count">Checked off in this plan: ${checkedNewCount()} of ${rows.length} new lessons.</p><figure class="top-gap"><svg viewBox="0 0 800 180" role="img" aria-label="Revision minutes rise as new pages accumulate." style="width:100%;color:var(--accent)">${revisionCurve(rows)}</svg><figcaption class="micro">Revision minutes per study session. Exact values are in the calendar below.</figcaption></figure></div>
    <h3 class="top-gap">This week</h3><div class="plan-summary">${sessionsThisWeek.length ? checklistHtml(sessionsThisWeek) : '<p class="micro">No study sessions fall in the first week with these settings.</p>'}</div>
    <h3 class="top-gap">Calendar</h3><p class="micro">Revision is split between recent and old pages in proportion to the pages memorized in the last review cycle. The split only divides the total revision time; it does not change the schedule.</p>
    <div class="calendar-section">${calendarHtml(views)}</div>
    <label class="check top-gap"><input id="daily-reminder" type="checkbox"/> Add a daily reminder for the plan’s dates to the calendar file</label><div class="actions top-gap"><button class="button secondary" type="button" id="csv">Download CSV</button><button class="button secondary" type="button" id="ics">Calendar file (first ${Math.min(90, rows.length)} sessions)</button><button class="button secondary" type="button" id="print-week">Print this week</button></div>
    <p class="micro">Dates are estimates from your study days and assumptions. Check-offs do not change the schedule; use “I missed a day” to re-plan from today.</p>`;
  byId('csv').onclick = () => download('quran-study-plan.csv', 'date,new_pages,review_pages,total_minutes\r\n' + rows.map(r => [r.date, r.newPages.toFixed(3), r.reviewPages.toFixed(3), r.total.toFixed(2)].join(',')).join('\r\n'), 'text/csv');
  byId('ics').onclick = () => {
    const now = new Date();
    const text = calendar(rows, now);
    const withReminder = byId<HTMLInputElement>('daily-reminder').checked ? withDailyReminder(text, rows, now) : text;
    download('quran-study-plan.ics', withReminder, 'text/calendar');
  };
  byId('print-week').onclick = () => {
    renderPrintSheet();
    window.print();
  };
  renderPrintSheet();
}

/** The weekly sheet for a teacher. Hidden on screen; print CSS shows it alone. Holds no storage and no personal data beyond the plan itself. */
function renderPrintSheet() {
  if (!built || !current) {
    printSheet.innerHTML = '';
    return;
  }
  const a = current.assumptions;
  const week = thisWeek(views);
  const rows = week.map(session => {
    const [n, recent, old] = session.items;
    const done = checked.has(checkKey(session.date, 'new')) ? 'Yes' : '';
    return `<tr><td>${esc(session.date)}</td><td>${fmt(n!.pages)}</td><td>${fmt(recent!.pages)}</td><td>${fmt(old!.pages)}</td><td><span class="print-box" aria-hidden="true"></span> ${done ? esc(done) : ''}</td></tr>`;
  }).join('');
  printSheet.innerHTML = `<h1>Hifz Planner: weekly sheet</h1><p>Start date ${esc(current.start)} · ${current.daysPerWeek} study ${current.daysPerWeek === 1 ? 'day' : 'days'} a week · ${current.minutes} minutes per session</p><p>Pages already memorized: ${fmt(current.memorized, 0)} · new pages in this plan: ${fmt(current.goal, 0)}</p><p class="micro">Assumptions: ${fmt(a.newMinutes, 0)} minutes to learn one new page, ${fmt(a.reviewMinutes, 1)} minutes to review one page, ${fmt(a.pace)} new pages per session, the whole portion reviewed every ${a.cycle} sessions. These are estimates from the planner, not measurements of memorization.</p>${week.length ? `<table><thead><tr><th>Date</th><th>${esc(VOCAB[vocab].new)}</th><th>${esc(VOCAB[vocab].recent)}</th><th>${esc(VOCAB[vocab].old)}</th><th>Done</th></tr></thead><tbody>${rows}</tbody></table>` : '<p>No study sessions fall in the first week with these settings.</p>'}<p class="micro">Dates are estimates. Ask your teacher to confirm the next step.</p>`;
}

/** Points for the revision-minutes curve. Sampled so long plans stay light to draw. */
function revisionCurve(rows: Built['rows']): string {
  if (!rows.length) return '';
  const max = Math.max(1, ...rows.map(r => r.reviewTime));
  const step = Math.max(1, Math.floor(rows.length / 100));
  const points = rows.filter((_, i) => i % step === 0 || i === rows.length - 1);
  const coords = points.map((r, i) => `${(i / Math.max(1, points.length - 1)) * 800},${160 - (r.reviewTime / max) * 140}`).join(' ');
  return `<line x1="0" y1="160" x2="800" y2="160" stroke="currentColor" opacity=".2"/><polyline fill="none" stroke="currentColor" stroke-width="3" points="${coords}"/>`;
}

/** Keeps every box for the same item in step; the checked state lives in `checked`. */
function setChecked(key: string, value: boolean) {
  if (value) checked.add(key);
  else checked.delete(key);
  results.querySelectorAll<HTMLInputElement>('input[data-check]').forEach(el => {
    if (el.dataset.check === key) el.checked = value;
  });
  const count = document.getElementById('checked-count');
  if (count && built) count.textContent = `Checked off in this plan: ${checkedNewCount()} of ${built.rows.length} new lessons.`;
  renderPrintSheet();
}

/** Re-plans from today. Checked-off new lessons count as memorized; past sessions without one return to the queue. */
function missedDay() {
  if (!built || !current) return;
  const today = todayIso();
  if (today <= current.start) {
    replanNote.textContent = 'Your plan has not started yet, so there is nothing to re-plan.';
    return;
  }
  const result = replanFrom(current, today, checked);
  if (result.status === 'done') {
    replanNote.textContent = 'Every planned new lesson is checked off, so no pages are left to plan. Your check-offs are kept.';
    return;
  }
  if (result.status === 'error' || !result.build) {
    replanNote.textContent = result.error ?? 'The plan could not be re-planned.';
    return;
  }
  if (!result.build.ok) {
    replanNote.textContent = result.build.error;
    return;
  }
  current = result.input!;
  built = result.build;
  views = sessionViews(built.rows, current);
  if (remember.checked && !write('plan', current)) announce('Browser storage is unavailable. The re-planned schedule still works.');
  renderPlan();
  replanNote.textContent = `Re-planned from today. ${result.missed} past ${result.missed === 1 ? 'session' : 'sessions'} without a checked new lesson ${result.missed === 1 ? 'returns' : 'return'} to the queue, and ${result.completedPages.toFixed(2)} checked pages count as memorized. Your check-offs are kept.`;
}

function describeChecks(ok: boolean) {
  if (!checkRemember.checked) checkNote.textContent = 'Check-offs stay on this page until you reload. Tick “Remember my check-offs” to keep them for 30 days.';
  else if (ok) checkNote.textContent = 'Check-offs are saved in this browser for 30 days.';
  else checkNote.textContent = 'Browser storage is unavailable here, so your check-offs will not be kept after you reload.';
}

function saveChecks() {
  if (!checkRemember.checked) {
    forget('checkoffs');
    describeChecks(true);
    return;
  }
  describeChecks(write('checkoffs', [...checked].sort()));
}

function applyRamadanSuggestion() {
  byId<HTMLInputElement>('pace').value = String(RAMADAN_SUGGESTION.pace);
  byId<HTMLInputElement>('cycle').value = String(RAMADAN_SUGGESTION.cycle);
  byId<HTMLDetailsElement>('assumptions').open = true;
  announce('Ramadan pace suggestion applied. Adjust it in Adjust assumptions if you want.');
}

function startOver() {
  forget('plan');
  forget('checkoffs');
  built = null;
  current = null;
  replanNote.textContent = '';
  views = [];
  checked = new Set();
  checkRemember.checked = false;
  describeChecks(true);
  fillInputs({memorized: 0, goal: 20, start: todayIso(), daysPerWeek: 5, minutes: 45, assumptions: defaultAssumptions()});
  remember.checked = false;
  results.innerHTML = '';
  showStep(1);
}

// Boot: restore remembered answers and check-offs if they are still valid. Otherwise use defaults with today as the start date.
const saved = read('plan', isWizardInput);
fillInputs(saved ?? {memorized: 0, goal: 20, start: todayIso(), daysPerWeek: 5, minutes: 45, assumptions: defaultAssumptions()});
remember.checked = !!saved;
const savedVocab = read('vocab', isVocab);
if (savedVocab) vocab = savedVocab;
document.querySelectorAll<HTMLInputElement>('input[name=vocab]').forEach(el => {
  el.checked = el.value === vocab;
  el.addEventListener('change', () => {
    if (!el.checked || !isVocab(el.value)) return;
    vocab = el.value;
    if (!write('vocab', vocab)) announce('Browser storage is unavailable. The label choice applies to this page only.');
    if (built) renderPlan();
  });
});
const savedChecks = read('checkoffs', isCheckoffList);
if (savedChecks) {
  checked = new Set(savedChecks);
  checkRemember.checked = true;
}
describeChecks(true);
showStep(1, false);

results.addEventListener('change', event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.check) return;
  setChecked(target.dataset.check, target.checked);
  saveChecks();
});
checkRemember.addEventListener('change', saveChecks);

form.querySelectorAll<HTMLButtonElement>('[data-next]').forEach(button => {
  button.onclick = () => {
    if (step === 1) {
      const error = validateStepOne();
      setError('error-1', error);
      if (error) return;
      // P4.7: track('activity_started', {itemId: 'plan'}) belongs at this first step once the counter helper exists.
      showStep(2);
    } else if (step === 2) {
      if (makePlan()) showStep(3);
    }
  };
});
form.querySelectorAll<HTMLButtonElement>('[data-back]').forEach(button => {
  button.onclick = () => showStep(Math.max(1, step - 1));
});
byId('ramadan').onclick = applyRamadanSuggestion;
byId('reset').onclick = startOver;
byId('missed').onclick = missedDay;
form.onsubmit = event => {
  event.preventDefault();
  if (step === 1) byId('error-1').textContent = '';
  if (step < 3) form.querySelector<HTMLButtonElement>(`[data-step="${step}"] [data-next]`)?.click();
};
