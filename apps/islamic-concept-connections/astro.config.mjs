import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://islamic-concept-connections.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
