Moongazer is a rare piece of Islamic edtech that respects both the user's attention and the limits of its own material. Offering 20 focused browser tools for Quran, Seerah, and history with zero accounts, zero analytics, and explicit source methodology gives the site a calm, trustworthy identity. Most religious apps gamify streaks or blur the line between primary text and app commentary, so separating historical reports from editorial exercises is a smart foundation.

Even with that strong premise, several architectural, UX, and content choices get in the way of the tools.

**Product and architecture improvements**

* **Consolidate subdomains or sync state across origins.** Individual apps run on separate subdomains such as `guess-the-surah.moongazer.tech`. Because browsers isolate `localStorage` per origin, a user's theme preference and saved progress in one app are invisible to the others and to the main domain. Serve the apps from subpaths like `moongazer.tech/apps/guess-the-surah` so you can offer a single "Manage all saved data" drawer on the homepage, or store theme preferences in a root cookie scoped to `.moongazer.tech`.
* **Replace Marmaduke Pickthall as the sole English translation.** Every Quran app relies on Pickthall's 1930 translation. In Guess the Surah, players are greeted with archaic phrasing like "whoso transgresseth" and "reckon the period". That creates heavy reading friction for children, families, and non-native English speakers. It also hurts the "Is This Actually in the Quran?" text search tool, because searching modern English words will miss verses where Pickthall used 1930s vocabulary. Add a clear modern option like Saheeh International or The Clear Quran, and index multiple translations for text search.
* **Add lightweight export options for planning and reflection tools.** Saved browser data is ignored after 30 days, and reflection notes in Quranic Parables Studio disappear as soon as the tab closes unless copied. You can keep the zero-account privacy model while protecting user effort by adding a one-click Markdown export for reflection notes and an `.ics` calendar export for the Quran Memorization Workload Calculator.

**UX and interface improvements**

* **Pull the 20-app directory above the fold.** Visitors on `moongazer.tech` have to scroll past a hero block, a secondary intro, two featured app spotlights, and four subject-guide cards before reaching the searchable app library. Move the search bar, category filter pills, and app grid directly below the hero section. The four subject guides can live inside each category filter tab rather than pushing the directory down the page.
* **Let players choose Arabic-first or dual-script clues in Guess the Surah.** The quiz defaults to showing the opening ayah in Pickthall's English and hides the Arabic text behind the "Reveal another clue" button, which costs points. Many users recognize surahs by their Arabic text or cadence rather than English translation. Let players choose whether their starting clue shows Arabic, English, or both before starting a round.
* **Hide the 114-surah reference list during active quiz rounds.** The Guess the Surah page renders a full list of all 114 surahs, complete with Arabic names and exact ayah counts, directly below the game board. Because ayah count and chapter position are paid clues in the game, having the full answer key on the same scrollable page breaks the puzzle mechanic. Move that directory to a collapsed drawer or to the Sources tab.
* **Fix DOM spacing between badges, option letters, and titles.** In the HTML structure, category labels, multiple-choice letters, and call-to-action strings sit adjacent to text nodes without whitespace separators, producing merged strings like `QuranOpen app` on the homepage and `AAt-Talaq` or `1Al-Fatihah7 ayahs` in the quiz for screen readers and text parsers. Add explicit spacing or visually hidden delimiters so assistive technologies read them as separate words.

**Copy and editorial improvements**

* **Trim repetitive disclaimers across subject guides.** The site repeats the same warnings on almost every page, reminding visitors that scores do not measure faith, dates have historical uncertainty, and browser storage is not permanent. The transparency is admirable, but repeating three paragraphs of caveats before every 3-app list makes the site feel defensive. Keep the full methodology on the About and Sources pages, and reduce in-page caveats to a single sentence.
* **Fix the double negative in the Quran Learning FAQ.** Under the question "Which tool should I use for an exact Quran phrase?" on `/quran-learning/`, the answer reads, "No result cannot establish that an idea is absent". Change this to "An empty search result does not mean an idea is absent from the Quran."

Which part of the project are you focusing on next, the main landing page or the individual app templates?


The `moongazer.tech` homepage buries its primary value, the 20-app library, beneath four screen heights of introductory copy and category cards. Restructuring the landing page around immediate tool discovery and fixing workflow bottlenecks in five core apps will make the collection much faster to use.

**Main landing page**

* **Move the app library above the fold.** Visitors scroll past the hero, an orbital moon graphic, two app spotlights, and four path cards before seeing the tools. Place the search bar, category filters, and 20-app grid right under the hero.
* **Merge the four subject guides into the filter tabs.** Having separate sections for "Find a useful starting point" and "The app library" duplicates category navigation. Display each subject guide's summary inside its matching filter tab.
* **Fix missing whitespace in app cards.** Category badges and action links touch in the DOM, reading as `QuranOpen app` or `Seerah & historyOpen app` to screen readers. Add CSS flex gaps and proper spacing between child elements.
* **Differentiate the two primary hero links.** "Find your next discovery" and "Explore below" sit stacked above the fold and both scroll down the page. Keep one anchor button that jumps straight to `#app-library`.
* **Add a global storage status bar.** Since Moongazer saves progress locally across 20 apps, give returning visitors a small "Saved in your browser" pill at the top that links to their recently opened tools.

**1. Guess the Surah**

* **Move round settings above the active clue card.** The "Make it your round" controls for surah filter and round length sit below the multiple-choice buttons. Put a compact settings bar at the top so players configure their round before playing.
* **Make Arabic script part of the free starting clue.** The game starts with Pickthall's 1930 English and charges points to reveal the Arabic text. Most readers recognize surahs by Arabic phrasing, so offer an Arabic-first or dual-script toggle.
* **Remove the 114-surah list from the game view.** Rendering all 114 surahs with Arabic titles and ayah counts right below the quiz spoils paid clues like ayah count and chapter number. Move this directory into the Sources tab.
* **Separate option letters from surah names.** Answer buttons concatenate the letter, English title, and Arabic script into strings like `AAt-Talaqالطلاق`. Wrap the option letter in a distinct badge element with a space after it.

**2. Is This Actually in the Quran?**

* **Index a modern English translation alongside Pickthall.** Searching modern words like "anxiety" or "interest" fails when Pickthall uses 1930s terms like "usury" or "grief". Add Saheeh International or The Clear Quran to the local search index.
* **Support transliterated Arabic keywords.** Users often check claims using terms like *sabr*, *riba*, or *taqwa* rather than English equivalents. Map common transliterated roots to their matching verse occurrences in the search bar.
* **Show surrounding verse context by default.** Inspecting a single matched ayah in isolation makes it easy to misread the passage. Render the preceding and following two ayahs in a muted style around every search hit.
* **Clarify the empty-state FAQ wording.** The Quran Learning guide currently states "No result cannot establish that an idea is absent." Rewrite this double negative to "An empty search result does not mean a topic is absent from the Quran."

**3. Quranic Parables Studio**

* **Auto-save reflection notes to session storage.** Notes currently live only in tab memory and vanish on an accidental mobile refresh or back-swipe. Write drafts to `sessionStorage` and trigger a `beforeunload` warning before closing unsaved work.
* **Add one-click Markdown and text downloads.** Because browser tabs are not permanent notebooks, give users a single button that exports the parable reference, the diagram summary, and their written reflection as a clean `.md` file.
* **Link parable themes directly to Quran Concept Atlas.** When a user finishes reading a parable about charity or hypocrisy, provide a direct link to that specific concept node inside the Quran Concept Atlas for further study.

**4. Quran Memorization Workload Calculator**

* **Model the compounding revision curve.** As memorized pages grow, daily review time expands and crowds out new verses. Add a 90-day projection chart showing how revision time scales alongside new daily memorization.
* **Split revision into recent and long-term buckets.** Effective hifz separates the last seven days of new verses from older memorized juz. Let users allocate separate daily minute targets for new lines, recent review, and old cycles.
* **Export schedules as `.ics` calendar files.** Browser storage expires after 30 days of inactivity, which is too short for a memorization plan. Let users download a recurring `.ics` calendar file or a printable PDF checklist.

**5. Understand Salah Lab**

* **Group recitations by physical prayer posture.** Learners connect meanings faster when phrases map to physical movements. Organize the lab into a visual sequence covering Qiyam, Ruku, Sujud, Jalsa, and Tashahhud.
* **Break blocks into phrase-by-phrase cards.** Testing the entire translation of *At-Tahiyyat* at once overwhelms beginners. Split long supplications into three-word phrase pairs so users learn the exact meaning of each clause.
* **Add a toggleable transliteration layer.** Readers who are still slow with Arabic script need a bridge to connect the sounds they recite in prayer to the English meaning. Add an optional phonetic line above the translation.

Would you like me to write the updated HTML and CSS layout for the homepage or build out a prototype for one of these five apps?



After visiting all 15 individual app subdomains across `moongazer.tech`, one cross-site HTML issue stands out alongside the app-specific workflow bottlenecks: text nodes inside cards, headers, and badges frequently touch without whitespace in the DOM. Strings like `ExploreSources` in the top navigation, `AQuran 2:153`, `MakkahCity context`, `Case 01Early Makkah`, `The first revelationHira`, and `West AsiaPolitical change` run together for screen readers and text parsers. Adding space characters or visually hidden delimiters in your shared layout components will fix this across all 20 apps at once.

**Quran learning apps**

**1. Quran Connections (`quran-connections.moongazer.tech`)**

* **Deduplicate the puzzle bank from Quran Concept Atlas.** Puzzle 01 uses the exact same three verses, `2:153`, `16:127`, and `103:3`, and the same answer, `Patience`, as the first entry in Quran Concept Atlas. In fact, all 30 puzzles mirror the 30 Atlas themes. Draw from a second set of verse triads so users moving between the two apps do not already know the answers.
* **Show the shared Arabic root when Pickthall uses different English synonyms.** In Puzzle 01, Pickthall translates the root *sabr* as "steadfastness" in `2:153` and "endurance" in `16:127` and `103:3`, while the answer button says `Patience`. Highlight the shared Arabic root letters once the puzzle is solved so readers see the direct lexical link that 1930s English obscures.
* **Collapse the 30-button puzzle grid.** Rendering 30 separate buttons from `Puzzle 01` to `Puzzle 30` below the game board creates unnecessary scrolling. Replace that block with a compact dropdown or horizontal stepper that marks completed puzzles.

**2. Quran Concept Atlas (`quran-concept-atlas.moongazer.tech`)**

* **Add a visual node view or cross-theme links.** Despite the "Atlas" and "reading map" framing, the interface is a flat 30-card grid filtered by four broad tabs: `Character`, `Community`, `Reflection`, and `Worship`. Several themes share identical verses, such as `33:70` appearing in both `Truthfulness` and `Careful speech`, and `3:159` appearing in `Trust in Allah`, `Consultation`, and `Gentle responses`. Render clickable "Shared verse" links between those cards so users can traverse the collection like a true map.
* **Move the connection spoilers off the index cards.** The catalog cards already state the exact takeaway, such as telling the user that `2:183`, `2:184`, and `2:185` come from the fasting passage in Al-Baqarah, before they click `Explore theme`. Keep the index cards concise and save the editorial synthesis for the detail view.

**3. Stories of the Prophets Explorer (`stories-of-the-prophets-explorer.moongazer.tech`)**

* **Add a narrative pairing sort alongside the alphabetical list.** Sorting the 25 profiles strictly from `Adam` to `Zakariya` separates closely connected figures like `Harun` and `Musa`, `Ibrahim` and `Ismail`, or `Dawud` and `Sulayman`. Add a "Quranic pairings" view that groups prophets who appear in the same passages without asserting unverified calendar dates.
* **Deepen the comprehension checks on brief profiles.** On `/prophet/al-yasa/`, the reading check asks "Which other two names appear with Al-Yasa in 38:48?" directly underneath the two-line verse listing `Ishmael` and `Dhu'l-Kifl`. Replace simple name-spotting questions with prompts that ask the reader to compare both readings on the page, such as identifying the quality praised across `6:86` and `38:48`.

**4. Quranic Places Atlas (`quranic-places-atlas.moongazer.tech`)**

* **Plot regional labels on the map for the six "Regional reference" entries.** The SVG map displays only five numbered pins: `1` Makkah, `2` Madinah, `3` Al-Hijr, `4` Al-Masjid al-Aqsa, and `5` Saba. That leaves the six `Regional reference` entries, `Egypt`, `Mount Sinai`, `Midian`, `Al-Ahqaf`, `Arafat`, and `Safa and Marwa`, absent from the visual map alongside the four `Unpinned` entries. Render soft regional text labels or shaded areas for those six entries so two-thirds of the catalog is not missing from the map.
* **Fix merged text in the numbered map legend.** The accessible legend links concatenate the place name and its category badge into `MakkahCity context` and `Al-HijrHeritage context`. Add explicit spacing between the title and the badge.

**5. Revelation Context Explorer (`revelation-context-explorer.moongazer.tech`)**

* **Expand the "General context" and "Response after revelation" categories.** Out of the 10 total entries, seven fall under `Transmitted occasion`, while `Response after revelation` has two, `3:92` and `5:90`, and `General context` has only one, `2:144`. Add two or three more readings to those smaller categories so clicking the `General context` filter does not leave a nearly empty page.
* **Hide "Copy saved reading list" until an entry is saved.** The `Choose a record` label and `Copy saved reading list` button sit prominently above the catalog even when zero items are saved. Show the copy action only after the user clicks `Save for later` on at least one card.

**Seerah and history apps**

**6. The Seerah Detective (`the-seerah-detective.moongazer.tech`)**

* **Consolidate the 10 topic filters.** Offering 10 topic options, including single-event tags like `Uhud`, `Hudaybiyah`, and `Khaybar`, for only 12 cases means most filters return just one card. Filter by the five chronological era badges already printed on the cards, `Early Makkah`, `Late Makkah`, `Hijrah`, `Early Madinah`, and `Later Madinah`, instead.
* **Embed the primary hadith excerpt inside the case view.** A footnote warns that "Evidence cards are concise editorial paraphrases. Open their references to read the full reports." Because the app teaches close reading of what a report actually says, display the quoted report text directly beneath each editorial summary card so players do not have to leave the page to inspect the wording.

**7. Interactive Seerah Timeline (`interactive-seerah-timeline.moongazer.tech`)**

* **Anchor the "A closer look" inspector beside the timeline.** In the document flow, the `A closer look 1 / 36` detail card renders at the very bottom of the page after all 36 moments from `c. 610 CE` to `11 AH`. Clicking an early Makkan event forces mobile users to scroll past 35 cards to read the source panel. Render this inspector as a sticky side panel on desktop and a pop-up drawer on mobile.
* **Separate concatenated dates, titles, and places.** Event links and headers run together as `The first revelationHira ↗` and `c. 610 CEHira`. Insert a separator dot and whitespace between the date, the title, and the location tag.

**8. Islamic Civilization Timeline (`islamic-civilization-timeline.moongazer.tech`)**

* **Replace the twin 24-item dropdowns with card-level compare toggles.** The "Compare two date bands" section uses two identical `<select>` menus, `First record` and `Second record`, listing all 24 titles without their dates or regions. Let users click a "Compare" toggle directly on any two timeline cards, or prefix each dropdown option with its century and region, such as `661 CE · West Asia · A caliphate centered on Damascus`.
* **Broaden sources beyond UNESCO and the Met.** All 24 records cite either UNESCO or the Metropolitan Museum of Art, which tilts the timeline heavily toward architecture and museum objects. Add primary institutional records from manuscript libraries, such as the Qatar Digital Library or the British Library, to give the `Learning` and `Trade` categories richer textual coverage.

**Prayer and everyday practice apps**

**9. Everyday Akhlaq (`everyday-akhlaq-simulator.moongazer.tech`)**

* **Reduce the 11 setting filters to four core groups.** Splitting 20 scenarios across 11 filter pills, `Online`, `Study`, `Friendship`, `Family`, `Self-control`, `Work`, `Neighbors`, `Community`, `Giving`, `Daily life`, and `Money`, leaves several tabs with only one or two cards. Group them into `Family & home`, `Study & work`, `Friends & neighbors`, and `Online & public life`.
* **Replace repetitive card subtitles with ethical theme tags.** Every single card repeats the exact line `Two decisions · about 3 minutesExplore this moment →`. Move the "Two decisions, about 3 minutes" note to the page subtitle and use the card footer to show whether the user has completed the scenario.

**10. Halal Business Decisions (`halal-business-decisions.moongazer.tech`)**

* **Resolve scenario duplication with Everyday Akhlaq.** Case 7, `The friendly loan with no record`, duplicates the `A loan between friends` scenario in Everyday Akhlaq. Keep informal peer loans in Everyday Akhlaq and replace that slot here with a commercial partnership or supplier credit scenario.
* **Make the opening case summaries less one-sided.** Titles like `The underfilled spice packet`, where 500 g bags hold 470 g, or `A repair hidden under fresh paint` telegraph the wrong choice immediately. Frame the opening prompt around realistic operational friction, such as discovering a batch weight variance after packaging, so the two decision steps feel like a genuine test of judgment.

**11. Islamic Misinformation Casebook (`islamic-misinformation-casebook.moongazer.tech`)**

* **Show the two evidence cards open by default.** On individual case pages like `/case/truth-habit/`, the user starts with `0 of 2 evidence cards open` and must click to reveal two single-sentence summaries before choosing a conclusion. Since each card is only one sentence long, render them open alongside the primary text of `Sahih al-Bukhari 6094` so the user can focus on evaluating the claim.
* **Rewrite the copied correction snippet for real conversations.** The `Copy correction with references` button copies stiff disclaimer prose: "Sahih al-Bukhari 6094 praises truthfulness and warns about lying. The exercise does not decide the moral state of a named person or resolve every exceptional legal discussion about speech." Strip the meta-disclaimer from the clipboard output and copy the claim, the exact source citation, and the one-sentence correction so people can paste it into a group chat.

**Games and family activities apps**

**12. The Islamic Knowledge Escape Room (`islamic-knowledge-escape-room.moongazer.tech`)**

* **Differentiate the 8 rooms from the Quran Concept Atlas themes.** All eight rooms, `Patience`, `Gratitude`, `Justice`, `Mercy`, `Learning`, `Keeping commitments`, `Hospitality`, and `Careful speech`, reuse the exact titles and passages from Quran Concept Atlas. Give each room an engaging setting and mix Quran, Seerah, and chronology locks inside a single room so it feels like a synthesis challenge across the whole site.
* **Label the four lock diamonds by puzzle type.** Each room card displays `◇ — ◇ — ◇ — ◇` under the description. Label those four slots `Read`, `Connect`, `Arrange`, and `Recognize`, and fill them in as `◆` when the user unlocks each step in `localStorage`.

**13. Islamic Concept Connections (`islamic-concept-connections.moongazer.tech`)**

* **Fix the unmarked Surah-name overlap on Board 1.** Board 1 includes `The Ant`, `The Cow`, `The Spider`, `The Bee`, `Night`, `Iron`, `Sun`, and `Moon`. All eight of those English words are names of Surahs in the Quran, even though the board expects players to put `Iron` with metals and `Night`, `Sun`, and `Moon` with celestial bodies. When a board contains valid cross-categories of four items, either swap out the overlapping tiles or display a custom toast acknowledging the valid alternate connection without counting a miss.
* **Show solved status across all 16 boards.** A single `<select>` menu for `Board 1` through `Board 16` hides which boards a player has finished. Render a 16-pill selector bar that highlights completed boards.

**14. Islamic History Timeline Challenge (`islamic-history-timeline-challenge.moongazer.tech`)**

* **Collapse the source clues until requested.** Although each card has an `Open source clue` label, the full summary and hadith citation render visibly in the card body right away. Reading that Aisha's report describes "the beginning of revelation in the cave of Hira" makes placing `The first revelation` trivial. Hide the summary text behind the `Open source clue` toggle so players test their recall first and open clues when stuck.
* **Add drag-and-drop and keyboard arrows alongside the button controls.** Moving a card from Position 4 to Position 1 requires clicking the `↑` button three separate times as the DOM re-renders. Keep the `↑` and `↓` buttons for screen readers, and add pointer drag-and-drop for touch and mouse users.

**15. Family Islamic Learning Challenges (`family-islamic-learning-challenges.moongazer.tech`)**

* **Preview the source reading and activity type on the catalog cards.** The hero promises "one reading question, an open conversation and a shared activity", but the 12 catalog cards display only the conversation prompt. Add the verse or hadith reference badge and a short activity tag to each card so parents can pick a pack based on what their children want to do.
* **Add a batch print view on the catalog page.** The header highlights `Print or use one shared screen`, yet parents have to open packs one by one to print them. Add a `Print saved packs` button next to `Copy saved reading list` with an `@media print` stylesheet that formats selected packs cleanly onto a single page.