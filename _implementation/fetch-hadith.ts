import {mkdir} from 'node:fs/promises';
const refs=['bukhari:3','bukhari:4','bukhari:4770','bukhari:3852','bukhari:3231','bukhari:3887','bukhari:18','bukhari:3906','bukhari:3905','bukhari:3653','bukhari:428','bukhari:3780','bukhari:399','bukhari:4504','bukhari:3953','bukhari:3039','bukhari:4070','bukhari:4100','bukhari:4141','bukhari:334','bukhari:2731','bukhari:4154','bukhari:4210','bukhari:7','bukhari:4251','bukhari:4280','bukhari:4287','bukhari:4315','bukhari:4418','bukhari:4655','bukhari:1333','muslim:1218a','bukhari:4403','bukhari:4449','bukhari:4454','bukhari:1390'];
await mkdir('_implementation/research/hadith',{recursive:true});
for(const ref of refs) {
  const path=`_implementation/research/hadith/${ref.replace(':','-')}.html`;
  if(await Bun.file(path).exists()) { console.log(`Cached ${ref}`); continue; }
  const response=await fetch(`https://sunnah.com/${ref}`,{signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw new Error(`${ref}: ${response.status}`);
  const html=await response.text();
  if(!html.includes('english_hadith_full')) throw new Error(`Missing hadith content: ${ref}`);
  await Bun.write(path,html);
  console.log(`Retrieved ${ref}`);
  await Bun.sleep(300);
}
