import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {origin,escapeHtml as e,metadata,appCards,collectionLinks,questions,documentPage} from './render.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=join(root,'homepage');
const out=join(source,'dist');
const allApps=JSON.parse(await readFile(join(root,'deployment/targets.json'),'utf8'));
// Retired apps (merged in P3) still deploy but are not listed in the directory.
const apps=allApps.filter(app=>!app.retired);
const collections=JSON.parse(await readFile(join(source,'collections.json'),'utf8'));
const bySlug=new Map(apps.map(app=>[app.slug,app]));
if(allApps.length!==20||apps.length!==16||collections.length!==4||new Set(collections.map(c=>c.slug)).size!==4)throw new Error('Unexpected directory coverage');
const home={path:'/',title:'Free Islamic Learning Apps & Quran Games | Moongazer',heading:'Free Islamic learning apps',description:'Explore sixteen free Islamic learning apps for Quran, Seerah, history and daily practice. Choose a reading tool or game and begin without an account.'};
const allPages=[home];
const paths=collections.map(collection=>{
  const selected=apps.filter(app=>app.category===collection.category);
  if(!selected.length||!/^[a-z0-9-]+$/.test(collection.slug))throw new Error('Invalid subject guide');
  return `<a class="subject-card" href="/${collection.slug}/"><span class="eyebrow">${selected.length} apps</span> <h3>${e(collection.name)}</h3> <p>${e(collection.description)}</p> <span>Explore this learning path <span aria-hidden="true">↗</span></span></a>`;
}).join('\n');
const commonQuestions=[
  {question:'What is Moongazer?',answer:'Moongazer is a collection of sixteen free browser apps for Quran, Seerah, history and everyday Islamic learning. Choose a tool for a specific task, such as recognizing a surah, finding wording, reading a report or exploring prayer recitation meanings.'},
  {question:'Do I need an account or an installation?',answer:'No. Open an app in your browser and begin. There are no accounts or subscriptions. Apps that offer saved progress keep it in that browser and provide their own storage controls.'},
  {question:'Where can I check an explanation or report a correction?',answer:'Each app links its sources and methodology. The About page explains the collection\'s source practices and provides the public contact for quotation, attribution and wording corrections.'}
];
let template=await readFile(join(source,'index.html'),'utf8');
for(const marker of ['PAGE_METADATA','APP_CATALOG','SUBJECT_GUIDES','COMMON_QUESTIONS','SUBJECT_LINKS'])if(!template.includes(`<!-- ${marker} -->`))throw new Error(`Missing directory template marker: ${marker}`);
template=template.replace('<!-- PAGE_METADATA -->',metadata(home,apps)).replace('<!-- APP_CATALOG -->',appCards(apps)).replace('<!-- SUBJECT_GUIDES -->',paths).replace('<!-- COMMON_QUESTIONS -->',questions(commonQuestions)).replace('<!-- SUBJECT_LINKS -->',collectionLinks(collections));
await mkdir(out,{recursive:true});
await writeFile(join(out,'index.html'),template);
for(const collection of collections){
  const selected=apps.filter(app=>app.category===collection.category);
  const meta={...collection,path:`/${collection.slug}/`};
  const journeys=collection.paths.map(path=>`<article class="reading-path"><h3>${e(path.title)}</h3><ol>${path.items.map(item=>{const app=bySlug.get(item.slug);if(!app)throw new Error('Unknown or retired journey app: '+item.slug);if(item.path&&!/^\/[a-z0-9\/-]*$/.test(item.path))throw new Error('Invalid journey path');return `<li><a href="https://${app.slug}.moongazer.tech${item.path||'/'}">${e(item.label||app.name)}</a> <p>${e(item.reason)}</p></li>`;}).join(' ')}</ol></article>`).join(' ');
  const body=`<section class="reading-section"><h2>Choose a task before a tool</h2><p>${e(collection.guidance)}</p><div class="reading-paths">${journeys}</div></section><section class="reading-section"><h2>The ${e(collection.name.toLowerCase())} app collection</h2><p>Compare the ${selected.length} tools in this subject, then open the activity you want to try.</p><div class="app-grid">${appCards(selected)}</div></section><section class="reading-section"><h2>Questions before you begin</h2>${questions(collection.questions)}</section><section class="reading-section"><h2>Explore another subject</h2><nav class="reading-subjects" aria-label="Other learning subjects">${collectionLinks(collections.filter(c=>c.slug!==collection.slug))} <a href="/about/">Sources, purpose & corrections</a></nav></section>`;
  const folder=join(out,collection.slug);await mkdir(folder,{recursive:true});
  await writeFile(join(folder,'index.html'),documentPage(meta,body,collections,selected));
  allPages.push(meta);
}
const about={path:'/about/',name:'About Moongazer',title:'About Moongazer | Sources, Privacy & Corrections',heading:'Small learning tools. Sources you can inspect.',intro:'Moongazer is a free collection of Quran, Seerah, history and everyday learning apps. This page explains what the activities are for, how to inspect their sources and where to report a correction.',description:'Read how Moongazer handles source editions, educational limits, browser storage and corrections across its sixteen free Islamic learning apps.',type:'AboutPage'};
const sourceLinks=apps.map(app=>`<li><a href="https://${app.slug}.moongazer.tech/sources/">${e(app.name)} sources</a></li>`).join('');
const aboutBody=(await readFile(join(source,'about-content.html'),'utf8')).replace('<!-- SOURCE_DIRECTORY -->',sourceLinks).replace('<!-- SUBJECT_LINKS -->',collectionLinks(collections));
await mkdir(join(out,'about'),{recursive:true});
await writeFile(join(out,'about/index.html'),documentPage(about,aboutBody,collections));
allPages.push(about);
// P4: feedback form, thanks page and the public corrections log (static; never reads the database).
const categories=[['source_or_text_correction','A source or wording correction'],['bug_report','Something is not working'],['feature_request','A suggestion']];
const feedbackForm=`<section class="reading-section"><form class="feedback-form" action="/api/feedback" method="post"><input type="hidden" name="app_slug" value="directory"><input type="hidden" name="page_url" value="https://moongazer.tech/feedback/"><input type="hidden" name="t" value="" data-feedback-time><fieldset><legend>What is it about?</legend>${categories.map(([value,label],index)=>`<label class="feedback-choice"><input type="radio" name="category" value="${value}" required${index===0?' checked':''}> ${e(label)}</label>`).join(' ')}</fieldset> <label class="feedback-field">Your message (name the app or page if it is about one) <textarea name="message" required minlength="10" maxlength="2000" rows="6"></textarea></label> <label class="feedback-field">Email, only if you want a reply <input type="email" name="contact" maxlength="200" autocomplete="email"></label> <div class="feedback-trap" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div> <p class="feedback-note">We read every message. Corrections we make appear in the <a href="/corrections/">corrections log</a>. We never publish your contact details.</p> <button class="button" type="submit">Send</button></form></section>`;
const feedback={path:'/feedback/',name:'Report an error',title:'Report an Error or Suggest Something | Moongazer',heading:'Report an error or suggest something',eyebrow:'Help us get it right',intro:'Tell us about a wrong quotation, a broken activity or an idea. Every app also has this form in its footer.',description:'Send Moongazer a source correction, a bug report or a suggestion. Messages are read before anything changes, and fixes appear in the public corrections log.',type:'WebPage',script:'/feedback.js'};
await mkdir(join(out,'feedback'),{recursive:true});
await writeFile(join(out,'feedback/index.html'),documentPage(feedback,feedbackForm,collections));
allPages.push(feedback);
const thanks={path:'/feedback/thanks/',name:'Thank you',title:'Thank You | Moongazer',heading:'Thank you',eyebrow:'Message received',intro:'Your message is waiting for review. Corrections we make appear in the corrections log.',description:'Your message to Moongazer is waiting for review.',type:'WebPage',noindex:true,script:'/feedback.js'};
const thanksBody=`<section class="reading-section"><p><a class="button" href="/" data-feedback-back data-apps="${allApps.map(app=>app.slug).join(' ')}">Back to Moongazer</a> <a href="/corrections/">Read the corrections log</a></p></section>`;
await mkdir(join(out,'feedback/thanks'),{recursive:true});
await writeFile(join(out,'feedback/thanks/index.html'),documentPage(thanks,thanksBody,collections));
const corrections=JSON.parse(await readFile(join(source,'corrections.json'),'utf8'));
const appName=slug=>slug==='directory'?'Moongazer directory':(allApps.find(app=>app.slug===slug)?.name||slug);
for(const item of corrections){if(!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||!/^https:\/\/([a-z0-9-]+\.)?moongazer\.tech\//.test(item.page_url)||!['visitor','review'].includes(item.found_by)||!item.change)throw new Error('Invalid correction entry');}
const correctionRows=[...corrections].sort((a,b)=>b.date.localeCompare(a.date)).map(item=>`<li class="correction"><p class="correction-meta"><time datetime="${item.date}">${item.date}</time> · ${e(appName(item.app_slug))} · ${item.found_by==='visitor'?'Reported by a visitor':'Found in our own review'}</p> <p>${e(item.change)}</p> <a href="${e(item.page_url)}">Open the page <span aria-hidden="true">→</span></a></li>`).join('');
const correctionsPage={path:'/corrections/',name:'Corrections log',title:'Corrections Log | Moongazer',heading:'Corrections log',eyebrow:'What we have fixed',intro:'Every correction to Moongazer\'s quotations, explanations or activities, newest first. Reporters\' details are never published.',description:'A public, dated list of corrections made to Moongazer apps: what changed, on which page, and whether a visitor or our own review found it.',type:'WebPage'};
await mkdir(join(out,'corrections'),{recursive:true});
await writeFile(join(out,'corrections/index.html'),documentPage(correctionsPage,`<section class="reading-section"><ol class="corrections-list">${correctionRows}</ol><p>Found something else? <a href="/feedback/">Report an error</a>.</p></section>`,collections));
allPages.push(correctionsPage);
const sitemapTemplate=await readFile(join(source,'sitemap.xml'),'utf8');
if(!sitemapTemplate.includes('<!-- SITEMAP_URLS -->'))throw new Error('Missing sitemap template marker');
await writeFile(join(out,'sitemap.xml'),sitemapTemplate.replace('<!-- SITEMAP_URLS -->',allPages.map(page=>`<url><loc>${e(new URL(page.path,origin).href)}</loc></url>`).join('\n')));
const llms=`# Moongazer\n\n> Sixteen free Islamic learning apps for Quran, Seerah, history and everyday practice. No account or installation is required.\n\nThis index links to the same public activities and guidance available on the website. Source quotations, attributed commentary and editorial exercises are distinguished in each app. It does not represent independent scholarly certification.\n\n## Learning guides\n${collections.map(c=>`- [${c.name}](${origin}${c.slug}/): ${c.description}`).join('\n')}\n\n## Apps\n${apps.map(a=>`- [${a.name}](https://${a.slug}.moongazer.tech/): ${a.description} Source notes: https://${a.slug}.moongazer.tech/sources/`).join('\n')}\n\n## About and corrections\n- [About Moongazer](${origin}about/): Sources, educational limits, browser storage and the public source-correction contact.\n`;
await writeFile(join(out,'llms.txt'),llms);
for(const file of ['styles.css','reading.css','app.js','feedback.js','moon.svg','favicon.svg','social-card.png','_headers','_redirects','_routes.json','robots.txt','404.html'])await cp(join(source,file),join(out,file));
await cp(join(source,'logos'),join(out,'logos'),{recursive:true});
await mkdir(join(out,'fonts'),{recursive:true});
for(const file of ['dm-sans.woff2','dm-sans-OFL.txt','newsreader.woff2','newsreader-OFL.txt'])await cp(join(root,'apps/guess-the-surah/public/fonts',file),join(out,'fonts',file));
console.log(`Built ${allPages.length} indexable directory pages and ${apps.length} app links into ${out}`);
