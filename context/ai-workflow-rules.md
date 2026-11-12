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

From the repository root, `bun _implementation/verify.ts check`, `test`, or `build` processes all sixteen apps (the old `--batch` slices are gone). `bun _implementation/preview.ts` serves built output on ports 4321 and up and is development tooling only.

Run `python _implementation/verify-static.py` after affected builds, then `python _implementation/package-release.py` when refreshing upload artifacts. The global static verifier expects all twenty dist directories and the local research snapshot. A copied app still builds/checks/tests independently; root research tooling is optional for its normal build.

Windows note: earlier native Astro tooling failed under the sandbox. A working run used an approved execution context and `RAYON_NUM_THREADS=2`. Use ordinary execution first; seek the tool's scoped escalation only if the same environment failure occurs. Do not change machine-wide settings or invent CLI flags.

## Verification for this scope

Use the affected app context to select the relevant end-to-end flows. Check canonical content, routing, optional/blocked storage, both themes, narrow layouts and source attribution where changed.

For a behavior change, run relevant Bun tests, Astro check/build and browser verification of the changed flow. Do not add implementation-mirroring tests for reversible documentation-only edits. For documentation-only changes, completeness/path/fact checks suffice. Separate recorded earlier verification from checks run in the current change.

## Source and architecture changes

- Normal builds use local content; do not put Quran API calls or keys in visitor code. The official Quran MCP endpoint is `https://mcp.quran.ai`. Follow its current grounding rules, reuse matching verified content, and fetch missing canonical text/commentary during preparation. Project-level MCP config registers it as `quran` for each agent: `.mcp.json` (Claude Code), `.codex/config.toml` (Codex), `.cursor/mcp.json` (Cursor), `.vscode/mcp.json` (VS Code/Copilot) and `.gemini/settings.json` (Gemini CLI). Agents may need a restart or approval before the server loads.
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

For collection-wide SEO changes, read SEO_QA.md and deployment/seo-release.json, use installed Astro interfaces and primary documentation, then run affected app checks/builds, existing tests, static/source verification and SEO-specific validation. Reuse the proven project-scoped upload workflow. The Search Console Domain property is verified; keep sitemap discovery, actual indexing and rankings distinct in completion reports. Detailed generated logs and screenshots stay local; compact release and Search Console records are versioned.

Follow deployment/README.md for project-specific credentials, project-isolated hashes, Pages multipart publication, domain association and the canonical-hostname rule. Direct Upload uses regenerated dist directories without requiring ZIPs. Always verify live responses after API success. The current release has two consecutive complete passing HTTP checks. Pushes to main are deployed by GitHub Actions.

## SEO release, 30 October 2026

For later SEO changes, run bun test _implementation/seo.test.ts and python deployment/verify-seo.py alongside affected app checks, tests and builds. After publication run python deployment/verify-seo.py --live and the complete HTTP verifier. The local GitHub workflow now includes these SEO guards, but no new Actions run for this SEO source was triggered in this task. Keep Search Console verification/submission separate from on-site release completion.

## Google Search Console setup, 30 October 2026

Reuse the verified sc-domain:moongazer.tech property instead of creating duplicate properties for its app subdomains. Use the user-authorized ego browser for Google UI and the existing Cloudflare connector for DNS. Preserve the apex verification TXT record. Review sitemap errors and indexing reports as data becomes available; no recurring monitor or notification automation was created.

## Search content enhancement scope

Apply SEO_GROWTH_PLAN.md using the updated SEO audit, AI SEO, site architecture and schema skills. Search Console currently has no processed performance/indexing baseline; do not invent metrics. Existing Astro 7.4.2 and Bun 1.4.4 interfaces and matching official documentation remain applicable. Validate regenerated outputs and public responses after the authorized publication, and preserve the unrelated in-progress skill and ignore-rule edits.
