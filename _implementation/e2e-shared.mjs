import {assert,inputValue,text} from './e2e-flows.mjs';
import {readFile,writeFile} from 'node:fs/promises';
const qaRoot=new URL('./qa/e2e/',import.meta.url);
export async function controls(tab,app,theme,mode){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);
 if(await tab.playwright.locator('html').getAttribute('data-theme')!==theme)await tab.playwright.locator('#theme-toggle').press('Enter');
 await tab.reload();await tab.getAXState({emit:false});
 const result=await tab.playwright.evaluate(()=>{
  const rgb=value=>(value.match(/[\d.]+/g)||[]).map(Number);
  const luminance=value=>rgb(value).slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const checks=[...document.querySelectorAll('main .button,header button')].filter(n=>!n.disabled&&n.getBoundingClientRect().width&&n.getBoundingClientRect().height).map(n=>{
   const style=getComputedStyle(n);let parent=n,bg=style.backgroundColor;
   while(rgb(bg)[3]===0&&parent.parentElement){parent=parent.parentElement;bg=getComputedStyle(parent).backgroundColor;}
   const a=luminance(style.color),b=luminance(bg);return {label:n.getAttribute('aria-label')||n.textContent.trim(),color:style.color,background:bg,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
  });
  return {checks,headerVisible:[...document.querySelectorAll('header a,header button')].every(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})};
 });
 assert(result.headerVisible,'Header control clipped');assert(result.checks.every(c=>c.contrast>=4.5),'Enabled control contrast below 4.5: '+JSON.stringify(result.checks.filter(c=>c.contrast<4.5)));
 await writeFile(new URL(`${app.slug}-${mode}.png`,qaRoot),await tab.screenshot({fullPage:false}));return result;
}
export async function renderApp(tab,app){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);
 const before=await tab.playwright.locator('html').getAttribute('data-theme');await tab.playwright.locator('#theme-toggle').click();assert(await tab.playwright.locator('html').getAttribute('data-theme')!==before,'Pointer theme switch failed');
 await tab.playwright.locator('#storage-open').press('Enter');assert(await tab.playwright.locator('#storage-dialog').isVisible(),'Storage dialog failed');await tab.playwright.getByRole('button',{name:'Close storage settings',exact:true}).press('Enter');
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);if(await tab.playwright.locator('html').getAttribute('data-theme')!=='dark')await tab.playwright.locator('#theme-toggle').press('Enter');
 await writeFile(new URL(`${app.slug}-mobile.png`,qaRoot),await tab.screenshot({fullPage:false}));
 const inventory=JSON.parse(await readFile(new URL('http-results.json',qaRoot),'utf8'));const pages=inventory.find(r=>r.app===app.slug).checks.filter(r=>r.html);const rendered=[];
 for(const page of pages){
  await tab.goto(`http://127.0.0.1:${app.port}${page.route}`);
  const result=await tab.playwright.evaluate(()=>({heading:document.querySelector('h1')?.innerText,h1:document.querySelectorAll('h1').length,app:document.body.dataset.app,width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert(result.h1===1&&result.heading,'Missing/duplicate heading '+page.route);assert(result.app===app.slug,'Wrong app shell '+page.route);assert(result.scroll<=result.width+1,'Mobile overflow '+page.route+': '+result.scroll);
  const logs=await tab.dev.logs({levels:['error'],limit:10});assert(logs.length===0,'Runtime errors '+page.route+JSON.stringify(logs));rendered.push({route:page.route,...result});
 }
 return {pointerTheme:true,storageDialog:true,pages:rendered};
}
export async function navigation(tab,app){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);
 await tab.playwright.locator('.skip-link').press('Enter');assert((await tab.url()).endsWith('#main'),'Keyboard skip link lost its main target');
 await tab.playwright.locator('header nav a[href="/sources/"]').press('Enter');assert((await text(tab,'h1')).length>0,'Sources heading missing');assert(await tab.playwright.locator('main a[href^="https://"]').count()>0,'Sources page has no citations');
 await tab.playwright.locator('.site-footer a[href="/privacy/"]').press('Enter');assert((await text(tab,'main')).includes('30 days'),'Privacy page lost retention information');
 await tab.playwright.locator('#storage-open').press('Enter');await tab.playwright.getByRole('button',{name:'Close storage settings',exact:true}).press('Enter');assert(!await tab.playwright.locator('#storage-dialog').isVisible(),'Storage dialog close failed');
 await tab.goto(`http://127.0.0.1:${app.port}/e2e-intentionally-missing/`);assert(await tab.playwright.locator('h1').count()===1,'Custom missing-page heading missing');
 await tab.playwright.locator('a.brand').press('Enter');assert(new URL(await tab.url()).pathname==='/','404 brand link did not recover home');
 const logs=await tab.dev.logs({levels:['error'],limit:20});assert(logs.length===0,'Browser runtime errors: '+JSON.stringify(logs));
 return {skipLink:true,sources:true,privacy:true,dialogClose:true,missingPageRecovery:true,runtimeErrors:logs};
}
export async function library(tab,app){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=capture`);
 await tab.playwright.locator('#filter').fill('zz-nothing-matches');assert(await tab.playwright.locator('#empty').isVisible(),'Library empty state missing');await tab.playwright.getByRole('button',{name:'Reset filters',exact:true}).press('Enter');
 const first=tab.playwright.locator('[data-save]').first();const id=await first.getAttribute('data-save');if(await first.getAttribute('aria-pressed')!=='true')await first.press('Enter');
 await tab.playwright.locator('#saved-only').press('Space');assert((await text(tab,'#count')).startsWith('1 of'),'Library saved filter incorrect');await tab.playwright.locator('#copy-saved').press('Enter');const copied=await inputValue(tab,'#e2e-clipboard-probe');assert(copied.includes(id),'Saved reading copy lost its item');
 await tab.playwright.locator(`[data-reading-link="${id}"]`).press('Enter');await tab.reload();await tab.playwright.locator(`[data-save="${id}"][aria-pressed="true"]`).waitFor({state:'visible'});return {id,empty:true,reset:true,bookmark:true,savedFilter:true,copy:true,recovery:true};
}
export async function clipboardDenied(tab,app){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=fail`);
 let selector;
 if(app.port===5321)selector='#share-challenge';
 else if(app.port===5322)selector='#share-puzzle';
 else if(app.port===5323){await tab.playwright.locator('main a[href^="/case/"]').first().press('Enter');selector='#case-share';}
 else if(app.port===5324){await tab.playwright.locator('main a[href^="/scenario/"]').first().press('Enter');selector='#scenario-share';}
 else if(app.port===5325)selector='#share-event';
 else if(app.port===5327){await tab.playwright.locator('#query').fill('94:5');await tab.playwright.locator('#submit').press('Enter');await tab.playwright.locator('#share').waitFor({state:'visible'});selector='#share';}
 else if(app.port===5332){await tab.playwright.locator('#reveal').press('Enter');selector='#share';}
 else {const first=tab.playwright.locator('[data-save]').first();if(await first.getAttribute('aria-pressed')!=='true')await first.press('Enter');selector=app.port>=5336?'#copy-saved':'#export';}
 await tab.playwright.locator(selector).press('Enter');await tab.playwright.getByRole('textbox',{name:'Text to copy',exact:true}).waitFor({state:'visible'});const value=await inputValue(tab,'dialog[open] textarea');assert(value.includes('http://127.0.0.1:'+app.port),'Manual copy dialog lost the route');await tab.playwright.locator('dialog[open] button').press('Enter');assert(!await tab.playwright.locator('dialog[open]').isVisible(),'Manual copy dialog did not close');return {manualCopy:true,routeRetained:true};
}
