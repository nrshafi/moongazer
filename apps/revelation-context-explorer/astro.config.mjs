import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://revelation-context-explorer.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
