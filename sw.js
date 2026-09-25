/* SIGN WELL CMS · service-worker retirement shim */
const SW_CMS_CACHE_PREFIX='signwell-cms-';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{try{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(SW_CMS_CACHE_PREFIX)||k.includes('signwell')).map(k=>caches.delete(k)))}catch(_){}try{await self.clients.claim()}catch(_){}try{await self.registration.unregister()}catch(_){}})()));
/* no fetch handler by design */
