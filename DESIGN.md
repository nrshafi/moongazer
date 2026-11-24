# Moongazer design system

The root design contract for all 13 active apps and the directory (updated 2026-11-25 from the earlier 17-app / 20-app portfolio). Each app adds a one-page `apps/<slug>/DESIGN.md` that may narrow these rules but never adds a colour or font. Decision record: D20 in `plan/implementation/00-INDEX.md`; background in `plan/DESIGN_RECOMMENDATIONS.md` (archetypes only — its per-app palettes are not used).

**How to use it:** read this file, then the app's `DESIGN.md`, before any UI change. If a change needs something not covered here, update this file first (shared lane), then build.

## 0. Art direction: "a window into the night" (2026-11-13)

The collection is one illuminated night library. Every surface draws on three sources: Islamic geometry, manuscript illumination (gold rules, border bands and medallions) and the night sky that gives Moongazer its name. This section overrides older rules in this file wherever they conflict. Be bold within it: these rules describe a direction, not a ceiling.

- **Generated, not hand-placed.** All art comes from `_implementation/art/build-art.mjs`, which is pure geometry in code, deterministic and dependency-free. Change the generator and rerun it. Never edit its outputs by hand:
  - `apps/<slug>/public/favicon.svg` (the emblem);
  - `apps/<slug>/public/motif.svg` (the hero scene);
  - `homepage/logos/`, `homepage/art/` and `homepage/favicon.svg`;
  - the `art:start…art:end` token block in `refinement.css`.
  Social cards come from `_implementation/art/social-cards.mjs`, rendered in headless Chrome.
- **Emblems.** Each emblem is a night tile with a gold star-polygon frame in the family's fold, a family-hue glow and the app's gold glyph:
  - Quran: {8/3};
  - Seerah and history: {8/2}, the Rub el Hizb;
  - Worship and daily life: {12/5};
  - Family: {10/3}.
  Never use a six-pointed hexagram.
- **Scenes.** Each app's hero scene is a pointed-arch window, 480 × 300. Inside it are a starlit sky with a faint {8/3} lattice, a crescent, a family-hue horizon glow and the app's own object drawn in gold, for example a mushaf on a rahle, the lamp in its niche or an astrolabe. Use objects, plants, architecture and sky only (§1).
- **App hero (`.intro`).** A dark illuminated panel in both themes:
  - a night gradient tinted by the family hue;
  - the family lattice texture;
  - an inner hairline rule;
  - a gold border band under the text;
  - the scene on the right.
  Text on the panel is #fbf4e4 for headings and #c6d0dc for body. On phones the hero is at most 220 px, and the scene shrinks into the corner.
- **Surfaces.** The activity panel carries a manuscript double rule with gilded corner ornaments. Cards get a gold-and-accent top rule and a star that turns on hover. Section headings sit under an ornamental divider. The footer is a full-width night band. The body has a 5 % lattice wash.
- **Directory.** It has:
  - a night header flowing into a starfield hero;
  - a 16-fold shamsa that turns slowly (300 s per turn, stopped under reduced motion) around a still crescent;
  - illuminated start panels, with the ayah of the night on a night panel;
  - app cards that show the app's scene and emblem. Screenshots are no longer used.
- **Gold tokens.** `--mg-gold #e9c992`, `--mg-gold-2 #f7e6c0`, `--mg-gold-3 #b8894a`, `--mg-hue` per family (teal #4fd1bf, gold #f2c25b, blue #7fb2ff, violet #b9a2ff), and `--mg-pattern`, `--mg-band`, `--mg-divider`, `--mg-star` and `--mg-corner-*`. On light surfaces use `--mg-gold-3` for ornament only, never for text.

## 1. Islamic visual rules

- **Aniconism.** No people or animals in any image, icon, motif or illustration. Use geometry, objects, plants, architecture, sky and maps.
- **No sound.** No music, bells or sound effects. Recitation audio exists only where an app already links a named reciter, and it is always opt-in.
- **Quran text.** Exact canonical Arabic and Pickthall translations remain preserved in local JSON data (`src/data/content.json`, `homepage/ayat-of-the-night.json`, `_implementation/research/quran-full.json`) and verified against the snapshot, never altered or re-typed. Under the 2026-11-25 English-only UI decision, app and directory UIs do not render Arabic script passages; they display the attributed Pickthall English translation in DM Sans / Newsreader.
- **Honorifics.** Preserved: ﷺ after the Prophet's name through `Honorific.astro` / `withHonorifics()`; the glyph (`U+FDFA`) is mapped to Amiri by `unicode-range: U+FDFA`.
- **Claims.** Never imply scholarly review. Limits are stated plainly, once, where they matter.

## 2. Families and tokens

Colour follows the subject family. Every app sets `config.accent` to one of `teal`, `gold`, `blue`, `violet`; `global.css` maps it through `data-accent` on `<html>`. (Updated 2026-11-25 for the 13 active apps; `guess-the-surah`, `word-groups`, `is-it-in-the-quran`, and `understand-your-salah` were deleted.)

| Family (`accent`) | Apps |
| --- | --- |
| Quran (`teal`, default) | ayah-threads, stories-of-the-prophets, parables-of-the-quran, places-in-the-quran, why-it-was-revealed |
| Seerah & history (`gold`) | seerah-timeline, seerah-detective, civilization-timeline |
| Worship & daily life (`blue`) | hifz-planner, everyday-akhlaq, zakat-calculator |
| Family & group (`violet`) | family-halaqa, quran-escape-room |

Token sets. `--accent` is for fills, borders, progress and large text; small text uses `--accent-ink`; text on an accent fill uses `--on-accent`.

| Family | Theme | `--bg` | `--surface` | `--ink` | `--muted` | `--accent` | `--accent-hover` | `--tint` | `--accent-ink` | `--on-accent` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| teal | light | #f5f8fa | #ffffff | #172a35 | #5c707b | #087f75 | #06665f | #e5f3ef | #07685f | #ffffff |
| teal | dark | #101a24 | #16232e | #edf4f7 | #a5b7c1 | #78d4c2 | #9ce7d7 | #203d3c | #78d4c2 | #0b1a1f |
| gold | light | #faf7f2 | #ffffff | #2b2622 | #6b645c | #b8860b | #cc9a22 | #fef8eb | #7a5a00 | #1f1a14 |
| gold | dark | #181512 | #221e1a | #f7f4ed | #a8a096 | #e5b94e | #f0cc75 | #332b1f | #e5b94e | #1f1a14 |
| blue | light | #f5f7fc | #ffffff | #0e1b2e | #53637a | #2563eb | #1d4ed8 | #eff4fe | #1d4ed8 | #ffffff |
| blue | dark | #0c121e | #141c2c | #eef2f9 | #95a3b8 | #60a5fa | #93c5fd | #1c283f | #7cb5fb | #0c121e |
| violet | light | #f8f6fb | #ffffff | #261938 | #6e5c85 | #7c3aed | #6d28d9 | #f3effc | #6d28d9 | #ffffff |
| violet | dark | #140e1f | #1e152d | #f5f2fa | #b09fc7 | #a78bfa | #c4b5fd | #2c1e42 | #b7a1fb | #140e1f |

Deviations from `DESIGN_RECOMMENDATIONS.md` §4, made to pass contrast: gold light `--muted` #736c64 → #6b645c; gold light `--accent-hover` darkens no further (#996f08 → #cc9a22, because gold buttons carry dark text); `--accent-ink` and `--on-accent` are new. `--surface-2`, `--line`, `--danger*`, `--success` keep their current per-theme values, tinted toward the family `--bg` where needed.

**Computed contrast** (WCAG 2.x, `python _implementation/contrast.py`; every pair ≥ 4.5:1):

| Family | Theme | ink/bg | ink/surface | muted/bg | muted/surface | accent-ink/bg | accent-ink/surface | accent-ink/tint | ink/tint | on-accent/accent | on-accent/hover |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| teal | light | 13.88 | 14.80 | 4.85 | 5.17 | 6.24 | 6.66 | 5.83 | 12.97 | 4.88 | 6.83 |
| teal | dark | 15.80 | 14.37 | 8.49 | 7.72 | 10.04 | 9.13 | 6.69 | 10.53 | 10.15 | 12.54 |
| gold | light | 14.01 | 14.97 | 5.45 | 5.83 | 5.97 | 6.38 | 6.03 | 14.14 | 5.31 | 6.75 |
| gold | dark | 16.55 | 15.07 | 7.04 | 6.41 | 9.86 | 8.97 | 7.56 | 12.69 | 9.36 | 11.18 |
| blue | light | 16.13 | 17.29 | 5.71 | 6.12 | 6.25 | 6.70 | 6.08 | 15.67 | 5.17 | 6.70 |
| blue | dark | 16.69 | 15.18 | 7.32 | 6.66 | 8.80 | 8.00 | 6.92 | 13.13 | 7.37 | 10.39 |
| violet | light | 15.30 | 16.42 | 5.54 | 5.94 | 6.62 | 7.10 | 6.28 | 14.52 | 5.70 | 7.10 |
| violet | dark | 17.05 | 15.80 | 7.76 | 7.19 | 8.54 | 7.92 | 6.93 | 13.83 | 6.94 | 10.23 |

`theme-color` meta: light = family `--accent`, dark = family dark `--bg`.

## 3. Typography

- **Fonts (local WOFF2, OFL):** DM Sans (interface), Newsreader (editorial headings and reading text), Amiri (mapped via `unicode-range: U+FDFA` for the ﷺ honorific; Arabic script passages are not rendered in the UI as of 2026-11-25). JetBrains Mono only for small metadata chips (dates, refs, counts) in Playboard and Dossier apps. No other fonts, no remote font requests.
- **Scale:** H1 ≤ 2.1 rem on phones, ≤ 3.2 rem on desktop; H2 1.4–1.7 rem; body 1 rem / 1.6–1.75; small text ≥ 0.72 rem and never below 12 px.
- **English-only UI (2026-11-25):** Quranic quotations in app and directory UIs render Pickthall translations in DM Sans / Newsreader without Arabic script blocks. Canonical Arabic remains in local JSON data only.

## 4. Spacing, radius, motion

- Spacing steps 4 / 8 / 12 / 16 / 22 / 28 / 42 px. Page gutter 32 px desktop, 16–18 px phone.
- Radius: panels 16 px (13 px on phones); buttons and fields 9–11 px; pills 99 px; dialogs 20 px.
- Touch targets ≥ 44 × 44 px. Primary button min-height 45 px.
- Motion ≤ 250 ms, ease-out; `prefers-reduced-motion: reduce` removes all non-essential motion. Correct answers get one short pulse (`.is-correct`), no confetti.

## 5. Layout rules (all apps)

- **Activity within 600 px.** At 390 × 844 and 375 × 812, the top of the first interactive control or activity card is ≤ 600 px from the page top, in both themes. Each app records its measured number in its `DESIGN.md`.
- **Hero.** H1 = the app name; one descriptor line (≤ 12 words); optional count chip; the illuminated panel of §0. Phone hero ≤ 220 px (checked by `_implementation/first-screen-check.mjs`).
- **Header.** Logo + short name at every width; tagline hidden below 720 px; nav verbs from `config.nav`; an "All apps" link to `https://moongazer.tech/#library`; theme toggle.
- **"How this works" drawer.** Instructions, caveats and evidence notes live in one native `<details class="how-it-works">`: top of the sidebar on desktop, directly after the activity on phones. Nothing explanatory sits above the first control.
- **End of session.** Result → "What you learned" (1–3 lines with references) → share (copy + WhatsApp, plain text, never the answer, no tracking parameters) → one recommended next app → "New puzzle tomorrow" slot (daily games) → compact "Report an error" link.
- **About this app.** The learning guide renders after the activity as server-rendered `<details>` per question.
- **Scene.** Each app's `public/motif.svg` is its generated arch scene (§0, ≤ 18 KB, `aria-hidden="true"`), shown in the hero at every width.
- **Print and projector.** Print hides chrome and shows the activity in black on white. Projector mode (Family Halaqa, Quran Escape Room, Seerah Timeline, Stories of the Prophets) scales text ×1.35, simplifies chrome and raises contrast; saved only if the visitor opts in (`projector` key).

## 6. Archetypes (layout, components, motif — never colour)

| Archetype | Apps | Feel |
| --- | --- | --- |
| Playboard | Ayah Threads | Crisp, tactile game board; instant feedback; numbered runs |
| Scriptoria | Stories of the Prophets, Parables of the Quran, Why It Was Revealed | Calm reading column (≤ 680 px), Newsreader, generous leading |
| Dossier | Places in the Quran, Seerah Timeline, Seerah Detective, Civilization Timeline | Evidence cards, index tabs, mono metadata chips, era ribbons |
| Sanctuary | Hifz Planner, Zakat Calculator | Quiet step wizard, live summary, printable result |
| Hearth | Quran Escape Room, Everyday Akhlaq, Family Halaqa | Large friendly cards, readable from across a room, tap-to-reveal answers |

Screen 1 on a phone (390 × 844), per archetype:

```
Playboard                      Scriptoria                     Dossier
+----------------------------+ +----------------------------+ +----------------------------+
| [logo] Name     Nav  [◐]  | | [logo] Name     Nav  [◐]  | | [logo] Name     Nav  [◐]  |
| Name (H1)                  | | Name (H1)                  | | Name (H1)                  |
| descriptor · [Daily #N]    | | descriptor                 | | descriptor · [12 cases]    |
+----------------------------+ +----------------------------+ +----------------------------+
| round settings (one row)   | | [Choose a story ▾]         | | [search / era ribbon]      |
| ┌──────────────────────┐   | | ┌──────────────────────┐   | | ┌──────────────────────┐   |
| │ clue / board tiles   │   | | │ passage (Pickthall)  │   | | │ evidence card 1      │   |
| │ [A] [B] [C] [D]      │   | | │ reflection prompt    │   | | │ [Corroborated] chip  │   |
| └──────────────────────┘   | | └──────────────────────┘   | | └──────────────────────┘   |
| ▸ How this works           | | ▸ How this works           | | ▸ How this works           |

Sanctuary                      Hearth
+----------------------------+ +----------------------------+
| [logo] Name     Nav  [◐]  | | [logo] Name     Nav  [◐]  |
| Name (H1)                  | | Name (H1)                  |
| descriptor                 | | descriptor · [Projector]   |
+----------------------------+ +----------------------------+
| (1)──(2)──(3) steps        | | ┌──────────────────────┐   |
| ┌──────────────────────┐   | | │ big scenario card    │   |
| │ step 1 inputs        │   | | │ [choice] [choice]    │   |
| │ live summary line    │   | | │ ▸ Facilitator answer │   |
| └──────────────────────┘   | | └──────────────────────┘   |
| ▸ How this works           | | ▸ How this works           |
```

Component states every archetype defines: default, hover, `:focus-visible` (2 px outline in `--muted`, offset 2 px), selected (`--tint` fill + `--accent` border), correct (`--success` border + pulse), incorrect (`--danger` border, no shake), disabled (opacity .55, `cursor:not-allowed`).

## 7. Shared components

Header and footer (`Shell.astro`), "How this works" drawer (`HowItWorks.astro`), end of session (`session-end.ts`), feedback (`Feedback.astro`, `#site-feedback`), honorific (`Honorific.astro`), learning guide accordion (`LearningGuide.astro`), counter (`counter.ts`). Shared files are byte-identical across apps and checked by `bun _implementation/sync-shared.ts --check`; only the shared lane edits them.

## 8. Accessibility checklist

- Every text/background pair in §2 ≥ 4.5:1 (3:1 only for text ≥ 24 px or bold ≥ 18.66 px).
- One H1 per page; landmarks; skip link; visible focus; no keyboard traps; `aria-live` for results.
- Works without JavaScript where the activity allows (lists, readers); otherwise a `<noscript>` explanation.
- No information by colour alone (correct/incorrect also carry text).
- Reduced motion respected; no autoplay.
- Phone: no horizontal scroll at 375 px; inputs ≥ 16 px to avoid zoom.
