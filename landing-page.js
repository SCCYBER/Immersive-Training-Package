(function(){
  function addStyles(){
    if(document.getElementById('sccyberLandingStyles'))return;
    var style=document.createElement('style');
    style.id='sccyberLandingStyles';
    style.textContent=`
      .sccyber-landing{position:relative;z-index:5;max-width:1120px;margin:0 auto;padding:28px 18px 34px;}
      .sccyber-landing.hidden{display:none!important;}
      .sccyber-landing.pixel-fizzle{animation:sccyberPixelFade .85s steps(7,end) forwards;filter:contrast(1.7) saturate(1.35);}
      .sccyber-landing.pixel-fizzle:after{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(89,255,157,.18) 0 2px,transparent 2px 8px),repeating-linear-gradient(90deg,rgba(169,76,255,.18) 0 2px,transparent 2px 8px);mix-blend-mode:screen;animation:sccyberPixelStatic .85s steps(8,end) forwards;}
      @keyframes sccyberPixelFade{0%{opacity:1;transform:scale(1);clip-path:inset(0 0 0 0)}25%{opacity:.92;transform:scale(1.01);clip-path:inset(3% 0 0 0)}50%{opacity:.72;transform:scale(.995);clip-path:inset(9% 3% 8% 2%)}75%{opacity:.38;transform:scale(1.015);clip-path:inset(20% 7% 21% 8%)}100%{opacity:0;transform:scale(1.04);clip-path:inset(50% 50% 50% 50%)}}
      @keyframes sccyberPixelStatic{0%{opacity:0;transform:translate(0,0) scale(1)}15%{opacity:.9;transform:translate(6px,-4px) scale(1.03)}35%{opacity:.65;transform:translate(-8px,5px) scale(1)}55%{opacity:.95;transform:translate(10px,3px) scale(1.04)}80%{opacity:.45;transform:translate(-6px,-6px) scale(1.02)}100%{opacity:0;transform:translate(0,0) scale(1.08)}}
      .landing-packages{position:absolute;top:16px;right:16px;z-index:4;border:1px solid rgba(169,76,255,.45);border-radius:12px;padding:10px 12px;background:rgba(8,2,20,.88);color:#ffd44d;text-decoration:none;font-family:'Press Start 2P',cursive;font-size:8px;line-height:1.5;box-shadow:0 0 18px rgba(169,76,255,.18);}
      .landing-hero{background:linear-gradient(135deg,rgba(11,3,34,.96),rgba(36,7,75,.94));border:1px solid rgba(169,76,255,.35);box-shadow:0 0 42px rgba(124,58,237,.22);border-radius:24px;padding:48px 28px 28px;text-align:center;overflow:hidden;position:relative;}
      .landing-hero:before{content:'';position:absolute;inset:-2px;background:radial-gradient(circle at 20% 20%,rgba(89,255,157,.18),transparent 28%),radial-gradient(circle at 80% 20%,rgba(169,76,255,.22),transparent 30%);pointer-events:none;}
      .landing-inner{position:relative;z-index:2;}.landing-logo{width:112px;max-width:32vw;margin:0 auto 12px;display:block;}
      .landing-eyebrow{color:#59ff9d;font-family:'Press Start 2P',cursive;font-size:10px;line-height:1.8;letter-spacing:.5px;margin-bottom:10px;}
      .landing-title{font-family:'Press Start 2P',cursive;color:#fff;font-size:clamp(22px,5vw,44px);line-height:1.35;margin:0 0 12px;text-shadow:0 0 18px rgba(169,76,255,.45);}
      .landing-subtitle{color:#ffd44d;font-family:'Press Start 2P',cursive;font-size:clamp(10px,2.2vw,15px);line-height:1.8;margin:0 auto 16px;max-width:760px;}
      .landing-copy{color:#d8c7ff;font-size:18px;line-height:1.65;max-width:820px;margin:0 auto 22px;}.landing-copy strong{color:#59ff9d;}
      .landing-actions{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin:20px 0 8px;text-align:center;}
      .landing-primary{border:0;border-radius:14px;padding:15px 24px;background:#59ff9d;color:#090216;font-weight:800;font-family:'Press Start 2P',cursive;font-size:10px;line-height:1.6;cursor:pointer;box-shadow:0 0 22px rgba(89,255,157,.32);display:inline-block;}
      .landing-arrow{font-family:'Press Start 2P',cursive;font-size:16px;color:#a94cff;text-shadow:0 0 14px rgba(169,76,255,.65);line-height:1;animation:sccyberArrowPulse 1s infinite alternate;}.landing-arrow.right{color:#59ff9d;text-shadow:0 0 14px rgba(89,255,157,.65);}
      @keyframes sccyberArrowPulse{from{opacity:.55;transform:scale(.96)}to{opacity:1;transform:scale(1.08)}}
      .landing-tags{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px;}.landing-tags span{border:1px solid rgba(255,212,77,.25);border-radius:999px;padding:8px 12px;color:#ffd44d;background:rgba(255,212,77,.06);font-size:12px;}
      .landing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px;}.landing-card{background:rgba(8,2,20,.92);border:1px solid rgba(89,255,157,.16);border-radius:18px;padding:18px;text-align:left;min-height:148px;}
      .landing-card-icon{font-size:28px;margin-bottom:10px;}.landing-card-title{font-family:'Press Start 2P',cursive;color:#59ff9d;font-size:10px;line-height:1.7;margin-bottom:8px;}.landing-card p{color:#b9a8d5;font-size:14px;line-height:1.55;margin:0;}
      .landing-strapline{margin-top:18px;background:rgba(8,2,20,.72);border:1px solid rgba(169,76,255,.22);border-radius:18px;padding:20px 16px;text-align:center;font-family:'Press Start 2P',cursive;font-size:clamp(13px,2.8vw,22px);line-height:1.8;box-shadow:0 0 28px rgba(169,76,255,.12);}.landing-strapline .purple{color:#a94cff;text-shadow:0 0 16px rgba(169,76,255,.35);}.landing-strapline .green{color:#59ff9d;text-shadow:0 0 16px rgba(89,255,157,.35);}
      .login-home-btn{position:absolute;top:16px;left:16px;z-index:7;border:1px solid rgba(89,255,157,.55);border-radius:12px;padding:9px 11px;background:rgba(8,2,20,.9);color:#59ff9d;font-size:18px;line-height:1;cursor:pointer;box-shadow:0 0 18px rgba(89,255,157,.18);}#authView{position:relative;}
      @media(max-width:850px){.sccyber-landing{padding:16px 10px 26px}.landing-packages{position:relative;top:auto;right:auto;display:inline-block;margin-bottom:12px}.landing-hero{padding:20px 14px;border-radius:18px}.landing-copy{font-size:15px}.landing-grid{grid-template-columns:1fr}.landing-primary{font-size:9px}.landing-arrow{font-size:13px}.landing-card{min-height:auto}.landing-title{font-size:24px}.landing-subtitle{font-size:10px}.landing-strapline{font-size:13px}.login-home-btn{top:8px;left:8px}}
    `;
    document.head.appendChild(style);
  }

  function hasSavedSession(){try{var p=JSON.parse(localStorage.getItem('sccyberPortalProfile')||'null');return !!(p&&p.firstName&&p.surname&&p.departmentRole);}catch(e){return false;}}
  function landingEl(){return document.getElementById('sccyberLanding')}
  function authEl(){return document.getElementById('authView')}
  function hideAuth(){var a=authEl();document.body.classList.remove('sccyber-login-open');if(a)a.classList.add('hidden')}
  function hideLanding(){var l=landingEl();if(l)l.classList.add('hidden')}
  function hideMainViews(){hideAuth();['dashboardView','reportView','gameView','adminView'].forEach(function(id){var x=document.getElementById(id);if(x)x.classList.add('hidden')})}
  function showLogin(){var a=authEl();if(!a)return;document.body.classList.add('sccyber-login-open');a.classList.remove('hidden');addLoginHomeButton();window.scrollTo(0,0)}

  function patchDashboard(){
    if(typeof showDashboard!=='function'||window.sccyberDashboardVisibilityPatched)return;
    window.sccyberDashboardVisibilityPatched=true;
    var original=showDashboard;
    showDashboard=function(){hideAuth();hideLanding();return original.apply(this,arguments)};
  }

  function showLanding(){
    patchDashboard();
    if(hasSavedSession()&&typeof showDashboard==='function'){hideLanding();hideAuth();showDashboard();return;}
    addStyles();hideMainViews();
    var existing=landingEl();
    if(existing){existing.classList.remove('hidden');existing.classList.remove('pixel-fizzle');return;}
    var auth=authEl();if(!auth)return;
    var section=document.createElement('section');section.id='sccyberLanding';section.className='sccyber-landing';
    section.innerHTML=`<div class="landing-hero"><a class="landing-packages" href="https://www.sccyber.co.uk/contact/" target="_blank" rel="noopener">Contact</a><div class="landing-inner"><img class="landing-logo" src="https://sccyber.github.io/breach-lockdown/logo.png?v=sccyber" alt="SCCYBER logo"><div class="landing-eyebrow">SCCYBER TRAINING PORTAL</div><h1 class="landing-title">Immersive Cybersecurity Training</h1><p class="landing-subtitle">Move beyond tick box compliance.</p><p class="landing-copy">Develop real world cybersecurity awareness through <strong>interactive simulations</strong>, <strong>gamified challenges</strong> and <strong>scenario based learning</strong> designed to improve decision making and strengthen cyber resilience.</p><div class="landing-actions"><span class="landing-arrow left">&gt;&gt;</span><button id="enterTrainingPortalBtn" class="landing-primary" type="button">ENTER HERE</button><span class="landing-arrow right">&lt;&lt;</span></div><div class="landing-tags"><span>Interactive • Gamified • Immersive</span></div></div></div><div class="landing-grid"><div class="landing-card"><div class="landing-card-icon">🎮</div><div class="landing-card-title">INTERACTIVE LEARNING</div><p>Arcade style modules designed to improve engagement, retention and participation.</p></div><div class="landing-card"><div class="landing-card-icon">🛡</div><div class="landing-card-title">REAL WORLD SCENARIOS</div><p>Practice making security decisions in realistic workplace situations and cyber events.</p></div><div class="landing-card"><div class="landing-card-icon">📊</div><div class="landing-card-title">PROGRESS TRACKING</div><p>Track learner completion, performance and training outcomes through reporting.</p></div></div><div class="landing-strapline"><span class="purple">In the background.</span> <span class="green">Always on</span></div>`;
    auth.parentNode.insertBefore(section,auth);
    var btn=document.getElementById('enterTrainingPortalBtn');
    if(btn)btn.addEventListener('click',function(){btn.disabled=true;section.classList.add('pixel-fizzle');setTimeout(function(){section.classList.add('hidden');section.classList.remove('pixel-fizzle');showLogin();btn.disabled=false},850)});
  }

  function addLoginHomeButton(){var auth=authEl();if(!auth||document.getElementById('loginHomeBtn'))return;var b=document.createElement('button');b.id='loginHomeBtn';b.className='login-home-btn';b.type='button';b.textContent='⌂';b.title='Back to landing page';b.addEventListener('click',function(){showLanding()});auth.appendChild(b)}
  function patchLogout(){if(typeof logout!=='function'||window.sccyberLandingLogoutPatched)return;window.sccyberLandingLogoutPatched=true;var original=logout;logout=async function(){await original.apply(this,arguments);localStorage.removeItem('sccyberPortalProfile');hideMainViews();setTimeout(function(){var l=landingEl();if(l){l.classList.remove('hidden');l.classList.remove('pixel-fizzle')}else{showLanding()}},50)}}
  function install(){addStyles();patchDashboard();showLanding();patchLogout();setTimeout(function(){patchDashboard();patchLogout()},500)}
  window.addEventListener('load',install);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(install,50);
})();