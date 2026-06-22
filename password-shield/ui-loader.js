(function () {
  if (document.querySelector('link[href="breach-style-match.css"]')) return;
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "breach-style-match.css";
  document.head.appendChild(link);
})();