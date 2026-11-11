import {test, expect} from 'bun:test';
import {defaults, schedule} from '../src/lib/engine';
import {
  buildPlan, defaultAssumptions, isCheckoffList, isWizardInput, RAMADAN_SUGGESTION, replanFrom,
  isVocab, sessionViews, studyDays, thisWeek, toPlan, weeks, checkKey, type WizardInput,
} from '../src/lib/wizard';

const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const base = (over: Partial<WizardInput> = {}): WizardInput => ({
  memorized: 0, goal: 20, start: '2027-02-01', daysPerWeek: 5, minutes: 45, assumptions: defaultAssumptions(), ...over,
});

test('study days fill in Monday-first order', () => {
  expect(studyDays(1)).toEqual([1]);
  expect(studyDays(5)).toEqual([1, 2, 3, 4, 5]);
  expect(studyDays(7)).toEqual([1, 2, 3, 4, 5, 6, 0]);
});

test('wizard input maps onto the existing engine plan without changing it', () => {
  const plan = toPlan(base({memorized: 10, goal: 5, daysPerWeek: 2}));
  expect(plan).toEqual({...defaults, memorized: 10, goal: 5, minutes: 45, days: [1, 2], start: '2027-02-01'});
  expect(schedule(plan).status).toBe('complete');
});

test('a default plan builds, and an unscheduleable one reports an error', () => {
  const ok = buildPlan(base());
  expect(ok.ok).toBe(true);
  if (ok.ok) expect(ok.rows.at(-1)!.memorized).toBeCloseTo(20);
  const bad = buildPlan(base({memorized: 600, goal: 10}));
  expect(bad.ok).toBe(false);
});

test('stored input must be whole, in range and typed', () => {
  expect(isWizardInput(base())).toBe(true);
  const rejects: unknown[] = [
    null, 'x', base({memorized: 0.5}), base({memorized: 604}), base({goal: 0}), base({goal: 605}),
    base({daysPerWeek: 0}), base({daysPerWeek: 8}), base({minutes: 0}), base({start: '2027-02-30'}),
    {...base(), assumptions: {...defaultAssumptions(), cycle: 2.5}},
    {...base(), assumptions: {...defaultAssumptions(), pace: '0.5'}},
    {...base(), assumptions: undefined},
  ];
  for (const raw of rejects) expect(isWizardInput(raw)).toBe(false);
});

test('the Ramadan suggestion gives fewer new pages per session and more revision', () => {
  const standard = buildPlan(base({goal: 20}));
  const ramadan = buildPlan(base({goal: 20, assumptions: {...defaultAssumptions(), pace: RAMADAN_SUGGESTION.pace, cycle: RAMADAN_SUGGESTION.cycle}}));
  expect(standard.ok && ramadan.ok).toBe(true);
  if (!standard.ok || !ramadan.ok) return;
  expect(ramadan.rows.every(r => r.newPages <= RAMADAN_SUGGESTION.pace + 1e-9)).toBe(true);
  expect(ramadan.rows.length).toBeGreaterThan(standard.rows.length);
  // The engine reviews memorized-before-session / cycle pages per session: seven sessions here, not fourteen.
  for (const r of ramadan.rows) expect(r.reviewPages).toBeCloseTo((r.memorized - r.newPages) / 7, 6);
  for (const r of standard.rows) expect(r.reviewPages).toBeCloseTo((r.memorized - r.newPages) / 14, 6);
});

test('session items split review into recent and old pages that add up to the engine total', () => {
  const input = base({memorized: 40, goal: 10});
  const built = buildPlan(input);
  if (!built.ok) throw new Error('plan should build');
  const views = sessionViews(built.rows, input);
  expect(views).toHaveLength(built.rows.length);
  built.rows.forEach((row, i) => {
    const [n, recent, old] = views[i]!.items;
    expect(n!.pages).toBeCloseTo(row.newPages);
    expect(recent!.pages + old!.pages).toBeCloseTo(row.reviewPages);
    expect(recent!.pages).toBeGreaterThanOrEqual(0);
    expect(old!.pages).toBeGreaterThanOrEqual(0);
  });
  // Pages memorized before the plan are old; with no new pages yet there is nothing recent.
  expect(views[0]!.items[1]!.pages).toBe(0);
});

test('weeks count from the start date and this week is the first seven days', () => {
  const input = base({goal: 30});
  const built = buildPlan(input);
  if (!built.ok) throw new Error('plan should build');
  const views = sessionViews(built.rows, input);
  expect(views[0]!.week).toBe(1);
  expect(thisWeek(views).every(v => v.date < addDays(input.start, 7))).toBe(true);
  expect(thisWeek(views).length).toBe(5);
  const grouped = weeks(views);
  expect(grouped[0]!.week).toBe(1);
  expect(grouped.reduce((n, w) => n + w.sessions.length, 0)).toBe(views.length);
});

test('check-off lists are validated', () => {
  expect(isCheckoffList([])).toBe(true);
  expect(isCheckoffList(['2027-02-01:new', '2027-02-01:recent'])).toBe(true);
  const rejects: unknown[] = [
    'x', [1], ['2027-02-30:new'], ['2027-02-01:done'], ['2027-02-01:new', '2027-02-01:new'], ['<script>'],
    Array.from({length: 3 * 3650 + 1}, (_, i) => `2027-01-01:new${i}`),
  ];
  for (const raw of rejects) expect(isCheckoffList(raw)).toBe(false);
});

test('missed one day: re-plans from today and keeps the completed new lesson', () => {
  const input = base({goal: 20});
  const built = buildPlan(input);
  if (!built.ok) throw new Error('plan should build');
  const rows = built.rows;
  const today = rows[2]!.date; // sessions 0 and 1 are past
  const checked = new Set([checkKey(rows[0]!.date, 'new')]); // session 1 was missed
  const before = new Set(checked);
  const result = replanFrom(input, today, checked);
  expect(result.status).toBe('ok');
  expect(result.missed).toBe(1);
  expect(result.completedPages).toBeCloseTo(rows[0]!.newPages);
  expect(result.input!.start).toBe(today);
  expect(result.input!.memorized).toBeCloseTo(rows[0]!.newPages);
  expect(result.input!.goal).toBeCloseTo(20 - rows[0]!.newPages);
  expect(result.build!.ok && result.build!.rows[0]!.date >= today).toBe(true);
  expect(checked).toEqual(before); // check-offs are not changed
});

test('missed a week: nothing completed, so the whole goal is planned again from today', () => {
  const input = base({goal: 20});
  const today = addDays(input.start, 7);
  const result = replanFrom(input, today, new Set());
  expect(result.status).toBe('ok');
  expect(result.missed).toBe(5);
  expect(result.completedPages).toBe(0);
  expect(result.input!.goal).toBe(20);
  expect(result.input!.start).toBe(today);
  expect(result.build!.ok).toBe(true);
});

test('all done: every planned new lesson checked off leaves no pages to plan', () => {
  const input = base({goal: 8});
  const built = buildPlan(input);
  if (!built.ok) throw new Error('plan should build');
  const checked = new Set(built.rows.map(r => checkKey(r.date, 'new')));
  const today = addDays(built.rows.at(-1)!.date, 1);
  const result = replanFrom(input, today, checked);
  expect(result.status).toBe('done');
  expect(result.missed).toBe(0);
  expect(result.completedPages).toBeCloseTo(8);
});

test('a re-plan before the start date keeps the original plan', () => {
  const input = base();
  const result = replanFrom(input, '2027-01-01', new Set());
  expect(result.status).toBe('ok');
  expect(result.input).toEqual(input);
});

test('a plan that ends exactly at 604 pages still re-plans after fractional completions', () => {
  const input = base({memorized: 500, goal: 104, assumptions: {...defaultAssumptions(), pace: 0.3, cycle: 40, reviewMinutes: 0.1}});
  const built = buildPlan(input);
  if (!built.ok) throw new Error('plan should build');
  const checked = new Set(built.rows.slice(0, 7).map(r => checkKey(r.date, 'new')));
  const result = replanFrom(input, built.rows[9]!.date, checked);
  expect(result.status).toBe('ok');
  expect(result.build!.ok).toBe(true);
});

test('the label setting accepts only the two known vocabularies', () => {
  expect(isVocab('sabaq')).toBe(true);
  expect(isVocab('plain')).toBe(true);
  for (const raw of ['Sabaq', '', null, 1, {}]) expect(isVocab(raw)).toBe(false);
});
