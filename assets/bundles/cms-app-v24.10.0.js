
(()=>{'use strict';
window.SignWellErrors?.installGlobal?.({surface:'CMS',module:'cms-runtime',homeUrl:'index.html'});
function swShowOperationalError(err,context={}){return window.SignWellErrors?.show?.(err,{surface:'CMS',homeUrl:'index.html',...context});}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const KEY='signwell-cms-data-v1',ACTKEY='signwell-cms-last-active';const DEFAULT_SITE_TEXT={"siteTitle":"SIGN WELL · 欣緯生醫","metaDescription":"SIGN WELL · 欣緯生醫 — 臨床筆記、醫學推理與值得留下的知識。","brandEnglish":"SIGN WELL","brandChinese":"欣緯生醫","navArticles":"文章","navTopics":"主題","navAbout":"關於我們","heroEyebrow":"SIGN WELL BIOMED · 欣緯生醫","heroTitleLine1":"把臨床問題，","heroTitleLine2":"寫成值得留下的答案。","heroSubtitle":"臨床筆記、醫學推理、醫療科技與自費醫療觀察。不是追求資訊最多，而是把真正值得記住的框架整理清楚。","heroCardTitle":"醫學筆記、臨床推理，與值得留下的知識。","heroCardBody":"以閱讀品質為核心的個人醫學出版空間。從床邊問題出發，保留推理脈絡與可回顧的知識。","heroCardTiny":"獨立醫學筆記","featuredEyebrow":"編輯精選","featuredTitle":"精選臨床筆記","topicsEyebrow":"知識地圖","topicsTitle":"主題分類","topicsDescription":"依臨床領域瀏覽","recentEyebrow":"最近整理","recentTitle":"最新文章","publishedCountSuffix":"篇已發布筆記","articleCountSuffix":"篇文章","minutesReadSuffix":"分鐘閱讀","articleBrand":"SIGN WELL · 欣緯生醫","updatedLabel":"更新","shareLabel":"分享","copyLinkLabel":"複製連結","tocTitle":"本頁內容","aboutEyebrow":"關於 SIGN WELL","aboutTitle":"欣緯生醫","aboutBody":"一個以臨床推理、醫學教育與自費醫療觀察為核心的個人出版空間。網站內容希望保留「為什麼」而不只留下答案，讓每篇筆記都能在下一次遇到病人或問題時真正派上用場。","aboutFocusLabel":"核心","aboutFocusValue":"臨床推理","aboutFormatLabel":"形式","aboutFormatValue":"筆記 · 深度整理","aboutPrincipleLabel":"原則","aboutPrincipleValue":"清楚勝過複雜","aboutDisclaimer":"本站不提供醫療服務、不招攬醫療業務；內容僅供醫學教育與資訊整理，不構成個別醫療建議，也不能取代正式臨床評估。","aboutManifestoTitle":"把複雜的醫學，整理成真正能被理解與使用的知識。","aboutManifestoBody":"我們重視推理、脈絡與長期可回顧性，而不只是快速堆疊資訊。","aboutPeopleEyebrow":"PEOPLE","aboutPeopleTitle":"我們是誰","aboutPeopleSubtitle":"以不同背景與專長，共同整理值得留下的醫學與健康知識。","footerTagline":"臨床筆記、醫學推理，以及值得留下的知識。","footerDisclaimer":"本站不提供醫療服務、不招攬醫療業務；內容僅供醫學教育與資訊整理，不構成個別醫療建議。","searchPlaceholder":"搜尋文章、主題、關鍵字…","emptyCategory":"目前沒有這個分類的文章。","notFoundTitle":"找不到文章","notFoundBody":"這篇文章可能尚未發布或網址已改變。","homeEyebrow":"SIGN WELL BIOMED · 欣緯生醫","homeTitle1":"從臨床出發，","homeTitle2":"把值得留下的醫學寫清楚。","homeSubtitle":"以臨床推理、醫學教育與自費醫療觀察為核心的知識平台。從一個問題開始，整理成下一次真正用得上的答案。","homeCardTitle":"醫學不只是答案，而是理解答案從哪裡來。","homeCardBody":"把床邊問題、閱讀與思考整理成可回顧的知識，讓資訊回到臨床情境。","dailyEyebrow":"每日更新","dailyTitle":"每日新文章","dailyDescription":"最新整理與近期發布","topicsSubtitle":"依領域整理文章、臨床問題與延伸閱讀。","shareEyebrow":"分享我們","shareTitle":"把 SIGN WELL 分享給需要的人。","shareSubtitle":"複製網站連結，或使用 QR Code 讓另一台裝置快速開啟。"};let data={articles:[],topics:[],people:[],glossary:[],siteText:{...DEFAULT_SITE_TEXT}},dataReady=Promise.resolve(),currentId=null,pendingNewArticle=null,viewName='dashboard',deleteId=null,saveTimer=null,swGlossaryIdleTimer=null,authStage=1,pendingPin='',authSecret='',authFailCount={1:0,2:0},cmsSessionToken='',authChallenge='',cmsAuthConfigured=false,cmsAuthClientId='',cmsAuthNeedsPolicyUpgrade=false,cmsPasskeyConfigured=false,cmsPasskeyAuthUrl='',cmsPasskeyBusy=false;
const clone=x=>JSON.parse(JSON.stringify(x));
const CMS_PUBLISHED_RECEIPT_KEY='signwell-cms-published-receipts-v1';
function cmsPublishedReceipts(){
  try{const raw=JSON.parse(localStorage.getItem(CMS_PUBLISHED_RECEIPT_KEY)||'{}');return raw&&typeof raw==='object'?raw:{}}catch(_){return {}}
}
function markArticlePublishedReceipt(article){
  if(!article?.id)return;
  const receipts=cmsPublishedReceipts();
  receipts[String(article.id)]={at:new Date().toISOString(),slug:String(article.slug||''),title:String(article.title||'')};
  try{localStorage.setItem(CMS_PUBLISHED_RECEIPT_KEY,JSON.stringify(receipts))}catch(_){}
  article.status='Published';
  article.publishedOnline=true;
  article.lastPublishedAt=receipts[String(article.id)].at;
  if(article.sourceWorkspace&&typeof article.sourceWorkspace==='object')article.sourceWorkspace.publishedOnline=true;
}
function clearArticlePublishedReceipt(article){
  if(!article?.id)return;
  const receipts=cmsPublishedReceipts();
  delete receipts[String(article.id)];
  try{localStorage.setItem(CMS_PUBLISHED_RECEIPT_KEY,JSON.stringify(receipts))}catch(_){}
}
function articleHasPublishedReceipt(article){
  if(!article)return false;
  if(article.status==='Published'||article.publishedOnline===true||article.sourceWorkspace?.publishedOnline===true)return true;
  return Boolean(article.id&&cmsPublishedReceipts()[String(article.id)]);
}
function reconcilePublishedReceipts(){
  let changed=false;
  (data.articles||[]).forEach(article=>{
    if(articleHasPublishedReceipt(article)&&article.status!=='Published'){
      article.status='Published';article.publishedOnline=true;
      if(article.sourceWorkspace&&typeof article.sourceWorkspace==='object')article.sourceWorkspace.publishedOnline=true;
      changed=true;
    }
  });
  return changed;
}
function medicalNewsPublicationKey(payload={}){
  const topic=String(payload.topicId||payload?.sourceWorkspace?.topicId||'').trim();
  const title=String(payload.title||'').trim();
  return `${topic}::${slugify(title)}`;
}
function findPublishedMedicalNewsMatch(article){
  const key=String(article?.sourceWorkspace?.publicationKey||'');
  const topicId=String(article?.sourceWorkspace?.topicId||'');
  const title=String(article?.title||'').trim();
  return (data.articles||[]).find(x=>articleHasPublishedReceipt(x)&&(
    (key&&String(x?.sourceWorkspace?.publicationKey||'')===key) ||
    (topicId&&String(x?.sourceWorkspace?.topicId||'')===topicId&&String(x.title||'').trim()===title)
  ))||null;
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function playOpeningWelcome(){
  const splash=$('#cmsOpening'),word=$('#openingWord');
  if(!splash||!word)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){
    splash.remove();return;
  }
  const words=['哈囉','Hello'];
  for(let i=0;i<words.length;i++){
    word.classList.remove('show');
    await sleep(i===0?80:90);
    word.textContent=words[i];
    word.classList.add('show');
    await sleep(430);
    if(i<words.length-1){
      word.classList.remove('show');
      await sleep(120);
    }
  }
  await sleep(80);
  splash.classList.add('out');
  setTimeout(()=>splash.remove(),420);
}

async function playLoginGreeting(){
  const wrap=$('#loginGreeting'),word=$('#loginGreetingWord');
  if(!wrap||!word)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const words=['你好，主人','Hello, Master'];
  wrap.classList.add('show');

  word.classList.remove('show');
  await sleep(90);
  word.textContent=words[0];
  word.classList.add('show');
  await sleep(520);

  word.classList.remove('show');
  await sleep(150);
  word.textContent=words[1];
  word.classList.add('show');
  await sleep(590);

  word.classList.remove('show');
  await sleep(170);
  wrap.classList.remove('show');
}

function showConfetti(sourceEl=null){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const layer=$('#confettiLayer');
  if(!layer)return;

  const coarse=matchMedia('(pointer:coarse)').matches;
  const count=coarse?42:64;
  const palette=['#79bdf0','#a8d8ff','#91d7c8','#f1cf79','#e9a8c8','#ffffff'];
  const rect=sourceEl?.getBoundingClientRect?.();
  const ox=rect?rect.left+rect.width/2:innerWidth/2;
  const oy=rect?rect.top+rect.height/2:Math.min(innerHeight*.58,innerHeight-120);

  const frag=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const p=document.createElement('i');
    p.className='confetti-piece';
    const a=(Math.PI*2)*(i/count)+(Math.random()-.5)*.16;
    const speed=(coarse?90:110)+Math.random()*(coarse?140:190);
    const dx=Math.cos(a)*speed;
    const dy=Math.sin(a)*speed + (Math.random()*110-40);
    const w=5+Math.random()*6;
    const h=7+Math.random()*10;
    p.style.setProperty('--x',ox+'px');
    p.style.setProperty('--y',oy+'px');
    p.style.setProperty('--dx',dx.toFixed(1)+'px');
    p.style.setProperty('--dy',dy.toFixed(1)+'px');
    p.style.setProperty('--rot',(180+Math.random()*720).toFixed(0)+'deg');
    p.style.setProperty('--w',w.toFixed(1)+'px');
    p.style.setProperty('--h',h.toFixed(1)+'px');
    p.style.setProperty('--r',Math.random()>.72?'50%':'2px');
    p.style.setProperty('--c',palette[i%palette.length]);
    p.style.setProperty('--dur',(0.95+Math.random()*.55).toFixed(2)+'s');
    p.style.setProperty('--delay',(Math.random()*.08).toFixed(2)+'s');
    frag.appendChild(p);
  }
  layer.appendChild(frag);
  try{navigator.vibrate?.([18,24,12])}catch(_){}
  setTimeout(()=>layer.replaceChildren(),1750);
}


function showLoginSyncOverlay(){
  const el=$('#loginSyncOverlay');
  if(!el)return;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  el.setAttribute('aria-hidden','false');
}

function hideLoginSyncOverlay(){
  const el=$('#loginSyncOverlay');
  if(!el)return;
  el.classList.remove('show');
  el.setAttribute('aria-hidden','true');
}

async function playLoginSuccessSequence(){
  /* Confetti first, then the short bilingual welcome. */
  showConfetti();
  await sleep(280);
  await playLoginGreeting();
}

function hashPin(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
const V10_DB='signwell-cms-v10',V10_STORE='state',V10_STATE_KEY='cms-state';
function openV10DB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}const req=indexedDB.open(V10_DB,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(V10_STORE))db.createObjectStore(V10_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB open failed'))})}
async function idbGetState(){const db=await openV10DB();return new Promise((resolve,reject)=>{const tx=db.transaction(V10_STORE,'readonly'),req=tx.objectStore(V10_STORE).get(V10_STATE_KEY);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()})}
async function idbPutState(value){const db=await openV10DB();return new Promise((resolve,reject)=>{const tx=db.transaction(V10_STORE,'readwrite');tx.objectStore(V10_STORE).put(value,V10_STATE_KEY);tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}})}
function normalizeState(v){
  const x=v&&typeof v==='object'?v:{};
  const articles=Array.isArray(x.articles)?x.articles:[];
  let topics=Array.isArray(x.topics)?x.topics.filter(Boolean):[];
  if(!topics.length){
    const names=[...new Set(articles.map(a=>a.category).filter(Boolean))];
    topics=names.map((name,i)=>({
      id:'topic-'+Date.now()+'-'+i,
      name,
      slug:slugify(name),
      description:'瀏覽 '+name+' 相關文章與延伸整理。',
      order:i,
      active:true
    }));
  }
  const people=(Array.isArray(x.people)?x.people:[])
    .filter(Boolean)
    .map((p,i)=>({
      id:String(p.id||('person-'+i+'-'+Date.now())),
      name:String(p.name||''),
      role:String(p.role||''),
      bio:String(p.bio||''),
      photo:String(p.photo||''),
      expertise:Array.isArray(p.expertise)?p.expertise.map(String).filter(Boolean):[],
      education:Array.isArray(p.education)?p.education.map(String).filter(Boolean):[],
      experience:Array.isArray(p.experience)?p.experience.map(String).filter(Boolean):[],
      order:Number.isFinite(Number(p.order))?Number(p.order):i,
      active:p.active!==false
    }));
  const glossary=(Array.isArray(x.glossary)?x.glossary:[])
    .filter(Boolean)
    .map((g,i)=>({
      id:String(g.id||('term-'+i+'-'+Date.now())),
      term:String(g.term||'').normalize('NFKC').trim(),
      translation:String(g.translation||'').normalize('NFKC').trim(),
      definition:String(g.definition||'').normalize('NFKC').trim(),
      aliases:Array.isArray(g.aliases)?g.aliases.map(v=>String(v||'').normalize('NFKC').trim()).filter(Boolean):[],
      active:g.active!==false,
      source:String(g.source||'ai'),
      createdAt:String(g.createdAt||''),
      updatedAt:String(g.updatedAt||''),
      articleIds:Array.isArray(g.articleIds)?g.articleIds.map(String).filter(Boolean):[]
    }))
    .filter(g=>g.term&&g.definition);
  return {
    articles,
    topics,
    people,
    glossary,
    siteText:{...DEFAULT_SITE_TEXT,...(x.siteText&&typeof x.siteText==='object'?x.siteText:{})}
  };
}
function load(){dataReady=(async()=>{let saved=null;try{saved=await idbGetState()}catch(_){}if(!saved){try{const legacy=localStorage.getItem(KEY);if(legacy)saved=JSON.parse(legacy)}catch(_){} }data=normalizeState(saved||{articles:clone(window.BLOG_ARTICLES||[]),topics:[],people:[],glossary:[],siteText:clone(DEFAULT_SITE_TEXT)});reconcilePublishedReceipts();try{await idbPutState(clone(data));localStorage.removeItem(KEY)}catch(_){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(__){}}return data})();return dataReady}
function persist(silent=false){const snapshot=clone(data);try{localStorage.setItem(ACTKEY,String(Date.now()))}catch(_){}idbPutState(snapshot).then(()=>{try{localStorage.removeItem(KEY)}catch(_){};if(!silent&&$('#saveState')){$('#saveState').textContent='已儲存 ✓';$('#saveState').style.color='#6f8f86'}}).catch(()=>{try{localStorage.setItem(KEY,JSON.stringify(snapshot));if(!silent&&$('#saveState')){$('#saveState').textContent='已儲存（相容模式）';$('#saveState').style.color='#9a7b45'}}catch(_){if($('#saveState')){$('#saveState').textContent='本機儲存空間不足';$('#saveState').style.color='#a65c65'}}});if(!cmsCloudApplying)scheduleCmsCloudPush();}
function showToast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>el.classList.remove('show'),1700)}
function slugify(s){return String(s||'').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,80)||('article-'+Date.now())}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function inlineMD(s){return escapeHTML(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function markdown(md=''){const lines=md.replace(/\r/g,'').split('\n');let out='',list=null;const close=()=>{if(list){out+=`</${list}>`;list=null}};for(let i=0;i<lines.length;i++){const line=lines[i].trim();if(!line){close();continue}const c=line.match(/^> \[!(PEARL|KEY|WARNING)\]/i);if(c){close();const kind=c[1].toLowerCase(),next=(lines[++i]||'').replace(/^>\s?/,'');out+=`<div class="callout"><b>${kind==='pearl'?'Clinical Pearl':kind==='key'?'Key Point':'Warning'}</b><p>${inlineMD(next)}</p></div>`;continue}if(/^###\s+/.test(line)){close();out+=`<h3>${inlineMD(line.replace(/^###\s+/,''))}</h3>`;continue}if(/^##\s+/.test(line)){close();out+=`<h2>${inlineMD(line.replace(/^##\s+/,''))}</h2>`;continue}const ol=line.match(/^\d+\.\s+(.+)/);if(ol){if(list!=='ol'){close();list='ol';out+='<ol>'}out+=`<li>${inlineMD(ol[1])}</li>`;continue}const ul=line.match(/^[-*]\s+(.+)/);if(ul){if(list!=='ul'){close();list='ul';out+='<ul>'}out+=`<li>${inlineMD(ul[1])}</li>`;continue}close();out+=`<p>${inlineMD(line)}</p>`}close();return out}
function clearAuthError(){const box=$('#authError');box?.classList.remove('show');$('#pinInput')?.classList.remove('invalid');$('#answerInput')?.classList.remove('invalid');$('#lockScreen .lock-card')?.classList.remove('auth-fail')}
function showAuthError(stage,message){authFailCount[stage]=(authFailCount[stage]||0)+1;const input=stage===1?$('#pinInput'):$('#answerInput'),box=$('#authError');$('#authErrorTitle').textContent=stage===1?'管理密碼不正確':'安全問題答案不正確';$('#authErrorText').textContent=message+(authFailCount[stage]>1?` · 本次已失敗 ${authFailCount[stage]} 次`:'');box?.classList.add('show');input?.classList.add('invalid');const card=$('#lockScreen .lock-card');card?.classList.remove('auth-fail');void card?.offsetWidth;card?.classList.add('auth-fail');try{navigator.vibrate?.(35)}catch(_){};setTimeout(()=>input?.classList.remove('invalid'),650);input?.select()}
function cmsAuthClientIdValue(){
  if(cmsAuthClientId)return cmsAuthClientId;
  const key='signwell-cms-auth-client-v1';
  try{cmsAuthClientId=localStorage.getItem(key)||''}catch(_){}
  if(!cmsAuthClientId){
    try{cmsAuthClientId=crypto.randomUUID()}catch(_){cmsAuthClientId='cms-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
    try{localStorage.setItem(key,cmsAuthClientId)}catch(_){}
  }
  return cmsAuthClientId;
}
function showCmsAuthSetup(show=true){
  $('#authSetup')?.classList.toggle('hidden',!show);
  $('#authStep1')?.classList.toggle('hidden',show);
  $('#authStep2')?.classList.add('hidden');
  $('#authProgress')?.classList.toggle('hidden',show);
  if(show){
    clearAuthError();
    $('#lockHint').textContent='首次升級：先建立只存在伺服器端的登入憑證。';
    setTimeout(()=>$('#authBootstrapKey')?.focus(),60);
  }
}
function swKeepCaretAfterFilter(el,filter){
  if(!el)return;
  const start=el.selectionStart??String(el.value||'').length;
  const before=String(el.value||'');
  const next=filter(before);
  if(next===before)return;
  el.value=next;
  const removed=before.slice(0,start).length-filter(before.slice(0,start)).length;
  const pos=Math.max(0,start-removed);
  try{el.setSelectionRange(pos,pos)}catch(_){}
}
function swBindCmsInputPolicies(){
  const digits=v=>String(v||'').replace(/\D+/g,'');
  ['pinInput','authSetupPassword','newsletterStepupPassword'].forEach(id=>{
    const el=$('#'+id);if(!el||el.dataset.swPolicyBound)return;el.dataset.swPolicyBound='1';
    el.inputMode='numeric';el.pattern='[0-9]*';el.addEventListener('input',()=>swKeepCaretAfterFilter(el,digits));
  });
  ['answerInput','authSetupAnswer1','authSetupQuestion1'].forEach(id=>{
    const el=$('#'+id);if(!el||el.dataset.swPolicyBound)return;el.dataset.swPolicyBound='1';
    el.lang='zh-Hant';el.inputMode='text';
  });
}

function swPasskeyCanOffer(){
  return Boolean(cmsPasskeyConfigured&&cmsPasskeyAuthUrl&&window.SignWellAuth?.passkeySupported?.()&&window.SignWellAuth?.rpOriginEligible?.());
}
function swShowLegacyLogin(reason=''){
  $('#passkeyLoginPanel')?.setAttribute('hidden','');
  $('#legacyLoginPanel')?.removeAttribute('hidden');
  if(reason)$('#lockHint').textContent=reason;
  setTimeout(()=>$('#pinInput')?.focus(),60);
}
function swRefreshPasskeyLoginMode(){
  if(swPasskeyCanOffer()){
    $('#passkeyLoginPanel')?.removeAttribute('hidden');
    $('#legacyLoginPanel')?.setAttribute('hidden','');
    $('#lockHint').textContent='Passkey 已啟用；也可隨時改用原本的管理密碼＋安全問題。';
  }else{
    const originBlocked=cmsPasskeyConfigured&&window.SignWellAuth?.passkeySupported?.()&&!window.SignWellAuth?.rpOriginEligible?.();
    swShowLegacyLogin(originBlocked?'此頁面不是指定的 GitHub CMS Origin，Passkey 已停用；請從 GitHub CMS 網址開啟。':'');
  }
}
function swPasskeyErrorMessage(result){
  const reason=String(result?.reason||'');
  if(reason==='cancelled')return 'Passkey 驗證已取消，仍可使用管理密碼登入。';
  if(reason==='not_registered')return '目前沒有可用的 SIGN WELL Passkey，請先用傳統登入後到「設定」新增。';
  if(reason==='origin')return '目前網域不符合 Passkey RP ID，請從 980510linz.github.io 的 CMS 頁面開啟。';
  if(reason==='unsupported')return '此瀏覽器或裝置不支援 Passkey，請使用傳統登入。';
  if(reason==='not_configured')return 'Passkey 驗證服務尚未設定完成。';
  return 'Passkey 驗證未完成，請重試或改用管理密碼。';
}
async function swPasskeyLogin(){
  if(cmsPasskeyBusy)return;
  const btn=$('#passkeyLoginBtn');
  cmsPasskeyBusy=true;if(btn){btn.disabled=true;btn.innerHTML='<span class="passkey-glyph">⌁</span>正在等待裝置驗證…'}
  clearAuthError();
  try{
    const result=await window.SignWellAuth.loginWithPasskey();
    if(!result?.ok||!result?.appScriptProof){swShowLegacyLogin(swPasskeyErrorMessage(result));return}
    const exchanged=await signwellGasBridge('cms.auth.passkeyExchange',{proof:result.appScriptProof,clientId:cmsAuthClientIdValue()},{timeoutMs:25000});
    if(!exchanged?.sessionToken)throw new Error('未取得 CMS 工作階段');
    cmsSessionToken=String(exchanged.sessionToken||'');authFailCount[1]=0;authFailCount[2]=0;
    await completeCmsLogin('passkey');
  }catch(err){
    swShowLegacyLogin('Passkey 登入失敗：'+String(err?.message||err||'請改用管理密碼'));
  }finally{
    cmsPasskeyBusy=false;if(btn){btn.disabled=false;btn.innerHTML='<span class="passkey-glyph">⌁</span>使用 Face ID / Touch ID / Passkey'}
  }
}

async function initCmsServerAuth(){
  cmsAuthClientIdValue();
  try{
    const s=await signwellGasBridge('cms.auth.status',{clientId:cmsAuthClientId},{timeoutMs:18000});
    cmsAuthConfigured=Boolean(s&&s.configured);
    cmsAuthNeedsPolicyUpgrade=Boolean(s&&(s.requiresInputPolicyUpgrade||s.requiresQuestionUpgrade));
    cmsPasskeyConfigured=Boolean(s?.passkey?.configured);
    cmsPasskeyAuthUrl=String(s?.passkey?.authUrl||'');
    try{window.SignWellAuth?.configure({authBase:cmsPasskeyAuthUrl})}catch(_){}
    if(!cmsAuthConfigured||cmsAuthNeedsPolicyUpgrade){
      showCmsAuthSetup(true);
      if(cmsAuthNeedsPolicyUpgrade)$('#lockHint').textContent='安全規則已升級：請用 SW_ADMIN_KEY 重設為純數字管理密碼，並建立 1 題可使用中文的安全問題。';
      else if(s&&s.requiresQuestionUpgrade)$('#lockHint').textContent='需要升級：請重新建立管理密碼與 1 題安全問題。';
      return
    }
    showCmsAuthSetup(false);
    setAuthStage(1);
    swRefreshPasskeyLoginMode();
    $('#lockHint').textContent=cmsPasskeyConfigured?'可使用 Passkey，或改用原本的伺服器端管理密碼登入。':'登入驗證由 Google Apps Script 執行；真正密碼不會下載到這個 HTML。';
  }catch(err){
    cmsAuthConfigured=false;cmsPasskeyConfigured=false;cmsPasskeyAuthUrl='';
    showCmsAuthSetup(false);
    setAuthStage(1);
    const detail=String(err?.message||err||'').trim();
    $('#lockHint').textContent=detail.includes('Backend 版本不相容')
      ? detail
      : '伺服器驗證服務目前無法連線；請確認 Apps Script Web App 已部署最新版本。'+(detail?'（'+detail+'）':'')+' 目前 CMS Origin：'+location.origin;
  }
}
async function configureCmsServerAuth(){
  clearAuthError();
  const btn=$('#authSetupBtn');
  const bootstrapKey=String($('#authBootstrapKey')?.value||'').trim();
  const password=String($('#authSetupPassword')?.value||'');
  const question=String($('#authSetupQuestion1')?.value||'').trim();
  const answer=String($('#authSetupAnswer1')?.value||'').trim();
  const questions=[{question,answer}];
  const numericPassword=/^\d{6,64}$/.test(password);
  const validQA=Boolean(question&&answer&&question.length<=120&&answer.length<=80);
  if(!bootstrapKey||!numericPassword||!validQA){
    $('#authErrorTitle').textContent='設定格式不正確';
    $('#authErrorText').textContent='管理密碼只能使用 6–64 位數字；請完整設定 1 題安全問題與答案，中文或英文皆可。';
    $('#authError').classList.add('show');
    return;
  }
  btn.disabled=true;btn.textContent='正在建立安全問題…';
  try{
    await signwellGasBridge('cms.auth.configure',{bootstrapKey,password,questions,clientId:cmsAuthClientIdValue(),replaceExisting:cmsAuthNeedsPolicyUpgrade},{timeoutMs:30000});
    cmsAuthConfigured=true;cmsAuthNeedsPolicyUpgrade=false;
    ['authBootstrapKey','authSetupPassword','authSetupQuestion1','authSetupAnswer1'].forEach(id=>{const el=$('#'+id);if(el)el.value=''});
    showCmsAuthSetup(false);setAuthStage(1);swRefreshPasskeyLoginMode();
    $('#lockHint').textContent=cmsPasskeyConfigured?'安全問題已建立；現在也可以使用 Passkey 登入。':'單一安全問題已啟用；每次登入在管理密碼後驗證這一題。';
    showToast('安全問題已建立');
  }catch(err){
    $('#authErrorTitle').textContent='安全登入設定失敗';
    $('#authErrorText').textContent=String(err&&err.message||err||'請確認 Backend Admin Key');
    $('#authError').classList.add('show');
  }finally{btn.disabled=false;btn.textContent='建立安全問題'}
}
function setAuthStage(stage){
  authStage=stage;clearAuthError();const second=stage===2;
  $('#authStep1').classList.toggle('hidden',second);$('#authStep2').classList.toggle('hidden',!second);$('#authSetup').classList.add('hidden');$('#authProgress').classList.remove('hidden');
  $('#authDot1').classList.toggle('active',!second);$('#authDot1').classList.toggle('done',second);$('#authDot2').classList.toggle('active',second);
  if(second){$('#lockHint').textContent='第一階段已通過；請回答已設定的安全問題。';setTimeout(()=>$('#answerInput').focus(),40)}
  else{$('#answerInput').value='';pendingPin='';authChallenge='';$('#securityQuestionText').textContent='安全問題會在第一階段通過後由伺服器載入';$('#lockHint').textContent='登入驗證由 Google Apps Script 執行；真正密碼不會下載到這個 HTML。';setTimeout(()=>$('#pinInput').focus(),40)}
}
async function unlock(){
  clearAuthError();
  const btn=$('#unlockBtn');
  const pin=String($('#pinInput').value||'');
  if(!pin){showAuthError(1,'請輸入管理密碼。');return}
  if(!/^\d+$/.test(pin)){showAuthError(1,'管理密碼只能輸入數字。');return}
  btn.disabled=true;btn.textContent='伺服器驗證中…';
  try{
    const r=await signwellGasBridge('cms.auth.password',{password:pin,clientId:cmsAuthClientIdValue()},{timeoutMs:25000});
    if(!r||!r.challenge)throw new Error('未取得安全驗證 challenge');
    pendingPin=pin;authChallenge=String(r.challenge||'');authFailCount[1]=0;
    $('#securityQuestionText').textContent=String(r.question||'安全問題');$('#securityQuestionText').setAttribute('aria-label','安全問題');
    $('#pinInput').value='';setAuthStage(2);
  }catch(err){showAuthError(1,String(err&&err.message||err||'密碼驗證失敗'))}
  finally{btn.disabled=false;btn.textContent='繼續'}
}
async function verifySecond(){
  clearAuthError();
  let authResult=null;
  const verifyButton=$('#verifyBtn');
  verifyButton?.classList.add('auth-entering');verifyButton.disabled=true;verifyButton.textContent='伺服器驗證中…';

  const answer=String($('#answerInput').value||'').trim();
  if(!answer){verifyButton?.classList.remove('auth-entering');verifyButton.disabled=false;verifyButton.textContent='驗證並進入';showAuthError(2,'請輸入安全問題答案。');return}
  try{
    authResult=await signwellGasBridge('cms.auth.verify',{challenge:authChallenge,answer,clientId:cmsAuthClientIdValue()},{timeoutMs:25000});
    if(!authResult||!authResult.sessionToken)throw new Error('未取得登入工作階段');
    cmsSessionToken=String(authResult.sessionToken||'');
    authFailCount[2]=0;
  }catch(err){
    verifyButton?.classList.remove('auth-entering');verifyButton.disabled=false;verifyButton.textContent='驗證並進入';
    showAuthError(2,String(err&&err.message||err||'安全問題驗證失敗'));
    return;
  }
  authSecret=''; // v23.3: no browser-derived secret; GitHub PAT is server-side only
  // Traditional strong login also establishes a short-lived Worker session so
  // the user can register/manage Passkeys without re-entering credentials.
  if(authResult?.passkeyBridgeProof&&cmsPasskeyConfigured){
    try{await window.SignWellAuth?.exchangeLegacyProof?.(authResult.passkeyBridgeProof)}catch(_){/* Passkey is optional */}
  }
  await completeCmsLogin('legacy');
}
async function completeCmsLogin(method='legacy'){
  const verifyButton=$('#verifyBtn');
  $('#answerInput').value='';
  $('#lockHint').textContent=method==='passkey'?'Passkey 驗證完成，正在同步內容…':'驗證完成，正在同步內容…';
  try{await dataReady}catch(_){}
  $('#lockScreen').classList.add('hidden');
  $('#cms').classList.remove('hidden');
  verifyButton?.classList.remove('auth-entering');if(verifyButton){verifyButton.disabled=false;verifyButton.textContent='驗證並進入'}
  localStorage.setItem(ACTKEY,String(Date.now()));
  pendingPin='';
  setAuthStage(1);
  renderView();
  bindCmsCloudRealtime();
  startAnalyticsLivePolling();
  showLoginSyncOverlay();
  restoreRememberedGithubToken().catch(()=>{githubToken=''});
  let cloudFinished=false;
  let cloudOK=false;
  const cloudTask=cmsCloudInitialSyncAfterLogin()
    .then(ok=>{cloudFinished=true;cloudOK=Boolean(ok);cmsCloudSetStatus(ok?'雲端已同步 ✓':'本機模式',ok?undefined:'#9a7b45');return ok;})
    .catch(()=>{cloudFinished=true;cloudOK=false;cmsCloudSetStatus('雲端暫時離線 · 使用本機快取','#9a7b45');return false;});
  await Promise.race([cloudTask,sleep(4500)]);
  hideLoginSyncOverlay();
  if(!cloudFinished)showToast((method==='passkey'?'Passkey 登入完成':'已登入')+' · 雲端將在背景繼續同步');
  else if(cloudOK)showToast((method==='passkey'?'Passkey 登入完成':'登入完成')+' · 雲端資料已同步');
  else showToast((method==='passkey'?'Passkey 登入完成':'登入完成')+' · 使用本機快取');
  await playLoginSuccessSequence();
  swReviewInboxMaybeOpen(false).catch(()=>{});
  medicalNewsBackgroundWarmup();
  cloudTask.then(ok=>{if(ok&&!cloudFinished)cmsCloudSetStatus('雲端已同步 ✓')}).finally(()=>{startCmsCloudPolling()});
}

function lock(){const oldSession=cmsSessionToken;stopCmsCloudPolling();stopAnalyticsLivePolling();persist(true);resetMedicalNewsPersistentSession();githubToken='';authSecret='';pendingPin='';cmsSessionToken='';authChallenge='';clearAuthError();try{localStorage.removeItem(TOKEN_STORE_KEY)}catch(_){};if(oldSession){signwellGasBridge('cms.auth.logout',{sessionToken:oldSession},{timeoutMs:8000}).catch(()=>{})}try{window.SignWellAuth?.logout?.()}catch(_){}$('#cms').classList.add('hidden');$('#lockScreen').classList.remove('hidden');$('#pinInput').value='';$('#answerInput').value='';setAuthStage(1);swRefreshPasskeyLoginMode()}
function checkAutoLock(){const last=Number(localStorage.getItem(ACTKEY)||0);if(last&&Date.now()-last>15*60*1000&&!$('#cms').classList.contains('hidden'))lock()}
function nav(v){
  if(viewName==='newsletter'||v==='newsletter')resetNewsletterInteractionState();
  if(v!=='medicalnews')setMedicalNewsPersistentMode(false);
  viewName=v;
  currentId=null;
  pendingNewArticle=null;
  $$('.nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  renderView();
  setTimeout(()=>cmsCloudApplyDeferred(),0);
}

let cmsViewSwitchTimer=null;
function withCmsViewTransition(fn){
  const body=document.body;
  clearTimeout(cmsViewSwitchTimer);

  if(matchMedia('(prefers-reduced-motion:reduce)').matches){
    fn();
    return;
  }

  body.classList.add('view-switching');

  cmsViewSwitchTimer=setTimeout(()=>{
    fn();
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>body.classList.remove('view-switching'));
    });
  },70);
}


/*
 * Authenticated bridge used by medical-daily-focus.html.
 * The iframe never receives the Admin Key as visible markup.
 */
window.signwellMedicalNewsScan=async function(options={}){
  const payload={
    hours:24,
    limit:5,
    minMajorMedia:2,
    force:Boolean(options.force)
  };

  return signwellGasBridge(
    'admin.medicalNews.scan',
    payload,
    {
      adminKey:newsletterAdminKey(),
      timeoutMs:60000
    }
  );
};

/* ============================================================
   CMS v14.46 · Medical News Writing Workspace
   ============================================================ */
let medicalNewsWorkspaceCache=null;
let medicalNewsWarmupPromise=null;
let medicalNewsWarmupAt=0;

function medicalNewsWorkspaceFresh(){
  return Boolean(
    medicalNewsWorkspaceCache &&
    Array.isArray(medicalNewsWorkspaceCache.topics) &&
    Date.now()-medicalNewsWarmupAt < 30*60*1000
  );
}

window.signwellMedicalNewsWorkspace=async function(options={}){
  const force=Boolean(options.force);
  if(!force && medicalNewsWorkspaceFresh())return clone(medicalNewsWorkspaceCache);
  if(!force && medicalNewsWarmupPromise)return clone(await medicalNewsWarmupPromise);

  const task=signwellGasBridge(
    'admin.medicalNews.workspace',
    {hours:24,limit:5,minMajorMedia:2,force},
    {adminKey:newsletterAdminKey(),timeoutMs:90000}
  ).then(result=>{
    medicalNewsWorkspaceCache=result;
    medicalNewsWarmupAt=Date.now();
    try{sessionStorage.setItem('sw-medical-workspace-23.7',JSON.stringify({at:medicalNewsWarmupAt,data:result}))}catch(_){}
    return result;
  });

  if(!force){
    medicalNewsWarmupPromise=task.finally(()=>{medicalNewsWarmupPromise=null});
    return clone(await medicalNewsWarmupPromise);
  }

  return clone(await task);
};

window.signwellMedicalNewsLiterature=async function(topic={}){
  return signwellGasBridge(
    'admin.medicalNews.literature',
    {
      title:String(topic.title||''),
      category:String(topic.category||''),
      terms:Array.isArray(topic.extensionTerms)?topic.extensionTerms:[],
      limit:4
    },
    {adminKey:newsletterAdminKey(),timeoutMs:45000}
  );
};

window.signwellMedicalNewsAIStatus=async function(){
  return signwellGasBridge(
    'admin.medicalNews.aiStatus',
    {},
    {adminKey:newsletterAdminKey(),timeoutMs:30000}
  );
};


window.signwellMedicalNewsAIConfigure=async function(config={}){
  const payload={
    endpoint:String(config.endpoint||''),
    apiKey:String(config.apiKey||''),
    model:String(config.model||''),
    provider:String(config.provider||'auto'),
    test:Boolean(config.test),
    secretAuthToken:String(config.secretAuthToken||'')
  };
  if(Object.prototype.hasOwnProperty.call(config,'customPrompt'))payload.customPrompt=String(config.customPrompt||'');
  return signwellGasBridge(
    'admin.medicalNews.aiConfigure',
    payload,
    {adminKey:newsletterAdminKey(),timeoutMs:55000}
  );
};


window.signwellAIInstructionState=async function(){
  return signwellGasBridge(
    'admin.medicalNews.aiInstructionState',
    {},
    {adminKey:newsletterAdminKey(),timeoutMs:30000}
  );
};

window.signwellAIInstructionChat=async function(message=''){
  return signwellGasBridge(
    'admin.medicalNews.aiInstructionChat',
    {message:String(message||'')},
    {adminKey:newsletterAdminKey(),timeoutMs:90000}
  );
};

window.signwellAIInstructionSave=async function(prompt=''){
  return signwellGasBridge(
    'admin.medicalNews.aiInstructionSave',
    {prompt:String(prompt||'')},
    {adminKey:newsletterAdminKey(),timeoutMs:30000}
  );
};

window.signwellAIInstructionClear=async function(){
  return signwellGasBridge(
    'admin.medicalNews.aiInstructionClear',
    {},
    {adminKey:newsletterAdminKey(),timeoutMs:30000}
  );
};

window.signwellMedicalNewsAITest=async function(){
  return signwellGasBridge(
    'admin.medicalNews.aiTest',
    {},
    {adminKey:newsletterAdminKey(),timeoutMs:45000}
  );
};


window.signwellAIProfilesStatus=async function(){
  return signwellGasBridge('admin.aiProfiles.status',{}, {adminKey:newsletterAdminKey(),timeoutMs:30000});
};
window.signwellGPTConfigure=async function(config={}){
  return signwellGasBridge('admin.aiProfiles.configureGpt',{
    endpoint:String(config.endpoint||''),model:String(config.model||''),apiKey:String(config.apiKey||''),
    secretAuthToken:String(config.secretAuthToken||''),test:Boolean(config.test)
  },{adminKey:newsletterAdminKey(),timeoutMs:70000});
};
window.signwellAIProfileTest=async function(profile='writer'){
  return signwellGasBridge('admin.aiProfiles.test',{profile:String(profile||'writer')},{adminKey:newsletterAdminKey(),timeoutMs:70000});
};

window.signwellMedicalNewsAIJobStatus=async function(jobId='',includeResult=false){
  return signwellGasBridge(
    'admin.medicalNews.aiJobStatus',
    {jobId:String(jobId||''),includeResult:Boolean(includeResult)},
    {adminKey:newsletterAdminKey(),timeoutMs:18000}
  );
};

async function signwellWaitForAIJob(jobId,{maxMs=70000,includeResult=true}={}){
  const started=Date.now();
  let last=null;
  while(Date.now()-started<maxMs){
    try{
      last=await window.signwellMedicalNewsAIJobStatus(jobId,includeResult);
      if(last?.state==='done'){
        if(last.result)return Object.assign({},last.result,{recovered:true,jobId});
        if(last.resultOmitted)throw new Error('AI 已完成，但復原快取過大；請回到時事頁重新開啟本次草稿。');
        return {ok:false,pending:false,jobId,state:'done'};
      }
      if(last?.state==='error')throw new Error(last.error||'AI 生成失敗');
    }catch(err){
      if(/AI 生成失敗|session|登入|授權|unauthor/i.test(String(err?.message||err)))throw err;
    }
    await new Promise(r=>setTimeout(r,4500));
  }
  throw new Error('AI 工作仍在後端處理中。系統沒有重複送出，請稍後再按一次；若已完成會直接復原原結果。');
}

window.signwellMedicalNewsGenerateAIArticle=async function(topic={},options={}){
  const jobId=String(options.jobId||'');
  const payload={
    topic:{
      id:String(topic.id||''),
      title:String(topic.title||''),
      category:String(topic.category||''),
      summary:String(topic.summary||''),
      extensionTerms:Array.isArray(topic.extensionTerms)?topic.extensionTerms:[],
      sources:Array.isArray(topic.sources)?topic.sources:[]
    },
    variation:Number(options.variation||0),
    aiProfile:String(options.aiProfile||'gpt'),
    reviewerProfile:String(options.reviewerProfile||'gemini'),
    writerFallbackProfiles:Array.isArray(options.writerFallbackProfiles)?options.writerFallbackProfiles:[],
    reviewerFallbackProfiles:Array.isArray(options.reviewerFallbackProfiles)?options.reviewerFallbackProfiles:[],
    failoverEnabled:options.failoverEnabled!==false,
    jobId
  };
  try{
    const result=await signwellGasBridge(
      'admin.medicalNews.generateArticle',
      payload,
      {adminKey:newsletterAdminKey(),timeoutMs:230000}
    );
    if(result?.pending&&jobId)return signwellWaitForAIJob(jobId,{maxMs:90000,includeResult:true});
    return result;
  }catch(err){
    const msg=String(err?.message||err);
    if(jobId&&/逾時|timeout|timed out/i.test(msg)){
      return signwellWaitForAIJob(jobId,{maxMs:90000,includeResult:true});
    }
    throw err;
  }
};

function restoreMedicalNewsWorkspaceCache(){
  try{
    const saved=JSON.parse(sessionStorage.getItem('sw-medical-workspace-23.7')||'null');
    if(saved?.data && Date.now()-Number(saved.at||0)<30*60*1000){
      medicalNewsWorkspaceCache=saved.data;
      medicalNewsWarmupAt=Number(saved.at||Date.now());
    }
  }catch(_){}
}
restoreMedicalNewsWorkspaceCache();

function medicalNewsBackgroundWarmup(){
  if(medicalNewsWorkspaceFresh() || medicalNewsWarmupPromise)return;

  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const canWarm=()=>navigator.onLine!==false && !document.hidden && !connection?.saveData;

  const run=()=>{
    if(!canWarm()){
      const retry=()=>{
        if(!canWarm())return;
        window.removeEventListener('online',retry);
        document.removeEventListener('visibilitychange',retry);
        medicalNewsBackgroundWarmup();
      };
      window.addEventListener('online',retry,{once:true,passive:true});
      document.addEventListener('visibilitychange',retry,{once:true,passive:true});
      return;
    }

    window.signwellMedicalNewsWorkspace({force:false})
      .then(()=>{
        if(viewName==='medicalnews'){
          try{
            document.querySelector('#medicalNewsSuggestionsFrame')
              ?.contentWindow
              ?.postMessage({type:'SIGNWELL_MEDICAL_WORKSPACE_READY'},location.origin);
          }catch(_){}
        }
      })
      .catch(()=>{});
  };

  if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:1800});
  else setTimeout(run,720);
}

function ensureCurrentAffairsTopic(){
  data.topics=Array.isArray(data.topics)?data.topics:[];
  let topic=data.topics.find(t=>String(t.name||'').trim()==='時事探討');
  if(!topic){
    topic={
      id:'topic-current-affairs',
      name:'時事探討',
      slug:'current-affairs',
      description:'從當日醫療新聞出發，回到原始來源、研究證據與臨床脈絡。',
      active:true,
      order:data.topics.length
    };
    data.topics.push(topic);
  }
  return topic;
}

function uniqueMedicalNewsSlug(title=''){
  const base=slugify(title)||('medical-news-'+Date.now());
  const used=new Set((Array.isArray(data.articles)?data.articles:[]).map(a=>String(a.slug||'')).filter(Boolean));
  if(!used.has(base))return base;
  let n=2;
  while(used.has(`${base}-${n}`))n++;
  return `${base}-${n}`;
}

function normalizeGeneratedMedicalArticle(payload={}){
  ensureCurrentAffairsTopic();
  const today=new Date().toISOString().slice(0,10);
  const title=String(payload.title||'時事探討').trim();
  const tags=Array.isArray(payload.tags)?payload.tags.filter(Boolean):[];
  return {
    id:'a-news-'+Date.now(),
    title,
    subtitle:String(payload.subtitle||'').trim(),
    slug:uniqueMedicalNewsSlug(title),
    category:'時事探討',
    type:'文章',
    excerpt:String(payload.excerpt||'').trim().slice(0,260),
    tags:[...new Set(['時事探討',...tags])].slice(0,10),
    cover:payload.imageSource&&/^https:\/\//i.test(String(payload.imageSource.imageUrl||''))?String(payload.imageSource.imageUrl):'',
    imageSource:payload.imageSource&&typeof payload.imageSource==='object'?clone(payload.imageSource):null,
    imageSources:Array.isArray(payload.imageSources)?clone(payload.imageSources):[],
    status:'Draft',
    featured:false,
    publisherId:'',
    publisherName:'SignWell·欣緯生醫',
    publishedAt:today,
    updatedAt:today,
    content:String(payload.content||'<p>尚未產生內容。</p>'),
    contentFormat:'html',
    references:(Array.isArray(payload.references)?clone(payload.references):[]).filter(r=>r&&['news','government','literature'].includes(r.type)),
    internalReferences:(Array.isArray(payload.internalReferences)?clone(payload.internalReferences):[]).map(x=>({articleId:String(x?.articleId||x?.article_id||''),targetVersion:String(x?.targetVersion||x?.target_version||''),context:String(x?.context||x?.citation_context||'').slice(0,500),primaryEvidenceIds:Array.isArray(x?.primaryEvidenceIds)?x.primaryEvidenceIds.map(String).slice(0,8):[]})).filter(x=>x.articleId),
    audit:payload.audit&&typeof payload.audit==='object'?clone(payload.audit):null,
    complianceReview:payload.complianceReview&&typeof payload.complianceReview==='object'?clone(payload.complianceReview):null,
    sourceWorkspace:{
      type:'medical-news-workspace',
      topicId:String(payload.topicId||''),
      generatedAt:new Date().toISOString(),
      sources:Array.isArray(payload.sources)?clone(payload.sources):[],
      publicationKey:medicalNewsPublicationKey(payload),
      publishedOnline:false
    }
  };
}

window.signwellMedicalNewsCreateArticle=async function(payload={},mode='editor'){
  const article=normalizeGeneratedMedicalArticle(payload);

  if(mode==='publish'){
    const existing=findPublishedMedicalNewsMatch(article);
    if(existing){
      markArticlePublishedReceipt(existing);
      persist(true);
      showToast('這篇 AI 文章已發布 · 已阻擋重複發布與重複通知');
      return {ok:true,published:true,alreadyPublished:true,articleId:existing.id,notification:{enabled:newsletterAutoEnabled(),attempted:false,success:true,skipped:true,alreadySent:true,delivered:0,reason:'duplicate-blocked'}};
    }
    const notifyOn=newsletterAutoEnabled();
    const notifyLine=notifyOn
      ? '發布完成後會自動寄送新文章通知給目前可寄送的訂閱者。'
      : '目前「發布後自動寄送」已關閉，因此這次不會寄送訂閱通知。';
    const ok=await swConfirm(`將「${article.title}」直接發布到「時事探討」？\n\n${notifyLine}\n\n發布前仍建議快速閱讀一次引用與醫療內容。`,{title:'確認 AI 文章發佈',kicker:'SIGN WELL · AI PUBLISH',confirmText:'確認發佈'});
    if(!ok)return {ok:false,cancelled:true};
    article.status='Published';
  }

  data.articles.unshift(article);
  persist(true);
  syncPublicSnapshot();

  if(mode==='publish') await swAutoGlossaryScanArticle(article,{silent:true});
  else swAutoGlossaryScanArticle(article,{silent:true}).catch(()=>{});

  if(mode==='publish'){
    try{
      await restoreRememberedGithubToken();

      const published=await publishGitHub();
      if(!published){
        article.status='Draft';
        persist(true);
        showToast('尚未發布：請先在設定解鎖 GitHub Token');
        return {ok:false,needsGithub:true,articleId:article.id};
      }

      const publishedArticle=data.articles.find(x=>String(x.id)===String(article.id))||article;
      markArticlePublishedReceipt(publishedArticle);
      persist(true);
      try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}

      const notification={
        enabled:newsletterAutoEnabled(),
        attempted:false,
        success:false,
        skipped:false,
        delivered:0,
        alreadySent:false,
        reason:'disabled'
      };

      if(notification.enabled){
        showToast('文章已上線 · 正在通知訂閱者…');

        const mail=await maybeAutoSendArticleNewsletter(article,{sourceEl:null});
        notification.attempted=Boolean(mail?.attempted);
        notification.success=Boolean(mail?.success);
        notification.skipped=Boolean(mail?.skipped);
        notification.alreadySent=Boolean(mail?.alreadySent);
        notification.delivered=Number(
          mail?.body?.delivered ??
          mail?.body?.recipients ??
          0
        );

        if(mail?.success){
          if(mail?.skipped){
            showToast('已發布到「時事探討」 · 目前沒有可寄送訂閱者');
          }else if(mail?.alreadySent){
            showToast('已發布到「時事探討」 · 此文章通知先前已寄送');
          }else{
            showToast(`已發布並通知 ${notification.delivered.toLocaleString()} 位訂閱者`);
          }
        }else{
          showToast('文章已發布，但訂閱通知未完成');
        }
      }else{
        showToast('已發布到「時事探討」 · 自動訂閱通知目前關閉');
      }

      return {
        ok:true,
        published:true,
        articleId:article.id,
        notification
      };
    }catch(err){
      article.status='Draft';
      persist(true);
      showToast('發布失敗，已保留為草稿');
      return {ok:false,error:String(err?.message||err),articleId:article.id};
    }
  }

  currentId=article.id;
  viewName='articles';
  $$('.nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view==='articles'));
  renderView();
  showToast('已帶入文章編輯器 · 主題：時事探討');
  return {ok:true,published:false,articleId:article.id};
};

function ensureMedicalNewsPersistentFrame(){
  const host=$('#medicalNewsPersistentHost');if(!host)return null;
  let frame=$('#medicalNewsSuggestionsFrame');
  if(!frame){
    host.innerHTML=`<section class="medical-news-shell" aria-label="時事新聞建議"><iframe class="medical-news-frame" id="medicalNewsSuggestionsFrame" src="medical-daily-focus.html?build=23.9.88-STAGING" title="SIGN WELL 時事新聞建議" loading="eager"></iframe></section>`;
    frame=$('#medicalNewsSuggestionsFrame');
  }
  return frame;
}
function setMedicalNewsPersistentMode(active){
  const host=$('#medicalNewsPersistentHost'),view=$('#view');
  if(!host||!view)return;
  const on=Boolean(active);
  if(on)ensureMedicalNewsPersistentFrame();
  host.hidden=!on;
  host.classList.toggle('show',on);
  host.setAttribute('aria-hidden',on?'false':'true');
  host.style.display=on?'block':'none';
  host.style.visibility=on?'visible':'hidden';
  host.style.pointerEvents=on?'auto':'none';
  host.style.height=on?'':'0px';
  view.classList.toggle('medical-news-view-hidden',on);
  view.style.display=on?'none':'';
  const frame=$('#medicalNewsSuggestionsFrame');
  if(frame){
    frame.style.visibility=on?'visible':'hidden';
    frame.style.pointerEvents=on?'auto':'none';
  }
}
function resetMedicalNewsPersistentSession(){
  const host=$('#medicalNewsPersistentHost');
  if(host){
    host.innerHTML='';
    host.hidden=true;
    host.classList.remove('show');
    host.setAttribute('aria-hidden','true');
    host.style.display='none';
    host.style.visibility='hidden';
    host.style.pointerEvents='none';
    host.style.height='0px';
  }
  const view=$('#view');
  if(view){view.classList.remove('medical-news-view-hidden');view.style.display=''}
}
function renderMedicalNewsSuggestions(){
  medicalNewsBackgroundWarmup();
  setMedicalNewsPersistentMode(true);
}
window.signwellCmsOpenSettings=()=>nav('export');window.signwellCmsOpenPublishSettings=window.signwellCmsOpenSettings;
window.signwellCmsOpenAIInstructions=()=>{nav('medicalnews');setTimeout(()=>{try{document.querySelector('#medicalNewsSuggestionsFrame')?.contentWindow?.postMessage({type:'openFocusSettings'},'*')}catch(_){ }},160)};

function renderView(){
  const editing=Boolean(currentId);
  if(viewName!=='aboutpage')removeAboutPersonDialogPortal();
  if(viewName!=='medicalnews'||editing)setMedicalNewsPersistentMode(false);

  if(viewName!=='newsletter'&&newsletterPreviewTimer){
    clearTimeout(newsletterPreviewTimer);
    newsletterPreviewTimer=null;
  }

  $('#previewBtn').classList.toggle('hidden',!editing);
  $('#saveBtn').classList.toggle('hidden',!editing);
  $('#publishBtn').classList.add('hidden');
  $('#onlineBtn').classList.toggle('hidden',!editing);

  if(editing){
    $('#topTitle').textContent='文章編輯器';
    renderEditor();
    return;
  }

  const names={
    dashboard:'總覽',
    commandcenter:'中控台',
    medicalnews:'時事新聞建議',
    aiinstructions:'AI 指令',
    articles:'文章',
    topics:'主題管理',
    site:'主頁設定',
    aboutpage:'關於頁面',
    newsletter:'電子報',
    canva:'Social Studio',
    export:'設定'
  };

  $('#topTitle').textContent=names[viewName]||'總覽';
  const kicker=document.getElementById('topKicker');if(kicker){const section={dashboard:'WORKSPACE',commandcenter:'OPERATIONS',medicalnews:'INTELLIGENCE',aiinstructions:'AI',articles:'CONTENT',topics:'CONTENT',site:'SITE',aboutpage:'SITE',newsletter:'DISTRIBUTION',canva:'DISTRIBUTION',export:'SYSTEM'}[viewName]||'WORKSPACE';kicker.textContent=`SIGN WELL · ${section}`;}

  if(viewName==='commandcenter')renderNotionCommandCenter();
  else if(viewName==='medicalnews')renderMedicalNewsSuggestions();
  else if(viewName==='aiinstructions')renderAIInstructionWorkbench();
  else if(viewName==='articles')renderArticles();
  else if(viewName==='topics')renderTopicsManager();
  else if(viewName==='site')renderSiteText();
  else if(viewName==='aboutpage')renderAboutPageEditor();
  else if(viewName==='newsletter'){
    renderNewsletterCenter();
    setTimeout(()=>refreshNewsletterData(),0);
  }
  else if(viewName==='canva')renderCanvaSocial();
  else if(viewName==='export'){renderExport();setTimeout(swInitPasskeySettings,0);setTimeout(initPublishAIProviderSettings,0);setTimeout(initPublishGptSettings,12);setTimeout(initPublishComplianceSettings,28);setTimeout(initMetaProviderSettings,64);setTimeout(initSecurityAuditPanel,124)}
  else renderDashboard();
}

const ANALYTICS_KEY='signwell-analytics-v1';
const ANALYTICS_CHANNEL='signwell-analytics';

let remoteAnalyticsCache=null;
let analyticsRefreshBusy=false;
const ANALYTICS_CFG=()=>window.SIGNWELL_ANALYTICS||{};
function analyticsEndpoint(){
  const a=ANALYTICS_CFG(),n=window.SIGNWELL_NEWSLETTER||{};
  return String(a.endpoint||n.endpoint||'').replace(/\/+$/,'');
}
function remoteAnalyticsEnabled(){
  const a=ANALYTICS_CFG(),n=window.SIGNWELL_NEWSLETTER||{};
  const endpoint=analyticsEndpoint();
  const enabled=a.enabled===true||n.enabled===true;
  return enabled&&/^https:\/\//i.test(endpoint);
}
async function refreshRemoteAnalytics(force=false){
  if(!remoteAnalyticsEnabled()||analyticsRefreshBusy)return false;
  const now=Date.now();
  if(!force&&refreshRemoteAnalytics.last&&now-refreshRemoteAnalytics.last<12000)return false;

  analyticsRefreshBusy=true;
  refreshRemoteAnalytics.last=now;
  try{
    const a=await signwellGasBridge(
      'admin.analytics.stats',
      {},
      {adminKey:newsletterAdminKey()}
    );

    if(!a||typeof a!=='object')throw new Error('Invalid analytics payload');

    remoteAnalyticsCache={
      total:Number(a.total||0),
      daily:a.daily&&typeof a.daily==='object'?a.daily:{},
      monthly:a.monthly&&typeof a.monthly==='object'?a.monthly:{},
      yearly:a.yearly&&typeof a.yearly==='object'?a.yearly:{},
      articles:a.articles&&typeof a.articles==='object'?a.articles:{},
      pages:a.pages&&typeof a.pages==='object'?a.pages:{},
      mode:a.mode||'google-sheet',
      retentionDays:Number(a.retentionDays||90),
      updatedAt:a.updatedAt||null
    };

    if(!$('#cms').classList.contains('hidden')&&(viewName==='dashboard'||viewName==='articles')){
      refreshAnalyticsVisuals();
    }
    return true;
  }catch(_){
    return false;
  }finally{
    analyticsRefreshBusy=false;
  }
}

function readAnalytics(){
  if(remoteAnalyticsCache)return remoteAnalyticsCache;
  try{
    const raw=JSON.parse(localStorage.getItem(ANALYTICS_KEY)||'{}');
    return {
      total:Number(raw.total||0),
      daily:raw.daily&&typeof raw.daily==='object'?raw.daily:{},
      monthly:raw.monthly&&typeof raw.monthly==='object'?raw.monthly:{},
      yearly:raw.yearly&&typeof raw.yearly==='object'?raw.yearly:{},
      articles:raw.articles&&typeof raw.articles==='object'?raw.articles:{},
      pages:raw.pages&&typeof raw.pages==='object'?raw.pages:{}
    };
  }catch(_){return{total:0,daily:{},articles:{},pages:{}}}
}
function analyticsSlug(a){return slugify(a?.slug||a?.title||a?.id||'')}
function articleViewCount(a){
  const x=readAnalytics().articles?.[analyticsSlug(a)];
  return Number(x?.total||0);
}
function iconSvg(name,cls='ui-icon'){
  const icons={
    view:'<path d="M2.6 12s3.6-5.9 9.4-5.9 9.4 5.9 9.4 5.9-3.6 5.9-9.4 5.9S2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    copy:'<rect x="8" y="8" width="10" height="10" rx="1.8"/><path d="M6 15H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"/>',
    delete:'<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/>',
    send:'<path d="M21 3 10.2 13.8"/><path d="m21 3-6.8 18-4-7-7-4Z"/>',
    edit:'<path d="M4 20h4l10.7-10.7a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m14.5 7.5 3 3"/>'
  };
  return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">${icons[name]||icons.view}</svg></span>`;
}
function viewGlyph(){return iconSvg('view','ui-icon')}
function viewBadge(count){return `<span class="view-badge">${iconSvg('view')}<span>${Number(count||0).toLocaleString()} 次</span></span>`}
let analyticsRange='7d';
let analyticsRangeSwitchTimer=null;
let metaSocialCache=null;
let metaSocialBusy=false;
let metaSocialLastFetch=0;

function analyticsTodayKey(date=new Date()){
  try{
    const parts=new Intl.DateTimeFormat('en-CA',{
      timeZone:'Asia/Taipei',
      year:'numeric',month:'2-digit',day:'2-digit'
    }).formatToParts(date);
    const m=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    return `${m.year}-${m.month}-${m.day}`;
  }catch(_){return date.toISOString().slice(0,10)}
}
function analyticsMonthKey(){return analyticsTodayKey().slice(0,7)}
function analyticsYearKey(){return analyticsTodayKey().slice(0,4)}
function taipeiDayOffset(days){
  const key=analyticsTodayKey();
  const d=new Date(key+'T12:00:00+08:00');
  d.setUTCDate(d.getUTCDate()+days);
  return analyticsTodayKey(d);
}
function sumLastDays(days){
  const an=readAnalytics();
  let total=0;
  for(let i=0;i<days;i++){
    const key=taipeiDayOffset(-i);
    total+=Number(an.daily?.[key]||0);
  }
  return total;
}
function rangeTotal(range=analyticsRange){
  const an=readAnalytics();
  if(range==='7d')return sumLastDays(7);
  if(range==='month')return Number(an.monthly?.[analyticsMonthKey()]||0) ||
    Object.entries(an.daily||{}).filter(([k])=>k.startsWith(analyticsMonthKey())).reduce((s,[,v])=>s+Number(v||0),0);
  if(range==='year')return Number(an.yearly?.[analyticsYearKey()]||0) ||
    Object.entries(an.monthly||{}).filter(([k])=>k.startsWith(analyticsYearKey())).reduce((s,[,v])=>s+Number(v||0),0);
  return Number(an.total||0);
}
function trendDataForRange(range=analyticsRange){
  const an=readAnalytics(),out=[];
  const todayKey=analyticsTodayKey();
  const today=new Date(todayKey+'T12:00:00+08:00');

  if(range==='7d'){
    for(let i=6;i>=0;i--){
      const key=taipeiDayOffset(-i);
      const parts=key.split('-');
      out.push({key,label:`${Number(parts[1])}/${Number(parts[2])}`,value:Number(an.daily?.[key]||0)});
    }
    return out;
  }

  if(range==='month'){
    const [y,m,d]=todayKey.split('-').map(Number);
    for(let day=1;day<=d;day++){
      const key=`${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      out.push({key,label:`${m}/${day}`,value:Number(an.daily?.[key]||0)});
    }
    return out;
  }

  if(range==='year'){
    const y=todayKey.slice(0,4);
    const currentMonth=Number(todayKey.slice(5,7));
    for(let m=1;m<=currentMonth;m++){
      const key=`${y}-${String(m).padStart(2,'0')}`;
      out.push({key,label:`${m}月`,value:Number(an.monthly?.[key]||0)});
    }
    return out;
  }

  return out;
}
function setAnalyticsRange(range){
  if(!['7d','month','year'].includes(range))return;
  if(range===analyticsRange)return;

  analyticsRange=range;
  const map={'7d':0,month:1,year:2};
  const slider=$('#analyticsRangeSwitch');
  if(slider){
    slider.style.setProperty('--range-x',(map[range]*100)+'%');
    slider.querySelectorAll('button').forEach(btn=>{
      const active=btn.dataset.range===range;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
    });
  }

  clearTimeout(analyticsRangeSwitchTimer);
  analyticsRangeSwitchTimer=null;
  requestAnimationFrame(()=>refreshAnalyticsVisuals());
  setTimeout(()=>refreshMetaSocialStats(true),40);
}

function metaSocialRangeLabel(){return analyticsRange==='7d'?'近 7 日':analyticsRange==='month'?'本月':'今年'}
function metaSocialPlatformColor(kind){return kind==='instagram'?'#b95f72':kind==='facebook'?'#5579a9':'#5f5b56'}
function metaSocialBarsHTML(daily={},kind='meta'){
  const rows=Object.entries(daily||{}).sort((a,b)=>a[0].localeCompare(b[0]));
  if(!rows.length)return '<div class="meta-social-bars" aria-hidden="true"><i style="height:8%"></i><i style="height:14%"></i><i style="height:10%"></i><i style="height:18%"></i><i style="height:12%"></i><i style="height:16%"></i></div>';
  const vals=rows.map(([,v])=>Math.max(0,Number(v||0))),max=Math.max(1,...vals),color=metaSocialPlatformColor(kind);
  return `<div class="meta-social-bars" aria-label="社群互動趨勢">${vals.slice(-31).map(v=>`<i style="height:${Math.max(6,(v/max)*100).toFixed(1)}%;background:${color}"></i>`).join('')}</div>`;
}
function metaSocialAccountLabel(x){return x?.username?'@'+String(x.username):String(x?.name||'尚未取得帳號名稱')}
function metaSocialBreakdownHTML(x){
  const b=x?.breakdown||{},parts=[];
  if(Number(b.likes||0))parts.push(['按讚 / Reactions',Number(b.likes||0)]);
  if(Number(b.comments||0))parts.push(['留言',Number(b.comments||0)]);
  if(Number(b.shares||0))parts.push(['分享',Number(b.shares||0)]);
  if(Number(b.replies||0))parts.push(['回覆',Number(b.replies||0)]);
  if(Number(b.reposts||0))parts.push(['轉發',Number(b.reposts||0)]);
  if(Number(b.quotes||0))parts.push(['引用',Number(b.quotes||0)]);
  if(!parts.length)return '<div class="social-breakdown-empty">目前沒有可拆分的互動資料</div>';
  const max=Math.max(1,...parts.map(x=>x[1]));
  return `<div class="social-breakdown">${parts.map(([label,value])=>`<div class="social-breakdown-row"><span>${escapeHTML(label)}</span><div><i style="width:${Math.max(4,(value/max)*100).toFixed(1)}%"></i></div><b>${Number(value).toLocaleString()}</b></div>`).join('')}</div>`;
}
function metaSocialFollowerDeltaHTML(x){
  if(x?.followers==null)return '<span class="social-delta neutral">Followers N/A</span>';
  const d=x?.followerDelta;
  if(d==null)return '<span class="social-delta neutral">成長快照建立中</span>';
  const n=Number(d||0),cls=n>0?'up':n<0?'down':'neutral',sign=n>0?'+':'';
  return `<span class="social-delta ${cls}">${sign}${n.toLocaleString()} followers${x.followerGrowthPct==null?'':` · ${Number(x.followerGrowthPct).toFixed(2)}%`}</span>`;
}
function metaSocialDailyChartHTML(d){
  const list=(Array.isArray(d?.platforms)?d.platforms:[]).filter(x=>x&&x.ok!==false);
  const keys=[...new Set(list.flatMap(x=>Object.keys(x.daily||{})))].sort();
  if(!keys.length)return '<div class="social-chart-empty">這個區間目前沒有每日互動資料。</div>';
  const rows=keys.slice(analyticsRange==='year'?-31:-31).map(key=>{
    const vals={instagram:0,facebook:0,threads:0};list.forEach(x=>{vals[x.kind]=Number(x.daily?.[key]||0)});
    const total=vals.instagram+vals.facebook+vals.threads;return {key,vals,total};
  });
  const max=Math.max(1,...rows.map(x=>x.total));
  return `<div class="social-daily-chart" role="img" aria-label="跨平台每日互動趨勢">${rows.map((r,i)=>{
    const h=Math.max(5,(r.total/max)*100),ig=r.total?100*r.vals.instagram/r.total:0,fb=r.total?100*r.vals.facebook/r.total:0;
    const grad=r.total?`linear-gradient(to top,#b95f72 0 ${ig.toFixed(1)}%,#5579a9 ${ig.toFixed(1)}% ${(ig+fb).toFixed(1)}%,#5f5b56 ${(ig+fb).toFixed(1)}% 100%)`:'rgba(110,120,130,.10)';
    const label=(i===0||i===rows.length-1||rows.length<=8||i%Math.max(1,Math.floor(rows.length/5))===0)?r.key.slice(5).replace('-','/'):' ';
    return `<div class="social-daily-col" title="${escapeHTML(r.key)} · ${r.total.toLocaleString()} 互動"><div class="social-daily-bar"><i style="height:${h.toFixed(1)}%;background:${grad}"></i></div><small>${escapeHTML(label)}</small></div>`;
  }).join('')}</div><div class="social-chart-legend"><span><i class="ig"></i>Instagram</span><span><i class="fb"></i>Facebook</span><span><i class="th"></i>Threads</span></div>`;
}
function metaSocialShareChartHTML(d){
  const list=(Array.isArray(d?.platforms)?d.platforms:[]).filter(x=>x&&x.ok!==false),total=Math.max(1,list.reduce((s,x)=>s+Number(x.interactions||0),0));
  if(!list.length)return '<div class="social-chart-empty">尚未取得平台資料。</div>';
  return `<div class="social-share-chart">${list.map(x=>{const v=Number(x.interactions||0),pct=(v/total)*100;return `<div class="social-share-row"><div class="social-share-copy"><strong>${escapeHTML(x.label||x.kind||'Meta')}</strong><span>${v.toLocaleString()} · ${pct.toFixed(1)}%</span></div><div class="social-share-track"><i style="width:${Math.max(v?3:0,pct).toFixed(1)}%;background:${metaSocialPlatformColor(x.kind)}"></i></div></div>`}).join('')}</div>`;
}
function metaSocialAutoInsights(d){
  const list=(Array.isArray(d?.platforms)?d.platforms:[]).filter(x=>x&&x.ok!==false),ins=[];
  if(!list.length)return [{tone:'neutral',title:'尚未有足夠資料',text:'完成 Meta 帳號連線後，這裡會自動比較平台表現與發文節奏。'}];
  const byInteraction=list.slice().sort((a,b)=>Number(b.interactions||0)-Number(a.interactions||0)),top=byInteraction[0],total=byInteraction.reduce((s,x)=>s+Number(x.interactions||0),0);
  if(top)ins.push({tone:'good',title:`${top.label||top.kind} 目前互動最高`,text:`${metaSocialRangeLabel()}累積 ${Number(top.interactions||0).toLocaleString()} 次可觀測互動，平均每篇 ${Number(top.avgInteractionsPerPost||0).toLocaleString()} 次。`});
  const share=top&&total?Number(top.interactions||0)/total:0;
  if(share>=.7&&list.length>1)ins.push({tone:'watch',title:'互動來源較集中',text:`約 ${(share*100).toFixed(0)}% 的可觀測互動來自 ${top.label||top.kind}。可把其他平台視為內容分發測試，而不是直接用同一套文案複製。`});
  const daily=Object.entries(d?.daily||{}).sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>Number(v||0));
  if(daily.length>=4){const cut=Math.floor(daily.length/2),a=daily.slice(0,cut).reduce((s,v)=>s+v,0),b=daily.slice(cut).reduce((s,v)=>s+v,0),delta=a>0?((b-a)/a)*100:(b>0?100:0);ins.push({tone:delta>=10?'good':delta<=-10?'watch':'neutral',title:delta>=10?'近期互動動能上升':delta<=-10?'近期互動動能轉弱':'近期互動大致平穩',text:`後半段相較前半段約 ${delta>=0?'+':''}${delta.toFixed(0)}%。此數值是貼文互動變化，不等同觸及或轉換率。`});}
  const growth=list.filter(x=>x.followerDelta!=null).reduce((s,x)=>s+Number(x.followerDelta||0),0);if(list.some(x=>x.followerDelta!=null))ins.push({tone:growth>0?'good':growth<0?'watch':'neutral',title:growth>0?'帳號規模正在成長':growth<0?'Follower 快照顯示淨減少':'Follower 規模暫時持平',text:`目前可追蹤平台在此區間合計 ${growth>0?'+':''}${growth.toLocaleString()} followers。快照從啟用 SIGN WELL 追蹤後才開始累積。`});
  const idle=list.filter(x=>Number(x.posts||0)===0);if(idle.length)ins.push({tone:'watch',title:'有平台本區間沒有新貼文',text:`${idle.map(x=>x.label||x.kind).join('、')} 在${metaSocialRangeLabel()}沒有抓到新貼文，因此互動比較可能失真。`});
  return ins.slice(0,4);
}
function metaSocialAccountCardHTML(x){
  const followers=x.followers==null?'—':Number(x.followers||0).toLocaleString(),interactions=Number(x.interactions||0),posts=Number(x.posts||0),avg=Number(x.avgInteractionsPerPost||0),ratio=x.interactionFollowerRatio==null?'—':Number(x.interactionFollowerRatio).toFixed(2)+'%';
  return `<article class="social-account-card ${x.ok===false?'offline':''}"><div class="social-account-head"><div><span class="social-platform-dot" style="background:${metaSocialPlatformColor(x.kind)}"></span><strong>${escapeHTML(x.label||x.kind||'Meta')}</strong><small>${escapeHTML(metaSocialAccountLabel(x))}</small></div><span class="social-connection ${x.ok===false?'bad':'ok'}">${x.ok===false?'連線異常':'已連線'}</span></div><div class="social-account-metrics"><div><span>Followers</span><b>${followers}</b></div><div><span>${metaSocialRangeLabel()}貼文</span><b>${posts.toLocaleString()}</b></div><div><span>互動</span><b>${interactions.toLocaleString()}</b></div><div><span>平均 / 篇</span><b>${avg.toLocaleString()}</b></div></div><div class="social-account-subline">${metaSocialFollowerDeltaHTML(x)}<span>互動 / follower ${ratio}</span></div>${metaSocialBarsHTML(x.daily||{},x.kind)}${metaSocialBreakdownHTML(x)}${x.topPost?`<div class="social-top-post"><span>區間最佳貼文</span><strong>${Number(x.topPost.interactions||0).toLocaleString()} 次互動</strong><small>${escapeHTML(x.topPost.date||'')}</small></div>`:''}${x.error?`<div class="meta-social-error">${escapeHTML(x.error)}</div>`:''}</article>`;
}
function metaSocialPanelHTML(){
  const d=metaSocialCache;
  if(!d)return `<section class="social-account-panel" id="metaSocialPanel"><div class="social-account-titlebar"><div><span class="eyebrow">SOCIAL ACCOUNT ANALYTICS</span><strong>社群帳號管理分析</strong><p>正在讀取 Instagram · Facebook · Threads 授權帳號統計…</p></div><div class="meta-social-badge"><i></i>等待資料</div></div><div class="empty">正在同步 Meta 社群資料…</div></section>`;
  const list=Array.isArray(d.platforms)?d.platforms:[],cards=list.length?list.map(metaSocialAccountCardHTML).join(''):`<div class="empty social-account-empty">${d.enabled===false?'Meta Social Signals 已停用。':'尚未設定 Meta Access Token 或帳號 ID。請到「設定」完成連線。'}</div>`;
  const knownFollowers=Number(d.knownFollowerPlatforms||0),followers=Number(d.totalFollowers||0),posts=Number(d.totalPosts||0),interactions=Number(d.totalInteractions||0),avg=Number(d.avgInteractionsPerPost||0),stamp=d.updatedAt?new Date(d.updatedAt).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
  const insights=metaSocialAutoInsights(d);
  return `<section class="social-account-panel" id="metaSocialPanel"><div class="social-account-titlebar"><div><span class="eyebrow">SOCIAL ACCOUNT ANALYTICS</span><strong>社群帳號管理分析</strong><p>統一查看帳號規模、發文量、互動結構與近期動能。資料只來自你授權的帳號，不代表 Meta 全平台趨勢。</p></div><div class="social-account-actions"><span class="meta-social-badge"><i></i>${d.configured?'META LIVE':'待設定'}</span><button type="button" onclick="metaSocialLastFetch=0;refreshMetaSocialStats(true)">重新整理</button><button type="button" onclick="nav('export');setTimeout(initMetaProviderSettings,60)">管理帳號</button></div></div><div class="social-overview-kpis"><div><span>平台合計 Followers</span><strong>${knownFollowers?followers.toLocaleString():'—'}</strong><small>${knownFollowers} 個平台可讀取</small></div><div><span>${metaSocialRangeLabel()}互動</span><strong>${interactions.toLocaleString()}</strong><small>可觀測互動總和</small></div><div><span>${metaSocialRangeLabel()}貼文</span><strong>${posts.toLocaleString()}</strong><small>跨平台發布量</small></div><div><span>平均互動 / 篇</span><strong>${avg.toLocaleString()}</strong><small>互動 ÷ 貼文數</small></div></div><div class="social-account-grid">${cards}</div><div class="social-analysis-grid"><section class="social-analysis-card wide"><div class="social-analysis-head"><strong>跨平台每日互動趨勢</strong><span>${metaSocialRangeLabel()}</span></div>${metaSocialDailyChartHTML(d)}</section><section class="social-analysis-card"><div class="social-analysis-head"><strong>平台互動占比</strong><span>SHARE</span></div>${metaSocialShareChartHTML(d)}</section><section class="social-analysis-card"><div class="social-analysis-head"><strong>自動判讀</strong><span>INSIGHTS</span></div><div class="social-insights">${insights.map(x=>`<article class="${x.tone}"><strong>${escapeHTML(x.title)}</strong><p>${escapeHTML(x.text)}</p></article>`).join('')}</div></section></div><div class="meta-social-foot"><span>更新 ${escapeHTML(stamp)} · Follower 成長採 SIGN WELL 每日快照；首次啟用後才開始累積。</span><span>互動數不等於 Reach、Impressions 或轉換率。</span></div></section>`;
}
async function refreshMetaSocialStats(force=false){
  if(metaSocialBusy)return false;
  const now=Date.now();if(!force&&metaSocialLastFetch&&now-metaSocialLastFetch<60000)return false;
  metaSocialBusy=true;metaSocialLastFetch=now;
  try{
    const r=await signwellGasBridge('admin.meta.stats',{range:analyticsRange,force:Boolean(force)},{adminKey:newsletterAdminKey(),timeoutMs:60000});
    if(r&&typeof r==='object')metaSocialCache=r;
    const old=document.getElementById('metaSocialPanel');
    if(old){const holder=document.createElement('div');holder.innerHTML=metaSocialPanelHTML();if(holder.firstElementChild)old.replaceWith(holder.firstElementChild)}
    return true;
  }catch(err){
    metaSocialCache={ok:false,enabled:true,configured:false,platforms:[],daily:{},totalInteractions:0,totalPosts:0,totalFollowers:0,updatedAt:new Date().toISOString(),error:String(err?.message||err)};
    const old=document.getElementById('metaSocialPanel');if(old){const holder=document.createElement('div');holder.innerHTML=metaSocialPanelHTML();if(holder.firstElementChild)old.replaceWith(holder.firstElementChild)}
    return false;
  }finally{metaSocialBusy=false}
}

function topArticleAnalyticsHTML(){
  const rows=data.articles
    .filter(a=>a.status==='Published')
    .map(a=>({a,count:articleViewCount(a)}))
    .sort((x,y)=>y.count-x.count)
    .slice(0,6);

  if(!rows.length)return '';

  const max=Math.max(1,...rows.map(x=>x.count));
  return `<div class="article-live-stats">
    <div class="article-live-stats-head">
      <strong>文章分別瀏覽</strong>
      <span>Google Sheet 累積值</span>
    </div>
    <div class="article-live-bars">
      ${rows.map(({a,count})=>`
        <div class="article-live-row">
          <span class="name" title="${escapeHTML(a.title||'未命名文章')}">${escapeHTML(a.title||'未命名文章')}</span>
          <span class="article-live-track"><span class="article-live-fill" style="width:${Math.max(2,(count/max)*100).toFixed(1)}%"></span></span>
          <b>${Number(count||0).toLocaleString()}</b>
        </div>`).join('')}
    </div>
  </div>`;
}
function trendNiceMax(value){
  const n=Math.max(1,Number(value||0));
  const pow=Math.pow(10,Math.floor(Math.log10(n)));
  const scaled=n/pow;
  const nice=scaled<=1?1:scaled<=2?2:scaled<=5?5:10;
  return nice*pow;
}

function trendChartHTML(){
  const arr=trendDataForRange();
  const values=arr.map(x=>Math.max(0,Number(x.value||0)));
  const rawMax=Math.max(0,...values);
  const scaleMax=trendNiceMax(rawMax);

  const rangeLabel=analyticsRange==='7d'?'本週':analyticsRange==='month'?'本月':'今年';
  const selectedTotal=rangeTotal();
  const allTotal=Number(readAnalytics().total||0);
  const remote=Boolean(remoteAnalyticsCache);
  const updated=remoteAnalyticsCache?.updatedAt
    ?new Date(remoteAnalyticsCache.updatedAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
    :'—';

  const sum=arr.reduce((s,x)=>s+Number(x.value||0),0);
  const avg=arr.length?Math.round(sum/arr.length):0;
  const peakItem=arr.reduce((best,x)=>Number(x.value||0)>Number(best?.value||-1)?x:best,null);
  const latest=arr[arr.length-1]||{value:0,label:'—'};
  const rangeIndex=analyticsRange==='7d'?0:analyticsRange==='month'?1:2;

  const firstLabel=arr[0]?.label||'';
  const midLabel=arr[Math.floor(arr.length/2)]?.label||'';
  const lastLabel=arr[arr.length-1]?.label||'';

  return `<section class="analytics-panel" id="analyticsLivePanel">
    <div class="analytics-head">
      <div class="analytics-head-copy">
        <span>${rangeLabel}</span>
        <strong>網站觀看次數趨勢</strong>
        <div class="analytics-live-state ${remote?'':'offline'}">
          <i></i>
          ${remote?`Google Sheet LIVE · 每 6 秒更新 · ${updated}`:'等待 Google Sheet Analytics'}
        </div>
      </div>
      <div class="analytics-total-wrap">
        <span>${rangeLabel}觀看</span>
        <div class="analytics-total">${selectedTotal.toLocaleString()}</div>
      </div>
    </div>

    <div class="analytics-toolbar">
      <div class="analytics-range-switch" id="analyticsRangeSwitch" style="--range-x:${rangeIndex*100}%" role="tablist" aria-label="統計期間">
        <i class="analytics-range-thumb" aria-hidden="true"></i>
        <button type="button" data-range="7d" class="${analyticsRange==='7d'?'active':''}" aria-selected="${analyticsRange==='7d'}" onclick="setAnalyticsRange('7d')"><span>週</span><small>7D</small></button>
        <button type="button" data-range="month" class="${analyticsRange==='month'?'active':''}" aria-selected="${analyticsRange==='month'}" onclick="setAnalyticsRange('month')"><span>月</span><small>MONTH</small></button>
        <button type="button" data-range="year" class="${analyticsRange==='year'?'active':''}" aria-selected="${analyticsRange==='year'}" onclick="setAnalyticsRange('year')"><span>年</span><small>YEAR</small></button>
      </div>
      <div class="analytics-cumulative">累積 ${allTotal.toLocaleString()} 次觀看</div>
    </div>

    <div class="analytics-chart-frame">
      <div class="analytics-canvas-layout">
        <div class="analytics-canvas-main">
          <div class="analytics-canvas-wrap">
            <canvas id="analyticsTrendCanvas"
              role="img"
              aria-label="${rangeLabel}網站觀看次數趨勢"></canvas>
            <div class="analytics-chart-status-v3 ${rawMax>0?'hidden':''}" id="analyticsTrendEmpty">目前這個區間尚無觀看資料</div>
          </div>
          <div class="analytics-labels-v3">
            <span>${escapeHTML(firstLabel)}</span>
            <span>${escapeHTML(midLabel)}</span>
            <span>${escapeHTML(lastLabel)}</span>
          </div>
        </div>
        <div class="analytics-canvas-scale" aria-hidden="true">
          <span>${scaleMax.toLocaleString()}</span>
          <span>${Math.round(scaleMax/2).toLocaleString()}</span>
          <span>0</span>
        </div>
      </div>
    </div>

    <div class="analytics-insights">
      <div class="analytics-insight"><span>平均</span><b>${avg.toLocaleString()} / 單位</b></div>
      <div class="analytics-insight"><span>最高</span><b>${Number(peakItem?.value||0).toLocaleString()} · ${escapeHTML(peakItem?.label||'—')}</b></div>
      <div class="analytics-insight"><span>最新</span><b>${Number(latest.value||0).toLocaleString()} · ${escapeHTML(latest.label||'—')}</b></div>
    </div>

    ${topArticleAnalyticsHTML()}
    <div class="analytics-note">${remote?'正式數據來源：Google Sheet Analytics。網站實際 route 瀏覽寫入 Sheet；CMS 近即時讀回。':'目前顯示 fallback；Google Backend 連線成功後會切換成正式 Google Sheet 數據。'}</div>
  </section>`;
}

let analyticsCanvasRAF=0;
let analyticsCanvasResizeObserver=null;

function drawAnalyticsTrendCanvas(){
  const canvas=$('#analyticsTrendCanvas');
  if(!canvas||viewName!=='dashboard')return;

  const rect=canvas.getBoundingClientRect();
  const cssW=Math.max(280,Math.round(rect.width||canvas.parentElement?.clientWidth||640));
  const cssH=Math.max(120,Math.round(rect.height||168));
  const dpr=Math.min(2,Math.max(1,window.devicePixelRatio||1));

  const pixelW=Math.max(1,Math.round(cssW*dpr));
  const pixelH=Math.max(1,Math.round(cssH*dpr));

  if(canvas.width!==pixelW)canvas.width=pixelW;
  if(canvas.height!==pixelH)canvas.height=pixelH;

  const ctx=canvas.getContext('2d');
  if(!ctx)return;

  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cssW,cssH);

  const arr=trendDataForRange();
  const values=arr.map(x=>Math.max(0,Number(x.value||0)));
  const rawMax=Math.max(0,...values);
  const max=trendNiceMax(rawMax);

  const padL=8,padR=8,padT=10,padB=10;
  const innerW=Math.max(1,cssW-padL-padR);
  const innerH=Math.max(1,cssH-padT-padB);

  // Grid.
  ctx.save();
  ctx.strokeStyle='rgba(83,124,154,.10)';
  ctx.lineWidth=1;
  [0,.25,.5,.75,1].forEach(t=>{
    const y=padT+innerH*t+.5;
    ctx.beginPath();
    ctx.moveTo(padL,y);
    ctx.lineTo(cssW-padR,y);
    ctx.stroke();
  });
  ctx.restore();

  if(!arr.length)return;

  const pts=arr.map((item,i)=>{
    const x=padL+(arr.length===1?innerW/2:(i/(arr.length-1))*innerW);
    const y=padT+innerH-(Math.max(0,Number(item.value||0))/max)*innerH;
    return {x,y,value:Number(item.value||0),label:item.label};
  });

  // Area fill.
  const grad=ctx.createLinearGradient(0,padT,0,cssH-padB);
  grad.addColorStop(0,'rgba(99,172,224,.26)');
  grad.addColorStop(.62,'rgba(145,209,239,.10)');
  grad.addColorStop(1,'rgba(191,232,248,.015)');

  ctx.beginPath();
  ctx.moveTo(pts[0].x,cssH-padB);
  pts.forEach(p=>ctx.lineTo(p.x,p.y));
  ctx.lineTo(pts[pts.length-1].x,cssH-padB);
  ctx.closePath();
  ctx.fillStyle=grad;
  ctx.fill();

  // Trend line.
  ctx.beginPath();
  pts.forEach((p,i)=>{
    if(i===0)ctx.moveTo(p.x,p.y);
    else ctx.lineTo(p.x,p.y);
  });
  ctx.strokeStyle='#63ace0';
  ctx.lineWidth=2.6;
  ctx.lineJoin='round';
  ctx.lineCap='round';
  ctx.stroke();

  // Only three dots to reduce visual noise.
  const dotIndexes=[0,Math.floor((pts.length-1)/2),pts.length-1];
  [...new Set(dotIndexes)].forEach(i=>{
    const p=pts[i];
    if(!p)return;
    ctx.beginPath();
    ctx.arc(p.x,p.y,3.6,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.98)';
    ctx.fill();
    ctx.lineWidth=2;
    ctx.strokeStyle='#63ace0';
    ctx.stroke();
  });
}

function scheduleAnalyticsTrendCanvas(){
  cancelAnimationFrame(analyticsCanvasRAF);
  analyticsCanvasRAF=requestAnimationFrame(()=>{
    analyticsCanvasRAF=0;
    drawAnalyticsTrendCanvas();

    if(analyticsCanvasResizeObserver){
      analyticsCanvasResizeObserver.disconnect();
      analyticsCanvasResizeObserver=null;
    }

    const wrap=$('#analyticsTrendCanvas')?.parentElement;
    if(wrap&&'ResizeObserver' in window){
      analyticsCanvasResizeObserver=new ResizeObserver(()=>{
        cancelAnimationFrame(analyticsCanvasRAF);
        analyticsCanvasRAF=requestAnimationFrame(drawAnalyticsTrendCanvas);
      });
      analyticsCanvasResizeObserver.observe(wrap);
    }
  });
}

let analyticsLiveTimer=null;
function refreshAnalyticsVisuals(){
  const panel=$('#analyticsLivePanel');
  if(panel){
    const holder=document.createElement('div');
    holder.innerHTML=trendChartHTML();
    const fresh=holder.firstElementChild;
    if(fresh)panel.replaceWith(fresh);
  }

  scheduleAnalyticsTrendCanvas();

  data.articles.forEach(a=>{
    const count=articleViewCount(a);
    $$(`[data-article-view="${CSS.escape(String(a.id))}"]`).forEach(el=>{
      el.innerHTML=viewBadge(count);
    });
  });
}

window.addEventListener('resize',()=>{
  if(viewName==='dashboard')scheduleAnalyticsTrendCanvas();
},{passive:true});

function startAnalyticsLivePolling(){
  stopAnalyticsLivePolling();
  analyticsLiveTimer=setInterval(()=>{
    if(document.hidden||$('#cms').classList.contains('hidden'))return;
    if(viewName==='dashboard'||viewName==='articles'){
      refreshRemoteAnalytics(true);
    }
  },6000);
}
function stopAnalyticsLivePolling(){
  if(analyticsLiveTimer){
    clearInterval(analyticsLiveTimer);
    analyticsLiveTimer=null;
  }
}


/* ===== SIGN WELL Newsletter Center ===== */
const NEWSLETTER_AUTO_KEY='signwell-newsletter-auto-v1';
const NEWSLETTER_ADMIN_KEY='signwell-newsletter-admin-local-v2';
const NEWSLETTER_DEFAULT_ADMIN_KEY='';
let newsletterCache={summary:null,subscribers:[],campaigns:[],backendVersion:'',templateVersion:''};
let newsletterPreviewTimer=null;
let newsletterPreviewMounted=false;
let newsletterPreviewDirty=true;
let newsletterPreviewSeq=0;
let newsletterBackendCapability='unknown';
let newsletterBackendCapabilityError='';
let newsletterBridgeLastMessageAt=0;
let newsletterBridgeLastVersion='';

const NEWSLETTER_CFG=()=>window.SIGNWELL_NEWSLETTER||{};
function expectedBackendRelease(){
  // Compatibility is pinned to the bridge protocol, not the product release.
  // This lets /health expose the real deployed release without breaking a proven bridge contract.
  return String(window.SIGNWELL_RELEASE?.bridgeProtocol||'').trim();
}
function assertBackendReleaseCompatible(actualVersion){
  const expected=expectedBackendRelease();
  const actual=String(actualVersion||'').trim();
  if(!expected||actual===expected)return true;
  throw new Error(
    `Backend Bridge Protocol 不相容：CMS 需要 ${expected}，目前 /exec 回傳 ${actual||'未知版本'}。`+
    '請重新部署 Code.gs，並確認 CMS 與 Backend 使用相容的 bridge protocol。'
  );
}
function newsletterBase(){
  const n=NEWSLETTER_CFG(),a=ANALYTICS_CFG();
  return String(n.endpoint||a.endpoint||'').replace(/\/+$/,'');
}
function newsletterEnabled(){
  const n=NEWSLETTER_CFG(),a=ANALYTICS_CFG();
  const endpoint=newsletterBase();
  const enabled=n.enabled===true || (n.enabled!==false && a.enabled===true);
  return enabled && /^https:\/\//i.test(endpoint);
}
function newsletterAdminKey(){
  return cmsSessionToken || localStorage.getItem(NEWSLETTER_ADMIN_KEY) || '';
}
function newsletterKeyMode(){
  return cmsSessionToken?'session':(localStorage.getItem(NEWSLETTER_ADMIN_KEY)?'custom':'none');
}

function saveNewsletterAdminKey(v){
  const key=String(v||'').trim();
  if(key)localStorage.setItem(NEWSLETTER_ADMIN_KEY,key);
  else localStorage.removeItem(NEWSLETTER_ADMIN_KEY);
}
function newsletterHeaders(){
  const h={'Content-Type':'application/json'};
  const key=newsletterAdminKey();
  if(key)h.Authorization='Bearer '+key;
  return h;
}

function swGasBridgeNonce(){
  try{
    const b=new Uint8Array(16);
    crypto.getRandomValues(b);
    return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
  }catch(_){
    return 'fb_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
  }
}
function swGasBridgeOriginAllowed(origin){
  const o=String(origin||'');
  if(o==='null')return true; // sandboxed Apps Script page; nonce remains mandatory
  try{
    const u=new URL(o);
    if(u.protocol!=='https:')return false;
    const h=u.hostname.toLowerCase();
    return h==='script.google.com'||h.endsWith('.googleusercontent.com')||h==='script.googleusercontent.com';
  }catch(_){return false}
}

function signwellGasBridge(action,payload={},options={}){
  return new Promise((resolve,reject)=>{
    if(!newsletterEnabled()){const e=window.SignWellErrors?.bridgeError?.('SIGN WELL Backend 尚未啟用',{status:503,errorCode:'SW-CMS-503-BACKEND-DISABLED',module:'backend-bridge',action})||new Error('SIGN WELL Backend 尚未啟用');return reject(e);}
    const endpoint=newsletterBase();
    const requestId='sw_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
    const frameName='swgas_'+requestId;
    const bridgeNonce=swGasBridgeNonce();
    let iframeLoadCount=0;
    const iframe=document.createElement('iframe');
    iframe.name=frameName;
    iframe.title='SIGN WELL Backend';
    iframe.tabIndex=-1;
    iframe.setAttribute('aria-hidden','true');
    Object.assign(iframe.style,{
      position:'fixed',width:'1px',height:'1px',opacity:'0',
      pointerEvents:'none',left:'-9999px',top:'-9999px'
    });

    const form=document.createElement('form');
    form.method='POST';
    form.action=endpoint;
    form.target=frameName;
    form.style.display='none';

    const add=(name,value)=>{
      const i=document.createElement('input');
      i.type='hidden';
      i.name=name;
      i.value=String(value??'');
      form.appendChild(i);
    };

    add('transport','iframe');
    add('requestId',requestId);
    add('returnOrigin',location.origin);
    add('bridgeNonce',bridgeNonce);
    add('action',action);
    add('payload',JSON.stringify(payload||{}));
    if(options.adminKey)add('adminKey',options.adminKey);

    let timer=null;
    const cleanup=()=>{
      clearTimeout(timer);
      window.removeEventListener('message',onMessage);
      form.remove();
      setTimeout(()=>iframe.remove(),60);
    };
    const onMessage=e=>{
      const d=e.data;
      if(!d||d.source!=='SIGNWELL_GAS'||d.requestId!==requestId)return;
      if(String(d.bridgeNonce||'')!==bridgeNonce)return;
      if(!swGasBridgeOriginAllowed(e.origin))return;

      newsletterBridgeLastMessageAt=Date.now();
      newsletterBridgeLastVersion=String(d.bridgeVersion||'');

      cleanup();
      try{
        assertBackendReleaseCompatible(d.bridgeVersion);
      }catch(versionError){
        reject(versionError);
        return;
      }
      if(d.ok)resolve(d.data||{});
      else reject(window.SignWellErrors?.bridgeError?.(d.error||'SIGN WELL Backend error',{status:d.status,errorCode:d.errorCode,errorId:d.errorId,requestId:d.errorRequestId||d.requestId,module:d.errorModule||'backend-bridge',action:d.errorAction||action,reason:d.errorReason,retryable:d.retryable})||new Error(d.error||'SIGN WELL Backend error'));
    };
    window.addEventListener('message',onMessage);
    iframe.addEventListener('load',()=>{iframeLoadCount+=1});

    const timeoutMs=Math.max(5000,Number(options.timeoutMs||30000));
    timer=setTimeout(()=>{
      cleanup();
      reject(window.SignWellErrors?.bridgeError?.(
        'SIGN WELL Backend iframe bridge 逾時：後端頁面載入 '+iframeLoadCount+' 次，但 nonce handshake 沒有回到 CMS。請確認 Code.gs 已重新部署為新版本。',
        {status:504,errorCode:'SW-CMS-504-BRIDGE-TIMEOUT',requestId,module:'backend-bridge',action,reason:'Apps Script iframe 已載入，但 nonce handshake 未在期限內回到 CMS；請檢查 /exec 部署版本與 endpoint。',retryable:true}
      )||new Error('SIGN WELL Backend iframe bridge 逾時'));
    },timeoutMs);

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });
}

async function newsletterRequest(path,opt={}){
  const map={
    '/admin/newsletter/summary':'admin.summary',
    '/admin/newsletter/subscribers':'admin.subscribers',
    '/admin/newsletter/campaigns':'admin.campaigns',
    '/admin/newsletter/preview':'admin.preview',
    '/admin/newsletter/test':'admin.test',
    '/admin/newsletter/authorize-send':'admin.sendAuthorize',
    '/admin/newsletter/send':'admin.send',
    '/admin/newsletter/send-article':'admin.sendArticle',
    '/admin/newsletter/diagnostics':'admin.subscriberDiagnostics',
    '/admin/newsletter/otp-enable':'admin.newsletter.otpEnable',
    '/admin/newsletter/otp-test':'admin.newsletter.otpTest'
  };

  let base=String(path||''),query='';
  const q=base.indexOf('?');
  if(q>=0){
    query=base.slice(q+1);
    base=base.slice(0,q);
  }

  const action=map[base];
  if(!action)throw new Error('Unsupported Newsletter action');

  let payload={};
  if(opt?.body){
    try{payload=JSON.parse(opt.body)||{}}catch(_){}
  }
  if(query){
    const qs=new URLSearchParams(query);
    qs.forEach((v,k)=>payload[k]=v);
  }

  return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey(),timeoutMs:opt.timeoutMs});
}
function migrateLegacyNewsletterKey(){
  try{
    const legacy=sessionStorage.getItem('signwell-newsletter-admin-session-v1');
    if(legacy&&!localStorage.getItem(NEWSLETTER_ADMIN_KEY)){
      localStorage.setItem(NEWSLETTER_ADMIN_KEY,legacy);
    }
    sessionStorage.removeItem('signwell-newsletter-admin-session-v1');
  }catch(_){}
}
migrateLegacyNewsletterKey();


/* ===== SIGN WELL Cloud CMS Sync v14.2 =====
   Google Apps Script is the canonical cross-device CMS state.
   Local IndexedDB remains an offline cache only. */
const CMS_CLOUD_CLIENT_KEY='signwell-cms-cloud-client-v1';
const CMS_CLOUD_MIGRATED_KEY='signwell-cms-cloud-migrated-v1';
const CMS_CLOUD_POLL_MS=8000;

let cmsCloudRevision=0;
let cmsCloudDirty=false;
let cmsCloudApplying=false;
let cmsCloudBusy=false;
let cmsCloudPushTimer=null;
let cmsCloudPollTimer=null;
let cmsCloudDeferred=null;
let cmsCloudChangeSeq=0;
let cmsCloudLastSyncAt=0;

function cmsCloudClientId(){
  try{
    let id=localStorage.getItem(CMS_CLOUD_CLIENT_KEY);
    if(!id){
      const raw=(globalThis.crypto&&typeof crypto.randomUUID==='function')
        ? crypto.randomUUID()
        : (Date.now()+'_'+Math.random().toString(36).slice(2));
      id='client_'+raw;
      localStorage.setItem(CMS_CLOUD_CLIENT_KEY,id);
    }
    return id;
  }catch(_){
    return 'client_'+Date.now()+'_'+Math.random().toString(36).slice(2);
  }
}
function cmsCloudEnabled(){
  return newsletterEnabled() && Boolean(newsletterAdminKey());
}
function cmsCloudSetStatus(text,color='#6f8f86'){
  const el=$('#saveState');
  if(!el)return;
  el.textContent=text;
  el.style.color=color;
}
function cmsCloudSerializable(){
  return normalizeState(clone(data));
}
function cmsCloudHasContent(v){
  return Boolean(
    v &&
    (
      (Array.isArray(v.articles)&&v.articles.length) ||
      (Array.isArray(v.topics)&&v.topics.length) ||
      (Array.isArray(v.people)&&v.people.length) ||
      (Array.isArray(v.glossary)&&v.glossary.length) ||
      (v.siteText&&Object.keys(v.siteText).length)
    )
  );
}
function cmsCloudEditingNow(){
  if(currentId)return true;
  if(viewName==='newsletter')return true;
  const ae=document.activeElement;
  if(!ae)return false;
  return Boolean(
    ae.closest?.('#view') &&
    (ae.matches?.('input,textarea,select,[contenteditable="true"]') || ae.isContentEditable)
  );
}
async function cmsCloudRequest(action,payload={}){
  return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey()});
}
async function cmsCloudWriteLocalCache(){
  const snapshot=clone(data);
  try{
    await idbPutState(snapshot);
    localStorage.removeItem(KEY);
  }catch(_){
    try{localStorage.setItem(KEY,JSON.stringify(snapshot))}catch(__){}
  }
}
async function cmsCloudApplyRemote(wrapper,{initial=false}={}){
  if(!wrapper||!wrapper.data)return false;

  if(!initial && cmsCloudEditingNow()){
    cmsCloudDeferred=wrapper;
    cmsCloudSetStatus('其他裝置有更新 · 離開編輯器後同步','#9a7b45');
    return false;
  }

  const scrollTop=$('#view')?.scrollTop||0;
  cmsCloudApplying=true;
  try{
    data=normalizeState(clone(wrapper.data));
    reconcilePublishedReceipts();
    cmsCloudRevision=Number(wrapper.revision||0);
    cmsCloudDirty=false;
    cmsCloudDeferred=null;
    await cmsCloudWriteLocalCache();
  }finally{
    cmsCloudApplying=false;
  }

  cmsCloudLastSyncAt=Date.now();
  cmsCloudSetStatus('雲端已同步 ✓');

  if(!initial && !$('#cms').classList.contains('hidden')){
    renderView();
    requestAnimationFrame(()=>{
      if($('#view'))$('#view').scrollTop=scrollTop;
    });
  }
  return true;
}

async function cmsCloudInitialSyncAfterLogin(){
  if(!cmsCloudEnabled()){
    cmsCloudSetStatus('本機模式','#9a7b45');
    return false;
  }

  cmsCloudSetStatus('正在同步雲端…','#7f8d99');

  const remote=await cmsCloudRequest('admin.cmsState.get',{
    clientId:cmsCloudClientId()
  });

  const remoteData=remote?.data||null;
  const remoteInitialized=remote?.initialized===true && cmsCloudHasContent(remoteData);

  if(remoteInitialized){
    /* CMS is already visible. Use the normal non-initial apply path so
       an active edit is never overwritten by a late network response. */
    await cmsCloudApplyRemote(remote,{initial:false});
    try{localStorage.setItem(CMS_CLOUD_MIGRATED_KEY,'1')}catch(_){}
    return true;
  }

  const pushed=await cmsCloudRequest('admin.cmsState.put',{
    clientId:cmsCloudClientId(),
    baseRevision:Number(remote?.revision||0),
    data:cmsCloudSerializable()
  });

  cmsCloudRevision=Number(pushed?.revision||1);
  cmsCloudDirty=false;
  cmsCloudLastSyncAt=Date.now();
  try{localStorage.setItem(CMS_CLOUD_MIGRATED_KEY,'1')}catch(_){}
  cmsCloudSetStatus('雲端已建立 ✓');
  return true;
}

async function cmsCloudInitialSync(){
  if(!cmsCloudEnabled()){
    cmsCloudSetStatus('本機模式','#9a7b45');
    return false;
  }

  cmsCloudSetStatus('正在同步雲端…','#7f8d99');

  const remote=await cmsCloudRequest('admin.cmsState.get',{
    clientId:cmsCloudClientId()
  });

  const remoteData=remote?.data||null;
  const remoteInitialized=remote?.initialized===true && cmsCloudHasContent(remoteData);

  if(remoteInitialized){
    await cmsCloudApplyRemote(remote,{initial:true});
    try{localStorage.setItem(CMS_CLOUD_MIGRATED_KEY,'1')}catch(_){}
    return true;
  }

  // First cloud initialization: current device becomes canonical.
  const pushed=await cmsCloudRequest('admin.cmsState.put',{
    clientId:cmsCloudClientId(),
    baseRevision:Number(remote?.revision||0),
    data:cmsCloudSerializable()
  });

  cmsCloudRevision=Number(pushed?.revision||1);
  cmsCloudDirty=false;
  cmsCloudLastSyncAt=Date.now();
  try{localStorage.setItem(CMS_CLOUD_MIGRATED_KEY,'1')}catch(_){}
  cmsCloudSetStatus('雲端已建立 ✓');
  return true;
}
function scheduleCmsCloudPush(delay=1200){
  if(cmsCloudApplying||!cmsCloudEnabled())return;
  cmsCloudDirty=true;
  cmsCloudChangeSeq++;
  const seq=cmsCloudChangeSeq;
  clearTimeout(cmsCloudPushTimer);
  cmsCloudSetStatus('等待雲端同步…','#7f8d99');
  cmsCloudPushTimer=setTimeout(()=>cmsCloudPushNow(seq),delay);
}
async function cmsCloudPushNow(seq=cmsCloudChangeSeq){
  if(cmsCloudApplying||cmsCloudBusy||!cmsCloudEnabled()||!cmsCloudDirty)return false;

  cmsCloudBusy=true;
  const capturedSeq=seq;
  const snapshot=cmsCloudSerializable();
  cmsCloudSetStatus('雲端同步中…','#7f8d99');

  try{
    const result=await cmsCloudRequest('admin.cmsState.put',{
      clientId:cmsCloudClientId(),
      baseRevision:cmsCloudRevision,
      data:snapshot
    });

    cmsCloudRevision=Number(result?.revision||cmsCloudRevision||0);
    cmsCloudLastSyncAt=Date.now();

    if(capturedSeq===cmsCloudChangeSeq){
      cmsCloudDirty=false;
      cmsCloudSetStatus('雲端已同步 ✓');
    }else{
      cmsCloudDirty=true;
      scheduleCmsCloudPush(650);
    }

    try{
      const bc=new BroadcastChannel('signwell-cms-cloud-v1');
      bc.postMessage({type:'revision',revision:cmsCloudRevision,clientId:cmsCloudClientId()});
      bc.close();
    }catch(_){}

    return true;
  }catch(err){
    cmsCloudDirty=true;
    if(String(err?.message||err).includes('CMS_STATE_CONFLICT')){
      clearTimeout(cmsCloudPushTimer);
      cmsCloudSetStatus('雲端版本衝突 · 請先匯出本機備份，再重新載入比對','#a65c65');
      return false;
    }
    cmsCloudSetStatus('雲端同步失敗 · 將重試','#a65c65');
    clearTimeout(cmsCloudPushTimer);
    cmsCloudPushTimer=setTimeout(()=>cmsCloudPushNow(cmsCloudChangeSeq),5000);
    return false;
  }finally{
    cmsCloudBusy=false;
  }
}
async function cmsCloudPullNow({force=false}={}){
  if(!cmsCloudEnabled()||cmsCloudBusy||document.hidden)return false;
  if(cmsCloudDirty){
    await cmsCloudPushNow(cmsCloudChangeSeq);
    if(cmsCloudDirty)return false;
  }

  try{
    const remote=await cmsCloudRequest('admin.cmsState.get',{
      clientId:cmsCloudClientId(),
      afterRevision:cmsCloudRevision
    });

    const rev=Number(remote?.revision||0);
    if(remote?.unchanged===true || rev<=cmsCloudRevision)return true;

    if(force || !cmsCloudEditingNow()){
      return cmsCloudApplyRemote(remote,{initial:false});
    }

    cmsCloudDeferred=remote;
    cmsCloudSetStatus('其他裝置有更新 · 離開編輯器後同步','#9a7b45');
    return false;
  }catch(_){
    return false;
  }
}
async function cmsCloudApplyDeferred(){
  if(!cmsCloudDeferred||cmsCloudEditingNow())return false;
  const pending=cmsCloudDeferred;
  cmsCloudDeferred=null;
  return cmsCloudApplyRemote(pending,{initial:false});
}
function startCmsCloudPolling(){
  stopCmsCloudPolling();
  if(!cmsCloudEnabled())return;

  cmsCloudPollTimer=setInterval(()=>{
    if(!document.hidden&&!$('#cms').classList.contains('hidden')){
      cmsCloudPullNow();
    }
  },CMS_CLOUD_POLL_MS);
}
function stopCmsCloudPolling(){
  if(cmsCloudPollTimer){
    clearInterval(cmsCloudPollTimer);
    cmsCloudPollTimer=null;
  }
}
function bindCmsCloudRealtime(){
  if(window.__signwellCmsCloudBound)return;
  window.__signwellCmsCloudBound=true;

  window.addEventListener('focus',()=>{
    if(!$('#cms').classList.contains('hidden')){
      cmsCloudPullNow();
      if(viewName==='dashboard'||viewName==='articles')refreshRemoteAnalytics(true);
    }
  });

  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden&&!$('#cms').classList.contains('hidden'))cmsCloudPullNow();
  });

  window.addEventListener('online',()=>{
    if(!$('#cms').classList.contains('hidden')){
      cmsCloudPushNow(cmsCloudChangeSeq).then(()=>cmsCloudPullNow());
    }
  });

  try{
    const bc=new BroadcastChannel('signwell-cms-cloud-v1');
    bc.onmessage=e=>{
      const msg=e.data||{};
      if(msg.type==='revision'&&msg.clientId!==cmsCloudClientId()){
        cmsCloudPullNow();
      }
    };
  }catch(_){}
}


function newsletterAbsolutePublicUrl(v=''){
  const s=String(v||'').trim();
  if(!s)return '';
  if(/^https?:\/\//i.test(s))return s;
  return 'https://signwell.com.tw/'+s.replace(/^\/+/,'');
}
function newsletterReadingMinutes(a){
  const text=plainFromHTML(articleHTML(a));
  const cjk=(text.match(/[\u3400-\u9fff]/g)||[]).length;
  const latin=(text.replace(/[\u3400-\u9fff]/g,' ').match(/[A-Za-z0-9]+/g)||[]).length;
  return Math.max(1,Math.ceil(cjk/450 + latin/200));
}
function newsletterRecommendationPayloads(excludeId=''){
  return data.articles.filter(x=>x.status==='Published'&&String(x.id)!==String(excludeId))
    .slice().sort((a,b)=>String(b.publishedAt||b.updatedAt||'').localeCompare(String(a.publishedAt||a.updatedAt||'')))
    .slice(0,3).map(a=>({
      category:a.category||'SIGN WELL',
      title:a.title||'未命名文章',
      excerpt:a.excerpt||plainFromHTML(articleHTML(a)).slice(0,88),
      url:`https://signwell.com.tw/article/${encodeURIComponent(slugify(a.slug||a.title||a.id))}/`
    }));
}
function newsletterHeroPayload(a){
  if(!a)return null;
  const slug=slugify(a.slug||a.title||a.id||'');
  return {
    articleId:a.id||slug,slug,
    title:a.title||'SIGN WELL 新文章',
    excerpt:a.excerpt||plainFromHTML(articleHTML(a)).slice(0,180),
    cover:newsletterAbsolutePublicUrl(a.cover||''),
    category:a.category||'SIGN WELL',
    readMinutes:newsletterReadingMinutes(a),
    publishedAt:a.publishedAt||new Date().toISOString().slice(0,10),
    url:`https://signwell.com.tw/article/${encodeURIComponent(slug)}/`,
    idempotencyKey:'article:'+slug,
    recommendations:newsletterRecommendationPayloads(a.id)
  };
}

let newsletterConfirmResolver=null;

function closeNewsletterSendConfirm(result=false){
  const wrap=$('#newsletterConfirmOverlay');
  if(!wrap)return;
  wrap.classList.remove('show');
  wrap.setAttribute('aria-hidden','true');
  wrap.inert=true;

  const resolver=newsletterConfirmResolver;
  newsletterConfirmResolver=null;
  setTimeout(()=>resolver?.(Boolean(result)),120);
}

function confirmNewsletterSendUI({count=0,subject='',hero=''}={}){
  const wrap=$('#newsletterConfirmOverlay');
  if(!wrap)return Promise.resolve(false);

  if(newsletterConfirmResolver){
    newsletterConfirmResolver(false);
    newsletterConfirmResolver=null;
  }

  $('#newsletterConfirmCount').textContent=`${Number(count||0).toLocaleString()} 位訂閱者`;
  $('#newsletterConfirmSubject').textContent=subject||'未設定主旨';
  $('#newsletterConfirmHero').textContent=hero||'純內容電子報';

  wrap.inert=false;
  wrap.classList.add('show');
  wrap.setAttribute('aria-hidden','false');

  requestAnimationFrame(()=>$('#newsletterConfirmSend')?.focus());

  return new Promise(resolve=>{
    newsletterConfirmResolver=resolve;
  });
}

$('#newsletterSendOverlay').inert=true;
$('#newsletterConfirmOverlay').inert=true;

$('#newsletterConfirmCancel').onclick=()=>closeNewsletterSendConfirm(false);
$('#newsletterConfirmSend').onclick=()=>closeNewsletterSendConfirm(true);
$('#newsletterConfirmOverlay').addEventListener('click',e=>{
  if(e.target===e.currentTarget)closeNewsletterSendConfirm(false);
});
document.addEventListener('keydown',e=>{
  const wrap=$('#newsletterConfirmOverlay');
  if(!wrap?.classList.contains('show'))return;

  if(e.key==='Escape'){
    e.preventDefault();
    closeNewsletterSendConfirm(false);
  }

  if(e.key==='Enter'&&document.activeElement?.id!=='newsletterConfirmCancel'){
    e.preventDefault();
    closeNewsletterSendConfirm(true);
  }
});

let newsletterStepupResolver=null;
function closeNewsletterStepup(value=null){
  const wrap=$('#newsletterStepupOverlay');
  const input=$('#newsletterStepupPassword');
  if(wrap){wrap.classList.remove('show');wrap.setAttribute('aria-hidden','true');wrap.inert=true}
  if(input)input.value='';
  const resolve=newsletterStepupResolver;newsletterStepupResolver=null;
  if(resolve)resolve(value);
}
function requestNewsletterStepupPassword({count=0,subject='',intent='manual'}={}){
  const wrap=$('#newsletterStepupOverlay');
  if(!wrap)return Promise.resolve(null);
  if(newsletterStepupResolver)closeNewsletterStepup(null);
  $('#newsletterStepupMeta').textContent=intent==='article'
    ?`文章通知 · ${Number(count||0).toLocaleString()} 位收件者`
    :`電子報群發 · ${Number(count||0).toLocaleString()} 位收件者`;
  $('#newsletterStepupSubject').textContent=String(subject||'未命名寄送');
  wrap.inert=false;wrap.classList.add('show');wrap.setAttribute('aria-hidden','false');
  setTimeout(()=>$('#newsletterStepupPassword')?.focus(),60);
  return new Promise(resolve=>{newsletterStepupResolver=resolve});
}
async function authorizeNewsletterSend(intent,sendPayload,{count=0,subject=''}={}){
  const password=await requestNewsletterStepupPassword({count,subject,intent});
  if(password===null)return null;
  const result=await newsletterRequest('/admin/newsletter/authorize-send',{
    method:'POST',timeoutMs:45000,
    body:JSON.stringify({intent,password,sendPayload,clientId:cmsAuthClientIdValue()})
  });
  const token=String(result?.sendAuthToken||'');
  if(!token)throw new Error('後端沒有簽發寄送授權');
  return token;
}

$('#newsletterStepupOverlay').inert=true;
$('#newsletterStepupCancel').onclick=()=>closeNewsletterStepup(null);
$('#newsletterStepupConfirm').onclick=()=>{
  const value=String($('#newsletterStepupPassword')?.value||'');
  if(!value){$('#newsletterStepupPassword')?.focus();return}
  if(!/^\d+$/.test(value)){showToast('CMS 管理密碼只能輸入數字');$('#newsletterStepupPassword')?.focus();return}
  closeNewsletterStepup(value);
};
$('#newsletterStepupOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeNewsletterStepup(null)});
document.addEventListener('keydown',e=>{
  const wrap=$('#newsletterStepupOverlay');if(!wrap?.classList.contains('show'))return;
  if(e.key==='Escape'){e.preventDefault();closeNewsletterStepup(null)}
  if(e.key==='Enter'){e.preventDefault();$('#newsletterStepupConfirm')?.click()}
});

function showNewsletterSendOverlay(mode='auto',count=0,subject=''){
  const wrap=$('#newsletterSendOverlay');if(!wrap)return;
  wrap.classList.remove('done','failed');

  const title=$('#newsletterSendTitle');
  const copy=$('#newsletterSendCopy');
  const meta=$('#newsletterSendMeta');
  const icon=$('#newsletterSendIcon');

  if(icon)icon.textContent='✦';
  if(title)title.textContent='正在送出';

  if(copy){
    copy.textContent=
      mode==='manual'
        ?`正在發送給 ${Number(count||0).toLocaleString()} 位訂閱者，請保持此頁面開啟。`
        :mode==='test'
          ?'正在發送 Glass Letter 測試信，完成後會顯示寄送結果。'
          :'正在自動發送新文章電子報給訂閱者。';
  }

  if(meta){
    meta.textContent=
      subject
        ?String(subject)
        :mode==='test'
          ?'signwell.com@gmail.com'
          :'Gmail · SIGN WELL Backend';
  }

  wrap.inert=false;
  wrap.classList.add('show');
  wrap.setAttribute('aria-hidden','false');
}

function completeNewsletterSendOverlay(message='電子報已發送完成',meta=''){
  const wrap=$('#newsletterSendOverlay');if(!wrap)return;
  wrap.classList.remove('failed');
  wrap.classList.add('done','show');

  const title=$('#newsletterSendTitle');
  const copy=$('#newsletterSendCopy');
  const metaEl=$('#newsletterSendMeta');
  const icon=$('#newsletterSendIcon');

  if(icon)icon.textContent='✓';
  if(title)title.textContent='寄送完成';
  if(copy)copy.textContent=message;
  if(metaEl&&meta)metaEl.textContent=meta;

  celebrateNewsletterSend(wrap.querySelector('.newsletter-send-card'));
}

function failNewsletterSendOverlay(message='電子報未能送出'){
  const wrap=$('#newsletterSendOverlay');if(!wrap)return;
  wrap.classList.remove('done');
  wrap.classList.add('failed','show');

  const title=$('#newsletterSendTitle');
  const copy=$('#newsletterSendCopy');
  const icon=$('#newsletterSendIcon');

  if(icon)icon.textContent='!';
  if(title)title.textContent='寄送失敗';
  if(copy)copy.textContent=message;
}

function hideNewsletterSendOverlay(){
  const wrap=$('#newsletterSendOverlay');if(!wrap)return;
  wrap.classList.remove('show','done','failed');
  wrap.setAttribute('aria-hidden','true');
  wrap.inert=true;
}


function resetNewsletterInteractionState(){
  clearTimeout(newsletterPreviewTimer);
  newsletterPreviewTimer=null;
  newsletterPreviewSeq++;
  newsletterPreviewMounted=false;
  newsletterPreviewDirty=true;

  const send=$('#newsletterSendOverlay');
  if(send){
    send.classList.remove('show','done','failed');
    send.setAttribute('aria-hidden','true');
    send.inert=true;
  }

  const confirm=$('#newsletterConfirmOverlay');
  if(confirm){
    confirm.classList.remove('show');
    confirm.setAttribute('aria-hidden','true');
    confirm.inert=true;
  }

  const stepup=$('#newsletterStepupOverlay');
  if(stepup){
    stepup.classList.remove('show');
    stepup.setAttribute('aria-hidden','true');
    stepup.inert=true;
  }
  if(newsletterStepupResolver){try{newsletterStepupResolver(null)}catch(_){};newsletterStepupResolver=null}

  if(newsletterConfirmResolver){
    try{newsletterConfirmResolver(false)}catch(_){}
    newsletterConfirmResolver=null;
  }

  const view=$('#view');
  if(view){
    view.style.pointerEvents='';
    view.style.touchAction='';
  }

  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('pointer-events');
}

function newsletterAutoEnabled(){
  const v=localStorage.getItem(NEWSLETTER_AUTO_KEY);
  return v===null ? true : v==='1';
}
function setNewsletterAutoEnabled(v){
  localStorage.setItem(NEWSLETTER_AUTO_KEY,v?'1':'0');
}
function articleNewsletterPayload(a){
  return newsletterHeroPayload(a)||{};
}
async function maybeAutoSendArticleNewsletter(a,{force=false,sourceEl=null}={}){
  if(!a||(!force&&!newsletterAutoEnabled()))return {attempted:false,success:false};
  if(!newsletterEnabled()){
    if(force)showToast('Newsletter Backend 尚未連線');
    return {attempted:true,success:false,error:'backend'};
  }
  if(!newsletterAdminKey()){
    if(force)showToast('請先到「電子報」輸入 Newsletter Admin Key');
    return {attempted:true,success:false,error:'admin-key'};
  }

  let diag;
  try{
    diag=await newsletterSubscriberPreflight();
  }catch(err){
    showToast('文章已發布，但無法確認訂閱者名單：'+(err?.message||err));
    return {attempted:true,success:false,error:err};
  }

  const sendable=Number(diag.sendable||0);
  if(sendable<=0){
    showToast('文章已發布 · 目前沒有可寄送的訂閱者');
    return {attempted:true,success:true,skipped:true};
  }

  const sendPayload={
    article:articleNewsletterPayload(a),
    audience:'active',
    force:Boolean(force)
  };
  let sendAuthToken='';
  try{
    sendAuthToken=await authorizeNewsletterSend('article',sendPayload,{count:sendable,subject:a?.title||'新文章'});
    if(!sendAuthToken){showToast('文章已發布 · 已取消電子報寄送');return {attempted:true,success:true,skipped:true,cancelled:true}}
  }catch(err){
    showToast('文章已發布，但寄送授權失敗：'+(err?.message||err));
    return {attempted:true,success:false,error:err};
  }

  let overlayShown=false;
  let watchdog=null;

  const overlayTimer=setTimeout(()=>{
    overlayShown=true;
    showNewsletterSendOverlay('auto',sendable,a?.title||'新文章');

    watchdog=setTimeout(()=>{
      if(!overlayShown)return;
      overlayShown=false;
      hideNewsletterSendOverlay();
      showToast('電子報仍在 Backend 發送中；CMS 已解除等待畫面。');
    },45000);
  },650);

  try{
    const body=await newsletterRequest('/admin/newsletter/send-article',{
      method:'POST',
      timeoutMs:300000,
      body:JSON.stringify({...sendPayload,sendAuthToken})
    });

    clearTimeout(overlayTimer);
    clearTimeout(watchdog);

    if(body.alreadySent){
      if(overlayShown){
        completeNewsletterSendOverlay('這篇文章先前已寄送過，不會重複寄送。');
        await sleep(420);
        hideNewsletterSendOverlay();
      }
      showToast('文章已發布 · 這篇電子報先前已寄送過');
      return {attempted:true,success:true,alreadySent:true,body};
    }

    const delivered=Number(body.delivered??body.recipients??0);

    if(overlayShown){
      completeNewsletterSendOverlay(`已完成寄送 · ${delivered.toLocaleString()} 位訂閱者`);
      await sleep(1000);
      hideNewsletterSendOverlay();
    }

    showToast(`文章已發布 · 電子報已寄送 ${delivered.toLocaleString()} 位訂閱者`);
    celebrateNewsletterSend(sourceEl);
    return {attempted:true,success:true,body};
  }catch(err){
    clearTimeout(overlayTimer);
    clearTimeout(watchdog);
    if(overlayShown)hideNewsletterSendOverlay();
    showToast('文章已發布，但電子報未送出：'+(err?.message||err));
    return {attempted:true,success:false,error:err};
  }
}


function newsletterBackendCurrent(){
  return String(newsletterCache.backendVersion||newsletterCache.summary?.backendVersion||'');
}
function newsletterBackendIsCurrent(){
  if(newsletterBackendCapability==='ok')return true;
  const v=parseFloat(newsletterBackendCurrent());
  return Number.isFinite(v)&&v>=3.7 &&
    String(newsletterCache.templateVersion||newsletterCache.summary?.templateVersion||'').includes('Glass');
}
function newsletterBackendStatusHTML(){
  const v=newsletterBackendCurrent();
  const endpoint=newsletterBase();
  const s=newsletterCache.summary||{};
  const senderReady=s.senderReady!==false;
  const otpReady=s.otpMail?.ready===true;
  const otpFallback=s.otpMail?.fallbackActive===true;
  const otpFrom=String(s.otpMail?.sendingFrom||'');

  const senderChip=`
    <span class="newsletter-sender-lock ${otpReady?'':'bad'}">
      ${otpReady?'✓':'!'} Gmail OTP ${otpReady?'READY':'BLOCKED'} · ${otpFallback?'暫由 Backend 代寄':'品牌寄件'}${otpFrom?' · '+escapeHTML(otpFrom):''}
    </span>
    <span class="newsletter-otp-actions">
      <button class="newsletter-otp-action" type="button" onclick="enableNewsletterGmailOtp(this)">${otpReady?'重新啟用':'啟用 Gmail OTP'}</button>
      <button class="newsletter-otp-action" type="button" onclick="testNewsletterGmailOtp(this)" ${otpReady?'':'disabled'}>寄測試驗證信</button>
    </span>`;

  const returnKey=`
    <button
      type="button"
      class="newsletter-return-key ${newsletterBackendCapability==='checking'?'is-checking':''}"
      id="nlBackendCheckBtn"
      onclick="recheckNewsletterBackend()"
      title="重新檢查 Backend"
      aria-label="重新檢查 Backend">↩</button>`;

  if(newsletterBackendCapability==='ok'||newsletterBackendIsCurrent()){
    return `<div class="newsletter-backend-alert newsletter-backend-ok">
      <div class="newsletter-backend-main">
        <div class="newsletter-backend-title-row">
          <strong>Backend ${v?`v${escapeHTML(v)}`:'v4.7'} · Glass Renderer 已同步</strong>
          ${returnKey}
        </div>
        <div>CMS 已直接驗證 admin.preview；預覽、測試信、手動群發與新文章自動電子報使用同一 renderer。</div>
        ${senderChip}
      </div>
    </div>`;
  }

  if(newsletterBackendCapability==='checking'){
    return `<div class="newsletter-backend-alert">
      <div class="newsletter-backend-main">
        <div class="newsletter-backend-title-row">
          <strong>正在檢查 Backend…</strong>
          ${returnKey}
        </div>
        <div>正在重新驗證 Glass Renderer、訂閱名單與寄件者狀態。</div>
      </div>
    </div>`;
  }

  if(newsletterBackendCapability==='old'){
    return `<div class="newsletter-backend-alert">
      <div class="newsletter-backend-main">
        <div class="newsletter-backend-title-row">
          <strong>目前 CMS 尚未收到 Backend Glass Renderer 回應${v?` · 回報 v${escapeHTML(v)}`:''}</strong>
          ${returnKey}
        </div>
        <div>${newsletterBackendCapabilityError?escapeHTML(newsletterBackendCapabilityError)+'。':''}</div>
        <div style="margin-top:8px;word-break:break-all;opacity:.72">${escapeHTML(endpoint)}</div>
      </div>
    </div>`;
  }

  return `<div class="newsletter-backend-alert">
    <div class="newsletter-backend-main">
      <div class="newsletter-backend-title-row">
        <strong>尚未完成 Backend 能力檢查</strong>
        ${returnKey}
      </div>
      <div>按 ↩ 重新驗證 Glass Renderer 與寄件者。</div>
    </div>
  </div>`;
}

function resizeNewsletterPreviewFrame(frame){
  if(!frame)return;
  // Fixed height avoids Safari repeatedly reflowing a large srcdoc iframe
  // inside the CMS overflow scroller.
  const mobile=matchMedia('(max-width:900px),(pointer:coarse)').matches;
  frame.style.height=(mobile?520:620)+'px';
}


async function refreshNewsletterExactPreview({force=false}={}){
  if(document.hidden||viewName!=='newsletter'||$('#cms')?.classList.contains('hidden'))return;
  if(!newsletterPreviewMounted&&!force)return;

  const shell=$('#nlExactPreviewShell');
  const frame=$('#nlExactPreview');
  if(!shell||!frame)return;

  newsletterPreviewMounted=true;
  newsletterPreviewDirty=false;

  frame.hidden=false;
  shell.classList.add('preview-loaded');

  const placeholder=$('#nlPreviewPlaceholder');
  if(placeholder){
    placeholder.hidden=true;
    placeholder.setAttribute('aria-hidden','true');
  }

  const seq=++newsletterPreviewSeq;
  newsletterBackendCapability='checking';
  newsletterBackendCapabilityError='';
  shell.classList.add('loading');

  const refreshBtn=$('#nlPreviewRefreshBtn');
  if(refreshBtn){
    refreshBtn.disabled=true;
    refreshBtn.textContent='更新中…';
  }

  try{
    const result=await newsletterRequest('/admin/newsletter/preview',{
      method:'POST',
      timeoutMs:45000,
      body:JSON.stringify(newsletterDraft())
    });

    if(seq!==newsletterPreviewSeq)return;

    const html=String(result?.html||'');
    if(!html.trim())throw new Error('Backend preview 沒有回傳 HTML');

    newsletterBackendCapability='ok';
    newsletterCache.backendVersion=String(result.backendVersion||newsletterCache.backendVersion||'');
    newsletterCache.templateVersion=String(result.templateVersion||newsletterCache.templateVersion||'SIGN WELL Letter · Glass');

    frame.onload=()=>resizeNewsletterPreviewFrame(frame);
    frame.srcdoc=html;
    resizeNewsletterPreviewFrame(frame);

    const stalePlaceholder=$('#nlPreviewPlaceholder');
    if(stalePlaceholder)stalePlaceholder.remove();

    const status=$('#nlBackendStatusDynamic');
    if(status)status.innerHTML=newsletterBackendStatusHTML();

    const badge=$('#nlPreviewBackendBadge');
    if(badge)badge.textContent=`Backend v${newsletterBackendCurrent()||'4.7'} · LIVE`;
  }catch(err){
    if(seq!==newsletterPreviewSeq)return;

    newsletterBackendCapability='old';
    newsletterBackendCapabilityError=String(err?.message||err||'Backend 不支援 admin.preview');

    frame.srcdoc=`<!doctype html><meta charset="utf-8">
      <style>
        body{margin:0;background:#edf6fc;font:14px -apple-system,BlinkMacSystemFont,sans-serif;color:#718695;display:grid;place-items:center;min-height:420px;padding:28px;text-align:center}
        strong{display:block;color:#48687d;font-size:20px;margin-bottom:10px}
        p{max-width:520px;line-height:1.7}
      

/* ============================================================
   CMS v14.56 · publish receipts / persistent news / provider settings
   ============================================================ */
.workspace{position:relative}
#view.medical-news-view-hidden{display:none!important}
.medical-news-persistent,.medical-news-persistent[hidden]{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;min-height:0!important;overflow:hidden!important}
.medical-news-persistent.show{display:block!important;visibility:visible!important;pointer-events:auto!important;height:auto!important;min-height:0!important;padding:24px;overflow:hidden}
.medical-news-persistent.show .medical-news-shell{height:calc(100dvh - 116px);min-height:680px}
@media(max-width:900px){.medical-news-persistent.show{padding:16px}.medical-news-persistent.show .medical-news-shell{height:calc(100dvh - 104px);min-height:620px}}
#confirmDelete{
  background:linear-gradient(145deg,#e45f69,#c94350)!important;
  color:#fff!important;
  border-color:transparent!important;
  box-shadow:0 12px 28px rgba(191,55,68,.24),inset 0 1px 0 rgba(255,255,255,.22)!important;
}
#confirmDelete:hover{background:linear-gradient(145deg,#ec6a74,#c93f4d)!important;transform:translateY(-1px)}
.ai-provider-settings-card{grid-column:1/-1!important;position:relative;overflow:hidden}
.ai-provider-settings-card::before{content:"";position:absolute;inset:-45% auto auto -8%;width:360px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(113,181,242,.15),transparent 68%);pointer-events:none}
.ai-provider-settings-card>*{position:relative}
.ai-provider-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.ai-provider-head h3{margin:0 0 5px}.ai-provider-head p{margin:0;max-width:760px}
.ai-provider-state{padding:7px 10px;border-radius:999px;background:rgba(121,139,155,.10);color:#667b8d;font-size:9px;font-weight:800;white-space:nowrap}
.ai-provider-state.ready{background:rgba(75,160,118,.11);color:#4a8767}
.ai-provider-form{display:grid;grid-template-columns:1.35fr .65fr;gap:10px;margin-top:16px}
.ai-provider-form label{display:grid;gap:6px;color:#758797;font-size:9px;font-weight:800;letter-spacing:.04em}
.ai-provider-form label.wide{grid-column:1/-1}
.ai-provider-form input{width:100%;min-height:44px;border:1px solid rgba(87,107,126,.13);border-radius:14px;background:rgba(255,255,255,.64);padding:0 12px;outline:0;color:#24394c;font-size:11px}
.ai-provider-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
@media(max-width:900px){.ai-provider-form{grid-template-columns:1fr}.ai-provider-form label.wide{grid-column:auto}}

</style>
      <div>
        <strong>暫時無法取得 Glass Letter 預覽</strong>
        <p>${escapeHTML(newsletterBackendCapabilityError)}</p>
        <p>CMS 本身仍可操作；修正 Backend 後再按「更新預覽」即可。</p>
      </div>`;

    resizeNewsletterPreviewFrame(frame);

    const status=$('#nlBackendStatusDynamic');
    if(status)status.innerHTML=newsletterBackendStatusHTML();

    const badge=$('#nlPreviewBackendBadge');
    if(badge)badge.textContent='PREVIEW UNAVAILABLE';
  }finally{
    if(seq===newsletterPreviewSeq)shell.classList.remove('loading');

    const fresh=$('#nlPreviewRefreshBtn');
    if(fresh){
      fresh.disabled=false;
      fresh.textContent='更新預覽';
    }
  }
}

function scheduleNewsletterExactPreview(){
  newsletterPreviewDirty=true;

  const badge=$('#nlPreviewBackendBadge');
  if(badge&&newsletterPreviewMounted)badge.textContent='內容已變更';

  if(!newsletterPreviewMounted)return;

  clearTimeout(newsletterPreviewTimer);
  newsletterPreviewTimer=setTimeout(()=>{
    newsletterPreviewTimer=null;
    if(document.hidden||viewName!=='newsletter')return;
    refreshNewsletterExactPreview({force:true});
  },1100);
}

async function newsletterSubscriberPreflight(){
  const diag=await newsletterRequest('/admin/newsletter/diagnostics',{
    method:'POST',
    timeoutMs:30000,
    body:JSON.stringify({})
  });

  const count=Number(diag.sendable||0);

  if(diag.backendVersion){
    newsletterCache.backendVersion=String(diag.backendVersion);
  }
  if(diag.templateVersion){
    newsletterCache.templateVersion=String(diag.templateVersion);
  }

  newsletterBackendCapability='ok';
  newsletterBackendCapabilityError='';

  if(newsletterCache.summary){
    newsletterCache.summary.active=count;
    newsletterCache.summary.sendable=count;
    newsletterCache.summary.pending=Number(diag.pending||0);
    newsletterCache.summary.otpPending=Number(diag.otpPending||0);
    newsletterCache.summary.otpSent24h=Number(diag.otpSent24h||0);
    newsletterCache.summary.otpVerified24h=Number(diag.otpVerified24h||0);
    newsletterCache.summary.repaired=Number(diag.repaired||0);
    newsletterCache.summary.statusBreakdown=diag.statusBreakdown||{};
  }

  return diag;
}


async function enableNewsletterGmailOtp(btn){
  const el=btn instanceof HTMLElement?btn:null;
  try{
    if(el){el.disabled=true;el.textContent='啟用中…';}
    const r=await newsletterRequest('/admin/newsletter/otp-enable',{method:'POST',timeoutMs:45000,body:'{}'});
    if(!newsletterCache.summary)newsletterCache.summary={};
    newsletterCache.summary.otpMail=r||{};
    showToast(r?.ready?`Gmail OTP 已啟用 · ${r?.fallbackActive?'Backend 暫代寄件':'品牌寄件已就緒'}`:'Gmail OTP 尚未就緒');
    await refreshNewsletterData();
  }catch(err){
    showToast('Gmail OTP 啟用失敗：'+String(err?.message||err));
  }finally{
    if(el){el.disabled=false;el.textContent='重新啟用';}
  }
}

async function testNewsletterGmailOtp(btn){
  const el=btn instanceof HTMLElement?btn:null;
  try{
    if(el){el.disabled=true;el.textContent='寄送中…';}
    const r=await newsletterRequest('/admin/newsletter/otp-test',{method:'POST',timeoutMs:60000,body:'{}'});
    showToast(r?.sent?`測試驗證信已寄出 · ${r?.to||''}`:'測試驗證信未寄出');
    await refreshNewsletterData();
  }catch(err){
    showToast('測試驗證信失敗：'+String(err?.message||err));
  }finally{
    if(el){el.disabled=false;el.textContent='寄測試驗證信';}
  }
}

async function recheckNewsletterBackend(){
  const btn=$('#nlBackendCheckBtn');
  try{
    if(btn){
      btn.disabled=true;
      btn.classList.add('is-checking');
      btn.setAttribute('aria-label','檢查中');
    }
    await refreshNewsletterExactPreview();

    if(newsletterBackendCapability==='ok'){
      try{
        const diag=await newsletterSubscriberPreflight();
        showToast(`Backend / Bridge 已同步 · 可寄送 ${Number(diag.sendable||0).toLocaleString()} 位訂閱者`);
        await refreshNewsletterData();
      }catch(_){
        showToast('Glass Renderer 已同步；訂閱者診斷將於下次重新整理更新。');
      }
    }else{
      showToast('目前 /exec 仍是舊 Backend deployment version');
    }
  }finally{
    const fresh=$('#nlBackendCheckBtn');
    if(fresh){
      fresh.disabled=false;
      fresh.classList.remove('is-checking');
      fresh.textContent='↩';
      fresh.setAttribute('aria-label','重新檢查 Backend');
    }
  }
}

function openNewsletterBackendHealth(){
  const endpoint=newsletterBase();
  if(!endpoint){showToast('目前沒有設定 Backend endpoint');return}
  window.open(endpoint+'?action=health&_='+Date.now(),'_blank','noopener,noreferrer');
}

function newsletterStatusBreakdownText(summary){
  const b=summary?.statusBreakdown||{};
  const entries=Object.entries(b);
  if(!entries.length)return '—';
  return entries.map(([k,v])=>`${k}: ${Number(v).toLocaleString()}`).join(' · ');
}

async function refreshNewsletterData(){
  if(!newsletterEnabled()){
    newsletterCache={summary:null,subscribers:[],campaigns:[]};
    if(viewName==='newsletter')renderNewsletterCenter();
    else if(viewName==='dashboard')refreshDashboardNewsletterSnapshot();
    return;
  }
  try{
    const [summary,subs,camps]=await Promise.all([
      newsletterRequest('/admin/newsletter/summary'),
      newsletterRequest('/admin/newsletter/subscribers?limit=5'),
      newsletterRequest('/admin/newsletter/campaigns?limit=6')
    ]);
    newsletterCache={
      summary:summary||null,
      subscribers:Array.isArray(subs?.items)?subs.items:[],
      campaigns:Array.isArray(camps?.items)?camps.items:[],
      backendVersion:String(summary?.backendVersion||''),
      templateVersion:String(summary?.templateVersion||'')
    };

    /* Release 23.4: diagnostics are read-only. They may validate status,
       but must never promote pending subscribers. */
    if(newsletterBackendIsCurrent() &&
       Number(newsletterCache.summary?.active||0)===0 &&
       Number(newsletterCache.summary?.total||0)>0){
      try{await newsletterSubscriberPreflight()}catch(_){}
    }
  }catch(err){
    newsletterCache.error=err?.message||String(err);
  }
  if(viewName==='newsletter'){
    const activeEl=document.activeElement;
    const composing=Boolean(
      activeEl?.closest?.('.newsletter-composer-panel') &&
      activeEl.matches?.('input,textarea,select,button')
    );

    if(!composing){
      renderNewsletterCenter();
    }else{
      const metrics=$$('.newsletter-metric strong');
      if(metrics[0])metrics[0].textContent=Number(newsletterCache.summary?.active||0).toLocaleString();
      if(metrics[1])metrics[1].textContent=Number(newsletterCache.summary?.otpPending||0).toLocaleString();
      if(metrics[2])metrics[2].textContent=Number(newsletterCache.summary?.newThisMonth||0).toLocaleString();
      if(metrics[3])metrics[3].textContent=Number(newsletterCache.summary?.campaignsSent||0).toLocaleString();
    }
  }else if(viewName==='dashboard')refreshDashboardNewsletterSnapshot();
}

function fillNewsletterFromLatest(){
  const a=data.articles.filter(x=>x.status==='Published').slice()
    .sort((x,y)=>String(y.publishedAt||'').localeCompare(String(x.publishedAt||'')))[0]||data.articles[0];
  if(!a){showToast('目前沒有文章可帶入');return}
  const subject=$('#nlSubject'),pre=$('#nlPreheader'),body=$('#nlBody'),hero=$('#nlHeroArticle');
  if(subject)subject.value=`SIGN WELL｜${a.title||'新文章'}`;
  if(pre)pre.value=(a.excerpt||plainFromHTML(articleHTML(a)).slice(0,90));
  if(body)body.value=(a.excerpt||plainFromHTML(articleHTML(a)).slice(0,220));
  if(hero)hero.value=String(a.id||'');
  updateNewsletterComposerPreview();
  showToast('已從最新文章建立 Glass Letter 草稿');
}
function newsletterDraft(){
  const heroId=String($('#nlHeroArticle')?.value||'').trim();
  const hero=heroId?data.articles.find(a=>String(a.id)===heroId):null;
  return {
    subject:String($('#nlSubject')?.value||'').trim(),
    preheader:String($('#nlPreheader')?.value||'').trim(),
    content:String($('#nlBody')?.value||'').trim(),
    heroArticle:hero?newsletterHeroPayload(hero):null,
    recommendations:newsletterRecommendationPayloads(hero?.id||'')
  };
}

function celebrateNewsletterSend(originEl=null){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    originEl?.classList.add('newsletter-send-success');
    setTimeout(()=>originEl?.classList.remove('newsletter-send-success'),500);
    return;
  }

  document.getElementById('newsletterConfetti')?.remove();

  const layer=document.createElement('div');
  layer.id='newsletterConfetti';
  layer.setAttribute('aria-hidden','true');
  document.body.appendChild(layer);

  const colors=[
    '#77BDEB','#A7D9F6','#8FD0BD','#D7ECFA',
    '#FFFFFF','#719BC0','#B8DCEB'
  ];

  const rect=originEl?.getBoundingClientRect?.();
  const cx=rect?rect.left+rect.width/2:innerWidth/2;
  const cy=rect?rect.top+rect.height/2:innerHeight*.56;

  const pieces=Math.min(58,Math.max(38,Math.round(innerWidth/18)));

  for(let i=0;i<pieces;i++){
    const el=document.createElement('i');
    el.className='sw-confetti-piece';

    const theta=(-155+(310*(i/(pieces-1))))*Math.PI/180;
    const spread=120+Math.random()*Math.min(260,innerWidth*.28);
    const dx=Math.cos(theta)*spread;
    const up=80+Math.random()*160;
    const dy=Math.sin(theta)*spread-up+180+Math.random()*120;

    const w=5+Math.random()*7;
    const h=3+Math.random()*8;
    const isRound=Math.random()<.22;

    el.style.setProperty('--x',cx+'px');
    el.style.setProperty('--y',cy+'px');
    el.style.setProperty('--dx',dx.toFixed(1)+'px');
    el.style.setProperty('--dy',dy.toFixed(1)+'px');
    el.style.setProperty('--w',w.toFixed(1)+'px');
    el.style.setProperty('--h',h.toFixed(1)+'px');
    el.style.setProperty('--r',isRound?'50%':'2px');
    el.style.setProperty('--c',colors[i%colors.length]);
    el.style.setProperty('--rot',(Math.random()*180).toFixed(0)+'deg');
    el.style.setProperty('--spin',((Math.random()>.5?1:-1)*(240+Math.random()*620)).toFixed(0)+'deg');
    el.style.setProperty('--dur',(900+Math.random()*850).toFixed(0)+'ms');
    el.style.setProperty('--delay',(Math.random()*120).toFixed(0)+'ms');

    layer.appendChild(el);
  }

  originEl?.classList.add('newsletter-send-success');
  setTimeout(()=>originEl?.classList.remove('newsletter-send-success'),760);
  setTimeout(()=>layer.remove(),2100);
}

async function sendNewsletterTest(){
  const draft=newsletterDraft();
  if(!draft.subject||!draft.content){showToast('請先填寫主旨與內容');return}

  if(newsletterBackendCapability!=='ok'){
    await refreshNewsletterExactPreview();
    if(newsletterBackendCapability!=='ok'){
      showToast('目前 /exec 仍不支援 Glass Renderer；請先更新 Backend deployment。');
      return;
    }
  }

  const b=$('#nlTestBtn');
  let shown=false;
  const wait=setTimeout(()=>{
    shown=true;
    showNewsletterSendOverlay('test',1,draft.subject);
  },220);

  try{
    if(b){b.disabled=true;b.textContent='寄送中…'}
    const result=await newsletterRequest('/admin/newsletter/test',{
      method:'POST',
      timeoutMs:90000,
      body:JSON.stringify(draft)
    });

    clearTimeout(wait);
    if(!shown){
      shown=true;
      showNewsletterSendOverlay('test',1,draft.subject);
    }

    completeNewsletterSendOverlay('Glass Letter 測試信已寄至 signwell.com@gmail.com','TEST DELIVERY');
    showToast('測試信發送成功 ✓');

    await sleep(1250);
    hideNewsletterSendOverlay();
    shown=false;
  }catch(err){
    clearTimeout(wait);
    if(shown)hideNewsletterSendOverlay();
    showToast('測試信失敗：'+(err?.message||err));
  }finally{
    if(b){b.disabled=false;b.textContent='發送測試信'}
  }
}
async function sendNewsletterAll(){
  const draft=newsletterDraft();

  if(!draft.subject||!draft.content){showToast('請先填寫主旨與內容');return}
  if(!newsletterEnabled()){showToast('Newsletter Backend 尚未連線');return}
  if(!newsletterAdminKey()){showToast('請先輸入 Newsletter Admin Key');return}

  const b=$('#nlSendBtn');

  /* Always scan the actual Subscribers sheet immediately before sending.
     Do not trust a stale CMS card count. */
  let diag;
  try{
    if(b){b.disabled=true;b.textContent='檢查訂閱者…'}
    diag=await newsletterSubscriberPreflight();
  }catch(err){
    if(b){b.disabled=false;b.textContent='重新檢查後發送'}
    showToast('無法讀取訂閱者名單：'+(err?.message||err));
    return;
  }

  const count=Number(diag.sendable||0);

  if(count<=0){
    if(b){b.disabled=false;b.textContent='目前 0 位可寄送'}
    showToast(`Subscribers Sheet 有 ${Number(diag.totalRows||0).toLocaleString()} 筆，但目前沒有可寄送 Email。`);
    return;
  }

  const heroId=String($('#nlHeroArticle')?.value||'');
  const heroArticle=heroId?data.articles.find(a=>String(a.id)===heroId):null;

  const approved=await confirmNewsletterSendUI({
    count,
    subject:draft.subject,
    hero:heroArticle?.title||'純內容電子報'
  });

  if(!approved){
    if(b){b.disabled=false;b.textContent=`一鍵發送 ${count.toLocaleString()} 位訂閱者`}
    showToast('已取消本次寄送');
    return;
  }

  const sendPayload={...draft,audience:'active'};
  let sendAuthToken='';
  try{
    sendAuthToken=await authorizeNewsletterSend('manual',sendPayload,{count,subject:draft.subject});
    if(!sendAuthToken){
      if(b){b.disabled=false;b.textContent=`一鍵發送 ${count.toLocaleString()} 位訂閱者`}
      showToast('已取消本次寄送');
      return;
    }
  }catch(err){
    if(b){b.disabled=false;b.textContent=`重新檢查後發送`}
    showToast('寄送授權失敗：'+(err?.message||err));
    return;
  }

  let overlayShown=false;
  let watchdog=null;

  const timer=setTimeout(()=>{
    overlayShown=true;
    showNewsletterSendOverlay('manual',count,draft.subject);

    /* Avoid an apparently endless overlay. If Apps Script takes unusually
       long, dismiss the blocking layer and keep the request alive. */
    watchdog=setTimeout(()=>{
      if(!overlayShown)return;
      overlayShown=false;
      hideNewsletterSendOverlay();
      showToast('寄送仍在 Backend 處理中；CMS 已解除等待畫面。');
    },45000);
  },450);

  try{
    if(b){b.disabled=true;b.textContent='正在發送…'}

    const result=await newsletterRequest('/admin/newsletter/send',{
      method:'POST',
      timeoutMs:300000,
      body:JSON.stringify({...sendPayload,sendAuthToken})
    });

    clearTimeout(timer);
    clearTimeout(watchdog);

    const delivered=Number(result.delivered??result.recipients??0);

    if(!overlayShown){
      overlayShown=true;
      showNewsletterSendOverlay('manual',count,draft.subject);
    }

    completeNewsletterSendOverlay(
      `已成功寄送給 ${delivered.toLocaleString()} 位訂閱者`,
      'SIGN WELL Letter · Gmail'
    );

    showToast(`電子報已成功送出 · ${delivered.toLocaleString()} 位`);

    await sleep(1350);
    hideNewsletterSendOverlay();
    overlayShown=false;

    await refreshNewsletterData();
  }catch(err){
    clearTimeout(timer);
    clearTimeout(watchdog);

    if(!overlayShown){
      overlayShown=true;
      showNewsletterSendOverlay('manual',count,draft.subject);
    }

    failNewsletterSendOverlay('發送失敗：'+(err?.message||err));
    showToast('發送失敗：'+(err?.message||err));

    await sleep(1300);
    hideNewsletterSendOverlay();
    overlayShown=false;
  }finally{
    if(b){
      b.disabled=false;
      b.textContent=`一鍵發送 ${Number(newsletterCache.summary?.active||count||0).toLocaleString()} 位訂閱者`;
    }
  }
}

function newsletterHeroOptionsHTML(){
  const published=data.articles.filter(a=>a.status==='Published').slice()
    .sort((a,b)=>String(b.publishedAt||b.updatedAt||'').localeCompare(String(a.publishedAt||a.updatedAt||'')));
  return `<option value="">純內容電子報 · 前往 SIGN WELL</option>`+
    published.map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.title||'未命名文章')}</option>`).join('');
}
function updateNewsletterComposerPreview(){
  scheduleNewsletterExactPreview();
}


function repairNewsletterHitTargets(){
  if(viewName!=='newsletter')return;

  const root=$('#view');
  if(!root)return;

  /*
   * Repair actual controls by looking at the browser's hit-test stack.
   * If another element is above a control at its center point, that element
   * is neutralized only when it is NOT the control, its child, or its parent.
   * This catches stale decorative/fullscreen layers without touching the
   * newsletter control itself.
   */
  const controls=[
    ...root.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), label'
    )
  ];

  const repaired=new Set();

  controls.forEach(control=>{
    const r=control.getBoundingClientRect();
    if(r.width<2||r.height<2)return;

    const x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2));
    const y=Math.max(0,Math.min(innerHeight-1,r.top+Math.min(r.height/2,24)));

    const stack=document.elementsFromPoint(x,y);
    const ownIndex=stack.findIndex(el=>el===control || control.contains(el));

    if(ownIndex<=0)return;

    stack.slice(0,ownIndex).forEach(blocker=>{
      if(!blocker || blocker===document.documentElement || blocker===document.body)return;
      if(blocker.contains(control) || control.contains(blocker))return;
      if(blocker.matches('button,input,textarea,select,label,a'))return;

      const style=getComputedStyle(blocker);
      if(style.pointerEvents==='none' || style.display==='none' || style.visibility==='hidden')return;

      blocker.classList.add('sw-newsletter-hit-passthrough');
      repaired.add(blocker);
    });
  });

  if(repaired.size){
    console.warn(
      `[SIGN WELL CMS] repaired ${repaired.size} newsletter hit-test blocker(s).`,
      [...repaired]
    );
  }
}

function scheduleNewsletterHitRepair(){
  if(viewName!=='newsletter')return;
  requestAnimationFrame(()=>{
    repairNewsletterHitTargets();
    requestAnimationFrame(repairNewsletterHitTargets);
  });
  setTimeout(repairNewsletterHitTargets,120);
  setTimeout(repairNewsletterHitTargets,420);
}

/*
 * Last-resort live repair:
 * if Safari reports a click/pointer target outside the Newsletter controls,
 * but a real control exists underneath at that coordinate, make the blocker
 * transparent to pointer hit-testing before the click completes.
 */
document.addEventListener('pointerdown',e=>{
  if(viewName!=='newsletter')return;

  const root=$('#view');
  if(!root)return;

  const stack=document.elementsFromPoint(e.clientX,e.clientY);
  const control=stack.find(el=>
    el?.matches?.(
      '#view button:not(:disabled), #view input:not(:disabled), #view textarea:not(:disabled), #view select:not(:disabled), #view label'
    )
  );

  if(!control)return;

  const top=stack[0];
  if(top===control || control.contains(top))return;

  if(top &&
     !top.matches?.('button,input,textarea,select,label,a') &&
     !top.contains(control) &&
     !control.contains(top)){
    top.classList.add('sw-newsletter-hit-passthrough');
  }
},true);


function renderNewsletterCenter(){
  resetNewsletterInteractionState();
  const s=newsletterCache.summary||{},connected=newsletterEnabled();
  const subs=(newsletterCache.subscribers||[])
    .slice()
    .sort((a,b)=>String(b.subscribedAt||'').localeCompare(String(a.subscribedAt||'')))
    .slice(0,5),
    camps=newsletterCache.campaigns||[];

  $('#view').innerHTML=`<div class="page-head">
    <div><h1>電子報</h1><p>SIGN WELL Letter · 使用 Glass Letter 範本管理自動文章通知與手動群發。</p></div>
    <button class="top-action" id="nlRefresh">重新整理</button>
  </div>
  <div class="newsletter-summary">
    <div class="newsletter-metric"><span>可寄送訂閱者</span><strong>${Number(s.active||0).toLocaleString()}</strong></div>
    <div class="newsletter-metric"><span>OTP 待驗證</span><strong>${Number(s.otpPending||0).toLocaleString()}</strong></div>
    <div class="newsletter-metric"><span>本月新增</span><strong>${Number(s.newThisMonth||0).toLocaleString()}</strong></div>
    <div class="newsletter-metric"><span>已寄送電子報</span><strong>${Number(s.campaignsSent||0).toLocaleString()}</strong></div>
  </div>
  ${Number(s.otpPending||0)>0?`<div class="newsletter-pending-action">
    <div><strong>${Number(s.otpPending||0).toLocaleString()} 組 6 位數 OTP 等待驗證</strong>驗證資料只存在暫存表，Email 尚未進入 Subscribers 正式名單；只有 5 分鐘內輸入正確驗證碼後才會成為可寄送訂閱者。</div>
  </div>`:''}
  <div class="newsletter-statusbar">
    <div><b>${connected?'Backend 已設定':'Backend 尚未連線'}</b><br>${connected?(newsletterCache.error||'Google Sheet · 6 位數 Email OTP · Gmail · SIGN WELL Letter Glass 已共用同一 Backend'):'先完成 Newsletter Backend 後，這裡會自動顯示真實訂閱資料。'}</div>
    <span>${connected?'ONLINE':'SETUP'}</span>
  </div>
  <div class="newsletter-diag"><strong>Backend：</strong>${escapeHTML(newsletterBackendCurrent()||'舊版 / 無版本回報')} · <strong>正式名單：</strong>${Number(s.total||0).toLocaleString()} 筆 / 可寄送 ${Number(s.active||0).toLocaleString()} 位 · <strong>OTP Mail：</strong>${s.otpMail?.ready?'READY':'BLOCKED'} · <strong>OTP：</strong>近 24h 寄出 ${Number(s.otpSent24h||0).toLocaleString()} / 驗證成功 ${Number(s.otpVerified24h||0).toLocaleString()} · 狀態 ${escapeHTML(newsletterStatusBreakdownText(s))}</div>
  <div class="newsletter-grid">
    <section class="newsletter-panel newsletter-composer-panel">
      <h3>建立 SIGN WELL Letter</h3>
      <p>左側只負責內容與寄送控制；右側固定顯示實際寄出的 Glass Letter。</p>

      <div id="nlBackendStatusDynamic">${newsletterBackendStatusHTML()}</div>
<div class="newsletter-formgrid">
        <label>主推文章<select id="nlHeroArticle">${newsletterHeroOptionsHTML()}</select></label>
        <label>主旨<input id="nlSubject" placeholder="SIGN WELL｜本週醫學精選"></label>
        <label>預覽文字<input id="nlPreheader" placeholder="收件匣中顯示的簡短摘要"></label>
        <label>內容<textarea id="nlBody" placeholder="寫下這封電子報要傳達的內容…"></textarea></label>
        <label>測試收件信箱<input id="nlTestEmail" type="email" value="signwell.com@gmail.com" readonly aria-readonly="true"><small style="display:block;margin-top:5px;color:#8a98a3;font-size:8.5px">測試信固定寄給 SIGN WELL 自己，無法從 CMS 更改。</small></label>
      </div>

      <div class="newsletter-actions">
        <button id="nlFillArticle">從最新文章帶入</button>
        <button id="nlTestBtn">發送測試信</button>
        <button class="primary" id="nlSendBtn">一鍵發送 ${Number(s.active||0).toLocaleString()} 位訂閱者</button>
      </div>

      <label class="newsletter-toggle">
        <input type="checkbox" id="nlAuto" ${newsletterAutoEnabled()?'checked':''}>
        <span><strong>新文章發布後自動寄送 Glass Letter</strong><span>預設啟用。只有 GitHub 網站成功發布後才開始寄送；同一文章 slug 會防止重複自動群發。</span></span>
      </label>

      <div class="newsletter-admin-key">
        <div class="newsletter-key-shield" role="note" aria-label="CMS 伺服器登入工作階段已啟用" tabindex="-1">
          <span class="key-lock-icon" aria-hidden="true">⌁</span>
          <span class="dots" aria-hidden="true">••••••••••••••</span>
          <span class="label">SERVER SESSION</span>
        </div>
      </div>
      <div class="newsletter-warning">管理 API 由本次 CMS 登入取得的短效伺服器 session 授權；HTML 不再包含預設 Admin Key、登入密碼或答案雜湊。</div><div class="newsletter-warning"><b>OTP：</b>驗證成功後才寫入正式 Subscribers 名單；暫存驗證資料不會被當成訂閱者寄信。</div>
    </section>

    <section class="newsletter-panel newsletter-preview-panel">
      <div class="newsletter-preview-toolbar">
        <div class="newsletter-preview-caption" style="margin:0">
          <div>
            <strong>實際寄送預覽</strong>
            <span>為避免 Safari / iPad 被大型 iframe 卡住，預覽改成需要時才載入。</span>
          </div>
        </div>
        <div class="right">
          <button class="top-action" type="button" id="nlPreviewLoadBtn">載入預覽</button>
          <button class="top-action" type="button" id="nlPreviewRefreshBtn" hidden>更新預覽</button>
        </div>
      </div>

      <div class="newsletter-exact-preview" id="nlExactPreviewShell">
        <div class="newsletter-exact-preview-head">
          <span>實際寄送 HTML · EXACT PREVIEW</span>
          <span id="nlPreviewBackendBadge">按「載入預覽」</span>
        </div>
        <div class="newsletter-preview-loading">同步正式電子報預覽中…</div>
        <div class="newsletter-preview-placeholder" id="nlPreviewPlaceholder">
          <div>
            <strong>Glass Letter 預覽目前未載入</strong>
            <span>內容編輯、測試信、群發與其他 CMS 操作都不需要先載入預覽。需要確認版面時再按上方按鈕即可。</span>
          </div>
        </div>
        <iframe hidden class="newsletter-exact-preview-frame" id="nlExactPreview" title="SIGN WELL Letter 實際寄送預覽" sandbox="allow-same-origin"></iframe>
      </div>
    </section>

    <section class="newsletter-panel newsletter-history-panel">
      <div class="newsletter-history-grid">
        <div class="newsletter-history-block">
          <h3>最近訂閱者</h3>
          <p>依訂閱時間顯示最近 5 位；完整名單仍保留於 Subscribers Sheet。</p>
          <div class="newsletter-list">${subs.length?subs.map(x=>{
            const unsub=String(x.status||'').toLowerCase()==='unsubscribed';
            const meta=unsub
              ?`${x.subscribedAt||''}${x.unsubscribeReason?` · 退訂：${x.unsubscribeReason}`:''}`
              :(x.subscribedAt||'');
            return `<div class="newsletter-row ${unsub?'is-unsubscribed':''}">
              <div>
                <strong>${escapeHTML(x.emailMasked||x.email||'—')}</strong>
                <small class="${unsub?'unsub-meta':''}">${escapeHTML(meta)}</small>
              </div>
              <span class="newsletter-chip ${unsub?'unsubscribed':''}">${unsub?'已退訂':escapeHTML(x.status||'active')}</span>
            </div>`;
          }).join(''):'<div class="empty">尚未載入訂閱者。</div>'}</div>
        </div>

        <div class="newsletter-history-block">
          <h3>最近寄送</h3>
          <p>保留最近寄送紀錄與實際寄送人數摘要。</p>
          <div class="newsletter-list">${camps.length?camps.map(x=>`<div class="newsletter-row"><div><strong>${escapeHTML(x.subject||'未命名電子報')}</strong><small>${escapeHTML(x.sentAt||x.createdAt||'')}</small></div><span class="newsletter-chip">${Number(x.sent||x.recipients||0).toLocaleString()}</span></div>`).join(''):'<div class="empty">尚未載入寄送紀錄。</div>'}</div>
        </div>
      </div>
    </section>
  </div>`;

  $('#nlRefresh').onclick=refreshNewsletterData;
  $('#nlFillArticle').onclick=fillNewsletterFromLatest;
  $('#nlTestBtn').onclick=sendNewsletterTest;
  $('#nlSendBtn').onclick=sendNewsletterAll;
  $('#nlAuto').onchange=e=>setNewsletterAutoEnabled(e.target.checked);
  ['nlSubject','nlPreheader','nlBody','nlHeroArticle'].forEach(id=>{
    const el=$('#'+id);if(el)el.addEventListener(id==='nlHeroArticle'?'change':'input',updateNewsletterComposerPreview);
  });

  $('#nlPreviewLoadBtn').onclick=async()=>{
    newsletterPreviewMounted=true;
    scheduleNewsletterHitRepair();
    $('#nlPreviewLoadBtn').hidden=true;
    $('#nlPreviewRefreshBtn').hidden=false;
    await refreshNewsletterExactPreview({force:true});
  };

  $('#nlPreviewRefreshBtn').onclick=()=>refreshNewsletterExactPreview({force:true});

  scheduleNewsletterHitRepair();
}



function dashboardSubscriptionAnalyticsHTML(summary){
  const s=summary||{};
  const sub=s.subscriptionInsights||{};
  const unsub=s.unsubscribeInsights||{};
  const recentSubs=Array.isArray(s.recentSubscriptions)?s.recentSubscriptions:[];
  const recentUnsubs=Array.isArray(s.recentUnsubscribes)?s.recentUnsubscribes:[];
  const daily=Array.isArray(sub.daily14)?sub.daily14:[];
  const reasons=Array.isArray(unsub.reasonBreakdown30)?unsub.reasonBreakdown30:[];

  const new7=Number(sub.new7||0);
  const new30=Number(sub.new30||0);
  const growth=Number(sub.growth30Pct||0);
  const net30=Number(sub.net30||0);
  const unsub7=Number(unsub.last7||0);
  const unsub30=Number(unsub.last30||0);
  const maxDay=Math.max(1,...daily.map(x=>Math.max(Number(x.subscribed||0),Number(x.unsubscribed||0))));
  const maxReason=Math.max(1,...reasons.map(x=>Number(x.count||0)));

  const trend=daily.length
    ?daily.map(x=>{
      const inH=Math.max(2,Math.round((Number(x.subscribed||0)/maxDay)*52));
      const outH=Math.max(2,Math.round((Number(x.unsubscribed||0)/maxDay)*52));
      return `<div class="dashboard-sub-day" title="${escapeHTML(x.label||'')} · 訂閱 ${Number(x.subscribed||0)} · 退訂 ${Number(x.unsubscribed||0)}">
        <i class="dashboard-sub-bar in" style="height:${inH}px"></i>
        <i class="dashboard-sub-bar out" style="height:${outH}px"></i>
      </div>`;
    }).join('')
    :'';

  return `<div class="dashboard-subscription-analytics" id="dashboardSubscriptionAnalytics">
    <section class="dashboard-sub-card">
      <div class="dashboard-sub-head">
        <div>
          <strong>近期訂閱分析</strong>
          <span>近 7 / 30 日新增、淨增與最近 14 天趨勢。</span>
        </div>
        <span class="dashboard-sub-mini-badge">SUBSCRIBE</span>
      </div>

      <div class="dashboard-sub-metrics">
        <div class="dashboard-sub-metric good"><span>近 7 日新增</span><strong>${new7.toLocaleString()}</strong></div>
        <div class="dashboard-sub-metric"><span>近 30 日新增</span><strong>${new30.toLocaleString()}</strong></div>
        <div class="dashboard-sub-metric ${net30<0?'bad':'good'}"><span>30 日淨增</span><strong>${net30>0?'+':''}${net30.toLocaleString()}</strong></div>
      </div>

      <div class="dashboard-sub-growth">
        與前一個 30 日相比：
        <b class="${growth<0?'down':''}">${growth>0?'+':''}${growth.toFixed(1)}%</b>
      </div>

      <div class="dashboard-sub-trend">${trend||'<div class="empty" style="grid-column:1/-1">尚無近期訂閱資料。</div>'}</div>
      <div class="dashboard-sub-legend">
        <span class="in"><i></i>新增訂閱</span>
        <span class="out"><i></i>退訂</span>
      </div>

      <div class="dashboard-sub-list">
        ${recentSubs.length?recentSubs.slice(0,4).map(x=>`
          <div class="dashboard-sub-row">
            <div>
              <strong>${escapeHTML(x.emailMasked||'—')}</strong>
              <small>${escapeHTML(x.subscribedAt||'')}</small>
            </div>
            <span class="dashboard-sub-status ${String(x.status||'').toLowerCase()==='unsubscribed'?'unsub':''}">
              ${String(x.status||'').toLowerCase()==='unsubscribed'?'已退訂':'已訂閱'}
            </span>
          </div>`).join(''):'<div class="empty">目前沒有近期訂閱紀錄。</div>'}
      </div>
    </section>

    <section class="dashboard-sub-card">
      <div class="dashboard-sub-head">
        <div>
          <strong>近期退訂分析</strong>
          <span>近 7 / 30 日退訂、原因與造成退訂的電子報。</span>
        </div>
        <span class="dashboard-sub-mini-badge">UNSUBSCRIBE</span>
      </div>

      <div class="dashboard-sub-metrics">
        <div class="dashboard-sub-metric bad"><span>近 7 日退訂</span><strong>${unsub7.toLocaleString()}</strong></div>
        <div class="dashboard-sub-metric bad"><span>近 30 日退訂</span><strong>${unsub30.toLocaleString()}</strong></div>
        <div class="dashboard-sub-metric bad"><span>歷史退訂率</span><strong>${Number(s.unsubscribeRate||0).toFixed(2)}%</strong></div>
      </div>

      <div class="dashboard-reason-bars">
        ${reasons.length?reasons.map(x=>{
          const w=Math.max(6,Math.round((Number(x.count||0)/maxReason)*100));
          return `<div class="dashboard-reason-row">
            <div class="dashboard-reason-copy">
              <div><span>${escapeHTML(x.reason||'未提供原因')}</span></div>
              <div class="dashboard-reason-track"><i class="dashboard-reason-fill" style="width:${w}%"></i></div>
            </div>
            <div class="dashboard-reason-count">${Number(x.count||0)}</div>
          </div>`;
        }).join(''):'<div class="empty">近 30 日沒有退訂原因資料。</div>'}
      </div>

      <div class="dashboard-sub-list">
        ${recentUnsubs.length?recentUnsubs.slice(0,4).map(x=>`
          <div class="dashboard-sub-row">
            <div>
              <strong>${escapeHTML(x.campaignSubject||'無法判定來源郵件')}</strong>
              <small>${escapeHTML(x.emailMasked||'—')} · ${escapeHTML(x.unsubscribedAt||'')}</small>
            </div>
            <span class="dashboard-sub-status unsub">${escapeHTML(x.reason||'未提供原因')}</span>
          </div>`).join(''):'<div class="empty">目前沒有近期退訂紀錄。</div>'}
      </div>
    </section>
  </div>`;
}

function dashboardNewsletterHTML(summary){
  const s=summary||{};
  const active=Number(s.active||0);
  const unsub=Number(s.unsubscribed||0);
  const denom=active+unsub;
  const rate=Number.isFinite(Number(s.unsubscribeRate))
    ?Number(s.unsubscribeRate)
    :(denom?Math.round((unsub/denom)*10000)/100:0);

  return `${dashboardSubscriptionAnalyticsHTML(s)}
  <section class="dashboard-newsletter-panel" id="dashboardNewsletterPanel">
    <div class="dashboard-newsletter-head">
      <div><strong>電子報健康度</strong><span>目前訂閱規模、累積退訂率與寄送狀態。</span></div>
      <div class="dashboard-newsletter-badge">SIGN WELL LETTER</div>
    </div>

    <div class="dashboard-newsletter-stats">
      <div class="dashboard-newsletter-stat"><span>目前可寄送訂閱者</span><strong>${active.toLocaleString()}</strong></div>
      <div class="dashboard-newsletter-stat rate"><span>歷史退訂率</span><strong>${rate.toFixed(2)}%</strong></div>
      <div class="dashboard-newsletter-stat"><span>已退訂</span><strong>${unsub.toLocaleString()}</strong></div>
    </div>

    <div class="dashboard-newsletter-foot">近期分析使用 Subscribers Sheet 的 subscribed_at / unsubscribed_at；退訂來源郵件以 campaign-bound unsubscribe token 為準。</div>
  </section>`;
}

function refreshDashboardNewsletterSnapshot(){
  if(viewName!=='dashboard')return;

  const oldAnalytics=$('#dashboardSubscriptionAnalytics');
  const oldHealth=$('#dashboardNewsletterPanel');

  const holder=document.createElement('div');
  holder.innerHTML=dashboardNewsletterHTML(newsletterCache.summary);

  const freshAnalytics=holder.querySelector('#dashboardSubscriptionAnalytics');
  const freshHealth=holder.querySelector('#dashboardNewsletterPanel');

  if(oldAnalytics&&freshAnalytics)oldAnalytics.replaceWith(freshAnalytics);
  if(oldHealth&&freshHealth)oldHealth.replaceWith(freshHealth);
}

function swAiSuiteHealthHTML(){return `<section class="panel ai-suite-health"><div class="panel-head"><span>AI Suite Health</span><div style="display:flex;gap:6px"><button class="smallbtn" id="aiSuiteDeepTestBtn" type="button">深度檢查</button><button class="smallbtn" id="aiSuiteSettingsBtn" type="button">前往設定</button></div></div><div class="ai-suite-health-grid" id="aiSuiteHealthGrid"><div class="ai-suite-health-loading">正在檢查 Writer Core / Evidence / Compliance / Notion / Canva AI / Meta AI / 圖片搜尋…</div></div></section>`}
function swPaintAiSuiteHealth(r){
  const host=document.getElementById('aiSuiteHealthGrid');if(!host)return;
  const provider=r?.provider||{};
  const items=Object.values(r?.components||{});
  const providerCard=provider.label?`<div class="ai-suite-health-item ${provider.ready?'ready':'wait'}"><i></i><div><strong>${escapeHTML(provider.label)}</strong><span>${provider.ready?'CORE READY':'CORE NOT READY'}${provider.detail?' · '+escapeHTML(provider.detail):''}</span></div></div>`:'';
  host.innerHTML=providerCard+items.map(x=>`<div class="ai-suite-health-item ${x.ready?'ready':'wait'}"><i></i><div><strong>${escapeHTML(x.label||'AI module')}</strong><span>${x.ready?'READY':'待設定 / 待確認'}${x.detail?' · '+escapeHTML(String(x.detail)):''}</span></div></div>`).join('')||'<div class="empty">尚無狀態資料</div>';
}
async function swRefreshAiSuiteHealth(){
  const host=document.getElementById('aiSuiteHealthGrid');if(!host)return;
  document.getElementById('aiSuiteSettingsBtn')?.addEventListener('click',()=>nav('export'));
  document.getElementById('aiSuiteDeepTestBtn')?.addEventListener('click',async()=>{
    const btn=document.getElementById('aiSuiteDeepTestBtn'),old=btn?.textContent||'深度檢查';if(btn){btn.disabled=true;btn.textContent='測試中…'}
    try{const r=await signwellGasBridge('admin.aiSuite.diagnose',{}, {adminKey:newsletterAdminKey(),timeoutMs:70000});swPaintAiSuiteHealth(r);showToast(r?.writerTest?.ok?'AI Writer Core 實際呼叫通過':'AI Writer Core 仍有異常')}
    catch(err){host.innerHTML=`<div class="empty">AI 深度檢查失敗：${escapeHTML(err?.message||String(err))}</div>`}
    finally{if(btn){btn.disabled=false;btn.textContent=old}}
  });
  try{const r=await signwellGasBridge('admin.aiSuite.status',{}, {adminKey:newsletterAdminKey(),timeoutMs:30000});swPaintAiSuiteHealth(r)}
  catch(err){host.innerHTML=`<div class="empty">AI Suite Health 無法讀取：${escapeHTML(err?.message||String(err))}</div>`}
}

function renderDashboard(){
  setTimeout(async()=>{
    try{
      await refreshRemoteAnalytics(false);
    }finally{
      refreshAnalyticsVisuals();
    }
  },0);

  setTimeout(()=>refreshNewsletterData(),0);
  setTimeout(()=>refreshMetaSocialStats(false),80);
  const published=data.articles.filter(articleHasPublishedReceipt).length,
        drafts=data.articles.filter(a=>!articleHasPublishedReceipt(a)).length,
        cats=(data.topics||[]).filter(x=>x.active!==false).length;
  $('#view').innerHTML=`<div class="page-head"><div><h1>總覽</h1><p>你的私人文章工作台。草稿會跨裝置同步；只有按「發佈到網頁」才會進入公開網站。</p></div><button class="top-action primary" id="dashNew">新增文章</button></div>
  <div class="stats">
    <div class="stat"><span>文章總數</span><strong>${data.articles.length}</strong></div>
    <div class="stat"><span>已發布</span><strong>${published}</strong></div>
    <div class="stat"><span>草稿</span><strong>${drafts}</strong></div>
    <div class="stat"><span>主題分類</span><strong>${cats}</strong></div>
  </div>
  ${trendChartHTML()}
  ${metaSocialPanelHTML()}
  ${dashboardNewsletterHTML(newsletterCache.summary)}
  ${swAiSuiteHealthHTML()}
  <section class="panel"><div class="panel-head"><span>最近文章 · 含觀看次數</span><span>${data.articles.length} 篇</span></div>
  ${data.articles.length?data.articles.slice().sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))).slice(0,8).map(rowHTML).join(''):'<div class="empty">尚未建立文章。</div>'}</section>`;
  $('#dashNew').onclick=newArticle;
  scheduleAnalyticsTrendCanvas();
  bindRows();
  setTimeout(swRefreshAiSuiteHealth,60);
}
function rowHTML(a){
  const views=articleViewCount(a),draft=!articleHasPublishedReceipt(a);
  return `<div class="article-row" data-edit="${escapeHTML(a.id)}">
    <div><strong>${escapeHTML(a.title||'未命名文章')}</strong><small>${escapeHTML(a.category||'未分類')} · ${cmsPublisherChipHTML(a)} · ${escapeHTML(a.updatedAt||'')} · <span data-article-view="${escapeHTML(a.id)}">${viewBadge(views)}</span></small></div>
    <div>${escapeHTML(a.category||'—')}</div>
    <div class="views-cell" data-article-view="${escapeHTML(a.id)}">${viewBadge(views)}</div>
    <div><span class="badge ${draft?'draft':''}">${draft?'草稿':'已發布'}</span></div>
    <div class="row-actions">
      ${draft?`<button title="直接發佈到公開網站" data-send="${escapeHTML(a.id)}">${iconSvg('send')}<span>發佈到網頁</span></button>`:''}
      <button class="icon-btn" title="複製" aria-label="複製文章" data-dup="${escapeHTML(a.id)}">${iconSvg('copy')}</button>
      <button class="icon-btn" title="刪除" aria-label="刪除文章" data-del="${escapeHTML(a.id)}">${iconSvg('delete')}</button>
    </div>
  </div>`;
}

function swGlossaryKey(value=''){
  return String(value||'').normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
}
function swGlossaryEntries(){
  data.glossary=Array.isArray(data.glossary)?data.glossary:[];
  return data.glossary;
}
function swGlossaryArticleText(article){
  return plainFromHTML(articleHTML(article)).replace(/\s+/g,' ').trim().slice(0,16000);
}
function swGlossaryExistingPayload(){
  return swGlossaryEntries().slice(0,420).map(g=>({term:g.term,aliases:Array.isArray(g.aliases)?g.aliases:[]}));
}
function swGlossaryFindByAny(value=''){
  const key=swGlossaryKey(value);if(!key)return null;
  return swGlossaryEntries().find(g=>swGlossaryKey(g.term)===key||(Array.isArray(g.aliases)&&g.aliases.some(a=>swGlossaryKey(a)===key)))||null;
}
function swGlossaryMergeCandidates(items=[],articleId=''){
  let added=0, touched=0;
  const now=new Date().toISOString();
  (Array.isArray(items)?items:[]).forEach(raw=>{
    const term=String(raw?.term||'').normalize('NFKC').trim();
    const translation=String(raw?.translation||'').normalize('NFKC').trim();
    const definition=String(raw?.definition||'').normalize('NFKC').trim();
    const aliases=[...new Set((Array.isArray(raw?.aliases)?raw.aliases:[]).map(v=>String(v||'').normalize('NFKC').trim()).filter(Boolean))].slice(0,8);
    if(!term||!translation||definition.length<6)return;
    let entry=swGlossaryFindByAny(term)||aliases.map(a=>swGlossaryFindByAny(a)).find(Boolean)||null;
    if(!entry){
      entry={id:'term-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),term,translation,definition,aliases,active:true,source:'ai',createdAt:now,updatedAt:now,articleIds:articleId?[String(articleId)]:[]};
      data.glossary.push(entry);added++;
    }else{
      const currentAliases=new Set((entry.aliases||[]).map(String));aliases.forEach(a=>currentAliases.add(a));entry.aliases=[...currentAliases].filter(a=>swGlossaryKey(a)!==swGlossaryKey(entry.term)).slice(0,12);
      entry.articleIds=Array.isArray(entry.articleIds)?entry.articleIds:[];
      if(articleId&&!entry.articleIds.includes(String(articleId)))entry.articleIds.push(String(articleId));
      touched++;
    }
  });
  return {added,touched};
}
function swGlossaryHash(text=''){
  let h=2166136261,s=String(text||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16);
}
async function swAutoGlossaryScanArticle(article,{silent=true,force=false}={}){
  if(!article)return {added:0,touched:0,skipped:true};
  const text=swGlossaryArticleText(article);if(text.length<80)return {added:0,touched:0,skipped:true};
  const hash=swGlossaryHash((article.title||'')+'|'+text);
  if(!force&&article.glossaryScanHash===hash)return {added:0,touched:0,skipped:true};
  try{
    const result=await signwellGasBridge('admin.glossary.extract',{title:article.title||'',text,existing:swGlossaryExistingPayload()},{adminKey:newsletterAdminKey(),timeoutMs:65000});
    const merged=swGlossaryMergeCandidates(result?.terms||[],article.id);
    article.glossaryScanHash=hash;article.glossaryScannedAt=new Date().toISOString();persist(true);
    if((merged.added||merged.touched)&&!silent)showToast(`醫學詞卡已更新 · 新增 ${merged.added} 個`);
    return merged;
  }catch(err){
    if(!silent)showToast('醫學詞卡掃描暫未完成：'+String(err?.message||err));
    return {added:0,touched:0,error:String(err?.message||err)};
  }
}
function swGlossaryUsageCount(entry){
  const forms=[entry.term,...(entry.aliases||[])].map(swGlossaryKey).filter(Boolean);if(!forms.length)return 0;
  return data.articles.reduce((sum,a)=>{const t=swGlossaryKey(swGlossaryArticleText(a));return sum+(forms.some(f=>t.includes(f))?1:0)},0);
}
function swGlossaryRowsHTML(q=''){
  const query=swGlossaryKey(q);
  const list=swGlossaryEntries().filter(g=>!query||swGlossaryKey([g.term,g.translation,g.definition,(g.aliases||[]).join(' ')].join(' ')).includes(query));
  if(!list.length)return '<div class="empty">目前沒有符合的醫學詞條。文章儲存或發佈時會由 AI 自動建立；也可以手動新增。</div>';
  return list.slice().sort((a,b)=>String(a.term).localeCompare(String(b.term),'zh-Hant')).map(g=>`<div class="sw-glossary-row" data-term-row="${escapeHTML(g.id)}"><div class="sw-glossary-main"><div class="sw-glossary-term"><strong>${escapeHTML(g.term)}</strong>${g.translation?`<span>${escapeHTML(g.translation)}</span>`:''}</div><p>${escapeHTML(g.definition||'')}</p>${(g.aliases||[]).length?`<small>同義詞／縮寫：${escapeHTML((g.aliases||[]).join('、'))}</small>`:''}</div><div class="sw-glossary-meta"><span>${swGlossaryUsageCount(g)} 篇文章</span><span class="${g.active===false?'off':'on'}">${g.active===false?'停用':'啟用'}</span></div><div class="sw-glossary-actions"><button data-term-edit="${escapeHTML(g.id)}">編輯</button><button data-term-toggle="${escapeHTML(g.id)}">${g.active===false?'啟用':'停用'}</button><button data-term-delete="${escapeHTML(g.id)}">刪除</button></div></div>`).join('');
}
function swEnsureGlossaryDialog(){
  let root=document.getElementById('swGlossaryDialog');if(root)return root;
  root=document.createElement('div');root.id='swGlossaryDialog';root.className='sw-glossary-dialog';root.setAttribute('aria-hidden','true');root.innerHTML=`<div class="sw-glossary-card" role="dialog" aria-modal="true" aria-labelledby="swGlossaryDialogTitle"><div class="sw-glossary-dialog-head"><div><small>SIGN WELL · MEDICAL GLOSSARY</small><h3 id="swGlossaryDialogTitle">醫學詞條</h3></div><button type="button" data-glossary-close aria-label="關閉">×</button></div><div class="sw-glossary-form"><label>原始名詞<input id="swGlossaryTerm" maxlength="120"></label><label>中文翻譯／常用名稱<input id="swGlossaryTranslation" maxlength="140"></label><label class="wide">白話解釋<textarea id="swGlossaryDefinition" rows="4" maxlength="360"></textarea></label><label class="wide">同義詞／縮寫（用逗號分隔）<input id="swGlossaryAliases" maxlength="360"></label><label class="sw-glossary-active"><input type="checkbox" id="swGlossaryActive" checked> 在公開文章中啟用詞卡</label></div><div class="sw-glossary-dialog-actions"><button type="button" data-glossary-close>取消</button><button type="button" class="primary" id="swGlossarySave">儲存</button><button type="button" class="online" id="swGlossarySavePublish">儲存並同步全站</button></div><p class="sw-glossary-hint">同一詞條全站共用同一份解釋；同步後，已發布文章不需重寫 HTML，也會立即改用新版詞卡。</p></div>`;document.body.appendChild(root);root.addEventListener('click',e=>{if(e.target===root||e.target.closest('[data-glossary-close]')){root.classList.remove('show');root.setAttribute('aria-hidden','true')}});return root;
}
function swOpenGlossaryEditor(id=''){
  const root=swEnsureGlossaryDialog(),entry=id?swGlossaryEntries().find(g=>String(g.id)===String(id)):null;
  root.dataset.editId=entry?.id||'';root.querySelector('#swGlossaryDialogTitle').textContent=entry?'編輯醫學詞條':'新增醫學詞條';root.querySelector('#swGlossaryTerm').value=entry?.term||'';root.querySelector('#swGlossaryTranslation').value=entry?.translation||'';root.querySelector('#swGlossaryDefinition').value=entry?.definition||'';root.querySelector('#swGlossaryAliases').value=(entry?.aliases||[]).join(', ');root.querySelector('#swGlossaryActive').checked=entry?.active!==false;
  const save=async publish=>{const term=root.querySelector('#swGlossaryTerm').value.trim(),translation=root.querySelector('#swGlossaryTranslation').value.trim(),definition=root.querySelector('#swGlossaryDefinition').value.trim(),aliases=[...new Set(root.querySelector('#swGlossaryAliases').value.split(/[,，\n]+/).map(v=>v.trim()).filter(Boolean))].slice(0,12),active=root.querySelector('#swGlossaryActive').checked;if(!term||!translation||!definition){showToast('請完整填寫名詞、翻譯與解釋');return}const duplicate=swGlossaryFindByAny(term);if(duplicate&&duplicate!==entry){showToast('這個詞條已存在，請直接編輯既有詞條');return}let target=entry;if(!target){target={id:'term-'+Date.now().toString(36),source:'manual',createdAt:new Date().toISOString(),articleIds:[]};data.glossary.push(target)}Object.assign(target,{term,translation,definition,aliases,active,source:entry?.source||'manual',updatedAt:new Date().toISOString()});persist(true);root.classList.remove('show');root.setAttribute('aria-hidden','true');renderArticles();if(publish){try{showToast('正在同步全站詞庫…');await publishTopicsOnly();showToast('詞庫已同步 · 已發布文章會使用新版解釋')}catch(err){showToast('詞庫同步失敗：'+String(err?.message||err))}}};root.querySelector('#swGlossarySave').onclick=()=>save(false);root.querySelector('#swGlossarySavePublish').onclick=()=>save(true);root.classList.add('show');root.setAttribute('aria-hidden','false');setTimeout(()=>root.querySelector('#swGlossaryTerm')?.focus(),40);
}
async function swGlossaryScanAllArticles(){
  const btn=document.getElementById('glossaryRescan');if(btn){btn.disabled=true;btn.textContent='AI 掃描中…'}let added=0;try{const list=data.articles.slice();for(let i=0;i<list.length;i++){if(btn)btn.textContent=`AI 掃描 ${i+1}/${list.length}`;const r=await swAutoGlossaryScanArticle(list[i],{silent:true,force:true});added+=Number(r?.added||0)}persist(true);renderArticles();showToast(`詞庫掃描完成 · 新增 ${added} 個詞條`)}finally{if(btn){btn.disabled=false;btn.textContent='AI 掃描全部文章'}}
}
function swBindGlossaryPanel(){
  const search=document.getElementById('glossarySearch'),rows=document.getElementById('glossaryRows');const paint=()=>{if(rows)rows.innerHTML=swGlossaryRowsHTML(search?.value||'');rows?.querySelectorAll('[data-term-edit]').forEach(b=>b.onclick=()=>swOpenGlossaryEditor(b.dataset.termEdit));rows?.querySelectorAll('[data-term-toggle]').forEach(b=>b.onclick=()=>{const g=swGlossaryEntries().find(x=>String(x.id)===String(b.dataset.termToggle));if(!g)return;g.active=g.active===false;g.updatedAt=new Date().toISOString();persist(true);paint()});rows?.querySelectorAll('[data-term-delete]').forEach(b=>b.onclick=async()=>{const g=swGlossaryEntries().find(x=>String(x.id)===String(b.dataset.termDelete));if(!g)return;if(!(await swConfirm(`刪除詞條「${g.term}」？\n已發布文章下一次同步後將不再標示這個詞。`,{title:'刪除醫學詞條？',kicker:'GLOBAL GLOSSARY',danger:true,confirmText:'確認刪除'})))return;data.glossary=data.glossary.filter(x=>x!==g);persist(true);paint()})};if(search)search.oninput=paint;document.getElementById('glossaryAdd')?.addEventListener('click',()=>swOpenGlossaryEditor(''));document.getElementById('glossaryRescan')?.addEventListener('click',swGlossaryScanAllArticles);document.getElementById('glossaryPublish')?.addEventListener('click',async()=>{try{showToast('正在同步全站詞庫…');await publishTopicsOnly();showToast('詞庫已同步 · 所有已發布文章同步更新')}catch(err){showToast('詞庫同步失敗：'+String(err?.message||err))}});paint();
}

function renderArticles(){
  setTimeout(()=>refreshRemoteAnalytics(false),0);
  const published=data.articles.filter(articleHasPublishedReceipt).length;
  const drafts=data.articles.length-published;

  $('#view').innerHTML=`
    <div class="article-hub-head">
      <div>
        <h1>文章</h1>
        <p>新增、搜尋、編輯與發佈都集中在同一個工作區；草稿會同步到 SIGN WELL 雲端，但只有按「發佈到網頁」才會公開。</p>
      </div>
      <div class="article-hub-actions">
        <button class="top-action primary" id="listNew">＋ 新增文章</button>
      </div>
    </div>

    <button class="article-create-card" id="articleCreateCard" type="button">
      <span class="article-create-icon">＋</span>
      <span class="article-create-copy">
        <strong>新增一篇文章</strong>
        <span>直接進入編輯器。草稿會自動同步，你可以稍後再回來完成。</span>
      </span>
      <span class="article-create-key">⌘ N</span>
    </button>

    <section class="panel sw-glossary-panel" id="glossaryPanel">
      <div class="panel-head">
        <div class="article-panel-meta"><span>醫學名詞詞庫</span><b>${swGlossaryEntries().length}</b><span>· 全站共用</span></div>
        <div class="article-hub-tools sw-glossary-tools"><input class="searchbar" id="glossarySearch" placeholder="搜尋名詞、翻譯或解釋…"><button class="top-action" id="glossaryAdd">＋ 新增詞條</button><button class="top-action" id="glossaryRescan">AI 掃描全部文章</button><button class="top-action online" id="glossaryPublish">同步詞庫到網站</button></div>
      </div>
      <div class="sw-glossary-note">文章儲存或發佈時會自動偵測艱難醫學名詞。AI 只負責第一次建立詞卡；之後同一詞條全站共用，你在這裡修改一次即可同步所有已發布文章。</div>
      <div id="glossaryRows"></div>
    </section>

    <section class="panel" id="articlePanel">
      <div class="panel-head">
        <div class="article-panel-meta">
          <span>全部文章</span>
          <b>${data.articles.length}</b>
          <span>· 已發布 ${published}</span>
          <span>· 草稿 ${drafts}</span>
        </div>
        <div class="article-hub-tools">
          <input class="searchbar" id="articleSearch" placeholder="搜尋文章、分類或標籤…">
          <select class="article-filter" id="articleFilter" aria-label="文章狀態篩選">
            <option value="all">全部狀態</option>
            <option value="draft">草稿</option>
            <option value="published">已發布</option>
          </select>
        </div>
      </div>
      <div id="rows">${data.articles.length?data.articles.map(rowHTML).join(''):'<div class="empty">尚未建立文章。按上方「新增一篇文章」開始。</div>'}</div>
    </section>`;

  $('#listNew').onclick=newArticle;
  $('#articleCreateCard').onclick=newArticle;

  const rerender=()=>{
    const q=String($('#articleSearch')?.value||'').toLowerCase().trim();
    const mode=$('#articleFilter')?.value||'all';
    const arr=data.articles.filter(a=>{
      const hit=[a.title,a.category,(a.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
      const isPublished=articleHasPublishedReceipt(a);
      const state=mode==='all'||(mode==='draft'&&!isPublished)||(mode==='published'&&isPublished);
      return hit&&state;
    });
    $('#rows').innerHTML=arr.length?arr.map(rowHTML).join(''):'<div class="empty">沒有符合條件的文章。</div>';
    bindRows();
  };

  $('#articleSearch').oninput=rerender;
  $('#articleFilter').onchange=rerender;
  bindRows();
  swBindGlossaryPanel();
}
function filterRows(q){const s=q.toLowerCase().trim(),arr=data.articles.filter(a=>[a.title,a.category,(a.tags||[]).join(' ')].join(' ').toLowerCase().includes(s));$('#rows').innerHTML=arr.length?arr.map(rowHTML).join(''):'<div class="empty">沒有符合的文章。</div>';bindRows()}
function bindRows(){
  $$('[data-edit]').forEach(r=>r.onclick=e=>{
    if(e.target.closest('[data-dup],[data-del],[data-send]'))return;
    currentId=r.dataset.edit;renderView();
  });
  $$('[data-dup]').forEach(b=>b.onclick=e=>{e.stopPropagation();duplicateArticle(b.dataset.dup)});
  $$('[data-del]').forEach(b=>b.onclick=e=>{e.stopPropagation();deleteId=b.dataset.del;$('#confirmModal').classList.add('show')});
  $$('[data-send]').forEach(b=>b.onclick=async e=>{e.stopPropagation();await publishDraftFromList(b.dataset.send,b)});
}

let articlePublishConfirmResolver=null;
function articlePublicPathLabel(article){
  const slug=String(article?.slug||article?.id||'').trim();
  return slug?`/article/${slug}/`:'SIGN WELL 公開網站';
}
function closeArticlePublishConfirm(ok=false){
  const wrap=$('#articlePublishConfirm');if(!wrap)return;
  wrap.classList.remove('show');wrap.setAttribute('aria-hidden','true');
  if(!ok&&typeof swPublishComposerReset==='function')swPublishComposerReset();
  const resolver=articlePublishConfirmResolver;articlePublishConfirmResolver=null;
  setTimeout(()=>resolver?.(Boolean(ok)),100);
}
function confirmArticlePublishUI(article){
  const wrap=$('#articlePublishConfirm');if(!wrap)return Promise.resolve(true);
  if(articlePublishConfirmResolver){articlePublishConfirmResolver(false);articlePublishConfirmResolver=null}
  $('#articlePublishTitle').textContent=article?.title||'未命名文章';
  $('#articlePublishPath').textContent=articlePublicPathLabel(article);
  $('#articlePublishNewsletter').textContent=newsletterAutoEnabled()?'網站上線後自動寄送':'不自動寄送';
  wrap.classList.add('show');wrap.setAttribute('aria-hidden','false');
  if(typeof swPublishComposerOpen==='function')swPublishComposerOpen(article);
  requestAnimationFrame(()=>$('#articlePublishConfirmBtn')?.focus());
  return new Promise(resolve=>{articlePublishConfirmResolver=resolve});
}
$('#articlePublishCancel').onclick=()=>closeArticlePublishConfirm(false);
$('#articlePublishConfirmBtn').onclick=()=>{if(typeof swPublishComposerCapture==='function'&&!swPublishComposerCapture())return;closeArticlePublishConfirm(true)};
$('#articlePublishConfirm').addEventListener('click',e=>{if(e.target===e.currentTarget)closeArticlePublishConfirm(false)});
document.addEventListener('keydown',e=>{
  const wrap=$('#articlePublishConfirm');if(!wrap?.classList.contains('show'))return;
  if(e.key==='Escape'){e.preventDefault();closeArticlePublishConfirm(false)}
});

async function publishDraftFromList(id,sourceEl=null){
  const a=data.articles.find(x=>x.id===id);
  if(!a||articleHasPublishedReceipt(a)){showToast('這篇文章已發布，不會再次送出');return;}
  const approved=await confirmArticlePublishUI(a);
  if(!approved){
    showToast('已取消發佈');
    return;
  }

  try{
    await restoreRememberedGithubToken();
    

    const old=a.status;
    a.status='Published';a.updatedAt=new Date().toISOString().slice(0,10);persist(true);
    showToast('正在送出草稿…');

    try{
      await swArticleIdentityEnsureMigration(String(a?.id||''));
      await swArticleIdentityPrepareForPublish(a);
      await swAutoGlossaryScanArticle(a,{silent:true});
      const ok=await publishGitHub();
      if(!ok)throw new Error('GitHub 發布未完成');
      await swArticleIdentityVerifyRemote(a,githubToken);
      await swArticleIdentityCommitAfterPublish(a);
      try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}

      markArticlePublishedReceipt(a);
      persist(true);
      try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}

      if(newsletterAutoEnabled()){
        showToast('文章已上線 · 正在準備自動電子報');
        const mail=await maybeAutoSendArticleNewsletter(a,{sourceEl});
        if(!mail.success)showToast('文章已發布，但自動電子報尚未完成');
      }else{
        showToast('已直接發佈到公開網站');showConfetti(sourceEl);
      }

      try{
        const social=await swRunPublishSocialPlan(a);
        if(social?.requested)showToast(social.complete?'網站＋社群圖文已完成':'網站已上線；部分社群平台尚未完成');
      }catch(socialErr){showToast('網站已上線；社群發布未完成：'+String(socialErr?.message||socialErr))}

      if(viewName==='articles')renderArticles();else renderDashboard();
    }catch(err){
      a.status=old;persist(true);try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){};throw err;
    }
  }catch(err){
    hideNewsletterSendOverlay();showToast('送出失敗：'+(err?.message||err));
  }
}

function activePublisherPeople(){
  return (Array.isArray(data.people)?data.people:[])
    .filter(p=>p&&p.active!==false)
    .slice()
    .sort((a,b)=>(a.order??999)-(b.order??999)||String(a.name||'').localeCompare(String(b.name||''),'zh-Hant'));
}
function defaultPublisherId(){
  return String(activePublisherPeople()[0]?.id||'');
}
function cmsPersonById(id){
  const key=String(id||'').trim();
  return key?(data.people||[]).find(p=>String(p.id||'')===key)||null:null;
}
function cmsPublisherName(article){
  return cmsPersonById(article?.publisherId)?.name||String(article?.publisherName||'').trim()||data.siteText?.articleBrand||'SIGN WELL · 欣緯生醫';
}
function cmsPublisherInitials(name=''){
  const clean=String(name||'').trim();
  if(!clean)return 'SW';
  const parts=clean.split(/\s+/).filter(Boolean);
  return parts.length>1?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():clean.slice(0,2).toUpperCase();
}
function cmsPersonPhotoURL(value=''){
  let src=String(value||'').trim();
  if(!src)return '';
  if(/^\/\//.test(src))src='https:'+src;
  const blob=src.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i);
  if(blob)src=`https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}/${blob[4]}`;
  if(/^(?:data:image\/|blob:|https?:\/\/)/i.test(src))return src;
  src=src.replace(/^\.\//,'').replace(/^\.\.\//,'').replace(/^\/+/, '');
  if(/^assets\//i.test(src))return 'https://signwell.com.tw/'+src;
  return src;
}
function cmsAvatarMarkupFrom(photo,name=''){
  const fallback=cmsPublisherInitials(name||'SW');
  const src=cmsPersonPhotoURL(photo);
  if(!src)return escapeHTML(fallback);
  return `<img src="${escapeHTML(src)}" alt="${escapeHTML(name||'人物頭像')}" loading="lazy" decoding="async" data-cms-person-avatar data-fallback="${escapeHTML(fallback)}">`;
}
function cmsPersonAvatarMarkup(person){
  person=person||{};
  return cmsAvatarMarkupFrom(person.photo,person.name||'SW');
}
function cmsPublisherChipHTML(article){
  const p=cmsPersonById(article&&article.publisherId);
  const name=String(p&&p.name||article&&article.publisherName||data.siteText?.articleBrand||'SIGN WELL · 欣緯生醫').trim();
  const photo=String(p&&p.photo||article&&article.publisherPhoto||'').trim();
  return `<span class="cms-publisher-chip"><span class="cms-publisher-chip-avatar">${cmsAvatarMarkupFrom(photo,name)}</span><span>${escapeHTML(name)}</span></span>`;
}
document.addEventListener('error',e=>{
  const img=e.target;
  if(!(img instanceof HTMLImageElement)||!img.matches('[data-cms-person-avatar]'))return;
  const host=img.parentElement,fallback=img.dataset.fallback||'SW';
  img.remove();
  if(host&&!host.textContent.trim())host.textContent=fallback;
  host?.classList?.add('cms-avatar-fallback');
},true);

function newArticle(){
  const id='new-'+Date.now(),today=new Date().toISOString().slice(0,10);
  pendingNewArticle={id,title:'',subtitle:'',summary10s:'',slug:'',category:(data.topics?.find(x=>x.active!==false)?.name||'醫學筆記'),type:'文章',excerpt:'',tags:[],cover:'',status:'Draft',featured:false,publisherId:defaultPublisherId(),publishedAt:today,updatedAt:today,content:'<p>從這裡開始寫。</p>',contentFormat:'html',references:[],evidenceEnabled:false,evidenceCards:[],signWellVerdict:swVerdictDefaults()};
  currentId='__new__';
  renderView();
  $('#saveState').textContent='尚未儲存';
  $('#saveState').style.color='#9a7b45';
  setTimeout(()=>$('#title')?.focus(),50);
}
function duplicateArticle(id){const src=data.articles.find(a=>a.id===id);if(!src)return;const cp=clone(src);cp.id='a-'+Date.now();cp.title=(src.title||'未命名文章')+' 副本';cp.slug=slugify(cp.title);cp.status='Draft';cp.featured=false;['article_uuid','article_id','current_version','revision_seq','article_status','review_status','ai_involvement','content_hash','hash_schema','trace_url','share_card_url','last_verified_at','identity','identityMirrorPending','identityMirrorError'].forEach(k=>delete cp[k]);data.articles.unshift(cp);persist();showToast('已複製文章');renderView()}
function getCurrent(){return currentId==='__new__'?pendingNewArticle:data.articles.find(a=>a.id===currentId)}
function articleHTML(a){return a?.contentFormat==='html'?String(a.content||''):markdown(a?.content||'')}
function plainFromHTML(html=''){const el=document.createElement('div');el.innerHTML=html;return (el.textContent||'').replace(/\s+/g,' ').trim()}
function cmsSummary10s(a){
  let text=String(a?.summary10s||a?.excerpt||plainFromHTML(articleHTML(a)||'')).replace(/\s+/g,' ').trim();
  if(text.length>120)text=text.slice(0,119).replace(/[，、；：,:;\s]+$/,'')+'…';
  return text;
}

function swVerdictDefaults(v={}){
  const src=v&&typeof v==='object'?v:{};
  return {
    readiness:String(src.readiness||''),
    evidence:String(src.evidence||''),
    safety:String(src.safety||''),
    costEffectiveness:String(src.costEffectiveness||''),
    regulatory:String(src.regulatory||''),
    marketingHype:String(src.marketingHype||'')
  };
}
function swEvidenceCardsFromArticle(a){
  const cards=Array.isArray(a?.evidenceCards)?a.evidenceCards:[];
  return cards.slice(0,3).map(c=>({
    claim:String(c?.claim||''),
    level:String(c?.level||''),
    evidenceType:String(c?.evidenceType||''),
    population:String(c?.population||''),
    effect:String(c?.effect||''),
    boundary:String(c?.boundary||''),
    lastChecked:String(c?.lastChecked||'')
  }));
}
function swEvidenceEditorHTML(a){
  const enabled=a?.evidenceEnabled===true;
  const verdict=swVerdictDefaults(a?.signWellVerdict);
  const cards=swEvidenceCardsFromArticle(a);
  while(cards.length<3)cards.push({claim:'',level:'',evidenceType:'',population:'',effect:'',boundary:'',lastChecked:''});
  const opt=(value,label,current)=>`<option value="${escapeHTML(value)}" ${String(current)===String(value)?'selected':''}>${escapeHTML(label)}</option>`;
  const gradeOpts=(current)=>['','A+','A','A−','B+','B','B−','C','D'].map(v=>opt(v,v||'未評分',current)).join('');
  const readiness=[['','不顯示'],['established','Established｜成熟'],['reasonable','Reasonable option｜合理選項'],['emerging','Emerging｜證據累積中'],['experimental','Experimental｜實驗性'],['unsupported','Unsupported｜不支持']];
  const hype=[['','未評估'],['low','Low｜低'],['moderate','Moderate｜中'],['high','High｜高'],['very-high','Very high｜很高']];
  const levels=[['','未評估'],['high','High'],['moderate','Moderate'],['low','Low'],['very-low','Very low']];
  return `<section class="field-group sw-evidence-editor" id="swEvidenceEditor">
    <div class="sw-evidence-editor-head">
      <div><label>Evidence Card · SIGN WELL Verdict</label><small>Claim → Evidence → Verdict → Update</small></div>
      <label class="sw-evidence-switch"><input id="evidenceEnabled" type="checkbox" ${enabled?'checked':''}><span>公開顯示</span></label>
    </div>
    <div class="sw-evidence-help">把後台主張－證據審查轉成前台可讀的判讀卡。公開引用可包含新聞、政府官方資料與實際使用的 PubMed 文獻；未被正文引用的 PubMed 候選不會帶到 Public。</div>
    <div class="sw-verdict-editor-grid">
      <label>Clinical readiness<select id="verdictReadiness">${readiness.map(([v,l])=>opt(v,l,verdict.readiness)).join('')}</select></label>
      <label>Evidence<select id="verdictEvidence">${gradeOpts(verdict.evidence)}</select></label>
      <label>Safety<select id="verdictSafety">${gradeOpts(verdict.safety)}</select></label>
      <label>Cost-effectiveness<select id="verdictCost">${gradeOpts(verdict.costEffectiveness)}</select></label>
      <label>Regulatory status<input id="verdictRegulatory" value="${escapeHTML(verdict.regulatory)}" placeholder="例：TFDA 核准／未核准"></label>
      <label>Marketing hype<select id="verdictHype">${hype.map(([v,l])=>opt(v,l,verdict.marketingHype)).join('')}</select></label>
    </div>
    <div class="sw-evidence-card-editor-list">
      ${cards.map((c,i)=>`<details class="sw-evidence-card-editor" ${i===0?'open':''}>
        <summary><span>核心主張 ${i+1}</span><small>${escapeHTML(c.claim||'未設定')}</small></summary>
        <div class="sw-evidence-card-editor-body">
          <label class="wide">Claim<textarea id="evClaim${i}" rows="2" placeholder="例：GLP-1 RA 可有效降低肥胖成人體重">${escapeHTML(c.claim)}</textarea></label>
          <label>Evidence level<select id="evLevel${i}">${levels.map(([v,l])=>opt(v,l,c.level)).join('')}</select></label>
          <label>主要證據<input id="evType${i}" value="${escapeHTML(c.evidenceType)}" placeholder="RCT / Meta-analysis"></label>
          <label>Population<input id="evPopulation${i}" value="${escapeHTML(c.population)}" placeholder="適用族群"></label>
          <label>Effect<input id="evEffect${i}" value="${escapeHTML(c.effect)}" placeholder="效果量／臨床意義"></label>
          <label class="wide">不可外推／限制<textarea id="evBoundary${i}" rows="2" placeholder="例：孕婦、未成年人；不能由動物研究直接外推人體">${escapeHTML(c.boundary)}</textarea></label>
          <label>Last checked<input id="evLastChecked${i}" type="date" value="${escapeHTML(c.lastChecked)}"></label>
        </div>
      </details>`).join('')}
    </div>
  </section>`;
}
function swCollectEvidenceFromEditor(a){
  if(!a)return;
  a.evidenceEnabled=Boolean($('#evidenceEnabled')?.checked);
  a.signWellVerdict={
    readiness:$('#verdictReadiness')?.value||'',
    evidence:$('#verdictEvidence')?.value||'',
    safety:$('#verdictSafety')?.value||'',
    costEffectiveness:$('#verdictCost')?.value||'',
    regulatory:($('#verdictRegulatory')?.value||'').trim(),
    marketingHype:$('#verdictHype')?.value||''
  };
  const cards=[];
  for(let i=0;i<3;i++){
    const claim=($('#evClaim'+i)?.value||'').trim();
    const evidenceType=($('#evType'+i)?.value||'').trim();
    const population=($('#evPopulation'+i)?.value||'').trim();
    const effect=($('#evEffect'+i)?.value||'').trim();
    const boundary=($('#evBoundary'+i)?.value||'').trim();
    const level=$('#evLevel'+i)?.value||'';
    const lastChecked=$('#evLastChecked'+i)?.value||'';
    if(claim||evidenceType||population||effect||boundary){cards.push({claim,level,evidenceType,population,effect,boundary,lastChecked})}
  }
  a.evidenceCards=cards;
}

function renderEditor(){const a=getCurrent();if(!a){currentId=null;nav('articles');return}const html=articleHTML(a);$('#view').innerHTML=`<div class="editor-grid"><section class="editor-main"><input id="title" class="title-input" placeholder="貼文標題" value="${escapeHTML(a.title||'')}"><div class="cover-box ${a.cover?'has-image':''}" id="coverBox">${a.cover?`<img id="coverPreview" src="${escapeHTML(a.cover)}" alt="封面圖片"><div class="cover-actions"><button id="changeCover" type="button">更換圖片</button><button id="removeCover" type="button">移除</button></div>`:`<div class="cover-empty"><strong>貼文圖片</strong><br>點一下加入封面圖片；系統會自動壓縮成適合網頁的大小。</div>`}</div><div class="media-rights-note">圖片與圖表僅使用自有、已獲授權、公眾領域或符合開放授權條件的素材；標示來源不等於取得重製權。</div><input class="file-input" id="coverInput" type="file" accept="image/*"><input class="file-input" id="inlineImageInput" type="file" accept="image/*"><div class="editor-tool-dock sw-editor-toolbar-v23988" id="editorToolDock">
  <button class="tool-fab" id="toolFab" type="button" aria-label="開啟文字工具" aria-expanded="false">Aa</button>

  <div class="toolbar editor-toolbar" id="editorToolbar" role="toolbar" aria-label="文章格式工具">
    <div class="toolbar-mobile-sheet-handle" aria-hidden="true"></div>
    <div class="toolbar-segment toolbar-history" aria-label="上一步與下一步">
      <button type="button" class="history-btn" data-cmd="undo" title="上一步" aria-label="上一步">
        <span class="history-arrow" aria-hidden="true">↶</span><span class="history-text">上一步</span>
      </button>
      <button type="button" class="history-btn" data-cmd="redo" title="下一步" aria-label="下一步">
        <span class="history-arrow" aria-hidden="true">↷</span><span class="history-text">下一步</span>
      </button>
    </div>

    <button type="button" class="style-trigger desktop-format" id="styleMenuBtn" aria-haspopup="true" aria-expanded="false">
      <span class="style-aa">Aa</span>
      <span class="style-current" id="styleCurrentLabel">內文</span>
      <span class="style-chevron">⌄</span>
    </button>

    <button type="button" class="mobile-style-btn" data-cmd="formatBlock" data-val="p">內文</button>
    <button type="button" class="mobile-style-btn" data-cmd="formatBlock" data-val="h2">大標題</button>
    <button type="button" class="mobile-style-btn" data-cmd="formatBlock" data-val="h3">中標題</button>
    <button type="button" class="mobile-style-btn" data-cmd="formatBlock" data-val="h4">小標題</button>

    <span class="tool-sep desktop-format"></span>

    <div class="toolbar-segment desktop-format" aria-label="字級">
      <button type="button" id="fontSizeMinus" title="縮小字級">−</button>
      <span class="toolbar-size" id="fontSizeLabel">16</span>
      <button type="button" id="fontSizePlus" title="放大字級">＋</button>
    </div>

    <span class="tool-sep"></span>

    <div class="toolbar-segment">
      <button type="button" class="toolbar-icon-text" data-cmd="bold" title="粗體"><b>B</b></button>
      <button type="button" class="toolbar-icon-text" data-cmd="italic" title="斜體"><i>I</i></button>
      <button type="button" class="toolbar-icon-text" data-cmd="underline" title="底線"><u>U</u></button>
    </div>

    <button type="button" class="desktop-format" id="textColorBtn" title="文字顏色">
      <span class="toolbar-color-mark">A</span>
    </button>
    <button type="button" data-highlight="1" title="螢光筆">
      <span class="toolbar-highlight-mark">重點</span>
    </button>

    <span class="tool-sep desktop-format"></span>

    <div class="toolbar-segment desktop-format toolbar-secondary" aria-label="對齊">
      <button type="button" data-cmd="justifyLeft" title="靠左">≡</button>
      <button type="button" data-cmd="justifyCenter" title="置中">≣</button>
      <button type="button" data-cmd="justifyRight" title="靠右">≡</button>
    </div>

    <span class="tool-sep"></span>

    <button type="button" data-cmd="insertUnorderedList">• 清單</button>
    <button type="button" data-cmd="insertOrderedList">1. 編號</button>
    <button type="button" class="toolbar-secondary" data-quote="1">引用</button>
    <button type="button" class="toolbar-secondary" data-link="1">連結</button>
    <button type="button" id="insertImageBtn">圖片</button>
    <span class="tool-sep"></span>
    <button type="button" class="toolbar-secondary" id="insertTableBtn" title="插入表格">表格</button>
    <button type="button" class="toolbar-secondary" id="insertChartBtn" title="插入長條圖">圖表</button>
    <button type="button" class="toolbar-secondary" id="insertStatsBtn" title="插入統計數據卡">數據</button>
    <button type="button" class="toolbar-overflow-trigger desktop-format" id="editorToolbarMore" title="更多格式" aria-label="更多格式">•••</button>

    <div class="format-popover desktop-format" id="formatPopover" role="dialog" aria-label="文字格式">
      <div class="format-popover-head">
        <strong>文字格式</strong>
        <span>Pages-style inspector</span>
      </div>

      <div class="format-section">
        <div class="format-label">段落樣式</div>
        <div class="type-style-list">
          <button type="button" class="type-style" data-style-block="p">
            <span class="sample">內文</span><span class="hint">Body</span>
          </button>
          <button type="button" class="type-style" data-style-block="h2">
            <span class="sample">大標題</span><span class="hint">Heading 1</span>
          </button>
          <button type="button" class="type-style" data-style-block="h3">
            <span class="sample">中標題</span><span class="hint">Heading 2</span>
          </button>
          <button type="button" class="type-style" data-style-block="h4">
            <span class="sample">小標題</span><span class="hint">Heading 3</span>
          </button>
          <button type="button" class="type-style" data-style-block="blockquote">
            <span class="sample">引用文字</span><span class="hint">Quote</span>
          </button>
        </div>
      </div>

      <div class="format-section">
        <div class="format-label">文字顏色</div>
        <div class="swatch-row">
          <button type="button" class="swatch" data-text-color="auto" title="自動"></button>
          <button type="button" class="swatch" data-text-color="#26313f" style="--c:#26313f" title="石墨"></button>
          <button type="button" class="swatch" data-text-color="#47789a" style="--c:#47789a" title="霧藍"></button>
          <button type="button" class="swatch" data-text-color="#587d72" style="--c:#587d72" title="鼠尾草"></button>
          <button type="button" class="swatch" data-text-color="#9a5f67" style="--c:#9a5f67" title="莓紅"></button>
        </div>
      </div>

      <div class="format-section">
        <div class="format-label">標記筆觸</div>
        <div class="swatch-row">
          <button type="button" class="swatch" data-highlight-color="transparent" title="移除標記"></button>
          <button type="button" class="swatch" data-highlight-color="#fff1a8" style="--c:#fff1a8" title="柔黃"></button>
          <button type="button" class="swatch" data-highlight-color="#dff1ff" style="--c:#dff1ff" title="天藍"></button>
          <button type="button" class="swatch" data-highlight-color="#def3e9" style="--c:#def3e9" title="薄荷"></button>
          <button type="button" class="swatch" data-highlight-color="#f8e2e7" style="--c:#f8e2e7" title="淡粉"></button>
        </div>
      </div>

      <div class="format-footer">
        <small>選取文字後即可套用樣式</small>
        <button type="button" id="clearInlineFormat">清除格式</button>
      </div>
    </div>
  </div>
</div><div id="content" class="doc-editor" contenteditable="true" role="textbox" aria-multiline="true" spellcheck="true">${html}</div></section><aside class="editor-side">
<div class="field-group">
  <label>文章發布者</label>
  <div class="publisher-picker">
    <select id="publisherId">
      ${(()=>{
        const persons=activePublisherPeople();
        const current=String(a.publisherId||'');
        let html=`<option value="" ${!current?'selected':''}>${escapeHTML(data.siteText?.articleBrand||'SIGN WELL · 欣緯生醫')}（品牌）</option>`;
        if(current&&!persons.some(p=>String(p.id)===current)){
          const old=cmsPersonById(current);
          html+=`<option value="${escapeHTML(current)}" selected>${escapeHTML(old?.name||'已隱藏 / 已刪除的人物')}</option>`;
        }
        html+=persons.map(p=>`<option value="${escapeHTML(p.id)}" ${String(p.id)===current?'selected':''}>${escapeHTML(p.name||'未命名人物')}${p.role?' · '+escapeHTML(p.role):''}</option>`).join('');
        return html;
      })()}
    </select>
    <div class="publisher-preview" id="publisherPreview"></div>
    <div class="publisher-help">人物來自「主頁設定 → 人物與學經歷」。新增或修改人物後，這個選單會自動同步更新；公開文章以人物 ID 連動最新姓名、職稱與照片。</div>
  </div>
</div>
<div class="field-group"><label>10 秒摘要</label><textarea id="summary10s" maxlength="160" rows="3" placeholder="用 1–2 句話說明這篇文章在說什麼。">${escapeHTML(cmsSummary10s(a))}</textarea><div style="font-size:10px;color:#84919d;margin-top:6px">Public 會把這一小段放在文章正文最前面；Notion Article Summaries 同步使用同一份內容。</div></div>
<div class="field-group"><label>發布狀態</label><select id="status"><option value="Draft" ${a.status==='Draft'?'selected':''}>草稿</option><option value="Published" ${a.status==='Published'?'selected':''}>已發布</option></select></div><div class="field-group"><label>公開網址</label><input id="slug" value="${escapeHTML(a.slug||'')}"></div><div class="field-group"><label>發布日期</label><input id="publishedAt" type="date" value="${escapeHTML(a.publishedAt||'')}"></div><div class="field-group"><label>主題分類</label><select id="category" class="category-select">${(()=>{const opts=(data.topics||[]).filter(t=>t.active!==false).map(t=>t.name);if(a.category&&!opts.includes(a.category))opts.unshift(a.category);return opts.map(n=>`<option value="${escapeHTML(n)}" ${n===a.category?'selected':''}>${escapeHTML(n)}</option>`).join('')})()}</select><div style="font-size:10px;color:#84919d;margin-top:6px">主題可在左側「主題管理」新增或修改。</div></div>${swEvidenceEditorHTML(a)}<div class="field-group"><label>同步狀態</label><div style="font-size:11px;color:#74818d;line-height:1.7">右上角「發佈到網頁」就是唯一正式發布按鈕：會一次儲存文章、提交 GitHub、更新公開網站，成功後才標記完成；不需要再到「設定」按第二次。</div></div></aside></div>`;bindEditor()}
function syncEditorViewport(){
  const vv=window.visualViewport;
  const kb=vv?Math.max(0,Math.round(window.innerHeight-vv.height-vv.offsetTop)):0;
  const center=vv?Math.round(vv.offsetTop+vv.height/2):Math.round(window.innerHeight/2);
  document.documentElement.style.setProperty('--editor-kb',kb+'px');
  document.documentElement.style.setProperty('--editor-vv-center',center+'px');
}
let editorViewportBound=false;

let editorSavedRange=null;

function editorSelectionRange(){
  const editor=$('#content');
  const sel=window.getSelection?.();
  if(!editor||!sel||!sel.rangeCount)return null;
  const range=sel.getRangeAt(0);
  const node=range.commonAncestorContainer;
  if(node===editor||editor.contains(node.nodeType===1?node:node.parentNode))return range;
  return null;
}
function rememberEditorSelection(){
  const range=editorSelectionRange();
  if(range)editorSavedRange=range.cloneRange();
}
function restoreEditorSelection(){
  const editor=$('#content');
  if(!editor||!editorSavedRange)return false;
  try{
    const sel=window.getSelection();
    sel.removeAllRanges();
    sel.addRange(editorSavedRange);
    editor.focus({preventScroll:true});
    return true;
  }catch(_){return false}
}
function editorAnchorElement(){
  const sel=window.getSelection?.();
  let node=sel?.anchorNode;
  if(!node&&editorSavedRange)node=editorSavedRange.startContainer;
  if(node?.nodeType===3)node=node.parentElement;
  return node?.closest?.('#content *')||node;
}
function currentBlockTag(){
  let el=editorAnchorElement();
  if(!el)return 'p';
  el=el.closest?.('h2,h3,h4,blockquote,p,li,div')||el;
  const tag=String(el?.tagName||'P').toLowerCase();
  return ['h2','h3','h4','blockquote'].includes(tag)?tag:'p';
}
function blockLabel(tag){
  return ({p:'內文',h2:'大標題',h3:'中標題',h4:'小標題',blockquote:'引用'})[tag]||'內文';
}
function currentEditorFontSize(){
  let el=editorAnchorElement();
  if(!el||el===$('#content'))el=$('#content');
  const n=parseFloat(getComputedStyle(el).fontSize);
  return Number.isFinite(n)?Math.round(n):16;
}
function updatePagesToolbarState(){
  const editor=$('#content');
  if(!editor)return;

  const tag=currentBlockTag();
  const label=$('#styleCurrentLabel');
  if(label)label.textContent=blockLabel(tag);

  $$('#formatPopover [data-style-block]').forEach(b=>{
    b.classList.toggle('active',b.dataset.styleBlock===tag);
  });

  const size=$('#fontSizeLabel');
  if(size)size.textContent=String(currentEditorFontSize());

  ['bold','italic','underline','justifyLeft','justifyCenter','justifyRight'].forEach(cmd=>{
    try{
      $$(`[data-cmd="${cmd}"]`).forEach(b=>b.classList.toggle('active',document.queryCommandState(cmd)));
    }catch(_){}
  });

  ['undo','redo'].forEach(cmd=>{
    try{
      $$(`[data-cmd="${cmd}"]`).forEach(b=>{
        b.disabled=!document.queryCommandEnabled(cmd);
        b.setAttribute('aria-disabled',b.disabled?'true':'false');
      });
    }catch(_){}
  });
}
function runEditorFormat(command,value=null){
  restoreEditorSelection();

  if(command==='undo'||command==='redo'){
    const editor=$('#content');
    editor?.focus({preventScroll:true});

    try{
      document.execCommand(command,false,null);
    }catch(_){}

    setTimeout(()=>{
      scheduleSave();
      rememberEditorSelection();
      updatePagesToolbarState();
    },0);

    return;
  }

  runCommand(command,value);
  rememberEditorSelection();
  updatePagesToolbarState();
}
function applyEditorColor(color){
  restoreEditorSelection();
  $('#content')?.focus();
  try{
    document.execCommand('styleWithCSS',false,true);
    document.execCommand('foreColor',false,color==='auto'?'#3f4c59':color);
  }catch(_){}
  scheduleSave();
  rememberEditorSelection();
  updatePagesToolbarState();
}
function applyEditorHighlight(color){
  restoreEditorSelection();
  $('#content')?.focus();
  const c=color==='transparent'?'transparent':color;
  try{
    document.execCommand('styleWithCSS',false,true);
    if(!document.execCommand('hiliteColor',false,c)){
      document.execCommand('backColor',false,c);
    }
  }catch(_){
    try{document.execCommand('backColor',false,c)}catch(__){}
  }
  scheduleSave();
  rememberEditorSelection();
}
function changeEditorFontSize(delta){
  restoreEditorSelection();
  const editor=$('#content');
  if(!editor)return;

  const range=editorSelectionRange()||editorSavedRange;
  const current=currentEditorFontSize();
  const next=Math.max(11,Math.min(34,current+delta));

  try{
    if(range&&!range.collapsed){
      const span=document.createElement('span');
      span.style.fontSize=next+'px';
      try{
        range.surroundContents(span);
      }catch(_){
        const frag=range.extractContents();
        span.appendChild(frag);
        range.insertNode(span);
      }
      const sel=window.getSelection();
      const nr=document.createRange();
      nr.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(nr);
    }else{
      let el=editorAnchorElement();
      const block=el?.closest?.('p,h2,h3,h4,blockquote,li')||null;
      if(block)block.style.fontSize=next+'px';
      else document.execCommand('fontSize',false,next>=24?'5':next>=19?'4':next<=13?'2':'3');
    }
  }catch(_){}

  scheduleSave();
  rememberEditorSelection();
  updatePagesToolbarState();
}
function toggleFormatPopover(force){
  const pop=$('#formatPopover'),btn=$('#styleMenuBtn');
  if(!pop||!btn)return;
  const show=typeof force==='boolean'?force:!pop.classList.contains('show');
  pop.classList.toggle('show',show);
  btn.setAttribute('aria-expanded',show?'true':'false');
}

function bindEditor(){
  ['title','summary10s','slug','publishedAt','status','category','publisherId'].forEach(id=>{
    const el=$('#'+id);
    el?.addEventListener('input',scheduleSave);
    el?.addEventListener('change',scheduleSave);
  });
  $('#content')?.addEventListener('input',scheduleSave);

  const refreshPublisherPreview=()=>{
    const select=$('#publisherId');
    const box=$('#publisherPreview');
    if(!box)return;
    const p=cmsPersonById(select?.value||'');
    if(!p){
      const article=getCurrent();
      const brand=String(article?.publisherName||'').trim()||data.siteText?.articleBrand||'SIGN WELL · 欣緯生醫';
      box.innerHTML=`<div class="publisher-preview-avatar">SW</div><div class="publisher-preview-copy"><strong>${escapeHTML(brand)}</strong><span>品牌發布者</span></div>`;
      return;
    }
    box.innerHTML=`<div class="publisher-preview-avatar">${cmsPersonAvatarMarkup(p)}</div><div class="publisher-preview-copy"><strong>${escapeHTML(p.name||'未命名人物')}</strong><span>${escapeHTML(p.role||((p.education||[])[0]||'人物發布者'))}</span></div>`;
  };
  $('#publisherId')?.addEventListener('change',()=>{
    refreshPublisherPreview();
    scheduleSave();
  });
  refreshPublisherPreview();

  $$('#swEvidenceEditor input,#swEvidenceEditor textarea,#swEvidenceEditor select').forEach(el=>{
    el.addEventListener('input',scheduleSave);
    el.addEventListener('change',scheduleSave);
  });

  const toolbarButtons=$$('#editorToolbar button');

  toolbarButtons.forEach(b=>{
    b.addEventListener('pointerdown',e=>{
      rememberEditorSelection();
      if(b.matches('[data-cmd],[data-link],[data-quote],[data-highlight],#fontSizeMinus,#fontSizePlus,#textColorBtn,#styleMenuBtn')){
        e.preventDefault();
      }
      toolbarButtonEffect(b,e);
    });
    b.addEventListener('click',()=>toolbarButtonEffect(b));
  });

  $$('[data-cmd]').forEach(b=>b.onclick=()=>runEditorFormat(b.dataset.cmd,b.dataset.val||null));
  $$('[data-link]').forEach(b=>b.onclick=async()=>{
    const url=await swPrompt('貼上要插入文章的網址。',{title:'插入連結',kicker:'ARTICLE EDITOR',label:'連結網址',placeholder:'https://…',confirmText:'插入連結'});
    if(url)runEditorFormat('createLink',url);
  });
  $$('[data-quote]').forEach(b=>b.onclick=()=>runEditorFormat('formatBlock','blockquote'));
  $$('[data-highlight]').forEach(b=>b.onclick=()=>applyEditorHighlight('#fff1a8'));

  const dock=$('#editorToolDock'),fab=$('#toolFab'),toolbar=$('#editorToolbar');
  toolbar?.addEventListener('pointermove',e=>{
    const r=toolbar.getBoundingClientRect();
    const x=(e.clientX-r.left)/Math.max(1,r.width);
    toolbar.style.setProperty('--dock-rim',(95+x*170)+'deg');
  },{passive:true});

  toolbar?.addEventListener('pointerleave',()=>toolbar.style.setProperty('--dock-rim','135deg'),{passive:true});

  // Pages-like formatting inspector.
  $('#styleMenuBtn')?.addEventListener('pointerdown',rememberEditorSelection);
  $('#styleMenuBtn')?.addEventListener('click',e=>{
    e.stopPropagation();
    toggleFormatPopover();
  });
  $('#textColorBtn')?.addEventListener('pointerdown',rememberEditorSelection);
  $('#textColorBtn')?.addEventListener('click',e=>{
    e.stopPropagation();
    toggleFormatPopover(true);
  });

  $$('#formatPopover [data-style-block]').forEach(b=>{
    b.addEventListener('pointerdown',e=>e.preventDefault());
    b.onclick=()=>{
      runEditorFormat('formatBlock',b.dataset.styleBlock);
      toggleFormatPopover(false);
    };
  });
  $$('#formatPopover [data-text-color]').forEach(b=>{
    b.addEventListener('pointerdown',e=>e.preventDefault());
    b.onclick=()=>applyEditorColor(b.dataset.textColor);
  });
  $$('#formatPopover [data-highlight-color]').forEach(b=>{
    b.addEventListener('pointerdown',e=>e.preventDefault());
    b.onclick=()=>applyEditorHighlight(b.dataset.highlightColor);
  });

  $('#fontSizeMinus')?.addEventListener('pointerdown',rememberEditorSelection);
  $('#fontSizePlus')?.addEventListener('pointerdown',rememberEditorSelection);
  $('#fontSizeMinus')?.addEventListener('click',()=>changeEditorFontSize(-1));
  $('#fontSizePlus')?.addEventListener('click',()=>changeEditorFontSize(1));

  $('#clearInlineFormat')?.addEventListener('pointerdown',e=>e.preventDefault());
  $('#clearInlineFormat')?.addEventListener('click',()=>{
    runEditorFormat('removeFormat');
    toggleFormatPopover(false);
  });

  const content=$('#content');
  ['mouseup','keyup','input','focus'].forEach(ev=>content?.addEventListener(ev,()=>{
    rememberEditorSelection();
    updatePagesToolbarState();
  },{passive:ev!=='input'}));

  document.addEventListener('selectionchange',()=>{
    const range=editorSelectionRange();
    if(range){
      editorSavedRange=range.cloneRange();
      updatePagesToolbarState();
    }
  });

  document.addEventListener('pointerdown',e=>{
    const pop=$('#formatPopover'),styleBtn=$('#styleMenuBtn'),colorBtn=$('#textColorBtn');
    if(!pop?.classList.contains('show'))return;
    if(pop.contains(e.target)||styleBtn?.contains(e.target)||colorBtn?.contains(e.target))return;
    toggleFormatPopover(false);
  },{capture:true});

  updatePagesToolbarState();
  fab?.addEventListener('click',e=>{
    e.stopPropagation();
    const open=dock.classList.toggle('open');
    fab.setAttribute('aria-expanded',open?'true':'false');
  });
  document.addEventListener('pointerdown',e=>{
    if(!dock?.classList.contains('open'))return;
    if(dock.contains(e.target))return;
    dock.classList.remove('open');
    fab?.setAttribute('aria-expanded','false');
  },{once:true,capture:true});

  $('#insertImageBtn').onclick=()=>$('#inlineImageInput').click();
  $('#inlineImageInput').onchange=async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      const url=await compressImage(f,1400,.82);
      insertHTMLAtCursor(`<img src="${url}" alt="文章圖片">`);
      scheduleSave();
    }catch(_){showToast('圖片處理失敗')}
    e.target.value='';
  };

  $('#insertTableBtn')?.addEventListener('click',()=>openArticleDataBlockDialog('table'));
  $('#insertChartBtn')?.addEventListener('click',()=>openArticleDataBlockDialog('bar'));
  $('#insertStatsBtn')?.addEventListener('click',()=>openArticleDataBlockDialog('stats'));

  $('#coverBox').onclick=e=>{
    if(e.target.closest('#removeCover,#changeCover'))return;
    $('#coverInput').click();
  };
  $('#changeCover')?.addEventListener('click',e=>{e.stopPropagation();$('#coverInput').click()});
  $('#removeCover')?.addEventListener('click',e=>{
    e.stopPropagation();
    const a=getCurrent();if(!a)return;
    a.cover='';
    if(currentId!=='__new__')persist(true);
    renderEditor();
    scheduleSave();
  });
  $('#coverInput').onchange=async e=>{
    const f=e.target.files?.[0];if(!f)return;
    showToast('正在壓縮圖片…');
    try{
      const url=await compressImage(f,1600,.82);
      const a=getCurrent();if(!a)return;
      a.cover=url;
      if(currentId!=='__new__')persist(true);
      renderEditor();
      showToast('圖片已加入');
    }catch(_){showToast('圖片處理失敗')}
    e.target.value='';
  };

  syncEditorViewport();
  if(!editorViewportBound&&window.visualViewport){
    editorViewportBound=true;
    visualViewport.addEventListener('resize',syncEditorViewport,{passive:true});
    visualViewport.addEventListener('scroll',syncEditorViewport,{passive:true});
  }
}
function updateFromEditor(){const a=getCurrent();if(!a)return;a.title=$('#title').value.trim();a.content=$('#content').innerHTML;a.contentFormat='html';a.status=$('#status').value;a.slug=$('#slug').value.trim()||slugify(a.title);a.category=$('#category')?.value||a.category||'醫學筆記';a.publisherId=$('#publisherId')?.value||'';a.publisherName=a.publisherId?'':(a.publisherName||'SignWell·欣緯生醫');a.type='文章';a.subtitle='';a.excerpt=plainFromHTML(a.content).slice(0,180);a.summary10s=String($('#summary10s')?.value||a.summary10s||a.excerpt).replace(/\s+/g,' ').trim().slice(0,160);a.tags=a.tags||[];a.publishedAt=$('#publishedAt').value||new Date().toISOString().slice(0,10);swCollectEvidenceFromEditor(a);a.updatedAt=new Date().toISOString().slice(0,10)}
function syncPublicSnapshot(){try{localStorage.removeItem('signwell-public-live-v1')}catch(_){/* 公開站只讀 GitHub 部署檔，CMS 不再跨專案寫入公開預覽快照 */}}
function commitPendingArticle(){
  if(currentId!=='__new__'||!pendingNewArticle)return getCurrent();
  const a=pendingNewArticle;
  a.id='a-'+Date.now();
  data.articles.unshift(a);
  pendingNewArticle=null;
  currentId=a.id;
  return a;
}
function scheduleSave(){
  clearTimeout(saveTimer);
  if(currentId==='__new__'){
    updateFromEditor();
    $('#saveState').textContent='尚未儲存';
    $('#saveState').style.color='#9a7b45';
    return;
  }
  $('#saveState').textContent='儲存中…';
  $('#saveState').style.color='#8b97a2';
  saveTimer=setTimeout(()=>{updateFromEditor();persist();syncPublicSnapshot();const a=getCurrent();clearTimeout(swGlossaryIdleTimer);if(a&&currentId!=='__new__')swGlossaryIdleTimer=setTimeout(()=>swAutoGlossaryScanArticle(a,{silent:true}).catch(()=>{}),12000)},700);
}

let articleResultTimer=null;

function showArticleResultUI(kind='draft',title='',copy=''){
  const wrap=$('#articleResultOverlay');
  if(!wrap)return;

  clearTimeout(articleResultTimer);
  wrap.dataset.kind=kind;

  const icon=$('#articleResultIcon');
  const titleEl=$('#articleResultTitle');
  const copyEl=$('#articleResultCopy');

  if(icon)icon.textContent=kind==='warning'?'!':'✓';
  if(titleEl)titleEl.textContent=title||(
    kind==='publish'?'文章已發佈':
    kind==='warning'?'已發佈，但有項目未完成':
    '草稿已儲存'
  );
  if(copyEl)copyEl.textContent=copy||'已完成，正在返回文章管理。';

  wrap.classList.add('show');
  wrap.setAttribute('aria-hidden','false');

  articleResultTimer=setTimeout(()=>{
    wrap.classList.remove('show');
    wrap.setAttribute('aria-hidden','true');
  },1250);
}

function returnToArticlesWithResult(kind,title,copy,{confetti=false}={}){
  clearTimeout(saveTimer);

  nav('articles');

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      showArticleResultUI(kind,title,copy);
      if(confetti)showConfetti($('#articleResultOverlay .article-result-card'));
    });
  });
}

function toolbarButtonEffect(button,event=null){
  if(!button||button.disabled)return;

  if(event){
    const r=button.getBoundingClientRect();
    button.style.setProperty('--tool-x',`${Math.max(0,Math.min(r.width,event.clientX-r.left))}px`);
    button.style.setProperty('--tool-y',`${Math.max(0,Math.min(r.height,event.clientY-r.top))}px`);
  }else{
    button.style.setProperty('--tool-x','50%');
    button.style.setProperty('--tool-y','50%');
  }

  button.classList.remove('tool-pop');
  void button.offsetWidth;
  button.classList.add('tool-pop');
  setTimeout(()=>button.classList.remove('tool-pop'),430);
}

function saveNow(){
  clearTimeout(saveTimer);
  updateFromEditor();

  let a=getCurrent();
  if(!a)return false;

  a.status='Draft';
  if($('#status'))$('#status').value='Draft';

  a=commitPendingArticle()||a;
  a.status='Draft';

  persist();
  syncPublicSnapshot();
  swAutoGlossaryScanArticle(a,{silent:true}).catch(()=>{});

  $('#saveState').textContent='草稿已儲存 ✓';
  $('#saveState').style.color='#6f8f86';

  const title=a.title||'未命名文章';

  returnToArticlesWithResult(
    'draft',
    '草稿已儲存',
    `「${title}」已安全儲存。`,
    {confetti:false}
  );

  return true;
}
function publishNow(){
  clearTimeout(saveTimer);
  updateFromEditor();
  let a=getCurrent();
  if(!a?.title){showToast('請先輸入標題');$('#title')?.focus();return false}
  a.status='Published';
  if($('#status'))$('#status').value='Published';
  a=commitPendingArticle()||a;
  a.status='Published';
  persist(true);
  syncPublicSnapshot();
  $('#saveState').textContent='準備發佈…';
  $('#saveState').style.color='#7f8d99';
  return true;
}
function runCommand(cmd,val=null){$('#content').focus();try{document.execCommand(cmd,false,val)}catch(_){ }scheduleSave()}
function insertHTMLAtCursor(html){$('#content').focus();try{document.execCommand('insertHTML',false,html)}catch(_){const sel=getSelection();if(!sel?.rangeCount)return;const r=sel.getRangeAt(0);const t=document.createElement('template');t.innerHTML=html;r.deleteContents();r.insertNode(t.content);r.collapse(false)}}
function swEnsureArticleDataDialog(){
  let root=document.getElementById('swArticleDataDialog');
  if(root)return root;
  root=document.createElement('div');
  root.id='swArticleDataDialog';
  root.className='sw-data-dialog';
  root.setAttribute('aria-hidden','true');
  root.innerHTML=`<section class="sw-data-dialog-card" role="dialog" aria-modal="true" aria-labelledby="swDataDialogTitle">
    <div class="sw-data-dialog-head"><div><span>ARTICLE DATA BLOCK</span><h3 id="swDataDialogTitle">插入資料模組</h3></div><button type="button" id="swDataDialogClose" aria-label="關閉">×</button></div>
    <p id="swDataDialogHelp">將資料整理成可在手機與桌機閱讀的結構化模組。</p>
    <div class="sw-data-dialog-grid" id="swDataDialogFields"></div>
    <div class="sw-data-dialog-note">手動新增的數據請自行確認來源與數值；若是醫療主張，仍建議在文章中附可核對來源。</div>
    <div class="sw-data-dialog-actions"><button type="button" id="swDataDialogCancel">取消</button><button type="button" class="primary" id="swDataDialogInsert">插入文章</button></div>
  </section>`;
  document.body.appendChild(root);
  const close=()=>{root.classList.remove('show');root.setAttribute('aria-hidden','true')};
  root.querySelector('#swDataDialogClose').onclick=close;
  root.querySelector('#swDataDialogCancel').onclick=close;
  root.addEventListener('click',e=>{if(e.target===root)close()});
  return root;
}
function swDataEscape(v=''){return escapeHTML(String(v||'').trim())}
function swSplitDataRows(v=''){
  return String(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(line=>line.split('|').map(x=>x.trim()));
}
function swParseDataNumber(v=''){
  const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);
  return m?Number(m[0]):NaN;
}
function swBuildManualDataBlock(type,values){
  const title=swDataEscape(values.title||'');
  const source=swDataEscape(values.source||'');
  const sourceHtml=source?`<figcaption class="sw-data-source">資料來源／註記：${source}</figcaption>`:'';
  if(type==='table'){
    const cols=String(values.columns||'').split('|').map(x=>x.trim()).filter(Boolean);
    const rows=swSplitDataRows(values.rows||'');
    if(cols.length<2||!rows.length)throw new Error('表格至少需要 2 欄與 1 列資料。');
    const head=`<thead><tr>${cols.map(c=>`<th>${swDataEscape(c)}</th>`).join('')}</tr></thead>`;
    const body=`<tbody>${rows.map(row=>`<tr>${cols.map((_,i)=>`<td>${swDataEscape(row[i]||'')}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<figure class="sw-data-block sw-data-table-block"><div class="sw-data-kicker">DATA TABLE</div>${title?`<h3>${title}</h3>`:''}<div class="sw-data-table-scroll"><table class="sw-data-table">${head}${body}</table></div>${sourceHtml}</figure><p><br></p>`;
  }
  if(type==='bar'){
    const labels=String(values.labels||'').split('|').map(x=>x.trim()).filter(Boolean);
    const vals=String(values.values||'').split('|').map(x=>x.trim()).filter(Boolean);
    if(labels.length<2||labels.length!==vals.length)throw new Error('圖表的標籤與數值數量必須一致，且至少 2 組。');
    const nums=vals.map(swParseDataNumber);if(nums.some(n=>!Number.isFinite(n)))throw new Error('圖表數值必須包含可辨識的數字。');
    const max=Math.max(...nums.map(n=>Math.abs(n)),1);
    const unit=swDataEscape(values.unit||'');
    const bars=labels.map((label,i)=>{const w=Math.max(4,Math.min(100,Math.abs(nums[i])/max*100));return `<div class="sw-data-bar-row"><div class="sw-data-bar-label">${swDataEscape(label)}</div><div class="sw-data-bar-track"><i style="--sw-bar:${w.toFixed(2)}%"></i></div><strong>${swDataEscape(vals[i])}${unit&&!String(vals[i]).includes(unit)?` ${unit}`:''}</strong></div>`}).join('');
    return `<figure class="sw-data-block sw-data-chart"><div class="sw-data-kicker">DATA CHART</div>${title?`<h3>${title}</h3>`:''}<div class="sw-data-bars">${bars}</div>${sourceHtml}</figure><p><br></p>`;
  }
  const rows=swSplitDataRows(values.items||'');
  if(!rows.length)throw new Error('請至少輸入 1 組統計數據。');
  const cards=rows.slice(0,6).map(row=>`<div class="sw-stat-item"><span>${swDataEscape(row[0]||'數據')}</span><strong>${swDataEscape(row[1]||'—')}</strong>${row[2]?`<small>${swDataEscape(row[2])}</small>`:''}</div>`).join('');
  return `<figure class="sw-data-block sw-stat-block"><div class="sw-data-kicker">KEY NUMBERS</div>${title?`<h3>${title}</h3>`:''}<div class="sw-stat-grid">${cards}</div>${sourceHtml}</figure><p><br></p>`;
}
function openArticleDataBlockDialog(type='table'){
  rememberEditorSelection();
  const root=swEnsureArticleDataDialog(),fields=root.querySelector('#swDataDialogFields'),title=root.querySelector('#swDataDialogTitle'),help=root.querySelector('#swDataDialogHelp'),insert=root.querySelector('#swDataDialogInsert');
  const common=`<label class="wide">標題（選填）<input id="swDataTitle" placeholder="例：主要研究結果"></label>`;
  if(type==='table'){
    title.textContent='插入表格';help.textContent='欄名與每列資料都用 | 分隔；每一列資料請換行。';
    fields.innerHTML=common+`<label class="wide">欄名<input id="swDataColumns" placeholder="指標 | 治療組 | 對照組"></label><label class="wide">資料列<textarea id="swDataRows" rows="5" placeholder="體重變化 | -15.2% | -2.4%&#10;腰圍變化 | -13 cm | -4 cm"></textarea></label><label class="wide">資料來源／註記（選填）<input id="swDataSource" placeholder="例：研究報告／官方統計，2026"></label>`;
  }else if(type==='bar'){
    title.textContent='插入圖表';help.textContent='目前使用輕量長條圖；標籤與數值都用 | 分隔，數量必須一致。';
    fields.innerHTML=common+`<label class="wide">標籤<input id="swDataLabels" placeholder="治療組 | 對照組 | 安慰劑"></label><label class="wide">數值<input id="swDataValues" placeholder="15.2 | 7.1 | 2.4"></label><label>單位（選填）<input id="swDataUnit" placeholder="%"></label><label>資料來源／註記（選填）<input id="swDataSource" placeholder="例：研究報告，2026"></label>`;
  }else{
    title.textContent='插入統計數據卡';help.textContent='每行一張數據卡，格式：標籤 | 數值 | 補充說明（補充可省略）。';
    fields.innerHTML=common+`<label class="wide">統計數據<textarea id="swDataItems" rows="5" placeholder="樣本數 | 1,024 人 | 多中心研究&#10;主要結果 | -15.2% | 68 週"></textarea></label><label class="wide">資料來源／註記（選填）<input id="swDataSource" placeholder="例：官方統計／研究資料"></label>`;
  }
  root.classList.add('show');root.setAttribute('aria-hidden','false');
  setTimeout(()=>root.querySelector('input,textarea')?.focus(),40);
  insert.onclick=()=>{
    try{
      const vals={title:root.querySelector('#swDataTitle')?.value||'',source:root.querySelector('#swDataSource')?.value||'',columns:root.querySelector('#swDataColumns')?.value||'',rows:root.querySelector('#swDataRows')?.value||'',labels:root.querySelector('#swDataLabels')?.value||'',values:root.querySelector('#swDataValues')?.value||'',unit:root.querySelector('#swDataUnit')?.value||'',items:root.querySelector('#swDataItems')?.value||''};
      const html=swBuildManualDataBlock(type,vals);restoreEditorSelection();insertHTMLAtCursor(html);scheduleSave();root.classList.remove('show');root.setAttribute('aria-hidden','true');showToast(type==='table'?'表格已插入':type==='bar'?'圖表已插入':'數據卡已插入');
    }catch(err){showToast(err.message||'資料格式有誤')}
  };
}

function compressImage(file,maxSide=1600,quality=.82){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{let w=img.naturalWidth,h=img.naturalHeight;const scale=Math.min(1,maxSide/Math.max(w,h));w=Math.max(1,Math.round(w*scale));h=Math.max(1,Math.round(h*scale));const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);let out;try{out=c.toDataURL('image/webp',quality);if(!out.startsWith('data:image/webp'))out=c.toDataURL('image/jpeg',quality)}catch(_){out=c.toDataURL('image/jpeg',quality)}resolve(out)};img.src=reader.result};reader.readAsDataURL(file)})}
function preview(){updateFromEditor();const a=getCurrent();$('#previewContent').innerHTML=`${a.cover?`<img src="${a.cover}" alt="" style="width:100%;max-height:420px;object-fit:cover;border-radius:22px;margin-bottom:28px">`:'<div class="preview-default-cover" aria-label="SIGN WELL 預設封面"></div>'}<h1>${escapeHTML(a.title||'未命名文章')}</h1>${cmsSummary10s(a)?`<aside class="cms-summary10s-preview"><b>10 秒摘要</b><p>${escapeHTML(cmsSummary10s(a))}</p></aside>`:''}${articleHTML(a)}`;$('#previewOverlay').classList.add('show')}
function renderTopicsManager(){
  data.topics=Array.isArray(data.topics)?data.topics:[];let editId=null;
  const paint=()=>{const sorted=data.topics.slice().sort((a,b)=>(a.order??999)-(b.order??999));$('#view').innerHTML=`<div class="page-head"><div><h1>主題管理</h1><p>在這裡建立前台「主題探討」頁的分類。文章編輯器會自動使用這些主題。</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="top-action online" id="syncTopicsBtn">發佈到網頁</button><button class="top-action primary" id="newTopicBtn">新增主題</button></div></div><div class="topic-admin"><section class="topic-list"><div class="panel-head"><span>主題列表</span><span>${sorted.length} 個</span></div>${sorted.length?sorted.map((tp,i)=>`<div class="topic-row-admin"><div><strong>${escapeHTML(tp.name||'未命名主題')} ${tp.active===false?'<span class="topic-badge">已隱藏</span>':''}</strong><span>${escapeHTML(tp.description||'尚未填寫說明')} · ${data.articles.filter(a=>a.category===tp.name).length} 篇文章</span></div><div class="topic-row-actions"><button data-topic-edit="${escapeHTML(tp.id)}">編輯</button><button data-topic-up="${escapeHTML(tp.id)}">↑</button><button data-topic-down="${escapeHTML(tp.id)}">↓</button><button data-topic-del="${escapeHTML(tp.id)}">刪除</button></div></div>`).join(''):'<div class="empty">尚未建立主題。</div>'}</section><aside class="topic-form"><h3 id="topicFormTitle">新增主題</h3><div class="field-group"><label>主題名稱</label><input id="topicName" placeholder="例如：重症醫學"></div><div class="field-group"><label>公開網址代稱</label><input id="topicSlug" placeholder="critical-care"></div><div class="field-group"><label>主題說明</label><textarea id="topicDesc" placeholder="說明這個主題涵蓋哪些內容。"></textarea></div><label class="topic-active"><input type="checkbox" id="topicActive" checked> 顯示在前台主題探討頁</label><div class="site-text-actions" style="margin-top:14px"><button class="top-action primary" id="saveTopic">儲存主題</button><button class="top-action online" id="saveTopicOnline">儲存並發佈到網頁</button><button class="top-action" id="cancelTopic">清除</button></div><p class="topic-help">按「儲存並發佈到網頁」會直接更新 <code>topics/index.json</code>、<code>public-data.json · siteText + topics + people</code> 與 <code>site-content.js</code>，再從 GitHub 讀回驗證。主題名稱、說明與主題頁文字會使用同一份資料來源。</p></aside></div>`;
    const clear=()=>{editId=null;$('#topicFormTitle').textContent='新增主題';$('#topicName').value='';$('#topicSlug').value='';$('#topicDesc').value='';$('#topicActive').checked=true};
    $$('[data-topic-edit]').forEach(b=>b.onclick=()=>{const tp=data.topics.find(x=>x.id===b.dataset.topicEdit);if(!tp)return;editId=tp.id;$('#topicFormTitle').textContent='編輯主題';$('#topicName').value=tp.name||'';$('#topicSlug').value=tp.slug||'';$('#topicDesc').value=tp.description||'';$('#topicActive').checked=tp.active!==false});
    const move=(id,dir)=>{const arr=data.topics.slice().sort((a,b)=>(a.order??999)-(b.order??999)),i=arr.findIndex(x=>x.id===id),j=i+dir;if(i<0||j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];arr.forEach((x,k)=>x.order=k);data.topics=arr;persist(true);paint()};
    $$('[data-topic-up]').forEach(b=>b.onclick=()=>move(b.dataset.topicUp,-1));$$('[data-topic-down]').forEach(b=>b.onclick=()=>move(b.dataset.topicDown,1));
    $$('[data-topic-del]').forEach(b=>b.onclick=async()=>{const tp=data.topics.find(x=>x.id===b.dataset.topicDel);if(!tp)return;if(!(await swConfirm(`刪除主題「${tp.name}」？\n文章本身不會被刪除。`,{title:'刪除主題？',kicker:'DANGER ZONE',danger:true,confirmText:'確認刪除'})))return;data.topics=data.topics.filter(x=>x.id!==tp.id);persist(true);paint();showToast('主題已刪除')});
    const saveTopicLocal=()=>{const name=$('#topicName').value.trim(),slug=$('#topicSlug').value.trim()||slugify(name),description=$('#topicDesc').value.trim(),active=$('#topicActive').checked;if(!name){showToast('請輸入主題名稱');return null}let renamed=false;if(editId){const tp=data.topics.find(x=>x.id===editId);if(!tp)return null;const oldName=tp.name||'';renamed=Boolean(oldName&&oldName!==name);Object.assign(tp,{name,slug,description,active});if(renamed)data.articles.forEach(a=>{if(a.category===oldName)a.category=name})}else data.topics.push({id:'topic-'+Date.now(),name,slug,description,active,order:data.topics.length});persist(true);editId=null;return{renamed}};$('#saveTopic').onclick=()=>{if(!saveTopicLocal())return;paint();showToast('主題已儲存')};$('#saveTopicOnline').onclick=async()=>{const result=saveTopicLocal();if(!result)return;paint();try{if(result.renamed)await publishGitHub();else await publishTopicsOnly()}catch(e){showToast('主題同步失敗：'+e.message)}};
    $('#cancelTopic').onclick=clear;$('#newTopicBtn').onclick=clear;$('#syncTopicsBtn').onclick=async()=>{try{await publishTopicsOnly()}catch(e){showToast('主題同步失敗：'+e.message)}};
  };paint();
}
function renderSiteText(){
  data.siteText={...DEFAULT_SITE_TEXT,...(data.siteText||{})};
  data.people=Array.isArray(data.people)?data.people:[];
  const s=data.siteText;
  const input=(key,label,multi=false)=>`<div class="site-field"><label>${label}</label>${multi?`<textarea data-site-key="${key}">${escapeHTML(s[key]||'')}</textarea>`:`<input data-site-key="${key}" value="${escapeHTML(s[key]||'')}">`}</div>`;

  $('#view').innerHTML=`<div class="page-head">
    <div>
      <h1>主頁設定</h1>
      <p>修改公開使用者端的品牌、首頁、關於我們、人物資料與頁尾文字。人物與學經歷會一起寫入 public-data.json。</p>
    </div>
  </div>

  <div class="site-text-wrap">
    <section class="site-text-card">
      <h3>公開網站內容</h3>
      <p>主頁設定與關於人物皆由 CMS 維護；只有按「儲存並發布到網站」才會同步到 GitHub Pages。</p>

      <div class="site-section">
        <div class="site-section-title">品牌與導覽</div>
        ${input('siteTitle','瀏覽器標題')}
        ${input('brandEnglish','英文品牌')}
        ${input('brandChinese','中文品牌')}
        ${input('navArticles','導覽：文章')}
        ${input('navTopics','導覽：主題')}
        ${input('navAbout','導覽：關於我們')}
      </div>

      <div class="site-section">
        <div class="site-section-title">首頁主視覺</div>
        ${input('homeEyebrow','首頁小標')}
        ${input('homeTitle1','主標題第一行')}
        ${input('homeTitle2','主標題第二行')}
        ${input('homeSubtitle','首頁介紹',true)}
        ${input('homeCardTitle','主視覺補充標題',true)}
        ${input('homeCardBody','主視覺補充說明',true)}
      </div>

      <div class="site-section">
        <div class="site-section-title">每日新文章</div>
        ${input('dailyEyebrow','區段小標')}
        ${input('dailyTitle','區段標題')}
        ${input('dailyDescription','區段說明')}
      </div>

      <div class="site-section">
        <div class="site-section-title">主題探討頁</div>
        ${input('topicsEyebrow','頁面小標')}
        ${input('topicsTitle','頁面標題',true)}
        ${input('topicsSubtitle','頁面說明',true)}
      </div>

      <div class="site-section">
        <div class="site-section-title">分享我們頁</div>
        ${input('shareEyebrow','頁面小標')}
        ${input('shareTitle','頁面標題',true)}
        ${input('shareSubtitle','頁面說明',true)}
      </div>

      <div class="site-section">
        <div class="site-section-title">關於我們頁</div>
        ${input('aboutEyebrow','頁面小標')}
        ${input('aboutTitle','頁面標題')}
        ${input('aboutBody','品牌介紹',true)}
        ${input('aboutManifestoTitle','右側宣言標題',true)}
        ${input('aboutManifestoBody','右側宣言說明',true)}
        ${input('aboutFocusLabel','核心欄標籤')}
        ${input('aboutFocusValue','核心欄內容')}
        ${input('aboutFormatLabel','形式欄標籤')}
        ${input('aboutFormatValue','形式欄內容')}
        ${input('aboutPrincipleLabel','原則欄標籤')}
        ${input('aboutPrincipleValue','原則欄內容')}
        ${input('aboutPeopleEyebrow','人物區小標')}
        ${input('aboutPeopleTitle','人物區標題')}
        ${input('aboutPeopleSubtitle','人物區說明',true)}
        ${input('aboutDisclaimer','關於頁醫療聲明',true)}

        <div class="people-admin-wrap">
          <div class="people-admin-head">
            <div>
              <h4>人物與學經歷</h4>
              <p>可新增多人、排序、隱藏；每個人物可維護角色、專長、學歷、經歷與照片 URL。</p>
            </div>
            <button class="top-action" id="newPersonBtn" type="button">＋ 新增人物</button>
          </div>

          <div class="people-admin-grid">
            <div class="people-list" id="peopleList"></div>

            <div class="person-form is-adding" id="personForm">
              <div class="person-form-modebar">
                <div>
                  <strong id="personFormTitle">新增人物</strong>
                  <span id="personFormHint">建立全新人物；不會覆蓋既有人物。</span>
                </div>
                <span class="person-mode-pill" id="personModePill">NEW</span>
              </div>
              <input type="hidden" id="personId">
              <div class="person-form-row">
                <div class="site-field"><label>姓名</label><input id="personName" placeholder="例如：Lin Che-Kai"></div>
                <div class="site-field"><label>角色 / 職稱</label><input id="personRole" placeholder="例如：Editor · Medical Student"></div>
              </div>

              <div class="site-field"><label>人物簡介</label><textarea id="personBio" placeholder="簡短介紹這個人與 SIGN WELL 的角色。"></textarea></div>
              <div class="site-field"><label>照片 URL（選填）</label><input id="personPhoto" placeholder="https://..."></div>
              <div class="site-field"><label>專長標籤（逗號分隔）</label><input id="personExpertise" placeholder="臨床推理, 預防醫學, 醫療科技"></div>

              <div class="person-form-row">
                <div class="site-field"><label>學歷（每行一項）</label><textarea id="personEducation" placeholder="中國醫藥大學 醫學系&#10;..."></textarea></div>
                <div class="site-field"><label>經歷（每行一項）</label><textarea id="personExperience" placeholder="SIGN WELL Editor&#10;..."></textarea></div>
              </div>

              <label class="person-active"><input type="checkbox" id="personActive" checked> 顯示在公開「關於我們」頁</label>

              <div class="person-form-actions">
                <button class="top-action primary" id="savePersonBtn" type="button">新增人物</button>
                <button class="top-action person-editor-cancel" id="cancelPersonEditBtn" type="button">取消編輯</button>
                <button class="top-action" id="clearPersonBtn" type="button">清空欄位</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="site-section">
        <div class="site-section-title">文章頁</div>
        ${input('articleBrand','文章作者／品牌列')}
        ${input('minutesReadSuffix','閱讀時間文字')}
        ${input('updatedLabel','更新日期文字')}
        ${input('shareLabel','分享按鈕')}
        ${input('copyLinkLabel','複製連結按鈕')}
        ${input('tocTitle','文章目錄標題')}
      </div>

      <div class="site-section">
        <div class="site-section-title">頁尾與搜尋</div>
        ${input('footerTagline','頁尾標語',true)}
        ${input('footerDisclaimer','頁尾醫療聲明',true)}
        ${input('searchPlaceholder','搜尋框提示')}
      </div>

      <div class="site-text-actions">
        <button class="top-action primary" id="saveSiteText">儲存主頁設定</button>
        <button class="top-action online" id="publishSiteText">儲存並發布到網站</button>
        <button class="top-action" id="resetSiteText">恢復預設文字</button>
      </div>
      <div class="site-publish-hint">
        公開站優先讀取 <b>public-data.json</b>。人物資料也包含在同一份 bundle，因此跨裝置 CMS、GitHub Pages 與 About 頁使用同一來源。
      </div>
    </section>

    <aside class="site-preview-box">
      <div class="live-preview-toolbar">
        <div>
          <strong>更改後即時預覽</strong>
          <span>尚未發布的輸入也會立即顯示</span>
        </div>
        <div class="live-preview-tabs">
          <button class="active" type="button" data-live-preview-tab="home">首頁</button>
          <button type="button" data-live-preview-tab="about">關於</button>
        </div>
      </div>
      <div class="live-browser">
        <div class="live-browser-bar"><i></i><i></i><i></i><div class="live-browser-url">980510linz.github.io/-/</div></div>
        <div class="live-preview-stage" id="liveSitePreview"></div>
      </div>
      <div class="live-preview-unsaved"><i></i>編輯中預覽；按「儲存並發布到網站」後才會公開。</div>
    </aside>
  </div>`;

  const collect=()=>{
    $$('[data-site-key]').forEach(el=>{data.siteText[el.dataset.siteKey]=el.value});
    persist(true);
    syncPublicSnapshot();
    $('#saveState').textContent='主頁設定已儲存 ✓';
    $('#saveState').style.color='#6f8f86';
  };

  let livePreviewMode='home';
  const livePreviewInitials=name=>{
    const clean=String(name||'').trim();
    if(!clean)return 'SW';
    const parts=clean.split(/\s+/).filter(Boolean);
    return parts.length>1?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():clean.slice(0,2).toUpperCase();
  };
  const renderLivePreview=()=>{
    const box=$('#liveSitePreview');
    if(!box)return;
    const s=data.siteText||{};
    const visiblePeople=(data.people||[]).filter(p=>p&&p.active!==false).slice().sort((a,b)=>(a.order??999)-(b.order??999)).slice(0,3);
    const nav=`<div class="live-preview-nav">
      <span class="live-preview-brand">${escapeHTML(s.brandEnglish||'SIGN WELL')}</span>
      <div class="live-preview-navlinks">
        <span>${escapeHTML(s.navArticles||'文章')}</span>
        <span>${escapeHTML(s.navTopics||'主題')}</span>
        <span>${escapeHTML(s.navAbout||'關於我們')}</span>
      </div>
    </div>`;

    if(livePreviewMode==='about'){
      box.innerHTML=nav+`
        <div class="live-preview-eyebrow">${escapeHTML(s.aboutEyebrow||'ABOUT SIGN WELL')}</div>
        <div class="live-preview-title">${escapeHTML(s.aboutTitle||'關於我們')}</div>
        <div class="live-preview-copy">${escapeHTML(s.aboutBody||'')}</div>
        <div class="live-preview-hero-card">
          <strong>${escapeHTML(s.aboutManifestoTitle||'')}</strong>
          <span>${escapeHTML(s.aboutManifestoBody||'')}</span>
        </div>
        <div class="live-preview-about-values">
          <div><span>${escapeHTML(s.aboutFocusLabel||'核心')}</span><b>${escapeHTML(s.aboutFocusValue||'')}</b></div>
          <div><span>${escapeHTML(s.aboutFormatLabel||'形式')}</span><b>${escapeHTML(s.aboutFormatValue||'')}</b></div>
          <div><span>${escapeHTML(s.aboutPrincipleLabel||'原則')}</span><b>${escapeHTML(s.aboutPrincipleValue||'')}</b></div>
        </div>
        <div style="margin-top:16px">
          <div class="live-preview-eyebrow">${escapeHTML(s.aboutPeopleEyebrow||'PEOPLE')}</div>
          <div style="margin-top:5px;color:#3c596d;font:500 17px/1.1 Georgia,'Noto Serif TC',serif">${escapeHTML(s.aboutPeopleTitle||'我們是誰')}</div>
        </div>
        <div class="live-preview-people">
          ${visiblePeople.length?visiblePeople.map(p=>`
            <div class="live-preview-person">
              <div class="live-preview-avatar">${cmsPersonAvatarMarkup(p)}</div>
              <div><strong>${escapeHTML(p.name||'未命名')}</strong><span>${escapeHTML(p.role||((p.education||[])[0]||''))}</span></div>
            </div>`).join(''):'<div class="live-preview-copy">尚未新增公開人物</div>'}
        </div>`;
      return;
    }

    box.innerHTML=nav+`
      <div class="live-preview-eyebrow">${escapeHTML(s.homeEyebrow||'')}</div>
      <div class="live-preview-title">${escapeHTML(s.homeTitle1||'')}<br>${escapeHTML(s.homeTitle2||'')}</div>
      <div class="live-preview-copy">${escapeHTML(s.homeSubtitle||'')}</div>
      <div class="live-preview-hero-card">
        <strong>${escapeHTML(s.homeCardTitle||'')}</strong>
        <span>${escapeHTML(s.homeCardBody||'')}</span>
      </div>
      <div style="margin-top:22px">
        <div class="live-preview-eyebrow">${escapeHTML(s.dailyEyebrow||'')}</div>
        <div style="margin-top:7px;color:#3c596d;font:500 18px/1.1 Georgia,'Noto Serif TC',serif">${escapeHTML(s.dailyTitle||'')}</div>
        <div class="live-preview-copy" style="margin-top:5px">${escapeHTML(s.dailyDescription||'')}</div>
      </div>`;
  };

  const splitLines=v=>String(v||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const splitTags=v=>String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
  const initials=name=>{
    const clean=String(name||'').trim();
    if(!clean)return 'SW';
    const parts=clean.split(/\s+/).filter(Boolean);
    return parts.length>1?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():clean.slice(0,2).toUpperCase();
  };

  const sortedPeople=()=>data.people.slice().sort((a,b)=>(a.order??999)-(b.order??999));

  /* v14.23: add/edit are explicit modes, not inferred from a stale hidden ID. */
  let personEditorMode='add';
  let personEditingId='';

  const setPersonEditorMode=(mode,id='')=>{
    const form=$('#personForm');
    const title=$('#personFormTitle');
    const hint=$('#personFormHint');
    const pill=$('#personModePill');
    const save=$('#savePersonBtn');

    personEditorMode=mode==='edit'?'edit':'add';
    personEditingId=personEditorMode==='edit'?String(id||''):'';

    if($('#personId'))$('#personId').value=personEditingId;

    form?.classList.toggle('is-editing',personEditorMode==='edit');
    form?.classList.toggle('is-adding',personEditorMode==='add');

    if(personEditorMode==='edit'){
      const person=data.people.find(x=>String(x.id)===personEditingId);
      if(title)title.textContent='編輯人物';
      if(hint)hint.textContent=`只會修改「${person?.name||'這位人物'}」，不會建立新人物。`;
      if(pill)pill.textContent='EDIT';
      if(save)save.textContent='儲存變更';
    }else{
      if(title)title.textContent='新增人物';
      if(hint)hint.textContent='建立全新人物；不會覆蓋既有人物。';
      if(pill)pill.textContent='NEW';
      if(save)save.textContent='新增人物';
    }

    renderPeopleList();
  };

  const clearPersonFields=()=>{
    $('#personName').value='';
    $('#personRole').value='';
    $('#personBio').value='';
    $('#personPhoto').value='';
    $('#personExpertise').value='';
    $('#personEducation').value='';
    $('#personExperience').value='';
    $('#personActive').checked=true;
  };

  const startNewPerson=({focus=true}={})=>{
    clearPersonFields();
    setPersonEditorMode('add');
    if(focus)requestAnimationFrame(()=>$('#personName')?.focus());
  };

  const clearPersonForm=()=>{
    clearPersonFields();
    if(personEditorMode==='edit')$('#personId').value=personEditingId;
  };

  const loadPerson=id=>{
    const p=data.people.find(x=>String(x.id)===String(id));
    if(!p)return;

    setPersonEditorMode('edit',p.id);
    $('#personName').value=p.name||'';
    $('#personRole').value=p.role||'';
    $('#personBio').value=p.bio||'';
    $('#personPhoto').value=p.photo||'';
    $('#personExpertise').value=(p.expertise||[]).join(', ');
    $('#personEducation').value=(p.education||[]).join('\n');
    $('#personExperience').value=(p.experience||[]).join('\n');
    $('#personActive').checked=p.active!==false;

    requestAnimationFrame(()=>$('#personName')?.focus());
  };

  const renderPeopleList=()=>{
    const list=$('#peopleList');
    const arr=sortedPeople();
    if(!arr.length){
      list.innerHTML='<div class="people-empty">尚未新增人物。按「新增人物」建立第一張公開人物卡。</div>';
      return;
    }
    list.innerHTML=arr.map((p,i)=>`
      <div class="person-admin-row ${personEditorMode==='edit'&&String(p.id)===personEditingId?'is-selected':''}">
        <div class="person-admin-avatar">${cmsPersonAvatarMarkup(p)}</div>
        <div class="person-admin-copy">
          <strong>${escapeHTML(p.name||'未命名人物')} ${p.active===false?'<span class="topic-badge">已隱藏</span>':''}</strong>
          <span>${escapeHTML(p.role||'尚未填寫角色')} · ${(p.education||[]).length} 項學歷 · ${(p.experience||[]).length} 項經歷</span>
        </div>
        <div class="person-admin-actions">
          <button type="button" data-person-edit="${escapeHTML(p.id)}" title="編輯">編</button>
          <button type="button" data-person-up="${escapeHTML(p.id)}" title="上移">↑</button>
          <button type="button" data-person-down="${escapeHTML(p.id)}" title="下移">↓</button>
          <button type="button" data-person-del="${escapeHTML(p.id)}" title="刪除">×</button>
        </div>
      </div>`).join('');

    $$('[data-person-edit]').forEach(b=>b.onclick=()=>loadPerson(b.dataset.personEdit));
    $$('[data-person-del]').forEach(b=>b.onclick=async()=>{
      const p=data.people.find(x=>String(x.id)===String(b.dataset.personDel));
      if(!p||!(await swConfirm(`刪除人物「${p.name||'未命名'}」？\n此人物將不再出現在 About 與文章發布者選單。`,{title:'刪除人物？',kicker:'DANGER ZONE',danger:true,confirmText:'確認刪除'})))return;
      data.people=data.people.filter(x=>String(x.id)!==String(p.id));
      data.people.forEach((x,i)=>x.order=i);
      persist(true);
      if(personEditorMode==='edit'&&String(personEditingId)===String(p.id)){
        startNewPerson({focus:false});
      }else{
        renderPeopleList();
      }
      renderLivePreview();
      showToast('人物已刪除');
    });
    $$('[data-person-up],[data-person-down]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.personUp||b.dataset.personDown;
      const arr=sortedPeople();
      const idx=arr.findIndex(x=>String(x.id)===String(id));
      if(idx<0)return;
      const next=b.dataset.personUp!==undefined?Math.max(0,idx-1):Math.min(arr.length-1,idx+1);
      if(next===idx)return;
      [arr[idx],arr[next]]=[arr[next],arr[idx]];
      arr.forEach((x,i)=>x.order=i);
      data.people=arr;
      persist(true);
      renderPeopleList();
      renderLivePreview();
    });
  };

  $$('[data-site-key]').forEach(el=>el.addEventListener('input',()=>{
    data.siteText[el.dataset.siteKey]=el.value;
    renderLivePreview();
    clearTimeout(saveTimer);
    $('#saveState').textContent='儲存中…';
    saveTimer=setTimeout(()=>collect(),650);
  }));

  $('#newPersonBtn').onclick=()=>startNewPerson();
  $('#clearPersonBtn').onclick=clearPersonForm;
  $('#cancelPersonEditBtn').onclick=()=>startNewPerson();

  $('#savePersonBtn').onclick=()=>{
    const name=$('#personName').value.trim();
    if(!name){showToast('請先填人物姓名');$('#personName').focus();return}

    const isEdit=personEditorMode==='edit';
    const existing=isEdit
      ? data.people.find(x=>String(x.id)===String(personEditingId))
      : null;

    if(isEdit&&!existing){
      showToast('這位人物已不存在；已切回新增模式');
      startNewPerson();
      return;
    }

    const person={
      id:isEdit
        ? existing.id
        : ('person-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),
      name,
      role:$('#personRole').value.trim(),
      bio:$('#personBio').value.trim(),
      photo:$('#personPhoto').value.trim(),
      expertise:splitTags($('#personExpertise').value),
      education:splitLines($('#personEducation').value),
      experience:splitLines($('#personExperience').value),
      active:$('#personActive').checked,
      order:isEdit ? (existing.order??0) : data.people.length
    };

    if(isEdit){
      const idx=data.people.findIndex(x=>String(x.id)===String(existing.id));
      if(idx<0){
        showToast('人物同步狀態已變更，請重新選擇');
        startNewPerson();
        return;
      }
      data.people[idx]=person;
    }else{
      data.people.push(person);
    }

    data.people.sort((a,b)=>(a.order??999)-(b.order??999));
    data.people.forEach((x,i)=>x.order=i);
    persist(true);
    renderLivePreview();

    if(isEdit){
      loadPerson(person.id);
      showToast('人物已更新 · 只修改這位人物');
    }else{
      renderPeopleList();
      showToast('人物已新增 · 已建立獨立人物');
      startNewPerson({focus:false});
    }
  };

  $('#saveSiteText').onclick=()=>{collect();showToast('主頁設定已儲存')};

  $('#resetSiteText').onclick=async()=>{
    if(!(await swConfirm('公開主頁文字會恢復為預設內容；人物資料不會被刪除。',{title:'恢復主頁預設文字？',kicker:'SITE SETTINGS',tone:'warning',confirmText:'恢復預設'})))return;
    data.siteText=clone(DEFAULT_SITE_TEXT);
    persist();
    syncPublicSnapshot();
    renderSiteText();
    showToast('已恢復預設文字');
  };

  $('#publishSiteText').onclick=async()=>{
    collect();
    if(!githubToken&&!hasRememberedGithubToken()){
      nav('export');
      showToast('第一次請先設定 GitHub PAT');
      return;
    }
    await restoreRememberedGithubToken();
    if(!githubToken){
      nav('export');
      showToast('GitHub PAT 尚未在後端設定');
      return;
    }
    try{
      await publishGitHub();
      showToast('主頁設定、人物與文章已同步');
    }catch(e){
      showToast('發布失敗：'+e.message);
    }
  };

  $$('[data-live-preview-tab]').forEach(btn=>btn.onclick=()=>{
    livePreviewMode=btn.dataset.livePreviewTab||'home';
    $$('[data-live-preview-tab]').forEach(x=>x.classList.toggle('active',x===btn));
    renderLivePreview();
  });

  setPersonEditorMode('add');
  renderPeopleList();
  renderLivePreview();
}

async function aboutLocalImageToDataURL(file,{maxSide=1600,quality=.84}={}){
  if(!file||!/^image\//i.test(String(file.type||''))){
    throw new Error('請選擇圖片檔案');
  }
  if(Number(file.size||0)>18*1024*1024){
    throw new Error('圖片過大，請選擇 18 MB 以下的檔案');
  }

  const loadViaImage=()=>new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('瀏覽器無法讀取這個圖片格式'))};
    img.src=url;
  });

  let source=null;
  let width=0;
  let height=0;

  try{
    if('createImageBitmap' in window){
      source=await createImageBitmap(file);
      width=source.width;
      height=source.height;
    }else{
      source=await loadViaImage();
      width=source.naturalWidth||source.width;
      height=source.naturalHeight||source.height;
    }

    if(!width||!height)throw new Error('圖片尺寸無效');

    const scale=Math.min(1,maxSide/Math.max(width,height));
    const outW=Math.max(1,Math.round(width*scale));
    const outH=Math.max(1,Math.round(height*scale));

    const canvas=document.createElement('canvas');
    canvas.width=outW;
    canvas.height=outH;

    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)throw new Error('無法建立圖片畫布');

    ctx.drawImage(source,0,0,outW,outH);

    let dataURL=canvas.toDataURL('image/webp',quality);
    if(!/^data:image\/webp;base64,/i.test(dataURL)){
      dataURL=canvas.toDataURL('image/jpeg',Math.min(.9,quality+.03));
    }

    return {dataURL,width:outW,height:outH,originalBytes:Number(file.size||0)};
  }finally{
    try{source?.close?.()}catch(_){}
  }
}


let aiInstructionWorkbenchState=null;

function aiwEscape(v){return escapeHTML(String(v==null?'':v))}

let aiwEditingIndex=null;

function aiwInstructionItems(prompt){
  const lines=String(prompt||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  return lines.map(line=>line.replace(/^\s*(?:[-*•]+|\d+[.)、]|[一二三四五六七八九十]+[、.])\s*/, '').trim()).filter(Boolean);
}
function aiwSerializeInstructionItems(items){
  return (Array.isArray(items)?items:[]).map(x=>String(x||'').trim()).filter(Boolean).map(x=>'- '+x).join('\n');
}
function aiwCurrentItems(){return aiwInstructionItems(aiInstructionWorkbenchState?.editablePrompt||'')}
function aiwRenderEditableRules(prompt){
  const host=$('#aiwEditableRules'); if(!host)return;
  const items=aiwInstructionItems(prompt);
  const blocks=[];
  if(aiwEditingIndex==='new'){
    blocks.push(`<div class="aiw-editable-rule"><div class="aiw-editable-index">＋</div><div class="aiw-rule-editor"><textarea id="aiwRuleEditInput" maxlength="1200" placeholder="輸入一條新的寫作要求或限制…"></textarea><div class="aiw-rule-editor-actions"><button type="button" data-aiw-cancel>取消</button><button class="save" type="button" data-aiw-save-new>新增</button></div></div></div>`);
  }
  items.forEach((item,i)=>{
    if(aiwEditingIndex===i){
      blocks.push(`<div class="aiw-editable-rule"><div class="aiw-editable-index">${i+1}</div><div class="aiw-rule-editor"><textarea id="aiwRuleEditInput" maxlength="1200">${aiwEscape(item)}</textarea><div class="aiw-rule-editor-actions"><button type="button" data-aiw-cancel>取消</button><button class="save" type="button" data-aiw-save-edit="${i}">儲存修改</button></div></div></div>`);
    }else{
      blocks.push(`<div class="aiw-editable-rule"><div class="aiw-editable-index">${i+1}</div><div class="aiw-editable-copy">${aiwEscape(item)}</div><div class="aiw-editable-actions"><button type="button" data-aiw-edit="${i}">編輯</button><button class="danger" type="button" data-aiw-delete="${i}">刪除</button></div></div>`);
    }
  });
  if(!blocks.length)blocks.push('<div class="aiw-custom-empty">目前沒有額外的 Editor Instructions。你可以按「＋新增指令」，或直接在下方像 ChatGPT 一樣告訴 AI 想新增什麼限制。</div>');
  host.innerHTML=blocks.join('');
  host.querySelectorAll('[data-aiw-edit]').forEach(btn=>btn.onclick=()=>{aiwEditingIndex=Number(btn.dataset.aiwEdit);aiwRenderEditableRules(aiInstructionWorkbenchState?.editablePrompt||'');setTimeout(()=>$('#aiwRuleEditInput')?.focus(),20)});
  host.querySelectorAll('[data-aiw-cancel]').forEach(btn=>btn.onclick=()=>{aiwEditingIndex=null;aiwRenderEditableRules(aiInstructionWorkbenchState?.editablePrompt||'')});
  host.querySelectorAll('[data-aiw-save-edit]').forEach(btn=>btn.onclick=()=>saveAIInstructionItem(Number(btn.dataset.aiwSaveEdit),false));
  host.querySelectorAll('[data-aiw-save-new]').forEach(btn=>btn.onclick=()=>saveAIInstructionItem(-1,true));
  host.querySelectorAll('[data-aiw-delete]').forEach(btn=>btn.onclick=()=>deleteAIInstructionItem(Number(btn.dataset.aiwDelete)));
}
async function persistAIInstructionItems(items,toast='AI 指令已更新'){
  if(!window.signwellAIInstructionSave){showToast('AI 指令 bridge 尚未載入');return null}
  const state=await window.signwellAIInstructionSave(aiwSerializeInstructionItems(items));
  aiwEditingIndex=null;
  paintAIInstructionWorkbench(state);
  showToast(toast);
  return state;
}
async function saveAIInstructionItem(index,isNew){
  const input=$('#aiwRuleEditInput');
  const value=String(input?.value||'').trim();
  if(!value){showToast('指令不能是空白');input?.focus();return}
  const items=aiwCurrentItems();
  if(isNew)items.push(value);else if(index>=0&&index<items.length)items[index]=value;
  try{await persistAIInstructionItems(items,isNew?'已新增 AI 指令':'AI 指令已修改')}catch(err){showToast('儲存失敗：'+String(err?.message||err))}
}
function confirmAIInstructionDelete(text){
  return new Promise(resolve=>{
    document.getElementById('aiwDeleteLayer')?.remove();
    const layer=document.createElement('div');
    layer.id='aiwDeleteLayer';layer.className='aiw-confirm-layer';
    layer.innerHTML=`<div class="aiw-confirm-card aiw-delete-card" role="dialog" aria-modal="true"><div class="aiw-confirm-top"><div class="aiw-confirm-icon">×</div><div class="aiw-confirm-title"><strong>刪除這條 AI 指令？</strong><span>只會刪除你建立的 Editor Instruction，不會碰到 Evidence Lock 等底層規則。</span></div></div><div class="aiw-confirm-preview">${aiwEscape(text)}</div><div class="aiw-confirm-actions"><button class="aiw-confirm-cancel" type="button">取消</button><button class="aiw-confirm-send" type="button">確認刪除</button></div></div>`;
    document.body.appendChild(layer);
    const done=v=>{layer.classList.remove('show');setTimeout(()=>layer.remove(),160);resolve(v)};
    layer.onclick=e=>{if(e.target===layer)done(false)};
    layer.querySelector('.aiw-confirm-cancel').onclick=()=>done(false);
    layer.querySelector('.aiw-confirm-send').onclick=()=>done(true);
    requestAnimationFrame(()=>layer.classList.add('show'));
  });
}
async function deleteAIInstructionItem(index){
  const items=aiwCurrentItems();if(index<0||index>=items.length)return;
  if(!(await confirmAIInstructionDelete(items[index])))return;
  items.splice(index,1);
  try{await persistAIInstructionItems(items,'已刪除這條 AI 指令')}catch(err){showToast('刪除失敗：'+String(err?.message||err))}
}
function startAddAIInstruction(){
  aiwEditingIndex='new';
  aiwRenderEditableRules(aiInstructionWorkbenchState?.editablePrompt||'');
  setTimeout(()=>$('#aiwRuleEditInput')?.focus(),20);
}
function aiwAutoGrow(input){
  if(!input)return;input.style.height='auto';input.style.height=Math.min(150,Math.max(48,input.scrollHeight))+'px';
}


function paintAIInstructionWorkbench(state){
  aiInstructionWorkbenchState=state||{};
  const rules=Array.isArray(state?.lockedRules)?state.lockedRules:[];
  const history=Array.isArray(state?.history)?state.history:[];
  const prompt=String(state?.editablePrompt||'');
  const ruleBox=$('#aiwRules');
  const chat=$('#aiwChat');
  const editor=$('#aiwEditor');
  const status=$('#aiwStatus');
  if(ruleBox)ruleBox.innerHTML=rules.map(r=>`<div class="aiw-rule"><strong>🔒 ${aiwEscape(r.title||'底層限制')}</strong><p>${aiwEscape(r.detail||'')}</p></div>`).join('')||'<div class="aiw-empty">正在讀取底層規則…</div>';
  if(chat){
    chat.innerHTML=history.length?history.map(m=>`<div class="aiw-msg ${m.role==='assistant'?'assistant':'user'}">${aiwEscape(m.text||'')}</div>`).join(''):'<div class="aiw-empty">直接跟 AI 說你想怎麼改寫作方式。<br>例如：「開頭先講臨床意義，不要像新聞稿；少用『此外』與『值得注意的是』。」</div>';
    chat.scrollTop=chat.scrollHeight;
  }
  if(editor)editor.value=prompt;
  aiwRenderEditableRules(prompt);
  const count=$('#aiwInstructionCount');if(count)count.textContent=aiwInstructionItems(prompt).length+' 條生效';
  if(status)status.textContent=state?.configured?'AI 已連線':'AI 尚未連線';
}

async function refreshAIInstructionWorkbench(){
  const status=$('#aiwStatus');if(status)status.textContent='同步中…';
  try{
    if(!window.signwellAIInstructionState)throw new Error('AI 指令 bridge 尚未載入');
    const state=await window.signwellAIInstructionState();
    paintAIInstructionWorkbench(state);
  }catch(err){
    if(status)status.textContent='同步失敗';
    showToast('AI 指令讀取失敗：'+String(err?.message||err));
  }
}

function confirmAIInstructionSend(message){
  return new Promise(resolve=>{
    const old=document.getElementById('aiwConfirmLayer');
    if(old)old.remove();
    const layer=document.createElement('div');
    layer.id='aiwConfirmLayer';
    layer.className='aiw-confirm-layer';
    layer.innerHTML=`<div class="aiw-confirm-card" role="dialog" aria-modal="true" aria-labelledby="aiwConfirmTitle">
      <div class="aiw-confirm-top">
        <div class="aiw-confirm-icon">✦</div>
        <div class="aiw-confirm-title"><strong id="aiwConfirmTitle">確認送出 AI 指令</strong><span>Gemini 會理解你的文字，整理成長期寫作偏好，再存入 Editor Instructions。</span></div>
      </div>
      <div class="aiw-confirm-preview">${aiwEscape(message)}</div>
      <div class="aiw-confirm-guard"><strong>這次送出不會改動底層限制</strong><div class="aiw-confirm-chips"><span>Evidence Lock 保留</span><span>自適應篇幅保留</span><span>文獻核驗保留</span><span>醫療安全規則保留</span></div></div>
      <div class="aiw-confirm-actions"><button class="aiw-confirm-cancel" id="aiwConfirmCancel" type="button">返回修改</button><button class="aiw-confirm-send" id="aiwConfirmSend" type="button">確認送出</button></div>
      <div class="aiw-confirm-hint"><kbd>Esc</kbd> 返回 · <kbd>⌘/Ctrl + Enter</kbd> 確認</div>
    </div>`;
    document.body.appendChild(layer);
    const done=value=>{
      document.removeEventListener('keydown',onKey,true);
      layer.classList.remove('show');
      setTimeout(()=>layer.remove(),180);
      resolve(value);
    };
    const onKey=e=>{
      if(e.key==='Escape'){e.preventDefault();done(false);return}
      if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();done(true)}
    };
    document.addEventListener('keydown',onKey,true);
    layer.addEventListener('click',e=>{if(e.target===layer)done(false)});
    layer.querySelector('#aiwConfirmCancel').onclick=()=>done(false);
    layer.querySelector('#aiwConfirmSend').onclick=()=>done(true);
    requestAnimationFrame(()=>{layer.classList.add('show');setTimeout(()=>layer.querySelector('#aiwConfirmSend')?.focus(),90)});
  });
}

async function sendAIInstructionWorkbenchMessage(){
  const input=$('#aiwInput'),btn=$('#aiwSend');
  const message=String(input?.value||'').trim();
  if(!message){showToast('先輸入你想調整的 AI 指令');return}
  if(!window.signwellAIInstructionChat){showToast('AI 指令 bridge 尚未載入');return}

  const confirmed=await confirmAIInstructionSend(message);
  if(!confirmed)return;

  const old=btn?.textContent||'↑';
  const chat=$('#aiwChat');
  if(btn){btn.disabled=true;btn.textContent='…'}
  if(input)input.disabled=true;
  if(chat){
    const empty=chat.querySelector('.aiw-empty');if(empty)empty.remove();
    const pending=document.createElement('div');pending.className='aiw-msg pending';pending.id='aiwPendingMsg';pending.textContent=message;
    chat.appendChild(pending);chat.scrollTop=chat.scrollHeight;
  }
  const status=$('#aiwStatus');if(status)status.textContent='AI 正在理解指令…';
  try{
    const result=await window.signwellAIInstructionChat(message);
    if(!result?.ok)throw new Error(result?.error||'AI 指令更新失敗');
    if(input){input.value='';aiwAutoGrow(input)}
    aiwEditingIndex=null;
    paintAIInstructionWorkbench(result);
    showToast('AI 指令已套用');
  }catch(err){
    document.getElementById('aiwPendingMsg')?.remove();
    if(status)status.textContent='送出失敗';
    showToast('AI 指令更新失敗：'+String(err?.message||err));
  }finally{
    if(btn){btn.disabled=false;btn.textContent=old}
    if(input)input.disabled=false;
  }
}

async function saveAIInstructionWorkbench(){
  const prompt=String($('#aiwEditor')?.value||'').trim();
  const btn=$('#aiwSave');const old=btn?.textContent||'儲存目前指令';
  if(btn){btn.disabled=true;btn.textContent='儲存中…'}
  try{
    const state=await window.signwellAIInstructionSave(prompt);
    paintAIInstructionWorkbench(state);
    showToast('可編輯 AI 指令已儲存');
  }catch(err){showToast('儲存失敗：'+String(err?.message||err))}
  finally{if(btn){btn.disabled=false;btn.textContent=old}}
}

async function clearAIInstructionWorkbench(){
  if(!(await swConfirm('只會清除「可編輯 AI 指令」與對話紀錄。Evidence Lock 等底層限制不會被刪除。',{title:'清除可編輯 AI 指令？',kicker:'AI INSTRUCTIONS',tone:'warning',confirmText:'確認清除'})))return;
  try{
    const state=await window.signwellAIInstructionClear();
    paintAIInstructionWorkbench(state);
    showToast('已清除可編輯指令；底層限制仍保留');
  }catch(err){showToast('清除失敗：'+String(err?.message||err))}
}

function renderAIInstructionWorkbench(){
  $('#view').innerHTML=`
    <div class="page-head"><div><h1>AI 指令</h1><p>所有已生效規則都在這裡。底層 Evidence Lock 唯讀；你的寫作限制可以逐條新增、修改、刪除，也可以直接用自然語言跟 AI 對話。</p></div></div>
    <div class="aiw-shell">
      <section class="aiw-card aiw-lock">
        <div class="aiw-lock-head"><div class="aiw-lock-icon">🔒</div><div><strong>系統底層限制</strong><span>Locked System Rules · 永久生效 · 唯讀</span></div></div>
        <div class="aiw-rule-list" id="aiwRules"><div class="aiw-empty">正在讀取底層規則…</div></div>
        <div class="aiw-lock-foot">這些是安全與證據層的硬限制，只能查看。你的 Editor Instructions 可以自由新增、修改或刪除，但永遠不能覆蓋這一層。</div>
        <div class="aiw-priority"><span><b>1</b> 系統限制</span><span><b>2</b> 你的指令</span><span><b>3</b> 當篇內容</span></div>
      </section>
      <section class="aiw-card aiw-main">
        <div class="aiw-main-head"><div><strong>你的 AI 指令</strong><span>這些就是 Gemini 每次寫文章都會收到的 Editor Instructions。</span></div><div class="aiw-status" id="aiwStatus">同步中…</div></div>
        <div class="aiw-active-block">
          <div class="aiw-active-head"><div><strong>目前生效中的限制</strong><span id="aiwInstructionCount">0 條生效</span></div><button class="aiw-add-rule" id="aiwAddRule" type="button">＋ 新增指令</button></div>
          <div class="aiw-editable-list" id="aiwEditableRules"><div class="aiw-custom-empty">正在讀取…</div></div>
          <div class="aiw-system-note">修改後會直接同步到下一次 AI 文章生成，不需要重設 API。</div>
        </div>
        <div class="aiw-chat-label"><span>與 AI 調整指令</span><span>Gemini 會把對話整理回上方規則</span></div>
        <div class="aiw-chat" id="aiwChat"><div class="aiw-empty">正在載入…</div></div>
        <div class="aiw-quick-prompts"><button type="button" data-aiw-prompt="幫我新增一條：文章開頭先講臨床意義，不要像新聞稿。">＋ 新增規則</button><button type="button" data-aiw-prompt="幫我檢查目前指令有沒有重複或互相矛盾，並整理得更精簡。">整理目前規則</button><button type="button" data-aiw-prompt="把目前的語氣要求改得更像臨床醫師自然撰寫，降低 AI 感。">調整語氣</button></div>
        <div class="aiw-compose"><div class="aiw-compose-box"><textarea id="aiwInput" rows="1" maxlength="1800" placeholder="傳訊息給 AI 指令管理員…"></textarea><div class="aiw-compose-foot"><span>Enter 送出 · Shift + Enter 換行</span><button class="aiw-send" id="aiwSend" type="button" aria-label="送出 AI 指令">↑</button></div></div></div>
        <textarea id="aiwEditor" class="hidden" maxlength="6000" aria-hidden="true"></textarea>
      </section>
    </div>`;
  $('#aiwSend').onclick=sendAIInstructionWorkbenchMessage;
  $('#aiwAddRule').onclick=startAddAIInstruction;
  $('#aiwInput').addEventListener('input',e=>aiwAutoGrow(e.currentTarget));
  $('#aiwInput').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();sendAIInstructionWorkbenchMessage()}
  });
  $$('[data-aiw-prompt]').forEach(btn=>btn.onclick=()=>{const input=$('#aiwInput');input.value=btn.dataset.aiwPrompt||'';aiwAutoGrow(input);input.focus()});
  refreshAIInstructionWorkbench();
}

function removeAboutPersonDialogPortal(){
  const dlg=document.getElementById('aboutPersonDialog');
  if(dlg&&dlg.parentElement===document.body)dlg.remove();
}

function renderAboutPageEditor(){
  removeAboutPersonDialogPortal();
  data.siteText={...DEFAULT_SITE_TEXT,...(data.siteText||{})};
  data.people=Array.isArray(data.people)?data.people:[];
  const s=data.siteText;
  const field=(key,label,multi=false)=>`<div class="site-field"><label>${label}</label>${multi?`<textarea data-about-key="${key}">${escapeHTML(s[key]||'')}</textarea>`:`<input data-about-key="${key}" value="${escapeHTML(s[key]||'')}">`}</div>`;
  const initials=name=>{
    const clean=String(name||'').trim();
    if(!clean)return 'SW';
    const parts=clean.split(/\s+/).filter(Boolean);
    return parts.length>1?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():clean.slice(0,2).toUpperCase();
  };
  const sortedPeople=()=>data.people.slice().sort((a,b)=>(a.order??999)-(b.order??999));
  const splitLines=v=>String(v||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const splitTags=v=>String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
  const personPhotoValue=()=>String($('#aboutPersonPhotoData')?.value||$('#aboutPersonPhoto')?.value||'').trim();

  $('#view').innerHTML=`<div class="page-head">
    <div>
      <h1>關於頁面</h1>
      <p>直接修改使用者端「關於」頁。文字、核心價值、人物與學經歷都會寫入 public-data.json。</p>
    </div>
  </div>

  <div class="about-editor-grid">
    <section class="about-editor-panel">
      <h3>About SIGN WELL</h3>
      <p>這裡的內容就是公開網站「關於」頁使用的資料。輸入時右側會立即預覽。</p>

      <div class="about-editor-section">
        <div class="about-editor-section-title"><strong>主視覺</strong><span>Hero</span></div>
        ${field('aboutEyebrow','頁面小標')}
        ${field('aboutTitle','頁面標題')}
        ${field('aboutBody','品牌介紹',true)}
      </div>

      <div class="about-editor-section">
        <div class="about-editor-section-title"><strong>品牌宣言</strong><span>Manifesto</span></div>
        ${field('aboutManifestoTitle','宣言標題',true)}
        ${field('aboutManifestoBody','宣言說明',true)}
      </div>

      <div class="about-editor-section">
        <div class="about-editor-section-title"><strong>三個核心欄位</strong><span>Values</span></div>
        <div class="about-fields-2">
          ${field('aboutFocusLabel','第一欄標籤')}
          ${field('aboutFocusValue','第一欄內容')}
          ${field('aboutFormatLabel','第二欄標籤')}
          ${field('aboutFormatValue','第二欄內容')}
          ${field('aboutPrincipleLabel','第三欄標籤')}
          ${field('aboutPrincipleValue','第三欄內容')}
        </div>
      </div>

      <div class="about-editor-section">
        <div class="about-editor-section-title"><strong>人物區標題</strong><span>People</span></div>
        ${field('aboutPeopleEyebrow','人物區小標')}
        ${field('aboutPeopleTitle','人物區標題')}
        ${field('aboutPeopleSubtitle','人物區說明',true)}
      </div>

      <div class="about-editor-section">
        <div class="about-editor-section-title">
          <div><strong>人物與學經歷</strong><span style="margin-left:7px">會同步文章發布者</span></div>
          <button class="top-action" type="button" id="aboutNewPerson">＋ 新增人物</button>
        </div>
        <div class="about-people-mini" id="aboutPeopleList"></div>

        <div class="about-person-dialog" id="aboutPersonDialog" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="aboutPersonDialogTitle" tabindex="-1">
          <div class="about-person-dialog-card" role="document">
            <div class="about-person-dialog-head">
              <div class="about-person-dialog-identity">
                <div class="about-person-dialog-avatar" id="aboutPersonDialogAvatar">＋</div>
                <div>
                  <span class="about-person-dialog-kicker">PEOPLE · PUBLISHER PROFILE</span>
                  <h3 id="aboutPersonDialogTitle">新增人物</h3>
                  <p id="aboutPersonDialogHint">建立後會同步到公開 About 頁與文章發布者。</p>
                </div>
              </div>
              <button class="about-person-dialog-close" type="button" id="aboutPersonDialogClose" aria-label="關閉">×</button>
            </div>

            <div class="about-person-dialog-body">
              <input type="hidden" id="aboutPersonId">
              <div class="about-fields-2">
                <div class="site-field"><label>姓名</label><input id="aboutPersonName" placeholder="例如：Lin Che-Kai" autocomplete="off"></div>
                <div class="site-field"><label>角色 / 職稱</label><input id="aboutPersonRole" placeholder="例如：Editor · Medical Student" autocomplete="off"></div>
              </div>
              <div class="site-field"><label>人物簡介</label><textarea id="aboutPersonBio" placeholder="簡短介紹這個人的角色與背景。"></textarea></div>
              <div class="site-field about-photo-field">
                <label>人物照片</label>
                <div class="about-photo-controls">
                  <input id="aboutPersonPhoto" type="url" placeholder="貼上圖片網址，或從本機選擇">
                  <button type="button" id="aboutPersonPhotoPick">選擇照片</button>
                  <button type="button" id="aboutPersonPhotoRemove">移除</button>
                </div>
                <input type="hidden" id="aboutPersonPhotoData">
                <input class="file-input" id="aboutPersonPhotoFile" type="file" accept="image/*">
                <div class="about-photo-preview" id="aboutPersonPhotoPreview">
                  <div class="thumb">NO IMG</div>
                  <div class="copy"><strong>尚未設定人物照片</strong><span>本機圖片會先壓縮，正式發布時再上傳到 GitHub assets。</span></div>
                </div>
              </div>
              <div class="site-field"><label>專長標籤（逗號分隔）</label><input id="aboutPersonExpertise" placeholder="臨床推理, 預防醫學, 醫療科技"></div>
              <div class="about-fields-2 about-person-long-fields">
                <div class="site-field"><label>學歷（每行一項）</label><textarea id="aboutPersonEducation" placeholder="每行一項學歷"></textarea></div>
                <div class="site-field"><label>經歷（每行一項）</label><textarea id="aboutPersonExperience" placeholder="每行一項經歷"></textarea></div>
              </div>
              <label class="person-active about-person-active"><input type="checkbox" id="aboutPersonActive" checked> 顯示在公開 About 頁，並可作為文章發布者</label>
            </div>

            <div class="about-person-dialog-actions">
              <button class="top-action" type="button" id="aboutPersonCancel">取消</button>
              <button class="top-action primary" type="button" id="aboutSavePerson">儲存人物</button>
            </div>
          </div>
        </div>
      </div>

      <div class="about-editor-section">
        <div class="about-editor-section-title"><strong>頁尾醫療聲明</strong><span>Disclaimer</span></div>
        ${field('aboutDisclaimer','醫療聲明',true)}
      </div>

      <div class="about-editor-actions">
        <button class="top-action primary" id="aboutSaveLocal">儲存關於頁面</button>
        <button class="top-action online" id="aboutPublish">儲存並發布到網站</button>
        <button class="top-action" id="aboutReset">恢復預設文字</button>
      </div>

      <div class="site-publish-hint">
        公開網站會從 <b>public-data.json</b> 讀取 About 文字與人物資料。按「儲存並發布到網站」後才會更新 GitHub Pages。
      </div>
    </section>

    <aside class="about-live-preview">
      <div class="about-preview-toolbar">
        <div>
          <strong>使用者端即時預覽</strong>
          <span>About page · 尚未發布也會即時顯示</span>
        </div>
      </div>
      <div class="about-preview-browser">
        <div class="about-preview-bar"><i></i><i></i><i></i><div class="about-preview-url">980510linz.github.io/-/about.html</div></div>
        <div class="about-preview-stage" id="aboutPreviewStage"></div>
      </div>
    </aside>
  </div>`;

  const aboutDialogPortal=document.getElementById('aboutPersonDialog');
  if(aboutDialogPortal){
    document.body.appendChild(aboutDialogPortal);
    aboutDialogPortal.classList.add('about-person-dialog-portal');
  }

  const collectText=()=>{
    $$('[data-about-key]').forEach(el=>data.siteText[el.dataset.aboutKey]=el.value);
    persist(true);
    syncPublicSnapshot();
  };

  const renderPreview=()=>{
    const box=$('#aboutPreviewStage');
    if(!box)return;
    const st=data.siteText||{};
    const visible=sortedPeople().filter(p=>p.active!==false).slice(0,4);
    box.innerHTML=`
      <div class="ap-nav">
        <span class="ap-brand">${escapeHTML(st.brandEnglish||'SIGN WELL')}</span>
        <div class="ap-links"><span>${escapeHTML(st.navArticles||'文章')}</span><span>${escapeHTML(st.navTopics||'主題')}</span><span>${escapeHTML(st.navAbout||'關於')}</span></div>
      </div>
      <div class="ap-eyebrow">${escapeHTML(st.aboutEyebrow||'ABOUT SIGN WELL')}</div>
      <div class="ap-title">${escapeHTML(st.aboutTitle||'關於我們')}</div>
      <div class="ap-copy">${escapeHTML(st.aboutBody||'')}</div>
      <div class="ap-manifesto">
        <strong>${escapeHTML(st.aboutManifestoTitle||'')}</strong>
        <span>${escapeHTML(st.aboutManifestoBody||'')}</span>
      </div>
      <div class="ap-values">
        <div><span>${escapeHTML(st.aboutFocusLabel||'核心')}</span><b>${escapeHTML(st.aboutFocusValue||'')}</b></div>
        <div><span>${escapeHTML(st.aboutFormatLabel||'形式')}</span><b>${escapeHTML(st.aboutFormatValue||'')}</b></div>
        <div><span>${escapeHTML(st.aboutPrincipleLabel||'原則')}</span><b>${escapeHTML(st.aboutPrincipleValue||'')}</b></div>
      </div>
      <div class="ap-people-head">
        <div class="ap-eyebrow">${escapeHTML(st.aboutPeopleEyebrow||'PEOPLE')}</div>
        <div style="margin-top:5px;color:#3c596d;font:500 17px/1.1 Georgia,'Noto Serif TC',serif">${escapeHTML(st.aboutPeopleTitle||'我們是誰')}</div>
        <div class="ap-copy" style="margin-top:5px">${escapeHTML(st.aboutPeopleSubtitle||'')}</div>
      </div>
      <div class="ap-people">
        ${visible.length?visible.map(p=>`
          <div class="ap-person">
            <div class="ap-avatar">${cmsPersonAvatarMarkup(p)}</div>
            <div><strong>${escapeHTML(p.name||'未命名人物')}</strong><small>${escapeHTML(p.role||((p.education||[])[0]||''))}</small></div>
          </div>`).join(''):'<div class="ap-copy">尚未新增公開人物</div>'}
      </div>
      <div class="ap-disclaimer">${escapeHTML(st.aboutDisclaimer||'')}</div>`;
  };

  const renderPhotoInputPreview=(meta='')=>{
    const host=$('#aboutPersonPhotoPreview');
    if(!host)return;
    const value=personPhotoValue();
    const local=/^data:image\//i.test(value);

    host.innerHTML=value
      ?`<div class="thumb">${cmsAvatarMarkupFrom(value,'人物照片')}</div>
        <div class="copy">
          <strong>${local?'本機圖片已載入':'外部圖片 URL'}</strong>
          <span>${escapeHTML(meta||(local?'發布時會自動轉為 GitHub assets 圖片，不會把 Base64 留在公開資料。':'目前使用網址圖片。'))}</span>
        </div>`
      :`<div class="thumb">NO IMG</div>
        <div class="copy">
          <strong>尚未設定人物照片</strong>
          <span>可貼網址，或直接從 Mac / iPhone / iPad 本機選擇圖片。</span>
        </div>`;
  };

  const personDialog=()=>$('#aboutPersonDialog');
  const updatePersonDialogIdentity=()=>{
    const name=String($('#aboutPersonName')?.value||'').trim();
    const photo=personPhotoValue();
    const avatar=$('#aboutPersonDialogAvatar');
    if(!avatar)return;
    avatar.innerHTML=photo?cmsAvatarMarkupFrom(photo,name||'人物'):escapeHTML(initials(name)||'＋');
  };
  const openPersonDialog=(mode='add')=>{
    const dlg=personDialog();
    if(!dlg)return;
    const editing=mode==='edit';
    $('#aboutPersonDialogTitle').textContent=editing?'編輯人物':'新增人物';
    $('#aboutPersonDialogHint').textContent=editing?'儲存後會同步更新 About 頁與文章發布者。':'建立後會同步到公開 About 頁與文章發布者。';
    $('#aboutSavePerson').textContent=editing?'儲存變更':'新增人物';
    updatePersonDialogIdentity();
    dlg.classList.add('show');
    dlg.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>{
      dlg.focus({preventScroll:true});
      $('#aboutPersonName')?.focus({preventScroll:true});
    });
  };
  const closePersonDialog=()=>{
    const dlg=personDialog();
    if(!dlg)return;
    dlg.classList.remove('show');
    dlg.setAttribute('aria-hidden','true');
  };

  const clearPerson=()=>{
    $('#aboutPersonId').value='';
    $('#aboutPersonName').value='';
    $('#aboutPersonRole').value='';
    $('#aboutPersonBio').value='';
    $('#aboutPersonPhoto').value='';
    $('#aboutPersonPhotoData').value='';
    $('#aboutPersonPhotoFile').value='';
    $('#aboutPersonExpertise').value='';
    $('#aboutPersonEducation').value='';
    $('#aboutPersonExperience').value='';
    $('#aboutPersonActive').checked=true;
    renderPhotoInputPreview();
  };

  const loadPerson=id=>{
    const p=data.people.find(x=>String(x.id)===String(id));
    if(!p)return;
    $('#aboutPersonId').value=p.id;
    $('#aboutPersonName').value=p.name||'';
    $('#aboutPersonRole').value=p.role||'';
    $('#aboutPersonBio').value=p.bio||'';
    const photo=String(p.photo||'');
    $('#aboutPersonPhotoData').value=/^data:image\//i.test(photo)?photo:'';
    $('#aboutPersonPhoto').value=/^data:image\//i.test(photo)?'':photo;
    $('#aboutPersonExpertise').value=(p.expertise||[]).join(', ');
    $('#aboutPersonEducation').value=(p.education||[]).join('\n');
    $('#aboutPersonExperience').value=(p.experience||[]).join('\n');
    $('#aboutPersonActive').checked=p.active!==false;
    renderPhotoInputPreview();
    updatePersonDialogIdentity();
    openPersonDialog('edit');
  };

  const renderPeople=()=>{
    const host=$('#aboutPeopleList');
    const arr=sortedPeople();
    if(!arr.length){
      host.innerHTML='<div class="people-empty">尚未新增人物。建立人物後，公開 About 頁與文章發布者選單都會同步。</div>';
      renderPreview();
      return;
    }
    host.innerHTML=arr.map(p=>`
      <div class="about-person-mini ${p.active===false?'is-hidden':''}">
        <div class="pic">${cmsPersonAvatarMarkup(p)}</div>
        <div class="about-person-mini-copy">
          <div class="about-person-mini-title"><strong>${escapeHTML(p.name||'未命名人物')}</strong>${p.active===false?'<em>已隱藏</em>':'<em class="is-live">公開</em>'}</div>
          <span>${escapeHTML(p.role||'尚未填寫角色')} · ${(p.education||[]).length} 項學歷 · ${(p.experience||[]).length} 項經歷</span>
        </div>
        <button class="about-person-edit-btn" type="button" data-about-person-edit="${escapeHTML(p.id)}" aria-label="編輯 ${escapeHTML(p.name||'人物')}">編輯</button>
      </div>`).join('');
    $$('[data-about-person-edit]').forEach(btn=>btn.onclick=()=>loadPerson(btn.dataset.aboutPersonEdit));
    renderPreview();
  };

  $$('[data-about-key]').forEach(el=>el.addEventListener('input',()=>{
    data.siteText[el.dataset.aboutKey]=el.value;
    renderPreview();
    clearTimeout(saveTimer);
    $('#saveState').textContent='儲存中…';
    saveTimer=setTimeout(()=>{
      collectText();
      $('#saveState').textContent='已儲存 ✓';
    },650);
  }));

  $('#aboutPersonPhoto').addEventListener('input',()=>{
    $('#aboutPersonPhotoData').value='';
    renderPhotoInputPreview();
    renderPreview();
  });

  $('#aboutPersonPhotoPick').onclick=()=>$('#aboutPersonPhotoFile').click();

  $('#aboutPersonPhotoFile').onchange=async e=>{
    const input=e.currentTarget;
    const file=input.files?.[0];
    if(!file)return;

    const pick=$('#aboutPersonPhotoPick');
    const preview=$('#aboutPersonPhotoPreview');

    try{
      if(pick){pick.disabled=true;pick.textContent='處理中…'}
      preview?.classList.add('about-photo-loading');

      const img=await aboutLocalImageToDataURL(file,{maxSide:1600,quality:.84});
      $('#aboutPersonPhotoData').value=img.dataURL;
      $('#aboutPersonPhoto').value='';

      renderPhotoInputPreview(`${img.width} × ${img.height} · 已壓縮，正式發布時上傳 GitHub assets。`);
      updatePersonDialogIdentity();
      renderPreview();
      showToast('本機人物照片已載入');
    }catch(err){
      showToast('圖片載入失敗：'+(err?.message||err));
    }finally{
      if(pick){pick.disabled=false;pick.textContent='從本機上傳'}
      preview?.classList.remove('about-photo-loading');
      input.value='';
    }
  };

  $('#aboutPersonPhotoRemove').onclick=()=>{
    $('#aboutPersonPhoto').value='';
    $('#aboutPersonPhotoData').value='';
    $('#aboutPersonPhotoFile').value='';
    renderPhotoInputPreview();
    updatePersonDialogIdentity();
    renderPreview();
    showToast('人物照片已移除');
  };

  $('#aboutNewPerson').onclick=()=>{clearPerson();openPersonDialog('add')};
  $('#aboutPersonDialogClose').onclick=closePersonDialog;
  $('#aboutPersonCancel').onclick=closePersonDialog;
  $('#aboutPersonDialog').addEventListener('click',e=>{if(e.target===e.currentTarget)closePersonDialog()});
  $('#aboutPersonDialog').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closePersonDialog()}});
  $('#aboutPersonName').addEventListener('input',updatePersonDialogIdentity);
  $('#aboutPersonPhoto').addEventListener('input',updatePersonDialogIdentity);

  $('#aboutSavePerson').onclick=()=>{
    const name=$('#aboutPersonName').value.trim();
    if(!name){showToast('請先填人物姓名');return}

    const id=$('#aboutPersonId').value.trim();
    const old=id?data.people.find(x=>String(x.id)===id):null;
    const person={
      id:old?.id||('person-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),
      name,
      role:$('#aboutPersonRole').value.trim(),
      bio:$('#aboutPersonBio').value.trim(),
      photo:personPhotoValue(),
      expertise:splitTags($('#aboutPersonExpertise').value),
      education:splitLines($('#aboutPersonEducation').value),
      experience:splitLines($('#aboutPersonExperience').value),
      active:$('#aboutPersonActive').checked,
      order:old?.order??data.people.length
    };

    if(old){
      const idx=data.people.findIndex(x=>String(x.id)===String(old.id));
      data.people[idx]=person;
    }else{
      data.people.push(person);
    }
    data.people.sort((a,b)=>(a.order??999)-(b.order??999));
    data.people.forEach((x,i)=>x.order=i);
    persist(true);
    renderPeople();
    closePersonDialog();
    showToast(old?'人物已更新 · 文章發布者同步':'人物已新增 · 可選為文章發布者');
  };

  $('#aboutSaveLocal').onclick=()=>{
    collectText();
    showToast('關於頁面已儲存');
  };

  $('#aboutReset').onclick=async()=>{
    if(!(await swConfirm('About 頁面的文字會恢復為預設內容；人物資料不會被刪除。',{title:'恢復 About 預設文字？',kicker:'ABOUT SETTINGS',tone:'warning',confirmText:'恢復預設'})))return;
    const keys=[
      'aboutEyebrow','aboutTitle','aboutBody',
      'aboutManifestoTitle','aboutManifestoBody',
      'aboutFocusLabel','aboutFocusValue',
      'aboutFormatLabel','aboutFormatValue',
      'aboutPrincipleLabel','aboutPrincipleValue',
      'aboutPeopleEyebrow','aboutPeopleTitle','aboutPeopleSubtitle',
      'aboutDisclaimer'
    ];
    keys.forEach(k=>data.siteText[k]=DEFAULT_SITE_TEXT[k]||'');
    persist(true);
    renderAboutPageEditor();
    showToast('About 文字已恢復預設');
  };

  $('#aboutPublish').onclick=async()=>{
    collectText();
    if(!githubToken&&!hasRememberedGithubToken()){
      nav('export');
      showToast('第一次請先設定 GitHub PAT');
      return;
    }
    await restoreRememberedGithubToken();
    if(!githubToken){
      nav('export');
      showToast('GitHub PAT 尚未在後端設定');
      return;
    }
    try{
      await publishGitHub();
      showToast('關於頁面已發布到使用者端');
    }catch(err){
      showToast('發布失敗：'+(err?.message||err));
    }
  };

  renderPeople();
  renderPhotoInputPreview();
  renderPreview();
}


function swFormatSecretUpdatedAt(value){
  if(!value)return '已安全保存於後端';
  try{return '最後更新 '+new Intl.DateTimeFormat('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}catch(_){return '已安全保存於後端'}
}
function openSecretVaultDialog({target,title,secretLabel='',placeholder='',onCommit,danger=false}){
  return new Promise(resolve=>{
    document.getElementById('swSecretVaultOverlay')?.remove();
    const overlay=document.createElement('div'); overlay.id='swSecretVaultOverlay'; overlay.className='sw-secret-vault-overlay';
    const card=document.createElement('div'); card.className='sw-secret-vault-card'; overlay.appendChild(card);
    const head=document.createElement('div'); head.className='sw-secret-vault-head'; const copy=document.createElement('div'); const h=document.createElement('h3'); h.textContent=title; const desc=document.createElement('p'); desc.textContent='憑證只保存在 Google Apps Script。變更前需重新驗證 CMS 管理密碼。'; copy.append(h,desc); const close=document.createElement('button'); close.type='button'; close.className='sw-secret-close'; close.textContent='×'; close.setAttribute('aria-label','關閉'); head.append(copy,close); card.appendChild(head);
    const form=document.createElement('div'); form.className='sw-secret-vault-form'; let secretInput=null;
    if(secretLabel){const l=document.createElement('label'),s=document.createElement('span');s.textContent=secretLabel;secretInput=document.createElement('input');secretInput.type='password';secretInput.autocomplete='new-password';secretInput.placeholder=placeholder;l.append(s,secretInput);form.appendChild(l)}
    const pl=document.createElement('label'),ps=document.createElement('span'),password=document.createElement('input');ps.textContent='CMS 管理密碼';password.type='password';password.inputMode='numeric';password.pattern='[0-9]*';password.autocomplete='current-password';password.placeholder='重新輸入數字管理密碼';password.addEventListener('input',()=>{password.value=password.value.replace(/\D+/g,'')});pl.append(ps,password);form.appendChild(pl);card.appendChild(form);
    const note=document.createElement('div');note.className='sw-secret-vault-note';note.textContent='不會保存於 localStorage、sessionStorage、IndexedDB、CMS HTML 或 GitHub。';card.appendChild(note);
    const actions=document.createElement('div');actions.className='sw-secret-vault-actions';const cancel=document.createElement('button');cancel.type='button';cancel.className='top-action';cancel.textContent='取消';const commit=document.createElement('button');commit.type='button';commit.className='top-action '+(danger?'danger':'primary');commit.textContent=danger?'確認移除':'驗證並儲存';actions.append(cancel,commit);card.appendChild(actions);document.body.appendChild(overlay);
    let done=false; const keyHandler=e=>{if(e.key==='Escape')finish(false);if((e.metaKey||e.ctrlKey)&&e.key==='Enter')commit.click()};
    function finish(result){if(done)return;done=true;document.removeEventListener('keydown',keyHandler);try{if(secretInput)secretInput.value='';password.value=''}catch(_){}overlay.remove();resolve(result)}
    close.onclick=cancel.onclick=()=>finish(false);overlay.onclick=e=>{if(e.target===overlay)finish(false)};document.addEventListener('keydown',keyHandler);
    commit.onclick=async()=>{const secret=secretInput?secretInput.value.trim():'';const pw=password.value;if(secretInput&&!secret){showToast('請輸入新的憑證');return}if(!pw){showToast('請重新輸入 CMS 管理密碼');return}if(!/^\d+$/.test(pw)){showToast('CMS 管理密碼只能輸入數字');return}const old=commit.textContent;commit.disabled=true;cancel.disabled=true;commit.textContent='驗證中…';try{const auth=await signwellGasBridge('admin.secret.authorize',{target,password:pw,clientId:cmsAuthClientIdValue()},{adminKey:newsletterAdminKey(),timeoutMs:25000});if(!auth?.secretAuthToken)throw new Error('無法取得憑證變更授權');await onCommit({secret,secretAuthToken:auth.secretAuthToken});finish(true)}catch(err){showToast(String(err?.message||err));commit.disabled=false;cancel.disabled=false;commit.textContent=old}};
    setTimeout(()=>{(secretInput||password).focus()},60);
  });
}

async function initPublishAIProviderSettings(){
  const grid=document.querySelector('.publish-grid');if(!grid||document.getElementById('publishAIProviderCard'))return;
  const card=document.createElement('section');card.className='publish-card ai-provider-settings-card';card.id='publishAIProviderCard';
  card.innerHTML=`<div class="ai-provider-head"><div><h3>AI Provider / Secret Vault</h3><p>同一個 Writer Core 供文章、AI 指令、醫學詞庫、圖片搜尋詞、Canva 拆解與 Meta AI 文案使用。後端會自動辨識 Gemini / OpenAI / Anthropic；Gemini 也可安全沿用 Compliance Key。</p></div><span class="ai-provider-state" id="publishAIState">檢查中…</span></div><div class="sw-secret-summary"><div><span>AI API Key</span><strong id="publishAIKeyState">檢查中…</strong><small id="publishAIKeyMeta">只保存在後端</small></div><button class="top-action" id="publishAISecret" type="button">更換 Key</button></div><div class="ai-provider-form"><label><span>API Endpoint</span><input id="publishAIEndpoint" type="url" inputmode="url" autocomplete="off" placeholder="https://generativelanguage.googleapis.com/v1beta/models"></label><label><span>Model ID</span><input id="publishAIModel" type="text" autocomplete="off" placeholder="gemini-… / gpt-… / claude-…"></label></div><div class="ai-provider-actions"><button class="top-action primary" id="publishAISave" type="button">儲存 Provider 設定</button><button class="top-action" id="publishAITest" type="button">健康檢查</button><button class="top-action" id="publishAIInstructions" type="button">開啟 AI 指令</button></div><div class="publish-status" id="publishAIHelp">正在讀取安全設定…</div>`;
  grid.prepend(card);const stateEl=$('#publishAIState'),endpoint=$('#publishAIEndpoint'),model=$('#publishAIModel'),help=$('#publishAIHelp'),save=$('#publishAISave'),keyState=$('#publishAIKeyState'),keyMeta=$('#publishAIKeyMeta'),secretBtn=$('#publishAISecret');let cachedStatus=null;
  const paintSecret=s=>{cachedStatus=s||cachedStatus||{};const ready=Boolean(cachedStatus?.apiKeyConfigured||cachedStatus?.configured),inherited=Boolean(cachedStatus?.inheritedGeminiKey);keyState.textContent=ready?(inherited?'沿用 Compliance Gemini':'已安全設定'):'尚未設定';keyState.classList.toggle('ready',ready);keyMeta.textContent=ready?(inherited?'共用後端 Gemini Secret · 瀏覽器不可讀':swFormatSecretUpdatedAt(cachedStatus?.apiKeyUpdatedAt)):'尚未存入後端';secretBtn.textContent=inherited?'設定獨立 Writer Key':(ready?'更換 Key':'設定 Key')};
  $('#publishAIInstructions').onclick=()=>nav('aiinstructions');
  $('#publishAITest').onclick=async()=>{const btn=$('#publishAITest'),old=btn.textContent;btn.disabled=true;btn.textContent='檢查中…';try{const r=await window.signwellMedicalNewsAITest();if(!r?.ok)throw new Error(r?.error||'AI Provider 健康檢查失敗');stateEl.textContent='正常';stateEl.classList.add('ready');help.textContent=`✓ ${r.providerLabel||'AI Provider'} · ${r.model||model.value||'AI model'} · ${r.endpointLabel||'Provider'} · Provider 回應正常`;showToast('AI Provider 健康檢查通過')}catch(err){stateEl.textContent='異常';stateEl.classList.remove('ready');help.textContent='AI Provider 健康檢查失敗：'+String(err?.message||err);showToast('AI Provider 健康檢查失敗')}finally{btn.disabled=false;btn.textContent=old}};
  try{const s=await window.signwellMedicalNewsAIStatus();cachedStatus=s;endpoint.value=String(s?.endpoint||'');model.value=String(s?.model||'');stateEl.textContent=s?.configured?'已連線':'尚未完成';stateEl.classList.toggle('ready',Boolean(s?.configured));paintSecret(s);help.textContent=s?.configured?`✓ ${s.providerLabel||'AI Provider'} · ${s.model||'AI model'} · ${s.endpointLabel||'Provider'} · ${s.inheritedGeminiKey?'沿用 Compliance Gemini Key':'Writer Key'} · Evidence Lock 啟用`:'請先完成 Provider；若 Compliance Gemini 已設定，Gemini Writer 可直接沿用同一個後端 Key。'}catch(err){stateEl.textContent='狀態未知';help.textContent='AI 狀態讀取失敗：'+String(err?.message||err);paintSecret({})}
  save.onclick=async()=>{const ep=endpoint.value.trim(),m=model.value.trim();if(!ep||!/^https:\/\//i.test(ep)){showToast('請填入有效的 https:// API Endpoint');return}if(!m){showToast('請填入 Model ID');return}if(!cachedStatus?.apiKeyConfigured&&!cachedStatus?.configured){showToast('請先按「設定 Key」');return}const old=save.textContent;save.disabled=true;save.textContent='儲存中…';try{const result=await window.signwellMedicalNewsAIConfigure({endpoint:ep,model:m,provider:'auto',test:true});if(!result?.ok)throw new Error(result?.error||'AI 設定失敗');cachedStatus=result.status||cachedStatus;paintSecret(cachedStatus);stateEl.textContent='已連線';stateEl.classList.add('ready');help.textContent='✓ Provider 設定已儲存；AI Key 持續安全保存在後端。';showToast('AI Provider 設定已儲存')}catch(err){help.textContent='AI Provider 設定失敗：'+String(err?.message||err);showToast('AI Provider 設定失敗')}finally{save.disabled=false;save.textContent=old}};
  secretBtn.onclick=async()=>{const ep=endpoint.value.trim(),m=model.value.trim();if(!ep||!/^https:\/\//i.test(ep)){showToast('請先填入有效的 API Endpoint');return}if(!m){showToast('請先填入 Model ID');return}await openSecretVaultDialog({target:'ai',title:cachedStatus?.apiKeyConfigured?'更換 AI API Key':'設定 AI API Key',secretLabel:'新的 AI API Key',placeholder:'貼上新的 API Key',onCommit:async({secret,secretAuthToken})=>{const result=await window.signwellMedicalNewsAIConfigure({endpoint:ep,model:m,provider:'auto',apiKey:secret,secretAuthToken,test:true});if(!result?.ok)throw new Error(result?.error||'AI Key 設定失敗');cachedStatus=result.status||{};paintSecret(cachedStatus);stateEl.textContent='已連線';stateEl.classList.add('ready');help.textContent='✓ AI Key 已安全保存於後端，之後不需要再次輸入。';showToast('AI Key 已安全更新')}})};
}


async function initPublishGptSettings(){
  const grid=document.querySelector('.publish-grid');
  if(!grid||document.getElementById('publishGptProviderCard'))return;
  const card=document.createElement('section');card.className='publish-card ai-provider-settings-card';card.id='publishGptProviderCard';
  card.innerHTML=`<div class="ai-provider-head"><div><h3>GPT API / Secret Vault</h3><p>GPT 使用獨立 API Key、Endpoint 與 Model，不會覆蓋 Gemini。GPT 預設負責文章生稿與定點修稿；Gemini 預設負責 Evidence / Citation Reviewer。Daily Focus 與每小時流程都可分開調整 Writer / Reviewer。</p></div><span class="ai-provider-state" id="publishGptState">檢查中…</span></div><div class="sw-secret-summary"><div><span>GPT API Key</span><strong id="publishGptKeyState">檢查中…</strong><small id="publishGptKeyMeta">只保存在 Apps Script</small></div><button class="top-action" id="publishGptSecret" type="button">設定 GPT Key</button></div><div class="ai-provider-form"><label><span>OpenAI API Endpoint</span><input id="publishGptEndpoint" type="url" inputmode="url" autocomplete="off" placeholder="https://api.openai.com/v1/responses"></label><label><span>GPT Model ID</span><input id="publishGptModel" type="text" autocomplete="off" placeholder="gpt-…"></label></div><div class="ai-provider-actions"><button class="top-action primary" id="publishGptSave" type="button">儲存 GPT 設定</button><button class="top-action" id="publishGptTest" type="button">測試 GPT</button></div><div class="publish-status" id="publishGptHelp">正在讀取 GPT 設定…</div>`;
  const anchor=document.getElementById('publishAIProviderCard');
  if(anchor&&anchor.nextSibling)grid.insertBefore(card,anchor.nextSibling);else grid.prepend(card);
  const $g=id=>document.getElementById(id),state=$g('publishGptState'),endpoint=$g('publishGptEndpoint'),model=$g('publishGptModel'),help=$g('publishGptHelp'),keyState=$g('publishGptKeyState'),keyMeta=$g('publishGptKeyMeta'),secret=$g('publishGptSecret');
  let cached=null;
  function paint(root){cached=root||cached||{};const g=cached?.profiles?.gpt||{},ready=Boolean(g.configured);state.textContent=ready?'已連線':'尚未設定';state.classList.toggle('ready',ready);keyState.textContent=g.apiKeyConfigured?'已安全設定':'尚未設定';keyState.classList.toggle('ready',Boolean(g.apiKeyConfigured));keyMeta.textContent=g.apiKeyConfigured?swFormatSecretUpdatedAt(cached.gptApiKeyUpdatedAt):'尚未存入後端';secret.textContent=g.apiKeyConfigured?'更換 GPT Key':'設定 GPT Key';if(document.activeElement!==endpoint)endpoint.value=String(g.endpoint||'https://api.openai.com/v1/responses');if(document.activeElement!==model)model.value=String(g.model||'');help.textContent=ready?`✓ GPT · ${g.model||'model'} · ${g.endpointLabel||'api.openai.com'} · 可供每日焦點或手動切換使用`:'請先設定 GPT API Key 與 Model ID。';}
  try{paint(await window.signwellAIProfilesStatus())}catch(err){state.textContent='狀態未知';help.textContent='GPT 狀態讀取失敗：'+String(err?.message||err);paint({})}
  secret.onclick=async()=>{const ep=endpoint.value.trim()||'https://api.openai.com/v1/responses',m=model.value.trim();if(!m){showToast('請先填入 GPT Model ID');return}await openSecretVaultDialog({target:'ai',title:cached?.profiles?.gpt?.apiKeyConfigured?'更換 GPT API Key':'設定 GPT API Key',secretLabel:'GPT API Key',placeholder:'貼上 OpenAI API Key',onCommit:async({secret:apiKey,secretAuthToken})=>{const r=await window.signwellGPTConfigure({endpoint:ep,model:m,apiKey,secretAuthToken,test:true});paint(r.status||{});showToast('GPT API Key 已安全保存')}})};
  $g('publishGptSave').onclick=async()=>{const ep=endpoint.value.trim()||'https://api.openai.com/v1/responses',m=model.value.trim();if(!m){showToast('請填入 GPT Model ID');return}const btn=$g('publishGptSave'),old=btn.textContent;btn.disabled=true;btn.textContent='儲存中…';try{const r=await window.signwellGPTConfigure({endpoint:ep,model:m,test:true});paint(r.status||{});showToast('GPT 設定已儲存')}catch(err){help.textContent='GPT 設定失敗：'+String(err?.message||err);showToast('GPT 設定失敗')}finally{btn.disabled=false;btn.textContent=old}};
  $g('publishGptTest').onclick=async()=>{const btn=$g('publishGptTest'),old=btn.textContent;btn.disabled=true;btn.textContent='測試中…';try{const r=await window.signwellAIProfileTest('gpt');if(!r?.ok)throw new Error(r?.error||'GPT 測試失敗');state.textContent='正常';state.classList.add('ready');help.textContent=`✓ GPT · ${r.model||model.value} · Provider 回應正常`;showToast('GPT API 連線正常')}catch(err){state.textContent='異常';state.classList.remove('ready');help.textContent='GPT 測試失敗：'+String(err?.message||err);showToast('GPT API 測試失敗')}finally{btn.disabled=false;btn.textContent=old}};
}

async function initPublishComplianceSettings(){
  const grid=document.querySelector('.publish-grid');if(!grid||document.getElementById('publishComplianceCard'))return;
  const card=document.createElement('section');card.className='publish-card sw-compliance-settings-card';card.id='publishComplianceCard';
  card.innerHTML=`<div class="ai-provider-head"><div><h3>Compliance Guard · Gemini</h3><p>生成時把《醫療法》＋《醫療機構網際網路資訊管理辦法》直接交給 Gemini 作為寫作邊界；生成後改由本機 deterministic rules 再審一次。只有本機仍抓到可能風險才顯示提醒，正常文章保持靜默。內建法規來自你提供的文本，尚未即時核對現行官方版本。</p></div><span class="ai-provider-state" id="publishComplianceState">檢查中…</span></div><div class="sw-secret-summary"><div><span>Gemini API Key</span><strong id="publishComplianceKeyState">檢查中…</strong><small id="publishComplianceKeyMeta">只保存在 Apps Script</small></div><button class="top-action" id="publishComplianceSecret" type="button">設定 Key</button></div><div class="ai-provider-form"><label><span>Gemini Model ID</span><input id="publishComplianceModel" type="text" autocomplete="off" placeholder="gemini-…"></label><label><span>Notion Compliance Registry</span><input id="publishComplianceDb" type="text" readonly placeholder="先到中控台建立資料庫"></label><label class="wide"><span>你的 Compliance Prompt</span><textarea id="publishCompliancePrompt" rows="6" placeholder="例如：對醫美、減重藥物、療效保證、價格促銷採更嚴格標準。這裡不能覆蓋系統鎖定規則。"></textarea></label></div><div class="ai-provider-actions"><button class="top-action primary" id="publishComplianceSave" type="button">儲存 Compliance 設定</button><button class="top-action" id="publishComplianceTest" type="button">測試 Gemini</button><button class="top-action" id="publishComplianceSeedLaw" type="button">同步法規語料</button><button class="top-action" id="publishComplianceRefresh" type="button">檢查法規庫</button></div><div class="publish-status" id="publishComplianceHelp">正在讀取 Compliance Guard…</div>`;
  const ai=document.getElementById('publishAIProviderCard');if(ai&&ai.parentNode===grid)ai.insertAdjacentElement('afterend',card);else grid.prepend(card);
  const $c=id=>document.getElementById(id),state=$c('publishComplianceState'),model=$c('publishComplianceModel'),prompt=$c('publishCompliancePrompt'),db=$c('publishComplianceDb'),keyState=$c('publishComplianceKeyState'),keyMeta=$c('publishComplianceKeyMeta'),secret=$c('publishComplianceSecret'),help=$c('publishComplianceHelp');let cached=null;
  function paint(x){cached=x||cached||{};const ready=Boolean(cached.apiKeyConfigured);state.textContent=ready?'已設定':'尚未設定';state.classList.toggle('ready',ready);keyState.textContent=ready?'已安全設定':'尚未設定';keyState.classList.toggle('ready',ready);keyMeta.textContent=ready?swFormatSecretUpdatedAt(cached.apiKeyUpdatedAt):'尚未存入後端';secret.textContent=ready?'更換 Gemini Key':'設定 Gemini Key';if(document.activeElement!==model)model.value=String(cached.model||'');if(document.activeElement!==prompt)prompt.value=String(cached.customPrompt||'');db.value=String(cached.complianceDbId||'');const count=cached.corpusCount==null?'尚未檢查':`${Number(cached.corpusCount||0)} 筆法規語料`;const embedded=Number(cached.embeddedMedicalLawCount||0),internetRules=Number(cached.embeddedInternetInfoRuleCount||0);help.textContent=ready?`Gemini 已設定 · ${count}${embedded?` · 醫療法 ${embedded} 條`:''}${internetRules?` · 網際網路資訊管理辦法 ${internetRules} 條`:''}${embedded||internetRules?'（使用者提供文本／尚未核對現行版本）':''}${cached.live===false&&cached.liveError?' · Notion：'+cached.liveError:''}`:'先設定 Gemini API Key；內建法規仍可保留，但 Gemini 風險判讀會標記 NEEDS_HUMAN。';}
  async function status(live=false){const r=await signwellGasBridge('admin.compliance.status',{live},{adminKey:newsletterAdminKey(),timeoutMs:45000});paint(r);return r}
  try{await status(true)}catch(err){state.textContent='狀態未知';help.textContent='Compliance 狀態讀取失敗：'+String(err?.message||err)}
  secret.onclick=async()=>{await openSecretVaultDialog({target:'compliance',title:cached?.apiKeyConfigured?'更換 Gemini Compliance API Key':'設定 Gemini Compliance API Key',secretLabel:'Gemini API Key',placeholder:'貼上 Gemini API Key',onCommit:async({secret:apiKey,secretAuthToken})=>{const r=await signwellGasBridge('admin.compliance.configure',{apiKey,model:model.value.trim()||cached?.model||'gemini-2.5-flash',customPrompt:prompt.value.trim(),secretAuthToken,test:true},{adminKey:newsletterAdminKey(),timeoutMs:70000});paint(r.status||{});showToast('Gemini Compliance Key 已安全保存')}})};
  $c('publishComplianceSave').onclick=async()=>{const btn=$c('publishComplianceSave'),old=btn.textContent;btn.disabled=true;btn.textContent='儲存中…';try{const r=await signwellGasBridge('admin.compliance.configure',{model:model.value.trim(),customPrompt:prompt.value.trim()},{adminKey:newsletterAdminKey(),timeoutMs:45000});paint(r.status||{});showToast('Compliance Guard 設定已儲存')}catch(err){showToast('Compliance 設定失敗：'+String(err?.message||err))}finally{btn.disabled=false;btn.textContent=old}};
  $c('publishComplianceTest').onclick=async()=>{const btn=$c('publishComplianceTest'),old=btn.textContent;btn.disabled=true;btn.textContent='測試中…';try{const r=await signwellGasBridge('admin.compliance.test',{}, {adminKey:newsletterAdminKey(),timeoutMs:70000});if(!r?.ok)throw new Error(r?.error||'Gemini 測試失敗');state.textContent='正常';state.classList.add('ready');help.textContent=`✓ ${r.model||model.value} · Gemini API 回應正常`;showToast('Gemini Compliance Guard 連線正常')}catch(err){state.textContent='異常';state.classList.remove('ready');help.textContent='Gemini 測試失敗：'+String(err?.message||err);showToast('Gemini Compliance Guard 測試失敗')}finally{btn.disabled=false;btn.textContent=old}};
  $c('publishComplianceSeedLaw').onclick=async()=>{const btn=$c('publishComplianceSeedLaw'),old=btn.textContent;if(!confirm('把你提供的《醫療法》與《醫療機構網際網路資訊管理辦法》同步到 Notion Compliance Registry？\n\n兩份文本都會標記為「使用者提供／尚未核對現行官方版本」；刪除條文會保留紀錄但設為非 Active。'))return;btn.disabled=true;btn.textContent='同步中…';help.textContent='正在把兩份法規逐條寫入 Notion Compliance Registry…';try{const r=await signwellGasBridge('admin.compliance.seedLegalCorpus',{skipExisting:false},{adminKey:newsletterAdminKey(),timeoutMs:240000});help.textContent=`✓ 醫療法 ${Number(r.medicalLawCount||0)} 條 · 網際網路資訊管理辦法 ${Number(r.internetInfoCount||0)} 條 · 新增 ${Number(r.created||0)} · 更新 ${Number(r.updated||0)} · 仍需核對現行官方版本`;showToast('法規語料已同步到 Compliance Registry');await status(true)}catch(err){help.textContent='法規同步失敗：'+String(err?.message||err);showToast('法規同步失敗')}finally{btn.disabled=false;btn.textContent=old}};
  $c('publishComplianceRefresh').onclick=async()=>{try{await status(true);showToast('Compliance Registry 狀態已更新')}catch(err){showToast(String(err?.message||err))}};
}



async function initMetaProviderSettings(){
  const grid=document.querySelector('.publish-grid');if(!grid||document.getElementById('publishMetaProviderCard'))return;
  const card=document.createElement('section');card.className='publish-card meta-provider-card';card.id='publishMetaProviderCard';
  card.innerHTML=`<div class="ai-provider-head"><div><h3>Meta 社群帳號連結中心</h3><p>Facebook + Instagram 與 Threads 改用 OAuth 一鍵授權。Access Token、Page Token、App Secret 只保存在 Apps Script；瀏覽器只看得到帳號名稱與 ID。</p></div><span class="ai-provider-state" id="publishMetaState">檢查中…</span></div>
  <div class="meta-oauth-grid">
    <article class="meta-oauth-account" id="metaGraphAccountCard"><div class="meta-oauth-account-head"><div><span>FACEBOOK + INSTAGRAM</span><strong id="metaGraphIdentity">尚未連結</strong><small id="metaGraphDetail">使用 Meta Graph OAuth</small></div><i id="metaGraphDot"></i></div><div class="meta-oauth-actions"><button class="top-action primary" id="metaGraphConnect" type="button">連結帳號</button><button class="top-action danger" id="metaGraphDisconnect" type="button" disabled>解除連結</button></div></article>
    <article class="meta-oauth-account" id="metaThreadsAccountCard"><div class="meta-oauth-account-head"><div><span>THREADS</span><strong id="metaThreadsIdentity">尚未連結</strong><small id="metaThreadsDetail">使用 Threads OAuth</small></div><i id="metaThreadsDot"></i></div><div class="meta-oauth-actions"><button class="top-action primary" id="metaThreadsConnect" type="button">連結帳號</button><button class="top-action danger" id="metaThreadsDisconnect" type="button" disabled>解除連結</button></div></article>
  </div>
  <div class="meta-oauth-selector" id="metaPageSelectorWrap" hidden><label><span>目前發布用 Facebook Page / Instagram</span><select id="metaPageSelector"></select></label><small>如果同一個 Meta 帳號管理多個 Page，可在這裡指定 SIGN WELL 要發布到哪一組帳號。</small></div>
  <div class="meta-oauth-setup"><div class="meta-provider-grid"><label class="wide"><span>OAuth Redirect URI</span><div class="meta-oauth-inline"><input id="publishMetaRedirect" readonly><button class="top-action" id="publishMetaCopyRedirect" type="button">複製</button></div></label><label><span>Meta App ID</span><input id="publishMetaAppId" type="text" inputmode="numeric" placeholder="Meta Developer App ID"></label><label><span>Threads App ID（可留空共用 Meta App ID）</span><input id="publishThreadsAppId" type="text" inputmode="numeric" placeholder="Threads App ID"></label></div><div class="ai-provider-actions"><button class="top-action" id="publishMetaSaveApps" type="button">儲存 App ID</button><button class="top-action" id="publishMetaAppSecret" type="button">設定 Meta App Secret</button><button class="top-action" id="publishThreadsAppSecret" type="button">設定 Threads App Secret</button></div><div class="meta-provider-note">先在 Meta for Developers 把上方 Redirect URI 加進 OAuth redirect 設定，再回來按「連結帳號」。若你的 Threads product 使用獨立 App ID / Secret，可在這裡分開設定；否則系統會共用 Meta App credentials。</div></div>
  <details class="settings-developer-cli"><summary>Meta Developer CLI · 進階</summary><div class="settings-developer-cli-body"><div><strong style="font-size:10px;color:#5d6f7d">Meta Developer CLI</strong><p style="margin:4px 0 0;color:#84929c;font-size:9px;line-height:1.55">你提供的是安裝命令，不是 API Key。只在登入後的設定頁保存顯示，不會送到 Public，也不會由 CMS 自動執行。</p></div><code id="metaDeveloperCliCommand">curl -fsSL https://dev.meta.ai/install.sh | bash</code><div class="settings-cli-actions"><button type="button" id="copyMetaDeveloperCli">複製指令</button></div></div></details>
  <details class="meta-manual-fallback"><summary>進階／手動 Token fallback</summary><div class="meta-manual-body"><div class="sw-secret-summary"><div><span>Meta Graph Access Token</span><strong id="publishMetaTokenState">檢查中…</strong><small id="publishMetaTokenMeta">OAuth 失效時才建議手動設定</small></div><button class="top-action" id="publishMetaSecret" type="button">設定 Graph Token</button></div><div class="sw-secret-summary" style="margin-top:10px"><div><span>Threads Access Token</span><strong id="publishThreadsTokenState">檢查中…</strong><small id="publishThreadsTokenMeta">OAuth 失效時才建議手動設定</small></div><button class="top-action" id="publishThreadsSecret" type="button">設定 Threads Token</button></div><div class="sw-secret-summary" style="margin-top:10px"><div><span>Facebook Page Access Token</span><strong id="publishFbPageTokenState">檢查中…</strong><small id="publishFbPageTokenMeta">正常 OAuth 會自動取得</small></div><button class="top-action" id="publishFbPageSecret" type="button">設定 Page Token</button></div><div class="meta-provider-grid"><label class="wide"><span>Meta Graph API Endpoint</span><input id="publishMetaEndpoint" type="url" placeholder="https://graph.facebook.com"></label><label><span>Graph API Version（可留空）</span><input id="publishMetaVersion" type="text" placeholder="例如 vXX.X"></label><label><span>Instagram User ID</span><input id="publishMetaIg" type="text" inputmode="numeric" placeholder="OAuth 正常會自動填入"></label><label><span>Facebook Page ID</span><input id="publishMetaFb" type="text" inputmode="numeric" placeholder="OAuth 正常會自動填入"></label><label><span>Threads API Endpoint</span><input id="publishMetaThreadsEndpoint" type="url" placeholder="https://graph.threads.net"></label><label><span>Threads API Version（可留空）</span><input id="publishMetaThreadsVersion" type="text" placeholder="例如 v1.0"></label><label><span>Threads User ID</span><input id="publishMetaThreads" type="text" inputmode="numeric" placeholder="OAuth 正常會自動填入"></label><label><span>資料來源</span><select id="publishMetaEnabled"><option value="true">啟用</option><option value="false">停用</option></select></label></div><div class="ai-provider-actions"><button class="top-action" id="publishMetaSave" type="button">儲存進階設定</button></div></div></details>
  <div class="ai-provider-actions"><button class="top-action" id="publishMetaTest" type="button">健康檢查</button><button class="top-action" id="publishMetaRefresh" type="button">重新抓取統計</button></div><div class="publish-status" id="publishMetaHelp">正在讀取 Meta 連線狀態…</div>`;
  const ai=document.getElementById('publishAIProviderCard');if(ai&&ai.parentNode===grid)ai.insertAdjacentElement('afterend',card);else grid.prepend(card);
  const $m=id=>document.getElementById(id);let cached=null;
  const val=(id,v)=>{const el=$m(id);if(el&&!el.matches(':focus'))el.value=v??''};
  function paint(s){
    cached=s||{};const oauth=s.oauth||{},g=oauth.graph||{},t=oauth.threads||{},accounts=Array.isArray(s.graphAccounts)?s.graphAccounts:[];
    val('publishMetaRedirect',oauth.redirectUri||'');val('publishMetaAppId',g.appId||'');val('publishThreadsAppId',t.ownAppId?t.appId:'');
    val('publishMetaEndpoint',s.graphEndpoint||'https://graph.facebook.com');val('publishMetaVersion',s.graphVersion||'');val('publishMetaIg',s.igUserId||'');val('publishMetaFb',s.fbPageId||'');val('publishMetaThreadsEndpoint',s.threadsEndpoint||'https://graph.threads.net');val('publishMetaThreadsVersion',s.threadsVersion||'');val('publishMetaThreads',s.threadsUserId||'');if($m('publishMetaEnabled'))$m('publishMetaEnabled').value=s.enabled===false?'false':'true';
    $m('metaGraphIdentity').textContent=g.connected?(g.userName||'Meta 帳號已連結'):'尚未連結';$m('metaGraphDetail').textContent=g.connected?`${accounts.length} 個 Page · ${s.fbPageId?'已選 Page '+s.fbPageId:'尚未選 Page'}`:(g.appId&&g.appSecretConfigured?'App 已設定，可開始 OAuth':'先設定 Meta App ID / Secret');$m('metaGraphDot').classList.toggle('ready',Boolean(g.connected));$m('metaGraphConnect').textContent=g.connected?'重新授權':'連結帳號';$m('metaGraphDisconnect').disabled=!g.connected;
    $m('metaThreadsIdentity').textContent=t.connected?(t.username?'@'+t.username:'Threads 已連結'):'尚未連結';$m('metaThreadsDetail').textContent=t.connected?(t.userId?'User ID · '+t.userId:'OAuth 已完成'):(t.appId&&t.appSecretConfigured?'App 已設定，可開始 OAuth':'先設定 Threads App credentials');$m('metaThreadsDot').classList.toggle('ready',Boolean(t.connected));$m('metaThreadsConnect').textContent=t.connected?'重新授權':'連結帳號';$m('metaThreadsDisconnect').disabled=!t.connected;
    const wrap=$m('metaPageSelectorWrap'),sel=$m('metaPageSelector');if(wrap&&sel){wrap.hidden=!accounts.length;sel.innerHTML=accounts.map(x=>`<option value="${escapeHTML(x.pageId)}" ${String(x.pageId)===String(s.fbPageId)?'selected':''}>${escapeHTML(x.pageName||x.pageId)}${x.igUsername?' · @'+escapeHTML(x.igUsername):x.igUserId?' · Instagram':''}</option>`).join('')}
    const ready=Boolean(s.accessTokenConfigured),tr=Boolean(s.threadsAccessTokenConfigured),fbp=Boolean(s.fbPageAccessTokenConfigured);$m('publishMetaTokenState').textContent=ready?'已安全設定':'尚未設定';$m('publishMetaTokenState').classList.toggle('ready',ready);$m('publishMetaTokenMeta').textContent=ready?swFormatSecretUpdatedAt(s.tokenUpdatedAt):'尚未存入後端';$m('publishMetaSecret').textContent=ready?'更換 Graph Token':'設定 Graph Token';$m('publishThreadsTokenState').textContent=tr?'已安全設定':'尚未設定';$m('publishThreadsTokenState').classList.toggle('ready',tr);$m('publishThreadsTokenMeta').textContent=tr?swFormatSecretUpdatedAt(s.threadsTokenUpdatedAt):'尚未存入後端';$m('publishThreadsSecret').textContent=tr?'更換 Threads Token':'設定 Threads Token';$m('publishFbPageTokenState').textContent=fbp?'已安全設定':'尚未設定';$m('publishFbPageTokenState').classList.toggle('ready',fbp);$m('publishFbPageTokenMeta').textContent=fbp?swFormatSecretUpdatedAt(s.fbPageTokenUpdatedAt):'OAuth 正常會自動取得';$m('publishFbPageSecret').textContent=fbp?'更換 Page Token':'設定 Page Token';
    $m('publishMetaAppSecret').textContent=g.appSecretConfigured?'更換 Meta App Secret':'設定 Meta App Secret';$m('publishThreadsAppSecret').textContent=t.ownAppSecret?'更換 Threads App Secret':(t.appSecretConfigured?'使用共用 Secret · 可改成獨立':'設定 Threads App Secret');
    const connected=Boolean(g.connected||t.connected);$m('publishMetaState').textContent=connected?'OAuth 已連線':(g.appId||t.appId)?'等待授權':'尚未設定';$m('publishMetaState').classList.toggle('ready',connected);$m('publishMetaHelp').textContent=s.note||'Meta OAuth 設定只存在後端。';
  }
  async function status(live=false){const r=await signwellGasBridge('admin.meta.status',{live},{adminKey:newsletterAdminKey(),timeoutMs:30000});paint(r);return r}
  async function savePlain(){const payload={appId:$m('publishMetaAppId').value.trim(),threadsAppId:$m('publishThreadsAppId').value.trim(),graphEndpoint:$m('publishMetaEndpoint').value.trim(),graphVersion:$m('publishMetaVersion').value.trim(),igUserId:$m('publishMetaIg').value.trim(),fbPageId:$m('publishMetaFb').value.trim(),threadsEndpoint:$m('publishMetaThreadsEndpoint').value.trim(),threadsVersion:$m('publishMetaThreadsVersion').value.trim(),threadsUserId:$m('publishMetaThreads').value.trim(),enabled:$m('publishMetaEnabled').value==='true'};const r=await signwellGasBridge('admin.meta.configure',payload,{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);return r}
  async function connect(provider){let popup=null;try{popup=window.open('about:blank','signwellMetaOAuth_'+provider,'width=680,height=820,resizable=yes,scrollbars=yes');if(!popup){showToast('瀏覽器封鎖了 OAuth 視窗，請允許彈出視窗後再試');return}popup.document.write('<!doctype html><meta charset="utf-8"><title>SIGN WELL</title><p style="font-family:Microsoft JhengHei UI,Microsoft JhengHei,微軟正黑體,Yuanti TC,PingFang TC,sans-serif;padding:30px">正在準備 Meta 授權…</p>');await savePlain();const r=await signwellGasBridge('admin.meta.oauthStart',{provider},{adminKey:newsletterAdminKey(),timeoutMs:30000});popup.location.replace(r.authUrl)}catch(err){try{popup?.close()}catch(_){}showToast(String(err?.message||err))}}
  async function disconnect(provider,label){if(!(await swConfirm(`要解除 SIGN WELL 與 ${label} 的連結嗎？\n這只會清除 SIGN WELL 後端保存的 OAuth Token，不會刪除你的社群帳號。`,{title:'解除社群連結？',kicker:'META CONNECT',danger:true,confirmText:'解除連結'})))return;try{const r=await signwellGasBridge('admin.meta.disconnect',{provider},{adminKey:newsletterAdminKey(),timeoutMs:30000});paint(r);showToast(label+' 已解除連結')}catch(err){showToast('解除連結失敗：'+String(err?.message||err))}}
  try{await status(false)}catch(err){$m('publishMetaState').textContent='狀態未知';$m('publishMetaHelp').textContent='Meta 狀態讀取失敗：'+String(err?.message||err)}
  $m('publishMetaCopyRedirect').onclick=async()=>{try{await navigator.clipboard.writeText($m('publishMetaRedirect').value||'');showToast('OAuth Redirect URI 已複製')}catch(_){showToast('複製失敗')}};
  $m('publishMetaSaveApps').onclick=async()=>{try{await savePlain();showToast('Meta App ID 已儲存')}catch(err){showToast('儲存失敗：'+String(err?.message||err))}};
  $m('publishMetaAppSecret').onclick=async()=>{await openSecretVaultDialog({target:'meta',title:cached?.oauth?.graph?.appSecretConfigured?'更換 Meta App Secret':'設定 Meta App Secret',secretLabel:'Meta App Secret',placeholder:'Meta App Secret',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.meta.configure',{appId:$m('publishMetaAppId').value.trim(),threadsAppId:$m('publishThreadsAppId').value.trim(),appSecret:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);showToast('Meta App Secret 已安全保存')}})};
  $m('publishThreadsAppSecret').onclick=async()=>{await openSecretVaultDialog({target:'meta',title:cached?.oauth?.threads?.ownAppSecret?'更換 Threads App Secret':'設定 Threads App Secret',secretLabel:'Threads App Secret',placeholder:'Threads App Secret',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.meta.configure',{appId:$m('publishMetaAppId').value.trim(),threadsAppId:$m('publishThreadsAppId').value.trim(),threadsAppSecret:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);showToast('Threads App Secret 已安全保存')}})};
  $m('metaGraphConnect').onclick=()=>connect('graph');$m('metaThreadsConnect').onclick=()=>connect('threads');$m('metaGraphDisconnect').onclick=()=>disconnect('graph','Facebook + Instagram');$m('metaThreadsDisconnect').onclick=()=>disconnect('threads','Threads');
  $m('metaPageSelector').onchange=async e=>{try{const r=await signwellGasBridge('admin.meta.selectAccount',{pageId:e.target.value},{adminKey:newsletterAdminKey(),timeoutMs:30000});paint(r);showToast('發布帳號已切換')}catch(err){showToast('切換帳號失敗：'+String(err?.message||err))}};
  $m('publishMetaSave').onclick=async()=>{const btn=$m('publishMetaSave'),old=btn.textContent;btn.disabled=true;btn.textContent='儲存中…';try{await savePlain();showToast('Meta 進階設定已儲存')}catch(err){showToast('Meta 設定失敗：'+String(err?.message||err))}finally{btn.disabled=false;btn.textContent=old}};
  $m('publishMetaSecret').onclick=async()=>{await openSecretVaultDialog({target:'meta',title:cached?.accessTokenConfigured?'更換 Meta Graph Access Token':'設定 Meta Graph Access Token',secretLabel:'Meta Graph Access Token',placeholder:'EA… / Meta token',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.meta.configure',{accessToken:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);showToast('Meta Access Token 已安全保存')}})};
  $m('publishThreadsSecret').onclick=async()=>{await openSecretVaultDialog({target:'meta',title:cached?.threadsAccessTokenConfigured?'更換 Threads Access Token':'設定 Threads Access Token',secretLabel:'Threads Access Token',placeholder:'Threads token',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.meta.configure',{threadsAccessToken:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);showToast('Threads Access Token 已安全保存')}})};
  $m('publishFbPageSecret').onclick=async()=>{await openSecretVaultDialog({target:'meta',title:cached?.fbPageAccessTokenConfigured?'更換 Facebook Page Access Token':'設定 Facebook Page Access Token',secretLabel:'Facebook Page Access Token',placeholder:'貼上 Page Token',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.meta.configure',{fbPageAccessToken:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});paint(r);showToast('Facebook Page Token 已安全保存')}})};
  $m('publishMetaTest').onclick=async()=>{const btn=$m('publishMetaTest'),old=btn.textContent;btn.disabled=true;btn.textContent='檢查中…';try{const r=await signwellGasBridge('admin.meta.test',{}, {adminKey:newsletterAdminKey(),timeoutMs:35000});if(!r?.ok)throw new Error(r?.error||'Meta API 健康檢查失敗');$m('publishMetaState').textContent='正常';$m('publishMetaState').classList.add('ready');$m('publishMetaHelp').textContent=`✓ Meta API 回應正常${r.identity?.name?' · '+r.identity.name:''}`;showToast('Meta API 健康檢查通過')}catch(err){$m('publishMetaState').textContent='異常';$m('publishMetaState').classList.remove('ready');$m('publishMetaHelp').textContent='Meta API 健康檢查失敗：'+String(err?.message||err);showToast('Meta API 健康檢查失敗')}finally{btn.disabled=false;btn.textContent=old}};
  $m('publishMetaRefresh').onclick=async()=>{try{metaSocialLastFetch=0;await refreshMetaSocialStats(true);await status(true);showToast('Meta 社群統計已更新')}catch(err){showToast('更新失敗：'+String(err?.message||err))}};
  window.__swMetaOAuthRefresh=async d=>{showToast(d?.ok?(d.message||'Meta 帳號已連結'):(d?.message||'Meta OAuth 失敗'));try{await status(true);metaSocialLastFetch=0;if(viewName==='dashboard')await refreshMetaSocialStats(true)}catch(_){}};
  if(!window.__swMetaOAuthListenerBound){window.__swMetaOAuthListenerBound=true;window.addEventListener('message',e=>{const d=e.data;if(!d||d.source!=='SIGNWELL_META_OAUTH')return;window.__swMetaOAuthRefresh?.(d)})}
}

async function initSecurityAuditPanel(){
  const view=$('#view');if(!view||viewName!=='export')return;
  let host=$('#securityAuditPanel');
  if(!host){
    host=document.createElement('section');host.id='securityAuditPanel';host.className='security-audit-card';
    host.innerHTML=`<div class="security-audit-head"><div><h3>Security Audit Log</h3><p>後端安全事件摘要。密碼、API Key、完整 Email 與文章全文不會寫進稽核紀錄。</p></div><button class="top-action" id="refreshAuditBtn">重新整理</button></div><div class="security-audit-list" id="securityAuditList"><div class="empty">載入中…</div></div>`;
    view.appendChild(host);
    $('#refreshAuditBtn').onclick=()=>initSecurityAuditPanel();
  }
  const list=$('#securityAuditList');if(!list)return;
  try{
    const r=await signwellGasBridge('admin.audit.list',{limit:24},{adminKey:newsletterAdminKey(),timeoutMs:30000});
    const items=Array.isArray(r?.items)?r.items:[];
    list.innerHTML=items.length?items.map(x=>`<div class="security-audit-row"><div><strong>${escapeHTML(x.event||x.action||'event')}</strong><span>${escapeHTML(x.target||'')} · ${escapeHTML(x.timestamp||'')}</span></div><em class="${String(x.status||'').toLowerCase()==='success'?'ok':'bad'}">${escapeHTML(x.status||'—')}</em></div>`).join(''):'<div class="empty">目前沒有稽核事件。</div>';
  }catch(err){list.innerHTML=`<div class="empty">無法載入 Audit Log：${escapeHTML(err?.message||String(err))}</div>`}
}

/* SIGN WELL v23.9.77 · Notion Command Center */
const swNotionState={status:null,busy:false};
function swNotionRequest(action,payload={},timeout=60000){return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey(),timeoutMs:timeout});}
function swNotionTime(value){if(!value)return '尚未同步';try{return new Intl.DateTimeFormat('zh-TW',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}catch(_){return String(value)}}
function swNotionSetBusy(on){swNotionState.busy=Boolean(on);document.querySelectorAll('#view .notion-actions button,#view .notion-card button,#notionSettingsCard button').forEach(b=>b.disabled=Boolean(on));if(!on&&swNotionState.status)swNotionApplyStatus(swNotionState.status);}
function swNotionLog(text,tone=''){const el=document.getElementById('notionCommandLog');if(!el)return;el.className='notion-log'+(tone?' '+tone:'');el.textContent=String(text||'');}
function swNotionDbCount(s){return Object.values(s?.databases||{}).filter(Boolean).length;}
function swNotionStatusLabel(s){if(!s?.accessTokenConfigured)return '尚未設定 Workspace Token';if(s.live===false)return 'Token 已保存 · 連線待確認';if(s.live===true)return (s.bot?.workspaceName||s.bot?.name||'Workspace')+' · LIVE';return 'Workspace Token 已保存';}
function swNotionCommandHtml(){
  return `<section class="notion-cc" id="notionCommandCenter">
    <div class="notion-cc-head"><div><h1>SIGN WELL Command Center</h1><p>Notion 是決策／知識中控台，SIGN WELL CMS 負責真正的發布與執行。這裡只顯示連線狀態與營運操作；API、Token、Database mapping 統一放在「設定」。</p></div><span class="notion-cc-badge" id="notionCcBadge"><i></i>檢查中…</span></div>
    <section class="notion-hero-ops"><div class="notion-hero-copy"><div><span>TODAY · OPERATIONS</span><strong>把今天需要處理的事，集中在這裡。</strong><p>同步資料、審核內容，再由 Canva / Meta / Gmail 完成分發與回報。技術憑證不在工作頁顯示。</p></div><span class="notion-cc-badge" id="notionOpsState"><i></i>CONTROL PLANE</span></div><div class="notion-hero-actions"><button class="primary" id="notionHeroSync" type="button">同步到 Notion</button><button id="notionHeroWeekly" type="button">寄送本週摘要</button><button id="notionHeroArticles" type="button">打開文章工作區</button><button id="notionOpenSettingsBtn" type="button">前往設定</button></div></section>
    <div class="notion-cc-kpis">
      <div class="notion-cc-kpi"><span>NOTION WORKSPACE</span><strong id="notionKpiWorkspace">—</strong><small id="notionKpiWorkspaceSub">正在讀取</small></div>
      <div class="notion-cc-kpi"><span>CONTROL DATABASES</span><strong id="notionKpiDb">0 / 13</strong><small>8 workflow DBs + Prompt · Source · Flags · Releases · AI Performance</small></div>
      <div class="notion-cc-kpi"><span>WEEKLY BRIEF</span><strong id="notionKpiWeekly">OFF</strong><small id="notionKpiWeeklySub">Gmail 主動通知</small></div>
      <div class="notion-cc-kpi"><span>LAST SYNC</span><strong id="notionKpiSync">—</strong><small id="notionKpiSyncSub">尚未同步</small></div>
    </div>
    <div class="notion-cc-grid">
      <section class="notion-card"><div class="notion-card-head"><div><strong>Notion 連線狀態</strong><small>工作頁只顯示狀態。憑證、Parent Page 與資料庫映射請到「設定」。</small></div><span class="notion-cc-badge" id="notionTokenBadge"><i></i>檢查中</span></div><div class="notion-card-body">
        <div class="connection-summary"><div class="connection-row"><span>Workspace</span><strong id="notionConnectionWorkspace">檢查中…</strong></div><div class="connection-row"><span>中控資料庫</span><strong id="notionDbStatusText">0 / 13</strong></div><div class="connection-row"><span>同步能力</span><strong id="notionSyncStatusText">檢查中…</strong></div></div>
        <div class="notion-actions"><button class="primary" id="notionSyncBtn" type="button">立即同步 CMS → Notion</button><button id="notionOpenSettingsBtn2" type="button">前往設定</button></div>
        <div class="notion-note">Notion 已連線後，CMS 只會把資料同步到 Workspace；不會因 Notion 欄位變更就自動發布醫療內容。</div>
      </div></section>
      <section class="notion-card"><div class="notion-card-head"><div><strong>自動化工作流</strong><small>資料自己流動，人工保留最終發布決策。</small></div></div><div class="notion-card-body"><div class="notion-flow">
        <div class="notion-flow-step"><b>1</b><div><strong>Content Pipeline</strong><span>CMS 文章、狀態、Evidence readiness 自動同步。</span></div></div>
        <div class="notion-flow-step"><b>2</b><div><strong>Social Queue</strong><span>已發布文章建立 IG / Threads / Facebook 待製作項目。</span></div></div>
        <div class="notion-flow-step"><b>3</b><div><strong>Evidence Registry</strong><span>主張、效果與限制成為可檢索資料。</span></div></div>
        <div class="notion-flow-step"><b>4</b><div><strong>Weekly Reports</strong><span>網站、訂閱、Meta 與系統健康同步整理。</span></div></div>
        <div class="notion-flow-step"><b>5</b><div><strong>Operations</strong><span>Bug、功能、法規與待辦集中管理。</span></div></div>
        <div class="notion-flow-step"><b>6</b><div><strong>AI Review Inbox</strong><span>每小時新聞草稿於 24 小時內人工審稿。</span></div></div>
        <div class="notion-flow-step"><b>7</b><div><strong>Compliance Registry</strong><span>官方法規／函釋／指引片段供 Gemini grounded review。</span></div></div>
        <div class="notion-flow-step"><b>8</b><div><strong>Article Summaries</strong><span>每篇文章的 10 秒摘要與 CMS / Public 使用同一份 canonical 內容。</span></div></div>
        <div class="notion-flow-step"><b>9</b><div><strong>Prompt Registry</strong><span>管理低優先序 editorial prompt；Evidence / Citation / Legal locked rules 仍由後端鎖定。</span></div></div>
        <div class="notion-flow-step"><b>10</b><div><strong>Source Registry</strong><span>以 Notion overlay 管可信來源、網域、alias、trust tier 與 blocked policy。</span></div></div>
        <div class="notion-flow-step"><b>11</b><div><strong>Feature Flags</strong><span>非認證核心功能可在 Notion 開關；OTP、登入與 rate-limit 永遠不受 Notion 控制。</span></div></div>
        <div class="notion-flow-step"><b>12</b><div><strong>Release Registry</strong><span>記錄 release、bridge protocol、schema 與 build ID，避免不同 surface 版本漂移。</span></div></div>
        <div class="notion-flow-step"><b>13</b><div><strong>AI Performance</strong><span>Writer / Reviewer、Claim Audit、修稿次數、Topic Fit、latency 與 failover 形成長期資料。</span></div></div>
      </div></div></section>
      <section class="notion-card" id="notionControlPlaneCard"><div class="notion-card-head"><div><strong>v24.1 Control Plane</strong><small>Notion → Backend 每 15 分鐘同步 Prompt / Source / Flags；Release 與 AI Performance 反向寫回 Notion。Notion 掛掉時沿用 local snapshot。</small></div><span class="notion-cc-badge" id="notionControlPlaneBadge"><i></i>檢查中</span></div><div class="notion-card-body">
        <div class="connection-summary"><div class="connection-row"><span>Prompt Registry</span><strong id="notionCpPrompts">—</strong></div><div class="connection-row"><span>Source Registry</span><strong id="notionCpSources">—</strong></div><div class="connection-row"><span>Feature Flags</span><strong id="notionCpFlags">—</strong></div><div class="connection-row"><span>AI Metrics Queue</span><strong id="notionCpPerf">—</strong></div><div class="connection-row"><span>Last Control Sync</span><strong id="notionCpLastSync">—</strong></div><div class="connection-row"><span>Fallback</span><strong>LOCAL SNAPSHOT</strong></div></div>
        <div class="notion-actions"><button class="primary" id="notionControlPlaneSyncBtn" type="button">立即同步 Control Plane</button><button id="notionControlPlaneSeedBtn" type="button">補齊預設 Registry</button></div>
        <div class="notion-note">安全邊界：Notion 不可關閉 OTP、登入、rate limit、admin auth 或 bridge 驗證；Feature Flags 僅接受後端 allowlist。</div>
      </div></section>
      <section class="notion-card"><div class="notion-card-head"><div><strong>Gmail Weekly Brief</strong><small>每週一自動建立營運報告並寄到你的 Gmail；完整歷史保留在 Notion。</small></div><span class="notion-cc-badge" id="notionWeeklyBadge"><i></i>MON</span></div><div class="notion-card-body">
        <div class="notion-weekly-switch"><div><b>每週一自動寄送</b><span>網站 / Content / Newsletter / Meta / 系統健康</span></div><input id="notionWeeklyEnabled" type="checkbox"></div>
        <div class="notion-fields" style="margin-top:10px"><label class="wide">收件 Email<input id="notionWeeklyEmail" type="email" inputmode="email" autocomplete="email" placeholder="你的 Gmail"></label><label>寄送時間<select id="notionWeeklyHour">${[7,8,9,10,11,12].map(h=>`<option value="${h}">${String(h).padStart(2,'0')}:00</option>`).join('')}</select></label><label>Timezone<input readonly value="Asia/Taipei"></label></div>
        <div class="notion-actions"><button class="primary" id="notionWeeklySave" type="button">儲存週報排程</button><button id="notionWeeklySend" type="button">現在寄一封測試週報</button></div>
        <div class="notion-note">週報採固定白色 Email，並同步建立 Notion Weekly Report。這是營運信，不寄給訂閱者。</div>
      </div></section>
      <section class="notion-card" id="reviewAutomationCard"><div class="notion-card-head"><div><strong>每小時 AI 審稿流水線</strong><small>Primary AI 不可用時，依 Notion AI Routing 的 Fallback 順序接手；Evidence Pack、Claim Map、Prompt Injection Firewall、引用與法規條件完全不變，只替換執行模型。</small></div><span class="notion-cc-badge" id="reviewAutomationBadge"><i></i>檢查中</span></div><div class="notion-card-body">
        <div class="notion-flow"><div class="notion-flow-step"><b>1h</b><div><strong>自動掃描</strong><span>每小時重新掃描近 24 小時醫療／健康／運動醫學新聞。</span></div></div><div class="notion-flow-step"><b>↪</b><div><strong>Role Failover</strong><span>Writer / Reviewer 各自維持同一份任務契約，只在 Provider 不可用時換模型。</span></div></div><div class="notion-flow-step"><b>24h</b><div><strong>短期 Review Queue</strong><span>AI 草稿最多保留 24 小時，逾時自動清理。</span></div></div></div>
        <div class="connection-summary" style="margin-top:12px"><div class="connection-row"><span>待審稿</span><strong id="reviewPendingCount">—</strong></div><div class="connection-row"><span>最後執行</span><strong id="reviewLastRun">—</strong></div><div class="connection-row"><span>Notion Routing</span><strong id="reviewRoutingState">檢查中…</strong></div></div>
        <div class="notion-fields" style="margin-top:12px">
          <label class="wide">Writer Primary<select id="reviewAiProfileSelect"><option value="gpt">GPT（預設）</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select><small style="display:block;margin-top:6px;color:#7e8b94">第一稿與定點修稿的首選模型。</small></label>
          <label>Writer Fallback 1<select id="reviewWriterFallback1"><option value="gpt">GPT</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select></label>
          <label>Writer Fallback 2<select id="reviewWriterFallback2"><option value="gpt">GPT</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select></label>
          <label class="wide">Evidence Reviewer Primary<select id="reviewReviewerProfileSelect"><option value="gemini">Gemini（預設）</option><option value="gpt">GPT</option><option value="writer">Writer Core</option></select><small style="display:block;margin-top:6px;color:#7e8b94">Claim / Citation / 三層內容審查的首選模型；不直接整篇重寫。</small></label>
          <label>Reviewer Fallback 1<select id="reviewReviewerFallback1"><option value="gpt">GPT</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select></label>
          <label>Reviewer Fallback 2<select id="reviewReviewerFallback2"><option value="gpt">GPT</option><option value="gemini">Gemini</option><option value="writer">Writer Core</option></select></label>
          <label class="wide" style="display:flex;align-items:center;gap:10px"><input id="reviewFailoverEnabled" type="checkbox" checked style="width:auto">啟用 AI Role Failover<small style="display:block;color:#7e8b94">Primary 失敗、配額／連線錯誤、模型不可用或未設定時才依序接手；不因內容驗證 FAIL 而換模型。</small></label>
          <label class="wide">CMS 審稿網址<input id="reviewCmsUrl" type="url" inputmode="url" autocomplete="url" placeholder="https://980510linz.github.io/-/CMS/"><small style="display:block;margin-top:6px;color:#7e8b94">Gmail 與 Notion 的「前往 CMS」都從這個 canonical URL 產生；不要填 Public 網址。</small></label>
        </div>
        <div class="notion-actions"><button class="primary" id="reviewRoutingSaveBtn" type="button">儲存 AI Routing</button><button id="reviewRoutingSyncBtn" type="button">從 Notion 重新讀取</button><a id="reviewRoutingNotionLink" href="#" target="_blank" rel="noopener" style="display:none">打開 Notion AI Routing ↗</a><button id="reviewInstallBtn" type="button">啟用每小時流程</button><button id="reviewRunNowBtn" type="button">立即跑一次</button><button id="reviewOpenInboxBtn" type="button">打開待審稿</button><button id="reviewCleanupBtn" type="button">清理逾時項目</button><button id="reviewCmsUrlSaveBtn" type="button">儲存／修復 CMS 連結</button></div><div class="notion-note" id="reviewAutomationHelp">Notion Operations 會建立「AI Routing · Hourly Review」控制卡；每小時執行前會重新讀取。模型可替換，但資料、Prompt 與安全 Gate 不會替換。</div>
      </section>
    </div>
    <div class="notion-log" id="notionCommandLog">正在讀取 Notion 連線狀態…</div>
  </section>`;
}
function renderNotionCommandCenter(){
  $('#view').innerHTML=swNotionCommandHtml();
  document.getElementById('notionHeroSync')?.addEventListener('click',swNotionSync);
  document.getElementById('notionHeroWeekly')?.addEventListener('click',swNotionWeeklySend);
  document.getElementById('notionHeroArticles')?.addEventListener('click',()=>nav('articles'));
  document.getElementById('notionOpenSettingsBtn')?.addEventListener('click',()=>nav('export'));
  document.getElementById('notionOpenSettingsBtn2')?.addEventListener('click',()=>nav('export'));
  document.getElementById('notionSyncBtn')?.addEventListener('click',swNotionSync);
  document.getElementById('notionControlPlaneSyncBtn')?.addEventListener('click',swNotionControlPlaneSync);
  document.getElementById('notionControlPlaneSeedBtn')?.addEventListener('click',swNotionControlPlaneSeed);
  document.getElementById('notionWeeklySave')?.addEventListener('click',swNotionWeeklySave);
  document.getElementById('notionWeeklySend')?.addEventListener('click',swNotionWeeklySend);
  document.getElementById('reviewInstallBtn')?.addEventListener('click',swReviewAutomationInstall);
  document.getElementById('reviewRunNowBtn')?.addEventListener('click',swReviewAutomationRunNow);
  document.getElementById('reviewOpenInboxBtn')?.addEventListener('click',()=>swReviewInboxMaybeOpen(true));
  document.getElementById('reviewCleanupBtn')?.addEventListener('click',swReviewAutomationCleanup);
  document.getElementById('reviewAiProfileSelect')?.addEventListener('change',swReviewAutomationSaveProfile);
  document.getElementById('reviewReviewerProfileSelect')?.addEventListener('change',swReviewAutomationSaveReviewerProfile);
  ['reviewWriterFallback1','reviewWriterFallback2','reviewReviewerFallback1','reviewReviewerFallback2','reviewFailoverEnabled'].forEach(id=>document.getElementById(id)?.addEventListener('change',swReviewAutomationSaveRouting));
  document.getElementById('reviewRoutingSaveBtn')?.addEventListener('click',swReviewAutomationSaveRouting);
  document.getElementById('reviewRoutingSyncBtn')?.addEventListener('click',swReviewAutomationSyncRouting);
  document.getElementById('reviewCmsUrlSaveBtn')?.addEventListener('click',swReviewAutomationSaveCmsUrl);
  swNotionRefresh(false).catch(err=>swNotionLog('無法讀取 Notion 狀態：'+String(err?.message||err),'bad'));
  swReviewAutomationRefresh().catch(()=>{});
}
function swNotionCollectConfig(){return {
  parentPageId:document.getElementById('notionParentPageId')?.value.trim()||'',
  apiVersion:document.getElementById('notionApiVersion')?.value.trim()||'2022-06-28',
  contentDbId:document.getElementById('notionContentDb')?.value.trim()||'',
  socialDbId:document.getElementById('notionSocialDb')?.value.trim()||'',
  evidenceDbId:document.getElementById('notionEvidenceDb')?.value.trim()||'',
  reportsDbId:document.getElementById('notionReportsDb')?.value.trim()||'',
  operationsDbId:document.getElementById('notionOperationsDb')?.value.trim()||'',
  reviewDbId:document.getElementById('notionReviewDb')?.value.trim()||'',
  complianceDbId:document.getElementById('notionComplianceDb')?.value.trim()||'',
  summaryDbId:document.getElementById('notionSummaryDb')?.value.trim()||'',
  promptDbId:document.getElementById('notionPromptDb')?.value.trim()||'',
  sourceDbId:document.getElementById('notionSourceDb')?.value.trim()||'',
  flagsDbId:document.getElementById('notionFlagsDb')?.value.trim()||'',
  releasesDbId:document.getElementById('notionReleasesDb')?.value.trim()||'',
  aiPerformanceDbId:document.getElementById('notionAiPerformanceDb')?.value.trim()||''
};}
function swNotionApplyStatus(s){
  swNotionState.status=s||{};const dbs=s?.databases||{},count=swNotionDbCount(s),badge=document.getElementById('notionCcBadge'),tokenBadge=document.getElementById('notionTokenBadge'),dbBadge=document.getElementById('notionDbBadge');
  if(badge){badge.classList.toggle('ready',Boolean(s?.accessTokenConfigured));badge.innerHTML=`<i></i>${escapeHTML(s?.accessTokenConfigured?'Notion Connected':'Notion 未連線')}`;}
  const sideNotionDot=document.getElementById('sideNotionDot'),sideNotionState=document.getElementById('sideNotionState'),sideWeeklyDot=document.getElementById('sideWeeklyDot'),sideWeeklyState=document.getElementById('sideWeeklyState');
  if(sideNotionDot)sideNotionDot.classList.toggle('ready',Boolean(s?.accessTokenConfigured));if(sideNotionState)sideNotionState.textContent=s?.accessTokenConfigured?'CONNECTED':'待連線';
  if(sideWeeklyDot)sideWeeklyDot.classList.toggle('ready',Boolean(s?.weekly?.enabled));if(sideWeeklyState)sideWeeklyState.textContent=s?.weekly?.enabled?'ON':'OFF';
  if(tokenBadge){tokenBadge.classList.toggle('ready',Boolean(s?.accessTokenConfigured));tokenBadge.innerHTML=`<i></i>${escapeHTML(s?.accessTokenConfigured?'Token 已保存':'Token 未設定')}`;}
  if(dbBadge){dbBadge.classList.toggle('ready',count===13);dbBadge.innerHTML=`<i></i>${count} / 13`;}
  const ws=document.getElementById('notionKpiWorkspace'),wss=document.getElementById('notionKpiWorkspaceSub');if(ws)ws.textContent=s?.accessTokenConfigured?'CONNECTED':'NOT SET';if(wss)wss.textContent=swNotionStatusLabel(s);
  const kd=document.getElementById('notionKpiDb');if(kd)kd.textContent=count+' / 13';
  const kw=document.getElementById('notionKpiWeekly'),kws=document.getElementById('notionKpiWeeklySub');if(kw)kw.textContent=s?.weekly?.enabled?'ON':'OFF';if(kws)kws.textContent=s?.weekly?.enabled?`週一 ${String(s.weekly.hour??8).padStart(2,'0')}:00 · ${s.weekly.triggerInstalled?'Trigger Ready':'Trigger Missing'}`:'Gmail 主動通知未啟用';
  const ks=document.getElementById('notionKpiSync'),kss=document.getElementById('notionKpiSyncSub');if(ks)ks.textContent=s?.lastSyncAt?swNotionTime(s.lastSyncAt):'—';if(kss)kss.textContent=s?.lastSyncSummary||'尚未同步 CMS → Notion';
  const set=(id,val)=>{const el=document.getElementById(id);if(el&&!el.matches(':focus'))el.value=val||''};set('notionParentPageId',s?.parentPageId||'');set('notionApiVersion',s?.apiVersion||'2022-06-28');set('notionContentDb',dbs.content||'');set('notionSocialDb',dbs.social||'');set('notionEvidenceDb',dbs.evidence||'');set('notionReportsDb',dbs.reports||'');set('notionOperationsDb',dbs.operations||'');set('notionReviewDb',dbs.review||'');set('notionComplianceDb',dbs.compliance||'');set('notionSummaryDb',dbs.summaries||'');set('notionPromptDb',dbs.prompts||'');set('notionSourceDb',dbs.sources||'');set('notionFlagsDb',dbs.flags||'');set('notionReleasesDb',dbs.releases||'');set('notionAiPerformanceDb',dbs.aiPerformance||'');set('notionWeeklyEmail',s?.weekly?.email||'');
  const hour=document.getElementById('notionWeeklyHour');if(hour&&!hour.matches(':focus'))hour.value=String(s?.weekly?.hour??8);const enabled=document.getElementById('notionWeeklyEnabled');if(enabled)enabled.checked=Boolean(s?.weekly?.enabled);const bot=document.getElementById('notionWorkspaceBot');if(bot)bot.value=s?.bot?.workspaceName||s?.bot?.name||(s?.accessTokenConfigured?'Token 已設定；按測試連線':'尚未驗證');
  const tbtn=document.getElementById('notionTokenBtn');if(tbtn)tbtn.textContent=s?.accessTokenConfigured?'更換 Workspace Token':'設定 Workspace Token';const dis=document.getElementById('notionDisconnectBtn');if(dis)dis.disabled=!s?.accessTokenConfigured;
  const cws=document.getElementById('notionConnectionWorkspace');if(cws)cws.textContent=s?.accessTokenConfigured?(s?.bot?.workspaceName||s?.bot?.name||'Notion 已連線'):'尚未連線';
  const cdb=document.getElementById('notionDbStatusText');if(cdb)cdb.textContent=count+' / 13';
  const csync=document.getElementById('notionSyncStatusText');if(csync)csync.textContent=s?.syncReady?'READY':'待完成設定';
  const cp=s?.controlPlane||{},cpc=cp?.counts||{},cpBadge=document.getElementById('notionControlPlaneBadge');if(cpBadge){cpBadge.classList.toggle('ready',Boolean(cp.ready));cpBadge.innerHTML=`<i></i>${escapeHTML(cp.ready?'CONTROL READY':'MAPPING INCOMPLETE')}`;}const cpSet=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val??'—')};cpSet('notionCpPrompts',cpc.prompts??0);cpSet('notionCpSources',cpc.sources??0);cpSet('notionCpFlags',cpc.flags??0);cpSet('notionCpPerf',cpc.queuedAiPerformance??0);cpSet('notionCpLastSync',cp.lastSyncAt?swNotionTime(cp.lastSyncAt):'尚未同步');
  const nss=document.getElementById('notionSettingsSecretState');if(nss){nss.textContent=s?.accessTokenConfigured?'已安全設定':'尚未設定';nss.classList.toggle('ready',Boolean(s?.accessTokenConfigured))}
  const nsh=document.getElementById('notionSettingsHelp');if(nsh)nsh.textContent=s?.accessTokenConfigured?'✓ Notion 憑證已安全保存；技術設定只存在這個頁面。':'請先設定 Integration Token，再填 Parent Page。';
}
async function swNotionRefresh(live=false){const s=await swNotionRequest('admin.notion.status',{live},45000);swNotionApplyStatus(s);swNotionLog(s?.accessTokenConfigured?(live&&s.live===false?'Notion 憑證已保存，但 live test 未通過：'+(s.liveError||'unknown'):'Notion 已連線；技術設定集中在「設定」。'):'Notion 尚未連線，請到「設定」完成整合。',live&&s.live===false?'bad':'ok');return s;}
async function swNotionSaveConfig(throwOnError=false){try{swNotionSetBusy(true);const s=await swNotionRequest('admin.notion.configure',swNotionCollectConfig(),45000);swNotionApplyStatus(s);showToast('Notion Workspace 設定已儲存');swNotionLog('Workspace / Database mapping 已安全保存。','ok');return s}catch(err){showToast('Notion 設定失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad');if(throwOnError)throw err;return null}finally{swNotionSetBusy(false)}}
async function swNotionSetToken(){await openSecretVaultDialog({target:'notion',title:swNotionState.status?.accessTokenConfigured?'更換 Notion Workspace Token':'設定 Notion Workspace Token',secretLabel:'Notion Integration Token',placeholder:'secret_… / ntn_…',onCommit:async({secret,secretAuthToken})=>{const cfg=swNotionCollectConfig();const s=await swNotionRequest('admin.notion.configure',{...cfg,accessToken:secret,secretAuthToken},45000);swNotionApplyStatus(s);showToast('Notion Token 已安全保存於 Apps Script');await swNotionRefresh(true)}})}
async function swNotionTest(){try{swNotionSetBusy(true);await swNotionSaveConfig(true);const r=await swNotionRequest('admin.notion.test',{},45000);showToast('Notion Workspace 連線成功');swNotionLog(`Workspace 連線成功\nBot: ${r.name||'—'}\nWorkspace: ${r.workspaceName||'—'}\nAPI version: ${r.apiVersion||'—'}`,'ok');await swNotionRefresh(true)}catch(err){showToast('Notion 連線失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swNotionDisconnect(){await openSecretVaultDialog({target:'notion',title:'移除 Notion Workspace Token',danger:true,onCommit:async({secretAuthToken})=>{const s=await swNotionRequest('admin.notion.disconnect',{secretAuthToken},35000);swNotionApplyStatus(s);showToast('Notion Token 已移除');swNotionLog('Token 已移除；Database mapping 保留，之後重新設定 Token 可繼續使用。','ok')}})}
async function swNotionBootstrap(){try{swNotionSetBusy(true);await swNotionSaveConfig(true);swNotionLog('正在 Notion Command Center 下建立／補齊 13 個資料庫…');const r=await swNotionRequest('admin.notion.bootstrap',{},120000);swNotionApplyStatus(r.status||{});showToast('Notion v24.1 中控台資料庫已建立／升級');swNotionLog('建立完成：'+Object.keys(r.created||{}).join(' / ')+'\n如果部分資料庫原本就存在，系統會保留原映射。','ok')}catch(err){showToast('建立 Notion 中控台失敗：'+String(err?.message||err));swNotionLog('Bootstrap 失敗：'+String(err?.message||err)+'\n若 Notion API 版本不接受自動建庫，可手動建立後把 Database ID 貼回這頁。','bad')}finally{swNotionSetBusy(false)}}
async function swNotionSync(){try{swNotionSetBusy(true);swNotionLog('正在雙向同步 Content / Evidence 與 v24.1 Control Plane…');const r=await swNotionRequest('admin.notion.sync',{},160000);swNotionApplyStatus(r.status||{});const x=r.summary||{},cp=r.controlPlane?.summary||{};showToast('SIGN WELL ↔ Notion 同步完成');swNotionLog(`同步完成\n文章：${x.articles||0}\nContent 新增 ${x.contentCreated||0} / 更新 ${x.contentUpdated||0}\nSocial Queue 新增 ${x.socialCreated||0}\nEvidence 新增 ${x.evidenceCreated||0} / 更新 ${x.evidenceUpdated||0}\n10 秒摘要 新增 ${x.summaryCreated||0} / 更新 ${x.summaryUpdated||0}\nControl Plane：Prompt ${cp.prompts??0} · Source ${cp.sources??0} · Flags ${cp.flags??0}\nAI Performance flush ${cp.aiPerformanceFlushed??0}`,'ok')}catch(err){showToast('Notion 同步失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swNotionControlPlaneSync(){try{swNotionSetBusy(true);swNotionLog('正在從 Notion 讀取 Prompt / Source / Feature Flags，並回寫 Release / AI Performance…');const r=await swNotionRequest('admin.notion.controlPlane.sync',{source:'cms'},120000);const st=await swNotionRefresh(false);const x=r.summary||{};showToast('Control Plane 已同步');swNotionLog(`Control Plane 同步完成\nPrompt ${x.prompts??0} · Source ${x.sources??0} · Flags ${x.flags??0}\nRelease ${x.releaseWritten?'written':'skipped'} · AI Performance flush ${x.aiPerformanceFlushed??0}`,'ok');return st}catch(err){showToast('Control Plane 同步失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swNotionControlPlaneSeed(){try{swNotionSetBusy(true);const r=await swNotionRequest('admin.notion.controlPlane.seed',{},120000);swNotionApplyStatus(r.status||{});const x=r.seeded||{};showToast('Control Plane 預設 Registry 已補齊');swNotionLog(`Seed 完成\nPrompt ${x.prompts||0} · Source ${x.sources||0} · Flags ${x.flags||0} · Release ${x.releases||0}`,'ok')}catch(err){showToast('Registry seed 失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swNotionWeeklySave(){try{swNotionSetBusy(true);const email=document.getElementById('notionWeeklyEmail')?.value.trim()||'',hour=Number(document.getElementById('notionWeeklyHour')?.value||8),enabled=Boolean(document.getElementById('notionWeeklyEnabled')?.checked);const s=await swNotionRequest('admin.notion.weekly.configure',{email,hour,enabled},45000);swNotionApplyStatus(s);showToast(enabled?'每週一 Gmail 週報已啟用':'Weekly Brief 自動寄送已關閉');swNotionLog(enabled?`已建立 Apps Script Trigger：每週一 ${String(hour).padStart(2,'0')}:00 Asia/Taipei → ${email}`:'已移除 Weekly Brief Trigger。','ok')}catch(err){showToast('週報排程設定失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swNotionWeeklySend(){try{swNotionSetBusy(true);const email=document.getElementById('notionWeeklyEmail')?.value.trim()||'';swNotionLog('正在彙整 Analytics / Newsletter / Meta / Content 並建立 Notion 週報…');const r=await swNotionRequest('admin.notion.weekly.send',{email,writeNotion:true},120000);showToast('測試週報已寄出');swNotionLog(`Weekly Brief 已完成\nGmail: ${r.mail?.sent?'sent':'not sent'} · ${r.mail?.email||email}\nNotion report: ${r.notion?.written?'created':'not created'}\n${r.report?.summary||''}`,'ok')}catch(err){showToast('週報寄送失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}


/* SIGN WELL v23.9.76 · Hourly AI Review Inbox */
const swReviewInboxState={items:[],current:null,busy:false};
function swReviewRequest(action,payload={},timeout=60000){return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey(),timeoutMs:timeout});}
function swReviewRemaining(expiresAt){const ms=new Date(expiresAt).getTime()-Date.now();if(!Number.isFinite(ms)||ms<=0)return '即將到期';const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000);return `${h}h ${m}m 後清除`;}
function swReviewSetBusy(on){swReviewInboxState.busy=Boolean(on);['reviewInboxApprove','reviewInboxReject','reviewInboxLater','reviewInboxClose'].forEach(id=>{const el=document.getElementById(id);if(el)el.disabled=Boolean(on)});}
function swReviewHide(){const o=document.getElementById('reviewInboxOverlay');if(o){o.classList.remove('show');o.setAttribute('aria-hidden','true')}}
function swReviewListRender(){const host=document.getElementById('reviewInboxList');if(!host)return;host.innerHTML=swReviewInboxState.items.map(x=>`<button type="button" class="review-inbox-item ${swReviewInboxState.current?.id===x.id?'active':''}" data-review-id="${escapeHTML(x.id)}"><b>${escapeHTML(x.title||'未命名文章')}</b><span>${escapeHTML(x.category||'健康時事')} · ${Number(x.sourceCount||0)} 家 · ${escapeHTML(swReviewRemaining(x.expiresAt))}</span></button>`).join('')||'<div class="review-inbox-empty">目前沒有待審稿文章。</div>';host.querySelectorAll('[data-review-id]').forEach(b=>b.onclick=()=>swReviewOpen(b.dataset.reviewId));}
function swReviewSecurityHtml(audit){
  audit=audit&&typeof audit==='object'?audit:{};
  if(!audit.promptInjectionDetected)return '';
  const findings=Array.isArray(audit.promptInjectionFindings)?audit.promptInjectionFindings:[];
  const score=Number(audit.promptInjectionScore||0),count=Number(audit.promptInjectionQuarantinedCount||0);
  return `<section style="margin:12px 0;padding:14px 16px;border:1px solid rgba(139,39,39,.28);border-radius:18px;background:rgba(255,238,238,.72);color:#5c2323"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><span style="display:block;font-size:9px;font-weight:800;letter-spacing:.16em;color:#9a4b4b">SIGN WELL · PROMPT INJECTION FIREWALL</span><strong style="display:block;margin-top:4px;font-size:14px">偵測到疑似 Prompt Injection，已隔離</strong></div><em style="font-size:10px;font-style:normal">v${escapeHTML(audit.promptFirewallVersion||'24.0.22')}</em></div><p style="margin:8px 0 0;font-size:11px;line-height:1.6">${count} 段外部內容已在送入 AI 前 quarantine；風險分數 ${score}。${audit.promptInjectionRequiresHuman?'此稿必須人工確認來源原文後再發布。':'系統已隔離可疑控制語句。'}</p>${findings.length?`<details style="margin-top:8px"><summary style="font-size:10px;cursor:pointer">查看偵測來源</summary><div style="margin-top:6px;display:grid;gap:5px">${findings.slice(0,8).map(f=>`<code style="font-size:9px;white-space:normal">${escapeHTML(f.source||'external')} · score ${Number(f.score||0)} · ${escapeHTML((f.signals||[]).join(', '))}</code>`).join('')}</div></details>`:''}</section>`;
}
function swReviewComplianceHtml(c){c=c&&typeof c==='object'?c:null;if(!c||!c.displayAlert)return '';const risk=String(c.riskLevel||'CAUTION'),tone=risk==='HIGH_RISK'?'high':risk==='BLOCK'?'block':'caution',findings=Array.isArray(c.findings)?c.findings:[],sources=Array.isArray(c.sources)?c.sources:[];return `<section class="sw-compliance-review ${tone}"><div class="sw-compliance-head"><div><span>SIGN WELL · LOCAL COMPLIANCE GUARD</span><strong>可能法規風險 ${escapeHTML(risk)}</strong></div><em>本機複核</em></div><p>${escapeHTML(c.summary||'本機審查偵測到可能風險，請人工確認。')}</p>${findings.length?`<div class="sw-compliance-findings">${findings.slice(0,6).map(f=>`<div><b>${escapeHTML(f.issue||'需確認')}</b>${f.quote?`<q>${escapeHTML(f.quote)}</q>`:''}<span>${escapeHTML(f.rationale||'')}</span>${f.sourceRefs?.length?`<small>依據 ${f.sourceRefs.map(escapeHTML).join(' · ')}</small>`:''}${f.suggestedRewrite?`<i>建議：${escapeHTML(f.suggestedRewrite)}</i>`:''}</div>`).join('')}</div>`:''}${sources.length?`<details><summary>查看法規來源</summary>${sources.map(x=>`<span>${escapeHTML(x.id||'')} · ${escapeHTML(x.law||x.name||'法規')}${x.article?' · '+escapeHTML(x.article):''}</span>`).join('')}</details>`:''}</section>`}
function swReviewBodyRender(item){const title=document.getElementById('reviewInboxTitle'),body=document.getElementById('reviewInboxBody');if(title)title.textContent=item?.title||'待審稿';if(!body)return;const a=item?.article||{},sources=Array.isArray(item?.sources)?item.sources:[];const audit=a.audit||{},compliance=a.complianceReview||null,complianceChip=compliance?.displayAlert?`<span class="review-inbox-chip">Compliance ${escapeHTML(compliance?.riskLevel||'CAUTION')}</span>`:'',securityChip=audit.promptInjectionDetected?`<span class="review-inbox-chip" style="border-color:rgba(152,49,49,.35);color:#8a2e2e">Injection quarantined ${Number(audit.promptInjectionQuarantinedCount||0)}</span>`:'';body.innerHTML=`<div class="review-inbox-meta"><span class="review-inbox-chip">${escapeHTML(item?.category||'健康時事')}</span><span class="review-inbox-chip">${Number(item?.sourceCount||0)} 家媒體</span><span class="review-inbox-chip">${escapeHTML(swReviewRemaining(item?.expiresAt))}</span><span class="review-inbox-chip">Evidence Lock ${audit.evidenceLocked?'✓':'—'}</span><span class="review-inbox-chip">Topic fit ${Number(audit.topicFitScore||0)||'—'}</span>${securityChip}${complianceChip}</div>${swReviewSecurityHtml(audit)}${swReviewComplianceHtml(compliance)}<article class="review-inbox-preview">${a.preview||(`<h1>${escapeHTML(a.title||item?.title||'')}</h1>${a.content||''}`)}<div class="review-inbox-sourcebox"><strong style="font-size:9px;color:#6b8190">新聞來源</strong>${sources.map(s=>`<a href="${escapeHTML(s.url||'#')}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.name||'來源')}｜${escapeHTML(s.title||'')}</a>`).join('')}</div></article>`;requestAnimationFrame(()=>{body.scrollTop=0;body.scrollLeft=0;});}
async function swReviewOpen(id){if(!id)return;try{swReviewSetBusy(true);const r=await swReviewRequest('admin.reviewQueue.get',{id},60000);if(!r?.ok||!r.item){showToast(r?.expired?'這份審稿已超過 24 小時並自動清除':'找不到審稿項目');await swReviewInboxRefresh();return}swReviewInboxState.current=r.item;swReviewListRender();swReviewBodyRender(r.item);const o=document.getElementById('reviewInboxOverlay');o?.classList.add('show');o?.setAttribute('aria-hidden','false');}catch(err){showToast('讀取審稿文章失敗：'+String(err?.message||err))}finally{swReviewSetBusy(false)}}
async function swReviewInboxRefresh(preferredId=''){const r=await swReviewRequest('admin.reviewQueue.list',{},45000);swReviewInboxState.items=Array.isArray(r?.items)?r.items:[];swReviewListRender();if(!swReviewInboxState.items.length){swReviewInboxState.current=null;swReviewHide();return false}const id=preferredId&&swReviewInboxState.items.some(x=>x.id===preferredId)?preferredId:swReviewInboxState.items[0].id;await swReviewOpen(id);return true;}
async function swReviewInboxMaybeOpen(force=false){if($('#cms')?.classList.contains('hidden')&&!force)return false;let target='';try{target=new URL(location.href).searchParams.get('review')||''}catch(_){};if(!force&&!target){const r=await swReviewRequest('admin.reviewQueue.list',{},30000);if(!Array.isArray(r?.items)||!r.items.length)return false;swReviewInboxState.items=r.items;await swReviewOpen(r.items[0].id);return true}const opened=await swReviewInboxRefresh(target);if(target){try{const u=new URL(location.href);u.searchParams.delete('review');history.replaceState(null,'',u.pathname+(u.search?'?'+u.searchParams.toString():'')+u.hash)}catch(_){}}return opened;}
async function swReviewResolve(decision){const item=swReviewInboxState.current;if(!item||swReviewInboxState.busy)return;try{swReviewSetBusy(true);await swReviewRequest('admin.reviewQueue.resolve',{id:item.id,decision},45000);showToast(decision==='approved'?'已核准審稿':'已標記不採用');await swReviewInboxRefresh();}catch(err){showToast('審稿更新失敗：'+String(err?.message||err))}finally{swReviewSetBusy(false)}}
async function swReviewApproveToEditor(){const item=swReviewInboxState.current;if(!item||swReviewInboxState.busy)return;const sec=item?.article?.audit||{};if(sec.promptInjectionRequiresHuman&&!window.confirm('這篇來源偵測到疑似 Prompt Injection，系統已隔離可疑字串。請確認你已人工查看新聞來源原文，再送入 CMS 草稿。'))return;try{swReviewSetBusy(true);let article=(data.articles||[]).find(a=>String(a?.sourceWorkspace?.reviewQueueId||'')===String(item.id));if(!article){const payload={...(item.article||{}),topicId:item.article?.topicId||item.id,sources:item.sources||item.article?.sources||[]};article=normalizeGeneratedMedicalArticle(payload);article.sourceWorkspace={...(article.sourceWorkspace||{}),type:'hourly-ai-review',reviewQueueId:item.id,reviewedAt:new Date().toISOString(),sources:item.sources||[]};data.articles.unshift(article);persist(true);syncPublicSnapshot();try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}}await swReviewRequest('admin.reviewQueue.resolve',{id:item.id,decision:'approved'},45000);swReviewHide();viewName='articles';currentId=article.id;$$('.nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view==='articles'));renderView();showToast('已送入 CMS 草稿 · 請完成最後人工審稿');}catch(err){showToast('送入編輯器失敗：'+String(err?.message||err))}finally{swReviewSetBusy(false)}}
function swReviewProfileLabel(id){return id==='gpt'?'GPT':id==='gemini'?'Gemini':'Writer Core'}
function swReviewRoutingPayload(){
  return {
    aiProfile:String(document.getElementById('reviewAiProfileSelect')?.value||'gpt'),
    writerFallbacks:[String(document.getElementById('reviewWriterFallback1')?.value||'gemini'),String(document.getElementById('reviewWriterFallback2')?.value||'writer')],
    reviewerProfile:String(document.getElementById('reviewReviewerProfileSelect')?.value||'gemini'),
    reviewerFallbacks:[String(document.getElementById('reviewReviewerFallback1')?.value||'gpt'),String(document.getElementById('reviewReviewerFallback2')?.value||'writer')],
    failoverEnabled:Boolean(document.getElementById('reviewFailoverEnabled')?.checked)
  };
}
function swReviewSetSelectProfileOptions(el,profiles,current,primaryLabel){
  if(!el)return;
  el.value=String(current||'');
  [...el.options].forEach(o=>{const st=profiles[o.value];const isCurrent=o.value===String(current||'');o.disabled=Boolean(st&&!st.configured&&!isCurrent);o.textContent=(o.value===String(current||'')&&primaryLabel?primaryLabel:swReviewProfileLabel(o.value))+(st?.model?` · ${st.model}`:'')+(st&&!st.configured?' · 未設定':'')});
}
async function swReviewAutomationRefresh(){
  try{
    const s=await swReviewRequest('admin.reviewAutomation.status',{},30000),badge=document.getElementById('reviewAutomationBadge');
    if(badge){badge.classList.toggle('ready',Boolean(s?.triggerInstalled&&s?.enabled));badge.innerHTML=`<i></i>${escapeHTML(s?.triggerInstalled&&s?.enabled?'HOURLY ON':'尚未啟用')}`;}
    const pc=document.getElementById('reviewPendingCount');if(pc)pc.textContent=String(s?.pending??0);
    const lr=document.getElementById('reviewLastRun');if(lr)lr.textContent=s?.lastRunAt?swNotionTime(s.lastRunAt):'尚未執行';
    const cmsUrl=document.getElementById('reviewCmsUrl');if(cmsUrl&&!cmsUrl.matches(':focus'))cmsUrl.value=String(s?.cmsUrl||'');
    const profiles=s?.availableProfiles||{};
    swReviewSetSelectProfileOptions(document.getElementById('reviewAiProfileSelect'),profiles,String(s?.aiProfile||'gpt'),'GPT（Primary）');
    swReviewSetSelectProfileOptions(document.getElementById('reviewReviewerProfileSelect'),profiles,String(s?.reviewerProfile||'gemini'),'Gemini（Primary）');
    const wf=Array.isArray(s?.writerFallbacks)?s.writerFallbacks:['gemini','writer'];
    const rf=Array.isArray(s?.reviewerFallbacks)?s.reviewerFallbacks:['gpt','writer'];
    swReviewSetSelectProfileOptions(document.getElementById('reviewWriterFallback1'),profiles,wf[0]||'gemini','');
    swReviewSetSelectProfileOptions(document.getElementById('reviewWriterFallback2'),profiles,wf[1]||'writer','');
    swReviewSetSelectProfileOptions(document.getElementById('reviewReviewerFallback1'),profiles,rf[0]||'gpt','');
    swReviewSetSelectProfileOptions(document.getElementById('reviewReviewerFallback2'),profiles,rf[1]||'writer','');
    const fe=document.getElementById('reviewFailoverEnabled');if(fe)fe.checked=s?.failoverEnabled!==false;
    const routingState=document.getElementById('reviewRoutingState');if(routingState)routingState.textContent=s?.notionRouting?.lastSyncAt?`已同步 · ${swNotionTime(s.notionRouting.lastSyncAt)}`:(s?.notionRouting?.lastError?'Notion 暫時不可用':'等待同步');
    const link=document.getElementById('reviewRoutingNotionLink');if(link){const u=String(s?.notionRouting?.url||'');link.href=u||'#';link.style.display=u?'inline-flex':'none';}
    const help=document.getElementById('reviewAutomationHelp');
    if(help){
      const w=(s?.writerChain||[s?.aiProfile||'gpt']).map(swReviewProfileLabel).join(' → '),r=(s?.reviewerChain||[s?.reviewerProfile||'gemini']).map(swReviewProfileLabel).join(' → ');
      help.textContent=s?.lastError?'最近一次錯誤：'+s.lastError:`${s?.failoverEnabled===false?'Failover 已關閉。':'Failover ON。'} Writer：${w}；Reviewer：${r}。接手時沿用完全相同 Evidence Pack / Claim Map / Prompt / Schema / Safety Gate。`;
    }
    const btn=document.getElementById('reviewInstallBtn');if(btn)btn.textContent=s?.triggerInstalled&&s?.enabled?'重新建立每小時 Trigger':'啟用每小時流程';
    return s;
  }catch(err){const help=document.getElementById('reviewAutomationHelp');if(help)help.textContent='無法讀取自動化狀態：'+String(err?.message||err);throw err}
}
async function swReviewAutomationSaveRouting(){try{swNotionSetBusy(true);const s=await swReviewRequest('admin.reviewAutomation.configure',swReviewRoutingPayload(),45000);showToast(s?.notionMirror?.written?'AI Routing 已同步到 Notion':'AI Routing 已儲存；Notion 未連線時先使用本機鏡像');await swReviewAutomationRefresh()}catch(err){showToast('AI Routing 儲存失敗：'+String(err?.message||err));await swReviewAutomationRefresh().catch(()=>{})}finally{swNotionSetBusy(false)}}
async function swReviewAutomationSaveProfile(){return swReviewAutomationSaveRouting()}
async function swReviewAutomationSaveReviewerProfile(){return swReviewAutomationSaveRouting()}
async function swReviewAutomationSyncRouting(){try{swNotionSetBusy(true);const r=await swReviewRequest('admin.reviewAutomation.syncRouting',{},45000);if(!r?.ok)throw new Error(r?.error||'Notion AI Routing 無法讀取');showToast('已從 Notion 重新讀取 AI Routing');await swReviewAutomationRefresh()}catch(err){showToast('Notion Routing 同步失敗：'+String(err?.message||err))}finally{swNotionSetBusy(false)}}
async function swReviewAutomationSaveCmsUrl(){const input=document.getElementById('reviewCmsUrl'),cmsUrl=String(input?.value||'').trim();try{swNotionSetBusy(true);const s=await swReviewRequest('admin.reviewAutomation.configure',{cmsUrl,mirrorNotion:false},45000);const m=s?.linkMigration||{};showToast(`CMS 審稿連結已更新 · Queue ${Number(m.updated||0)} · Notion ${Number(m.notionUpdated||0)}`);await swReviewAutomationRefresh()}catch(err){showToast('CMS 審稿網址更新失敗：'+String(err?.message||err))}finally{swNotionSetBusy(false)}}
async function swReviewAutomationInstall(){try{swNotionSetBusy(true);const s=await swReviewRequest('admin.reviewAutomation.install',{},45000);showToast('每小時新聞審稿流程已啟用');await swReviewAutomationRefresh();return s}catch(err){showToast('無法建立每小時 Trigger：'+String(err?.message||err))}finally{swNotionSetBusy(false)}}
async function swReviewAutomationRunNow(){try{swNotionSetBusy(true);swNotionLog('正在執行：Notion Routing → 新聞掃描 → AI Role Failover → 審稿 Queue → Gmail…');const r=await swReviewRequest('admin.reviewAutomation.run',{},320000);if(!r?.ok)throw new Error(r?.error||'自動流程失敗');showToast(`完成 · 新增 ${Number(r.summary?.created||0)} 篇待審稿`);const fe=Array.isArray(r.summary?.failoverEvents)?r.summary.failoverEvents.length:0;swNotionLog(`本次完成\n掃描：${Number(r.summary?.scanned||0)} 則新聞\n符合主題：${Number(r.summary?.qualified||0)}\n新 AI 草稿：${Number(r.summary?.created||0)}\nAI 接手：${fe} 次\nGmail：${r.summary?.mailSent?'已寄出':'未寄出'}\n錯誤：${Number(r.summary?.errors||0)}`,'ok');await swReviewAutomationRefresh();if(Number(r.summary?.created||0)>0)await swReviewInboxMaybeOpen(true);}catch(err){showToast('自動流程失敗：'+String(err?.message||err));swNotionLog(String(err?.message||err),'bad')}finally{swNotionSetBusy(false)}}
async function swReviewAutomationCleanup(){try{swNotionSetBusy(true);const r=await swReviewRequest('admin.reviewAutomation.cleanup',{},45000);showToast(`已清理 ${Number(r?.removed||0)} 個逾時項目`);await swReviewAutomationRefresh();}catch(err){showToast('清理失敗：'+String(err?.message||err))}finally{swNotionSetBusy(false)}}

(function swBindReviewInbox(){const close=()=>swReviewHide();document.getElementById('reviewInboxClose')?.addEventListener('click',close);document.getElementById('reviewInboxLater')?.addEventListener('click',close);document.getElementById('reviewInboxReject')?.addEventListener('click',()=>swReviewResolve('rejected'));document.getElementById('reviewInboxApprove')?.addEventListener('click',swReviewApproveToEditor);document.getElementById('reviewInboxOverlay')?.addEventListener('click',e=>{if(e.target?.id==='reviewInboxOverlay')close()});})();



function swPasskeyTime(ts){
  if(!ts)return '尚未使用';try{return new Date(Number(ts)*1000).toLocaleString('zh-TW')}catch(_){return '—'}
}
async function swInitPasskeySettings(){
  const grid=document.querySelector('.publish-grid');if(!grid)return;
  const card=document.createElement('section');card.className='publish-card passkey-settings-card';card.id='settingsPasskeyCard';
  card.innerHTML=`<div class="passkey-settings-head"><div><h3>Passkey · 生物辨識登入</h3><p>使用 WebAuthn。Face ID、Touch ID、指紋與 Windows Hello 都由裝置作業系統驗證；SIGN WELL 不保存生物特徵。</p></div><span class="passkey-settings-badge" id="passkeySettingsBadge"><i></i>${cmsPasskeyConfigured?'已設定':'未設定'}</span></div><div class="connection-summary"><div class="connection-row"><span>RP ID</span><strong>980510linz.github.io</strong></div><div class="connection-row"><span>Auth Worker</span><code>${escapeHTML(cmsPasskeyAuthUrl||'尚未設定')}</code></div><div class="connection-row"><span>目前 Origin</span><code>${escapeHTML(location.origin)}</code></div></div><div class="publish-actions"><button class="top-action primary" id="passkeyAddBtn" type="button">＋ 新增這台裝置的 Passkey</button><button class="top-action" id="passkeyRefreshBtn" type="button">重新整理</button></div><div class="passkey-device-list" id="passkeyDeviceList"><div class="passkey-empty">正在檢查 Passkey…</div></div><div class="integrity-note"><b>救援登入保留：</b>Passkey 不會刪除原本的管理密碼＋安全問題。若換手機、Passkey 遺失或 Worker 暫時離線，仍能使用傳統登入。</div>`;
  grid.appendChild(card);
  const add=$('#passkeyAddBtn'),refresh=$('#passkeyRefreshBtn');
  if(add)add.onclick=swAddPasskeyFromSettings;if(refresh)refresh.onclick=swLoadPasskeys;
  if(!swPasskeyCanOffer()){
    if(add)add.disabled=true;
    $('#passkeyDeviceList').innerHTML='<div class="passkey-empty">'+(cmsPasskeyConfigured?'Passkey 已在後端設定，但目前網域不符合 RP ID；請從 980510linz.github.io 的 CMS 頁面開啟。':'尚未設定 Passkey Worker。部署 CODE/PASSKEY-AUTH 後再於 Apps Script 設定 SW_PASSKEY_AUTH_URL 與 PASSKEY_BRIDGE_SECRET。')+'</div>';
    return;
  }
  await swLoadPasskeys();
}
async function swLoadPasskeys(){
  const box=$('#passkeyDeviceList');if(!box)return;
  box.innerHTML='<div class="passkey-empty">正在讀取…</div>';
  try{
    const r=await window.SignWellAuth.listPasskeys();const arr=Array.isArray(r?.passkeys)?r.passkeys:[];
    box.innerHTML=arr.length?arr.map(x=>`<div class="passkey-device"><div><strong>${escapeHTML(x.label||'未命名 Passkey')}</strong><small>${escapeHTML(x.device_type||'WebAuthn')} · ${x.backed_up?'已同步/備份':'裝置型'} · 最近使用 ${escapeHTML(swPasskeyTime(x.last_used_at))}</small></div><button type="button" data-passkey-delete="${escapeHTML(x.id)}">刪除</button></div>`).join(''):'<div class="passkey-empty">目前尚未綁定 Passkey。按上方按鈕後，系統會叫出 Face ID / Touch ID / 指紋或 Windows Hello。</div>';
    box.querySelectorAll('[data-passkey-delete]').forEach(btn=>btn.onclick=()=>swDeletePasskeyFromSettings(btn.dataset.passkeyDelete));
  }catch(err){box.innerHTML='<div class="passkey-empty">無法讀取 Passkey：'+escapeHTML(String(err?.message||err))+'。如果已超過近期驗證窗口，請登出後重新登入再管理。</div>'}
}
async function swAddPasskeyFromSettings(){
  const label=prompt('這個 Passkey 要顯示什麼名稱？','我的 iPhone / Mac / Windows 裝置');if(label===null)return;
  try{await window.SignWellAuth.addPasskey(label.trim());showToast('Passkey 已新增');await swLoadPasskeys()}catch(err){showToast('Passkey 新增失敗：'+String(err?.message||err))}
}
async function swDeletePasskeyFromSettings(id){
  if(!confirm('確定刪除這個 Passkey？系統會至少保留一個 Passkey，傳統登入仍可使用。'))return;
  try{await window.SignWellAuth.deletePasskey(id);showToast('Passkey 已刪除');await swLoadPasskeys()}catch(err){showToast('無法刪除：'+String(err?.message||err))}
}

function renderExport(){const pub=data.articles.filter(a=>a.status==='Published'),drafts=data.articles.length-pub.length;$('#view').innerHTML=`<div class="page-head"><div><h1>設定</h1><p>所有 API、OAuth、Token、Endpoint 與第三方整合集中在這裡；其他工作頁只顯示連線狀態。</p></div></div><div class="stats"><div class="stat"><span>已發布</span><strong>${pub.length}</strong></div><div class="stat"><span>草稿</span><strong>${drafts}</strong></div><div class="stat"><span>發布目標</span><strong style="font-size:20px">Backend Runtime</strong></div><div class="stat"><span>憑證位置</span><strong style="font-size:16px">Server-side</strong></div></div><div class="publish-grid"><section class="publish-card" id="settingsGithubCard"><h3>GitHub 設定</h3><p>Fine-grained PAT 只在第一次設定或主動更換時輸入。平常發布、同步與測試都直接使用後端 Secret Vault。</p><div class="connection-summary"><div class="connection-row"><span>系統版本</span><strong>v${String(window.SIGNWELL_RELEASE?.version||'24.8.0-STAGING').replace(/^v/,'')}</strong></div><div class="connection-row"><span>執行環境</span><strong id="runtimeEnv">檢查中…</strong></div><div class="connection-row"><span>公開網站</span><strong>由 Backend Runtime Config 決定</strong></div><div class="connection-row"><span>GitHub 發布目標</span><code id="runtimeGithubTarget">檢查中…</code></div><div class="connection-row"><span>GitHub 憑證</span><strong id="tokenState" class="token-state">檢查中…</strong></div></div><div class="sw-secret-summary github-secret-summary"><div><span>GitHub Fine-grained PAT</span><strong id="ghSecretState">檢查中…</strong><small id="ghSecretMeta">只保存在後端</small></div><button class="top-action" id="ghReplace" type="button">更換 PAT</button></div><div class="security-note"><b>Secret Vault：</b>瀏覽器永遠讀不到既有 PAT；同步與發布由 Apps Script 直接使用後端憑證。</div><div class="publish-actions"><button class="top-action" id="ghTest">測試連線</button><button class="top-action" id="ghSync">從 GitHub 同步</button><button class="top-action danger" id="ghForget">移除後端 PAT</button></div><div class="publish-status" id="ghStatus">正在讀取後端狀態…</div><div class="integrity-note"><b>Origin 提醒：</b>Token 已經不在瀏覽器，但如果 CMS 仍與 Public 共用 <code>980510linz.github.io</code> origin，Public XSS 仍可能在登入期間攻擊 CMS session。完整隔離需把 CMS 部署到另一個 origin。</div></section><aside class="publish-card" id="settingsDataCard"><h3>資料檢查</h3><p>CMS 只輸出已發布文章；草稿不會出現在公開網站。</p><div class="file-map"><div><code>本機文章</code><span class="file-ok">${data.articles.length}</span></div><div><code>已發布</code><span class="file-ok">${pub.length}</span></div><div><code>未公開草稿</code><span>${drafts}</span></div><div><code>公開主題</code><span class="file-ok">${(data.topics||[]).filter(x=>x.active!==false).length}</span></div><div><code>GitHub PAT</code><span class="file-ok">後端保存</span></div><div><code>CMS Session</code><span class="file-ok">登出可作廢</span></div></div></aside></div>`;bindGithubPublisher();signwellGasBridge('admin.github.status',{}, {adminKey:newsletterAdminKey(),timeoutMs:15000}).then(s=>{const el=$('#tokenState'),st=$('#ghStatus');if(el){el.textContent=s?.configured?'後端已設定':'尚未設定';el.classList.toggle('ready',!!s?.configured)}const gs=$('#ghSecretState'),gm=$('#ghSecretMeta'),gr=$('#ghReplace');if(gs){gs.textContent=s?.configured?'已安全設定':'尚未設定';gs.classList.toggle('ready',!!s?.configured)}if(gm)gm.textContent=s?.configured?swFormatSecretUpdatedAt(s?.updatedAt):'尚未存入後端';if(gr)gr.textContent=s?.configured?'更換 PAT':'設定 PAT';if(st)st.textContent=s?.configured?'✓ GitHub PAT 已安全存於後端；發布時不用再輸入。':'請按「設定 PAT」完成第一次安全設定。'}).catch(e=>{$('#ghStatus').textContent='無法讀取 GitHub 狀態：'+String(e?.message||e)});signwellGasBridge('admin.release.status',{}, {adminKey:newsletterAdminKey(),timeoutMs:15000}).then(r=>{const env=$('#runtimeEnv'),gh=$('#runtimeGithubTarget');if(env)env.textContent=String(r?.environment||'unknown')+' · v'+String(r?.release||'24.8.0');if(gh){const g=r?.github||{};if(g.owner&&g.repo&&g.branch){PUBLIC_GITHUB={...PUBLIC_GITHUB,owner:String(g.owner),repo:String(g.repo),branch:String(g.branch),site:String(r?.publicUrl||PUBLIC_GITHUB.site)};githubRuntimeSyncedAt=Date.now()}gh.textContent=[g.owner,g.repo].filter(Boolean).join('/')+' · '+String(g.branch||'')}}).catch(()=>{const env=$('#runtimeEnv');if(env)env.textContent='無法取得'})}
async function saveBlob(blob,name){const file=new File([blob],name,{type:blob.type||'application/octet-stream'});try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:name});return}}catch(e){if(e?.name==='AbortError')return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportJS(){const pub=data.articles.filter(a=>a.status==='Published');const text='window.BLOG_ARTICLES = '+JSON.stringify(pub,null,2)+';\n';saveBlob(new Blob([text],{type:'text/javascript;charset=utf-8'}),'articles.js');showToast(`已準備 ${pub.length} 篇文章`)}
function exportBackup(){saveBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),'signwell-cms-backup.json')}
function importFile(file){const reader=new FileReader();reader.onload=()=>{try{let text=String(reader.result||''),obj;if(file.name.endsWith('.js')){let m=text.match(/window\.BLOG_ARTICLES\s*=\s*([\s\S]*);\s*$/);if(m)obj={...data,articles:JSON.parse(m[1])};else{m=text.match(/window\.SIGNWELL_SITE_TEXT\s*=\s*([\s\S]*);\s*$/);if(!m)throw new Error('JS 格式不正確');obj={...data,siteText:{...DEFAULT_SITE_TEXT,...JSON.parse(m[1])}}}}else obj=JSON.parse(text);if(!obj||!Array.isArray(obj.articles))throw new Error('備份檔格式不正確');data=normalizeState({...obj,people:Array.isArray(obj.people)?obj.people:(data.people||[]),siteText:{...DEFAULT_SITE_TEXT,...(obj.siteText||data.siteText||{})}});persist();syncPublicSnapshot();showToast('匯入完成');nav('articles')}catch(e){showToast('匯入失敗：檔案格式不符')}};reader.readAsText(file)}

function swCommandPalette(open){
  const shell=document.getElementById('cmsCommandPalette'),input=document.getElementById('cmsCommandSearch');if(!shell)return;
  const show=open!==undefined?Boolean(open):!shell.classList.contains('show');shell.classList.toggle('show',show);shell.setAttribute('aria-hidden',show?'false':'true');
  if(show){if(input){input.value='';swCommandFilter('');setTimeout(()=>input.focus({preventScroll:true}),30)}}else input?.blur();
}
function swCommandFilter(q){const term=String(q||'').trim().toLowerCase();document.querySelectorAll('#cmsCommandBody button').forEach(btn=>{btn.hidden=Boolean(term)&&!btn.textContent.toLowerCase().includes(term)});const first=[...document.querySelectorAll('#cmsCommandBody button:not([hidden])')][0];document.querySelectorAll('#cmsCommandBody button').forEach(b=>b.classList.toggle('is-selected',b===first));}
function swInitCommandPalette(){
  const shell=document.getElementById('cmsCommandPalette'),input=document.getElementById('cmsCommandSearch');if(!shell)return;
  document.getElementById('cmsCommandBtn')?.addEventListener('click',()=>swCommandPalette(true));document.getElementById('sideCommandCenter')?.addEventListener('click',()=>nav('commandcenter'));
  shell.addEventListener('click',e=>{if(e.target===shell)swCommandPalette(false)});input?.addEventListener('input',e=>swCommandFilter(e.target.value));
  document.querySelectorAll('[data-command-view]').forEach(b=>b.addEventListener('click',()=>{swCommandPalette(false);nav(b.dataset.commandView)}));
  document.querySelector('[data-command-action="new-article"]')?.addEventListener('click',()=>{swCommandPalette(false);newArticle()});
  input?.addEventListener('keydown',e=>{const items=[...document.querySelectorAll('#cmsCommandBody button:not([hidden])')];if(!items.length)return;let i=Math.max(0,items.findIndex(x=>x.classList.contains('is-selected')));if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();items[i].classList.remove('is-selected');i=(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[i].classList.add('is-selected');items[i].scrollIntoView({block:'nearest'})}else if(e.key==='Enter'){e.preventDefault();items[i].click()}else if(e.key==='Escape'){swCommandPalette(false)}});
}
swBindCmsInputPolicies();swInitCommandPalette();$('#passkeyLoginBtn').onclick=swPasskeyLogin;$('#passkeyUseLegacyBtn').onclick=()=>swShowLegacyLogin('已切換為管理密碼＋安全問題登入。');$('#unlockBtn').onclick=unlock;$('#verifyBtn').onclick=verifySecond;$('#authBackBtn').onclick=()=>setAuthStage(1);$('#authSetupBtn').onclick=configureCmsServerAuth;$('#pinInput').addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});$('#answerInput').addEventListener('keydown',e=>{if(e.key==='Enter')verifySecond()});['authBootstrapKey','authSetupPassword','authSetupQuestion1','authSetupAnswer1'].forEach(id=>$('#'+id)?.addEventListener('keydown',e=>{if(e.key==='Enter')configureCmsServerAuth()}));$$('.nav [data-view]').forEach(b=>b.onclick=()=>nav(b.dataset.view));$('#backupBtn').onclick=exportBackup;$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};$('#lockBtn').onclick=lock;$('#saveBtn').onclick=saveNow;$('#publishBtn').onclick=null;$('#onlineBtn').onclick=publishOnlineFromEditor;$('#previewBtn').onclick=preview;$('#previewClose').onclick=()=>$('#previewOverlay').classList.remove('show');$('#previewOverlay').onclick=e=>{if(e.target===$('#previewOverlay'))$('#previewOverlay').classList.remove('show')};$('#cancelDelete').onclick=()=>$('#confirmModal').classList.remove('show');$('#confirmDelete').onclick=async()=>{await deleteArticleEverywhere(deleteId)};document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'&&!$('#cms').classList.contains('hidden')){e.preventDefault();swCommandPalette();return;}
  if(e.key==='Escape'){if(document.getElementById('cmsCommandPalette')?.classList.contains('show')){swCommandPalette(false);return;}
    $('#previewOverlay').classList.remove('show');
    $('#confirmModal').classList.remove('show');
    toggleFormatPopover(false);
  }
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='n'&&!$('#cms').classList.contains('hidden')){
    e.preventDefault();
    newArticle();
  }
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'&&currentId){
    e.preventDefault();
    saveNow();
  }
});
let cmsLastActivityWrite=0;
function markCmsActivity(){
  if($('#cms').classList.contains('hidden'))return;
  const now=Date.now();
  if(now-cmsLastActivityWrite<5000)return;
  cmsLastActivityWrite=now;
  try{localStorage.setItem(ACTKEY,String(now))}catch(_){}
}
['pointerdown','keydown','touchstart'].forEach(ev=>
  document.addEventListener(ev,markCmsActivity,{passive:true})
);
setInterval(()=>{if(!document.hidden)checkAutoLock()},60000);
window.addEventListener('pagehide',()=>{
  if(cmsCloudDirty&&!cmsCloudBusy){
    cmsCloudPushNow(cmsCloudChangeSeq);
  }
});
function optimize(){
  const mem=Number(navigator.deviceMemory||8);
  const cores=Number(navigator.hardwareConcurrency||8);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const coarse=matchMedia('(pointer:coarse)').matches;
  const narrow=matchMedia('(max-width:900px)').matches;
  const isiOS=/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

  const lite=reduced||mem<4||cores<=4;
  const balanced=!lite&&(coarse||narrow||isiOS);

  document.body.classList.toggle('lite',lite);
  document.body.classList.toggle('perf-lite',lite);
  document.body.classList.toggle('perf-balanced',balanced);
  document.body.classList.toggle('perf-high',!lite&&!balanced);

  if(window.__cmsVisibilityGovernorBound)return;
  window.__cmsVisibilityGovernorBound=true;

  const syncVisibility=()=>{
    const hidden=document.hidden;
    document.body.classList.toggle('visual-paused',hidden);

    /* Stop interval wake-ups entirely while backgrounded instead of merely
       returning early inside each interval callback. */
    if(hidden){
      stopAnalyticsLivePolling();
      stopCmsCloudPolling();
      clearTimeout(newsletterPreviewTimer);
      newsletterPreviewTimer=null;
      return;
    }

    if(!$('#cms')?.classList.contains('hidden')){
      startAnalyticsLivePolling();
      if(cmsCloudEnabled())startCmsCloudPolling();

      if(viewName==='dashboard'||viewName==='articles'){
        refreshRemoteAnalytics(false);
      }
      if(viewName==='newsletter'){
        scheduleNewsletterExactPreview();
      }
    }
  };

  document.addEventListener('visibilitychange',syncVisibility,{passive:true});
}


let PUBLIC_GITHUB={owner:'980510linz',repo:'-',branch:'main',path:'articles.js',sitePath:'site-content.js',site:'https://signwell.com.tw/'};const TOKEN_STORE_KEY='signwell-github-token-v2',SYNC_KEY='signwell-github-synced-v2';let githubToken='server-managed',githubRuntimeSyncedAt=0,githubLastDiagnosis=null;
/* SIGN WELL v24.8.0 · Article Identity CMS integration */
const swArticleIdentityState={lastPrepare:null,migrationDone:false};
function swArticleIdentityReadPublishOptions(){return {changeClass:'AUTO',reviewType:''};}
function swArticleIdentityApply(article,identity){
  if(!article||!identity)return article;
  article.article_uuid=String(identity.article_uuid||article.article_uuid||'');
  article.article_id=String(identity.article_id||article.article_id||'');
  article.current_version=String(identity.current_version||article.current_version||'1.0');
  article.revision_seq=Number(identity.revision_seq||article.revision_seq||1);
  article.article_status=String(identity.article_status||article.article_status||'');
  article.review_status=Array.isArray(identity.review_status)?identity.review_status.slice():[];
  article.ai_involvement=identity.ai_involvement&&typeof identity.ai_involvement==='object'?clone(identity.ai_involvement):{};
  article.content_hash=String(identity.content_hash||article.content_hash||'');
  article.hash_schema=String(identity.hash_schema||article.hash_schema||'sw-content-v1');
  article.trace_url=String(identity.trace_url||article.trace_url||'');
  article.share_card_url=String(identity.share_card_url||article.share_card_url||'');
  article.last_verified_at=String(identity.last_verified_at||article.last_verified_at||'');
  article.internal_references=Number(identity.internal_references||article.internal_references||0);
  article.referenced_by=Number(identity.referenced_by||article.referenced_by||0);
  article.referenced_by_items=Array.isArray(identity.referenced_by_items)?clone(identity.referenced_by_items):(Array.isArray(article.referenced_by_items)?article.referenced_by_items:[]);
  article.identity=clone(identity);
  return article;
}
function swArticleIdentityApplyMigrationResult(result){
  const map=new Map((result?.items||[]).map(x=>[String(x.legacyId||''),x.identity||null]));
  let changed=false;
  (data.articles||[]).forEach(a=>{const identity=map.get(String(a.id||''));if(identity){swArticleIdentityApply(a,identity);changed=true}});
  if(changed)persist(true);
  swArticleIdentityState.migrationDone=true;
  return result;
}
async function swArticleIdentityEnsureMigration(excludeLegacyId=''){
  if(swArticleIdentityState.migrationDone)return null;
  excludeLegacyId=String(excludeLegacyId||'');
  const published=(data.articles||[]).filter(a=>a.status==='Published'&&String(a.id||'')!==excludeLegacyId);
  if(!published.length){swArticleIdentityState.migrationDone=true;return null;}
  const r=await signwellGasBridge('admin.articleIdentity.migrate',{articles:published,excludeLegacyIds:excludeLegacyId?[excludeLegacyId]:[]},{adminKey:newsletterAdminKey(),timeoutMs:120000});
  swArticleIdentityApplyMigrationResult(r||{});
  return r;
}
async function swArticleIdentityPrepareForPublish(article){
  if(!article)throw new Error('找不到待發布文章');
  const options=swArticleIdentityReadPublishOptions();
  const r=await signwellGasBridge('admin.articleIdentity.prepare',{article:article,changeClass:options.changeClass},{adminKey:newsletterAdminKey(),timeoutMs:60000});
  if(!r?.identity?.article_id)throw new Error('Article Identity Backend 沒有核發 Article ID');
  swArticleIdentityApply(article,r.identity);
  swArticleIdentityState.lastPrepare={legacyId:String(article.id||''),changeClass:String(r.changeClass||''),identity:clone(r.identity)};
  if(options.reviewType){
    const rr=await signwellGasBridge('admin.articleIdentity.review',{articleId:article.article_id,version:article.current_version,revisionSeq:Number(article.revision_seq||0),reviewType:options.reviewType,reviewerId:String(article.publisherId||'cms-admin'),reviewerName:String(article.publisherName||'SIGN WELL Editor')},{adminKey:newsletterAdminKey(),timeoutMs:45000});
    if(rr?.identity)swArticleIdentityApply(article,rr.identity);
  }
  persist(true);
  return r;
}
async function swArticleIdentityVerifyRemote(article,token){
  if(!article?.article_id||!article?.content_hash)return {ok:false,skipped:true};
  const slug=v10SafeSlug(article),remote=await v10FetchArticleRaw(`articles/${slug}.json`);
  if(String(remote?.article_id||'')!==String(article.article_id))throw new Error('Article ID remote verification failed');
  if(String(remote?.content_hash||'')!==String(article.content_hash))throw new Error('Article content hash remote verification failed');
  return {ok:true,articleId:article.article_id,contentHash:article.content_hash};
}
async function swArticleIdentityCommitAfterPublish(article){
  if(!article?.article_id)return null;
  const r=await signwellGasBridge('admin.articleIdentity.commit',{articleId:article.article_id,contentHash:article.content_hash},{adminKey:newsletterAdminKey(),timeoutMs:60000});
  if(!r?.identity)throw new Error('Article Identity commit 未完成');
  swArticleIdentityApply(article,r.identity);
  const canonical=(data.articles||[]).find(x=>String(x.id||'')===String(article.id||''));
  if(canonical&&canonical!==article)swArticleIdentityApply(canonical,r.identity);
  persist(true);
  return r.identity;
}
/* SIGN WELL v24.8.0 · Article Identity Phase 3-1 · Internal Citation Core */
const swCitationUiState={query:'',loading:false,results:[]};
function swCitationDraftList(article){
  const raw=[];(Array.isArray(article?.internalReferences)?article.internalReferences:[]).forEach(x=>raw.push(x));
  (Array.isArray(article?.internal_references)?article.internal_references:[]).forEach(x=>raw.push(x));
  const seen=new Set(),out=[];raw.forEach(x=>{const v=typeof x==='string'?{articleId:x}:x||{},id=String(v.articleId||v.article_id||v.target_id||'').trim();if(!id||seen.has(id))return;seen.add(id);out.push({articleId:id,targetVersion:String(v.targetVersion||v.target_version||''),context:String(v.context||v.citation_context||'')})});return out;
}
function swCitationSetDraftList(article,list){article.internalReferences=list.map(x=>({articleId:String(x.articleId||''),targetVersion:String(x.targetVersion||''),context:String(x.context||'').slice(0,500)}));delete article.internal_references;article.updatedAt=new Date().toISOString();persist(true)}
function swCitationEscape(v){return typeof escapeHTML==='function'?escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function swCitationStatusText(x){const rs=Array.isArray(x?.review_status)?x.review_status:[];return [String(x?.article_status||''),String(x?.version?('v'+x.version):''),rs.join(' · '),Number(x?.primary_evidence_count||0)+' primary evidence'].filter(Boolean).join(' · ')}
function swCitationPanelHtml(article){
  const refs=swCitationDraftList(article);return `<section class="sw-citation-panel" id="swCitationPanel"><div class="sw-citation-head"><div><span>ARTICLE CITATION GRAPH</span><h3>站內引用</h3></div><b>${refs.length}</b></div><p class="sw-citation-note">這裡只編輯下一個待發布版本。新增／刪除後不會直接改動目前公開 Citation Graph；正式發布時 Backend 會重新驗證 target version、primary evidence 與 circular dependency。</p><div class="sw-citation-current">${refs.length?refs.map((r,i)=>`<article class="sw-citation-row" data-citation-index="${i}"><div><strong>${swCitationEscape(r.articleId)}</strong><small>${r.targetVersion?'目標版本 '+swCitationEscape(r.targetVersion):'發布時鎖定目前版本'}</small></div><textarea data-citation-context="${i}" maxlength="500" rows="2" placeholder="引用脈絡（例如：延伸閱讀其基礎機轉整理）">${swCitationEscape(r.context)}</textarea><button type="button" data-citation-remove="${i}">移除</button></article>`).join(''):'<div class="sw-citation-empty">此草稿尚未加入 SIGN WELL 站內引用。</div>'}</div><div class="sw-citation-search"><input id="swCitationQuery" type="search" placeholder="搜尋 Article ID、標題或作者" value="${swCitationEscape(swCitationUiState.query)}"><button type="button" id="swCitationSearchBtn">搜尋可引用文章</button></div><div id="swCitationResults" class="sw-citation-results">${swCitationUiState.loading?'<div class="sw-citation-empty">正在檢查 canonical registry…</div>':swCitationResultsHtml(article)}</div></section>`;
}
function swCitationResultsHtml(article){
  if(!swCitationUiState.results.length)return swCitationUiState.query?'<div class="sw-citation-empty">沒有符合且可安全引用的文章。</div>':'';
  const existing=new Set(swCitationDraftList(article).map(x=>x.articleId));return swCitationUiState.results.map(x=>`<article class="sw-citation-candidate"><div><span>${swCitationEscape(x.article_id)}</span><strong>${swCitationEscape(x.title||'未命名文章')}</strong><small>${swCitationEscape(swCitationStatusText(x))}</small></div><button type="button" data-citation-add="${swCitationEscape(x.article_id)}" ${existing.has(String(x.article_id))?'disabled':''}>${existing.has(String(x.article_id))?'已加入':'加入引用'}</button></article>`).join('')
}
function swCitationInjectPanel(){const article=typeof getCurrent==='function'?getCurrent():null,side=document.querySelector('.editor-side');if(!article||!side)return;document.getElementById('swCitationPanel')?.remove();const wrap=document.createElement('div');wrap.innerHTML=swCitationPanelHtml(article);const panel=wrap.firstElementChild;side.insertBefore(panel,side.lastElementChild);swCitationBindPanel(article)}
function swCitationBindPanel(article){
  document.getElementById('swCitationSearchBtn')?.addEventListener('click',()=>swCitationSearch(article));document.getElementById('swCitationQuery')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();swCitationSearch(article)}});
  document.querySelectorAll('[data-citation-remove]').forEach(btn=>btn.addEventListener('click',()=>{const list=swCitationDraftList(article),i=Number(btn.dataset.citationRemove);if(Number.isFinite(i)){list.splice(i,1);swCitationSetDraftList(article,list);swCitationInjectPanel();showToast('已從草稿移除站內引用；重新發布後才會更新 Citation Graph')}}));
  document.querySelectorAll('[data-citation-context]').forEach(el=>el.addEventListener('change',()=>{const list=swCitationDraftList(article),i=Number(el.dataset.citationContext);if(list[i]){list[i].context=String(el.value||'').slice(0,500);swCitationSetDraftList(article,list)}}));
  document.querySelectorAll('[data-citation-add]').forEach(btn=>btn.addEventListener('click',()=>swCitationAdd(article,String(btn.dataset.citationAdd||''),btn)));
}
async function swCitationSearch(article){
  const q=String(document.getElementById('swCitationQuery')?.value||'').trim();swCitationUiState.query=q;swCitationUiState.loading=true;swCitationInjectPanel();try{const r=await signwellGasBridge('admin.articleCitation.candidates',{sourceArticleId:String(article.article_id||''),query:q,limit:20},{adminKey:newsletterAdminKey(),timeoutMs:30000});swCitationUiState.results=Array.isArray(r?.items)?r.items:[]}catch(err){swCitationUiState.results=[];showToast('站內引用搜尋失敗：'+String(err?.message||err))}finally{swCitationUiState.loading=false;swCitationInjectPanel()}}
async function swCitationAdd(article,targetId,btn){
  if(!targetId)return;btn&&(btn.disabled=true);try{const r=await signwellGasBridge('admin.articleCitation.validate',{sourceArticleId:String(article.article_id||''),targetArticleId:targetId},{adminKey:newsletterAdminKey(),timeoutMs:30000});const t=r?.target;if(!t?.article_id)throw new Error('Citation target validation failed');const list=swCitationDraftList(article);if(!list.some(x=>x.articleId===t.article_id)){list.push({articleId:t.article_id,targetVersion:t.version,context:''});swCitationSetDraftList(article,list)}showToast('已加入草稿引用；正式發布時會再次驗證');swCitationInjectPanel()}catch(err){showToast('無法加入站內引用：'+String(err?.message||err));btn&&(btn.disabled=false)}}
if(typeof renderEditor==='function'){const swCitationOriginalRenderEditor=renderEditor;renderEditor=function(){swCitationOriginalRenderEditor.apply(this,arguments);setTimeout(swCitationInjectPanel,0)}}
/* v23.3: remove any legacy browser-stored PAT ciphertext. */
try{localStorage.removeItem(TOKEN_STORE_KEY)}catch(_){}
function hasRememberedGithubToken(){return true}
function bytesToB64(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s)}
function b64ToBytes(s){const bin=atob(s),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
async function rememberGithubToken(){return true}
async function restoreRememberedGithubToken(){githubToken='server-managed';return true}
async function forgetGithubToken(secretAuthToken){try{localStorage.removeItem(TOKEN_STORE_KEY)}catch(_){};await signwellGasBridge('admin.github.clear',{secretAuthToken:String(secretAuthToken||'')}, {adminKey:newsletterAdminKey(),timeoutMs:20000});githubToken='server-managed';showToast('後端 GitHub Token 已移除')}
function publishedJSText(){const pub=data.articles.filter(a=>a.status==='Published');return 'window.BLOG_ARTICLES = '+JSON.stringify(pub,null,2)+';\n'}
function siteContentJSText(){return 'window.SIGNWELL_SITE_TEXT = '+JSON.stringify({...DEFAULT_SITE_TEXT,...(data.siteText||{})},null,2)+';\n'}
function parseSiteContentJS(text){const m=String(text||'').match(/window\.SIGNWELL_SITE_TEXT\s*=\s*([\s\S]*);\s*$/);if(!m)throw new Error('遠端 site-content.js 格式不符');const obj=JSON.parse(m[1]);if(!obj||typeof obj!=='object'||Array.isArray(obj))throw new Error('遠端網站文字不是物件');return {...DEFAULT_SITE_TEXT,...obj}}
function utf8Base64(text){const bytes=new TextEncoder().encode(text);let bin='';const step=0x8000;for(let i=0;i<bytes.length;i+=step)bin+=String.fromCharCode(...bytes.subarray(i,i+step));return btoa(bin)}
function base64Utf8(text){const bytes=b64ToBytes(String(text||'').replace(/\s/g,''));return new TextDecoder().decode(bytes)}
function parseArticlesJS(text){const m=String(text||'').match(/window\.BLOG_ARTICLES\s*=\s*([\s\S]*);\s*$/);if(!m)throw new Error('遠端 articles.js 格式不符');const arr=JSON.parse(m[1]);if(!Array.isArray(arr))throw new Error('遠端文章資料不是陣列');return arr}
async function ensureGithubRuntimeTarget(force=false){
  if(!force&&githubRuntimeSyncedAt&&Date.now()-githubRuntimeSyncedAt<60000)return PUBLIC_GITHUB;
  const r=await signwellGasBridge('admin.release.status',{}, {adminKey:newsletterAdminKey(),timeoutMs:20000});
  const g=r?.github||{};
  if(!g.owner||!g.repo||!g.branch)throw new Error('Backend GitHub target 未完整設定');
  PUBLIC_GITHUB={...PUBLIC_GITHUB,owner:String(g.owner),repo:String(g.repo),branch:String(g.branch),site:String(r?.publicUrl||PUBLIC_GITHUB.site)};
  githubRuntimeSyncedAt=Date.now();
  return PUBLIC_GITHUB;
}
function remapGithubApiUrlToRuntime(url){
  try{
    const u=new URL(String(url||''));
    if(u.hostname!=='api.github.com')return String(url||'');
    const m=u.pathname.match(/^\/repos\/[^/]+\/[^/]+(.*)$/);
    if(!m)return String(url||'');
    let suffix=m[1]||'';
    suffix=suffix.replace(/^\/git\/ref\/heads\/[^/]+/, '/git/ref/heads/'+encodeURIComponent(PUBLIC_GITHUB.branch));
    suffix=suffix.replace(/^\/git\/refs\/heads\/[^/]+/, '/git/refs/heads/'+encodeURIComponent(PUBLIC_GITHUB.branch));
    u.pathname='/repos/'+encodeURIComponent(PUBLIC_GITHUB.owner)+'/'+encodeURIComponent(PUBLIC_GITHUB.repo)+suffix;
    if(u.searchParams.has('ref'))u.searchParams.set('ref',PUBLIC_GITHUB.branch);
    return u.toString();
  }catch(_){return String(url||'')}
}
function normalizeGithubBridgeError(err){
  const raw=String(err?.message||err||'GitHub request failed');
  const m=raw.match(/GITHUB_HTTP_(\d{3})\s*:\s*([\s\S]*)/);
  const e=new Error(m?m[2]:raw);
  if(m)e.status=Number(m[1]);else if(Number(err?.status))e.status=Number(err.status);
  e.rawMessage=raw;
  return e;
}
async function githubRequest(url,_token,options={}){
  await ensureGithubRuntimeTarget(false);
  const method=String(options.method||'GET').toUpperCase();
  let body=options.body;if(typeof body==='string'){try{body=JSON.parse(body)}catch(_){}}
  if(body&&typeof body==='object'&&!Array.isArray(body)&&Object.prototype.hasOwnProperty.call(body,'branch'))body={...body,branch:PUBLIC_GITHUB.branch};
  const target=remapGithubApiUrlToRuntime(url);
  try{return await signwellGasBridge('admin.github.request',{url:target,method,body},{adminKey:newsletterAdminKey(),timeoutMs:90000})}
  catch(err){throw normalizeGithubBridgeError(err)}
}
function githubContentURL(path=PUBLIC_GITHUB.path){const c=PUBLIC_GITHUB;return `https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${String(path).split('/').map(encodeURIComponent).join('/')}`}
function currentTokenInput(){return 'server-managed'}
async function fetchRemoteArticles(token){const file=await githubRequest(githubContentURL()+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch),token);const text=base64Utf8(file.content||'');return {articles:sanitizeRemoteArticles(parseArticlesJS(text)),sha:file.sha||null}}
async function fetchRemoteSiteText(token){try{const file=await githubRequest(githubContentURL(PUBLIC_GITHUB.sitePath)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch),token);const text=base64Utf8(file.content||'');return {siteText:parseSiteContentJS(text),sha:file.sha||null}}catch(e){if(/Not Found|404/i.test(e.message))return {siteText:clone(DEFAULT_SITE_TEXT),sha:null};throw e}}
async function maybeRememberToken(){return true}
function sanitizeRemoteHtml(html=''){const doc=new DOMParser().parseFromString('<div id="swroot">'+String(html||'')+'</div>','text/html'),root=doc.getElementById('swroot');root.querySelectorAll('script,iframe,object,embed,link,meta,base,form').forEach(n=>n.remove());root.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=String(a.value||'');if(n.startsWith('on')||n==='srcdoc'||((n==='href'||n==='src'||n==='xlink:href')&&/^\s*javascript:/i.test(v)))el.removeAttribute(a.name)})});return root.innerHTML}
function sanitizeRemoteArticles(arr){return (Array.isArray(arr)?arr:[]).map(a=>{const x=clone(a||{});if(String(x.contentFormat||'').toLowerCase()==='html')x.content=sanitizeRemoteHtml(x.content||'');return x})}
async function testGithubConnection(){
  const status=$('#ghStatus');status.textContent='正在檢查 Repo、Branch 與實際寫入權限…';
  try{
    await ensureGithubRuntimeTarget(true);
    const d=await signwellGasBridge('admin.github.diagnose',{writeProbe:true},{adminKey:newsletterAdminKey(),timeoutMs:35000});
    if(!d?.ok||d?.writable!==true)throw new Error(d?.error||'PAT 無法寫入；Fine-grained PAT 需要 Contents: Read and write');
    githubLastDiagnosis={...d,checkedAt:Date.now()};githubToken='server-managed';
    let count='?';try{const remote=await v10LoadRemoteArticles('server-managed');count=remote.articles.length}catch(e){if(Number(e?.status)!==404)throw e;count=0}
    status.textContent=`✓ 可讀寫：${d.fullName||`${PUBLIC_GITHUB.owner}/${PUBLIC_GITHUB.repo}`} · ${PUBLIC_GITHUB.branch} · 遠端 ${count} 篇文章 · 寫入權限已實測`;
    $('#tokenState')?.classList.add('ready');if($('#tokenState'))$('#tokenState').textContent='後端已設定 · 可讀寫';return true;
  }catch(e){status.textContent='GitHub 檢查失敗：'+String(e?.message||e);$('#tokenState')?.classList.remove('ready');return false}
}
async function ensureGithubWritable(force=false){
  await ensureGithubRuntimeTarget(force);
  if(!force&&githubLastDiagnosis?.writable===true&&Date.now()-Number(githubLastDiagnosis.checkedAt||0)<10*60*1000)return githubLastDiagnosis;
  const d=await signwellGasBridge('admin.github.diagnose',{writeProbe:true},{adminKey:newsletterAdminKey(),timeoutMs:35000});
  if(!d?.ok||d?.writable!==true)throw new Error('GitHub 自動發布不可寫入：'+String(d?.error||'Fine-grained PAT 需要 Contents: Read and write'));
  githubLastDiagnosis={...d,checkedAt:Date.now()};
  return githubLastDiagnosis;
}

async function syncFromGitHub(){const status=$('#ghStatus'),token=currentTokenInput();if(!token){status.textContent='請先到「設定」完成 GitHub PAT 設定。';return}githubToken=token;status.textContent='正在讀取公開站 articles.js…';try{const remote=await fetchRemoteArticles(token),remoteSite=await fetchRemoteSiteText(token),localDrafts=data.articles.filter(a=>a.status!=='Published'),draftIds=new Set(localDrafts.map(a=>a.id)),merged=[...localDrafts,...clone(remote.articles).filter(a=>!draftIds.has(a.id))];if(data.articles.length&&!(await swConfirm(`將同步 GitHub 上的 ${remote.articles.length} 篇公開文章。\n目前 ${localDrafts.length} 篇本機草稿會保留。`,{title:'從 GitHub 同步？',kicker:'GITHUB SYNC',confirmText:'開始同步'}))){status.textContent='已取消同步。';return}data={...data,articles:merged,people:data.people||[],siteText:{...DEFAULT_SITE_TEXT,...remoteSite.siteText}};persist(true);syncPublicSnapshot();localStorage.setItem(SYNC_KEY,'1');await maybeRememberToken(token);status.textContent=`✓ 已同步遠端 ${remote.articles.length} 篇文章與網站文字；保留本機草稿 ${localDrafts.length} 篇。`;showToast('GitHub 同步完成');renderExport()}catch(e){status.textContent='同步失敗：'+e.message;swShowOperationalError?.(e,{module:'github-sync',action:'syncFromGitHub'})}}
async function publishGitHub(){const status=$('#ghStatus'),token=currentTokenInput();if(!token){if(status)status.textContent='請先到「設定」完成 GitHub PAT 設定。';return false}githubToken=token;if(status)status.textContent='正在核對遠端文章與網站文字…';let remoteArticles=[],articleSha=null,siteSha=null;try{const existing=await fetchRemoteArticles(token);articleSha=existing.sha;remoteArticles=existing.articles}catch(e){if(!/Not Found|404/i.test(e.message))throw e}try{const rs=await fetchRemoteSiteText(token);siteSha=rs.sha}catch(e){if(!/Not Found|404/i.test(e.message))throw e}
  const alreadySynced=localStorage.getItem(SYNC_KEY)==='1',localIds=new Set(data.articles.map(a=>a.id)),missing=remoteArticles.filter(a=>!localIds.has(a.id));if(!alreadySynced&&missing.length){throw new Error(`安全阻擋：公開站有 ${missing.length} 篇文章不在這台裝置。請先按「從 GitHub 同步」，避免覆蓋遺失。`)}
  if(status)status.textContent='正在提交文章資料…';const articlePayload={message:'Publish SIGN WELL articles '+new Date().toISOString().slice(0,19).replace('T',' '),content:utf8Base64(publishedJSText()),branch:PUBLIC_GITHUB.branch};if(articleSha)articlePayload.sha=articleSha;await githubRequest(githubContentURL(PUBLIC_GITHUB.path),token,{method:'PUT',body:JSON.stringify(articlePayload)});
  if(status)status.textContent='正在提交網站文字…';const sitePayload={message:'Update SIGN WELL site text '+new Date().toISOString().slice(0,19).replace('T',' '),content:utf8Base64(siteContentJSText()),branch:PUBLIC_GITHUB.branch};if(siteSha)sitePayload.sha=siteSha;await githubRequest(githubContentURL(PUBLIC_GITHUB.sitePath),token,{method:'PUT',body:JSON.stringify(sitePayload)});
  localStorage.setItem(SYNC_KEY,'1');await maybeRememberToken(token);if(status)status.textContent='✓ 文章與網站文字已提交到 GitHub。GitHub Pages 會在短時間內更新。';showToast('已發布到 SIGN WELL');return true}
function bindGithubPublisher(){const status=$('#ghStatus');$('#exportSiteJs')?.addEventListener('click',()=>saveBlob(new Blob([siteContentJSText()],{type:'text/javascript;charset=utf-8'}),'site-content.js'));$('#ghPublish')?.addEventListener('click',async()=>{try{await publishGitHub()}catch(e){if(status)status.textContent='發布失敗：'+e.message;showToast('GitHub 發布失敗');swShowOperationalError?.(e,{module:'github-publish',action:'publishGitHub'})}});$('#ghTest')?.addEventListener('click',testGithubConnection);$('#ghSync')?.addEventListener('click',syncFromGitHub);$('#ghReplace')?.addEventListener('click',async()=>{await openSecretVaultDialog({target:'github',title:$('#ghSecretState')?.textContent==='已安全設定'?'更換 GitHub PAT':'設定 GitHub PAT',secretLabel:'新的 Fine-grained PAT',placeholder:'github_pat_…',onCommit:async({secret,secretAuthToken})=>{const r=await signwellGasBridge('admin.github.configure',{token:secret,secretAuthToken},{adminKey:newsletterAdminKey(),timeoutMs:35000});if(!r?.ok)throw new Error('GitHub PAT 設定失敗');const s=r.status||{};if(r?.diagnosis?.writable===true)githubLastDiagnosis={...r.diagnosis,checkedAt:Date.now()};if($('#tokenState')){$('#tokenState').textContent=r?.diagnosis?.writable===true?'後端已設定 · 可讀寫':'後端已設定';$('#tokenState').classList.add('ready')}if($('#ghSecretState')){$('#ghSecretState').textContent='已安全設定';$('#ghSecretState').classList.add('ready')}if($('#ghSecretMeta'))$('#ghSecretMeta').textContent=swFormatSecretUpdatedAt(s.updatedAt);if($('#ghReplace'))$('#ghReplace').textContent='更換 PAT';if(status)status.textContent='✓ GitHub PAT 已安全保存，Repo / Branch / Contents 寫入權限已實測。';showToast('GitHub PAT 已安全更新 · 可讀寫')}})});$('#ghForget')?.addEventListener('click',async()=>{await openSecretVaultDialog({target:'github',title:'移除 GitHub PAT',danger:true,onCommit:async({secretAuthToken})=>{await forgetGithubToken(secretAuthToken);if($('#tokenState')){$('#tokenState').textContent='尚未設定';$('#tokenState').classList.remove('ready')}if($('#ghSecretState')){$('#ghSecretState').textContent='尚未設定';$('#ghSecretState').classList.remove('ready')}if($('#ghSecretMeta'))$('#ghSecretMeta').textContent='尚未存入後端';if($('#ghReplace'))$('#ghReplace').textContent='設定 PAT';if(status)status.textContent='後端 GitHub PAT 已移除。'}})})}
async function publishOnlineFromEditor(){
  const sourceEl=$('#onlineBtn');
  const before=getCurrent(),previousStatus=before?.status||'Draft';

  let article=null;
  let publishResult=null;
  let identitySurfaceWarning='';

  try{
    const approved=await confirmArticlePublishUI(before);
    if(!approved){
      showToast('已取消發佈');
      return;
    }

    if(sourceEl){
      sourceEl.disabled=true;
      sourceEl.dataset.oldText=sourceEl.textContent;
      sourceEl.textContent='發佈中…';
    }

    if(!publishNow())return;
    article=getCurrent();
    await restoreRememberedGithubToken();

    if(!githubToken){
      if(article){article.status=previousStatus;if($('#status'))$('#status').value=previousStatus;persist(true)}
      nav('export');showToast('第一次請先完成 GitHub 連線設定；之後文章只要按「發佈到網頁」即可');return;
    }

    $('#saveState').textContent='正在建立文章身分…';$('#saveState').style.color='#7f8d99';
    await swArticleIdentityEnsureMigration(String(article?.id||''));
    await swArticleIdentityPrepareForPublish(article);
    $('#saveState').textContent=`${article.article_id} · v${article.current_version} · 正在建立醫學詞卡…`;

    $('#saveState').textContent='正在建立醫學詞卡…';$('#saveState').style.color='#7f8d99';
    await swAutoGlossaryScanArticle(article,{silent:true});
    $('#saveState').textContent='正在發佈到網頁…';$('#saveState').style.color='#7f8d99';
    const ok=await publishGitHub();
    if(!ok)throw new Error('GitHub 發布未完成');
    $('#saveState').textContent='正在核對 Article ID / Content Hash…';
    await swArticleIdentityVerifyRemote(article,githubToken);
    await swArticleIdentityCommitAfterPublish(article);
    article=(data.articles||[]).find(x=>String(x.id||'')===String(article?.id||''))||article;
    $('#saveState').textContent='正在完成 Trace / Share identity surfaces…';
    try{await swArticleIdentityPublishFinalSurfaces(article,githubToken)}catch(surfaceErr){identitySurfaceWarning=String(surfaceErr?.message||surfaceErr);console.warn('Article Identity surface finalize pending',surfaceErr)}
    try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}

    if(newsletterAutoEnabled()){
      $('#saveState').textContent='網頁已上線 · 正在發送電子報…';$('#saveState').style.color='#7f8d99';
      const mail=await maybeAutoSendArticleNewsletter(article,{sourceEl});
      if(mail.success){
        $('#saveState').textContent='已發佈並完成電子報 ✓';$('#saveState').style.color='#6f8f86';
        publishResult={
          kind:'publish',
          title:'文章已發佈',
          copy:`「${article?.title||'未命名文章'}」已上線，電子報也已完成。`,
          confetti:true
        };
      }else{
        $('#saveState').textContent='已發佈 · 電子報未完成';$('#saveState').style.color='#9a7b45';
        publishResult={
          kind:'warning',
          title:'文章已發佈',
          copy:`「${article?.title||'未命名文章'}」已上線；電子報尚未完成。`,
          confetti:true
        };
      }
    }else{
      $('#saveState').textContent='已發佈到網頁 ✓';$('#saveState').style.color='#6f8f86';
      publishResult={
        kind:'publish',
        title:'文章已發佈',
        copy:`「${article?.title||'未命名文章'}」已上線到 SIGN WELL。`,
        confetti:true
      };
    }

    if(identitySurfaceWarning&&publishResult){publishResult.kind='warning';publishResult.copy+=' 文章身分證的 Trace／Share 靜態資產尚未完成，可重新發佈以重試。';showToast('文章已上線，但 Identity surfaces 尚待重試：'+identitySurfaceWarning)}

    try{
      const social=await swRunPublishSocialPlan(article);
      if(social?.requested){
        if(social.complete)publishResult.copy+=' 社群圖文也已同步發布。';
        else{publishResult.kind='warning';publishResult.copy+=' 網站已上線；部分社群平台尚未完成。';}
      }
    }catch(socialErr){
      if(publishResult){publishResult.kind='warning';publishResult.copy+=' 網站已上線；社群發布未完成。';}
      showToast('社群發布未完成：'+String(socialErr?.message||socialErr));
    }

    if(publishResult){
      returnToArticlesWithResult(
        publishResult.kind,
        publishResult.title,
        publishResult.copy,
        {confetti:publishResult.confetti}
      );
    }
  }catch(e){
    hideNewsletterSendOverlay();
    if(article){
      article.status=previousStatus;if($('#status'))$('#status').value=previousStatus;persist(true);
      try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}
    }
    $('#saveState').textContent='發佈失敗';$('#saveState').style.color='#a65c65';
    showToast('發佈失敗：'+(e?.message||e));
    swShowOperationalError?.(e,{module:'article-publish',action:'publishOnlineFromEditor'});
  }finally{
    if(sourceEl){
      sourceEl.disabled=false;sourceEl.textContent=sourceEl.dataset.oldText||'發佈到網頁';delete sourceEl.dataset.oldText;
    }
  }
}

/* ===== SIGN WELL Storage Architecture v10 =====
   - Drafts/state: IndexedDB
   - Images: GitHub assets/uploads/YYYY/MM
   - Public list: articles/index.json
   - Full article: articles/<slug>.json
   - Legacy articles.js: compatibility fallback only
   ========================================================= */
const V10_INDEX_PATH='articles/index.json',V11_TOPICS_PATH='topics/index.json',PUBLIC_BUNDLE_PATH='public-data.json';
const PUBLIC_FRONT_FILES=Object.freeze(['index.html','topics.html','share.html','newsletter.html',PUBLIC_GITHUB.sitePath,V10_INDEX_PATH,V11_TOPICS_PATH,PUBLIC_BUNDLE_PATH]);
async function checkPublicFrontFiles(token){
  const missing=[],present=[];
  for(const path of PUBLIC_FRONT_FILES){
    try{
      await githubRequest(githubContentURL(path)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch),token);
      present.push(path);
    }catch(e){
      if(/Not Found|404/i.test(e.message))missing.push(path);
      else throw e;
    }
  }
  return {missing,present};
}

const SW_ANATOMY_TERM_MAP=Object.freeze([
  {id:'lad',label:'左前降支（LAD）',terms:['LAD','左前降支','left anterior descending'],parent:'heart'},
  {id:'rca',label:'右冠狀動脈（RCA）',terms:['RCA','右冠狀動脈','right coronary artery'],parent:'heart'},
  {id:'lcx',label:'左迴旋支（LCX）',terms:['LCX','左迴旋支','left circumflex'],parent:'heart'},
  {id:'lv_anterior_wall',label:'左心室前壁',terms:['左心室前壁','LV anterior wall','anterior wall of left ventricle'],parent:'heart'},
  {id:'rul',label:'右上肺葉',terms:['右上肺葉','RUL','right upper lobe'],parent:'lung'},
  {id:'lul',label:'左上肺葉',terms:['左上肺葉','LUL','left upper lobe'],parent:'lung'},
  {id:'frontal_lobe',label:'額葉',terms:['額葉','frontal lobe'],parent:'brain'},
  {id:'temporal_lobe',label:'顳葉',terms:['顳葉','temporal lobe'],parent:'brain'},
  {id:'parietal_lobe',label:'頂葉',terms:['頂葉','parietal lobe'],parent:'brain'},
  {id:'occipital_lobe',label:'枕葉',terms:['枕葉','occipital lobe'],parent:'brain'},
  {id:'cerebellum',label:'小腦',terms:['小腦','cerebellum'],parent:'brain'},
  {id:'heart',label:'心臟',terms:['心臟','heart','心肌','myocard']},
  {id:'lung',label:'肺臟',terms:['肺臟','肺部','lung','肺癌','肺炎']},
  {id:'brain',label:'腦',terms:['腦部','大腦','brain','顱內','腦瘤','腦腫瘤','腦轉移']},
  {id:'liver',label:'肝臟',terms:['肝臟','肝癌','肝硬化','liver','hepatic']},
  {id:'pancreas',label:'胰臟',terms:['胰臟','胰腺','胰臟癌','胰腺癌','pancreas','pancreatic']},
  {id:'stomach',label:'胃',terms:['胃部','胃癌','stomach','gastric']},
  {id:'colon',label:'大腸',terms:['大腸','結腸','直腸','colorectal','colon','rectum']},
  {id:'kidney',label:'腎臟',terms:['腎臟','腎癌','kidney','renal']},
  {id:'thyroid',label:'甲狀腺',terms:['甲狀腺','thyroid']},
  {id:'breast',label:'乳房',terms:['乳房','乳癌','breast']},
  {id:'prostate',label:'攝護腺',terms:['攝護腺','前列腺','prostate']},
  {id:'bladder',label:'膀胱',terms:['膀胱','bladder']},
  {id:'uterus',label:'子宮',terms:['子宮','uterus','uterine']}
]);
function swAnatomyMapForArticle(a){
  const manual=a&&a.anatomy&&Array.isArray(a.anatomy.targets)?a.anatomy:null;
  if(manual&&manual.locked===true)return clone(manual);
  const hay=[a?.title,a?.summary10s,a?.excerpt,v10Plain(a?.content||'')].filter(Boolean).join(' ').toLowerCase();
  let hits=[];
  SW_ANATOMY_TERM_MAP.forEach(row=>{
    const matched=row.terms.filter(t=>hay.includes(String(t).toLowerCase()));
    if(matched.length)hits.push({id:row.id,label:row.label,matchedTerms:matched.slice(0,4),parent:row.parent||''});
  });
  const specificParents=new Set(hits.filter(x=>x.parent).map(x=>x.parent));
  hits=hits.filter(x=>!specificParents.has(x.id)).slice(0,4).map(({id,label,matchedTerms})=>({id,label,matchedTerms}));
  return {enabled:hits.length>0,version:1,primaryId:hits[0]?.id||'',targets:hits,source:'controlled-term-map',generatedAt:new Date().toISOString()};
}

function v10Hash(s=''){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function v10Plain(html=''){const d=document.createElement('div');d.innerHTML=html;return (d.textContent||'').replace(/\s+/g,' ').trim()}
function v10ReadingTime(a){return Math.max(1,Math.round(v10Plain(a.content||'').replace(/\s+/g,'').length/450))}
function v10Revision(a){return v10Hash(JSON.stringify([a.title,a.slug,a.category,a.type,a.excerpt,a.tags,a.cover,a.content,a.publisherId,a.publishedAt,a.featured,a.status,a.evidenceEnabled,a.evidenceCards,a.signWellVerdict,a.anatomy]))}
function v10SafeSlug(a){return slugify(a.slug||a.title||a.id||('article-'+Date.now()))}
const SW_DOMAIN_CONFIG=Object.freeze({
  currentPublicBase:'https://signwell.com.tw/',
  legacyGithubBase:'https://980510linz.github.io/-/',
  futureCustomDomain:'https://signwell.com.tw/',
  customDomainEnabled:false
});
const SW_SEO_SITE=SW_DOMAIN_CONFIG.customDomainEnabled?SW_DOMAIN_CONFIG.futureCustomDomain:SW_DOMAIN_CONFIG.currentPublicBase;
function swSeoXmlEscape(v=''){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
function swSeoHtmlEscape(v=''){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function swSeoAbs(v=''){try{return new URL(String(v||''),SW_SEO_SITE).href}catch(_){return String(v||'')}}
function swSeoArticleUrl(a){return SW_SEO_SITE+'article/'+encodeURIComponent(v10SafeSlug(a))+'/'}
function swSeoDate(v){const s=String(v||'').trim();if(!s)return new Date().toISOString();const d=new Date(s.length<=10?s+'T00:00:00+08:00':s);return isNaN(d)?new Date().toISOString():d.toISOString()}
function swSeoIsNews(a){return a?.sourceWorkspace?.type==='medical-news-workspace'||String(a?.category||'')==='時事探討'}
function swSeoCleanContent(a){
  const doc=new DOMParser().parseFromString('<div id="swseo">'+String(a?.content||'')+'</div>','text/html'),root=doc.getElementById('swseo');
  root.querySelectorAll('script,style,iframe,object,embed,form').forEach(x=>x.remove());
  root.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(at=>{const n=at.name.toLowerCase();if(n.startsWith('on'))el.removeAttribute(at.name);if((n==='href'||n==='src')&&/^javascript:/i.test(at.value))el.removeAttribute(at.name)}));
  root.querySelectorAll('[src]').forEach(el=>{const v=el.getAttribute('src');if(v&&!/^(?:https?:|data:|blob:|#)/i.test(v))el.setAttribute('src',swSeoAbs(v))});
  root.querySelectorAll('a[href]').forEach(el=>{const v=el.getAttribute('href');if(v&&!/^(?:https?:|mailto:|tel:|#)/i.test(v))el.setAttribute('href',swSeoAbs(v))});
  return root.innerHTML;
}
function swSeoStaticArticleHTML(a){
  const title=String(a?.title||'未命名文章'),plain=v10Plain(a?.content||''),summary10s=cmsSummary10s(a),desc=String(a?.excerpt||summary10s||plain.slice(0,180)),url=swSeoArticleUrl(a),cover=a?.cover?swSeoAbs(a.cover):SW_SEO_SITE+'assets/signwell-share.png';
  const published=swSeoDate(a?.publishedAt||a?.updatedAt),modified=swSeoDate(a?.updatedAt||a?.publishedAt),type=swSeoIsNews(a)?'NewsArticle':'Article',person=cmsPersonById(a?.publisherId),author=String(person?.name||a?.publisherName||'SIGN WELL 編輯部'),authorPhoto=String(person?.photo||a?.publisherPhoto||''),visibleDate=String(a?.publishedAt||a?.updatedAt||'').slice(0,10);
  const authorEntity=author==='SIGN WELL 編輯部'?{"@type":"Organization",name:'SIGN WELL · 欣緯生醫'}:{"@type":"Person",name:author};
  if(authorPhoto&&authorEntity['@type']==='Person')authorEntity.image=swSeoAbs(authorPhoto);
  const ld={"@context":"https://schema.org","@type":type,headline:title,description:desc,image:[cover],datePublished:published,dateModified:modified,inLanguage:'zh-Hant',isAccessibleForFree:true,mainEntityOfPage:{"@type":"WebPage","@id":url},author:authorEntity,publisher:{"@type":"Organization",name:'SIGN WELL · 欣緯生醫',url:SW_SEO_SITE,logo:{"@type":"ImageObject",url:SW_SEO_SITE+'assets/signwell-app-icon-512.png'}}};
  if(a?.article_id){ld.identifier=String(a.article_id);ld.version=String(a.current_version||'1.0');ld.sameAs=String(a.trace_url||'');}
  const body=swSeoCleanContent(a),shareText='我在欣緯生醫看到了一篇超棒的文章：'+title;
  const avatar=authorPhoto?'<img src="'+swSeoHtmlEscape(swSeoAbs(authorPhoto))+'" alt="" loading="eager">':'<span>'+swSeoHtmlEscape((author||'SW').slice(0,2))+'</span>';
  const css=':root{color-scheme:light dark;--bg1:#f9fcff;--bg2:#e8f3fb;--ink:#17212d;--muted:#6f7f91;--line:rgba(89,132,168,.14);--card:rgba(255,255,255,.80)}*{box-sizing:border-box}html,body{width:100%;max-width:100%;overflow-x:hidden;overscroll-behavior-x:none}html{-webkit-text-size-adjust:100%}body{margin:0;min-height:100vh;touch-action:pan-y pinch-zoom;background:radial-gradient(circle at 12% 4%,rgba(119,185,246,.20),transparent 27%),radial-gradient(circle at 88% 10%,rgba(255,190,220,.14),transparent 28%),linear-gradient(155deg,var(--bg1),var(--bg2));color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang TC","Noto Sans TC",sans-serif}.top{max-width:920px;margin:0 auto;padding:22px 20px 0;display:flex;justify-content:space-between;align-items:center;gap:12px}.top a{color:inherit;text-decoration:none;font-weight:850;letter-spacing:.08em}.back-home{display:inline-flex!important;align-items:center;min-height:40px;padding:0 13px;border:1px solid rgba(95,139,175,.14);border-radius:999px;background:rgba(255,255,255,.66);font-size:12px;letter-spacing:0!important}.wrap{width:min(920px,calc(100% - 28px));max-width:100%;margin:0 auto;padding:26px 0 76px;min-width:0}.article-shell{min-width:0;max-width:100%;padding:clamp(22px,4vw,46px);border:1px solid rgba(255,255,255,.86);border-radius:32px;background:var(--card);box-shadow:0 24px 70px rgba(48,92,130,.11);backdrop-filter:blur(22px) saturate(150%);-webkit-backdrop-filter:blur(22px) saturate(150%)}.hero{padding:6px 0 28px;border-bottom:1px solid var(--line);min-width:0}.kicker{font-size:10px;letter-spacing:.14em;color:#5d86a7;font-weight:850}.hero h1{font-family:Georgia,"Noto Serif TC",serif;font-size:clamp(36px,7vw,66px);line-height:1.08;letter-spacing:-.045em;margin:14px 0;overflow-wrap:anywhere}.meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;color:var(--muted)}.author-chip{display:inline-flex;align-items:center;gap:7px}.author-chip .avatar{width:27px;height:27px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:rgba(124,168,204,.13);font-size:9px;font-weight:800}.author-chip img{width:100%;height:100%;object-fit:cover}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.actions button{min-height:42px;padding:0 14px;border-radius:14px;border:1px solid rgba(95,139,175,.16);background:rgba(255,255,255,.78);color:#24445f;font-weight:800;cursor:pointer}.reader-size{display:inline-grid;grid-template-columns:repeat(3,40px);padding:3px;border-radius:14px;background:rgba(126,169,204,.09);border:1px solid rgba(95,139,175,.11)}.reader-size button{min-height:34px;padding:0;border:0;background:transparent;border-radius:11px;color:var(--muted)}.reader-size button[aria-pressed="true"]{background:rgba(255,255,255,.86);color:#24445f;box-shadow:0 4px 12px rgba(56,91,118,.08)}.cover{display:block;width:100%;max-width:100%;max-height:520px;object-fit:cover;border-radius:26px;margin:28px 0}.summary10s{margin:26px 0 30px;padding:15px 18px;border:1px solid rgba(95,139,175,.12);border-radius:18px;background:linear-gradient(135deg,rgba(235,246,255,.72),rgba(255,240,247,.54));overflow-wrap:anywhere}.summary10s b{display:block;font-size:10px;letter-spacing:.12em;color:#6486a1;margin-bottom:6px}.summary10s p{margin:0;font-size:15px;line-height:1.75}.article{min-width:0;max-width:100%;font-size:18px;line-height:1.95;overflow-wrap:anywhere;word-break:break-word}.article-shell[data-font-size="small"] .article{font-size:17px}.article-shell[data-font-size="medium"] .article{font-size:19px}.article-shell[data-font-size="large"] .article{font-size:21px}.article h2{font-size:1.62em;margin-top:48px;line-height:1.25}.article h3{font-size:1.30em;margin-top:34px;line-height:1.35}.article img,.article video,.article iframe,.article canvas,.article svg{max-width:100%!important;height:auto}.article table{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse;margin:24px 0;overflow-wrap:anywhere}.article th,.article td{max-width:100%;padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;overflow-wrap:anywhere;word-break:break-word}.article pre{max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere}.article a{overflow-wrap:anywhere;word-break:break-word}.article blockquote{margin:24px 0;padding:14px 18px;border-left:3px solid #8dbde5;background:rgba(234,246,255,.55);border-radius:0 16px 16px 0}.foot{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);font-size:12px;line-height:1.8;color:var(--muted)}.foot a{color:inherit}@media(max-width:600px){.top{padding-inline:12px}.wrap{width:min(100% - 20px,920px);padding-top:12px}.article-shell{padding:20px 17px 30px;border-radius:24px}.article-shell[data-font-size="small"] .article{font-size:16px}.article-shell[data-font-size="medium"] .article{font-size:18px}.article-shell[data-font-size="large"] .article{font-size:20px}.hero h1{font-size:clamp(34px,10vw,48px)}.cover{border-radius:20px;margin:22px 0}}@media(prefers-color-scheme:dark){:root{--bg1:#171918;--bg2:#1d201c;--ink:#f4f5f2;--muted:#b9bfc0;--line:rgba(244,246,243,.14);--card:rgba(244,246,243,.075);--oxblood:#743a3f;--walnut:#745945;--olive:#58604c}body{background:radial-gradient(circle at 12% 4%,rgba(88,96,76,.18),transparent 28%),radial-gradient(circle at 88% 8%,rgba(116,58,63,.14),transparent 30%),radial-gradient(circle at 52% 108%,rgba(116,89,69,.14),transparent 32%),linear-gradient(160deg,var(--bg1),var(--bg2));color:var(--ink)}.article-shell{background:linear-gradient(150deg,rgba(244,246,243,.09),rgba(244,246,243,.035));border-color:rgba(244,246,243,.14);box-shadow:0 24px 70px rgba(0,0,0,.26),inset 0 1px 0 rgba(244,246,243,.08)}.actions button,.back-home{background:rgba(244,246,243,.07);color:#b9bfc0;border-color:rgba(244,246,243,.13)}.kicker{color:#b9bfc0}.hero h1,.article :is(h2,h3,h4,strong){color:#f4f5f2}.meta,.foot,.article{color:#b9bfc0}.summary10s{background:linear-gradient(135deg,rgba(88,96,76,.14),rgba(116,89,69,.08));border-color:rgba(244,246,243,.11)}.summary10s b{color:#b9bfc0}.article blockquote{background:rgba(116,89,69,.10);border-left-color:#745945;color:#b9bfc0}.article a{color:#b9bfc0}.reader-size{background:rgba(244,246,243,.055);border-color:rgba(244,246,243,.10)}.reader-size button{color:#b9bfc0}.reader-size button[aria-pressed="true"]{background:linear-gradient(145deg,rgba(88,96,76,.34),rgba(116,89,69,.24));color:#f4f5f2}}';
  const shareScript=a?.article_id?'':('<script>(function(){var u='+JSON.stringify(url).replace(/</g,'\\u003c')+',t='+JSON.stringify(shareText).replace(/</g,'\\u003c')+';var s=document.getElementById("shareArticle"),c=document.getElementById("copyArticle");async function cp(v){try{await navigator.clipboard.writeText(v)}catch(e){var x=document.createElement("textarea");x.value=v;document.body.appendChild(x);x.select();document.execCommand("copy");x.remove()}}if(s)s.addEventListener("click",async function(){try{if(navigator.share)await navigator.share({title:t,text:t,url:u});else await cp(t+"\n"+u)}catch(e){if(e&&e.name!=="AbortError")await cp(t+"\n"+u)}});if(c)c.addEventListener("click",function(){cp(u)})})();<\/script>');
  const identityButton=a?.article_id?'<button type="button" id="identityArticle">文章身分證 <small>'+swSeoHtmlEscape(String(a.article_id))+'</small></button>':'';
  const identityRuntime=a?.article_id?'<script src="'+SW_SEO_SITE+'analytics-config.js"><\/script><script src="'+SW_SEO_SITE+'assets/bundles/article-identity-v24.8.0.js?build=24.8.0-STAGING"><\/script><script>window.SignWellArticleIdentity&&window.SignWellArticleIdentity.mountStaticArticle('+JSON.stringify({slug:v10SafeSlug(a),title:title,article_id:String(a.article_id||''),current_version:String(a.current_version||''),article_status:String(a.article_status||''),review_status:Array.isArray(a.review_status)?a.review_status:[],content_hash:String(a.content_hash||''),trace_url:String(a.trace_url||''),publisherName:author,publishedAt:String(a.publishedAt||''),updatedAt:String(a.updatedAt||''),identity:a.identity||null}).replace(/</g,'\\u003c')+');<\/script>':'';
  const readerScript='<script>(function(){var k="signwell-reader-font-v2",shell=document.querySelector(".article-shell"),buttons=document.querySelectorAll("[data-font-size]");function set(v){if(["small","medium","large"].indexOf(v)<0)v="medium";shell.dataset.fontSize=v;buttons.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.fontSize===v?"true":"false")});try{localStorage.setItem(k,v)}catch(e){}}var v="medium";try{v=localStorage.getItem(k)||"medium"}catch(e){}set(v);buttons.forEach(function(b){b.addEventListener("click",function(){set(b.dataset.fontSize)})})})();<\/script>';
  return '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"><meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>'+swSeoHtmlEscape(title)+'｜欣緯生醫</title><meta name="description" content="'+swSeoHtmlEscape(desc)+'"><link rel="canonical" href="'+swSeoHtmlEscape(url)+'"><link rel="stylesheet" href="'+SW_SEO_SITE+'assets/signwell-anatomy-link.css?v=23.9.96"><link rel="stylesheet" href="'+SW_SEO_SITE+'assets/components/styles/12-signwell-article-identity-v24.8.0.css?build=24.8.0-STAGING"><meta property="og:type" content="article"><meta property="og:locale" content="zh_TW"><meta property="og:site_name" content="SIGN WELL · 欣緯生醫"><meta property="og:title" content="'+swSeoHtmlEscape(title)+'"><meta property="og:description" content="'+swSeoHtmlEscape(desc)+'"><meta property="og:url" content="'+swSeoHtmlEscape(url)+'"><meta property="og:image" content="'+swSeoHtmlEscape(cover)+'"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+swSeoHtmlEscape(title)+'"><meta name="twitter:description" content="'+swSeoHtmlEscape(desc)+'"><meta name="twitter:image" content="'+swSeoHtmlEscape(cover)+'"><meta property="article:published_time" content="'+swSeoHtmlEscape(published)+'"><meta property="article:modified_time" content="'+swSeoHtmlEscape(modified)+'"><meta property="article:section" content="'+swSeoHtmlEscape(String(a?.category||'醫學筆記'))+'"><script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'<\/script><style>'+css+'</style></head><body><header class="top"><a href="'+SW_SEO_SITE+'">SIGN WELL · 欣緯生醫</a><a class="back-home" href="'+SW_SEO_SITE+'">← 返回首頁</a></header><main class="wrap"><article class="article-shell" data-font-size="medium"><header class="hero"><div class="kicker">'+swSeoHtmlEscape(String(a?.category||'醫學筆記'))+'</div><h1>'+swSeoHtmlEscape(title)+'</h1><div class="meta"><time datetime="'+swSeoHtmlEscape(published)+'">'+swSeoHtmlEscape(visibleDate||published.slice(0,10))+'</time><span>·</span><span class="author-chip"><span class="avatar">'+avatar+'</span><span>'+swSeoHtmlEscape(author)+'</span></span></div><div class="actions">'+identityButton+'<button type="button" id="shareArticle">分享</button><button type="button" id="copyArticle">複製連結</button><span class="reader-size" role="group" aria-label="文章字級"><button type="button" data-font-size="small" aria-pressed="false">小</button><button type="button" data-font-size="medium" aria-pressed="true">中</button><button type="button" data-font-size="large" aria-pressed="false">大</button></span></div></header>'+(a?.cover?'<img class="cover" src="'+swSeoHtmlEscape(cover)+'" alt="">':'')+(summary10s?'<aside class="summary10s"><b>10 秒摘要</b><p>'+swSeoHtmlEscape(summary10s)+'</p></aside>':'')+'<div class="article">'+body+'</div><footer class="foot">本站不提供醫療服務、不招攬醫療業務；內容僅供醫學教育與資訊整理，不構成個別醫療建議。<br><a href="'+SW_SEO_SITE+'">返回 SIGN WELL</a> · <a href="mailto:signwell.com.tw@gmail.com">聯絡我們</a></footer></article></main>'+shareScript+readerScript+identityRuntime+'<script>window.SIGNWELL_STATIC_ARTICLE='+JSON.stringify({title:title,summary10s:summary10s,excerpt:desc,anatomy:a?.anatomy||swAnatomyMapForArticle(a)}).replace(/</g,'\\u003c')+';<\/script><script src="'+SW_SEO_SITE+'assets/signwell-anatomy-link.js?v=23.9.96"><\/script></body></html>\n';
}


function swArticleIdentitySnapshotFromArticle(a){
  a=a||{};const i=a.identity&&typeof a.identity==='object'?clone(a.identity):{};
  i.article_id=String(i.article_id||a.article_id||'');
  i.article_uuid=String(i.article_uuid||a.article_uuid||'');
  i.legacy_id=String(i.legacy_id||a.id||'');
  i.slug=String(i.slug||a.slug||v10SafeSlug(a));
  i.title=String(i.title||a.title||'未命名文章');
  i.author=i.author&&typeof i.author==='object'?i.author:{id:String(a.publisherId||''),name:String(a.publisherName||'SIGN WELL 編輯部')};
  i.published_at=String(i.published_at||a.publishedAt||'');i.updated_at=String(i.updated_at||a.updatedAt||'');
  i.current_version=String(i.current_version||a.current_version||'');i.revision_seq=Number(i.revision_seq||a.revision_seq||0);
  i.article_status=String(i.article_status||a.article_status||'NEEDS REVIEW');i.review_status=Array.isArray(i.review_status)?i.review_status:(Array.isArray(a.review_status)?a.review_status:[]);
  i.ai_involvement=i.ai_involvement&&typeof i.ai_involvement==='object'?i.ai_involvement:(a.ai_involvement||{});
  i.content_hash=String(i.content_hash||a.content_hash||'');i.hash_schema=String(i.hash_schema||a.hash_schema||'sw-content-v1');
  i.article_url=String(i.article_url||swSeoArticleUrl(a));i.trace_url=String(i.trace_url||a.trace_url||SW_SEO_SITE+'trace/'+encodeURIComponent(i.article_id)+'/');
  i.share_card_url=String(i.share_card_url||a.share_card_url||SW_SEO_SITE+'assets/article-identity/'+encodeURIComponent(i.article_id)+'.svg');
  i.last_verified_at=String(i.last_verified_at||a.last_verified_at||'');i.citations=Array.isArray(i.citations)?i.citations:[];i.referenced_by_items=Array.isArray(i.referenced_by_items)?i.referenced_by_items:[];i.version_history=Array.isArray(i.version_history)?i.version_history:[];
  i.external_references=Number(i.external_references||i.citations.filter(c=>String(c?.target_type||'')!=='INTERNAL_ARTICLE').length||(Array.isArray(a.references)?a.references.length:0));
  i.internal_references=Number(i.internal_references||i.citations.filter(c=>String(c?.target_type||'')==='INTERNAL_ARTICLE').length);i.referenced_by=Number(i.referenced_by||i.referenced_by_items.length);
  return i;
}
function swArticleIdentityTraceHTML(aOrIdentity){
  const i=(aOrIdentity&&aOrIdentity.identity)?swArticleIdentitySnapshotFromArticle(aOrIdentity):clone(aOrIdentity||{}),id=String(i.article_id||'');
  if(!/^SW-A-\d{4}-\d{6}$/.test(id))throw new Error('Trace Page 缺少有效 Article ID');
  const title=String(i.title||'SIGN WELL 文章'),trace=String(i.trace_url||SW_SEO_SITE+'trace/'+encodeURIComponent(id)+'/'),image=String(i.share_card_url||SW_SEO_SITE+'assets/article-identity/'+encodeURIComponent(id)+'.svg');
  const snapshot=JSON.stringify(i).replace(/</g,'\\u003c');
  const ld={"@context":"https://schema.org","@type":"WebPage",name:'文章溯源紀錄｜'+title,url:trace,inLanguage:'zh-Hant',about:{"@type":"Article",name:title,identifier:id,version:String(i.current_version||'')}};
  return '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><meta name="referrer" content="strict-origin-when-cross-origin"><title>文章溯源紀錄｜'+swSeoHtmlEscape(title)+'｜SIGN WELL</title><meta name="description" content="SIGN WELL '+swSeoHtmlEscape(id)+' 的文章身分、版本、引用與內容 fingerprint 溯源紀錄。"><link rel="canonical" href="'+swSeoHtmlEscape(trace)+'"><meta property="og:type" content="website"><meta property="og:site_name" content="SIGN WELL · 欣緯生醫"><meta property="og:title" content="文章溯源紀錄｜'+swSeoHtmlEscape(title)+'"><meta property="og:description" content="Every article has an identity. Traceable. Versioned. Referenced."><meta property="og:url" content="'+swSeoHtmlEscape(trace)+'"><meta property="og:image" content="'+swSeoHtmlEscape(image)+'"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+swSeoHtmlEscape(image)+'"><link rel="stylesheet" href="'+SW_SEO_SITE+'assets/components/styles/12-signwell-article-identity-v24.8.0.css?build=24.8.0-STAGING"><script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'<\/script></head><body class="sw-trace-body"><div class="sw-trace-wrap"><header class="sw-trace-top"><a href="'+SW_SEO_SITE+'">SIGN WELL · 欣緯生醫</a><a href="'+swSeoHtmlEscape(i.article_url||SW_SEO_SITE)+'">原始文章</a></header><main data-sw-trace-root><section class="sw-trace-status"><b>正在讀取文章溯源紀錄…</b><span>'+swSeoHtmlEscape(id)+'</span></section></main></div><script>window.SIGNWELL_TRACE_SNAPSHOT='+snapshot+';<\/script><script src="'+SW_SEO_SITE+'analytics-config.js"><\/script><script src="'+SW_SEO_SITE+'assets/bundles/article-identity-v24.8.0.js?build=24.8.0-STAGING"><\/script><script>window.SignWellArticleIdentity&&window.SignWellArticleIdentity.mountTracePage(window.SIGNWELL_TRACE_SNAPSHOT);<\/script></body></html>\n';
}
function swArticleIdentityShareSvg(aOrIdentity){
  const article=(aOrIdentity&&aOrIdentity.identity)?aOrIdentity:{title:String(aOrIdentity?.title||''),article_id:String(aOrIdentity?.article_id||''),identity:aOrIdentity||{}};
  const i=(article.identity&&typeof article.identity==='object')?swArticleIdentitySnapshotFromArticle(article):clone(aOrIdentity||{});
  const engine=window.SignWellArticleIdentity;if(!engine?.makeStaticShareSvg)throw new Error('Article Identity share-card renderer 尚未載入');
  return engine.makeStaticShareSvg(i,article)+'\n';
}
function swArticleIdentitySurfaceEntries(a){
  const i=swArticleIdentitySnapshotFromArticle(a),id=String(i.article_id||'');if(!/^SW-A-\d{4}-\d{6}$/.test(id))return[];
  return [
    {path:`trace/${id}/index.html`,mode:'100644',type:'blob',content:swArticleIdentityTraceHTML(i)},
    {path:`trace/${id}/snapshot.json`,mode:'100644',type:'blob',content:JSON.stringify(i,null,2)+'\n'},
    {path:`assets/article-identity/${id}.svg`,mode:'100644',type:'blob',content:swArticleIdentityShareSvg(a)}
  ];
}
async function swArticleIdentityVerifyFinalSurfaces(a,token='server-managed'){
  const i=swArticleIdentitySnapshotFromArticle(a),id=String(i.article_id||'');
  const remote=await v10FetchArticleRaw(`articles/${v10SafeSlug(a)}.json`);if(String(remote?.article_id||'')!==id||String(remote?.content_hash||'')!==String(i.content_hash||''))throw new Error('Final Article Identity JSON 驗證失敗');
  const traceFile=await githubRequest(githubContentURL(`trace/${id}/snapshot.json`)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),token),trace=JSON.parse(base64Utf8(traceFile.content||''));
  if(String(trace?.article_id||'')!==id||String(trace?.content_hash||'')!==String(i.content_hash||''))throw new Error('Trace snapshot 驗證失敗');
  return {ok:true,articleId:id};
}
async function swArticleIdentityPublishFinalSurfaces(article,token){
  const current=(data.articles||[]).find(x=>String(x.id||'')===String(article?.id||''))||article;if(!current?.article_id)return {ok:false,skipped:true};
  const published=(data.articles||[]).filter(x=>x.status==='Published'),metas=published.map(v10IndexMeta),entries=[
    {path:`articles/${v10SafeSlug(current)}.json`,mode:'100644',type:'blob',content:JSON.stringify(current,null,2)+'\n'},
    {path:`article/${v10SafeSlug(current)}/index.html`,mode:'100644',type:'blob',content:swSeoStaticArticleHTML(current)},
    {path:V10_INDEX_PATH,mode:'100644',type:'blob',content:JSON.stringify(metas,null,2)+'\n'},
    ...swArticleIdentitySurfaceEntries(current)
  ];
  await v10BatchCommit(entries,token,'Finalize SIGN WELL Article Identity '+String(current.article_id)+' '+new Date().toISOString().slice(0,19).replace('T',' '));
  await swArticleIdentityVerifyFinalSurfaces(current,token);signalPublicDataRefresh();return {ok:true,articleId:current.article_id};
}

function swSeoSitemapXML(list){
  const staticUrls=[['', 'daily','1.0'],['topics.html','daily','0.8'],['about.html','monthly','0.6'],['newsletter.html','weekly','0.5'],['privacy.html','yearly','0.2'],['terms.html','yearly','0.2']];
  const rows=staticUrls.map(x=>'<url><loc>'+swSeoXmlEscape(SW_SEO_SITE+x[0])+'</loc><changefreq>'+x[1]+'</changefreq><priority>'+x[2]+'</priority></url>');
  (list||[]).forEach(a=>{rows.push('<url><loc>'+swSeoXmlEscape(swSeoArticleUrl(a))+'</loc><lastmod>'+swSeoXmlEscape(swSeoDate(a?.updatedAt||a?.publishedAt).slice(0,10))+'</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>');if(/^SW-A-\d{4}-\d{6}$/.test(String(a?.article_id||'')))rows.push('<url><loc>'+swSeoXmlEscape(String(a.trace_url||SW_SEO_SITE+'trace/'+encodeURIComponent(a.article_id)+'/'))+'</loc><lastmod>'+swSeoXmlEscape(swSeoDate(a?.updatedAt||a?.publishedAt).slice(0,10))+'</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>')});
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  '+rows.join('\n  ')+'\n</urlset>\n';
}
function swSeoNewsSitemapXML(list){
  const now=Date.now(),cut=now-48*60*60*1000,rows=[];
  (list||[]).filter(swSeoIsNews).forEach(a=>{const d=new Date(swSeoDate(a?.publishedAt||a?.updatedAt));if(isNaN(d)||d.getTime()<cut||d.getTime()>now+5*60*1000)return;rows.push('<url><loc>'+swSeoXmlEscape(swSeoArticleUrl(a))+'</loc><news:news><news:publication><news:name>SIGN WELL · 欣緯生醫</news:name><news:language>zh</news:language></news:publication><news:publication_date>'+swSeoXmlEscape(d.toISOString())+'</news:publication_date><news:title>'+swSeoXmlEscape(String(a?.title||''))+'</news:title></news:news></url>')});
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n  '+rows.join('\n  ')+'\n</urlset>\n';
}
function swSeoFeedXML(list){
  const items=(list||[]).slice().sort((a,b)=>new Date(b?.publishedAt||b?.updatedAt||0)-new Date(a?.publishedAt||a?.updatedAt||0)).slice(0,50).map(a=>'<item><title>'+swSeoXmlEscape(String(a?.title||''))+'</title><link>'+swSeoXmlEscape(swSeoArticleUrl(a))+'</link><guid isPermaLink="true">'+swSeoXmlEscape(swSeoArticleUrl(a))+'</guid><pubDate>'+swSeoXmlEscape(new Date(swSeoDate(a?.publishedAt||a?.updatedAt)).toUTCString())+'</pubDate><description>'+swSeoXmlEscape(String(a?.excerpt||v10Plain(a?.content||'').slice(0,180)))+'</description></item>');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>SIGN WELL · 欣緯生醫</title><link>'+SW_SEO_SITE+'</link><description>醫學白話文、醫療新聞與證據判讀</description><language>zh-TW</language>'+items.join('')+'</channel></rss>\n';
}
function v10IndexMeta(a){
  const slug=v10SafeSlug(a),plain=v10Plain(a.content||''),person=cmsPersonById(a.publisherId),publisherName=String(person?.name||a.publisherName||''),publisherPhoto=String(person?.photo||a.publisherPhoto||'');
  return {id:a.id,title:a.title||'未命名文章',slug,summary10s:cmsSummary10s(a),excerpt:a.excerpt||plain.slice(0,180),category:a.category||'醫學筆記',type:a.type||'文章',cover:a.cover||'',tags:Array.isArray(a.tags)?a.tags:[],publisherId:String(a.publisherId||''),publisherName,publisherPhoto,publishedAt:a.publishedAt||'',updatedAt:a.updatedAt||'',featured:Boolean(a.featured),status:'Published',readingTime:v10ReadingTime(a),searchText:plain.slice(0,700),verdictReadiness:String(a?.signWellVerdict?.readiness||''),verdictEvidence:String(a?.signWellVerdict?.evidence||''),evidenceCardCount:Array.isArray(a?.evidenceCards)?a.evidenceCards.filter(c=>c&&String(c.claim||'').trim()).length:0,anatomyEnabled:Boolean(a?.anatomy?.enabled),anatomyPrimary:String(a?.anatomy?.primaryId||''),articleId:String(a.article_id||''),articleVersion:String(a.current_version||''),articleStatus:String(a.article_status||''),reviewStatus:Array.isArray(a.review_status)?a.review_status:[],contentHash:String(a.content_hash||''),traceUrl:String(a.trace_url||''),revision:v10Revision(a),file:`articles/${slug}.json`}
}

function dataUrlParts(url=''){const m=String(url).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);return m?{mime:m[1].toLowerCase(),base64:m[2].replace(/\s/g,'')}:null}
function extForMime(m=''){if(m.includes('webp'))return'webp';if(m.includes('png'))return'png';if(m.includes('gif'))return'gif';return'jpg'}
async function v10CreateBlob(base64,token){return githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/blobs`,token,{method:'POST',body:JSON.stringify({content:base64,encoding:'base64'})})}
async function v10ImageTreeEntry(dataUrl,slug,kind,token,cache){if(cache.has(dataUrl))return cache.get(dataUrl);const p=dataUrlParts(dataUrl);if(!p)return null;const now=new Date(),ym=`${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}`,name=`${slug}-${kind}-${v10Hash(dataUrl)}.${extForMime(p.mime)}`,path=`assets/uploads/${ym}/${name}`,blob=await v10CreateBlob(p.base64,token),entry={path,mode:'100644',type:'blob',sha:blob.sha},out={entry,url:path};cache.set(dataUrl,out);return out}
function v10PublicAudit(audit,refs=[]){
  if(!audit||typeof audit!=='object')return null;
  const cited=Array.isArray(refs)?refs:[];
  return {
    evidenceLocked:Boolean(audit.evidenceLocked),
    claimEvidenceLocked:Boolean(audit.claimEvidenceLocked),
    claimAuditPassed:Boolean(audit.claimAuditPassed),
    topicFitPassed:Boolean(audit.topicFitPassed),
    topicFitScore:Number(audit.topicFitScore||0),
    numericalFidelityChecked:Boolean(audit.numericalFidelityChecked),
    publicCitationPolicy:'cited-news-government-pubmed',
    citedLiteratureCount:cited.filter(r=>r&&r.type==='literature').length,
    citedGovernmentCount:cited.filter(r=>r&&r.type==='government').length,
    wordCount:Number(audit.wordCount||0)
  };
}
function v10PubmedIdFromRef(r){
  const direct=String(r?.pmid||'').match(/\d+/);if(direct)return direct[0];
  const m=String(r?.url||'').match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i);return m?m[1]:'';
}
function v10FilterPublicCitations(a){
  const refs=(Array.isArray(a?.references)?a.references:[]).filter(r=>r&&['news','government','literature'].includes(r.type));
  a.references=refs;
  const allowedPmids=new Set(refs.filter(r=>r.type==='literature').map(v10PubmedIdFromRef).filter(Boolean));
  a.audit=v10PublicAudit(a.audit,refs);
  if(a.contentFormat==='html'&&a.content){
    const doc=new DOMParser().parseFromString(`<div id="sw-public-article">${a.content}</div>`,'text/html');
    const root=doc.getElementById('sw-public-article');
    root.querySelectorAll('a[href*="pubmed.ncbi.nlm.nih.gov"]').forEach(link=>{
      const m=String(link.getAttribute('href')||'').match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i),pmid=m?m[1]:'';
      if(pmid&&allowedPmids.has(pmid))return;
      const li=link.closest('li');if(li)li.remove();else link.remove();
    });
    root.querySelectorAll('li').forEach(li=>{
      const m=String(li.textContent||'').match(/PMID\s*[:：]?\s*(\d+)/i);
      if(m&&!allowedPmids.has(m[1]))li.remove();
    });
    root.querySelectorAll('sup').forEach(sup=>{if(!sup.textContent.trim()&&!sup.querySelector('a'))sup.remove()});
    a.content=root.innerHTML;
  }
  return a;
}
async function v10PrepareArticle(article,token,imageEntries,imageCache){
  let a=clone(article),slug=v10SafeSlug(a);
  a.slug=slug;
  a=v10FilterPublicCitations(a);
  if(dataUrlParts(a.cover||'')){const up=await v10ImageTreeEntry(a.cover,slug,'cover',token,imageCache);if(up){imageEntries.push(up.entry);a.cover=up.url}}
  if(a.contentFormat==='html'&&a.content){
    const doc=new DOMParser().parseFromString(`<div id="v10root">${a.content}</div>`,'text/html'),root=doc.getElementById('v10root'),imgs=[...root.querySelectorAll('img[src^="data:image/"]')];
    for(let i=0;i<imgs.length;i++){const src=imgs[i].getAttribute('src')||'',up=await v10ImageTreeEntry(src,slug,'img'+(i+1),token,imageCache);if(up){imageEntries.push(up.entry);imgs[i].setAttribute('src',up.url)}}
    a.content=root.innerHTML;
  }
  a.anatomy=swAnatomyMapForArticle(a);
  a.updatedAt=a.updatedAt||new Date().toISOString().slice(0,10);
  return a;
}
async function v10PreparePeoplePhotos(people,token,imageEntries,imageCache){
  const prepared=clone(Array.isArray(people)?people:[]);

  for(let i=0;i<prepared.length;i++){
    const person=prepared[i];
    const src=String(person.photo||'');

    if(!dataUrlParts(src))continue;

    const base=v10SafeSlug({
      slug:'person-'+String(person.id||person.name||('p'+i))
    });

    const up=await v10ImageTreeEntry(src,base,'portrait',token,imageCache);

    if(up){
      if(!imageEntries.some(x=>x.path===up.entry.path)){
        imageEntries.push(up.entry);
      }
      person.photo=up.url;
    }
  }

  return prepared;
}


async function v10BranchBase(token){const ref=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/ref/heads/${encodeURIComponent(PUBLIC_GITHUB.branch)}`,token),commit=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/commits/${ref.object.sha}`,token);return {head:ref.object.sha,tree:commit.tree.sha}}
async function v10BatchCommit(entries,token,message){
  await ensureGithubRuntimeTarget(false);
  const dedup=new Map();entries.forEach(e=>dedup.set(e.path,e));
  let lastErr=null;
  for(let attempt=0;attempt<3;attempt++){
    const base=await v10BranchBase(token);
    try{
      const tree=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/trees`,token,{method:'POST',body:JSON.stringify({base_tree:base.tree,tree:[...dedup.values()]})});
      const commit=await githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/commits`,token,{method:'POST',body:JSON.stringify({message,tree:tree.sha,parents:[base.head]})});
      await githubRequest(`https://api.github.com/repos/${encodeURIComponent(PUBLIC_GITHUB.owner)}/${encodeURIComponent(PUBLIC_GITHUB.repo)}/git/refs/heads/${encodeURIComponent(PUBLIC_GITHUB.branch)}`,token,{method:'PATCH',body:JSON.stringify({sha:commit.sha,force:false})});
      return commit.sha;
    }catch(err){
      lastErr=normalizeGithubBridgeError(err);
      const conflict=[409,422].includes(Number(lastErr.status))||/fast[- ]?forward|reference update|failed to update ref/i.test(String(lastErr.message||''));
      if(!conflict||attempt===2)throw lastErr;
      await new Promise(r=>setTimeout(r,350*(attempt+1)));
    }
  }
  throw lastErr||new Error('GitHub commit failed');
}

/* v14.1.1 · GitHub sync hotfix
   Restores the v10 remote article loader accidentally omitted in later builds. */
async function v10FetchIndexRaw(){
  await ensureGithubRuntimeTarget(false);
  try{
    const file=await githubRequest(githubContentURL(V10_INDEX_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),'server-managed');
    const a=JSON.parse(base64Utf8(file.content||''));
    if(!Array.isArray(a))throw new Error('v10 index invalid');
    return a;
  }catch(err){throw normalizeGithubBridgeError(err)}
}
async function v10FetchArticleRaw(file){
  await ensureGithubRuntimeTarget(false);
  try{
    const remote=await githubRequest(githubContentURL(file)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),'server-managed');
    const obj=JSON.parse(base64Utf8(remote.content||''));
    if(!obj||typeof obj!=='object')throw new Error('article payload invalid');
    return obj;
  }catch(err){throw normalizeGithubBridgeError(err)}
}
async function v10LoadRemoteArticles(token){
  let idx;
  try{
    idx=await v10FetchIndexRaw();
  }catch(err){
    if(err.status!==404)throw err;
    const legacy=await fetchRemoteArticles(token);
    return {
      articles:legacy.articles,
      index:legacy.articles.map(v10IndexMeta),
      mode:'legacy'
    };
  }
  const full=await Promise.all(idx.map(async m=>{
    const article=await v10FetchArticleRaw(m.file||`articles/${m.slug}.json`);
    if(!article||typeof article.content!=='string')throw new Error('文章內容不完整：'+(m.slug||m.id));
    return {...m,...article,status:'Published'};
  }));
  return {articles:full,index:idx,mode:'v10'};
}

async function v11FetchTopicsRaw(){
  await ensureGithubRuntimeTarget(false);
  try{
    const remote=await githubRequest(githubContentURL(V11_TOPICS_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),'server-managed');
    const a=JSON.parse(base64Utf8(remote.content||''));if(!Array.isArray(a))throw new Error('topics invalid');return a;
  }catch(err){throw normalizeGithubBridgeError(err)}
}
function v11TopicPayload(){return (data.topics||[]).map((x,i)=>({id:x.id||('topic-'+i),name:x.name||'未命名主題',slug:x.slug||slugify(x.name||('topic-'+i)),description:x.description||'',order:Number.isFinite(Number(x.order))?Number(x.order):i,active:x.active!==false}))}
function currentSiteTextPayload(){return {...DEFAULT_SITE_TEXT,...(data.siteText||{})}}
function publicBundlePayload(revision=Date.now(),peopleOverride=null){
  const peopleSource=Array.isArray(peopleOverride)?peopleOverride:(data.people||[]);
  return {
    schema:1,
    revision:Number(revision),
    publishedAt:new Date().toISOString(),
    siteText:currentSiteTextPayload(),
    topics:v11TopicPayload(),
    people:peopleSource.map((p,i)=>({
      id:String(p.id||('person-'+i)),
      name:String(p.name||''),
      role:String(p.role||''),
      bio:String(p.bio||''),
      photo:String(p.photo||''),
      expertise:Array.isArray(p.expertise)?p.expertise.map(String).filter(Boolean):[],
      education:Array.isArray(p.education)?p.education.map(String).filter(Boolean):[],
      experience:Array.isArray(p.experience)?p.experience.map(String).filter(Boolean):[],
      order:Number.isFinite(Number(p.order))?Number(p.order):i,
      active:p.active!==false
    })),
    glossary:(Array.isArray(data.glossary)?data.glossary:[])
      .filter(g=>g&&g.active!==false&&String(g.term||'').trim()&&String(g.definition||'').trim())
      .map((g,i)=>({
        id:String(g.id||('term-'+i)),
        term:String(g.term||'').trim(),
        translation:String(g.translation||'').trim(),
        definition:String(g.definition||'').trim(),
        aliases:Array.isArray(g.aliases)?g.aliases.map(String).filter(Boolean).slice(0,8):[],
        active:g.active!==false,
        updatedAt:String(g.updatedAt||'')
      }))
  };
}
function publicBundleJSONText(bundle){return JSON.stringify(bundle,null,2)+'\n'}
function canonTopics(a){return JSON.stringify((a||[]).map((x,i)=>({
  id:String(x.id||('topic-'+i)),
  name:String(x.name||''),
  slug:String(x.slug||''),
  description:String(x.description||''),
  order:Number.isFinite(Number(x.order))?Number(x.order):i,
  active:x.active!==false
})))}
function canonSiteText(o){return JSON.stringify({...DEFAULT_SITE_TEXT,...(o||{})})}
function canonPeople(a){
  return JSON.stringify((Array.isArray(a)?a:[]).map((p,i)=>({
    id:String(p.id||('person-'+i)),
    name:String(p.name||''),
    role:String(p.role||''),
    bio:String(p.bio||''),
    photo:String(p.photo||''),
    expertise:Array.isArray(p.expertise)?p.expertise.map(String).filter(Boolean):[],
    education:Array.isArray(p.education)?p.education.map(String).filter(Boolean):[],
    experience:Array.isArray(p.experience)?p.experience.map(String).filter(Boolean):[],
    order:Number.isFinite(Number(p.order))?Number(p.order):i,
    active:p.active!==false
  })))
}

function canonGlossary(a){
  return JSON.stringify((Array.isArray(a)?a:[]).map((g,i)=>({
    id:String(g.id||('term-'+i)),term:String(g.term||''),translation:String(g.translation||''),
    definition:String(g.definition||''),aliases:Array.isArray(g.aliases)?g.aliases.map(String).filter(Boolean):[],
    active:g.active!==false,updatedAt:String(g.updatedAt||'')
  })));
}
async function verifyPublicBundle(expected,token){
  const file=await githubRequest(
    githubContentURL(PUBLIC_BUNDLE_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),
    token
  );
  let remote;
  try{remote=JSON.parse(base64Utf8(file.content||''))}catch(_){throw new Error('public-data.json 不是有效 JSON')}
  if(!remote||typeof remote!=='object')throw new Error('public-data.json 格式錯誤');
  if(Number(remote.revision)!==Number(expected.revision))throw new Error('public-data.json revision 不一致');
  if(canonTopics(remote.topics)!==canonTopics(expected.topics))throw new Error('主題內容驗證失敗');
  if(canonSiteText(remote.siteText)!==canonSiteText(expected.siteText))throw new Error('網站文字驗證失敗');
  if(canonPeople(remote.people)!==canonPeople(expected.people))throw new Error('人物資料驗證失敗');
  if(canonGlossary(remote.glossary)!==canonGlossary(expected.glossary))throw new Error('醫學詞庫驗證失敗');
  return remote;
}
async function fetchRemotePublicBundle(token){
  try{
    const file=await githubRequest(
      githubContentURL(PUBLIC_BUNDLE_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),
      token
    );
    const remote=JSON.parse(base64Utf8(file.content||''));
    return remote&&typeof remote==='object'?remote:null;
  }catch(e){
    if(/Not Found|404/i.test(e.message))return null;
    throw e;
  }
}
const PUBLIC_DATA_REVISION_KEY='signwell-public-data-revision';
function signalPublicDataRefresh(){
  try{localStorage.setItem(PUBLIC_DATA_REVISION_KEY,String(Date.now()))}catch(_){}
}
async function verifyPublishedTopics(expected,token){
  const file=await githubRequest(
    githubContentURL(V11_TOPICS_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),
    token
  );
  const text=base64Utf8(file.content||'');
  let remote;
  try{remote=JSON.parse(text)}catch(_){throw new Error('GitHub 上的 topics/index.json 不是有效 JSON')}
  if(!Array.isArray(remote))throw new Error('GitHub 上的 topics/index.json 格式錯誤');
  const canon=a=>JSON.stringify((a||[]).map(x=>({
    id:String(x.id||''),name:String(x.name||''),slug:String(x.slug||''),
    description:String(x.description||''),order:Number(x.order||0),active:x.active!==false
  })));
  if(canon(remote)!==canon(expected))throw new Error('GitHub 主題檔驗證失敗：遠端內容與 CMS 不一致');
  return {sha:file.sha||'',count:remote.length};
}
async function publishTopicsOnly(){
  await restoreRememberedGithubToken();
  await ensureGithubWritable(false);

  const revision=Date.now();
  const imageEntries=[],imageCache=new Map();
  const preparedPeople=await v10PreparePeoplePhotos(data.people||[],githubToken,imageEntries,imageCache);
  const bundle=publicBundlePayload(revision,preparedPeople);
  const topicsJSON=JSON.stringify(bundle.topics,null,2)+'\n';
  const siteJS=siteContentJSText();

  const entries=[
    ...imageEntries,
    {path:V11_TOPICS_PATH,mode:'100644',type:'blob',content:topicsJSON},
    {path:PUBLIC_BUNDLE_PATH,mode:'100644',type:'blob',content:publicBundleJSONText(bundle)},
    {path:PUBLIC_GITHUB.sitePath,mode:'100644',type:'blob',content:siteJS}
  ];

  await v10BatchCommit(entries,githubToken,'Update SIGN WELL topics '+new Date().toISOString().slice(0,19).replace('T',' '));
  await verifyPublishedTopics(bundle.topics,githubToken);
  await verifyPublicBundle(bundle,githubToken);

  data.people=preparedPeople;
  persist(true);
  localStorage.setItem(SYNC_KEY,'1');
  signalPublicDataRefresh();
  showToast(`主題、文字與人物圖片已同步並驗證：${bundle.topics.filter(x=>x.active!==false).length} 個公開主題`);
  return true;
}

syncFromGitHub=async function(){const status=$('#ghStatus'),token=currentTokenInput();if(!token){status.textContent='請先到「設定」完成 GitHub PAT 設定。';return}githubToken=token;status.textContent='正在讀取 GitHub 正式文章與主題…';try{const remote=await v10LoadRemoteArticles(token),remoteSite=await fetchRemoteSiteText(token);let remoteTopics=[],bundle=null;try{bundle=await fetchRemotePublicBundle(token)}catch(_){}
if(bundle&&Array.isArray(bundle.topics)){remoteTopics=clone(bundle.topics);remoteSite.siteText={...DEFAULT_SITE_TEXT,...(bundle.siteText||{})};remoteSite.people=Array.isArray(bundle.people)?clone(bundle.people):[]}
else try{remoteTopics=await v11FetchTopicsRaw()}catch(_){const names=[...new Set(remote.articles.map(a=>a.category).filter(Boolean))];remoteTopics=names.map((name,i)=>({id:'topic-remote-'+i,name,slug:slugify(name),description:'瀏覽 '+name+' 相關文章與延伸整理。',order:i,active:true}))}const localDrafts=data.articles.filter(a=>a.status!=='Published'),draftIds=new Set(localDrafts.map(a=>a.id)),merged=[...localDrafts,...clone(remote.articles).filter(a=>!draftIds.has(a.id))];if(data.articles.length&&!(await swConfirm(`將同步 GitHub 上的 ${remote.articles.length} 篇公開文章與 ${remoteTopics.length} 個主題。\n目前 ${localDrafts.length} 篇本機草稿會保留。`,{title:'同步公開網站資料？',kicker:'GITHUB SYNC',confirmText:'開始同步'}))){status.textContent='已取消同步。';return}data={...data,articles:merged,topics:clone(remoteTopics),people:Array.isArray(remoteSite.people)?clone(remoteSite.people):(data.people||[]),glossary:Array.isArray(bundle?.glossary)?clone(bundle.glossary):(data.glossary||[]),siteText:{...DEFAULT_SITE_TEXT,...remoteSite.siteText}};persist(true);localStorage.setItem(SYNC_KEY,'1');await maybeRememberToken(token);status.textContent=`✓ 已同步 ${remote.articles.length} 篇文章、${remoteTopics.length} 個主題與網站文字；保留草稿 ${localDrafts.length} 篇。`;showToast('GitHub 同步完成');renderExport()}catch(e){status.textContent='同步失敗：'+e.message}};
publishGitHub=async function(){const status=$('#ghStatus'),token=currentTokenInput();if(!token){if(status)status.textContent='請先到「設定」完成 GitHub PAT 設定。';return false}githubToken=token;if(status)status.textContent='正在檢查 GitHub 寫入權限與發布目標…';await ensureGithubWritable(false);if(status)status.textContent='正在準備 v10 發布資料…';let remoteIndex=[];try{remoteIndex=await v10FetchIndexRaw()}catch(err){if(err.status!==404)throw err;}const alreadySynced=localStorage.getItem(SYNC_KEY)==='1';if(!alreadySynced&&remoteIndex.length){const localIds=new Set(data.articles.map(a=>a.id)),missing=remoteIndex.filter(a=>!localIds.has(a.id));if(missing.length)throw new Error(`安全阻擋：公開站有 ${missing.length} 篇文章不在這台裝置。請先按「從 GitHub 同步」。`)}
 const published=data.articles.filter(a=>a.status==='Published'),imageEntries=[],imageCache=new Map(),prepared=[];for(let i=0;i<published.length;i++){if(status)status.textContent=`正在處理文章與圖片 ${i+1}/${published.length}…`;prepared.push(await v10PrepareArticle(published[i],token,imageEntries,imageCache))}
 if(status)status.textContent='正在處理 About 人物圖片…';
 const preparedPeople=await v10PreparePeoplePhotos(data.people||[],token,imageEntries,imageCache);
 const metas=prepared.map(v10IndexMeta),entries=[...imageEntries],bundle=publicBundlePayload(Date.now(),preparedPeople);prepared.forEach(a=>{entries.push({path:`articles/${v10SafeSlug(a)}.json`,mode:'100644',type:'blob',content:JSON.stringify(a,null,2)+'\n'});entries.push({path:`article/${v10SafeSlug(a)}/index.html`,mode:'100644',type:'blob',content:swSeoStaticArticleHTML(a)});swArticleIdentitySurfaceEntries(a).forEach(e=>entries.push(e))});entries.push({path:'sitemap.xml',mode:'100644',type:'blob',content:swSeoSitemapXML(prepared)});entries.push({path:'news-sitemap.xml',mode:'100644',type:'blob',content:swSeoNewsSitemapXML(prepared)});entries.push({path:'feed.xml',mode:'100644',type:'blob',content:swSeoFeedXML(prepared)});entries.push({path:V10_INDEX_PATH,mode:'100644',type:'blob',content:JSON.stringify(metas,null,2)+'\n'});entries.push({path:V11_TOPICS_PATH,mode:'100644',type:'blob',content:JSON.stringify(bundle.topics,null,2)+'\n'});entries.push({path:PUBLIC_BUNDLE_PATH,mode:'100644',type:'blob',content:publicBundleJSONText(bundle)});entries.push({path:PUBLIC_GITHUB.sitePath,mode:'100644',type:'blob',content:siteContentJSText()});entries.push({path:PUBLIC_GITHUB.path,mode:'100644',type:'blob',content:'window.BLOG_ARTICLES = '+JSON.stringify(prepared,null,2)+';\n'});
 const liveSlugs=new Set(prepared.map(v10SafeSlug));for(const old of remoteIndex){const s=old.slug;if(s&&!liveSlugs.has(s)){entries.push({path:old.file||`articles/${s}.json`,mode:'100644',type:'blob',sha:null});entries.push({path:`article/${s}/index.html`,mode:'100644',type:'blob',sha:null})}}
 if(status)status.textContent='正在建立單一 GitHub 發布版本…';await v10BatchCommit(entries,token,'Publish SIGN WELL v10 '+new Date().toISOString().slice(0,19).replace('T',' '));
 if(status)status.textContent='正在驗證主題資料…';
 await verifyPublishedTopics(bundle.topics,token);
 await verifyPublicBundle(bundle,token);
 signalPublicDataRefresh();
 // Replace successful data-URL assets in local CMS state with their permanent public paths.
 const byId=new Map(prepared.map(a=>[a.id,a]));data.articles=data.articles.map(a=>byId.has(a.id)?byId.get(a.id):a);data.people=preparedPeople;persist(true);localStorage.setItem(SYNC_KEY,'1');await maybeRememberToken(token);if(status)status.textContent=`✓ v12.2 發布完成：${prepared.length} 篇文章、${(data.topics||[]).length} 個主題、${imageEntries.length} 個新圖片資產（含人物照片）；主題檔已驗證。`;showToast('SIGN WELL v12.2 發布完成');return true};

async function verifyRemoteArticleDeleted(article,token='server-managed'){
  const file=await githubRequest(githubContentURL(V10_INDEX_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),token);
  let list=[];try{list=JSON.parse(base64Utf8(file.content||''))}catch(_){throw new Error('遠端文章索引驗證失敗')}
  if(!Array.isArray(list))throw new Error('遠端文章索引格式錯誤');
  const id=String(article?.id||''),slug=v10SafeSlug(article||{});
  if(list.some(x=>String(x?.id||'')===id||String(x?.slug||'')===slug))throw new Error('公開站仍找到這篇文章，刪除尚未生效');
  return true;
}
async function publishArticleDeletionToGitHub(article,deprecatedIdentity=null){
  await restoreRememberedGithubToken();
  await ensureGithubWritable(false);
  const token=currentTokenInput();
  if(!token)throw new Error('GitHub PAT 尚未在後端設定，無法同步刪除公開文章');
  let remoteIndex=[];
  try{
    const indexFile=await githubRequest(githubContentURL(V10_INDEX_PATH)+'?ref='+encodeURIComponent(PUBLIC_GITHUB.branch)+'&sw='+Date.now(),token);
    remoteIndex=JSON.parse(base64Utf8(indexFile.content||''));
    if(!Array.isArray(remoteIndex))throw new Error('遠端文章索引格式錯誤');
  }catch(e){if(!/not found|404/i.test(String(e?.message||e)))throw e}
  const id=String(article?.id||''),slug=v10SafeSlug(article||{});
  const matched=remoteIndex.filter(x=>String(x?.id||'')===id||String(x?.slug||'')===slug);
  const nextIndex=remoteIndex.filter(x=>!matched.includes(x));
  let legacy=[];
  try{legacy=(await fetchRemoteArticles(token)).articles||[]}catch(e){if(!/not found|404/i.test(String(e?.message||e)))throw e}
  const nextLegacy=legacy.filter(x=>String(x?.id||'')!==id&&v10SafeSlug(x)!==slug);
  const entries=[
    {path:V10_INDEX_PATH,mode:'100644',type:'blob',content:JSON.stringify(nextIndex,null,2)+'\n'},
    {path:PUBLIC_GITHUB.path,mode:'100644',type:'blob',content:'window.BLOG_ARTICLES = '+JSON.stringify(nextLegacy,null,2)+';\n'}
  ];
  const deletePaths=new Set();
  matched.forEach(x=>deletePaths.add(String(x?.file||`articles/${String(x?.slug||slug)}.json`)));
  deletePaths.forEach(path=>entries.push({path,mode:'100644',type:'blob',sha:null}));
  entries.push({path:`article/${slug}/index.html`,mode:'100644',type:'blob',sha:null});
  if(deprecatedIdentity&&/^SW-A-\d{4}-\d{6}$/.test(String(deprecatedIdentity.article_id||''))){const tid=String(deprecatedIdentity.article_id);entries.push({path:`trace/${tid}/index.html`,mode:'100644',type:'blob',content:swArticleIdentityTraceHTML(deprecatedIdentity)});entries.push({path:`trace/${tid}/snapshot.json`,mode:'100644',type:'blob',content:JSON.stringify(deprecatedIdentity,null,2)+'\n'});}
  entries.push({path:'sitemap.xml',mode:'100644',type:'blob',content:swSeoSitemapXML(nextLegacy)});
  entries.push({path:'news-sitemap.xml',mode:'100644',type:'blob',content:swSeoNewsSitemapXML(nextLegacy)});
  entries.push({path:'feed.xml',mode:'100644',type:'blob',content:swSeoFeedXML(nextLegacy)});
  await v10BatchCommit(entries,token,'Delete SIGN WELL article '+slug+' '+new Date().toISOString().slice(0,19).replace('T',' '));
  await verifyRemoteArticleDeleted(article,token);
  signalPublicDataRefresh();
}
async function deleteArticleEverywhere(id){
  const btn=$('#confirmDelete');
  const article=(data.articles||[]).find(a=>String(a.id)===String(id));
  if(!article){$('#confirmModal')?.classList.remove('show');deleteId=null;showToast('找不到要刪除的文章');return}
  const snapshot=clone(article),index=data.articles.findIndex(a=>String(a.id)===String(id));
  const wasPublic=articleHasPublishedReceipt(article);
  const oldText=btn?.textContent||'確認刪除';
  if(btn){btn.disabled=true;btn.textContent=wasPublic?'正在同步刪除…':'正在刪除…'}
  let deprecatedIdentity=null;
  try{
    if(wasPublic&&article?.article_id){const dep=await signwellGasBridge('admin.articleIdentity.deprecate',{articleId:String(article.article_id)},{adminKey:newsletterAdminKey(),timeoutMs:45000});deprecatedIdentity=dep?.identity||null;}
    data.articles=data.articles.filter(a=>String(a.id)!==String(id));
    clearArticlePublishedReceipt(article);
    persist(true);syncPublicSnapshot();renderView();
    if(wasPublic)await publishArticleDeletionToGitHub(snapshot,deprecatedIdentity);
    try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(err){console.warn('CMS cloud delete sync pending',err)}
    $('#confirmModal')?.classList.remove('show');deleteId=null;
    showToast(wasPublic?'文章已從 CMS 與公開全文移除 · Article ID Trace 保留為 DEPRECATED':'文章已刪除');
  }catch(err){
    if(deprecatedIdentity?.article_id){try{await signwellGasBridge('admin.articleIdentity.status',{articleId:String(deprecatedIdentity.article_id),status:'CURRENT'},{adminKey:newsletterAdminKey(),timeoutMs:30000})}catch(_){}}
    if(!data.articles.some(a=>String(a.id)===String(snapshot.id))){
      data.articles.splice(Math.max(0,index),0,snapshot);if(wasPublic)markArticlePublishedReceipt(snapshot);persist(true);syncPublicSnapshot();renderView();
      try{await cmsCloudPushNow(cmsCloudChangeSeq)}catch(_){}
    }
    showToast('刪除失敗，已回復文章：'+String(err?.message||err));
  }finally{
    if(btn){btn.disabled=false;btn.textContent=oldText}
  }
}

function initCmsPremium(){
  if(window.__cmsPremiumBound)return;
  window.__cmsPremiumBound=true;

  const fine=matchMedia('(pointer:fine)').matches &&
    !document.body.classList.contains('perf-lite');
  const useTrigGlass=Boolean(window.SignWellLiquidGlassMotion);

  if(fine&&!useTrigGlass){
    let pointerRAF=0;
    let lastEvent=null;
    let activeCard=null;
    let activeRect=null;

    const renderPointer=()=>{
      pointerRAF=0;
      const e=lastEvent;
      if(!e)return;

      const el=e.target.closest?.('.lock-card,.stat,.panel');
      if(!el)return;

      if(el!==activeCard){
        activeCard=el;
        activeRect=el.getBoundingClientRect();
      }

      const r=activeRect;
      if(!r||!r.width||!r.height)return;

      const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
      const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));

      el.style.setProperty('--px',(x*100).toFixed(1)+'%');
      el.style.setProperty('--py',(y*100).toFixed(1)+'%');
      el.style.setProperty('--ry',((x-.5)*4).toFixed(2)+'deg');
      el.style.setProperty('--rx',((.5-y)*3.2).toFixed(2)+'deg');
    };

    document.addEventListener('pointermove',e=>{
      lastEvent=e;
      if(!pointerRAF)pointerRAF=requestAnimationFrame(renderPointer);
    },{passive:true});

    document.addEventListener('pointerout',e=>{
      const el=e.target.closest?.('.lock-card,.stat,.panel');
      if(!el||e.relatedTarget&&el.contains(e.relatedTarget))return;
      el.style.setProperty('--rx','0deg');
      el.style.setProperty('--ry','0deg');
      if(el===activeCard){
        activeCard=null;
        activeRect=null;
      }
    },{passive:true});

    window.addEventListener('resize',()=>{
      activeRect=null;
    },{passive:true});
  }

  /* Use Web Animations when available; avoid the old offsetWidth forced reflow. */
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest?.('button');
    if(!b||b.closest?.('#editorToolbar')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;

    if(typeof b.animate==='function'){
      b.animate(
        [
          {transform:'scale(1)'},
          {transform:'scale(.965)',offset:.34},
          {transform:'scale(1.012)',offset:.72},
          {transform:'scale(1)'}
        ],
        {duration:300,easing:'cubic-bezier(.2,.72,.22,1)'}
      );
    }
  },{passive:true});

  const io=new IntersectionObserver(es=>{
    es.forEach(x=>{
      if(x.isIntersecting){
        x.target.classList.add('in-view');
        io.unobserve(x.target);
      }
    });
  },{threshold:.05,rootMargin:'80px 0px'});

  let scanRAF=0;
  const scan=()=>{
    scanRAF=0;
    const root=$('#view');
    if(!root)return;
    root.querySelectorAll('.stat,.panel,.editor-main,.editor-side,.publish-card').forEach(el=>{
      if(el.dataset.fxBound)return;
      el.dataset.fxBound='1';
      el.classList.add('reveal-fx');
      io.observe(el);
    });
  };
  const scheduleScan=()=>{
    if(!scanRAF)scanRAF=requestAnimationFrame(scan);
  };

  const root=$('#view');
  if(root){
    new MutationObserver(scheduleScan).observe(root,{childList:true,subtree:true});
    scheduleScan();
  }
}


// SIGN WELL v23.9.62 · Canva Social Editorial Integration
/* SIGN WELL · Canva Social Editorial Integration */
const swCanvaState={status:null,brief:null,selectedArticleId:'',busy:false,lastResult:null};

function swCanvaArticlePayload(a){
  if(!a)return{};
  const html=articleHTML(a);
  return {
    id:String(a.id||''),title:String(a.title||''),subtitle:String(a.subtitle||''),slug:String(a.slug||''),category:String(a.category||''),summary10s:String(a.summary10s||''),excerpt:String(a.excerpt||plainFromHTML(html).slice(0,700)),cover:String(a.cover||''),publishedAt:String(a.publishedAt||''),updatedAt:String(a.updatedAt||''),contentHtml:String(html||'').slice(0,42000),evidenceCards:Array.isArray(a.evidenceCards)?clone(a.evidenceCards.slice(0,3)):[],signWellVerdict:a.signWellVerdict&&typeof a.signWellVerdict==='object'?clone(a.signWellVerdict):{},references:Array.isArray(a.references)?clone(a.references.slice(0,12)):[]
  };
}
function swCanvaRequest(action,payload={},timeoutMs=45000){return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey(),timeoutMs});}
function swCanvaDesignUrls(d){d=d||{};const u=d.urls||{};return{editUrl:String(u.edit_url||d.edit_url||d.url||''),viewUrl:String(u.view_url||d.view_url||''),designId:String(d.id||'')}}
function swCanvaSelectedArticle(){const id=swCanvaState.selectedArticleId||sessionStorage.getItem('sw-canva-article')||'';let a=data.articles.find(x=>String(x.id)===String(id));if(!a)a=data.articles.find(articleHasPublishedReceipt)||data.articles[0]||null;if(a){swCanvaState.selectedArticleId=a.id;try{sessionStorage.setItem('sw-canva-article',String(a.id))}catch(_){}}return a}
function swCanvaSetBusy(on,label=''){swCanvaState.busy=Boolean(on);document.getElementById('canvaRoot')?.classList.toggle('canva-loading',Boolean(on));['canvaPreviewBtn','canvaGenerateBtn','canvaConnectBtn','canvaSaveConfig'].forEach(id=>{const el=document.getElementById(id);if(el)el.disabled=Boolean(on)});if(label)showToast(label)}
function swCanvaStatusBadge(){const s=swCanvaState.status||{};const cls=s.connected?'ready':'';const text=s.connected?'Canva 已連線':s.configured?'等待 Canva 授權':'尚未設定 Canva App';return `<span class="canva-status-pill ${cls}" id="canvaStatusPill"><i></i>${escapeHTML(text)}</span>`}
function swCanvaArticleOptions(){const list=data.articles.slice().sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));return list.map(a=>`<option value="${escapeHTML(a.id)}" ${String(a.id)===String(swCanvaSelectedArticle()?.id)?'selected':''}>${escapeHTML(a.title||'未命名文章')} · ${articleHasPublishedReceipt(a)?'已發布':'草稿'}</option>`).join('')}
function swCanvaSetupHtml(){const s=swCanvaState.status||{};return `<section class="canva-card"><div class="canva-card-head"><div><strong>Canva Connect</strong><small>OAuth · PKCE · Token 只存 Apps Script</small></div>${swCanvaStatusBadge()}</div><div class="canva-card-body"><div class="canva-fields"><label class="wide">Redirect URI<div class="canva-redirect"><input id="canvaRedirectUri" readonly value="${escapeHTML(s.redirectUri||'重新部署 Code.gs 後會顯示 /exec URL')}"><button class="top-action" id="canvaCopyRedirect" type="button">複製</button></div></label><label>Canva Client ID<input id="canvaClientId" value="${escapeHTML(s.clientId||'')}" placeholder="Canva Developer App Client ID"></label><label>來源設計 ID（Canonical 視覺模板）<input id="canvaSourceDesignId" value="${escapeHTML(s.sourceDesignId||'DAHVMbP6jFU')}" placeholder="D…"></label></div><div class="canva-actions"><button id="canvaSaveConfig" type="button">儲存 Client ID / Design ID</button><button id="canvaSecretBtn" type="button">${s.clientSecretConfigured?'更換 Client Secret':'設定 Client Secret'}</button><button id="canvaConnectBtn" type="button" class="primary">${s.connected?'重新授權 Canva':'連結 Canva'}</button><button id="canvaDisconnectBtn" type="button" class="danger" ${s.connected?'':'disabled'}>中斷連結</button><a href="https://www.canva.com/developers/" target="_blank" rel="noopener">開啟 Canva Developers ↗</a></div><div class="canva-setup-steps"><div class="canva-setup-step"><b>1</b><span>在 Canva Developers 建立 Connect API integration，把上面的 Redirect URI 加進 OAuth Redirect URLs。</span></div><div class="canva-setup-step"><b>2</b><span>回 CMS 填 Client ID，Client Secret 會經管理密碼 step-up 後安全存到 Script Properties，不會回傳到瀏覽器。</span></div><div class="canva-setup-step"><b>3</b><span>按「連結 Canva」完成授權。這個版本直接 Autofill 指定 Source Design 的原生欄位；AI 只替換 Hook、Structure、Evidence、Verdict、Caption 等內容，不再重新建立版型。</span></div></div><div class="canva-hint">需要 scopes：design:content:read · design:meta:read · design:content:write · profile:read。目前 Source Design 已掛上 SIGN WELL Autofill dataset。正常路徑直接建立原模板副本並填入內容；只有 Canva Autofill API 明確不可用時才使用舊 HTML Import fallback。</div></div></section>`}
function swCanvaWorkspaceHtml(){const a=swCanvaSelectedArticle(),saved=a?.canvaSocial||{};return `<section class="canva-card canva-workspace"><div class="canva-card-head"><div><strong>Social Pack</strong><small>IG = Hook + 內容摘要；完整文章留在 SIGN WELL 網站</small></div><span class="badge">1080 × 1350 · 5 張 + Caption Preview</span></div><div class="canva-card-body"><div class="canva-social-top"><select id="canvaArticleSelect" class="canva-article-select">${swCanvaArticleOptions()}</select><div class="canva-actions" style="margin:0"><button id="canvaPreviewBtn" type="button">產生內容預覽</button><button id="canvaGenerateBtn" class="primary" type="button">建立 Canva</button></div></div><div id="canvaBriefArea">${swCanvaBriefHtml(saved.brief||swCanvaState.brief)}</div><div class="canva-result ${saved.editUrl?'show':''}" id="canvaResult">${saved.editUrl?`<strong>已建立 Canva Social Pack</strong><p>${escapeHTML(saved.generatedAt||'')}</p><div class="canva-actions"><a class="primary" href="${escapeHTML(saved.editUrl)}" target="_blank" rel="noopener">在 Canva 編輯 ↗</a>${saved.viewUrl?`<a href="${escapeHTML(saved.viewUrl)}" target="_blank" rel="noopener">查看預覽 ↗</a>`:''}</div>`:''}</div></div></section>`}
function swCanvaBriefHtml(brief){if(!brief)return `<div class="canva-hint">選一篇文章後按「產生內容預覽」。系統會先建立 Editorial Map：Hook → What is changing → Structure → Evidence → Verdict；第 6 頁只做 Caption Preview，不會發布成 Carousel。</div>`;const map=brief.editorialMap||{},change=map.change||{},structure=map.structure||{},evidence=map.evidence||{},verdict=map.verdict||{},caption=map.caption||{};const steps=Array.isArray(change.steps)?change.steps:[],layers=Array.isArray(structure.layers)?structure.layers:[];const fmt=arr=>arr.map(x=>`${x.label||''}｜${x.text||''}`).join(' / ');return `<div class="canva-meta-line"><span>${escapeHTML(brief.templateModel||'signwell-editorial-5plus1-v2')}</span><span>Carousel 5 張</span><span>Caption Preview 1 張</span></div><div class="canva-pack-grid"><div class="canva-pack-tile"><small>01 · COVER / HOOK</small><strong>${escapeHTML(brief.hook||brief.title||'')}</strong><p>${escapeHTML(brief.subheadline||'')}</p></div><div class="canva-pack-tile"><small>02 · WHAT IS CHANGING</small><strong>${escapeHTML(change.headline||brief.page2Title||'')}</strong><p>${escapeHTML(fmt(steps)||'尚未拆解')}</p></div><div class="canva-pack-tile"><small>03 · STRUCTURE</small><strong>${escapeHTML(structure.headline||brief.page3Title||'')}</strong><p>${escapeHTML(fmt(layers)||'尚未拆解')}</p></div><div class="canva-pack-tile"><small>04 · EVIDENCE & LIMITATIONS</small><strong>${escapeHTML(evidence.headline||brief.page4Title||'')}</strong><p>${escapeHTML(evidence.snapshotBody||brief.evidence?.claim||'Evidence Locked')}</p></div><div class="canva-pack-tile"><small>05 · SIGN WELL VERDICT</small><strong>${escapeHTML(verdict.headline||brief.page5Title||'')}</strong><p>${escapeHTML(verdict.verdictLine||(brief.verdict||[]).join(' · ')||brief.limitation||'')}</p></div><div class="canva-pack-tile"><small>06 · CAPTION PREVIEW · INTERNAL</small><strong>${escapeHTML(caption.lead||brief.title||'')}</strong><p>${escapeHTML(caption.context||brief.caption||'')}</p></div></div><textarea class="canva-caption" id="canvaCaption" readonly>${escapeHTML(brief.caption||'')}</textarea><div class="canva-actions"><button id="canvaCopyCaption" type="button">複製 IG 內文</button><button id="canvaCopyUrl" type="button">複製完整文章連結</button></div>`}

const swMetaPublishState={busy:false,status:null};
function swMetaPublishSaved(a){return a?.socialPublishDraft&&typeof a.socialPublishDraft==='object'?a.socialPublishDraft:{};}
function swMetaPublishHtml(){
  const a=swCanvaSelectedArticle(),saved=swMetaPublishSaved(a),brief=a?.canvaSocial?.brief||swCanvaState.brief||{},history=Array.isArray(a?.socialPublishHistory)?a.socialPublishHistory:[];
  const caption=String(saved.caption||brief.caption||''),link=String(saved.link||brief.url||''),media=(saved.mediaUrls||[]).join('\n'),ps=Array.isArray(saved.platforms)?saved.platforms:null;
  const result=history[0];
  return `<section class="canva-card meta-publish-card"><div class="canva-card-head"><div><strong>Meta 發布</strong><small>先預覽／建立草稿，再由你確認才送出 · Facebook → Threads → Instagram</small></div><span class="badge" id="metaPubReadyBadge">檢查平台…</span></div><div class="canva-card-body"><div class="meta-publish-platforms"><label class="meta-publish-platform"><input type="checkbox" id="metaPubFacebook" ${!ps||ps.includes('facebook')?'checked':''}>Facebook</label><label class="meta-publish-platform"><input type="checkbox" id="metaPubThreads" ${!ps||ps.includes('threads')?'checked':''}>Threads</label><label class="meta-publish-platform"><input type="checkbox" id="metaPubInstagram" ${!ps||ps.includes('instagram')?'checked':''}>Instagram</label></div><label style="display:grid;gap:6px;font-size:9px;font-weight:800;color:#7e8c97">Social Caption<textarea id="metaPubCaption" class="meta-publish-caption">${escapeHTML(caption)}</textarea></label><div class="meta-publish-row"><label>完整文章連結<input id="metaPubLink" value="${escapeHTML(link)}" placeholder="https://…"></label><label>圖片來源<select id="metaPubMediaMode"><option value="canva" ${saved.mediaMode!=='manual'?'selected':''}>Canva 5 張 Carousel</option><option value="manual" ${saved.mediaMode==='manual'?'selected':''}>手動 HTTPS 圖片 URL</option></select></label></div><label style="display:grid;gap:6px;margin-top:10px;font-size:9px;font-weight:800;color:#7e8c97">手動圖片 URL（每行一個；Canva 模式可留空）<textarea id="metaPubMedia" class="meta-publish-media" placeholder="https://…/image-1.png">${escapeHTML(media)}</textarea></label><div class="canva-hint">Instagram：1 張＝單圖，2–10 張＝Carousel。Canva 模式只匯出第 1–5 頁；第 6 頁 Caption Preview 永遠不作為圖片發布。Facebook / Threads 目前使用第一張並保留完整文章連結。</div><div class="canva-actions"><button type="button" id="metaPubDraft">建立社群草稿</button><button type="button" class="primary" id="metaPubPublish">確認並發布</button></div><div id="metaPubResult">${swMetaPublishResultHtml(result)}</div></div></section>`;
}
function swMetaPublishResultHtml(item){if(!item)return '<div class="canva-hint">尚未發布。文章上線不會自動發社群。</div>';const rs=Array.isArray(item.results)?item.results:[];return `<div class="meta-publish-result">${rs.map(r=>`<div class="${r.ok?'ok':'fail'}"><b>${escapeHTML(String(r.platform||'').toUpperCase())} · ${r.ok?'已發布':'失敗'}</b>${r.permalink?` · <a href="${escapeHTML(r.permalink)}" target="_blank" rel="noopener">查看貼文 ↗</a>`:''}<br>${escapeHTML(r.warning||r.error||r.id||'')}</div>`).join('')}</div>`;}
function swMetaPublishCollect(){const a=swCanvaSelectedArticle(),platforms=[];if(document.getElementById('metaPubFacebook')?.checked)platforms.push('facebook');if(document.getElementById('metaPubThreads')?.checked)platforms.push('threads');if(document.getElementById('metaPubInstagram')?.checked)platforms.push('instagram');const mediaMode=document.getElementById('metaPubMediaMode')?.value||'canva';const mediaUrls=String(document.getElementById('metaPubMedia')?.value||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);return{a,platforms,caption:document.getElementById('metaPubCaption')?.value.trim()||'',link:document.getElementById('metaPubLink')?.value.trim()||'',mediaMode,mediaUrls};}
function swMetaPublishSaveDraft(){const x=swMetaPublishCollect();if(!x.a)return;if(!x.platforms.length){showToast('請至少選一個平台');return}x.a.socialPublishDraft={platforms:x.platforms,caption:x.caption,link:x.link,mediaMode:x.mediaMode,mediaUrls:x.mediaUrls,updatedAt:new Date().toISOString()};persist(true);showToast('社群草稿已儲存；尚未送到 Meta');}
async function swMetaPublishNow(){const x=swMetaPublishCollect();if(!x.a)return;if(!articleHasPublishedReceipt(x.a)){showToast('請先把完整文章發布到網站，再發社群');return}if(!x.platforms.length){showToast('請至少選一個平台');return}if(x.platforms.includes('instagram')&&x.mediaMode==='canva'&&!x.a?.canvaSocial?.designId){showToast('Instagram 需要圖片；請先建立 Canva Social Pack');return}if(x.platforms.includes('instagram')&&x.mediaMode==='manual'&&!x.mediaUrls.length){showToast('Instagram 需要至少一張 HTTPS 圖片');return}const names=x.platforms.map(p=>p==='facebook'?'Facebook':p==='threads'?'Threads':'Instagram').join('、');const ok=await swConfirm(`即將把這篇文章發布到：${names}\n\n這會建立真正的社群貼文，送出後無法由 SIGN WELL 自動收回。`,{title:'確認發布 Meta？',kicker:'SOCIAL PUBLISH',tone:'warning',confirmText:'確認並發布'});if(!ok)return;const btn=document.getElementById('metaPubPublish'),old=btn?.textContent||'';if(btn){btn.disabled=true;btn.textContent='發布中…'}try{const jobId='sw_'+String(x.a.id||'article')+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);const r=await swCanvaRequest('admin.meta.publish',{jobId,platforms:x.platforms,caption:x.caption,link:x.link,useCanva:x.mediaMode==='canva',canvaDesignId:x.a?.canvaSocial?.designId||'',mediaUrls:x.mediaUrls},180000);x.a.socialPublishDraft={platforms:x.platforms,caption:x.caption,link:x.link,mediaMode:x.mediaMode,mediaUrls:x.mediaUrls,updatedAt:new Date().toISOString()};x.a.socialPublishHistory=[{...r,jobId,requestedPlatforms:x.platforms}].concat(Array.isArray(x.a.socialPublishHistory)?x.a.socialPublishHistory:[]).slice(0,20);persist(true);const el=document.getElementById('metaPubResult');if(el)el.innerHTML=swMetaPublishResultHtml(x.a.socialPublishHistory[0]);showToast(r.complete?'Meta 發布完成':'Meta 發布完成部分平台，請查看結果')}catch(err){showToast('Meta 發布失敗：'+String(err?.message||err))}finally{if(btn){btn.disabled=false;btn.textContent=old}}}
function swBindMetaPublisher(){document.getElementById('metaPubDraft')?.addEventListener('click',swMetaPublishSaveDraft);document.getElementById('metaPubPublish')?.addEventListener('click',swMetaPublishNow);swCanvaRequest('admin.meta.publishStatus',{},30000).then(s=>{swMetaPublishState.status=s;const map={facebook:'metaPubFacebook',threads:'metaPubThreads',instagram:'metaPubInstagram'};let ready=0;Object.keys(map).forEach(k=>{const el=document.getElementById(map[k]),ok=Boolean(s?.platforms?.[k]?.ready);if(el){el.disabled=!ok;if(!ok)el.checked=false;el.closest('label')?.classList.toggle('disabled',!ok);el.title=ok?'已連線':'請先到設定完成 '+k+' API 授權'}if(ok)ready++});const badge=document.getElementById('metaPubReadyBadge');if(badge)badge.textContent=ready?`${ready}/3 READY`:'尚未連線 Meta'}).catch(()=>{const badge=document.getElementById('metaPubReadyBadge');if(badge)badge.textContent='Meta 狀態未知'})}
function swMetaPublishRefreshPanel(){const old=document.querySelector('.meta-publish-card');if(!old)return;const wrap=document.createElement('div');wrap.innerHTML=swMetaPublishHtml();const fresh=wrap.firstElementChild;old.replaceWith(fresh);swBindMetaPublisher();}

function renderCanvaSocial(){
  setMedicalNewsPersistentMode(false);
  const root=document.getElementById('view');
  if(!root)return;
  const savedStep=Number(sessionStorage.getItem('sw-social-studio-step')||1);
  swCanvaState.socialStep=Math.min(4,Math.max(1,Number(swCanvaState.socialStep||savedStep||1)));
  const a=swCanvaSelectedArticle();
  if(a?.canvaSocial?.brief)swCanvaState.brief=clone(a.canvaSocial.brief);
  root.innerHTML=`<div id="canvaRoot" class="social-studio"><div class="social-studio-head"><div><h1>Social Studio</h1><p>從文章到社群圖文，用對話調整文案、版面與視覺，再送進 Canva。Evidence、研究數字與 SIGN WELL Verdict 由後端鎖定，不會被聊天指令竄改。</p></div>${swCanvaStatusBadge()}</div>${socialStudioStepperHtml()}<div id="socialStudioStageHost" class="social-studio-stage"></div></div>`;
  socialStudioBindStepper();
  socialStudioRenderCurrentStep();
  swCanvaRefreshStatus(false).then(()=>{if(Number(swCanvaState.socialStep)===3)socialStudioRenderCurrentStep();}).catch(()=>{});
}
async function swCanvaRefreshStatus(live=false){try{const s=await swCanvaRequest('admin.canva.status',{live},30000);swCanvaState.status=s;const pill=document.getElementById('canvaStatusPill');if(pill){pill.classList.toggle('ready',Boolean(s.connected));pill.innerHTML=`<i></i>${escapeHTML(s.connected?'Canva 已連線':s.configured?'等待 Canva 授權':'尚未設定 Canva App')}`};const redirect=document.getElementById('canvaRedirectUri');if(redirect)redirect.value=s.redirectUri||'';const cid=document.getElementById('canvaClientId');if(cid&&!cid.matches(':focus'))cid.value=s.clientId||'';const sid=document.getElementById('canvaSourceDesignId');if(sid&&!sid.matches(':focus'))sid.value=s.sourceDesignId||'DAHVMbP6jFU';const secret=document.getElementById('canvaSecretBtn');if(secret)secret.textContent=s.clientSecretConfigured?'更換 Client Secret':'設定 Client Secret';const connect=document.getElementById('canvaConnectBtn');if(connect)connect.textContent=s.connected?'重新授權 Canva':'連結 Canva';const disconnect=document.getElementById('canvaDisconnectBtn');if(disconnect)disconnect.disabled=!s.connected}catch(err){showToast('Canva 狀態讀取失敗：'+String(err?.message||err))}}
async function swCanvaSaveConfig(){const clientId=document.getElementById('canvaClientId')?.value.trim()||'',sourceDesignId=document.getElementById('canvaSourceDesignId')?.value.trim()||'';try{swCanvaSetBusy(true);swCanvaState.status=await swCanvaRequest('admin.canva.configure',{clientId,sourceDesignId},30000);showToast('Canva 設定已儲存');swCanvaRefreshStatus(false)}finally{swCanvaSetBusy(false)}}
async function swCanvaSetSecret(){await openSecretVaultDialog({target:'canva',title:swCanvaState.status?.clientSecretConfigured?'更換 Canva Client Secret':'設定 Canva Client Secret',secretLabel:'Canva Client Secret',placeholder:'cnvca…',onCommit:async({secret,secretAuthToken})=>{const clientId=document.getElementById('canvaClientId')?.value.trim()||swCanvaState.status?.clientId||'',sourceDesignId=document.getElementById('canvaSourceDesignId')?.value.trim()||swCanvaState.status?.sourceDesignId||'';const r=await swCanvaRequest('admin.canva.configure',{clientId,sourceDesignId,clientSecret:secret,secretAuthToken},35000);swCanvaState.status=r;showToast('Canva Client Secret 已安全保存');await swCanvaRefreshStatus(false)}})}
async function swCanvaConnect(){let popup=null;try{popup=window.open('about:blank','signwellCanvaOAuth','width=640,height=780,resizable=yes,scrollbars=yes');if(!popup){showToast('瀏覽器封鎖了彈出視窗，請允許後再試');return}popup.document.write('<!doctype html><meta charset="utf-8"><title>SIGN WELL</title><p style="font-family:Microsoft JhengHei UI,Microsoft JhengHei,微軟正黑體,Yuanti TC,PingFang TC,sans-serif;padding:30px">正在準備 Canva 授權…</p>');swCanvaSetBusy(true,'正在準備 Canva 授權…');await swCanvaSaveConfig();const r=await swCanvaRequest('admin.canva.oauthStart',{},30000);popup.location.replace(r.authUrl)}catch(err){try{popup?.close()}catch(_){}showToast(String(err?.message||err))}finally{swCanvaSetBusy(false)}}
async function swCanvaDisconnect(){if(!(await swConfirm('要中斷 SIGN WELL 與 Canva 的 OAuth 連結嗎？\nClient ID / Secret 會保留，之後可重新授權。',{title:'中斷 Canva？',kicker:'CANVA CONNECT',danger:true,confirmText:'中斷連結'})))return;try{swCanvaSetBusy(true);await swCanvaRequest('admin.canva.disconnect',{},30000);showToast('Canva 已中斷');await swCanvaRefreshStatus(false)}finally{swCanvaSetBusy(false)}}
async function swCanvaPreviewArticle(a){if(!a)return;try{swCanvaSetBusy(true,'正在整理 Social Brief…');const r=await swCanvaRequest('admin.canva.preview',{article:swCanvaArticlePayload(a)},90000);swCanvaState.brief=r.brief||null;const area=document.getElementById('canvaBriefArea');if(area){area.innerHTML=swCanvaBriefHtml(swCanvaState.brief);swBindCanvaBriefButtons();swMetaPublishRefreshPanel()}showToast('Social Pack 內容預覽完成')}catch(err){showToast('Canva 預覽失敗：'+String(err?.message||err))}finally{swCanvaSetBusy(false)}}
async function swCanvaAwaitImportJob(jobId){const started=Date.now();while(Date.now()-started<70000){const r=await swCanvaRequest('admin.canva.jobStatus',{jobId},25000);const j=r.job||{};if(j.status==='success')return j;if(j.status==='failed')throw new Error(j.error?.message||j.error?.code||'Canva 建立失敗');await new Promise(res=>setTimeout(res,2200))}throw new Error('Canva 還在處理，請稍後重試；不會重複產生同一份內容。')}
async function swCanvaGenerateForArticle(a){
  if(!a)return;
  try{
    swCanvaSetBusy(true,'正在建立 Canva Social Pack…');
    const saved=a.canvaSocial&&typeof a.canvaSocial==='object'?a.canvaSocial:{};
    const brief=saved.brief||swCanvaState.brief||await socialStudioEnsureBrief();
    if(!brief)throw new Error('請先完成 Social Brief');
    let r=await swCanvaRequest('admin.canva.generate',{article:swCanvaArticlePayload(a),brief:clone(brief)},150000),design=r.design||null;
    if(r.pending&&r.jobId){const j=await swCanvaAwaitImportJob(r.jobId),ds=j.result?.designs||[];design=ds[0]||null}
    const urls=swCanvaDesignUrls(design||{});if(!urls.editUrl)throw new Error(r.warning||'Canva 已處理，但沒有取得可編輯連結');
    swCanvaState.brief=r.brief||brief;swCanvaState.lastResult=r;
    const previous=Array.isArray(saved.previousDesigns)?saved.previousDesigns.slice():[];
    if(saved.designId&&saved.editUrl){previous.unshift({designId:saved.designId,editUrl:saved.editUrl,viewUrl:saved.viewUrl||'',generatedAt:saved.generatedAt||''});}
    const dedup=[];const seen=new Set();previous.forEach(x=>{const key=String(x.designId||x.editUrl||'');if(key&&!seen.has(key)){seen.add(key);dedup.push(x)}});
    a.canvaSocial={...saved,designId:urls.designId,editUrl:urls.editUrl,viewUrl:urls.viewUrl,generatedAt:new Date().toISOString(),mode:r.mode||'',fallback:Boolean(r.fallback),brief:clone(r.brief||brief),previousDesigns:dedup.slice(0,5)};
    persist(true);
    if(viewName==='canva'){swCanvaState.socialStep=3;socialStudioRenderCurrentStep();}
    showToast(saved.designId?'Canva 更新版已建立':'Canva Social Pack 已建立');
    window.open(urls.editUrl,'_blank','noopener');
  }catch(err){showToast('建立 Canva 失敗：'+String(err?.message||err))}finally{swCanvaSetBusy(false)}
}
function swBindCanvaBriefButtons(){document.getElementById('canvaCopyCaption')?.addEventListener('click',async()=>{const v=document.getElementById('canvaCaption')?.value||'';try{await navigator.clipboard.writeText(v);showToast('IG 內文已複製')}catch(_){showToast('無法存取剪貼簿')}});document.getElementById('canvaCopyUrl')?.addEventListener('click',async()=>{const u=swCanvaState.brief?.url||swCanvaSelectedArticle()?.canvaSocial?.brief?.url||'';try{await navigator.clipboard.writeText(u);showToast('完整文章連結已複製')}catch(_){showToast('無法存取剪貼簿')}})}
function swBindCanvaPage(){document.getElementById('canvaCopyRedirect')?.addEventListener('click',async()=>{const v=document.getElementById('canvaRedirectUri')?.value||'';try{await navigator.clipboard.writeText(v);showToast('Redirect URI 已複製')}catch(_){}});document.getElementById('canvaSaveConfig')?.addEventListener('click',swCanvaSaveConfig);document.getElementById('canvaSecretBtn')?.addEventListener('click',swCanvaSetSecret);document.getElementById('canvaConnectBtn')?.addEventListener('click',swCanvaConnect);document.getElementById('canvaDisconnectBtn')?.addEventListener('click',swCanvaDisconnect);document.getElementById('canvaArticleSelect')?.addEventListener('change',e=>{swCanvaState.selectedArticleId=e.target.value;try{sessionStorage.setItem('sw-canva-article',e.target.value)}catch(_){}swCanvaState.brief=null;const a=swCanvaSelectedArticle();document.getElementById('canvaBriefArea').innerHTML=swCanvaBriefHtml(a?.canvaSocial?.brief||null);const r=document.getElementById('canvaResult');if(r){r.classList.toggle('show',Boolean(a?.canvaSocial?.editUrl));r.innerHTML=a?.canvaSocial?.editUrl?`<strong>已建立 Canva Social Pack</strong><div class="canva-actions"><a class="primary" href="${escapeHTML(a.canvaSocial.editUrl)}" target="_blank" rel="noopener">在 Canva 編輯 ↗</a></div>`:''}swBindCanvaBriefButtons();swMetaPublishRefreshPanel()});document.getElementById('canvaPreviewBtn')?.addEventListener('click',()=>swCanvaPreviewArticle(swCanvaSelectedArticle()));document.getElementById('canvaGenerateBtn')?.addEventListener('click',()=>swCanvaGenerateForArticle(swCanvaSelectedArticle()));swBindCanvaBriefButtons()}

function socialStudioStepperHtml(){
  const step=Number(swCanvaState.socialStep||1);
  const items=[['1','選文章','SOURCE'],['2','AI 圖文工作室','CHAT'],['3','Canva','DESIGN'],['4','社群發布','PUBLISH']];
  return `<div class="social-studio-stepper" aria-label="Social Studio 流程">${items.map(x=>`<button type="button" class="social-studio-step ${step===Number(x[0])?'active':''}" data-social-step="${x[0]}"><b>${x[0]}</b><span><strong>${x[1]}</strong><small>${x[2]}</small></span></button>`).join('')}</div>`;
}
function socialStudioSelectedSaved(){const a=swCanvaSelectedArticle();return a&&a.canvaSocial&&typeof a.canvaSocial==='object'?a.canvaSocial:{};}
function socialStudioChatHistory(){const saved=socialStudioSelectedSaved();return Array.isArray(saved.chatHistory)?saved.chatHistory.slice(-12):[];}
function socialStudioVisualTags(brief){const v=brief?.visual||{},l=brief?.layout||{};return `<div class="social-visual-tags"><span>${escapeHTML(v.palette||'blue-pink')}</span><span>${escapeHTML(v.tone||'editorial')}</span><span>${escapeHTML(v.density||'balanced')}</span><span>P4 · ${escapeHTML(l.page4||'auto')}</span></div>`;}
function socialStudioArticleReadinessHtml(a){if(!a)return '';const evidence=Array.isArray(a.evidenceCards)?a.evidenceCards.length:0;const published=articleHasPublishedReceipt(a);const saved=a.canvaSocial||{};return `<div class="social-article-summary"><div><span>文章狀態</span><strong>${published?'已發布':'草稿，可先製作圖文'}</strong></div><div><span>Evidence</span><strong>${evidence?`${evidence} 張 Evidence Card`:'未附 Evidence Card'}</strong></div><div><span>Social Pack</span><strong>${saved.designId?'已有 Canva 版本':'尚未建立 Canva'}</strong></div></div>`;}
function socialStudioStage1Html(){const a=swCanvaSelectedArticle();return `<section class="social-studio-card"><h2>先選文章</h2><p>Social Studio 只處理已存在於 CMS 的文章內容。之後的 AI 對話只能改呈現方式，不會重新發明醫療證據。</p><div class="social-article-picker"><select id="canvaArticleSelect">${swCanvaArticleOptions()}</select><button type="button" class="social-studio-primary" id="socialStudioStart">進入 AI 圖文工作室</button></div>${socialStudioArticleReadinessHtml(a)}<div class="canva-hint" style="margin-top:14px">文章尚未正式發布也可以先做圖；但第 4 階段真正發布 Meta 前，仍會要求網站文章已經上線。</div></section>`;}
function socialStudioChatHtml(){const history=socialStudioChatHistory();const messages=history.length?history.map(m=>`<div class="social-chat-msg ${m.role==='user'?'user':'assistant'}">${escapeHTML(m.text||'')}</div>`).join(''):`<div class="social-chat-empty">可以直接說：「第二頁縮成三個重點」、「第四頁改 Evidence Card」、「整體更臨床、更極簡」。Evidence、研究數字與 Verdict 已鎖定。</div>`;return `<section class="social-studio-chat"><div class="social-chat-head"><div><strong>AI 圖文工作室</strong><small>文字 × 版面 × 視覺風格</small></div><span class="social-lock-badge">◉ Evidence Locked</span></div><div class="social-chat-messages" id="socialStudioChatMessages">${messages}</div><div class="social-chat-chips"><button class="social-chat-chip" data-social-prompt="第二頁字太多，縮成三個重點">縮短第二頁</button><button class="social-chat-chip" data-social-prompt="第四頁不要圖表，改成 Evidence Card">改 Evidence Card</button><button class="social-chat-chip" data-social-prompt="整體改得更臨床專業、更極簡，減少裝飾">更臨床極簡</button><button class="social-chat-chip" data-social-prompt="整體更溫暖一點，但不要像廣告">更溫暖</button></div><div class="social-chat-compose"><textarea id="socialStudioChatInput" maxlength="1200" placeholder="告訴我你想怎麼修改這組圖文…"></textarea><button type="button" id="socialStudioSendMessage" aria-label="送出訊息" title="送出"><span aria-hidden="true">↑</span></button></div><div class="social-chat-tools"><button type="button" id="socialStudioUndo" ${swCanvaState.undoBrief?'':'disabled'}>↶ 復原上一次</button><span style="font-size:8px;color:#94a0a8">不允許修改 Evidence 數字</span></div></section>`;}
function socialStudioStage2Html(){const a=swCanvaSelectedArticle(),brief=a?.canvaSocial?.brief||swCanvaState.brief||null;if(!brief)return `<div class="social-studio-empty"><div><strong>正在準備 Social Brief</strong><p>第一次會從文章抽取 Hook、重點、Evidence、Verdict 與 CTA。</p><button type="button" class="social-studio-primary" id="socialStudioPrepareBrief" style="margin-top:14px">產生內容預覽</button></div></div>`;return `<div class="social-studio-split">${socialStudioChatHtml()}<section class="social-preview-panel"><div class="social-preview-head"><strong>即時模板預覽 · 5 張發布 + Caption</strong>${socialStudioVisualTags(brief)}</div><div id="canvaBriefArea">${swCanvaBriefHtml(brief)}</div></section></div><div class="social-studio-footer"><button type="button" class="social-studio-secondary" data-social-prev>← 返回選文章</button><button type="button" class="social-studio-primary" data-social-next>確認內容 · 前往 Canva →</button></div>`;}
function socialStudioRevisionsHtml(saved){const prev=Array.isArray(saved?.previousDesigns)?saved.previousDesigns.slice(0,5):[];if(!prev.length)return '';return `<div class="social-revision-list"><small style="color:#8996a0;font-size:8px;font-weight:850">PREVIOUS CANVA VERSIONS</small>${prev.map(x=>`<div><span>${escapeHTML(String(x.generatedAt||'').replace('T',' ').slice(0,16)||'上一版')}</span>${x.editUrl?`<a href="${escapeHTML(x.editUrl)}" target="_blank" rel="noopener">開啟 ↗</a>`:''}</div>`).join('')}</div>`;}
function socialStudioStage3Html(){const a=swCanvaSelectedArticle(),saved=a?.canvaSocial||{},s=swCanvaState.status||{},brief=saved.brief||swCanvaState.brief||null;if(!brief)return socialStudioStage2Html();const ready=Boolean(s.connected);return `<section class="social-studio-card"><h2>送進 Canva</h2><p>這裡只處理設計版本，不再顯示 Client ID、Secret、Redirect URI。技術設定全部留在「設定」。</p><div class="social-canva-status ${ready?'ready':''}"><i></i><div><strong>${ready?'Canva 已連線':'Canva 尚未完成連線'}</strong><small>${ready?'會直接 Autofill 你指定的原 Canva 模板：5 張 Carousel；第 6 頁只保留 Caption Preview，不會送到 Instagram。':'先到設定完成 Canva OAuth，回來後不需要重新做前面的內容。'}</small></div></div><div style="margin-top:14px">${socialStudioVisualTags(brief)}</div><div class="canva-actions" style="margin-top:16px">${ready?`<button type="button" class="primary" id="canvaGenerateBtn">${saved.designId?'建立更新版 Canva':'建立 Canva'}</button>`:`<button type="button" class="primary" id="socialStudioOpenSettings">前往設定</button>`}${saved.editUrl?`<a href="${escapeHTML(saved.editUrl)}" target="_blank" rel="noopener">在 Canva 編輯目前版本 ↗</a>`:''}</div>${saved.designId?`<div class="canva-hint">更新版會建立新的 Canva 設計，不覆寫舊檔；上一版最多保留 5 筆快速連結。</div>`:''}${socialStudioRevisionsHtml(saved)}</section><div class="social-studio-footer"><button type="button" class="social-studio-secondary" data-social-prev>← 返回 AI 工作室</button><button type="button" class="social-studio-primary" data-social-next ${saved.designId?'':'disabled'}>前往社群發布 →</button></div>`;}
function socialStudioStage4Html(){const a=swCanvaSelectedArticle();if(!a)return '';return `<div>${swMetaPublishHtml()}</div><div class="social-studio-footer"><button type="button" class="social-studio-secondary" data-social-prev>← 返回 Canva</button><button type="button" class="social-studio-secondary" id="socialStudioOpenSettings">管理 Meta / Canva 連線</button></div>`;}
function socialStudioRenderCurrentStep(){const host=document.getElementById('socialStudioStageHost');if(!host)return;const step=Number(swCanvaState.socialStep||1);host.innerHTML=step===1?socialStudioStage1Html():step===2?socialStudioStage2Html():step===3?socialStudioStage3Html():socialStudioStage4Html();document.querySelectorAll('.social-studio-step').forEach(b=>b.classList.toggle('active',Number(b.dataset.socialStep)===step));socialStudioBindStage();}
function socialStudioSetStep(step){step=Math.min(4,Math.max(1,Number(step)||1));swCanvaState.socialStep=step;try{sessionStorage.setItem('sw-social-studio-step',String(step))}catch(_){}socialStudioRenderCurrentStep();if(step===3&&!swCanvaState.status)swCanvaRefreshStatus(false).then(()=>socialStudioRenderCurrentStep()).catch(()=>{});}
function socialStudioBindStepper(){document.querySelectorAll('.social-studio-step').forEach(btn=>btn.addEventListener('click',async()=>{const step=Number(btn.dataset.socialStep||1);if(step===2&&!socialStudioSelectedSaved().brief){await socialStudioEnsureBrief();}socialStudioSetStep(step);}));}
async function socialStudioEnsureBrief(){const a=swCanvaSelectedArticle();if(!a)return null;const saved=a.canvaSocial||{};if(saved.brief){swCanvaState.brief=clone(saved.brief);return saved.brief;}try{swCanvaSetBusy(true,'正在準備 Social Brief…');const r=await swCanvaRequest('admin.canva.preview',{article:swCanvaArticlePayload(a)},90000);const brief=r?.brief||null;if(!brief)throw new Error('沒有取得 Social Brief');a.canvaSocial={...saved,brief:clone(brief),chatHistory:Array.isArray(saved.chatHistory)?saved.chatHistory:[]};swCanvaState.brief=clone(brief);persist(true);return brief;}catch(err){showToast('Social Brief 產生失敗：'+String(err?.message||err));return null;}finally{swCanvaSetBusy(false)}}
async function socialStudioSendMessage(messageOverride=''){const a=swCanvaSelectedArticle();if(!a||swCanvaState.busy)return;let current=a?.canvaSocial?.brief||swCanvaState.brief||null;if(!current){current=await socialStudioEnsureBrief();if(!current){socialStudioRenderCurrentStep();return;}}const input=document.getElementById('socialStudioChatInput'),message=String(messageOverride||input?.value||'').trim();if(!message)return;const saved=a.canvaSocial||{},history=Array.isArray(saved.chatHistory)?saved.chatHistory.slice(-12):[];try{swCanvaSetBusy(true,'Social Studio 正在修改…');const r=await swCanvaRequest('admin.canva.chatEdit',{article:swCanvaArticlePayload(a),currentBrief:clone(current),message,history:clone(history)},120000);if(!r?.brief)throw new Error('AI 沒有回傳修改後內容');swCanvaState.undoBrief=clone(current);swCanvaState.brief=clone(r.brief);const nextHistory=[...history,{role:'user',text:message,at:new Date().toISOString()},{role:'assistant',text:String(r.reply||'已更新圖文。'),at:new Date().toISOString()}].slice(-12);a.canvaSocial={...saved,brief:clone(r.brief),chatHistory:nextHistory};persist(true);socialStudioRenderCurrentStep();showToast(r.changedFields?.length?`已更新 ${r.changedFields.length} 個圖文項目`:'Evidence Lock 已保留原內容');}catch(err){showToast(String(err?.message||err))}finally{swCanvaSetBusy(false)}}
function socialStudioUndo(){const a=swCanvaSelectedArticle();if(!a||!swCanvaState.undoBrief)return;const saved=a.canvaSocial||{},history=Array.isArray(saved.chatHistory)?saved.chatHistory.slice(-11):[];a.canvaSocial={...saved,brief:clone(swCanvaState.undoBrief),chatHistory:[...history,{role:'assistant',text:'已復原到上一版 Social Brief。',at:new Date().toISOString()}].slice(-12)};swCanvaState.brief=clone(swCanvaState.undoBrief);swCanvaState.undoBrief=null;persist(true);socialStudioRenderCurrentStep();showToast('已復原上一版');}
function socialStudioBindStage(){const step=Number(swCanvaState.socialStep||1);document.querySelectorAll('[data-social-prev]').forEach(b=>b.addEventListener('click',()=>socialStudioSetStep(step-1)));document.querySelectorAll('[data-social-next]').forEach(b=>b.addEventListener('click',()=>socialStudioSetStep(step+1)));document.getElementById('canvaArticleSelect')?.addEventListener('change',e=>{swCanvaState.selectedArticleId=e.target.value;swCanvaState.undoBrief=null;try{sessionStorage.setItem('sw-canva-article',e.target.value)}catch(_){}const a=swCanvaSelectedArticle();swCanvaState.brief=a?.canvaSocial?.brief?clone(a.canvaSocial.brief):null;socialStudioRenderCurrentStep();});document.getElementById('socialStudioStart')?.addEventListener('click',async()=>{const b=await socialStudioEnsureBrief();if(b)socialStudioSetStep(2)});document.getElementById('socialStudioPrepareBrief')?.addEventListener('click',async()=>{const b=await socialStudioEnsureBrief();if(b)socialStudioRenderCurrentStep()});document.getElementById('socialStudioSendMessage')?.addEventListener('click',()=>socialStudioSendMessage());document.getElementById('socialStudioChatInput')?.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();socialStudioSendMessage()}});document.querySelectorAll('[data-social-prompt]').forEach(b=>b.addEventListener('click',()=>socialStudioSendMessage(b.dataset.socialPrompt||'')));document.getElementById('socialStudioUndo')?.addEventListener('click',socialStudioUndo);document.getElementById('socialStudioOpenSettings')?.addEventListener('click',()=>{nav('export');showToast('Canva / Meta 技術設定都集中在這裡')});document.getElementById('canvaGenerateBtn')?.addEventListener('click',()=>swCanvaGenerateForArticle(swCanvaSelectedArticle()));swBindCanvaBriefButtons();if(step===4)swBindMetaPublisher();}
window.addEventListener('message',e=>{const d=e.data;if(!d||d.source!=='SIGNWELL_CANVA_OAUTH')return;showToast(d.ok?'Canva 已連結':String(d.message||'Canva 授權失敗'));if(viewName==='export')swCanvaRefreshStatus(true)});
function swInjectCanvaEditorPanel(){
  const side=document.querySelector('.editor-side');if(!side||document.getElementById('swCanvaEditorPanel'))return;
  const a=getCurrent();if(!a)return;const saved=a.canvaSocial||{};
  const panel=document.createElement('div');panel.id='swCanvaEditorPanel';panel.className='canva-editor-panel';
  panel.innerHTML=`<div class="kicker">SOCIAL STUDIO</div><strong>對話式 Canva 圖文工作室</strong><p>先用 AI 對話調整 5 張 Carousel＋Caption Preview 的圖文、版面與視覺，再建立 Canva。Evidence 與研究數字保持鎖定。</p><div class="actions"><button type="button" class="primary" id="swCanvaOpenWorkspace">開啟 Social Studio</button>${saved.editUrl?`<a href="${escapeHTML(saved.editUrl)}" target="_blank" rel="noopener">開啟目前 Canva ↗</a>`:''}</div>`;
  side.appendChild(panel);
  document.getElementById('swCanvaOpenWorkspace')?.addEventListener('click',()=>{updateFromEditor();persist(true);swCanvaState.selectedArticleId=a.id;swCanvaState.socialStep=1;try{sessionStorage.setItem('sw-canva-article',String(a.id));sessionStorage.setItem('sw-social-studio-step','1')}catch(_){}nav('canva')});
}
if(typeof renderEditor==='function'){const swOriginalRenderEditor=renderEditor;renderEditor=function(){swOriginalRenderEditor.apply(this,arguments);setTimeout(swInjectCanvaEditorPanel,0)}}


/* SIGN WELL v23.9.77 · Licensed Google Image Search settings */
const swGoogleMediaState={status:null,registry:null};
async function swGoogleMediaRequest(action,payload={},timeoutMs=30000){return signwellGasBridge(action,payload,{adminKey:newsletterAdminKey(),timeoutMs});}
function swNotionSettingsCardHtml(){return `<section class="publish-card" id="notionSettingsCard"><div class="ai-provider-head"><div><h3>Notion Workspace</h3><p>Notion Integration Token、Parent Page、API Version 與 Database mapping 全部只在這裡設定。Token 只保存在 Apps Script Script Properties。</p></div><span class="ai-provider-state" id="notionTokenBadge"><i></i>檢查中…</span></div><div class="notion-fields" style="margin-top:14px"><label class="wide">Command Center Parent Page ID / URL<input id="notionParentPageId" autocomplete="off" placeholder="貼上 Notion 中控台頁面網址或 32 位 Page ID"></label><label>Notion-Version<input id="notionApiVersion" autocomplete="off" value="2022-06-28" placeholder="YYYY-MM-DD"></label><label>Workspace Bot<input id="notionWorkspaceBot" readonly value="尚未驗證"></label></div><div class="sw-secret-summary" style="margin-top:12px"><div><span>Notion Integration Token</span><strong id="notionSettingsSecretState">檢查中…</strong><small>只保存在 Apps Script</small></div><button class="top-action" id="notionTokenBtn" type="button">設定 Workspace Token</button></div><div class="notion-db-list" style="margin-top:14px"><label class="notion-db-row"><span>Content Pipeline</span><input id="notionContentDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Social Queue</span><input id="notionSocialDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Evidence Registry</span><input id="notionEvidenceDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Weekly Reports</span><input id="notionReportsDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Operations</span><input id="notionOperationsDb" placeholder="Database ID"></label><label class="notion-db-row"><span>AI Review Inbox</span><input id="notionReviewDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Compliance Registry</span><input id="notionComplianceDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Article Summaries</span><input id="notionSummaryDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Prompt Registry</span><input id="notionPromptDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Source Registry</span><input id="notionSourceDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Feature Flags</span><input id="notionFlagsDb" placeholder="Database ID"></label><label class="notion-db-row"><span>Release Registry</span><input id="notionReleasesDb" placeholder="Database ID"></label><label class="notion-db-row"><span>AI Performance Registry</span><input id="notionAiPerformanceDb" placeholder="Database ID"></label></div><div class="publish-actions"><button class="top-action primary" id="notionSaveBtn" type="button">儲存 Notion 設定</button><button class="top-action" id="notionTestBtn" type="button">測試連線</button><button class="top-action" id="notionBootstrapBtn" type="button">建立／升級 13 個資料庫</button><button class="top-action danger" id="notionDisconnectBtn" type="button">移除 Token</button></div><div class="publish-status" id="notionSettingsHelp">正在讀取 Notion 狀態…</div></section>`}
function swInjectNotionSettingsIntoExport(){if(viewName!=='export'||document.getElementById('notionSettingsCard'))return;const grid=document.querySelector('#view .publish-grid');if(!grid)return;grid.insertAdjacentHTML('beforeend',swNotionSettingsCardHtml());document.getElementById('notionTokenBtn')?.addEventListener('click',swNotionSetToken);document.getElementById('notionSaveBtn')?.addEventListener('click',swNotionSaveConfig);document.getElementById('notionTestBtn')?.addEventListener('click',swNotionTest);document.getElementById('notionDisconnectBtn')?.addEventListener('click',swNotionDisconnect);document.getElementById('notionBootstrapBtn')?.addEventListener('click',swNotionBootstrap);swNotionRefresh(false).then(s=>{const st=document.getElementById('notionSettingsSecretState'),help=document.getElementById('notionSettingsHelp');if(st){st.textContent=s?.accessTokenConfigured?'已安全設定':'尚未設定';st.classList.toggle('ready',Boolean(s?.accessTokenConfigured))}if(help)help.textContent=s?.accessTokenConfigured?'✓ Notion 憑證已安全保存；可測試連線或建立資料庫。':'請先設定 Integration Token，再填 Parent Page。'}).catch(err=>{const help=document.getElementById('notionSettingsHelp');if(help)help.textContent='無法讀取 Notion 狀態：'+String(err?.message||err)})}
if(typeof renderExport==='function'){const swRenderExportBeforeNotionSettings=renderExport;renderExport=function(){swRenderExportBeforeNotionSettings.apply(this,arguments);setTimeout(swInjectNotionSettingsIntoExport,40)}}

function swTrustedMediaModeLabel(mode){return mode==='FULL_USE'?'FULL USE · 已確認可重用':mode==='VERIFY_THEN_USE'?'VERIFY THEN USE · 逐圖驗證':'DISCOVERY ONLY · 僅搜尋';}
function swTrustedMediaRowHtml(item,index){const mode=String(item?.mode||'VERIFY_THEN_USE');return `<div class="trusted-media-row" data-tm-index="${index}"><label class="trusted-media-enabled"><input type="checkbox" data-tm-field="enabled" ${item?.enabled!==false?'checked':''}><span></span></label><div class="trusted-media-copy"><strong>${escapeHTML(item?.label||item?.domain||'圖片來源')}</strong><small>${escapeHTML(item?.domain||'')}</small><em>${escapeHTML(item?.note||'')}</em></div><select data-tm-field="mode" aria-label="使用模式"><option value="FULL_USE" ${mode==='FULL_USE'?'selected':''}>FULL USE</option><option value="VERIFY_THEN_USE" ${mode==='VERIFY_THEN_USE'?'selected':''}>VERIFY THEN USE</option><option value="DISCOVERY_ONLY" ${mode==='DISCOVERY_ONLY'?'selected':''}>DISCOVERY ONLY</option></select><button type="button" class="top-action trusted-media-remove" data-tm-remove="${index}" ${String(item?.domain||'')==='commons.wikimedia.org'?'disabled':''}>移除</button></div>`;}
function swTrustedMediaRender(){const host=document.getElementById('trustedMediaList'),count=document.getElementById('trustedMediaCount');if(!host)return;const items=Array.isArray(swGoogleMediaState.registry?.items)?swGoogleMediaState.registry.items:[];host.innerHTML=items.map(swTrustedMediaRowHtml).join('')||'<div class="trusted-media-empty">尚未設定額外來源。</div>';if(count)count.textContent=`${items.filter(x=>x.enabled!==false).length} / ${items.length} 啟用`;host.querySelectorAll('[data-tm-remove]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.tmRemove);if(!Number.isFinite(i))return;swGoogleMediaState.registry.items.splice(i,1);swTrustedMediaRender();}));}
function swTrustedMediaCollect(){const base=Array.isArray(swGoogleMediaState.registry?.items)?swGoogleMediaState.registry.items.map(x=>({...x})):[];document.querySelectorAll('#trustedMediaList .trusted-media-row').forEach((row,i)=>{if(!base[i])return;base[i].enabled=Boolean(row.querySelector('[data-tm-field="enabled"]')?.checked);base[i].mode=row.querySelector('[data-tm-field="mode"]')?.value||base[i].mode||'VERIFY_THEN_USE';});return base;}
async function swTrustedMediaRefresh(){const r=await swGoogleMediaRequest('admin.media.registry',{},30000);swGoogleMediaState.registry=r;swTrustedMediaRender();return r;}
function swTrustedMediaAdd(){const domain=String(document.getElementById('trustedMediaDomain')?.value||'').trim(),label=String(document.getElementById('trustedMediaLabel')?.value||'').trim(),mode=String(document.getElementById('trustedMediaMode')?.value||'VERIFY_THEN_USE');if(!domain){showToast('請先輸入網域');return;}const clean=domain.replace(/^https?:\/\//i,'').replace(/^www\./i,'').split('/')[0].split(':')[0].toLowerCase();if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,62})\.)+[a-z]{2,63}$/.test(clean)){showToast('網域格式不正確');return;}const items=swTrustedMediaCollect();if(items.some(x=>String(x.domain).toLowerCase()===clean)){showToast('這個網域已經在清單裡');return;}items.push({domain:clean,label:label||clean,mode,enabled:true,verifier:mode==='DISCOVERY_ONLY'?'none':'open-license-page',note:mode==='FULL_USE'?'管理員已確認此網域素材具有可重用權利；請只在確實擁有或具 blanket license 時使用。':mode==='VERIFY_THEN_USE'?'逐張重新讀取來源頁；只有偵測到 Public Domain / CC0 / CC BY / CC BY-SA 才會自動插圖。':'只供 AI / Google 尋找候選，不會自動把圖片加入文章。'});swGoogleMediaState.registry={...(swGoogleMediaState.registry||{}),items};document.getElementById('trustedMediaDomain').value='';document.getElementById('trustedMediaLabel').value='';swTrustedMediaRender();}
async function swTrustedMediaSave(){const items=swTrustedMediaCollect();const r=await swGoogleMediaRequest('admin.media.registry.save',{items},45000);swGoogleMediaState.registry=r;swTrustedMediaRender();showToast('可信圖片網域已儲存');}
async function swTrustedMediaReset(){const ok=await swConfirm('要恢復 SIGN WELL 預設圖片來源清單嗎？你自行加入的網域會被移除。',{title:'恢復預設圖片來源',confirmText:'恢復預設'});if(!ok)return;const r=await swGoogleMediaRequest('admin.media.registry.reset',{},30000);swGoogleMediaState.registry=r;swTrustedMediaRender();showToast('已恢復預設圖片來源');}
function swGoogleMediaCardHtml(){return `<section class="publish-card google-media-card" id="googleMediaCard"><div class="google-media-head"><div><h3>AI 自動插圖</h3><p>① Wikimedia Commons 直接搜尋並核驗開放授權。② Trusted Media Registry 只搜尋你允許的醫療圖片網域。③ VERIFY THEN USE 必須再次讀取來源頁並辨識 Public Domain、CC0、CC BY 或 CC BY-SA 才能真的插圖。找不到合適圖片時文章照常生成，不硬塞圖片。</p></div><span class="google-media-state" id="googleMediaState"><i></i>檢查中…</span></div><div class="connection-summary" style="margin-bottom:12px"><div class="connection-row"><span>Wikimedia Commons</span><strong id="commonsMediaState">主要來源 · 檢查中</strong></div><div class="connection-row"><span>Google Licensed Search</span><strong id="googleFallbackState">Trusted fallback · 檢查中</strong></div></div><div class="google-media-grid"><label>Google Programmable Search Engine ID (cx) · Optional<input id="googleMediaCx" autocomplete="off" placeholder="Google PSE Search engine ID"></label><label>每篇最多圖片<select id="googleMediaMax"><option value="0">0 · 關閉自動插圖</option><option value="1">1 張</option><option value="2">2 張</option></select></label></div><div class="sw-secret-summary" style="margin-top:12px"><div><span>Google Custom Search API Key · Optional</span><strong id="googleMediaKeyState">檢查中…</strong><small id="googleMediaKeyMeta">只保存在 Apps Script</small></div><button class="top-action" id="googleMediaSecret" type="button">設定 API Key</button></div><div class="publish-actions"><button class="top-action primary" id="googleMediaSave" type="button">儲存圖片設定</button><button class="top-action" id="googleMediaTest" type="button">測試來源</button><label style="display:flex;align-items:center;gap:7px;font-size:10px"><input id="googleMediaEnabled" type="checkbox" checked>啟用 AI 自動插圖</label></div><div class="trusted-media-panel"><div class="trusted-media-head"><div><b>Trusted Media Registry</b><span>白名單只限制 AI 去哪裡找；是否能重製仍由模式與逐圖授權驗證決定。</span></div><strong id="trustedMediaCount">讀取中…</strong></div><div id="trustedMediaList" class="trusted-media-list"><div class="trusted-media-empty">正在讀取來源…</div></div><div class="trusted-media-add"><input id="trustedMediaDomain" placeholder="例如 smart.servier.com"><input id="trustedMediaLabel" placeholder="顯示名稱（可留空）"><select id="trustedMediaMode"><option value="VERIFY_THEN_USE">VERIFY THEN USE</option><option value="DISCOVERY_ONLY">DISCOVERY ONLY</option><option value="FULL_USE">FULL USE</option></select><button class="top-action" id="trustedMediaAdd" type="button">加入網站</button></div><div class="trusted-media-actions"><button class="top-action primary" id="trustedMediaSave" type="button">儲存來源清單</button><button class="top-action" id="trustedMediaReset" type="button">恢復預設</button></div><div class="google-media-note"><b>模式：</b>FULL USE 只給你確定擁有或取得 blanket reuse 權利的網域；VERIFY THEN USE 會逐張檢查來源頁授權；DISCOVERY ONLY 只提供候選，不會自動加入文章。</div></div><div class="publish-status" id="googleMediaHelp">正在讀取設定…</div></section>`}
async function swGoogleMediaRefresh(live=false){const s=await swGoogleMediaRequest('admin.media.status',{live},30000);swGoogleMediaState.status=s;const state=document.getElementById('googleMediaState'),commons=document.getElementById('commonsMediaState'),fallback=document.getElementById('googleFallbackState'),cx=document.getElementById('googleMediaCx'),max=document.getElementById('googleMediaMax'),en=document.getElementById('googleMediaEnabled'),ks=document.getElementById('googleMediaKeyState'),km=document.getElementById('googleMediaKeyMeta'),btn=document.getElementById('googleMediaSecret'),help=document.getElementById('googleMediaHelp');if(state){state.classList.toggle('ready',Boolean(s.enabled));state.innerHTML=`<i></i>${escapeHTML(s.enabled?'READY':'已停用')}`;}if(commons)commons.textContent=s.enabled?'主要來源 · READY':'主要來源 · 已停用';if(fallback)fallback.textContent=s.googleConfigured?'Optional · 已設定':'Optional · 未設定（正常）';if(cx&&!cx.matches(':focus'))cx.value=s.cx||'';if(max)max.value=String(s.maxImages??1);if(en)en.checked=s.enabled!==false;if(ks)ks.textContent=s.apiKeyConfigured?'已安全設定':'尚未設定（Optional）';if(km)km.textContent=s.apiKeyConfigured?swFormatSecretUpdatedAt(s.apiKeyUpdatedAt):'未設定也不影響 Commons 主流程';if(btn)btn.textContent=s.apiKeyConfigured?'更換 API Key':'設定 Optional API Key';if(help)help.textContent=s.enabled?'✓ Wikimedia Commons 為主要來源；Google Licensed Search 僅在需要時作 Optional fallback。':'AI 自動插圖目前已關閉；文章仍可正常生成。';return s;}
async function swGoogleMediaSave(){const cx=document.getElementById('googleMediaCx')?.value.trim()||'',maxImages=Number(document.getElementById('googleMediaMax')?.value||1),enabled=Boolean(document.getElementById('googleMediaEnabled')?.checked);await swGoogleMediaRequest('admin.media.configure',{cx,maxImages,enabled},30000);showToast('AI 自動插圖設定已儲存');await swGoogleMediaRefresh(false);}
async function swGoogleMediaSecret(){await openSecretVaultDialog({target:'googlemedia',title:swGoogleMediaState.status?.apiKeyConfigured?'更換 Google Optional API Key':'設定 Google Optional API Key',secretLabel:'Google Custom Search API Key',placeholder:'AIza…',onCommit:async({secret,secretAuthToken})=>{const cx=document.getElementById('googleMediaCx')?.value.trim()||swGoogleMediaState.status?.cx||'',maxImages=Number(document.getElementById('googleMediaMax')?.value||1),enabled=Boolean(document.getElementById('googleMediaEnabled')?.checked);await swGoogleMediaRequest('admin.media.configure',{cx,maxImages,enabled,apiKey:secret,secretAuthToken},35000);showToast('Google Optional API Key 已安全保存');await swGoogleMediaRefresh(false);}})}
async function swGoogleMediaTest(){const help=document.getElementById('googleMediaHelp');if(help)help.textContent='正在測試 Wikimedia Commons 主要來源與 Google Optional fallback…';try{const r=await swGoogleMediaRequest('admin.media.test',{},45000);if(!r.ok)throw new Error(r.primary?.error||r.error||'Wikimedia Commons 測試失敗');const primary=Number(r.primary?.count||0),fb=r.fallback||{};if(help)help.textContent=`✓ Wikimedia Commons 正常 · ${primary} 個合法候選；Google fallback：${fb.configured?(fb.skipped?'已略過（不影響系統）':'可用'):'未設定（正常）'}。`;showToast('AI 自動插圖來源檢查完成')}catch(err){if(help)help.textContent='主要來源測試失敗：'+String(err?.message||err)+'；文章生成仍不會因圖片而被阻斷。';showToast('Wikimedia Commons 主要來源需要檢查')}}
function swInjectGoogleMediaSettings(){if(viewName!=='export'||document.getElementById('googleMediaCard'))return;const grid=document.querySelector('#view .publish-grid');if(!grid)return;grid.insertAdjacentHTML('beforeend',swGoogleMediaCardHtml());document.getElementById('googleMediaSave')?.addEventListener('click',swGoogleMediaSave);document.getElementById('googleMediaSecret')?.addEventListener('click',swGoogleMediaSecret);document.getElementById('googleMediaTest')?.addEventListener('click',swGoogleMediaTest);document.getElementById('trustedMediaAdd')?.addEventListener('click',swTrustedMediaAdd);document.getElementById('trustedMediaSave')?.addEventListener('click',swTrustedMediaSave);document.getElementById('trustedMediaReset')?.addEventListener('click',swTrustedMediaReset);Promise.all([swGoogleMediaRefresh(false),swTrustedMediaRefresh()]).catch(err=>{const h=document.getElementById('googleMediaHelp');if(h)h.textContent='無法讀取圖片設定：'+String(err?.message||err)});}
if(typeof renderExport==='function'){const swOriginalRenderExportGoogleMedia=renderExport;renderExport=function(){swOriginalRenderExportGoogleMedia.apply(this,arguments);setTimeout(swInjectGoogleMediaSettings,0)}}


/* SIGN WELL v23.9.77 · Publish-time Canva + unified social copy */
const swPublishComposerState={articleId:'',brief:null,plan:null,metaStatus:null,canvaStatus:null,busy:false};
function swPublishComposerReset(){swPublishComposerState.articleId='';swPublishComposerState.brief=null;swPublishComposerState.plan=null;swPublishComposerState.busy=false;}
function swPublishComposerArticle(article){return article||data.articles.find(a=>String(a.id)===String(swPublishComposerState.articleId))||null;}
function swPublishComposerUrl(article,brief){return String(brief?.url||article?.canvaSocial?.brief?.url||('https://signwell.com.tw/article/'+encodeURIComponent(String(article?.slug||article?.id||''))+'/')).trim();}
function swPublishComposerCaption(article,brief){
  const url=swPublishComposerUrl(article,brief);let base=String(brief?.caption||'').trim();
  if(url)base=base.split(url).join('').trim();
  base=base.replace(/\n{3,}/g,'\n\n').trim();
  if(base.length>390)base=base.slice(0,389).replace(/[，、；：,:;\s]+$/,'')+'…';
  const tail=url?'完整文章｜'+url:'';
  return [base,tail].filter(Boolean).join('\n\n').trim().slice(0,495);
}
function swPublishComposerSetStatus(text,kind=''){const el=document.getElementById('swPublishSocialStatus');if(!el)return;el.textContent=text;el.classList.toggle('ok',kind==='ok');el.classList.toggle('warn',kind==='warn');}
function swPublishComposerUpdateToggle(){const box=document.getElementById('swPublishSocialComposer'),on=Boolean(document.getElementById('swPublishSocialEnabled')?.checked);box?.classList.toggle('enabled',on);const btn=document.getElementById('articlePublishConfirmBtn');if(btn)btn.textContent=on?'一鍵發佈網站＋社群':'確認發佈文章';}
async function swPublishComposerLoadBrief(article,force=false){
  if(!article)return null;const textarea=document.getElementById('swPublishUnifiedCaption');
  if(!force&&article?.canvaSocial?.brief){swPublishComposerState.brief=article.canvaSocial.brief;if(textarea&&!textarea.value)textarea.value=swPublishComposerCaption(article,article.canvaSocial.brief);}
  try{swPublishComposerSetStatus(force?'正在重新產生統一文案…':'正在從文章整理統一文案…');const r=await swCanvaRequest('admin.canva.preview',{article:swCanvaArticlePayload(article)},90000);const brief=r?.brief||null;if(brief){swPublishComposerState.brief=brief;if(textarea)textarea.value=swPublishComposerCaption(article,brief);swPublishComposerSetStatus('統一文案已準備完成；三個平台共用同一份內容。','ok')}return brief;}catch(err){if(!swPublishComposerState.brief)swPublishComposerSetStatus('文案產生失敗，可先手動輸入或只發布網站：'+String(err?.message||err),'warn');return swPublishComposerState.brief;}
}
async function swPublishComposerOpen(article){
  swPublishComposerReset();swPublishComposerState.articleId=String(article?.id||'');const enabled=document.getElementById('swPublishSocialEnabled'),ready=document.getElementById('swPublishSocialReady'),caption=document.getElementById('swPublishUnifiedCaption'),link=document.getElementById('swPublishCanvaLink');if(!enabled)return;
  enabled.checked=false;enabled.disabled=true;document.getElementById('swPublishSocialComposer')?.classList.remove('enabled');if(caption)caption.value='';if(link){link.hidden=true;link.removeAttribute('href')};
  const saved=article?.socialPublishDraft||{};const savedPlatforms=Array.isArray(saved.platforms)?saved.platforms:null;
  if(caption&&Object.prototype.hasOwnProperty.call(saved,'caption'))caption.value=String(saved.caption);
  try{
    const [meta,canva]=await Promise.all([swCanvaRequest('admin.meta.publishStatus',{},30000).catch(()=>null),swCanvaRequest('admin.canva.status',{live:false},30000).catch(()=>null)]);swPublishComposerState.metaStatus=meta;swPublishComposerState.canvaStatus=canva;
    const pmap={facebook:'swPublishFacebook',threads:'swPublishThreads',instagram:'swPublishInstagram'};let count=0;Object.entries(pmap).forEach(([p,id])=>{const el=document.getElementById(id),ok=Boolean(meta?.platforms?.[p]?.ready);if(el){el.disabled=!ok;el.checked=ok&&(savedPlatforms?savedPlatforms.includes(p):true)}if(ok)count++});
    const canvaReady=Boolean(canva?.connected);if(ready)ready.textContent=(canvaReady?'Canva READY':'Canva 未連線')+' · '+count+'/3 Meta READY';
    enabled.disabled=!(canvaReady&&count>0);enabled.checked=Boolean(canvaReady&&count>0);swPublishComposerUpdateToggle();
    if(!canvaReady||!count)swPublishComposerSetStatus('尚未完成 Canva 或 Meta 連線；可先只發布網站，或到「設定」完成授權。','warn');
    await swPublishComposerLoadBrief(article,false);
  }catch(err){if(ready)ready.textContent='社群狀態讀取失敗';swPublishComposerSetStatus('無法讀取社群連線狀態；這次可先只發布網站。','warn')}
}
function swPublishComposerCapture(){
  const article=swPublishComposerArticle();const on=Boolean(document.getElementById('swPublishSocialEnabled')?.checked);if(!on){swPublishComposerState.plan={enabled:false,articleId:String(article?.id||'')};return true}
  const platforms=[];if(document.getElementById('swPublishFacebook')?.checked)platforms.push('facebook');if(document.getElementById('swPublishThreads')?.checked)platforms.push('threads');if(document.getElementById('swPublishInstagram')?.checked)platforms.push('instagram');
  const caption=String(document.getElementById('swPublishUnifiedCaption')?.value||'').trim();if(!platforms.length){showToast('請至少選一個社群平台，或關閉社群圖文');return false}if(!caption){showToast('請確認統一發文文案');return false}
  swPublishComposerState.plan={enabled:true,articleId:String(article?.id||''),platforms,caption:caption.slice(0,495),link:swPublishComposerUrl(article,swPublishComposerState.brief),createdAt:new Date().toISOString()};return true;
}
async function swPublishEnsureCanva(article){
  swPublishComposerSetStatus('網站已上線 · 正在建立 Canva 社群圖卡…');let r=await swCanvaRequest('admin.canva.generate',{article:swCanvaArticlePayload(article)},150000),design=r?.design||null;if(r?.pending&&r?.jobId){const j=await swCanvaAwaitImportJob(r.jobId),ds=j?.result?.designs||[];design=ds[0]||null}
  const urls=swCanvaDesignUrls(design||{});if(!urls.designId)throw new Error(r?.warning||'Canva 未回傳 Design ID');const revision=(typeof v10Revision==='function'?v10Revision(article):String(article?.updatedAt||''));article.canvaSocial={designId:urls.designId,editUrl:urls.editUrl,viewUrl:urls.viewUrl,generatedAt:new Date().toISOString(),mode:r?.mode||'',fallback:Boolean(r?.fallback),brief:clone(r?.brief||swPublishComposerState.brief||{}),sourceRevision:revision};persist(true);return article.canvaSocial;
}
async function swPublishPrepareCanvaPreview(){const article=swPublishComposerArticle();if(!article)return;const btn=document.getElementById('swPublishPrepareCanva'),old=btn?.textContent||'';if(btn){btn.disabled=true;btn.textContent='準備中…'}try{const saved=await swPublishEnsureCanva(article),a=document.getElementById('swPublishCanvaLink');if(a&&saved.editUrl){a.href=saved.editUrl;a.hidden=false}swPublishComposerSetStatus('Canva 圖卡已建立，可先開啟檢查；真正社群貼文仍要按最下方確認發佈。','ok')}catch(err){swPublishComposerSetStatus('Canva 圖卡建立失敗：'+String(err?.message||err),'warn')}finally{if(btn){btn.disabled=false;btn.textContent=old}}}
async function swRunPublishSocialPlan(article){
  const plan=swPublishComposerState.plan;if(!plan?.enabled||String(plan.articleId)!==String(article?.id||'')){swPublishComposerState.plan=null;return{requested:false}}
  const requested=true;try{article.socialPublishDraft={platforms:plan.platforms,caption:plan.caption,link:plan.link,mediaMode:'canva',mediaUrls:[],updatedAt:new Date().toISOString()};persist(true);let canva=article.canvaSocial;const currentRevision=(typeof v10Revision==='function'?v10Revision(article):String(article?.updatedAt||''));if(!canva?.designId||String(canva?.sourceRevision||'')!==String(currentRevision))canva=await swPublishEnsureCanva(article);swPublishComposerSetStatus('Canva 完成 · 正在上傳統一圖文到 Meta…');const jobId='sw_'+String(article.id||'article')+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);const r=await swCanvaRequest('admin.meta.publish',{jobId,platforms:plan.platforms,caption:plan.caption,link:plan.link,useCanva:true,canvaDesignId:canva.designId,mediaUrls:[]},180000);article.socialPublishHistory=[{...r,jobId,requestedPlatforms:plan.platforms,unifiedCaption:true}].concat(Array.isArray(article.socialPublishHistory)?article.socialPublishHistory:[]).slice(0,20);persist(true);swPublishComposerSetStatus(r.complete?'網站、Canva、社群圖文皆已完成。':'網站已上線；部分社群平台未完成，請到總覽查看。',r.complete?'ok':'warn');return{requested,complete:Boolean(r.complete),result:r};}finally{swPublishComposerState.plan=null;}
}
function swInjectCanvaSettingsIntoExport(){if(viewName!=='export'||document.getElementById('canvaSettingsPublishCard'))return;const grid=document.querySelector('#view .publish-grid');if(!grid)return;const holder=document.createElement('div');holder.innerHTML=swCanvaSetupHtml();const card=holder.firstElementChild;if(!card)return;card.id='canvaSettingsPublishCard';grid.appendChild(card);swBindCanvaPage();swCanvaRefreshStatus(false).catch(()=>{});}
if(typeof renderExport==='function'){const swRenderExportBeforeCanvaSettings=renderExport;renderExport=function(){swRenderExportBeforeCanvaSettings.apply(this,arguments);setTimeout(swInjectCanvaSettingsIntoExport,80)}}
/* Canva no longer appears as a standalone CMS workspace or editor-side card. */
swInjectCanvaEditorPanel=function(){};
document.getElementById('swPublishSocialEnabled')?.addEventListener('change',swPublishComposerUpdateToggle);
document.getElementById('swPublishRegenerateCaption')?.addEventListener('click',()=>swPublishComposerLoadBrief(swPublishComposerArticle(),true));
document.getElementById('swPublishPrepareCanva')?.addEventListener('click',swPublishPrepareCanvaPreview);
document.getElementById('swPublishSocialSettings')?.addEventListener('click',()=>{closeArticlePublishConfirm(false);nav('export')});

load();syncPublicSnapshot();optimize();initCmsPremium();bindCmsCloudRealtime();setAuthStage(1);initCmsServerAuth();playOpeningWelcome();
try{
  const bc=new BroadcastChannel(ANALYTICS_CHANNEL);
  bc.onmessage=()=>{if(viewName==='dashboard'&&!$('#cms').classList.contains('hidden'))renderDashboard()};
}catch(_){}
addEventListener('storage',e=>{if(e.key===ANALYTICS_KEY&&viewName==='dashboard'&&!$('#cms').classList.contains('hidden'))renderDashboard()});
})();
