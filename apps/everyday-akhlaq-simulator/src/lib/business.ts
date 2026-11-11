// Business track helpers and the saved-item import rules for 'halal-business-decisions' (P3 T3.5).
// Pure module (no DOM) so tests can import it. Validators are copied from the old app (library.ts, engine.ts).
import data from '../data/content.json';
import type { ImportRule } from './import';
import type { State } from './choices';

export const OLD_APP = 'halal-business-decisions';
export const BUSINESS_BOOKMARKS = 'business-bookmarks';
export const businessIds: string[] = data.business.map(item => item.id);

/** Old library.ts validator: unique known case ids, no more than the number of cases. */
export const validBookmarks = (value: unknown): value is string[] => Array.isArray(value) && value.length <= businessIds.length && new Set(value).size === value.length && value.every(id => typeof id === 'string' && businessIds.includes(id));

/** Old engine.ts Trail and validTrail, checked against the case's option counts. */
export interface OldTrail { version: 1; choices: number[]; seed?: number }
export function validOldTrail(value: unknown, counts: readonly [number, number]): value is OldTrail {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<OldTrail>;
  return state.version === 1 && (state.seed === undefined || (Number.isInteger(state.seed) && state.seed! >= 0 && state.seed! < 2147483647)) && Array.isArray(state.choices) && state.choices.length <= 2 && state.choices.every((choice, index) => Number.isInteger(choice) && choice >= 0 && choice < (index === 0 ? counts[0] : counts[1]));
}

/** Old trail {version:1, choices:[a,b], seed?} to the unified scenario state: same original option indices. */
export function mapOldTrail(value: unknown): State {
  const trail = value as OldTrail;
  return { stage: trail.choices.length === 2 ? 2 : trail.choices.length, choices: [...trail.choices], ...(trail.seed === undefined ? {} : { seed: trail.seed }) };
}

export const importRules: ImportRule[] = [
  { from: OLD_APP, key: 'bookmarks', to: () => BUSINESS_BOOKMARKS, validate: validBookmarks, merge: 'union' },
  { from: OLD_APP, key: 'remember', to: () => 'remember', validate: value => typeof value === 'boolean', merge: 'keep' },
  // One rule per old case so each trail is validated against that case's own option counts; unknown case ids are ignored.
  ...data.business.map((item): ImportRule => ({
    from: OLD_APP,
    key: new RegExp(`^case-${item.id}$`),
    to: () => `business-${item.id}`,
    validate: value => validOldTrail(value, [item.options.length, item.options2.length]),
    map: mapOldTrail,
    merge: 'keep'
  }))
];
