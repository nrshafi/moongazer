import { MCPClient } from './mcp';
const client = new MCPClient('https://mcp.quran.ai');
await client.initialize();
const rules = await client.call('fetch_grounding_rules', {});
await Bun.write('_implementation/research/grounding-rules.json', JSON.stringify(rules, null, 2));
console.log('GROUNDING', JSON.stringify(rules));
const resources = await client.request('resources/list');
await Bun.write('_implementation/research/quran-resources.json', JSON.stringify(resources, null, 2));
console.log('RESOURCES', JSON.stringify(resources));
