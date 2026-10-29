import {mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';
const base='_implementation/research/batch3';await mkdir(base,{recursive:true});
const files=[{name:'countries.geojson',url:'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'},{name:'fatiha.mp3',url:'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ea/Surah-Fathia.flac/Surah-Fathia.flac.mp3'}];
const audit=[];for(const file of files){const r=await fetch(file.url,{signal:AbortSignal.timeout(120000),headers:{'User-Agent':'IslamicProductLab/1.0 source preparation'}});if(!r.ok)throw new Error(`${r.status} ${file.name}`);const bytes=new Uint8Array(await r.arrayBuffer());await Bun.write(`${base}/${file.name}`,bytes);audit.push({...file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});console.log(file.name,bytes.length);}
await Bun.write(`${base}/assets.json`,JSON.stringify(audit,null,2));
