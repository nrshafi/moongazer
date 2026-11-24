import { test, expect, describe } from 'bun:test';
import data from '../src/data/content.json';
import config from '../src/data/config.json';
import seo from '../src/data/seo.json';
import { DAILY_EPOCH, dayNumber, dailyIndex, assertNoAnswer, dailyReminderIcs } from '../src/lib/daily';
import { DAILY_SEED, BANK_VERSION, APP_HOST, dailyItem, isDailyRecord, dailyResultLine, dailyShareText, streakLine, type DailyResult } from '../src/lib/daily-bank';

const [ey, em, ed] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
const at = (offsetDays: number, h = 12) => new Date(ey, em - 1, ed + offsetDays, h);

describe('daily selection', () => {
  test('constants the directory imports', () => {
    expect(DAILY_SEED).toBe(30);
    expect(BANK_VERSION).toBe(1);
    expect(APP_HOST).toBe('ayah-threads.moongazer.tech');
  });

  test('dailyItem(n) is the bank item at dailyIndex(n, bank length, seed), in data order', () => {
    for (let n = 1; n <= 90; n++) {
      expect(dailyItem(n)).toBe(data.puzzles[dailyIndex(n, data.puzzles.length, DAILY_SEED)]!);
    }
  });

  test('deterministic, and every puzzle appears once before any repeats', () => {
    const first = Array.from({ length: data.puzzles.length }, (_, i) => dailyItem(i + 1)!.id);
    expect(new Set(first).size).toBe(data.puzzles.length);
    expect(Array.from({ length: data.puzzles.length }, (_, i) => dailyItem(data.puzzles.length + i + 1)!.id)).toEqual(first);
    expect(dailyItem(7)).toBe(dailyItem(7));
  });

  test('the date maps to the puzzle: epoch day is #1, local midnight changes it', () => {
    expect(dailyItem(dayNumber(at(0)))).toBe(dailyItem(1));
    expect(dailyItem(dayNumber(at(1)))).toBe(dailyItem(2));
    expect(dayNumber(new Date(ey, em - 1, ed + 1, 0, 0, 0))).toBe(2);
    expect(dayNumber(new Date(ey, em - 1, ed, 23, 59, 59))).toBe(1);
  });

  test('before the epoch there is no daily puzzle (practice only)', () => {
    expect(dayNumber(at(-1))).toBe(0);
    expect(dailyItem(dayNumber(at(-1)))).toBeNull();
    expect(dailyItem(0)).toBeNull();
    expect(dailyItem(-3)).toBeNull();
    expect(dailyItem(1.5)).toBeNull();
  });
});

describe('daily record and streak line', () => {
  const ok: DailyResult = { outcome: 'solved', hint: true, wrong: ['Hope'] };
  test('isDailyRecord accepts a saved result and rejects bad values', () => {
    expect(isDailyRecord({ n: 3, result: ok })).toBe(true);
    expect(isDailyRecord({ n: 3, result: { outcome: 'revealed', hint: false, wrong: [] } })).toBe(true);
    for (const bad of [null, 3, {}, { n: 0, result: ok }, { n: 1.5, result: ok }, { n: 1 }, { n: 1, result: { ...ok, outcome: 'won' } }, { n: 1, result: { ...ok, hint: 'yes' } }, { n: 1, result: { ...ok, wrong: [1] } }, { n: 1, result: { ...ok, wrong: ['a', 'b', 'c', 'd', 'e'] } }]) {
      expect(isDailyRecord(bad)).toBe(false);
    }
  });

  test('streakLine shows days and best, and an ended streak shows 0 days', () => {
    expect(streakLine({ last: '2027-01-10', count: 3, best: 5 }, '2027-01-10')).toBe('Streak: 3 days (best 5)');
    expect(streakLine({ last: '2027-01-10', count: 1, best: 1 }, '2027-01-11')).toBe('Streak: 1 day (best 1)');
    expect(streakLine({ last: '2027-01-10', count: 4, best: 5 }, '2027-01-12')).toBe('Streak: 0 days (best 5)');
    expect(streakLine(null, '2027-01-10')).toContain('0 days');
  });
});

describe('share text never carries the answer', () => {
  const results: DailyResult[] = [
    { outcome: 'solved', hint: false, wrong: [] },
    { outcome: 'solved', hint: true, wrong: [] },
    { outcome: 'solved', hint: true, wrong: ['A'] },
    { outcome: 'solved', hint: false, wrong: ['A', 'B'] },
    { outcome: 'revealed', hint: false, wrong: [] },
  ];

  test('format: name, number, result line, then the host', () => {
    expect(dailyShareText(12, { outcome: 'solved', hint: true, wrong: [] })).toBe('Ayah Threads #12 · solved with 1 hint\nayah-threads.moongazer.tech');
    expect(dailyResultLine({ outcome: 'solved', hint: false, wrong: [] })).toBe('solved with no hints');
    expect(dailyResultLine({ outcome: 'solved', hint: false, wrong: ['A', 'B'] })).toBe('solved with no hints, 2 wrong guesses');
    expect(dailyResultLine({ outcome: 'revealed', hint: true, wrong: [] })).toBe('connection revealed');
  });

  test('assertNoAnswer passes for every puzzle and result shape (theme, id and passage theme words)', () => {
    for (const p of data.puzzles) {
      const forbidden = [p.theme, p.id, p.id.replaceAll('-', ' ')];
      for (const r of results) {
        for (const n of [1, 12, 365]) assertNoAnswer(dailyShareText(n, r), forbidden);
      }
    }
  });

  test('a share text that contained the theme would be caught', () => {
    expect(() => assertNoAnswer('Ayah Threads #1 · solved: Patience', ['Patience'])).toThrow();
  });

  test('the share text has no emoji, URL parameters or tracking', () => {
    const text = dailyShareText(5, { outcome: 'solved', hint: false, wrong: [] });
    expect(text).not.toMatch(/[?&=]/);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(text.split('\n')[1]).toBe(APP_HOST);
  });
});

describe('descriptor', () => {
  test('one line of 12 words or fewer, keeps "a daily Quran puzzle", and SEO uses the same wording', () => {
    expect(config.description).toBe('Find the theme that links three passages: a daily Quran puzzle');
    expect(config.description.split(/\s+/).length).toBeLessThanOrEqual(12);
    expect(config.description).toContain('a daily Quran puzzle');
    expect(seo.keyword).toBe('daily Quran puzzle');
    expect(seo.title.toLowerCase()).toContain('daily quran');
    expect(seo.title.toLowerCase()).toContain('puzzle');
    expect(seo.description.toLowerCase()).toContain('daily puzzle');
  });
});

describe('reminder', () => {
  test('the .ics has a daily rule at the chosen local time and the app host', () => {
    const ics = dailyReminderIcs({ name: 'Ayah Threads', host: APP_HOST, time: '20:00', now: new Date(2027, 0, 5, 9, 30) })!;
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('DTSTART:20270105T200000');
    expect(ics).toContain('https://ayah-threads.moongazer.tech/');
    expect(ics).toContain('UID:daily-ayah-threads-');
    expect(dailyReminderIcs({ name: 'Ayah Threads', host: APP_HOST, time: '25:00', now: new Date() })).toBeNull();
  });
});
