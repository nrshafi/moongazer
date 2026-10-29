# UI context: Stories of the Prophets Explorer

## Theme and signature

Modern, quiet reading surfaces with light and dark modes. The first visit follows the operating system; the header toggle stores an app-local preference. Accent family: blue.

An alphabetical reading shelf leads to a two-reading profile with a compact comprehension panel.

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
| `--accent` | `#316caa` | `#99c5f6` |
| `--accent-hover` | `#26568a` | `#c0ddff` |
| `--tint` | `#eaf1fb` | `#21354c` |
| `--accent-ink` | `#285c97` | `#b3d5ff` |
| `--danger` | `#ab353d` | `#ffb0b4` |
| `--danger-bg` | `#fcecee` | `#44272f` |
| `--success` | `#147653` | `#92dfb8` |

## Typography

| Role | Local font | Existing implementation |
| --- | --- | --- |
| Interface and body | DM Sans | Root `font-family`; variable font, system sans fallback |
| Restrained editorial headings | Newsreader | `.editorial`, Georgia fallback; not every heading uses it |
| Quran and other Arabic | Amiri | `.arabic`, Arabic serif fallback, RTL and `lang="ar"` |

Fonts are in `public/fonts/` with their SIL Open Font License files. There are no `--font-sans`/`--font-mono` tokens or external font service in the current implementation.

## Radius and components

| Context | Existing rule |
| --- | --- |
| Panels | `--radius: 18px`; narrower layouts use 15px panels |
| Primary buttons | 11px radius, 45px minimum height |
| Fields | 10px radius, 44px minimum height |
| Icon buttons | 12px radius, 38px square |
| Dialogs | 20px radius with backdrop |

There is no installed component or icon library. Reuse the shell's inline SVG mark/theme icons and existing `.panel`, `.panel-body`, `.panel-head`, `.button`, `.field`, `.filters`, `.notice`, `.actions`, `.arabic`, `.source-quote`, `.empty` and `.micro` patterns.

## Layout and interaction

- Desktop content is centered, up to 1160px, with a sticky header. `.workspace` uses a flexible main column plus a 280px sidebar.
- Card grids use three columns, two below 860px and one below 580px. Narrow reading layouts stack controls and sidebars. Long app titles must wrap within the header.
- Keep footer source/privacy links and the app-scoped clear-data dialog available. Empty states explain how to recover. Inline validation/status text must be readable in both themes.
- Preserve keyboard use and semantic labels. Provide buttons for ordering and a text legend for maps; do not rely on dragging, hover or color alone.
- Motion is brief and respects `prefers-reduced-motion`. Print styles simplify surfaces and hide navigation. Native audio, if present, does not autoplay.

## Focus appearance

Pointer selection keeps the control’s ordinary border and shows no outer focus ring. Tab navigation shows a neutral 2px outline using `--muted`, with a 2px offset. Accent-colored focus rings are removed across controls. Selection, validation and game-result styling remain distinct from focus.
