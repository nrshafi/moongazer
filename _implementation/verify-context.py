"""Check current hand-maintained contexts. Optional initial-app preservation audit."""
from pathlib import Path
from datetime import datetime,timezone,timedelta
import hashlib,json,re,sys
ROOT=Path(__file__).resolve().parent.parent
FILES=['project-overview.md','architecture.md','ui-context.md','code-standards.md','ai-workflow-rules.md','progress-tracker.md']
apps=sorted(p for p in (ROOT/'apps').iterdir() if (p/'package.json').is_file())
assert len(apps)==20
rows={r['app']:r for r in json.loads((ROOT/'_implementation/qa/static-results.json').read_text(encoding='utf-8'))}
sets=[]
placeholder=re.compile(r'\[(?:Project Name|Goal one|Goal two|Goal three|Invariant [a-z]|Technology|Role|Concern [a-z]|What this|One paragraph|e\.g\.)[^\]]*\]',re.I)
for base in [ROOT]+apps:
 paths=[base/'AGENTS.md']+[base/'context'/file for file in FILES]
 assert all(p.is_file() for p in paths),base
 for p in paths:
  text=p.read_text(encoding='utf-8')
  assert len(text)>300 and not placeholder.search(text),p
  assert 'npm run build' not in text and 'Next.js' not in text and 'shadcn' not in text,p
  for target in re.findall(r'`((?:context|_implementation|release|apps)/[^`]+)`',text):
   if '<' in target or ' ' in target:continue
   if target=='_implementation/qa/context-docs-audit.json':continue
   parent=base if target.startswith('context/') else ROOT
   assert list(parent.glob(target)) if '*' in target else (parent/target).exists(),(p,target)
 agent=(base/'AGENTS.md').read_text(encoding='utf-8')
 assert all('context/'+file in agent for file in FILES)
 if base!=ROOT:
  cfg=json.loads((base/'src/data/config.json').read_text(encoding='utf-8'));package=json.loads((base/'package.json').read_text(encoding='utf-8'));data=json.loads((base/'src/data/content.json').read_text(encoding='utf-8'))
  overview=(base/'context/project-overview.md').read_text(encoding='utf-8');architecture=(base/'context/architecture.md').read_text(encoding='utf-8');ui=(base/'context/ui-context.md').read_text(encoding='utf-8')
  assert cfg['name'] in overview and base.name in architecture and str(cfg['port']) in architecture,base
  for version in [package['dependencies']['astro'],package['devDependencies']['typescript'],package['devDependencies']['@astrojs/check']]:assert version in architecture
  for route in (base/'src/pages').rglob('*.astro'):assert route.relative_to(base).as_posix() in architecture,(base,route)
  for key,value in data.items():
   if isinstance(value,list):assert f'`{key}`: {len(value)} records.' in overview,(base,key)
  assert f'Accent family: {cfg["accent"]}' in ui
  css=(base/'src/styles/global.css').read_text(encoding='utf-8').lower()
  for token,light,dark in re.findall(r'\| `(--[a-z-]+)` \| `(#[a-f0-9]+)` \| `(#[a-f0-9]+)` \|',ui):
   for value in [light,dark]:
    options=[value]+(['#fff'] if value=='#ffffff' else [])
    assert any(re.search(re.escape(token)+r'\s*:\s*'+re.escape(option)+r'(?=[;}\s])',css) for option in options),(base,token,value)
 sets.append(dict(root='.' if base==ROOT else base.relative_to(ROOT).as_posix(),files=7,placeholders=False))
preserved=None
if '--preserve-previous-apps' in sys.argv:
 baseline=json.loads((ROOT/'_implementation/qa/context-docs-baseline.json').read_text(encoding='utf-8'))
 protected={name:digest for name,digest in baseline.items() if name.startswith('apps/') or name.startswith('6_File+Context+Methodology/')}
 for name,digest in protected.items():assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest,f'Changed earlier runtime/template file: {name}'
 preserved=len(protected)
result=dict(verifiedAt=datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=6))).isoformat(),projectRoots=len(sets),markdownFiles=sum(s['files'] for s in sets),sets=sets,metadataAndPathsVerified=True,uiTokensVerified=True,staticApps=len(rows),staticPages=sum(r['pages'] for r in rows.values()),previousApplicationTemplateFilesPreserved=preserved)
out=ROOT/'_implementation/qa/context-docs-audit.json'
out.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='sets'},indent=2))
