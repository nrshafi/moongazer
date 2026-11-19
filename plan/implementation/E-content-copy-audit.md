# E: Content copy audit and rewrite track

The owner supplied a content audit on 20 November 2026 (Asia/Dhaka) and asked for it to be considered alongside the D track. It is saved verbatim in `E-content-audit-source.txt`. Its Part 1 is the audit; Part 2 is six copy-paste prompts with exact replacement copy.

This file holds the orchestrator's notes. Where they differ from the source prompts, these notes win, because the prompts were written without the project rules or the in-flight P8 work.

## 1. Claims checked (20 Nov 2026, `main` 209d851)

| Claim | Status |
| --- | --- |
| Family Halaqa methodology says "Twelve" packs | Confirmed. There are 42 packs. |
| Word Groups methodology names "Quran Connections" (the old name of Ayah Threads) | Confirmed: one occurrence. |
| Zakat `content.json` ships build-log keys (`task`, `quranMcpCalls`, `copiedFrom` and so on) | Confirmed. They are nested under `method`, not at the top level. No code in `apps/zakat-calculator/src` or `_implementation` reads them by name, but re-check with grep before removing anything. Research logs belong in `_implementation/research/`. |
| `homepage/seasonal.json` has an internal `note` field | Confirmed (keys: `note, start, end, eyebrow, title, text, href, action`). |
| Defensive and disclaimer-heavy prose, and one formula for every SEO title | Agreed in spirit. It overlaps D-audit §1.3 ("Disclaimer fatigue"). |

## 2. Adaptations required by the project rules

1. **No new factual or religious claim without a source.** Several pieces of replacement copy add claims the app's cited sources may not support. Each must be checked against the app's existing sources before it ships, or cut back to what the source says. Examples:
   - **Salah, `closing-salam` note:** "to the angels". Muslim 431, as cited, is about the brother on the right and the left.
   - **Salah, `opening-takbir` note:** cites "Sahih Muslim 601". Check the number.
   - **Salah, `bowing` note:** "declaring Allah free of all imperfection". The re-check already failed this exact claim in the mastery bank.
   - **Civilization Timeline:** "North Africa's earliest major Islamic city".
   - **Places in the Quran:** "held back both sides from fighting in the valley" must match the tafsir.
   - **Parables:** any new imagery in `nodes[].detail`.

   All E-track copy that states a fact goes through the content-track second pass (C §3) on Grok, the same as the mastery banks.
2. **Counts come from the data at build time, never from the prompt.** The prompt's numbers are a snapshot:
   - 42 packs;
   - 36 moments;
   - 24 milestones;
   - 50 passages;
   - 12 sayings;
   - 14 parables;
   - 10 readings.

   Why It Was Revealed goes to 30 readings when C9's +20 lands. Read each count from `content.json` when writing, and prefer wording that does not hard-code a number where a test or SEO check would go stale.
3. **Copy must match what is on `r8`, not what was on `main`:**
   - **Stories of the Prophets:** the per-prophet "reading check" was replaced by the mastery loop (T8.8a). Copy should say "check what you learned", not "a short reading check".
   - **Why It Was Revealed:** the old category quiz is gone. Its check lives at `/check/<id>/`.
   - **Understand Your Salah:** it now has `/course/`, lesson pages with the loop, and a pocket card.
4. **The "not a ruling" lines stay, with calmer wording.**
   - **Zakat:** keep "not a formal fatwa" (D23).
   - **Akhlaq:** keep "scenarios are not rulings".
   - **Family Halaqa:**
     - Keep the child-privacy intent ("use made-up examples"), because the project is anonymous-first with no child profiles.
     - The repetition can go.
     - Move one plain statement to the methodology and the Sources page.
5. **Honorifics.**
   - Write ﷺ after the Prophet Muhammad in editorial text.
   - Write "(peace be upon him)" after every other prophet named. For example, the Escape Room hospitality room says "Ibrahim's welcome", which needs it.
   - SEO titles that contain ﷺ: check that `seo.ts` and the sitemap tests render them. Otherwise move ﷺ to the description.
6. **SEO length and tests.** Several proposed titles exceed ~60 characters, for example "Seerah Detective: Primary-Source Cases from the Prophet's Life ﷺ | Moongazer". Run `bun test _implementation/seo.test.ts` and the per-app SEO checks, and shorten titles where needed.
7. **Canonical text.** Never touch `arabic`, `translation`, `ref`, `url`, `translationUrl`, `sources`, `answer` indices or IDs.
   - Every edited `content.json` needs its `appContentSha256` updated (LF-normalised, as `verify-static.py` computes it).
   - Run `python _implementation/verify-static.py` and `PYTHONIOENCODING=utf-8 python _implementation/audit-text-joins.py --summary`.
   - A script must prove that no protected field changed (compare old and new JSON).
8. **Writing style.**
   - Apply the `unslop` skill's rules and the source's banned-phrase list to all rewritten copy.
   - Lead with the subject: the history, the verse or the situation.
   - Keep the institution named in the source line, not as the opening words.
9. **Salah lesson quiz options (Prompt 5, file 2).** These are the lesson quiz in `content.json`, separate from the mastery bank. Two rules for them:
   - **Distractors:** the same rules as the bank (plausible misreadings, no absurd options, the key ≤ 1.3× the longest distractor).
   - **The `answer` index:** keep it, and verify by script that the keyed text matches the intended meaning.
   - If the course or lesson pages on `r8` no longer show this quiz, drop that part of the prompt.

## 3. Sequencing: after R8, before the freeze

The E track rewrites `content.json`, `learning.json` and `seo.json` in most apps. It collides with:
- the open C13 (Salah) and C6 (Stories) bank branches, which both edit `content.json`;
- D3b and D4, which edit the same apps' pages.

So E runs **after R8 merges**, as its own release (R9). Exception: E1, the production bugs and leaks, is small. It may ride in R8 if it lands after the C13 and C6 merges.

| WP | Source prompt | Scope | Implementer | Check |
| --- | --- | --- | --- | --- |
| E1 | Prompt 1 | Zakat build-log keys (move to `_implementation/research/zakat/` if useful) and disclaimer; Family Halaqa and Word Groups methodology; `homepage/seasonal.json` and `ramadan-content.json` internal fields | Haiku | Orchestrator diff review: no protected field changed; `verify-static`; homepage build and tests |
| E2 | Prompt 2 | `homepage/collections.json` copy | Haiku | Orchestrator review: claims match each app on `r8`; honorifics |
| E3 | Prompt 3 | SEO titles and descriptions, in `deployment/seo-catalog.json` and the 17 `seo.json` files | Haiku | `seo.test.ts`, title length, counts read from data |
| E4 | Prompt 4 | Learning-guide summaries, in `deployment/learning-guides.json` and the 17 `learning.json` files | Haiku | Matches the features on `r8` (mastery loop, `/check/`, `/course/`) |
| E5 | Prompt 5 | Escape Room room descriptions; Salah lesson-quiz options, notes and methodology | Haiku writes, Grok second pass | C §3 second pass on every factual note; distractor rules |
| E6 | Prompt 6 | Tone pass:<br>• Family Halaqa (42 packs)<br>• Civilization Timeline<br>• Ayah Threads explanations<br>• Places<br>• Parables<br>• Why It Was Revealed<br>• Akhlaq | Haiku per app (disjoint apps), Grok second pass | C §3 second pass on all new factual sentences; protected-field diff script; full gate |

Each E worker works in its own worktree branched from the post-R8 `main`. It follows `briefs/haiku-worker-brief.md` plus §2 above, and commits per file group. Reports list every factual sentence added, so the second pass can check them.
