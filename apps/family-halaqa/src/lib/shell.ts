import { namespace, read, write, forget } from './utils';

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

// Projector (P5): a header toggle rendered only when <main> or <body> carries data-projector. It lasts the session;
// it is saved under the namespaced key 'projector' only while the app's own 'remember' opt-in is on.
if (document.querySelector('main[data-projector],body[data-projector]')) {
  const root = document.documentElement;
  const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
  const optedIn = () => read('remember', isBoolean) === true;
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'projector-toggle';
  button.className = 'button secondary small projector-toggle';
  const show = (on: boolean) => {
    if (on) root.dataset.projector = 'on'; else delete root.dataset.projector;
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Exit projector' : 'Projector';
  };
  show(optedIn() && read('projector', isBoolean) === true);
  button.addEventListener('click', () => {
    const on = root.dataset.projector !== 'on';
    show(on);
    if (optedIn()) { if (on) write('projector', true); else forget('projector'); }
  });
  if (toggle) toggle.before(button); else document.querySelector('header nav')?.append(button);
}

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

// Feedback (P4): at submit, record how long the page has been open (performance.now(), not the device
// clock) for the server's minimum time-to-submit check, and open the footer form from compact links.
document.addEventListener('submit', event => {
  const input = (event.target as HTMLElement).querySelector<HTMLInputElement>('[data-feedback-time]');
  if (input) input.value = String(Math.round(performance.now()));
});
document.addEventListener('click', event => {
  if (!(event.target as HTMLElement).closest('[data-open-feedback]')) return;
  const details = document.getElementById('site-feedback') as HTMLDetailsElement | null;
  if (details) details.open = true;
});
