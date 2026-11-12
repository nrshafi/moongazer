# AI workflow rules

## Approach and scoping

Read the required context, inspect the current source, then complete the authorised change in a focused unit. Context describes the current implementation; a new instruction may change the scope. Record meaningful decisions in the progress tracker.

Run app commands from `apps/zakat-calculator` in this repository, or from this folder after copying the project.

## The zakat content gate

Before any zakat ruling, nisab figure, amount, hadith, Quran text or method option is written into the app:

1. Its entry must exist in the verified method record (`_implementation/research/zakat/method.json`, P7 T7.4), with the textual basis and where each position is documented.
2. A separate verification (`verification.json`) must have re-opened each citation and recorded pass or fail (D9).
3. Quran references are fetched and cited through the Quran MCP. Hadith numbers are checked on sunnah.com.
4. Positions that schools dispute are presented as labelled choices (D23). The app does not choose a default.

Do not claim scholarly review or endorsement. The owner spot-check is a separate step and is not implied by the verification record.

## Development and verification

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Development and preview use http://127.0.0.1:4341/ for this app.

The root orchestration scripts (`_implementation/verify.ts`, `deployment/targets.json`) do not yet include this app. That registration is P7 T7.7 and is not done.

Windows note: if Astro fails with a sandbox or thread error, retry with `RAYON_NUM_THREADS=2`.

## Shared files

Shared files are changed in `apps/guess-the-surah` and copied with `bun _implementation/sync-shared.ts --from guess-the-surah <path>`. Run `bun _implementation/sync-shared.ts --check` after any copy. Do not edit a shared file in this app only.

## Verification for this scope

For the current empty shell: `bun run check`, `bun test` (config, storage, theme bootstrap and import tests) and `bun run build` must pass. Check the home page and sources page in both themes and at phone width before a release. Separate recorded checks from checks run in a change.

## Delivery

- Do not patch dependencies, generated output or release archives by hand.
- This app is not deployed. Production steps belong to P7 T7.8 and are owner actions.
- Finish with concrete files, validation results and any material limits.
