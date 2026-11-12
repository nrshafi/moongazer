import { test, expect } from 'bun:test';
import { readFileSync, existsSync } from 'node:fs';
import content from '../src/data/content.json';
import {
  calculate, describeChoices, DIFFERENCES, emptyInputs, entries, entryById, isSaved, LIMIT_SENTENCE, missingChoices, shareText,
  type Choices, type Inputs, type Result,
} from '../src/lib/zakat';

const examples = content.method.examples as unknown as { id: string; inputs: Record<string, number | string>; expected: Record<string, any> }[];
const example = (id: string) => examples.find(e => e.id === id)!;

const base: Choices = { jewellery: 'count', debts: 'deduct', receivables: 'count', nisabMetal: 'gold', goldConversion: 'g85', silverConversion: 's595' };
const withInputs = (patch: Partial<Inputs>): Inputs => ({ ...emptyInputs(), goldPricePerGram: 100, silverPricePerGram: 1, ...patch });
const ok = (inputs: Inputs, choices: Choices) => { const r = calculate(inputs, choices); if (r.status !== 'ok') throw new Error(`expected ok, got ${r.status}`); return r as Result; };

test('ex-1-basic (IW-81355, bukhari:1454): cash above the 85 g gold nisab', () => {
  const e = example('ex-1-basic');
  const r = ok(withInputs({ cash: e.inputs.cashAndBank as number, goldPricePerGram: e.inputs.goldPricePerGram as number }), { ...base, nisabMetal: 'gold' });
  expect(r.nisabValue).toBe(e.expected.nisabValue);
  expect(r.zakatableTotal).toBe(e.expected.zakatableTotal);
  expect(r.atOrAboveNisab).toBe(e.expected.atOrAboveNisab);
  expect(r.zakatDue).toBe(e.expected.zakatDue);
});

test('ex-2-metal-choice (IW-138743, IW-120628): same cash, different result by nisab choice', () => {
  const e = example('ex-2-metal-choice');
  const inputs = withInputs({ cash: e.inputs.cashAndBank as number, goldPricePerGram: e.inputs.goldPricePerGram as number, silverPricePerGram: e.inputs.silverPricePerGram as number });
  const gold = ok(inputs, { ...base, nisabMetal: 'gold' });
  expect(gold.nisabValue).toBe(e.expected.ifGold.nisabValue);
  expect(gold.atOrAboveNisab).toBe(e.expected.ifGold.atOrAboveNisab);
  expect(gold.zakatDue).toBe(e.expected.ifGold.zakatDue);
  const lower = ok(inputs, { ...base, nisabMetal: 'lower' });
  expect(lower.nisabValue).toBe(e.expected.ifLowerOfTheTwo.nisabValue);
  expect(lower.nisabBasis).toBe('silver');
  expect(lower.atOrAboveNisab).toBe(e.expected.ifLowerOfTheTwo.atOrAboveNisab);
  expect(lower.zakatDue).toBe(e.expected.ifLowerOfTheTwo.zakatDue);
});

test('ex-3-debts (EG-6754, JO-3712): deduct or not deduct debts due', () => {
  const e = example('ex-3-debts');
  const inputs = withInputs({ cash: e.inputs.cashAndBank as number, debtsDue: e.inputs.debtsDue as number });
  const deduct = ok(inputs, { ...base, debts: 'deduct' });
  expect(deduct.zakatableTotal).toBe(e.expected.ifDeduct.zakatableTotal);
  expect(deduct.zakatDue).toBe(e.expected.ifDeduct.zakatDue);
  const none = ok(inputs, { ...base, debts: 'none' });
  expect(none.zakatableTotal).toBe(e.expected.ifNotDeduct.zakatableTotal);
  expect(none.zakatDue).toBe(e.expected.ifNotDeduct.zakatDue);
});

test('ex-4-receivables (EG-7746): count money owed now or only once received', () => {
  const e = example('ex-4-receivables');
  const inputs = withInputs({ cash: e.inputs.cashAndBank as number, receivables: e.inputs.receivablesFromAbleDebtor as number });
  const counted = ok(inputs, { ...base, receivables: 'count' });
  expect(counted.zakatableTotal).toBe(e.expected.ifCountReceivables.zakatableTotal);
  expect(counted.zakatDue).toBe(e.expected.ifCountReceivables.zakatDue);
  const later = ok(inputs, { ...base, receivables: 'when-received' });
  expect(later.zakatableTotal).toBe(e.expected.ifCountOnlyWhenReceived.zakatableTotal);
  expect(later.zakatDue).toBe(e.expected.ifCountOnlyWhenReceived.zakatDue);
});

test('ex-5-jewellery (MY-38, JO-525): worn gold counted or left out', () => {
  const e = example('ex-5-jewellery');
  const inputs = withInputs({ wornGoldGrams: e.inputs.jewelleryWornGoldGrams as number });
  const counted = ok(inputs, { ...base, jewellery: 'count' });
  expect(counted.zakatableTotal).toBe(e.expected.ifCountWornJewellery.zakatableTotal);
  expect(counted.zakatDue).toBe(e.expected.ifCountWornJewellery.zakatDue);
  const left = ok(inputs, { ...base, jewellery: 'exclude' });
  expect(left.zakatableTotal).toBe(e.expected.ifExcludeWornJewellery.zakatableTotal);
  expect(left.zakatDue).toBe(e.expected.ifExcludeWornJewellery.zakatDue);
});

test('every worked example in the record has a test above', () => {
  expect(examples.map(e => e.id).sort()).toEqual(['ex-1-basic', 'ex-2-metal-choice', 'ex-3-debts', 'ex-4-receivables', 'ex-5-jewellery']);
});

test('property: zero assets give zero zakat and are below the nisab', () => {
  for (const nisabMetal of ['gold', 'lower']) {
    const r = ok(withInputs({}), { ...base, nisabMetal });
    expect(r.zakatableTotal).toBe(0);
    expect(r.atOrAboveNisab).toBe(false);
    expect(r.zakatDue).toBe(0);
  }
});

test('property: any total below the nisab gives zero; at the nisab it is due', () => {
  for (const cash of [1, 4000, 8499, 8499.99]) expect(ok(withInputs({ cash }), base).zakatDue).toBe(0);
  const at = ok(withInputs({ cash: 8500 }), base);
  expect(at.atOrAboveNisab).toBe(true);
  expect(at.zakatDue).toBe(212.5);
});

test('property: above the nisab zakat is linear, one fortieth of the total', () => {
  for (const cash of [8500, 9000, 20000, 123456, 1_000_000]) expect(ok(withInputs({ cash }), base).zakatDue).toBe(Math.round(cash / 40 * 100) / 100);
  const a = ok(withInputs({ cash: 20000 }), base).zakatDue;
  const b = ok(withInputs({ cash: 40000 }), base).zakatDue;
  expect(b).toBe(a * 2);
});

test('the chosen conversion sets the nisab: 96 g gold at 100 per gram is 9600', () => {
  const r = ok(withInputs({ cash: 9000 }), { ...base, goldConversion: 'g96' });
  expect(r.goldNisabGrams).toBe(96);
  expect(r.nisabValue).toBe(9600);
  expect(r.zakatDue).toBe(0);
});

test('an unanswered difference returns a needs-choice state naming it', () => {
  const r = calculate(withInputs({ cash: 20000 }), { ...base, debts: undefined });
  expect(r.status).toBe('needs-choice');
  if (r.status === 'needs-choice') expect(r.missing).toEqual(['debts']);
  const none = calculate(withInputs({ cash: 20000 }), {});
  if (none.status === 'needs-choice') expect(none.missing).toEqual(['jewellery', 'debts', 'receivables', 'nisabMetal', 'goldConversion']);
  else throw new Error('expected needs-choice');
  expect(missingChoices({ ...base, nisabMetal: 'lower', silverConversion: undefined })).toEqual(['silverConversion']);
  expect(missingChoices({ ...base, nisabMetal: 'gold', silverConversion: undefined })).toEqual([]);
});

test('invalid numbers and missing prices are reported, not guessed', () => {
  expect(calculate(withInputs({ cash: -1 }), base).status).toBe('invalid');
  expect(calculate(withInputs({ cash: Number.NaN }), base).status).toBe('invalid');
  expect(calculate(withInputs({ goldPricePerGram: 0 }), base).status).toBe('invalid');
  expect(calculate(withInputs({ silverPricePerGram: 0 }), { ...base, nisabMetal: 'lower' }).status).toBe('invalid');
  expect(calculate(withInputs({ silverPricePerGram: 0 }), base).status).toBe('ok');
});

test('share text contains no digits of amounts', () => {
  expect(shareText()).not.toMatch(/\d/);
  expect(shareText()).not.toMatch(/\b(BDT|USD|GBP|EUR)\b/);
});

test('the limit sentence is verbatim', () => {
  expect(LIMIT_SENTENCE).toBe('This shows the calculation for the choices you made. It is not a fatwa; ask a scholar you trust about your situation.');
});

test('describeChoices lists each choice with the attributions the record states', () => {
  const list = describeChoices({ ...base, jewellery: 'count' });
  const jewellery = list.find(c => c.id === 'jewellery')!;
  expect(jewellery.attributions).toEqual(['Hanafi school, as stated by the Mufti of the Federal Territory']);
  expect(jewellery.link).toBe('/method/#diff-jewellery');
  expect(list.some(c => c.id === 'silverConversion')).toBe(false);
});

test('data: every difference and option maps to a record entry with at least one source and real positions', () => {
  for (const d of DIFFERENCES) {
    const entry = entryById(d.entry);
    expect(entry).toBeDefined();
    expect(entry!.sources.length).toBeGreaterThan(0);
    expect(d.options.length).toBeGreaterThanOrEqual(2);
    expect(new Set(d.options.map(o => o.id)).size).toBe(d.options.length);
    for (const option of d.options) {
      expect(option.positions.length).toBeGreaterThan(0);
      for (const i of option.positions) {
        const position = entry!.positions[i];
        expect(position).toBeDefined();
        expect(entry!.sources.some(s => s.id === position.attribution.sourceId)).toBe(true);
      }
      if (d.id === 'goldConversion' || d.id === 'silverConversion') {
        // The grams shown must appear in the labels of every position they are attributed to.
        const gram = String(option.grams);
        for (const i of option.positions) expect(entry!.positions[i].label + ' ' + entry!.positions[i].summary).toContain(gram);
      }
    }
  }
});

test('data: no entry shown by the app is missing basis or sources, and fitr entries record no amounts', () => {
  for (const entry of entries) expect(entry.sources.length).toBeGreaterThan(0);
  for (const id of ['fitr-facts', 'fitr-food-vs-cash']) {
    const text = JSON.stringify(entryById(id)!.positions) + entryById(id)!.statement;
    expect(text).not.toMatch(/\b\d+(\.\d+)?\s*(g|kg|grams?|kilograms?|dollars?|riyals?|dinars?|taka|bdt|usd)\b/i);
  }
});

test('saved form validation accepts our shape and rejects anything else', () => {
  expect(isSaved({ inputs: emptyInputs(), choices: base })).toBe(true);
  expect(isSaved({ inputs: { ...emptyInputs(), cash: -5 }, choices: base })).toBe(false);
  expect(isSaved({ inputs: emptyInputs(), choices: { jewellery: 'whatever' } })).toBe(false);
  expect(isSaved('x')).toBe(false);
});

const recordUrl = new URL('../../../_implementation/research/zakat/method.json', import.meta.url);
test('content.json matches the verified method record when the repository record is present', () => {
  if (!existsSync(recordUrl)) return;
  const record = JSON.parse(readFileSync(recordUrl, 'utf8'));
  expect(content.method).toEqual(record);
});
