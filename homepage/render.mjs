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
export const logo=slug=>'/logos/'+slug+'.svg';
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

// P6 T6.6: "Tonight on Moongazer". The static HTML names no puzzle number (a built page would go stale);
// app.js fills "#N" and swaps in tonight's ayah. The ayah in the HTML is the one for the build date.
export const tonightPuzzles=[
  {slug:'guess-the-surah',kind:"Today's surah",name:'Guess the Surah'},
  {slug:'word-groups',kind:"Today's board",name:'Word Groups'}
];
export function tonightTiles(apps){
  return tonightPuzzles.map(tile=>{
    if(!apps.some(app=>app.slug===tile.slug))throw new Error('Unknown tonight app: '+tile.slug);
    return `<li><a class="tile" href="https://${tile.slug}.moongazer.tech/"><span class="tile-kind">${escapeHtml(tile.kind)}</span> <span class="tile-name">${escapeHtml(tile.name)}</span><span class="tile-n" data-daily-n></span> <span class="tile-go">Play <span aria-hidden="true">→</span></span></a></li>`;
  }).join(' ');
}
export function ayahBlock(ayah){
  return `<p class="ayah-ar" lang="ar" dir="rtl" data-ayah-ar>${escapeHtml(ayah.arabic)}</p> <p class="ayah-en" data-ayah-en>${escapeHtml(ayah.translation)}</p> <p class="ayah-source">Pickthall’s translation · <a data-ayah-link href="https://is-it-in-the-quran.moongazer.tech/#q=${encodeURIComponent(ayah.ref)}">Read Quran <span data-ayah-ref>${escapeHtml(ayah.ref)}</span> in Is It in the Quran?</a></p>`;
}

// P7 T7.10: Ramadan hub (/ramadan/). Static HTML; no countdown; printable. Ayat come from the verified
// ayat-of-the-night list and Surah al-Qadr from quran-full.json, both checked by verify-static.py.
const longDay=key=>{const [y,m,d]=key.split('-').map(Number);return new Date(Date.UTC(y,m-1,d)).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});};
const shortDay=key=>{const [y,m,d]=key.split('-').map(Number);return new Date(Date.UTC(y,m-1,d)).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});};
const addDays=(key,n)=>{const [y,m,d]=key.split('-').map(Number);return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10);};
const withHonorific=text=>escapeHtml(text).split('ﷺ').join('<span class="honorific">ﷺ</span>');
export function ramadanBody({content,ayat,packs,juzHasSurah,surahQadr}){
  const e=escapeHtml,dt=content.dates;
  const nights=content.nightAyat.map((ref,i)=>{
    const night=i+1,date=addDays(dt.start,i),ayah=ayat.get(ref),pack=packs.get(night);
    if(!ayah)throw new Error('Ramadan ayah not in the verified list: '+ref);
    if(!pack)throw new Error('Missing Family Halaqa Ramadan pack for night '+night);
    const surahLink=juzHasSurah(night)?`<a href="https://guess-the-surah.moongazer.tech/?mode=juz&amp;juz=${night}">Guess the Surah: Juz ${night}</a>`:`<a href="https://guess-the-surah.moongazer.tech/">Guess the Surah: today's puzzle</a>`;
    const thirty=night===30?` <span class="night-note">if Ramadan has 30 days</span>`:'';
    return `<li class="night-card${night>=21?' last-ten':''}"><p class="night-head"><span class="night-n">Ramadan ${night}</span> <time datetime="${date}">${e(shortDay(date))}</time>${thirty}</p><p class="night-ar" lang="ar" dir="rtl">${e(ayah.arabic)}</p><p class="night-en">${e(ayah.translation)} <span class="night-ref">(Quran ${e(ref)})</span></p><ul class="night-links"><li><a href="https://family-halaqa.moongazer.tech/pack/${e(pack.id)}/">Family Halaqa: ${e(pack.title)} <span class="night-age">ages ${e(pack.age)}</span></a></li><li>${surahLink}</li></ul></li>`;
  }).join('');
  const qadr=surahQadr.map(v=>`<p class="night-ar" lang="ar" dir="rtl">${e(v.arabic)}</p><p class="night-en">${e(v.translation)} <span class="night-ref">(${e(v.ref)})</span></p>`).join('');
  const hadith=content.lastTen.hadith.map(h=>`<li>${withHonorific(h.paraphrase)} <a href="${e(h.url)}">${e(h.collection)} ${e(h.number)}</a></li>`).join('');
  return `<section class="reading-section ramadan-dates" aria-labelledby="dates-title"><h2 id="dates-title">Expected dates</h2><dl class="date-list"><div><dt>Ramadan begins</dt><dd><time datetime="${dt.start}">${e(longDay(dt.start))}</time></dd></div><div><dt>The last ten nights begin</dt><dd>At sunset on <time datetime="${dt.lastTenEvening}">${e(longDay(dt.lastTenEvening))}</time></dd></div><div><dt>Eid al-Fitr</dt><dd><time datetime="${dt.eidFrom}">${e(longDay(dt.eidFrom))}</time> or <time datetime="${dt.eidTo}">${e(longDay(dt.eidTo))}</time></dd></div></dl><p class="date-note"><strong>${e(dt.note)}</strong> Source: <a href="${e(dt.sourceUrl)}">Umm Al-Qura Calendar</a>, the official calendar of Saudi Arabia. Moon-sighting predictions place Eid on 10 March.</p><p><button class="button print-button" type="button" data-print hidden>Print this calendar</button></p></section>
<section class="reading-section" aria-labelledby="nights-title"><h2 id="nights-title">Thirty nights</h2><p>One short ayah for each night, a Family Halaqa pack to share at home, and a Guess the Surah round from that night's juz. Dates are expected.</p><ol class="night-grid">${nights}</ol></section>
<section class="reading-section last-ten-section" aria-labelledby="last-ten-title"><h2 id="last-ten-title">The last ten nights</h2><p>Surah al-Qadr, in full, with Pickthall's translation:</p><div class="qadr">${qadr}</div><ul class="hadith-list">${hadith}</ul><p class="date-note">Hadith are paraphrased; open each link to read the report and its grading on sunnah.com.</p></section>
<section class="reading-section" aria-labelledby="zakat-title"><h2 id="zakat-title">Zakat and zakat al-fitr</h2><p>Work through your zakat step by step, with every choice explained and sourced, or read how zakat al-fitr works before the Eid prayer.</p><p class="night-links"><a class="button" href="https://zakat-calculator.moongazer.tech/">Open the Zakat Calculator</a> <a href="https://zakat-calculator.moongazer.tech/zakat-al-fitr/">About zakat al-fitr</a></p></section>`;
}
