import { MCPClient } from './mcp';
const client = new MCPClient('https://mcp.quran.ai');
await client.initialize();
const rules = await Bun.file('_implementation/research/grounding-rules.json').json();
const nonce = rules.content[0].text.match(/<grounding_nonce>(.*?)<\/grounding_nonce>/)[1];
for (const [name, editions] of [['fetch_quran', 'ar-uthmani-hafs'], ['fetch_translation', 'en-pickthall']] as const) {
  const result = await client.call(name, { ayahs: ['1:1', '49:12'], editions, grounding_nonce: nonce });
  await Bun.write(`_implementation/research/${name}-shape.json`, JSON.stringify(result, null, 2));
  console.log(name, JSON.stringify(result));
}
