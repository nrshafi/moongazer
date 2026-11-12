import {schedule, valid, defaults, icsStamp, type Plan} from './engine';

/** Pure wizard logic: inputs to plan, this-week checklist, calendar grouping and re-planning. No DOM, storage or clock. */

export const TOTAL_PAGES = 604;
/** Study days fill in Monday-first order, so "5 days" means Monday to Friday. */
export const STUDY_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export type Kind = 'new' | 'recent' | 'old';
export const KINDS: readonly Kind[] = ['new', 'recent', 'old'];
export type Vocab = 'sabaq' | 'plain';
export const isVocab = (v: unknown): v is Vocab => v === 'sabaq' || v === 'plain';
export const VOCAB: Readonly<Record<Vocab, Readonly<Record<Kind, string>>>> = {
  sabaq: {new: 'Sabaq (new lesson)', recent: 'Sabqi (recent revision)', old: 'Manzil (old revision)'},
  plain: {new: 'New lesson', recent: 'Recent revision', old: 'Old revision'},
};

export interface Assumptions {
  newMinutes: number;
  reviewMinutes: number;
  pace: number;
  cycle: number;
}

export interface WizardInput {
  /** Pages already memorized. Whole pages from the form; fractions only after a re-plan. */
  memorized: number;
  /** New pages to add. */
  goal: number;
  start: string;
  daysPerWeek: number;
  minutes: number;
  assumptions: Assumptions;
}

/** A suggestion for the Ramadan pace: fewer new pages per session and a shorter review cycle. Labelled as a suggestion in the UI. */
export const RAMADAN_SUGGESTION = {pace: 0.25, cycle: 7} as const;

export function defaultAssumptions(): Assumptions {
  return {newMinutes: defaults.newMinutes, reviewMinutes: defaults.reviewMinutes, pace: defaults.pace, cycle: defaults.cycle};
}

export function studyDays(count: number): number[] {
  return STUDY_DAY_ORDER.slice(0, count);
}

export function toPlan(input: WizardInput): Plan {
  const a = input.assumptions;
  return {
    memorized: input.memorized,
    goal: input.goal,
    minutes: input.minutes,
    newMinutes: a.newMinutes,
    reviewMinutes: a.reviewMinutes,
    pace: a.pace,
    cycle: a.cycle,
    days: studyDays(input.daysPerWeek),
    start: input.start,
  };
}

/** Returns null when the input can be scheduled, otherwise a message for the visitor. */
export function inputError(input: WizardInput): string | null {
  if (!valid(toPlan(input))) return 'Check the pages (the total can be at most 604), minutes, assumptions and start date.';
  return null;
}

const isInt = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

/** Stored or typed input must be whole numbers in range. Re-plans may carry fractions, so they skip this check. */
export function isWizardInput(v: unknown): v is WizardInput {
  if (!v || typeof v !== 'object') return false;
  const w = v as Partial<WizardInput> & {assumptions?: Partial<Assumptions>};
  if (!isInt(w.memorized, 0, TOTAL_PAGES - 1) || !isInt(w.goal, 1, TOTAL_PAGES)) return false;
  if (!isInt(w.daysPerWeek, 1, 7) || !isInt(w.minutes, 1, 1440)) return false;
  if (typeof w.start !== 'string' || !w.assumptions || typeof w.assumptions !== 'object') return false;
  const a = w.assumptions;
  if (typeof a.newMinutes !== 'number' || typeof a.reviewMinutes !== 'number' || typeof a.pace !== 'number' || typeof a.cycle !== 'number') return false;
  return inputError(w as WizardInput) === null && Number.isInteger(a.cycle);
}

export interface Row {
  date: string;
  newPages: number;
  reviewPages: number;
  reviewTime: number;
  total: number;
  memorized: number;
}

export type BuildResult =
  | {ok: true; status: 'complete' | 'horizon' | 'capacity'; rows: Row[]; ceiling: number; target: number; input: WizardInput}
  | {ok: false; error: string};

export function buildPlan(input: WizardInput): BuildResult {
  const error = inputError(input);
  if (error) return {ok: false, error};
  // schedule() is the existing engine; it is not changed by the wizard. Its status is typed as a string, narrowed here.
  const result = schedule(toPlan(input));
  return {ok: true, status: result.status as 'complete' | 'horizon' | 'capacity', rows: result.rows, ceiling: result.ceiling, target: result.target, input};
}

export interface ChecklistItem {
  kind: Kind;
  pages: number;
  minutes: number;
}

export interface SessionView {
  date: string;
  /** 1-based week counted from the start date. */
  week: number;
  items: ChecklistItem[];
}

/**
 * Splits each session's review into recent and old revision for display. Recent pages are the new pages
 * added in the previous review-cycle sessions (capped at what was memorized). The split only divides the
 * engine's review total; it does not change the schedule.
 */
export function sessionViews(rows: readonly Row[], input: WizardInput): SessionView[] {
  const cycle = input.assumptions.cycle;
  const start = Date.parse(input.start + 'T00:00:00Z');
  return rows.map((row, i) => {
    const before = row.memorized - row.newPages;
    let recentWindow = 0;
    for (let j = Math.max(0, i - cycle); j < i; j++) recentWindow += rows[j]!.newPages;
    const recent = Math.min(recentWindow, Math.max(0, before));
    const recentShare = before > 1e-9 ? recent / before : 0;
    const recentReview = row.reviewPages * recentShare;
    const oldReview = Math.max(0, row.reviewPages - recentReview);
    const days = Math.round((Date.parse(row.date + 'T00:00:00Z') - start) / 86400000);
    return {
      date: row.date,
      week: Math.floor(days / 7) + 1,
      items: [
        {kind: 'new', pages: row.newPages, minutes: row.newPages * input.assumptions.newMinutes},
        {kind: 'recent', pages: recentReview, minutes: recentReview * input.assumptions.reviewMinutes},
        {kind: 'old', pages: oldReview, minutes: oldReview * input.assumptions.reviewMinutes},
      ],
    };
  });
}

/** Sessions whose date falls in the first seven days from the start: this week's checklist. */
export function thisWeek(views: readonly SessionView[]): SessionView[] {
  return views.filter(v => v.week === 1);
}

/** Groups all sessions by week for the calendar view. */
export function weeks(views: readonly SessionView[]): {week: number; sessions: SessionView[]}[] {
  const out: {week: number; sessions: SessionView[]}[] = [];
  for (const v of views) {
    const last = out.at(-1);
    if (last && last.week === v.week) last.sessions.push(v);
    else out.push({week: v.week, sessions: [v]});
  }
  return out;
}

export const checkKey = (date: string, kind: Kind) => `${date}:${kind}`;
const CHECK_RE = /^(\d{4})-(\d{2})-(\d{2}):(new|recent|old)$/;

/** Stored check-offs: at most one entry per session item, each a valid date and kind. */
export function isCheckoffList(v: unknown): v is string[] {
  if (!Array.isArray(v) || v.length > 3 * 3650) return false;
  const seen = new Set<string>();
  for (const item of v) {
    if (typeof item !== 'string') return false;
    const m = CHECK_RE.exec(item);
    if (!m) return false;
    const date = `${m[1]}-${m[2]}-${m[3]}`;
    if (new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) return false;
    if (seen.has(item)) return false;
    seen.add(item);
  }
  return true;
}

export interface ReplanResult {
  /** `done` when no pages remain after counting completed new lessons. */
  status: 'done' | 'ok' | 'error';
  completedPages: number;
  /** Past sessions whose new lesson was not checked off. */
  missed: number;
  input?: WizardInput;
  build?: BuildResult;
  error?: string;
}

/**
 * Re-plans from today. Completed new lessons (checked off, dated before today) count as memorized; past
 * sessions without a checked new lesson return to the queue, so their pages are planned again from today.
 * Check-offs are not changed by this function.
 */
export function replanFrom(input: WizardInput, today: string, checked: ReadonlySet<string>): ReplanResult {
  const base = buildPlan(input);
  if (!base.ok) return {status: 'error', completedPages: 0, missed: 0, error: base.error};
  let completedPages = 0;
  let missed = 0;
  for (const row of base.rows) {
    if (row.date >= today) continue;
    if (checked.has(checkKey(row.date, 'new'))) completedPages += row.newPages;
    else missed += 1;
  }
  const remaining = input.goal - completedPages;
  if (remaining <= 1e-9) return {status: 'done', completedPages, missed};
  if (today <= input.start) return {status: 'ok', completedPages, missed, input, build: base};
  const next: WizardInput = {...input, memorized: input.memorized + completedPages, goal: remaining, start: today};
  return {status: 'ok', completedPages, missed, input: next, build: buildPlan(next)};
}

/**
 * Adds a daily reminder to a calendar file made by calendar(). It is one all-day event that repeats every day
 * from the first session to the last, so the reminder matches the plan's span. Returns the text unchanged when
 * there are no sessions.
 */
export function withDailyReminder(ics: string, rows: readonly {date: string}[], now: Date): string {
  if (!rows.length) return ics;
  const stamp = icsStamp(now);
  const first = rows[0]!.date;
  const last = rows.at(-1)!.date;
  const event = [
    'BEGIN:VEVENT',
    `UID:reminder-${first}-${stamp}@moongazer.tech`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${first.replaceAll('-', '')}`,
    `RRULE:FREQ=DAILY;UNTIL=${last.replaceAll('-', '')}`,
    "SUMMARY:Hifz Planner: check today's plan",
    'DESCRIPTION:A daily reminder from your own plan. Dates are estimates from your study days.',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ];
  return ics.replace(/END:VCALENDAR\r\n$/, event.join('\r\n') + '\r\nEND:VCALENDAR\r\n');
}
