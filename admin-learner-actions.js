const stableCredentialKey = "sccyberGeneratedCredentials";

function stableClient() {
  return window.supabaseClient || supabaseClient;
}

function stablePassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let value = "";
  for (let i = 0; i < length; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

function stableLoadCredentials() {
  try {
    return JSON.parse(localStorage.getItem(stableCredentialKey) || "{}");
  } catch (e) {
    return {};
  }
}

function stableSaveCredential(username, password) {
  const creds = stableLoadCredentials();
  creds[username.toLowerCase()] = {
    username: username.toLowerCase(),
    password,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(stableCredentialKey, JSON.stringify(creds));
}

function stableGetCredential(username) {
  return stableLoadCredentials()[username.toLowerCase()] || null;
}

function stableSelectedReport() {
  return document.getElementById("adminSelectedReport");
}

function stableCloseReport() {
  const output = stableSelectedReport();
  if (output) output.innerHTML = "Select a learner to view their report.";
}

function stableRenderCredentials(username, password, heading) {
  const output = stableSelectedReport();
  if (!output) return;
  output.innerHTML = `
    <div class="report-section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div class="report-section-title">${heading || "LOGIN DETAILS"}</div>
        <button class="small-btn stable-close-report" type="button">Close Report</button>
      </div>
      <p>Give these details to the learner and store them securely.</p>
      <div class="report-line"><strong>Username</strong><span>${username}</span><span>Password</span><span>${password}</span></div>
    </div>
  `;
}

function stableAccuracy(attempt) {
  if (attempt.accuracy !== null && attempt.accuracy !== undefined && !Number.isNaN(Number(attempt.accuracy))) return Number(attempt.accuracy);
  if (attempt.answered && attempt.correct_count !== null && attempt.correct_count !== undefined) return Math.round(Number(attempt.correct_count) / Number(attempt.answered) * 100);
  return 0;
}

function stableBuildSummary(attempts) {
  const gameList = typeof games !== "undefined" ? games : [];
  const completed = gameList.filter(game => attempts.some(a => a.game === game.key));
  const done = completed.length;
  const bests = completed.map(game => Math.max(...attempts.filter(a => a.game === game.key).map(stableAccuracy)));
  const avg = done ? Math.round(bests.reduce((a, b) => a + b, 0) / done) : 0;
  return {
    completed: done,
    avg,
    status: done < gameList.length ? "IN PROGRESS" : avg >= 80 ? "PASS" : "FAIL",
    totalAttempts: attempts.length
  };
}

function stableRenderReport(userId) {
  const output = stableSelectedReport();
  if (!output) return;

  const profile = adminProfiles.find(p => p.id === userId);
  if (!profile) {
    output.innerHTML = `
      <div class="report-section">
        <button class="small-btn stable-close-report" type="button">Close Report</button>
        <p>Learner not found or login profile has not been created yet.</p>
      </div>
    `;
    return;
  }

  const attempts = adminAttempts.filter(a => a.user_id === userId);
  const summary = stableBuildSummary(attempts);
  const name = `${profile.first_name || ""} ${profile.surname || ""}`.trim() || profile.username || "Learner";
  const gameList = typeof games !== "undefined" ? games : [];

  const rows = gameList.map(game => {
    const gameAttempts = attempts.filter(a => a.game === game.key);
    if (!gameAttempts.length) {
      return `<div class="report-line"><strong>${game.name}</strong><span>${game.tier}</span><span>Not started</span><span>Attempts: 0</span></div>`;
    }
    const scores = gameAttempts.map(stableAccuracy);
    const best = Math.max(...scores);
    const latest = stableAccuracy(gameAttempts[gameAttempts.length - 1]);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return `<div class="report-line"><strong>${game.name}</strong><span>${game.tier}</span><span>Best ${best}% | Latest ${latest}% | Avg ${avg}%</span><span>Attempts: ${gameAttempts.length}</span></div>`;
  }).join("");

  output.innerHTML = `
    <div class="report-section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div class="report-section-title">Learner Report</div>
        <button class="small-btn stable-close-report" type="button">Close Report</button>
      </div>
      <p>${name} · ${profile.department_role || "No role"}<br>Username: ${profile.username || "Not set"}</p>
    </div>
    <div class="report-grid">
      <div class="report-card"><span>Average</span><strong>${summary.completed ? summary.avg + "%" : "--"}</strong></div>
      <div class="report-card"><span>Completed</span><strong>${summary.completed} / ${gameList.length}</strong></div>
      <div class="report-card"><span>Status</span><strong>${summary.status}</strong></div>
    </div>
    <div class="report-section"><div class="report-section-title">Module Breakdown</div>${rows}</div>
  `;
}

async function stableCallLearnerFunction(payload) {
  const client = stableClient();
  const { data, error } = await client.functions.invoke("create-learner-login", { body: payload });
  if (error || data?.error) throw new Error(data?.error || error?.message || "Request failed.");
  return data;
}

async function stableCreateLogin(username, button) {
  const existing = stableGetCredential(username);
  if (existing) {
    stableRenderCredentials(existing.username, existing.password, "LOGIN DETAILS");
    return;
  }

  const password = stablePassword();
  button.disabled = true;
  button.textContent = "Creating...";

  try {
    await stableCallLearnerFunction({ action: "create", username, password });
    stableSaveCredential(username, password);
    stableRenderCredentials(username, password, "LOGIN CREATED");
    if (typeof loadAdminData === "function") await loadAdminData();
  } catch (error) {
    alert(error.message || "Could not create login.");
  } finally {
    button.disabled = false;
    button.textContent = "Create Login";
  }
}

async function stableResetPassword(username, button) {
  if (!confirm(`Generate a new password for ${username}? The old password will stop working.`)) return;

  const password = stablePassword();
  button.disabled = true;
  button.textContent = "Resetting...";

  try {
    await stableCallLearnerFunction({ action: "reset-password", username, password });
    stableSaveCredential(username, password);
    stableRenderCredentials(username, password, "PASSWORD RESET");
  } catch (error) {
    alert(error.message || "Could not reset password.");
  } finally {
    button.disabled = false;
    button.textContent = "Reset Password";
  }
}

function stableEnhanceLearnerRows() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(":scope > .report-line").forEach(row => {
    if (row.dataset.stableEnhanced === "true") return;

    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;

    const viewBtn = row.querySelector(".admin-view-report");
    const userId = viewBtn?.dataset.id || "";
    const pending = row.textContent.includes("Pending auth") || row.textContent.includes("Login not created yet");

    actionCell.innerHTML = "";

    if (userId && !pending) {
      const reportButton = document.createElement("button");
      reportButton.className = "small-btn stable-view-report";
      reportButton.dataset.id = userId;
      reportButton.textContent = "View Report";
      actionCell.appendChild(reportButton);

      actionCell.appendChild(document.createElement("br"));

      const resetButton = document.createElement("button");
      resetButton.className = "small-btn stable-reset-password";
      resetButton.dataset.username = username;
      resetButton.textContent = "Reset Password";
      actionCell.appendChild(resetButton);
    } else {
      const createButton = document.createElement("button");
      createButton.className = "small-btn stable-create-login";
      createButton.dataset.username = username;
      createButton.textContent = "Create Login";
      actionCell.appendChild(createButton);
    }

    row.dataset.stableEnhanced = "true";
  });
}

window.addEventListener("load", () => {
  setInterval(stableEnhanceLearnerRows, 1000);
});

document.addEventListener("click", event => {
  const view = event.target.closest(".stable-view-report, .admin-view-report");
  if (view) {
    event.preventDefault();
    event.stopImmediatePropagation();
    stableRenderReport(view.dataset.id);
    return;
  }

  const close = event.target.closest(".stable-close-report");
  if (close) {
    event.preventDefault();
    event.stopImmediatePropagation();
    stableCloseReport();
    return;
  }

  const create = event.target.closest(".stable-create-login");
  if (create) {
    event.preventDefault();
    event.stopImmediatePropagation();
    stableCreateLogin(create.dataset.username, create);
    return;
  }

  const reset = event.target.closest(".stable-reset-password");
  if (reset) {
    event.preventDefault();
    event.stopImmediatePropagation();
    stableResetPassword(reset.dataset.username, reset);
  }
}, true);
