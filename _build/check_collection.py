"""Check the standalone collection without third-party dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,subprocess,tempfile,sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'demo-manifest.json').read_text(encoding='utf-8'))
assert len(manifest)==27
assert len({x['file'] for x in manifest})==27
class Inspect(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.ids=[];self.external=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag in ('script','link','img','iframe') and (a.get('src') or a.get('href')):self.external.append((tag,a))
for app in manifest+[{'file':'index.html'}]:
    p=ROOT/app['file'];s=p.read_text(encoding='utf-8');ins=Inspect();ins.feed(s)
    assert s.lower().startswith('<!doctype html>'),p.name
    assert not ins.external,(p.name,ins.external)
    assert len(ins.ids)==len(set(ins.ids)),('duplicate IDs',p.name)
    if p.name!='index.html':
        for required in ('id="demo"','id="build"','What to add next','Recommended stack','Implementation steps','Data model and content','Low-cost deployment and scale','Sources and review'):
            assert required in s,(p.name,required)
    for link in ins.links:
        u=urlsplit(link)
        if not u.scheme and not u.netloc:
            target=(p.parent/unquote(u.path)) if u.path else p
            assert target.exists(),(p.name,link)
            if u.fragment and target.suffix=='.html':
                t=target.read_text(encoding='utf-8')
                assert re.search(r'id=[\"\']'+re.escape(u.fragment)+r'[\"\']',t),(p.name,link)
    for script in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',s,re.S):
        with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f:f.write(script);name=f.name
        try:
            r=subprocess.run(['node','--check',name],capture_output=True,text=True)
            assert r.returncode==0,(p.name,r.stderr)
        finally:Path(name).unlink()
print('PASS: 27 demo files and catalog; embedded script syntax; required guides; local links; unique IDs; no external runtime assets.')
