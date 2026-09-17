function swCaptionApplyIfUnchanged(el,before,next,current){
  if(!el||!el.isConnected||!current||el.value!==before)return false;
  el.value=next;return true;
}
/* CMS integration */
(function(){
  let composerSeq=0;
  async function captionFor(article){
    return swCanvaRequest('admin.meta.captionGenerate',{article:swCanvaArticlePayload(article)},90000);
  }
  function addSettings(){
    const host=document.querySelector('#view .publish-grid');
    if(viewName!=='export'||!host||document.getElementById('metaCaptionSettings'))return;
    const card=document.createElement('section');card.className='publish-card';card.id='metaCaptionSettings';
    card.innerHTML='<h3>預設社群文案</h3><p>Facebook、Instagram、Threads 共用。設定跨裝置保存，發布前仍可修改與確認。</p><label>模式<select id="swCaptionMode"><option value="off">原有文章摘要</option><option value="template">指定固定模板</option><option value="ai">依指定要求由 AI 生成</option></select></label><div class="field-group"><label>固定模板（支援 {文章標題}、{文章摘要}、{文章連結}）</label><textarea id="swCaptionTemplate" rows="5" maxlength="2000" placeholder="{文章標題}&#10;{文章摘要}&#10;閱讀全文：{文章連結}"></textarea></div><div class="field-group"><label>AI 寫作要求</label><textarea id="swCaptionInstructions" rows="4" maxlength="2000" placeholder="150 字內、白話、不使用表情符號、最後附文章連結"></textarea></div><button type="button" class="top-action primary" id="swCaptionSave" disabled>儲存文案設定</button><p id="swCaptionSettingsStatus" role="status">讀取中…</p><small>文案沿用本站 495 字元上限；超長會提醒，不會截斷。既有社群草稿優先保留，可按「套用預設文案」取代。</small>';
    host.appendChild(card);
    const get=id=>card.querySelector('#'+id),status=get('swCaptionSettingsStatus'),button=get('swCaptionSave');
    swCanvaRequest('admin.meta.captionSettings',{},30000).then(s=>{
      if(!card.isConnected)return;
      get('swCaptionMode').value=s.mode;get('swCaptionTemplate').value=s.template;get('swCaptionInstructions').value=s.instructions;
      status.textContent='設定已載入';button.disabled=false;
    }).catch(e=>status.textContent='讀取失敗：'+e.message+'；請確認已更新並重新部署 Code.gs');
    button.onclick=async()=>{button.disabled=true;try{
      await swCanvaRequest('admin.meta.captionSave',{mode:get('swCaptionMode').value,template:get('swCaptionTemplate').value,instructions:get('swCaptionInstructions').value},30000);
      status.textContent='已儲存；下一次開啟發文時自動帶入。';
    }catch(e){status.textContent='儲存失敗：'+e.message;}finally{button.disabled=false;}};
  }
  const oldExport=renderExport;
  renderExport=function(){oldExport.apply(this,arguments);addSettings();};

  swPublishComposerLoadBrief=async function(article,force=false){
    if(!article)return null;
    const seq=++composerSeq,el=document.getElementById('swPublishUnifiedCaption');
    if(!force&&Object.prototype.hasOwnProperty.call(article.socialPublishDraft||{},'caption'))return swPublishComposerState.brief;
    const before=el?.value||'',id=String(article.id);
    try{
      swPublishComposerSetStatus('正在套用預設文案…');
      const result=await captionFor(article);
      let next=result.caption;
      if(!result.enabled){
        const r=await swCanvaRequest('admin.canva.preview',{article:swCanvaArticlePayload(article)},90000);
        if(seq!==composerSeq||String(swPublishComposerState.articleId)!==id)return null;
        swPublishComposerState.brief=r.brief;
        next=swPublishComposerCaption(article,r.brief);
      }
      const current=seq===composerSeq&&String(swPublishComposerState.articleId)===id&&document.getElementById('articlePublishConfirm')?.classList.contains('show');
      const applied=swCaptionApplyIfUnchanged(el,before,next,current);
      if(current)swPublishComposerSetStatus(applied?'文案已帶入，確認後才會發布。':'已保留你手動修改的文案。','ok');
      return swPublishComposerState.brief;
    }catch(e){if(seq===composerSeq&&String(swPublishComposerState.articleId)===id)swPublishComposerSetStatus('文案未套用：'+e.message+'；可手動輸入。','warn');return null;}
  };
  const oldBind=swBindMetaPublisher;
  swBindMetaPublisher=function(){
    oldBind.apply(this,arguments);
    const el=document.getElementById('metaPubCaption'),article=swCanvaSelectedArticle();
    if(!el||!article||el.dataset.captionBound)return;el.dataset.captionBound='1';
    const button=document.createElement('button');button.type='button';button.className='top-action';button.textContent='套用預設文案';
    el.parentElement.appendChild(button);
    const status=document.createElement('small');status.setAttribute('role','status');el.parentElement.appendChild(status);
    let seq=0;
    async function apply(force){
      if(!force&&Object.prototype.hasOwnProperty.call(article.socialPublishDraft||{},'caption'))return;
      const run=++seq,before=el.value;button.disabled=true;status.textContent='讀取預設文案…';
      try{
        const r=await captionFor(article);
        const current=run===seq&&String(swCanvaSelectedArticle()?.id)===String(article.id);
        if(!r.enabled){status.textContent='目前使用原有文章摘要。';return;}
        const applied=swCaptionApplyIfUnchanged(el,before,r.caption,current);
        status.textContent=applied?'已帶入；確認後才會發布。':'已保留手動修改內容。';
      }catch(e){status.textContent='文案未套用：'+e.message+'；可手動輸入。';}finally{button.disabled=false;}
    }
    button.onclick=async()=>{if(el.value&&!(await swConfirm('以預設文案取代目前內容？',{title:'套用文案',confirmText:'確認套用'})))return;apply(true);};
    apply(false);
  };
})();
