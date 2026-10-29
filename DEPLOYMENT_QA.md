# Moongazer publication verification

The directory and twenty apps are published on separate Cloudflare Pages projects. Every app hostname uses its complete folder name. Open [moongazer.tech](https://moongazer.tech/) or see every URL in [DEPLOYMENT.md](DEPLOYMENT.md). Production IDs and active domains are in [deployment/status.json](deployment/status.json).

## Release checks

| Check | Result |
| --- | --- |
| Existing Bun tests | 217 pass across twenty apps |
| Production builds | All twenty pass after the header changes |
| Static/canonical verification | 325 app HTML pages pass |
| App dependency audit | No known vulnerabilities in the 319-package graph; all twenty graphs match |
| Deployment helper audit | No known vulnerabilities in its one pinned package |
| Production deployments | All 21 successful |
| Custom domains | All 22 active, including www |
| Complete live HTTP checks | Two consecutive passes, 646/646 requests each |
| HTML covered in live checks | 327, including the directory and its 404 |

The HTTP verifier uses ordinary HTTPS with certificate and hostname validation. It compares all 602 served file paths against expected hashes, checks security headers, tests 21 custom 404s, verifies www redirects with and without a query, and checks HTTP-to-HTTPS redirects on all 21 sites. No HTTP retry loop hides failed responses. Project-scoped asset keys leave file bytes unchanged.

Browser checks cover desktop and 390px phone layouts, all twenty directory links, filters, combined search, no-results reset, local images/fonts and no console errors. A mobile illustration overlap was corrected and rechecked. The published Guess the Surah app completed clue reveal and correct-answer feedback on its custom domain. The earlier full app E2E audit was not repeated.

## Corrections before completion

- Used each project's own upload token and verified its asset namespace. Initial shared-token uploads failed live despite successful deployment stages.
- Adopted deterministic project-scoped hashes after intermittent errors from the earlier keys. An isolated app passed five complete checks, 100 requests total, before rollout. Both final collection checks contain zero failures.
- Moved the unsupported hostname rule from Pages `_redirects` into a zone redirect, preserving paths and queries.
- Kept RUM off and added documented no-transform headers to prevent platform beacon insertion. Final byte checks confirm exact content.
- Refreshed the workstation's temporary DNS cache without changing DNS servers or security settings. Final checks use normal system DNS.

## Evidence and limits

[deployment/evidence/](deployment/evidence/) contains builds, tests, audits, uploads and HTTP results. Final results are in `live-http.json`, with the preceding pass in `live-http-first-pass.json`. Initial failed and isolated checks remain separate. API and official documentation references are in [deployment/README.md](deployment/README.md).

No independent scholarly review, full accessibility certification, physical printer test or Safari/Firefox verification is claimed. No new Astro check was run for these headers and the raw-HTML directory. Source edits remain local and were not pushed. Direct Upload is configured; Git-triggered deployment is not.

The legacy context-path audit still stops at the missing historical `_implementation/qa/batch4/` folder. Its exact failure is preserved in `deployment/evidence/context-audit.log`. Fresh static results now exist, and this missing archived evidence does not affect builds, source integrity or production checks. JavaScript syntax checks and `git diff --check` pass.

The legacy context-path audit still stops at the missing historical `_implementation/qa/batch4/` folder. Its exact failure is preserved in `deployment/evidence/context-audit.log`. Fresh static results now exist, and this missing archived evidence does not affect builds, source integrity or production checks. JavaScript syntax checks and `git diff --check` pass.
