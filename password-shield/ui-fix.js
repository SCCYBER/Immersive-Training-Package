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
    `;
    document.head.appendChild(style);
  });
})();