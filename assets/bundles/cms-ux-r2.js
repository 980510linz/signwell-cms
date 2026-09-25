/* SIGN WELL CMS · UX R2 runtime · DOM-only enhancement. */
(()=>{
  'use strict';
  const root=document.documentElement;
  const body=document.body;
  body.classList.add('sw-ux-r2');
  root.dataset.swCmsUx='r2';

  const sectionForView=(v)=>({
    dashboard:'workspace',commandcenter:'workspace',
    articles:'content',medicalnews:'content',topics:'content',aiinstructions:'content',
    canva:'publish',newsletter:'publish',
    aiopenai:'ai',deepresearch:'ai',
    site:'site',aboutpage:'site',export:'site'
  })[String(v||'dashboard')]||'workspace';

  function syncDesktopNav(){
    const desktop=matchMedia('(min-width:981px)').matches;
    const activeSection=body.dataset.swSection||sectionForView(body.dataset.swView);
    document.querySelectorAll('.nav [data-nav-section-panel]').forEach(group=>{
      if(desktop){
        group.hidden=false;
        group.setAttribute('aria-hidden','false');
      }else{
        const active=group.dataset.navSectionPanel===activeSection;
        group.hidden=!active;
        group.setAttribute('aria-hidden',active?'false':'true');
      }
    });
  }

  function navClick(view){
    const el=document.querySelector(`.nav [data-view="${CSS.escape(view)}"]`);
    if(el)el.click();
  }

  function addDashboardFlow(view){
    if(body.dataset.swView!=='dashboard'||view.querySelector('.sw-ux-flow'))return;
    const head=view.querySelector(':scope > .page-head');
    if(!head)return;
    const flow=document.createElement('nav');
    flow.className='sw-ux-flow';
    flow.setAttribute('aria-label','內容工作流程');
    flow.innerHTML=`
      <button type="button" data-ux-flow="medicalnews"><b>01</b><span><strong>找選題</strong><small>掃描 24 小時醫療焦點</small></span></button>
      <button type="button" data-ux-flow="articles"><b>02</b><span><strong>寫文章</strong><small>草稿、審稿與內容管理</small></span></button>
      <button type="button" data-ux-flow="newsletter"><b>03</b><span><strong>寄電子報</strong><small>測試、預覽與正式寄送</small></span></button>
      <button type="button" data-ux-flow="export"><b>04</b><span><strong>檢查系統</strong><small>連線、憑證與 Return Check</small></span></button>`;
    head.insertAdjacentElement('afterend',flow);
    flow.addEventListener('click',e=>{
      const btn=e.target.closest('[data-ux-flow]');
      if(btn)navClick(btn.dataset.uxFlow);
    });
  }

  function addArticleHeaders(view){
    view.querySelectorAll('.panel').forEach(panel=>{
      if(panel.querySelector('.sw-article-table-head'))return;
      const first=panel.querySelector(':scope > .article-row, :scope > #rows > .article-row');
      if(!first)return;
      const head=panel.querySelector(':scope > .panel-head');
      if(!head)return;
      const labels=document.createElement('div');
      labels.className='sw-article-table-head';
      labels.setAttribute('aria-hidden','true');
      labels.innerHTML='<span>文章</span><span>分類</span><span>瀏覽</span><span>狀態</span><span>動作</span>';
      head.insertAdjacentElement('afterend',labels);
    });
  }

  function improveRowKeyboard(view){
    view.querySelectorAll('.article-row[data-edit]').forEach(row=>{
      if(row.dataset.uxKeyboard==='1')return;
      row.dataset.uxKeyboard='1';
      row.tabIndex=0;
      row.setAttribute('role','button');
      row.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){
          if(e.target.closest('button,a,input,select,textarea'))return;
          e.preventDefault();row.click();
        }
      });
    });
  }

  function clarifySidebar(){
    const cmd=document.getElementById('sideCommandCenter');
    if(cmd&&!cmd.dataset.uxCopy){
      cmd.dataset.uxCopy='1';
      const b=cmd.querySelector('b'),s=cmd.querySelector('small');
      if(b)b.textContent='營運中控';
      if(s)s.textContent='Notion · Gmail · 每週營運';
    }
    const command=document.getElementById('cmsCommandBtn');
    if(command&&!command.dataset.uxCopy){
      command.dataset.uxCopy='1';
      const span=command.querySelector('span');if(span)span.textContent='快速指令';
    }
  }

  function enhance(){
    syncDesktopNav();
    clarifySidebar();
    const view=document.getElementById('view');
    if(!view)return;
    addDashboardFlow(view);
    addArticleHeaders(view);
    improveRowKeyboard(view);
  }

  let raf=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)};
  const observer=new MutationObserver(schedule);
  const view=document.getElementById('view');
  if(view)observer.observe(view,{childList:true,subtree:true});
  const sidebar=document.querySelector('.sidebar');
  if(sidebar)observer.observe(sidebar,{attributes:true,subtree:true,attributeFilter:['hidden','class','aria-hidden']});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('click',e=>{if(e.target.closest('.nav [data-view], [data-nav-section], [data-mobile-section], [data-context-view]'))setTimeout(schedule,0)},true);
  schedule();
})();
