// Business track helpers: the saved-bookmark id list and its validator.
// Pure module (no DOM) so tests can import it.
import data from '../data/content.json';

export const BUSINESS_BOOKMARKS = 'business-bookmarks';
export const businessIds: string[] = data.business.map(item => item.id);

/** Unique known business ids, no more than the number of scenarios. */
export const validBookmarks = (value: unknown): value is string[] => Array.isArray(value) && value.length <= businessIds.length && new Set(value).size === value.length && value.every(id => typeof id === 'string' && businessIds.includes(id));
