import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://hifz-planner.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
