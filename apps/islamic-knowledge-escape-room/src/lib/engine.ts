export function sameSet(a:unknown[],b:unknown[]){return a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));}
export function canonicalOrder(refs:string[]){return [...refs].sort((a,b)=>{const [ac,av]=a.split(/[:-]/).map(Number),[bc,bv]=b.split(/[:-]/).map(Number);return ac!-bc!||av!-bv!;});}
export interface Progress{step:number;assisted:number[];seconds:number;seed:number}
export const SEED_LIMIT=2147483647;
export function newSeed(random:()=>number=Math.random){return Math.floor(random()*SEED_LIMIT);}
const validSeed=(s:unknown)=>Number.isInteger(s)&&(s as number)>=0&&(s as number)<SEED_LIMIT;
/** Accepts saved progress with or without a seed (records saved before per-play seeds existed). */
export function validProgress(v:unknown):v is Progress{const p=v as Progress;return !!p&&Number.isInteger(p.step)&&p.step>=0&&p.step<=4&&Array.isArray(p.assisted)&&p.assisted.length<=4&&new Set(p.assisted).size===p.assisted.length&&p.assisted.every(i=>Number.isInteger(i)&&i>=0&&i<4)&&Number.isFinite(p.seconds)&&p.seconds>=0&&p.seconds<=31536000&&(p.seed===undefined||validSeed(p.seed));}
/** Gives an old saved record a fresh seed; keeps the seed of a new one so a resumed board is identical. */
export function withSeed(p:Progress,random:()=>number=Math.random):Progress{return validSeed(p.seed)?p:{...p,seed:newSeed(random)};}
/** Per-lock seeds derived from one per-play seed. */
export function lockSeeds(seed:number){return {options:seed>>>0,matches:(seed^0x9e37)>>>0,refs:(seed^0x5bd1)>>>0,order:(seed^0x27d4)>>>0,snippets:(seed^0x165667)>>>0,other:(seed^0x3c6e)>>>0};}
/** Chooses the room whose passages supply lock 4 distractors, spread over every other room. */
export function pickOtherIndex(count:number,currentIndex:number,seed:number){if(count<2)throw new Error('Need at least two rooms');const pick=(seed>>>0)%(count-1);return pick>=currentIndex?pick+1:pick;}
