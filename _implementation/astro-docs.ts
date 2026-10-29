import { MCPClient } from './mcp';
const client = new MCPClient('https://mcp.context7.com/mcp');
await client.initialize();
for (const [index, query] of [
  'Astro static output configuration and deployment to Cloudflare Pages without SSR adapter, build dist using Bun runtime',
  'Astro component TypeScript client script imports, script define:vars JSON data safely serialized application/json, scoped styles and getStaticPaths static detail pages',
].entries()) {
  const result = await client.call('query-docs', { libraryId: '/withastro/docs', query, language: 'TypeScript' });
  await Bun.write(`_implementation/research/astro-docs-${index}.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
}
