/* SIGN WELL CMS v23 · runtime performance guard */
(()=>{
  'use strict';
  const d=document;
  const ready=()=>{
    const b=d.body;if(!b)return;
    const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    const saveData=!!(conn&&conn.saveData), lowMem=Number(navigator.deviceMemory||8)<=4;
    if(saveData || (lowMem&&matchMedia('(pointer:coarse)').matches)) b.classList.add('sw-cms-perf-lite');
    let timer=0,ticking=false;
    addEventListener('scroll',()=>{
      if(!ticking){ticking=true;requestAnimationFrame(()=>{b.classList.add('sw-cms-scrolling');ticking=false;});}
      clearTimeout(timer);timer=setTimeout(()=>b.classList.remove('sw-cms-scrolling'),150);
    },{passive:true,capture:true});
    const vis=()=>b.classList.toggle('sw-cms-hidden',d.hidden);d.addEventListener('visibilitychange',vis,{passive:true});vis();
  };
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();


/* SIGN WELL CMS 23.9.0 · workflow guardrails */
(()=>{
  'use strict';
  const d=document;
  const ready=()=>{
    const b=d.body;if(!b)return;
    const net=d.createElement('div');net.className='sw-cms-network';net.setAttribute('role','status');net.setAttribute('aria-live','polite');d.body.appendChild(net);
    let timer=0;
    const sync=(online,initial=false)=>{
      clearTimeout(timer);b.classList.toggle('sw-cms-offline',!online);net.classList.toggle('online',online);
      net.textContent=online?'後台連線已恢復':'目前離線：同步、發布與 AI 功能暫時不可用';
      if(initial&&online)return;net.classList.add('show');if(online)timer=setTimeout(()=>net.classList.remove('show'),2800);
    };
    addEventListener('online',()=>sync(true));addEventListener('offline',()=>sync(false));sync(navigator.onLine!==false,true);

    // Let screen readers hear save/publish state changes.
    const saveState=d.getElementById('saveState');if(saveState){saveState.setAttribute('role','status');saveState.setAttribute('aria-live','polite');saveState.setAttribute('aria-atomic','true')}

    // CMS-native save shortcut. Only triggers an existing visible save action; it never publishes.
    d.addEventListener('keydown',e=>{
      if(!(e.metaKey||e.ctrlKey)||String(e.key).toLowerCase()!=='s')return;
      const save=d.getElementById('saveBtn');
      if(save&&!save.classList.contains('hidden')&&!save.disabled){e.preventDefault();save.click()}
    });
  };
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
