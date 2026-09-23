
(() => {
  const CONFIG={hours:24,limit:5,minMajorMedia:2,requestTimeoutMs:95000};
  const lowPower=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4)||matchMedia('(max-width:520px)').matches;
  if(lowPower)document.documentElement.classList.add('lowfx');

  const $=s=>document.querySelector(s);
  const homeScreen=$('#homeScreen'),listScreen=$('#listScreen'),detailScreen=$('#detailScreen');
  const scanBtn=$('#scanBtn'),scanText=$('#scanText'),searchNote=$('#searchNote'),warmStatus=$('#warmStatus');
  const refreshBtn=$('#refreshBtn'),backBtn=$('#backBtn'),focusList=$('#focusList'),detailCard=$('#detailCard'),sourceList=$('#sourceList'),statusText=$('#statusText'),demoBadge=$('#demoBadge'),listError=$('#listError'),toast=$('#toast'),settingsToggleBtn=$('#settingsToggleBtn'),focusSettingsPanel=$('#focusSettingsPanel');

  let topics=[],busy=false,currentTopic=null,currentDraft=null,workspacePayload=null,draftVariantCycle=0;

  function showScreen(target){[homeScreen,listScreen,detailScreen].forEach(el=>el.classList.remove('active'));target.classList.add('active');window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}

  function toggleFocusSettings(force){
    const next=typeof force==='boolean'?force:!focusSettingsPanel?.classList.contains('show');
    if(focusSettingsPanel)focusSettingsPanel.classList.toggle('show',next);
    if(settingsToggleBtn)settingsToggleBtn.textContent=next?'收合 AI 狀態與指令':'AI 狀態與指令';
  }
  function countInstructionItems(prompt=''){return String(prompt||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).length}
  async function refreshFocusSettings({open=false}={}){
    if(open)toggleFocusSettings(true);
    try{
      if(window.parent?.signwellMedicalNewsAIStatus){
        const status=await window.parent.signwellMedicalNewsAIStatus();
        const stateEl=$('#focusAiProviderState'),help=$('#focusAiProviderHelp');
        if(stateEl){stateEl.className='';stateEl.id='focusAiProviderState';stateEl.textContent=status?.configured?'已連線':'未連線';stateEl.classList.add(status?.configured?'ready':'error')}
        if(help)help.textContent=status?.configured?`${status.providerLabel||'AI Provider'} 已就緒 · ${status.model||'model 未命名'}${status.endpointLabel?' · '+status.endpointLabel:''}${status.inheritedGeminiKey?' · 沿用 Compliance Gemini Key':''}`:'AI Provider 尚未完成連線；請到 CMS「設定」完成 Provider，Gemini 可沿用 Compliance Key。';
      }
    }catch(err){const help=$('#focusAiProviderHelp'),stateEl=$('#focusAiProviderState');if(stateEl){stateEl.textContent='讀取失敗';stateEl.className='error'}if(help)help.textContent='Provider 狀態讀取失敗：'+String(err?.message||err)}
    try{
      if(window.parent?.signwellAIInstructionState){
        const state=await window.parent.signwellAIInstructionState();const prompt=String(state?.editablePrompt||'');
        const box=$('#focusAiInstructionInput'),count=$('#focusAiInstructionCount'),help=$('#focusAiInstructionHelp'),badge=$('#focusAiInstructionState');
        if(box)box.value=prompt;if(count)count.textContent=`${countInstructionItems(prompt)} 條`;if(badge)badge.textContent=state?.configured?'AI 已連線':'AI 尚未連線';if(help)help.textContent=prompt?'目前儲存的是可編輯 AI 指令；底層安全規則仍會繼續保留。':'目前尚未新增額外寫作偏好；你可以直接在這裡輸入。';
      }
    }catch(err){const help=$('#focusAiInstructionHelp'),badge=$('#focusAiInstructionState');if(badge)badge.textContent='同步失敗';if(help)help.textContent='AI 指令讀取失敗：'+String(err?.message||err)}
  }
  async function saveFocusInstructions(){
    const prompt=$('#focusAiInstructionInput')?.value||'';
    if(!window.parent?.signwellAIInstructionSave){showToast('AI 指令 bridge 尚未就緒');return}
    const btn=$('#focusAiInstructionSaveBtn'); const old=btn?.textContent||''; if(btn){btn.disabled=true;btn.textContent='儲存中…'}
    try{await window.parent.signwellAIInstructionSave(prompt); showToast('AI 指令已儲存'); await refreshFocusSettings()}
    catch(err){const help=$('#focusAiInstructionHelp'); if(help)help.textContent='AI 指令儲存失敗：'+String(err?.message||err); showToast('AI 指令儲存失敗')}
    finally{if(btn){btn.disabled=false;btn.textContent=old}}
  }
  async function clearFocusInstructions(){
    if(!window.parent?.signwellAIInstructionClear){showToast('AI 指令 bridge 尚未就緒');return}
    const ok=confirm('只會清除可編輯 AI 指令，不會影響底層限制。是否清除？');
    if(!ok)return;
    try{await window.parent.signwellAIInstructionClear(); showToast('已清除可編輯 AI 指令'); await refreshFocusSettings()}
    catch(err){showToast('清除失敗')}
  }
  function escapeHTML(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function safeURL(v=''){const s=String(v||'').trim();return /^https?:\/\//i.test(s)?s:'#'}
  function relTime(input){const t=new Date(input||Date.now()).getTime();if(!Number.isFinite(t))return'剛剛';const mins=Math.max(0,Math.round((Date.now()-t)/60000));if(mins<1)return'剛剛';if(mins<60)return`${mins} 分鐘前`;const h=Math.round(mins/60);return h<24?`${h} 小時前`:'24 小時內'}
  function stripHTML(html=''){const el=document.createElement('div');el.innerHTML=html;return(el.textContent||'').replace(/\s+/g,' ').trim()}
  function countZhText(html=''){return stripHTML(html).replace(/參考資料[\s\S]*$/,'').replace(/\s/g,'').length}
  function mark(text,core=false){return `<mark class="${core?'core':''}">${escapeHTML(text)}</mark>`}
  function citation(n,url){return `<sup><a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">[${n}]</a></sup>`}

  function normalizeTopics(payload){
    const raw=Array.isArray(payload)?payload:(payload?.topics||payload?.data||[]);
    return raw.map((t,i)=>{
      const sourceMap=new Map();
      (Array.isArray(t.sources)?t.sources:[]).forEach(s=>{
        const canonical=String(s.canonicalName||s.name||s.source||'').trim();
        const url=safeURL(s.originalUrl||s.url||s.link||'');
        if(s.isMajorMedia!==true||!canonical||url==='#'||sourceMap.has(canonical))return;
        sourceMap.set(canonical,{name:canonical,title:s.title||s.headline||t.title||'',url,googleNewsUrl:safeURL(s.googleNewsUrl||''),publishedAt:s.publishedAt||t.publishedAt||new Date().toISOString(),isMajorMedia:true,isDirectOriginal:s.isDirectOriginal===true,snippet:s.snippet||'',imageUrl:safeURL(s.imageUrl||''),imageCredit:s.imageCredit||canonical});
      });
      const sources=[...sourceMap.values()];
      const literature=Array.isArray(t.literature)?t.literature.map(x=>({...x,url:safeURL(x.url)})).filter(x=>x.url!=='#'):[];
      return {id:t.id||`topic-${i+1}`,title:t.title||'未命名焦點',category:t.category||'健康時事',summary:t.summary||'',why:t.why||'',publishedAt:t.publishedAt||new Date().toISOString(),majorMediaCount:Number(t.majorMediaCount||sources.length),sources,extensionTerms:Array.isArray(t.extensionTerms)?t.extensionTerms:[],literature};
    }).filter(t=>t.majorMediaCount>=CONFIG.minMajorMedia&&t.sources.length>=CONFIG.minMajorMedia).sort((a,b)=>b.majorMediaCount-a.majorMediaCount||new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,CONFIG.limit);
  }

  async function requestWorkspace(force=false){
    if(window.parent&&window.parent!==window&&typeof window.parent.signwellMedicalNewsWorkspace==='function'){
      return window.parent.signwellMedicalNewsWorkspace({hours:24,limit:5,minMajorMedia:2,force:Boolean(force)});
    }
    if(window.parent&&window.parent!==window&&typeof window.parent.signwellMedicalNewsScan==='function'){
      return window.parent.signwellMedicalNewsScan({hours:24,limit:5,minMajorMedia:2,force:Boolean(force)});
    }
    throw new Error('請由 SIGN WELL CMS 的「時事新聞建議」分頁開啟。');
  }

  async function preloadWorkspace(){
    try{
      const data=await requestWorkspace(false);
      workspacePayload=data;topics=normalizeTopics(data);
      warmStatus.classList.add('ready');
      warmStatus.querySelector('span').textContent=topics.length?`今日時事已就緒 · ${topics.length} 個焦點`:'背景掃描完成 · 目前無符合焦點';
      scanText.textContent='開啟今日焦點';
    }catch(_){
      warmStatus.classList.add('error');
      warmStatus.querySelector('span').textContent='背景準備未完成 · 點擊後重新嘗試';
    }
  }

  async function scan(force=false){
    if(busy)return;busy=true;listError.classList.remove('show');scanBtn.disabled=true;scanBtn.classList.add('searching');scanText.textContent=force?'正在重新整理':'正在開啟今日焦點';searchNote.textContent='整理近 24 小時醫療、健康與運動新聞、全部知名媒體來源與後台 PubMed 核驗資料…';searchNote.classList.add('show');
    try{
      const data=(!force&&workspacePayload)?workspacePayload:await Promise.race([requestWorkspace(force),new Promise((_,reject)=>setTimeout(()=>reject(new Error('背景工作逾時，請稍後再試。')),CONFIG.requestTimeoutMs))]);
      workspacePayload=data;topics=normalizeTopics(data);renderList(data);showScreen(listScreen);
    }catch(err){topics=[];focusList.innerHTML='';showScreen(listScreen);listError.textContent='無法取得即時焦點：'+String(err?.message||err);listError.classList.add('show');statusText.textContent='即時工作區未完成';}
    finally{busy=false;scanBtn.disabled=false;scanBtn.classList.remove('searching');scanText.textContent='開啟今日焦點';searchNote.classList.remove('show')}
  }

  function renderList(payload={}){
    demoBadge.classList.remove('show');
    const crawledAt=payload?.crawledAt?new Date(payload.crawledAt):new Date();
    const scannedCount=Number(payload?.scannedArticles||0),qualifiedCount=Number(payload?.qualifiedTopics||topics.length);
    statusText.textContent=`近 24 小時 · ${crawledAt.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})} 更新 · 熱門門檻 ≥ 2 家知名媒體`;
    if(!topics.length){focusList.innerHTML=`<div class="empty-hot glass"><strong>目前沒有事件通過熱門門檻</strong><p>系統不會使用展示資料，也不會降低門檻補滿 5 則。</p></div>`;return}
    focusList.innerHTML=topics.map((t,i)=>`<article class="focus-card glass" data-i="${i}"><span class="shine"></span><div class="card-grid"><div class="index">${String(i+1).padStart(2,'0')}</div><div><div class="meta-line"><span class="tag">${escapeHTML(t.category)}</span><span class="when">${relTime(t.publishedAt)}</span><span class="hot-threshold">HOT · ${t.majorMediaCount} 家知名媒體</span></div><h2 class="focus-title">${escapeHTML(t.title)}</h2><p class="focus-summary">${escapeHTML(t.summary)}</p><p class="why">${escapeHTML(t.why)}</p></div><div class="source-count"><span>${t.majorMediaCount} 家媒體</span><span class="chev">›</span></div></div><div class="focus-card-actions"><button class="pill view" type="button" data-action="open" data-i="${i}">查看摘要</button></div></article>`).join('');
    if(qualifiedCount<CONFIG.limit)focusList.insertAdjacentHTML('beforeend',`<div class="strict-note"><strong>嚴格模式：</strong>本次掃描 ${scannedCount.toLocaleString()} 篇候選報導，只有 ${qualifiedCount} 個事件通過至少 2 家知名媒體門檻，不以低熱度內容補滿。</div>`);
    focusList.querySelectorAll('.focus-card').forEach(card=>{const idx=Number(card.dataset.i);card.onclick=e=>{if(e.target.closest('button'))return;openDetail(idx)};card.querySelector('[data-action="open"]')?.addEventListener('click',e=>{e.stopPropagation();openDetail(idx)});if(!lowPower){card.onpointermove=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.setProperty('--ry',`${(x-.5)*3.2}deg`);card.style.setProperty('--rx',`${(.5-y)*2.8}deg`)};card.onpointerleave=()=>{card.style.setProperty('--ry','0deg');card.style.setProperty('--rx','0deg')}}});
    refreshFocusSettings();
  }


  const EXTENSION_ZH_MAP={
    'glp-1 receptor agonist':'GLP-1 受體促效劑',
    'obesity treatment':'肥胖治療',
    'body composition':'身體組成',
    'weight maintenance':'體重維持',
    'diabetes mellitus':'糖尿病',
    'glycemic control':'血糖控制',
    'cardiovascular outcomes':'心血管結局',
    'cancer treatment':'癌症治療',
    'overall survival':'總存活期',
    'progression-free survival':'無惡化存活期',
    'cardiovascular disease':'心血管疾病',
    'major adverse cardiovascular events':'主要不良心血管事件',
    'mortality':'死亡率',
    'dementia':'失智症',
    'alzheimer disease':'阿茲海默症',
    'cognitive decline':'認知功能下降',
    'vaccine effectiveness':'疫苗有效性',
    'infectious disease':'感染性疾病',
    'public health':'公共衛生',
    'aesthetic medicine':'醫學美容',
    'treatment safety':'治療安全性',
    'adverse events':'不良事件',
    'health policy':'醫療政策',
    'healthcare utilization':'醫療服務利用',
    'cost effectiveness':'成本效益',
    'surgical outcomes':'手術結果',
    'complications':'併發症',
    'patient selection':'病人選擇',
    'drug safety':'藥物安全性',
    'regulatory approval':'監管核准',
    'population risk':'族群風險',
    'prevention':'預防',
    'access to care':'醫療可近性',
    'clinical outcomes':'臨床結局',
    'treatment efficacy':'治療效果',
    'long-term outcomes':'長期結果'
  };
  function extensionDisplayLabel(value=''){
    const raw=String(value||'').replace(/\s+/g,' ').trim();
    if(!raw)return'';
    // If the backend already returns bilingual text, normalize the English→Chinese boundary to two spaces.
    if(/[\u3400-\u9fff]/.test(raw))return raw.replace(/([A-Za-z0-9)%])\s*(?=[\u3400-\u9fff])/g,'$1  ');
    const zh=EXTENSION_ZH_MAP[raw.toLowerCase()];
    return zh?`${raw}  ${zh}`:raw;
  }

  function defaultExtensionSuggestions(t){
    const cat=t.category||'';
    const base=['原始資料或官方公告實際說了什麼？','這項資訊真正適用哪些族群，限制在哪裡？','新聞標題與研究、政策或臨床脈絡之間有沒有落差？'];
    if(/藥物/.test(cat))base.push('療效、安全性與核准適應症需要分開看哪些重點？');
    else if(/政策/.test(cat))base.push('政策改變後，病人、醫療端與資源分配會受到什麼影響？');
    else if(/公共衛生/.test(cat))base.push('個人風險與族群風險是否被新聞混在一起？');
    else base.push('這個事件對一般民眾真正可採取的行動是什麼？');
    return base;
  }

  let aiWriterStatusCache=null;
  let aiProfileStatusCache=null;
  let dailyAiProfile=(()=>{try{return localStorage.getItem('sw-daily-focus-writer-profile-v2')||'gpt'}catch(_){return 'gpt'}})();
  let dailyReviewerProfile=(()=>{try{return localStorage.getItem('sw-daily-focus-reviewer-profile-v1')||'gemini'}catch(_){return 'gemini'}})();
  let aiJobPollTimer=null;
  let recoverableAiJob=null;

  function createAiJobId(){
    try{
      const a=new Uint8Array(12);crypto.getRandomValues(a);
      return 'aijob_'+Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');
    }catch(_){
      return 'aijob_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,14);
    }
  }

  function aiStageIndex(stage,pct){
    if(stage==='format'||pct>=94)return 4;
    if(['claim_audit','claim_repair','claim_safe'].includes(stage)||pct>=72)return 3;
    if(['writer','editor','repair'].includes(stage)||pct>=30)return 2;
    if(['evidence_ready','claim_plan'].includes(stage)||pct>=18)return 1;
    return 0;
  }

  function stopAiJobPolling(){
    if(aiJobPollTimer){clearTimeout(aiJobPollTimer);aiJobPollTimer=null}
  }

  function startAiJobPolling(jobId){
    stopAiJobPolling();
    const run=async()=>{
      try{
        if(window.parent?.signwellMedicalNewsAIJobStatus){
          const st=await window.parent.signwellMedicalNewsAIJobStatus(jobId,false);
          if(st?.state==='running'){
            const pct=Math.max(3,Number(st.progress||0));
            updateAiProgress(aiStageIndex(String(st.stage||''),pct),st.label||'AI 正在處理',pct);
          }else if(st?.state==='done'){
            updateAiProgress(5,'生成完成',100);
            return;
          }else if(st?.state==='error'){
            return;
          }
        }
      }catch(_){}
      aiJobPollTimer=setTimeout(run,5500);
    };
    aiJobPollTimer=setTimeout(run,1800);
  }

  function setAiState(mode,label){
    const el=$('#aiState');if(!el)return;
    el.className='ai-state'+(mode?' '+mode:'');
    el.textContent=label||'AI Writer';
  }

  function toggleAiSetup(show){
    const panel=$('#aiSetup');if(!panel)return;
    panel.classList.toggle('show',Boolean(show));
    if(show)setTimeout(()=>$('#aiEndpointInput')?.focus(),80);
  }

  function renderAiStatus(s){
    const note=$('#aiEngineNote');
    aiWriterStatusCache=s||null;
    if(!note)return;
    note.classList.remove('ready','error');
    if(s?.configured){
      setAiState('ready','已連線');
      note.textContent=`AI Writer 已就緒 · ${s.model||'LLM'}${s.endpointLabel?' · '+s.endpointLabel:''} · Evidence Lock 開啟 · Claim-level 局部修復 / 工作復原啟用${s.customPromptConfigured?' · 自訂 Prompt 已啟用':''}${s?.health?.state==='error'?' · Provider 最近一次回應異常':''}`;
      note.classList.add('ready');
      const model=$('#aiModelInput');if(model&&!model.value)model.value=s.model||'';
      const prompt=$('#aiPromptInput');if(prompt&&!prompt.value)prompt.value=s.customPrompt||'';
      toggleAiSetup(false);
    }else{
      setAiState('','未連線');
      const missing=Array.isArray(s?.missing)&&s.missing.length?s.missing.join('、'):'AI 後端設定';
      note.textContent=`AI Writer 尚未連線 · 缺少 ${missing}。請到 CMS「設定」完成 AI Provider。`;
      note.classList.add('error');
    }
  }

  async function refreshAiWriterStatus({openWhenMissing=false}={}){
    try{
      if(!window.parent?.signwellMedicalNewsAIStatus)throw new Error('CMS bridge unavailable');
      setAiState('busy','檢查中');
      const s=await window.parent.signwellMedicalNewsAIStatus();
      renderAiStatus(s);
      if(openWhenMissing&&!s?.configured)showToast('請到 CMS「設定」完成 AI Provider');
      return s;
    }catch(err){
      setAiState('','狀態未知');
      const note=$('#aiEngineNote');
      if(note){note.textContent='AI Writer 狀態無法確認：'+String(err?.message||err);note.classList.remove('ready');note.classList.add('error')}
      return null;
    }
  }


  async function refreshDailyAiProfiles(){
    const select=$('#dailyAiProfileSelect'),reviewSelect=$('#dailyReviewerProfileSelect'),help=$('#dailyAiProfileHelp');
    if(!select)return aiProfileStatusCache;
    try{
      if(!window.parent?.signwellAIProfilesStatus)throw new Error('AI Profiles bridge unavailable');
      const root=await window.parent.signwellAIProfilesStatus();aiProfileStatusCache=root||null;
      const profiles=root?.profiles||{};
      const paint=(sel,current,kind)=>{if(!sel)return current;[...sel.options].forEach(opt=>{const st=profiles[opt.value]||{};const base=opt.value==='gemini'?'Gemini':opt.value==='gpt'?'GPT':'Writer Core';opt.textContent=base+(st.model?` · ${st.model}`:'')+(st.configured?'':' · 未設定');opt.disabled=!st.configured;});if(!profiles[current]?.configured){current=(kind==='writer'?['gpt','gemini','writer']:['gemini','gpt','writer']).find(x=>profiles[x]?.configured)||(kind==='writer'?'gpt':'gemini');}sel.value=current;return current;};
      dailyAiProfile=paint(select,dailyAiProfile,'writer');
      dailyReviewerProfile=paint(reviewSelect,dailyReviewerProfile,'reviewer');
      const writer=profiles[dailyAiProfile]||{},reviewer=profiles[dailyReviewerProfile]||{};
      const label=x=>x==='gpt'?'GPT':x==='gemini'?'Gemini':'Writer Core';
      const fail=root?.failover||{};
      const routingText=()=>{const wf=fail.enabled?(fail.writerFallbacks||[]):[],rf=fail.enabled?(fail.reviewerFallbacks||[]):[];return `Writer：${writer.label||dailyAiProfile} · ${writer.model||'model'}${wf.length?' → fallback '+wf.map(label).join(' → '):''}；Reviewer：${reviewer.label||dailyReviewerProfile} · ${reviewer.model||'model'}${rf.length?' → fallback '+rf.map(label).join(' → '):''}`};
      if(help)help.textContent=routingText();
      select.onchange=()=>{dailyAiProfile=String(select.value||'gpt');try{localStorage.setItem('sw-daily-focus-writer-profile-v2',dailyAiProfile)}catch(_){}const w=profiles[dailyAiProfile]||{},r=profiles[dailyReviewerProfile]||{};if(help)help.textContent=`Writer：${w.label||dailyAiProfile} · ${w.model||'model'}${fail.enabled?' · 自動備援 ON':''} → Reviewer：${r.label||dailyReviewerProfile} · ${r.model||'model'}`;};
      if(reviewSelect)reviewSelect.onchange=()=>{dailyReviewerProfile=String(reviewSelect.value||'gemini');try{localStorage.setItem('sw-daily-focus-reviewer-profile-v1',dailyReviewerProfile)}catch(_){}const w=profiles[dailyAiProfile]||{},r=profiles[dailyReviewerProfile]||{};if(help)help.textContent=`Writer：${w.label||dailyAiProfile} · ${w.model||'model'} → Reviewer：${r.label||dailyReviewerProfile} · ${r.model||'model'}${fail.enabled?' · 自動備援 ON':''}`;};
      return root;
    }catch(err){if(help)help.textContent='模型狀態讀取失敗：'+String(err?.message||err);return null;}
  }

  async function saveAiWriterConfig(){
    const save=$('#aiSaveBtn');
    const endpoint=$('#aiEndpointInput')?.value.trim()||'';
    const apiKey=$('#aiKeyInput')?.value.trim()||'';
    const model=$('#aiModelInput')?.value.trim()||'';
    const customPrompt=$('#aiPromptInput')?.value.trim()||'';
    if(!endpoint||!model){showToast('請填入 API Endpoint 與 Model ID');return false}
    if(!/^https:\/\//i.test(endpoint)){showToast('API Endpoint 必須使用 https://');return false}
    if(!window.parent?.signwellMedicalNewsAIConfigure){showToast('CMS 尚未載入 AI 設定 bridge');return false}
    const old=save.textContent;save.disabled=true;save.textContent='儲存並測試中…';setAiState('busy','連線測試');
    try{
      const result=await window.parent.signwellMedicalNewsAIConfigure({endpoint,apiKey,model,customPrompt,test:true});
      if(!result?.ok)throw new Error(result?.error||'AI 設定失敗');
      if($('#aiKeyInput'))$('#aiKeyInput').value='';
      renderAiStatus(result.status||result);
      toggleAiSetup(false);
      showToast('AI Writer 已連線');
      return true;
    }catch(err){
      const note=$('#aiEngineNote');const msg=String(err?.message||err);
      setAiState('','連線失敗');
      if(note){note.textContent='AI Writer 連線失敗：'+msg;note.classList.remove('ready');note.classList.add('error')}
      showToast('AI 連線失敗');
      return false;
    }finally{save.disabled=false;save.textContent=old}
  }

  function updateAiProgress(step,text,pct){
    const wrap=$('#aiProgress'),bar=$('#aiProgressBar'),label=$('#aiProgressText'),percent=$('#aiProgressPct');
    if(!wrap)return;
    wrap.classList.add('show');
    if(bar)bar.style.width=Math.max(0,Math.min(100,pct||0))+'%';
    if(label)label.textContent=text||'處理中';
    if(percent)percent.textContent=Math.round(pct||0)+'%';
    wrap.querySelectorAll('[data-ai-stage]').forEach((el,i)=>{
      el.classList.toggle('done',i<step);
      el.classList.toggle('active',i===step);
    });
  }

  function finishAiProgress(ok=true){
    updateAiProgress(5,ok?'生成完成':'生成中止',ok?100:0);
    setTimeout(()=>$('#aiProgress')?.classList.remove('show'),ok?1800:900);
  }

  function openDetail(i){
    const t=topics[i];if(!t)return;currentTopic=t;currentDraft=null;draftVariantCycle=0;
    const extensions=(t.extensionTerms?.length?t.extensionTerms:defaultExtensionSuggestions(t)).slice(0,6);
    detailCard.innerHTML=`
      <div class="detail-kicker"><span class="tag">${escapeHTML(t.category)}</span><span>${relTime(t.publishedAt)}</span><span>·</span><span>${t.majorMediaCount} 家知名媒體共同報導</span></div>
      <h1 class="detail-title">${escapeHTML(t.title)}</h1>
      <div class="workspace-section"><h3>事件摘要</h3><p>${escapeHTML(t.summary)}</p></div>
      <div class="workspace-section"><h3>延伸探討建議</h3><ul class="extension-list">${extensions.map(x=>`<li>${escapeHTML(extensionDisplayLabel(x))}</li>`).join('')}</ul></div>
      <div class="workspace-section"><h3>後台核驗文獻 · PubMed</h3><p class="backend-only-note">僅供 CMS 內部查證與 AI 證據審查，不會寫入公開文章，也不會作為 Public 引用。</p>${renderLiterature(t)}</div>
      <div class="writer-panel">
        <div class="writer-head">
          <div><strong>SIGN WELL AI Writer</strong><span>小題 800–1200 / 大題 1200–2200 字 · 主張－證據鎖定 · 公開引用僅限新聞來源</span></div>
          <div class="writer-head-actions"><span class="ai-state" id="aiState">檢查中</span><button class="ai-settings-btn" id="aiSettingsBtn" type="button">前往設定</button><button class="generate-btn" id="generateDraftBtn" type="button">AI 一鍵生成範文</button></div>
        </div>
        <div class="ai-provider-location-note">預設流程：GPT Writer 生稿 → Gemini Evidence/Citation Reviewer → GPT 只修 FAIL 段落 → Gemini 再驗 → 本機 Evidence / Legal Gate。若 Primary Provider 不可用，會沿用 Notion AI Routing 的 fallback 順序接手；Evidence Pack、Claim Map、Prompt、引用規則與安全 Gate 不變。Writer / Reviewer 主模型的切換仍只影響本次每日焦點。</div><div class="ai-profile-picker"><label>本次 Writer<select id="dailyAiProfileSelect"><option value="gpt">GPT（預設）</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select></label><label>Evidence Reviewer<select id="dailyReviewerProfileSelect"><option value="gemini">Gemini（預設）</option><option value="gpt">GPT</option><option value="writer">Writer Core</option></select></label><small id="dailyAiProfileHelp">正在讀取可用模型…</small></div>
        <div class="ai-progress" id="aiProgress">
          <div class="ai-progress-head"><span id="aiProgressText">準備生成</span><span id="aiProgressPct">0%</span></div>
          <div class="ai-progress-track"><div class="ai-progress-bar" id="aiProgressBar"></div></div>
          <div class="ai-stages"><span class="ai-stage" data-ai-stage="0">新聞來源鎖定</span><span class="ai-stage" data-ai-stage="1">PubMed 引用核驗</span><span class="ai-stage" data-ai-stage="2">AI 撰寫</span><span class="ai-stage" data-ai-stage="3">主張－證據審查</span><span class="ai-stage" data-ai-stage="4">自動排版</span></div>
        </div>
        <div class="review-strip" id="reviewStrip"><span class="review-chip">新聞來源 ✓</span><span class="review-chip">PubMed 引用核驗 ✓</span><span class="review-chip">引用吻合 ✓</span><span class="review-chip">情境核對 ✓</span><span class="review-chip">主題吻合 ✓</span></div>
        <div class="draft-wrap" id="draftWrap"><div class="draft-paper" id="draftPaper"></div><div class="draft-actions"><button id="copyDraftBtn" type="button">複製範文</button><button class="primary" id="toEditorBtn" type="button">帶入文章編輯器</button><button id="publishDraftBtn" type="button">直接發布＋通知到「時事探討」</button></div><div class="draft-meta" id="draftMeta"></div><div class="claim-audit-card" id="claimAuditCard" hidden></div></div>
        <div class="engine-note" id="aiEngineNote">正在確認 AI Writer 後端狀態…</div>
      </div>
      <div class="actions"><button class="pill primary" id="copyFocusBtn" type="button">複製焦點摘要</button><button class="pill" id="copyLinksBtn" type="button">複製全部原文</button></div>`;

    sourceList.innerHTML=`<div class="why-panel"><div class="why-label">SOURCE CHECK</div><p class="why-text">${escapeHTML(t.why)}</p></div>`+t.sources.map((s,idx)=>`<a class="source-card glass" href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer"><div><div class="source-name">[${idx+1}] ${escapeHTML(s.name)}</div><div class="source-title">${escapeHTML(s.title)}</div><div class="source-time">${relTime(s.publishedAt)}</div></div><span class="source-origin ${s.isDirectOriginal?'direct':''}">${s.isDirectOriginal?'原文':'原文入口'} ↗</span></a>`).join('');

    $('#copyFocusBtn').onclick=()=>copyText(`${t.title}\n\n${t.summary}\n\n熱門度：${t.majorMediaCount} 家知名媒體共同報導\n${t.why}`);
    $('#copyLinksBtn').onclick=()=>copyText(t.sources.map(s=>`${s.name}｜${s.title}\n${s.url}`).join('\n\n'));
    $('#generateDraftBtn').onclick=()=>generateDraft(t);
    $('#aiSettingsBtn').onclick=()=>window.parent?.signwellCmsOpenSettings?.();
    showScreen(detailScreen);
    refreshAiWriterStatus({openWhenMissing:false});
    refreshDailyAiProfiles();
  }

  function renderLiterature(t){
    if(!t.literature?.length)return `<p>目前未取得足夠精準的 PubMed 結果。這不影響公開文章引用規則；Public 仍只會引用新聞來源。</p>`;
    return `<div class="literature-list">${t.literature.map((x,i)=>`<a class="lit-card" href="${escapeHTML(x.url)}" target="_blank" rel="noopener noreferrer"><span class="lit-level">${escapeHTML(x.evidenceLevel||'Research Article')}</span><strong>[L${i+1}] ${escapeHTML(x.title||'Untitled')}</strong><span>${escapeHTML([x.journal,x.pubdate].filter(Boolean).join(' · '))}${x.pmid?` · PMID ${escapeHTML(x.pmid)}`:''}</span></a>`).join('')}</div>`;
  }

  function narrativeVariant(t,offset=0){
    let h=0;
    for(const ch of String(t.id||t.title))h=(h*31+ch.charCodeAt(0))>>>0;
    return (h+Number(offset||0))%4;
  }

  function guardrailText(text){
    return String(text||'')
      .replace(/最有效/g,'目前證據較受關注的')
      .replace(/完全安全/g,'目前資料顯示具有一定安全性，但仍需評估風險')
      .replace(/零風險/g,'風險並非為零')
      .replace(/保證/g,'無法保證')
      .replace(/一定會/g,'可能會')
      .replace(/證實可以/g,'研究顯示可能')
      .replace(/根治/g,'治療')
      .replace(/治癒所有/g,'改善部分');
  }

  function buildReferences(t){
    const refs=[];
    (t.sources||[]).forEach(s=>refs.push({type:'news',name:s.name,title:s.title,url:s.url}));
    return refs;
  }

  function refListHTML(refs){
    return `<div class="refs"><h3>參考資料</h3><ol>${refs.map((r,i)=>`<li id="ref-${i+1}"><a href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(r.type==='news'?`${r.name}｜${r.title}`:`${r.title}｜${r.name}${r.pmid?`｜PMID ${r.pmid}`:''}`)}</a></li>`).join('')}</ol></div>`;
  }

  function compactText(v='',max=170){
    const s=String(v||'').replace(/\s+/g,' ').trim();
    return s.length>max?s.slice(0,max).replace(/[，、；：,.!?！？。]+$/,'')+'…':s;
  }

  function naturalArticleSummary(t){
    let s=String(t.summary||'').replace(/\s+/g,' ').trim();

    /* These are cleanup rules only; none of this process language is inserted into article output. */
    s=s
      .replace(/近\s*24\s*小時共有\s*\d+\s*家知名媒體集中報導[^。]*。?/g,'')
      .replace(/近\s*24\s*小時[^。]*。?/g,'')
      .replace(/多家媒體標題共同出現的焦點包括[^。]*。?/g,'')
      .replace(/其他來源對同一事件的標題焦點還包括[^。]*。?/g,'')
      .replace(/這段摘要依[^。]*。?/g,'')
      .replace(/這段整理依[^。]*。?/g,'')
      .replace(/主要來源包含[^。]*。?/g,'')
      .replace(/熱門門檻[^。]*。?/g,'')
      .replace(/Google\s*News\s*RSS/ig,'')
      .replace(/\bRSS\b/ig,'')
      .replace(/系統以延伸詞條查到/ig,'')
      .replace(/\s+/g,' ')
      .trim();

    if(s.length>=32)return compactText(s,210);

    const snippets=(t.sources||[])
      .map(x=>String(x.snippet||'').replace(/\s+/g,' ').trim())
      .filter(x=>x.length>=32);
    if(snippets.length)return compactText(snippets[0],210);

    return compactText(t.title||'',160);
  }

  function sourceImageFigure(t){
    const source=(t.sources||[]).find(s=>/^https?:\/\//i.test(String(s.imageUrl||'')));
    if(!source)return '';
    const image=escapeHTML(source.imageUrl);
    const link=escapeHTML(source.url||'#');
    const credit=escapeHTML(source.imageCredit||source.name||'原始來源');
    return `<figure class="sw-source-figure"><a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${image}" alt="與本文主題相關的新聞圖片" loading="lazy" decoding="async"></a><figcaption>圖片來源：<a href="${link}" target="_blank" rel="noopener noreferrer">${credit}</a>｜原始報導</figcaption></figure>`;
  }

  function section(title,html){
    return `<h2 class="sw-section-title">${escapeHTML(title)}</h2><p>${guardrailText(html)}</p>`;
  }

  function buildDraft(t,variantOffset=0){
    const refs=buildReferences(t);
    const src=t.sources||[];
    const first=src[0]||{url:'#',name:'來源'};
    const second=src[1]||first;
    const c1=citation(1,first.url);
    const c2=citation(Math.min(2,Math.max(1,refs.length)),second.url);

    const titleRaw=compactText(t.title,66);
    const summary=naturalArticleSummary(t);
    const extensions=(t.extensionTerms?.length?t.extensionTerms:defaultExtensionSuggestions(t))
      .map(x=>compactText(x,48)).filter(Boolean).slice(0,3);
    const variant=narrativeVariant(t,variantOffset);

    const titles=[
      `${titleRaw}：真正需要看懂的是什麼？`,
      `${titleRaw}，別只停在第一個答案`,
      `${titleRaw}：從資訊到健康判斷，中間還差幾步`,
      `${titleRaw}之後，更值得問的幾個問題`
    ];
    const title=compactText(titles[variant],76);

    const openingHooks=[
      `${mark('健康與醫學資訊最容易被忽略的，往往不是答案，而是答案成立的條件。',true)}「${escapeHTML(titleRaw)}」看似是一個可以快速下結論的題目，但真正要看懂它，還得把事件本身、證據強度和適用對象分開。${c1}`,
      `${mark('一句很有力的結論，常常少了最重要的那半句：它對誰成立？',true)}「${escapeHTML(titleRaw)}」值得關注的地方，不只是結果本身，而是背後有哪些條件、限制與尚未回答的問題。${c1}${c2}`,
      `${mark('如果只記住標題，最容易漏掉的就是健康判斷真正需要的上下文。',true)}「${escapeHTML(titleRaw)}」可以從幾個層次來看：先把發生的事說清楚，再看研究或政策能支持到哪裡，最後才談它和個人有沒有關係。${c1}`,
      `${mark('同一個健康、醫學或運動議題，只要換了族群、研究設計或情境，答案就可能不一樣。',true)}「${escapeHTML(titleRaw)}」正好提醒我們，好的健康資訊不是把事情說得更肯定，而是把重要條件交代完整。${c1}`
    ];

    const eventText =
      `${escapeHTML(summary)}${c2} `+
      `${mark('先把「發生了什麼」和「代表什麼」分開，判讀會清楚很多。')}`+
      `事件本身可以是新的研究結果、政策變化、監管決定或臨床進展；它的重要性，還要看原始資料究竟回答了哪一個問題，而不是直接把消息延伸成個人的治療結論。`;

    const conditionText =
      `${mark('真正影響結論的，通常藏在適用條件裡。',true)}`+
      `研究納入的是哪些人、追蹤多久、比較的是什麼，政策又適用哪些資格，都會改變一句話可以說到多遠。`+
      `對一般讀者而言，與其先問「這是不是更好」，不如先確認自己的情況是否和資料中的族群接近。`;

    const evidenceText =
      `${mark('新聞若援引研究，文章仍應把研究結論放回原本的族群、設計與限制中理解。',true)}${c1}${c2}`+
      `公開文章只引用可追溯的新聞來源；若來源沒有足夠資訊支持某個療效、風險或因果結論，就保留不確定性，不自行補上更強的醫療主張。`+
      `${mark('題目相近不等於證據可以直接互換。')}`+
      `尤其不能把相關性寫成因果，也不能把特定族群的結果直接套用到所有人。`;

    const extensionText =
      extensions.length
      ? `${mark('把問題再往下追，會比只記住一個結論更有價值。')}`+
        `這個題目可以繼續從${escapeHTML(extensions.join('、'))}幾個方向理解。`+
        `如果後續資料出現不同結果，也應回到原始研究或官方文件，確認差異來自研究族群、方法、追蹤時間，還是真正出現了新的證據。`
      : `${mark('真正值得延伸的，是那些會改變判斷的條件。')}`+
        `包括適用族群、研究方法、療效大小、安全性與替代方案。把這些問題補齊，往往比單獨記住一個數字更接近臨床上的真實決策。`;

    const practicalText =
      `${mark('對一般人來說，重要的不是立刻採取行動，而是知道這個資訊和自己有沒有直接關係。',true)}`+
      `如果內容涉及藥物、療程或醫療器材，是否需要調整治療仍應放回個人的疾病背景、用藥、風險與醫療目標一起評估。`+
      `新聞或研究可以提供新的問題，但不應取代個別診療。`;

    const closeText =
      `把這類醫療議題看懂，其實不需要記住所有專有名詞。先確認資料在說誰、比較什麼、結果有多大，再看限制與可能風險，就已經能避開很多常見誤解。`+
      `${mark('好的健康與醫學科普，不是把話說得最滿，而是讓讀者知道一個結論能相信到哪裡。',true)}`;

    const headings=[
      ['先把事情本身說清楚','答案成立，需要哪些條件？','研究證據能告訴我們多少？','還有哪些問題值得往下追？','對一般人最實際的意義'],
      ['先看核心資訊','別漏掉適用條件','把研究放回原本的位置','再往下追三個方向','最後回到自己的情況'],
      ['這件事真正改變了什麼？','誰適用，差別很大','證據強度比標題更重要','值得繼續追的問題','怎麼把資訊用在自己身上'],
      ['先理解事件，不急著下結論','條件不同，答案也會不同','研究能支持到哪裡？','從這裡再多問一步','真正需要帶走的是什麼']
    ][variant];

    const blocks=[
      section(headings[0],eventText),
      section(headings[1],conditionText),
      section(headings[2],evidenceText),
      section(headings[3],extensionText),
      section(headings[4],practicalText)
    ];

    const orders=[
      [0,1,2,3,4],
      [0,3,1,2,4],
      [0,2,1,3,4],
      [0,1,3,2,4]
    ];

    const opening=`<p>${guardrailText(openingHooks[variant])}</p>`;
    const figure=sourceImageFigure(t);
    let body=opening;
    orders[variant].forEach((idx,pos)=>{
      body+=blocks[idx];
      if(pos===0&&figure)body+=figure;
    });
    body+=`<p>${guardrailText(closeText)}</p>`;

    let plain=countZhText(body);

    const supplements=[
      section('數字要怎麼看才不會被誤導？',
        `${mark('一個百分比如果少了基準值、追蹤時間和研究族群，很容易被理解成另一件事。')}`+
        `看到風險增加、效果提升或平均下降時，最好一起確認原本的發生率、實際差距，以及這個差距對生活或健康是否具有臨床意義。`),
      section('來源很多，就代表證據更強嗎？',
        `${mark('不同媒體同時引用同一份研究，並不等於有很多份獨立證據。')}`+
        `來源數量可以幫助我們知道議題受到關注，但醫療結論的強弱，仍取決於原始研究設計與資料品質。`)
    ];

    let si=0;
    while(plain<600&&si<supplements.length){
      body+=supplements[si++];
      plain=countZhText(body);
    }

    const refsHtml=refListHTML(refs);
    const preview=`<h1>${escapeHTML(title)}</h1>${body}${refsHtml}`;
    const imgSource=(t.sources||[]).find(s=>/^https?:\/\//i.test(String(s.imageUrl||'')))||null;
    return {
      title,
      excerpt:stripHTML(summary).slice(0,180),
      content:body+refsHtml,
      preview,
      references:refs,
      wordCount:countZhText(body),
      tags:[t.category,...(t.extensionTerms||[]).slice(0,4)],
      sources:t.sources,
      publisherName:'SignWell·欣緯生醫',
      imageSource:imgSource?{imageUrl:imgSource.imageUrl,credit:imgSource.imageCredit||imgSource.name||''}:null
    };
  }

  function bindDraftMediaFallback(){
    document.querySelectorAll('#draftPaper .sw-source-figure img').forEach(img=>{
      const drop=()=>img.closest('.sw-source-figure')?.remove();
      img.addEventListener('error',drop,{once:true});
      if(img.complete && !img.naturalWidth)drop();
    });
  }


  function enforcePublicCitedSourcesDraft(draft){
    if(!draft||typeof draft!=='object')return draft;
    const refs=(Array.isArray(draft.references)?draft.references:[]).filter(r=>r&&['news','government','literature'].includes(r.type));
    draft.references=refs;
    const allowedPmids=new Set(refs.filter(r=>r.type==='literature').map(r=>{
      const direct=String(r.pmid||'').match(/\d+/);if(direct)return direct[0];
      const m=String(r.url||'').match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i);return m?m[1]:'';
    }).filter(Boolean));
    const cleanHtml=html=>{
      if(!html)return html;
      const doc=new DOMParser().parseFromString(`<div id="sw-cited-only">${html}</div>`,'text/html');
      const root=doc.getElementById('sw-cited-only');
      root.querySelectorAll('a[href*="pubmed.ncbi.nlm.nih.gov"]').forEach(link=>{
        const m=String(link.getAttribute('href')||'').match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i),pmid=m?m[1]:'';
        if(pmid&&allowedPmids.has(pmid))return;
        const li=link.closest('li');if(li)li.remove();else link.remove();
      });
      root.querySelectorAll('li').forEach(li=>{const m=String(li.textContent||'').match(/\bPMID\s*[:：]?\s*(\d+)/i);if(m&&!allowedPmids.has(m[1]))li.remove()});
      root.querySelectorAll('sup').forEach(sup=>{if(!sup.textContent.trim()&&!sup.querySelector('a'))sup.remove()});
      return root.innerHTML;
    };
    draft.content=cleanHtml(draft.content||'');
    draft.preview=cleanHtml(draft.preview||draft.content||'');
    return draft;
  }

  async function generateDraft(t){
    const btn=$('#generateDraftBtn');
    const note=$('#aiEngineNote');
    if(!btn)return;

    const profilesRoot=await refreshDailyAiProfiles();
    const profiles=profilesRoot?.profiles||aiProfileStatusCache?.profiles||{};
    let selectedProfile=String($('#dailyAiProfileSelect')?.value||dailyAiProfile||'gpt');
    let selectedReviewer=String($('#dailyReviewerProfileSelect')?.value||dailyReviewerProfile||'gemini');
    const resumed=Boolean(recoverableAiJob?.id);
    if(resumed&&recoverableAiJob.profile)selectedProfile=recoverableAiJob.profile;
    if(resumed&&recoverableAiJob.reviewerProfile)selectedReviewer=recoverableAiJob.reviewerProfile;
    const selectedStatus=profiles[selectedProfile],reviewerStatus=profiles[selectedReviewer];
    const failover=profilesRoot?.failover||{};
    const writerFallbacks=failover.enabled?(failover.writerFallbacks||[]):[];
    const reviewerFallbacks=failover.enabled?(failover.reviewerFallbacks||[]):[];
    const writerUsable=Boolean(selectedStatus?.configured||writerFallbacks.some(x=>profiles[x]?.configured));
    const reviewerUsable=Boolean(reviewerStatus?.configured||reviewerFallbacks.some(x=>profiles[x]?.configured));
    if(!writerUsable){showToast(`${selectedStatus?.label||selectedProfile} Writer 與所有 Writer fallback 都尚未設定`);return;}
    if(!reviewerUsable){showToast(`${reviewerStatus?.label||selectedReviewer} Reviewer 與所有 Reviewer fallback 都尚未設定`);return;}

    const jobId=resumed?recoverableAiJob.id:createAiJobId();
    const variation=resumed?recoverableAiJob.variation:draftVariantCycle++;
    if(!resumed)recoverableAiJob={id:jobId,variation,profile:selectedProfile,reviewerProfile:selectedReviewer};
    btn.disabled=true;
    btn.textContent='AI 正在生成…';
    setAiState('busy','生成中');
    if(note){note.classList.remove('error','ready');note.textContent=`Writer：${selectedStatus?.label||selectedProfile} 正在生稿；Reviewer：${reviewerStatus?.label||selectedReviewer} 會逐段核對 Claim / Citation。FAIL 時只回到 Writer 修指定段落，再交 Reviewer 重驗。`}
    updateAiProgress(0,'建立 AI 生成工作',4);
    startAiJobPolling(jobId);

    try{
      if(!window.parent?.signwellMedicalNewsGenerateAIArticle){
        throw new Error('目前 CMS 尚未載入 AI Writer bridge。');
      }

      const result=await window.parent.signwellMedicalNewsGenerateAIArticle(
        t,
        {variation,jobId,aiProfile:selectedProfile,reviewerProfile:selectedReviewer,writerFallbackProfiles,reviewerFallbackProfiles,failoverEnabled:failover.enabled!==false}
      );

      if(result?.aiConfigured===false){
        aiWriterStatusCache=null;
        const missing=Array.isArray(result.missing)?result.missing.join('、'):'AI 後端設定';
        toggleAiSetup(true);
        throw new Error(`AI Writer 尚未設定：${missing}`);
      }
      if(result?.pending){
        throw new Error('同一個 AI 工作仍在後端執行；系統沒有重複送出，請稍後再試。');
      }
      if(!result?.ok||!result?.article){
        throw new Error(result?.error||'AI Writer 沒有產生可用文章');
      }

      recoverableAiJob=null;
      currentDraft=enforcePublicCitedSourcesDraft(result.article);
      $('#draftPaper').innerHTML=currentDraft.preview;
      bindDraftMediaFallback();
      $('#reviewStrip').classList.add('show');
      $('#draftWrap').classList.add('show');

      const audit=result.audit||currentDraft.audit||{};
      const verified=Number(audit.verifiedLiteratureCount||0);
      const topicScore=Number(audit.topicFitScore||0);
      const claimTotal=Number(audit.claimParagraphCount||0);
      const claimPass=Number(audit.claimPassCount||0);
      const claimWarn=Number(audit.claimWarnCount||0);
      const publicNewsRefs=(currentDraft.references||[]).filter(r=>r?.type==='news').length;
      $('#draftMeta').textContent=
        `${currentDraft.wordCount} 字 · `+
        `${currentDraft.sources?.length||0} 個新聞來源 · `+
        `${verified} 篇 PubMed 候選 · `+
        `${publicNewsRefs} 則公開新聞引用 · 主張－證據審查通過${result.recovered?' · 已從後端工作復原':''}`;

      const auditCard=$('#claimAuditCard');
      if(auditCard){
        const drift=Number(audit.citationDriftCount||0);
        const transfer=Number(audit.contextTransferCount||0);
        const causal=Number(audit.causalOverreachCount||0);
        const numeric=Number(audit.numericMismatchCount||0);
        const warnings=Array.isArray(audit.claimWarnings)?audit.claimWarnings:[];
        auditCard.hidden=false;
        const rounds=Number(audit.claimRepairRounds||0);
        const safe=Boolean(audit.safeVersionApplied);
        const removed=Number(audit.removedClaimCount||0);
        const safeRewrite=Number(audit.safeRewriteApplied||0);
        const locked=Number(audit.lockedClaimCount||claimPass+claimWarn);
        const claimMapCount=Number(audit.claimMapCount||0);
        const repairLog=Array.isArray(audit.claimRepairLog)?audit.claimRepairLog:[];
        const logHtml=repairLog.length?`<div class="claim-repair-log">${repairLog.slice(0,6).map((x,i)=>{
          const mode=String(x?.mode||'targeted');
          const label=mode==='downgrade'?'弱化主張':mode==='safe'?'安全版本':mode==='safe_rewrite'?'審查員安全改寫':mode==='remove_unsupported'?'移除無法支持主張':'局部修復';
          const targets=Array.isArray(x?.targets)?x.targets.length:Number(x?.targets||0);
          const codes=Array.isArray(x?.errorCodes)&&x.errorCodes.length?` · ${x.errorCodes.slice(0,2).map(escapeHTML).join(' / ')}`:'';
          return `<div class="claim-repair-step"><strong>${escapeHTML(label)}</strong><em>${targets?`處理 ${targets} 個`:''}${x?.locked?` · 鎖定 ${Number(x.locked)} 個`:''}${codes}</em></div>`;
        }).join('')}</div>`:'';
        auditCard.innerHTML=`<div class="claim-audit-head"><div><span>主張－證據審查</span><strong>Claim-level 檢核通過${rounds?` · ${rounds} 輪局部修復`:''}</strong></div><b>${topicScore||'—'}/100</b></div><div class="claim-audit-grid"><span>直接支持 <strong>${claimPass}/${claimTotal}</strong></span><span>已鎖定 <strong>${locked}</strong></span><span>保守警示 <strong>${claimWarn}</strong></span><span>引用偏移 <strong>${drift}</strong></span><span>情境外推 <strong>${transfer}</strong></span><span>數字不一致 <strong>${numeric}</strong></span></div><p>${topicScore?`主題吻合度 ${topicScore}/100 · `:''}先建立 ${claimMapCount||'—'} 個候選 Claim，再逐段審查。PASS／WARN 段落一旦通過就鎖定，不會在下一輪被重寫；只有 FAIL 段落會局部修復。同一主張重複失敗時會先弱化，必要時進 Safe Publish Gate。${safe?` <span class="claim-safe-badge">安全版本已啟用</span>`:''}${safeRewrite?` · 安全改寫 ${safeRewrite} 個`:''}${removed?` · 移除 ${removed} 個 unsupported claim`:''}${warnings.length?' · 有 '+warnings.length+' 個保守語氣警示':''}</p>${logHtml}`;
      }

      if(note){
        const evidenceWarning=Array.isArray(audit.evidenceWarnings)&&audit.evidenceWarnings.length?` · ${audit.evidenceWarnings[0]}`:'';
        note.textContent=
          `主張－證據審查通過 · PubMed metadata + abstract 已逐篇核驗；只有實際引用者會公開 · `+
          `公開文章只保留新聞引用；已採 Claim-level 鎖定修復${audit.claimRepairApplied?' · 只修改 FAIL 主張':''}${audit.claimRepairRounds?` · ${audit.claimRepairRounds} 輪局部修復`:''}${audit.safeVersionApplied?' · 已使用安全版本':''}${audit.removedClaimCount?` · 移除 ${audit.removedClaimCount} 個 unsupported claim`:''}${audit.formattingAppliedAfterGeneration?' · 排版於檢核後套用':''}${result.recovered?' · 本次結果由後端工作快取復原':''}${evidenceWarning}`;
        note.classList.remove('error');note.classList.add('ready');
      }

      $('#copyDraftBtn').onclick=()=>copyDraft(currentDraft);
      $('#toEditorBtn').onclick=()=>sendArticle('editor');
      $('#publishDraftBtn').onclick=()=>sendArticle('publish');
      btn.textContent='重新生成另一種敘事';
      setAiState('ready','已完成');
      finishAiProgress(true);
    }catch(err){
      const msg=String(err?.message||err);
      if(/仍在後端處理中|沒有重複送出|稍後再按一次|逾時/i.test(msg)){
        recoverableAiJob={id:jobId,variation};
      }else{
        recoverableAiJob=null;
      }
      showToast(msg);
      if(note){note.textContent=msg;note.classList.remove('ready');note.classList.add('error')}
      btn.textContent=recoverableAiJob?'檢查 / 復原生成結果':(currentDraft?'重新生成另一種敘事':'AI 一鍵生成範文');
      setAiState('','生成失敗');
      finishAiProgress(false);
    }finally{
      stopAiJobPolling();
      btn.disabled=false;
    }
  }

  async function copyDraft(d){
    const plain=`${d.title}\n\n${stripHTML(d.content).replace(/參考資料/g,'\n\n參考資料\n')}`;
    const rich=`<h1>${escapeHTML(d.title)}</h1>${d.content}`;
    try{
      if(window.ClipboardItem&&navigator.clipboard?.write){
        await navigator.clipboard.write([new ClipboardItem({
          'text/plain':new Blob([plain],{type:'text/plain'}),
          'text/html':new Blob([rich],{type:'text/html'})
        })]);
      }else{
        await navigator.clipboard.writeText(plain);
      }
    }catch{await copyText(plain);return}
    showToast('範文已複製');
  }

  async function sendArticle(mode){
    if(!currentDraft||!currentTopic)return;
    if(!window.parent||window.parent===window||typeof window.parent.signwellMedicalNewsCreateArticle!=='function'){showToast('請由 SIGN WELL CMS 操作');return}
    const btn=mode==='publish'?$('#publishDraftBtn'):$('#toEditorBtn');
    const old=btn.textContent;let keepPublishedLock=false;btn.disabled=true;btn.textContent=mode==='publish'?'正在發布…':'正在帶入…';
    try{
      const res=await window.parent.signwellMedicalNewsCreateArticle({title:currentDraft.title,excerpt:currentDraft.excerpt,content:currentDraft.content,references:currentDraft.references,tags:currentDraft.tags,audit:currentDraft.audit||null,topicId:currentTopic.id,sources:currentTopic.sources},mode);
      if(res?.cancelled){btn.disabled=false;btn.textContent=old;return}
      if(res?.ok&&mode==='publish'){
        keepPublishedLock=true;
        btn.textContent=res?.alreadyPublished?'已發布 · 已阻擋重複送出':'已發布 ✓';
        const n=res.notification||{};
        if(n.enabled===false)showToast('已發布 · 自動訂閱通知目前關閉');
        else if(n.skipped)showToast('已發布 · 目前沒有可寄送訂閱者');
        else if(n.alreadySent)showToast('已發布 · 此文章通知先前已寄送');
        else if(n.success)showToast(`已發布並通知 ${Number(n.delivered||0).toLocaleString()} 位訂閱者`);
        else showToast('已發布 · 訂閱通知未完成');
      }
      else if(res?.needsGithub)showToast('已保留草稿 · 請先解鎖 GitHub Token');
    }catch(err){showToast('操作失敗：'+String(err?.message||err))}
    finally{if(document.body.contains(btn)&&!keepPublishedLock){btn.disabled=false;btn.textContent=old}}
  }

  async function copyText(text){try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}showToast('已複製')}
  let toastTimer;function showToast(msg){clearTimeout(toastTimer);toast.textContent=msg;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}

  scanBtn.onclick=()=>scan(false);
  settingsToggleBtn?.addEventListener('click',()=>{toggleFocusSettings();if(focusSettingsPanel?.classList.contains('show'))refreshFocusSettings({open:true})});
  $('#focusOpenSettingsBtn')?.addEventListener('click',()=>window.parent?.signwellCmsOpenSettings?.());
  $('#focusAiInstructionSaveBtn')?.addEventListener('click',saveFocusInstructions);
  $('#focusAiInstructionClearBtn')?.addEventListener('click',clearFocusInstructions);
  $('#focusAiInstructionOpenBtn')?.addEventListener('click',()=>window.parent?.signwellCmsOpenAIInstructions?.());
  window.addEventListener('message',e=>{if(e?.data?.type==='openFocusSettings'){showScreen(listScreen);toggleFocusSettings(true);refreshFocusSettings({open:true});}});

  refreshBtn.onclick=()=>{workspacePayload=null;toggleFocusSettings(false);showScreen(homeScreen);setTimeout(()=>scan(true),180)};
  backBtn.onclick=()=>showScreen(listScreen);
  window.addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data?.type==='SIGNWELL_MEDICAL_WORKSPACE_READY'&&!workspacePayload)preloadWorkspace()});
  preloadWorkspace();

  document.addEventListener('visibilitychange',()=>{
    document.body.classList.toggle('sw-page-hidden',document.hidden);
  },{passive:true});

})();
