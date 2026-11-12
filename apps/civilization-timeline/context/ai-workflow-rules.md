# AI workflow rules

## Approach and scoping

Read the required context, inspect the current source, then complete the authorized change in a focused unit. Context describes the current implementation; the user's new instructions may change that scope. Resolve routine details with judgment and record meaningful decisions. Do not add projects beyond the current user request or change unrelated apps as a side effect.

Run app commands from `apps/civilization-timeline` while in this repository, or from this folder after copying the project.

## Development and verification

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Development and preview use http://127.0.0.1:4336/ for this app.

From the repository root, `bun _implementation/verify.ts check`, `test`, or `build` processes all twenty apps. `--batch2` selects apps 6 through 10; `--batch3` selects apps 11 through 15; `--batch4` selects apps 16 through 20. `bun _implementation/preview.ts` serves built output on ports 4321 through 4340 and is development tooling only.

Run `python _implementation/verify-static.py` after affected builds, then `python _implementation/package-release.py` when refreshing upload artifacts. The global static verifier expects all twenty dist directories and the local research snapshot. A copied app still builds/checks/tests independently; root research tooling is optional for its normal build.

Windows note: earlier native Astro tooling failed under the sandbox. A working run used an approved execution context and `RAYON_NUM_THREADS=2`. Use ordinary execution first; seek the tool's scoped escalation only if the same environment failure occurs. Do not change machine-wide settings or invent CLI flags.

## Verification for this scope

Check all events detail routes, catalog filters and empty results, source links, core activity completion, retries/reset, explicit sharing, both themes, keyboard navigation and blocked/expired storage. Historical periods and monuments are selected examples, not a complete history or religious endorsement of a dynasty. Preserve date ranges and institutional attribution.

For a behavior change, run relevant Bun tests, Astro check/build and browser verification of the changed flow. Do not add implementation-mirroring tests for reversible documentation-only edits. For documentation-only changes, completeness/path/fact checks suffice. Separate recorded earlier verification from checks run in the current change.

## Source and architecture changes

- Normal builds use local content; do not put Quran API calls or keys in visitor code. The official Quran MCP endpoint is `https://mcp.quran.ai`. Follow its current grounding rules, reuse matching verified content, and fetch missing canonical text/commentary during preparation.
- Research and preparation live under `_implementation/research/` and `_implementation/`. Preserve fetched text, exact citation URLs, source editions, rights notices and checksum records. Do not run one-time scaffold/page/test generators blindly over edited app sources.
- Verify new dependency/API patterns using the hierarchy in AGENTS.md. Final-batch documentation evidence includes `_implementation/research/batch4/astro-docs.json`. Earlier evidence includes `_implementation/research/astro-docs-*.json`, `_implementation/research/batch3/astro-docs.json`, and the official Astro and Cloudflare Pages links in DEPLOYMENT.md.
- Relevant official references: https://docs.astro.build/en/guides/deploy/cloudflare/ and https://developers.cloudflare.com/pages/configuration/build-configuration/ . Check current docs before relying on changed external platform behavior.
- Keep deployable apps self-contained. Update context before a dependent architecture/storage change, then update the progress tracker after implementation.

## Protected/generated material and delivery

- Do not patch installed dependencies, generated `.astro/`/`dist/` contents or release ZIP bytes by hand. Regenerate from authoritative sources when the task requires it.
- Preserve the original `6_File+Context+Methodology/` reference template, earlier HTML demonstrations and historical QA evidence during unrelated maintenance.
- Finish with concrete files, validation and any material limits. A ZIP ready for upload is not a deployed Cloudflare project. Current Pages publication is recorded in deployment/status.json at repository level.
- Keep these context files updated manually after initial setup; `_implementation/populate-context.py` refuses to overwrite them by default. Use `python _implementation/verify-context.py` at repository level to audit current context sets. The older generator’s `--verify-only` mode forwards to that audit.

## SEO release, 30 October 2026

For later SEO changes, run bun test _implementation/seo.test.ts and python deployment/verify-seo.py alongside affected app checks, tests and builds. After publication run python deployment/verify-seo.py --live and the complete HTTP verifier. The local GitHub workflow now includes these SEO guards, but no new Actions run for this SEO source was triggered in this task. Keep Search Console verification/submission separate from on-site release completion.

## Search content enhancement scope

Apply SEO_GROWTH_PLAN.md using the updated SEO audit, AI SEO, site architecture and schema skills. Search Console currently has no processed performance/indexing baseline; do not invent metrics. Existing Astro 7.4.2 and Bun 1.4.4 interfaces and matching official documentation remain applicable. Validate regenerated outputs and public responses after the authorized publication, and preserve the unrelated in-progress skill and ignore-rule edits.
