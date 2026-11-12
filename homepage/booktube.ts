// P6 T6.8 (D24): production feed for recording daily videos. Run by build.mjs with Bun:
//   bun homepage/booktube.ts <out-file>
// Writes the next 60 daily puzzles (from today, or from launch day before the epoch): date, #N, and each app's item.
// It imports the apps' own selection modules, so the feed always matches what the apps show on that date.
// Spoilers are expected here: the file is not linked from any page, not in the sitemap, and served with noindex (_headers).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DAILY_EPOCH, dayNumber, localDateKey } from '../apps/guess-the-surah/src/lib/daily';
import * as surah from '../apps/guess-the-surah/src/lib/daily-bank';
import { clueVerse, clueLadder } from '../apps/guess-the-surah/src/lib/engine';
import gts from '../apps/guess-the-surah/src/data/content.json';
import * as seerah from '../apps/seerah-timeline/src/lib/daily-bank';
import * as groups from '../apps/word-groups/src/lib/daily-bank';
import * as threads from '../apps/ayah-threads/src/lib/daily-bank';
// @ts-ignore plain-JS module without types
import { ayahIndex } from './daily.js';

const DAYS = 60;
const out = process.argv[2];
if (!out) throw new Error('Usage: bun homepage/booktube.ts <out-file>');
const ayat: { ref: string }[] = JSON.parse(readFileSync(join(import.meta.dir, 'ayat-of-the-night.json'), 'utf8'));

const today = new Date();
const [y, m, d] = DAILY_EPOCH.split('-').map(Number) as [number, number, number];
const start = dayNumber(today) >= 1 ? new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12) : new Date(y, m - 1, d, 12);

const days = Array.from({ length: DAYS }, (_, i) => {
  const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, 12);
  const n = dayNumber(date);
  const chapter = surah.dailyItem(n);
  const clue = clueVerse(gts.chapters as never, gts.verses as never, chapter.number);
  const pair = seerah.dailyItem(n)!;
  const board = groups.dailyItem(n)!;
  const thread = threads.dailyItem(n)!;
  return {
    date: localDateKey(date),
    n,
    guessTheSurah: {
      surah: chapter.number,
      name: chapter.name_simple,
      clues: clueLadder(chapter as never, clue, false).map(c => ({ kind: c.kind, label: c.label, text: c.text, ...(c.kind === 'translation' || c.kind === 'arabic' ? { ref: clue.ref } : {}) })),
    },
    wordGroups: { board: board.id },
    ayahThreads: { puzzle: thread.id },
    seerahTimeline: { pair: pair.id, first: pair.first, second: pair.second },
    ayahOfTheNight: { ref: ayat[ayahIndex(date, ayat.length)]!.ref },
  };
});

const feed = {
  format: 'moongazer-booktube-1',
  note: 'Production feed for daily videos. Contains answers. Not linked, not in the sitemap, served with noindex.',
  epoch: DAILY_EPOCH,
  generated: localDateKey(today),
  bankVersions: { guessTheSurah: surah.BANK_VERSION, wordGroups: groups.BANK_VERSION, ayahThreads: threads.BANK_VERSION, seerahTimeline: seerah.BANK_VERSION },
  days,
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(feed, null, 2) + '\n');
console.log(`Booktube feed: ${days.length} days from ${days[0]!.date} (#${days[0]!.n}) -> ${out}`);
