/* SIGN WELL CMS v24.35.1 · Runtime Contrast Guard
   Audits computed foreground/background contrast after legacy + current CSS are combined.
   It fixes only visible text whose computed contrast falls below WCAG AA.
   No prompt, secret, input value or article content is persisted or transmitted. */
(()=>{
  'use strict';
  const VERSION='24.35.1';
  const DARK='#10212f', LIGHT='#ffffff';
  const SKIP=new Set(['SCRIPT','STYLE','NOSCRIPT','SVG','PATH','IMG','VIDEO','CANVAS','IFRAME','BR','HR','META','LINK']);
  let timer=0,lastReport=null,observer=null;const frameObservers=new WeakMap();

  function clamp(v){return Math.max(0,Math.min(255,v));}
  function parseColor(v){
    v=String(v||'').trim().toLowerCase();
    if(!v||v==='transparent')return [0,0,0,0];
    const m=v.match(/^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
    if(m)return [clamp(+m[1]),clamp(+m[2]),clamp(+m[3]),m[4]==null?1:Math.max(0,Math.min(1,+m[4]))];
    const h=v.match(/^#([0-9a-f]{3,8})$/i);
    if(h){let s=h[1];if(s.length===3||s.length===4)s=s.split('').map(x=>x+x).join('');const a=s.length===8?parseInt(s.slice(6,8),16)/255:1;return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16),a];}
    return null;
  }
  function over(fg,bg){const a=fg[3]+bg[3]*(1-fg[3]);if(a<=0)return [255,255,255,1];return [0,1,2].map(i=>(fg[i]*fg[3]+bg[i]*bg[3]*(1-fg[3]))/a).concat(a);}
  function lum(c){return [c[0],c[1],c[2]].map(x=>x/255).map(x=>x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);}
  function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+.05)/(lo+.05);}
  function hex(v){return parseColor(v);}
  const DARK_RGB=hex(DARK),LIGHT_RGB=hex(LIGHT);

  function visible(el){
    if(!el||SKIP.has(el.tagName)||el.hidden||el.getAttribute?.('aria-hidden')==='true')return false;
    const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
    const r=el.getBoundingClientRect();return r.width>0&&r.height>0;
  }
  function hasOwnText(el){
    for(const n of el.childNodes){if(n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||'').trim())return true;}
    return ['INPUT','TEXTAREA','SELECT','BUTTON','A','LABEL','SUMMARY'].includes(el.tagName) && (el.value||el.textContent||el.getAttribute('aria-label'));
  }
  function background(el){
    let composite=[255,255,255,1],stack=[],n=el;
    while(n&&n.nodeType===1){stack.push(n);n=n.parentElement;}
    stack.reverse();
    for(const node of stack){const c=parseColor(getComputedStyle(node).backgroundColor);if(c&&c[3]>0)composite=over(c,composite);}
    return composite;
  }
  function threshold(el,cs){
    const size=parseFloat(cs.fontSize)||16,weight=parseInt(cs.fontWeight,10)||400;
    const large=size>=24||(size>=18.66&&weight>=700);
    return large?3:4.5;
  }
  function auditOne(el,fix){
    if(!visible(el)||!hasOwnText(el))return null;
    const cs=getComputedStyle(el),fg=parseColor(cs.color);if(!fg||fg[3]===0)return null;
    const bg=background(el),current=ratio(over(fg,bg),bg),min=threshold(el,cs);
    if(current+0.02>=min)return {ok:true,ratio:current,min};
    const darkR=ratio(DARK_RGB,bg),lightR=ratio(LIGHT_RGB,bg),safe=darkR>=lightR?DARK:LIGHT,best=Math.max(darkR,lightR);
    if(fix&&best>=min){
      el.style.setProperty('--sw-contrast-safe-color',safe);
      el.style.setProperty('color',safe,'important');
      el.style.setProperty('-webkit-text-fill-color',safe,'important');
      el.classList.add('sw-contrast-auto-fix');
      el.dataset.swContrastFixed='true';el.dataset.swContrastWas=current.toFixed(2);
    }
    return {ok:false,ratio:current,min,best,safe,tag:el.tagName,id:el.id||'',cls:String(el.className||'').slice(0,100)};
  }
  function candidates(root=document.body){
    if(!root)return [];
    const nodes=[root,...root.querySelectorAll('*')];
    return nodes.length>4000?nodes.slice(0,4000):nodes;
  }
  function accessibleRoots(primary){
    const roots=[primary||document.body].filter(Boolean);
    for(const frame of document.querySelectorAll('iframe')){
      try{const body=frame.contentDocument&&frame.contentDocument.body;if(body)roots.push(body);}catch(_){/* cross-origin: cannot inspect */}
    }
    return roots;
  }
  function bindFrameObservers(){
    for(const frame of document.querySelectorAll('iframe')){
      if(!frame.dataset.swContrastLoadBound){frame.dataset.swContrastLoadBound='1';frame.addEventListener('load',()=>{bindFrameObservers();schedule()},{passive:true});}
      try{
        const doc=frame.contentDocument;if(!doc||!doc.documentElement||frameObservers.has(frame))continue;
        const mo=new MutationObserver(schedule);mo.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','open','aria-hidden']});
        frameObservers.set(frame,mo);
      }catch(_){/* cross-origin frame is intentionally skipped */}
    }
  }
  function run(opts={}){
    const fix=opts.fix!==false,issues=[];let checked=0,fixed=0;
    bindFrameObservers();
    for(const root of accessibleRoots(opts.root||document.body))for(const el of candidates(root)){
      const r=auditOne(el,fix);if(!r)continue;checked++;if(!r.ok){issues.push(r);if(fix&&r.best>=r.min)fixed++;}
    }
    lastReport={version:VERSION,checked,issueCount:issues.length,fixed,unresolved:issues.filter(x=>x.best<x.min).length,issues:issues.slice(0,40),at:new Date().toISOString()};
    const html=document.documentElement;html.dataset.swContrastHealth=lastReport.unresolved?'warn':'ok';html.dataset.swContrastIssues=String(lastReport.issueCount);html.dataset.swContrastFixed=String(lastReport.fixed);
    window.__SIGNWELL_CONTRAST_REPORT__=lastReport;
    return lastReport;
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>run({fix:true}),120);}
  function start(){
    schedule();
    observer=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'||x.type==='attributes'))schedule();});
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','open','aria-hidden']});
    addEventListener('resize',schedule,{passive:true});
    addEventListener('pageshow',schedule,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()},{passive:true});
  }
  window.signwellContrastAudit=(options={})=>run(options);
  window.signwellContrastGuard={version:VERSION,audit:window.signwellContrastAudit,get lastReport(){return lastReport;},schedule};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
