(function(){
function add(){
 if(document.getElementById('pikHeadOnlyStyle'))return;
 var s=document.createElement('style');
 s.id='pikHeadOnlyStyle';
 s.textContent='.pik-pop{width:58px!important;height:44px!important}.pik-body,.pik-arm,.pik-leg,.pik-chest{display:none!important}.pik-head{position:absolute!important;left:10px!important;top:0!important;width:40px!important;height:34px!important;background:#fff!important;box-shadow:0 0 0 5px #000,0 0 12px rgba(255,255,255,.35)!important}.pik-head:before,.pik-head:after{content:""!important;position:absolute!important;top:12px!important;width:8px!important;height:18px!important;background:#000!important}.pik-head:before{left:-13px!important}.pik-head:after{right:-13px!important}.pik-eye{position:absolute!important;width:3px!important;height:3px!important;background:#000!important;top:13px!important}.pik-eye.left{left:11px!important}.pik-eye.right{right:11px!important}.pik-mouth{position:absolute!important;left:15px!important;top:22px!important;width:10px!important;height:8px!important;background:#a94cff!important;box-shadow:0 0 8px rgba(169,76,255,.8)!important}';
 document.head.appendChild(s);
}
function loadLasers(){if(document.getElementById('laserBeamScript'))return;var s=document.createElement('script');s.id='laserBeamScript';s.src='landing-laser-beams.js?v=20260624a';document.body.appendChild(s)}
function loadComingSoon(){if(document.getElementById('comingSoonTileScript'))return;var s=document.createElement('script');s.id='comingSoonTileScript';s.src='dashboard-coming-soon.js?v=20260624a';document.body.appendChild(s)}
function patch(){document.querySelectorAll('.pik-pop').forEach(function(p){if(p.dataset.headOnly)return;p.dataset.headOnly='1';p.innerHTML='<div class="pik-head"><div class="pik-eye left"></div><div class="pik-eye right"></div><div class="pik-mouth"></div></div>';});}
window.addEventListener('load',function(){add();loadLasers();loadComingSoon();setInterval(patch,100);});
if(document.readyState==='interactive'||document.readyState==='complete'){add();loadLasers();loadComingSoon();setInterval(patch,100);}
})();