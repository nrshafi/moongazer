import { shuffle, hash } from './utils';
export interface Chapter { number:number;name_simple:string;name_arabic:string;verses_count:number;revelation_place:string; }
export type Pool='all'|'short'|'makkah'|'madinah';
export function collection(chapters:Chapter[],pool:Pool) { return chapters.filter(s=>pool==='all'||pool==='short'&&s.verses_count<=30||s.revelation_place===pool); }
export function roundIds(chapters:Chapter[],pool:Pool,length:number,seed:string) { return shuffle(collection(chapters,pool),hash(seed+pool)).slice(0,Math.min(length,chapters.length)).map(s=>s.number); }
export function options(chapters:Chapter[],answer:number,seed:string) { const other=shuffle(chapters.filter(s=>s.number!==answer),hash(seed+answer)).slice(0,3);return shuffle([...other,chapters.find(s=>s.number===answer)!],hash(seed+answer+'options')); }
export function points(correct:boolean,hints:number) { return correct?Math.max(25,100-(Math.min(4,Math.max(1,hints))-1)*25):0; }
export interface ClueVerse { arabic:string;translation:string;translationUrl:string; }
type VerseMap=Record<string,ClueVerse|undefined>;
const normArabic=(text:string)=>text.replace(/[ـً-ٰٟۖ-ۭ]/g,'').replace(/[آأإٱ]/g,'ا').replace(/\s+/g,' ').trim();
const normEnglish=(text:string)=>text.toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
/**
 * Picks which ayah of each surah serves as clue 1. A surah starts with ayah 1; whenever its clue text (normalized
 * English or Arabic) is shared with another surah's clue, the surah(s) at the highest ayah number involved move to the
 * next ayah, so identical openings (الٓمٓ, حمٓ, ...) use ayah 2 and, if that still collides, ayah 3.
 * Returns the ayah number per surah; the text itself is always the unmodified canonical record.
 */
export function clueAyahs(chapters:Chapter[],verses:VerseMap):Record<number,number> {
  const pick:Record<number,number>=Object.fromEntries(chapters.map(c=>[c.number,1]));
  for(let pass=0;pass<chapters.length;pass++){
    const groups=new Map<string,number[]>();
    for(const c of chapters){const v=verses[`${c.number}:${pick[c.number]}`];if(!v)throw new Error(`Missing clue ayah ${c.number}:${pick[c.number]}`);for(const key of [`ar:${normArabic(v.arabic)}`,`en:${normEnglish(v.translation)}`])groups.set(key,[...(groups.get(key)||[]),c.number]);}
    const bump=new Set<number>();
    for(const members of groups.values()){if(members.length<2)continue;const top=Math.max(...members.map(n=>pick[n]!));for(const n of members)if(pick[n]===top)bump.add(n);}
    if(!bump.size)return pick;
    for(const n of bump)pick[n]!++;
  }
  throw new Error('Clue ayahs did not converge');
}
export function clueVerse(chapters:Chapter[],verses:VerseMap,surah:number) { const ayah=clueAyahs(chapters,verses)[surah]!;return {ayah,ref:`${surah}:${ayah}`,verse:verses[`${surah}:${ayah}`]!}; }
