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
      font-size:clamp(18px, 2.4vw, 26px) !important;
      line-height:1.35 !important;
    }

    .answer-btn{
      font-size:15px !important;
      line-height:1.35 !important;
      padding:12px 14px !important;
    }

    .question-card{
      padding:18px !important;
    }

    .feedback{
      font-size:15px !important;
      line-height:1.45 !important;
    }

    .why{
      font-size:14px !important;
      line-height:1.45 !important;
    }

    .scenario-art{
      min-height:250px !important;
    }
  `;
  document.head.appendChild(style);

  useCleanSceneRenderer();
  window.addEventListener("load", useCleanSceneRenderer);
  setTimeout(useCleanSceneRenderer, 250);
})();