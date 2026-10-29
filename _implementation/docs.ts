import { MCPClient } from './mcp';
const client = new MCPClient('https://mcp.context7.com/mcp');
await client.initialize();
const result = await client.call('resolve-library-id', { libraryName: 'Astro', query: 'Static Astro applications with bundled TypeScript client scripts and static Cloudflare Pages deployment using Bun' });
await Bun.write('_implementation/research/astro-library.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
