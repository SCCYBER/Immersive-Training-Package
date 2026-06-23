(function () {
  const style = document.createElement("style");
  style.textContent = `
    .pik-eye{
      background:#a94cff !important;
      box-shadow:0 0 8px rgba(169,76,255,.8) !important;
    }

    .pik-happy .pik-eye{
      background:transparent !important;
      border-bottom-color:#a94cff !important;
      box-shadow:none !important;
      filter:drop-shadow(0 0 5px rgba(169,76,255,.9)) !important;
    }

    .pik-sad .pik-eye{
      background:transparent !important;
      border-top-color:#a94cff !important;
      box-shadow:none !important;
      filter:drop-shadow(0 0 5px rgba(169,76,255,.9)) !important;
    }

    @media (max-width:640px){
      html, body{
        max-width:100vw !important;
        overflow-x:hidden !important;
      }

      .game-shell{
        width:100% !important;
        max-width:100vw !important;
        padding:8px !important;
        box-sizing:border-box !important;
      }

      .game-panel{
        width:100% !important;
        max-width:100% !important;
        padding:12px !important;
        box-sizing:border-box !important;
      }

      .progress-grid{
        display:grid !important;
        grid-template-columns:1fr 1fr !important;
        gap:8px !important;
      }

      .scenario-art{
        min-height:128px !important;
        height:128px !important;
        margin-bottom:8px !important;
      }

      .pik-visual-only{
        min-height:128px !important;
        height:128px !important;
        overflow:visible !important;
      }

      .pik-css{
        width:96px !important;
        height:116px !important;
        transform:scale(.62) !important;
        transform-origin:center center !important;
        margin:0 auto !important;
      }

      .pik-happy{
        animation:pikCelebrateMobile .35s steps(2,end) 2 !important;
      }

      .pik-sad{
        transform:scale(.62) translateY(8px) !important;
      }

      @keyframes pikCelebrateMobile{
        0%,100%{transform:scale(.62) translateY(0)}
        50%{transform:scale(.62) translateY(-10px)}
      }

      #question{
        font-size:11px !important;
        line-height:1.18 !important;
        margin-bottom:8px !important;
      }

      .answer-btn{
        font-size:9.5px !important;
        line-height:1.15 !important;
        padding:6px 7px !important;
        min-height:auto !important;
      }

      .question-card{
        padding:9px !important;
      }

      .question-tag{
        font-size:7px !important;
        margin-bottom:6px !important;
      }

      .answers{
        gap:6px !important;
      }

      .feedback{
        font-size:10px !important;
        line-height:1.25 !important;
      }

      .why{
        font-size:9px !important;
        line-height:1.25 !important;
      }
    }
  `;
  document.head.appendChild(style);
})();