(()=>{
  'use strict';
  const GROUPS={
    ai:{title:'AI 與法規',icon:'AI',desc:'Writer、模型、Gemini Compliance 與 Prompt',selectors:['#publishAIProviderCard','#publishComplianceCard']},
    notion:{title:'Notion',icon:'N',desc:'Workspace、8 個資料庫與同步映射',selectors:['#notionSettingsCard']},
    canva:{title:'Canva',icon:'C',desc:'OAuth、Design Source 與 Social Pack',selectors:['#canvaSettingsPublishCard']},
    meta:{title:'Meta',icon:'M',desc:'Facebook、Instagram、Threads 與 OAuth',selectors:['#publishMetaProviderCard']},
    'google-github':{title:'Google / GitHub',icon:'G',desc:'發布、Licensed Search 與 Repository',selectors:['#settingsGithubCard','#googleMediaCard','#settingsDataCard']},
    'email-security':{title:'Email / Security',icon:'S',desc:'OTP mail 狀態、安全事件與後端稽核',selectors:['#securityAuditPanel']}
  };
  let active='';
  function view(){return document.getElementById('view')}
  function isSettings(){const v=view();return !!(v&&v.querySelector('.publish-grid')&&v.querySelector('.page-head h1')?.textContent.trim()==='設定')}
  function statusFor(group){
    const defs=GROUPS[group];if(!defs)return '檢查狀態';
    const nodes=defs.selectors.flatMap(s=>[...document.querySelectorAll(s)]);
    if(!nodes.length)return '載入中…';
    const ready=nodes.some(n=>n.querySelector('.ready,.file-ok')||/已連線|READY|正常|已安全設定|後端已設定/.test(n.textContent||''));
    return ready?'已連線':'可設定';
  }
  function syncStatuses(){document.querySelectorAll('[data-settings-status]').forEach(el=>{const g=el.dataset.settingsStatus||'';const t=statusFor(g);if(el.textContent!==t)el.textContent=t;el.classList.toggle('ready',t==='已連線')})}
  function classify(){
    for(const [g,d] of Object.entries(GROUPS)) for(const s of d.selectors) document.querySelectorAll(s).forEach(el=>el.dataset.settingsGroup=g);
  }
  function filter(){
    const shell=document.querySelector('.settings-detail-shell'),grid=shell?.querySelector('.publish-grid');if(!grid)return;
    classify();
    [...grid.children].forEach(card=>card.classList.toggle('settings-hub-hidden',Boolean(active)&&card.dataset.settingsGroup!==active));
    const audit=document.getElementById('securityAuditPanel');if(audit)audit.classList.toggle('settings-hub-hidden',Boolean(active)&&audit.dataset.settingsGroup!==active);
    syncStatuses();
  }
  function openGroup(group){
    const hub=document.querySelector('.settings-integration-hub'),shell=document.querySelector('.settings-detail-shell');if(!hub||!shell||!GROUPS[group])return;
    active=group;hub.hidden=true;shell.classList.add('is-open');shell.hidden=false;
    const title=shell.querySelector('[data-settings-detail-title]');if(title)title.textContent=GROUPS[group].title;
    shell.classList.remove('settings-detail-enter');void shell.offsetWidth;shell.classList.add('settings-detail-enter');filter();
    shell.querySelector('.settings-detail-back')?.focus({preventScroll:true});
  }
  function closeDetail(){const hub=document.querySelector('.settings-integration-hub'),shell=document.querySelector('.settings-detail-shell');if(!hub||!shell)return;active='';shell.classList.remove('is-open');shell.hidden=true;hub.hidden=false;filter();document.querySelector('.settings-integration-card')?.focus({preventScroll:true})}
  function card(g,d){return `<button type="button" class="settings-integration-card" data-settings-target="${g}"><span class="settings-integration-icon">${d.icon}</span><span class="settings-integration-copy"><strong>${d.title}</strong><small>${d.desc}</small></span><span class="settings-integration-state" data-settings-status="${g}">檢查狀態</span></button>`}
  function enhance(){
    if(!isSettings())return;
    const v=view();v.classList.add('settings-v23988');
    const grid=v.querySelector('.publish-grid');if(!grid)return;
    const firstCards=[...grid.children];if(firstCards[0]&&!firstCards[0].id)firstCards[0].id='settingsGithubCard';if(firstCards[1]&&!firstCards[1].id)firstCards[1].id='settingsDataCard';
    if(!v.querySelector('.settings-integration-hub')){
      const hub=document.createElement('section');hub.className='settings-integration-hub';hub.setAttribute('aria-label','整合設定');hub.innerHTML=Object.entries(GROUPS).map(([g,d])=>card(g,d)).join('');
      const shell=document.createElement('section');shell.className='settings-detail-shell';shell.hidden=true;shell.innerHTML=`<div class="settings-detail-head"><button class="settings-detail-back" type="button" aria-label="返回設定總覽">←</button><div class="settings-detail-title"><span>SETTINGS</span><strong data-settings-detail-title>整合設定</strong></div></div><div class="settings-detail-mount"></div>`;
      const pageHead=v.querySelector('.page-head');pageHead?.insertAdjacentElement('afterend',hub);hub.insertAdjacentElement('afterend',shell);shell.querySelector('.settings-detail-mount').appendChild(grid);
      hub.addEventListener('click',e=>{const b=e.target.closest('[data-settings-target]');if(b)openGroup(b.dataset.settingsTarget)});shell.querySelector('.settings-detail-back')?.addEventListener('click',closeDetail);
    }
    const shell=v.querySelector('.settings-detail-shell');const audit=document.getElementById('securityAuditPanel');if(audit&&shell&&!shell.contains(audit))shell.querySelector('.settings-detail-mount')?.appendChild(audit);
    filter();
  }
  const mo=new MutationObserver(()=>{enhance();syncStatuses()});
  const start=()=>{const v=view();if(v)mo.observe(v,{childList:true,subtree:true,characterData:true});enhance()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  document.addEventListener('pointerdown',e=>{const dock=document.getElementById('editorToolDock');if(!dock?.classList.contains('open'))return;if(dock.contains(e.target))return;dock.classList.remove('open');document.getElementById('toolFab')?.setAttribute('aria-expanded','false')},{capture:true,passive:true});

  document.addEventListener('click',async e=>{
    const more=e.target.closest('#editorToolbarMore');if(more){e.preventDefault();e.stopPropagation();document.getElementById('editorToolbar')?.classList.toggle('more-open');return}
    const cli=e.target.closest('#copyMetaDeveloperCli');if(cli){const code=document.getElementById('metaDeveloperCliCommand')?.textContent||'';try{await navigator.clipboard.writeText(code);const old=cli.textContent;cli.textContent='已複製';setTimeout(()=>cli.textContent=old,1200)}catch(_){const old=cli.textContent;cli.textContent='複製失敗';setTimeout(()=>cli.textContent=old,1200)}}
  });
})();
