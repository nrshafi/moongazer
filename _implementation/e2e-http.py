"""Production-file HTTP verification against the isolated local QA servers."""
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
import json

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'_implementation/qa/e2e'
apps=json.loads((OUT/'origins.json').read_text())
results=[]
for app in apps:
    origin=f'http://127.0.0.1:{app["port"]}'
    urlopen(origin+'/?qa-storage=normal&qa-clipboard=off',timeout=10).close()
    directory=Path(app['directory'])
    files=[p for p in directory.rglob('*') if p.is_file() and p.name!='_headers']
    def verify(path):
        relative=path.relative_to(directory).as_posix()
        route='/'+relative
        if route.endswith('/index.html'):route=route[:-10]
        with urlopen(origin+route,timeout=10) as response:
            body=response.read()
            assert response.status==200,(route,response.status)
            assert sha256(body).digest()==sha256(path.read_bytes()).digest(),route
            assert response.headers['X-Content-Type-Options']=='nosniff',route
            assert "default-src 'self'" in response.headers['Content-Security-Policy'],route
            if path.suffix=='.html':assert 'text/html' in response.headers['Content-Type'],route
        return dict(route=route,bytes=len(body),html=path.suffix=='.html')
    with ThreadPoolExecutor(max_workers=8) as pool:checks=list(pool.map(verify,files))
    try:urlopen(origin+'/e2e-intentionally-missing/',timeout=10)
    except HTTPError as error:
        assert error.code==404
        assert error.read()==(directory/'404.html').read_bytes()
    else:raise AssertionError('Missing URL returned success')
    results.append(dict(app=app['slug'],files=len(checks),pages=sum(c['html'] for c in checks),checks=checks,custom404=True,headers=True,byteExact=True))
(OUT/'http-results.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(apps=len(results),pages=sum(r['pages'] for r in results),files=sum(r['files'] for r in results),passed=True)))
