# Moongazer directory design (moongazer.tech)

Extends the root `DESIGN.md`. The directory is the front door: on a phone the first app card is on screen one, and every app is reachable without JavaScript.

## Identity

Night-sky identity: deep indigo ground with a crescent and sparse stars (existing `moon.svg` / `styles.css` palette, unchanged). No people or animals. On phones the crescent shrinks to a small mark beside the H1 so it never pushes the library down.

## Page order (phone first)

1. **Header:** logo + "Moongazer"; nav: Apps · Today · Families · About. No "Start with a little curiosity ↗".
2. **Compact hero:** H1 "Free Islamic learning games and tools"; one line of copy; buttons "Play today's puzzle" (Guess the Surah until P6 adds the daily) and "Browse all apps" (`#library`). No "There is always more to discover."
3. **Tonight on Moongazer** (`#today`, P6 T6.6), with two parts:
   - **Puzzle tiles:** two link tiles, "Today's surah · Guess the Surah #N" and "Today's board · Word Groups #N". `#N` is the shared day number (`daily.js`, the same as the apps' `daily.ts`). Before the epoch there is no number, and a line names the first day.
   - **Ayah of the night** (its own section): a gold-ruled card with the exact Arabic in an Amiri subset (`fonts/amiri-ayat.woff2`, 41 KB, loaded only when shown), Pickthall's translation, and a link that opens the reference in Is It in the Quran? (`#q=<ref>`). The same local day count picks it from `ayat-of-the-night.json` (66 verified ayat, C18). It is chosen with `AYAH_SEED`, and is not clamped before launch.
   - **Desktop (≥ 1051 px):** one row, with the tiles, the ayah and the picker in columns of .95fr, 1.25fr and 1fr.
   - **Tablet (701–1050 px):** the tiles and the ayah side by side, with the picker below at full width.
   - **Phone (≤ 700 px):** the tiles side by side, with `#N` on the label row. The ayah is a `<details>` summary row ("Ayah of the night · Quran 20:114 ⌄") that opens on tap, and JS opens it on wider screens.
   - **No JS:** the tiles are plain links without a number, and the build-date ayah shows.
4. **Quick picker chips:** 2 minutes · 10 minutes · With my kids · For my class · Understand my prayer · Plan my hifz. Each chip is a real link (`?pick=…#library`) that works without JS; with JS it filters in place and updates the URL.
5. **Library** (`#library`): all 16 apps, featured order. Card anatomy: 16:9 local WebP screenshot (lazy, alt describes the activity) → format badge · time · audience → app name (H3) → descriptor → whole card is the link to the app's host.
6. **Subject guides:** four wide compact cards with member logos.
7. **Seasonal slot** (`#season`): empty container (P7 fills).
8. **Trust row:** "Exact Quran text with named translation · Sources on every page · Corrections log →". No reviewer claim.
9. **Footer:** app hosts, About, Corrections log, Report an error, Privacy.

## Data

`deployment/targets.json` gains per app: `time` (`2` | `10` | `20` minutes), `audience` (`me` | `kids` | `class`), `format` (the existing `kind`). Chips map to these fields; "Understand my prayer" and "Plan my hifz" map to app slugs directly.

## Screens

- Phone 390 × 844: first library card top ≤ 844 px (aim ≤ 700). Measured after T6.6: 743 px, both before and after the epoch.
- Desktop 1440 × 1000: the library heading is above the fold.
- JS off: chips are links, the library lists all apps.
