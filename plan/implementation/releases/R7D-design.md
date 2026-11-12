# R7D: "A window into the night" redesign

Branch `design-night`, released 2026-11-13 (Asia/Dhaka) by the agent under D2b, after the owner said the apps looked too basic.

## What changed

- **Art system.** `_implementation/art/build-art.mjs` generates every piece of art from code:
  - 17 emblems: night tiles with family star frames and gold glyphs;
  - 17 arch-window scenes, each with its own drawn object;
  - the directory's 16-fold shamsa, starfield, lattice tiles, border band, divider and corner ornaments;
  - the shared CSS token block.
  The Seerah family uses the Rub el Hizb. No hexagrams, people or animals.
- **Apps.** All 17 share a new layer in `refinement.css`:
  - an illuminated night hero with the scene;
  - a manuscript double rule and gilded corners on the activity panel;
  - card rules and a turning star;
  - ornamental headings and a night footer.
- **Directory.** A starfield hero with a turning shamsa, illuminated start panels and the ayah of the night on a night panel. App cards now show each app's scene and emblem; the screenshots are removed. There is also a night header and footer, and a new brand mark.
- **Social cards.** All 18 were re-rendered from the art (`_implementation/art/social-cards.mjs`).
- **Docs.** `DESIGN.md` §0 records the direction. The phone hero limit is now 220 px; the first control stays within 600 px.

## Verification (2026-11-13)

All checks below were run on the same tree.

- All 17 apps built.
- `first-screen-check.mjs` passed 102/102. On phones the first controls are at 292–516 px and the heroes at 136–200 px.
- `counter-check.mjs` passed.
- `verify-static.py` passed on 349 pages, and `audit-text-joins` found 0 joins.
- `seo.test.ts` passed 9 and `homepage/tests` passed 55.
- `verify-seo.py` passed on 18 sites, 360 pages.
- `sync-shared --check` reported identical files.
- The directory and five apps were reviewed by screenshot at 1440 px and 390 px, in light and dark. The directory's first card is at 813 px on a 390 × 844 phone.
