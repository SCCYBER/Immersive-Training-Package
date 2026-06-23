(function () {
  async function runStableAdminRefresh(button) {
    const originalText = button ? button.textContent || "Refresh" : "Refresh";

    if (button) {
      button.disabled = true;
      button.textContent = "Refreshing...";
    }

    try {
      if (typeof sccyberSyncGameRegistryFromCards === "function") sccyberSyncGameRegistryFromCards();
      if (typeof loadAdminData !== "function") throw new Error("Admin data loader is not available.");

      await loadAdminData();

      if (typeof attachStableAdminButtons === "function") {
        attachStableAdminButtons();
        setTimeout(attachStableAdminButtons, 150);
        setTimeout(attachStableAdminButtons, 500);
      }

      if (button) {
        button.textContent = "Refreshed";
        setTimeout(function () { button.textContent = originalText; }, 900);
      }
    } catch (error) {
      console.error("SCCYBER admin refresh failed", error);
      if (button) {
        button.textContent = "Refresh failed";
        setTimeout(function () { button.textContent = originalText; }, 1600);
      }
      const output = document.getElementById("adminOutput");
      if (output) output.textContent = "Refresh failed. Check your admin session, database connection or Supabase policy.";
    } finally {
      if (button) button.disabled = false;
    }
  }

  function bindAdminRefreshButton() {
    const button = document.getElementById("refreshAdminBtn");
    if (!button) return;

    button.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      runStableAdminRefresh(button);
      return false;
    };
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
              <p>This usually means the login was created before password saving was added, created on another device, or browser storage was cleared.</p>
              <p>Use <strong>Reset Login</strong> for this learner to generate a new password. The new password will then show here.</p>
            </div>
          `);
        }
        return;
      }

      original(username);
    };
  }

  window.sccyberAdminRefresh = function () {
    runStableAdminRefresh(document.getElementById("refreshAdminBtn"));
  };

  window.addEventListener("load", function () {
    bindAdminRefreshButton();
    overrideMissingSavedLoginMessage();
    setTimeout(bindAdminRefreshButton, 300);
    setTimeout(bindAdminRefreshButton, 1000);
    setTimeout(overrideMissingSavedLoginMessage, 1000);
    setInterval(bindAdminRefreshButton, 2000);
  });
})();