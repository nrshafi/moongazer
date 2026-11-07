# Brief 08 — Moongazer: activity-first shell and the directory front door

**Repository:** `I:\Development\moongazer`
**Depends on:** 07. **Authorized:** ask the owner first.
**Goal:** on a phone, every app shows something to tap on its first screen; each app looks like itself; the directory becomes a front door with short links.
**Background:** `../REPORT.md`, A6 (directory), A7 (shell), A4 (families and colours), A11 item 1 (short links).

## First: update context

- `context/ui-context.md`:
  - The activity-within-600px rule.
  - The "How this works" drawer pattern.
  - The end-of-session pattern.
  - Subject families and colours, including new gold tokens with light and dark values that pass 4.5:1 for text.
  - Per-app hero art.
  - "No images of people or animals; no music or bells" as a portfolio rule.
- `context/architecture.md`: short links in `homepage/_redirects`.

## Part 1 — the shared app shell (all twenty copies)

The shell files are byte-identical copies in every app: `src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/components/LearningGuide.astro`. Change one, then copy it to all twenty, and verify the copies match.

1. **Hero.**
   - H1 is the app name (one or two lines), plus a descriptor of no more than twelve words and an optional count chip.
   - On phones the hero is at most about 140 px.
   - Today `refinement.css` sets `.intro{min-height:300px;padding:66px 0 51px}` and an H1 up to 5.35rem. Reduce both on desktop as well.
2. **Activity in the first screen.** At 390 × 844 the first interactive control or content card starts within 600 px from the top. Check every app home.
3. **One "How this works" drawer.**
   - Move the notices, evidence bands and caveat paragraphs that sit above activities into one native `<details>` element. Affected: Halal Business, Family, Escape Room, Concept Atlas, Prophets, Misinformation, Revelation, and the Seerah Detective notice.
   - On desktop it sits in the sidebar top; on phones, just below the activity.
   - Keep one plain limit sentence beside results where it matters. For example: "A practice case, not a ruling on your own deal."
   - Wording must stay truthful. Do not delete limits; move them.
4. **End-of-session pattern** for every activity that ends: result → "What you learned" (one to three lines with references) → share (copy text; WhatsApp link `https://wa.me/?text=` with encoded plain text, no tracking) → one recommended next app → "New puzzle tomorrow" (brief 09 adds the daily part).
5. **About this app.** The LearningGuide becomes an accordion after the activity. Keep the text visible to crawlers: render it as HTML in `<details>`, not injected later.
6. **Header.**
   - Short name and logo at every width.
   - Tagline on desktop only.
   - Add an "All apps" link to `https://moongazer.tech/#library`.
7. **Arabic.** Ayat in Amiri at about 1.6–1.8 rem with generous line height, in both themes.
8. **Small delight.** A brief reduced-motion-aware animation on a correct answer. Optional non-musical sound only if the visitor turns sound on; no music or bells.
9. **Print and projector.** A "Print" button on family, teacher and timeline pages. A "Projector" toggle that enlarges text; it is not saved, or saved in namespaced storage only if the visitor opts in.

## Part 2 — families, colours and hero art

1. Assign each app its subject family and colour, per REPORT.md A4: Quran teal, Seerah and history gold, worship and daily life blue, family and group violet. Set `config.accent` accordingly, and add gold tokens to each gold app's `global.css`.
2. Replace the shared eight-point star watermark with an app-specific line illustration drawn from its logo motif. Local SVG, no people or animals, decorative (`aria-hidden`), hidden or reduced on narrow phones.
3. Regenerate social cards if the colours appear on them.

## Part 3 — the directory (`homepage/`)

Edit the authoritative sources (`index.html`, `styles.css`, `app.js`, `render.mjs`, `collections.json`, `deployment/targets.json`), then run `node homepage/build.mjs`.

1. **Header nav:** Apps, Today, Families, Teachers, About. Hide "Teachers" until brief 14 builds that page. Remove "Start with a little curiosity ↗".
2. **Compact hero.**
   - H1 "Free Islamic learning games and tools", one line of copy.
   - Buttons "Play today's puzzle" (to Guess the Surah; brief 09 makes it daily) and "Browse all apps".
   - On phones, the crescent becomes a background or a small mark, so the first app card is visible on screen one.
   - Remove the "There is always more to discover." caption.
3. **Tonight on Moongazer.** Add a placeholder container now; brief 09 fills it with the three daily tiles.
4. **Quick picker chips:** "2 minutes", "10 minutes", "With my kids", "For my class", "Understand my prayer", "Plan my hifz". Each filters the library.
   - Add `time`, `audience` and `format` fields to `deployment/targets.json` so the chips and card badges are data-driven.
   - Keep native links working without JavaScript.
5. **Library cards.**
   - Add a real local screenshot (16:9, WebP, lazy-loaded, with alt text describing the activity) per app; capture it from the production build.
   - Add the format badge, time and audience.
   - Use featured order instead of rank order.
6. **Seasonal slot.** An empty container that brief 11 fills.
7. **Trust row:** "Exact Quran text with named translation · Sources on every page · Corrections log". The reviewer line waits for brief 14 and is added only when true.
8. **Short links** in `homepage/_redirects`:
   - `/surah`, `/threads`, `/groups`, `/escape`, `/check`, `/prophets`, `/parables`, `/places`, `/revealed`, `/seerah`, `/detective`, `/civilization`, `/salah`, `/hifz`, `/akhlaq`, `/family`
   - Each gives a 302 to the app's root URL. Use 302 until stable, then 301.
   - Verify that the Pages `_redirects` syntax supports absolute destination URLs, using Cloudflare's documentation, and record the documentation URL.
   - Add the short links to the footer.

## Verification

Use the checklist in `00-START-HERE.md`, with a full browser pass:
- All twenty app homes at 390 × 844 and 1440 × 1000, in both themes.
- Measure the first control's top offset; it must be 600 px or less on the phone size.
- Run focus/contrast spot checks.
- The directory with JavaScript on and off.
- Each short link locally (Pages preview or `wrangler pages dev` if available).
- SEO checks: H1, titles and structured data still agree.

Record tracker entries and update `00-START-HERE.md`. Do not push.
