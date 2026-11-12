# UI context: Zakat Calculator

## Theme and signature

Quiet, step-by-step surfaces in light and dark modes, following the Mindful Sanctuary layout in `DESIGN.md`. The first visit follows the operating system; the header toggle stores an app-local preference. Accent family: blue (worship and daily life).

The current home page shows the introduction and one notice. The planned calculator will show choices, calculation steps and a printable summary, with the method visible at every point where schools differ.

## Color tokens

The token definitions live in `src/styles/global.css` (shared values for `data-accent=blue`). Use these names and do not introduce a second token system.

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

| Role | Local font | Implementation |
| --- | --- | --- |
| Interface and body | DM Sans | Root `font-family`, variable WOFF2 with system sans fallback |
| Headings and the intro | Newsreader | `.editorial` and the shared visual refinement; Georgia fallback |
| Arabic (none yet) | Amiri | `.arabic` with RTL and `lang="ar"`, when Arabic text is added |

Fonts are in `public/fonts/` with their OFL licence files. There is no external font service.

## Components

Reuse the shell and shared patterns: `.panel`, `.panel-body`, `.panel-head`, `.button` (and `.secondary`), `.field`, `.check` for choice inputs, `.notice`, `.actions`, `.source-list`, `.micro`, `.empty`. Primary buttons are 9px radius and 46px minimum height; fields are 44px minimum height.

## Choices where schools differ (D23)

- Each difference is a group of labelled options, with equal visual weight. No option is pre-selected, and the calculate action asks the visitor to answer any unanswered group.
- Each group has a short source note and a "Learn more" link to the method page.
- The choice made is shown again beside the result and in the printable summary.
- Never use colour alone to show which choice is selected; use the native radio or checkbox state and a text label.

## Layout and interaction

- Content is centred up to 1160px with a sticky header. Card grids collapse to one column on phones.
- The layout must work at 390px width, with no horizontal page scroll and a 16px side gutter.
- Keep the footer source and privacy links and the storage dialog available.
- Motion is brief and respects `prefers-reduced-motion`. Print styles hide navigation and keep the summary readable.

## Focus appearance

Pointer selection shows no outer focus ring. Tab navigation shows a neutral 2px outline using `--muted`. Accent-coloured focus rings are not used.

## Known gaps

- `social-card.png` is not yet present, so social previews have no image. The shared Shell still points at it.
- The shared privacy page's text was written for the other apps and mentions activity answers and scores; it is shared copy and has not been changed for this app.

## Calculator UI (P7 T7.6)

- Sanctuary layout: compact hero (balance-scale motif `public/motif.svg`, hidden below 580 px), one panel with three numbered fieldsets, results below the form, "How this works" drawer in the sidebar.
- Differences are radio fieldsets with equal weight, per-option "Stated by" attributions and a "Learn more" link to `/method/#<entry id>`. An unanswered one is marked with the text "(choose one)" and a red border.
- Print: form, drawer, header and footer are hidden; the result, breakdown, choices made and limit sentence print. Print-only line gives the date and currency label.
