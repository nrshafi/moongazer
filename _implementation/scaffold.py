from pathlib import Path
import json, shutil
ROOT=Path(__file__).resolve().parent.parent
TEMPLATES=ROOT/'_implementation/templates'
CONFIGS=[
 ('guess-the-surah','Guess the Surah','A few clues. One surah. Discover how well you know the Quran, one thoughtful round at a time.','teal',4321),
 ('ayah-threads','Quran Connections','Three passages. One connection. Follow the words, notice a shared thread, and explore the source.','teal',4322),
 ('seerah-detective','The Seerah Detective','Open a case, examine the reports, and let the evidence guide your conclusion.','blue',4323),
 ('everyday-akhlaq','Everyday Akhlaq','Small moments. Thoughtful choices. Explore everyday character through fictional scenarios and authentic sources.','violet',4324),
 ('seerah-timeline','Seerah Timeline','Explore the life of Prophet Muhammad ﷺ through a sourced chronology, one event at a time.','teal',4325),
]
for slug,name,description,accent,port in CONFIGS:
    app=ROOT/'apps'/slug
    for directory in ['src/layouts','src/styles','src/lib','src/data','src/pages','public/fonts','scripts','tests']:(app/directory).mkdir(parents=True,exist_ok=True)
    package=dict(name=slug,version='1.0.0',private=True,type='module',packageManager='bun@1.4.4',scripts={'dev':f'bun --bun astro dev --host 127.0.0.1 --port {port}','build':'bun --bun astro build','preview':f'bun --bun astro preview --host 127.0.0.1 --port {port}','check':'bun --bun astro check','test':'bun test'},dependencies={'astro':'7.4.2'},devDependencies={'@astrojs/check':'0.9.12','typescript':'6.0.3'})
    (app/'package.json').write_text(json.dumps(package,indent=2)+'\n',encoding='utf-8')
    (app/'astro.config.mjs').write_text("import { defineConfig } from 'astro/config';\nexport default defineConfig({ output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, build: { format: 'directory' } });\n",encoding='utf-8')
    (app/'tsconfig.json').write_text(json.dumps({'extends':'astro/tsconfigs/strict','include':['.astro/types.d.ts','**/*'],'exclude':['dist'],'compilerOptions':{'resolveJsonModule':True,'types':['bun-types']}},indent=2).replace(',\n    "types": [\n      "bun-types"\n    ]',''),encoding='utf-8')
    # Tests use Bun; Astro source itself does not depend on Bun-specific types.
    (app/'tsconfig.json').write_text('{"extends":"astro/tsconfigs/strict","include":[".astro/types.d.ts","src/**/*"],"exclude":["dist"],"compilerOptions":{"resolveJsonModule":true}}\n',encoding='utf-8')
    (app/'src/data/config.json').write_text(json.dumps(dict(slug=slug,name=name,description=description,accent=accent,port=port),ensure_ascii=False,indent=2),encoding='utf-8')
    for source,dest in [('Shell.astro','src/layouts/Shell.astro'),('global.css','src/styles/global.css'),('utils.ts','src/lib/utils.ts'),('shell.ts','src/lib/shell.ts')]:shutil.copyfile(TEMPLATES/source,app/dest)
    (app/'public/favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="13" fill="#087f75"/><path d="m24 8 5 11 11 5-11 5-5 11-5-11-11-5 11-5Z" fill="none" stroke="#fff" stroke-width="2"/></svg>',encoding='utf-8')
    (app/'public/_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n  Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\'; connect-src \'self\'; frame-ancestors \'none\'; base-uri \'self\'; form-action \'self\'\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n',encoding='utf-8')
    (app/'.gitignore').write_text('node_modules/\ndist/\n.astro/\n.env\n.env.*\n!.env.example\n',encoding='utf-8')
    (app/'public/robots.txt').write_text('User-agent: *\nAllow: /\n',encoding='utf-8')
    (app/'src/pages/404.astro').write_text('---\nimport Shell from "../layouts/Shell.astro";\n---\n<Shell title="Page not found"><div class="empty"><span class="eyebrow">404</span><h1>That page is not here.</h1><p>Return to the activity and choose a new place to explore.</p><a class="button" href="/">Back to the activity</a></div></Shell>\n',encoding='utf-8')
    (app/'src/pages/privacy.astro').write_text('''---
import Shell from '../layouts/Shell.astro';
import config from '../data/config.json';
---
<Shell title="Privacy & storage" active="privacy"><article class="prose"><span class="eyebrow">Your browser, your choice</span><h1>Privacy & storage</h1><p>{config.name} works without signing in. Activity answers, selections, and bookmarks are processed in your browser. The application does not send them to a server.</p><h2>Optional saved progress</h2><p>Progress is saved only when you enable remembering or explicitly save a bookmark. Theme preferences can also be saved. Each app uses its own storage namespace. No names, email addresses, or account identifiers are requested.</p><p>Stored records are ignored and removed when read after 30 days. localStorage does not automatically delete records while the site is closed. Your browser may clear them sooner. Saved progress is a convenience and is not a durable backup.</p><h2>Clear or avoid storage</h2><p>Use Manage saved data in the footer to clear this app's records and reset the activity. All core activities work when storage is blocked. Downloaded files and copied results are under your control.</p><h2>Hosting and links</h2><p>The hosting provider receives the requests needed to serve the site and may maintain infrastructure logs. This site includes no analytics, advertising, third-party fonts, or runtime API calls. Opening a source link takes you to that source's own website and privacy practices.</p><h2>Informal scores</h2><p>Scoring is local and meant for personal learning. Browser data and shared text can be edited. There are no public leaderboards.</p><a class="button secondary" href="/">Return to the activity</a></article></Shell>
''',encoding='utf-8')
    (app/'README.md').write_text(f'''# {name}

Independent Astro 7.4.2 static application, developed and built with Bun 1.4.4.

## Run

```powershell
bun install --frozen-lockfile
bun run dev
```

Local development uses http://127.0.0.1:{port}.

## Verify and build

```powershell
bun run check
bun test
bun run build
bun run preview
```

## Cloudflare Pages

Use this folder as the Pages project root. Build command: `bun install --frozen-lockfile && bun run build`. Output directory: `dist`. Set `BUN_VERSION=1.4.4` in the build environment. No server adapter, Functions, bindings, database, secrets, or runtime API access are required. You can also upload the contents of `dist` with Pages Direct Upload after building locally.

The folder is self-contained. Its canonical content snapshot is checked in under `src/data`; ordinary builds do not fetch remote content. Source methodology and provenance are available at `/sources/`. The collection-level `_implementation` directory contains development-time retrieval and content-preparation tools. It is not part of the deployable site.

Local progress is optional and expires on read after 30 days. Theme and storage controls work independently of activity progress. See `/privacy/`.
''',encoding='utf-8')
    print('Scaffolded',slug)
