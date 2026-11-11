#!/usr/bin/env node
// Owner report for the three anonymous event counts (P4.8). Reads event_counts through the
// pinned wrangler (run from homepage/) and prints CSV on stdout only.
//
// Usage:
//   node deployment/scripts/counter-report.mjs [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--local] > report.csv
//
// Rows: one per app (item_id empty) and one per app+item. completion_rate = completed / started,
// blank when nothing started. Dates are UTC days stored by the server. Default range: all dates.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const homepage = join(root, 'homepage');
const wranglerJs = join(root, 'deployment/node_modules/wrangler/bin/wrangler.js');
const EVENTS = ['activity_started', 'activity_completed', 'share_clicked'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const argv = process.argv.slice(2);
const local = argv.includes('--local');

function option(name, fallback) {
  const i = argv.indexOf(name);
  if (i === -1) return fallback;
  const value = argv[i + 1];
  if (value === undefined || value.startsWith('--')) throw new Error(`${name} needs a value`);
  return value;
}

const from = option('--from', '0000-01-01');
const to = option('--to', '9999-12-31');
if (!DATE.test(from) || !DATE.test(to) || from > to) {
  console.error('counter-report: dates must be YYYY-MM-DD and --from must not be after --to.');
  process.exit(1);
}

const sql =
  `SELECT app_slug, item_id, event_type, SUM(count) AS total FROM event_counts ` +
  `WHERE date >= '${from}' AND date <= '${to}' GROUP BY app_slug, item_id, event_type ORDER BY app_slug, item_id`;

const out = execFileSync(
  process.execPath,
  [wranglerJs, 'd1', 'execute', 'moongazer', local ? '--local' : '--remote', '--json', '--command', sql],
  {cwd: homepage, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
);
const start = out.search(/^\[/m);
if (start === -1) throw new Error('Unexpected wrangler output');
const [result] = JSON.parse(out.slice(start));
if (!result || result.success !== true) throw new Error('D1 query did not succeed');

// Aggregate: key -> {app_slug, item_id, counts}
const groups = new Map();
function bucket(key, app, item) {
  if (!groups.has(key)) groups.set(key, {app, item, counts: Object.fromEntries(EVENTS.map(event => [event, 0]))});
  return groups.get(key);
}
for (const row of result.results) {
  const app = bucket(`app:${row.app_slug}`, row.app_slug, '');
  const item = bucket(`item:${row.app_slug}:${row.item_id}`, row.app_slug, row.item_id);
  if (!EVENTS.includes(row.event_type)) continue;
  app.counts[row.event_type] += Number(row.total);
  item.counts[row.event_type] += Number(row.total);
}

const csv = value => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const lines = ['scope,app_slug,item_id,activity_started,activity_completed,share_clicked,completion_rate'];
for (const [key, group] of groups) {
  const started = group.counts.activity_started;
  const completed = group.counts.activity_completed;
  const rate = started > 0 ? (completed / started).toFixed(3) : '';
  lines.push(
    [
      key.startsWith('app:') ? 'app' : 'item',
      group.app,
      group.item,
      started,
      completed,
      group.counts.share_clicked,
      rate,
    ]
      .map(csv)
      .join(','),
  );
}
console.log(lines.join('\n'));
