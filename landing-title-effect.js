(function(){
  function addTitleEffect(){
    if(document.getElementById('sccyberLandingTitleEffect'))return;
    var style=document.createElement('style');
    style.id='sccyberLandingTitleEffect';
    style.textContent=".landing-title{position:relative;display:inline-block;background:linear-gradient(90deg,#a94cff 0%,#ffffff 45%,#59ff9d 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;text-shadow:0 0 20px rgba(169,76,255,.35),0 0 28px rgba(89,255,157,.22)!important;animation:sccyberTitleFlicker 2.4s infinite!important;overflow:hidden}.landing-title:before{content:'';position:absolute;inset:-6px;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.18) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(89,255,157,.08) 0 1px,rgba(169,76,255,.08) 1px 2px,transparent 2px 4px);mix-blend-mode:screen;opacity:.18;animation:sccyberStaticNoise .16s steps(2,end) infinite}.landing-title:after{content:attr(data-static-text);position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(90deg,#a94cff 0%,#ffffff 45%,#59ff9d 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.18;text-shadow:2px 0 rgba(89,255,157,.32),-2px 0 rgba(169,76,255,.32);animation:sccyberStaticShift .22s steps(2,end) infinite;pointer-events:none}@keyframes sccyberTitleFlicker{0%,18%,22%,25%,53%,57%,100%{opacity:1;filter:brightness(1.15)}20%,24%,55%{opacity:.72;filter:brightness(.75)}56%{opacity:.9;transform:translateX(1px)}}@keyframes sccyberStaticNoise{0%{transform:translateY(0);opacity:.12}50%{transform:translateY(-2px);opacity:.28}100%{transform:translateY(2px);opacity:.18}}@keyframes sccyberStaticShift{0%{transform:translate(0,0);clip-path:inset(0 0 86% 0)}25%{transform:translate(2px,-1px);clip-path:inset(24% 0 58% 0)}50%{transform:translate(-2px,1px);clip-path:inset(47% 0 34% 0)}75%{transform:translate(1px,0);clip-path:inset(71% 0 12% 0)}100%{transform:translate(0,0);clip-path:inset(0 0 86% 0)}}";
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
  window.addEventListener('load',function(){addTitleEffect();loadTypewriter();});
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(function(){addTitleEffect();loadTypewriter();},50);
})();