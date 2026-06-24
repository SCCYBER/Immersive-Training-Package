(function(){
  function addStyles(){
    if(document.getElementById('sccyberPikPopStyles'))return;
    var style=document.createElement('style');
    style.id='sccyberPikPopStyles';
    style.textContent=".pik-pop-zone{position:fixed;inset:0;pointer-events:none;z-index:4;overflow:hidden}.pik-pop{position:absolute;width:42px;height:42px;opacity:0;transform:translateY(18px) scale(.86);filter:drop-shadow(0 0 12px rgba(169,76,255,.35));animation:pikPop 2.1s ease-in-out forwards}.pik-body{position:absolute;left:8px;top:8px;width:26px;height:26px;background:#59ff9d;box-shadow:0 0 0 4px #090216,0 0 0 6px #a94cff,0 0 16px rgba(89,255,157,.45);image-rendering:pixelated}.pik-body:before,.pik-body:after{content:'';position:absolute;top:9px;width:4px;height:4px;background:#a94cff;box-shadow:0 0 6px rgba(169,76,255,.7)}.pik-body:before{left:7px}.pik-body:after{right:7px}.pik-arm{position:absolute;width:8px;height:4px;background:#59ff9d;top:20px;box-shadow:0 0 0 2px #090216}.pik-arm.left{left:0}.pik-arm.right{right:0}.pik-leg{position:absolute;width:6px;height:8px;background:#59ff9d;bottom:0;box-shadow:0 0 0 2px #090216}.pik-leg.left{left:12px}.pik-leg.right{right:12px}@keyframes pikPop{0%{opacity:0;transform:translateY(22px) scale(.82)}18%{opacity:.42;transform:translateY(0) scale(1)}68%{opacity:.42;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(18px) scale(.86)}}@media(max-width:850px){.pik-pop{width:34px;height:34px}.pik-body{width:22px;height:22px}.pik-arm{top:18px}}";
    document.head.appendChild(style);
  }
  function buildPik(){
    var p=document.createElement('div');
    p.className='pik-pop';
    p.innerHTML='<div class="pik-body"></div><div class="pik-arm left"></div><div class="pik-arm right"></div><div class="pik-leg left"></div><div class="pik-leg right"></div>';
    return p;
  }
  function ensureZone(){
    var z=document.getElementById('pikPopZone');
    if(z)return z;
    z=document.createElement('div');
    z.id='pikPopZone';
    z.className='pik-pop-zone';
    document.body.appendChild(z);
    return z;
  }
  function isLandingVisible(){
    var l=document.getElementById('sccyberLanding');
    return !!(l&&!l.classList.contains('hidden'));
  }
  function popPik(){
    if(!isLandingVisible())return;
    var zone=ensureZone();
    var spots=[
      {left:'3%',top:'26%'},{left:'88%',top:'28%'},{left:'7%',top:'76%'},{left:'90%',top:'73%'},{left:'48%',top:'88%'},{left:'2%',top:'52%'},{left:'94%',top:'48%'}
    ];
    var spot=spots[Math.floor(Math.random()*spots.length)];
    var p=buildPik();
    p.style.left=spot.left;
    p.style.top=spot.top;
    zone.appendChild(p);
    setTimeout(function(){if(p&&p.parentNode)p.parentNode.removeChild(p);},2300);
  }
  function loop(){
    popPik();
    setTimeout(loop,4200+Math.floor(Math.random()*2600));
  }
  function start(){addStyles();ensureZone();setTimeout(loop,1200);}
  window.addEventListener('load',start);
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(start,200);
})();