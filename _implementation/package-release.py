from pathlib import Path
import zipfile,json,hashlib
from content import ROOT
release=ROOT/'release';release.mkdir(exist_ok=True)
manifest=[]
for app in sorted((ROOT/'apps').iterdir()):
    dist=app/'dist'
    if not (dist/'index.html').exists():continue
    target=release/f'{app.name}-pages.zip'
    with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for file in sorted(dist.rglob('*')):
            if file.is_file():archive.write(file,file.relative_to(dist).as_posix())
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        assert 'index.html' in archive.namelist() and '_headers' in archive.namelist()
    manifest.append(dict(app=app.name,archive=target.name,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
(release/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps(manifest,indent=2))
