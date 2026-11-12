/** Browser journeys run through the documented CUA tab.playwright interface. */
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
export const assert=(condition,message)=>{if(!condition)throw new Error(message);};
export async function data(slug){return JSON.parse(await readFile(new URL(`apps/${slug}/src/data/content.json`,root),'utf8'));}
export const inputValue=(tab,selector)=>tab.playwright.locator(selector).evaluate(node=>node.value);
export const text=(tab,selector)=>tab.playwright.locator(selector).innerText();
export const clipboard=(tab)=>inputValue(tab,'#e2e-clipboard-probe');
async function mark(locator,checked=true){
 if(await locator.evaluate(node=>node.checked)!==checked)await locator.press('Space');
 assert(await locator.evaluate(node=>node.checked)===checked,'Native keyboard selection did not apply');
}
async function keyboardCheck(tab,selector){
 const locator=tab.playwright.locator(selector);
 if(!await locator.evaluate(node=>node.checked))await locator.press('Space');
 assert(await locator.evaluate(node=>node.checked),`Checkbox ${selector} did not activate`);
}
export function origin(port,mode='normal'){return `http://127.0.0.1:${port}/?qa-storage=${mode}&qa-clipboard=capture&qa-run=journey`;}

export async function storage(tab,app,mode){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=${mode}&qa-clipboard=capture&qa-run=final-regression`);
 const probe=await text(tab,'#e2e-storage-probe'),expected=probe.split('expected system theme ')[1];
 const actual=await tab.playwright.locator('html').getAttribute('data-theme');assert(actual===expected,'Invalid/unavailable storage changed initial theme');
 assert((await text(tab,'h1')).length>0,'Home content missing');return {actual,expected,probe};
}
export async function clearStorage(tab,app){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=clear&qa-clipboard=capture&qa-run=clear-final`);
 assert((await text(tab,'#e2e-storage-probe')).includes('app keys 2'),'Clear fixture must start with two app-local records');
 await tab.playwright.locator('#storage-open').press('Enter');assert(await tab.playwright.locator('#storage-dialog').isVisible(),'Storage dialog did not open');
 await tab.playwright.locator('#storage-clear').press('Enter');
 await tab.playwright.getByText(/QA fixture clear \| app keys 0 \| sentinel keep/).waitFor({state:'visible'});
 return {clearedNamespace:true,unrelatedRecordPreserved:true};
}
export async function layout(tab,app,theme,width){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);
 if(await tab.playwright.locator('html').getAttribute('data-theme')!==theme)await tab.playwright.locator('#theme-toggle').press('Enter');
 const result=await tab.playwright.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,theme:document.documentElement.dataset.theme,heading:document.querySelector('h1')?.innerText,clipped:[...document.querySelectorAll('main *')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&(r.right>innerWidth+1||r.left< -1);}).slice(0,5).map(n=>n.tagName+'.'+n.className)}));
 assert(result.width===width,'Viewport override not applied');assert(result.theme===theme,'Requested theme did not apply');assert(result.scroll<=width+1,'Horizontal overflow: '+JSON.stringify(result));
 return result;
}

export async function guess(tab,mode='normal'){
 const fixture=await data('guess-the-surah');await tab.goto(origin(5321,mode));
 await tab.playwright.locator('#pool').selectOption('all');await tab.playwright.locator('#length').selectOption('5');
 await tab.playwright.getByRole('button',{name:'Start a new round',exact:true}).press('Enter');
 await mark(tab.playwright.locator('#remember'));
 await tab.playwright.locator('#share-challenge').press('Enter');
 const challenge=await clipboard(tab);assert(new URL(challenge).searchParams.get('rounds')==='5','Challenge link lost the chosen round length');
 const opening=await text(tab,'.opening-translation');
 for(let index=0;index<5;index++){
  const translation=await text(tab,'.opening-translation');
  assert(Object.values(fixture.verses).some(verse=>verse.translation===translation),'Opening passage must exist in the canonical fixture');
  for(let clue=0;clue<3;clue++)await tab.playwright.locator('#reveal-clue').press('Enter');
  const answer=(await text(tab,'.clue-stack')).match(/It is chapter\s+(\d+)/)?.[1];assert(answer,'Fourth visible clue must identify the chapter');
  if(index===0){
   const wrong=await tab.playwright.locator('button[data-answer]').evaluateAll((nodes,correct)=>nodes.map(node=>node.dataset.answer).find(value=>value!==correct),answer);
   await tab.playwright.locator(`button[data-answer="${wrong}"]`).press('Enter');
   assert((await text(tab,'.feedback')).includes('This one is'),'Wrong answer must show the source-backed correction');
   if(mode==='normal'){await tab.reload();assert(await tab.playwright.locator('#next-question').isVisible(),'Remembered round did not restore an answered question');}
  }else await tab.playwright.locator(`button[data-answer="${answer}"]`).press('Enter');
  await tab.playwright.locator('#next-question').press('Enter');
 }
 const result=await text(tab,'#game-stage');assert(result.includes('4/5')&&(await text(tab,'#score-label'))==='100 points','Five-question mixed-result round has incorrect completion or scoring');
 await tab.playwright.locator('#share-result').press('Enter');assert((await clipboard(tab)).includes('4/5 identified'),'Copied round result lost its score');
 await tab.playwright.locator('#another-round').press('Enter');assert((await text(tab,'#round-label')).includes('1 of 5'),'New round did not reset progress');
 return {challenge,firstOpening:opening,completion:'4/5, 100 points after four clues each',mode};
}

export async function connections(tab,mode='normal',checkRecovery=true){
 const fixture=await data('ayah-threads');const puzzle=fixture.puzzles[1];await tab.goto(origin(5322,mode));
 await tab.playwright.locator('#puzzle-picker').selectOption(puzzle.id);await mark(tab.playwright.locator('#remember'));
 await mark(tab.playwright.locator('#show-arabic'));assert(await tab.playwright.locator('.passage-stack .arabic').count()===3,'Arabic toggle must show all three passages');
 await tab.playwright.getByRole('button',{name:puzzle.distractors[0],exact:true}).press('Enter');assert((await text(tab,'#puzzle-stage')).includes('not the intended connection'),'Wrong theme feedback is missing');
 await tab.playwright.locator('#puzzle-hint').press('Enter');assert((await text(tab,'#puzzle-stage .notice')).includes(puzzle.hint),'Hint did not match the selected puzzle');
 await tab.playwright.getByRole('button',{name:puzzle.theme,exact:true}).press('Enter');
 assert((await text(tab,'.feedback')).includes(puzzle.explanation),'Solved puzzle must show its explanation');
 await tab.playwright.locator('#share-result').press('Enter');assert((await clipboard(tab)).includes(puzzle.id),'Result link must identify this puzzle');
 if(mode==='normal'&&checkRecovery){await tab.reload();assert(await tab.playwright.locator('.feedback.positive').isVisible(),'Selected puzzle loses solved recovery on reload of its own puzzle URL');}
 await tab.playwright.locator('#next-puzzle').press('Enter');assert(await tab.playwright.locator('#reveal-theme').isVisible(),'Next puzzle did not start fresh');
 await tab.playwright.locator('#reveal-theme').press('Enter');assert(await tab.playwright.locator('.feedback.positive').isVisible(),'Reveal did not open the explanation');
 return {puzzle:puzzle.id,recovery:mode==='normal'&&checkRecovery,mode};
}

export async function detective(tab,mode='normal'){
 const fixture=await data('seerah-detective');const item=fixture.cases[0];await tab.goto(origin(5323,mode));
 await tab.goto(`http://127.0.0.1:5323/case/${item.id}/`);await mark(tab.playwright.locator('#remember'));
 assert(!await tab.playwright.locator('#check-conclusion').isEnabled(),'A conclusion must require inspected evidence');
 await tab.playwright.locator('[data-evidence] summary').nth(0).press('Enter');await tab.playwright.locator('[data-evidence] summary').nth(1).press('Enter');
 const wrong=(item.correct+1)%item.answers.length;
 await mark(tab.playwright.locator(`input[name=conclusion][value="${wrong}"]`));await tab.playwright.locator('#check-conclusion').press('Enter');
 assert((await text(tab,'#case-feedback')).includes('Look again'),'Wrong conclusion feedback is missing');
 await tab.playwright.locator('#case-hint').press('Enter');assert((await text(tab,'#case-feedback')).includes(item.hint),'Case hint is missing');
 await mark(tab.playwright.locator(`input[name=conclusion][value="${item.correct}"]`));await tab.playwright.locator('#check-conclusion').press('Enter');
 assert((await text(tab,'#case-feedback')).includes(item.conclusion),'Correct conclusion is not shown');
 if(mode==='normal'){await tab.reload();assert((await text(tab,'#case-feedback')).includes(item.conclusion),'Completed investigation did not recover');}
 await tab.playwright.locator('#case-share').press('Enter');assert((await clipboard(tab)).includes(`/case/${item.id}/`),'Share must preserve the case route');
 await tab.playwright.locator('#case-restart').press('Enter');assert(!await tab.playwright.locator('#check-conclusion').isEnabled(),'Restart must require evidence again');
 return {case:item.id,mode};
}

export async function akhlaq(tab,mode='normal'){
 const fixture=await data('everyday-akhlaq');const item=fixture.scenarios[0];await tab.goto(origin(5324,mode));
 await tab.goto(`http://127.0.0.1:5324/scenario/${item.id}/`);await mark(tab.playwright.locator('#remember'));
 await tab.playwright.locator('button[data-choice="1"]').press('Enter');assert((await text(tab,'.feedback')).includes(item.options[1].consequence),'First choice consequence does not match');
 await tab.playwright.locator('#continue-scenario').press('Enter');assert((await text(tab,'#scenario-stage')).includes(item.followup),'Follow-up situation missing');
 await tab.playwright.locator('button[data-choice="2"]').press('Enter');const result=await text(tab,'#scenario-stage');
 assert(result.includes(item.takeaway)&&result.includes(item.options2[2].consequence),'Final reflection lost a branch consequence');
 if(mode==='normal'){await tab.reload();assert((await text(tab,'#scenario-stage')).includes(item.takeaway),'Completed scenario did not recover');}
 await tab.playwright.locator('#scenario-share').press('Enter');assert((await clipboard(tab)).includes(item.id),'Scenario share route is missing');
 await tab.playwright.locator('#try-again').press('Enter');assert(await tab.playwright.locator('button[data-choice]').count()===3,'Try again must reset to three first responses');
 return {scenario:item.id,mode};
}

export async function seerah(tab,mode='normal'){
 const fixture=await data('seerah-timeline');const item=fixture.events[1];await tab.goto(origin(5325,mode));
 await tab.playwright.locator(`[data-select="${item.id}"]`).press('Enter');assert((await text(tab,'#selected-event')).includes(item.title),'Timeline selection did not update its detail');
 await tab.playwright.locator('#next-event').press('Enter');assert((await text(tab,'#selected-event')).includes(fixture.events[2].title),'Next event is incorrect');
 await tab.back();assert((await text(tab,'#selected-event')).includes(item.title),'Back navigation must restore the selected event');
 const pressed=await tab.playwright.locator('#bookmark-event').getAttribute('aria-pressed');if(pressed!=='true')await tab.playwright.locator('#bookmark-event').press('Enter');
 await mark(tab.playwright.locator('#bookmarks-only'));assert((await text(tab,'#event-count')).startsWith('1 '),'Saved-only filter must show one bookmarked event');
 await tab.playwright.locator('#timeline-search').fill('zz-no-such-event');assert(await tab.playwright.locator('#timeline-empty').isVisible(),'Timeline empty state missing');
 await tab.playwright.locator('#reset-filters').press('Enter');assert((await text(tab,'#event-count')).startsWith('36 '),'Timeline reset failed');
 if(mode==='normal'){await tab.reload();assert(await tab.playwright.locator('#bookmark-event').getAttribute('aria-pressed')==='true','Timeline bookmark did not recover');}
 await tab.playwright.locator('#share-event').press('Enter');assert(new URL(await clipboard(tab)).searchParams.get('event')===item.id,'Copied event link points elsewhere');
 await tab.playwright.locator(`#selected-event a[href="/event/${item.id}/"]`).press('Enter');assert((await text(tab,'h1'))===item.title,'Static event page does not match selection');
 return {event:item.id,mode};
}

async function download(tab,selector,name){
 await tab.playwright.locator(selector).press('Enter');await tab.playwright.locator('#e2e-download-probe[data-ready=yes]').waitFor({state:'visible',timeoutMs:12000});
 const capture=JSON.parse(await inputValue(tab,'#e2e-download-probe'));assert(capture.name,'Export did not supply a filename');const value=capture.text;
 const {writeFile}=await import('node:fs/promises');await writeFile(new URL(`_implementation/qa/e2e/${name}`,root),value);return value;
}
export async function calculator(tab,mode='normal'){
 await tab.goto(origin(5326,mode));
 for(const [id,value] of Object.entries({memorized:'600',goal:'20'}))await tab.playwright.locator('#'+id).fill(value);
 await tab.playwright.getByRole('button',{name:'Calculate plan',exact:true}).press('Enter');assert((await text(tab,'#error')).includes('604'),'Impossible combined page total was accepted');
 const settings={memorized:'0',goal:'2',minutes:'60',newMinutes:'30',reviewMinutes:'2',pace:'1',cycle:'14',start:'2026-10-30'};
 for(const [id,value] of Object.entries(settings))await tab.playwright.locator('#'+id).fill(value);
 for(let day=0;day<7;day++)await mark(tab.playwright.locator(`input[name=day][value="${day}"]`),false);
 await tab.playwright.getByRole('button',{name:'Calculate plan',exact:true}).press('Enter');assert((await text(tab,'#error')).includes('at least one study day'),'No-study-day validation is missing');
 for(let day=0;day<7;day++)await mark(tab.playwright.locator(`input[name=day][value="${day}"]`));
 await mark(tab.playwright.locator('#remember'));await tab.playwright.getByRole('button',{name:'Calculate plan',exact:true}).press('Enter');
 assert((await text(tab,'#results')).includes('2 study sessions')&&(await text(tab,'#results')).includes('2026-10-31'),'Two-page plan should finish in two consecutive sessions');
 if(mode==='normal'){await tab.reload();assert(await inputValue(tab,'#goal')==='2','Saved plan assumptions did not recover');}
 const csv=await download(tab,'#csv',`plan-${mode}.csv`);assert(csv.trim().split(/\r?\n/).length===3&&csv.includes('2026-10-30,1.000,0.000,30.00'),'CSV does not match the two-session plan');
 const ics=await download(tab,'#ics',`plan-${mode}.ics`);assert((ics.match(/BEGIN:VEVENT/g)||[]).length===2&&ics.includes('DTSTART;VALUE=DATE:20261031'),'Calendar does not contain the two all-day sessions');
 await tab.playwright.locator('#goal').fill('100');await tab.playwright.locator('#cycle').fill('365');await tab.playwright.getByRole('button',{name:'Calculate plan',exact:true}).press('Enter');
 assert((await text(tab,'#results')).includes('100 study sessions'),'Long plan should expose all 100 sessions');await tab.playwright.locator('#next').press('Enter');assert((await text(tab,'#results')).includes('Page 2 of 5'),'Plan pagination failed');
 const capped=await download(tab,'#ics',`plan-capped-${mode}.ics`);assert((capped.match(/BEGIN:VEVENT/g)||[]).length===90,'Calendar must cap at 90 sessions');
 await tab.playwright.locator('#memorized').fill('100');await tab.playwright.locator('#goal').fill('10');await tab.playwright.locator('#minutes').fill('1');await tab.playwright.locator('#cycle').fill('1');await tab.playwright.getByRole('button',{name:'Calculate plan',exact:true}).press('Enter');
 assert((await text(tab,'#results')).includes('needs more time'),'Capacity failure did not explain the model limit');
 await tab.playwright.locator('#reset').press('Enter');assert(await inputValue(tab,'#goal')==='20','Plan reset did not restore defaults');
 return {twoSessionCsv:true,twoSessionCalendar:true,calendarCap:90,pagination:true,mode};
}

async function search(tab,query){await tab.playwright.locator('#query').fill(query);await tab.playwright.locator('#submit').press('Enter');await tab.playwright.locator('#results h2').waitFor({state:'visible',timeoutMs:15000});return text(tab,'#results');}
export async function wording(tab,mode='normal'){
 await tab.goto(origin(5327,mode));await mark(tab.playwright.locator('#remember'));
 assert((await search(tab,'115:1')).includes('Search could not finish'),'Invalid chapter reference was accepted');
 assert((await search(tab,'94:5-6')).includes('Reference lookup'),'Valid range lookup failed');assert(await tab.playwright.locator('#results article').count()===2,'Range lookup must contain exactly two ayahs');
 await tab.playwright.locator('#chapter').selectOption('94');await tab.playwright.locator('#language').selectOption('english');
 assert((await search(tab,'WITH HARDSHIP')).includes('Wording match in Pickthall'),'Case-normalized English exact match failed');
 await tab.playwright.locator('#results [data-copy]').first().press('Enter');assert((await clipboard(tab)).includes('Quran 94:'),'Passage copy lost its reference');
 await tab.playwright.locator('#share').press('Enter');const share=await clipboard(tab);assert(share.includes('#')&&!share.includes('?q='),'Search query must be in a fragment rather than request parameters');
 await tab.playwright.locator('#language').selectOption('arabic');assert((await search(tab,'مع العسر')).includes('Normalized Arabic wording match'),'Arabic search normalization failed');
 assert((await search(tab,'zznomatchingwordxx')).includes('cannot establish that a paraphrased idea is absent'),'Empty result must state its coverage limitation');
 assert((await search(tab,'a')).includes('at least two'),'One-character query validation failed');
 await tab.playwright.locator('#language').selectOption('english');await tab.playwright.locator('#chapter').selectOption('0');
 await search(tab,'Allah');assert(await tab.playwright.locator('#next').isEnabled(),'Large search result should paginate');await tab.playwright.locator('#next').press('Enter');assert((await text(tab,'#results')).includes('Page 2 of'),'Search pagination failed');
 if(mode==='normal'){await tab.reload();assert(await tab.playwright.locator('#recent [data-recent]').count()<=5&&await tab.playwright.locator('#recent [data-recent]').count()>0,'Opted-in recent searches were not recovered or capped');}
 await tab.goto(share);await tab.playwright.locator('#results h2').waitFor({state:'visible',timeoutMs:15000});assert((await text(tab,'#results')).includes('Wording match in Pickthall'),'Fragment share link did not restore its search');
 return {rangeLookup:2,english:true,arabic:true,pagination:true,fragmentShare:true,mode};
}

export async function reader(tab,slug,port,route,key,mode='normal',preferred){
 const fixture=await data(slug);const item=preferred||fixture[key][0];await tab.goto(origin(port,mode));
 await tab.playwright.locator('#filter').fill('zz-no-such-entry');assert(await tab.playwright.locator('#empty').isVisible(),'Reader empty state missing');await tab.playwright.locator('#filter').fill('');
 const button=tab.playwright.locator(`[data-save="${item.id}"]`);
 await button.waitFor({state:'visible'});
 if(await button.getAttribute('aria-pressed')!=='true')await button.press('Enter');
 assert(await button.getAttribute('aria-pressed')==='true','Keyboard activation did not save the reading');
 await mark(tab.playwright.locator('#saved-only'));assert((await text(tab,'#count')).startsWith('1 of'),'Saved-only library should show the selected reading');
 await tab.playwright.locator('#export').press('Enter');assert((await clipboard(tab)).includes(`/${route}/${item.id}/`),'Reading-list copy lost its route');
 const link=tab.playwright.locator(`[data-reading-link="${item.id}"]`);await link.press('Enter');
 assert((await text(tab,'h1'))===(item.title||item.name||item.theme),'Reader detail heading is incorrect');
 if(mode==='normal'){await tab.reload();assert(await tab.playwright.locator(`[data-save="${item.id}"]`).getAttribute('aria-pressed')==='true','Reading bookmark did not recover');}
 return {fixture,item};
}
export async function prophets(tab,mode='normal'){
 const {item}=await reader(tab,'stories-of-the-prophets',5330,'prophet','people',mode);
 assert(await tab.playwright.locator('.arabic').count()===2,'Profile must include two selected readings');
 await mark(tab.playwright.locator(`input[name=answer][value="${(item.answer+1)%item.options.length}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#feedback')).includes('Look again'),'Reading check must allow a wrong-answer retry');
 await mark(tab.playwright.locator(`input[name=answer][value="${item.answer}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#feedback')).includes('Correct'),'Correct profile answer failed');
 return {profile:item.id,readings:2,retry:true,mode};
}

export async function escapeRoom(tab,mode='normal',timed=false,leaveComplete=false){
 const fixture=await data('quran-escape-room');const room=fixture.rooms[0];await tab.goto(origin(5329,mode));await tab.goto(`http://127.0.0.1:5329/room/${room.id}/`);
 await tab.playwright.locator('#restart').press('Enter');await keyboardCheck(tab,'#resume');await keyboardCheck(tab,'#timer-toggle');
 await mark(tab.playwright.getByRole('radio',{name:room.options.find(option=>option!==room.name),exact:true}));await tab.playwright.getByRole('button',{name:'Check lock',exact:true}).press('Enter');assert((await text(tab,'#feedback')).includes('still closed'),'Wrong theme should leave the lock closed');
 await tab.playwright.locator('#hint').press('Enter');await mark(tab.playwright.getByRole('radio',{name:room.name,exact:true}));await tab.playwright.getByRole('button',{name:'Check lock',exact:true}).press('Enter');
 if(mode==='normal'){await tab.reload();assert((await text(tab,'#lock-progress')).includes('Lock 2'),'Room recovery lost its completed first lock');await keyboardCheck(tab,'#timer-toggle');}
 const matches=await tab.playwright.locator('select[data-ref]').evaluateAll(nodes=>nodes.map(node=>({name:node.name,label:node.parentElement.querySelector('span').textContent})));
 const excerpt=value=>value.length>180?value.slice(0,180)+'…':value;
 for(const match of matches){const passage=room.passages.find(p=>match.label.includes(excerpt(p.translation)));assert(passage,'Displayed excerpt must match a source-shelf passage');await tab.playwright.locator(`select[name="${match.name}"]`).selectOption(passage.ref);}
 await tab.playwright.getByRole('button',{name:'Check lock',exact:true}).press('Enter');
 const expected=[...room.refs].sort((a,b)=>{const aa=a.split(/[:-]/).map(Number),bb=b.split(/[:-]/).map(Number);return aa[0]-bb[0]||aa[1]-bb[1];});
 for(let index=0;index<expected.length;index++){
  let current=(await tab.playwright.locator('.order-list li>span').allTextContents({})).map(value=>value.replace('Quran ','')).indexOf(expected[index]);
  while(current>index){await tab.playwright.getByRole('button',{name:`Move ${expected[index]} up`,exact:true}).press('Enter');current--;}
 }
 await tab.playwright.getByRole('button',{name:'Check lock',exact:true}).press('Enter');
 const snippets=await tab.playwright.locator('input[name=snippet]').evaluateAll(nodes=>nodes.map(node=>({value:node.value,label:node.parentElement.textContent.trim()})));
 const correct=snippets.filter(snippet=>room.passages.slice(0,2).some(p=>snippet.label.includes(excerpt(p.translation))));assert(correct.length===2,'There must be two source-shelf excerpt choices');
 for(const snippet of correct)await mark(tab.playwright.locator(`input[name=snippet][value="${snippet.value}"]`));
 if(timed)await tab.playwright.waitForTimeout(2200);
 await tab.playwright.getByRole('button',{name:'Check lock',exact:true}).press('Enter');assert((await text(tab,'#lock-progress'))==='Complete','Room did not reach four-lock completion');
 await tab.playwright.locator('#share').press('Enter');assert((await clipboard(tab)).includes('4 source-reading locks completed'),'Room completion copy is missing');
 if(leaveComplete)return {room:room.id,locks:4,mode};
 const elapsed=await text(tab,'#timer');await tab.playwright.locator('#restart').press('Enter');assert((await text(tab,'#lock-progress')).includes('Lock 1'),'Restart did not reset the room');
 const restarted=await text(tab,'#timer');assert(restarted==='0:00','Restart did not reset the visible timer');
 if(timed){assert(elapsed!=='0:00','Timed completion must include elapsed time');await tab.playwright.waitForTimeout(1300);assert((await text(tab,'#timer'))!=='0:00','Timer did not resume after completed-room restart');}
 return {room:room.id,locks:4,assistedHint:true,elapsedBeforeRestart:elapsed,mode};
}

export async function places(tab,mode='normal'){
 const fixture=await data('places-in-the-quran');const item=fixture.places.find(place=>place.point);
 await reader(tab,'places-in-the-quran',5331,'place','places',mode,item);
 assert(await tab.playwright.locator('.map-figure svg circle').count()===5,'Regional map must expose five contextual markers');
 const uncertain=fixture.places.find(place=>!place.point);await tab.goto(`http://127.0.0.1:5331/place/${uncertain.id}/`);
 assert((await text(tab,'main')).includes(uncertain.note),'Unpinned place must retain its uncertainty note');
 return {mapped:item.id,markers:5,uncertain:uncertain.id,mode};
}
export async function concepts(tab,mode='normal'){
 // P6 UI: Daily and Practice tabs. ?puzzle=<id> opens that board in Practice (no daily clock needed); pills (#pills .board-pill) open the same URL.
 const fixture=await data('word-groups');const board=fixture.puzzles[0];const groups=board.groups.map(id=>fixture.groups.find(group=>group.id===id));
 await tab.goto(`${origin(5332,mode)}&puzzle=${board.id}`);
 assert(await tab.playwright.locator('#tab-practice').getAttribute('aria-selected')==='true','A ?puzzle= link should open Practice');
 await tab.playwright.locator('#restart').press('Enter');await mark(tab.playwright.locator('#remember'));
 assert(await tab.playwright.locator('.board-pill').count()===fixture.puzzles.length,'The board picker should list every board');
 for(const term of [...groups[0].terms.slice(0,3),groups[1].terms[0]])await tab.playwright.getByRole('button',{name:term,exact:true}).press('Enter');
 await tab.playwright.locator('#submit').press('Enter');assert((await text(tab,'#feedback')).includes('One away'),'Three-of-four selection should receive near-match feedback');
 await tab.playwright.locator('#deselect').press('Enter');await tab.playwright.locator('#hint').press('Enter');assert((await text(tab,'#feedback')).includes('Hint:'),'Grouping hint missing in Practice');
 for(let index=0;index<groups.length;index++){
  for(const term of groups[index].terms)await tab.playwright.getByRole('button',{name:term,exact:true}).press('Enter');
  await tab.playwright.locator('#submit').press('Enter');
  if(index===0&&mode==='normal'){await tab.reload();assert((await text(tab,'#progress')).startsWith('1 of 4'),'Grouping board did not recover solved groups');}
 }
 assert((await text(tab,'#feedback')).includes('All four groups found'),'Grouping board did not complete');assert(await tab.playwright.locator('#explanations article').count()===4,'All four group explanations must be readable');
 await tab.playwright.locator('#share').press('Enter');const shared=await clipboard(tab);assert(shared.includes('puzzle='+board.id),'Board share link is missing its puzzle ID');
 for(const group of groups)for(const answer of [group.title,...group.terms])if(answer.length>3)assert(!shared.toLowerCase().includes(answer.toLowerCase()),'Share output must not contain group names or terms');
 await tab.playwright.locator('#restart').press('Enter');await tab.playwright.locator('#reveal').press('Enter');assert((await text(tab,'#feedback')).includes('revealed'),'Reveal did not expose the group explanations');
 return {board:board.id,nearMatch:true,groupsSolved:4,mode};
}
export async function salah(tab,mode='normal'){
 const fixture=await data('understand-your-salah');const lesson=fixture.lessons.find(item=>item.id==='fatiha-5');
 await reader(tab,'understand-your-salah',5334,'lesson','lessons',mode,lesson);
 await tab.playwright.locator('#practice').press('Enter');assert(!await tab.playwright.locator('#meaning').isVisible(),'Meaning did not hide for recall practice');await tab.playwright.locator('#practice').press('Enter');assert(await tab.playwright.locator('#meaning').isVisible(),'Meaning did not reveal');
 await mark(tab.playwright.locator(`input[name=answer][value="${(lesson.answer+1)%lesson.options.length}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#quiz-feedback')).includes('try another'),'Prayer reading check did not permit retry');
 await mark(tab.playwright.locator(`input[name=answer][value="${lesson.answer}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#quiz-feedback')).includes('matches the wording'),'Correct prayer meaning answer failed');
 await tab.playwright.locator('#speed').selectOption('1.25');await mark(tab.playwright.locator('#loop'));
 const audio=await tab.playwright.locator('#recitation').evaluate(node=>({ready:node.readyState,duration:node.duration,paused:node.paused,speed:node.playbackRate,loop:node.loop}));assert(audio.ready>=1&&audio.duration>45&&audio.duration<55,'Bundled Al-Fatiha audio metadata did not load');assert(audio.paused&&audio.speed===1.25&&audio.loop,'Audio must not autoplay, and speed/loop controls must apply');
 await tab.playwright.locator('#recitation').press('Space');
 return {lesson:lesson.id,meaningPractice:true,quiz:true,audioMetadata:audio,mode};
}
export async function parables(tab,mode='normal'){
 const {item}=await reader(tab,'parables-of-the-quran',5335,'parable','parables',mode);
 await tab.playwright.locator('[data-stage="1"]').press('Enter');assert(await tab.playwright.locator('[data-stage-panel="1"]').isVisible()&&!await tab.playwright.locator('[data-stage-panel="0"]').isVisible(),'Diagram stage selection failed');
 await mark(tab.playwright.locator(`input[name=answer][value="${(item.answer+1)%item.options.length}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#feedback')).includes('try another'),'Parable check must permit retry');
 await mark(tab.playwright.locator(`input[name=answer][value="${item.answer}"]`));await tab.playwright.locator('#quiz button').press('Enter');assert((await text(tab,'#feedback')).includes('matches the passage'),'Parable reading check failed');
 const note='E2E private reflection, kept only for this test.';await tab.playwright.locator('#reflection').fill(note);await tab.playwright.locator('#copy-note').press('Enter');assert((await clipboard(tab)).includes(note)&&(await clipboard(tab)).includes('not a quotation'),'Copied reflection lost its attribution boundary');
 const file=await download(tab,'#download-note',`reflection-${mode}.md`);assert(file.includes(note)&&file.includes(`/parable/${item.id}/`),'Downloaded reflection lost its text or source route');
 await tab.reload();assert(await inputValue(tab,'#reflection')==='','Private reflection must not silently persist');return {parable:item.id,diagram:true,quiz:true,download:true,privateNoteNotPersisted:true,mode};
}

export async function civilization(tab,mode='normal'){
 await tab.goto(origin(5336,mode));await tab.playwright.locator('#compare-a').selectOption('baghdad');await tab.playwright.locator('#compare-b').selectOption('samarra');await tab.playwright.locator('#compare').press('Enter');assert((await text(tab,'#comparison')).includes('74 years'),'Date-band comparison gave the wrong gap');
 await tab.playwright.locator('#copy-comparison').press('Enter');assert((await clipboard(tab)).includes('a=baghdad')&&(await clipboard(tab)).includes('b=samarra'),'Copied comparison lost its two records');
 await tab.playwright.locator('#region').selectOption('South Asia');assert((await text(tab,'#count')).startsWith('3 of'),'Regional filter is incorrect');
 await tab.playwright.locator('#from-year').fill('1600');await tab.playwright.locator('#to-year').fill('1400');assert((await text(tab,'#filter-error')).includes('earlier year first'),'Reversed date filter was accepted');
 await tab.playwright.getByRole('button',{name:'Reset filters',exact:true}).press('Enter');assert((await text(tab,'#count')).startsWith('24 of'),'Civilization filters did not reset');
 await tab.playwright.locator('[data-save="baghdad"]').press('Enter');await tab.playwright.locator('[data-reading-link="baghdad"]').press('Enter');assert((await text(tab,'h1')).includes('Baghdad'),'Historical detail route failed');
 return {comparedGap:74,regionFilter:3,dateValidation:true,mode};
}
export async function revelation(tab,mode='normal'){
 const item=(await data('why-it-was-revealed')).readings.find(reading=>reading.id==='beloved-garden');await tab.goto(origin(5338,mode));await tab.goto(`http://127.0.0.1:5338/reading/${item.id}/`);
 await mark(tab.playwright.getByRole('radio',{name:'Transmitted occasion',exact:true}));await tab.playwright.locator('#relationship button').press('Enter');assert((await text(tab,'#relationship-feedback')).includes('Revisit'),'Wrong report classification feedback missing');
 await mark(tab.playwright.getByRole('radio',{name:item.kind,exact:true}));await tab.playwright.locator('#relationship button').press('Enter');assert((await text(tab,'#relationship-feedback')).startsWith('Yes.'),'Correct report classification failed');
 assert(await tab.playwright.locator(`a[href="${item.secondCommentaryUrl}"]`).count()===1,'Second commentary citation missing');return {reading:item.id,relationship:item.kind,mode};
}
export async function family(tab,mode='normal'){
 const item=(await data('family-halaqa')).packs[0];await tab.goto(origin(5339,mode));await tab.goto(`http://127.0.0.1:5339/pack/${item.id}/`);await tab.playwright.locator('#restart-pack').press('Enter');await mark(tab.playwright.locator('#remember-pack'));
 await mark(tab.playwright.locator(`input[name=answer][value="${(item.answer+1)%item.options.length}"]`));await tab.playwright.locator('#reading-question button').press('Enter');assert((await text(tab,'#reading-feedback')).startsWith('Try again'),'Family reading retry missing');
 await mark(tab.playwright.locator(`input[name=answer][value="${item.answer}"]`));await tab.playwright.locator('#reading-question button').press('Enter');await tab.playwright.locator('[data-finish="1"]').press('Enter');
 if(mode==='normal'){await tab.reload();assert((await text(tab,'#session-count')).startsWith('2 of 3'),'Family sitting did not recover both completed steps');}
 await tab.playwright.locator('[data-finish="2"]').press('Enter');assert(await tab.playwright.locator('#session-complete').isVisible(),'Family sitting did not complete');await tab.playwright.locator('#copy-completion').press('Enter');assert((await clipboard(tab)).includes(item.id),'Family completion share lost its pack link');return {pack:item.id,steps:3,mode};
}
