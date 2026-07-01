function sccyberAddBreak(target) {
  target.appendChild(document.createElement("br"));
}

function sccyberBuildLearnerButtons(row, username, userId, learnerId, organisationId) {
  const cell = row.querySelector("span:last-child");
  if (!cell) return;

  cell.innerHTML = "";

  if (userId) {
    const view = document.createElement("button");
    view.className = "small-btn fixed-view-report";
    view.dataset.id = userId;
    view.textContent = "View Report";
    cell.appendChild(view);
    sccyberAddBreak(cell);
  }

  const show = document.createElement("button");
  show.className = "small-btn fixed-show-login";
  show.dataset.username = username;
  if (organisationId) show.dataset.orgId = organisationId;
  show.textContent = "Show Login";
  cell.appendChild(show);
  sccyberAddBreak(cell);

  if (userId) {
    const reset = document.createElement("button");
    reset.className = "small-btn fixed-reset-login";
    reset.dataset.username = username;
    if (organisationId) reset.dataset.orgId = organisationId;
    reset.textContent = "Reset Login";
    cell.appendChild(reset);
    sccyberAddBreak(cell);
  } else {
    const create = document.createElement("button");
    create.className = "small-btn fixed-create-login";
    create.dataset.username = username;
    if (organisationId) create.dataset.orgId = organisationId;
    create.textContent = "Create Login";
    cell.appendChild(create);
    sccyberAddBreak(cell);
  }

  if (learnerId) {
    const remove = document.createElement("button");
    remove.className = "small-btn fixed-remove-learner";
    remove.dataset.id = learnerId;
    remove.dataset.username = username;
    remove.textContent = "Remove";
    cell.appendChild(remove);
  }

  row.dataset.fixedAdminButtons = "true";
  row.dataset.adminControlsV2 = "true";
}

function sccyberRenderLearnerRowsV2(rows) {
  if (!window.adminLearnerOutput || !Array.isArray(rows)) return;

  adminLearnerOutput.innerHTML = rows.map(row => {
    const profile = adminProfiles.find(p => p.id === row.user_id) || {};
    const org = adminOrgs.find(o => o.id === row.organisation_id);
    const uid = row.user_id || "";
    return `<div class="report-line" data-fixed-admin-buttons="true" data-admin-controls-v2="true" data-learner-id="${row.id}" data-username="${row.username}" data-user-id="${uid}" data-org-id="${row.organisation_id || ""}"><strong>${row.username}</strong><span>${org ? org.name : "No company"}</span><span>${uid ? "Login active" : "No login yet"}${profile.premium_enabled ? " · Premium" : ""}</span><span></span></div>`;
  }).join("") || "No learners yet.";

  adminLearnerOutput.querySelectorAll(".report-line[data-admin-controls-v2='true']").forEach(row => {
    sccyberBuildLearnerButtons(row, row.dataset.username, row.dataset.userId, row.dataset.learnerId, row.dataset.orgId);
  });
}

function sccyberPatchAdminRenderV2() {
  if (typeof renderAdmin !== "function" || window.sccyberAdminRenderV2) return;

  const original = renderAdmin;
  window.sccyberAdminRenderV2 = true;

  renderAdmin = function patchedAdminRender(rows, billingRows) {
    original(rows, billingRows);
    sccyberRenderLearnerRowsV2(rows || []);
  };
}

function attachStableAdminButtons() {
  sccyberPatchAdminRenderV2();

  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(":scope > .report-line").forEach(row => {
    if (row.dataset.adminControlsV2 === "true") return;

    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const report = row.querySelector(".admin-report, .admin-view-report, .fixed-view-report");
    const remove = row.querySelector(".admin-remove-learner, .remove-learner, .fixed-remove-learner");
    const userId = report?.dataset.id || row.dataset.userId || "";
    const learnerId = remove?.dataset.id || row.dataset.learnerId || "";
    const organisationId = row.dataset.orgId || "";

    if (!username) return;
    sccyberBuildLearnerButtons(row, username, userId, learnerId, organisationId);
  });
}

window.addEventListener("load", function () {
  attachStableAdminButtons();
  setInterval(attachStableAdminButtons, 800);
});
