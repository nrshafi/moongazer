// Cloudflare schemas: /pages/assets/check-missing, /upload, /upsert-hashes.
// Hash format matches cloudflare/workers-sdk deploy-helpers/src/deploy/helpers/hash.ts.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash } from 'blake3-wasm';

const root = fileURLToPath(new URL('../', import.meta.url));
const targets = JSON.parse(await readFile(join(root,'deployment/targets.json'),'utf8'));
const sites = [{name:'moongazer',domain:'moongazer.tech',directory:'homepage/dist'}, ...targets.map(app=>({name:`moongazer-${app.slug}`,domain:`${app.slug}.moongazer.tech`,directory:`apps/${app.slug}/dist`}))];
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.woff':'font/woff','.mp3':'audio/mpeg','.ogg':'audio/ogg','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const assets = new Map();
const manifests = [];
const selectedSite = process.argv.find(argument=>argument.startsWith('--site='))?.slice(7);
for (const site of sites) {
  if(selectedSite && site.name!==selectedSite)continue;
  if (process.argv.includes('--homepage-only') && site.name !== 'moongazer') continue;
  // P4: the apex ships through `wrangler pages deploy` so its Functions and D1 binding deploy with it.
  if (process.argv.includes('--apps-only') && site.name === 'moongazer') continue;
  const directory = join(root,site.directory);
  const manifest = {};
  let bytes = 0;
  let headers = '';
  let redirects = '';
  async function walk(folder) {
    for (const entry of await readdir(folder,{withFileTypes:true})) {
      const path = join(folder,entry.name);
      if (entry.isSymbolicLink()) throw new Error('Refusing symbolic link in static output');
      if (entry.isDirectory()) { await walk(path); continue; }
      const key = '/' + relative(directory,path).replaceAll('\\','/');
      const content = await readFile(path);
      if (key === '/_headers') { headers = content.toString(); continue; }
      if (key === '/_redirects') { redirects = content.toString(); continue; }
      if (content.byteLength > 25 * 1024 * 1024) throw new Error(`Asset exceeds Pages limit: ${key}`);
      const base64 = content.toString('base64');
      const digest = hash(site.name + ':' + base64 + extname(path).slice(1)).toString('hex').slice(0,32);
      const contentType = mime[extname(path)] || 'application/octet-stream';
      if (!assets.has(digest)) assets.set(digest,{key:digest,value:base64,metadata:{contentType},base64:true});
      manifest[key] = digest;
      bytes += content.byteLength;
    }
  }
  await walk(directory);
  if (!manifest['/index.html'] || !manifest['/404.html'] || !headers) throw new Error(`Incomplete output: ${site.name}`);
  manifests.push({...site,hashFormat:'blake3-project-v1',manifest,headers,redirects,bytes});
}
await mkdir(join(root,'deployment/manifests'),{recursive:true});
if(!manifests.length)throw new Error('No deployment site matches the requested selection');
await writeFile(join(root,'deployment/manifests/pending.json'),JSON.stringify(manifests,null,2));
console.log(`Prepared ${manifests.length} sites and ${assets.size} unique static assets.`);
if (process.argv.includes('--prepare-only')) process.exit(0);

async function readToken() {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  console.log('Ready for project-to-upload-token JSON on stdin. Input is hidden.');
  let input = '';
  return await new Promise((resolve,reject)=>{
    const listener = chunk => {
      input += chunk.toString();
      if (input.includes('\u0003')) process.exit(130);
      if (input.length > 500000) reject(new Error('Invalid token input'));
      if (input.includes('\n') || input.includes('\r')) {
        process.stdin.off('data',listener);
        process.stdin.pause();
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        try {
          const tokens=JSON.parse(input.trim());
          for(const site of manifests) if(typeof tokens[site.name]!=='string'||!/^[A-Za-z0-9_.-]+$/.test(tokens[site.name]))throw new Error('Invalid project token');
          resolve(tokens);
        } catch {reject(new Error('Invalid project token input'));}
      }
    };
    process.stdin.on('data',listener);
    process.stdin.resume();
  });
}
const tokens = await readToken();
let jwt;
async function request(path,body) {
  for (let attempt=0;attempt<4;attempt++) {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/pages/assets/${path}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${jwt}`},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(`Cloudflare ${path} returned HTTP ${response.status}, codes ${(result.errors||[]).map(error=>error.code).join(',')}`);
      return result.result;
    } catch (error) {
      if (attempt===3) throw error;
      await new Promise(resolve=>setTimeout(resolve,1000*2**attempt));
    }
  }
}
const evidence=[];
// Assets must be uploaded into the namespace identified by EACH project's JWT.
for(const site of manifests){
  jwt=tokens[site.name];
  const hashes=[...new Set(Object.values(site.manifest))];
  const missing=await request('check-missing',{hashes});
  console.log(`${site.name}: ${missing.length}/${hashes.length} assets missing in this project.`);
  let batch=[];let batchBytes=0;
  async function flush(){if(batch.length){await request('upload',batch);batch=[];batchBytes=0;}}
  for(const key of missing){
    const asset=assets.get(key);
    if(!asset)throw new Error('Unexpected asset hash from upload service');
    if(batchBytes+asset.value.length>8*1024*1024||batch.length>=100)await flush();
    batch.push(asset);batchBytes+=asset.value.length;
  }
  await flush();
  await request('upsert-hashes',{hashes});
  const remaining=await request('check-missing',{hashes});
  if(remaining.length)throw new Error(`Incomplete upload for ${site.name}`);
  evidence.push({project:site.name,assets:hashes.length,uploaded:missing.length,cached:hashes.length-missing.length});
  console.log(`${site.name}: all ${hashes.length} assets verified in project storage.`);
}
let recorded = manifests;
if (process.argv.includes('--homepage-only')) {
  const previous = JSON.parse(await readFile(join(root,'deployment/manifests/uploaded.json'),'utf8').catch(()=>'[]'));
  recorded = [...manifests,...previous.filter(site=>site.name!=='moongazer')];
}
if (process.argv.includes('--apps-only')) {
  const previous = JSON.parse(await readFile(join(root,'deployment/manifests/uploaded.json'),'utf8').catch(()=>'[]'));
  recorded = [...previous.filter(site=>site.name==='moongazer'),...manifests];
}
await writeFile(join(root,'deployment/manifests/uploaded.json'),JSON.stringify(recorded,null,2));
const evidenceFile = process.argv.includes('--homepage-only') ? 'upload-homepage.json' : 'upload-projects.json';
await writeFile(join(root,'deployment/evidence',evidenceFile),JSON.stringify({at:new Date().toISOString(),sites:manifests.length,uniqueAssets:assets.size,projects:evidence},null,2));
console.log(`Static assets ready for ${manifests.length} Pages deployments. No token was saved.`);
