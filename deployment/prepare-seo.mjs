// Focused source preparation. Never writes dist, .astro or dependency internals.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const profiles = JSON.parse(await readFile(join(root,'deployment/seo-catalog.json'),'utf8'));
const helper = await readFile(join(root,'deployment/templates/seo.ts'),'utf8');
const sitemap = await readFile(join(root,'deployment/templates/sitemap.xml.ts'),'utf8');
const frontmatter = `
import '../styles/global.css';
import config from '../data/config.json';
import { getPageMeta, structuredData, encodeJsonLd, productionOrigin } from '../lib/seo';
interface Props { title: string; description?: string; active?: string; }
const { title, description = '', active = 'activity' } = Astro.props;
if (!Astro.site || Astro.site.href !== productionOrigin) throw new Error('Configure the production Astro site URL');
const meta = getPageMeta(Astro.url.pathname);
const pageTitle = meta.title || title;
const pageDescription = description || meta.description;
const canonical = new URL(meta.path, Astro.site).href;
const socialImage = new URL('/social-card.png', Astro.site).href;
const schema = structuredData(meta, Astro.site);
const schemaJson = schema ? encodeJsonLd(schema) : undefined;
const is404 = meta.path === '/404.html';
`;
const metadata = `    <meta name="description" content={pageDescription} />
    <meta name="robots" content={meta.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'} />
    {!is404 && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={config.name} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={config.name + ' by Moongazer'} />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={pageDescription} />
    <meta name="twitter:image" content={socialImage} />
    <meta name="twitter:image:alt" content={config.name + ' by Moongazer'} />
    <link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
    {schemaJson && <script type="application/ld+json" is:inline set:html={schemaJson}></script>}`;
const breadcrumb = `<main id="main" tabindex="-1">
      {!is404 && <nav class="seo-breadcrumb" aria-label="Breadcrumb"><ol>
        <li><a href="https://moongazer.tech/">Moongazer</a></li>
        <li>{meta.path === '/' ? <span aria-current="page">{config.name}</span> : <a href="/">{config.name}</a>}</li>
        {meta.path !== '/' && <li><span aria-current="page">{meta.name}</span></li>}
      </ol></nav>}
      <slot /></main>`;
const breadcrumbStyles = `
/* Crawlable portfolio navigation; mirrored by BreadcrumbList metadata. */
.seo-breadcrumb { margin: 0 0 24px; color: var(--muted); font-size: .78rem; line-height: 1.65; }
.seo-breadcrumb ol { display: flex; flex-wrap: wrap; gap: 6px 10px; list-style: none; padding: 0; margin: 0; }
.seo-breadcrumb li { min-width: 0; overflow-wrap: anywhere; }
.seo-breadcrumb li + li::before { content: '/'; margin-right: 10px; opacity: .65; }
.seo-breadcrumb a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
@media print { .seo-breadcrumb { display: none; } }
`;
for (const [slug,profile] of Object.entries(profiles)) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid app slug');
  const app = join(root,'apps',slug);
  const shellPath = join(app,'src/layouts/Shell.astro');
  let shell = await readFile(shellPath,'utf8');
  if (!shell.includes("from '../lib/seo'")) {
    shell = shell.replace(/^---[\s\S]*?---/,`---${frontmatter}---`);
    const oldDescription = '    <meta name="description" content={description || config.description} />';
    const oldTitle = '    <title>{title === config.name ? title : `${title} · ${config.name}`}</title>';
    const oldMain = '<main id="main" tabindex="-1"><slot /></main>';
    for (const expected of [oldDescription,oldTitle,oldMain]) if (!shell.includes(expected)) throw new Error(`Inspect the differing Shell before editing ${slug}`);
    shell = shell.replace(oldDescription,metadata).replace(oldTitle,'    <title>{pageTitle}</title>').replace(oldMain,breadcrumb);
    shell = shell.replace('<div class="footer-links">','<div class="footer-links"><a href="https://moongazer.tech/#library">All Moongazer apps</a>');
    await writeFile(shellPath,shell);
  }
  await writeFile(join(app,'src/lib/seo.ts'),helper);
  await writeFile(join(app,'src/data/seo.json'),JSON.stringify(profile,null,2)+'\n');
  await writeFile(join(app,'src/pages/sitemap.xml.ts'),sitemap);
  const configPath = join(app,'astro.config.mjs');
  let astro = await readFile(configPath,'utf8');
  if (!/\bsite\s*:/.test(astro)) astro = astro.replace('defineConfig({',`defineConfig({ site: 'https://${slug}.moongazer.tech/',`);
  await writeFile(configPath,astro);
  await writeFile(join(app,'public/robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: https://${slug}.moongazer.tech/sitemap.xml\n`);
  const headersPath = join(app,'public/_headers');
  let headers = await readFile(headersPath,'utf8');
  if (!headers.includes('https://:project.pages.dev/*')) headers += '\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex\n\nhttps://:deployment.:project.pages.dev/*\n  X-Robots-Tag: noindex\n';
  await writeFile(headersPath,headers);
  const cssPath = join(app,'src/styles/global.css');
  let css = await readFile(cssPath,'utf8');
  css = css.replace(/\/fonts\/(dm-sans|newsreader|amiri)\.ttf/g,'/fonts/$1.woff2').replace(/format\('truetype'\)/g,"format('woff2')");
  if (!css.includes('.seo-breadcrumb')) css += breadcrumbStyles;
  await writeFile(cssPath,css);
}
await mkdir(join(root,'deployment/evidence/seo'),{recursive:true});
console.log(`Prepared SEO sources for ${Object.keys(profiles).length} independent apps.`);
