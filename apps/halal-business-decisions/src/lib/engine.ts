export interface Choice {label:string; consequence:string; signal:string;}
export interface DecisionCase { choices:Choice[]; repairs:Choice[]; }
export interface Trail { version:1; choices:number[]; }
export function validTrail(value:unknown, item:DecisionCase): value is Trail {
  if(!value||typeof value!=='object')return false;
  const state=value as Partial<Trail>;
  return state.version===1&&Array.isArray(state.choices)&&state.choices.length<=2&&state.choices.every((choice,index)=>Number.isInteger(choice)&&choice>=0&&choice<(index===0?item.choices.length:item.repairs.length));
}
export function addDecision(state:Trail,index:number,item:DecisionCase):Trail {
  if(!validTrail(state,item)||state.choices.length>=2)throw new Error('The decision trail is complete or invalid');
  const next:Trail={version:1,choices:[...state.choices,index]};
  if(!validTrail(next,item))throw new Error('Choose an available response');
  return next;
}
export function decisionLedger(state:Trail,item:DecisionCase) {
  if(!validTrail(state,item))throw new Error('Invalid decision trail');
  return state.choices.map((choice,index)=>(index===0?item.choices:item.repairs)[choice]!);
}
