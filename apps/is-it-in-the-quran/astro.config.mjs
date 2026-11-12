import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://is-it-in-the-quran.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
