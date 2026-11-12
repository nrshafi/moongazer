# Design: Zakat Calculator

## Archetype

Mindful Sanctuary (layout only, from `plan/DESIGN_RECOMMENDATIONS.md` archetype 4): quiet focus, one task at a time, clean numbered steps. The calculator uses a step sequence, labelled choice groups and a printable summary.

## Colour

Subject family: worship and daily life (blue). The accent comes from the shared tokens in `src/styles/global.css` under `data-accent=blue`:

- Light: `--accent` `#316caa`, `--accent-hover` `#26568a`, `--tint` `#eaf1fb`, `--accent-ink` `#285c97`.
- Dark: `--accent` `#99c5f6`, `--accent-hover` `#c0ddff`, `--tint` `#21354c`, `--accent-ink` `#b3d5ff`.

These are the values in use now. The family table in `plan/implementation/P5-shell-design-directory.md` lists different blue values (`#2563eb`) for the worship family; that table has not been applied to any app yet, so this app follows the shared tokens already in place. Changing the family tokens is a shared change for all apps.

## Type and mark

DM Sans for interface text, Newsreader for headings and Amiri for Arabic, all self-hosted with OFL licences. The logo is a glyph-only balance scale on the blue rounded tile (`public/favicon.svg`): no figures and no animals.

## Rules

- No money amounts, nisab numbers or ruling-like wording in visual elements. Labels describe choices, not verdicts.
- Every choice where schools differ is shown with equal visual weight and none is pre-selected.
- Print styles keep the choices made and their sources on the printed summary.

## First screen (P7 T7.6, measured with `_implementation/browser-check.mjs`)

| Viewport | Theme | Hero height | First input top |
| --- | --- | --- | --- |
| 390 x 844 | light | 105 px | 299 px |
| 390 x 844 | dark | 105 px | 299 px |
| 375 x 812 | light | 105 px | 299 px |
| 375 x 812 | dark | 105 px | 299 px |
| 1440 x 1000 | light and dark | 179 px | 394 px |

The first input is the currency label, then cash. The motif (`public/motif.svg`, balance scale, 0.6 KB, `currentColor`) shows from 580 px up and is hidden below. Print hides the form and shows the result, breakdown, choices made and limit sentence.
