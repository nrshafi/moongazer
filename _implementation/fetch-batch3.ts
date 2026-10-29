import {MCPClient} from './mcp';
import {mkdir} from 'node:fs/promises';
const base='_implementation/research/batch3';await mkdir(base,{recursive:true});
const client=new MCPClient('https://mcp.quran.ai');await client.initialize();
const rules=await client.call('fetch_grounding_rules',{});await Bun.write(`${base}/grounding-rules.json`,JSON.stringify(rules,null,2));
const nonce=rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
const refs=['48:24','3:96','9:101','12:99','15:80','17:1','23:20','28:22','46:21','89:7','34:15','20:12','11:44','2:198','2:158','2:17','2:19','2:261','2:264','2:265','14:24','18:32','18:45','24:35','29:41','39:29','57:20','59:21','62:5','1:1','1:2','1:3','1:4','1:5','1:6','1:7','112:1','112:2','112:3','112:4'];
const unwrap=(r:any)=>r.structuredContent||JSON.parse(r.content.find((x:any)=>x.type==='text').text);
const tafsir:Record<string,any>={};const requests:any[]=[];
for(let i=0;i<refs.length;i+=8){let continuation:string|undefined;do{
 await Bun.sleep(1100);const d=unwrap(await client.call('fetch_tafsir',continuation?{continuation,grounding_nonce:nonce}:{ayahs:refs.slice(i,i+8),editions:'ar-muyassar',grounding_nonce:nonce}));
 for(const row of d.results['ar-muyassar'])tafsir[row.range||row.ayahs.join(',')]=row;
 requests.push({tool:'fetch_tafsir',edition:'ar-muyassar',refs:refs.slice(i,i+8),count:d.results['ar-muyassar'].length});continuation=d.pagination?.has_more?d.pagination.continuation:undefined;
 }while(continuation);console.log(`Commentary anchors ${Math.min(i+8,refs.length)}/${refs.length}`);}
await Bun.write(`${base}/tafsir.json`,JSON.stringify(tafsir,null,2));await Bun.write(`${base}/provenance.json`,JSON.stringify({endpoint:client.endpoint,retrievedAt:new Date().toISOString(),requests},null,2));
console.log('Complete',Object.keys(tafsir).length,'commentary records');
