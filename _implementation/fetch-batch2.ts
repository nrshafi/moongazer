import {MCPClient} from './mcp';
import {mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='_implementation/research';
await mkdir(`${base}/corpus-chunks`,{recursive:true});
const original=await Bun.file(`${base}/quran-snapshot.json`).json();
const refs=original.chapters.flatMap((c:any)=>Array.from({length:c.verses_count},(_,i)=>`${c.number}:${i+1}`));
const client=new MCPClient('https://mcp.quran.ai');await client.initialize();
const rules=await client.call('fetch_grounding_rules',{});
await Bun.write(`${base}/batch2-grounding-rules.json`,JSON.stringify(rules,null,2));
const nonce=rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
const unwrap=(r:any)=>r.structuredContent||JSON.parse(r.content.find((c:any)=>c.type==='text').text);
const audit:any[]=[];
for(const [tool,edition,field] of [['fetch_quran','ar-uthmani-hafs','arabic'],['fetch_translation','en-pickthall','translation']]){
 for(let i=0;i<refs.length;i+=200){
  const path=`${base}/corpus-chunks/${field}-${i}.json`;
  if(await Bun.file(path).exists()){console.log(`Cached ${field} ${i}`);continue;}
  const rows:any[]=[];let continuation:string|undefined;
  do{await Bun.sleep(1100);const d=unwrap(await client.call(tool!,continuation?{continuation,grounding_nonce:nonce}:{ayahs:refs.slice(i,i+200),editions:edition,grounding_nonce:nonce}));
   rows.push(...d.results[edition!]);continuation=d.pagination?.has_more?d.pagination.continuation:undefined;
   audit.push({tool,offset:i,count:d.results[edition!].length,hasMore:!!continuation});
  }while(continuation);
  if(rows.length!==refs.slice(i,i+200).length)throw new Error(`Incomplete ${path}: ${rows.length}`);
  await Bun.write(path,JSON.stringify(rows));console.log(`${field} ${Math.min(i+200,refs.length)}/${refs.length}`);
 }
}
const verses:Record<string,any>={};
for(const field of ['arabic','translation'])for(let i=0;i<refs.length;i+=200){for(const row of await Bun.file(`${base}/corpus-chunks/${field}-${i}.json`).json()){
 verses[row.ayah]??={ref:row.ayah,url:`https://quran.com/${row.ayah}`};verses[row.ayah][field]=row.text;
 if(row.citation_url)verses[row.ayah].translationUrl=row.citation_url;
}}
if(Object.keys(verses).length!==6236||Object.values(verses).some((v:any)=>!v.arabic||!v.translation))throw new Error('Corpus integrity failed');
const serialized=JSON.stringify({chapters:original.chapters,verses,tafsir:original.tafsir});
await Bun.write(`${base}/quran-full.json`,serialized);
await Bun.write(`${base}/batch2-provenance.json`,JSON.stringify({provider:'Quran Foundation Quran MCP',endpoint:'https://mcp.quran.ai',retrievedAt:new Date().toISOString(),quranEdition:'ar-uthmani-hafs',translationEdition:'en-pickthall',commentaryEdition:'ar-muyassar',verseCount:6236,snapshotSha256:createHash('sha256').update(serialized).digest('hex'),requests:audit},null,2));
console.log('COMPLETE: all 6236 Arabic and Pickthall ayahs');
