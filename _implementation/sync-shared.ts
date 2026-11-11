// Shared-file sync and check tool (P1 T1.1).
// --check                         exit 1 when any shared file differs between apps
// --from <slug> <rel-path>...     copy those files from apps/<slug>/ to every other app
// --allow-extra                   permit paths outside the shared list with --from
// --set <name>                    use a named extra set instead of the default shared set (e.g. mastery)
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const root = join(import.meta.dir, '..');
const appsDir = join(root, 'apps');

export const SHARED = [
  'src/layouts/Shell.astro',
  'src/styles/refinement.css',
  'src/components/LearningGuide.astro',
  'src/lib/utils.ts',
  'src/lib/seo.ts',
  'src/components/Honorific.astro',
  'src/lib/import.ts',
  'tests/import.test.ts',
  'src/pages/404.astro',
  'src/pages/privacy.astro',
  'src/pages/sitemap.xml.ts',
  'public/_headers',
];

// Named sets that apply only to a subset of apps (apps that contain the first file).
export const SETS: Record<string, string[]> = {
  shared: SHARED,
  mastery: ['src/lib/mastery.ts', 'src/lib/mastery-ui.ts'],
  daily: ['src/lib/daily.ts'],
};

export function listApps(): string[] {
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(appsDir, d.name, 'package.json')))
    .map((d) => d.name)
    .sort();
}

const sha = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

function check(files: string[], requireAll: boolean): boolean {
  let ok = true;
  const apps = listApps();
  for (const rel of files) {
    const groups = new Map<string, string[]>();
    const missing: string[] = [];
    for (const app of apps) {
      const p = join(appsDir, app, rel);
      if (!existsSync(p)) { missing.push(app); continue; }
      const h = sha(p);
      groups.set(h, [...(groups.get(h) ?? []), app]);
    }
    if (requireAll && missing.length) { ok = false; console.log(`MISSING ${rel}: ${missing.join(', ')}`); }
    if (groups.size > 1) {
      ok = false;
      console.log(`DIFFERS ${rel}: ${groups.size} variants`);
      [...groups.values()].sort((a, b) => b.length - a.length).forEach((g, i) => console.log(`  variant ${i + 1} (${g.length}): ${g.join(', ')}`));
    } else if (groups.size === 1) {
      console.log(`ok      ${rel} (${[...groups.values()][0].length} apps)`);
    }
  }
  return ok;
}

function copyFrom(slug: string, files: string[], allowExtra: boolean, allowed: string[]) {
  const apps = listApps();
  if (!apps.includes(slug)) throw new Error(`Unknown app ${slug}`);
  for (const rel of files) {
    if (!allowed.includes(rel) && !allowExtra) throw new Error(`${rel} is not in the shared list; pass --allow-extra to copy it`);
    const src = join(appsDir, slug, rel);
    if (!existsSync(src)) throw new Error(`Missing ${src}`);
    const data = readFileSync(src);
    let n = 0;
    for (const app of apps) {
      if (app === slug) continue;
      const dest = join(appsDir, app, rel);
      // Files outside the default shared set (mastery, daily, extras) only update apps that already have them.
      if (!SETS.shared.includes(rel) && !existsSync(dest)) continue;
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, data);
      n++;
    }
    console.log(`copied ${rel} from ${slug} to ${n} apps`);
  }
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const setIdx = args.indexOf('--set');
  const setName = setIdx >= 0 ? args[setIdx + 1] : 'shared';
  const set = SETS[setName];
  if (!set) throw new Error(`Unknown set ${setName}`);
  if (args.includes('--check')) {
    const ok = check(set, setName === 'shared');
    console.log(ok ? `\nAll ${setName} files identical across apps.` : `\n${setName} files differ.`);
    process.exit(ok ? 0 : 1);
  }
  const fromIdx = args.indexOf('--from');
  if (fromIdx >= 0) {
    const slug = args[fromIdx + 1];
    const files = args.slice(fromIdx + 2).filter((a) => !a.startsWith('--') && a !== setName);
    if (!slug || !files.length) throw new Error('Usage: --from <slug> <relative-path>...');
    copyFrom(slug, files, args.includes('--allow-extra'), set);
    process.exit(0);
  }
  console.log('Usage: bun _implementation/sync-shared.ts --check | --from <slug> <path>... [--allow-extra] [--set <name>]');
  process.exit(2);
}
