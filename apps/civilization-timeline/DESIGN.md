# Civilization Timeline: design

## 1. Family and tokens
Family: **Seerah & history (gold)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
Mismatch: `config.json` `accent` is `blue` today. Root §2 says gold. T5.5 changes it to `gold`.

## 2. Archetype
**Dossier** (root `DESIGN.md` §6): dated records, mono metadata chips, era ribbons.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: a thin circle with an equator line and two meridian arcs (a globe drawn as geometry). It fits a tool that orders events across regions. No people, no animals.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Civilization Timeline   Read [o]  |
| Civilization Timeline                    |  H1
| Twenty-four events across nine regions.  |  descriptor (10 words)
| [24 records]                             |
+------------------------------------------+  hero <= 140 px
| [All] [Region A] [Region B] [Region C]>  |  region chips (scroll row)
| [Topic v] [Search........] [ ] Saved only|
| > How this works                         |
| +--------------------------------------+ |
| | 661-750 CE  [Region] [Topic]         | |  mono metadata chips
| | Event title                          | |
| | [Read the event] [Save]              | |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | next event card                      | |
+------------------------------------------+
Map and "At the same time..." move below the list (see section 5).
```
Measured first-control top (search field, `#filter`): 282 px at 390 × 844 and 282 px at 375 × 812, light and dark (T5.14, Chrome headless over `bun run preview`). Desktop 1440 × 1000: 356 px. The first event card top is 757 px at 390 × 844 (585 px at 1440 × 1000): the map and compare panel now follow the list, which brought the first control from far below 600 px to 282 px, but the filter panel (search, topic, region, two year fields, saved only, reset) still pushes the first card past 600 px. Only the first-control target is met.

## 5. Component states specific to this app
- **Region chip:** selected = tint fill, accent border and `aria-pressed="true"`. The map legend shows the same region as text.
- **Date ribbon:** the bar sits on the era scale. The text range ("661–750 CE") carries the meaning; the bar is decoration.
- **Precision:** "c." prefix or a range label where the source gives a broad period. No colour alone.
- **Compare:** two selects, then a status line. Same event picked twice = text "Pick two different events".
- **Saved:** button shows `aria-pressed="true"` and the word "Saved".
- **Empty:** "Nothing matches" with the reset action.

Map placement: on phones the map sits after the list, not before it, so the first event card stays inside 600 px. On desktop it may stay in the main column.

## 6. "How this works" drawer
Moves out of the page above the activity (`index.astro`):
- Intro "Follow twenty-four selected events across nine regions…". The first sentence becomes the descriptor in §4. The rest moves to the drawer.
- Map note "Land outlines give regional orientation. No historical state borders or exact event locations are plotted." Moves to the drawer.
- Compare note "Overlapping bands do not prove contact or causation." Moves to the drawer. Beside the comparison result keep one line: "Overlap shows dates, not contact."

No caveat text sits above the first event card.

## 7. End of session
- **Result (comparison):** "[Event A] runs [range]. [Event B] runs [range]. They overlap for [N] years. Overlap shows dates, not contact."
- **What you learned:**
  - Broad periods and exact years are different precision; the app keeps both.
  - Overlapping periods do not show contact or cause. That needs separate evidence.
- **Share:** "I compared two periods on Civilization Timeline: [compare link]". No conclusion in the text.
- **Next app:** Seerah Timeline (first related app).
- **New puzzle tomorrow:** not applicable (not a daily game).

## 8. Print and projector
None per T5.12. The T5.12 list names "timeline pages" but only Seerah Timeline is listed by name. This app is not listed. Owner to confirm. Base print styles only.

## 9. Depth Gate target (`00-INDEX.md` §4)
40 records; Rashidun and 10th–13th century gaps filled; West Africa, South and Southeast Asia included (Bagerhat); every record plotted (D13). Today: 24.

## 10. Verify_Me layout items
- #41 Card-level compare replaced by "At the same time…" (C12). Already in place; content work.
- #42 Broaden institutional sources (C12). Content work.
No P5 layout item is assigned to this app in the triage appendix.
