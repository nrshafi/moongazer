import {validateEvent} from '../_lib/validate';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface Env {
  DB: D1Database;
}
interface FunctionContext {
  request: Request;
  env: Env;
}

const NO_STORE = {'Cache-Control': 'no-store'};
const MAX_BODY_BYTES = 512;
const utf8Length = (s: string) => new TextEncoder().encode(s).byteLength;

export async function onRequestPost({request, env}: FunctionContext): Promise<Response> {
  const declared = Number(request.headers.get('Content-Length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return new Response(null, {status: 204, headers: NO_STORE});

  try {
    const body = await request.text();
    if (utf8Length(body) > MAX_BODY_BYTES) return new Response(null, {status: 204, headers: NO_STORE});
    const decision = validateEvent(body, Date.now());
    if (decision.kind === 'store') {
      await env.DB.prepare(
        'INSERT INTO event_counts (date, app_slug, item_id, event_type, count) VALUES (?, ?, ?, ?, 1) ' +
          'ON CONFLICT(date, app_slug, item_id, event_type) DO UPDATE SET count = count + 1',
      )
        .bind(decision.date, decision.app_slug, decision.item_id, decision.event_type)
        .run();
    }
  } catch {
    // Beacon responses must stay silent so analytics outages never disrupt visitors.
  }
  return new Response(null, {status: 204, headers: NO_STORE});
}

export function onRequest(): Response {
  return new Response('Method not allowed.', {status: 405, headers: {...NO_STORE, Allow: 'POST'}});
}
