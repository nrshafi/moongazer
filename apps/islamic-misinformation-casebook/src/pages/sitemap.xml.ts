import type { APIRoute } from 'astro';
import { seoPages, productionOrigin } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  if (!site || site.href !== productionOrigin) throw new Error('Set the production site URL before building the sitemap');
  const escapeXml = (value: string) => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const urls = seoPages.filter(page=>page.indexable).map(page=>`  <url><loc>${escapeXml(new URL(page.path,site).href)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
