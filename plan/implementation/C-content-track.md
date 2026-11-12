# C — Depth Gate content track

**Branches:** `content/<app-slug>` (one per app) · **Window:** 16 Nov 2026–8 Jan 2027, rolling · **Merged:** into the next phase release after verification and owner spot-check
**Goal:** every app reaches its Depth Gate content target (`00-INDEX.md` §4) with primary-source-verified items, without padding.
**Decisions:** D8, D9, D10, D12.

## 1. Rules for every content batch

1. **One writer per app** across code and content lanes. Before starting, check `00-INDEX.md` status and the table in §5: if a code task on the same app is "In progress", wait or pick another app.
2. **Batch size:** at most 10 items per batch (a batch = one commit = one verification task).
3. **Sources only from:**
   - Quran text: `_implementation/research/quran-full.json` (exact) or Quran MCP `fetch_quran` / `fetch_translation` (editions `ar-uthmani-hafs`, `en-pickthall`). Call `fetch_grounding_rules` first.
   - Commentary: Quran MCP `fetch_tafsir` / `search_tafsir`, named edition (for example `ar-muyassar`, `ar-ibn-kathir`); link, attribute, do not paste long commentary.
   - Hadith: sunnah.com, collection and number, grading as shown there; paraphrase; link.
   - History and places: institutional sources already used in batch four (UNESCO, the Metropolitan Museum of Art, national/academic institutions). No personal blogs, no Wikipedia as a source (it may help you find a primary source).
4. **Record research** in `_implementation/research/depth/<app-slug>/batch-NN.json`: for each item, every tool call (tool, arguments, edition, retrieved-at), the exact text used, URLs opened.
5. **Write data** into the app's `src/data/content.json` in the existing shape (canonical records as `{ref, arabic, translation}` so the verifier checks them). Editorial fields are labelled editorial per the app's convention. Update `src/data/provenance.json` `appContentSha256` (`python -c "import hashlib;print(hashlib.sha256(open('apps/<slug>/src/data/content.json','rb').read()).hexdigest())"`).
6. **No padding.** If you cannot find enough well-sourced items, stop at fewer and report; the owner decides.
7. **No answers in titles, URLs or meta descriptions** for any quiz-like item.
8. **Honorifics** in editorial text; aniconism for any new visual; no sound files.
9. Run V1 and V5 for the app before committing. Commit: `C<n>.<batch>: <summary>`.

## 2. Spoiler and quality checks per item

- The question or puzzle cannot be answered from text shown beside it.
- Distractors are plausible and not near-synonyms of the answer.
- Each item has at least one exact reference a reader can open.
- Dates: approximate dates labelled approximate; disputed dating excluded or explained.
- Language: plain, warm, short; one word per thing in the app.

## 3. Second-pass verification (separate task, separate model run)

For each batch, a **different** model run (not the author's session):
1. Reads `batch-NN.json` and the committed data.
2. Re-fetches every Quran reference via Quran MCP and compares Arabic and translation byte-for-byte with the data; opens every sunnah.com and institutional URL and checks that the cited content supports the claim.
3. Checks §2 for every item.
4. Writes `_implementation/research/depth/<app-slug>/batch-NN.verification.json`: per item `pass | fail` with a reason. Failing items are fixed or removed by the author before merge.
5. Commits `C<n>.<batch>-verify: <pass count>/<total>`.

## 4. Owner spot-check

The owner reads at least 3 items per batch (or all, if fewer than 3) and records "spot-checked <date>, <items>" in the §5 table. Only spot-checked batches are merged into a release. Nothing in the product says "reviewed"; this record is internal (D9).

## 5. Per-app work items and status

Targets are from `00-INDEX.md` §4. "Need" is the minimum new verified items.

| # | App (folder) | Need | Work items | Status / batches / spot-check |
| --- | --- | --- | --- | --- |
| C1 | Guess the Surah (`guess-the-surah`) | 114 name meanings | Verified meaning of each surah name (source: Quran MCP chapter metadata if it carries a translated name; otherwise a named reference with URL). Store `nameMeaning` + `nameMeaningSource` per chapter. Needed by P6 T6.2. | Done: 114/114 in 12 batches (`content-c1`), second pass 114/114 (`C1-verify`); spot-checked 2026-11-12 (D2b, agent), chapters 1, 36, 112 and all 114 against the live API. Merged into `phase-6-daily`. |
| C2 | Ayah Threads (`ayah-threads`) | 30 reworked | Every puzzle draws its three passages from ≥2 different surahs (3 where possible); replace one-surah puzzles (for example 51:24–27); author distractor sets per P6 T6.3 limits; authored "related themes" for the theme library where justified. | Done: 30 puzzles reworked in 3 batches (`phase-6-threads`); second pass 27/30, then 3 spoiler hints (mercy, truthfulness, fasting) rewritten → 30/30; spot-checked 2026-11-12 (D2b, agent): hospitality, orphans, accountability. Merged into `phase-6-daily`. |
| C3 | Word Groups (`word-groups`) | +14 boards, +20 groups | 40+ groups (mix of word-in-ayah groups, surah names, prophets' qualities, Arabic roots shown in the ayat); 30 boards with distinct titles; difficulty `tier` 1–4; remove valid alternative groupings or record accepted alternates; each word links its ayah. | Done: 45 groups, 30 boards in 8 batches (`phase-6-groups`); second pass 69/75, then fixes (C3.09: `lost-peoples` retitled; boards 05, 12, 13, 14, 26 rebuilt with `incompatible` pairs) and a fresh re-check 6/6 → 75/75; spot-checked 2026-11-12 (D2b, agent): rivers 47:15, 89:6–10, hajj places, Last Day surahs, 33:45–46, roots ر ح م and ع ل م. Merged into `phase-6-daily`. |
| C4 | Quran Escape Room (`quran-escape-room`) | +8 rooms | 16 rooms total with non-revealing names; 10 rooms grouped as "Ramadan nights" path; new lock types allowed only if the code supports them (ayah order with Arabic, word-meaning match, missing ayah, surah-number cipher need app code: coordinate with a P5/P8-window app task); printable teacher answer sheet data. | Not started |
| C5 | Is It in the Quran? (`is-it-in-the-quran`) | +18 claims | 30 "Common claims" total (12 from P3 + 18), real claims people make, neutral titles, verdict categories from P3 T3.6, "How to check it yourself"; synonym list for search (modern word → Pickthall wording) as editorial data. | Not started |
| C6 | Stories of the Prophets (`stories-of-the-prophets`) | Mastery bank | 25 modules × 3 diagnostic questions (+ variants) + concept cards for P8 T8.5; motif descriptions per prophet (objects only). | Not started |
| C7 | Parables of the Quran (`parables-of-the-quran`) | +16 parables | 30 parables (amthal) with exact refs, verified commentary links; diagram step text for each (objects only). | Not started |
| C8 | Places in the Quran (`places-in-the-quran`) | to complete list | Compile the list of places named in the Quran via Quran MCP search (record the method and the list), add missing ones (including Badr 3:123, Hunayn 9:25, Yathrib 33:13; verify each ref), one combined Bakkah/Makkah entry with the relationship explained, certainty label per place; coordinates only from institutional sources; "Places we can't pin, and why". | Not started |
| C9 | Why It Was Revealed (`why-it-was-revealed`) | +20 readings, mastery bank | 30 readings in mushaf order: ayah (exact), the report (collection and number, narrator), "What this shows" / "What it doesn't settle", topic; 2–3 mastery questions each for P8 T8.6. | Not started |
| C10 | Seerah Timeline (`seerah-timeline`) | daily pairs | ≥30 "Which came first?" pairs with well-established order (P6 T6.5); optional authored links between events (only if time allows). | Pairs done: 31 in 4 batches (`content-c10`), second pass 29/31, then pair-05 reworded and pair-09 confirmed on sunnah.com Bukhari 428 → 31/31; spot-checked 2026-11-12 (D2b, agent), all 31 orders. Merged into `phase-6-daily`. Authored links not started. |
| C11 | Seerah Detective (`seerah-detective`) | +18 cases | 30 cases, each from 2–3 different reports (collection and number), plausible distractors, era tag, aligned with timeline events where possible. Code change (reveal after two wrong tries, solved ticks, era filter) is an app-lane task in the same branch window. | Not started |
| C12 | Civilization Timeline (`civilization-timeline`) | +16 records, coordinates | 40 records: Rashidun period, Umayyad, Abbasid Baghdad, Cordoba, Fatimid Cairo, Seljuks, Ayyubids/Mamluks, Ottomans, West Africa (Timbuktu), South and Southeast Asia including the Historic Mosque City of Bagerhat (UNESCO); coordinates for every record; "At the same time…" groupings replace date-band arithmetic (code task in the same window). CC0 Met images only of objects/architecture without figures, each item's open-access status checked, if time allows. | Not started |
| C13 | Understand Your Salah (`understand-your-salah`) | phrases, audio, mastery bank | Complete list of the prayer's phrases (takbir to salam) with exact Arabic for Quran parts and named narrated wordings for adhkar (sources as in the app today); phrase-by-phrase meanings; per-ayah Al-Fatiha audio cut from the existing CC BY-SA 4.0 recording (keep licence and attribution on every derivative, record the cut points); mastery questions per module for P8 T8.4. | Not started |
| C14 | Hifz Planner | — | No content items; page map completeness check only (P7 T7.2). | n/a |
| C15 | Everyday Akhlaq (`everyday-akhlaq`) | branching, mastery bank | Real branching: for each of the 32 scenarios, second-decision options that depend on the first choice (`options2ByFirst`), constructive flags, takeaways per path; replace the duplicate "friendly loan" business case with a commercial case; mastery questions per track for P8 T8.7. Optional: "Friends & online" track (only if time allows). Code change for branching is an app-lane task in the same window. | Not started |
| C16 | Family Halaqa (`family-halaqa`) | +30 packs | 30-night Ramadan series (one pack per night; age bands 5–7, 8–11, 12+ spread across nights; reading question, discussion, shared activity, answer for the adult) — needed by P7 T7.10; "Show the answer (for the adult)" hidden by default is a code task. | Done: 30 packs in 3 batches (`content-c16`); second pass 14/30, then fixes C16.04 (16 packs), C16.05 (6) and C16.06 (4), each confirmed by a fresh re-check (10/16, 2/6, 4/4) → 30/30; tests now reject titles that point at the answer and prophet names without an honorific; the facilitator's answer was already in a closed `<details>`. Spot-checked 2026-11-12 (D2b, agent): nights 11, 17, 27 and an honorific scan of all 30. Merged into `phase-7-season`. Series filter and `?night=N` not started. |
| C17 | Zakat Calculator | method record | See P7 T7.4. | Done: 12 entries and 5 worked examples (`content-zakat`). Second pass 13/17, then fixes (C17.03, C17.04) and two fresh re-checks gave 17/17. Spot-checked 2026-11-12 (D2b, agent): rate, diff-jewellery, fitr-food-vs-cash; one wording fix. Merged into `phase-7-season`. No scholarly review. |
| C18 | Directory | ayah list | ≥60 "ayah of the night" references (P6 T6.6); Ramadan hub ayat (P7 T7.10). | Ayah of the night done: 71 drafted, second pass text 71/71 and suitability 63/71; 5 removed and 3 relabelled → 66; spot-checked 2026-11-12 (D2b, agent), 112:1-2, 33:41, 88:17-18. Merged into `phase-6-daily`. Ramadan hub ayat: the 30 night ayat are taken from the verified list and Surah al-Qadr from `quran-full.json`, both checked byte for byte by `verify-static.py` (R7). |

## 6. Suggested order (by deadline dependency)

1. C1, C16, C17 (block P6 and P7).
2. C13, C6, C9, C15 (block P8).
3. C10, C18 (block P6/P7 details).
4. C11, C9 (if not done), C3, C2, C5, C4, C7, C8, C12.

If the schedule slips, report it; the owner may move the lowest items in this list after Ramadan (`00-INDEX.md` §2 schedule risk).
