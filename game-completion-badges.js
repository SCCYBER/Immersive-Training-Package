function sccyberInstallCompletionBadgeStyles() {
  if (document.getElementById("sccyberCompletionBadgeStyles")) return;

  const style = document.createElement("style");
  style.id = "sccyberCompletionBadgeStyles";
  style.textContent = `
    .game-card.game-try-again{
      border-color:rgba(255,212,77,.65);
      box-shadow:0 0 22px rgba(255,212,77,.12);
    }

    .game-complete-badge.try-again{
      background:rgba(255,212,77,.12);
      border-color:rgba(255,212,77,.75);
      color:var(--amber);
      box-shadow:0 0 12px rgba(255,212,77,.16);
    }
  `;
  document.head.appendChild(style);
}

function sccyberCompletedAttemptsFor(profile, gameKey) {
  return (profile?.attempts || []).filter(function (attempt) {
    return attempt.game === gameKey && attempt.completed === true;
  });
}

function sccyberAttemptPassed(attempt) {
  const passMark = typeof PASS_MARK !== "undefined" ? PASS_MARK : 80;
  const accuracy = typeof attemptAccuracy === "function" ? attemptAccuracy(attempt) : Number(attempt.accuracy || 0);
  return attempt.passed === true || accuracy >= passMark;
}

function sccyberGameResultState(profile, gameKey) {
  const completedAttempts = sccyberCompletedAttemptsFor(profile, gameKey);

  if (!completedAttempts.length) {
    return "none";
  }

  const hasPass = completedAttempts.some(sccyberAttemptPassed);
  return hasPass ? "done" : "try-again";
}

function sccyberRenderGameCompletionBadges() {
  sccyberInstallCompletionBadgeStyles();

  const profile = typeof loadProfile === "function" ? loadProfile() : null;

  document.querySelectorAll(".game-card").forEach(function (card) {
    const key = card.dataset.game;
    let badge = card.querySelector(".game-complete-badge");

    if (!badge) {
      badge = document.createElement("div");
      badge.className = "game-complete-badge hidden";
      card.insertBefore(badge, card.firstChild);
    }

    const state = key ? sccyberGameResultState(profile, key) : "none";

    badge.classList.toggle("hidden", state === "none");
    badge.classList.toggle("try-again", state === "try-again");
    badge.textContent = state === "done" ? "✓ DONE" : "TRY AGAIN";

    card.classList.toggle("game-completed", state === "done");
    card.classList.toggle("game-try-again", state === "try-again");
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
