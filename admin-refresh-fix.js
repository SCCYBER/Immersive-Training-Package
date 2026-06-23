(function () {
  async function runStableAdminRefresh(button) {
    if (!button || button.dataset.sccyberRefreshing === "true") return;

    const originalText = button.textContent || "Refresh";
    button.dataset.sccyberRefreshing = "true";
    button.disabled = true;
    button.textContent = "Refreshing...";

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

      const selected = document.getElementById("adminSelectedReport");
      if (selected && selected.textContent.trim() === "") {
        selected.textContent = "Select a learner to view their report.";
      }

      button.textContent = "Refreshed";
      setTimeout(function () {
        button.textContent = originalText;
      }, 900);
    } catch (error) {
      console.error("SCCYBER admin refresh failed", error);
      button.textContent = "Refresh failed";

      const output = document.getElementById("adminOutput");
      if (output) {
        output.textContent = "Refresh failed. Check your admin session, database connection or Supabase policy.";
      }

      setTimeout(function () {
        button.textContent = originalText;
      }, 1600);
    } finally {
      button.disabled = false;
      delete button.dataset.sccyberRefreshing;
    }
  }

  function bindAdminRefreshButton() {
    const button = document.getElementById("refreshAdminBtn");
    if (!button || button.dataset.sccyberRefreshFixBound === "true") return;

    button.dataset.sccyberRefreshFixBound = "true";

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      runStableAdminRefresh(button);
    }, true);
  }

  window.addEventListener("load", function () {
    bindAdminRefreshButton();
    setTimeout(bindAdminRefreshButton, 300);
    setTimeout(bindAdminRefreshButton, 1000);
  });
})();