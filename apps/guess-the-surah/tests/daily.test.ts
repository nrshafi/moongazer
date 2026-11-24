import { test, expect, describe } from 'bun:test';
import { DAILY_EPOCH, dayNumber, localDateKey, dailyIndex, updateStreak, shareText, whatsappUrl, assertNoAnswer, dailyReminderIcs } from '../src/lib/daily';

const [ey, em, ed] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
const at = (offsetDays: number, h = 12, mi = 0, s = 0, ms = 0) => new Date(ey, em - 1, ed + offsetDays, h, mi, s, ms);

test('localDateKey uses local calendar fields and zero-pads', () => {
  expect(localDateKey(new Date(2027, 0, 5, 23, 59, 59))).toBe('2027-01-05');
  expect(localDateKey(new Date(2027, 11, 31, 0, 0, 0))).toBe('2027-12-31');
});

test('dayNumber: epoch day is 1, increments daily, before the epoch is 0', () => {
  expect(dayNumber(at(0))).toBe(1);
  expect(dayNumber(at(1))).toBe(2);
  expect(dayNumber(at(364))).toBe(365);
  expect(dayNumber(at(-1))).toBe(0);
  expect(dayNumber(at(-400))).toBe(0);
});

test('dayNumber changes at local midnight, whatever the time zone', () => {
  // Local Date objects model different zones: the same wall-clock moments give the same number.
  expect(dayNumber(at(0, 0, 0, 0, 0))).toBe(1);
  expect(dayNumber(at(0, 23, 59, 59, 999))).toBe(1);
  expect(dayNumber(at(1, 0, 0, 0, 0))).toBe(2);
  expect(dayNumber(at(-1, 23, 59, 59, 999))).toBe(0);
});

test('dayNumber counts calendar days across months, years and a leap day', () => {
  for (let i = 0; i < 800; i++) expect(dayNumber(at(i, 12))).toBe(i + 1);
});

test('dailyIndex is deterministic and depends on the seed', () => {
  expect(dailyIndex(5, 30, 42)).toBe(dailyIndex(5, 30, 42));
  const a = Array.from({ length: 30 }, (_, i) => dailyIndex(i + 1, 30, 1));
  const b = Array.from({ length: 30 }, (_, i) => dailyIndex(i + 1, 30, 2));
  expect(a).not.toEqual(b);
});

for (const size of [7, 30, 114]) {
  test(`dailyIndex covers every item once before any repeat (bank ${size})`, () => {
    const first = Array.from({ length: size }, (_, i) => dailyIndex(i + 1, size, 20261231));
    expect(new Set(first).size).toBe(size);
    expect(Math.min(...first)).toBe(0);
    expect(Math.max(...first)).toBe(size - 1);
    const second = Array.from({ length: size }, (_, i) => dailyIndex(size + i + 1, size, 20261231));
    expect(second).toEqual(first);
  });
}

test('dailyIndex handles an empty bank', () => {
  expect(dailyIndex(1, 0, 1)).toBe(-1);
});

test('updateStreak transitions', () => {
  expect(updateStreak(null, '2027-01-10')).toEqual({ last: '2027-01-10', count: 1, best: 1 });
  const s1 = { last: '2027-01-10', count: 3, best: 5 };
  expect(updateStreak(s1, '2027-01-10')).toEqual(s1);
  expect(updateStreak(s1, '2027-01-11')).toEqual({ last: '2027-01-11', count: 4, best: 5 });
  expect(updateStreak({ last: '2027-01-10', count: 5, best: 5 }, '2027-01-11')).toEqual({ last: '2027-01-11', count: 6, best: 6 });
  expect(updateStreak(s1, '2027-01-13')).toEqual({ last: '2027-01-13', count: 1, best: 5 });
  expect(updateStreak({ last: '2027-02-28', count: 2, best: 2 }, '2027-03-01')).toEqual({ last: '2027-03-01', count: 3, best: 3 });
  expect(updateStreak({ last: '2027-12-31', count: 2, best: 2 }, '2028-01-01').count).toBe(3);
  expect(updateStreak(s1, '2027-01-09')).toEqual(s1);
});

test('updateStreak treats invalid stored values as none', () => {
  const bads = [undefined, 'x', 7, [], {}, { last: 'nope', count: 2, best: 2 }, { last: '2027-02-30', count: 2, best: 2 }, { last: '2027-01-10', count: 0, best: 1 }, { last: '2027-01-10', count: 1.5, best: 2 }, { last: '2027-01-10', count: 4, best: 2 }];
  for (const bad of bads) expect(updateStreak(bad, '2027-01-11')).toEqual({ last: '2027-01-11', count: 1, best: 1 });
});

test('shareText is plain text with the host last and no emoji', () => {
  const text = shareText({ name: 'Guess the Surah', n: 42, resultLine: 'solved on clue 2 of 4', host: 'guess-the-surah.moongazer.tech' });
  expect(text).toBe('Guess the Surah #42 · solved on clue 2 of 4\nguess-the-surah.moongazer.tech');
  expect(text.endsWith('guess-the-surah.moongazer.tech')).toBe(true);
  expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  expect(text).not.toMatch(/https?:|\?|utm_/);
});

test('assertNoAnswer passes clean text and throws on a forbidden string (case-insensitive)', () => {
  const text = shareText({ name: 'Guess the Surah', n: 3, resultLine: 'solved on clue 1 of 4', host: 'guess-the-surah.moongazer.tech' });
  expect(() => assertNoAnswer(text, ['Al-Fatiha', 'Yasin'])).not.toThrow();
  const leaky = shareText({ name: 'Guess the Surah', n: 3, resultLine: 'It was Al-Fatiha', host: 'h' });
  expect(() => assertNoAnswer(leaky, ['al-fatiha'])).toThrow(/forbidden/);
  expect(() => assertNoAnswer(leaky, [''])).not.toThrow();
});

test('whatsappUrl encodes the text with encodeURIComponent and nothing else', () => {
  const text = 'Word Groups #7 · 4 groups & "1 mistake"\nword-groups.moongazer.tech';
  const url = whatsappUrl(text);
  expect(url).toBe('https://wa.me/?text=' + encodeURIComponent(text));
  expect(new URL(url).searchParams.get('text')).toBe(text);
  expect([...new URL(url).searchParams.keys()]).toEqual(['text']);
});

describe('dailyReminderIcs (T6.7)', () => {
  const now = new Date(2026, 10, 12, 21, 5, 0);
  const ics = dailyReminderIcs({ name: 'Guess the Surah', host: 'guess-the-surah.moongazer.tech', time: '20:30', now })!;
  test('one daily event at the chosen local time, CRLF lines', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Moongazer//Daily reminder//EN\r\n')).toBe(true);
    expect(ics).toContain('\r\nDTSTART:20261112T203000\r\n');
    expect(ics).toContain('\r\nRRULE:FREQ=DAILY\r\n');
    expect(ics.match(/BEGIN:VEVENT/g)!.length).toBe(1);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toMatch(/\r\nDTSTAMP:\d{8}T\d{6}Z\r\n/);
    expect(ics).toMatch(/\r\nUID:daily-guess-the-surah-\d{8}T\d{6}Z@moongazer\.tech\r\n/);
  });
  test('text values are escaped', () => {
    const odd = dailyReminderIcs({ name: 'A, B; C', host: 'x.moongazer.tech', time: '07:00', now })!;
    expect(odd).toContain("SUMMARY:A\\, B\\; C: today's puzzle");
  });
  test('rejects invalid times', () => {
    for (const time of ['24:00', '7:00', '07:60', '', 'noon']) expect(dailyReminderIcs({ name: 'x', host: 'x', time, now })).toBeNull();
  });
});

test('updateStreak preserves valid streak on invalid todayKey and never emits invalid state', () => {
  const prev = { last: '2027-01-10', count: 4, best: 9 };
  expect(updateStreak(prev, 'not-a-date')).toEqual(prev);
  expect(updateStreak(null, 'not-a-date')).toEqual({ last: DAILY_EPOCH, count: 1, best: 1 });
});
