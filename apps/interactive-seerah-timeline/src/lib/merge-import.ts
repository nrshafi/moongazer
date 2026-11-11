import { runImport, type ImportRule } from './import';
import { read, write, announce } from './utils';
import { packs } from '../data/content.json';
import { valid } from './challenge';

// Saved progress from Islamic History Timeline Challenge. Same event and pack ids, same shape, so no value mapping is needed.
// The old app saved only when its "Remember" box was ticked and kept no separate flag. An existing local game is kept.
const rules: ImportRule[] = [
  { from: 'islamic-history-timeline-challenge', key: 'progress', to: () => 'challenge-progress', validate: value => valid(value, packs), merge: 'keep' },
];

export { rules };

/** Browser entry: call once from the page script before reading saved progress. */
export function importSaved() {
  runImport(rules, {
    hash: location.hash,
    read: key => read(key, (_v): _v is unknown => true),
    write: (key, value) => write(key, value),
    clearHash: () => history.replaceState(null, '', location.pathname + location.search),
    announce,
  });
}
