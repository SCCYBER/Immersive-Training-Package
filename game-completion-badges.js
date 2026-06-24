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

function sccyberAddAdminCompanyRemoveButtons() {
  const output = document.getElementById("adminOutput");
  if (!output) return;
  output.querySelectorAll("[data-org-row]").forEach(function (row) {
    if (row.querySelector(".fixed-remove-company")) return;
    const save = row.querySelector(".admin-update-org");
    if (!save || !save.parentElement) return;
    const button = document.createElement("button");
    button.className = "small-btn fixed-remove-company";
    button.type = "button";
    button.textContent = "Remove";
    button.style.marginLeft = "8px";
    button.dataset.id = save.dataset.id || "";
    save.parentElement.appendChild(button);
  });
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

function sccyberRemoteAttemptToLocal(row, profile) {
  const answered = row.answered || null;
  const accuracy = row.accuracy !== null && row.accuracy !== undefined
    ? row.accuracy
    : answered && row.correct_count !== null && row.correct_count !== undefined
      ? Math.round(Number(row.correct_count) / Number(answered) * 100)
      : null;

  return {
    firstName: profile.firstName,
    surname: profile.surname,
    learnerName: profile.name,
    departmentRole: profile.departmentRole,
    game: row.game,
    score: Number(row.score || 0),
    source: "supabase",
    totalQuestions: null,
    correct: row.correct_count,
    wrong: row.wrong_count,
    answered: row.answered,
    accuracy: accuracy,
    durationSeconds: row.duration_seconds,
    completed: true,
    passed: row.passed === true || Number(accuracy || 0) >= (typeof PASS_MARK !== "undefined" ? PASS_MARK : 80),
    role: null,
    threatsStopped: null,
    biggestWeakness: null,
    createdAt: row.created_at || new Date().toISOString()
  };
}

async function sccyberLoadSavedLearnerScores() {
  const profile = typeof loadProfile === "function" ? loadProfile() : null;
  const client = window.supabaseClient || (typeof supabaseClient !== "undefined" ? supabaseClient : null);

  if (!profile || profile.mode !== "live" || !profile.supabaseUserId || !client) {
    return;
  }

  if (profile.__scoresLoading) return;
  profile.__scoresLoading = true;
  if (typeof saveProfile === "function") saveProfile(profile);

  try {
    const result = await client
      .from("attempts")
      .select("game,score,accuracy,correct_count,wrong_count,answered,duration_seconds,passed,created_at")
      .eq("user_id", profile.supabaseUserId)
      .order("created_at", { ascending: true });

    const current = typeof loadProfile === "function" ? loadProfile() : profile;
    if (!current || current.supabaseUserId !== profile.supabaseUserId) return;

    current.__scoresLoading = false;

    if (result.error || !Array.isArray(result.data)) {
      if (typeof saveProfile === "function") saveProfile(current);
      return;
    }

    current.attempts = current.attempts || [];

    result.data.forEach(function (row) {
      const local = sccyberRemoteAttemptToLocal(row, current);
      const exists = current.attempts.some(function (attempt) {
        return attempt.game === local.game &&
          String(attempt.createdAt || "") === String(local.createdAt || "") &&
          Number(attempt.score || 0) === Number(local.score || 0);
      });

      if (!exists) current.attempts.push(local);
    });

    if (typeof games !== "undefined" && typeof bestScore === "function" && typeof attemptsFor === "function") {
      current.scores = current.scores || {};
      games.forEach(function (game) {
        current.scores[game.key] = bestScore(attemptsFor(current, game.key));
      });
    }

    if (typeof saveProfile === "function") saveProfile(current);
    if (typeof updateDashboard === "function") updateDashboard();
  } catch (e) {
    const latest = typeof loadProfile === "function" ? loadProfile() : profile;
    if (latest) {
      latest.__scoresLoading = false;
      if (typeof saveProfile === "function") saveProfile(latest);
    }
  }
}

function sccyberClarifyScoreWording() {
  const profile = typeof loadProfile === "function" ? loadProfile() : null;
  const totalGames = typeof games !== "undefined" ? games.length : 3;
  const summary = profile && typeof calculateSummary === "function"
    ? calculateSummary(profile)
    : { completed: 0, avg: 0, status: "START TRAINING" };

  const scoreCard = document.querySelector(".dashboard-preview .dash-card:first-child span");
  const statusCard = document.getElementById("trainingStatus");
  const reportAverageLabel = document.querySelector("#reportOutput .report-card:first-child span");

  if (scoreCard) {
    if (summary.completed > 0 && summary.completed < totalGames) {
      scoreCard.textContent = "AVERAGE SO FAR";
    } else if (summary.completed >= totalGames) {
      scoreCard.textContent = "FINAL SCORE";
    } else {
      scoreCard.textContent = "AVERAGE SCORE";
    }
  }

  if (statusCard && summary.completed > 0 && summary.completed < totalGames) {
    statusCard.textContent = "IN PROGRESS";
  }

  if (reportAverageLabel) {
    reportAverageLabel.textContent = summary.completed >= totalGames ? "Final Score" : "Average So Far";
  }
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

  sccyberClarifyScoreWording();
}

window.addEventListener("load", function () {
  const originalUpdateDashboard = window.updateDashboard || (typeof updateDashboard === "function" ? updateDashboard : null);
  const originalShowDashboard = window.showDashboard || (typeof showDashboard === "function" ? showDashboard : null);

  if (originalUpdateDashboard && !window.sccyberCompletionBadgesPatched) {
    window.sccyberCompletionBadgesPatched = true;
    updateDashboard = function patchedUpdateDashboard() {
      originalUpdateDashboard.apply(this, arguments);
      sccyberRenderGameCompletionBadges();
      sccyberClarifyScoreWording();
      sccyberAddAdminCompanyRemoveButtons();
    };
  }

  if (originalShowDashboard && !window.sccyberLearnerScoreSyncPatched) {
    window.sccyberLearnerScoreSyncPatched = true;
    showDashboard = function patchedShowDashboard() {
      originalShowDashboard.apply(this, arguments);
      setTimeout(sccyberLoadSavedLearnerScores, 150);
      setTimeout(sccyberAddAdminCompanyRemoveButtons, 300);
    };
  }

  setTimeout(sccyberRenderGameCompletionBadges, 250);
  setTimeout(sccyberLoadSavedLearnerScores, 500);
  setInterval(sccyberAddAdminCompanyRemoveButtons, 1000);
});