(function () {
  const logoUrl = "https://sccyber.github.io/breach-lockdown/logo.png";

  document.querySelectorAll('img[alt="SCCYBER logo"]').forEach(function (img) {
    img.src = logoUrl;
  });

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://sccyber.github.io/breach-lockdown/style.css";
  document.head.appendChild(css);

  function addEffects() {
    if (!document.body) {
      window.addEventListener("DOMContentLoaded", addEffects, { once: true });
      return false;
    }

    if (document.getElementById("wdFxLayer")) return true;

    const fx = document.createElement("div");
    fx.id = "wdFxLayer";
    fx.innerHTML = '<div id="wdFxIcon"></div><div id="wdFxText"></div>';
    document.body.appendChild(fx);

    const overlay = document.createElement("div");
    overlay.id = "wdResultOverlay";
    overlay.innerHTML = '<div class="wd-result-card"><img src="' + logoUrl + '" alt="SCCYBER logo"><div id="wdResultTopline"></div><div id="wdResultTitle"></div><div id="wdResultScore"></div><div id="wdResultCopy"></div></div>';
    document.body.appendChild(overlay);
    return true;
  }

  window.sccyberWorkplaceDefenderFlash = function (kind) {
    if (!addEffects()) return;
    const layer = document.getElementById("wdFxLayer");
    const icon = document.getElementById("wdFxIcon");
    const text = document.getElementById("wdFxText");
    if (!layer || !icon || !text) return;

    layer.className = "";
    void layer.offsetWidth;

    if (kind === "correct") {
      icon.textContent = "✓";
      text.textContent = "CORRECT";
      layer.classList.add("wd-fx-correct", "active");
    } else {
      icon.textContent = "☠";
      text.textContent = "RISK";
      layer.classList.add("wd-fx-wrong", "active");
    }

    setTimeout(function () {
      layer.className = "";
    }, 820);
  };

  window.sccyberWorkplaceDefenderResultScreen = function (passed, accuracy, score, rank) {
    if (!addEffects()) return;
    const overlay = document.getElementById("wdResultOverlay");
    const topline = document.getElementById("wdResultTopline");
    const title = document.getElementById("wdResultTitle");
    const scoreLine = document.getElementById("wdResultScore");
    const copy = document.getElementById("wdResultCopy");
    if (!overlay || !topline || !title || !scoreLine || !copy) return;

    overlay.className = passed ? "pass active" : "fail active";
    topline.textContent = passed ? "WORKPLACE DEFENCE ACTIVE" : "WORKPLACE RISK EXPOSED";
    title.textContent = passed ? "MISSION PASSED" : "MODULE FAILED";
    scoreLine.textContent = accuracy + "% · " + score + " POINTS · " + rank;
    copy.textContent = passed ? "Good decisions across office, remote and device scenarios." : "The workplace was left exposed. Review the weak areas and try again later.";
  };

  css.addEventListener("load", function () {
    const style = document.createElement("style");
    style.textContent = `
      .progress-grid{
        display:grid !important;
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
        gap:14px !important;
        margin-bottom:16px !important;
      }

      .scenario-art{
        position:relative;
        min-height:230px;
        margin:0 0 18px;
        border:2px solid rgba(169,76,255,0.34);
        border-radius:18px;
        overflow:hidden;
        background:radial-gradient(circle at 50% 30%, rgba(169,76,255,0.18), rgba(9,2,22,0.96) 60%), linear-gradient(135deg, rgba(0,75,155,0.22), rgba(166,0,125,0.22));
        box-shadow:0 0 28px rgba(111,29,206,0.22), inset 0 0 40px rgba(0,0,0,0.45);
      }

      .scenario-art:before{
        content:"";
        position:absolute;
        inset:0;
        background:repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 7px);
        opacity:.55;
        pointer-events:none;
      }

      .pixel-scene{
        position:absolute;
        inset:0;
        image-rendering:pixelated;
      }

      .pixel-scene div{position:absolute;box-sizing:border-box;}

      .scene-bg{
        inset:0;
        background:
          linear-gradient(90deg, transparent 0 8%, rgba(89,255,157,.09) 8% 9%, transparent 9% 20%, rgba(169,76,255,.12) 20% 21%, transparent 21% 100%),
          repeating-linear-gradient(90deg, rgba(89,255,157,.08) 0 34px, transparent 34px 70px);
        opacity:.7;
      }

      .scene-object-a,.scene-object-b,.scene-object-c,.scene-alert{
        border:3px solid rgba(255,255,255,.78);
        box-shadow:0 0 14px rgba(169,76,255,.35), inset 0 0 18px rgba(169,76,255,.14);
      }

      .office .scene-object-a,.printer .scene-object-a,.laptop .scene-object-a,.update .scene-object-a{
        width:150px;height:88px;left:13%;top:25%;background:#07142e;border-color:#59ff9d;
      }
      .office .scene-object-b,.printer .scene-object-b,.laptop .scene-object-b,.update .scene-object-b{
        width:220px;height:24px;left:8%;bottom:22%;background:#a94cff;border-color:#ffffff;
      }
      .office .scene-object-c,.printer .scene-object-c,.laptop .scene-object-c,.update .scene-object-c{
        width:46px;height:70px;right:18%;bottom:24%;background:#07142e;border-color:#ffd44d;
      }
      .office .scene-alert,.laptop .scene-alert,.update .scene-alert{
        width:42px;height:42px;left:27%;top:38%;border-radius:8px;background:#59ff9d;border-color:#59ff9d;
      }

      .printer .scene-alert{
        width:92px;height:54px;right:17%;top:31%;background:#ffffff;border-color:#ff3b6b;
      }

      .door .scene-object-a{
        width:95px;height:150px;left:15%;top:20%;background:#07142e;border-color:#a94cff;
      }
      .door .scene-object-b{
        width:54px;height:86px;right:24%;bottom:21%;background:#ff3b6b;border-color:#ffffff;
      }
      .door .scene-object-c{
        width:54px;height:86px;right:38%;bottom:21%;background:#59ff9d;border-color:#ffffff;
      }
      .door .scene-alert{
        width:40px;height:40px;left:34%;top:42%;background:#ffd44d;border-color:#ffd44d;
      }

      .wifi .scene-object-a,.router .scene-object-a{
        width:160px;height:82px;left:13%;bottom:24%;background:#07142e;border-color:#59ff9d;
      }
      .wifi .scene-object-b,.router .scene-object-b{
        width:180px;height:36px;right:12%;bottom:30%;background:#a94cff;border-color:#ffffff;
      }
      .wifi .scene-object-c,.router .scene-object-c{
        width:34px;height:80px;right:25%;bottom:42%;background:#59ff9d;border-color:#59ff9d;
      }
      .wifi .scene-alert,.router .scene-alert{
        width:130px;height:80px;left:47%;top:20%;border:0;border-top:8px solid #ffd44d;border-radius:70px 70px 0 0;box-shadow:0 -10px 24px rgba(255,212,77,.35);
      }

      .train .scene-object-a{
        width:260px;height:92px;left:12%;bottom:25%;background:#07142e;border-color:#59ff9d;
      }
      .train .scene-object-b{
        width:54px;height:54px;left:25%;bottom:37%;background:#a94cff;border-color:#ffffff;
      }
      .train .scene-object-c{
        width:54px;height:54px;left:48%;bottom:37%;background:#a94cff;border-color:#ffffff;
      }
      .train .scene-alert{
        width:44px;height:86px;right:17%;bottom:22%;background:#ff3b6b;border-color:#ffffff;
      }

      .phone .scene-object-a{
        width:92px;height:150px;left:20%;top:18%;background:#07142e;border-color:#59ff9d;border-radius:14px;
      }
      .phone .scene-object-b{
        width:160px;height:24px;right:14%;bottom:26%;background:#a94cff;border-color:#ffffff;
      }
      .phone .scene-object-c{
        width:42px;height:42px;left:28%;top:34%;background:#ff3b6b;border-color:#ff3b6b;
      }
      .phone .scene-alert{
        width:55px;height:55px;right:26%;top:26%;background:#ffd44d;border-color:#ffd44d;
      }

      .cloud .scene-object-a,.extension .scene-object-a,.login .scene-object-a{
        width:210px;height:108px;left:10%;top:25%;background:#07142e;border-color:#59ff9d;
      }
      .cloud .scene-object-b,.extension .scene-object-b,.login .scene-object-b{
        width:138px;height:70px;right:16%;top:28%;background:#a94cff;border-color:#ffffff;border-radius:35px;
      }
      .cloud .scene-object-c,.extension .scene-object-c,.login .scene-object-c{
        width:70px;height:70px;right:29%;top:42%;background:#07142e;border-color:#ffd44d;
      }
      .cloud .scene-alert,.extension .scene-alert,.login .scene-alert{
        width:44px;height:44px;left:24%;top:38%;background:#ff3b6b;border-color:#ff3b6b;
      }

      .cabinet .scene-object-a{
        width:110px;height:155px;left:18%;top:17%;background:#07142e;border-color:#59ff9d;
      }
      .cabinet .scene-object-b{
        width:72px;height:120px;left:34%;top:26%;background:#090216;border-color:#ff3b6b;
      }
      .cabinet .scene-object-c{
        width:170px;height:28px;right:12%;bottom:24%;background:#a94cff;border-color:#ffffff;
      }
      .cabinet .scene-alert{
        width:50px;height:50px;left:45%;top:22%;background:#ffd44d;border-color:#ffd44d;
      }

      .usb .scene-object-a{
        width:165px;height:92px;left:12%;bottom:28%;background:#07142e;border-color:#59ff9d;
      }
      .usb .scene-object-b{
        width:120px;height:38px;right:22%;bottom:38%;background:#ff3b6b;border-color:#ffffff;
      }
      .usb .scene-object-c{
        width:42px;height:28px;right:16%;bottom:40%;background:#ffffff;border-color:#ffffff;
      }
      .usb .scene-alert{
        width:55px;height:55px;right:32%;top:25%;background:#ffd44d;border-color:#ffd44d;
      }

      .incident .scene-object-a{
        width:210px;height:110px;left:11%;top:25%;background:#07142e;border-color:#59ff9d;
      }
      .incident .scene-object-b{
        width:88px;height:54px;right:17%;top:31%;background:#ffffff;border-color:#ff3b6b;
      }
      .incident .scene-object-c{
        width:88px;height:54px;right:30%;bottom:25%;background:#ffffff;border-color:#a94cff;
      }
      .incident .scene-alert{
        width:58px;height:58px;left:46%;top:33%;background:#ff3b6b;border-color:#ff3b6b;
      }

      .answer-btn{
        background:transparent !important;
        border:2px solid rgba(169,76,255,0.65) !important;
        color:#ffffff !important;
        box-shadow:none !important;
        font-family:'Share Tech Mono', monospace !important;
        font-size:17px !important;
      }

      .answer-btn:hover{background:rgba(169,76,255,0.12) !important;border-color:#a94cff !important;color:#ffffff !important;box-shadow:0 0 16px rgba(169,76,255,0.22) !important;}
      .answer-btn.correct{background:rgba(89,255,157,0.12) !important;border-color:#59ff9d !important;color:#59ff9d !important;}
      .answer-btn.wrong{background:rgba(255,59,107,0.10) !important;border-color:#ff3b6b !important;color:#ff3b6b !important;}
      #resultCard{padding-bottom:22px !important;}

      #wdFxLayer{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;pointer-events:none;opacity:0;}
      #wdFxLayer.active{animation:wdFlash 0.78s ease forwards;}
      #wdFxIcon{font-family:'Press Start 2P', cursive;font-size:clamp(110px,18vw,230px);line-height:1;transform:scale(0.45);}
      #wdFxText{font-family:'Press Start 2P', cursive;font-size:clamp(13px,2vw,24px);line-height:1.7;letter-spacing:2px;}
      .wd-fx-correct{background:radial-gradient(circle at center, rgba(89,255,157,0.16), rgba(9,2,22,0.02) 45%, rgba(9,2,22,0) 70%);}
      .wd-fx-correct #wdFxIcon,.wd-fx-correct #wdFxText{color:#59ff9d;text-shadow:0 0 18px #59ff9d, 0 0 42px rgba(89,255,157,0.45);}
      .wd-fx-wrong{background:radial-gradient(circle at center, rgba(255,59,107,0.22), rgba(9,2,22,0.04) 45%, rgba(9,2,22,0) 70%);}
      .wd-fx-wrong #wdFxIcon,.wd-fx-wrong #wdFxText{color:#ff3b6b;text-shadow:0 0 18px #ff3b6b, 0 0 42px rgba(255,59,107,0.55);}
      @keyframes wdFlash{0%{opacity:0;transform:scale(0.96);}12%{opacity:1;transform:scale(1.02);}55%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(0.98);}}
      #wdFxLayer.active #wdFxIcon{animation:wdIconPop 0.78s ease forwards;}
      @keyframes wdIconPop{0%{transform:scale(0.18) rotate(-8deg);}22%{transform:scale(1.18) rotate(3deg);}45%{transform:scale(0.96) rotate(-2deg);}100%{transform:scale(0.82) rotate(0deg);}}

      #wdResultOverlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;text-align:center;padding:24px;}
      #wdResultOverlay.active{display:flex;animation:wdOverlayIn 0.35s ease forwards;}
      #wdResultOverlay.pass{background:radial-gradient(circle at center, rgba(89,255,157,0.16), rgba(9,2,22,0.97) 58%), linear-gradient(180deg, rgba(24,6,55,0.98), rgba(7,2,17,0.99));}
      #wdResultOverlay.fail{background:radial-gradient(circle at center, rgba(255,59,107,0.16), rgba(9,2,22,0.97) 58%), linear-gradient(180deg, rgba(24,6,55,0.98), rgba(7,2,17,0.99));}
      .wd-result-card{width:min(92vw,760px);background:linear-gradient(180deg, rgba(19,4,45,0.96), rgba(13,3,31,0.97));border:2px solid rgba(169,76,255,0.28);border-radius:18px;padding:26px 18px 30px;box-shadow:0 0 40px rgba(111,29,206,0.35);}
      .wd-result-card img{width:135px;max-width:44vw;margin-bottom:16px;}
      #wdResultTopline{font-family:'Press Start 2P', cursive;color:#ffd44d;font-size:clamp(10px,1.5vw,15px);line-height:1.8;margin-bottom:14px;text-shadow:0 0 10px rgba(255,212,77,0.35);}
      #wdResultTitle{font-family:'Press Start 2P', cursive;font-size:clamp(24px,4vw,48px);line-height:1.5;margin-bottom:14px;}
      .pass #wdResultTitle{color:#59ff9d;text-shadow:0 0 16px #59ff9d, 0 0 36px rgba(89,255,157,0.35);}
      .fail #wdResultTitle{color:#ff3b6b;text-shadow:0 0 16px #ff3b6b, 0 0 36px rgba(255,59,107,0.35);}
      #wdResultScore{font-family:'Press Start 2P', cursive;color:#ffffff;font-size:clamp(12px,2vw,20px);line-height:1.8;margin-bottom:12px;}
      #wdResultCopy{color:#b7a8d3;font-size:18px;line-height:1.6;}
      @keyframes wdOverlayIn{0%{opacity:0;transform:scale(1.02);}100%{opacity:1;transform:scale(1);}}
    `;
    document.head.appendChild(style);
    if (document.body) {
      addEffects();
    } else {
      window.addEventListener("DOMContentLoaded", addEffects, { once: true });
    }
  });
})();
