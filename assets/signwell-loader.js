(()=>{
'use strict';
const root=document.documentElement;
const loader=document.getElementById('swPageLoader');
if(!loader)return;
root.classList.add('sw-page-loading');
const bar=loader.querySelector('.sw-page-loader-bar');
const pct=loader.querySelector('.sw-page-loader-pct');
const stage=loader.querySelector('.sw-page-loader-stage');
let current=6,target=12,last=performance.now(),done=false,hideTimer=0;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const set=(value,label)=>{target=Math.max(target,Math.min(100,Number(value)||0));if(label&&stage)stage.textContent=label};
const finish=()=>{if(done)return;done=true;set(100,'載入完成')};
function tick(now){
  const dt=Math.min(48,Math.max(8,now-last));last=now;
  const gap=target-current;
  const gain=target>=100?Math.max(.18,Math.min(.34,dt/72)):Math.max(.055,Math.min(.14,dt/150));
  current+=gap*gain;
  if(target<100&&gap>.08)current+=Math.min(.055*dt,gap*.08);
  if(target>=100&&100-current<.22)current=100;
  const shown=Math.max(0,Math.min(100,current));
  if(bar)bar.style.transform=`scaleX(${(shown/100).toFixed(4)})`;
  if(pct)pct.textContent=`${Math.round(shown)}%`;
  if(done&&shown>=100){
    if(!hideTimer)hideTimer=setTimeout(()=>{loader.classList.add('is-done');root.classList.remove('sw-page-loading');setTimeout(()=>loader.remove(),420)},reduced?40:170);
    return;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
set(18,'建立頁面結構');
const phaseTimer=setInterval(()=>{if(done){clearInterval(phaseTimer);return}if(target<34)set(34,'載入樣式與元件');else if(target<52)set(52,'準備互動功能');else if(target<68)set(68,'整理頁面內容');else if(target<82)set(82,'完成最後設定');else clearInterval(phaseTimer)},210);
document.addEventListener('readystatechange',()=>{if(document.readyState==='interactive')set(72,'初始化頁面功能');if(document.readyState==='complete')set(94,'整理畫面')});
document.addEventListener('DOMContentLoaded',()=>set(84,'初始化互動功能'),{once:true});
if('PerformanceObserver' in window){try{let seen=0;const po=new PerformanceObserver(list=>{seen+=list.getEntries().length;if(!done)set(Math.min(88,24+seen*2.2),'載入頁面資源')});po.observe({type:'resource',buffered:true});window.addEventListener('load',()=>setTimeout(()=>po.disconnect(),300),{once:true})}catch(_){}}
window.addEventListener('load',()=>{set(96,'完成最後設定');requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(finish,70)))},{once:true});
setTimeout(()=>{if(!done)set(92,'等待頁面完成')},2200);
setTimeout(finish,7000);
window.signwellPageProgress={set:(v,label)=>set(v,label),complete:finish};
})();