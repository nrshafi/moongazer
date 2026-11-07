# Brief 03 — Booktube: enforce the rules in code and tests

**Repository:** `I:\Produce_AB\booktube`
**Depends on:** 02. **Authorized:** yes.
**Goal:** the validators and approval gates refuse what the guidelines forbid, so a RED item cannot slip through by accident.
**Background:** `../REPORT.md`, B5 ("Code").

Read the files named below fully before editing. Line numbers were correct on 7 November 2026; re-locate them if they have shifted.

## Steps

1. **`booktube/project.py`**
   - `REVIEW_CHECKS` (L23): add `"islamic"`.
   - `PLACEHOLDER_AUDIO` and the music block in `validate_spec` (L124-137):
     - Replace the logic with a refusal of any non-null `music` value. Use the message: `"music is refused: no music, instruments or bells (context/islamic-guidelines.md §5)"`.
     - Keep `spec["music"] = None` as the only accepted state.
     - Remove the now-unused `PLACEHOLDER_AUDIO` constant if nothing else uses it.
   - SFX ids: unknown ids are already rejected through the manifest. Confirm that the five ids removed in brief 02 now fail with a clear message, and append " (removed under context/islamic-guidelines.md §5)" when the id is one of `ding`, `ding-bell`, `check-chime`, `bass-riser`, `vine-boom`.
   - Scaffold comment (L560-563): replace the music hint with `# No music bed (context/islamic-guidelines.md §5).`
   - The "next" hint (L435) and `describe()` (L646): include `islamic` in the attest list they print.
2. **`booktube/pipeline.py`**
   - `SCRIPT_CHECKS` (L18): add `"islamic"`.
   - `VIDEO_CHECKS` (L19): add `"islamic"`.
   - `approve_plan` (L157-167): add `"islamic"` to the fixed checks `{"boundaries", "coverage", "rights"}`. This records that the book and its episode map passed the Islamic screen. The operator skill (brief 04) must ask the owner to confirm that screen before running `approve-plan`.
3. **`booktube/cli.py`**
   - `--attest` help strings (L79-82, L103-106): include `islamic`. For example: `"facts audio visuals captions islamic"`.
   - `approve-plan` help (L59-61): add "Approving a plan records the Islamic screen of the book and episode map."
4. **`booktube/sfx.py`**
   - `fetch` (L86-125): refuse any name that is not in the cleaned `sfx_catalog.json`. Today an unknown name falls back to `https://remotion.media/{key}.wav` (L97). Use the message: `"unknown sound; add it to sfx_catalog.json after checking context/islamic-guidelines.md §5"`.
   - Keep URL fetches only if the existing code requires them. If kept, print a reminder to check the sound against §5 before registering.
   - `scan` (L142) must not auto-download anything absent from the catalog.
5. **`booktube/editorial.py`**
   - In `make_brief` (L168-192), add one instruction line: "Follow context/islamic-guidelines.md: no music or sound cues beyond plain effects, no people or animals in visual suggestions, no promotion of riba, gambling or other haram products, Quran and hadith only from verified sources with references."
6. **`booktube/demo.py`**
   - L32: replace "practice a musical instrument after lunch. The instrument stays in a closed case in another room. They could try leaving the case open…" with an equivalent example about practising calligraphy (pen and paper kept in a drawer in another room). Keep the sentence structure and meaning.
   - Check whether any test asserts this exact text; update it if so.
7. **Tests**
   - `tests/test_narration_project.py`:
     - Replace `vine-boom` in the `SPEC` fixture with `whoosh`, and update the cue assertion at L186-188.
     - Add `"islamic"` to the literal check sets at L226 and L238.
     - Rename `test_music_is_opt_in_and_placeholder_drone_is_refused` (L132) to `test_music_is_refused` and assert that any `music` value is refused.
     - Add `test_removed_sfx_ids_are_refused` (for example `ding`).
     - Add `test_approval_requires_islamic_attestation` (`{"facts", "audio", "visuals", "captions"}` without `islamic` is refused).
   - `tests/test_pipeline.py`:
     - Most tests use the constants and pick up the change.
     - Add one test that `approve_script` refuses checks missing `islamic`.
     - Confirm the `approve_plan` call at L27 still works.
   - Renderer: update `renderer/src/sfx-registry/sfx-registry.test.ts` if it lists the removed ids. Keep `kit/kit.test.ts`'s ducking-math tests (the math is harmless) unless they import deleted files.
8. **SFX tests in Python** (L247-257): keep the level and unknown-id refusals; adjust any id now removed.

## Acceptance

- `.venv/Scripts/python.exe -m unittest discover -s tests` passes.
- `cd renderer && bun run typecheck && bun test` passes.
- Each of these is refused with a message naming the guidelines:
  - a spec with `music: {file: music/x.mp3}`
  - `approve-project … --attest facts audio visuals captions` without `islamic`
  - `booktube sfx fetch vine-boom`
  - a spec using `ding`

Record a progress-tracker entry with the exact test commands and results, and update `00-START-HERE.md`.
