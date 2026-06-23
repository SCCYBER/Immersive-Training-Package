(function () {
  function removeAdminRefreshButton() {
    const button = document.getElementById("refreshAdminBtn");
    if (!button) return;
    button.remove();
  }

  function currentAdminProfile() {
    try {
      return typeof loadProfile === "function"
        ? loadProfile()
        : JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
    } catch (e) {
      return null;
    }
  }

  function clearLocalAdminScores(profile) {
    if (!profile) return;
    profile.attempts = [];
    profile.scores = {};
    if (typeof saveProfile === "function") saveProfile(profile);
    else localStorage.setItem("sccyberPortalProfile", JSON.stringify(profile));
    if (typeof updateDashboard === "function") updateDashboard();
  }

  function addAdminResetScoresButton() {
    const profile = currentAdminProfile();
    if (!profile || profile.isAdmin !== true) return;
    if (document.getElementById("adminResetOwnScoresBtn")) return;

    const adminBtn = document.getElementById("adminBtn");
    if (!adminBtn || !adminBtn.parentElement) return;

    const button = document.createElement("button");
    button.id = "adminResetOwnScoresBtn";
    button.className = "small-btn";
    button.type = "button";
    button.textContent = "Reset Scores";
    button.addEventListener("click", async function () {
      const latest = currentAdminProfile();
      if (!latest || latest.isAdmin !== true) return;
      if (!confirm("Reset your own training scores?")) return;

      if (latest.supabaseUserId && typeof resetLearnerScores === "function") {
        await resetLearnerScores(latest.supabaseUserId);
      }

      clearLocalAdminScores(latest);
    });

    adminBtn.parentElement.insertBefore(button, adminBtn);
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
    addAdminResetScoresButton();
    overrideMissingSavedLoginMessage();
    setTimeout(removeAdminRefreshButton, 300);
    setTimeout(addAdminResetScoresButton, 300);
    setTimeout(removeAdminRefreshButton, 1000);
    setTimeout(addAdminResetScoresButton, 1000);
    setInterval(removeAdminRefreshButton, 2000);
    setInterval(addAdminResetScoresButton, 2000);
  });
})();