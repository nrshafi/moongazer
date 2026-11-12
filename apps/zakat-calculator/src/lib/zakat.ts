// Zakat calculation engine (P7 T7.6). Pure: no DOM, no storage, no network.
// Every rule below comes from the verified method record (src/data/content.json, copied from
// _implementation/research/zakat/method.json). No difference has a default; an unanswered one gives a "needs-choice" result.
// This shows the calculation for the choices made. It is not a fatwa.
import content from '../data/content.json';

export const LIMIT_SENTENCE = 'This shows the calculation for the choices you made. It is not a fatwa; ask a scholar you trust about your situation.';
export const FITR_SENTENCE = "Ask your local masjid or zakat committee for this year's amount.";
/** Record entry `rate`: one fortieth (2.5%). */
export const RATE_DIVISOR = 40;
export const DEFAULT_CURRENCY = 'BDT';

export interface Position { label: string; summary: string; attribution: { who: string; sourceId: string; locator?: string } }
export interface Source { id: string; url: string; title: string; publisher?: string; note?: string }
export interface Entry { id: string; title: string; statement: string; positions: Position[]; sources: Source[]; notes: string[]; basis: Record<string, string>[] }
export const entries = (content.method.entries as unknown as Entry[]);
export const entryById = (id: string): Entry | undefined => entries.find(entry => entry.id === id);

export interface Option {
  id: string;
  label: string;
  /** Indices into the record entry's `positions`: the attributions shown for this option. */
  positions: number[];
  /** Grams, for nisab conversion options only. */
  grams?: number;
  /** Extra plain-words clarification written by us (editorial). */
  hint?: string;
}
export interface Difference { id: DifferenceId; entry: string; question: string; options: Option[]; hint?: string; needs?: (choices: Choices) => boolean }
export type DifferenceId = 'jewellery' | 'debts' | 'receivables' | 'nisabMetal' | 'goldConversion' | 'silverConversion';

export const DIFFERENCES: Difference[] = [
  {
    id: 'jewellery', entry: 'diff-jewellery', question: 'Gold and silver jewellery you wear',
    hint: 'Jewellery kept as savings or not worn is counted either way in the sources opened.',
    options: [
      { id: 'count', label: 'Count worn jewellery at its gold or silver value', positions: [0] },
      { id: 'exclude', label: 'Leave out permitted jewellery that is worn', positions: [1, 2, 3] },
    ],
  },
  {
    id: 'debts', entry: 'diff-debts-due', question: 'Debts you owe that are due now',
    hint: 'Only the debts you enter below are affected. One of the sources is about a merchant’s case; see the method page.',
    options: [
      { id: 'deduct', label: 'Deduct the debts that are due now', positions: [0, 1, 2] },
      { id: 'none', label: 'Do not deduct debts', positions: [3] },
    ],
  },
  {
    id: 'receivables', entry: 'diff-receivables', question: 'Money owed to you that you expect to receive',
    hint: 'The sources split mainly on doubtful or delayed debts; see the method page.',
    options: [
      { id: 'count', label: 'Count it now, if the debtor is able to pay', positions: [0] },
      { id: 'when-received', label: 'Count it only once it is received', positions: [1, 2, 3] },
    ],
  },
  {
    id: 'nisabMetal', entry: 'diff-nisab-metal', question: 'Which nisab to measure your total against',
    options: [
      { id: 'gold', label: 'The gold nisab only', positions: [0, 1] },
      { id: 'lower', label: 'The lower of the gold and silver nisab values', positions: [2] },
    ],
  },
  {
    id: 'goldConversion', entry: 'nisab-conversions', question: 'Gold nisab weight (published conversions)',
    hint: 'The record lists these without choosing one. Enter the gold price for the same purity.',
    options: [
      { id: 'g85', label: '85 g of gold', grams: 85, positions: [0, 1, 2, 4, 5] },
      { id: 'g85-21k', label: '85 g of 21-carat gold', grams: 85, positions: [3], hint: 'This is a weight of 21-carat gold, not 85 g of pure gold. Enter the price per gram of 21-carat gold.' },
      { id: 'g87.47', label: '87.47 g of gold', grams: 87.47, positions: [6] },
      { id: 'g96', label: '96 g of gold', grams: 96, positions: [7] },
    ],
  },
  {
    id: 'silverConversion', entry: 'nisab-conversions', question: 'Silver nisab weight (published conversions)',
    needs: choices => choices.nisabMetal === 'lower',
    options: [
      { id: 's595', label: '595 g of silver', grams: 595, positions: [0, 1] },
      { id: 's612.35', label: '612.35 g of silver', grams: 612.35, positions: [6] },
    ],
  },
];
export const differenceById = (id: DifferenceId) => DIFFERENCES.find(d => d.id === id)!;

export type Choices = Partial<Record<DifferenceId, string>>;

export interface Inputs {
  currency: string;
  cash: number;
  businessStock: number;
  receivables: number;
  debtsDue: number;
  goldGrams: number;
  silverGrams: number;
  /** Worn jewellery by weight. Counted only under the jewellery option "count". */
  wornGoldGrams: number;
  wornSilverGrams: number;
  /** Gold or silver you know only by value. */
  metalValue: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
}

export const emptyInputs = (): Inputs => ({
  currency: DEFAULT_CURRENCY, cash: 0, businessStock: 0, receivables: 0, debtsDue: 0, goldGrams: 0, silverGrams: 0,
  wornGoldGrams: 0, wornSilverGrams: 0, metalValue: 0, goldPricePerGram: 0, silverPricePerGram: 0,
});

export interface Line { id: string; label: string; amount: number; note?: string }
export interface Result {
  status: 'ok';
  lines: Line[];
  zakatableTotal: number;
  goldNisabGrams: number;
  goldNisabValue: number;
  silverNisabGrams?: number;
  silverNisabValue?: number;
  nisabValue: number;
  /** "gold" or "silver" (silver only when it is the lower value under the "lower" choice). */
  nisabBasis: 'gold' | 'silver';
  atOrAboveNisab: boolean;
  zakatDue: number;
}
export type Outcome = Result | { status: 'needs-choice'; missing: DifferenceId[] } | { status: 'invalid'; problems: string[] };

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

/** Differences that must be answered for these choices, in page order. */
export function requiredDifferences(choices: Choices): Difference[] {
  return DIFFERENCES.filter(d => !d.needs || d.needs(choices));
}
export function missingChoices(choices: Choices): DifferenceId[] {
  return requiredDifferences(choices).filter(d => !d.options.some(o => o.id === choices[d.id])).map(d => d.id);
}
export function optionOf(id: DifferenceId, choices: Choices): Option | undefined {
  return differenceById(id).options.find(o => o.id === choices[id]);
}

export function validateInputs(inputs: Inputs): string[] {
  const problems: string[] = [];
  const checks: [keyof Inputs, string][] = [
    ['cash', 'Cash and bank balances'], ['businessStock', 'Business stock'], ['receivables', 'Money owed to you'], ['debtsDue', 'Debts due now'],
    ['goldGrams', 'Gold weight'], ['silverGrams', 'Silver weight'], ['wornGoldGrams', 'Worn gold jewellery weight'], ['wornSilverGrams', 'Worn silver jewellery weight'],
    ['metalValue', 'Gold or silver by value'], ['goldPricePerGram', 'Gold price per gram'], ['silverPricePerGram', 'Silver price per gram'],
  ];
  for (const [key, label] of checks) if (!isCount(inputs[key])) problems.push(`${label}: enter a number that is zero or more.`);
  return problems;
}

/** Calculates zakat for the inputs and choices. Needs an answer for every difference; never assumes one. */
export function calculate(inputs: Inputs, choices: Choices): Outcome {
  const missing = missingChoices(choices);
  if (missing.length) return { status: 'needs-choice', missing };
  const problems = validateInputs(inputs);
  const goldGrams = optionOf('goldConversion', choices)!.grams!;
  const lower = choices.nisabMetal === 'lower';
  if (!problems.length) {
    if (!(inputs.goldPricePerGram > 0)) problems.push('Gold price per gram: enter today’s price; the gold nisab needs it.');
    if (lower && !(inputs.silverPricePerGram > 0)) problems.push('Silver price per gram: enter today’s price; the lower-of-two choice needs it.');
  }
  if (problems.length) return { status: 'invalid', problems };

  const goldValue = inputs.goldGrams * inputs.goldPricePerGram;
  const silverValue = inputs.silverGrams * inputs.silverPricePerGram;
  const wornValue = inputs.wornGoldGrams * inputs.goldPricePerGram + inputs.wornSilverGrams * inputs.silverPricePerGram;
  const countWorn = choices.jewellery === 'count';
  const countReceivables = choices.receivables === 'count';
  const deductDebts = choices.debts === 'deduct';

  const lines: Line[] = [
    { id: 'cash', label: 'Cash and bank balances', amount: inputs.cash },
    { id: 'stock', label: 'Business stock at market value', amount: inputs.businessStock },
    { id: 'gold', label: 'Gold (weight × price)', amount: goldValue },
    { id: 'silver', label: 'Silver (weight × price)', amount: silverValue },
    { id: 'metal-value', label: 'Gold or silver known by value', amount: inputs.metalValue },
    { id: 'worn', label: 'Worn jewellery', amount: countWorn ? wornValue : 0, note: countWorn ? undefined : 'left out by your choice' },
    { id: 'receivables', label: 'Money owed to you', amount: countReceivables ? inputs.receivables : 0, note: countReceivables ? undefined : 'not counted by your choice' },
    { id: 'debts', label: 'Debts due now', amount: deductDebts ? -inputs.debtsDue : 0, note: deductDebts ? 'deducted' : 'not deducted by your choice' },
  ];
  const total = Math.max(0, lines.reduce((sum, line) => sum + line.amount, 0));
  const goldNisabValue = goldGrams * inputs.goldPricePerGram;
  let nisabValue = goldNisabValue;
  let nisabBasis: 'gold' | 'silver' = 'gold';
  let silverNisabGrams: number | undefined;
  let silverNisabValue: number | undefined;
  if (lower) {
    silverNisabGrams = optionOf('silverConversion', choices)!.grams!;
    silverNisabValue = silverNisabGrams * inputs.silverPricePerGram;
    if (silverNisabValue < goldNisabValue) { nisabValue = silverNisabValue; nisabBasis = 'silver'; }
  }
  const atOrAboveNisab = total >= nisabValue;
  return {
    status: 'ok', lines: lines.map(l => ({ ...l, amount: roundMoney(l.amount) })), zakatableTotal: roundMoney(total),
    goldNisabGrams: goldGrams, goldNisabValue: roundMoney(goldNisabValue), silverNisabGrams, silverNisabValue: silverNisabValue === undefined ? undefined : roundMoney(silverNisabValue),
    nisabValue: roundMoney(nisabValue), nisabBasis, atOrAboveNisab,
    zakatDue: atOrAboveNisab ? roundMoney(total / RATE_DIVISOR) : 0,
  };
}

export interface ChoiceView { id: DifferenceId; question: string; answer: string; attributions: string[]; link: string }
/** The choices made, each with the attributions the record states for that option (for the result and the printout). */
export function describeChoices(choices: Choices): ChoiceView[] {
  return requiredDifferences(choices).flatMap(d => {
    const option = optionOf(d.id, choices);
    if (!option) return [];
    const record = entryById(d.entry)!;
    return [{ id: d.id, question: d.question, answer: option.label, attributions: [...new Set(option.positions.map(i => record.positions[i].attribution.who))], link: `/method/#${d.entry}` }];
  });
}

/** Share text for the end-of-session block. It carries no amounts and no digits. */
export function shareText(): string {
  return 'I worked out my zakat with the Zakat Calculator, which shows the method and the source for each choice: https://zakat-calculator.moongazer.tech/';
}

/** Saved form: only parsed values and option ids. Used with `read`/`write` under the key `inputs`. */
export interface Saved { inputs: Inputs; choices: Choices }
export function isSaved(value: unknown): value is Saved {
  if (!value || typeof value !== 'object') return false;
  const { inputs, choices } = value as Record<string, unknown>;
  if (!inputs || typeof inputs !== 'object' || !choices || typeof choices !== 'object') return false;
  const i = inputs as Record<string, unknown>;
  if (typeof i.currency !== 'string' || i.currency.length > 12) return false;
  for (const key of Object.keys(emptyInputs()) as (keyof Inputs)[]) if (key !== 'currency' && !isCount(i[key])) return false;
  for (const [key, id] of Object.entries(choices as Record<string, unknown>)) {
    const difference = DIFFERENCES.find(d => d.id === key);
    if (!difference || typeof id !== 'string' || !difference.options.some(o => o.id === id)) return false;
  }
  return true;
}
