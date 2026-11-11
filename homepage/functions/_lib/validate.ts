// Pure validation for the first-party feedback form and event beacon (P4).
// No Workers or DOM types here, so `bun test homepage/tests` runs this file directly.
// The Functions in ../api/ own all I/O; this module only decides what may be stored.
import allowlist from './apps.json';

export const CATEGORIES = ['source_or_text_correction', 'bug_report', 'feature_request'] as const;
export const EVENT_TYPES = ['activity_started', 'activity_completed', 'share_clicked'] as const;
export type Category = (typeof CATEGORIES)[number];
export type EventType = (typeof EVENT_TYPES)[number];

export const MIN_SUBMIT_MS = 3_000;
export const MAX_SUBMIT_AGE_MS = 24 * 60 * 60 * 1000;
export const MAX_EVENT_BYTES = 512;
export const MAX_PAGE_URL = 300;
export const MAX_CONTACT = 200;
export const MIN_MESSAGE = 10;
export const MAX_MESSAGE = 2000;

const APP_SLUGS: ReadonlySet<string> = new Set(allowlist as string[]);
const ITEM_ID = /^[a-z0-9-]{1,64}$/;
const MILLISECONDS = /^\d{1,15}$/;

export type FeedbackDecision =
  // Valid: insert one pending row.
  | {
      kind: 'store';
      app_slug: string;
      page_url: string;
      category: Category;
      message: string;
      contact: string | null;
      no_js: boolean;
    }
  // Honeypot or timing failed: answer exactly like success and store nothing.
  | { kind: 'drop' }
  // Invalid field: answer 400 with this fixed reason (never echo input).
  | { kind: 'reject'; reason: string };

export type EventDecision =
  | { kind: 'store'; date: string; app_slug: string; item_id: string; event_type: EventType }
  // Malformed or unknown: answer 204 and store nothing.
  | { kind: 'ignore' };

function text(fields: Record<string, unknown>, name: string): string | undefined {
  const value = fields[name];
  return typeof value === 'string' ? value : undefined;
}

// Accepts only https URLs on moongazer.tech or <app_slug>.moongazer.tech, with no port or
// credentials. The query and fragment are dropped before storing.
export function cleanPageUrl(raw: string, appSlug: string): string | null {
  if (!raw || raw.length > 2000) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  if (url.hostname !== 'moongazer.tech' && url.hostname !== `${appSlug}.moongazer.tech`) return null;
  url.search = '';
  url.hash = '';
  const cleaned = url.toString();
  return cleaned.length <= MAX_PAGE_URL ? cleaned : null;
}

export function validateFeedback(fields: Record<string, unknown>): FeedbackDecision {
  // Honeypot: a real visitor never fills the hidden "website" field.
  if ((text(fields, 'website') ?? '') !== '') return { kind: 'drop' };

  // Timing: t is how long the page was open before submit, in ms, measured by the page itself with
  // performance.now() (monotonic, so a wrong device clock cannot drop real feedback). Absent t means no JS.
  const sent = text(fields, 't');
  const no_js = sent === undefined || sent === '';
  if (!no_js) {
    if (!MILLISECONDS.test(sent)) return { kind: 'drop' };
    const age = Number(sent);
    if (age < MIN_SUBMIT_MS || age > MAX_SUBMIT_AGE_MS) return { kind: 'drop' };
  }

  const app_slug = (text(fields, 'app_slug') ?? '').trim();
  if (!APP_SLUGS.has(app_slug)) return { kind: 'reject', reason: 'Unknown app.' };

  const page_url = cleanPageUrl((text(fields, 'page_url') ?? '').trim(), app_slug);
  if (page_url === null) return { kind: 'reject', reason: 'Page address is not valid.' };

  const category = (text(fields, 'category') ?? '').trim();
  if (!(CATEGORIES as readonly string[]).includes(category)) return { kind: 'reject', reason: 'Choose a category.' };

  const message = (text(fields, 'message') ?? '').trim();
  const length = Array.from(message).length;
  if (length < MIN_MESSAGE || length > MAX_MESSAGE) {
    return { kind: 'reject', reason: `Message must be ${MIN_MESSAGE} to ${MAX_MESSAGE} characters.` };
  }

  const contactRaw = (text(fields, 'contact') ?? '').trim();
  let contact: string | null = null;
  if (contactRaw !== '') {
    if (contactRaw.length > MAX_CONTACT || !contactRaw.includes('@')) {
      return { kind: 'reject', reason: 'Contact must be an email address of 200 characters or fewer.' };
    }
    contact = contactRaw;
  }

  return {
    kind: 'store',
    app_slug,
    page_url,
    category: category as Category,
    message,
    contact,
    no_js,
  };
}

// Beacon body: JSON {"a": app_slug, "i": item_id, "e": event_type}, at most 512 bytes.
export function validateEvent(body: string, nowMs: number): EventDecision {
  if (new TextEncoder().encode(body).length > MAX_EVENT_BYTES) return { kind: 'ignore' };

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return { kind: 'ignore' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { kind: 'ignore' };
  if (Object.keys(data).sort().join(',') !== 'a,e,i') return { kind: 'ignore' };

  const { a, i, e } = data as Record<string, unknown>;
  if (typeof a !== 'string' || !APP_SLUGS.has(a)) return { kind: 'ignore' };
  if (typeof i !== 'string' || !ITEM_ID.test(i)) return { kind: 'ignore' };
  if (typeof e !== 'string' || !(EVENT_TYPES as readonly string[]).includes(e)) return { kind: 'ignore' };

  return {
    kind: 'store',
    date: new Date(nowMs).toISOString().slice(0, 10),
    app_slug: a,
    item_id: i,
    event_type: e as EventType,
  };
}
