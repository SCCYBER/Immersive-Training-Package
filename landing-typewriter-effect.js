(function(){
  var subtitleText='Move beyond tick box compliance.';
  var copyHtml='Develop real world cybersecurity awareness through <strong>interactive simulations</strong>, <strong>gamified challenges</strong> and <strong>scenario based learning</strong> designed to improve decision making and strengthen cyber resilience.';
  var copyText='Develop real world cybersecurity awareness through interactive simulations, gamified challenges and scenario based learning designed to improve decision making and strengthen cyber resilience.';

  function addStyles(){
    if(document.getElementById('sccyberTypewriterStyles'))return;
    var style=document.createElement('style');
    style.id='sccyberTypewriterStyles';
    style.textContent='.landing-subtitle.typewriter-active:after,.landing-copy.typewriter-active:after{content:"_";display:inline-block;color:#59ff9d;margin-left:4px;animation:sccyberCursorBlink .75s infinite}@keyframes sccyberCursorBlink{0%,45%{opacity:1}46%,100%{opacity:0}}';
    document.head.appendChild(style);
  }

  function typePlain(el,text,speed,done){
    var i=0;
    el.textContent='';
    el.classList.add('typewriter-active');
    function tick(){
      el.textContent=text.slice(0,i++);
      if(i<=text.length)setTimeout(tick,speed);
      else{el.classList.remove('typewriter-active');if(done)setTimeout(done,250);}
    }
    tick();
  }

  function typeCopy(el,done){
    var i=0;
    el.textContent='';
    el.classList.add('typewriter-active');
    function tick(){
      el.textContent=copyText.slice(0,i++);
      if(i<=copyText.length)setTimeout(tick,18);
      else{el.classList.remove('typewriter-active');el.innerHTML=copyHtml;if(done)done();}
    }
    tick();
  }

  function run(){
    addStyles();
    var subtitle=document.querySelector('.landing-subtitle');
    var copy=document.querySelector('.landing-copy');
    if(!subtitle||!copy||subtitle.dataset.typewriterDone==='true')return;
    subtitle.dataset.typewriterDone='true';
    typePlain(subtitle,subtitleText,42,function(){typeCopy(copy);});
  }

  window.addEventListener('load',function(){setTimeout(run,600);});
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='loginHomeBtn')setTimeout(run,400);});
  setTimeout(run,1200);
})();