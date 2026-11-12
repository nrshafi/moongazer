import { join } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';
const root=join(import.meta.dir,'..');
// Every app under apps/ with a package.json, like the CI loop in .github/workflows/deploy.yml.
const apps=readdirSync(join(root,'apps'),{withFileTypes:true}).filter(d=>d.isDirectory()&&existsSync(join(root,'apps',d.name,'package.json'))).map(d=>d.name).sort();
const command=process.argv[2]||'check';
if(!['check','test','build'].includes(command))throw new Error('Use check, test, or build');
let failed=false;
process.env.ASTRO_TELEMETRY_DISABLED='1';
for(const app of apps){console.log(`\n${app}: ${command}`);const child=Bun.spawn([process.execPath,'run',command],{cwd:join(root,'apps',app),stdin:'ignore',stdout:'inherit',stderr:'inherit'});const code=await child.exited;if(code!==0)failed=true;}
if(failed)process.exit(1);
console.log(`\nAll ${apps.length} apps passed ${command}.`);
