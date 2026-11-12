import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://places-in-the-quran.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
