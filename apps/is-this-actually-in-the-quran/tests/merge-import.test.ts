import { test, expect } from 'bun:test';
import { encodePayload, decodeFragment, planImport } from '../src/lib/import';
import { rules } from '../src/lib/merge-import';
import { claimIdMap } from '../src/data/content.json';

const FROM = 'islamic-misinformation-casebook';
const plan = (items: Record<string, unknown>, existing: Record<string, unknown> = {}, from = FROM) => {
  const payload = decodeFragment('#import=' + encodePayload(from, items)!)!;
  return planImport(payload, rules, key => existing[key] ?? null);
};

test('old case ids are mapped to claim ids and written to claim-bookmarks', () => {
  const result = plan({ bookmarks: ['spider-material', 'anger-strength'] });
  expect(result.writes).toEqual([['claim-bookmarks', [claimIdMap['spider-material'], claimIdMap['anger-strength']]]]);
  expect(result.accepted).toBe(2);
});

test('existing claim bookmarks are kept and merged as a union', () => {
  const result = plan({ bookmarks: ['spider-material', 'ancestry'] }, { 'claim-bookmarks': [claimIdMap['ancestry'], 'garden-and-3-92'] });
  expect(result.writes[0]![1]).toEqual([claimIdMap['ancestry'], 'garden-and-3-92', claimIdMap['spider-material']]);
});

test('invalid values are dropped: unknown id, duplicates, non-list, wrong source, other key', () => {
  expect(plan({ bookmarks: ['spider-material', 'no-such-case'] }).writes).toEqual([]);
  expect(plan({ bookmarks: ['ancestry', 'ancestry'] }).writes).toEqual([]);
  expect(plan({ bookmarks: 'ancestry' }).writes).toEqual([]);
  expect(plan({ bookmarks: ['ancestry'] }, {}, 'someone-else').writes).toEqual([]);
  expect(plan({ progress: ['ancestry'] }).writes).toEqual([]);
});
