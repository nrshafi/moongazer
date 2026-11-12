# Hifz Planner: design

## 1. Family and tokens
Family: **Worship & daily life (blue)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
Mismatch: `config.json` `accent` is `teal` today. Root §2 says blue. T5.5 changes it to `blue`.

## 2. Archetype
**Sanctuary** (root `DESIGN.md` §6): quiet step wizard, live summary line, printable result in the archetype. See section 8.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: a ruled page with a grid of small squares, a week calendar. It fits a plan made of days. An object, so it is allowed.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Hifz Planner             Plan [o] |
| Hifz Planner                             |  H1
| Estimate new pages and revision time for |
| your study days.                         |  descriptor (10 words)
| [604-page layout]                        |
+------------------------------------------+  hero <= 140 px
| (1) Your pages  (2) Study days  (3) Plan |  step indicator, text labels
| ------------------------------------------|
| Pages already memorized   [   0 ]        |  first control
| New pages to add          [  20 ]        |
| Minutes per session       [  45 ]        |
| Live summary: 20 new pages in 14 days    |
| [ ] Remember these assumptions (30 days) |
| [ Next: study days ]                     |
| > How this works                         |
+------------------------------------------+
```
Measured first-control top: step 1 input `#memorized`, top at 416 px at 390 × 844 and 416 px at 375 × 812, light and dark (665 px before P5; 472 px at 1440 × 1000). Measured with `_implementation/browser-check.mjs` against `bun run preview`.

## 5. Component states specific to this app
- **Step indicator:** current step is bold with the text "Step 1 of 3". Done steps show "Done". Not colour alone.
- **Study day chip:** on = tint fill, accent border, check mark, `aria-pressed`. Off = plain border.
- **Live summary:** one line, updates as fields change. Says "Enter your numbers" until all are valid.
- **Invalid field:** `--danger` border plus text in an `aria-live` alert. Text input is at least 16 px.
- **Result, fits:** text "Plan fits: [N] days". Review time is reserved first.
- **Result, does not fit:** text "Not enough time: [reason]". Capacity failure is kept separate from a long but viable plan.
- **Result, beyond horizon:** text "Beyond the 3,650-session horizon". Not shown as a failure.

## 6. "How this works" drawer
Moves out of the aside on `index.astro`:
- Notice "What the model assumes". Its first sentence "Your memorized pages ÷ review cycle = pages to review each session…" moves to the drawer.
- Its second sentence "Revision is spread evenly. The model does not assess retention, difficulty, recitation accuracy, or teacher guidance." moves to the drawer. This is the main limit and it must stay.
- Link "Read the methodology ↗" moves to the drawer.

The intro sentence "Balance new pages with the pages you already know…" becomes the descriptor in §4. The rest of it moves to the drawer.

## 7. End of session
- **Result:** "[N] new pages in [D] days. Review: [R] minutes per session. Study days: [list]." Then the result state text from §5.
- **What you learned:**
  - The model reserves review time first. New study uses the time that remains.
  - Speeds are your assumptions. The planner does not measure retention or recitation.
- **Share (copy + WhatsApp):** "I estimated a weekly Hifz plan with Hifz Planner: [link]". No personal numbers in the text.
- **Next app:** Guess the Surah (first related app).
- **New puzzle tomorrow:** not applicable.

## 8. Print and projector
None per T5.12. Root §6 lists a "printable result" for Sanctuary, but T5.12 does not name this app. Owner to confirm. The CSV and calendar exports (P1 T1.11, P7 T7.3) are the export route for now.

## 9. Depth Gate target (`00-INDEX.md` §4)
Wizard uses all 114 chapters and the 604-page layout. Complete canonical set. Today: 114 chapters and 604 pages.

## 10. Verify_Me layout items
- #21 Separate new, recent and old revision (P7 T7.2–T7.3).
- #22 `.ics` export, fixed and extended (P1 T1.11, P7 T7.3).
- #20 90-day revision chart: deferred stretch (P10).
None of these is a P5 layout item.
