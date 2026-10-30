# Moongazer SEO release

This is the earlier technical foundation. See [SEO_GROWTH_QA.md](SEO_GROWTH_QA.md) for the latest content release and current counts.

Verified 2026-10-30T00:57:45+06:00 Asia/Dhaka. The directory and all twenty independent app subdomains have been published with the SEO changes. Google Search Console Domain ownership is verified and all 21 submitted sitemaps show Success. See deployment/search-console.json for the observed report.

## Audit and fixes

| Priority | Verified baseline | Released change |
| --- | --- | --- |
| High | All twenty apps lacked canonical URLs and sitemaps | HTTPS self-canonicals on custom hosts; twenty app sitemaps plus the directory sitemap; each robots.txt declares its own sitemap |
| High | Each app reused one description across its detail pages | Unique titles and descriptions derived from local editorial names and summaries; missing metadata fails a build |
| High | Pages-origin copies could compete with custom hosts | Host-specific X-Robots-Tag noindex on Pages production and preview hosts; custom hosts remain indexable |
| Medium | No app social metadata or structured data | Local 1200×630 PNG previews, Open Graph and Twitter metadata, WebSite/WebPage or CollectionPage, educational LearningResource semantics and visible BreadcrumbList markup |
| Medium | Apps lacked a navigation path to the collection | Visible breadcrumbs and a footer link to the directory; all indexable routes have crawlable incoming links |
| Medium | Large local TrueType fonts | Lossless WOFF2 derivatives, font preloads and existing font-display behavior; 1,122,944 bytes reduced to 452,900 (59.7% smaller), with cmap and glyph counts preserved |

The directory includes WebSite, CollectionPage and an ItemList of its twenty apps. Privacy and 404 pages are noindex and absent from sitemaps. The 404 pages have no canonical or JSON-LD. Query strings do not change canonicals. Each sitemap contains only URLs on its own hostname, without invented last-modified dates.

The app SEO profiles in deployment/seo-catalog.json map each app to its subject and search intent. Each app owns a copied profile, helper and static sitemap endpoint, with no cross-app runtime dependency. Primary quotations, source content, checksums, activity logic and dependency pins remain intact. Existing local licenses accompany the fonts. No visitor tracking was added.

## Validation

- Twenty Astro checks: zero errors, warnings or hints; twenty production builds pass.
- 217 existing app tests and five SEO helper tests pass.
- Static SEO verification: 21 hosts, 327 HTML pages and 286 indexable URLs; unique metadata, canonical coverage, valid JSON-LD graphs, breadcrumbs, sitemap/robots coverage, local social-image dimensions and WOFF2 references pass.
- Canonical Quran text, provenance checksums, local references and runtime-asset constraints pass on all 325 app pages.
- Live SEO verification: 411/411 requests pass, including public routes, sitemap/robots content, parameter canonicalization and noindex headers on Pages origins. Public asset/hash, security-header, HTTPS, www and missing-page checks are recorded in deployment/evidence/seo/live-http.json.
- Browser inspection at 390px covers all twenty app homepages: local fonts loaded, one structured-data block, correct canonical, visible breadcrumbs and no horizontal overflow. Additional desktop/mobile detail and directory checks are recorded in deployment/evidence/seo/browser.json.
- Google's public Rich Results Test successfully crawled the published Al-Fatiha detail page and detected a valid breadcrumb item. This checks one representative URL. Result: https://search.google.com/test/rich-results/result?id=1hzVB5MYWpfyJdZypeTAOA . It does not guarantee a search appearance or establish indexing.

All 21 deployment-specific Pages URLs also return noindex. Python's default user agent initially received Cloudflare error 1010; the identified verification user agent used by the other checks passed. Both attempts are preserved in deployment/evidence/seo/preview-noindex*.json.

The first live SEO attempt required a verifier correction. Cloudflare may return 200 for the explicit /404.html document, which remains noindex. Missing routes correctly return 404, as checked separately by the complete HTTP verifier. Two initial network timeouts also passed on retest. Initial evidence remains in deployment/evidence/seo/live-first-attempt.json.

Reproduce with bun test _implementation/seo.test.ts, bun _implementation/verify.ts check, bun _implementation/verify.ts test, bun _implementation/verify.ts build, node homepage/build.mjs, python _implementation/verify-static.py, and python deployment/verify-seo.py --live. Publication records are in deployment/seo-release.json. Preserve older evidence as historical releases. Detailed generated logs, audit output and screenshots remain local and are intentionally omitted from Git. The compact release, font-conversion and Search Console records are versioned.

## Remaining external work and limits

Search Console setup is complete. Keep the verification TXT record and use the verified property to review indexing and search performance as Google processes the site. No Google indexing, ranking, traffic increase, collection-wide rich-result certification or field Core Web Vitals improvement is claimed. Font byte reduction is measured; a fresh Lighthouse or field-performance study was not performed. New content and independent scholarly review were outside this SEO change. The older context verifier still depends on absent historical batch-four QA files; fresh static and release evidence does not recreate those historical artifacts.

This release used direct publication through the Cloudflare connector with commit_dirty=true. At publication time, the SEO source and added CI validation steps were uncommitted; a new GitHub Actions run for them was not triggered in that task. The source checkpoint is recorded in context/progress-tracker.md. The existing automatic deployment remains configured. The separate visual-refresh work in the shared checkout has its own progress record.

## Documentation and installed-interface evidence

- Google canonical guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Sitemap generation and submission: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Same-site sitemap indexes and cross-site requirements: https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps
- Noindex behavior: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Breadcrumb markup: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Site names: https://developers.google.com/search/docs/appearance/site-names
- LearningResource vocabulary: https://schema.org/LearningResource
- Astro site and static endpoint interfaces: https://docs.astro.build/en/reference/api-reference/#site and https://docs.astro.build/en/guides/endpoints/#static-file-endpoints
- Installed Astro 7.4.2 dist/types/public/config.d.ts and context.d.ts establish site URL support; Astro CLI --help was checked. Package manifests, bun.lock and installed pins were inspected and retained.
- Cloudflare host-specific header syntax: https://developers.cloudflare.com/pages/configuration/headers/
- WOFF2 tooling: https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html ; tooling versions are pinned in deployment/seo-assets-requirements.txt. Optional isolated Brotli install lives only in ignored deployment/.tmp.

Matching official documentation was reused. Context7 was unavailable; installed types, CLI help and official documentation supplied the API evidence.
