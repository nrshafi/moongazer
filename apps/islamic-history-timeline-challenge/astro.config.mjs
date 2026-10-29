import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://islamic-history-timeline-challenge.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
