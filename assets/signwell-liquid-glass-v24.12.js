/* SIGN WELL v24.12 — Liquid Glass control interaction adapter */
(()=>{if(window.__SW_LG_V2412__)return;window.__SW_LG_V2412__=1;
const SEL='button,.btn,.button,.iconbtn,.icon-btn,.smallbtn,[role="button"],.tab,.pill,.chip,.segmented,.seg,.toolbar .group,.tabs,.tab-pill,.search,.switch,.toggle,.settings-toggle,.scan-button';
const hydrate=(root=document)=>{root.querySelectorAll?.(SEL).forEach(el=>{if(!el.classList.contains('sw-no-liquid'))el.classList.add('sw-lg-control')})};
hydrate();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.(SEL)&&!n.classList.contains('sw-no-liquid'))n.classList.add('sw-lg-control');hydrate(n)}}))).observe(document.documentElement,{subtree:true,childList:true});
// pointer state is CSS-driven; this only normalizes custom slider press feedback.
document.addEventListener('pointerdown',e=>{const s=e.target.closest?.('.slider,.range-slider,.sw-slider');if(s)s.classList.add('active-press')},{passive:true});
for(const ev of ['pointerup','pointercancel'])document.addEventListener(ev,()=>document.querySelectorAll('.active-press').forEach(x=>x.classList.remove('active-press')),{passive:true});
})();