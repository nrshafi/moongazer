import { join } from 'node:path';
const root=join(import.meta.dir,'..');
const apps=['guess-the-surah','ayah-threads','seerah-detective','everyday-akhlaq','seerah-timeline','hifz-planner','is-it-in-the-quran','quran-escape-room','stories-of-the-prophets','places-in-the-quran','word-groups','understand-your-salah','parables-of-the-quran','civilization-timeline','why-it-was-revealed','family-halaqa'];
const command=process.argv[2]||'check';
if(!['check','test','build'].includes(command))throw new Error('Use check, test, or build');
let failed=false;
process.env.ASTRO_TELEMETRY_DISABLED='1';
for(const app of apps){console.log(`\n${app}: ${command}`);const child=Bun.spawn([process.execPath,'run',command],{cwd:join(root,'apps',app),stdin:'ignore',stdout:'inherit',stderr:'inherit'});const code=await child.exited;if(code!==0)failed=true;}
if(failed)process.exit(1);
console.log(`\nAll ${apps.length} apps passed ${command}.`);
