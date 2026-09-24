/* SIGN WELL CMS compatibility runtime · stable filename · v24.36.3 */
(()=>{'use strict';
const noop=()=>{};
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.SignWellErrors=window.SignWellErrors||{
  installGlobal:noop,
  show(err,ctx={}){try{console.error('[SIGN WELL CMS]',ctx,err)}catch(_){};return {ok:false,message:String(err?.message||err||'Unknown error')}}
};
let authBase='';
window.SignWellAuth=window.SignWellAuth||{
  configure(cfg={}){authBase=String(cfg.authBase||authBase||'');return {ok:true,authBase}},
  passkeySupported(){return Boolean(window.PublicKeyCredential&&navigator.credentials)},
  rpOriginEligible(){return location.protocol==='https:'&&/\.github\.io$/i.test(location.hostname)},
  async loginWithPasskey(){return {ok:false,reason:'not_configured'}},
  async exchangeLegacyProof(){return {ok:false,reason:'not_configured'}},
  async listPasskeys(){return {ok:true,passkeys:[]}},
  async addPasskey(){throw new Error('Passkey bridge 尚未設定')},
  async deletePasskey(){throw new Error('Passkey bridge 尚未設定')},
  logout:noop
};
window.SignWellLiquidGlassMotion=window.SignWellLiquidGlassMotion||{version:'stable-compat',mount:noop,bind:noop,refresh:noop,destroy:noop};
window.signwellEditorialLearningRegisterPublish=window.signwellEditorialLearningRegisterPublish|| (async()=>({ok:true,skipped:true}));
window.signwellEditorialLearningMountSettings=window.signwellEditorialLearningMountSettings||noop;
function makeStaticShareSvg(identity={},article={}){
  const id=esc(identity.article_id||article.article_id||'SIGN-WELL');
  const title=esc(article.title||identity.title||'SIGN WELL Article');
  const hash=esc(identity.content_hash||'');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9fbfd"/><stop offset="1" stop-color="#e8eef5"/></linearGradient></defs><rect width="1200" height="630" rx="42" fill="url(#g)"/><text x="72" y="92" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#27334f">SIGN WELL · 欣緯生醫</text><text x="72" y="230" font-family="Arial,sans-serif" font-size="54" font-weight="700" fill="#172239">${title.slice(0,48)}</text><text x="72" y="486" font-family="monospace" font-size="25" fill="#52677a">${id}</text><text x="72" y="532" font-family="monospace" font-size="17" fill="#8293a2">${hash.slice(0,42)}</text><text x="72" y="582" font-family="Arial,sans-serif" font-size="18" fill="#8b98a5">Traceable · Versioned · Referenced</text></svg>`;
}
function mountTracePage(snapshot){
  const root=document.querySelector('[data-sw-trace-root]'); if(!root)return;
  const s=snapshot||{}; root.innerHTML=`<section style="max-width:860px;margin:32px auto;padding:28px;border:1px solid #dfe6ec;border-radius:24px;background:#fff"><h1 style="margin:0 0 12px">文章溯源紀錄</h1><p><b>${esc(s.article_id||'')}</b></p><p>內容雜湊：<code>${esc(s.content_hash||'')}</code></p><p>版本：${esc(s.current_version||s.version||'')}</p><p>更新：${esc(s.updated_at||s.indexed_at||'')}</p></section>`;
}
window.SignWellArticleIdentity=window.SignWellArticleIdentity||{makeStaticShareSvg,mountTracePage};
})();
