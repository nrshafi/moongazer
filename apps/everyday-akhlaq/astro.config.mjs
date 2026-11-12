import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://everyday-akhlaq.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
