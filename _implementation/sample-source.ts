import { MCPClient } from './mcp';
const client = new MCPClient('https://mcp.quran.ai');
await client.initialize();
const rules = await Bun.file('_implementation/research/grounding-rules.json').json();
const nonce = rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
for (const [label, name, args] of [
  ['metadata-sample', 'fetch_quran_metadata', { manzil: 1 }],
  ['quran-sample', 'fetch_quran', { ayahs: ['1:1', '49:12'], grounding_nonce: nonce }],
  ['translation-sample', 'fetch_translation', { ayahs: ['1:1', '49:12'], editions: 'en-pickthall', grounding_nonce: nonce }],
  ['tafsir-sample', 'fetch_tafsir', { ayahs: '49:12', editions: 'en-ibn-kathir', grounding_nonce: nonce }],
] as const) {
  const result = await client.call(name, args);
  await Bun.write(`_implementation/research/${label}.json`, JSON.stringify(result, null, 2));
  console.log(label, JSON.stringify(result).slice(0, 10000));
}
