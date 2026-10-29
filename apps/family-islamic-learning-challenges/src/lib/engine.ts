export interface Pack { id:string; options:string[]; answer:number; }
export interface Session {version:1; answer:number|null; checked:boolean; done:boolean[];}
export function newSession():Session{return {version:1,answer:null,checked:false,done:[false,false,false]};}
export function validSession(value:unknown,pack:Pack):value is Session {
  if(!value||typeof value!=='object')return false;
  const state=value as Partial<Session>;
  if(state.version!==1||typeof state.checked!=='boolean'||!Array.isArray(state.done)||state.done.length!==3||state.done.some(item=>typeof item!=='boolean'))return false;
  if(state.answer!==null&&(!Number.isInteger(state.answer)||Number(state.answer)<0||Number(state.answer)>=pack.options.length))return false;
  if(state.checked&&state.answer===null)return false;
  if(state.done[0]!==Boolean(state.checked&&state.answer===pack.answer))return false;
  if(state.done[1]&&!state.done[0]||state.done[2]&&!state.done[1])return false;
  return true;
}
export function answerQuestion(state:Session,answer:number,pack:Pack):Session {
  if(!validSession(state,pack)||state.done[0]||!Number.isInteger(answer)||answer<0||answer>=pack.options.length)throw new Error('Invalid answer state');
  return {version:1,answer,checked:true,done:[answer===pack.answer,false,false]};
}
export function finishStep(state:Session,step:number,pack:Pack):Session {
  if(!validSession(state,pack)||![1,2].includes(step)||!state.done[step-1])throw new Error('Finish the earlier step first');
  return {...state,done:state.done.map((done,index)=>done||index===step)};
}
