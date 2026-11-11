"""Validate generated SEO on every host; --live also checks public routes and headers."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from concurrent.futures import ThreadPoolExecutor
from collections import Counter
import json, re, struct, sys, datetime
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'deployment/evidence/seo'
targets = json.loads((ROOT/'deployment/targets.json').read_text(encoding='utf-8'))
# P3 step A: retired apps still deploy, but their pages carry canonicals to the receiving app and the directory omits them.
active = [app for app in targets if not app.get('retired')]
merge_map = json.loads((ROOT/'deployment/merge-redirects.json').read_text(encoding='utf-8'))
def expected_canonical(url):
    parts = urlsplit(url); entry = merge_map.get(f'{parts.scheme}://{parts.netloc}')
    return entry['paths'].get(parts.path, entry['paths']['*']) if entry else url
collections = json.loads((ROOT/'homepage/collections.json').read_text(encoding='utf-8'))
learning_guides = json.loads((ROOT/'deployment/learning-guides.json').read_text(encoding='utf-8'))
sites = [('moongazer', 'https://moongazer.tech/', ROOT/'homepage/dist')]
sites += [('moongazer-'+app['slug'], 'https://'+app['slug']+'.moongazer.tech/', ROOT/'apps'/app['slug']/'dist') for app in targets]

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta = {}; self.links = []; self.canonicals = []; self.schemas = []
        self.title = ''; self.in_head = False; self.in_title = False; self.in_schema = False; self.schema = ''
        self.h1 = 0; self.h1_text = ''; self.in_h1 = False; self.lang = ''; self.breadcrumb = False; self.text = []
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'h1': self.h1 += 1; self.in_h1 = True
        if tag == 'br' and self.in_h1: self.h1_text += ' '
        if tag == 'head': self.in_head = True
        if tag == 'title' and self.in_head: self.in_title = True
        if tag == 'meta':
            key = a.get('name') or a.get('property')
            # theme-color may appear once per media query (light and dark variants).
            if key == 'theme-color' and a.get('media'): key = f"theme-color {a['media']}"
            if key:
                assert key not in self.meta, ('duplicate meta', key)
                self.meta[key] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'nav' and a.get('aria-label') == 'Breadcrumb': self.breadcrumb = True
        if tag == 'script' and a.get('type') == 'application/ld+json': self.in_schema = True; self.schema = ''
    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = False
        if tag == 'title': self.in_title = False
        if tag == 'h1': self.in_h1 = False
        if tag == 'script' and self.in_schema:
            self.schemas.append(json.loads(self.schema)); self.in_schema = False
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1_text += data
        if self.in_schema: self.schema += data
        else: self.text.append(data)

def route(path, directory):
    relative = path.relative_to(directory).as_posix()
    return '/' if relative == 'index.html' else '/'+relative[:-10] if relative.endswith('index.html') else '/'+relative

def inspect(html, url, homepage=False, missing=False):
    p = Page(html)
    assert p.h1 == 1 and p.lang == 'en', ('heading/language', url)
    assert p.title.strip(), ('missing title', url)
    utility = missing or urlsplit(url).path == '/privacy/'
    assert ('noindex' in p.meta.get('robots','')) == utility, ('robots', url)
    if missing:
        assert not p.canonicals and not p.schemas, ('404 indexing', url)
        return p
    canonical = expected_canonical(url)
    assert p.canonicals == [canonical], ('canonical', url, p.canonicals)
    assert p.meta.get('description','').strip(), ('description', url)
    assert p.meta.get('og:title') == p.title, ('social title', url)
    assert p.meta.get('twitter:title') == p.title, ('Twitter title', url)
    assert p.meta.get('og:description') == p.meta['description'] == p.meta.get('twitter:description'), ('social description', url)
    assert p.meta.get('og:url') == canonical, ('social URL', url)
    assert p.meta.get('og:site_name'), ('site name', url)
    assert p.meta.get('twitter:card') == 'summary_large_image', ('social card', url)
    origin = urlsplit(url)
    image = f'{origin.scheme}://{origin.netloc}/social-card.png'
    assert p.meta.get('og:image') == image == p.meta.get('twitter:image'), ('social image', url)
    assert (p.meta.get('og:image:width'),p.meta.get('og:image:height')) == ('1200','630'), ('dimensions', url)
    assert p.meta.get('og:image:alt') and p.meta.get('twitter:image:alt'), ('image alt', url)
    assert len(p.schemas) == 1, ('schema count', url)
    schema = p.schemas[0]
    assert schema['@context'] == 'https://schema.org'
    graph = schema['@graph']
    ids = [node['@id'] for node in graph]
    assert len(ids) == len(set(ids)), ('duplicate schema IDs', url)
    website = next(node for node in graph if node['@type'] == 'WebSite')
    assert website['url'] == f'{origin.scheme}://{origin.netloc}/'
    webpage = next(node for node in graph if node['@id'] == url+'#webpage')
    assert webpage['url'] == url
    if homepage and origin.path == '/':
        listing = next(node for node in graph if node['@type'] == 'ItemList')
        assert listing['numberOfItems'] == len(active) == len(listing['itemListElement'])
        assert {item['url'] for item in listing['itemListElement']} == {f"https://{app['slug']}.moongazer.tech/" for app in active}
    else:
        assert p.breadcrumb, ('visible breadcrumb', url)
        crumbs = next(node for node in graph if node['@type'] == 'BreadcrumbList')['itemListElement']
        assert [item['position'] for item in crumbs] == list(range(1,len(crumbs)+1))
        assert crumbs[0]['item'] == 'https://moongazer.tech/' and crumbs[-1]['item'] == url
        text = ' '.join(p.text)
        assert all(item['name'] in text for item in crumbs), ('breadcrumb text', url)
        assert 'https://moongazer.tech/#library' in p.links
        if homepage:
            collection = next((c for c in collections if origin.path == '/'+c['slug']+'/'), None)
            if collection:
                expected = {f"https://{app['slug']}.moongazer.tech/" for app in active if app['category']==collection['category']}
                listing = next(node for node in graph if node['@type']=='ItemList')
                assert {item['url'] for item in listing['itemListElement']} == expected
                assert listing['numberOfItems'] == len(expected)
            else:
                assert origin.path == '/about/' and webpage['@type']=='AboutPage'
                assert 'mailto:nrshafi1@gmail.com' in p.links
        elif origin.path == '/':
            slug=origin.hostname.removesuffix('.moongazer.tech')
            guide=learning_guides[slug]
            text=' '.join(p.text)
            assert p.h1_text.strip()==guide['heading'] and guide['summary'] in text, ('static app guidance',url)
            assert all(item['question'] in text and item['answer'] in text for item in guide['questions']), ('visible app questions',url)
            assert all(f'https://{related}.moongazer.tech/' in p.links for related in guide['related']), ('related apps',url)
            assert 'https://moongazer.tech/about/' in p.links
    return p

pages = []; all_links = set(); incoming = {}; local_references=[]; results = []; live_jobs = []
for name, origin, directory in sites:
    indexable = set(); counts = Counter()
    for path in sorted(directory.rglob('*.html')):
        pathname = route(path,directory); url = urljoin(origin,pathname); missing = pathname == '/404.html'
        p = inspect(path.read_text(encoding='utf-8'),url,name=='moongazer',missing)
        for link in p.links:
            linked = urlsplit(urljoin(url,link))
            target=linked._replace(query='',fragment='').geturl()
            all_links.add(target)
            incoming.setdefault(target,set()).add(url)
            if linked.netloc=='moongazer.tech' or linked.netloc.endswith('.moongazer.tech'):
                local_references.append((url,target))
        if not missing and 'noindex' not in p.meta['robots']: indexable.add(url)
        pages.append({'url':url,'title':p.title,'description':p.meta.get('description'),'indexable':url in indexable})
        counts['pages'] += 1
        live_jobs.append((url,'html',name=='moongazer',missing))
    # Preserve CRLF for the live byte comparison on Windows.
    xml = (directory/'sitemap.xml').read_bytes().decode('utf-8')
    tree = ET.fromstring(xml)
    locations = [node.text for node in tree.findall('{*}url/{*}loc')]
    assert len(locations) == len(set(locations)) and set(locations) == indexable, ('sitemap coverage',name)
    assert all(urlsplit(location).netloc == urlsplit(origin).netloc for location in locations)
    assert not tree.findall('{*}url/{*}lastmod'), ('unverified modification dates',name)
    robots = (directory/'robots.txt').read_bytes().decode('utf-8')
    assert f'Sitemap: {origin}sitemap.xml' in robots and not re.search(r'Disallow:\s*/\s*$',robots,re.M)
    png = (directory/'social-card.png').read_bytes()
    assert png[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',png[16:24]) == (1200,630)
    for font in ['dm-sans','newsreader'] + ([] if name=='moongazer' else ['amiri']):
        assert (directory/'fonts'/f'{font}.woff2').read_bytes()[:4] == b'wOF2'
        assert (directory/'fonts'/f'{font}-OFL.txt').exists()
    css = '\n'.join(path.read_text(encoding='utf-8') for path in directory.rglob('*.css'))
    assert '.woff2' in css and not re.search(r'url\([^)]*\.ttf',css), ('font references',name)
    headers = (directory/'_headers').read_text()
    assert 'https://:project.pages.dev/*\n  X-Robots-Tag: noindex' in headers
    assert 'https://:deployment.:project.pages.dev/*\n  X-Robots-Tag: noindex' in headers
    results.append({'project':name,'origin':origin,'pages':counts['pages'],'indexable':len(indexable),'sitemap':origin+'sitemap.xml'})
    live_jobs += [(origin+'sitemap.xml','sitemap',xml,False),(origin+'robots.txt','robots',robots,False),
                  (f'https://{name}.pages.dev/','origin',None,False)]
    live_jobs.append((origin+'?challenge=seo-check','query',origin,name=='moongazer'))

for key in ['title','description']:
    values = [p[key] for p in pages if p[key]]
    assert len(values) == len(set(values)), ('duplicate '+key, [v for v,n in Counter(values).items() if n>1])
assert all(p['url'] in all_links for p in pages if p['indexable']), 'Orphan indexable page'
known={page['url'] for page in pages}
known.update(urljoin(origin,path.relative_to(directory).as_posix()) for _,origin,directory in sites for path in directory.rglob('*') if path.is_file())
assert all(target in known for _,target in local_references), ('Broken collection link',[r for r in local_references if r[1] not in known])
for collection in collections:
    url='https://moongazer.tech/'+collection['slug']+'/'
    assert len(incoming.get(url,set()))>=3, ('Insufficient incoming guide links',url)
assert len(incoming.get('https://moongazer.tech/about/',set()))>=3
llms=(ROOT/'homepage/dist/llms.txt').read_text(encoding='utf-8')
assert all(f'https://{app["slug"]}.moongazer.tech/' in llms for app in active)
assert all('https://moongazer.tech/'+c['slug']+'/' in llms for c in collections)
report = {'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sites':len(sites),'pages':len(pages),
          'indexable':sum(r['indexable'] for r in results),'passed':True,'hosts':results,'metadata':pages}
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'static.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:report[k] for k in ['sites','pages','indexable','passed']}))

if '--live' in sys.argv:
    def fetch(job):
        url,kind,expected,missing = job
        try:
            try: response = urlopen(Request(url,headers={'User-Agent':'Moongazer-SEO-Verification/1.0'}),timeout=45)
            except HTTPError as error:
                if error.code != 404 or not missing: raise
                response = error
            html = response.read().decode('utf-8'); headers = response.headers
            # Pages may serve the explicit /404.html document with 200. The
            # missing-route 404 status is independently checked by verify-live.mjs.
            assert response.status in ([200,404] if missing and kind=='html' else [200]), response.status
            if kind == 'origin': assert 'noindex' in headers.get('X-Robots-Tag','').lower()
            else:
                assert 'noindex' not in headers.get('X-Robots-Tag','').lower(), 'custom hostname noindexed'
                if kind == 'html': inspect(html,url,expected,missing)
                elif kind == 'query': inspect(html,expected,missing)
                else:
                    assert html == expected, 'sitemap/robots bytes differ'
                    assert ('xml' if kind=='sitemap' else 'text/plain') in headers.get('Content-Type','')
            return {'url':url,'kind':kind,'status':response.status,'pass':True}
        except Exception as error: return {'url':url,'kind':kind,'pass':False,'error':str(error)}
    with ThreadPoolExecutor(max_workers=8) as pool: checks = list(pool.map(fetch,live_jobs))
    failures = [c for c in checks if not c['pass']]
    live = {'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'requests':len(checks),
            'passed':len(checks)-len(failures),'failed':len(failures),'checks':checks}
    (OUT/'live.json').write_text(json.dumps(live,indent=2),encoding='utf-8')
    print(json.dumps({**{k:live[k] for k in ['requests','passed','failed']},'failures':failures},indent=2))
    if failures: sys.exit(1)
