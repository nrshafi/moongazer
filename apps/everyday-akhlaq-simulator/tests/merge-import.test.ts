import {test,expect} from 'bun:test';
import {encodePayload,decodeFragment,planImport} from '../src/lib/import';
import {importRules,mapOldTrail,validOldTrail,validBookmarks,OLD_APP} from '../src/lib/business';
import data from '../src/data/content.json';

const plan=(items:Record<string,unknown>,existing:Record<string,unknown>={},from=OLD_APP)=>{
 const payload=decodeFragment('#import='+encodePayload(from,items)!)!;
 return planImport(payload,importRules,key=>existing[key]??null);
};
const id=data.business[0]!.id;

test('bookmarks map to business-bookmarks as a union with existing ones; unknown ids invalidate the list',()=>{
 const ids=data.business.map(b=>b.id);
 expect(plan({bookmarks:[ids[1],ids[2]]},{'business-bookmarks':[ids[0],ids[1]]}).writes).toEqual([['business-bookmarks',[ids[0],ids[1],ids[2]]]]);
 expect(plan({bookmarks:[ids[0],'not-a-case']}).writes).toEqual([]);
 expect(plan({bookmarks:[ids[0],ids[0]]}).writes).toEqual([]);
 expect(validBookmarks('x')).toBe(false);
});
test('remember is kept when set and must be boolean',()=>{
 expect(plan({remember:true}).writes).toEqual([['remember',true]]);
 expect(plan({remember:true},{remember:false}).writes).toEqual([]);
 expect(plan({remember:'yes'}).writes).toEqual([]);
});
test('an old trail maps to the unified state with the same original option indices',()=>{
 expect(plan({[`case-${id}`]:{version:1,choices:[2,1],seed:42}}).writes).toEqual([[`business-${id}`,{stage:2,choices:[2,1],seed:42}]]);
 expect(plan({[`case-${id}`]:{version:1,choices:[1]}}).writes).toEqual([[`business-${id}`,{stage:1,choices:[1]}]]);
 expect(plan({[`case-${id}`]:{version:1,choices:[],seed:7}}).writes).toEqual([[`business-${id}`,{stage:0,choices:[],seed:7}]]);
 expect(mapOldTrail({version:1,choices:[0,1]})).toEqual({stage:2,choices:[0,1]});
});
test('invalid trails are dropped, and an existing newer trail is kept',()=>{
 for(const bad of [{version:2,choices:[]},{version:1,choices:[3]},{version:1,choices:[0,2]},{version:1,choices:[0,0,0]},{version:1,choices:['0']},{version:1,choices:[],seed:2147483647},0,'x'])expect(plan({[`case-${id}`]:bad}).writes).toEqual([]);
 expect(validOldTrail({version:1,choices:[2,1]},[3,2])).toBe(true);
 expect(plan({[`case-${id}`]:{version:1,choices:[0]}},{[`business-${id}`]:{stage:2,choices:[0,0]}}).writes).toEqual([]);
});
test('unknown case ids, unknown keys and other source apps are ignored',()=>{
 expect(plan({'case-no-such-case':{version:1,choices:[0]}}).writes).toEqual([]);
 expect(plan({theme:'dark',progress:{}}).writes).toEqual([]);
 expect(plan({bookmarks:[id]},{},'someone-else').writes).toEqual([]);
});
test('every business scenario accepts an old trail of its own case',()=>{
 for(const b of data.business)expect(plan({[`case-${b.id}`]:{version:1,choices:[b.options.length-1,b.options2.length-1]}}).writes).toHaveLength(1);
});
