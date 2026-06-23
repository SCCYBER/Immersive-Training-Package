(function () {
  const PIXEL_GUY = "data:image/png;base64,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";

  function renderPixelGuyScene(scene) {
    const names = {
      office: "DESK SECURITY",
      printer: "PRINTED DATA",
      door: "VISITOR CHECK",
      wifi: "REMOTE ACCESS",
      train: "PUBLIC SPACE",
      router: "HOME NETWORK",
      update: "DEVICE UPDATE",
      laptop: "WORK DEVICE",
      phone: "LOST DEVICE",
      cloud: "APPROVED TOOLS",
      extension: "BROWSER PROMPT",
      login: "ACCOUNT ACCESS",
      cabinet: "NETWORK ACCESS",
      usb: "UNKNOWN USB",
      incident: "REPORT INCIDENT"
    };

    return `<div class="single-pixel-scene"><div class="single-pixel-label">${names[scene] || "WORKPLACE DEFENDER"}</div><img class="single-pixel-guy" src="${PIXEL_GUY}" alt=""></div>`;
  }

  window.sceneHtml = renderPixelGuyScene;
  try { sceneHtml = renderPixelGuyScene; } catch (e) {}

  const style = document.createElement("style");
  style.textContent = `
    .scenario-art{min-height:165px !important;margin-bottom:10px !important;display:flex !important;align-items:center !important;justify-content:center !important;background:radial-gradient(circle at center, rgba(169,76,255,.16), rgba(9,2,22,.98) 62%), linear-gradient(135deg, rgba(5,29,77,.9), rgba(92,6,77,.75)) !important;border:2px solid rgba(169,76,255,.34) !important;border-radius:18px !important;overflow:hidden !important;}
    .single-pixel-scene{width:100%;height:100%;min-height:165px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;position:relative;}
    .single-pixel-scene:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 7px);pointer-events:none;}
    .single-pixel-label{position:relative;z-index:2;font-family:'Press Start 2P', cursive;font-size:9px;line-height:1.5;color:#ffd44d;text-align:center;text-shadow:0 0 10px rgba(255,212,77,.35);letter-spacing:.5px;}
    .single-pixel-guy{position:relative;z-index:2;width:82px;max-width:25vw;height:auto;image-rendering:pixelated;filter:drop-shadow(0 0 12px rgba(169,76,255,.55));}
    #question{font-size:clamp(13px, 1.7vw, 19px) !important;line-height:1.22 !important;margin-bottom:9px !important;}
    .answer-btn{font-size:11.5px !important;line-height:1.18 !important;padding:7px 9px !important;min-height:auto !important;}
    .question-card{padding:11px !important;}
    .question-tag{font-size:8px !important;margin-bottom:7px !important;}
    .answers{gap:7px !important;}
    .feedback{font-size:11.5px !important;line-height:1.28 !important;margin-top:7px !important;}
    .why{font-size:10.5px !important;line-height:1.28 !important;margin-top:5px !important;}
    .progress-grid{gap:7px !important;margin-bottom:7px !important;}
    .hud-box{padding:7px !important;}.hud-box span{font-size:7px !important;}.hud-box strong{font-size:15px !important;}
    @media (max-width:640px){.scenario-art{min-height:120px !important}.single-pixel-scene{min-height:120px;gap:5px}.single-pixel-guy{width:54px}.single-pixel-label{font-size:6px}#question{font-size:12px !important;line-height:1.18 !important}.answer-btn{font-size:10.5px !important;line-height:1.15 !important;padding:6px 7px !important}.question-card{padding:9px !important}.feedback{font-size:10.5px !important}.why{font-size:9.5px !important}}
  `;
  document.head.appendChild(style);

  window.addEventListener("load", function () {
    try { sceneHtml = renderPixelGuyScene; } catch (e) {}
  });
})();