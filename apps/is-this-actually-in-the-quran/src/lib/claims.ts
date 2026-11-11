import { normalize } from './engine';

export const categories = ['In the Quran (exact ayah)', 'A hadith, not the Quran', 'A paraphrase of an ayah', 'Not found in the Quran', 'Misreads the source'] as const;
export type Category = typeof categories[number];

export interface ClaimLink { id: string; question: string; keywords: string[] }

/** Claims whose keywords match a search query (whole words, either direction). At most three, in data order. */
export function matchClaims<T extends ClaimLink>(query: string, claims: readonly T[]): T[] {
  const q = normalize(query);
  if (q.length < 3) return [];
  return claims.filter(claim => claim.keywords.some(keyword => {
    const k = normalize(keyword);
    return k.length > 0 && ((' ' + q + ' ').includes(' ' + k + ' ') || (q.length >= 4 && (' ' + k + ' ').includes(' ' + q + ' ')));
  })).slice(0, 3);
}

/** Saved claim ids: a unique list of known ids, no longer than the number of claims. */
export function validBookmarks(known: readonly string[]) {
  const set = new Set(known);
  return (value: unknown): value is string[] => Array.isArray(value) && value.length <= set.size && new Set(value).size === value.length && value.every(id => typeof id === 'string' && set.has(id));
}
