export const origin='https://moongazer.tech/';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const serialize=value=>JSON.stringify(value).replace(/</g,'\\u003c');

// Quick picker: each chip is a real link (?pick=<id>#library). Rules are data attributes so app.js needs no second copy.
export const picks=[
  {id:'2min',label:'2 minutes',time:2},
  {id:'10min',label:'10 minutes',time:10},
  {id:'kids',label:'With my kids',audience:'kids'},
  {id:'class',label:'For my class',audience:'class'},
  {id:'prayer',label:'Understand my prayer',slug:'understand-your-salah'},
  {id:'hifz',label:'Plan my hifz',slug:'hifz-planner'}
];
export function pickChips(apps){
  return picks.map(pick=>{
    if(pick.slug&&!apps.some(app=>app.slug===pick.slug))throw new Error('Unknown pick app: '+pick.slug);
    const rule=pick.time?` data-max-time="${pick.time}"`:pick.audience?` data-audience="${pick.audience}"`:` data-slug="${pick.slug}"`;
    return `<a class="chip" href="/?pick=${pick.id}#library" data-pick="${pick.id}"${rule}>${escapeHtml(pick.label)}</a>`;
  }).join(' ');
}
export const logoFiles={'ayah-threads':'quran-connections','seerah-detective':'the-seerah-detective','everyday-akhlaq':'everyday-akhlaq-simulator','seerah-timeline':'interactive-seerah-timeline','hifz-planner':'quran-memorization-workload-calculator','is-it-in-the-quran':'is-this-actually-in-the-quran','quran-escape-room':'islamic-knowledge-escape-room','stories-of-the-prophets':'stories-of-the-prophets-explorer','places-in-the-quran':'quranic-places-atlas','word-groups':'islamic-concept-connections','understand-your-salah':'understand-salah-lab','parables-of-the-quran':'quranic-parables-studio','civilization-timeline':'islamic-civilization-timeline','why-it-was-revealed':'revelation-context-explorer','family-halaqa':'family-islamic-learning-challenges'};
export const logo=slug=>'/logos/'+(logoFiles[slug]||slug)+'.svg';
export const audienceLabels={me:'Just me',kids:'With kids',class:'For a class'};

export function structuredData(meta,apps){
  const url=new URL(meta.path,origin).href;
  const page={'@type':meta.type||'CollectionPage','@id':url+'#webpage',url,name:meta.heading,description:meta.description,inLanguage:'en',isPartOf:{'@id':origin+'#website'}};
  const graph=[{'@type':'WebSite','@id':origin+'#website',url:origin,name:'Moongazer',inLanguage:'en'},page];
  if(apps){
    page.mainEntity={'@id':url+'#apps'};
    graph.push({'@type':'ItemList','@id':url+'#apps',name:meta.heading,numberOfItems:apps.length,itemListOrder:'https://schema.org/ItemListUnordered',itemListElement:apps.map((app,index)=>({'@type':'ListItem',position:index+1,name:app.name,url:`https://${app.slug}.moongazer.tech/`}))});
  }
  if(meta.path!=='/'){
    page.breadcrumb={'@id':url+'#breadcrumb'};
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Moongazer',item:origin},{'@type':'ListItem',position:2,name:meta.name,item:url}]});
  }
  return {'@context':'https://schema.org','@graph':graph};
}

export function metadata(meta,apps){
  const e=escapeHtml,url=new URL(meta.path,origin).href;
  return `<title>${e(meta.title)}</title>
  <meta name="description" content="${e(meta.description)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="${meta.noindex?'noindex, follow':'index, follow, max-image-preview:large'}">
  <meta property="og:title" content="${e(meta.title)}"><meta property="og:description" content="${e(meta.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:site_name" content="Moongazer"><meta property="og:locale" content="en_US">
  <meta property="og:image" content="${origin}social-card.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Moongazer free Islamic learning apps">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(meta.title)}"><meta name="twitter:description" content="${e(meta.description)}"><meta name="twitter:image" content="${origin}social-card.png"><meta name="twitter:image:alt" content="Moongazer free Islamic learning apps">
  <script type="application/ld+json">${serialize(structuredData(meta,apps))}</script>`;
}

// `shots` is the set of slugs that have a local homepage/shots/<slug>.webp; the others get a styled placeholder.
export function appCards(apps,shots=new Set()){
  const e=escapeHtml;
  return apps.map(app=>{
    const slot=shots.has(app.slug)
      ?`<img src="/shots/${e(app.slug)}.webp" alt="${e(`Screenshot of ${app.name}: ${app.description}`)}" width="640" height="360" loading="lazy" decoding="async">`
      :`<span class="shot-ph" aria-hidden="true"><img src="${logo(app.slug)}" alt="" width="56" height="56" loading="lazy"><span>${e(app.format)}</span></span>`;
    return `<article class="app-card" data-slug="${e(app.slug)}" data-time="${app.time}" data-audience="${e(app.audience)}"><a href="https://${app.slug}.moongazer.tech/" class="app-link"><span class="shot">${slot}</span><span class="card-body"><span class="card-meta"><span class="badge">${e(app.format)}</span> <span>${app.time} min</span> <span>${audienceLabels[app.audience]}</span></span> <h3>${e(app.name)}</h3> <p>${e(app.description)}</p></span></a></article>`;
  }).join('\n');
}

export function appLinks(apps){return apps.map(app=>`<a href="https://${app.slug}.moongazer.tech/">${escapeHtml(app.name)}</a>`).join(' ');}

export function collectionLinks(collections){
  return collections.map(c=>`<a href="/${c.slug}/">${escapeHtml(c.name)}</a>`).join(' ');
}

export function questions(items){
  return items.map(item=>`<div class="reading-answer"><h3>${escapeHtml(item.question)}</h3> <p>${escapeHtml(item.answer)}</p></div>`).join('\n');
}

export function documentPage(meta,body,collections,apps){
  const e=escapeHtml;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${metadata(meta,apps)}<meta name="theme-color" content="#12263d"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/reading.css">${meta.script?`<script src="${meta.script}" defer></script>`:''}</head><body>
  <a class="skip-link" href="#main">Skip to content</a><header class="site-header wrap"><a href="/" class="brand" aria-label="Moongazer home"><img src="/favicon.svg" alt="" width="32" height="32"><span>moongazer<span class="brand-dot">.</span></span></a> <nav aria-label="Main navigation"><a href="/#library">Apps</a> <a href="/#today">Today</a> <a href="/?pick=kids#library">Families</a> <a href="/about/"${meta.path==='/about/'?' aria-current="page"':''}>About</a></nav></header>
  <main class="wrap reading-page" id="main" tabindex="-1"><nav class="reading-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Moongazer</a></li><li><span aria-current="page">${e(meta.name)}</span></li></ol></nav><header class="reading-hero"><p class="eyebrow">${meta.eyebrow?e(meta.eyebrow):meta.type==='AboutPage'?'Sources, purpose & corrections':'Choose a learning path'}</p><h1>${e(meta.heading)}</h1><p>${e(meta.intro)}</p></header>${body}</main>
  <footer class="site-footer wrap"><a class="brand" href="/">moongazer<span class="brand-dot">.</span></a> <p>Follow your curiosity.</p> <a href="https://moongazer.tech/#library">All Moongazer apps</a> <nav class="footer-guides" aria-label="Subject guides">${collectionLinks(collections)} <a href="/about/">About & source corrections</a> <a href="/corrections/">Corrections log</a> <a href="/feedback/">Report an error</a></nav> <div class="footer-note"><span>Free to use. No account needed.</span> <span>Read the sources. Keep the context.</span></div></footer></body></html>`;
}
