export const origin='https://moongazer.tech/';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const serialize=value=>JSON.stringify(value).replace(/</g,'\\u003c');

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

export function appCards(apps){
  const e=escapeHtml;
  return apps.map(app=>`<article class="app-card" data-category="${e(app.category)}" data-search="${e(`${app.name} ${app.category} ${app.kind} ${app.description}`.toLowerCase())}"><a href="https://${app.slug}.moongazer.tech/" class="app-link"><div class="card-top"><span class="app-icon"><img src="/logos/${e(app.slug)}.svg" alt="" width="48" height="48" loading="lazy"></span> <span class="app-kind">${e(app.kind)}</span> <span class="card-arrow" aria-hidden="true">↗</span></div> <h3>${e(app.name)}</h3> <p>${e(app.description)}</p> <span class="card-bottom">${e(app.category)}<span aria-hidden="true">Open app →</span></span></a></article>`).join('\n');
}

export function collectionLinks(collections){
  return collections.map(c=>`<a href="/${c.slug}/">${escapeHtml(c.name)}</a>`).join(' ');
}

export function questions(items){
  return items.map(item=>`<div class="reading-answer"><h3>${escapeHtml(item.question)}</h3> <p>${escapeHtml(item.answer)}</p></div>`).join('\n');
}

export function documentPage(meta,body,collections,apps){
  const e=escapeHtml;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${metadata(meta,apps)}<meta name="theme-color" content="#12263d"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/reading.css">${meta.script?`<script src="${meta.script}" defer></script>`:''}</head><body>
  <a class="skip-link" href="#main">Skip to content</a><header class="site-header wrap"><a href="/" class="brand" aria-label="Moongazer home"><img src="/favicon.svg" alt="" width="32" height="32"><span>moongazer<span class="brand-dot">.</span></span></a> <nav aria-label="Main navigation"><a href="/#library">The app library</a> <a href="/about/"${meta.path==='/about/'?' aria-current="page"':''}>Our approach</a></nav></header>
  <main class="wrap reading-page" id="main" tabindex="-1"><nav class="reading-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Moongazer</a></li><li><span aria-current="page">${e(meta.name)}</span></li></ol></nav><header class="reading-hero"><p class="eyebrow">${meta.eyebrow?e(meta.eyebrow):meta.type==='AboutPage'?'Sources, purpose & corrections':'Choose a learning path'}</p><h1>${e(meta.heading)}</h1><p>${e(meta.intro)}</p></header>${body}</main>
  <footer class="site-footer wrap"><a class="brand" href="/">moongazer<span class="brand-dot">.</span></a> <p>Follow your curiosity.</p> <a href="https://moongazer.tech/#library">All Moongazer apps</a> <nav class="footer-guides" aria-label="Subject guides">${collectionLinks(collections)} <a href="/about/">About & source corrections</a> <a href="/corrections/">Corrections log</a> <a href="/feedback/">Report an error</a></nav> <div class="footer-note"><span>Free to use. No account needed.</span> <span>Read the sources. Keep the context.</span></div></footer></body></html>`;
}
