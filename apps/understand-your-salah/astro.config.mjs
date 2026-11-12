import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://understand-your-salah.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
