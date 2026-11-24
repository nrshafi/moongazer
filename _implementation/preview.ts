import { resolve, join, sep } from 'node:path';
const apps=['ayah-threads','seerah-detective','everyday-akhlaq','seerah-timeline','hifz-planner','quran-escape-room','stories-of-the-prophets','places-in-the-quran','parables-of-the-quran','civilization-timeline','why-it-was-revealed','family-halaqa','zakat-calculator'];
for(const [index,app] of apps.entries()) {
  const directory=resolve(import.meta.dir,'..','apps',app,'dist');
  const server=Bun.serve({hostname:'127.0.0.1',port:4321+index,async fetch(request){
    const url=new URL(request.url);let pathname:string;
    try { pathname=decodeURIComponent(url.pathname); } catch { return new Response('Invalid path',{status:400}); }
    const target=resolve(directory,'.'+pathname);
    if(target!==directory&&!target.startsWith(directory+sep))return new Response('Not found',{status:404});
    for(const path of [target,join(target,'index.html')]) {
      const file=Bun.file(path);if(await file.exists()){try {const stat=await file.stat();if(stat.isFile())return new Response(file,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}catch{}}
    }
    return new Response(Bun.file(join(directory,'404.html')),{status:404,headers:{'Content-Type':'text/html'}});
  }});
  console.log(`${app}: http://127.0.0.1:${server.port}/`);
}
