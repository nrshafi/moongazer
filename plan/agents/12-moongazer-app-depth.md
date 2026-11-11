# Brief 12 — Moongazer: deepen the existing apps (in slices)

> **Superseded (11 November 2026):** this file is background only. The authoritative execution plan is [`plan/implementation/00-INDEX.md`](../implementation/00-INDEX.md). Where they differ, the implementation plan wins.

**Repository:** `I:\Development\moongazer`
**Depends on:** 09 and 10. Each slice is one app and can ship on its own. **Authorized:** ask the owner which slices to do, and in what order.
**Goal:** turn thin apps into ones worth returning to, and fix the remaining design weaknesses.
**Background:** `../REPORT.md`, A8 (one entry per app, with verdict, layout, additions and removals).

## Rules for every slice

- Read the app's `AGENTS.md` and `context/` first, and update its context before changing behaviour or storage.
- **Content rules.**
  - Quran text comes only from `_implementation/research/quran-full.json` or Quran MCP, copied exactly, with references.
  - Commentary comes from Quran MCP with attribution.
  - Hadith reports are named with collection and number, and checked on sunnah.com.
  - Historical claims come from institutional sources, as in batch four.
  - Record provenance in `src/data` and `_implementation/research/`, and update checksums.
  - Editorial text is labelled editorial.
- **No images of people or animals**, in illustrations or anywhere else; no music or bells.
- Content growth lands in batches with review. Never pad a bank with low-quality items to hit a number.
- Run the verification checklist in `00-START-HERE.md` for each slice, then record a tracker entry.

## Recommended slice order (by audience impact)

1. **Family Halaqa: pack library** (feeds the Ramadan hub).
   - Grow toward 52 weekly packs plus a 30-night Ramadan series. Start with the Ramadan series if brief 11 is due.
   - Add more 12+ packs (there are only 2 today).
   - Add "Tonight's halaqa" at the top, with an age-band switch.
   - Hide the answer behind "Show the answer (for the adult)".
   - Add "Next pack", a read-aloud mode, a printable monthly calendar, and an optional weekly family streak.
2. **Guess the Surah: surah pages.**
   - 114 static pages at `/surah/<name>/`: name, meaning (verified), ayah count, revelation place (from the existing data), the canonical opening ayah, "Play this surah".
   - Add them to the sitemap with specific titles and descriptions.
   - Link the "Browse the surah collection" list to these pages instead of quran.com.
3. **Understand Your Salah: course.**
   - A "Your prayer, step by step" path, with saved progress ("Lesson 4 of 15").
   - Phrase-by-phrase meaning reveal.
   - Per-ayah Al-Fatiha audio cut from the existing CC BY-SA recording, keeping the licence and attribution on every derivative.
   - Review cards and a printable pocket card.
4. **Stories of the Prophets: chapters.**
   - Three to six readings for Adam, Nuh, Ibrahim, Yusuf, Musa, Isa and Muhammad ﷺ, each scene with a passage, a short narration and one check.
   - Symbolic non-figurative card motifs.
   - Saved answers and "7 of 25 read".
   - Conventional order with an A–Z toggle; fix the "Next profile" contradiction.
5. **Quran Escape Room: rooms and teacher kit.**
   - A sequential corridor (finishing a room opens the next).
   - New lock types: ayah order using the Arabic, word-meaning match, the missing ayah, a surah-number cipher.
   - Grow from 8 to 16 rooms, including a 10-room Ramadan set.
   - An optional hint cost.
   - A printable teacher answer sheet and a certificate whose name is typed only in the print view and never stored.
6. **Everyday Akhlaq: real choices.**
   - The second decision depends on the first.
   - Use the unused `constructive` field for gentle feedback.
   - Add a Friends & online track (group chats, gaming, sharing photos).
   - Add a one-device class tally.
   - Grow toward 60 scenarios.
7. **Is It in the Quran?: claims and synonyms.**
   - Grow "Common claims" toward 100, each with a verified verdict line.
   - Add a synonym index so modern words find Pickthall's archaic wording.
   - Add a second English translation only if Quran MCP offers one whose licence allows it; record the licence.
   - Link to Why It Was Revealed where a reading exists.
8. **Seerah Detective: richer cases.**
   - Cases built from two or three different reports.
   - Plausible distractors.
   - A reveal after two wrong tries; the hint no longer replaces feedback.
   - Solved ticks on the case board, an era filter, a case of the week, and a local rank.
   - Grow toward 30 cases.
9. **Seerah Timeline: real connections.**
   - Authored links between related events, people, places and Quran passages.
   - A people index with honorifics.
   - A second source where one exists.
   - A printable classroom poster.
   - Restore "connected" wording only once the links exist.
10. **Word Groups and Ayah Threads: banks.**
    - Word Groups: at least 60 groups and 100 boards, mixing trivia with real concepts.
    - Ayah Threads: 90 puzzles, each with passages from different surahs.
11. **Why It Was Revealed.**
    - A quiz that asks something not printed on the page.
    - Readings in mushaf order.
    - Grow toward 50 readings.
    - Per-surah index pages.
12. **Parables of the Quran.**
    - Illustrated stepped diagrams of objects (a web, a cloud, a garden, a lamp in a niche) as local SVG.
    - Next/previous.
    - A printable worksheet.
13. **Places in the Quran.**
    - The map comes first.
    - A "Places we can't pin, and why" shelf.
    - Add Badr (3:123), Hunayn (9:25) and Yathrib (33:13). Verify each reference through Quran MCP before adding.
    - One combined Bakkah/Makkah entry, with the relationship explained.
    - Links to the prophets' stories and the timeline.
14. **Civilization Timeline: rebuild or fold.**
    - Fill the gaps: the Rashidun period, the 10th–13th centuries, West Africa, and South and Southeast Asia, including the Historic Mosque City of Bagerhat.
    - Plot every record on the map.
    - Add CC0 Metropolitan Museum images of objects and architecture without human or animal figures, checking each item's open-access status.
    - Replace the date-band arithmetic with "At the same time…".
    - If this slice is not done by the end of Phase 3 (June 2027), propose to the owner folding the records into the Seerah Timeline as an "After 632" era.

Update `00-START-HERE.md` with each slice completed (note the slice number in the Notes column).
