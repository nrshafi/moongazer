# P5 — Activity-first shell, DESIGN.md files and the directory front door

**Branch:** `phase-5-shell` · **Target:** 14–27 Dec 2026 · **Release:** R5 · **Depends on:** P4 merged
**Goal:** on a phone every app shows something to tap on its first screen; each app looks like itself within one family system; the directory becomes a front door with short links.
**Background:** `plan/REPORT.md` §A6, §A7, §A4 (families); `plan/DESIGN_RECOMMENDATIONS.md` (archetypes, layouts; **colours and fonts per D20 only**); `plan/Verify_Me.md` (triage appendix).

## Design rules for this phase (D20)

- **Colour = subject family.** Use the family tokens below. Do not use the per-app palettes in `DESIGN_RECOMMENDATIONS.md` §3.
- **Layout = archetype.** Use the archetype assigned in `DESIGN_RECOMMENDATIONS.md` §3 for layout, components and motif only.
- **Fonts:** DM Sans, Newsreader, Amiri, plus JetBrains Mono (local WOFF2, OFL) for small metadata chips in Playboard and Dossier apps only.
- **Aniconism and sound:** no people or animals in any image, icon or motif; no sound at all in this phase.
- **Brands:** the company names in `DESIGN_RECOMMENDATIONS.md` are mood references. Never copy their logos, wordmarks, illustrations or exact layouts.

### Family assignment and tokens

| Family | Apps (folders) | Light `--accent` / `--accent-hover` / `--tint` | Dark `--accent` / `--accent-hover` / `--tint` |
| --- | --- | --- | --- |
| Quran (teal) | guess-the-surah, ayah-threads, word-groups, is-it-in-the-quran, stories-of-the-prophets, parables-of-the-quran, places-in-the-quran, why-it-was-revealed | `#087f75` / `#06665f` / `#e5f3ef` (existing) | `#78d4c2` / `#9ce7d7` / `#203d3c` (existing) |
| Seerah & history (gold) | seerah-timeline, seerah-detective, civilization-timeline | `#b8860b` / `#996f08` / `#fef8eb` | `#e5b94e` / `#f0cc75` / `#332b1f` |
| Worship & daily life (blue) | understand-your-salah, hifz-planner, everyday-akhlaq, (zakat-calculator) | `#2563eb` / `#1d4ed8` / `#eff4fe` | `#60a5fa` / `#93c5fd` / `#1c283f` |
| Family & group (violet) | family-halaqa, quran-escape-room | `#7c3aed` / `#6d28d9` / `#f3effc` | `#a78bfa` / `#c4b5fd` / `#2c1e42` |

Full light/dark sets (`--bg`, `--surface`, `--ink`, `--muted`) are in `DESIGN_RECOMMENDATIONS.md` §4. **Every text/background pair must reach 4.5:1** (3:1 for ≥24 px or bold ≥18.66 px). Gold `#b8860b` on white is below 4.5:1 for body text: add `--accent-ink` per family for text use (for gold light, a darker value such as `#7a5a00`; compute and record the ratio), and use `--accent` only for fills, borders and large text. Record every computed ratio in `DESIGN.md`.

### Archetype assignment (layout only)

| Archetype | Apps |
| --- | --- |
| Playboard | Guess the Surah, Ayah Threads, Word Groups |
| Scriptoria | Stories of the Prophets, Parables, Why It Was Revealed |
| Dossier | Is It in the Quran?, Places, Seerah Timeline, Seerah Detective, Civilization Timeline |
| Sanctuary | Understand Your Salah, Hifz Planner, (Zakat Calculator) |
| Hearth | Quran Escape Room, Everyday Akhlaq, Family Halaqa |

---

### T5.1 Context first
Lane: shared · Files: `context/ui-context.md`, `context/architecture.md`
Add: the activity-within-600 px rule (first control/card top ≤ 600 px at 390 × 844 and 375 × 812); the "How this works" drawer pattern; the end-of-session pattern; family tokens and archetypes (D20); JetBrains Mono scope; per-app motif rule; "no images of people or animals; no music or bells" as a UI rule; projector/print rules; short links in `homepage/_redirects` (architecture).

### T5.2 Root and directory DESIGN.md
Lane: shared · Depends on: T5.1 · Files: `DESIGN.md` (repo root, new), `homepage/DESIGN.md` (new)
Root `DESIGN.md` sections: purpose and how to use; Islamic visual rules (aniconism, no sound, honorific rendering, Arabic typography: Amiri 1.6–1.8 rem, line-height ≥ 1.9, `lang="ar" dir="rtl"`); token tables per family with computed contrast ratios; typography scale (H1 phone ≤ 2.1 rem, desktop ≤ 3.2 rem; body 1 rem/1.6); spacing and radius (existing values from `ui-context.md`); the five archetypes with their screen-1 phone wireframe (ASCII), component list and states (default, hover, focus-visible, selected, correct, incorrect, disabled); shared components (header, drawer, session end, feedback, honorific, print/projector); motion (≤ 250 ms, `prefers-reduced-motion` disables); accessibility checklist. `homepage/DESIGN.md`: hub layout (sections in order from T5.14), night-sky identity, card anatomy, chips, tonight tray, seasonal slot.
Acceptance: no colour or font outside D20; every token pair has a recorded ratio.

### T5.3 Per-app DESIGN.md (16 apps)
Lane: app (one per app; parallel) · Depends on: T5.2 · Files: `apps/<slug>/DESIGN.md` (new)
Each file (≤ 1 page): family and tokens (reference root, no new colours), archetype, motif description (what object/geometry, why), screen-1 phone layout (ASCII, with the measured target ≤ 600 px), component states specific to the app, what lives in the "How this works" drawer, session-end content, print/projector behaviour, Depth Gate target (copy from `00-INDEX.md` §4). Add `DESIGN.md` to the app's `AGENTS.md` read list.

### T5.4 JetBrains Mono, locally
Lane: shared · Files: `apps/<playboard and dossier apps>/public/fonts/JetBrainsMono-*.woff2`, licence file, `_implementation/research/fonts/` record
Steps: obtain JetBrains Mono from the official JetBrains release (GitHub `JetBrains/JetBrainsMono`), keep OFL licence text next to the font, subset to Latin + digits + punctuation as WOFF2 using the same approach recorded in `_implementation/research/fonts/` for the existing fonts, add `@font-face` with `font-display: swap`. Only the 8 Playboard and Dossier apps get the file.
Acceptance: font loads locally (no external request); licence present.

### T5.5 Family tokens per app
Lane: shared (global.css is per-app but edited in this lane) · Depends on: T5.2 · Files: `apps/*/src/styles/global.css`, `apps/*/src/data/config.json` (`accent` value → `teal|gold|blue|violet`), `Shell.astro` theme-color map (add gold)
Steps: set each app's family tokens for light and dark; add `--accent-ink`; replace uses of `--accent` for small text with `--accent-ink`. Update the theme-color mapping from T1.2.
Verify: V2, V3; contrast spot-check of home text in both themes for one app per family.

### T5.6 Compact hero and header (shared)
Lane: shared · Depends on: T5.5 · Files: `Shell.astro`, `refinement.css`
Steps:
1. Hero: H1 = app name; descriptor ≤ 12 words; optional count chip (prop); remove the dash-eyebrow pattern. Phone: hero ≤ 140 px tall; desktop: drop `min-height:300px` and `padding:66px 0 51px`, H1 max ≈ 3.2 rem.
2. Remove the shared eight-point star watermark (`.intro:before/:after`); the per-app motif (T5.11) replaces it.
3. Header: short name + logo at every width; tagline hidden below 720 px; add "All apps" link to `https://moongazer.tech/#library`.
Acceptance: copies identical; no star watermark; at 390 px header shows logo + name + nav without wrapping the logo away.

### T5.7 "How this works" drawer (shared component + per-app content)
Lane: shared (component) then app (content moves) · Files: `apps/*/src/components/HowItWorks.astro` (new, shared), each app's `src/pages/index.astro`
Steps:
1. Component: native `<details class="how-it-works">` with `<summary>How this works</summary>`; desktop: top of sidebar; phone: directly after the activity.
2. Per app: move notices, evidence bands and caveat paragraphs that sit above the activity into the drawer (Halal/Akhlaq business notices, Family, Escape Room, Concept Atlas remnants, Prophets, Casebook/claims, Revelation, Seerah Detective notice). Keep one plain limit sentence beside results where it matters (for example "A practice case, not a ruling on your own deal"). Do not delete any limit; move it.
3. Cut repeated hedging: where the same limit is stated more than once on a page, keep the clearest one (beside the result or in the drawer).
Acceptance: no caveat text above the first control on any app home; every distinct limit still present once on the page (diff the visible text before/after and list removed duplicates in the tracker).

### T5.8 End-of-session pattern (shared component + per-app wiring)
Lane: shared then app · Files: `apps/*/src/lib/session-end.ts` (new, shared), per-app result code
Pattern: result → "What you learned" (1–3 lines with references) → share (copy text + `https://wa.me/?text=` with URL-encoded plain text, no tracking parameters) → one recommended next app (from `learning.json` related apps) → "New puzzle tomorrow" slot (filled in P6 for daily games) → "Report an error →" (compact feedback link from P4). Calls `track('share_clicked', id)` on share.
Acceptance: every activity that ends shows the pattern; share text never contains the answer (test per daily app in P6).

### T5.9 "About this app" accordion
Lane: shared · Files: `LearningGuide.astro`
Render the guide after the activity as `<details>` per question, server-rendered HTML (crawlable). Keep text unchanged.

### T5.10 Arabic and honorific typography
Lane: shared · Files: `refinement.css`
Ayat in Amiri 1.6–1.8 rem with line-height ≥ 1.9 in both themes; `.honorific` from P2 kept.

### T5.11 Per-app motif SVG
Lane: app (one per app) · Files: `apps/<slug>/public/motif.svg` (new) and its use in the hero
A local, decorative (`aria-hidden="true"`) line illustration derived from the app's logo (examples: astrolabe for Places, scroll seal for Detective, threads for Ayah Threads, lamp niche for Parables, lock for Escape Room, calendar grid for Hifz). Geometry, objects, plants, sky only. Hidden below 580 px or reduced to a small corner mark.
Acceptance: no people or animals; file ≤ 8 KB; hidden from assistive tech.

### T5.12 Print and projector
Lane: shared (CSS + toggle) then app (buttons) · Files: `refinement.css`, `src/lib/shell.ts` (both variants), app pages
"Print" button on family, teacher and timeline pages (Family Halaqa, Escape Room, Seerah Timeline, Stories of the Prophets, Word Groups, Guess the Surah). "Projector" toggle enlarges text (×1.35), simplifies chrome, increases contrast; not saved unless the visitor opts into saving settings (namespaced key `projector`). Family Halaqa also gets "Print saved packs" on its library page (one print view of all saved packs).

### T5.13 Correct-answer animation
Lane: shared · Files: `refinement.css`, `utils.ts`
A brief (≤ 250 ms) scale/opacity pulse on correct answers via a CSS class; none under `prefers-reduced-motion: reduce`. No sound.

### T5.14 Per-app first screen (16 apps)
Lane: app (one per app; parallel) · Depends on: T5.6–T5.8 · Files: `src/pages/index.astro`, app CSS
Apply the app's archetype layout from its `DESIGN.md`. Include the Verify_Me layout items listed for the app in `appendix-verify-me-triage.md` (for example Guess the Surah round settings above the clue card; Seerah Timeline sticky inspector/drawer; Ayah Threads compact puzzle picker with solved ticks; Revelation "Copy my list" hidden until something is saved).
Acceptance: measured first control top ≤ 600 px at 390 × 844 and 375 × 812 in both themes (record the number in the app's `DESIGN.md`).
Verify: V1, V7.

### T5.15 Directory front door
Lane: shared · Depends on: T5.5 · Files: `homepage/index.html`, `styles.css`, `app.js`, `render.mjs`, `collections.json`, `deployment/targets.json`, `homepage/_redirects`, footer
Steps (top to bottom, phone first):
1. Header nav: Apps, Today, Families, About (Teachers hidden until P10). Remove "Start with a little curiosity ↗".
2. Compact hero: H1 "Free Islamic learning games and tools", one line of copy, buttons "Play today's puzzle" (Guess the Surah; P6 makes it daily) and "Browse all apps". On phones the crescent becomes a small mark so the first app card is on screen one. Remove "There is always more to discover."
3. "Tonight on Moongazer" container with a static default (P6 fills it).
4. Quick picker chips: "2 minutes", "10 minutes", "With my kids", "For my class", "Understand my prayer", "Plan my hifz"; add `time`, `audience`, `format` fields to every entry in `targets.json`; chips filter the library; native links work without JS.
5. Library directly after the chips (Verify_Me: the library is above the fold on desktop). Cards: local 16:9 WebP screenshot per app (lazy, alt text describing the activity), format badge, time, audience; featured order. Capture screenshots from production builds with the browser tooling used by `_implementation/e2e-flows.mjs`; if no headless browser is available, stop and report (do not use remote screenshot services).
6. The four subject guides follow the library as compact wide cards with member logos.
7. Seasonal slot container (P7 fills).
8. Trust row: "Exact Quran text with named translation · Sources on every page · Corrections log →" (no reviewer claim).
9. ~~Short links~~ — dropped under D2c (no redirects). Each app's own host is already short (for example `guess-the-surah.moongazer.tech`); the footer links to the hosts directly.
Acceptance: first app card visible on screen one at 390 × 844; JS off still lists all apps.
Verify: V4, V6, V7.

### T5.16 Social cards
Lane: shared · If family colours appear on the cards, regenerate with `deployment/seo-assets.py` in an isolated environment; otherwise record "not needed".

### T5.17 Phase verification and R5 notes
Lane: shared · Full V2–V7: all 16 app homes (and the 4 retired-banner apps if still live) at 390 × 844 and 1440 × 1000, both themes; first-control offsets table in `releases/R5.md`; focus and contrast spot checks; directory with JS on/off.

### T5.18 Release R5
Lane: deploy (owner). As T1.21.
