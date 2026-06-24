(function(){
  function hasProfile(){
    try{var p=JSON.parse(localStorage.getItem('sccyberPortalProfile')||'null');return !!(p&&p.firstName&&p.surname&&p.departmentRole);}catch(e){return false;}
  }

  function addStyles(){
    if(document.getElementById('sccyberLandingStyles'))return;
    var style=document.createElement('style');
    style.id='sccyberLandingStyles';
    style.textContent=`
      .sccyber-landing{position:relative;z-index:5;max-width:1120px;margin:0 auto;padding:28px 18px 34px;}
      .sccyber-landing.hidden{display:none!important;}
      .landing-hero{background:linear-gradient(135deg,rgba(11,3,34,.96),rgba(36,7,75,.94));border:1px solid rgba(169,76,255,.35);box-shadow:0 0 42px rgba(124,58,237,.22);border-radius:24px;padding:28px;text-align:center;overflow:hidden;position:relative;}
      .landing-hero:before{content:'';position:absolute;inset:-2px;background:radial-gradient(circle at 20% 20%,rgba(89,255,157,.18),transparent 28%),radial-gradient(circle at 80% 20%,rgba(169,76,255,.22),transparent 30%);pointer-events:none;}
      .landing-inner{position:relative;z-index:2;}
      .landing-logo{width:112px;max-width:32vw;margin:0 auto 12px;display:block;}
      .landing-eyebrow{color:#59ff9d;font-family:'Press Start 2P',cursive;font-size:10px;line-height:1.8;letter-spacing:.5px;margin-bottom:10px;}
      .landing-title{font-family:'Press Start 2P',cursive;color:#fff;font-size:clamp(22px,5vw,44px);line-height:1.35;margin:0 0 12px;text-shadow:0 0 18px rgba(169,76,255,.45);}
      .landing-subtitle{color:#ffd44d;font-family:'Press Start 2P',cursive;font-size:clamp(10px,2.2vw,15px);line-height:1.8;margin:0 auto 16px;max-width:760px;}
      .landing-copy{color:#d8c7ff;font-size:18px;line-height:1.65;max-width:820px;margin:0 auto 22px;}
      .landing-copy strong{color:#59ff9d;}
      .landing-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin:20px 0 8px;}
      .landing-primary{border:0;border-radius:14px;padding:15px 20px;background:#59ff9d;color:#090216;font-weight:800;font-family:'Press Start 2P',cursive;font-size:10px;line-height:1.6;cursor:pointer;box-shadow:0 0 22px rgba(89,255,157,.32);}
      .landing-secondary{color:#b9a8d5;font-size:13px;line-height:1.6;}
      .landing-tags{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px;}
      .landing-tags span{border:1px solid rgba(255,212,77,.25);border-radius:999px;padding:8px 10px;color:#ffd44d;background:rgba(255,212,77,.06);font-size:12px;}
      .landing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px;}
      .landing-card{background:rgba(8,2,20,.92);border:1px solid rgba(89,255,157,.16);border-radius:18px;padding:18px;text-align:left;min-height:148px;}
      .landing-card-icon{font-size:28px;margin-bottom:10px;}
      .landing-card-title{font-family:'Press Start 2P',cursive;color:#59ff9d;font-size:10px;line-height:1.7;margin-bottom:8px;}
      .landing-card p{color:#b9a8d5;font-size:14px;line-height:1.55;margin:0;}
      .landing-modules{margin-top:18px;background:rgba(8,2,20,.72);border:1px solid rgba(169,76,255,.22);border-radius:18px;padding:16px;}
      .landing-modules-title{font-family:'Press Start 2P',cursive;color:#ffd44d;font-size:10px;line-height:1.7;margin-bottom:12px;text-align:center;}
      .landing-module-list{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;}
      .landing-module{border:1px solid rgba(169,76,255,.22);border-radius:14px;padding:12px 8px;text-align:center;background:rgba(27,6,64,.62);color:#fff;font-size:12px;line-height:1.4;}
      .landing-module strong{display:block;color:#59ff9d;margin-bottom:5px;font-size:18px;}
      @media(max-width:850px){.sccyber-landing{padding:16px 10px 26px}.landing-hero{padding:20px 14px;border-radius:18px}.landing-copy{font-size:15px}.landing-grid{grid-template-columns:1fr}.landing-module-list{grid-template-columns:1fr 1fr}.landing-primary{width:100%;font-size:9px}.landing-card{min-height:auto}.landing-title{font-size:24px}.landing-subtitle{font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function buildLanding(){
    if(document.getElementById('sccyberLanding'))return;
    var auth=document.getElementById('authView');
    var dashboard=document.getElementById('dashboardView');
    if(!auth||!dashboard)return;
    if(hasProfile())return;

    auth.classList.add('hidden');

    var section=document.createElement('section');
    section.id='sccyberLanding';
    section.className='sccyber-landing';
    section.innerHTML=`
      <div class="landing-hero">
        <div class="landing-inner">
          <img class="landing-logo" src="https://sccyber.github.io/breach-lockdown/logo.png?v=sccyber" alt="SCCYBER logo">
          <div class="landing-eyebrow">SCCYBER TRAINING PORTAL</div>
          <h1 class="landing-title">Immersive Cybersecurity Training</h1>
          <p class="landing-subtitle">Move beyond tick box compliance.</p>
          <p class="landing-copy">Develop real world cybersecurity awareness through <strong>interactive simulations</strong>, <strong>gamified challenges</strong> and <strong>scenario based learning</strong> designed to improve decision making and strengthen cyber resilience.</p>
          <div class="landing-actions">
            <button id="enterTrainingPortalBtn" class="landing-primary" type="button">ENTER TRAINING PORTAL</button>
            <div class="landing-secondary">Interactive • Gamified • Immersive</div>
          </div>
          <div class="landing-tags"><span>Cyber awareness is not broken</span><span>The delivery is outdated</span><span>Train people through experience</span></div>
        </div>
      </div>

      <div class="landing-grid">
        <div class="landing-card"><div class="landing-card-icon">🎮</div><div class="landing-card-title">INTERACTIVE LEARNING</div><p>Arcade style modules designed to improve engagement, retention and participation.</p></div>
        <div class="landing-card"><div class="landing-card-icon">🛡</div><div class="landing-card-title">REAL WORLD SCENARIOS</div><p>Practice making security decisions in realistic workplace situations and cyber events.</p></div>
        <div class="landing-card"><div class="landing-card-icon">📊</div><div class="landing-card-title">PROGRESS TRACKING</div><p>Track learner completion, performance and training outcomes through reporting.</p></div>
      </div>

      <div class="landing-modules">
        <div class="landing-modules-title">TRAINING MODULES</div>
        <div class="landing-module-list">
          <div class="landing-module"><strong>🔑</strong>Password Shield</div>
          <div class="landing-module"><strong>🏢</strong>Workplace Defender</div>
          <div class="landing-module"><strong>🎣</strong>Phishing Frenzy</div>
          <div class="landing-module"><strong>🛡</strong>Breach Lockdown</div>
          <div class="landing-module"><strong>🔐</strong>Brute Force Lockdown</div>
        </div>
      </div>
    `;

    auth.parentNode.insertBefore(section, auth);

    var btn=document.getElementById('enterTrainingPortalBtn');
    if(btn){btn.addEventListener('click',function(){section.classList.add('hidden');auth.classList.remove('hidden');sessionStorage.setItem('sccyberLandingSeen','true');window.scrollTo(0,0);});}
  }

  function install(){
    if(sessionStorage.getItem('sccyberLandingSeen')==='true')return;
    addStyles();
    buildLanding();
  }

  window.addEventListener('load',install);
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(install,50);
})();