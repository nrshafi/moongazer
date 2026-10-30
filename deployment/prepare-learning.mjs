import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const catalog=JSON.parse(await readFile(join(root,'deployment/targets.json'),'utf8'));
const guides=JSON.parse(await readFile(join(root,'deployment/learning-guides.json'),'utf8'));
const collections=JSON.parse(await readFile(join(root,'homepage/collections.json'),'utf8'));
const bySlug=new Map(catalog.map(app=>[app.slug,app]));
if(Object.keys(guides).length!==catalog.length)throw new Error('Learning guide coverage differs from the app catalog');
for(const app of catalog){
  const authored=guides[app.slug];
  const collection=collections.find(item=>item.category===app.category);
  if(!authored||!collection||authored.steps.length!==3||authored.questions.length!==2||authored.related.length!==2)throw new Error(`Incomplete learning guide: ${app.slug}`);
  const related=authored.related.map(slug=>{
    const target=bySlug.get(slug);
    if(!target||slug===app.slug)throw new Error(`Invalid related app: ${slug}`);
    return {name:target.name,description:target.description,kind:target.kind,url:`https://${slug}.moongazer.tech/`};
  });
  if(new Set(authored.related).size!==2)throw new Error('Duplicate related app');
  const data={...authored,collection:{name:collection.name,url:`https://moongazer.tech/${collection.slug}/`},related};
  const directory=join(root,'apps',app.slug);
  await mkdir(join(directory,'src/components'),{recursive:true});
  await writeFile(join(directory,'src/data/learning.json'),JSON.stringify(data,null,2)+'\n');
  await copyFile(join(root,'deployment/templates/LearningGuide.astro'),join(directory,'src/components/LearningGuide.astro'));
  const index=join(directory,'src/pages/index.astro');
  let source=await readFile(index,'utf8');
  if(!source.includes("import learning from '../data/learning.json'")){
    if(!source.startsWith('---')||(source.match(/<h1\b/g)||[]).length!==1)throw new Error(`Inspect the home template: ${app.slug}`);
    source=source.replace(/^---/,"---\nimport learning from '../data/learning.json';");
    source=source.replace(/(<h1\b[^>]*>)[\s\S]*?<\/h1>/,'$1{learning.heading}</h1>');
    await writeFile(index,source);
  }
  const layout=join(directory,'src/layouts/Shell.astro');
  let shell=await readFile(layout,'utf8');
  if(!shell.includes("import LearningGuide from '../components/LearningGuide.astro'")){
    if(!shell.includes('<slot /></main>'))throw new Error(`Inspect the layout: ${app.slug}`);
    shell=shell.replace(/^---/,"---\nimport LearningGuide from '../components/LearningGuide.astro';");
    shell=shell.replace('<slot /></main>',"<slot />\n      {meta.path === '/' && <LearningGuide />}\n    </main>");
    shell=shell.replace('<a href="https://moongazer.tech/#library">All Moongazer apps</a>','<a href="https://moongazer.tech/#library">All Moongazer apps</a><a href="https://moongazer.tech/about/">About Moongazer</a>');
    await writeFile(layout,shell);
  }
}
console.log(`Prepared static learning guidance for ${catalog.length} independent apps.`);
