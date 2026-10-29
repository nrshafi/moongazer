import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://stories-of-the-prophets-explorer.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
