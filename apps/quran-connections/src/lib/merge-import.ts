import { runImport, type ImportRule } from './import';
import { read, write, announce } from './utils';

// Same validator Concept Atlas used for its `bookmarks` list: up to 100 theme ids.
const themeIds = (value: unknown): value is string[] => Array.isArray(value) && value.length <= 100 && value.every(item => typeof item === 'string' && /^[a-z-]{1,60}$/.test(item));

export const rules: ImportRule[] = [
  { from: 'quran-concept-atlas', key: 'bookmarks', to: () => 'theme-bookmarks', validate: themeIds, merge: 'union' },
];

export { themeIds };

/** Applies a `#import=` fragment, if present, before the page reads its saved items. */
export function applyImport(): number {
  return runImport(rules, {
    hash: location.hash,
    read: key => read(key, (_v): _v is unknown => true),
    write: (key, value) => write(key, value),
    clearHash: () => history.replaceState(null, '', location.pathname + location.search),
    announce,
  });
}
