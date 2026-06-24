(function(){
  function addStyles(){
    if(document.getElementById('pikBackgroundStyles'))return;
    var style=document.createElement('style');
    style.id='pikBackgroundStyles';
    style.textContent=`
      .pik-pop{position:fixed;width:54px;height:54px;z-index:3;pointer-events:none;opacity:0;transform:scale(.7);filter:drop-shadow(0 0 14px rgba(169,76,255,.35));}
      .pik-body{position:absolute;left:10px;top:12px;width:34px;height:34px;background:linear-gradient(135deg,#12061f,#25104b);border:3px solid #59ff9d;box-shadow:0 0 0 3px rgba(169,76,255,.45),0 0 18px rgba(89,255,157,.35);border-radius:6px;}
      .pik-body:before,.pik-body:after{content:'';position:absolute;top:12px;width:5px;height:5px;background:#a94cff;border-radius:50%;box-shadow:0 0 8px rgba(169,76,255,.9);}
      .pik-body:before{left:8px}.pik-body:after{right:8px}
      .pik-arm{position:absolute;top:26px;width:12px;height:5px;background:#59ff9d;box-shadow:0 0 8px rgba(89,255,157,.5)}
      .pik-arm.left{left:0}.pik-arm.right{right:0}
      .pik-leg{position:absolute;bottom:0;width:8px;height:10px;background:#a94cff;box-shadow:0 0 8px rgba(169,76,255,.5)}
      .pik-leg.left{left:16px}.pik-leg.right{right:16px}
      .pik-pop.show{animation:pikPop 1.9s ease-in-out forwards;}
      @keyframes pikPop{0%{opacity:0;transform:translateY(18px) scale(.55)}18%{opacity:.82;transform:translateY(0) scale(1)}68%{opacity:.82;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(18px) scale(.55)}}
      @media(max-width:850px){.pik-pop{width:42px;height:42px}.pik-body{width:26px;height:26px}.pik-arm{top:22px}.pik-leg{height:8px}}
    `;
    document.head.appendChild(style);
  }

  function makePik(){
    if(document.getElementById('pikBackgroundPop'))return document.getElementById('pikBackgroundPop');
    var pik=document.createElement('div');
    pik.id='pikBackgroundPop';
    pik.className='pik-pop';
    pik.innerHTML='<div class="pik-arm left"></div><div class="pik-arm right"></div><div class="pik-body"></div><div class="pik-leg left"></div><div class="pik-leg right"></div>';
    document.body.appendChild(pik);
    return pik;
  }

  var spots=[
    {left:'-12px',top:'18vh',rotate:'12deg'},
    {right:'-10px',top:'28vh',rotate:'-12deg'},
    {left:'8vw',bottom:'-8px',rotate:'0deg'},
    {right:'12vw',bottom:'-10px',rotate:'4deg'},
    {left:'2vw',top:'72vh',rotate:'10deg'},
    {right:'3vw',top:'68vh',rotate:'-8deg'},
    {left:'50%',top:'10vh',rotate:'0deg'}
  ];
  var last=-1;

  function showPik(){
    if(!document.getElementById('sccyberLanding')||document.getElementById('sccyberLanding').classList.contains('hidden')){setTimeout(showPik,2500);return;}
    var pik=makePik();
    var idx=Math.floor(Math.random()*spots.length);
    if(idx===last)idx=(idx+1)%spots.length;
    last=idx;
    var s=spots[idx];
    pik.style.left=s.left||'auto';pik.style.right=s.right||'auto';pik.style.top=s.top||'auto';pik.style.bottom=s.bottom||'auto';
    pik.style.transform='rotate('+s.rotate+')';
    pik.classList.remove('show');
    void pik.offsetWidth;
    pik.classList.add('show');
    setTimeout(showPik,4200+Math.random()*2600);
  }

  function init(){addStyles();makePik();setTimeout(showPik,1800);}
  window.addEventListener('load',init);
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(init,50);
})();