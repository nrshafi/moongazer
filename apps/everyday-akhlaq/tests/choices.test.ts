import {test,expect} from 'bun:test';
import data from '../src/data/content.json';
import {optionOrder,validState,feedbackText,FEEDBACK_GOOD,FEEDBACK_BAD,SEED_LIMIT} from '../src/lib/choices';
test('optionOrder is a stable permutation',()=>{for(const stage of [0,1])for(const seed of [0,1,99,SEED_LIMIT-1]){const a=optionOrder(3,seed,stage);expect([...a].sort()).toEqual([0,1,2]);expect(optionOrder(3,seed,stage)).toEqual(a);}});
test('the constructive option is not always first across seeds',()=>{const firsts=new Set<number>();for(let seed=1;seed<=200;seed++)firsts.add(optionOrder(3,seed*7919,0)[0]!);expect(firsts.size).toBe(3);expect(data.scenarios.every(s=>s.options[0]!.constructive)).toBe(true);});
test('feedback differs by constructive flag',()=>{expect(feedbackText(true)).toBe(FEEDBACK_GOOD);expect(feedbackText(false)).toBe(FEEDBACK_BAD);expect(FEEDBACK_GOOD).not.toBe(FEEDBACK_BAD);});
test('saved progress validates with or without a seed',()=>{expect(validState({stage:0,choices:[]})).toBe(true);expect(validState({stage:1,choices:[2],seed:5})).toBe(true);expect(validState({stage:0,choices:[],seed:0})).toBe(true);for(const seed of [-1,1.5,SEED_LIMIT,'3',null,NaN])expect(validState({stage:0,choices:[],seed})).toBe(false);expect(validState({stage:1,choices:[],seed:1})).toBe(false);});
