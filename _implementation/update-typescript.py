from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
for folder in (root/'apps').iterdir():
    path=folder/'package.json'
    if not path.exists():continue
    data=json.loads(path.read_text(encoding='utf-8'))
    data['devDependencies']['typescript']='6.0.3'
    path.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
path=root/'_implementation/scaffold.py'
path.write_text(path.read_text(encoding='utf-8').replace("'typescript':'7.0.2'","'typescript':'6.0.3'"),encoding='utf-8')
