# D: Frontend audit and redesign track

The owner supplied this audit on 20 November 2026 (Asia/Dhaka) and asked for it to be saved and followed. It covers the code as it stood before R7D in places, so section 0 records what the orchestrator re-checked against `main` at 8239f75 and the adaptations the project rules require. Sections 1 and 2 are the audit and the six prompts, kept as supplied.

## 0. Orchestrator notes (20 Nov 2026)

### 0.1 Claims checked against `main` (8239f75)

| Claim | Status |
| --- | --- |
| Cold SaaS light palette and Tailwind accents in `global.css` | Confirmed (`--bg:#f5f8fa`, blue `#2563eb`, violet `#7c3aed`). |
| `global.css` minified, not in `SHARED`, drifted | Confirmed: nine different versions across 17 apps. |
| CSS `mask: url(/motif.svg)` in eight apps | Confirmed in `app.css` of the eight named apps. R7D's `refinement.css` already overrides it with `!important` rules, so the art shows, but the dead mask rules remain. |
| `slice(0,80)` on Arabic in Salah index | Confirmed (`apps/understand-your-salah/src/pages/index.astro`). |
| Inline `style=` on Stories quiz radios and Escape Room `<summary>` | Confirmed. |
| Focus ring `2px solid var(--muted)` | Confirmed. |
| Header `min-height:84px` (75 px on phones) | Confirmed. |
| `LearningGuide` and `HowItWorks` both on app homepages | Confirmed in `Shell.astro`. |
| `shell.ts` drifted | Two versions (14 and 3 apps); add it to `SHARED` with `global.css`. |

### 0.2 Adaptations required by the project rules

- **Art direction stays.** DESIGN.md §0 ("a window into the night") and the generated art system (`_implementation/art/build-art.mjs`) remain. The audit's "Illuminated Parchment (light) and Moongazer Night (dark)" palette fits that direction and is adopted. The generated block between `/* art:start` and `/* art:end */` in `refinement.css` is only changed by re-running `build-art.mjs`.
- **Phone hero.** The project gate is ≤ 220 px (`first-screen-check.mjs`). Prompt 2's ≤ 200 px is a target, not a gate.
- **Disclaimers.** Moving caveats out of the play area is allowed. Removing a required source, attribution, licence line or "not a ruling" statement is not; each one keeps a visible home on the page or in `/sources/`.
- **Standing rules.** Exact canonical Quran text; no images of people or animals; no music or sound effects; no third-party scripts; local fonts only (DM Sans, Newsreader, Amiri, JetBrains Mono).
- **Contrast.** Every new token pair passes `python _implementation/contrast.py` at WCAG AA.

### 0.3 Work packages and owners

The orchestrator (main agent) writes briefs, reviews diffs, runs verification, merges and releases. Implementers: Grok 4.7 through Cursor, and Claude Haiku 5.5.

| WP | Prompt | Scope | Implementer | Depends on |
| --- | --- | --- | --- | --- |
| D1 | 1 + 2 | Shared design system: canonical `global.css` and `shell.ts` in `SHARED`, palette, type, focus, `.arabic` and `.passage-frame`, hero, header, Arabic size control, dedupe help, remove mask rules | Grok 4.7 | — |
| D2 | 3 | Four game apps | Grok 4.7 | D1 |
| D3 | 4 | Eight reading, map and timeline apps | Haiku 5.5 (two workers, disjoint apps) | D1, and P8 T8.4/T8.5 merged for Salah and Stories |
| D4 | 5 | Hifz, Zakat, Akhlaq, Family Halaqa | Haiku 5.5 | D1 |
| D5 | 6 | Homepage alignment and full QA | Grok 4.7 builds; orchestrator runs the QA gate | D1–D4 |

Status lives in `context/progress-tracker.md`.

## 1. Audit (as supplied)

### 1.1 Visual identity mismatch ("Hospital SaaS" CSS vs. "Celestial Manuscript" art)

- **Generic SaaS colours (`apps/*/src/styles/global.css` lines 2–9).** Light mode uses cold clinical greys (`--bg: #f5f8fa`, `--surface-2: #eef4f5`) and default Tailwind accents (`#2563eb` blue, `#7c3aed` violet). None of it matches the warm nocturnal Islamic look already built in `_implementation/art/build-art.mjs` (`#0b1526` night lapis, `#e9c992` gold leaf, `#f4e8cf` parchment).
- **Flat box-in-box monotony (`global.css`).** Every page is a stack of identical `border: 1px solid var(--line); border-radius: 18px` white boxes with almost no visual hierarchy, warmth or architectural rhythm.
- **Inconsistent typography (`Shell.astro` and `pages/index.astro`).** DM Sans, a geometric tech-startup font, drives almost everything. Newsreader (`.editorial`) is on `<h1>` in only some apps:
  - **Has it:** `parables-of-the-quran`, `civilization-timeline`, `family-halaqa`, `why-it-was-revealed`.
  - **Missing it:** `guess-the-surah`, `ayah-threads`, `hifz-planner`, `is-it-in-the-quran`, `understand-your-salah`.
- **Under-designed Arabic reading (`global.css` `.arabic`).** Quranic Arabic gets only `font-size: 1.65rem; line-height: 2.2;`, and `1.5rem` below 580 px, which cramps Uthmani Hafs diacritics. There is no reverent verse container, no warm surface tint or gilded hairline framing, and no control for the Arabic text size.

### 1.2 Concrete art and layout bugs

- **CSS `mask` destroys the custom SVG art (`apps/*/src/styles/app.css`).** `build-art.mjs` generates full-colour 480×300 arch scenes (`public/motif.svg`) with starlit skies, crescent moons, lanterns and gold objects.
  - Eight apps render the scene through this rule: `civilization-timeline`, `parables-of-the-quran`, `places-in-the-quran`, `seerah-detective`, `seerah-timeline`, `stories-of-the-prophets`, `understand-your-salah`, `why-it-was-revealed`.

    ```css
    .motif { background: var(--accent); opacity: .22; -webkit-mask: url(/motif.svg) center/contain no-repeat; mask: url(/motif.svg) center/contain no-repeat; }
    ```

  - Using a full-colour, multi-layer SVG as a CSS mask flattens the illustration into a muddy monochrome silhouette.
- **Ghostly, distorted `<img>` motifs.** The other apps render the motif as a plain image: `guess-the-surah`, `ayah-threads`, `is-it-in-the-quran`, `everyday-akhlaq`, `family-halaqa`, `hifz-planner`, `quran-escape-room`, `zakat-calculator`.
  - The markup is `<img class="motif" src="/motif.svg" width="220" height="120" />` at `opacity: .55`.
  - The aspect ratio is wrong: 220×120, where the art is 480×300 (16:10).
  - The image floats unframed over a light background.
  - It is set to `display: none` below 580 px, so phones lose all the visual character.
- **Arabic string slicing bug (`apps/understand-your-salah/src/pages/index.astro`).** `l.arabic.length>80?l.arabic.slice(0,80)+'…':l.arabic` slices raw UTF-16 code units, so it can cut through an Arabic word or a combining tashkeel mark.
- **Inline style leaks.**
  - `stories-of-the-prophets/src/pages/prophet/[id].astro`: quiz radio options use raw `style="display:block;margin:14px 0"` instead of the styled `.quiz-option` card pattern.
  - `quran-escape-room/src/pages/room/[id].astro`: `<summary style="padding:18px;cursor:pointer">` bypasses reusable CSS.
- **Weak map visuals (`places-in-the-quran/src/components/Map.astro` and `civilization-timeline/src/components/Map.astro`).**
  - Land masses use `fill="var(--tint)"` over `var(--surface-2)`, which has almost no contrast in light mode, or flat `opacity: .45` grey blobs.
  - There is no interactive highlight when filtering by region.

### 1.3 Poor UX and above-the-fold friction

- **Seven stacked chrome bars before the game (`apps/guess-the-surah/src/pages/index.astro`).** A visitor scrolls past all of these before reaching `#game-stage`:
  1. the sticky header (84 px);
  2. `.seo-breadcrumb`;
  3. the hero `.intro`;
  4. `.mode-tabs`;
  5. `.mode-options`;
  6. `#setup-form`;
  7. `.panel-head`;
  8. `.progress-track`.

  `ayah-threads` has the same clutter: `mode-row`, `picker-row` and `panel-head` all sit before the passages.
- **Overcrowded phone header (`Shell.astro` and `shell.ts`).** Below 580 px, one row holds `.brand` (`max-width: 190px`) plus all of these:
  - `Explore/Play`, `Sources` and `All apps`;
  - an injected `Projector` button;
  - `#theme-toggle`.
- **Duplicate "How this works" sections (`Shell.astro`, `HowItWorks.astro` and `LearningGuide.astro`).** Every app homepage renders a `<HowItWorks>` drawer in the sidebar and also injects `<LearningGuide>` ("How this app works") at the bottom of `<main>`.
- **Redundant progress indicators (`apps/hifz-planner/src/pages/index.astro`).** Three are stacked: the `.steps` pills, `#step-label` ("Step 1 of 3") and a `.progress-track` bar.
- **Disclaimer fatigue.** Editorial caveats such as "This is an editorial comparison, not a scholarly ruling" and "Fictional scenario. Consequences are possibilities, not predictions" repeat inside every active card, form and result box. The apps feel cold and defensive instead of inviting.
- **Audio buried at the bottom (`apps/understand-your-salah/src/pages/index.astro`).** The bundled Al-Fatiha recording is a raw browser `<audio controls>` element below 15 lesson cards.
- **Low-contrast keyboard focus (`global.css`).** `outline: 2px solid var(--muted)` is hard to see, especially in light mode.

### 1.4 CSS architecture rot

- **Minified, drifted `global.css`.** `global.css` is not in the `SHARED` list in `_implementation/sync-shared.ts`. As a result:
  - it has drifted across the 17 apps;
  - it is compressed into unreadable single-line blocks;
  - apps like `family-halaqa` and `why-it-was-revealed` carry hundreds of lines of dead Batch 4 CSS they never use (`.world-map`, `.timeline-record`, `.compare-controls`).

## 2. Sequenced prompts (as supplied)

Run them in order. Prompts 1 and 2 remove most of what makes the frontend look generic: the SaaS palette, the masked motif, the bloated header and the drifted CSS. Prompts 3–5 sharpen the individual apps. Prompt 6 unifies the homepage and runs the QA gates.

### Prompt 1: Unify and redesign the design system (palette, typography, Arabic framing)

Goal: replace the generic SaaS look with a warm, cohesive Islamic design system: "Illuminated Parchment" in light mode and "Moongazer Night" in dark mode. Clean up `global.css` and make it a single synced source of truth.

1. **Canonical stylesheet.** Unminify, clean up and standardize `apps/guess-the-surah/src/styles/global.css` as the canonical shared stylesheet.
   - Remove all dead Batch 4 app-specific rules (`.world-map`, `.timeline-record`, `.dossier`, `.compare-controls`, `.worksheet` and similar) from `global.css`. Move them into the `src/styles/app.css` of the apps that actually use them.
   - Add `src/styles/global.css` to `SHARED` in `_implementation/sync-shared.ts` so all 17 apps stay identical.
2. **Colour tokens.** Replace the colour tokens with warm Islamic pigments that pass WCAG AA (≥ 4.5:1) in both themes. Update `_implementation/contrast.py` to match and confirm 0 failures.
   - **Light mode ("Illuminated Parchment"):**

     | Token | Value |
     | --- | --- |
     | `--bg` | `#faf6ee` |
     | `--surface` | `#fffdf8` |
     | `--surface-2` | `#f2ece0` |
     | `--ink` | `#1a2228` |
     | `--muted` | `#5a605d` |
     | `--line` | `#e2d9c8` |
     | `--gold` | `#b5893d` |
     | `--gold-soft` | `#e6d5b3` |

   - **Dark mode ("Moongazer Night"):**

     | Token | Value |
     | --- | --- |
     | `--bg` | `#0b1320` |
     | `--surface` | `#111d30` |
     | `--surface-2` | `#17263d` |
     | `--ink` | `#f5efe4` |
     | `--muted` | `#9fb0c4` |
     | `--line` | `#253752` |
     | `--gold` | `#e9c992` |
     | `--gold-soft` | `#3a3122` |

   - **Family accents.** Refine the four family accents and keep `data-accent="teal|gold|blue|violet"`.

     | Family | Light accent | Light hover | Light tint | Light ink | Dark accent | Dark tint |
     | --- | --- | --- | --- | --- | --- | --- |
     | `teal` (Quran, Iznik emerald) | `#0c6e64` | `#09574f` | `#e4f2ef` | `#095a52` | `#5ce0ce` | `#143336` |
     | `gold` (Seerah and history, antique brass) | `#9a6b16` | `#7d550f` | `#faf0db` | `#7a530c` | `#f0c66a` | `#2e2516` |
     | `blue` (worship and living, Samarkand lapis) | `#1e4d8c` | `#163a6b` | `#e8f0fa` | `#19437a` | `#7bb5ff` | `#152842` |
     | `violet` (community and play, Andalusian plum) | `#6b3fa0` | `#553082` | `#f2eafb` | `#593287` | `#c5a6ff` | `#261b3d` |

   - Update `themeColors` in `Shell.astro` to match the new light and dark values.
3. **Typography and hierarchy.**
   - Set `h1` and major section `h2` in `Newsreader, Georgia, serif` by default in every app, at `font-weight: 450` with refined optical sizing. Keep DM Sans for UI controls, metadata and body copy.
   - Give `.panel` manuscript touches:
     - a crisp 1px `--line` border;
     - a subtle gilded hairline across the top of primary activity panels;
     - a warm elevation shadow;
     - a smooth hover lift on clickable `.activity-card`.
   - Fix keyboard focus rings: `outline: 2px solid var(--accent); outline-offset: 3px;` instead of the low-contrast `var(--muted)`.
4. **Quran and hadith presentation (`.arabic`).**
   - **Size.** On desktop, use `clamp(1.65rem, 2.5vw, 2.1rem)` with `line-height: 2.35` and `word-spacing: 0.08em`. Below 580 px, keep at least `1.55rem` with `line-height: 2.25` so Uthmani diacritics never clip.
   - **Frame.** Put Quran and hadith blocks in a dedicated `.passage-frame` surface: `var(--surface-2)`, subtle gilded top and bottom rules, and an optional centred geometric star ornament from `--mg-divider`.

Sync `global.css` and `Shell.astro` across all 17 apps with `bun _implementation/sync-shared.ts`. Run `python _implementation/contrast.py`, then `bun _implementation/verify.ts check` and `test`.

### Prompt 2: Fix the hero art (`motif.svg`), slim the header and remove duplicate help

Goal: stop flattening the illustrated `motif.svg` scenes with CSS masks and frame them as Islamic arch windows on desktop and phone. Clean up the cramped header, and stop duplicating "How this works" and `LearningGuide`.

1. **Motif rendering.**
   - Remove every `-webkit-mask: url(/motif.svg)` and `mask: url(/motif.svg)` rule from `apps/*/src/styles/app.css`.
   - Use one reusable hero on all 17 app homepages: a `<Hero>` component, or a shared `.hero-banner` layout in `global.css` or `refinement.css`.
     - **Desktop:** two columns. On the left, the title, a concise one-line subtitle and the key pill. On the right, `<img class="hero-art" src="/motif.svg" alt="" width="480" height="300" />` at full `opacity: 1`, inside a rounded 16px dark-lapis vignette with a delicate `1px solid var(--gold-soft)` inner border.
     - **Phone (< 580 px):** never `display: none` the artwork. Show a compact, full-width, cropped and centred arch header at `aspect-ratio: 16 / 8`, or a clean 88px arched emblem thumbnail beside the title. Every app keeps its visual identity, and the hero stays ≤ 200 px tall.
2. **Header and navigation (`Shell.astro`).**
   - **Height:** reduce from 84px to 64px (56px on phones), with subtle `backdrop-filter: blur(10px)` translucency.
   - **Brand:** replace the repetitive `<small>Islamic learning, explored.</small>` with `<small>Moongazer</small>`, and link the brand mark cleanly.
   - **Phone nav:** keep it scannable on a 375 px phone. `All apps`, `Sources`, the optional `Projector` button and `#theme-toggle` must never crowd `.brand` or truncate it awkwardly. For example, hide `Sources` from the top nav below 520 px (it is in the footer), or use compact icon-and-label buttons with `min-height: 40px` tap targets.
   - **Arabic size control:** add an optional `A− / A+` control in `shell.ts`.
     - Show it only on pages that contain `.arabic`.
     - It scales `--arabic-scale` through `0.9`, `1`, `1.2` and `1.35`.
     - Remember the choice locally when storage is available.
3. **Duplicate help and the breadcrumb.**
   - Make `.seo-breadcrumb` tighter and quieter (`margin: 0 0 12px`, smaller muted text) so it does not push the hero down.
   - On app homepages (`meta.path === '/'`), stop duplicating instructions:
     - keep `<HowItWorks>` ultra-brief: two or three sentences, or a compact "Rules and sources" link;
     - let `<LearningGuide>` carry the three-step guide, FAQs and related apps, in a clean editorial band lower on the page, separated by `--mg-divider`.

Sync shared components with `_implementation/sync-shared.ts`. Run `bun _implementation/verify.ts build`, then `node _implementation/first-screen-check.mjs` to confirm the phone hero ≤ 220 px, the first control ≤ 600 px and zero horizontal overflow.

### Prompt 3: Declutter and elevate the four game apps

Goal: fix the stacked-chrome problem on `guess-the-surah`, `ayah-threads`, `word-groups` and `quran-escape-room`, so visitors land straight on the puzzle.

1. **`guess-the-surah`.**
   - **Modes:** turn `.mode-tabs` (Daily, Practice, Juz) into a clean pill-segmented control at the top of the game card.
   - **Settings:** move `Arabic first`, `Keep a streak`, `Collection`, `Length` and `Remember this round` into a compact `<details class="game-settings"><summary>Round settings</summary>…</details>`.
     - Keep it closed by default in Daily mode.
     - In Practice and Juz mode, show a one-line summary chip, for example `Short surahs · 10 questions`.
   - **Clue card:** give the opening ayah clue a warm manuscript treatment (`.passage-frame` with subtle gold left and right accents).
   - **Answers:** make the four answer buttons tactile, with clear states for hover, selected, correct (emerald with a checkmark) and incorrect (muted rose).
   - **Collection:** collapse the 114-surah collection grid by default (`<details class="collection">` without `open`). Show a clean progress bar in the `<summary>`, for example `12 / 114 surahs discovered`.
2. **`ayah-threads`.**
   - Replace the crowded `.picker-row` with a segmented `Daily | Practice` tab bar and an inline `Show Arabic` toggle pill.
   - Show the 30-puzzle dropdown, `Surprise me` and `Remember my place` in a compact Practice toolbar, only when Practice is active.
   - Style the three passage cards as a connected triptych, with a refined geometric thread or knot divider (`.connection-join`) leading into the 2×2 theme buttons.
3. **`word-groups`.**
   - Give the 4×4 grid crisp tactile tiles with clear pressed and selected elevation and smooth, subtle transitions.
   - When a group is solved, show a tier banner in the Islamic palette (emerald, brass, lapis, plum), always with the text tier label so colour is never the only signal.
   - Show mistakes as geometric diamonds (`◆` / `◇`) instead of plain text.
   - Move the board-switching pills into a tidy Practice drawer.
4. **`quran-escape-room`.**
   - **Room cards on `/`:** give them architectural arch headers or gilded lock-progress badges (`◇ ◇ ◇ ◇`), and clear room numbers.
   - **Inside `/room/[id]/`:**
     - turn the four-lock stepper (`.lock-track`) into a clean progress bar with lock icons;
     - move the optional timer and the remember checkboxes into a quiet utility row;
     - style the `#source-shelf` accordions as inviting parchment reference drawers.
5. **Disclaimers in all four apps.** Keep every required citation and methodology link. Move repeated inline editorial caveats out of the active play area into one subtle `.micro` footnote at the bottom of the result card, and keep the full details in `/sources/`.

Run `bun _implementation/verify.ts check`, `test` and `build` for these four apps. Confirm all existing tests still pass, including `daily-mode.test.ts`, `distractors.test.ts` and `activity.test.ts`.

### Prompt 4: Upgrade the reading, map, timeline and audio apps

Goal: fix the real UI and code bugs, then turn the reading apps into calm, gallery-grade study tools.
- **The bugs:** the Salah Arabic slicing and buried audio, the inline styles in Stories of the Prophets, and the washed-out SVG maps.
- **The apps:** `understand-your-salah`, `places-in-the-quran`, `civilization-timeline`, `seerah-timeline`, `parables-of-the-quran`, `stories-of-the-prophets`, `why-it-was-revealed` and `is-it-in-the-quran`.

1. **`understand-your-salah`.**
   - **Arabic truncation:** in `src/pages/index.astro`, replace `l.arabic.slice(0,80)+'…'` with truncation at a word boundary, or with CSS `-webkit-line-clamp: 2` on the full Arabic string. Arabic words and diacritics must never be cut in half.
   - **Audio on `/`:** move the bundled Al-Fatiha player from the bottom to a prominent, styled "Listen to Al-Fatiha" banner directly above the lesson grid.
   - **Audio on `/lesson/[id]/`:** style the audio card cleanly, with custom speed pills (`0.75× | 1× | 1.25×`) and a repeat toggle.
   - **Lesson grouping:** group or badge lessons by prayer posture (`Opening`, `Al-Fatiha`, `Bowing`, `Standing`, `Prostration`, `Sitting`, `Closing`), with a clean posture filter bar.
2. **`stories-of-the-prophets`.**
   - Remove the inline `style="display:block;margin:14px 0"` on the radio inputs in `src/pages/prophet/[id].astro`. Use styled `.quiz-option` choice cards instead, matching `parables-of-the-quran` and `why-it-was-revealed`.
   - Add an A–Z jump bar or category filter pills on `/` so browsing the 25 prophets is effortless.
3. **Maps and timelines (`places-in-the-quran`, `civilization-timeline`, `seerah-timeline`).**
   - **`places-in-the-quran/src/components/Map.astro`:**
     - land and sea: warm sand or parchment land on deep muted-teal or lapis water, in both light and dark mode;
     - coordinate grid lines: style them subtly;
     - pins: smaller, refined teardrop or star markers with clear hover and focus halos;
     - legend: pair the map with interactive legend pills.
   - **`civilization-timeline/src/components/Map.astro`:** give the regional map clear land contrast and subtle compass or graticule styling. Highlight the active region pill when the user filters by region.
   - **`.timeline-record` and `.date-ribbon` (`civilization-timeline`, `seerah-timeline`):** add a gilded vertical timeline spine and cleaner era dividers. Make the event inspector more readable: sticky on desktop, a smooth bottom-sheet drawer on phones.
4. **`parables-of-the-quran`, `why-it-was-revealed` and `is-it-in-the-quran`.**
   - **`parables-of-the-quran`:** add connecting gold arrows or lines between the three steps of the `.reading-path` diagram so it reads as a progression. Style the private reflection notebook as a clean lined journal card.
   - **`why-it-was-revealed`:** give the `.dossier` layout a clear two-column manuscript feel:
     - "The Passage" across the top;
     - "The Transmitted Report" on the left, with a narrator badge and "What it establishes" vs "What it does not settle" callouts;
     - "Commentary & Check" on the right.
   - **`is-it-in-the-quran`:** make the search bar a bold, centred hero input with quick-try example chips just below it. Highlight matched terms in English results with safe DOM text nodes or `<mark>`.

Keep all canonical Quran text, Pickthall translations, provenance checksums and existing tests intact. Run `bun _implementation/verify.ts check`, `test` and `build` for all eight apps.

### Prompt 5: Polish the calculators, the dilemma simulator and Family Halaqa

Goal: remove form clutter and redundant step indicators in `hifz-planner`, `zakat-calculator`, `everyday-akhlaq` and `family-halaqa`, and make them warm, clear and easy to use on a phone.

1. **`hifz-planner`.**
   - Replace the three redundant progress indicators (`.steps` pills, `#step-label` and `.progress-track`) with one clean three-step horizontal stepper with clear active and completed states.
   - Make the Juz and surah checkbox picker (`#choose-content`) easier to scan, with a compact filter or search input, or with 30 Juz pill toggles.
   - In Step 3, style the weekly checklist and the revision-curve SVG with clear axis labels, a subtle area fill under the curve and clean summary stat cards.
2. **`zakat-calculator`.**
   - Group the numbered steps (`.calc-step`) more clearly, with subtle section dividers and currency-prefix styling inside the numeric inputs.
   - Restyle the scholarly-difference options (`.choice` / `.option`) as cleaner radio cards, so the attribution (`Stated by: …`) and the `Learn more` link read calmly instead of densely.
   - Make the `.result-card` feel authoritative and print well, with a prominent total callout and a clean zebra-striped `.breakdown` table.
3. **`everyday-akhlaq`.**
   - Style `.track-tabs` as a clean segmented filter bar, and add subtle `Done ✓` badges to completed scenario cards.
   - In `ScenarioPage.astro` and `scenario.ts`:
     - present `.scene-text` as a refined editorial quote or story card;
     - make the `A / B / C` decision cards tactile and inviting;
     - mark the final reflection trail (`.choice-trail`) with clean step markers.
4. **`family-halaqa`.**
   - Give the pack cards a warm, family-friendly hierarchy:
     - clear age-band badges (`Ages 5–7`, `Ages 8–11`, `Ages 12+`);
     - an estimated-time chip (`10–15 min`);
     - a clean three-step indicator (`1 Read · 2 Discuss · 3 Try`).
   - On `/pack/[id]/`, style the three worksheet cards so they work on a shared living-room screen (including Projector mode) and in print.

Run `bun _implementation/verify.ts check`, `test` and `build` for these four apps and confirm all tests pass.

### Prompt 6: Align the homepage directory (`moongazer.tech`) and run full visual and QA verification

Goal: bring the apex directory (`homepage/`) into visual harmony with the redesigned apps, and verify every build, test, text join and first-screen metric.

1. **Homepage hero and directory cards.** The files are `homepage/index.html`, `styles.css`, `reading.css`, `render.mjs` and `404.html`.
   - **Hero:**
     - the 16-fold shamsa (`art/shamsa-ring.svg` and `art/shamsa-centre.svg`) and the starfield (`art/stars.svg`) over deep celestial lapis (`#0b1320`);
     - crisp warm cream and gold type (Newsreader and DM Sans);
     - an "Ayah of the Night" calligraphic block set in `amiri-ayat.woff2`.
   - **The 17 app cards in `#library`:** present them as one gallery. Each card shows:
     - the app's full-colour arch scene (`art/<slug>.svg`) at crisp 16:10 proportions;
     - its emblem (`logos/<slug>.svg`);
     - a category badge and a one-line description;
     - a clear "Daily" badge on the four daily apps: `guess-the-surah`, `ayah-threads`, `word-groups` and `seerah-timeline`.
   - **Filters and the daily strip:** make the category filter bar, the search input and the "Today's Daily Puzzles" strip easy to scan at 390 px and at 1440 px, with full light and dark parity and WCAG AA contrast.
2. **Full verification pass.**
   - `bun _implementation/sync-shared.ts --check`: all shared files, including `global.css`, `Shell.astro` and `refinement.css`, are identical across the 17 apps.
   - `bun _implementation/verify.ts check`, then `test`, then `build`.
   - `node homepage/build.mjs`, `bun test homepage/tests` and `bun test _implementation/seo.test.ts`.
   - `python _implementation/audit-text-joins.py --summary` and `--bdi`: zero text-join or Arabic BDI regressions.
   - `python _implementation/contrast.py`, and `node _implementation/first-screen-check.mjs` against the local preview server.
   - Fix any viewport overflow, contrast failure or phone hero taller than 220 px.
