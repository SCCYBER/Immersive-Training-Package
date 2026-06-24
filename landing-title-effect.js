(function(){
  function addTitleEffect(){
    if(document.getElementById('sccyberLandingTitleEffect'))return;
    var style=document.createElement('style');
    style.id='sccyberLandingTitleEffect';
    style.textContent=".landing-title{background:linear-gradient(90deg,#a94cff 0%,#ffffff 45%,#59ff9d 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;text-shadow:0 0 20px rgba(169,76,255,.35),0 0 28px rgba(89,255,157,.22)!important;animation:sccyberTitleFlicker 2.4s infinite!important;}@keyframes sccyberTitleFlicker{0%,18%,22%,25%,53%,57%,100%{opacity:1;filter:brightness(1.15)}20%,24%,55%{opacity:.72;filter:brightness(.75)}56%{opacity:.9;transform:translateX(1px)}}";
    document.head.appendChild(style);
  }
  window.addEventListener('load',addTitleEffect);
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(addTitleEffect,50);
})();