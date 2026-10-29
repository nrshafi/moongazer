/** Isolated QA origins; serves production builds and their _headers unchanged.
 * Optional storage fault fixtures are injected only on these test ports.
 */
import {resolve,join,sep} from 'node:path';
import {readdir,mkdir} from 'node:fs/promises';
const root=resolve(import.meta.dir,'..');
const apps=[] as {slug:string;name:string;port:number;directory:string}[];
for(const slug of await readdir(join(root,'apps'))){
  const path=join(root,'apps',slug,'src/data/config.json');
  if(!await Bun.file(path).exists())continue;
  const config=await Bun.file(path).json();
  apps.push({slug,name:config.name,port:config.port+1000,directory:join(root,'apps',slug,'dist')});
}
apps.sort((a,b)=>a.port-b.port);
await mkdir(join(root,'_implementation/qa/e2e'),{recursive:true});
await Bun.write(join(root,'_implementation/qa/e2e/origins.json'),JSON.stringify(apps,null,2));

function headerRules(text:string){
  const rules:{pattern:string;headers:Record<string,string>}[]=[];
  for(const line of text.split(/\r?\n/)){
    if(!line.trim()||line.trim().startsWith('#'))continue;
    if(!/^\s/.test(line))rules.push({pattern:line.trim(),headers:{}});
    else{
      const colon=line.indexOf(':');
      if(colon>0&&rules.length)rules.at(-1)!.headers[line.slice(0,colon).trim()]=line.slice(colon+1).trim();
    }
  }
  return rules;
}
function storageFixture(slug:string,mode:string,run:string){
  if(!['blocked','expired','corrupt','future','invalid-time','clear'].includes(mode))return '';
  return `<script>(()=>{
 const prefix=${JSON.stringify(slug+':')};
 const mode=${JSON.stringify(mode)};
 const run=${JSON.stringify(run)};
 const key='e2e-fixture:'+mode+':'+run;
 const opposite=matchMedia('(prefers-color-scheme: dark)').matches?'light':'dark';
 if(mode==='blocked')Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Blocked for this isolated QA fixture','SecurityError')}});
 else if(!sessionStorage.getItem(key)){
   for(let i=localStorage.length-1;i>=0;i--){const item=localStorage.key(i);if(item?.startsWith(prefix))localStorage.removeItem(item);}
   const at=mode==='expired'?Date.now()-31*86400000:mode==='future'?Date.now()+86400000:mode==='invalid-time'?String(Date.now()):Date.now();
   localStorage.setItem(prefix+'theme',mode==='corrupt'?'broken-json':JSON.stringify({at,value:opposite}));
   if(mode==='clear'){localStorage.setItem(prefix+'qa-record',JSON.stringify({at,value:'disposable test record'}));localStorage.setItem('unrelated-e2e:sentinel','keep');}
   sessionStorage.setItem(key,'seeded');
 }
 document.addEventListener('DOMContentLoaded',()=>{
   const probe=document.createElement('p');probe.id='e2e-storage-probe';probe.setAttribute('role','status');probe.style.cssText='font:12px monospace;padding:12px;overflow-wrap:anywhere';
   let count=0,sentinel='unavailable';
   try{for(let i=0;i<localStorage.length;i++)if(localStorage.key(i)?.startsWith(prefix))count++;sentinel=localStorage.getItem('unrelated-e2e:sentinel')||'missing';}catch{}
   probe.textContent='QA fixture '+mode+' | app keys '+count+' | sentinel '+sentinel+' | expected system theme '+(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.body.append(probe);
 });
})();</script>`;
}
function clipboardFixture(mode:string){
  if(!['capture','fail'].includes(mode))return '';
  return `<script>(()=>{
 const mode=${JSON.stringify(mode)};
 const blobs=new Map();const create=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);blobs.set(url,blob);return url;};
 const click=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){
   const blob=blobs.get(this.href);if(this.download&&blob){const probe=document.getElementById('e2e-download-probe');if(probe){probe.dataset.ready='pending';const name=this.download;blob.text().then(text=>{probe.value=JSON.stringify({name,type:blob.type,text});probe.dataset.ready='yes';});}}
   return click.call(this);
 };
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{async writeText(text){
   if(mode==='fail')throw new DOMException('Clipboard denied for this isolated QA fixture','NotAllowedError');
   const probe=document.getElementById('e2e-clipboard-probe');if(probe)probe.value=text;
 }}});
 document.addEventListener('DOMContentLoaded',()=>{for(const [id,name] of [['e2e-clipboard-probe','QA clipboard capture'],['e2e-download-probe','QA download capture']]){const label=document.createElement('label');label.textContent=name;label.style.cssText='display:block;padding:12px;font:12px monospace';const area=document.createElement('textarea');area.id=id;area.readOnly=true;area.style.cssText='display:block;width:100%;min-height:60px';label.append(area);document.body.append(label);}});
})();</script>`;
}
const activeFixtures=new Map<number,{storage:string;run:string;clipboard:string}>();
for(const app of apps){
  const rules=headerRules(await Bun.file(join(app.directory,'_headers')).text());
  Bun.serve({hostname:'127.0.0.1',port:app.port,async fetch(request){
    const url=new URL(request.url);let pathname:string;
    try{pathname=decodeURIComponent(url.pathname);}catch{return new Response('Invalid URL',{status:400});}
    const target=resolve(app.directory,'.'+pathname);
    if(target!==app.directory&&!target.startsWith(app.directory+sep))return new Response('Not found',{status:404});
    const headers=new Headers();
    for(const rule of rules){
      const pattern=new RegExp('^'+rule.pattern.split('*').map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$');
      if(pattern.test(pathname))for(const [key,value] of Object.entries(rule.headers))headers.set(key,value);
    }
    for(const candidate of [target,join(target,'index.html')]){
      const file=Bun.file(candidate);
      if(!await file.exists())continue;
      try{if(!(await file.stat()).isFile())continue;}catch{continue;}
      if(candidate.endsWith('.html')){
        let html=await file.text();
        const fixture=activeFixtures.get(app.port)||{storage:'normal',run:'default',clipboard:'off'};
        if(url.searchParams.has('qa-storage'))fixture.storage=url.searchParams.get('qa-storage')!;
        if(url.searchParams.has('qa-run'))fixture.run=url.searchParams.get('qa-run')!;
        if(url.searchParams.has('qa-clipboard'))fixture.clipboard=url.searchParams.get('qa-clipboard')!;
        activeFixtures.set(app.port,fixture);
        html=html.replace('<head>','<head>'+storageFixture(app.slug,fixture.storage,fixture.run)+clipboardFixture(fixture.clipboard));
        headers.set('Content-Type','text/html; charset=utf-8');headers.set('Cache-Control','no-store');
        return new Response(html,{headers});
      }
      return new Response(file,{headers});
    }
    headers.set('Content-Type','text/html; charset=utf-8');
    return new Response(Bun.file(join(app.directory,'404.html')),{status:404,headers});
  }});
  console.log(`${app.slug}: http://127.0.0.1:${app.port}/`);
}
