export interface Group {id:string;terms:string[]}
export function match(selected:string[],groups:Group[]){if(selected.length!==4||new Set(selected).size!==4)return {group:null,near:false};const hit=groups.find(g=>g.terms.every(t=>selected.includes(t)));return {group:hit?.id||null,near:!hit&&groups.some(g=>g.terms.filter(t=>selected.includes(t)).length===3)};}
export interface Progress {puzzle:string;solved:string[];hints:string[];misses:number;seed:string;revealed:boolean}
export function valid(v:unknown,boards:{id:string;groups:string[]}[]):v is Progress{const p=v as Progress;const board=boards.find(b=>b.id===p?.puzzle);return !!board&&Array.isArray(p.solved)&&p.solved.length<=4&&new Set(p.solved).size===p.solved.length&&p.solved.every(id=>board.groups.includes(id))&&Array.isArray(p.hints)&&p.hints.length<=4&&new Set(p.hints).size===p.hints.length&&p.hints.every(id=>board.groups.includes(id))&&Number.isInteger(p.misses)&&p.misses>=0&&p.misses<=1000000&&typeof p.seed==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(p.seed)&&typeof p.revealed==='boolean';}

/** Daily mode ends after this many wrong checks (T6.4). Practice has no limit. */
export const MAX_MISSES = 4;

/** An accepted alternate grouping on a board: four terms that also share a real connection. Selecting exactly these is acknowledged, never counted as a miss. */
export interface Alternate { terms: string[]; note: string }
export function matchAlternate(selected: string[], alternates: readonly Alternate[] | undefined): Alternate | null {
  if (!alternates || selected.length !== 4 || new Set(selected).size !== 4) return null;
  return alternates.find(a => a.terms.length === 4 && a.terms.every(t => selected.includes(t))) ?? null;
}

/** Text label for each difficulty tier, so colour is never the only signal. */
export const TIER_LABELS: Record<number, string> = { 1: 'Tier 1 · most direct', 2: 'Tier 2 · direct', 3: 'Tier 3 · careful reading', 4: 'Tier 4 · least direct' };
export const tierLabel = (tier: number) => TIER_LABELS[tier] ?? `Tier ${tier}`;
/** Tiers are drawn from the family tokens only; this is the CSS class that carries the tier styling. */
export const tierClass = (tier: number) => `tier-${Math.min(4, Math.max(1, Math.round(tier) || 1))}`;

export const mistakesText = (n: number) => `${n} ${n === 1 ? 'mistake' : 'mistakes'}`;
/** Result line for the share text, for example "4 groups, 1 mistake" or "2 of 4 groups, 4 mistakes". Never names a group or term. */
export function resultLine(solvedCount: number, misses: number): string {
  return `${solvedCount === 4 ? '4 groups' : `${solvedCount} of 4 groups`}, ${mistakesText(misses)}`;
}

/** A finished daily board as stored under the `daily` key: the day number and the result. `board` is the board id, `solved` the group ids in the order they were found. */
export interface DailyResult { board: string; solved: string[]; misses: number; lost: boolean }
export interface DailySaved { n: number; result: DailyResult }
export function dailyValidator(boards: { id: string; groups: string[] }[]) {
  return (v: unknown): v is DailySaved => {
    const s = v as DailySaved;
    if (!s || typeof s !== 'object' || !Number.isInteger(s.n) || s.n < 1 || !s.result || typeof s.result !== 'object') return false;
    const r = s.result;
    const board = boards.find(b => b.id === r.board);
    return !!board && Array.isArray(r.solved) && r.solved.length <= 4 && new Set(r.solved).size === r.solved.length && r.solved.every(id => board.groups.includes(id))
      && Number.isInteger(r.misses) && r.misses >= 0 && r.misses <= MAX_MISSES && typeof r.lost === 'boolean' && (r.lost ? r.solved.length < 4 : r.solved.length === 4);
  };
}

/** Validator for the `solved` key: the board ids this device has finished. */
export function solvedValidator(boards: { id: string }[]) {
  return (v: unknown): v is string[] => Array.isArray(v) && v.length <= boards.length && new Set(v).size === v.length && v.every(id => typeof id === 'string' && boards.some(b => b.id === id));
}

const ARABIC = /[؀-ۿ]/;
/** True for a term written in Arabic script (the root groups), so the tile can be set in Arabic. */
export const isArabicTerm = (term: string) => ARABIC.test(term);
