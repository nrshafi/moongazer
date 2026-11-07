# Brief 05 — Booktube: verify, fix the example short, record

**Repository:** `I:\Produce_AB\booktube`
**Depends on:** 02, 03, 04. **Authorized:** yes.
**Goal:** prove the repository works after the changes, remove the last figure from the example video, and leave an audit record.

## Steps

1. **Example short observer.**
   - In `renderer/src/videos/example-short/index.tsx` (around L362-365), the `{/* You */}` block draws a head (circle) and body (stroke). Replace it with a non-figurative observer marker:
     - a small filled dot
     - a short dashed sight line toward the sky
     - the existing "NOON" callout, or a small text label "you are here"
   - Keep the red glow circle if it still reads as a location marker.
   - Check the rest of the file and `projects/example-short/` for any other figure, animal or person. The CC0 sky and sunset photos are fine.
   - Run `booktube storyboard example-short` and inspect `out/example-short/storyboard.png`. No figure may remain.
   - Run `booktube render example-short`. Narration is unchanged, so `--force` narration is not needed unless the tool says the timeline is stale.
2. **Full checks.**
   - `.venv/Scripts/python.exe -m booktube doctor`
   - `.venv/Scripts/python.exe -m unittest discover -s tests`
   - `cd renderer && bun run typecheck && bun test`
   - `booktube project-status example-short`
3. **Behaviour checks.** Each must be refused with a message naming the guidelines:
   - In a scratch copy of the example spec under `projects/` (delete it afterwards), add `music: {file: music/x.mp3}` and run `booktube narrate` or the validator.
   - Use SFX id `ding` in the same scratch spec.
   - Run `booktube sfx fetch vine-boom`.
   - Run `booktube approve-project example-short --reviewer TEST --attest facts audio visuals captions` (without `islamic`). Do **not** record a real approval: approvals come only from the owner in chat. If the command would succeed, stop; that is a defect for brief 03.
4. **Text checks.**
   - `grep -rn` (excluding `node_modules`, `.venv`, `out/`, `renderer/build/` and the progress-tracker history) finds no active reference to: `bg-music`, `vine-boom`, `check-chime`, `ding-bell`, `bass-riser`, `RemotionPresenter`, `BinanceBreach`, `DataAnalyst2027V2`, `NuclearVolcano`, `VoyagerThruster`, `RedSeaSever`, `TheracKeystroke`.
   - `AGENTS.md` lists `context/islamic-guidelines.md` first; `CLAUDE.md` imports it; `GEMINI.md` names it.
5. **Audit record.** Create `docs/islamic-compliance-audit.md` containing:
   - the date (Asia/Dhaka) and the owner's four decisions
   - the B1 findings table from `I:\Development\moongazer\plan\REPORT.md`
   - the full list of deleted paths from brief 02, with any items listed for the owner instead of deleted
   - the files edited in briefs 01, 03 and 04
   - the validation actually run, with results
   - open items:
     - a qualified person should check the guidelines' citations against sunnah.com and Quran MCP
     - *A Brief History of Time* is AMBER pending plan approval
     - platform ad-category blocking is the owner's action in YouTube and AdSense settings
6. **Progress tracker.** Add a `context/progress-tracker.md` entry with an Asia/Dhaka timestamp summarizing all five briefs, the validation, and the open items. Do not claim a human scholarly review happened.
7. **Memory (if your agent has persistent memory).** Record that the owner wants Islamic compliance in all projects: no music, instruments or bells; no images of living beings; remind before haram or doubtful work or income; refuse RED items.
8. **Commit only if the owner asks.**

## Acceptance

All commands in steps 2–4 pass, or their failures are reported with output. The audit record and tracker entry exist. The status table in `00-START-HERE.md` marks 01–05 done.
