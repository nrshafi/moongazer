# Brief 14 — Moongazer: growth, trust and the Bangla edition

**Repository:** `I:\Development\moongazer`, plus Booktube for the video part
**Depends on:** 07–10. **Authorized:** ask the owner, part by part. Parts 1 and 2 need owner decisions about names and contacts.
**Goal:** give people reasons to trust and share Moongazer, and reach the Bangla-speaking audience.
**Background:** `../REPORT.md`, A11 (growth), A12 (trust), A13 (measurement), A3 (audiences).

## Part 1 — Trust (owner decisions required)

1. **Maintainer.** Ask the owner what name to show on the About page: a personal name, or a publisher name. Add it truthfully. Do not infer a name from any account.
2. **Reviewers.** If the owner recruits qualified reviewers, add a per-app "What was reviewed, by whom, when" line, only for reviews that actually happened. Until then, show nothing about review. Never claim certification.
3. **Corrections log.**
   - Add `/corrections/` on the directory: date, page, what changed, and "reported by a visitor" or "found in review". Include no personal data unless the reporter agrees.
   - Seed it with the defects fixed in brief 06.
   - Link it from the About page, the footer and the trust row.
4. **Cut repeated hedging.** After briefs 06–08 moved caveats into drawers, review all apps for any limit stated more than once per page, and keep the clearest one.

## Part 2 — Measurement without tracking

1. Keep the no-script promise. Use Search Console for queries and pages. For aggregate request counts per host, use Cloudflare's server-side dashboard analytics, which add no script to the page.
2. If the owner wants the Cloudflare counts used, first update the About page and `context/project-overview.md` truthfully: "no tracking scripts or advertising cookies; we look at aggregate request counts from our host". Get the owner's approval of the wording.
3. Add a "Was this useful? Tell us" mailto link on results, to the existing public corrections contact.
4. After 90 days of Search Console data (around early February 2027), write a short findings note: top queries and pages, impressions, CTR, position. Use it to revisit hostnames (REPORT.md A4 rule 9) and the next slices. Do not call a missing metric zero.

## Part 3 — Teachers page and posters

1. Add a `/teachers/` route on the directory: which app fits which lesson, projector mode, printable packs, a ready message for parents, and printable QR posters.
2. Generate the QR codes at build time with a small local generator: no runtime service, and no new dependency without the owner's approval. Each code encodes a short link.
3. Show the "Teachers" nav item that brief 08 hid.

## Part 4 — Short videos with Booktube

This runs in `I:\Produce_AB\booktube`, under its Islamic guidelines (`context/islamic-guidelines.md`).

1. Create a channel profile skill `moongazer-shorts` with three formats:
   - "Guess the surah in three clues": exact ayat with reference, the answer revealed, ends on `moongazer.tech/surah`.
   - "Which came first?": two Seerah events, honorifics, sourced dates.
   - "Is this really in the Quran?": a common claim, the verified answer, the reference.
2. Rules:
   - No music or bells; typographic visuals; no people or animals.
   - Quran text only from Quran MCP.
   - Recitation only if licensed.
   - Honest hooks; no comment bait.
3. Produce one of each format through the normal project gates, including the `islamic` attestation. Upload stays manual, by the owner.

## Part 5 — Bangla edition (architecture decision required)

1. Update `context/architecture.md` and `context/ui-context.md` first: `/bn/` routes inside each app (Astro i18n routing at the installed version; check its documentation first), a language switch, Bangla typography (a locally hosted Bangla font with its licence), and `hreflang` and canonical rules.
2. **Translation rights.** Check which Bangla Quran translations Quran MCP provides and their licences. Use one only if its licence permits this use. Record the edition and rights notice exactly as for Pickthall.
3. **Start with five apps:** Guess the Surah, Understand Your Salah, Stories of the Prophets, Family Halaqa, Is It in the Quran? (Bangla translation search).
4. **UI strings and editorial text** are translated by a fluent Bangla speaker. Do not publish machine-only translation of religious explanations. Record who translated and reviewed.
5. Add the directory's Bangla landing page and a language switch.

## Verification

Use the checklist in `00-START-HERE.md`. Also run the SEO checks for the new routes (hreflang pairs, canonicals, sitemaps). Browser-check the Bangla pages for font rendering, line breaks and both themes. Booktube videos pass its own gates and the `islamic` attestation.

Record tracker entries in each repository and update `00-START-HERE.md`. Do not push or publish without the owner's request.
