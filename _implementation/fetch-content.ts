import { MCPClient } from './mcp';
import { createHash } from 'node:crypto';
const client = new MCPClient('https://mcp.quran.ai');
await client.initialize();
const rules = await client.call('fetch_grounding_rules', {});
await Bun.write('_implementation/research/grounding-rules.json', JSON.stringify(rules, null, 2));
const nonce = rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
const seed = await Bun.file('_implementation/research/activity-seed.json').json();
const unwrap = (result: any) => result.structuredContent || JSON.parse(result.content.find((item: any) => item.type === 'text').text);
const chapterMap = new Map<number, any>();
for (let manzil=1; manzil<=7; manzil++) {
  const data=unwrap(await client.call('fetch_quran_metadata', { manzil }));
  for(const surah of data.surah) chapterMap.set(surah.number,surah);
  await Bun.write(`_implementation/research/manzil-${manzil}.json`,JSON.stringify(data,null,2));
  console.log(`Metadata ${manzil}/7; ${chapterMap.size} chapters`);
}
if(chapterMap.size!==114) throw new Error('Incomplete chapter metadata');
const refs = new Set<string>(Array.from({length:114},(_,i)=>`${i+1}:1`));
for(const puzzle of seed.connections) for(const ref of puzzle.refs) refs.add(ref);
for(const scenario of seed.scenarios) refs.add(scenario.ref);
for(const ref of ['96:1-5','9:40','17:1','48:1','48:18','110:1-3','3:144','33:21','33:9','3:123','3:152','8:9','5:3','2:144','53:13-18']) refs.add(ref);
const verses: Record<string,any> = {};
const audit:any[]=[];
async function retrieve(name:string, edition:string, selection:string[], store:Record<string,any>) {
  let data=unwrap(await client.call(name,{ayahs:selection,editions:edition,grounding_nonce:nonce}));
  for(let page=0;page<100;page++) {
    audit.push({tool:name,edition,requested:page===0?selection:undefined,page,items:data.pagination?.pages,hasMore:data.pagination?.has_more});
    for(const item of data.results[edition]||[]) {
      if(name==='fetch_tafsir') {
        const key=item.range || item.ayahs.join(',');
        store[key]=item;
      } else {
        store[item.ayah]??={ref:item.ayah,url:`https://quran.com/${item.ayah}`};
        store[item.ayah][name==='fetch_quran'?'arabic':'translation']=item.text;
        if(item.citation_url) store[item.ayah].translationUrl=item.citation_url;
      }
    }
    if(!data.pagination?.has_more) return;
    if(!data.pagination.continuation) throw new Error('Missing continuation');
    data=unwrap(await client.call(name,{continuation:data.pagination.continuation,grounding_nonce:nonce}));
  }
  throw new Error('Pagination did not finish');
}
const selections=[...refs];
for(let offset=0;offset<selections.length;offset+=50) {
  const batch=selections.slice(offset,offset+50);
  await retrieve('fetch_quran','ar-uthmani-hafs',batch,verses);
  await retrieve('fetch_translation','en-pickthall',batch,verses);
  console.log(`Canonical passages ${Math.min(offset+50,selections.length)}/${selections.length}`);
}
for(const verse of Object.values(verses)) if(!verse.arabic||!verse.translation) throw new Error(`Incomplete ${verse.ref}`);
const tafsir:Record<string,any>={};
const anchors=[...new Set([...seed.connections.map((p:any)=>p.anchor),...seed.scenarios.map((s:any)=>s.ref)])] as string[];
// Concise King Fahd committee commentary supports editorial source checking.
for(let offset=0;offset<anchors.length;offset+=15) {
  await retrieve('fetch_tafsir','ar-muyassar',anchors.slice(offset,offset+15),tafsir);
  console.log(`Commentary anchors ${Math.min(offset+15,anchors.length)}/${anchors.length}`);
}
const snapshot={chapters:[...chapterMap.values()].sort((a,b)=>a.number-b.number),verses,tafsir};
const serialized=JSON.stringify(snapshot,null,2);
await Bun.write('_implementation/research/quran-snapshot.json',serialized);
const provenance={provider:'Quran Foundation Quran MCP',endpoint:'https://mcp.quran.ai',retrievedAt:new Date().toISOString(),quranEdition:'ar-uthmani-hafs',translationEdition:'en-pickthall',translationAuthor:'Marmaduke Pickthall',commentaryEdition:'ar-muyassar',chapters:114,verseCount:Object.keys(verses).length,snapshotSha256:createHash('sha256').update(serialized).digest('hex'),requests:audit};
await Bun.write('_implementation/research/provenance.json',JSON.stringify(provenance,null,2));
console.log(`COMPLETE ${Object.keys(verses).length} canonical ayahs; ${Object.keys(tafsir).length} commentary records`);
