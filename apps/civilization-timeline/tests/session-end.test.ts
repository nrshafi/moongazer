import { test, expect } from 'bun:test';
import { whatsappUrl, buildShareText, learnedLines } from '../src/lib/session-end';

test('whatsappUrl is wa.me with only the URL-encoded text and no tracking parameters', () => {
  const text = 'I finished a round of Guess the Surah!\nTry it: https://guess-the-surah.moongazer.tech/ & see "how far" you get';
  const url = whatsappUrl(text);
  expect(url.startsWith('https://wa.me/?text=')).toBe(true);
  expect(url).toBe('https://wa.me/?text=' + encodeURIComponent(text));
  const parsed = new URL(url);
  expect([...parsed.searchParams.keys()]).toEqual(['text']);
  expect(parsed.searchParams.get('text')).toBe(text);
  expect(url).not.toMatch(/utm_|ref=|fbclid|gclid/);
});

test('whatsappUrl encodes separators, non-ASCII text and the honorific exactly like encodeURIComponent', () => {
  const text = 'Peace ﷺ & mercy: 100% #1 ?x=y+z';
  const url = whatsappUrl(text);
  expect(url).toBe('https://wa.me/?text=' + encodeURIComponent(text));
  expect(url.split('?').length).toBe(2);
  expect(url).not.toContain(' ');
  expect(new URL(url).searchParams.get('text')).toBe(text);
});

test('buildShareText joins trimmed non-empty lines and adds nothing of its own', () => {
  expect(buildShareText(['  Guess the Surah #12  ', '', '7/10', 'https://guess-the-surah.moongazer.tech/'])).toBe('Guess the Surah #12\n7/10\nhttps://guess-the-surah.moongazer.tech/');
  expect(buildShareText([])).toBe('');
});

test('learnedLines keeps one to three non-empty lines', () => {
  expect(learnedLines(['a', ' ', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c']);
  expect(learnedLines(['  only one  '])).toEqual(['only one']);
});
