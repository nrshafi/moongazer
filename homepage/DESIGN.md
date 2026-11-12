# Moongazer directory design (moongazer.tech)

Extends the root `DESIGN.md`. The directory is the front door: on a phone the first app card is on screen one, and every app is reachable without JavaScript.

## Identity

Night-sky identity: deep indigo ground with a crescent and sparse stars (existing `moon.svg` / `styles.css` palette, unchanged). No people or animals. On phones the crescent shrinks to a small mark beside the H1 so it never pushes the library down.

## Page order (phone first)

1. **Header:** logo + "Moongazer"; nav: Apps · Today · Families · About. No "Start with a little curiosity ↗".
2. **Compact hero:** H1 "Free Islamic learning games and tools"; one line of copy; buttons "Play today's puzzle" (Guess the Surah until P6 adds the daily) and "Browse all apps" (`#library`). No "There is always more to discover."
3. **Tonight on Moongazer** (`#today`): a static default card (P6 fills it).
4. **Quick picker chips:** 2 minutes · 10 minutes · With my kids · For my class · Understand my prayer · Plan my hifz. Each chip is a real link (`?pick=…#library`) that works without JS; with JS it filters in place and updates the URL.
5. **Library** (`#library`): all 16 apps, featured order. Card anatomy: 16:9 local WebP screenshot (lazy, alt describes the activity) → format badge · time · audience → app name (H3) → descriptor → whole card is the link to the app's host.
6. **Subject guides:** four wide compact cards with member logos.
7. **Seasonal slot** (`#season`): empty container (P7 fills).
8. **Trust row:** "Exact Quran text with named translation · Sources on every page · Corrections log →". No reviewer claim.
9. **Footer:** app hosts, About, Corrections log, Report an error, Privacy.

## Data

`deployment/targets.json` gains per app: `time` (`2` | `10` | `20` minutes), `audience` (`me` | `kids` | `class`), `format` (the existing `kind`). Chips map to these fields; "Understand my prayer" and "Plan my hifz" map to app slugs directly.

## Screens

- Phone 390 × 844: first library card top ≤ 844 px (aim ≤ 700).
- Desktop 1440 × 1000: the library heading is above the fold.
- JS off: chips are links, the library lists all apps.
