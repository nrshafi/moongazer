# P8 brief: Diagnostic Mastery Loop (Haiku workers)

Read `plan/implementation/P8-mastery-loop.md` (the loop, the data contract and the T8 tasks) and `plan/implementation/briefs/haiku-worker-brief.md` (git, commits, project rules). Where this brief differs from the Haiku brief, this one wins:

- **Base branch.** Branch from `main`, not `phase-3-merges`.
- **Dates.** Use plain `date` in Git Bash for tracker timestamps. It prints Dhaka time labelled BST; do not adjust it.
- **Engine source.** The pure engine already exists on branch `phase-8-mastery-engine` (commit c8db8fc) as `src/lib/mastery.ts` and `tests/mastery.test.ts` in the four apps. That branch is old; never merge it. Copy files from it with `git checkout phase-8-mastery-engine -- <path>`.
- **Mastery set.** `src/lib/mastery.ts` and `src/lib/mastery-ui.ts` are identical in understand-your-salah, stories-of-the-prophets, why-it-was-revealed and everyday-akhlaq.
  - Edit them in understand-your-salah only.
  - Copy them out with `bun _implementation/sync-shared.ts --set mastery --from understand-your-salah <path>`.
  - Check with `bun _implementation/sync-shared.ts --check --set mastery`.
- **Design is not your job.** A redesign of the shared shell is running in parallel, owned by the orchestrator.
  - Use the app's existing panel and button classes, and add only minimal CSS.
  - Do not edit `src/layouts/Shell.astro`, `src/styles/refinement.css`, `src/styles/global.css`, logos, motifs or `public/art/`.

## Content rules for question banks

- **Grounding.** Every question and card is grounded in material already in the app's verified `src/data/content.json` (passages, readings, sources), or in Quran text fetched through the quran MCP tools.
  - Call `fetch_grounding_rules` first and pass its nonce.
  - Copy Quran text by script from `_implementation/research/quran-full.json`, or from the app's content. Never type it.
  - Hadith go by collection and number, paraphrased, and only if the app's content already cites them.
- **A question must not be answerable from text printed beside it.**
  - The diagnostic is shown before the card.
  - Write questions about understanding, for example "What did Nuh (peace be upon him) build when his people refused?", not "Which word appears in the title?".
- **Answers.** Exactly one correct option and two or three plausible wrong ones, all of similar length. Never use "all of the above".
- **Honorifics.**
  - Write "(peace be upon him)" after every prophet named.
  - For the Prophet Muhammad, the content stores ﷺ, and the app renders it through `Honorific.astro` / `withHonorifics()`.
- **Language.** Plain English, short sentences, suitable for ages 10 and up.
- **Draft and record.** Write the bank to `_implementation/research/mastery/<slug>.json` first, in the data-contract shape. Copy it into content.json under `"mastery"` after your self-check. Then update `appContentSha256`.
- **Second pass.** A separate run does the second-pass verification. Do not mark anything "verified".
