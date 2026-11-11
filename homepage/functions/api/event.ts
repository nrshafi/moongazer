// POST /api/event: anonymous aggregate counter beacon (P4.4).
// Receives navigator.sendBeacon bodies (text/plain JSON). Stores one daily count per
// {date, app, item, event}. No IP, cookie, user agent or request data is kept. Logs nothing.
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

export async function onRequestPost({request, env}: FunctionContext): Promise<Response> {
  // Malformed, oversized or unknown input is dropped silently with 204.
  const declared = Number(request.headers.get('Content-Length') ?? '0');
  if (declared > MAX_BODY_BYTES) return new Response(null, {status: 204, headers: NO_STORE});

  try {
    const body = await request.text();
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
    // Fail silent: the beacon cannot act on an error and the visitor must not notice.
  }
  return new Response(null, {status: 204, headers: NO_STORE});
}

export function onRequest(): Response {
  return new Response('Method not allowed.', {status: 405, headers: {...NO_STORE, Allow: 'POST'}});
}
