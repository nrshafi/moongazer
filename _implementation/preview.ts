import { resolve, join, sep } from 'node:path';
const allApps=['guess-the-surah','quran-connections','the-seerah-detective','everyday-akhlaq-simulator','interactive-seerah-timeline','quran-memorization-workload-calculator','is-this-actually-in-the-quran','quran-concept-atlas','islamic-knowledge-escape-room','stories-of-the-prophets-explorer','quranic-places-atlas','islamic-concept-connections','islamic-history-timeline-challenge','understand-salah-lab','quranic-parables-studio','islamic-civilization-timeline','halal-business-decisions','revelation-context-explorer','family-islamic-learning-challenges','islamic-misinformation-casebook'];
const apps=process.argv.includes('--batch4')?allApps.slice(15,20):allApps;
for(const [index,app] of apps.entries()) {
  const directory=resolve(import.meta.dir,'..','apps',app,'dist');
  const server=Bun.serve({hostname:'127.0.0.1',port:4321+allApps.indexOf(app),async fetch(request){
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
