import {MCPClient} from './mcp';
const c=new MCPClient('https://mcp.quran.ai');await c.initialize();const r=await c.call('fetch_grounding_rules',{});const nonce=r.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
for(const [name,edition,refs] of [['parables-context','ar-muyassar',['2:17-20','2:261','2:264-265','14:24-27','18:32-44','18:45','24:35','29:41','39:29','57:20','59:21','62:5']],['light-second-source','ar-jalalayn',['24:35']]] as const){
 const result=await c.call('fetch_tafsir',{ayahs:refs,editions:edition,grounding_nonce:nonce});await Bun.write(`_implementation/research/batch3/${name}.json`,JSON.stringify(result,null,2));console.log(name);
}
const docs=new MCPClient('https://mcp.context7.com/mcp');await docs.initialize();const result=await docs.call('query-docs',{libraryId:'/withastro/docs',query:'Static Astro getStaticPaths pages with bundled local audio files in public directory and client-side TypeScript scripts'});await Bun.write('_implementation/research/batch3/astro-docs.json',JSON.stringify(result,null,2));console.log('Astro docs retrieved');
