import { runImport, type ImportRule } from './import';
import { read, write, announce } from './utils';
import { claimIdMap } from '../data/content.json';

/** Islamic Misinformation Casebook: its case ids, and the new claim id for each (T3.6). */
const map: Record<string, string> = claimIdMap;
const oldIds = Object.keys(map);
/** The casebook's own validator for `bookmarks` (src/lib/library.ts there): a unique list of known case ids. */
const validOld = (value: unknown): boolean => Array.isArray(value) && value.length <= oldIds.length && new Set(value).size === value.length && value.every(id => typeof id === 'string' && oldIds.includes(id));
const toClaimIds = (value: unknown): string[] | undefined => {
  const ids = [...new Set((value as string[]).map(id => map[id]).filter((id): id is string => typeof id === 'string'))];
  return ids.length ? ids : undefined;
};

export const rules: ImportRule[] = [
  { from: 'islamic-misinformation-casebook', key: 'bookmarks', to: () => 'claim-bookmarks', validate: validOld, map: toClaimIds, merge: 'union' }
];

/** Call on /claims/ pages: reads #import=… once, writes the mapped keys and clears the fragment. */
export function importSaved(): number {
  return runImport(rules, {
    hash: location.hash,
    read: key => read(key, (value): value is unknown => typeof value !== 'symbol'),
    write: (key, value) => write(key, value),
    clearHash: () => history.replaceState(null, '', location.pathname + location.search),
    announce
  });
}
