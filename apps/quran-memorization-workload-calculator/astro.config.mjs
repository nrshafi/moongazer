import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://quran-memorization-workload-calculator.moongazer.tech/', output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });
