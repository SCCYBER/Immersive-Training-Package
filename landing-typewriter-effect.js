(function(){
  var subtitleText='Move beyond tick box compliance.';
  var copyHtml='Develop real world cybersecurity awareness through <strong>interactive simulations</strong>, <strong>gamified challenges</strong> and <strong>scenario based learning</strong> designed to improve decision making and strengthen cyber resilience.';
  var copyText='Develop real world cybersecurity awareness through interactive simulations, gamified challenges and scenario based learning designed to improve decision making and strengthen cyber resilience.';

  function addStyles(){
    if(document.getElementById('sccyberTypewriterStyles'))return;
    var style=document.createElement('style');
    style.id='sccyberTypewriterStyles';
    style.textContent='.landing-subtitle.typewriter-active:after,.landing-copy.typewriter-active:after,.landing-copy.typewriter-finished:after{content:"_";display:inline-block;color:#59ff9d;margin-left:4px;animation:sccyberCursorBlink .75s infinite}@keyframes sccyberCursorBlink{0%,45%{opacity:1}46%,100%{opacity:0}}';
    document.head.appendChild(style);
  }

  function loadPikPop(){
    if(document.getElementById('sccyberPikPopScript'))return;
    var s=document.createElement('script');
    s.id='sccyberPikPopScript';
    s.src='landing-pik-pop.js?v=20260624a';
    document.body.appendChild(s);
  }

  function typePlain(el,text,speed,done){
    var i=0;
    el.textContent='';
    el.classList.add('typewriter-active');
    function tick(){
      el.textContent=text.slice(0,i++);
      if(i<=text.length)setTimeout(tick,speed);
      else{el.classList.remove('typewriter-active');if(done)setTimeout(done,450);}
    }
    tick();
  }

  function typeCopy(el,done){
    var i=0;
    el.textContent='';
    el.classList.add('typewriter-active');
    function tick(){
      el.textContent=copyText.slice(0,i++);
      if(i<=copyText.length)setTimeout(tick,28);
      else{el.classList.remove('typewriter-active');el.classList.add('typewriter-finished');el.innerHTML=copyHtml;if(done)done();}
    }
    tick();
  }

  function blankLandingText(){
    var subtitle=document.querySelector('.landing-subtitle');
    var copy=document.querySelector('.landing-copy');
    if(subtitle&&!subtitle.dataset.typewriterDone)subtitle.textContent='';
    if(copy&&!copy.dataset.typewriterDone)copy.textContent='';
  }

  function run(){
    addStyles();
    loadPikPop();
    var subtitle=document.querySelector('.landing-subtitle');
    var copy=document.querySelector('.landing-copy');
    if(!subtitle||!copy||subtitle.dataset.typewriterDone==='true')return;
    subtitle.dataset.typewriterDone='true';
    copy.dataset.typewriterDone='true';
    subtitle.textContent='';
    copy.textContent='';
    setTimeout(function(){typePlain(subtitle,subtitleText,65,function(){typeCopy(copy);});},250);
  }

  window.addEventListener('load',function(){loadPikPop();blankLandingText();setTimeout(run,350);});
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='loginHomeBtn')setTimeout(function(){blankLandingText();run();loadPikPop();},250);});
  setTimeout(loadPikPop,100);
  setTimeout(blankLandingText,150);
  setTimeout(run,700);
})();