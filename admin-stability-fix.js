const savedLoginKey = "sccyberGeneratedCredentials";

function safeAdminClient() {
  return window.supabaseClient || supabaseClient;
}

function makeLoginSecret(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let value = "";
  for (let i = 0; i < length; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

function readSavedLogins() {
  try {
    return JSON.parse(localStorage.getItem(savedLoginKey) || "{}");
  } catch (e) {
    return {};
  }
}

function saveLoginSecret(username, secret) {
  const all = readSavedLogins();
  all[String(username).toLowerCase()] = {
    username: String(username).toLowerCase(),
    secret: secret,
    password: secret,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(savedLoginKey, JSON.stringify(all));
}

function getLoginSecret(username) {
  return readSavedLogins()[String(username).toLowerCase()] || null;
}

function savedSecretValue(saved) {
  return saved?.secret || saved?.password || "";
}

function ensureAdminModal() {
  const oldReport = document.getElementById("adminSelectedReport");
  const oldSection = oldReport?.closest(".report-terminal");
  if (oldSection) oldSection.remove();

  if (!document.getElementById("adminModalRuntimeStyles")) {
    const style = document.createElement("style");
    style.id = "adminModalRuntimeStyles";
    style.textContent = `
      .admin-modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px}
      .admin-modal-backdrop{position:absolute;inset:0;background:rgba(3,1,9,.78);backdrop-filter:blur(6px)}
      .admin-modal-panel{position:relative;width:min(920px,100%);max-height:min(82vh,760px);overflow:auto;background:linear-gradient(180deg,rgba(18,4,42,.98),rgba(8,2,20,.99));border:1px solid rgba(89,255,157,.32);border-radius:16px;padding:14px;box-shadow:0 0 34px rgba(89,255,157,.13),0 0 60px rgba(109,29,208,.28)}
      .admin-modal-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
      .admin-modal-body{max-height:calc(82vh - 100px);overflow:auto}
      .admin-modal-body .report-grid{margin-top:10px}
      .admin-modal-body .report-line{grid-template-columns:1.1fr .8fr 1.7fr .8fr}
      @media(max-width:900px){.admin-modal{padding:8px}.admin-modal-panel{max-height:90vh}.admin-modal-header{align-items:flex-start;flex-direction:column}.admin-modal-body .report-line{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  let modal = document.getElementById("adminActionModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "admin-modal hidden";
    modal.id = "adminActionModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="admin-modal-backdrop"></div>
      <section class="admin-modal-panel" role="dialog" aria-modal="true" aria-labelledby="adminActionModalTitle">
        <div class="admin-modal-header">
          <div class="section-title" id="adminActionModalTitle">Learner Details</div>
          <button class="small-btn admin-modal-close" type="button">Close</button>
        </div>
        <div class="report-output admin-modal-body" id="adminActionModalBody"></div>
      </section>
    `;
    document.body.appendChild(modal);
  }
  return modal;
}

function showPanel(html) {
  openAdminModal("Learner Details", html);
}

function closeAdminPanel() {
  closeAdminModal();
}

function addCloseToCurrentPanel() {
  const modal = document.getElementById("adminActionModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function openAdminModal(title, html) {
  const modal = ensureAdminModal();
  const modalTitle = document.getElementById("adminActionModalTitle");
  const modalBody = document.getElementById("adminActionModalBody");
  if (!modal || !modalBody) return;
  if (modalTitle) modalTitle.textContent = title || "Learner Details";
  modalBody.innerHTML = html || "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeAdminModal() {
  const modal = document.getElementById("adminActionModal");
  const modalBody = document.getElementById("adminActionModalBody");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (modalBody) modalBody.innerHTML = "";
}

async function resetLearnerScoresFromModal(userId) {
  if (!userId || !confirm("Reset all scores for this learner?")) return;
  const client = safeAdminClient();
  const { error } = await client.from("attempts").delete().eq("user_id", userId);
  if (error) {
    openAdminModal("Learner Report", `<div class="report-section"><p>Could not reset scores. Check delete policy.</p></div>`);
    return;
  }
  if (typeof loadAdminData === "function") await loadAdminData();
  showLearnerReportModal(userId);
}

function showLearnerReportModal(userId) {
  const profiles = window.adminProfiles || (typeof adminProfiles !== "undefined" ? adminProfiles : []);
  const attempts = window.adminAttempts || (typeof adminAttempts !== "undefined" ? adminAttempts : []);
  const profile = profiles.find(item => item.id === userId);
  if (!profile) {
    openAdminModal("Learner Report", `<div class="report-section"><p>Learner not found or login profile has not been created yet.</p></div>`);
    return;
  }
  if (typeof renderRemoteLearnerReport === "function") {
    openAdminModal("Learner Report", renderRemoteLearnerReport(profile, attempts.filter(attempt => attempt.user_id === userId)));
  }
}

function showSavedLogin(username) {
  const saved = getLoginSecret(username);
  const secret = savedSecretValue(saved);

  if (!saved || !secret) {
    showPanel(`
      <div class="report-section">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div class="report-section-title">NO SAVED LOGIN</div>
          <button class="small-btn fixed-close-admin-panel" type="button">Close</button>
        </div>
        <p>No saved login was found for ${username}. Create or reset the login to generate a new one.</p>
      </div>
    `);
    return;
  }

  showPanel(`
    <div class="report-section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div class="report-section-title">LEARNER LOGIN</div>
        <button class="small-btn fixed-close-admin-panel" type="button">Close</button>
      </div>
      <p>Give these details to the learner and store them securely.</p>
      <div class="report-line"><strong>Username</strong><span>${saved.username || username}</span><span>Password</span><span>${secret}</span></div>
    </div>
  `);
}

async function callLoginService(action, username, secret, organisationId) {
  const client = safeAdminClient();
  const body = { username: username, password: secret, organisation_id: organisationId || null };
  if (action && action !== "create") body.action = action;
  const { data, error } = await client.functions.invoke("create-learner-login", { body });
  if (error || data?.error) {
    let detail = data?.error || error?.message || "Action failed.";
    try {
      if (error?.context && typeof error.context.json === "function") {
        const body = await error.context.clone().json();
        detail = body?.error || body?.message || detail;
      }
    } catch (e) {}
    throw new Error(detail);
  }
  return data;
}

async function createLearnerAccess(username, button, organisationId) {
  const secret = makeLoginSecret();
  button.disabled = true;
  button.textContent = "Creating...";
  try {
    await callLoginService("create", username, secret, organisationId);
    saveLoginSecret(username, secret);
    showSavedLogin(username);
    if (typeof loadAdminData === "function") await loadAdminData();
  } catch (e) {
    alert(e.message || "Could not create login.");
  } finally {
    button.disabled = false;
    button.textContent = "Create Login";
  }
}

async function resetLearnerAccess(username, button, organisationId) {
  if (!confirm(`Generate new login details for ${username}?`)) return;
  const secret = makeLoginSecret();
  button.disabled = true;
  button.textContent = "Resetting...";
  try {
    await callLoginService("reset-password", username, secret, organisationId);
    saveLoginSecret(username, secret);
    showSavedLogin(username);
  } catch (e) {
    alert(e.message || "Could not reset login.");
  } finally {
    button.disabled = false;
    button.textContent = "Reset Login";
  }
}

function attachStableAdminButtons() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(":scope > .report-line").forEach(row => {
    if (row.dataset.fixedAdminButtons === "true") return;

    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;

    const uidButton = row.querySelector(".admin-view-report");
    const hasLogin = !!uidButton;
    const userId = uidButton?.dataset.id || "";
    const removeButton = row.querySelector(".remove-learner");
    const removeId = removeButton?.dataset.id || "";

    actionCell.innerHTML = "";

    if (hasLogin) {
      const view = document.createElement("button");
      view.className = "small-btn fixed-view-report";
      view.dataset.id = userId;
      view.textContent = "View Report";
      actionCell.appendChild(view);
      actionCell.appendChild(document.createElement("br"));
    }

    const show = document.createElement("button");
    show.className = "small-btn fixed-show-login";
    show.dataset.username = username;
    if (row.dataset.orgId) show.dataset.orgId = row.dataset.orgId;
    show.textContent = "Show Credentials";
    actionCell.appendChild(show);
    actionCell.appendChild(document.createElement("br"));

    if (hasLogin) {
      const reset = document.createElement("button");
      reset.className = "small-btn fixed-reset-login";
      reset.dataset.username = username;
      if (row.dataset.orgId) reset.dataset.orgId = row.dataset.orgId;
      reset.textContent = "Reset Login";
      actionCell.appendChild(reset);
      actionCell.appendChild(document.createElement("br"));
    } else {
      const create = document.createElement("button");
      create.className = "small-btn fixed-create-login";
      create.dataset.username = username;
      if (row.dataset.orgId) create.dataset.orgId = row.dataset.orgId;
      create.textContent = "Create Login";
      actionCell.appendChild(create);
      actionCell.appendChild(document.createElement("br"));
    }

    if (removeId) {
      const remove = document.createElement("button");
      remove.className = "small-btn fixed-remove-learner";
      remove.dataset.id = removeId;
      remove.dataset.username = username;
      remove.textContent = "Remove";
      actionCell.appendChild(remove);
    }

    row.dataset.fixedAdminButtons = "true";
  });
}

window.addEventListener("load", () => {
  ensureAdminModal();
  setInterval(attachStableAdminButtons, 1200);
});

document.addEventListener("click", event => {
  const view = event.target.closest(".fixed-view-report");
  if (view) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showLearnerReportModal(view.dataset.id);
    return;
  }

  const close = event.target.closest(".fixed-close-admin-panel");
  if (close) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeAdminPanel();
    return;
  }

  const modalClose = event.target.closest(".admin-modal-close") || (event.target.classList?.contains("admin-modal-backdrop") ? event.target : null);
  if (modalClose) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeAdminModal();
    return;
  }

  const resetScores = event.target.closest(".admin-reset-scores");
  if (resetScores) {
    event.preventDefault();
    event.stopImmediatePropagation();
    resetLearnerScoresFromModal(resetScores.dataset.id);
    return;
  }

  const show = event.target.closest(".fixed-show-login");
  if (show) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showSavedLogin(show.dataset.username);
    return;
  }

  const create = event.target.closest(".fixed-create-login");
  if (create) {
    event.preventDefault();
    event.stopImmediatePropagation();
    createLearnerAccess(create.dataset.username, create, create.dataset.orgId);
    return;
  }

  const reset = event.target.closest(".fixed-reset-login");
  if (reset) {
    event.preventDefault();
    event.stopImmediatePropagation();
    resetLearnerAccess(reset.dataset.username, reset, reset.dataset.orgId);
    return;
  }

  const remove = event.target.closest(".fixed-remove-learner");
  if (remove) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (typeof removeLearnerRecord === "function") removeLearnerRecord(remove.dataset.id, remove.dataset.username);
  }
}, true);
