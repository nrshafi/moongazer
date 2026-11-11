# Verification: Is It in the Quran? "Common claims" (casebook batch, 12 claims)

- Date: 2026-11-11 (Asia/Dhaka)
- Verifier: second-pass model verification (not scholarly review)
- Data checked: apps/is-this-actually-in-the-quran/src/data/content.json (`claims`, `claimIdMap`) against corpus.json; drafter record _implementation/research/merges/casebook-claims.json
- Limitation: sunnah.com returned HTTP 403 (Cloudflare challenge) to both curl and WebFetch. Hadith text was therefore read from the fawazahmed0 hadith-api edition `eng-bukhari` (jsDelivr), whose numbering matches the sunnah.com Bukhari numbers cited (all 10 numbers returned the expected reports). The sunnah.com URLs themselves were not opened. The mirror carries no grading field; the app states no grading, so none was checked. Re-open the URLs by hand if the sunnah.com page itself must be confirmed.
- Quran check: Python, exact string equality of arabic and translation with the corpus.json record (96:1-5 equals the five single-ayah records joined by newline). All 9 evidence entries are identical. "Not found" searches on corpus.json translation (and Arabic for spider/Rajab): "web", "optional", "seller", "buyer", "controls", "ancestry", "Rajab" have no match; "spider" and "frailest" only 29:41; "debtor" 2:280 and 9:60; "truthfulness" 5:119.

| id | Quran refs OK? | Hadith OK? (URL, what seen) | Category OK? | Title neutral? | Issues |
|---|---|---|---|---|---|
| strong-person-saying | none cited | Yes. bukhari:6114, Abu Huraira: the strong one is not who overpowers people but who controls himself in anger. Summary fair | Yes (hadith, not the Quran) | Yes | Note: 3:134 ("control their wrath") is a related ayah; the claim's limit and howToCheck already point to "wrath". Optional: cite 3:134. |
| blessing-in-a-sale | none | Yes. bukhari:2079, Hakim bin Hizam: truthful and described defects, blessed; lies or hiding, blessing lost (also has an option-to-return clause, omitted, fine) | Yes | Yes | None |
| web-at-the-cave | Yes. 9:40 and 29:41 exact; both relevant (cave; spider) | Yes. bukhari:3653, Abu Bakr in the cave: "If any of them should look under his feet, he would see us"; reply about "two... the third of whom is Allah". No spider or web anywhere. Summary fair ("pursuers" is a light gloss of "any of them") | Yes. Claim "The Quran says a spider spun a web over the cave": "web" has no hit, "spider" only 29:41, 9:40 has the cave and no spider | Yes | None. Verdict is limited to "Pickthall search"; limit disclaims other narrations. |
| night-journey-date | Yes. 17:1 exact, relevant | Yes. bukhari:3887, Malik bin Sasaa/Anas: long Night Journey report; no date, month or Rajab in the text | Yes | Yes | "27 Rajab" appears only inside the claim wording, never asserted. OK. |
| safa-marwa-no-sin | Yes. 2:158 exact | Yes. bukhari:1643, Urwa asks Aisha; she rejects the "no harm if one does not" reading and gives the Ansar/Manat background. Summary fair | Yes (misreads the source) | Yes | None |
| garden-and-3-92 | Yes. 3:92 exact | Yes. bukhari:1461, Anas: after 3:92 was revealed Abu Talha offers the Bairuha garden. Summary fair | Yes | Yes | Verdict phrase "and not as its cause" is an inference from the report's order; acceptable, softer wording safer (optional fix 5). |
| spider-house-29-41 | Yes. 29:41 exact | none cited | Borderline OK. Claim says "weakest"; Pickthall says "frailest". Verdict explains the wording and howToCheck points to "frailest". Defensible as exact ayah; a strict reader may call it a paraphrase | Yes | Owner decision on category (see spot-check). |
| honour-and-tribes | Yes. 49:13 exact | none | Yes (paraphrase). Limit states "not ancestry" is a summary | Yes | None |
| delaying-a-debt | none | Yes. bukhari:2400, Abu Huraira: "Procrastination (delay) in repaying debts by a wealthy person is injustice". Fair | Yes | Yes | None. 2:280 (debtor in hardship) found by search; the limit covers it. |
| truthfulness-and-righteousness | none | Yes. bukhari:6094, Abdullah: truthfulness leads to righteousness (then Paradise); falsehood leads to wickedness (then Fire). Summary fair, adds nothing | Yes | Yes | None |
| voices-in-49-2 | Yes. 49:2 exact | PARTLY. bukhari:4845, Ibn Abi Mulaika: the report NAMES Abu Bakr and Umar as the two who raised voices; the narrator's (Nafi') "I do not remember his name" refers to the man one of them recommended, not to the two. App summary and verdict imply the names are uncertain or unknown | Verdict "Not found in the Quran" is right for the ayah, but the app's reading of the report is misleading | Yes | Fix required (below). |
| chapter-96-order | Yes. 96:1-5 exact (joined) | Yes. bukhari:4953, Aisha: beginning of revelation, Hira, angel says read, then the opening ayahs. Fair | Yes (misreads the source) | Yes | Verdict sentence "a chapter's number shows its place in the written Quran, not when it was revealed" is general knowledge with no cited source; acceptable. Keyword "first revelation" echoes the answer; harmless if keywords are only matching terms. |

All claims: honorific present after editorial Prophet mentions (web-at-the-cave claim, voices-in-49-2 verdict); none inside quotations. Categories all within the allowed five. No title or id states the verdict (old ids in `claimIdMap` keys such as "garden-cause" are redirect sources only).

## Required fixes

1. voices-in-49-2, `evidence.hadith[0].summary`. Current: "Ibn Abi Mulaika’s narration describes a disagreement with raised voices, and a narrator in the chain says he does not remember one of the names."
   Suggested: "Ibn Abi Mulaika’s narration names Abu Bakr and Umar as the two who raised their voices over whom to recommend, and says the ayah was revealed then. A narrator adds that he does not remember the name of the man one of them recommended."
2. voices-in-49-2, `verdict`. Current: "...names no one, while the report in Sahih al-Bukhari 4845 keeps a narrator’s uncertainty about one name."
   Suggested: "49:2 tells believers not to raise their voices above the voice of the Prophet ﷺ and names no one; the personal names come from the report in Sahih al-Bukhari 4845, which names Abu Bakr and Umar."
3. voices-in-49-2, `howToCheck[2]`. Current: "Open Sahih al-Bukhari 4845 on sunnah.com and find where a narrator says he does not remember."
   Suggested: "Open Sahih al-Bukhari 4845 on sunnah.com and see which names the report gives, and what the narrator says he does not remember."
4. voices-in-49-2, `limit`. Current: "A gap in one narrator’s memory does not make every other detail of the report unknown."
   Suggested: "This shows what the ayah and one report say; it does not settle every discussion of the occasion."
5. Optional, garden-and-3-92, `verdict`: replace "so the report puts his offer after the verse and not as its cause" with "so in this report the offer follows the verse."

## Owner spot-check first

1. voices-in-49-2: the only substantive defect; confirm the corrected wording against bukhari:4845 on sunnah.com.
2. web-at-the-cave: the high-profile claim. Confirm on sunnah.com that bukhari:3653 has no spider (the mirror shows none) and that "Not found in the Quran" with the 29:41 cross-reference reads fairly.
3. spider-house-29-41: category "In the Quran (exact ayah)" while the claim says "weakest" and Pickthall says "frailest"; decide whether it should be "A paraphrase of an ayah". Also glance at garden-and-3-92 for the "not as its cause" phrasing.

## Fixes applied (2026-11-11, Asia/Dhaka, orchestrator)

All five suggested fixes were applied verbatim to `apps/is-this-actually-in-the-quran/src/data/content.json` (`voices-in-49-2` hadith summary, verdict, howToCheck[2], limit; `garden-and-3-92` verdict) and `appContentSha256` was updated. Owner spot-check still pending (see the three claims above). Note: sunnah.com refused automated requests (HTTP 403); the reports were read from a public mirror of Sahih al-Bukhari, so the owner's spot-check should open the sunnah.com pages directly.
