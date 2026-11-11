import config from '../data/config.json';
import content from '../data/content.json';
import profile from '../data/seo.json';

interface SeoProfile {
  title: string;
  shortName: string;
  description: string;
  keyword: string;
  collection?: string;
  prefix?: string;
  nameField?: string;
  summaryField?: string;
  detailLead?: string;
  nameSuffix?: string;
  detailMode?: string;
}

export interface SeoPage {
  path: string;
  title: string;
  name: string;
  description: string;
  indexable: boolean;
}

const settings: SeoProfile = profile;
const data: Record<string, unknown> = content;
export const productionOrigin = `https://${config.slug}.moongazer.tech/`;

export function canonicalPath(path: string): string {
  const clean = path.split(/[?#]/, 1)[0].replace(/\/index\.html$/, '/');
  if (['/404', '/404/', '/404.html'].includes(clean)) return '/404.html';
  return clean.endsWith('/') ? clean : `${clean}/`;
}

export function descriptionSnippet(value: string, maximum = 180): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maximum) return text;
  const cut = text.slice(0, maximum - 1);
  const boundary = cut.lastIndexOf(' ');
  return (boundary > 0 ? cut.slice(0, boundary) : cut).replace(/[,:;.]$/, '') + '…';
}

/** Ends a label as a sentence without doubling punctuation ("Why?" stays "Why?", never "Why?."). */
export function sentence(label: string): string {
  const text = label.trim();
  return /[.?!…]$/.test(text) ? text : `${text}.`;
}

export function encodeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

const pages: Record<string, SeoPage> = {
  '/': {path:'/', title:settings.title, name:config.name, description:settings.description, indexable:true},
  '/sources/': {
    path:'/sources/', title:`Sources & methodology | ${settings.shortName}`, name:'Sources & methodology',
    description:`Source notes and attribution for ${sentence(config.name)} Read the referenced editions, source links and editorial limits behind the learning activities.`, indexable:true
  },
  '/privacy/': {
    path:'/privacy/', title:`Privacy & browser storage | ${settings.shortName}`, name:'Privacy & storage',
    description:`How ${config.name} handles optional browser storage, theme preferences and saved activity. Learn how to clear this app's data or use it without saving.`, indexable:false
  },
  '/404.html': {path:'/404.html', title:`Page not found | ${settings.shortName}`, name:'Page not found', description:`This page could not be found. Return to ${config.name} or explore the Moongazer app directory.`, indexable:false}
};

if (settings.collection) {
  const entries = data[settings.collection];
  if (!Array.isArray(entries)) throw new Error(`Missing SEO collection: ${settings.collection}`);
  for (const unknownEntry of entries) {
    if (!unknownEntry || typeof unknownEntry !== 'object') throw new Error('Invalid SEO content record');
    const entry = unknownEntry as Record<string, unknown>;
    const id = entry.id;
    const name = entry[settings.nameField || 'title'];
    if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id) || typeof name !== 'string') throw new Error('Invalid SEO route record');
    const label = name + (settings.nameSuffix || '');
    const summary = entry[settings.summaryField || 'summary'];
    let description = `${settings.detailLead ? settings.detailLead + ': ' : ''}${sentence(label)} ${typeof summary === 'string' && summary.trim() ? summary : settings.description}`;
    if (settings.detailMode === 'salah') description = `${sentence(label)} Study the Arabic recitation and its meaning, inspect source notes and try a short reading check in ${config.name}.`;
    if (settings.detailMode === 'family') description = `${sentence(label)} A family activity pack for ages ${entry.age}, with a reading check, open discussion and shared activity. Suggested time: ${entry.minutes} minutes.`;
    const path = `/${settings.prefix}/${id}/`;
    if (pages[path]) throw new Error(`Duplicate SEO route: ${path}`);
    pages[path] = {path, title:`${label} | ${settings.shortName}`, name:label, description:descriptionSnippet(description), indexable:true};
  }
}

export const seoPages = Object.values(pages).map(page => ({...page, description:descriptionSnippet(page.description)}));

export function getPageMeta(path: string): SeoPage {
  const normalized = canonicalPath(path);
  const page = seoPages.find(entry => entry.path === normalized);
  if (!page) throw new Error(`Add metadata for the new page: ${normalized}`);
  return page;
}

export function structuredData(page: SeoPage, site: URL) {
  if (page.path === '/404.html') return undefined;
  const url = new URL(page.path, site).href;
  const trail = [
    {name:'Moongazer', url:'https://moongazer.tech/'},
    {name:config.name, url:site.href},
    ...(page.path === '/' ? [] : [{name:page.name, url}])
  ];
  return {
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'WebSite', '@id':`${site.href}#website`, url:site.href, name:config.name, inLanguage:'en', isPartOf:{'@id':'https://moongazer.tech/#website'}},
      {'@type': page.path === '/' && settings.collection ? 'CollectionPage' : page.indexable && page.path !== '/sources/' ? ['WebPage','LearningResource'] : 'WebPage',
        '@id':`${url}#webpage`, url, name:page.title, description:page.description, inLanguage:'en',
        isPartOf:{'@id':`${site.href}#website`}, isAccessibleForFree:true, breadcrumb:{'@id':`${url}#breadcrumb`}},
      {'@type':'BreadcrumbList', '@id':`${url}#breadcrumb`, itemListElement:trail.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:item.url}))}
    ]
  };
}
