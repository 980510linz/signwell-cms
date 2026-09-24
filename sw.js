/* SIGN WELL CMS · canonical app-shell service worker
   Cache static same-origin shell only. Never cache Apps Script / third-party requests. */
const SW_CMS_CACHE_PREFIX='signwell-cms-';
const SW_CMS_CACHE=SW_CMS_CACHE_PREFIX+'canonical-uiux';
const SW_CMS_SHELL=[
  './','./index.html','./analytics-config.js','./assets/cms-core.css','./assets/cms-compat.js',
  './assets/uiux-system.css','./assets/uiux-system.js',
  './assets/bundles/cms-app.js','./assets/bundles/article-identity.js','./assets/bundles/error-experience.js','./assets/bundles/cms-contrast-guard.js',
  './assets/components/styles/cms-experience.css','./assets/components/styles/ai-token-observatory.css',
  './assets/components/styles/provider-billing-observatory.css','./assets/components/styles/prelegal-editorial-gates.css',
  './assets/components/styles/geo-observatory.css','./assets/components/styles/cms-contrast-safety.css'
];
const swCmsUrl=p=>new URL(p,self.location.href).href;
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(SW_CMS_CACHE);
    await Promise.allSettled(SW_CMS_SHELL.map(async p=>{
      try{const r=await fetch(swCmsUrl(p),{cache:'reload'});if(r.ok)await cache.put(swCmsUrl(p),r.clone());}catch(_){ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith(SW_CMS_CACHE_PREFIX)&&n!==SW_CMS_CACHE).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
async function swCmsNetworkFirst(req){
  const cache=await caches.open(SW_CMS_CACHE);
  try{const r=await fetch(req);if(r&&r.ok)await cache.put(req,r.clone());return r;}
  catch(err){const hit=await cache.match(req,{ignoreSearch:true});if(hit)return hit;throw err;}
}
async function swCmsSWR(req){
  const cache=await caches.open(SW_CMS_CACHE);
  const hit=await cache.match(req,{ignoreSearch:true});
  const fresh=fetch(req).then(r=>{if(r&&r.ok)cache.put(req,r.clone());return r;}).catch(()=>null);
  return hit||fresh||Response.error();
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url),scopePath=new URL('./',self.location.href).pathname;
  if(url.origin!==self.location.origin||!url.pathname.startsWith(scopePath))return;
  if(req.mode==='navigate'||req.destination==='document'){event.respondWith(swCmsNetworkFirst(req));return;}
  if(['script','style','image','font'].includes(req.destination)){event.respondWith(swCmsSWR(req));}
});
