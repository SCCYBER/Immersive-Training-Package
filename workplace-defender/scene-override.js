(function () {
  function useCleanSceneRenderer() {
    if (typeof window.renderWorkplaceDefenderScene !== "function") return;

    window.sceneHtml = function (scene) {
      return window.renderWorkplaceDefenderScene(scene);
    };

    try {
      sceneHtml = window.sceneHtml;
    } catch (e) {}
  }

  const style = document.createElement("style");
  style.textContent = `
    #question{
      font-size:clamp(15px, 2vw, 21px) !important;
      line-height:1.28 !important;
      margin-bottom:12px !important;
    }

    .answer-btn{
      font-size:13px !important;
      line-height:1.28 !important;
      padding:9px 11px !important;
      min-height:auto !important;
    }

    .question-card{
      padding:14px !important;
    }

    .question-tag{
      font-size:10px !important;
      margin-bottom:10px !important;
    }

    .answers{
      gap:9px !important;
    }

    .feedback{
      font-size:13px !important;
      line-height:1.35 !important;
      margin-top:10px !important;
    }

    .why{
      font-size:12px !important;
      line-height:1.35 !important;
      margin-top:6px !important;
    }

    .scenario-art{
      min-height:230px !important;
      margin-bottom:12px !important;
    }

    .progress-grid{
      gap:9px !important;
      margin-bottom:10px !important;
    }

    .hud-box{
      padding:10px !important;
    }

    .hud-box span{
      font-size:9px !important;
    }

    .hud-box strong{
      font-size:18px !important;
    }

    @media (max-width: 640px){
      #question{
        font-size:14px !important;
        line-height:1.25 !important;
      }

      .answer-btn{
        font-size:12px !important;
        line-height:1.22 !important;
        padding:8px 9px !important;
      }

      .question-card{
        padding:12px !important;
      }

      .scenario-art{
        min-height:190px !important;
      }

      .feedback{
        font-size:12px !important;
      }

      .why{
        font-size:11px !important;
      }
    }
  `;
  document.head.appendChild(style);

  useCleanSceneRenderer();
  window.addEventListener("load", useCleanSceneRenderer);
  setTimeout(useCleanSceneRenderer, 250);
})();