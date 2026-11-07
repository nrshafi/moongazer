# Brief 04 — Booktube: rewrite skills, channel profiles and docs

**Repository:** `I:\Produce_AB\booktube`
**Depends on:** 01. It can run alongside 02 and 03 because it touches only Markdown under `.agents/skills/`, `docs/`, `README.md` and `renderer/README.md`.
**Authorized:** yes.
**Goal:** every skill an agent loads applies the Islamic guidelines, and the five channel profiles are halal in purpose, framing and monetization.
**Background:** `../REPORT.md`, B1 (the flag table) and B4 ("Rewrite").

Read each skill fully before editing. Keep each skill's structure, tone and useful craft advice; change only what conflicts with the guidelines. Every skill gets this line near the top:

> Apply `context/islamic-guidelines.md` before planning, scripting, choosing visuals or sound, writing titles, thumbnails or descriptions, or arranging income. Remind before RED or AMBER items; never produce RED items.

## Stage skills

1. **`booktube-operator/SKILL.md`**
   - L6: read `context/islamic-guidelines.md`, then `AGENTS.md` and `context/progress-tracker.md`.
   - Add a step 0, "Classify the request": topic, visuals, sound, title and income each get RED, AMBER or GREEN. RED: remind, refuse, offer the halal version. AMBER: remind, ask, record in `context/islamic-decisions.md`.
   - Before recording `approve-plan`, ask the owner to confirm the Islamic screen of the book and episode map.
   - Attest lists include `islamic`.
2. **`booktube-research/SKILL.md`**
   - Quran only from Quran MCP or quran.com, with surah:ayah and the translation named. Hadith with collection, number and grading from sunnah.com.
   - Book permissibility check before import (guidelines §3).
   - Named-person conditions (§3 AMBER): every negative claim needs a primary source in `sources.md`.
   - L66: attest list includes `islamic`.
3. **`booktube-audio-script/SKILL.md`**
   - L49 (SFX): "none by default; at most one or two plain non-musical effects; never bells, chimes, risers or meme sounds".
   - L50 (music): replace with "No music. There is no music bed; specs with `music` are refused."
   - Remove the `# music:` example (L37).
   - Add: no comment bait or "trigger" pinned comments; hooks must be honestly paid off.
4. **`booktube-video-direction/SKILL.md`**
   - Add a "No living beings" section (guidelines §4), with the list of allowed visuals.
   - L79: "At least one licensed photo or illustration" becomes "at least one licensed photo or illustration of an object, place, plant or document".
   - Openverse results are checked by eye for people and animals.
   - Thumbnails are typographic or object-based, with no faces.
   - Remove the frozen-composition list (L116) and any instruction to add `<Audio>` for music.
5. **`booktube-review/SKILL.md`**
   - Step 2 (script, L31-39): check topic tier, Quran/hadith verification, named-person conditions, finance framing and honest hooks.
   - Step 3 (final media, L43-51): no people or animals in any frame or thumbnail; no music, bells or meme sounds; honest title and description; no haram sponsor or link.
   - Step 5 (project review, L75-83): the same checks.
   - Step 6 (gates, L85-92): attestations include `islamic` for `approve-script`, `approve-video` and `approve-project`.

## Channel profiles (each `SKILL.md` plus `references/ideas.md`)

1. **`consumer-finance-math` → halal money math.**
   - New purpose line: the true cost of debt, interest and waste; saving and investing without riba; zakat arithmetic.
   - Replace "Why it monetizes" (L11, brokerages, refinancing, credit cards, insurance) with "Halal sponsors only (guidelines §8)".
   - Replace the default opportunity-cost benchmark (L29-38, "S&P 500 at 8%", "VOO") with "a Shariah-screened global equity index at an illustrative rate, stated as illustrative, not a forecast".
   - Remove the "comment bait" instructions (L41-42, L107).
   - Ideas:
     - Delete ideas that recommend riba products, conventional insurance or unscreened funds. Examples: #12 T-bills and index funds, #17, #20 high-yield savings interest, #23 dividend stocks unscreened, #42 529 plan, #50 401(k) loan, #6's "indexing the rest", #36 pet insurance as a product choice, #43 crypto mining.
     - Rewrite warning-type ideas so they warn: #1 and #26 leasing costs, #18 84-month auto loans, #34 0% APR traps, #48 lottery, #4 credit-card cashback as a debt trap, #2 renting vs mortgage with halal home-finance alternatives.
     - Add halal ideas: the cost of a riba loan vs saving first, zakat on savings explained with numbers, israf audits.
   - The Porsche "absurd foil" is fine if it critiques waste, not people.
2. **`neuro-hijack-autopsy`.**
   - Keep the recovery purpose. It aligns with lowering the gaze (Quran 24:30).
   - Replace the vocabulary-matrix rationale (L14-25, L160, `ideas.md` L5 "bypass YouTube's adult-content filters") with "Use clean, modest language because it is right; never explicit words or imagery."
   - L12: keep halal tools (habit trackers, filters) as disclosed affiliate options; remove "full Tier-1 ad rates" framing.
   - Delete:
     - the "Skeptic Debate" comment trap (L63-68)
     - the invented "Guaranteed 70%" claim (L141); figures need sources
     - idea #38 (alcohol)
   - Rewrite:
     - #49's "instrumental/brown-noise audio" as "silence or natural sound"
     - #25 so it no longer mentions music
     - #7's "sensual short-form video reels" as "attention-grabbing short videos"
   - L150 "knife to a gunfight": optional rewording.
3. **`tech-sacred-cows`.**
   - Keep honest benchmarks framed as moderation over status.
   - Remove "Plant the tribal comment trap" (L38-39, L104) and "mock the status-seeking motive" (L56, L92).
   - Remove ideas whose point is music listening (audiophile DACs, headphones for music).
   - Gaming-gear ideas are AMBER: no games with haram content in visuals or recommendations.
4. **`business-guru-fact-checks`.**
   - Keep fact-checks of public claims under guidelines §3 (named people, AMBER).
   - Remove "LinkedIn defender trap" (L36-37) and "pinned comment designed to trigger fans" (L102).
   - In `ideas.md`, delete or rewrite unverified or mocking items: the Maslow "stole" claim (L25) unless a primary source supports it; "permission slip to bully" (L37); "standing like Wonder Woman" (L17); "ruthless perfectionism and ego" (L25); the unsourced "Over 95% of creators" (#24, L28).
   - The Kiyosaki court-record idea stays only with primary court sources and neutral wording.
   - The Law of Attraction critique (#32) is GREEN.
5. **`curiosity-remotion-shorts`.**
   - L28: "2-3 SFX total" becomes "none by default; at most one or two plain effects".
   - Add: no animals or people in visuals; nature science uses landscapes, diagrams and objects.

## Docs that list attestations or audio rules

Add `islamic` to the attest lists in `README.md` (L117, L155), `docs/production-walkthrough.md` (L126, L140) and `docs/project-workflow.md` (L87).

Remove music-bed and frozen-composition guidance from:
- `docs/AUDIO_CAPTION_SYNC_STANDARD.md`
- `renderer/README.md`
- `renderer/src/sfx-registry/README.md` (if not already done in 02)

## Acceptance

- `grep -rni "comment trap\|comment bait\|trigger fans\|bypass\|licensed track\|music bed" .agents docs README.md renderer/README.md` returns nothing that permits or instructs those things.
- Each of the ten skills edited in this brief carries the guidelines line.

Record a progress-tracker entry and update `00-START-HERE.md`.
