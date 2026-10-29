export const relationships=['Transmitted occasion','General context','Response after revelation'] as const;
export function checkRelationship(selected:unknown,expected:string){
  return typeof selected==='string'&&relationships.includes(selected as typeof relationships[number])&&selected===expected;
}
