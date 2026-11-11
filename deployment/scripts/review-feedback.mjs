#!/usr/bin/env node
// Owner moderation for first-party feedback (P4.8). Reads and writes the D1 database through
// the pinned wrangler (run from homepage/, where wrangler.toml lives).
//
// Usage:
//   node deployment/scripts/review-feedback.mjs list [--show-contact] [--local]
//   node deployment/scripts/review-feedback.mjs set <id> verified|rejected|spam [--note "..."] [--local]
//   node deployment/scripts/review-feedback.mjs publish <id> --change "What changed" [--local]
//
// Default target is the production database (--remote). --local uses the local emulated database
// created by `wrangler d1 migrations apply moongazer --local`.
// `publish` appends an entry to homepage/corrections.json (no contact, found_by "visitor") and marks
// the row verified. Commit corrections.json afterwards; the directory build reads it.
import {execFileSync} from 'node:child_process';
import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const homepage = join(root, 'homepage');
const wranglerJs = join(root, 'deployment/node_modules/wrangler/bin/wrangler.js');
const corrections = join(homepage, 'corrections.json');
const STATUSES = ['verified', 'rejected', 'spam'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const VALUE_OPTIONS = ['--note', '--change'];

const argv = process.argv.slice(2);
const local = argv.includes('--local');
const showContact = argv.includes('--show-contact');

function option(name) {
  const i = argv.indexOf(name);
  if (i === -1) return undefined;
  const value = argv[i + 1];
  if (value === undefined || value.startsWith('--')) throw new Error(`${name} needs a value`);
  return value;
}

const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (VALUE_OPTIONS.includes(argv[i])) {
    i++;
    continue;
  }
  if (!argv[i].startsWith('--')) positional.push(argv[i]);
}

// SQL string literal. The D1 CLI has no bind parameters, so every value is quoted here.
const quote = value => `'${String(value).replace(/'/g, "''")}'`;

// Runs one statement through wrangler without a shell. Returns the first result set.
function d1(sql) {
  const out = execFileSync(
    process.execPath,
    [wranglerJs, 'd1', 'execute', 'moongazer', local ? '--local' : '--remote', '--json', '--command', sql],
    {cwd: homepage, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
  );
  const start = out.search(/^\[/m);
  if (start === -1) throw new Error('Unexpected wrangler output');
  const [result] = JSON.parse(out.slice(start));
  if (!result || result.success !== true) throw new Error('D1 statement did not succeed');
  return result;
}

function requireId(id) {
  if (!id || !UUID.test(id)) throw new Error('Give a feedback id (UUID) from the list command.');
  return id;
}

function list() {
  const rows = d1(
    "SELECT id, created_at, app_slug, page_url, category, message, contact FROM feedback WHERE status = 'pending' ORDER BY created_at ASC",
  ).results;
  if (!rows.length) {
    console.log('No pending feedback.');
    return;
  }
  for (const row of rows) {
    const contact = showContact
      ? `contact: ${row.contact ?? '(none)'}`
      : `contact: ${row.contact ? 'given (use --show-contact to print)' : '(none)'}`;
    console.log(
      [
        `id: ${row.id}`,
        `received: ${row.created_at}`,
        `app: ${row.app_slug}`,
        `page: ${row.page_url}`,
        `category: ${row.category}`,
        `message: ${row.message}`,
        contact,
      ].join('\n'),
    );
    console.log('');
  }
  console.log(`${rows.length} pending.`);
}

function set() {
  const id = requireId(positional[1]);
  const status = positional[2];
  if (!STATUSES.includes(status)) throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
  const note = option('--note') ?? null;
  if (note !== null && note.length > 500) throw new Error('Note is limited to 500 characters.');
  // wrangler's write response does not reliably report changes, so confirm the row exists first.
  if (!d1(`SELECT id FROM feedback WHERE id = ${quote(id)}`).results.length) {
    throw new Error('No feedback row with that id.');
  }
  d1(
    `UPDATE feedback SET status = ${quote(status)}, reviewed_at = ${quote(new Date().toISOString())}, ` +
      `review_note = ${note === null ? 'NULL' : quote(note)} WHERE id = ${quote(id)}`,
  );
  console.log(`Set ${id} to ${status}.`);
}

function publish() {
  const id = requireId(positional[1]);
  const change = (option('--change') ?? '').trim();
  if (change.length < 10 || change.length > 500) throw new Error('--change must be 10 to 500 characters.');

  const [row] = d1(`SELECT app_slug, page_url, status FROM feedback WHERE id = ${quote(id)}`).results;
  if (!row) throw new Error('No feedback row with that id.');
  if (row.status === 'rejected' || row.status === 'spam') throw new Error(`Row is ${row.status}; it cannot be published.`);

  return readFile(corrections, 'utf8')
    .catch(error => {
      if (error.code === 'ENOENT') return '[]';
      throw error;
    })
    .then(async text => {
      const entries = JSON.parse(text);
      if (!Array.isArray(entries)) throw new Error('homepage/corrections.json must be a JSON array.');
      const today = new Date().toISOString().slice(0, 10);
      entries.push({date: today, app_slug: row.app_slug, page_url: row.page_url, change, found_by: 'visitor'});
      await writeFile(corrections, JSON.stringify(entries, null, 2) + '\n');
      d1(
        `UPDATE feedback SET status = 'verified', reviewed_at = ${quote(new Date().toISOString())}, ` +
          `review_note = ${quote('published as correction')} WHERE id = ${quote(id)}`,
      );
      console.log(`Published correction for ${row.app_slug} and marked ${id} verified.`);
      console.log('Commit homepage/corrections.json, then rebuild the directory.');
    });
}

const commands = {list, set, publish};
const command = positional[0];
try {
  if (!commands[command]) {
    throw new Error('Usage: list | set <id> verified|rejected|spam | publish <id> --change "..."  (add --local for the local database)');
  }
  await commands[command]();
} catch (error) {
  console.error(`review-feedback: ${error.message}`);
  process.exit(1);
}
