// Copies the verified method record into src/data/content.json (as `method`) and records the SHA-256 values in provenance.json.
// Run from the app folder: bun scripts/sync-method.ts   (inside the repository only; the record lives in _implementation/research/zakat/).
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const recordUrl = new URL('../../../_implementation/research/zakat/method.json', import.meta.url);
const verificationUrl = new URL('../../../_implementation/research/zakat/verification.json', import.meta.url);
const contentUrl = new URL('../src/data/content.json', import.meta.url);
const sourcesUrl = new URL('../src/data/sources.json', import.meta.url);
const provenanceUrl = new URL('../src/data/provenance.json', import.meta.url);
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
const lf = (text: string) => text.replace(/\r\n/g, '\n');

const recordText = readFileSync(recordUrl, 'utf8');
const method = JSON.parse(recordText);
const contentText = JSON.stringify({ method }, null, 2) + '\n';
writeFileSync(contentUrl, contentText);

// Source list for the Sources page: every distinct source in the record, in first-use order.
const seen = new Map<string, { url: string; label: string; kind: string }>();
for (const entry of method.entries) for (const source of entry.sources) {
  if (!seen.has(source.id)) seen.set(source.id, { url: source.url, label: `${source.title} (${source.publisher})`, kind: source.id === 'SUNNAH' ? 'Hadith text' : 'Published fatwa or guidance' });
}
writeFileSync(sourcesUrl, JSON.stringify([...seen.values()], null, 2) + '\n');

const provenance = JSON.parse(readFileSync(provenanceUrl, 'utf8'));
provenance.status = 'verified-record';
provenance.note = 'Method content is copied by script from the second-pass verified method record. It is a source-checked summary, not a scholarly review and not a fatwa.';
provenance.methodRecord = '_implementation/research/zakat/method.json';
provenance.methodRecordSha256 = sha(lf(recordText));
provenance.verificationRecord = '_implementation/research/zakat/verification.json';
provenance.verificationRecordSha256 = sha(lf(readFileSync(verificationUrl, 'utf8')));
provenance.appContentSha256 = sha(lf(contentText));
provenance.contentFile = 'src/data/content.json';
writeFileSync(provenanceUrl, JSON.stringify(provenance, null, 2) + '\n');
console.log('content.json and provenance.json updated');
