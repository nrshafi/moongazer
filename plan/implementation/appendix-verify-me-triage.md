# Appendix — triage of `plan/Verify_Me.md`

`plan/Verify_Me.md` is an external UX review of the live site. Each item is assigned to a task, or rejected with a reason (D21). Item wording is shortened.

| # | Item | Decision | Where |
| --- | --- | --- | --- |
| 1 | Move apps to subpaths or share state across subdomains | Rejected for now: hosts stay until Search Console data exists (REPORT §A4 rule 9). Cross-app streak cookie is planned. | P10 10.3 |
| 2 | Add a modern English translation alongside Pickthall | Research only: adopt only with a licence that allows it. | P10 10.0 |
| 3 | Export options for planning and reflection | Hifz `.ics` fixed and extended; Parables note download already exists. | P1 T1.11, P7 T7.3 |
| 4 | Library above the fold on the directory | Accepted. | P5 T5.15 |
| 5 | Fold subject guides into filter tabs | Partly: guides become compact cards below the library. | P5 T5.15 |
| 6 | Missing whitespace between badges and links (`QuranOpen app`) | Accepted, site-wide audit. | P1 T1.17 |
| 7 | Two hero links that do the same thing | Accepted: two distinct buttons. | P5 T5.15 |
| 8 | "Saved in your browser" status bar on the directory | Rejected: the directory cannot read app subdomain storage (browser storage is per origin). Revisit with the cross-app cookie. | P10 10.3 |
| 9 | Guess the Surah: round settings above the clue card | Accepted (inside Practice mode). | P5 T5.14, P6 T6.2 |
| 10 | Guess the Surah: Arabic-first clue option | Accepted. | P6 T6.2 |
| 11 | Guess the Surah: 114-surah list spoils paid clues | Accepted (collapsed, labelled). | P1 T1.14 |
| 12 | Guess the Surah: option letter joined to the name | Accepted. | P1 T1.14 |
| 13 | Is It in the Quran?: modern translation in the index | Research only. | P10 10.0 |
| 14 | Is It in the Quran?: transliterated keywords (sabr, riba, taqwa) | Accepted as part of the editorial synonym list. | C5 |
| 15 | Is It in the Quran?: show ±2 ayat around each hit | Accepted (muted context from the local corpus). | P5 T5.14 |
| 16 | FAQ double negative | Accepted. | P1 T1.18 |
| 17 | Parables: autosave notes to sessionStorage | Deferred: changes the documented storage rule; needs a context decision. | P10 10.0 |
| 18 | Parables: Markdown download | Already implemented. | — |
| 19 | Parables: link themes to the Concept Atlas | Accepted in merged form: link to Ayah Threads' Theme library where a theme matches. | C7 |
| 20 | Hifz: 90-day revision projection chart | Deferred stretch. | P10 10.0 |
| 21 | Hifz: separate new/recent/old revision | Accepted. | P7 T7.2–T7.3 |
| 22 | Hifz: `.ics` export | Accepted. | P1 T1.11, P7 T7.3 |
| 23 | Salah: group by prayer posture | Accepted (course path). | P8 T8.4 |
| 24 | Salah: phrase-by-phrase cards | Accepted. | C13, P8 T8.4 |
| 25 | Salah: transliteration toggle | Accepted: make the existing approximate Roman guide a toggle. | P8 T8.4 |
| 26 | Quran Connections: dedupe against the Concept Atlas | Resolved by the merge: themes unlock after solving. | P3 T3.3 |
| 27 | Ayah Threads: show the shared Arabic root after solving | Deferred stretch (needs morphology data with licence check). | P10 10.0 |
| 28 | Ayah Threads: collapse the 30-button puzzle grid | Accepted. | P5 T5.14, P6 T6.3 |
| 29 | Concept Atlas: node view / shared-verse links | Mechanical links dropped; authored relationships only. | P3 T3.3, C2 |
| 30 | Concept Atlas: spoilers on index cards | Accepted. | P1 T1.5 |
| 31 | Prophets: "Quranic pairings" sort | Conventional order + A–Z now; pairings deferred. | P8 T8.5, P10 10.0 |
| 32 | Prophets: deeper comprehension checks | Accepted via the Mastery Loop bank. | C6, P8 T8.5 |
| 33 | Places: regional labels for unpinned regional entries | Accepted. | C8 |
| 34 | Places: legend text joined | Accepted. | P1 T1.17 |
| 35 | Revelation: grow thin categories | Accepted. | C9 |
| 36 | Revelation: hide "Copy my list" until something is saved | Accepted. | P5 T5.14 |
| 37 | Detective: era filter instead of 10 topic filters | Accepted. | C11 |
| 38 | Detective: embed the full hadith text in the case | Rejected in this form: the app paraphrases and links sunnah.com instead of republishing modern English translations (rights). Keep links. | — |
| 39 | Seerah Timeline: inspector beside the timeline / drawer on phone | Accepted. | P5 T5.14 |
| 40 | Seerah Timeline: joined date/title/place text | Accepted. | P1 T1.17 |
| 41 | Civilization: card-level compare | Replaced by "At the same time…". | C12 |
| 42 | Civilization: broaden institutional sources | Accepted (institutional sources only). | C12 |
| 43 | Akhlaq: 11 filters → 4 groups | Accepted as tracks. | P3 T3.5 |
| 44 | Akhlaq: repeated card subtitles | Accepted: show completion state instead. | P5 T5.14 |
| 45 | Halal Business: duplicate loan case | Accepted. | C15 |
| 46 | Halal Business: one-sided case openings | Accepted when converting to Business track. | C15 |
| 47 | Casebook: evidence cards open by default | Accepted in Common claims. | P3 T3.6 |
| 48 | Casebook: copied correction text too stiff | Accepted: share = claim + citation + one-line verdict. | P3 T3.6 |
| 49 | Escape Room: rooms reuse Atlas themes; mix lock types | Accepted: non-revealing names; new lock types where code allows. | P1 T1.4, C4 |
| 50 | Escape Room: label the lock diamonds | Accepted. | P5 T5.14 |
| 51 | Word Groups: Board 1 surah-name overlap | Accepted. | C3, P6 T6.4 |
| 52 | Word Groups: solved status across boards | Accepted. | P6 T6.4 |
| 53 | Timeline Challenge: source clues visible too early | Accepted. | P3 T3.4 |
| 54 | Timeline Challenge: drag and drop | Optional; keyboard buttons stay. | P3 T3.4 |
| 55 | Family: show reference and activity type on cards | Accepted. | P5 T5.14 |
| 56 | Family: batch print saved packs | Accepted. | P5 T5.12 |
| 57 | Repeated disclaimers across pages | Accepted: one limit per page; the rest in the drawer. | P5 T5.7 |
