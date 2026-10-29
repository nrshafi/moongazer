export const DAY = 86400000;
export function namespace() { return document.body.dataset.app || 'islamic-learning'; }
export function read<T>(key: string, validate: (value: unknown) => value is T): T | null {
  try {
    const raw = JSON.parse(localStorage.getItem(namespace() + ':' + key) || 'null');
    if (!raw || typeof raw.at !== 'number' || raw.at > Date.now() + 60000 || Date.now() - raw.at >= 30 * DAY || !validate(raw.value)) { localStorage.removeItem(namespace() + ':' + key); return null; }
    return raw.value;
  } catch { return null; }
}
export function write(key: string, value: unknown) { try { localStorage.setItem(namespace() + ':' + key, JSON.stringify({ at: Date.now(), value })); return true; } catch { return false; } }
export function forget(key: string) { try { localStorage.removeItem(namespace() + ':' + key); } catch {} }
export function esc(value: unknown) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!)); }
export function shuffle<T>(items: readonly T[], seed = Math.floor(Math.random()*2147483647)): T[] {
  const result=[...items]; let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j]!,result[i]!];}return result;
}
export function hash(text: string) { let h=2166136261;for(const c of text) h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0; }
export function announce(message: string) { const toast=document.getElementById('toast');if(!toast)return;toast.textContent=message;toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),3200); }
export async function copy(text: string, label='Copied to clipboard') {
  try { await navigator.clipboard.writeText(text);announce(label); }
  catch {
    const dialog=document.createElement('dialog');dialog.innerHTML='<form method="dialog"><button class="icon-button dialog-close" aria-label="Close">×</button></form><h2>Copy and share</h2><p>Select and copy the text below.</p><textarea class="share-text" aria-label="Text to copy" readonly></textarea>';
    dialog.querySelector('textarea')!.value=text;document.body.append(dialog);dialog.showModal();dialog.querySelector('textarea')!.select();dialog.addEventListener('close',()=>dialog.remove());
  }
}
export function cleanSeed(value: string | null) { return value && /^[a-zA-Z0-9_-]{1,40}$/.test(value) ? value : null; }
export function challengeUrl(params: Record<string,string>) { const url=new URL(location.pathname,location.origin);for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value);return url.href; }
export function byId<T extends HTMLElement=HTMLElement>(id:string) { const element=document.getElementById(id);if(!element)throw new Error(`Missing #${id}`);return element as T; }
export function focusHeading(root: HTMLElement) { const heading=root.querySelector<HTMLElement>('h2,h3');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});} }
