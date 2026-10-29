"""Write the release report from completed validation evidence."""
from pathlib import Path
import json, datetime
from zoneinfo import ZoneInfo

ROOT=Path(__file__).resolve().parent.parent
evidence=ROOT/'deployment/evidence/seo'
static=json.loads((evidence/'static.json').read_text())
live=json.loads((evidence/'live.json').read_text())
release=json.loads((ROOT/'deployment/seo-release.json').read_text())
fonts=json.loads((evidence/'font-conversion.json').read_text())
gsc_path=ROOT/'deployment/search-console.json'
gsc=json.loads(gsc_path.read_text()) if gsc_path.exists() else {}
gsc_complete=gsc.get('ownershipVerified') and len(gsc.get('sitemaps',[]))==21 and all(s.get('status')=='Success' for s in gsc['sitemaps'])
search_summary=('Google Search Console Domain ownership is verified and all 21 submitted sitemaps show Success. See deployment/search-console.json for the observed report.' if gsc_complete else 'Search Console ownership and sitemap submission are not complete; the user confirmed no property exists yet.')
search_next=('Search Console setup is complete. Keep the verification TXT record and use the verified property to review indexing and search performance as Google processes the site.' if gsc_complete else 'Follow SEARCH_CONSOLE_SETUP.md to verify a Google Domain property and submit the 21 sitemaps.')
sitemap_heading='Submitted sitemaps, all successful' if gsc_complete else 'Sitemaps to submit'
assert static['passed'] and live['failed']==0 and release['phase']=='complete'
stamp=datetime.datetime.now(ZoneInfo('Asia/Dhaka')).isoformat(timespec='seconds')
before=sum(f['ttfBytes'] for f in fonts);after=sum(f['woff2Bytes'] for f in fonts)
report=f'''# Moongazer SEO release

Verified {stamp} Asia/Dhaka. The directory and all twenty independent app subdomains have been published with the SEO changes. {search_summary}

## Audit and fixes

| Priority | Verified baseline | Released change |
| --- | --- | --- |
| High | All twenty apps lacked canonical URLs and sitemaps | HTTPS self-canonicals on custom hosts; twenty app sitemaps plus the directory sitemap; each robots.txt declares its own sitemap |
| High | Each app reused one description across its detail pages | Unique titles and descriptions derived from local editorial names and summaries; missing metadata fails a build |
| High | Pages-origin copies could compete with custom hosts | Host-specific X-Robots-Tag noindex on Pages production and preview hosts; custom hosts remain indexable |
| Medium | No app social metadata or structured data | Local 1200×630 PNG previews, Open Graph and Twitter metadata, WebSite/WebPage or CollectionPage, educational LearningResource semantics and visible BreadcrumbList markup |
| Medium | Apps lacked a navigation path to the collection | Visible breadcrumbs and a footer link to the directory; all indexable routes have crawlable incoming links |
| Medium | Large local TrueType fonts | Lossless WOFF2 derivatives, font preloads and existing font-display behavior; {before:,} bytes reduced to {after:,} ({(1-after/before)*100:.1f}% smaller), with cmap and glyph counts preserved |

The directory includes WebSite, CollectionPage and an ItemList of its twenty apps. Privacy and 404 pages are noindex and absent from sitemaps. The 404 pages have no canonical or JSON-LD. Query strings do not change canonicals. Each sitemap contains only URLs on its own hostname, without invented last-modified dates.

The app SEO profiles in deployment/seo-catalog.json map each app to its subject and search intent. Each app owns a copied profile, helper and static sitemap endpoint, with no cross-app runtime dependency. Primary quotations, source content, checksums, activity logic and dependency pins remain intact. Existing local licenses accompany the fonts. No visitor tracking was added.

## Validation

- Twenty Astro checks: zero errors, warnings or hints; twenty production builds pass.
- 217 existing app tests and five SEO helper tests pass.
- Static SEO verification: {static['sites']} hosts, {static['pages']} HTML pages and {static['indexable']} indexable URLs; unique metadata, canonical coverage, valid JSON-LD graphs, breadcrumbs, sitemap/robots coverage, local social-image dimensions and WOFF2 references pass.
- Canonical Quran text, provenance checksums, local references and runtime-asset constraints pass on all 325 app pages.
- Live SEO verification: {live['passed']}/{live['requests']} requests pass, including public routes, sitemap/robots content, parameter canonicalization and noindex headers on Pages origins. Public asset/hash, security-header, HTTPS, www and missing-page checks are recorded in deployment/evidence/seo/live-http.json.
- Browser inspection at 390px covers all twenty app homepages: local fonts loaded, one structured-data block, correct canonical, visible breadcrumbs and no horizontal overflow. Additional desktop/mobile detail and directory checks are recorded in deployment/evidence/seo/browser.json.
- Google's public Rich Results Test successfully crawled the published Al-Fatiha detail page and detected a valid breadcrumb item. This checks one representative URL. Result: https://search.google.com/test/rich-results/result?id=1hzVB5MYWpfyJdZypeTAOA . It does not guarantee a search appearance or establish indexing.

All 21 deployment-specific Pages URLs also return noindex. Python's default user agent initially received Cloudflare error 1010; the identified verification user agent used by the other checks passed. Both attempts are preserved in deployment/evidence/seo/preview-noindex*.json.

The first live SEO attempt required a verifier correction. Cloudflare may return 200 for the explicit /404.html document, which remains noindex. Missing routes correctly return 404, as checked separately by the complete HTTP verifier. Two initial network timeouts also passed on retest. Initial evidence remains in deployment/evidence/seo/live-first-attempt.json.

Reproduce with bun test _implementation/seo.test.ts, bun _implementation/verify.ts check, bun _implementation/verify.ts test, bun _implementation/verify.ts build, node homepage/build.mjs, python _implementation/verify-static.py, and python deployment/verify-seo.py --live. Publication records are in deployment/seo-release.json. Preserve older evidence as historical releases. Detailed generated logs, audit output and screenshots remain local and are intentionally omitted from Git. The compact release, font-conversion and Search Console records are versioned.

## Remaining external work and limits

{search_next} No Google indexing, ranking, traffic increase, collection-wide rich-result certification or field Core Web Vitals improvement is claimed. Font byte reduction is measured; a fresh Lighthouse or field-performance study was not performed. New content and independent scholarly review were outside this SEO change. The older context verifier still depends on absent historical batch-four QA files; fresh static and release evidence does not recreate those historical artifacts.

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
'''
(ROOT/'SEO_QA.md').write_text(report,encoding='utf-8')
sitemaps='\n'.join('- '+host['sitemap'] for host in static['hosts'])
setup=f'''# Google Search Console setup

Updated {stamp} Asia/Dhaka. {search_summary}

The procedure below is a maintenance reference. Keep the existing Google verification record in Cloudflare DNS. Check deployment/search-console.json for the current setup and individual sitemap results.

1. Sign in to the intended Google account at https://search.google.com/search-console/ and choose Add property.
2. Select Domain and enter moongazer.tech without a protocol or path. A Domain property covers the apex, all app subdomains and protocol variants.
3. Copy the exact google-site-verification TXT value Google supplies. In the existing moongazer.tech Cloudflare DNS zone, add a TXT record at @ with that value and automatic TTL. Preserve every existing record. Never use a made-up verification value or an API credential.
4. Return to Search Console and select Verify. Leave the TXT record in place to retain verification. DNS propagation may take time.
5. Open Sitemaps for the verified Domain property and submit each complete URL below. Each sitemap is also discoverable through its host's robots.txt; sitemap publication does not establish submission or indexing.
6. Use URL Inspection to test the directory, representative app homes and a detail route. Request indexing where appropriate. Review Page indexing and sitemap errors, then search performance when data becomes available. Expected exclusions include privacy/404 pages and Pages-origin/preview copies.

## {sitemap_heading}

{sitemaps}

These contain {static['indexable']} canonical, indexable URLs in total. A successful submission is a discovery signal, not a guarantee that every URL will be indexed or ranked. No sitemap pings, Indexing API workaround, analytics tag or unverified ownership claim is required.

Official references: https://support.google.com/webmasters/answer/9008080 ; https://support.google.com/webmasters/answer/7451001 ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl .
'''
(ROOT/'SEARCH_CONSOLE_SETUP.md').write_text(setup,encoding='utf-8')
print('Wrote SEO_QA.md and SEARCH_CONSOLE_SETUP.md from completed release evidence.')
