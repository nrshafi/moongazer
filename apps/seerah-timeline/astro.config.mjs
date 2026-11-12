import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://seerah-timeline.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
