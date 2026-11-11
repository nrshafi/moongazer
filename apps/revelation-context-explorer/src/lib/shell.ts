import { namespace, read, write } from './utils';
import { encodePayload } from './import';

// Focus outlines are reserved for keyboard navigation, including new controls.
document.addEventListener('pointerdown', () => {
  document.documentElement.dataset.inputMethod = 'pointer';
}, {capture: true, passive: true});
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') document.documentElement.dataset.inputMethod = 'keyboard';
}, true);
const toggle=document.getElementById('theme-toggle');
const themeLabel=()=>{const dark=document.documentElement.dataset.theme==='dark';toggle?.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);toggle?.setAttribute('title',`Switch to ${dark?'light':'dark'} mode`);};
themeLabel();
toggle?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;write('theme',next);themeLabel();});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',event=>{if(!read('theme',(value):value is string=>value==='dark'||value==='light')){document.documentElement.dataset.theme=event.matches?'dark':'light';themeLabel();}});
const dialog=document.getElementById('storage-dialog') as HTMLDialogElement;
document.getElementById('storage-open')?.addEventListener('click',()=>dialog.showModal());
document.getElementById('storage-clear')?.addEventListener('click',()=>{try {const prefix=namespace()+':';for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key?.startsWith(prefix))localStorage.removeItem(key);}}catch{}location.reload();});
document.addEventListener('click',event=>{const target=event.target as HTMLElement;if(target.closest('[data-print]'))window.print();});

// Printed evidence and facilitator notes must not disappear inside closed details.
let closedBeforePrint: HTMLDetailsElement[] = [];
window.addEventListener('beforeprint', () => {
  closedBeforePrint = [...document.querySelectorAll<HTMLDetailsElement>('details')].filter(item => !item.open);
  closedBeforePrint.forEach(item => { item.open = true; });
});
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(item => { item.open = false; });
  closedBeforePrint = [];
});

// Moved apps (P3 step A): the shell renders a banner with #moved-link when config.json has "moved".
// On click, carry this app's saved items (except the theme) to the receiving app in the URL fragment.
const movedLink = document.getElementById('moved-link') as HTMLAnchorElement | null;
movedLink?.addEventListener('click', () => {
  const items: Record<string, unknown> = {};
  try {
    const prefix = namespace() + ':';
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key?.startsWith(prefix)) keys.push(key.slice(prefix.length)); }
    for (const key of keys) { if (key === 'theme') continue; const value = read(key, (v): v is unknown => true); if (value !== null) items[key] = value; }
  } catch { /* storage blocked: open the new page without saved items */ }
  const payload = encodePayload(namespace(), items);
  movedLink.href = movedLink.href.split('#')[0] + (payload ? '#import=' + payload : '');
});
