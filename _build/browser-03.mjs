const fs=await import('node:fs/promises'),root='I:/_Study_Resource/islamic_product';
const task=await taskSpace(2),page=task.page('p1');
await page.goto('file:///'+root+'/index.html');
await page.fill('#search','zakat');
console.log('catalog filter',await page.evaluate(()=>({visible:[...document.querySelectorAll('.catalog article')].filter(e=>!e.hidden).length,count:document.querySelector('#count').textContent})));
await page.fill('#search','');
await page.screenshot({path:root+'/_build/catalog-desktop.png'});
await page.goto('file:///'+root+'/hadith-narrator-network.html');
await page.screenshot({path:root+'/_build/narrator-desktop.png'});
await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
const manifest=JSON.parse(await fs.readFile(root+'/demo-manifest.json','utf8')),mobile=[];
for(const app of manifest){await page.goto('file:///'+root+'/'+app.file);mobile.push(await page.evaluate(slug=>({slug,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth}),app.slug));}
await fs.writeFile(root+'/_build/mobile-results.json',JSON.stringify(mobile,null,2));
console.log('mobile',JSON.stringify(mobile.filter(x=>x.overflow)),'checked',mobile.length);
await page.goto('file:///'+root+'/quran-word-search.html');
await page.screenshot({path:root+'/_build/wordsearch-mobile.png'});
await page.goto('file:///'+root+'/index.html');
await page.screenshot({path:root+'/_build/catalog-mobile.png'});
console.log('screenshots saved');
