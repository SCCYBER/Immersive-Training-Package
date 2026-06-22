(function () {
  const SCCYBER_REAL_LOGO = "https://sccyber.github.io/breach-lockdown/logo.png";

  function fixPortalLogo() {
    document.querySelectorAll('img[alt="SCCYBER logo"]').forEach(function (img) {
      img.src = SCCYBER_REAL_LOGO;
    });
  }

  function installAdminReportStatusStyles() {
    if (document.getElementById("sccyberAdminReportStatusStyles")) return;

    const style = document.createElement("style");
    style.id = "sccyberAdminReportStatusStyles";
    style.textContent = `
      .module-status-marker{
        display:inline-block;
        padding:6px 10px;
        border-radius:999px;
        font-family:'Press Start 2P', cursive;
        font-size:8px;
        line-height:1.6;
        text-align:center;
        white-space:nowrap;
      }

      .module-status-marker.pass{
        color:#59ff9d;
        border:1px solid rgba(89,255,157,.75);
        background:rgba(89,255,157,.10);
        box-shadow:0 0 10px rgba(89,255,157,.14);
      }

      .module-status-marker.try-again{
        color:#ffd44d;
        border:1px solid rgba(255,212,77,.75);
        background:rgba(255,212,77,.10);
        box-shadow:0 0 10px rgba(255,212,77,.14);
      }

      .module-status-marker.not-started{
        color:#b9a8d5;
        border:1px solid rgba(185,168,213,.35);
        background:rgba(185,168,213,.06);
      }
    `;
    document.head.appendChild(style);
  }

  function accuracyFromAttempt(attempt) {
    if (typeof remoteAccuracy === "function" && attempt && ("correct_count" in attempt || "duration_seconds" in attempt)) {
      return remoteAccuracy(attempt);
    }

    if (typeof attemptAccuracy === "function") {
      return attemptAccuracy(attempt);
    }

    if (attempt && attempt.accuracy !== null && attempt.accuracy !== undefined) {
      return Number(attempt.accuracy || 0);
    }

    if (attempt && attempt.answered && attempt.correct !== null && attempt.correct !== undefined) {
      return Math.round(Number(attempt.correct) / Number(attempt.answered) * 100);
    }

    if (attempt && attempt.answered && attempt.correct_count !== null && attempt.correct_count !== undefined) {
      return Math.round(Number(attempt.correct_count) / Number(attempt.answered) * 100);
    }

    return 0;
  }

  function statusForAttempts(attempts) {
    const passMark = typeof PASS_MARK !== "undefined" ? PASS_MARK : 80;

    if (!attempts || !attempts.length) {
      return { label: "NOT STARTED", className: "not-started" };
    }

    const passed = attempts.some(function (attempt) {
      return attempt.passed === true || accuracyFromAttempt(attempt) >= passMark;
    });

    return passed
      ? { label: "PASS", className: "pass" }
      : { label: "TRY AGAIN", className: "try-again" };
  }

  function markerHtml(status) {
    return `<span class="module-status-marker ${status.className}">${status.label}</span>`;
  }

  function patchRemoteAdminReport() {
    if (typeof renderRemoteLearnerReport !== "function" || window.sccyberAdminRemoteReportStatusPatched) return;
    window.sccyberAdminRemoteReportStatusPatched = true;

    renderRemoteLearnerReport = function patchedRemoteLearnerReport(profile, attempts) {
      const summary = typeof buildRemoteSummary === "function"
        ? buildRemoteSummary(attempts)
        : { completed: 0, avg: 0, status: "IN PROGRESS", totalAttempts: attempts.length };

      const name = `${profile.first_name || ""} ${profile.surname || ""}`.trim() || profile.username || "Learner";

      const rows = games.map(function (game) {
        const gameAttempts = attempts.filter(function (attempt) {
          return attempt.game === game.key;
        });

        const status = statusForAttempts(gameAttempts);

        if (!gameAttempts.length) {
          return `<div class="report-line"><strong>${game.name}</strong><span>${game.tier}</span><span>Not started</span><span>${markerHtml(status)}</span></div>`;
        }

        const accuracies = gameAttempts.map(accuracyFromAttempt);
        const best = Math.max.apply(null, accuracies);
        const latest = accuracyFromAttempt(gameAttempts[gameAttempts.length - 1]);
        const average = Math.round(accuracies.reduce(function (sum, value) { return sum + value; }, 0) / accuracies.length);

        return `<div class="report-line"><strong>${game.name}</strong><span>${game.tier}</span><span>Best ${best}% | Latest ${latest}% | Avg ${average}% | Attempts: ${gameAttempts.length}</span><span>${markerHtml(status)}</span></div>`;
      }).join("");

      return `<div class="report-section"><div class="report-section-title">Learner</div><p>${name} · ${profile.department_role || "No role"}<br>Username: ${profile.username || "Not set"}</p></div><div class="report-grid"><div class="report-card"><span>Average</span><strong>${summary.completed ? summary.avg + "%" : "--"}</strong></div><div class="report-card"><span>Completed</span><strong>${summary.completed} / ${games.length}</strong></div><div class="report-card"><span>Status</span><strong>${summary.status}</strong></div></div><div class="report-section"><div class="report-section-title">Module Breakdown</div>${rows}</div><button class="small-btn admin-reset-scores" data-id="${profile.id}">Reset Scores</button>`;
    };
  }

  function patchLearnerReport() {
    if (typeof updateReport !== "function" || window.sccyberLearnerReportStatusPatched) return;
    window.sccyberLearnerReportStatusPatched = true;

    const originalUpdateReport = updateReport;

    updateReport = function patchedUpdateReport(profile, summary) {
      originalUpdateReport.apply(this, arguments);

      if (!profile || !Array.isArray(profile.attempts)) return;

      const lines = document.querySelectorAll("#reportOutput .report-line");
      lines.forEach(function (line, index) {
        const game = games[index];
        if (!game || line.querySelector(".module-status-marker")) return;

        const gameAttempts = profile.attempts.filter(function (attempt) {
          return attempt.game === game.key && attempt.completed !== false;
        });

        const status = statusForAttempts(gameAttempts);
        line.insertAdjacentHTML("beforeend", markerHtml(status));
      });
    };
  }

  function install() {
    fixPortalLogo();
    installAdminReportStatusStyles();
    patchRemoteAdminReport();
    patchLearnerReport();
  }

  window.addEventListener("load", function () {
    install();
    setTimeout(install, 250);
    setTimeout(install, 750);
    setTimeout(install, 1500);
  });
})();