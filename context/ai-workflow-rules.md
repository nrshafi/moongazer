# AI workflow rules

GitHub Actions production deployment is active for pushes to main. Both required secrets are configured and the first production run passed. Keep tokens in Actions secrets and verify live files after deployment.

## Approach and scoping

The current publication request authorizes Cloudflare Pages projects, production deployments, custom domain associations and DNS records for moongazer.tech and each app. Use the connected Cloudflare account 004edbba5c2bcea9f103ae2111889af7 and verify the active zone before writes. Build source before upload. Verify production stages and public HTTPS pages, asset availability, headers, detail routes and 404 behavior. Update `deployment/status.json`, `DEPLOYMENT.md` and the progress tracker with measured results. Native Cloudflare API schemas and official Pages custom-domain/Direct Upload documentation are the API references.

Read the required context, inspect the current source, then complete the authorized change in a focused unit. Context describes the current implementation; the user's new instructions may change that scope. Resolve routine details with judgment and record meaningful decisions. Do not add projects beyond the current user request or change unrelated apps as a side effect.

Run package commands from the affected app folder. The repository root has no package.json and is not a Bun workspace.

## Development and verification

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Development/preview ports are listed in project-overview.md and DEPLOYMENT.md.

From the repository root, `bun _implementation/verify.ts check`, `test`, or `build` processes all twenty apps. `--batch2` selects apps 6 through 10; `--batch3` selects apps 11 through 15; `--batch4` selects apps 16 through 20. `bun _implementation/preview.ts` serves built output on ports 4321 through 4340 and is development tooling only.

Run `python _implementation/verify-static.py` after affected builds, then `python _implementation/package-release.py` when refreshing upload artifacts. The global static verifier expects all twenty dist directories and the local research snapshot. A copied app still builds/checks/tests independently; root research tooling is optional for its normal build.

Windows note: earlier native Astro tooling failed under the sandbox. A working run used an approved execution context and `RAYON_NUM_THREADS=2`. Use ordinary execution first; seek the tool's scoped escalation only if the same environment failure occurs. Do not change machine-wide settings or invent CLI flags.

## Verification for this scope

Use the affected app context to select the relevant end-to-end flows. Check canonical content, routing, optional/blocked storage, both themes, narrow layouts and source attribution where changed.

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
- Finish with concrete files, validation and any material limits. A ZIP ready for upload is not a deployed Cloudflare project. Current publication is recorded in deployment/status.json; failures and passing release checks are in deployment/evidence/.
- Keep these context files updated manually after initial setup; `_implementation/populate-context.py` refuses to overwrite them by default. Use `python _implementation/verify-context.py` at repository level to audit current context sets. The older generator’s `--verify-only` mode forwards to that audit.

## Reusing the complete-portfolio browser audit

Follow `_implementation/qa/e2e/README.md` for the isolated production-header preview and documented CUA journeys. Keep test storage on ports 5321–5340; do not clear user-origin storage. Preserve failed attempts and record passing retests rather than deleting contrary evidence. Use small browser batches so progress is checkpointed. Rebuild affected sources before HTTP/static verification and release packaging.

## Publication workflow

The current request authorizes implementing and publishing collection-wide SEO changes. Read deployment/evidence/seo/baseline.json, use installed Astro interfaces and primary documentation, then run all app checks/builds, existing tests, static/source verification and SEO-specific validation. Reuse the proven project-scoped upload workflow. Search Console has no verified property; keep account setup and indexing claims separate from on-site implementation and live checks.

Follow deployment/README.md for project-specific credentials, project-isolated hashes, Pages multipart publication, domain association and the canonical-hostname rule. Direct Upload uses regenerated dist directories without requiring ZIPs. Always verify live responses after API success. The current release has two consecutive complete passing HTTP checks. Pushes to main are deployed by GitHub Actions.
