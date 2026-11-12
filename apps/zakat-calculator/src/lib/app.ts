// Zakat Calculator UI (P7 T7.6). Reads the form, calls the pure engine in zakat.ts and renders the result with DOM text nodes only.
import { byId, read, write, forget, announce } from './utils';
import { track } from './counter';
import { renderSessionEnd } from './session-end';
import learning from '../data/learning.json';
import {
  calculate, describeChoices, DIFFERENCES, emptyInputs, isSaved, LIMIT_SENTENCE, missingChoices, shareText, differenceById,
  type Choices, type DifferenceId, type Inputs, type Result,
} from './zakat';

const form = byId<HTMLFormElement>('calc');
const results = byId('results');
const status = byId('form-status');
const remember = byId<HTMLInputElement>('remember');
const sessionEnd = byId('session-end');

const NUMBER_FIELDS: [keyof Inputs, string][] = [
  ['cash', 'cash'], ['businessStock', 'stock'], ['receivables', 'receivables'], ['debtsDue', 'debts'], ['goldGrams', 'goldGrams'], ['silverGrams', 'silverGrams'],
  ['wornGoldGrams', 'wornGoldGrams'], ['wornSilverGrams', 'wornSilverGrams'], ['metalValue', 'metalValue'],
  ['goldPricePerGram', 'goldPricePerGram'], ['silverPricePerGram', 'silverPricePerGram'],
];
const input = (id: string) => byId<HTMLInputElement>(id);

function readInputs(): Inputs {
  const inputs = emptyInputs();
  inputs.currency = input('currency').value.trim().slice(0, 12) || inputs.currency;
  for (const [key, id] of NUMBER_FIELDS) {
    const el = input(id);
    (inputs[key] as number) = el.validity.badInput ? Number.NaN : el.value.trim() === '' ? 0 : Number(el.value);
  }
  return inputs;
}
function readChoices(): Choices {
  const choices: Choices = {};
  for (const d of DIFFERENCES) {
    const picked = form.querySelector<HTMLInputElement>(`input[name="${d.id}"]:checked`);
    if (picked) choices[d.id] = picked.value;
  }
  return choices;
}
function fillForm(inputs: Inputs, choices: Choices) {
  input('currency').value = inputs.currency;
  for (const [key, id] of NUMBER_FIELDS) input(id).value = inputs[key] ? String(inputs[key]) : '';
  for (const [id, value] of Object.entries(choices)) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="${id}"][value="${CSS.escape(String(value))}"]`);
    if (radio) radio.checked = true;
  }
}

const fmt = (value: number) => new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function syncSilverChoice() {
  const fieldset = form.querySelector<HTMLElement>('[data-diff="silverConversion"]')!;
  fieldset.hidden = readChoices().nisabMetal !== 'lower';
}

function clearOutput() {
  results.replaceChildren();
  sessionEnd.replaceChildren();
}

function persist() {
  if (remember.checked) write('inputs', { inputs: readInputs(), choices: readChoices() });
}

let started = false;
function onChange(event?: Event) {
  if (event?.target === remember) return;
  if (!started) { started = true; track('activity_started', 'calculator'); }
  syncSilverChoice();
  clearOutput();
  status.textContent = '';
  for (const fieldset of form.querySelectorAll('[data-missing]')) fieldset.removeAttribute('data-missing');
  persist();
}

function askForChoices(missing: DifferenceId[]) {
  const names = missing.map(id => differenceById(id).question.toLowerCase());
  status.textContent = `Please choose an option for each point where scholars differ. Still to choose: ${names.join('; ')}.`;
  for (const id of missing) form.querySelector(`[data-diff="${id}"]`)?.setAttribute('data-missing', '');
  const first = form.querySelector<HTMLElement>(`[data-diff="${missing[0]}"]`)!;
  const radio = first.querySelector<HTMLInputElement>('input[type=radio]');
  first.scrollIntoView({ block: 'center' });
  radio?.focus({ preventScroll: true });
}

function renderResult(inputs: Inputs, choices: Choices, r: Result) {
  const cur = inputs.currency;
  const money = (n: number) => `${cur} ${fmt(n)}`;
  const root = el('section', 'result-card');
  root.dataset.state = r.atOrAboveNisab ? 'above' : 'below';
  root.setAttribute('aria-labelledby', 'result-title');
  const title = el('h2', undefined, 'Your result');
  title.id = 'result-title';
  root.append(title);
  root.append(el('p', 'print-only micro', `Zakat Calculator summary, prepared ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Currency label: ${cur}. Prices were entered by the person who prepared this.`));
  root.append(el('p', 'verdict', r.atOrAboveNisab ? 'Your zakatable total is at or above the nisab you chose.' : 'Your zakatable total is below the nisab you chose, so no zakat is due on this calculation.'));
  const due = el('p', 'due');
  due.append(el('span', 'due-label', 'Zakat due'), ' ', el('strong', 'due-amount', money(r.zakatDue)));
  root.append(due);
  if (r.atOrAboveNisab) root.append(el('p', 'micro', `One fortieth (2.5%) of ${money(r.zakatableTotal)}.`));

  const nisab = el('div', 'nisab-box');
  nisab.append(el('h3', undefined, 'The nisab used'));
  const list = el('ul');
  list.append(el('li', undefined, `Gold nisab: ${r.goldNisabGrams} g × ${fmt(inputs.goldPricePerGram)} = ${money(r.goldNisabValue)}.`));
  if (r.silverNisabGrams !== undefined) list.append(el('li', undefined, `Silver nisab: ${r.silverNisabGrams} g × ${fmt(inputs.silverPricePerGram)} = ${money(r.silverNisabValue!)}.`));
  list.append(el('li', undefined, `Measured against: ${r.nisabBasis === 'silver' ? 'the silver nisab (the lower of the two)' : choices.nisabMetal === 'lower' ? 'the gold nisab (the lower of the two)' : 'the gold nisab'}, ${money(r.nisabValue)}.`));
  nisab.append(list);
  root.append(nisab);

  const table = el('table', 'breakdown');
  table.append(el('caption', undefined, 'Line by line'));
  const head = el('thead'); const hr = el('tr');
  for (const [text, cls] of [['Item', ''], ['Amount', 'num']] as const) { const th = el('th', cls, text); th.scope = 'col'; hr.append(th); }
  head.append(hr); table.append(head);
  const body = el('tbody');
  for (const line of r.lines) {
    const tr = el('tr');
    const label = el('th', undefined, line.label); label.scope = 'row';
    if (line.note) label.append(el('span', 'line-note', ` (${line.note})`));
    tr.append(label, el('td', 'num', fmt(line.amount)));
    body.append(tr);
  }
  const total = el('tr', 'total');
  const totalHead = el('th', undefined, 'Zakatable total'); totalHead.scope = 'row';
  total.append(totalHead, el('td', 'num', fmt(r.zakatableTotal)));
  body.append(total);
  table.append(body);
  const wrap = el('div', 'table-wrap'); wrap.append(table);
  root.append(wrap);

  const choicesBox = el('div', 'choices-made');
  choicesBox.append(el('h3', undefined, 'Choices you made'));
  const dl = el('dl');
  for (const choice of describeChoices(choices)) {
    dl.append(el('dt', undefined, choice.question));
    const dd = el('dd');
    dd.append(el('strong', undefined, choice.answer));
    dd.append(el('span', 'attrib', choice.attributions.join('; ')));
    const link = el('a', 'learn no-print', 'Learn more');
    link.href = choice.link;
    dd.append(' ', link);
    dl.append(dd);
  }
  choicesBox.append(dl);
  root.append(choicesBox);

  root.append(el('p', 'limit', LIMIT_SENTENCE));
  const actions = el('div', 'actions no-print');
  const print = el('button', 'button secondary', 'Print this summary');
  print.type = 'button';
  print.addEventListener('click', () => window.print());
  actions.append(print);
  root.append(actions);
  results.replaceChildren(root);

  const next = learning.related[0];
  renderSessionEnd(sessionEnd, {
    result: r.atOrAboveNisab ? 'You worked out your zakat with every choice shown.' : 'You checked your total against the nisab with every choice shown.',
    learned: [
      `Zakat on money and precious metals is one fortieth once the total reaches the nisab (Sahih al-Bukhari 1454).`,
      'Where scholars differ, each option was attributed to the source that states it. See the method page.',
    ],
    shareText: shareText(),
    itemId: 'calculator',
    next: { name: next.name, url: next.url },
  });
  root.scrollIntoView({ block: 'start' });
  (results as HTMLElement).focus({ preventScroll: true });
  announce('Result ready');
}

form.addEventListener('input', onChange);
form.addEventListener('change', onChange);
form.addEventListener('submit', event => {
  event.preventDefault();
  clearOutput();
  const inputs = readInputs();
  const choices = readChoices();
  const missing = missingChoices(choices);
  if (missing.length) { askForChoices(missing); return; }
  const outcome = calculate(inputs, choices);
  if (outcome.status === 'invalid') {
    status.textContent = outcome.problems.join(' ');
    const target = NUMBER_FIELDS.map(([, id]) => input(id)).find(i => i.validity.badInput || Number(i.value) < 0)
      ?? (inputs.goldPricePerGram > 0 ? input('silverPricePerGram') : input('goldPricePerGram'));
    target.focus();
    return;
  }
  if (outcome.status === 'needs-choice') { askForChoices(outcome.missing); return; }
  status.textContent = '';
  renderResult(inputs, choices, outcome);
  track('activity_completed', 'calculator');
});

remember.addEventListener('change', () => {
  if (remember.checked) persist(); else forget('inputs');
});

// Restore only what the visitor chose to save earlier. Storage may be blocked; then the form simply starts empty.
const saved = read('inputs', isSaved);
if (saved) { fillForm(saved.inputs, saved.choices); remember.checked = true; }
syncSilverChoice();
