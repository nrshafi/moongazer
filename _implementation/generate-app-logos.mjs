import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// One small, legible symbol per activity. The shared frame keeps the collection related.
const root = fileURLToPath(new URL('../', import.meta.url));
const marks = {
  'guess-the-surah': ['#087f75', '<path d="M4 5c3-1 5-.6 8 1v14c-3-1.6-5-2-8-1V5Zm16 0c-3-1-5-.6-8 1v14c3-1.6 5-2 8-1V5Z"/><path d="m16 5 .5 1.5L18 7l-1.5.5L16 9l-.5-1.5L14 7l1.5-.5Z" fill="#fff" stroke="none"/>'],
  'ayah-threads': ['#087f75', '<circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7 8 4 8m6-8-4 8M7 7h10"/>'],
  'seerah-detective': ['#316caa', '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6M7 10h6m-3-3v6"/>'],
  'everyday-akhlaq': ['#7255a0', '<path d="M12 21c-5-3-8-6.3-8-10a4 4 0 0 1 7-2.5L12 10l1-1.5A4 4 0 0 1 20 11c0 3.7-3 7-8 10Z"/><path d="M12 10v6m0 0 3-3m-3 3-3-3"/>'],
  'seerah-timeline': ['#087f75', '<path d="M4 3v18m0-15h10M4 12h15M4 19h8"/><circle cx="15" cy="6" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="13" cy="19" r="2"/>'],
  'hifz-planner': ['#087f75', '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h3m2 0h3M8 15h2m3 0h3M8 19h2m3 0h3"/>'],
  'is-it-in-the-quran': ['#316caa', '<path d="M3 5h11v14H3zM6 9h5m-5 3h3"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>'],
  'quran-escape-room': ['#7255a0', '<path d="M5 21V8a7 7 0 0 1 14 0v13H5Z"/><circle cx="12" cy="12" r="2"/><path d="m12 14-1 4h2l-1-4Z"/>'],
  'stories-of-the-prophets': ['#316caa', '<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/><path d="m16 8 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/>'],
  'places-in-the-quran': ['#087f75', '<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><path d="m12 6 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>'],
  'word-groups': ['#316caa', '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M10 6.5h4M6.5 10v4m11-4v4M10 17.5h4"/>'],
  'understand-your-salah': ['#087f75', '<path d="M4 21V10c0-4 8-8 8-8s8 4 8 8v11H4Z"/><path d="M8 21v-9m8 9v-9m-8 4h8"/>'],
  'parables-of-the-quran': ['#316caa', '<path d="M12 2 5 12l7 10 7-10L12 2Z"/><path d="M5 12h14M12 2v20m-4-7 4-3 4 3"/>'],
  'civilization-timeline': ['#316caa', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18M5 7h14M5 17h14"/>'],
  'why-it-was-revealed': ['#316caa', '<path d="M6 4h10l3 3v14H6V4Zm10 0v4h3M9 11h7m-7 4h7m-7 4h4"/><path d="M3 7v14h2"/>'],
  'family-halaqa': ['#7255a0', '<circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><path d="M2 20v-3a5 5 0 0 1 7-4.5M22 20v-3a5 5 0 0 0-7-4.5M7 21v-4a5 5 0 0 1 10 0v4H7Z"/>'],
};

for (const [slug, [color, art]] of Object.entries(marks)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${slug.replaceAll('-', ' ')} logo"><rect width="64" height="64" rx="17" fill="${color}"/><path d="M10 51h44" stroke="#fff" opacity=".22"/><g transform="translate(8 8) scale(2)" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${art}</g></svg>\n`;
  await writeFile(join(root, 'apps', slug, 'public', 'favicon.svg'), svg);
  await mkdir(join(root, 'homepage', 'logos'), { recursive: true });
  await writeFile(join(root, 'homepage', 'logos', `${slug}.svg`), svg);
}
console.log(`Wrote ${Object.keys(marks).length} dedicated app logos.`);
