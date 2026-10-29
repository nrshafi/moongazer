import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://guess-the-surah.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
