(function () {
  async function runStableAdminRefresh(button) {
    const originalText = button ? button.textContent || "Refresh" : "Refresh";

    if (button) {
      button.disabled = true;
      button.textContent = "Refreshing...";
    }

    try {
      if (typeof sccyberSyncGameRegistryFromCards === "function") {
        sccyberSyncGameRegistryFromCards();
      }

      if (typeof loadAdminData !== "function") {
        throw new Error("Admin data loader is not available.");
      }

      await loadAdminData();

      if (typeof attachStableAdminButtons === "function") {
        attachStableAdminButtons();
        setTimeout(attachStableAdminButtons, 150);
        setTimeout(attachStableAdminButtons, 500);
      }

      if (button) {
        button.textContent = "Refreshed";
        setTimeout(function () {
          button.textContent = originalText;
        }, 900);
      }
    } catch (error) {
      console.error("SCCYBER admin refresh failed", error);

      if (button) {
        button.textContent = "Refresh failed";
        setTimeout(function () {
          button.textContent = originalText;
        }, 1600);
      }

      const output = document.getElementById("adminOutput");
      if (output) {
        output.textContent = "Refresh failed. Check your admin session, database connection or Supabase policy.";
      }
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

  window.sccyberAdminRefresh = function () {
    runStableAdminRefresh(document.getElementById("refreshAdminBtn"));
  };

  window.addEventListener("load", function () {
    bindAdminRefreshButton();
    setTimeout(bindAdminRefreshButton, 300);
    setTimeout(bindAdminRefreshButton, 1000);
    setInterval(bindAdminRefreshButton, 2000);
  });
})();