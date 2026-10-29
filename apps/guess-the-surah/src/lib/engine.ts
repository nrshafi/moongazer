import { shuffle, hash } from './utils';
export interface Chapter { number:number;name_simple:string;name_arabic:string;verses_count:number;revelation_place:string; }
export type Pool='all'|'short'|'makkah'|'madinah';
export function collection(chapters:Chapter[],pool:Pool) { return chapters.filter(s=>pool==='all'||pool==='short'&&s.verses_count<=30||s.revelation_place===pool); }
export function roundIds(chapters:Chapter[],pool:Pool,length:number,seed:string) { return shuffle(collection(chapters,pool),hash(seed+pool)).slice(0,Math.min(length,chapters.length)).map(s=>s.number); }
export function options(chapters:Chapter[],answer:number,seed:string) { const other=shuffle(chapters.filter(s=>s.number!==answer),hash(seed+answer)).slice(0,3);return shuffle([...other,chapters.find(s=>s.number===answer)!],hash(seed+answer+'options')); }
export function points(correct:boolean,hints:number) { return correct?Math.max(25,100-(Math.min(4,Math.max(1,hints))-1)*25):0; }
