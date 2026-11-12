import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://parables-of-the-quran.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
