(function () {
  let pikMood = "neutral";
  let currentScene = "office";

  function renderPikOnly() {
    return `
      <div class="pik-visual-only" aria-hidden="true">
        <div class="pik-css pik-${pikMood}">
          <div class="pik-ear pik-ear-left"></div>
          <div class="pik-ear pik-ear-right"></div>
          <div class="pik-head">
            <div class="pik-eye pik-eye-left"></div>
            <div class="pik-eye pik-eye-right"></div>
            <div class="pik-mouth"></div>
            <div class="pik-face-shadow"></div>
          </div>
          <div class="pik-body">
            <div class="pik-chest"></div>
          </div>
          <div class="pik-arm pik-arm-left"></div>
          <div class="pik-arm pik-arm-right"></div>
          <div class="pik-leg pik-leg-left"></div>
          <div class="pik-leg pik-leg-right"></div>
        </div>
      </div>`;
  }

  function sceneDetails(scene) {
    const scenes = {
      office: { title: "DESK LEFT UNLOCKED", left: "OPEN DATA", right: "LOCK SCREEN" },
      printer: { title: "PRINTER RISK", left: "PAYROLL", right: "SECURE HANDOFF" },
      door: { title: "TAILGATE CHECK", left: "VISITOR", right: "SIGN IN" },
      wifi: { title: "REMOTE WIFI", left: "PUBLIC WIFI", right: "VPN" },
      train: { title: "PUBLIC CALL", left: "CLIENT CHAT", right: "PRIVATE SPACE" },
      router: { title: "HOME ROUTER", left: "DEFAULT PASS", right: "STRONG WIFI" },
      update: { title: "PATCH READY", left: "UPDATE ALERT", right: "INSTALL" },
      laptop: { title: "WORK DEVICE", left: "FAMILY USE", right: "WORK ONLY" },
      phone: { title: "LOST PHONE", left: "MISSING", right: "REPORT" },
      cloud: { title: "UPLOAD CHECK", left: "FREE TOOL", right: "APPROVED" },
      extension: { title: "EXTENSION PROMPT", left: "UNKNOWN ADDON", right: "CHECK IT" },
      login: { title: "SHARED LOGIN", left: "PASSWORD", right: "OWN ACCESS" },
      cabinet: { title: "OPEN CABINET", left: "NETWORK", right: "REPORT" },
      usb: { title: "UNKNOWN USB", left: "USB DEVICE", right: "SAFE TRANSFER" },
      incident: { title: "WRONG RECIPIENT", left: "SENT FILE", right: "INCIDENT" }
    };
    return scenes[scene] || scenes.office;
  }

  function renderPikScene(scene) {
    currentScene = scene || "office";
    const detail = sceneDetails(currentScene);
    return `
      <div class="pik-stage pik-scene-${currentScene}" aria-hidden="true">
        <div class="pik-scene-grid"></div>
        <div class="pik-scene-title">${detail.title}</div>
        <div class="pik-object pik-object-left">
          <div class="pik-object-screen"></div>
          <span>${detail.left}</span>
        </div>
        ${renderPikOnly()}
        <div class="pik-object pik-object-right">
          <div class="pik-object-safe"></div>
          <span>${detail.right}</span>
        </div>
        <div class="pik-floor-line"></div>
      </div>`;
  }

  window.sceneHtml = function (scene) {
    pikMood = "neutral";
    return renderPikScene(scene);
  };

  try { sceneHtml = window.sceneHtml; } catch (e) {}

  function forcePikIntoVisualBox() {
    const box = document.getElementById("scenarioArt");
    if (!box) return;
    box.innerHTML = renderPikScene(currentScene);
  }

  function setPikMood(mood) {
    pikMood = mood;
    forcePikIntoVisualBox();
  }

  const existingFlash = window.sccyberWorkplaceDefenderFlash;
  window.sccyberWorkplaceDefenderFlash = function (state) {
    setPikMood(state === "correct" ? "happy" : "sad");
    if (typeof existingFlash === "function") {
      existingFlash(state);
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .scenario-art{
      min-height:230px !important;
      margin-bottom:9px !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      background:radial-gradient(circle at center, rgba(169,76,255,.18), rgba(9,2,22,.96) 62%), linear-gradient(135deg, rgba(5,29,77,.9), rgba(92,6,77,.75)) !important;
      border:2px solid rgba(169,76,255,.45) !important;
      border-radius:18px !important;
      overflow:hidden !important;
      position:relative !important;
    }

    .scenario-art:before{
      content:"";
      position:absolute;
      inset:0;
      background:repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 7px);
      pointer-events:none;
    }

    .pik-stage{
      width:100%;
      min-height:230px;
      display:grid;
      grid-template-columns:minmax(132px, 1fr) minmax(128px, 180px) minmax(132px, 1fr);
      align-items:end;
      gap:16px;
      padding:34px 28px 24px;
      position:relative;
      z-index:2;
      image-rendering:pixelated;
    }

    .pik-scene-grid{
      position:absolute;
      inset:0;
      background:
        repeating-linear-gradient(90deg, rgba(89,255,157,.08) 0 2px, transparent 2px 34px),
        repeating-linear-gradient(0deg, rgba(169,76,255,.08) 0 2px, transparent 2px 28px);
      opacity:.56;
      pointer-events:none;
    }

    .pik-scene-title{
      position:absolute;
      top:12px;
      left:50%;
      transform:translateX(-50%);
      color:#ffd44d;
      font-family:'Press Start 2P', cursive;
      font-size:10px;
      line-height:1.4;
      text-align:center;
      text-shadow:0 0 9px rgba(255,212,77,.55);
      z-index:4;
      white-space:nowrap;
    }

    .pik-object{
      min-height:116px;
      border:5px solid #050508;
      background:#12143a;
      box-shadow:8px 8px 0 rgba(0,0,0,.32), 0 0 18px rgba(169,76,255,.3);
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      gap:9px;
      position:relative;
      z-index:3;
    }

    .pik-object span{
      color:#fff;
      font-family:'Press Start 2P', cursive;
      font-size:8px;
      line-height:1.4;
      text-align:center;
      padding:0 8px;
    }

    .pik-object-left{justify-self:end;width:min(100%, 190px);}
    .pik-object-right{justify-self:start;width:min(100%, 190px);border-color:#59ff9d;}

    .pik-object-screen,
    .pik-object-safe{
      width:78px;
      height:46px;
      border:5px solid #050508;
      background:#07142e;
      position:relative;
      box-shadow:5px 5px 0 rgba(255,255,255,.14);
    }

    .pik-object-screen:before,
    .pik-object-screen:after,
    .pik-object-safe:before,
    .pik-object-safe:after{
      content:"";
      position:absolute;
      left:10px;
      height:6px;
      background:#59ff9d;
    }

    .pik-object-screen:before{top:11px;width:38px;background:#ff3b6b;}
    .pik-object-screen:after{top:25px;width:54px;background:#a94cff;}
    .pik-object-safe:before{top:11px;width:48px;}
    .pik-object-safe:after{top:25px;width:28px;background:#ffd44d;}

    .pik-floor-line{
      position:absolute;
      left:28px;
      right:28px;
      bottom:18px;
      height:6px;
      background:#a94cff;
      box-shadow:0 0 12px rgba(169,76,255,.65);
      z-index:1;
    }

    .pik-visual-only{
      width:100%;
      height:100%;
      min-height:150px;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      z-index:4;
      transform:scale(1.18);
      transform-origin:bottom center;
    }

    .pik-css{
      position:relative;
      width:112px;
      height:136px;
      image-rendering:pixelated;
      filter:drop-shadow(0 0 14px rgba(169,76,255,.65));
    }

    .pik-css *{
      position:absolute;
      box-sizing:border-box;
      image-rendering:pixelated;
    }

    .pik-happy{
      animation:pikCelebrate .35s steps(2,end) 2;
      filter:drop-shadow(0 0 16px rgba(89,255,157,.85));
    }

    .pik-sad{
      transform:translateY(8px);
      filter:drop-shadow(0 0 14px rgba(255,59,107,.65));
    }

    @keyframes pikCelebrate{
      0%,100%{transform:translateY(0)}
      50%{transform:translateY(-10px)}
    }

    .pik-head{
      left:20px;
      top:8px;
      width:56px;
      height:48px;
      background:#fff;
      border:7px solid #050508;
    }

    .pik-ear{
      top:22px;
      width:15px;
      height:28px;
      background:#fff;
      border:7px solid #050508;
    }

    .pik-ear-left{left:7px;}
    .pik-ear-right{right:7px;}

    .pik-eye{
      top:23px;
      width:10px;
      height:10px;
      background:#050508 !important;
      border:0 !important;
      border-radius:0 !important;
      z-index:20 !important;
    }

    .pik-eye-left{left:15px;}
    .pik-eye-right{right:15px;}

    .pik-happy .pik-eye{
      top:22px;
      width:13px;
      height:8px;
      background:transparent !important;
      border:0 !important;
      border-bottom:4px solid #050508 !important;
      border-radius:0 0 12px 12px !important;
      z-index:20 !important;
    }

    .pik-happy .pik-eye-left{left:14px;transform:rotate(-8deg);}
    .pik-happy .pik-eye-right{right:14px;transform:rotate(8deg);}

    .pik-sad .pik-eye{
      top:24px;
      width:13px;
      height:8px;
      background:transparent !important;
      border:0 !important;
      border-top:4px solid #050508 !important;
      border-radius:12px 12px 0 0 !important;
      z-index:20 !important;
    }

    .pik-sad .pik-eye-left{left:14px;transform:rotate(14deg);}
    .pik-sad .pik-eye-right{right:14px;transform:rotate(-14deg);}

    .pik-mouth{
      left:24px;
      top:36px;
      width:9px;
      height:4px;
      background:#050508;
      display:none;
      z-index:20;
    }

    .pik-sad .pik-mouth{
      display:block;
      transform:rotate(180deg);
      border-radius:8px 8px 0 0;
    }

    .pik-face-shadow{
      left:0;
      bottom:0;
      width:22px;
      height:14px;
      background:#d9d9d9;
      z-index:1;
    }

    .pik-body{
      left:30px;
      top:56px;
      width:36px;
      height:38px;
      background:#fff;
      border:7px solid #050508;
    }

    .pik-chest{
      left:7px;
      top:8px;
      width:9px;
      height:9px;
      background:#a94cff;
    }

    .pik-arm{
      top:62px;
      width:18px;
      height:30px;
      background:#fff;
      border:7px solid #050508;
    }

    .pik-arm-left{left:16px;}
    .pik-arm-right{right:16px;}

    .pik-happy .pik-arm-left{
      left:14px;
      top:36px;
      transform:rotate(-38deg);
    }

    .pik-happy .pik-arm-right{
      right:14px;
      top:36px;
      transform:rotate(38deg);
    }

    .pik-sad .pik-arm-left{
      top:80px;
      left:17px;
      transform:rotate(20deg);
    }

    .pik-sad .pik-arm-right{
      top:80px;
      right:17px;
      transform:rotate(-20deg);
    }

    .pik-leg{
      top:88px;
      width:18px;
      height:24px;
      background:#fff;
      border:7px solid #050508;
    }

    .pik-leg-left{left:32px;}
    .pik-leg-right{right:32px;}

    .single-pixel-label,
    .pixel-scene,
    .scene-screen,
    .scene-desk,
    .scene-person,
    .scene-lock{
      display:none !important;
    }

    #question{
      font-size:clamp(13px, 1.7vw, 19px) !important;
      line-height:1.22 !important;
      margin-bottom:9px !important;
    }

    .answer-btn{
      font-size:11.5px !important;
      line-height:1.18 !important;
      padding:7px 9px !important;
      min-height:auto !important;
    }

    .question-card{padding:11px !important;}
    .question-tag{font-size:8px !important;margin-bottom:7px !important;}
    .answers{gap:7px !important;}
    .feedback{font-size:11.5px !important;line-height:1.28 !important;margin-top:7px !important;}
    .why{font-size:10.5px !important;line-height:1.28 !important;margin-top:5px !important;}
    .progress-grid{gap:7px !important;margin-bottom:7px !important;}
    .hud-box{padding:7px !important;}
    .hud-box span{font-size:7px !important;}
    .hud-box strong{font-size:15px !important;}

    @media (max-width:640px){
      .scenario-art{min-height:170px !important;}
      .pik-stage{min-height:170px;grid-template-columns:1fr 92px 1fr;gap:8px;padding:28px 10px 16px;}
      .pik-scene-title{font-size:8px;white-space:normal;width:92%;}
      .pik-object{min-height:86px;border-width:4px;}
      .pik-object span{font-size:6px;}
      .pik-object-screen,.pik-object-safe{width:54px;height:34px;border-width:4px;}
      .pik-visual-only{min-height:120px;}
      .pik-visual-only{transform:scale(1);}
      .pik-css{width:64px;height:78px;transform:scale(.72);}
      .pik-sad{transform:scale(.72) translateY(8px);}
      .pik-happy{animation:pikCelebrateMobile .35s steps(2,end) 2;}
      @keyframes pikCelebrateMobile{0%,100%{transform:scale(.72) translateY(0)}50%{transform:scale(.72) translateY(-10px)}}
      #question{font-size:12px !important;line-height:1.18 !important;}
      .answer-btn{font-size:10.5px !important;line-height:1.15 !important;padding:6px 7px !important;}
      .question-card{padding:9px !important;}
      .feedback{font-size:10.5px !important;}
      .why{font-size:9.5px !important;}
    }
  `;
  document.head.appendChild(style);

  forcePikIntoVisualBox();
  window.addEventListener("load", forcePikIntoVisualBox);
})();
