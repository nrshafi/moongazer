/** Focus appearance checks run with the documented CUA browser interface. */
function assert(value,message){if(!value)throw new Error(message);}
function neutralColor(value){const hex=value.neutral.slice(1);return 'rgb('+[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')+')';}
async function appearance(locator){
 return locator.evaluate(node=>{
  const style=getComputedStyle(node);
  return {focused:document.activeElement===node,visible:node.matches(':focus-visible'),outline:style.outlineStyle,width:style.outlineWidth,color:style.outlineColor,neutral:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(),border:style.borderWidth,method:document.documentElement.dataset.inputMethod};
 });
}
export async function focusJourney(tab,app,theme){
 await tab.goto(`http://127.0.0.1:${app.port}/?qa-storage=normal&qa-clipboard=off`);
 const toggle=tab.playwright.locator('#theme-toggle');
 if(await tab.playwright.locator('html').getAttribute('data-theme')!==theme)await toggle.click();
 await toggle.click();await toggle.click();
 const pointerButton=await appearance(toggle);assert(pointerButton.focused&&pointerButton.method==='pointer'&&pointerButton.outline==='none','Pointer button retained an outline: '+JSON.stringify(pointerButton));
 await toggle.press('Tab');
 const keyboard=await appearance(tab.playwright.locator(':focus'));
 assert(keyboard.method==='keyboard'&&keyboard.visible&&keyboard.outline==='solid'&&keyboard.width==='2px'&&keyboard.color===neutralColor(keyboard),'Tab navigation lost its neutral focus: '+JSON.stringify(keyboard));
 const select=tab.playwright.locator('main select').filter({visible:true}).first();let pointerSelect=null,keyboardSelect=null;
 if(await select.count()){
  await select.click();await select.press('Escape');pointerSelect=await appearance(select);
  assert(pointerSelect.focused&&pointerSelect.method==='pointer'&&pointerSelect.outline==='none'&&pointerSelect.border==='1px','Pointer select retained a ring or lost its border: '+JSON.stringify(pointerSelect));
  await select.press('Shift+Tab');await tab.playwright.locator(':focus').press('Tab');keyboardSelect=await appearance(select);
  assert(keyboardSelect.focused&&keyboardSelect.outline==='solid'&&keyboardSelect.width==='2px','Keyboard select focus missing: '+JSON.stringify(keyboardSelect));
  await select.click();await select.press('Escape');assert((await appearance(select)).outline==='none','Returning to pointer use retained the keyboard outline');
 }
 const input=tab.playwright.locator('main input[type=search],main input[type=number],main textarea').filter({visible:true}).first();let pointerInput=null;
 if(await input.count()){
  await input.click();pointerInput=await appearance(input);assert(pointerInput.focused&&pointerInput.outline==='none','Pointer text input retained a ring: '+JSON.stringify(pointerInput));
 }
 const errors=await tab.dev.logs({levels:['error'],limit:10});assert(!errors.length,JSON.stringify(errors));
 return {theme,pointerButton,keyboard,pointerSelect,keyboardSelect,pointerInput};
}
