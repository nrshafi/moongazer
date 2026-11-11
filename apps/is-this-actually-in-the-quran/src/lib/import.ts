// Saved-item hand-over between merged apps (P3, D19). Identical copy in every app that sends or receives.
// The old app links to  https://<receiver>/<route>#import=<payload>
// payload = base64url(UTF-8 JSON {"v":1,"from":"<old-slug>","items":{"<oldKey>":<value>}}), at most 1,800 characters.
// The receiver validates every item with the old app's own validator, maps keys, merges, writes, then clears the fragment.
// Never eval, never put payload text into innerHTML.

export const IMPORT_VERSION = 1;
export const MAX_PAYLOAD = 1800;

export interface ImportPayload { v: 1; from: string; items: Record<string, unknown> }

export interface ImportRule {
  /** Old app slug the item must come from. */
  from: string;
  /** Old key, exact or a pattern such as /^case-[a-z0-9-]+$/. */
  key: string | RegExp;
  /** Receiver key for an accepted old key. */
  to: (oldKey: string) => string;
  /** The old app's validator for the value. */
  validate: (value: unknown) => boolean;
  /** Optional value mapping (for example old ids to new ids); return undefined to drop. */
  map?: (value: unknown) => unknown;
  /** union: merge string lists; keep: keep an existing value; replace: overwrite. */
  merge: 'union' | 'keep' | 'replace';
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error('Not base64url');
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}

/** Builds the fragment payload, or null when there is nothing to send or it would exceed the limit. */
export function encodePayload(from: string, items: Record<string, unknown>): string | null {
  const entries = Object.entries(items).filter(([, value]) => value !== undefined && value !== null);
  if (!entries.length) return null;
  const payload = toBase64Url(JSON.stringify({ v: IMPORT_VERSION, from, items: Object.fromEntries(entries) }));
  return payload.length <= MAX_PAYLOAD ? payload : null;
}

/** Decodes a location.hash such as "#import=…"; returns null for anything malformed. */
export function decodeFragment(hash: string): ImportPayload | null {
  if (!hash.startsWith('#import=')) return null;
  const encoded = hash.slice('#import='.length);
  if (!encoded || encoded.length > MAX_PAYLOAD) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as ImportPayload;
    if (!parsed || typeof parsed !== 'object' || parsed.v !== IMPORT_VERSION || typeof parsed.from !== 'string') return null;
    if (!parsed.items || typeof parsed.items !== 'object' || Array.isArray(parsed.items)) return null;
    return parsed;
  } catch { return null; }
}

const isStringList = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');

/** Pure planning step: which receiver keys to write with which values. Unknown sources and keys are ignored. */
export function planImport(payload: ImportPayload, rules: ImportRule[], existing: (key: string) => unknown): { writes: [string, unknown][]; accepted: number } {
  const writes: [string, unknown][] = [];
  let accepted = 0;
  for (const [oldKey, rawValue] of Object.entries(payload.items)) {
    const rule = rules.find(r => r.from === payload.from && (typeof r.key === 'string' ? r.key === oldKey : r.key.test(oldKey)));
    if (!rule || !rule.validate(rawValue)) continue;
    const value = rule.map ? rule.map(rawValue) : rawValue;
    if (value === undefined) continue;
    const key = rule.to(oldKey);
    const current = existing(key);
    if (rule.merge === 'keep' && current !== null && current !== undefined) { accepted++; continue; }
    if (rule.merge === 'union') {
      if (!isStringList(value)) continue;
      const base = isStringList(current) ? current : [];
      const merged = [...new Set([...base, ...value])];
      if (merged.length > 100) continue;
      accepted += value.length;
      writes.push([key, merged]);
      continue;
    }
    accepted++;
    writes.push([key, value]);
  }
  return { writes, accepted };
}

export interface ImportIO {
  hash: string;
  read: (key: string) => unknown;
  write: (key: string, value: unknown) => boolean;
  clearHash: () => void;
  announce: (message: string) => void;
}

/** Browser glue. Safe when storage is blocked: writes fail quietly and the fragment is still cleared. */
export function runImport(rules: ImportRule[], io: ImportIO): number {
  const payload = decodeFragment(io.hash);
  if (!io.hash.startsWith('#import=')) return 0;
  io.clearHash();
  if (!payload) return 0;
  let written = 0;
  try {
    const { writes, accepted } = planImport(payload, rules, key => { try { return io.read(key); } catch { return null; } });
    for (const [key, value] of writes) if (io.write(key, value)) written++;
    if (accepted && written) io.announce(`Saved items moved: ${accepted}`);
    else if (accepted && writes.length && !written) io.announce('Your saved items could not be stored in this browser.');
  } catch { /* never break the page */ }
  return written;
}
