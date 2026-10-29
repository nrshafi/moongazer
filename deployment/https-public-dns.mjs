// Resolve newly published hostnames with Cloudflare DoH, retaining HTTPS hostname
// verification and SNI. This avoids the workstation's stale negative DNS cache.
import https from 'node:https';
import http from 'node:http';
const addresses = new Map();
export const dnsEvidence = [];
async function address(hostname) {
  if (!addresses.has(hostname)) addresses.set(hostname,(async()=>{
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error('Public DNS service failed');
    const data = await response.json();
    const answers = (data.Answer||[]).filter(answer=>answer.type===1&&/^\d+\.\d+\.\d+\.\d+$/.test(answer.data));
    if(data.Status!==0||!answers.length)throw new Error(`Public DNS has no A answer for ${hostname}`);
    dnsEvidence.push({hostname,answers,at:new Date().toISOString()});
    return answers[0].data;
  })());
  return addresses.get(hostname);
}
export async function publicGet(url,options={},depth=0) {
  const target = new URL(url);
  if (!['https:','http:'].includes(target.protocol) || !/^(?:[a-z0-9-]+\.)?moongazer\.tech$/.test(target.hostname)) throw new Error('Unexpected verification hostname');
  const ip = await address(target.hostname);
  return new Promise((resolve,reject)=>{
    const transport=target.protocol==='https:'?https:http;
    const request=transport.get(target,{lookup(_hostname,lookupOptions,callback){if(lookupOptions.all)callback(null,[{address:ip,family:4}]);else callback(null,ip,4);}},response=>{
      const bytes=[];
      response.on('data',chunk=>bytes.push(chunk));
      response.on('error',reject);
      response.on('end',async()=>{
        const location=response.headers.location;
        if([301,302,303,307,308].includes(response.statusCode)&&location&&options.redirect!=='manual') {
          if(depth>=5) { reject(new Error('Too many redirects')); return; }
          try { resolve(await publicGet(new URL(location,target),options,depth+1)); } catch(error) {reject(error);}
        } else {
          const headers = new Headers(Object.entries(response.headers).filter(([,value])=>typeof value==='string'));
          const body = Buffer.concat(bytes);
          resolve({status:response.statusCode,headers,arrayBuffer:async()=>body,url:target.href});
        }
      });
    });
    request.setTimeout(45000,()=>request.destroy(new Error('HTTPS verification timeout')));
    request.on('error',reject);
  });
}
