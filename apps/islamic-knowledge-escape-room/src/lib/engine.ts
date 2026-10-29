export function sameSet(a:unknown[],b:unknown[]){return a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));}
export function canonicalOrder(refs:string[]){return [...refs].sort((a,b)=>{const [ac,av]=a.split(/[:-]/).map(Number),[bc,bv]=b.split(/[:-]/).map(Number);return ac!-bc!||av!-bv!;});}
export interface Progress{step:number;assisted:number[];seconds:number}
export function validProgress(v:unknown):v is Progress{const p=v as Progress;return !!p&&Number.isInteger(p.step)&&p.step>=0&&p.step<=4&&Array.isArray(p.assisted)&&p.assisted.length<=4&&new Set(p.assisted).size===p.assisted.length&&p.assisted.every(i=>Number.isInteger(i)&&i>=0&&i<4)&&Number.isFinite(p.seconds)&&p.seconds>=0&&p.seconds<=31536000;}
