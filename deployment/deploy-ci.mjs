// Cloudflare Pages Direct Upload endpoints: deployment/README.md.
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const commit = process.env.DEPLOY_COMMIT;
if (!account || !token || !/^[a-f0-9]{40}$/i.test(commit || '')) {
  throw new Error('Missing Cloudflare credentials or valid commit SHA');
}
const targets = JSON.parse(await readFile(new URL('./targets.json', import.meta.url), 'utf8'));
// App projects only. The apex (`moongazer`) has Pages Functions and a D1 binding, so CI deploys it
// with `wrangler pages deploy` from homepage/ in a separate step (see .github/workflows/deploy.yml).
const projects = targets.map(({slug}) => `moongazer-${slug}`);
const base = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/pages/projects`;

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(90000),
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(`Cloudflare request failed: HTTP ${response.status}, codes ${(body.errors || []).map(error => error.code).join(',')}`);
  }
  return body.result;
}

const uploadTokens = {};
for (const project of projects) {
  const result = await request(`/${encodeURIComponent(project)}/upload-token`);
  uploadTokens[project] = result.jwt;
}
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['deployment/upload-assets.mjs', '--apps-only'], {stdio: ['pipe', 'inherit', 'inherit']});
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Asset upload failed: ${code}`)));
  child.stdin.on('error', reject);
  child.stdin.end(`${JSON.stringify(uploadTokens)}\n`);
});

const manifests = JSON.parse(await readFile(new URL('./manifests/pending.json', import.meta.url), 'utf8'));
if (manifests.length !== projects.length || projects.some(project => !manifests.some(site => site.name === project))) {
  throw new Error('Deployment manifest does not match the project catalog');
}
for (const site of manifests) {
  const form = new FormData();
  form.append('manifest', JSON.stringify(site.manifest));
  form.append('branch', 'main');
  form.append('commit_hash', commit);
  form.append('commit_dirty', 'false');
  form.append('_headers', new Blob([site.headers], {type: 'text/plain'}), '_headers');
  if (site.redirects) form.append('_redirects', new Blob([site.redirects], {type: 'text/plain'}), '_redirects');
  const projectPath = `/${encodeURIComponent(site.name)}/deployments`;
  let deployment = await request(projectPath, {method: 'POST', body: form});
  if (deployment.environment !== 'production') throw new Error(`${site.name} did not create a production deployment`);
  for (let attempt = 0; attempt < 60 && !(deployment.latest_stage?.name === 'deploy' && deployment.latest_stage?.status === 'success'); attempt++) {
    if (['failure', 'canceled'].includes(deployment.latest_stage?.status)) throw new Error(`${site.name} deployment failed`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    deployment = await request(`${projectPath}/${encodeURIComponent(deployment.id)}`);
  }
  if (deployment.latest_stage?.name !== 'deploy' || deployment.latest_stage?.status !== 'success') {
    throw new Error(`${site.name} deployment did not finish successfully`);
  }
  console.log(`${site.name}: production deployment ${deployment.id} succeeded`);
}
