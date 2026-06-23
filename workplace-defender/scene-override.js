(function () {
  let pikMood = "neutral";

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

  window.sceneHtml = function () {
    pikMood = "neutral";
    return renderPikOnly();
  };

  try { sceneHtml = window.sceneHtml; } catch (e) {}

  function forcePikIntoVisualBox() {
    const box = document.getElementById("scenarioArt");
    if (!box) return;
    box.innerHTML = renderPikOnly();
  }

  function setPikMood(mood) {
    pikMood = mood;
    forcePikIntoVisualBox();
  }

  window.sccyberWorkplaceDefenderFlash = function (state) {
    setPikMood(state === "correct" ? "happy" : "sad");
  };

  const style = document.createElement("style");
  style.textContent = `
    .scenario-art{
      min-height:150px !important;
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

    .pik-visual-only{
      width:100%;
      height:100%;
      min-height:150px;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      z-index:2;
    }

    .pik-css{
      position:relative;
      width:96px;
      height:116px;
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
      top:24px;
      width:8px;
      height:8px;
      background:#050508;
      border-radius:50%;
    }

    .pik-eye-left{left:17px;}
    .pik-eye-right{right:17px;}

    .pik-happy .pik-eye{
      top:23px;
      width:11px;
      height:7px;
      background:transparent;
      border-radius:0;
      border-top:4px solid #050508;
    }

    .pik-happy .pik-eye-left{left:15px;transform:rotate(10deg);}
    .pik-happy .pik-eye-right{right:15px;transform:rotate(-10deg);}

    .pik-sad .pik-eye{
      top:25px;
      width:12px;
      height:7px;
      background:transparent;
      border-radius:0;
      border-bottom:4px solid #050508;
    }

    .pik-sad .pik-eye-left{left:15px;transform:rotate(-14deg);}
    .pik-sad .pik-eye-right{right:15px;transform:rotate(14deg);}

    .pik-mouth{
      left:24px;
      top:36px;
      width:9px;
      height:4px;
      background:#050508;
      display:none;
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
      .scenario-art{min-height:110px !important;}
      .pik-visual-only{min-height:110px;}
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