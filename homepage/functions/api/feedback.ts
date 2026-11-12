// POST /api/feedback: first-party feedback form (P4.4).
// Native form POST from the apps and the directory; no CORS, no JavaScript needed.
// Stores nothing about the visitor except the form fields. Logs nothing.
import allowlist from '../_lib/apps.json';
import {validateFeedback} from '../_lib/validate';

// Minimal local types for the D1 binding (no @cloudflare/workers-types dependency).
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
  if (declared > MAX_BODY_BYTES) return text(413, 'The message is too large.');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return text(400, 'The form could not be read. Please try again.');
  }
  const fields = Object.fromEntries(
    Array.from(form.entries()).map(([name, value]) => [name, typeof value === 'string' ? value : undefined]),
  );
  const submittedSlug = typeof fields.app_slug === 'string' ? fields.app_slug : '';

  const decision = validateFeedback(fields);
  // Honeypot or timing failure: look exactly like success, store nothing.
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

// Any other method is refused (method-specific handlers above take precedence for POST).
export function onRequest(): Response {
  return new Response('Method not allowed.', {status: 405, headers: {...NO_STORE, Allow: 'POST'}});
}
