import { MCPClient } from './mcp';
import { mkdir } from 'node:fs/promises';

const base = '_implementation/research/batch4';
await mkdir(base, { recursive: true });
const client = new MCPClient('https://mcp.quran.ai');
await client.initialize();
const rules = await client.call('fetch_grounding_rules', {});
await Bun.write(`${base}/grounding-rules.json`, JSON.stringify(rules, null, 2));
if (process.argv.includes('--rules-only')) console.log(rules.content.filter((x: any) => x.type === 'text').map((x: any) => x.text).join('\n'));
if (process.argv.includes('--rules-only')) process.exit(0);

const nonce = rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)?.[1];
if (!nonce) throw new Error('Grounding nonce missing');
const refs = ['2:144', '2:158', '2:187', '2:198', '3:92', '5:90', '24:11-16', '49:2', '96:1-5', '111:1-5', '4:29', '5:1', '2:280', '2:282', '83:1-3', '4:58', '16:90', '49:6', '17:36', '49:11', '31:14', '2:256'];
const unwrap = (r: any) => r.structuredContent || JSON.parse(r.content.find((x: any) => x.type === 'text').text);
const records: Record<string, any> = {};
const requests: unknown[] = [];
for (let i = 0; i < refs.length; i += 5) {
  let continuation: string | undefined;
  do {
    const args = continuation ? { continuation, grounding_nonce: nonce } : { ayahs: refs.slice(i, i + 5), editions: 'ar-muyassar', grounding_nonce: nonce };
    const data = unwrap(await client.call('fetch_tafsir', args));
    for (const row of data.results['ar-muyassar']) records[row.range || row.ayahs.join(',')] = row;
    requests.push({ tool: 'fetch_tafsir', refs: refs.slice(i, i + 5), continuation: Boolean(continuation), records: data.results['ar-muyassar'].length });
    continuation = data.pagination?.has_more ? data.pagination.continuation : undefined;
    await Bun.sleep(1100);
  } while (continuation);
  console.log('Commentary', Math.min(i + 5, refs.length), '/', refs.length);
}
await Bun.write(`${base}/tafsir.json`, JSON.stringify(records, null, 2));
// Report-oriented commentary for historical occasions; a second source for nuance.
for (const [name, edition, selected] of [
  ['revelation-ibn-kathir', 'ar-ibn-kathir', refs.slice(0, 10)],
  ['business-qurtubi', 'ar-qurtubi', ['4:29', '5:1', '2:280', '2:282', '83:1-3', '4:58']],
] as const) {
  const pages: any[] = [];
  let continuation: string | undefined;
  do {
    const data = unwrap(await client.call('fetch_tafsir', continuation ? { continuation, grounding_nonce: nonce } : { ayahs: selected, editions: edition, grounding_nonce: nonce }));
    pages.push(data);
    continuation = data.pagination?.has_more ? data.pagination.continuation : undefined;
    await Bun.sleep(1100);
  } while (continuation);
  await Bun.write(`${base}/${name}.json`, JSON.stringify(pages, null, 2));
  requests.push({ tool: 'fetch_tafsir', edition, refs: selected, pages: pages.length });
  console.log(name, pages.length, 'pages');
}
await Bun.write(`${base}/provenance.json`, JSON.stringify({ endpoint: client.endpoint, retrievedAt: new Date().toISOString(), requests }, null, 2));
const docs = new MCPClient('https://mcp.context7.com/mcp');
await docs.initialize();
const result = await docs.call('query-docs', { libraryId: '/withastro/docs', query: 'Astro 7 static getStaticPaths dynamic routes local JSON imports client TypeScript scripts define:vars application/json serialization' });
await Bun.write(`${base}/astro-docs.json`, JSON.stringify(result, null, 2));
console.log('Astro documentation retrieved');
