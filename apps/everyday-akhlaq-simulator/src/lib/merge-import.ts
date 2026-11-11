import { runImport } from './import';
import { importRules } from './business';
import { read, write, announce } from './utils';
runImport(importRules, {
  hash: location.hash,
  read: key => read(key, (_v): _v is unknown => true),
  write: (key, value) => write(key, value),
  clearHash: () => history.replaceState(null, '', location.pathname + location.search),
  announce,
});
