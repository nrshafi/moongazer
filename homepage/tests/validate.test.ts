import {describe, expect, test} from 'bun:test';
import {cleanPageUrl, validateEvent, validateFeedback} from '../functions/_lib/validate';

const NOW = Date.UTC(2026, 10, 11, 12, 0, 0);
const valid = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  app_slug: 'guess-the-surah',
  page_url: 'https://guess-the-surah.moongazer.tech/quiz/?x=1#top',
  category: 'bug_report',
  message: 'The clue for Al-Fatiha is wrong.',
  website: '',
  t: String(NOW - 5_000),
  contact: '',
  ...overrides,
});

describe('validateFeedback: storage', () => {
  test('a valid form with a timestamp stores a cleaned row', () => {
    expect(validateFeedback(valid(), NOW)).toEqual({
      kind: 'store',
      app_slug: 'guess-the-surah',
      page_url: 'https://guess-the-surah.moongazer.tech/quiz/',
      category: 'bug_report',
      message: 'The clue for Al-Fatiha is wrong.',
      contact: null,
      no_js: false,
    });
  });

  test('a missing timestamp stores with no_js set', () => {
    const decision = validateFeedback(valid({t: undefined}), NOW);
    expect(decision.kind === 'store' && decision.no_js).toBe(true);
  });

  test('an empty timestamp is treated as no JavaScript', () => {
    const decision = validateFeedback(valid({t: ''}), NOW);
    expect(decision.kind === 'store' && decision.no_js).toBe(true);
  });

  test('message is trimmed and contact is kept when it is an email', () => {
    const decision = validateFeedback(valid({message: '   0123456789   ', contact: ' reader@example.org '}), NOW);
    expect(decision).toMatchObject({kind: 'store', message: '0123456789', contact: 'reader@example.org'});
  });
});

describe('validateFeedback: honeypot and timing drop silently', () => {
  test.each([
    ['honeypot filled', {website: 'http://spam.example'}],
    ['honeypot filled with spaces', {website: ' '}],
    ['timestamp 2,999 ms old', {t: String(NOW - 2_999)}],
    ['timestamp in the future', {t: String(NOW + 1_000)}],
    ['timestamp older than 24 hours', {t: String(NOW - 24 * 60 * 60 * 1000 - 1)}],
    ['timestamp not numeric', {t: 'yesterday'}],
    ['timestamp with a decimal point', {t: '1.5'}],
  ])('%s', (_name, overrides) => {
    expect(validateFeedback(valid(overrides), NOW)).toEqual({kind: 'drop'});
  });

  test('exactly 3,000 ms is accepted', () => {
    expect(validateFeedback(valid({t: String(NOW - 3_000)}), NOW).kind).toBe('store');
  });

  test('exactly 24 hours is accepted', () => {
    expect(validateFeedback(valid({t: String(NOW - 24 * 60 * 60 * 1000)}), NOW).kind).toBe('store');
  });
});

describe('validateFeedback: field rules reject', () => {
  test.each([
    ['unknown app slug', {app_slug: 'not-an-app'}, 'Unknown app.'],
    ['missing app slug', {app_slug: undefined}, 'Unknown app.'],
    ['unknown category', {category: 'praise'}, 'Choose a category.'],
    ['missing category', {category: undefined}, 'Choose a category.'],
    ['message of 9 characters', {message: '012345678'}, 'Message must be 10 to 2000 characters.'],
    ['message of 2,001 characters', {message: 'a'.repeat(2001)}, 'Message must be 10 to 2000 characters.'],
    ['contact without @', {contact: 'reader at example'}, 'Contact must be an email address of 200 characters or fewer.'],
    ['contact over 200 characters', {contact: `${'a'.repeat(197)}@x.y`}, 'Contact must be an email address of 200 characters or fewer.'],
  ])('%s', (_name, overrides, reason) => {
    expect(validateFeedback(valid(overrides), NOW)).toEqual({kind: 'reject', reason});
  });

  test('a message of exactly 10 characters is accepted', () => {
    expect(validateFeedback(valid({message: '0123456789'}), NOW).kind).toBe('store');
  });

  test('a message of exactly 2,000 characters is accepted', () => {
    expect(validateFeedback(valid({message: 'a'.repeat(2000)}), NOW).kind).toBe('store');
  });

  test('a message counts characters, not UTF-16 units', () => {
    // 10 Arabic-script characters outside the BMP would count as 20 units; here 10 code points.
    expect(validateFeedback(valid({message: '\u{1F54C}'.repeat(10)}), NOW).kind).toBe('store');
  });
});

describe('cleanPageUrl', () => {
  test.each([
    ['apex host', 'https://moongazer.tech/about/?q=1', 'guess-the-surah', 'https://moongazer.tech/about/'],
    ['own app subdomain', 'https://guess-the-surah.moongazer.tech/a/#frag', 'guess-the-surah', 'https://guess-the-surah.moongazer.tech/a/'],
    ['uppercase host is normalised', 'https://GUESS-THE-SURAH.MOONGAZER.TECH/', 'guess-the-surah', 'https://guess-the-surah.moongazer.tech/'],
  ])('accepts %s', (_name, raw, slug, expected) => {
    expect(cleanPageUrl(raw, slug)).toBe(expected);
  });

  test.each([
    ['http scheme', 'http://guess-the-surah.moongazer.tech/', 'guess-the-surah'],
    ['another app subdomain', 'https://quran-connections.moongazer.tech/', 'guess-the-surah'],
    ['foreign host', 'https://example.com/', 'guess-the-surah'],
    ['lookalike host', 'https://moongazer.tech.evil.example/', 'guess-the-surah'],
    ['explicit port', 'https://moongazer.tech:8443/', 'guess-the-surah'],
    ['credentials in URL', 'https://user:pw@moongazer.tech/', 'guess-the-surah'],
    ['not a URL', 'moongazer.tech/about', 'guess-the-surah'],
    ['empty', '', 'guess-the-surah'],
    ['over 300 characters after cleaning', `https://moongazer.tech/${'a'.repeat(300)}`, 'guess-the-surah'],
  ])('rejects %s', (_name, raw, slug) => {
    expect(cleanPageUrl(raw, slug)).toBeNull();
  });
});

describe('validateEvent', () => {
  test('a valid beacon stores the UTC date from the server clock', () => {
    const late = Date.UTC(2026, 10, 11, 23, 59, 59, 999);
    expect(validateEvent('{"a":"guess-the-surah","i":"home","e":"activity_started"}', late)).toEqual({
      kind: 'store',
      date: '2026-11-11',
      app_slug: 'guess-the-surah',
      item_id: 'home',
      event_type: 'activity_started',
    });
  });

  test('the date rolls over at UTC midnight', () => {
    const next = Date.UTC(2026, 10, 12, 0, 0, 0, 0);
    const decision = validateEvent('{"a":"directory","i":"search","e":"share_clicked"}', next);
    expect(decision.kind === 'store' && decision.date).toBe('2026-11-12');
  });

  test.each([
    ['item id with uppercase', '{"a":"guess-the-surah","i":"Al-Fatiha","e":"activity_started"}'],
    ['item id with a space', '{"a":"guess-the-surah","i":"a b","e":"activity_started"}'],
    ['item id of 65 characters', `{"a":"guess-the-surah","i":"${'a'.repeat(65)}","e":"activity_started"}`],
    ['empty item id', '{"a":"guess-the-surah","i":"","e":"activity_started"}'],
    ['unknown app', '{"a":"not-an-app","i":"home","e":"activity_started"}'],
    ['unknown event', '{"a":"guess-the-surah","i":"home","e":"page_view"}'],
    ['extra key', '{"a":"guess-the-surah","i":"home","e":"activity_started","u":"x"}'],
    ['missing key', '{"a":"guess-the-surah","e":"activity_started"}'],
    ['numeric app slug', '{"a":1,"i":"home","e":"activity_started"}'],
    ['array body', '["guess-the-surah","home","activity_started"]'],
    ['invalid JSON', '{"a":'],
    ['empty body', ''],
    ['body over 512 bytes', `{"a":"guess-the-surah","i":"${'a'.repeat(520)}","e":"activity_started"}`],
  ])('ignores %s', (_name, body) => {
    expect(validateEvent(body, NOW)).toEqual({kind: 'ignore'});
  });
});
