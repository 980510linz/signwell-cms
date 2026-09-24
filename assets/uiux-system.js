(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

function markPressables(root=document){
  $$('button,.top-action,.smallbtn,.article-row,[role="button"]',root).forEach(el=>el.classList.add('swy-pressable'));
}
function upgradeButtons(){
  $$('button').forEach(btn=>{
    if(btn.dataset.swyUx==='1')return;btn.dataset.swyUx='1';
    if(!btn.getAttribute('aria-label')&&!btn.textContent.trim()&&btn.title)btn.setAttribute('aria-label',btn.title);
  });
}
function observeSaveState(){
  const el=$('#saveState');if(!el||el.dataset.swyObserve==='1')return;el.dataset.swyObserve='1';
  const sync=()=>{const t=(el.textContent||'').toLowerCase();el.classList.toggle('swy-status-live',/儲存中|同步|處理|發布中|連線/.test(t));};sync();new MutationObserver(sync).observe(el,{childList:true,subtree:true,characterData:true});
}
function addBusyFeedback(){
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('button');if(!btn||btn.disabled||btn.classList.contains('swy-busy'))return;
    const text=(btn.textContent||'').trim();if(!/儲存|發佈|發布|同步|產生|生成|寄送|送出|確認/.test(text))return;
    btn.classList.add('swy-busy');setTimeout(()=>btn.classList.remove('swy-busy'),900);
  },{capture:true,passive:true});
}
function improveTables(){
  $$('.panel table,.review-inbox-preview table').forEach(t=>{if(t.parentElement?.classList.contains('swy-table-scroll'))return;const w=document.createElement('div');w.className='swy-table-scroll';w.style.cssText='max-width:100%;overflow:auto;overscroll-behavior:contain';t.parentNode.insertBefore(w,t);w.appendChild(t);});
}
function setTouchClass(){document.documentElement.classList.toggle('swy-touch',matchMedia('(pointer:coarse)').matches)}
function enhance(){markPressables();upgradeButtons();observeSaveState();improveTables();}
addBusyFeedback();setTouchClass();addEventListener('resize',setTouchClass,{passive:true});
const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(enhance,35)});mo.observe(document.documentElement,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();
