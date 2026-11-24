# UI context: portfolio defaults

## Theme and signature

Modern, quiet reading surfaces with light and dark modes. The first visit follows the operating system; the header toggle stores an app-local preference. Accent family: teal.

Use the app-specific signature described in each local UI context. Blue and violet apps override the accent family in their own CSS; copied helpers/styles are maintained per app, not through cross-app runtime imports. Blue light/dark accents are #316caa/#99c5f6; violet accents are #7255a0/#c7b1ef.

## Visual refresh, 30 October 2026

Each app now has a distinct locally hosted SVG mark, visible in its header and browser tab and repeated on the Moongazer directory card. An app-local `src/styles/refinement.css` adds a Newsreader display intro, a restrained geometric watermark, stronger panel hierarchy and adjusted card, control and footer styling. The twenty app copies remain independent; their existing teal, blue and violet accent families and activity-specific layouts remain in place. The homepage features two app marks and uses all twenty on the library cards.

## Color tokens

The actual token definitions live in the app's `src/styles/global.css`. Use these names rather than introducing a different token system.

| CSS token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#f5f8fa` | `#101a24` |
| `--surface` | `#ffffff` | `#16232e` |
| `--surface-2` | `#eef4f5` | `#1c2e3a` |
| `--ink` | `#172a35` | `#edf4f7` |
| `--muted` | `#5c707b` | `#a5b7c1` |
| `--line` | `#dce6e9` | `#30434e` |
| `--accent` | `#087f75` | `#78d4c2` |
| `--accent-hover` | `#06665f` | `#9ce7d7` |
| `--tint` | `#e5f3ef` | `#203d3c` |
| `--accent-ink` | `#06665e` | `#99dfcf` |
| `--danger` | `#ab353d` | `#ffb0b4` |
| `--danger-bg` | `#fcecee` | `#44272f` |
| `--success` | `#147653` | `#92dfb8` |

## Typography

| Role | Local font | Existing implementation |
| --- | --- | --- |
| Interface and body | DM Sans | Root `font-family`; variable font, system sans fallback |
| Intro, card and panel headings | Newsreader | `.editorial` and the app-local visual refinement; Georgia fallback |
| Prophet honorific (`ﷺ`) | Amiri | `U+FDFA` unicode-range mapping via `Honorific.astro` / `withHonorifics()`; Arabic passages are no longer rendered in UI as of 2026-11-25 |

Fonts are in `public/fonts/` with their SIL Open Font License files. There are no `--font-sans`/`--font-mono` tokens or external font service in the current implementation.

## Radius and components

| Context | Existing rule |
| --- | --- |
| Panels | Base `--radius: 18px`; visual refinement uses 16px, or 13px on phones |
| Primary buttons | 9px radius, 46px minimum height |
| Fields | 9px radius, 44px minimum height |
| Icon buttons | 9px radius, 38px square |
| Dialogs | 20px radius with backdrop |

There is no installed component or icon library. Reuse the shell's inline SVG mark/theme icons and existing `.panel`, `.panel-body`, `.panel-head`, `.button`, `.field`, `.filters`, `.notice`, `.actions`, `.source-quote`, `.empty` and `.micro` patterns (`.arabic` passage rendering is retired as of 2026-11-25).

## Layout and interaction

- Desktop content is centered, up to 1200px, with a sticky header. `.workspace` uses a flexible main column plus a 290px sidebar.
- Card grids use three columns, two below 860px and one below 580px. Narrow reading layouts stack controls and sidebars. Long app titles must wrap within the header.
- Keep footer source/privacy links and the app-scoped clear-data dialog available. Empty states explain how to recover. Inline validation/status text must be readable in both themes.
- Preserve keyboard use and semantic labels. Provide buttons for ordering and a text legend for maps; do not rely on dragging, hover or color alone.
- Motion is brief and respects `prefers-reduced-motion`. Print styles simplify surfaces and hide navigation. Native audio, if present, does not autoplay.

## E2E evidence

All twenty home pages passed both themes at 390 × 844 and 1440 × 1000. All 325 HTML pages rendered at phone width without document overflow. Enabled home control text passed a focused 4.5:1 contrast check in mobile dark and desktop light modes, with header controls inside the viewport. Screenshots and actual browser evidence are in `_implementation/qa/e2e/`; this is not a full accessibility certification.

## Moongazer directory homepage

SEO additions preserve the visual design. App pages gain a small, wrapping breadcrumb trail and a footer link to the directory. Breadcrumb markup and schema must agree. Social cards follow the existing midnight-blue, gold and local typography identity. Search-oriented metadata must not add filler sections, false credentials or hidden keyword text to the interface.

The directory uses an ink-blue night-sky hero, an illustrated crescent with orbital paths, icy white reading surfaces, and restrained gold details. Locally hosted Newsreader display type pairs with DM Sans body text. Its primary action leads to the complete app library; native app links work without JavaScript. Search and subject filters progressively enhance the twenty server-rendered entries. Use neutral keyboard focus, readable contrast, reduced-motion handling and responsive layouts. This visual direction applies to the directory; app-local themes remain independent.

## Focus appearance

Pointer selection keeps the control’s ordinary border and shows no outer focus ring. Tab navigation shows a neutral 2px outline using `--muted`, with a 2px offset. Accent-colored focus rings are removed across controls. Selection, validation and game-result styling remain distinct from focus.

The directory passed desktop and 390px phone checks. Narrow featured cards hide their illustrations to preserve text flow. Search, combined filters, no-results recovery and twenty native app links were verified.

## SEO release, 30 October 2026

Visible breadcrumbs connect Moongazer, the app and the current detail page. A footer link returns to the app directory. Breadcrumbs wrap on phones and match structured data. WOFF2 derivatives retain the local DM Sans, Newsreader and Amiri glyph coverage and licenses. Social previews use local 1200 by 630 PNG cards. The SEO browser check covered all twenty app homepages at 390px and an Arabic detail page in both themes.

## Google Search Console setup, 30 October 2026

The verified Google Search Console property and Sitemaps report are external administrative screens. All twenty-one sitemap rows show Success. The public directory and app interfaces require no change for this setup. Evidence screenshots and report data live in deployment/evidence/search-console/.

## Search content enhancement scope

Retain the current typography, colors, logos and activity layouts. Make home headings identify the tool, add readable static learning guidance below the activity, and use descriptive related-app links. Four subject guides and the About page share the directory design. New guidance must wrap on phones and remain readable in both app themes; avoid hidden keyword text or ranking claims in visitor copy.

## Naming (P2, 11 November 2026)

- **Two layers.** Every app has a short **name** and a plain present-tense **descriptor** that carries the search phrase. The authoritative table is in `plan/implementation/P2-names-copy-honorifics.md`. Hosts, slugs, ports and Pages project names never change with a rename.
- **One name everywhere.** Header brand, H1, directory card, `<title>`, `og:title`, JSON-LD name and share text all use the same name.
- **Title pattern.** App home: `Name — descriptor | Moongazer`. Detail pages: `Item title | Name`.
- **No jargon in names.** No "Islamic", "The", "Explorer", "Studio", "Lab" or format words in names; the descriptor explains the format.
- **Nav verb.** The shell's primary nav item uses the app's verb from `config.json` `nav` (Play, Read, Search, Plan or Learn) instead of "Explore".
- **One word per thing.** Inside an app, one noun per kind of item (case, scenario, parable, event, pack, reading); everyday words instead of internal labels (REPORT §A4 "Words to retire").
- **Honorifics.** ﷺ after the Prophet Muhammad in editorial text, rendered with `src/components/Honorific.astro` in Astro and the `SAW` string from `src/lib/utils.ts` in client scripts (span `.honorific`, Amiri glyph, accessible label "peace and blessings be upon him"). "(peace be upon him)" after other prophets at first mention per page. Never inside canonical quotations or quoted report text.

## Shell after the merges (D2c, 12 November 2026)

The shared shell shows no "moved" banner and no alternate canonical; every page canonicalises to itself. The merged sections keep their own pages (Ayah Threads `/themes/`, Seerah Timeline `/challenge/`, Everyday Akhlaq `/business/`, Is It in the Quran? `/claims/`) with no banner, import button or link to a retired app.

## P5 design rules (from 12 November 2026)

The design source of truth is the root `DESIGN.md` (families, tokens with computed contrast, typography, archetypes, shared components) plus one `apps/<slug>/DESIGN.md` per app and `homepage/DESIGN.md` for the directory. Summary of the binding rules:
- **Activity within 600 px:** at 390 × 844 and 375 × 812 the first control or activity card starts ≤ 600 px from the top, in both themes; each app records its measured value.
- **Colour = subject family** (`config.accent`: `teal`, `gold`, `blue`, `violet`); small text uses `--accent-ink`, text on accent fills uses `--on-accent`. **Layout = archetype** (Playboard, Scriptoria, Dossier, Sanctuary, Hearth).
- **Fonts:** DM Sans, Newsreader, Amiri (reserved for the `ﷺ` honorific as of 2026-11-25); JetBrains Mono only for metadata chips in Playboard and Dossier apps. All local.
- **Patterns:** compact hero (H1 = app name, ≤ 12-word descriptor); "How this works" `<details>` drawer holds instructions and caveats; end-of-session pattern (result → what you learned → share → next app → report an error); learning guide as an accordion after the activity.
- **Motif:** one decorative `public/motif.svg` per app (≤ 8 KB, `aria-hidden`), geometry/objects/plants/sky only; the shared star watermark is removed.
- **Islamic UI rules:** no images of people or animals; no music, bells or sound effects.
- **Print and projector:** print shows the activity only; projector mode (×1.35 text, simpler chrome) is opt-in and saved only when the visitor opts into saving.
- **No apex short links** (D2c): each app's own host is linked directly.

### P5 shared shell implementation (12 November 2026)

Shared-lane files now in every app (byte-identical; listed in `_implementation/sync-shared.ts`):
- `src/layouts/Shell.astro`: `theme-color` per family (light = family accent, dark = family dark bg); header with logo, short name, tagline (hidden below 720 px), nav verb, Sources (hidden below 520 px), "All apps" link to `https://moongazer.tech/#library`, theme toggle.
- `src/styles/refinement.css`: compact hero (no star watermark, dash-eyebrow or min-height; phone H1 2.1 rem, desktop 3.2 rem; descriptor clamped to two lines on phones; measured phone hero 120-136 px), `.how-it-works` drawer, `.session-end` block, Arabic 1.7 rem (1.6 rem phones) with line-height 2.1, print rules (activity only, black on white), projector rules (`:root[data-projector=on]`), `.is-correct` pulse (240 ms; none under reduced motion).
- `src/components/HowItWorks.astro`: native `<details class="how-it-works"><summary>How this works</summary>`; place it first inside `.sidebar` (top of the sidebar on desktop, directly after the activity on phones).
- `src/lib/session-end.ts` (+ `tests/session-end.test.ts`): `renderSessionEnd(container, options)`, `whatsappUrl`, `buildShareText`, `learnedLines`. The caller supplies the share text and must never put the answer in it.
- `src/components/LearningGuide.astro`: the guide renders after the activity with one server-rendered `<details>` per question (text unchanged).
- `src/lib/utils.ts`: `pulseCorrect(el)` (no-op under `prefers-reduced-motion: reduce`).
- `src/lib/shell.ts` (two variants: with and without the print-time details opener): a Projector button is added to the header only when `<main>` or `<body>` has `data-projector`; it lasts the session and is saved under the namespaced key `projector` only while the app's `remember` opt-in is on.
- Per-app `global.css` (several variants): family tokens for `teal`, `gold`, `blue`, `violet` in light and dark; buttons on accent fills use `--on-accent`. JetBrains Mono (`.mono-chip`, local WOFF2) is added only to the Playboard and Dossier apps.

## English-only UI and 13-app update (25 November 2026)

- **13 active apps:** Four core-Arabic apps (`understand-your-salah`, `word-groups`, `guess-the-surah`, and `is-it-in-the-quran`) are deleted outright, leaving 13 active apps (`ayah-threads`, `civilization-timeline`, `everyday-akhlaq`, `family-halaqa`, `hifz-planner`, `parables-of-the-quran`, `places-in-the-quran`, `quran-escape-room`, `seerah-detective`, `seerah-timeline`, `stories-of-the-prophets`, `why-it-was-revealed`, `zakat-calculator`).
- **English-only UI:** All 13 remaining app UIs and `homepage/` remove Arabic script passage rendering (no `.arabic`, `.ayah-ar`, `.night-ar`, `lang="ar" dir="rtl"` Quranic blocks, or `Amiri Ayat` passage font in the UI) and display attributed Pickthall English translations instead.
- **Canonical data & honorifics preserved:** Canonical Arabic text remains in JSON data (`src/data/content.json`, `homepage/ayat-of-the-night.json`, `_implementation/research/quran-full.json`) for static verification. `ﷺ` honorifics (`U+FDFA`) remain preserved in editorial UI copy via `Honorific.astro` / `SAW` / `withHonorifics()` (Amiri `unicode-range: U+FDFA`).
