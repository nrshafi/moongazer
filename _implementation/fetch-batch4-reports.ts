import { mkdir } from 'node:fs/promises';
const base = '_implementation/research/batch4';
await mkdir(`${base}/reports`, { recursive: true });
const reports = ['bukhari:2079','bukhari:2142','bukhari:2165','bukhari:2270','bukhari:2400','bukhari:2387','muslim:102','bukhari:4508','bukhari:4519','bukhari:1643','bukhari:4495','bukhari:1461','bukhari:4617','bukhari:4845','bukhari:4953','bukhari:4971','bukhari:4141','bukhari:399','bukhari:3653','bukhari:2697','bukhari:6094','bukhari:6018','bukhari:6114','bukhari:5027','bukhari:3546'];
const institutions: Record<string, string> = {
  'met-umayyad': 'https://www.metmuseum.org/essays/the-art-of-the-umayyad-period-661-750',
  'met-abbasid': 'https://www.metmuseum.org/essays/the-art-of-the-abbasid-period-750-1258',
  'met-ottoman': 'https://www.metmuseum.org/essays/the-art-of-the-ottomans-before-1600',
  'unesco-cordoba': 'https://whc.unesco.org/en/list/313/',
  'unesco-fez': 'https://whc.unesco.org/en/list/170/',
  'unesco-kairouan': 'https://whc.unesco.org/en/list/499/',
  'unesco-cairo': 'https://whc.unesco.org/en/list/89/',
  'unesco-kilwa': 'https://whc.unesco.org/en/list/144/',
  'unesco-bukhara': 'https://whc.unesco.org/en/list/602/',
  'unesco-granada': 'https://whc.unesco.org/en/list/314/',
  'unesco-bursa': 'https://whc.unesco.org/en/list/1452/',
  'unesco-samarkand': 'https://whc.unesco.org/en/list/603/',
  'unesco-timbuktu': 'https://whc.unesco.org/en/list/119/',
  'unesco-bagerhat': 'https://whc.unesco.org/en/list/321/',
  'unesco-melaka': 'https://whc.unesco.org/en/list/1223/',
  'unesco-istanbul': 'https://whc.unesco.org/en/list/356/',
  'unesco-selimiye': 'https://whc.unesco.org/en/list/1366/',
  'unesco-fatehpur': 'https://whc.unesco.org/en/list/255/',
  'unesco-taj': 'https://whc.unesco.org/en/list/252/',
  'unesco-isfahan': 'https://whc.unesco.org/en/list/115/',
};
const entries = [...reports.map(ref => [ref.replace(':','-'), `https://sunnah.com/${ref}`]), ...Object.entries(institutions)];
const results = [];
for (const [id, url] of entries) {
  const file = `${base}/reports/${id}.html`;
  if (!(await Bun.file(file).exists())) {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
    const html = await response.text();
    if (url.includes('sunnah.com') && !html.includes('english_hadith_full')) throw new Error(`Missing report ${id}`);
    await Bun.write(file, html);
    await Bun.sleep(200);
  }
  results.push({ id, url, file, retrievedAt: new Date().toISOString() });
  console.log(id);
}
await Bun.write(`${base}/report-provenance.json`, JSON.stringify(results, null, 2));
