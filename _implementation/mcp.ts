import { mkdir } from 'node:fs/promises';

export class MCPClient {
  private session = '';
  private counter = 0;
  constructor(readonly endpoint: string) {}
  async request(method: string, params: Record<string, unknown> = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(this.session ? { 'Mcp-Session-Id': this.session } : {}) },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++this.counter, method, params }),
      signal: AbortSignal.timeout(120000),
    });
    if (response.headers.get('mcp-session-id')) this.session = response.headers.get('mcp-session-id')!;
    const raw = await response.text();
    if (!response.ok) throw new Error(`MCP ${response.status}: ${raw.slice(0, 400)}`);
    const payload = response.headers.get('content-type')?.includes('text/event-stream')
      ? raw.split('\n').filter(line => line.startsWith('data: ')).map(line => JSON.parse(line.slice(6))).find(item => item.id === this.counter)
      : JSON.parse(raw);
    if (payload.error) throw new Error(JSON.stringify(payload.error));
    return payload.result;
  }
  async initialize() {
    return this.request('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'islamic-product-lab-content-builder', version: '1.0.0' } });
  }
  async call(name: string, args: Record<string, unknown>) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const result = await this.request('tools/call', { name, arguments: args });
      if (!result.isError) return result;
      const retry = result._meta?.['quran.ai/abuse']?.retry_after_seconds;
      if (retry || JSON.stringify(result).includes('rate_limited')) {
        await Bun.sleep(Math.max(1200, Number(retry || 2) * 1000));
        continue;
      }
      throw new Error(`${name}: ${JSON.stringify(result).slice(0, 600)}`);
    }
    throw new Error(`Rate limit persisted for ${name}`);
  }
}

if (import.meta.main) {
  const endpoint = process.argv[2] || 'https://mcp.quran.ai';
  const client = new MCPClient(endpoint);
  console.log(JSON.stringify(await client.initialize()));
  const result = await client.request('tools/list');
  await mkdir('_implementation/research', { recursive: true });
  const file = endpoint.includes('context7') ? 'context7-tools.json' : 'quran-tools.json';
  await Bun.write(`_implementation/research/${file}`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result.tools.map((tool: {name:string}) => tool.name)));
}
