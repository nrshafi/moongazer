import {mkdir} from 'node:fs/promises';
const target='_implementation/research/fonts';await mkdir(target,{recursive:true});
for(const [name,directory,filename] of [
  ['dm-sans','dmsans','DMSans[opsz,wght].ttf'],
  ['newsreader','newsreader','Newsreader[opsz,wght].ttf'],
  ['amiri','amiri','Amiri-Regular.ttf'],
]) {
  for(const [file,output] of [[filename,`${name}.ttf`],['OFL.txt',`${name}-OFL.txt`]]) {
    const response=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${directory}/${encodeURIComponent(file!)}`);
    if(!response.ok)throw new Error(`${file}: ${response.status}`);
    await Bun.write(`${target}/${output}`,await response.arrayBuffer());
  }
  console.log(`Downloaded ${name} and OFL license`);
}
