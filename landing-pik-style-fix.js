(function(){
function add(){
 if(document.getElementById('pikApprovedStyle'))return;
 var s=document.createElement('style');s.id='pikApprovedStyle';
 s.textContent='.pik-pop{width:58px!important;height:70px!important}.pik-body{left:16px!important;top:39px!important;width:28px!important;height:24px!important;background:#050505!important;border-radius:0!important;box-shadow:0 0 0 4px #000!important}.pik-body:before,.pik-body:after{content:""!important;position:absolute!important;top:2px!important;width:6px!important;height:18px!important;background:#fff!important;box-shadow:none!important}.pik-body:before{left:-2px!important}.pik-body:after{right:-2px!important}.pik-body .pik-chest{position:absolute;left:10px;top:8px;width:8px;height:8px;background:#a94cff}.pik-head{position:absolute;left:10px;top:0;width:40px;height:34px;background:#fff;box-shadow:0 0 0 5px #000,0 0 12px rgba(255,255,255,.35)}.pik-head:before,.pik-head:after{content:"";position:absolute;top:12px;width:8px;height:18px;background:#000}.pik-head:before{left:-13px}.pik-head:after{right:-13px}.pik-mouth{position:absolute;left:15px;top:22px;width:10px;height:8px;background:#a94cff;box-shadow:0 0 8px rgba(169,76,255,.8)}.pik-arm{display:none!important}.pik-leg{bottom:-11px!important;width:6px!important;height:10px!important;background:#fff!important;box-shadow:none!important}.pik-leg.l{left:6px!important}.pik-leg.r{right:6px!important}';
 document.head.appendChild(s);
}
function patch(){document.querySelectorAll('.pik-pop').forEach(function(p){if(p.dataset.approved)return;p.dataset.approved='1';p.innerHTML='<div class="pik-head"><div class="pik-mouth"></div></div><div class="pik-body"><div class="pik-chest"></div><div class="pik-leg l"></div><div class="pik-leg r"></div></div>';});}
window.addEventListener('load',function(){add();setInterval(patch,150);});
if(document.readyState==='interactive'||document.readyState==='complete'){add();setInterval(patch,150);}
})();