/* SIGN WELL CMS backend bootstrap · canonical stable filename */
(()=>{'use strict';
  const FALLBACK_ENDPOINT='https://script.google.com/macros/s/AKfycbzmZXZSepxCD1jbfpjMxsnvn0nRl-xEpeXdJoTO-TZL6Z5Zk7T-OsVGpTkIxWaCh-Y/exec';
  const valid=v=>/^https:\/\/script\.google\.com\/macros\/s\/[^\s?#]+\/exec(?:[?#].*)?$/i.test(String(v||'').trim());
  let endpoint='';
  try{
    const q=new URLSearchParams(location.search).get('backend');
    const stored=String(localStorage.getItem('signwell-backend-endpoint')||'').trim();
    endpoint=valid(q)?String(q).trim():(valid(stored)?stored:FALLBACK_ENDPOINT);
    if(valid(endpoint))localStorage.setItem('signwell-backend-endpoint',endpoint);
  }catch(_){endpoint=FALLBACK_ENDPOINT}
  const enabled=valid(endpoint);
  const cfg={enabled,endpoint,version:'24.36.3',bridgeProtocol:'23.9.92'};
  window.SIGNWELL_BACKEND=Object.assign({},window.SIGNWELL_BACKEND||{},cfg);
  window.SIGNWELL_ANALYTICS=Object.assign({},window.SIGNWELL_ANALYTICS||{},cfg);
  window.SIGNWELL_NEWSLETTER=Object.assign({},window.SIGNWELL_NEWSLETTER||{},cfg);
})();
