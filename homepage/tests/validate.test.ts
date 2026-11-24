import {describe, expect, test} from 'bun:test';
import {cleanPageUrl, validateEvent, validateFeedback} from '../functions/_lib/validate';

const NOW = Date.UTC(2026, 10, 11, 12, 0, 0);
const valid = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  app_slug: 'ayah-threads',
  page_url: 'https://ayah-threads.moongazer.tech/themes/?x=1#top',
  category: 'bug_report',
  message: 'The theme note for puzzle #1 is wrong.',
  website: '',
  t: '5000',
  contact: '',
  ...overrides,
});

describe('validateFeedback: storage', () => {
  test('a valid form with a timestamp stores a cleaned row', () => {
    expect(validateFeedback(valid())).toEqual({
      kind: 'store',
      app_slug: 'ayah-threads',
      page_url: 'https://ayah-threads.moongazer.tech/themes/',
      category: 'bug_report',
      message: 'The theme note for puzzle #1 is wrong.',
      contact: null,
      no_js: false,
    });
  });

  test('a missing timestamp stores with no_js set', () => {
    const decision = validateFeedback(valid({t: undefined}));
    expect(decision.kind === 'store' && decision.no_js).toBe(true);
  });

  test('an empty timestamp is treated as no JavaScript', () => {
    const decision = validateFeedback(valid({t: ''}));
    expect(decision.kind === 'store' && decision.no_js).toBe(true);
  });

  test('message is trimmed and contact is kept when it is an email', () => {
    const decision = validateFeedback(valid({message: '   0123456789   ', contact: ' reader@example.org '}));
    expect(decision).toMatchObject({kind: 'store', message: '0123456789', contact: 'reader@example.org'});
  });
});

describe('validateFeedback: honeypot and timing drop silently', () => {
  test.each([
    ['honeypot filled', {website: 'http://spam.example'}],
    ['honeypot filled with spaces', {website: ' '}],
    ['open for 2,999 ms', {t: '2999'}],
    ['negative elapsed time', {t: '-1000'}],
    ['open for more than 24 hours', {t: String(24 * 60 * 60 * 1000 + 1)}],
    ['elapsed time not numeric', {t: 'yesterday'}],
    ['elapsed time with a decimal point', {t: '3000.5'}],
  ])('%s', (_name, overrides) => {
    expect(validateFeedback(valid(overrides))).toEqual({kind: 'drop'});
  });

  test('exactly 3,000 ms is accepted', () => {
    expect(validateFeedback(valid({t: '3000'})).kind).toBe('store');
  });

  test('exactly 24 hours is accepted', () => {
    expect(validateFeedback(valid({t: String(24 * 60 * 60 * 1000)})).kind).toBe('store');
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
    expect(validateFeedback(valid(overrides))).toEqual({kind: 'reject', reason});
  });

  test('a message of exactly 10 characters is accepted', () => {
    expect(validateFeedback(valid({message: '0123456789'})).kind).toBe('store');
  });

  test('a message of exactly 2,000 characters is accepted', () => {
    expect(validateFeedback(valid({message: 'a'.repeat(2000)})).kind).toBe('store');
  });

  test('a message counts characters, not UTF-16 units', () => {
    // 10 code points outside the BMP would count as 20 UTF-16 units; here 10 code points.
    expect(validateFeedback(valid({message: '\u{1F54C}'.repeat(10)})).kind).toBe('store');
  });
});

describe('cleanPageUrl', () => {
  test.each([
    ['apex host', 'https://moongazer.tech/about/?q=1', 'ayah-threads', 'https://moongazer.tech/about/'],
    ['own app subdomain', 'https://ayah-threads.moongazer.tech/a/#frag', 'ayah-threads', 'https://ayah-threads.moongazer.tech/a/'],
    ['uppercase host is normalised', 'https://AYAH-THREADS.MOONGAZER.TECH/', 'ayah-threads', 'https://ayah-threads.moongazer.tech/'],
  ])('accepts %s', (_name, raw, slug, expected) => {
    expect(cleanPageUrl(raw, slug)).toBe(expected);
  });

  test.each([
    ['http scheme', 'http://ayah-threads.moongazer.tech/', 'ayah-threads'],
    ['another app subdomain', 'https://seerah-timeline.moongazer.tech/', 'ayah-threads'],
    ['foreign host', 'https://example.com/', 'ayah-threads'],
    ['lookalike host', 'https://moongazer.tech.evil.example/', 'ayah-threads'],
    ['explicit port', 'https://moongazer.tech:8443/', 'ayah-threads'],
    ['credentials in URL', 'https://user:pw@moongazer.tech/', 'ayah-threads'],
    ['not a URL', 'moongazer.tech/about', 'ayah-threads'],
    ['empty', '', 'ayah-threads'],
    ['over 300 characters after cleaning', `https://moongazer.tech/${'a'.repeat(300)}`, 'ayah-threads'],
  ])('rejects %s', (_name, raw, slug) => {
    expect(cleanPageUrl(raw, slug)).toBeNull();
  });
});

describe('validateEvent', () => {
  test('a valid beacon stores the UTC date from the server clock', () => {
    const late = Date.UTC(2026, 10, 11, 23, 59, 59, 999);
    expect(validateEvent('{"a":"ayah-threads","i":"home","e":"activity_started"}', late)).toEqual({
      kind: 'store',
      date: '2026-11-11',
      app_slug: 'ayah-threads',
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
    ['item id with uppercase', '{"a":"ayah-threads","i":"Al-Fatiha","e":"activity_started"}'],
    ['item id with a space', '{"a":"ayah-threads","i":"a b","e":"activity_started"}'],
    ['item id of 65 characters', `{"a":"ayah-threads","i":"${'a'.repeat(65)}","e":"activity_started"}`],
    ['empty item id', '{"a":"ayah-threads","i":"","e":"activity_started"}'],
    ['unknown app', '{"a":"not-an-app","i":"home","e":"activity_started"}'],
    ['unknown event', '{"a":"ayah-threads","i":"home","e":"page_view"}'],
    ['extra key', '{"a":"ayah-threads","i":"home","e":"activity_started","u":"x"}'],
    ['missing key', '{"a":"ayah-threads","e":"activity_started"}'],
    ['numeric app slug', '{"a":1,"i":"home","e":"activity_started"}'],
    ['array body', '["ayah-threads","home","activity_started"]'],
    ['invalid JSON', '{"a":'],
    ['empty body', ''],
    ['body over 512 bytes', `{"a":"ayah-threads","i":"${'a'.repeat(520)}","e":"activity_started"}`],
  ])('ignores %s', (_name, body) => {
    expect(validateEvent(body, NOW)).toEqual({kind: 'ignore'});
  });
});
