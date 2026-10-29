import { join } from 'node:path';
const root=join(import.meta.dir,'..');
const allApps=['guess-the-surah','quran-connections','the-seerah-detective','everyday-akhlaq-simulator','interactive-seerah-timeline','quran-memorization-workload-calculator','is-this-actually-in-the-quran','quran-concept-atlas','islamic-knowledge-escape-room','stories-of-the-prophets-explorer','quranic-places-atlas','islamic-concept-connections','islamic-history-timeline-challenge','understand-salah-lab','quranic-parables-studio','islamic-civilization-timeline','halal-business-decisions','revelation-context-explorer','family-islamic-learning-challenges','islamic-misinformation-casebook'];
const apps=process.argv.includes('--batch4')?allApps.slice(15,20):process.argv.includes('--batch3')?allApps.slice(10,15):process.argv.includes('--batch2')?allApps.slice(5,10):allApps;
const command=process.argv[2]||'check';
if(!['check','test','build'].includes(command))throw new Error('Use check, test, or build');
let failed=false;
process.env.ASTRO_TELEMETRY_DISABLED='1';
for(const app of apps){console.log(`\n${app}: ${command}`);const child=Bun.spawn([process.execPath,'run',command],{cwd:join(root,'apps',app),stdin:'ignore',stdout:'inherit',stderr:'inherit'});const code=await child.exited;if(code!==0)failed=true;}
if(failed)process.exit(1);
console.log(`\nAll ${apps.length} apps passed ${command}.`);
