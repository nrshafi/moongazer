# P8 — Diagnostic Mastery Loop

**Branches:** `phase-8-mastery-engine` (engine, from 7 Dec), then one app branch per app (`phase-8-<slug>`) · **Release:** with R7 (before the freeze) · **Depends on:** P2 merged (engine); P5 merged (UI integration); question banks from the content track (C6, C9, C13, C15)
**Goal:** study apps teach instead of only quizzing: a short diagnostic, cards only for what the learner missed, then a final check (D11).
**Apps:** Understand Your Salah, Stories of the Prophets, Why It Was Revealed, Everyday Akhlaq.

## The loop

```
Open module → Diagnostic (3–5 questions)
   ├─ all correct → Fast-track pass: "You know this" + advanced notes (tafsir/hadith links) → Mastered
   └─ some missed → Targeted cards (only for missed concepts; Arabic first, tap to reveal meaning)
                    → Final check (re-test missed concepts with a variant question where one exists)
                         ├─ all correct → Mastered
                         └─ still missed → show the card again + "Try again later" (no penalty) → module stays "In progress"
```

Rules: never force a learner who passes the diagnostic through the cards; questions must not be answerable from text printed beside them (A0 #4 lesson); every question and card cites its source; scores are private and local; no streak pressure, no public ranks.

---

### T8.1 Context and data contract
Lane: app (engine branch) · Files: `context/architecture.md` (root: the shared mastery module and its "mastery set" sync rule), each of the four apps' `context/architecture.md` (storage key `mastery-<moduleId>`), `plan/implementation/P8-mastery-loop.md` (this file, only if the contract changes)
Data contract added to each app's `src/data/content.json` (so the static verifier checks any canonical text inside):
```json
"mastery": {
  "modules": [{ "id": "fatiha", "title": "Al-Fatiha", "diagnostic": ["q1","q2","q3"], "advanced": [{"label":"…","url":"…"}] }],
  "questions": [{ "id": "q1", "concept": "c1", "prompt": "…", "options": ["…","…","…"], "answer": 1,
                  "variantOf": null, "source": {"ref":"1:2","label":"Quran 1:2"} }],
  "cards": [{ "id": "c1", "title": "…", "body": "…editorial…", "passage": {"ref":"1:2","arabic":"…","translation":"…"},
              "sources": [{"label":"…","url":"…"}] }]
}
```
Each concept has one card; each diagnostic question names its concept; a variant question (`variantOf`) is used in the final check when present.

### T8.2 Pure engine
Lane: app (engine branch; file lives in `apps/understand-your-salah/src/lib/mastery.ts` first, then copied identically to the other three apps) · Files: `src/lib/mastery.ts`, `tests/mastery.test.ts`, `_implementation/sync-shared.ts` (add a "mastery set" checked across the four apps)
API: `start(module)`, `answerDiagnostic(state, qId, choice)`, `afterDiagnostic(state)` → `fast-track | cards(conceptIds)`, `finalQuestions(state, bank)`, `answerFinal(state, qId, choice)`, `result(state)` → `mastered | in-progress`, `validState(value)`. Pure, no DOM, no storage.
Tests: all-correct fast track; one miss → one card → final variant → mastered; still missed → in-progress; invalid saved state rejected; question order shuffle is seeded and stable on resume.
Verify: V1 in four apps; V3 (mastery set identical).

### T8.3 UI component (per app, same markup)
Lane: app (per app, after P5) · Files: `src/lib/mastery-ui.ts` (identical copies, add to mastery set), app CSS
Renders the three steps in the app's existing panel styles; Arabic first with "Show meaning" toggle; progress dots; keyboard operable; `aria-live` status for results; uses `track()` for `activity_started` (first diagnostic answer) and `activity_completed` (mastered or fast-track), item id = module id. Saved state only when the visitor has opted into saving (existing app toggle).

### T8.4 Understand Your Salah: course + loop
Lane: app:`understand-your-salah` · Depends on: T8.2, T8.3, C13 · Files: `src/pages/index.astro`, `src/pages/lesson/[id].astro`, `src/pages/course/index.astro` (new), `src/lib/*`
1. "Your prayer, step by step": a vertical path from takbir to salam ("Lesson 4 of 15" progress, saved when opted in).
2. Each lesson page: Arabic large, phrase-by-phrase tap-to-reveal meaning (C13 phrase data), an "Approximate Roman guide" toggle (off by default; the existing transliteration), per-ayah Al-Fatiha audio (C13 cuts, licence/attribution on each file), then the module's loop.
3. Printable pocket card (all phrases with meanings, print CSS).
4. Update descriptor to "The meaning of every phrase you say in prayer" only when C13 marks coverage complete.

### T8.5 Stories of the Prophets: loop per prophet
Lane: app:`stories-of-the-prophets` · Depends on: T8.2, T8.3, C6 · One module per prophet (25), 3 diagnostic questions each. Show "7 of 25 mastered" on the home grid (local state). Fix the "Next profile" order contradiction while here (conventional order with an A–Z toggle).

### T8.6 Why It Was Revealed: loop per reading
Lane: app:`why-it-was-revealed` · Depends on: T8.2, T8.3, C9 · One module per reading (30), 2–3 questions that ask what is not printed on the page before the reveal (for example "Which ayah does this report concern?"). Replaces the old category quiz.

### T8.7 Everyday Akhlaq: loop per track
Lane: app:`everyday-akhlaq` · Depends on: T8.2, T8.3, C15 · One module per track (Home & family, Study & work, Business, Friends & online if it ships): diagnostic questions on the principles in the track's cited ayat/hadith; cards explain the principle with sources; offered after finishing a scenario ("Check what you learned").

### T8.8 Verification
Lane: per app · V1, V5, V7 (complete one module via fast track and one via cards; blocked storage). Record in each app tracker. Merge with R7.
