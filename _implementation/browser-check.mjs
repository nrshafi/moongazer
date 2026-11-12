// Minimal headless-Chrome driver over the DevTools protocol (no dependencies).
// Used for V7 checks: phone/desktop viewports, light/dark, clicks, offsets, screenshots.
// Usage from a scenario script:
//   import {launch} from './browser-check.mjs';
//   const b = await launch(); const p = await b.page({width:390,height:844,dark:false});
//   await p.goto(url); await p.eval('document.title'); await p.shot('out.png'); await b.close();
import {spawn} from 'node:child_process';
import {mkdtempSync, writeFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);

const sleep = ms => new Promise(r => setTimeout(r, ms));

// `args` adds Chrome flags, for example --host-resolver-rules to serve a preview under its production host name.
export async function launch({port = 9333 + Math.floor(Math.random() * 500), args = []} = {}) {
  const exe = candidates.find(p => existsSync(p));
  if (!exe) throw new Error('No Chrome or Edge found; set CHROME_PATH');
  const profile = mkdtempSync(join(tmpdir(), 'mg-chrome-'));
  const proc = spawn(exe, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions', ...args, 'about:blank'], {stdio: 'ignore'});
  let version;
  for (let i = 0; i < 100 && !version; i++) { try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await sleep(100); } }
  if (!version) throw new Error('Chrome did not start');
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const {res, rej} = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
    else listeners.forEach(fn => fn(msg));
  };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const n = ++id; pending.set(n, {res, rej}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });

  // `init` is page JavaScript run before every document's own scripts (for example a stubbed navigator.sendBeacon).
  async function page({width = 390, height = 844, dark = false, mobile = width < 700, offline = false, blockStorage = false, init = ''} = {}) {
    const {targetId} = await send('Target.createTarget', {url: 'about:blank'});
    const {sessionId} = await send('Target.attachToTarget', {targetId, flatten: true});
    const s = (m, p) => send(m, p, sessionId);
    await s('Page.enable'); await s('Runtime.enable'); await s('Network.enable');
    await s('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile});
    await s('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: dark ? 'dark' : 'light'}]});
    if (offline) await s('Network.emulateNetworkConditions', {offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0});
    if (blockStorage) await s('Page.addScriptToEvaluateOnNewDocument', {source: "Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('blocked','SecurityError')}});"});
    if (init) await s('Page.addScriptToEvaluateOnNewDocument', {source: init});
    const errors = [];
    listeners.push(msg => { if (msg.sessionId === sessionId && msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text); });
    const evaluate = async (expression) => {
      const r = await s('Runtime.evaluate', {expression: `(async()=>{${expression.includes('return') ? expression : 'return (' + expression + ')'}})()`, awaitPromise: true, returnByValue: true});
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    return {
      errors,
      async goto(url, settle = 400) {
        const loaded = new Promise(res => { const fn = msg => { if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(fn), 1); res(); } }; listeners.push(fn); });
        await s('Page.navigate', {url}); await Promise.race([loaded, sleep(15000)]); await sleep(settle);
      },
      eval: evaluate,
      async click(selector) { const ok = await evaluate(`const el=document.querySelector(${JSON.stringify(selector)});if(!el)return false;el.scrollIntoView({block:'center'});el.click();return true;`); if (!ok) throw new Error('No element ' + selector); await sleep(200); },
      async top(selector) { return evaluate(`const el=document.querySelector(${JSON.stringify(selector)});return el?Math.round(el.getBoundingClientRect().top+scrollY):null;`); },
      // `format` may be 'png' (default), 'jpeg' or 'webp'; `quality` applies to jpeg and webp.
      async shot(path, full = false, {format = 'png', quality} = {}) {
        const params = {format, ...(quality ? {quality} : {})};
        if (full) { const h = await evaluate('document.documentElement.scrollHeight'); params.clip = {x: 0, y: 0, width, height: Math.min(h, 6000), scale: 1}; params.captureBeyondViewport = true; }
        const {data} = await s('Page.captureScreenshot', params); writeFileSync(path, Buffer.from(data, 'base64'));
      },
      close: () => send('Target.closeTarget', {targetId}),
    };
  }
  return {page, async close() { try { await send('Browser.close'); } catch {} proc.kill(); }};
}
