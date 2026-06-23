(function () {
  function removeAdminRefreshButton() {
    const button = document.getElementById("refreshAdminBtn");
    if (!button) return;
    button.remove();
  }

  function overrideMissingSavedLoginMessage() {
    if (typeof showSavedLogin !== "function" || window.sccyberSavedLoginMessageFixed) return;
    window.sccyberSavedLoginMessageFixed = true;

    const original = showSavedLogin;
    showSavedLogin = function fixedShowSavedLogin(username) {
      const saved = typeof getLoginSecret === "function" ? getLoginSecret(username) : null;
      const secret = typeof savedSecretValue === "function" ? savedSecretValue(saved) : "";

      if (!saved || !secret) {
        if (typeof showPanel === "function") {
          showPanel(`
            <div class="report-section">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                <div class="report-section-title">NO SAVED LOGIN</div>
                <button class="small-btn fixed-close-admin-panel" type="button">Close</button>
              </div>
              <p>No saved password is stored in this browser for ${username}.</p>
              <p>Use <strong>Reset Login</strong> to generate a new password. The new password will then show here.</p>
            </div>
          `);
        }
        return;
      }

      original(username);
    };
  }

  window.addEventListener("load", function () {
    removeAdminRefreshButton();
    overrideMissingSavedLoginMessage();
    setTimeout(removeAdminRefreshButton, 300);
    setTimeout(removeAdminRefreshButton, 1000);
    setInterval(removeAdminRefreshButton, 2000);
  });
})();