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
})();