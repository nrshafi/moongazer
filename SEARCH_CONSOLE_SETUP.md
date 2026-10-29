# Google Search Console setup

Updated 2026-10-30T00:57:45+06:00 Asia/Dhaka. Google Search Console Domain ownership is verified and all 21 submitted sitemaps show Success. See deployment/search-console.json for the observed report.

The procedure below is a maintenance reference. Keep the existing Google verification record in Cloudflare DNS. Check deployment/search-console.json for the current setup and individual sitemap results.

1. Sign in to the intended Google account at https://search.google.com/search-console/ and choose Add property.
2. Select Domain and enter moongazer.tech without a protocol or path. A Domain property covers the apex, all app subdomains and protocol variants.
3. Copy the exact google-site-verification TXT value Google supplies. In the existing moongazer.tech Cloudflare DNS zone, add a TXT record at @ with that value and automatic TTL. Preserve every existing record. Never use a made-up verification value or an API credential.
4. Return to Search Console and select Verify. Leave the TXT record in place to retain verification. DNS propagation may take time.
5. Open Sitemaps for the verified Domain property and submit each complete URL below. Each sitemap is also discoverable through its host's robots.txt; sitemap publication does not establish submission or indexing.
6. Use URL Inspection to test the directory, representative app homes and a detail route. Request indexing where appropriate. Review Page indexing and sitemap errors, then search performance when data becomes available. Expected exclusions include privacy/404 pages and Pages-origin/preview copies.

## Submitted sitemaps, all successful

- https://moongazer.tech/sitemap.xml
- https://guess-the-surah.moongazer.tech/sitemap.xml
- https://quran-connections.moongazer.tech/sitemap.xml
- https://the-seerah-detective.moongazer.tech/sitemap.xml
- https://everyday-akhlaq-simulator.moongazer.tech/sitemap.xml
- https://interactive-seerah-timeline.moongazer.tech/sitemap.xml
- https://quran-memorization-workload-calculator.moongazer.tech/sitemap.xml
- https://is-this-actually-in-the-quran.moongazer.tech/sitemap.xml
- https://quran-concept-atlas.moongazer.tech/sitemap.xml
- https://islamic-knowledge-escape-room.moongazer.tech/sitemap.xml
- https://stories-of-the-prophets-explorer.moongazer.tech/sitemap.xml
- https://quranic-places-atlas.moongazer.tech/sitemap.xml
- https://islamic-concept-connections.moongazer.tech/sitemap.xml
- https://islamic-history-timeline-challenge.moongazer.tech/sitemap.xml
- https://understand-salah-lab.moongazer.tech/sitemap.xml
- https://quranic-parables-studio.moongazer.tech/sitemap.xml
- https://islamic-civilization-timeline.moongazer.tech/sitemap.xml
- https://halal-business-decisions.moongazer.tech/sitemap.xml
- https://revelation-context-explorer.moongazer.tech/sitemap.xml
- https://family-islamic-learning-challenges.moongazer.tech/sitemap.xml
- https://islamic-misinformation-casebook.moongazer.tech/sitemap.xml

These contain 286 canonical, indexable URLs in total. A successful submission is a discovery signal, not a guarantee that every URL will be indexed or ranked. No sitemap pings, Indexing API workaround, analytics tag or unverified ownership claim is required.

Official references: https://support.google.com/webmasters/answer/9008080 ; https://support.google.com/webmasters/answer/7451001 ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl .
