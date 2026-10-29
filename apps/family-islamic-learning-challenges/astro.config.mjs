import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://family-islamic-learning-challenges.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
