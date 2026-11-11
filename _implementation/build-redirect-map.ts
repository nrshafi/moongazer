// Builds deployment/merge-redirects.json from the retired apps' dist/ and their config.json "moved" rule (P3 T3.8).
// The rule is the same one Shell.astro uses for the banner and canonical: routes in order, else the fallback.
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export interface Moved { to: string; origin: string; routes: [string, string][]; fallback: string; idMap?: Record<string, string> }
const root = join(import.meta.dir, '..');

export function movedUrl(path: string, rule: Moved): string {
  for (const [pattern, target] of rule.routes) {
    const match = path.match(new RegExp(pattern));
    if (!match) continue;
    const id = match[1];
    if (id === undefined) return rule.origin + target;
    const mapped = rule.idMap ? rule.idMap[id] : id;
    if (mapped) return rule.origin + target.replace('$1', mapped);
  }
  return rule.origin + rule.fallback;
}

function htmlPaths(dir: string, base = dir): string[] {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlPaths(full, base);
    if (!name.endsWith('.html')) return [];
    const rel = '/' + relative(base, full).split(sep).join('/');
    return [rel === '/index.html' ? '/' : rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel];
  });
}

export function retiredApps(): { slug: string; moved: Moved }[] {
  return readdirSync(join(root, 'apps')).flatMap(slug => {
    const file = join(root, 'apps', slug, 'src/data/config.json');
    if (!existsSync(file)) return [];
    const config = JSON.parse(readFileSync(file, 'utf8'));
    return config.moved ? [{ slug, moved: config.moved as Moved }] : [];
  });
}

export function buildMap() {
  const map: Record<string, { receiver: string; paths: Record<string, string> }> = {};
  for (const { slug, moved } of retiredApps()) {
    const dist = join(root, 'apps', slug, 'dist');
    if (!existsSync(dist)) throw new Error(`Build ${slug} first`);
    const paths: Record<string, string> = {};
    for (const path of htmlPaths(dist).sort()) paths[path] = movedUrl(path === '/404.html' ? '/404.html' : path, moved);
    paths['/sitemap.xml'] = moved.origin + moved.fallback;
    paths['*'] = moved.origin + moved.fallback;
    map[`https://${slug}.moongazer.tech`] = { receiver: new URL(moved.origin).hostname.replace('.moongazer.tech', ''), paths };
  }
  return map;
}

if (import.meta.main) {
  const map = buildMap();
  writeFileSync(join(root, 'deployment/merge-redirects.json'), JSON.stringify(map, null, 2) + '\n');
  for (const [host, entry] of Object.entries(map)) console.log(`${host} -> ${entry.receiver}: ${Object.keys(entry.paths).length} paths`);
}
