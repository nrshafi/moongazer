# Places in the Quran: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Quran** (`teal`). Tokens: root `DESIGN.md` §2.
- `config.json` already says `teal`. No change needed.

## 2. Archetype

**Dossier** (root §6): evidence cards, index-style filters, mono metadata chips.

## 3. Motif

Source: `public/favicon.svg` (map pin over a four-point star). Draw a thin pin on a faint grid, with one small star in the top corner (`public/motif.svg`, T5.11).
Why: a place is a point on a map. The star keeps the app's sky-and-map feel, and reminds the reader that a pin is context, not an exact site.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Places in the Quran  Read [◐] |
| Places in the Quran (H1)             |
| 15 places the Quran names            |
+--------------------------------------+
| [Find a place______]  [Evidence ▾]   |
| [ ] Saved only      [Copy my list]   |
| +----------------------------------+ |
| |  map (SVG, pins only where       | |
| |  sources support one)            | |
| |  numbered text legend below      | |
| +----------------------------------+ |
| +----------------------------------+ |
| | Place name          [No pin]     | |
| | Quran ref · [Open ↗] [Save]      | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Decision: the search field comes before the map, so the first control sits high. The map moves below the filters.

Measured first-control top (the search field, 2026-11-12): 244 px at 390 × 844 and 244 px at 375 × 812, identical in light and dark; 323 px at 1440 × 1000. Target ≤ 600 px met.

## 5. Component states (this app)

- **Pin / no pin chip.** Text on the card: "Pinned" or "No pin". Never colour alone.
- **Map legend item.** Default, hover, selected (ties to the highlighted place card).
- **Save button.** `aria-pressed` true/false; text changes to "Saved".
- **Copy my list.** Hidden until something is saved (same rule as Why It Was Revealed, Verify_Me #36); done in P5.
- **Map.** Pins with no evidence never render; the card still shows its reason.

## 6. "How this works" drawer

Currently above the map in `index.astro`:
- "Geography with its sources attached" (eyebrow). Drop it.
- "Explore fifteen places the Quran names. Follow the map where the evidence supports a pin…" (intro). Move to the drawer; the descriptor line replaces it.

Not on the page today: the overview's limit that ten entries stay unpinned and that Iram is not a claimed excavated city. Not added in P5: it still needs the owner's confirmation. The drawer states the pin limit that the page already carries.

## 7. End of session

- **Result:** no score. "You opened N places in this visit" (counted in memory only).
- **What you learned (1–3 lines):** "A place without a pin has no defensible modern location in its sources." Reference the entry.
- **Share (plain text, no tracking):** "Places in the Quran: a map of the places the Quran names, and where certainty ends. https://places-in-the-quran.moongazer.tech/"
- **Next app:** Stories of the Prophets (first related app in `learning.json`).

## 8. Print and projector

Print: the place page keeps its existing "Print this place" button (`data-print`) and print styles. The earlier "Neither" note was a draft and is superseded; no print feature was removed. No Projector on this app.

## 9. Depth Gate target

From `00-INDEX.md` §4: "Every place named in the Quran per a documented list compiled from Quran MCP search (expected ≈22–26), incl. Badr, Hunayn, Yathrib; combined Bakkah/Makkah." Method and list go in research.

## 10. Verify_Me layout items

- #33 regional labels for unpinned entries: C8 (content).
- #34 legend text joined: P1 T1.17 (not P5).
- #57 one limit per page, rest in the drawer: P5 T5.7.
