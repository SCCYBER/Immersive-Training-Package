(function () {
  let pikMood = "neutral";
  let currentScene = "office";

  function renderPikOnly() {
    return `
      <div class="pik-visual-only" aria-hidden="true">
        <div class="pik-css pik-${pikMood}">
          <div class="pik-head">
            <div class="pik-eye pik-eye-left"></div>
            <div class="pik-eye pik-eye-right"></div>
            <div class="pik-mouth"></div>
          </div>
          <div class="pik-body">
            <div class="pik-chest"></div>
            <div class="pik-leg pik-leg-left"></div>
            <div class="pik-leg pik-leg-right"></div>
          </div>
        </div>
      </div>`;
  }

  function renderPikScene(scene) {
    currentScene = scene || "office";
    return `
      <div class="pik-stage pik-scene-${currentScene}" aria-hidden="true">
        <div class="pik-scene-grid"></div>
        ${renderPikOnly()}
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
      display:flex;
      align-items:center;
      justify-content:center;
      padding:18px 28px 26px;
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

    .pik-floor-line{
      position:absolute;
      left:34%;
      right:34%;
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
      transform:scale(1.55);
      transform-origin:center center;
    }

    .pik-css{
      position:relative;
      width:58px;
      height:70px;
      image-rendering:pixelated;
      filter:drop-shadow(0 0 14px rgba(169,76,255,.65));
    }

    .pik-css *{
      position:absolute;
      box-sizing:border-box;
      image-rendering:pixelated;
    }

    .pik-happy .pik-css,
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
      left:10px;
      top:0;
      width:40px;
      height:34px;
      background:#fff;
      box-shadow:0 0 0 5px #000,0 0 12px rgba(255,255,255,.35);
    }

    .pik-head:before,
    .pik-head:after{
      content:"";
      position:absolute;
      top:12px;
      width:8px;
      height:18px;
      background:#000;
    }

    .pik-head:before{left:-13px;}
    .pik-head:after{right:-13px;}

    .pik-eye{
      top:13px;
      width:3px;
      height:3px;
      background:#a94cff !important;
      border:0 !important;
      border-radius:0 !important;
      z-index:20 !important;
      box-shadow:0 0 8px rgba(169,76,255,.8) !important;
    }

    .pik-eye-left{left:11px;}
    .pik-eye-right{right:11px;}

    .pik-happy .pik-eye{
      top:12px;
      width:8px;
      height:6px;
      background:transparent !important;
      border:0 !important;
      border-bottom:3px solid #a94cff !important;
      border-radius:0 0 12px 12px !important;
      z-index:20 !important;
    }

    .pik-happy .pik-eye-left{left:10px;transform:rotate(-8deg);}
    .pik-happy .pik-eye-right{right:10px;transform:rotate(8deg);}

    .pik-sad .pik-eye{
      top:13px;
      width:8px;
      height:6px;
      background:transparent !important;
      border:0 !important;
      border-top:3px solid #a94cff !important;
      border-radius:12px 12px 0 0 !important;
      z-index:20 !important;
    }

    .pik-sad .pik-eye-left{left:10px;transform:rotate(14deg);}
    .pik-sad .pik-eye-right{right:10px;transform:rotate(-14deg);}

    .pik-mouth{
      left:15px;
      top:22px;
      width:10px;
      height:8px;
      background:#a94cff;
      box-shadow:0 0 8px rgba(169,76,255,.8);
      z-index:20;
    }

    .pik-sad .pik-mouth{
      display:block;
      transform:translateY(1px);
      height:4px;
    }

    .pik-body{
      left:16px;
      top:39px;
      width:28px;
      height:24px;
      background:#050505;
      border-radius:0;
      box-shadow:0 0 0 4px #000;
    }

    .pik-body:before,
    .pik-body:after{
      content:"";
      position:absolute;
      top:2px;
      width:6px;
      height:18px;
      background:#fff;
      box-shadow:none;
    }

    .pik-body:before{left:-2px;}
    .pik-body:after{right:-2px;}

    .pik-chest{
      left:10px;
      top:8px;
      width:8px;
      height:8px;
      background:#a94cff;
    }

    .pik-arm{
      display:none !important;
    }

    .pik-leg{
      bottom:-11px;
      width:6px;
      height:10px;
      background:#fff;
      box-shadow:none;
    }

    .pik-leg-left{left:6px;}
    .pik-leg-right{right:6px;}

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
      .pik-stage{min-height:170px;padding:14px 10px 22px;}
      .pik-visual-only{min-height:120px;}
      .pik-visual-only{transform:scale(1.18);}
      .pik-css{width:58px;height:70px;transform:none;}
      .pik-sad{transform:translateY(8px);}
      .pik-happy{animation:pikCelebrateMobile .35s steps(2,end) 2;}
      @keyframes pikCelebrateMobile{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
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
