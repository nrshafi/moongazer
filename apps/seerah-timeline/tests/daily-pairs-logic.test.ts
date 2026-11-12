import { test, expect } from 'bun:test';
import { dailyIndex, assertNoAnswer, whatsappUrl, updateStreak, localDateKey, dayNumber, DAILY_EPOCH, dailyReminderIcs } from '../src/lib/daily';
import { DAILY_SEED, BANK_VERSION, dailyPairs, dailyItem } from '../src/lib/daily-bank';
import { dailyOrder, practicePair, isCorrect, isApproximate, yearLabel, dailyShareText, isDailySave, streakLine, eventById, APP_HOST, APP_NAME } from '../src/lib/daily-pairs';

test('constants and bank size', () => {
  expect(DAILY_SEED).toBe(31);
  expect(BANK_VERSION).toBe(1);
  expect(dailyPairs.length).toBe(31);
});

test('dailyItem is deterministic and follows dailyIndex over the data order', () => {
  for (let n = 1; n <= 80; n++) {
    expect(dailyItem(n)).toBe(dailyPairs[dailyIndex(n, dailyPairs.length, DAILY_SEED)]!);
    expect(dailyItem(n)).toBe(dailyItem(n));
  }
  expect(dailyItem(0)).toBeNull();
  expect(new Set(Array.from({ length: 31 }, (_, i) => dailyItem(i + 1)!.id)).size).toBe(31);
  expect(dailyItem(1)).toBe(dailyItem(32));
});

test('before the epoch there is no daily item', () => {
  const [y, m, d] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
  const before = new Date(y, m - 1, d - 1, 12);
  expect(dayNumber(before)).toBe(0);
  expect(dailyItem(dayNumber(before))).toBeNull();
});

test('display order is deterministic and the earlier event appears in both positions', () => {
  let earlierFirst = 0, earlierSecond = 0;
  for (let n = 1; n <= dailyPairs.length; n++) {
    const pair = dailyItem(n)!;
    const order = dailyOrder(pair, n);
    expect(order).toEqual(dailyOrder(pair, n));
    expect([...order].sort()).toEqual([pair.first, pair.second].sort());
    if (order[0] === pair.first) earlierFirst++; else earlierSecond++;
  }
  expect(earlierFirst).toBeGreaterThan(5);
  expect(earlierSecond).toBeGreaterThan(5);
});

test('the earlier event is the correct pick', () => {
  const p = dailyPairs[0]!;
  expect(isCorrect(p, p.first)).toBe(true);
  expect(isCorrect(p, p.second)).toBe(false);
});

test("practice never returns today's pair or the previous one", () => {
  const today = dailyItem(5)!;
  for (let i = 0; i < 200; i++) {
    const p = practicePair([today.id, 'pair-03']);
    expect(p.id).not.toBe(today.id);
    expect(p.id).not.toBe('pair-03');
  }
  expect(practicePair([], () => 0.9999999).id).toBe(dailyPairs[dailyPairs.length - 1]!.id);
});

test('share text carries no event title, ends with the host and encodes for WhatsApp', () => {
  for (const pair of dailyPairs) {
    for (const correct of [true, false]) {
      const text = dailyShareText(7, correct);
      assertNoAnswer(text, [eventById(pair.first).title, eventById(pair.second).title]);
      expect(text).toBe(`${APP_NAME} #7 · ${correct ? 'correct first try' : 'not this time'}\n${APP_HOST}`);
      expect(whatsappUrl(text)).toBe(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
  }
  expect(() => assertNoAnswer(dailyShareText(1, true), ['Seerah Timeline'])).toThrow();
});

test('approximate years are labelled approximate', () => {
  expect(isApproximate({ date: 'c. 610 CE', uncertainty: 'x' })).toBe(true);
  expect(isApproximate({ date: 'Early mission', uncertainty: 'x' })).toBe(true);
  expect(isApproximate({ date: '10 AH · 632 CE', uncertainty: 'This report concerns the address.' })).toBe(false);
  expect(yearLabel({ date: 'c. 610 CE', uncertainty: '' })).toBe('c. 610 CE (approximate)');
  for (const p of dailyPairs) for (const id of [p.first, p.second]) {
    const e = eventById(id);
    if (/\bc\./.test(e.date) || !/\d{3} CE/.test(e.date)) expect(yearLabel(e)).toContain('approximate');
    expect(e.sources.length).toBeGreaterThan(0);
    expect(e.uncertainty.length).toBeGreaterThan(0);
  }
});

test('saved daily validator and streak line', () => {
  expect(isDailySave({ n: 3, result: 'correct' })).toBe(true);
  expect(isDailySave({ n: 0, result: 'correct' })).toBe(false);
  expect(isDailySave({ n: 3, result: 'maybe' })).toBe(false);
  expect(isDailySave(null)).toBe(false);
  const now = new Date(2027, 0, 10, 12);
  const s = updateStreak(updateStreak(null, '2027-01-09'), '2027-01-10');
  expect(streakLine(s, now)).toBe('Streak: 2 days (best 2)');
  expect(streakLine({ last: '2027-01-01', count: 4, best: 5 }, now)).toBe('Streak: 0 days (best 5)');
  expect(localDateKey(now)).toBe('2027-01-10');
});

test('the reminder calendar file is daily, at the chosen time, and names no answer', () => {
  const ics = dailyReminderIcs({ name: APP_NAME, host: APP_HOST, time: '20:00', now: new Date(2027, 0, 10, 9) })!;
  expect(ics).toContain('RRULE:FREQ=DAILY');
  expect(ics).toContain('DTSTART:20270110T200000');
  expect(ics).toContain(APP_HOST);
  expect(dailyReminderIcs({ name: APP_NAME, host: APP_HOST, time: '25:00', now: new Date() })).toBeNull();
});
