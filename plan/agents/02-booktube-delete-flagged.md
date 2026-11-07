# Brief 02 — Booktube: delete flagged material

**Repository:** `I:\Produce_AB\booktube`
**Depends on:** 01. **Authorized:** yes. The owner chose permanent deletion on 7 November 2026.
**Goal:** remove the music bed, the bell, riser and meme sounds, the six frozen compositions, the presenter character and every render made from them. Keep the clean kit, the book renderer and the example short.
**Background:** `../REPORT.md`, B1 and B4.

## Before you delete

- Paths were checked to exist on 7 November 2026. For each group below, list the target again (`ls`, `git ls-files`) and confirm it matches the description. If something differs (new files, renamed folders, unexpected contents), stop and ask the owner about that item.
- `out/`, `renderer/out/` and `renderer/build/` are git-ignored. Files deleted there cannot be recovered. Tracked source files stay in Git history until a commit; do not commit.
- Keep a running list of every deleted path for the audit record in brief 05.

## 1. Frozen compositions (tracked source)

Delete:
- `renderer/src/binance-breach-2026/` (whole folder, including `BinanceBreach.test.ts`)
- `renderer/src/data-analyst-2027-v2/` (whole folder, including `DataAnalyst2027V2.test.ts`)
- `renderer/src/shorts/`:
  - `NuclearVolcanoShort.tsx` and `.test.ts`
  - `VoyagerThrusterShort.tsx` and `.test.ts`
  - `RedSeaSeverShort.tsx`
  - `TheracKeystrokeShort.tsx` and `.test.ts`
  - the `redsea/`, `therac/` and `voyager/` subfolders

  If `renderer/src/shorts/` is then empty, delete the folder.

Edit:
- `renderer/src/Root.tsx`:
  - Remove the "Frozen compositions" comment and the eight imports for DataAnalyst2027V2, BinanceBreach, NuclearVolcano, Voyager, RedSea and Therac (components and `TOTAL_FRAMES`).
  - Remove the `{/* Frozen */}` block: seven `<Composition>` entries, including the `CuriosityShorts` alias.
  - Keep the kit videos, `BookEpisode` and `BookEpisodeShorts`.
- `renderer/src/Root.test.ts`:
  - Remove the DataAnalyst and NuclearVolcano imports and the two frozen-composition tests.
  - Keep "exports Root component".
- `renderer/package.json`: remove the `render:analyst-v2` and `render:binance-breach` scripts.
- `docs/storyboards/`: delete `binance-breach.md` and `binance-visual-storyboard.md`. If the folder is then empty, delete it.

## 2. Presenter character (images of living beings)

Delete:
- `renderer/src/components/RemotionPresenter.jsx`
- `renderer/src/components/RemotionPresenter.d.ts`
- `renderer/src/registry/character/RemotionPresenter.jsx`, and the `character/` folder if it is then empty

Edit:
- `renderer/src/registry/index.js`: remove the `RemotionPresenter` export (currently line 4).
- `renderer/src/registry/map/RemotionMapScene.jsx`: remove the `RemotionPresenter` import (line 13) and the `<RemotionPresenter … />` element (around line 118). Remove any `presenter` fields this scene requires from its beat props. Keep the map.

Then search `renderer/src` (excluding `node_modules`) for any remaining human or animal character components, mascots or icons, such as `character`, `avatar`, `person`, `face` or animal names in component files. Report findings to the owner. Delete without asking only if the file is used solely by the compositions deleted above.

## 3. Music and sounds

Delete:
- `renderer/public/bg-music.mp3`
- `renderer/public/sfx/ding.wav`, `check-chime.wav`, `bass-riser.wav` and `vine-boom.wav`
- The same five files under `renderer/build/public/` (`bg-music.mp3` and `sfx/…`), if present

Edit:
- `renderer/src/sfx-registry/manifest.json`:
  - Remove the items `ding`, `ding-bell`, `check-chime`, `bass-riser` and `vine-boom`.
  - In `audioHierarchy.tier3BackgroundMusic`, state that music is refused ("No music bed: refused by context/islamic-guidelines.md §5").
- `renderer/src/sfx-registry/README.md`: remove the `vine-boom` quality note, or rewrite it as "removed".
- `booktube/sfx_catalog.json`: remove `record-scratch`, `windows-xp-error`, `mac-quack`, `yippee`, `dramatic-boomer`, `fah`, `loading-lag` and `snapchat-notification`. Keep `shutter-old` and the remaining plain effects.

Keep: `whoosh`, `whoosh-soft`, `whip`, `card-pop`, `page-turn`, `key-tick`, `mouse-click`, `switch`, `shutter-modern`.

`tests/test_narration_project.py` uses `vine-boom` in its fixture. It will fail until brief 03 runs, so do 03 next.

## 4. Orphaned narration of the deleted compositions

Delete:
- `renderer/public/binance_scene1.mp3` to `binance_scene5.mp3`
- `renderer/public/scene1.mp3` to `scene8.mp3` (Data Analyst narration)
- `renderer/public/audio/` (Voyager `beat1_hook` to `beat4_triumph`, `redsea_beat*`, `therac_beat*`, in `.mp3` and `.wav`)
- The same files under `renderer/build/public/`

Before deleting `renderer/public/audio/`, confirm it contains only those prefixes. Keep `renderer/public/projects/`, `maps/` and `jobs/`.

## 5. Renders (git-ignored, not recoverable)

Delete:
- `out/therac/`, `out/redsea/`, `out/voyager/`, `out/binance/`, `out/data-analyst-2027/`
- `out/consumer-finance/`, `out/tech-sacred-cows/`, `out/business-guru/`
- `renderer/out/` (the 8-minute Data Analyst explainer, `chunks/`, `concat_list.txt`, `shorts/volcano_*.png`)
- `renderer/data-analyst-2027_v1.mp4`, `renderer/data-analyst-2027_v2.mp4`
- In `out/_tmp/`:
  - `shorts_audio_tmp/` and `shorts_natural_audio_tmp/` (narration for the deleted finance, tech and guru shorts)
  - `snapshots/` (Binance frames)
  - Each test file (`test*.mp4`, `test*.wav`, `scene1_test.*`, `scene4_debug.wav`, `_probe.wav`) that a quick check shows came from the deleted compositions. Use the file name, `ffprobe` duration and creation date. If you cannot tell, list it for the owner instead of deleting.

Keep: `out/example-short/`, `out/README.md`, `projects/example-short/`.

## 6. Check nothing else points at deleted files

Run `grep -rn` across the repository, excluding `node_modules`, `.venv`, `out/` and `renderer/build/`, for:
`bg-music`, `binance`, `data-analyst-2027`, `RemotionPresenter`, `NuclearVolcano`, `Voyager`, `RedSea`, `Therac`, `vine-boom`, `check-chime`, `ding-bell`, `bass-riser`.

Fix code references. Briefs 01 and 04 handle remaining mentions in context, skills and docs. Leave mentions in `context/progress-tracker.md` history as history.

## Acceptance

- Every path in sections 1–5 is gone, or is listed for the owner with a reason.
- `renderer/src/Root.tsx` registers only the kit videos and the two book compositions.
- `cd renderer && bun run typecheck` passes. If it fails only because of brief 03's pending test fixture changes, note that and continue to 03.

Record: the full list of deleted paths (for brief 05) and a status update in `00-START-HERE.md`.
