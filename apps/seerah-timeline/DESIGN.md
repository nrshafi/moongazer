# Seerah Timeline: app design

Read with root `DESIGN.md`, which is binding. This file narrows it and adds no colour or font.

## 1. Family and tokens

- Family: **Seerah & history** (`gold`). Tokens: root `DESIGN.md` §2.
- Check in T5.5: `config.json` says `teal`. Set `gold`, and replace the teal set in `ui-context.md` with the root gold set.

## 2. Archetype

**Dossier** (root §6): era ribbon, dated records, mono metadata chips.

## 3. Motif

Source: `public/favicon.svg` (a vertical rail with three nodes). Draw a vertical rail with three dated nodes, the middle one filled, on a thin horizontal baseline (`public/motif.svg`, T5.11).
Why: it is the timeline itself. One filled node marks the event being read.

## 4. Screen 1 on a phone

```
+--------------------------------------+
| [logo] Seerah Timeline  Read   [◐]   |
| Seerah Timeline (H1)                 |
| 36 sourced events; dates approximate |
+--------------------------------------+
| [Which came first? →]  (one link)    |
| [Search Hira, migration, a person_]  |
| [Period ▾]  [Topic ▾]                |
| [ ] Bookmarked only       36 events  |
| ── PERIOD NAME ─────────────────────  |
| ● Event title                  →     |
|   approximate date                   |
|   one-line summary · [topic]         |
| ● Event title                  →     |
| ▸ How this works                     |
+--------------------------------------+
  Event detail panel opens under the
  tapped entry on phones (see §5).
```

Measured first-control top (P6, the Daily tab `#tab-daily`): 252 px at 390 × 844 and 375 × 812, light and dark; hero 136 px. 1440 × 1000: 303 px. The search field now starts at 727 px on phones (Daily panel above it).

Fixed in T5.14: the `grid-row:1` rule is gone. On phones the event list comes first; the inspector (`#selected-event`) is a fixed bottom drawer that opens when an entry is tapped and closes with its Close button or Escape, returning focus to the tapped entry. On desktop the inspector is sticky beside the list under the "How this works" drawer. Print shows the inspector inline.

## 5. Component states (this app)

- **Timeline entry.** Default, hover (title in `--accent-ink`), active (filled node, tint ring, bordered card; existing `.active`).
- **Bookmark.** Pressed state; text "Bookmarked" or "Bookmark".
- **Date note.** Approximate dates carry the word "approximate" in text, never colour only.
- **Detail panel.** Empty state "Select an event to read its report." Open state shows summary, date note, sources.
- **Print.** Prints the reading view of the selected event(s); the timeline list is hidden in print (existing rule; the Print button in T5.12 needs the list view).

## 6. "How this works" drawer

Currently above the timeline in `index.astro`:
- Intro: "Follow the prophetic mission through 36 sourced events. Read the reports, compare events in order, and see where the dates are uncertain." Move to the drawer.
- Link notice "Which came first? Put four events in order →". This is a link, not a caveat: keep it as one line under the header.
- `<noscript>`: "All event pages and sources work without JavaScript. Enable JavaScript for filters, the detail panel, and optional bookmarks." Move to the drawer.

Warning at the bottom of the page: "**Dates need context.** CE and AH labels are approximate navigation aids…" It is the main limit. Move it to the drawer. Keep "approximate" in the header pill, and the date note on each event.

## 7. End of session

- **Result:** the event read, its date note. No score.
- **What you learned (1–3 lines):** the event's date note, with its source reference.
- **Share (plain text, never the order of events):** "I followed the Seerah timeline on Moongazer. https://seerah-timeline.moongazer.tech/"
- **Next app:** Seerah Detective (first related app in `learning.json`).

## 8. Print and projector

**Both.** Print button (T5.12). Projector toggle (×1.35 text, simpler chrome, higher contrast; saved only if opted in).

## 9. Depth Gate target

From `00-INDEX.md` §4: "36 events + merged 'Which came first?' (12 packs) + daily pairs."

## 10. Verify_Me layout items

- #39 inspector beside the timeline / drawer on phone: P5 T5.14.
- #40 joined date/title/place text: P1 T1.17 (not P5).
- #57 one limit per page: P5 T5.7.
