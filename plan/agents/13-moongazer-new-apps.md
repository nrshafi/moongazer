# Brief 13 — Moongazer: new apps (Quran Words, Names of Allah, Alif Ba)

> **Superseded (11 November 2026):** this file is background only. The authoritative execution plan is [`plan/implementation/00-INDEX.md`](../implementation/00-INDEX.md). Where they differ, the implementation plan wins.

**Repository:** `I:\Development\moongazer`
**Depends on:** 08 (the new shell). The Zakat Calculator is in brief 11. **Authorized:** ask the owner, one app at a time.
**Goal:** add the apps people already look for and that create a daily habit, bringing the collection back to twenty distinct apps.
**Background:** `../REPORT.md`, A9 (what each must have, and its main risk).

## Common setup for each new app

- **Create the folder.**
  - Copy the current shell, styles, helpers and stack pins from an existing app (Astro 7.4.2, Bun 1.4.4, TypeScript 6.0.3, @astrojs/check 0.9.12).
  - Use the next free port (4342 onward; 4341 is the Zakat Calculator).
  - Add `AGENTS.md` and six filled context files, following the existing per-app pattern.
  - Add a distinct logo: a glyph only, no people or animals.
- **Register it** in `deployment/targets.json`, the root verification scripts (`_implementation/verify.ts` app list), the GitHub Actions deployment list, the SEO validator, the directory and the root `context/project-overview.md`.
- **Hosting.** The Pages project, custom domain and DNS are created only when the owner asks to publish.
- **Storage:** opt-in, namespaced, validated, 30-day access-time rule, documented keys.
- **Verify** with the checklist in `00-START-HERE.md`, plus tests for every pure module.

## 1. Quran Words (vocabulary trainer)

- **Licensing first.** Decide the word-list source.
  - The Quranic Arabic Corpus morphology data is GPL-licensed: check whether using it is compatible with this project. If not, prepare an own frequency list from the canonical text through Quran MCP.
  - Record the decision and licence in context before building.
- **Content:** words in frequency order; each word has its meaning (reviewed) and links to example ayat from `quran-full.json`, with Arabic exact and Pickthall exact.
- **Engine:** spaced repetition in local storage (a review queue with due dates) as a pure, tested module. Daily goal of five minutes. Export and backup to a file, and import from it.
- **First screen:** "Today: 12 reviews, 5 new words", then the card.
- **Meanings need review** before launch. Record who reviewed them, only if that happened.

## 2. Names of Allah

- **Sourcing.** Each name appears with its Arabic, a meaning, and the Quran ayat where it occurs (from the canonical corpus, exact).
- Scholars discuss the enumerated list of 99 found in some narrations. Present the names with their Quran references and explain the list question honestly. Do not present one enumerated list as unquestioned.
- **Activities:** flashcards, a reflection prompt per name, and a family activity. A daily name on the directory's "Tonight" strip is optional.
- **Review:** meanings and reflections need a qualified review before launch.

## 3. Alif Ba (Arabic letters for Quran reading)

- **Content:** the 28 letters, their positional forms, short vowels, sukun and shadda, joining, and simple words taken from the Quran (exact text).
- **Interaction:** tap to hear, tracing practice on a `<canvas>` with pointer and touch, a letter-recognition game, and progress per letter.
- **Audio:** letter audio must be recorded by the owner or a teacher, or licensed. Record the licence. No music or bells.
- **Review:** a qualified teacher checks pronunciation guidance before launch.
- **Accessibility:** large touch targets, both themes, reduced motion, RTL letter rendering with `lang="ar"`.

## After each launch

- Update the directory hero count and copy ("17 free apps", and so on) truthfully, the subject guides, and the short links (`/words`, `/names`, `/alif-ba`) in `homepage/_redirects`.
- Record tracker entries and update `00-START-HERE.md`.

Do not push or publish without the owner's request.
