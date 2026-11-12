import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://why-it-was-revealed.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
