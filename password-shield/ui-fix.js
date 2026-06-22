(function () {
  const logoUrl = "https://sccyber.github.io/breach-lockdown/logo.png";
  document.querySelectorAll('img[alt="SCCYBER logo"]').forEach(function (img) {
    img.src = logoUrl;
  });

  document.querySelectorAll(".start-title-main, .title").forEach(function (el) {
    el.textContent = "PASSWORD SHIELD";
  });

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://sccyber.github.io/breach-lockdown/style.css";
  document.head.appendChild(css);

  function addPasswordShieldEffects() {
    if (document.getElementById("psFxLayer")) return;

    const fx = document.createElement("div");
    fx.id = "psFxLayer";
    fx.innerHTML = '<div id="psFxIcon"></div><div id="psFxText"></div>';
    document.body.appendChild(fx);

    const overlay = document.createElement("div");
    overlay.id = "psResultOverlay";
    overlay.innerHTML = '<div class="ps-result-card"><img src="' + logoUrl + '" alt="SCCYBER logo"><div id="psResultTopline"></div><div id="psResultTitle"></div><div id="psResultScore"></div><div id="psResultCopy"></div></div>';
    document.body.appendChild(overlay);
  }

  window.sccyberPasswordShieldFlash = function (kind) {
    addPasswordShieldEffects();
    const layer = document.getElementById("psFxLayer");
    const icon = document.getElementById("psFxIcon");
    const text = document.getElementById("psFxText");

    layer.className = "";
    void layer.offsetWidth;

    if (kind === "correct") {
      icon.textContent = "✓";
      text.textContent = "CORRECT";
      layer.classList.add("ps-fx-correct", "active");
    } else {
      icon.textContent = "☠";
      text.textContent = "WRONG";
      layer.classList.add("ps-fx-wrong", "active");
    }

    setTimeout(function () {
      layer.className = "";
    }, 820);
  };

  window.sccyberPasswordShieldResultScreen = function (passed, accuracy, score, rank) {
    addPasswordShieldEffects();
    const overlay = document.getElementById("psResultOverlay");
    const topline = document.getElementById("psResultTopline");
    const title = document.getElementById("psResultTitle");
    const scoreLine = document.getElementById("psResultScore");
    const copy = document.getElementById("psResultCopy");

    overlay.className = passed ? "pass active" : "fail active";
    topline.textContent = passed ? "ACCOUNT SHIELD ACTIVE" : "ACCOUNT SHIELD FAILED";
    title.textContent = passed ? "MISSION PASSED" : "MODULE FAILED";
    scoreLine.textContent = accuracy + "% · " + score + " POINTS · " + rank;
    copy.textContent = passed ? "Safe account habits confirmed." : "The account was left exposed. Review the weak points and try again later.";
  };

  css.addEventListener("load", function () {
    const style = document.createElement("style");
    style.textContent = `
      .answer-btn{
        background:transparent !important;
        border:2px solid rgba(169,76,255,0.65) !important;
        color:#ffffff !important;
        box-shadow:none !important;
        font-family:'Share Tech Mono', monospace !important;
        font-size:17px !important;
      }

      .answer-btn:hover{
        background:rgba(169,76,255,0.12) !important;
        border-color:#a94cff !important;
        color:#ffffff !important;
        box-shadow:0 0 16px rgba(169,76,255,0.22) !important;
      }

      .answer-btn.correct{
        background:rgba(89,255,157,0.12) !important;
        border-color:#59ff9d !important;
        color:#59ff9d !important;
      }

      .answer-btn.wrong{
        background:rgba(255,59,107,0.10) !important;
        border-color:#ff3b6b !important;
        color:#ff3b6b !important;
      }

      .stage-pill{
        font-size:6px !important;
        line-height:1.45 !important;
        color:#b7a8d3 !important;
        background:rgba(12,3,30,0.65) !important;
        border:1px solid rgba(169,76,255,0.35) !important;
        box-shadow:none !important;
        padding:7px 5px !important;
      }

      .stage-pill.active{
        color:#ffffff !important;
        border-color:#a94cff !important;
        background:rgba(169,76,255,0.14) !important;
        box-shadow:0 0 10px rgba(169,76,255,0.18) !important;
      }

      .stage-track{
        gap:6px !important;
      }

      .leaderboard-panel,
      #playAgainBtn,
      #dashboardBtn{
        display:none !important;
      }

      #nextBtn{
        display:none;
      }

      #resultCard{
        padding-bottom:22px !important;
      }

      #psFxLayer{
        position:fixed;
        inset:0;
        z-index:9998;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        gap:14px;
        pointer-events:none;
        opacity:0;
      }

      #psFxLayer.active{
        animation:psFlash 0.78s ease forwards;
      }

      #psFxIcon{
        font-family:'Press Start 2P', cursive;
        font-size:clamp(110px,18vw,230px);
        line-height:1;
        transform:scale(0.45);
      }

      #psFxText{
        font-family:'Press Start 2P', cursive;
        font-size:clamp(13px,2vw,24px);
        line-height:1.7;
        letter-spacing:2px;
      }

      .ps-fx-correct{
        background:radial-gradient(circle at center, rgba(89,255,157,0.16), rgba(9,2,22,0.02) 45%, rgba(9,2,22,0) 70%);
      }

      .ps-fx-correct #psFxIcon,
      .ps-fx-correct #psFxText{
        color:#59ff9d;
        text-shadow:0 0 18px #59ff9d, 0 0 42px rgba(89,255,157,0.45);
      }

      .ps-fx-wrong{
        background:radial-gradient(circle at center, rgba(255,59,107,0.22), rgba(9,2,22,0.04) 45%, rgba(9,2,22,0) 70%);
      }

      .ps-fx-wrong #psFxIcon,
      .ps-fx-wrong #psFxText{
        color:#ff3b6b;
        text-shadow:0 0 18px #ff3b6b, 0 0 42px rgba(255,59,107,0.55);
      }

      @keyframes psFlash{
        0%{opacity:0; transform:scale(0.96);}
        12%{opacity:1; transform:scale(1.02);}
        55%{opacity:1; transform:scale(1);}
        100%{opacity:0; transform:scale(0.98);}
      }

      #psFxLayer.active #psFxIcon{
        animation:psIconPop 0.78s ease forwards;
      }

      @keyframes psIconPop{
        0%{transform:scale(0.18) rotate(-8deg);}
        22%{transform:scale(1.18) rotate(3deg);}
        45%{transform:scale(0.96) rotate(-2deg);}
        100%{transform:scale(0.82) rotate(0deg);}
      }

      #psResultOverlay{
        position:fixed;
        inset:0;
        z-index:9999;
        display:none;
        align-items:center;
        justify-content:center;
        text-align:center;
        padding:24px;
      }

      #psResultOverlay.active{
        display:flex;
        animation:psOverlayIn 0.35s ease forwards;
      }

      #psResultOverlay.pass{
        background:radial-gradient(circle at center, rgba(89,255,157,0.16), rgba(9,2,22,0.97) 58%), linear-gradient(180deg, rgba(24,6,55,0.98), rgba(7,2,17,0.99));
      }

      #psResultOverlay.fail{
        background:radial-gradient(circle at center, rgba(255,59,107,0.16), rgba(9,2,22,0.97) 58%), linear-gradient(180deg, rgba(24,6,55,0.98), rgba(7,2,17,0.99));
      }

      .ps-result-card{
        width:min(92vw,760px);
        background:linear-gradient(180deg, rgba(19,4,45,0.96), rgba(13,3,31,0.97));
        border:2px solid rgba(169,76,255,0.28);
        border-radius:18px;
        padding:26px 18px 30px;
        box-shadow:0 0 40px rgba(111,29,206,0.35);
      }

      .ps-result-card img{
        width:135px;
        max-width:44vw;
        margin-bottom:16px;
      }

      #psResultTopline{
        font-family:'Press Start 2P', cursive;
        color:#ffd44d;
        font-size:clamp(10px,1.5vw,15px);
        line-height:1.8;
        margin-bottom:14px;
        text-shadow:0 0 10px rgba(255,212,77,0.35);
      }

      #psResultTitle{
        font-family:'Press Start 2P', cursive;
        font-size:clamp(24px,4vw,48px);
        line-height:1.5;
        margin-bottom:14px;
      }

      .pass #psResultTitle{
        color:#59ff9d;
        text-shadow:0 0 16px #59ff9d, 0 0 36px rgba(89,255,157,0.35);
      }

      .fail #psResultTitle{
        color:#ff3b6b;
        text-shadow:0 0 16px #ff3b6b, 0 0 36px rgba(255,59,107,0.35);
      }

      #psResultScore{
        font-family:'Press Start 2P', cursive;
        color:#ffffff;
        font-size:clamp(12px,2vw,20px);
        line-height:1.8;
        margin-bottom:12px;
      }

      #psResultCopy{
        color:#b7a8d3;
        font-size:18px;
        line-height:1.6;
      }

      @keyframes psOverlayIn{
        0%{opacity:0; transform:scale(1.02);}
        100%{opacity:1; transform:scale(1);}
      }
    `;
    document.head.appendChild(style);
    addPasswordShieldEffects();
  });
})();