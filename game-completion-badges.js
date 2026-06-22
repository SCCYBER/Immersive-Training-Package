function sccyberCompletedAttemptsFor(profile, gameKey) {
  return (profile?.attempts || []).filter(function (attempt) {
    return attempt.game === gameKey && attempt.completed === true;
  });
}

function sccyberRenderGameCompletionBadges() {
  const profile = typeof loadProfile === "function" ? loadProfile() : null;

  document.querySelectorAll(".game-card").forEach(function (card) {
    const key = card.dataset.game;
    let badge = card.querySelector(".game-complete-badge");

    if (!badge) {
      badge = document.createElement("div");
      badge.className = "game-complete-badge hidden";
      badge.textContent = "✓ DONE";
      card.insertBefore(badge, card.firstChild);
    }

    const isDone = key && sccyberCompletedAttemptsFor(profile, key).length > 0;
    badge.classList.toggle("hidden", !isDone);
    card.classList.toggle("game-completed", !!isDone);
  });
}

window.addEventListener("load", function () {
  const originalUpdateDashboard = window.updateDashboard || (typeof updateDashboard === "function" ? updateDashboard : null);

  if (originalUpdateDashboard && !window.sccyberCompletionBadgesPatched) {
    window.sccyberCompletionBadgesPatched = true;
    updateDashboard = function patchedUpdateDashboard() {
      originalUpdateDashboard.apply(this, arguments);
      sccyberRenderGameCompletionBadges();
    };
  }

  setTimeout(sccyberRenderGameCompletionBadges, 250);
});
