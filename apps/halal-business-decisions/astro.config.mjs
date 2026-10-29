import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://halal-business-decisions.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
