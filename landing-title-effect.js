(function(){
  function addTitleEffect(){
    if(document.getElementById('sccyberLandingTitleEffect'))return;
    var style=document.createElement('style');
    style.id='sccyberLandingTitleEffect';
    style.textContent=".landing-title{position:relative;display:inline-block;background:linear-gradient(90deg,#a94cff 0%,#ffffff 45%,#59ff9d 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;text-shadow:0 0 24px rgba(169,76,255,.52),0 0 34px rgba(89,255,157,.36)!important;animation:sccyberTitleFlicker 2.1s infinite!important;overflow:hidden}.landing-title:before{content:'';position:absolute;inset:-8px;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.34) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(89,255,157,.18) 0 1px,rgba(169,76,255,.18) 1px 2px,transparent 2px 4px);mix-blend-mode:screen;opacity:.38;animation:sccyberStaticNoise .11s steps(2,end) infinite}.landing-title:after{content:attr(data-static-text);position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(90deg,#a94cff 0%,#ffffff 45%,#59ff9d 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.34;text-shadow:3px 0 rgba(89,255,157,.5),-3px 0 rgba(169,76,255,.5);animation:sccyberStaticShift .16s steps(2,end) infinite;pointer-events:none}@keyframes sccyberTitleFlicker{0%,16%,21%,27%,52%,58%,100%{opacity:1;filter:brightness(1.22)}18%,24%,55%{opacity:.62;filter:brightness(.65)}56%{opacity:.9;transform:translateX(2px)}}@keyframes sccyberStaticNoise{0%{transform:translateY(0);opacity:.25}50%{transform:translateY(-3px);opacity:.52}100%{transform:translateY(3px);opacity:.36}}@keyframes sccyberStaticShift{0%{transform:translate(0,0);clip-path:inset(0 0 82% 0)}20%{transform:translate(4px,-1px);clip-path:inset(18% 0 62% 0)}40%{transform:translate(-4px,2px);clip-path:inset(38% 0 42% 0)}60%{transform:translate(3px,-2px);clip-path:inset(58% 0 22% 0)}80%{transform:translate(-2px,1px);clip-path:inset(76% 0 6% 0)}100%{transform:translate(0,0);clip-path:inset(0 0 82% 0)}}";
    document.head.appendChild(style);
    setTimeout(function(){var t=document.querySelector('.landing-title');if(t&&!t.dataset.staticText)t.dataset.staticText=t.textContent;},300);
  }
  function loadTypewriter(){
    if(document.getElementById('sccyberLandingTypewriterScript'))return;
    var s=document.createElement('script');
    s.id='sccyberLandingTypewriterScript';
    s.src='landing-typewriter-effect.js?v=20260624a';
    document.body.appendChild(s);
  }
  function loadPikStyle(){
    if(document.getElementById('pikApprovedStyleScript'))return;
    var s=document.createElement('script');
    s.id='pikApprovedStyleScript';
    s.src='landing-pik-style-fix.js?v=20260624a';
    document.body.appendChild(s);
  }
  window.addEventListener('load',function(){addTitleEffect();loadTypewriter();loadPikStyle();});
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(function(){addTitleEffect();loadTypewriter();loadPikStyle();},50);
})();