# UI context: Hifz Planner

## Theme and signature

Modern, quiet reading surfaces with light and dark modes. The first visit follows the operating system; the header toggle stores an app-local preference. Accent family: teal.

Editable assumptions lead to a revision-workload curve, estimated totals and a paginated exact schedule.

## Visual refresh

The app has its own locally hosted SVG logo in the header and browser tab. The Moongazer directory repeats that mark on its app card. The app-local `src/styles/refinement.css` adds a Newsreader display intro, a quiet geometric watermark, clearer panel hierarchy, and more deliberate card, field and button styling in both themes. The activity-specific signature above remains the main visual focus. Motion respects reduced-motion preferences.

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

## Wizard (P7 T7.2)

The home page is a three-step wizard, one step visible at a time. Each step is a `<fieldset>` with a `<legend>`, a "Step N of 3" line and a progress track, with Back and Next buttons. Results and status messages go to an `aria-live` region. Every step is keyboard operable, and focus moves to the step's heading when the step changes.

- Step 1, "What have you memorized?": the pages-already-memorized number and new-page goal, plus a "Choose by juz or by surah" drawer with two native checkbox fieldsets (juz 1 to 30, surahs 1 to 114 by transliterated name). Each checkbox label gives its page range. The grids use two columns at 390 px, without nested scrolling.
- Step 2, "Your week": days per week, minutes per session, start date, the "Ramadan pace" suggestion button and the "Adjust assumptions" `<details>` drawer with plain labels.
- Step 3, "Your plan": this-week checklist, calendar view, check-offs, "I missed a day", label setting, print button, `.ics` export.

Wizard surfaces reuse the existing classes (`panel`, `panel-head`, `panel-body`, `button`, `button secondary`, `button ghost`, `field`, `actions`, `notice`, `pill`, `micro`, `top-gap`). New layout rules (step indicator, checklist rows, drawer spacing, print sheet) live in the app-local `src/styles/planner.css`, use only the tokens above, and add no colours or fonts. At 390 px the fields stack one per row, buttons take full width where they are the primary action, and no element may cause horizontal page scroll (wide tables sit inside an `overflow:auto` wrapper). Suggestion copy is labelled "a suggestion".

Print: the weekly sheet (`#print-sheet`) is hidden on screen and shown only in print, with the header, footer, wizard controls and the full schedule hidden. It needs no storage.

## Typography

| Role | Local font | Existing implementation |
| --- | --- | --- |
| Interface and body | DM Sans | Root `font-family`; variable font, system sans fallback |
| Intro, card and panel headings | Newsreader | `.editorial` and the app-local visual refinement; Georgia fallback |
| Quran and other Arabic | Amiri | `.arabic`, Arabic serif fallback, RTL and `lang="ar"` |

Fonts are in `public/fonts/` with their SIL Open Font License files. There are no `--font-sans`/`--font-mono` tokens or external font service in the current implementation.

## Radius and components

| Context | Existing rule |
| --- | --- |
| Panels | Base `--radius: 18px`; visual refinement uses 16px, or 13px on phones |
| Primary buttons | 9px radius, 46px minimum height |
| Fields | 9px radius, 44px minimum height |
| Icon buttons | 9px radius, 38px square |
| Dialogs | 20px radius with backdrop |

There is no installed component or icon library. Reuse the shell's inline SVG mark/theme icons and existing `.panel`, `.panel-body`, `.panel-head`, `.button`, `.field`, `.filters`, `.notice`, `.actions`, `.arabic`, `.source-quote`, `.empty` and `.micro` patterns.

## Layout and interaction

- Desktop content is centered, up to 1200px, with a sticky header. `.workspace` uses a flexible main column plus a 290px sidebar.
- Card grids use three columns, two below 860px and one below 580px. Narrow reading layouts stack controls and sidebars. Long app titles must wrap within the header.
- Keep footer source/privacy links and the app-scoped clear-data dialog available. Empty states explain how to recover. Inline validation/status text must be readable in both themes.
- Preserve keyboard use and semantic labels. Provide buttons for ordering and a text legend for maps; do not rely on dragging, hover or color alone.
- Motion is brief and respects `prefers-reduced-motion`. Print styles simplify surfaces and hide navigation. Native audio, if present, does not autoplay.

## Focus appearance

Pointer selection keeps the control’s ordinary border and shows no outer focus ring. Tab navigation shows a neutral 2px outline using `--muted`, with a 2px offset. Accent-colored focus rings are removed across controls. Selection, validation and game-result styling remain distinct from focus.

## SEO release, 30 October 2026

Visible breadcrumbs connect Moongazer, the app and the current detail page. A footer link returns to the app directory. Breadcrumbs wrap on phones and match structured data. WOFF2 derivatives retain the local DM Sans, Newsreader and Amiri glyph coverage and licenses. Social previews use local 1200 by 630 PNG cards. The SEO browser check covered all twenty app homepages at 390px and an Arabic detail page in both themes.

## Search content enhancement scope

Retain the current typography, colors, logos and activity layouts. Make home headings identify the tool, add readable static learning guidance below the activity, and use descriptive related-app links. Four subject guides and the About page share the directory design. New guidance must wrap on phones and remain readable in both app themes; avoid hidden keyword text or ranking claims in visitor copy.
