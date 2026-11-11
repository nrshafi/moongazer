import {shuffle} from './utils';
export const SEED_LIMIT=2147483647;
export type State={stage:number;choices:number[];seed?:number};
export const newSeed=()=>Math.floor(Math.random()*SEED_LIMIT);
export const validSeed=(value:unknown):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<SEED_LIMIT;
/** `counts` optionally bounds each stage's option index to that scenario's real option counts (default: 3 and 3). */
export const validState=(value:unknown,counts:readonly [number,number]=[3,3]):value is State=>{if(!value||typeof value!=='object')return false;const v=value as State;return [0,1,2].includes(v.stage)&&Array.isArray(v.choices)&&v.choices.every((n,i)=>Number.isInteger(n)&&n>=0&&n<(i===0?counts[0]:counts[1]))&&(v.stage===0?v.choices.length<=1:v.stage===1?v.choices.length===1:v.choices.length===2)&&(v.seed===undefined||validSeed(v.seed));};
/** Display order for a decision: a permutation of the ORIGINAL option indices. */
export function optionOrder(count:number,seed:number,stage:number):number[]{return shuffle(Array.from({length:count},(_,i)=>i),(seed^Math.imul(stage+1,0x9e3779b1))>>>0);}
export const FEEDBACK_GOOD='This choice protects trust.';
export const FEEDBACK_BAD='This choice may hurt trust. See what happens next.';
export const feedbackText=(constructive:boolean)=>constructive?FEEDBACK_GOOD:FEEDBACK_BAD;
