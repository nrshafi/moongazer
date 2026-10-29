const fs=await import('node:fs/promises');
const root='I:/_Study_Resource/islamic_product';
const manifest=JSON.parse(await fs.readFile(root+'/demo-manifest.json','utf8'));
const task=await taskSpace(2),page=task.page('p1');
await page.cdp('Page.addScriptToEvaluateOnNewDocument',{source:"window.qaErrors=[];window.addEventListener('error',e=>qaErrors.push(e.message));window.addEventListener('unhandledrejection',e=>qaErrors.push(String(e.reason)));"});
const checks=[];
for(const app of manifest){
  await page.goto('file:///'+root+'/'+app.file);
  const result=await page.evaluate(({slug})=>{
    const one=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
    const assert=(test,msg)=>{if(!test)throw Error(msg)};
    const click=s=>{const b=one(s);assert(b&&!b.disabled,'Missing/enabled control '+s);b.click()};
    assert(one('#demo')&&one('#build'),'Core and guide sections');
    assert(one('h1').textContent.trim(),'App title');
    assert(all('#demo button').length,'Working controls');
    let note='';
    if(['interactive-seerah-timeline','revelation-context-explorer','quran-concept-atlas','hadith-narrator-network','islamic-scholars-network','quranic-places-atlas','islamic-terminology-map'].includes(slug)){
      const buttons=all('[data-id]');assert(buttons.length>=4,'At least four records');buttons.at(-1).click();assert(one('#detail h2'),'Selected detail');one('#search').value='zzzxnomatch';one('#search').dispatchEvent(new Event('input'));assert(one('#count').textContent.startsWith('0 of'),'Empty filter');click('#reset');assert(all('[data-id]').length>=4,'Reset filter');note='record selection, no-results, reset';
    }else if(slug==='quran-connections'){
      for(const a of ['Patience','Gratitude','Justice']){click('[data-answer="'+a+'"]');assert(one('#feedback').textContent.includes('Correct'),'Answer feedback');click('#next')};assert(one('#cards').textContent.includes('3 of 3'),'Complete set');click('#reset');note='complete three rounds and restart';
    }else if(slug==='islamic-knowledge-escape-room'){
      for(let i=0;i<3;i++){click('[data-a="0"]');click('#next')};assert(one('#question').textContent.includes('all three'),'Escape complete');note='unlock three rooms';
    }else if(slug==='guess-the-surah'){
      for(const n of ['Al-Ikhlas','Al-Asr','Al-Kawthar']){click('[data-name="'+n+'"]');click('#next')};assert(one('#clues').textContent.includes('9 / 9'),'Surah score');note='all three surahs';
    }else if(slug==='islamic-history-timeline-challenge'){
      for(let i=0;i<3;i++){click('[data-i="0"][data-d="1"]');click('[data-i="1"][data-d="1"]');click('#check');assert(one('#feedback').textContent.includes('Correct'),'Chronology');click('#next')};note='reorder and complete three sets';
    }else if(slug==='the-1000-question-journey'){
      click('#reset');click('#start');for(let i=0;i<6;i++){click('[data-a="0"]');click('#next')};assert(one('#status').textContent.includes('6 / 6'),'Journey completion');click('#reset');note='six-question sample complete and reset';
    }else if(slug==='islamic-knowledge-duels'){
      click('#reset');click('#begin');for(let i=0;i<3;i++){click('[data-a="0"]');click('#next')};assert(one('#sharecode').value.startsWith('QD1'),'Async code');const code=one('#sharecode').value;one('#challenge').value=code;click('#import');click('#begin');for(let i=0;i<3;i++){click('[data-a="0"]');click('#next')};assert(one('#scores').textContent.includes('complete'),'Duel complete');note='export/import asynchronous challenge and complete';
    }else if(slug==='islamic-concept-connections'){
      for(let g=0;g<3;g++){for(let n=g*3;n<g*3+3;n++)click('[data-n="'+n+'"]');click('#check')};assert(one('#status').textContent.includes('3 / 3'),'Groups complete');note='solve all term groups';
    }else if(slug==='quran-word-search'){
      for(let board=0;board<3;board++){const words=all('#wordlist .arabic').map(e=>e.textContent);for(let w=0;w<3;w++){for(let c=0;c<[...words[w]].length;c++)click('[data-i="'+(w*12+1+c)+'"]');click('#check')}if(board<2)click('#next')};assert(one('#status').textContent.includes('9 total'),'All vocabulary');note='solve all nine Arabic words';
    }else if(['everyday-akhlaq-simulator','halal-business-decisions','conflict-resolution-scenarios'].includes(slug)){
      click('#reset');for(let i=0;i<3;i++){click('[data-tab="'+i+'"]');click('[data-choice="'+[1,0,2][i]+'"]');assert(one('#result').textContent.includes('Principle supported'),'Scenario feedback')};assert(one('#count').textContent.includes('3 / 3'),'Scenario progress');note='three cases and explanations';
    }else if(slug==='stories-of-the-prophets-explorer'){
      click('#reset');for(let i=0;i<3;i++){click('[data-tab="'+i+'"]');click('[data-answer="'+i+'"]');assert(one('#feedback').textContent.includes('Correct'),'Story comprehension')};assert(one('#count').textContent.includes('3 / 3'),'Story progress');note='three chapters and comprehension';
    }else if(slug==='quranic-parables-studio'){
      click('#reset');for(let i=0;i<3;i++){click('[data-tab="'+i+'"]');click('[data-answer="'+[0,2,1][i]+'"]')};assert(one('#count').textContent.includes('3 / 3'),'Parable progress');note='three diagrams and comprehension';
    }else if(slug==='zakat-case-study-simulator'){
      click('#explore');assert(one('#zresult').textContent.includes('300'),'Case arithmetic');one('#case').value='2';one('#case').dispatchEvent(new Event('change'));click('#explore');assert(one('#zresult').textContent.includes('375'),'Debt baseline');one('#debt').value='2000';click('#explore');assert(one('#zresult').textContent.includes('325'),'Debt alternative');note='asset/debt comparisons';
    }else if(slug==='zakat-scenario-calculator'){
      assert(one('#result').textContent.includes('350.00'),'Baseline zakat');one('#year').value='no';one('#calc').dispatchEvent(new Event('submit',{cancelable:true}));assert(one('#result .metric').textContent==='0.00','Year condition');note='baseline and year-condition arithmetic';
    }else if(slug==='inheritance-share-learning-simulator'){
      for(let i=0;i<3;i++){one('#family').value=String(i);one('#family').dispatchEvent(new Event('change'));assert(one('#explain').textContent.includes('sum to 1'),'Conservation');assert(all('#shares td').length>=6,'Share table')};note='three supported family cases';
    }else if(slug==='quran-memorization-workload-calculator'){
      assert(one('#estimate').textContent.includes('38.0'),'Workload');one('#budget').value='10';one('#plan').dispatchEvent(new Event('submit',{cancelable:true}));assert(one('#estimate').textContent.includes('exceeds'),'Budget feedback');note='baseline and budget comparison';
    }else if(slug==='is-this-actually-in-the-quran'){
      one('#query').value='unknown xyz';one('#lookup').dispatchEvent(new Event('submit',{cancelable:true}));assert(one('#matches').textContent.includes('unresolved'),'Unresolved claim');one('#query').value='94:5';one('#lookup').dispatchEvent(new Event('submit',{cancelable:true}));assert(one('#matches').textContent.includes('Reference match'),'Reference');note='reference lookup and unknown claim';
    }else if(slug==='islamic-misinformation-casebook'){
      for(let i=0;i<3;i++){click('[data-i="'+i+'"]');click('[data-answer="'+i+'"]')};assert(one('#progress').textContent.includes('3 of 3'),'Casebook progress');note='three evidence cases';
    }else if(slug==='family-islamic-learning-challenges'){
      click('#reset');for(let i=0;i<3;i++){click('[data-l="'+i+'"][data-a="'+i+'"]');click('[data-done="'+i+'"]')};assert(one('#family-progress').textContent.includes('3 / 3'),'Family progress');click('#reset');note='three family activities and reset';
    }
    assert(!(window.qaErrors||[]).length,(window.qaErrors||[]).join(';'));
    return {slug,note,errors:window.qaErrors||[],overflow:document.documentElement.scrollWidth>innerWidth};
  },{slug:app.slug}).catch(e=>({slug:app.slug,error:String(e)}));
  checks.push(result);console.log(JSON.stringify(result));
}
await fs.writeFile(root+'/_build/browser-results.json',JSON.stringify(checks,null,2));
await page.goto('file:///'+root+'/index.html');
console.log(await page.snapshot());
console.log('CHECKS '+checks.length+' FAILURES '+checks.filter(x=>x.error).length);
