// Lightweight DOM simulation for local game behavior. Real layout QA is separate.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function load(slug,storage=new Map()){
 const html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');
 const ids=new Map(),all=new Set();
 class El{
  constructor(attrs=''){this.dataset={};this.style={};this.disabled=/\bdisabled\b/.test(attrs);this.hidden=/\bhidden\b/.test(attrs);this.children=[];this.textContent='';this._html='';for(const m of attrs.matchAll(/([\w-]+)="([^"]*)"/g)){if(m[1]==='id'){this.id=m[2];ids.set(this.id,this);}if(m[1].startsWith('data-'))this.dataset[m[1].slice(5)]=m[2];}all.add(this);}
  set innerHTML(s){this.children.forEach(x=>{all.delete(x);if(x.id)ids.delete(x.id);});this.children=[];this._html=s;for(const m of s.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){const e=new El(m[1]);e.textContent=m[2];this.children.push(e);}}
  get innerHTML(){return this._html;}
  insertAdjacentHTML(position,s){this._html+=s;}
 }
 for(const m of html.matchAll(/<\w+\b([^>]*\bid="[^"]+"[^>]*)>/g))new El(m[1]);
 const doc={querySelector(s){if(s.startsWith('#'))return ids.get(s.slice(1))||null;throw Error(s);},querySelectorAll(s){const attr=s.match(/^\[data-([\w-]+)\]$/);if(attr)return [...all].filter(x=>attr[1] in x.dataset);throw Error(s);}};
 const ctx=vm.createContext({document:doc,console,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});
 const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 new vm.Script(code,{filename:slug+'.js'}).runInContext(ctx);
 const run=s=>vm.runInContext(s,ctx),el=id=>ids.get(id),click=id=>{const e=el(id);assert(e,'Missing #'+id);assert(!e.disabled,'Disabled #'+id);assert.equal(typeof e.onclick,'function');e.onclick();},data=(key,value)=>{const e=[...all].find(x=>x.dataset[key]===String(value));assert(e,`Missing data-${key}=${value}`);assert(!e.disabled);e.onclick();};
 return {run,el,click,data,storage};
}
{
 const t=load('quran-connections');t.data('answer','Trade');assert.equal(t.run('score'),0);assert.match(t.el('feedback').textContent,/Patience/);t.click('next');t.data('answer','Gratitude');t.click('next');t.data('answer','Justice');t.click('next');assert.equal(t.run('score'),2);assert.match(t.el('cards').innerHTML,/2 of 3/);t.click('reset');assert.equal(t.run('round'),0);assert.equal(t.run('score'),0);
}
{
 const t=load('islamic-knowledge-escape-room');t.data('a',1);assert.equal(t.run('unlocked'),false);for(let i=0;i<3;i++){t.data('a',0);assert.equal(t.run('unlocked'),true);t.click('next');}assert.match(t.el('question').textContent,/all three rooms/);assert.equal(t.run('attempts'),4);t.click('reset');assert.equal(t.run('room'),0);
}
{
 const t=load('islamic-knowledge-duels');for(let p=0;p<2;p++){t.click('begin');for(let q=0;q<3;q++){t.data('a',p===0?0:1);t.click('next');}}assert.match(t.el('stage').innerHTML,/Player A wins/);assert.deepEqual(Array.from(t.run('scores')),[3,0]);assert.equal(t.el('sharecode').value,'QD1-SAMPLE1-3');t.click('reset');assert.equal(t.run('player'),0);t.el('challenge').value='<script>bad</script>';t.click('import');assert.match(t.el('feedback').textContent,/Invalid code/);assert.equal(t.run('player'),0);t.el('challenge').value='QD1-SAMPLE1-9';t.click('import');assert.equal(t.run('player'),0);t.el('challenge').value='QD1-SAMPLE1-2';t.click('import');assert.equal(t.run('player'),1);t.click('begin');for(let q=0;q<3;q++){t.data('a',0);t.click('next');}assert.match(t.el('stage').innerHTML,/Player B wins/);
}
{
 const t=load('guess-the-surah');t.click('hint');t.data('name','Al-Ikhlas');t.click('next');t.click('hint');t.click('hint');t.data('name','Al-Asr');t.click('next');t.data('name','Al-Kawthar');t.click('next');assert.equal(t.run('score'),6);assert.match(t.el('clues').innerHTML,/6 \/ 9/);t.click('reset');assert.equal(t.run('hints'),1);
}
{
 const t=load('islamic-history-timeline-challenge');for(let r=0;r<3;r++){// each initial ordering is [latest,earliest,middle]
 t.run('document.querySelectorAll("[data-d]").find(x=>x.dataset.i==="0"&&x.dataset.d==="1").onclick()');t.run('document.querySelectorAll("[data-d]").find(x=>x.dataset.i==="1"&&x.dataset.d==="1").onclick()');t.click('check');assert.equal(t.run('solved'),true);t.click('next');}assert.equal(t.run('score'),3);assert.match(t.el('events').innerHTML,/All three sets complete/);t.click('reset');assert.equal(t.run('score'),0);
}
{
 const t=load('the-1000-question-journey');t.click('start');for(let i=0;i<6;i++){t.data('a',i===0?1:0);t.click('next');}assert.equal(t.run('saved.filter(x=>x===false).length'),1);const reload=load('the-1000-question-journey',t.storage);assert.equal(reload.run('saved.filter(x=>x===true).length'),5);reload.click('review');reload.data('a',0);reload.click('next');assert.equal(reload.run('saved.filter(x=>x===true).length'),6);reload.click('reset');assert.equal(reload.run('saved.filter(x=>x===null).length'),6);
}
{
 const t=load('islamic-concept-connections');for(let g=0;g<3;g++){for(let i=0;i<3;i++)t.data('n',g*3+i);t.click('check');}assert.equal(t.run('solved.length'),3);assert.equal(t.el('check').disabled,true);t.click('reset');assert.equal(t.run('solved.length'),0);
}
{
 const t=load('quran-word-search');t.data('i',1);t.data('i',3);assert.equal(t.run('selected.length'),1,'Skip a cell must fail');t.click('clear');for(let b=0;b<3;b++){const lengths=t.run('boards[board].map(w=>[...w[0]].length)');for(let w=0;w<3;w++){for(let k=0;k<lengths[w];k++)t.data('i',w*12+k+1);t.click('check');}if(b<2)t.click('next');}assert.equal(t.run('total'),9);assert.match(t.el('feedback').textContent,/All nine/);t.click('reset');assert.equal(t.run('total'),0);
}
console.log('PASS: eight scripts initialize; complete game flows, wrong answers, reset, storage resume, hint scoring, chronological moves, grouping, and RTL contiguous paths.');
