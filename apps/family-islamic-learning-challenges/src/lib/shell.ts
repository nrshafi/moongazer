import { namespace, read, write } from './utils';

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
