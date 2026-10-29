# Publishing Moongazer

The homepage and twenty independent apps use Cloudflare Pages Direct Upload. `targets.json` is the catalog and hostname source of truth. Project names are `moongazer` for the directory and `moongazer-<app-folder>` for each app. Custom app hosts use the complete folder name followed by `.moongazer.tech`.

The latest verified deployment IDs, account, zone and domain statuses belong in `status.json`. Keep credentials outside these records. GitHub Actions automates the existing Direct Upload projects.

## GitHub Actions automation

Pushes to `main` automatically check, test, build and deploy the homepage and all twenty apps. `.github/workflows/deploy.yml` uses `deploy-ci.mjs` and the existing project-scoped asset uploader. Runs are serialized; each deploys the complete collection so a newer push recovers changes from a replaced pending run. Manual runs are restricted to `main`.

`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are configured in GitHub Actions secrets. The user explicitly approved a persistent Pages Write token scoped to this Cloudflare account and publication to main. Keep credentials out of source and logs. If a deployment partially fails, rerun the workflow from GitHub Actions.

The first automatic run passed on 30 October 2026 Asia/Dhaka: 217 tests, twenty Astro checks and builds, 21 deployments, and 646/646 live HTTP checks. See [the run](https://github.com/nrshafi/moongazer/actions/runs/40927531499), `automation-result.json` and `status.json`. Documentation-only completion records may use `[skip ci]` in the commit message to avoid redeploying unchanged app sources.

The Pages deployment and upload-token API schemas were checked through the Cloudflare connector. [Cloudflare's Direct Upload CI guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/) documents the account and token secrets. The uploader preserves the existing project-scoped hashes.

## Build

Use Bun 1.4.4 for the existing Astro 7.4.2 apps. Their lockfiles and manifests stay independent. The directory uses dependency-free HTML, CSS and JavaScript, generated with Node.js.

```powershell
bun _implementation/verify.ts build
node homepage/build.mjs
bun install --cwd deployment --frozen-lockfile
node deployment/upload-assets.mjs --prepare-only
```

The deployment helper's only dependency is pinned `blake3-wasm` 2.1.5. Its `blake3-project-v1` key format hashes the project name, a colon, base64 file contents and the extension, truncated to 32 hex characters. This extends the official uploader's content-and-extension convention with project isolation. The Pages API accepts these deterministic keys, and the live verifier independently hashes the actual served bytes using the same recorded format. The helper never modifies app source, generated app output or dependency internals.

## Upload and deploy

Use the authenticated Cloudflare connector for project, deployment, domain and DNS operations. Verify the intended account and zone before changes. Inspect current resources and reuse them, preserving unrelated DNS and rules.

1. Obtain a short-lived upload JWT separately for each project from `GET /accounts/{account_id}/pages/projects/{project_name}/upload-token`. Keep the returned JWTs in session memory.
2. Start `node deployment/upload-assets.mjs` with a retained terminal. After its readiness message, supply one JSON object mapping project names to their JWTs through hidden stdin. Split large terminal input into small chunks if the tool's review-size limit requires it, and send the newline only after the complete JSON. Never put tokens in shell commands, environment files, output or Git.
3. The helper checks, uploads and verifies each project's asset namespace independently. Shared file bytes do not authorize using another project's upload token. Do not publish until the helper exits successfully. Generated manifests live in ignored `deployment/manifests/`; upload evidence contains counts only. Project-isolated keys were adopted after intermittent errors from the initial keys, with five passing isolated-app checks before collection rollout.
4. Create a production deployment using `POST /accounts/{account_id}/pages/projects/{project_name}/deployments` and multipart FormData. Send `manifest` as the project's JSON path-to-hash mapping, `branch=main`, truthful commit metadata and the original `_headers` file as a text file part. Include `_redirects` only when it contains applicable path rules. Native API response schemas and the implementation used in this session establish these fields.
5. Confirm the deployment's `latest_stage` is `deploy` with status `success`. Associate the custom domain through the Pages domains API, then ensure its proxied CNAME points at the actual Pages project subdomain. Allow distribution and certificate validation to settle, then verify the live responses. API success alone does not prove assets serve correctly.

`--homepage-only` uploads just the directory. `--site=<project-name>` selects one project. Generate all manifests again with `--prepare-only` before a complete collection verification. No long-lived account token is created by this workflow.

## Response policy

Every site sends `Cache-Control: no-transform` to prevent automatic platform payload changes and RUM beacon insertion. Immutable app assets retain their existing cache lifetime. The zone's RUM setting is off; Always Use HTTPS is on. The zone redirect ruleset `dfe473f69c0d468ebbeef8d86bdff6a9` redirects only `www.moongazer.tech` to the apex with status 301, preserving path and query. Pages `_redirects` does not support domain-level source rules.

Keep existing CSP, local fonts, canonical source quotations and media licenses. The directory has no analytics, cookies, accounts, browser storage or external runtime assets. App-owned optional browser storage remains independent.

## Verification

The SEO release is recorded in `seo-release.json` and repository `SEO_QA.md`. Its source changes add canonical URLs, same-host sitemaps, page metadata, local social cards, breadcrumbs and WOFF2 fonts. After regenerated builds, run `bun test _implementation/seo.test.ts` and `python deployment/verify-seo.py`; after publication run `python deployment/verify-seo.py --live` in addition to the complete file verifier below. The local GitHub workflow includes these guards. This SEO release used the connector directly; no new Actions run for these working-tree changes is claimed.

Social cards and font derivatives are source assets. To regenerate them, use `seo-assets.py` with the tooling versions in `seo-assets-requirements.txt`. Normal app builds do not require that Python tooling. `prepare-seo.mjs` prepares the independent profiles/helper/endpoints; inspect shell changes carefully when applying it to a later design. Google ownership verification and the 21 submission URLs are documented in repository `SEARCH_CONSOLE_SETUP.md`.

```powershell
bun _implementation/verify.ts test
python _implementation/verify-static.py
node deployment/upload-assets.mjs --prepare-only
node deployment/verify-live.mjs
```

The live verifier compares every served file with the expected content hash, checks security headers, tests each custom 404, checks the www redirect with query preservation, and checks HTTP-to-HTTPS redirects. It uses normal HTTPS requests by default. Optional `--public-dns` queries Cloudflare's public DNS-over-HTTPS service when the workstation has stale negative DNS. HTTPS still validates the requested hostname and certificate normally. The workstation's temporary DNS cache was refreshed during this release; its DNS servers and security settings were not changed.

Browser QA uses the deployed Pages address if the workstation's domain resolver is stale. Record that distinction. The homepage preview is `node homepage/preview.mjs`, on localhost port 4350. Stop an owned preview after verification. Preserve failed evidence separately from passing retests.

## API and documentation evidence

- Cloudflare connector OpenAPI searches inspected Pages project creation, upload token, asset check/upload/upsert, multipart deployment, custom domain, DNS CNAME, zone settings and redirect ruleset schemas.
- [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Custom domains and CNAME association order](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Redirect syntax and unsupported domain-level sources](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Web Analytics FAQ and no-transform](https://developers.cloudflare.com/web-analytics/faq/)
- [Official uploader asset workflow](https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/pages/upload.ts)
- [Official content hashing implementation](https://github.com/cloudflare/workers-sdk/blob/main/packages/deploy-helpers/src/deploy/helpers/hash.ts)
- Installed `deployment/node_modules/blake3-wasm/dist/node/hash-fn.d.ts` verified the hash function's accepted input and result.

The initial live check found missing project-scoped assets, a domain-level Pages redirect that was ignored, and a platform-inserted analytics beacon. Project-specific uploads followed by new deployments, a zone redirect rule, and regenerated no-transform headers address those findings. Initial failed HTTP evidence remains in `evidence/live-http-initial.json` and its log. Final evidence must pass before marking the deployment complete.
