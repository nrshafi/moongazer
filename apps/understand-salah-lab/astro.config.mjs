import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://understand-salah-lab.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
