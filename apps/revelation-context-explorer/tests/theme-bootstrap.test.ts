import {test,expect} from 'bun:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const shell=readFileSync(new URL('../src/layouts/Shell.astro',import.meta.url),'utf8');
const source=shell.match(/<script is:inline define:vars=\{\{ namespace: config.slug \}\}>([\s\S]*?)<\/script>/)?.[1];
if(!source)throw new Error('Theme bootstrap must be available for integration verification');
function boot(raw:string|null,systemDark:boolean,blocked=false){
 const document={documentElement:{dataset:{} as Record<string,string>}};
 runInNewContext(source!,{document,namespace:'theme-test',Date,Number,JSON,localStorage:{getItem(){if(blocked)throw new Error('Storage blocked');return raw;}},matchMedia:()=>({matches:systemDark})});
 return document.documentElement.dataset.theme;
}
test('initial theme bootstrap respects a valid explicit preference',()=>{
 expect(boot(JSON.stringify({at:Date.now(),value:'light'}),true)).toBe('light');
 expect(boot(JSON.stringify({at:Date.now(),value:'dark'}),false)).toBe('dark');
});
test('initial theme bootstrap rejects corrupt, expired, future and incorrectly typed records',()=>{
 for(const systemDark of [false,true]){
  const opposite=systemDark?'light':'dark';
  const records=['invalid json',JSON.stringify({at:Date.now()-31*86400000,value:opposite}),JSON.stringify({at:Date.now()+86400000,value:opposite}),JSON.stringify({at:String(Date.now()),value:opposite}),JSON.stringify({at:null,value:opposite}),JSON.stringify({at:Date.now(),value:'unknown'})];
  for(const raw of records)expect(boot(raw,systemDark)).toBe(systemDark?'dark':'light');
 }
});
test('initial theme bootstrap works when browser storage is unavailable',()=>{
 expect(boot(null,true,true)).toBe('dark');expect(boot(null,false,true)).toBe('light');
});
