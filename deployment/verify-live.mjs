import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash } from 'blake3-wasm';
import { publicGet, dnsEvidence } from './https-public-dns.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const get=process.argv.includes('--public-dns')?publicGet:(url,options={})=>fetch(url,{...options,signal:AbortSignal.timeout(45000)});
const manifests = JSON.parse(await readFile(join(root,'deployment/manifests/pending.json'),'utf8'));
const checks = [];
const jobs = [];
for (const site of manifests) {
  for (const [path,digest] of Object.entries(site.manifest)) {
    jobs.push(async()=>{
      const url = new URL(path,`https://${site.domain}`);
      try {
        const response = await get(url);
        const bytes = Buffer.from(await response.arrayBuffer());
        const actual = hash((site.hashFormat==='blake3-project-v1'?site.name+':':'')+bytes.toString('base64')+extname(path).slice(1)).toString('hex').slice(0,32);
        const pass = actual === digest && (response.status===200 || path==='/404.html'&&response.status===404);
        const headers = response.headers;
        const secured = headers.get('x-content-type-options')==='nosniff' && headers.get('x-frame-options')==='DENY' && !!headers.get('content-security-policy');
        checks.push({site:site.name,path,status:response.status,bytes:bytes.length,matched:actual===digest,secured,pass:pass&&secured});
      } catch(error) { checks.push({site:site.name,path,pass:false,error:error.message}); }
    });
  }
  jobs.push(async()=>{
    try {
      const response = await get(`https://${site.domain}/moongazer-verification-missing-page/`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const actual = hash((site.hashFormat==='blake3-project-v1'?site.name+':':'')+bytes.toString('base64')+'html').toString('hex').slice(0,32);
      checks.push({site:site.name,path:'<missing-page>',status:response.status,pass:response.status===404&&actual===site.manifest['/404.html']});
    } catch(error) {checks.push({site:site.name,path:'<missing-page>',pass:false,error:error.message});}
  });
}
let index=0;
let done=0;
async function worker() {
  while(index<jobs.length) {
    const job=jobs[index++];
    await job();
    done++;
    if (done%100===0) console.log(`Verified ${done}/${jobs.length} production requests.`);
  }
}
await Promise.all(Array.from({length:8},worker));
for (const path of ['/', '/?library=all']) {
  try {
    const response=await get(`https://www.moongazer.tech${path}`,{redirect:'manual'});
    checks.push({site:'moongazer-www',path,status:response.status,location:response.headers.get('location'),pass:response.status===301&&response.headers.get('location')===`https://moongazer.tech${path}`});
  } catch(error) {checks.push({site:'moongazer-www',path,pass:false,error:error.message});}
}
const failures=checks.filter(check=>!check.pass);
for(const site of manifests){
  try{
    const response=await get(`http://${site.domain}/`,{redirect:'manual'});
    checks.push({site:site.name,path:'<http-to-https>',status:response.status,location:response.headers.get('location'),pass:[301,308].includes(response.status)&&response.headers.get('location')===`https://${site.domain}/`});
  }catch(error){checks.push({site:site.name,path:'<http-to-https>',pass:false,error:error.message});}
}
failures.splice(0,failures.length,...checks.filter(check=>!check.pass));
const result={at:new Date().toISOString(),sites:manifests.length,requests:checks.length,passed:checks.length-failures.length,failed:failures.length,htmlPages:manifests.reduce((n,m)=>n+Object.keys(m.manifest).filter(p=>p.endsWith('.html')).length,0),checks};
await writeFile(join(root,'deployment/evidence/live-http.json'),JSON.stringify(result,null,2));
await writeFile(join(root,'deployment/evidence/public-dns.json'),JSON.stringify(dnsEvidence,null,2));
console.log(JSON.stringify({sites:result.sites,requests:result.requests,passed:result.passed,failed:result.failed,htmlPages:result.htmlPages,failures},null,2));
if(failures.length)process.exitCode=1;
