"""Check the final static deliverables and canonical-text integrity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,re
from content import ROOT
# P7: institutional fatwa bodies cited by the Zakat Calculator, each entry verified in _implementation/research/zakat/verification.json.
ZAKAT_SOURCES=('dar-alifta.org','www.dar-alifta.org','islamweb.net','www.islamweb.net','aliftaa.jo','www.aliftaa.jo','muftiwp.gov.my','daruliftabirmingham.co.uk')

def lf_sha256(path):
    return hashlib.sha256(path.read_bytes().replace(b'\r\n',b'\n')).hexdigest()

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

# Directory data (C18 / T6.6): "Ayah of the night" records are checked against the same snapshot.
ayat_of_the_night=json.loads((ROOT/'homepage/ayat-of-the-night.json').read_text(encoding='utf-8'))
assert len(ayat_of_the_night)>=60 and all(set(r)=={'ref','arabic','translation','theme'} for r in ayat_of_the_night)
check_text(ayat_of_the_night)

# Ramadan hub (P7 T7.10): every night's ayah must come from the verified list above; Surah al-Qadr is read from the snapshot at build.
ramadan=json.loads((ROOT/'homepage/ramadan-content.json').read_text(encoding='utf-8'))
verified_refs={r['ref'] for r in ayat_of_the_night}
assert len(ramadan['nightAyat'])==30 and len(set(ramadan['nightAyat']))==30 and set(ramadan['nightAyat'])<=verified_refs,'Ramadan night ayat'
ramadan_dates=json.loads((ROOT/'_implementation/research/ramadan/dates.json').read_text(encoding='utf-8'))
assert ramadan['dates']['start']==ramadan_dates['expectedStart']['date'] and ramadan['dates']['lastTenDay']==ramadan_dates['lastTenNightsStart']['date'],'Ramadan dates must match the research record'
assert ramadan['dates']['eidFrom']==ramadan_dates['expectedEidAlFitr']['range']['from'] and ramadan['dates']['eidTo']==ramadan_dates['expectedEidAlFitr']['range']['to'],'Eid range must match the research record'

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
    # Checksums are taken over LF-normalized bytes so a Windows CRLF checkout and the LF blob in Git agree.
    assert lf_sha256(content_path)==provenance['appContentSha256'],f'appContentSha256 mismatch: {app.name}'
    if provenance.get('corpusSha256'):
        assert lf_sha256(app/'src/data/corpus.json')==provenance['corpusSha256'],f'corpusSha256 mismatch: {app.name}'
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
                assert url.netloc=='moongazer.tech' or url.netloc.endswith('.moongazer.tech') or url.netloc in ('quran.com','api.quran.com','sunnah.com','mcp.quran.ai','whc.unesco.org','ungegn.un.org','www.naturalearthdata.com','commons.wikimedia.org','creativecommons.org','sunna.alifta.gov.sa','www.metmuseum.org')+ZAKAT_SOURCES,link
                continue
            if not url.path:continue
            target=dist/unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent/unquote(url.path)
            assert target.is_file() or (target/'index.html').is_file(),f'Broken local reference {link} on {path}'
    assets=[file for file in dist.rglob('*') if file.is_file()]
    assert len(assets)<=20000 and max(file.stat().st_size for file in assets)<=25*1024*1024
    for path in (dist/'_astro').glob('*.js'):
        script=path.read_text(encoding='utf-8')
        assert not re.search(r'\bfetch\s*\(',script),f'Unexpected runtime fetch: {path}'
        # P4: the only network call allowed in app code is the anonymous counter beacon to the apex.
        if 'sendBeacon' in script:
            assert 'https://moongazer.tech/api/event' in script,f'Unexpected beacon target: {path}'
            for literal in re.findall(r'sendBeacon\s*\(\s*["\'`]([^"\'`]*)["\'`]',script):
                assert literal=='https://moongazer.tech/api/event',f'Unexpected beacon target {literal}: {path}'
    for path in pages:
        for action in re.findall(r'<form[^>]*\saction="([^"]*)"',path.read_text(encoding='utf-8')):
            if urlsplit(action).netloc: assert action=='https://moongazer.tech/api/feedback',f'Unexpected form action {action} on {path}'
    results.append(dict(app=app.name,pages=len(pages),files=len(assets),bytes=sum(p.stat().st_size for p in assets),canonicalTextVerified=True,localLinksVerified=True,externalRuntimeAssets=False))
output=ROOT/'_implementation/qa/static-results.json';output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2));print('Verified',sum(r['pages'] for r in results),'static pages.')
