import { test, expect } from 'bun:test';
import data from '../src/data/content.json';

// C2 / T6.3: passages come from at least two surahs, and distractors are real bank themes with limits.

/**
 * Near-synonym and overlap blocklist, by theme id. A listed theme may never be a distractor for the key theme (and the
 * reverse): either the two are near-synonyms (Mercy and Forgiveness), or the answer's passages explicitly mention the
 * other theme (the Patience set names prayer; the Parents set names gratitude).
 */
const BLOCK: Record<string, string[]> = {
  'patience': ['hope', 'trust-in-allah', 'time-and-effort', 'prayer', 'forgiveness', 'fasting'],
  'gratitude': ['parents', 'fasting', 'night-and-day', 'prayer'],
  'justice': ['parents', 'truthfulness', 'truth-and-falsehood', 'accountability', 'reconciliation', 'keeping-commitments', 'kindness'],
  'giving': ['orphans', 'kindness', 'hospitality', 'moderation', 'prayer', 'fasting', 'consultation'],
  'mercy': ['giving', 'forgiveness', 'kindness', 'hope', 'gentle-responses', 'reconciliation'],
  'forgiveness': ['justice', 'giving', 'mercy', 'hope', 'reconciliation', 'gentle-responses', 'kindness', 'consultation'],
  'truthfulness': ['truth-and-falsehood', 'careful-speech', 'justice', 'keeping-commitments', 'time-and-effort'],
  'parents': ['careful-speech', 'gentle-responses', 'kindness', 'gratitude', 'human-relationships', 'orphans', 'consultation'],
  'learning': ['signs-in-creation', 'time-and-effort', 'truth-and-falsehood'],
  'trust-in-allah': ['patience', 'hope', 'consultation', 'prayer'],
  'humility': ['gentle-responses', 'kindness', 'moderation', 'careful-speech'],
  'careful-speech': ['truthfulness', 'gentle-responses', 'privacy', 'kindness', 'truth-and-falsehood', 'human-relationships'],
  'keeping-commitments': ['truthfulness', 'justice', 'orphans', 'accountability', 'truth-and-falsehood'],
  'privacy': ['careful-speech', 'hospitality', 'human-relationships'],
  'human-relationships': ['parents', 'reconciliation', 'kindness', 'orphans', 'consultation', 'privacy', 'hospitality'],
  'moderation': ['giving', 'humility'],
  'hope': ['mercy', 'forgiveness', 'patience', 'trust-in-allah', 'time-and-effort'],
  'time-and-effort': ['patience', 'prayer', 'truthfulness', 'hope', 'accountability', 'night-and-day', 'learning'],
  'signs-in-creation': ['night-and-day', 'learning', 'gratitude'],
  'night-and-day': ['signs-in-creation', 'time-and-effort', 'gratitude'],
  'prayer': ['giving', 'fasting', 'trust-in-allah', 'patience', 'time-and-effort'],
  'fasting': ['gratitude', 'giving', 'prayer', 'patience', 'orphans'],
  'truth-and-falsehood': ['truthfulness', 'justice', 'careful-speech', 'learning'],
  'kindness': ['prayer', 'parents', 'orphans', 'giving', 'hospitality', 'mercy', 'gentle-responses', 'humility', 'forgiveness', 'human-relationships', 'justice'],
  'orphans': ['giving', 'kindness', 'justice', 'keeping-commitments', 'parents', 'accountability'],
  'accountability': ['justice', 'keeping-commitments', 'time-and-effort', 'orphans', 'truth-and-falsehood'],
  'consultation': ['trust-in-allah', 'forgiveness', 'gentle-responses', 'prayer', 'giving', 'parents', 'kindness', 'mercy', 'human-relationships'],
  'reconciliation': ['forgiveness', 'human-relationships', 'justice', 'giving', 'kindness', 'mercy', 'gentle-responses'],
  'hospitality': ['giving', 'kindness', 'privacy', 'humility', 'human-relationships'],
  'gentle-responses': ['human-relationships', 'humility', 'kindness', 'careful-speech', 'mercy', 'forgiveness', 'reconciliation', 'consultation'],
};

const surahOf = (ref: string) => Number(ref.split(':')[0]);
const nameToId = new Map(data.puzzles.map(p => [p.theme, p.id]));

test('every puzzle draws its three passages from at least two surahs', () => {
  for (const p of data.puzzles) {
    expect(p.refs.length).toBe(3);
    expect(p.passages.map(x => x.ref)).toEqual(p.refs);
    expect(new Set(p.refs.map(surahOf)).size).toBeGreaterThanOrEqual(2);
  }
});

test('the theme library repeats the same refs, passages and theme as the puzzle bank', () => {
  for (const [i, p] of data.puzzles.entries()) {
    const t = data.themes[i]!;
    expect(t.id).toBe(p.id);
    expect(t.refs).toEqual(p.refs);
    expect(t.passages).toEqual(p.passages);
    expect(t.theme).toBe(p.theme);
    expect(t.anchor).toBe(p.anchor);
    expect(t.explanation).toBe(p.explanation);
    expect(t.title).toBe(`Thread ${String(p.number).padStart(2, '0')}: Quran ${p.refs[0]}, ${p.refs[1]} and ${p.refs[2]}`);
  }
});

/** Expands '96:1-5' to ['96:1', ..., '96:5']. */
const ayat = (ref: string): string[] => {
  const [surah, span] = ref.split(':') as [string, string];
  const [from, to = from] = span.split('-').map(Number) as [number, number?];
  return Array.from({ length: (to ?? from) - from + 1 }, (_, i) => `${surah}:${from + i}`);
};

test('no ayah appears in two puzzles, so a passage never points to two answers', () => {
  const seen = new Map<string, string>();
  for (const p of data.puzzles) {
    for (const ref of p.refs) {
      for (const key of ayat(ref)) {
        expect(seen.get(key), key).toBeUndefined();
        seen.set(key, p.id);
      }
    }
  }
});

test('distractors are three distinct bank themes and never the answer', () => {
  for (const p of data.puzzles) {
    expect(p.distractors.length).toBe(3);
    expect(new Set(p.distractors).size).toBe(3);
    for (const name of p.distractors) {
      expect(nameToId.has(name)).toBe(true);
      expect(name).not.toBe(p.theme);
    }
  }
});

test('each theme is used as a distractor at most three times across the bank', () => {
  const uses = new Map<string, number>();
  for (const p of data.puzzles) for (const name of p.distractors) uses.set(name, (uses.get(name) ?? 0) + 1);
  for (const [name, count] of uses) expect(count, name).toBeLessThanOrEqual(3);
});

test('the near-synonym blocklist is well formed and respected', () => {
  const ids = new Set(data.puzzles.map(p => p.id));
  for (const [id, list] of Object.entries(BLOCK)) {
    expect(ids.has(id), id).toBe(true);
    for (const other of list) {
      expect(ids.has(other), other).toBe(true);
      expect(other).not.toBe(id);
    }
  }
  const blocked = (a: string, b: string) => (BLOCK[a] ?? []).includes(b) || (BLOCK[b] ?? []).includes(a);
  for (const p of data.puzzles) {
    for (const name of p.distractors) {
      const other = nameToId.get(name)!;
      expect(blocked(p.id, other), `${p.theme} / ${name}`).toBe(false);
    }
  }
});
