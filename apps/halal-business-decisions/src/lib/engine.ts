export interface Choice {label:string; consequence:string; signal:string;}
export interface DecisionCase { choices:Choice[]; repairs:Choice[]; }
export interface Trail { version:1; choices:number[]; seed?:number; }
export function validTrail(value:unknown, item:DecisionCase): value is Trail {
  if(!value||typeof value!=='object')return false;
  const state=value as Partial<Trail>;
  return state.version===1&&(state.seed===undefined||(Number.isInteger(state.seed)&&state.seed>=0&&state.seed<2147483647))&&Array.isArray(state.choices)&&state.choices.length<=2&&state.choices.every((choice,index)=>Number.isInteger(choice)&&choice>=0&&choice<(index===0?item.choices.length:item.repairs.length));
}
export function addDecision(state:Trail,index:number,item:DecisionCase):Trail {
  if(!validTrail(state,item)||state.choices.length>=2)throw new Error('The decision trail is complete or invalid');
  const next:Trail={...state,choices:[...state.choices,index]};
  if(!validTrail(next,item))throw new Error('Choose an available response');
  return next;
}
export function decisionLedger(state:Trail,item:DecisionCase) {
  if(!validTrail(state,item))throw new Error('Invalid decision trail');
  return state.choices.map((choice,index)=>(index===0?item.choices:item.repairs)[choice]!);
}
/** Display order for a stage's options: a seeded permutation of original indices, so saved trails keep choice identity. */
export function optionOrder(count:number,seed:number,stage:0|1):number[]{
  const order=Array.from({length:count},(_,i)=>i);let state=((seed>>>0)^(stage?0x9e3779b9:0))>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j]!,order[i]!];}
  return order;
}
export const newSeed=(random:()=>number=Math.random)=>Math.floor(random()*2147483647);
