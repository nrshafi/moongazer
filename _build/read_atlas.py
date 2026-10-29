from pathlib import Path
import json,re,sys
sys.stdout.reconfigure(encoding='utf-8')
s=Path(__file__).resolve().parents[1].joinpath('islamic_product_atlas.html').read_text(encoding='utf-8-sig')
# The original artifact is a JSON-encoded HTML string.
if s.lstrip().startswith('"'):
    s=json.loads(s)
m=re.search(r'<script[^>]*id="dataset"[^>]*>(.*?)</script>',s,re.S)
d=json.loads(m.group(1))
for i in d['ideas']:
    print(i['name']+' | '+i['description']+' | '+str(i.get('cost')))
for ident in ['playbook','integration']:
    m=re.search(r'<section[^>]*id="'+ident+r'".*?</section>',s,re.S)
    if m: print(re.sub('<[^>]*>',' ',m.group(0)))
