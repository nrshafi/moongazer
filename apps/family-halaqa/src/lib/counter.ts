// Anonymous aggregate counter (P4). Sends {app, item, event} to moongazer.tech with navigator.sendBeacon.
// No cookie, no identifier, no visitor text. Silent no-op on preview hosts, with Global Privacy Control,
// or when sendBeacon is missing. Never throws and never logs.
import { namespace } from './utils';

export type CounterEvent = 'activity_started' | 'activity_completed' | 'share_clicked';
const ENDPOINT = 'https://moongazer.tech/api/event';
const started = new Set<string>();

export function counterItemId(value: string): string | null {
  const id = String(value).toLowerCase();
  return id === 'home' || /^[a-z0-9-]{1,64}$/.test(id) ? id : null;
}

export function track(event: CounterEvent, itemId: string): boolean {
  try {
    if (!location.hostname.endsWith('moongazer.tech')) return false;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl === true || typeof nav.sendBeacon !== 'function') return false;
    const id = counterItemId(itemId);
    if (!id) return false;
    if (event === 'activity_started') { if (started.has(id)) return false; started.add(id); }
    return nav.sendBeacon(ENDPOINT, new Blob([JSON.stringify({ a: namespace(), i: id, e: event })], { type: 'text/plain' }));
  } catch { return false; }
}
