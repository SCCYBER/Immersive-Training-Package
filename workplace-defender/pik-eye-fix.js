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
  `;
  document.head.appendChild(style);
})();