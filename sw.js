/* SIGN WELL CMS · service-worker retirement shim
   Admin correctness is prioritized over offline app-shell caching.
   IndexedDB still provides local draft/state resilience. */
const SW_CMS_CACHE_PREFIX='signwell-cms-';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(SW_CMS_CACHE_PREFIX)).map(k=>caches.delete(k)))}catch(_){}
    try{await self.clients.claim()}catch(_){}
    try{await self.registration.unregister()}catch(_){}
  })());
});
/* Intentionally no fetch handler: never intercept CMS assets/API traffic. */
