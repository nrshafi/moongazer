import allowlist from '../_lib/apps.json';
import {validateFeedback} from '../_lib/validate';

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

const MAX_BODY_BYTES = 16_384;
const NO_STORE = {'Cache-Control': 'no-store'};
const utf8Length = (s: string) => new TextEncoder().encode(s).byteLength;

function text(status: number, body: string): Response {
  return new Response(body, {status, headers: {...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8'}});
}

function thanksUrl(appSlug: string): string {
  const from = (allowlist as string[]).includes(appSlug) ? appSlug : 'directory';
  return `https://moongazer.tech/feedback/thanks/?from=${encodeURIComponent(from)}`;
}

function see(appSlug: string): Response {
  return new Response(null, {status: 303, headers: {...NO_STORE, Location: thanksUrl(appSlug)}});
}

export async function onRequestPost({request, env}: FunctionContext): Promise<Response> {
  const declared = Number(request.headers.get('Content-Length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return text(413, 'The message is too large.');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return text(400, 'The form could not be read. Please try again.');
  }
  let totalBytes = 0;
  const entries = Array.from(form.entries());
  for (const [k, v] of entries) {
    totalBytes += utf8Length(k) + (typeof v === 'string' ? utf8Length(v) : v.size);
    if (totalBytes > MAX_BODY_BYTES) return text(413, 'The message is too large.');
  }
  const fields = Object.fromEntries(
    entries.map(([name, value]) => [name, typeof value === 'string' ? value : undefined]),
  );
  const submittedSlug = typeof fields.app_slug === 'string' ? fields.app_slug : '';

  const decision = validateFeedback(fields);
  if (decision.kind === 'drop') return see(submittedSlug);
  if (decision.kind === 'reject') return text(400, `Please check the form. ${decision.reason}`);

  try {
    await env.DB.prepare(
      'INSERT INTO feedback (id, created_at, app_slug, page_url, category, message, contact, status, no_js) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(
        crypto.randomUUID(),
        new Date().toISOString(),
        decision.app_slug,
        decision.page_url,
        decision.category,
        decision.message,
        decision.contact,
        'pending',
        decision.no_js ? 1 : 0,
      )
      .run();
  } catch {
    return text(500, 'Your message could not be saved. Please try again later.');
  }
  return see(decision.app_slug);
}

export function onRequest(): Response {
  return new Response('Method not allowed.', {status: 405, headers: {...NO_STORE, Allow: 'POST'}});
}
