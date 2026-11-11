export const relationships=['Transmitted occasion','General context','Response after revelation'] as const;
export function checkRelationship(selected:unknown,expected:string){
  return typeof selected==='string'&&relationships.includes(selected as typeof relationships[number])&&selected===expected;
}
export function relationshipAt(index:unknown){if(index===undefined||index===null||index==='')return undefined;const i=Number(index);return Number.isInteger(i)&&i>=0&&i<relationships.length?relationships[i]:undefined;}
