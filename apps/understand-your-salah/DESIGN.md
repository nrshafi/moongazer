# Understand Your Salah: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Worship & daily life** (`blue`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `teal`. Set `blue`, and replace the teal set in `ui-context.md` with the root blue set.

## 2. Archetype

**Sanctuary** (root §6): quiet step wizard, live summary, printable result.
Decision: the step rail (Read → Reveal → Check) applies on the lesson page. Screen 1 is the lesson list, with the audio card above it.

## 3. Motif

Source: `public/favicon.svg` (a niche arch over two columns and a floor line). Draw a plain pointed niche arch over a floor line with two column lines (`public/motif.svg`, T5.11).
Why: the niche shows direction and a place of prayer. It is architecture only, with no figures.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Understand Your Salah Learn   |
| Understand Your Salah (H1)           |
| 15 lessons on the words of prayer    |
+--------------------------------------+
| LISTEN · Al-Fatiha, in full          |
| [▶ ━━━━━━━━━━━━━━━━━━ ] (native)     |
| Adeel Shaikh · CC BY-SA 4.0 · ↗      |
| [Search____________] [Part ▾]        |
| +----------------------------------+ |
| | Lesson title   · Text lesson     | |
| | Arabic line (Amiri, RTL)         | |
| | [Open lesson →]   [Save]         | |
| +----------------------------------+ |
| ▸ How this works                     |
+--------------------------------------+
```

Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

The audio attribution line stays visible under the player. It is a licence requirement, so it does not move into the drawer.

## 5. Component states (this app)

- **Audio player.** Native controls; no autoplay. Text "Full-surah audio" on the one lesson that has it.
- **Lesson card.** Default, hover, focus; badge text "Text lesson" or "Full-surah audio".
- **Meaning toggle.** Hidden (default) and revealed states, each with text on the button ("Show meaning", "Hide meaning").
- **Reading check.** Default, selected, correct (pulse), incorrect (danger border plus text).
- **Empty state.** "No lessons match" with "Choose All lessons".

## 6. "How this works" drawer

Currently beside the audio, above the search in `index.astro`:
- Notice "About these lessons. Selected narrated wordings, not a full legal prayer manual. Roman guides are approximate…" Move to the drawer. Keep "Roman guides are approximate" beside the Roman guide itself.
- Intro "Explore fifteen meaning lessons, from the opening takbir to the closing greeting…" Shorten to the descriptor; the rest goes to the drawer.

## 7. End of session

- **Result:** reading check result for the lesson.
- **What you learned (1–3 lines):** "Local audio covers Al-Fatiha only; the other lessons are text." Reference the lesson's source.
- **Share (plain text, never the meaning):** "I worked through a lesson in Understand Your Salah. https://understand-your-salah.moongazer.tech/"
- **Next app:** Hifz Planner (only related app in `learning.json`).

## 8. Print and projector

Neither (not in the T5.12 list). The overview mentions print today; keep the existing print styles and flag in T5.12 if a print button is wanted.

## 9. Depth Gate target

From `00-INDEX.md` §4: "All phrases of the prayer (complete) as a step-by-step course + Mastery Loop + per-ayah Al-Fatiha audio."

## 10. Verify_Me layout items

- #23 group by prayer posture: P8 T8.4 (course path).
- #24 phrase-by-phrase cards: C13, P8 T8.4.
- #25 transliteration toggle: P8 T8.4.
- #57 one limit per page: P5 T5.7.
