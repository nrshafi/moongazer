"""D2c (12 Nov 2026): move the 16 kept apps to slugs and hosts that match their new names.

Renames each app folder and replaces every old slug, as a whole token, in tracked text files that
describe the current state. Historical records (progress trackers, release notes, research snapshots,
QA evidence, the original report) keep the names they had at the time. No redirects are created.
Run once from the repo root: python _implementation/rename-hosts.py
"""
import re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUGS = {
    'quran-connections': 'ayah-threads',
    'the-seerah-detective': 'seerah-detective',
    'everyday-akhlaq-simulator': 'everyday-akhlaq',
    'interactive-seerah-timeline': 'seerah-timeline',
    'quran-memorization-workload-calculator': 'hifz-planner',
    'is-this-actually-in-the-quran': 'is-it-in-the-quran',
    'islamic-knowledge-escape-room': 'quran-escape-room',
    'stories-of-the-prophets-explorer': 'stories-of-the-prophets',
    'quranic-places-atlas': 'places-in-the-quran',
    'islamic-concept-connections': 'word-groups',
    'understand-salah-lab': 'understand-your-salah',
    'quranic-parables-studio': 'parables-of-the-quran',
    'islamic-civilization-timeline': 'civilization-timeline',
    'revelation-context-explorer': 'why-it-was-revealed',
    'family-islamic-learning-challenges': 'family-halaqa',
}
# Cloudflare rejected these two project names (code 8000000), so their Pages projects carry an -app suffix.
PROJECT_OVERRIDES = {'ayah-threads': 'moongazer-ayah-threads-app', 'quran-escape-room': 'moongazer-quran-escape-room-app'}

HISTORICAL = re.compile(r'(^|/)(progress-tracker\.md$|releases/|research/|qa/|evidence/|REPORT\.md$|Verify_Me\.md$|DESIGN_RECOMMENDATIONS\.md$)|^deployment/(status\.json|automation-result\.json|seo-release\.json|seo-growth-release\.json|search-console\.json)$|^_implementation/rename-hosts\.py$|^plan/implementation/00-INDEX\.md$')
TEXT = {'.md', '.json', '.ts', '.mjs', '.js', '.astro', '.py', '.css', '.html', '.txt', '.yml', '.yaml', '.toml', '.lock', '.xml', '.svg', ''}
pattern = re.compile(r'(?<![a-z0-9])(' + '|'.join(sorted(map(re.escape, SLUGS), key=len, reverse=True)) + r')(?![a-z0-9])')

def git(*args):
    return subprocess.run(['git', *args], cwd=ROOT, check=True, capture_output=True, text=True).stdout

for old, new in SLUGS.items():
    if (ROOT / 'apps' / old).exists():
        git('mv', f'apps/{old}', f'apps/{new}')

changed = 0
for rel in git('ls-files').splitlines():
    path = ROOT / rel
    if HISTORICAL.search(rel) or path.suffix not in TEXT or not path.is_file() or '/node_modules/' in rel:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    updated = pattern.sub(lambda m: SLUGS[m.group(1)], text)
    if updated != text:
        path.write_text(updated, encoding='utf-8', newline='')
        changed += 1

# targets.json: record the two project-name overrides.
import json
targets_path = ROOT / 'deployment/targets.json'
raw = targets_path.read_text(encoding='utf-8')
targets = json.loads(raw)
for app in targets:
    if app['slug'] in PROJECT_OVERRIDES:
        app['project'] = PROJECT_OVERRIDES[app['slug']]
targets_path.write_text(json.dumps(targets, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
# Content checksums are taken over LF-normalized bytes (see verify-static.py).
import hashlib
for provenance_path in (ROOT / 'apps').glob('*/src/data/provenance.json'):
    data_dir = provenance_path.parent
    provenance = json.loads(provenance_path.read_text(encoding='utf-8'))
    lf = lambda p: hashlib.sha256(p.read_bytes().replace(b'\r\n', b'\n')).hexdigest()
    before = json.dumps(provenance)
    provenance['appContentSha256'] = lf(data_dir / 'content.json')
    if provenance.get('corpusSha256'):
        provenance['corpusSha256'] = lf(data_dir / 'corpus.json')
    if json.dumps(provenance) != before:
        provenance_path.write_text(json.dumps(provenance, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
        print('checksum updated:', provenance_path.relative_to(ROOT))
print(f'renamed {len(SLUGS)} folders; rewrote {changed} files')
