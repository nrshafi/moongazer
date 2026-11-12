import { describe, test, expect } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import data from '../src/data/content.json';
import { DAILY_EPOCH, dayNumber, dailyIndex, shareText, assertNoAnswer, dailyReminderIcs, localDateKey } from '../src/lib/daily';
import { DAILY_SEED, BANK_VERSION, dailyItem, todayNumber, beforeEpochLine, epochLabel } from '../src/lib/daily-bank';
import { surahsInJuz, JUZ_STARTS } from '../src/lib/juz';
import { clueLadder, clueVerse, resultLine, meaningSourceLabel, type Chapter } from '../src/lib/engine';

const chapters = data.chapters as Chapter[];
const epoch = () => { const [y, m, d] = DAILY_EPOCH.split('-').map(Number); return new Date(y!, m! - 1, d!, 12); };
const addDays = (date: Date, n: number) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
const host = 'guess-the-surah.moongazer.tech';

describe('daily selection', () => {
  test('constants and determinism', () => {
    expect(DAILY_SEED).toBe(114); expect(BANK_VERSION).toBe(1);
    for (let n = 1; n <= 300; n++) expect(dailyItem(n)).toBe(chapters[dailyIndex(n, 114, DAILY_SEED)]!);
  });
  test('every surah appears exactly once in 114 days and the cycle repeats', () => {
    const first = Array.from({ length: 114 }, (_, i) => dailyItem(i + 1).number);
    expect(new Set(first).size).toBe(114);
    expect(Array.from({ length: 114 }, (_, i) => dailyItem(i + 115).number)).toEqual(first);
  });
  test('the epoch day is puzzle 1 and the next local day is 2', () => {
    expect(todayNumber(epoch())).toBe(1); expect(todayNumber(addDays(epoch(), 1))).toBe(2); expect(dayNumber(addDays(epoch(), 114))).toBe(115);
  });
  test('before the epoch there is no puzzle and Daily shows one line', () => {
    expect(todayNumber(addDays(epoch(), -1))).toBe(0);
    expect(beforeEpochLine()).toBe(`The first daily puzzle opens on ${epochLabel()}.`);
    expect(epochLabel()).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
  });
});

describe('juz membership', () => {
  test('boundaries are the verified Quran MCP juz starts', () => {
    expect(JUZ_STARTS.length).toBe(30);
    const file = new URL('../../../_implementation/research/page-boundaries.json', import.meta.url);
    if (existsSync(file)) {
      const research = JSON.parse(readFileSync(file, 'utf8'));
      expect(JUZ_STARTS).toEqual(research.juz.map((j: { startVerseKey: string }) => j.startVerseKey));
    }
  });
  test('Juz 30 gives surahs 78 to 114 and Juz 1 gives 1 and 2', () => {
    expect(surahsInJuz(30)).toEqual(Array.from({ length: 37 }, (_, i) => 78 + i));
    expect(surahsInJuz(1)).toEqual([1, 2]);
    expect(surahsInJuz(18)).toEqual([23, 24, 25]);
  });
  test('every surah belongs to exactly one juz; juz 2 and 5 have none; invalid juz is empty', () => {
    const all = Array.from({ length: 30 }, (_, i) => surahsInJuz(i + 1)).flat();
    expect(all.sort((a, b) => a - b)).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
    expect(surahsInJuz(2)).toEqual([]); expect(surahsInJuz(5)).toEqual([]);
    expect(surahsInJuz(0)).toEqual([]); expect(surahsInJuz(31)).toEqual([]);
  });
});

describe('clue ladder', () => {
  const ladder = (c: Chapter, arabicFirst = false) => clueLadder(c, clueVerse(chapters, data.verses, c.number), arabicFirst);
  test('four clues; none reveals the chapter number', () => {
    for (const c of chapters) for (const arabicFirst of [false, true]) {
      const clues = ladder(c, arabicFirst);
      expect(clues.length).toBe(4);
      for (const clue of clues) expect(`${clue.label} ${clue.text}`.toLowerCase()).not.toMatch(/chapter|mushaf|of 114|position|number/);
    }
  });
  test('default order ends with the name meaning; the meaning is never the first clue', () => {
    for (const c of chapters) {
      expect(ladder(c).map(x => x.kind)).toEqual(['translation', 'arabic', 'structure', 'meaning']);
      expect(ladder(c, true).map(x => x.kind)).toEqual(['arabic', 'translation', 'structure', 'meaning']);
    }
  });
  test('every chapter has a verified meaning with a named source shown to the visitor', () => {
    for (const c of chapters) {
      expect(c.nameMeaning && c.nameMeaning.length > 0).toBe(true);
      expect(c.nameMeaningSource).toBe('quran-com-api-v4-chapters');
      expect(ladder(c)[3]!.text).toContain(c.nameMeaning!);
    }
    expect(meaningSourceLabel('quran-com-api-v4-chapters')).toContain('Quran.com API v4');
  });
});

describe('share text', () => {
  test('format and no answer for any surah (name, Arabic name, meaning)', () => {
    for (const c of chapters) {
      const text = shareText({ name: 'Guess the Surah', n: 7, resultLine: resultLine(true, 2), host });
      expect(text).toBe(`Guess the Surah #7 · solved on clue 2 of 4\n${host}`);
      assertNoAnswer(text, [c.name_simple, c.name_arabic, c.nameMeaning!]);
    }
  });
  test('the number is checked too, using a puzzle whose answer number cannot collide with the template digits', () => {
    const c = chapters.find(x => x.number === 77)!;
    for (const hints of [1, 2, 3, 4]) for (const ok of [true, false]) {
      assertNoAnswer(shareText({ name: 'Guess the Surah', n: 5, resultLine: resultLine(ok, hints), host }), [c.name_simple, String(c.number), c.nameMeaning!]);
    }
    expect(() => assertNoAnswer('It is Al-Fatihah', ['al-fatihah'])).toThrow();
  });
  test('wrong answers still carry no answer', () => { expect(resultLine(false, 3)).toBe('not solved, 3 of 4 clues used'); });
});

describe('reminder', () => {
  test('the calendar file repeats daily at the chosen time and is local', () => {
    const ics = dailyReminderIcs({ name: 'Guess the Surah', host, time: '20:00', now: new Date(2026, 10, 12, 9, 0) })!;
    expect(ics).toContain('RRULE:FREQ=DAILY'); expect(ics).toContain('DTSTART:20261112T200000'); expect(localDateKey(new Date(2026, 10, 12))).toBe('2026-11-12');
    expect(dailyReminderIcs({ name: 'x', host, time: '25:00', now: new Date() })).toBeNull();
  });
});
