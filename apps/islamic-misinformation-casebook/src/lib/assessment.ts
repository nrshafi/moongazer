export const verdicts=['Contradicted by the cited text','Needs context','Beyond the cited evidence'] as const;
export function assess(selected:unknown,expected:string){
  if(typeof selected!=='string'||!verdicts.includes(selected as typeof verdicts[number]))return {valid:false,correct:false};
  return {valid:true,correct:selected===expected};
}
