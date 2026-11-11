import { join } from 'node:path';
const root=join(import.meta.dir,'..');
const apps=['guess-the-surah','quran-connections','the-seerah-detective','everyday-akhlaq-simulator','interactive-seerah-timeline','quran-memorization-workload-calculator','is-this-actually-in-the-quran','islamic-knowledge-escape-room','stories-of-the-prophets-explorer','quranic-places-atlas','islamic-concept-connections','understand-salah-lab','quranic-parables-studio','islamic-civilization-timeline','revelation-context-explorer','family-islamic-learning-challenges'];
const command=process.argv[2]||'check';
if(!['check','test','build'].includes(command))throw new Error('Use check, test, or build');
let failed=false;
process.env.ASTRO_TELEMETRY_DISABLED='1';
for(const app of apps){console.log(`\n${app}: ${command}`);const child=Bun.spawn([process.execPath,'run',command],{cwd:join(root,'apps',app),stdin:'ignore',stdout:'inherit',stderr:'inherit'});const code=await child.exited;if(code!==0)failed=true;}
if(failed)process.exit(1);
console.log(`\nAll ${apps.length} apps passed ${command}.`);
