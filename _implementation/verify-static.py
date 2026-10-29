"""Check the final static deliverables and canonical-text integrity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,re
from content import ROOT

class Page(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[];self.headings=0;self.lang=None
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.append(attrs['id'])
        if tag=='a' and attrs.get('href'):self.links.append(attrs['href'])
        if tag in ('script','img','audio','source') or tag=='link' and set(attrs.get('rel','').split()) & {'stylesheet','icon','preload','modulepreload'}:
            asset=attrs.get('src') or (attrs.get('href') if tag=='link' else None)
            if asset:self.assets.append(asset)
        if tag=='h1':self.headings+=1
        if tag=='html':self.lang=attrs.get('lang')

snapshot=json.loads((ROOT/'_implementation/research/quran-full.json').read_text(encoding='utf-8'))
def check_text(value):
    if isinstance(value,list):
        for item in value:check_text(item)
    elif isinstance(value,dict):
        if all(k in value for k in ('ref','arabic','translation')):
            chapter,span=value['ref'].split(':');start,end=span.split('-') if '-' in span else (span,span)
            parts=[snapshot['verses'][f'{chapter}:{n}'] for n in range(int(start),int(end)+1)]
            assert value['arabic']=='\n'.join(p['arabic'] for p in parts),value['ref']
            assert value['translation']=='\n'.join(p['translation'] for p in parts),value['ref']
        for item in value.values():check_text(item)

results=[]
for app in sorted((ROOT/'apps').iterdir()):
    if not (app/'package.json').exists():continue
    dist=app/'dist';assert (dist/'index.html').exists(),app.name
    assert not (dist/'_worker.js').exists(),'Unexpected server output'
    assert not (app/'functions').exists(),'Unexpected Functions directory'
    assert (app/'bun.lock').exists()
    package=json.loads((app/'package.json').read_text(encoding='utf-8'))
    assert package['dependencies']['astro']=='7.4.2'
    assert package['devDependencies']['typescript']=='6.0.3'
    assert all('bun --bun astro' in package['scripts'][name] for name in ('dev','build','preview','check'))
    content_path=app/'src/data/content.json';content=json.loads(content_path.read_text(encoding='utf-8'))
    check_text(content)
    if (app/'src/data/corpus.json').exists():
        corpus=json.loads((app/'src/data/corpus.json').read_text(encoding='utf-8'))
        assert len(corpus)==6236 and len({v['ref'] for v in corpus})==6236
        check_text(corpus)
    provenance=json.loads((app/'src/data/provenance.json').read_text(encoding='utf-8'))
    assert hashlib.sha256(content_path.read_bytes()).hexdigest()==provenance['appContentSha256']
    if provenance.get('corpusSha256'):
        assert hashlib.sha256((app/'src/data/corpus.json').read_bytes()).hexdigest()==provenance['corpusSha256']
    pages=list(dist.rglob('*.html'))
    for path in pages:
        parsed=Page();parsed.feed(path.read_text(encoding='utf-8'))
        assert len(parsed.ids)==len(set(parsed.ids)),f'Duplicate IDs: {path}'
        assert parsed.lang=='en' and parsed.headings==1,path
        for link in parsed.links+parsed.assets:
            url=urlsplit(link)
            if url.scheme or url.netloc:
                assert link in parsed.links,f'External runtime asset: {link}'
                assert url.scheme=='https',link
                assert url.netloc=='moongazer.tech' or url.netloc.endswith('.moongazer.tech') or url.netloc in ('quran.com','sunnah.com','mcp.quran.ai','whc.unesco.org','ungegn.un.org','www.naturalearthdata.com','commons.wikimedia.org','creativecommons.org','sunna.alifta.gov.sa','www.metmuseum.org'),link
                continue
            if not url.path:continue
            target=dist/unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent/unquote(url.path)
            assert target.is_file() or (target/'index.html').is_file(),f'Broken local reference {link} on {path}'
    assets=[file for file in dist.rglob('*') if file.is_file()]
    assert len(assets)<=20000 and max(file.stat().st_size for file in assets)<=25*1024*1024
    for path in (dist/'_astro').glob('*.js'):
        assert not re.search(r'\bfetch\s*\(',path.read_text(encoding='utf-8')),f'Unexpected runtime fetch: {path}'
    results.append(dict(app=app.name,pages=len(pages),files=len(assets),bytes=sum(p.stat().st_size for p in assets),canonicalTextVerified=True,localLinksVerified=True,externalRuntimeAssets=False))
output=ROOT/'_implementation/qa/static-results.json';output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2));print('Verified',sum(r['pages'] for r in results),'static pages.')
