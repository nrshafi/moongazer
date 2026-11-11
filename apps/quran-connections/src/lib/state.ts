import data from '../data/content.json';
import { read } from './utils';

export interface PuzzleState { id: string; wrong: string[]; hint: boolean; solved: boolean; revealed: boolean; completed: string[] }

export const known = (id: unknown): id is string => typeof id === 'string' && data.puzzles.some(p => p.id === id);

/** The one validator for the `puzzle` storage record. Shared so a reader never discards what the puzzle wrote. */
export const validPuzzleState = (value: unknown): value is PuzzleState => {
  if (!value || typeof value !== 'object') return false;
  const v = value as PuzzleState;
  return known(v.id) && Array.isArray(v.wrong) && v.wrong.length <= 4 && v.wrong.every(s => typeof s === 'string') && typeof v.hint === 'boolean' && typeof v.solved === 'boolean' && typeof v.revealed === 'boolean' && Array.isArray(v.completed) && v.completed.length <= 30 && v.completed.every(known);
};

/** Ids of puzzles the visitor has solved or revealed, from the opted-in `puzzle` record (empty when nothing is remembered). */
export function solvedIds(): Set<string> {
  const state = read('puzzle', validPuzzleState);
  const ids = new Set<string>(state ? state.completed : []);
  if (state && (state.solved || state.revealed)) ids.add(state.id);
  return ids;
}
