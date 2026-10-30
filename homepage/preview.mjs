import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('dist/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
createServer(async (request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let target = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(resolve(root)+sep)) { response.writeHead(403).end(); return; }
    if ((await stat(target)).isDirectory()) target=resolve(target,'index.html');
    const data = await readFile(target);
    response.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"});
    response.end(data);
  } catch { response.writeHead(404,{'Content-Type':'text/html'}).end(await readFile(new URL('dist/404.html',import.meta.url))); }
}).listen(4350,'127.0.0.1',()=>console.log('Moongazer preview: http://127.0.0.1:4350/'));
