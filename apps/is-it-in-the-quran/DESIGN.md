# Is It in the Quran?: design

## 1. Family and tokens
Family: **Quran (teal)**. Tokens and contrast: root `DESIGN.md` §2. No new colours or fonts.
Mismatch: `config.json` `accent` is `blue` today. Root §2 says teal. T5.5 changes it to `teal`.

## 2. Archetype
**Dossier** (root `DESIGN.md` §6): evidence cards, mono metadata chips, a search-first workspace.

## 3. Motif
`public/motif.svg`, derived from `public/favicon.svg`: a ruled sheet with a magnifier over one corner. It stands for checking a text. An object, so it is allowed.

## 4. Screen 1 on a phone
```
+------------------------------------------+
| [logo] Is It in the Quran?       Search  |
| Is It in the Quran?                      |  H1
| Search Arabic and Pickthall wording for  |
| any ayah or reference.                   |  descriptor (10 words)
| [6,236 ayat]                             |
+------------------------------------------+  hero <= 140 px
| [ with hardship ____________ ] [Search]  |  first control
| Language [Pickthall v]  Chapter [All v]  |
| Try: [with hardship] [every soul] [94:5-6]
| [ ] Keep up to 5 recent searches         |
| > How this works                         |
| ----------------------------------------- |
| Results appear here                      |
| +--------------------------------------+ |
| | Exact wording match  [94:5]          | |  mono ref chip
| | Ayah text (Pickthall)                | |
| | ±2 ayat context (muted)              | |
| +--------------------------------------+ |
| Related-word suggestions (not exact)     |
| Common claims: check twelve things  ->   |
+------------------------------------------+
```
Measured first-control top: _pending (T5.14)_; target ≤ 600 px at 390 × 844 and 375 × 812.

## 5. Component states specific to this app
- **Exact match:** label "Exact wording match" with the reference chip. Not colour alone.
- **Related-word suggestion:** separate group, labelled "Related words, not exact". Never mixed with exact matches.
- **No match:** the one-line limit sits beside the result: "No wording match does not mean the idea is absent."
- **Too short / reference too long:** text error in an `aria-live` alert. Under two normalized characters, or over 30 ayahs.
- **Context (±2 ayat):** muted text, labelled "Context". Matches stay visually distinct.
- **Example chip:** focusable, fills the search field.
- **Recent search chip:** shows the query; removed by a button with a text label.

## 6. "How this works" drawer
Moves out of the page above the activity (`index.astro`):
- Notice "Common claims — check twelve things people often say". Moves to the drawer and to the empty-state footer. It is a link, not explanation.
- Form note "Punctuation and case are ignored. Arabic diacritics, tatweel, and common alif variants are normalized. No stemming or semantic judgment is used." Moves to the drawer.
- Results notice "An empty wording search does not mean 'not in the Quran.'" Moves to the drawer. Its first sentence, shortened, sits beside the no-match result (section 5).

The intro line "Search every ayah in Uthmani Arabic and Pickthall's English translation…" becomes the descriptor in §4.

## 7. End of session
- **Result:** "[N] exact wording matches. [M] related-word suggestions, shown separately." Then the full ayat with their references.
- **What you learned:**
  - A wording search checks one translation. Another translation may use different words.
  - Read the ayat around a match before drawing a conclusion about it.
- **Share (copy + WhatsApp):** "Checking a quotation on Is It in the Quran?: [search link]". The text shares the search, never the verdict. No tracking parameters.
- **Next app:** Why It Was Revealed (only related app).
- **New puzzle tomorrow:** not applicable.

## 8. Print and projector
None per T5.12. Base print styles only.

## 9. Depth Gate target (`00-INDEX.md` §4)
Full search plus 30 "Common claims". Grow to 100 after Ramadan. Today: full corpus and 12 casebook cases (to merge).

## 10. Verify_Me layout items
- #15 Show ±2 ayat around each hit, muted (P5 T5.14).
- #14 Transliterated keywords such as sabr, riba, taqwa (C5).
- #13 Modern English translation in the index: research only (P10 10.0).
