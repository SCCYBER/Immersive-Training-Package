async function addLearnerRecordWithAssignedFields(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  const username = document.getElementById("newLearnerUsername")?.value.trim().toLowerCase();
  const firstName = document.getElementById("newLearnerFirstName")?.value.trim();
  const surname = document.getElementById("newLearnerSurname")?.value.trim();
  const role = document.getElementById("newLearnerRole")?.value.trim();
  const organisationId = document.getElementById("newLearnerCompany")?.value || null;
  const learnerMessage = document.getElementById("learnerMessage");

  if (!username) {
    if (learnerMessage) learnerMessage.textContent = "Enter a username.";
    return;
  }

  if (!firstName || !surname || !role) {
    if (learnerMessage) learnerMessage.textContent = "Enter first name, surname and department / role.";
    return;
  }

  if (!organisationId) {
    if (learnerMessage) learnerMessage.textContent = "Select a company before adding the learner.";
    return;
  }

  const client = window.supabaseClient || supabaseClient;
  if (!client) {
    if (learnerMessage) learnerMessage.textContent = "Secure database connection not ready. Refresh and try again.";
    return;
  }

  const { data: existingLearners, error: checkError } = await client
    .from("learners")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (checkError) {
    if (learnerMessage) learnerMessage.textContent = "Could not check username. Refresh and try again.";
    return;
  }

  if (existingLearners && existingLearners.length > 0) {
    if (learnerMessage) learnerMessage.textContent = `Username '${username}' already exists. Use a different username.`;
    return;
  }

  if (learnerMessage) learnerMessage.textContent = "Adding learner...";

  const payload = {
    username,
    organisation_id: organisationId,
    active: true,
    first_name: firstName,
    surname,
    department_role: role
  };

  const { error } = await client.from("learners").insert(payload);

  if (learnerMessage) {
    const duplicate = error && (String(error.code) === "23505" || String(error.message || "").toLowerCase().includes("duplicate"));
    learnerMessage.textContent = error
      ? duplicate ? `Username '${username}' already exists. Use a different username.` : `Could not add learner: ${error.message || "Unknown database error."}`
      : `Learner added. Username: ${username}`;
  }

  if (!error) {
    if (typeof sccyberAudit === "function") {
      await sccyberAudit("learner_add", "learner", username, { username, organisation_id: organisationId, first_name: firstName, surname, department_role: role });
    }
    ["newLearnerUsername", "newLearnerFirstName", "newLearnerSurname", "newLearnerRole"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    if (typeof loadAdminData === "function") await loadAdminData();
  }
}

function sccyberAuditProfile() {
  try { return JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null"); } catch (e) { return null; }
}

async function sccyberAudit(action, targetType, targetId, details) {
  try {
    const client = window.supabaseClient || supabaseClient;
    const profile = sccyberAuditProfile();
    if (!client || !profile || profile.isAdmin !== true || !profile.supabaseUserId) return;
    await client.from("admin_audit_logs").insert({
      admin_user_id: profile.supabaseUserId,
      admin_username: profile.username || profile.name || "admin",
      action,
      target_type: targetType || null,
      target_id: String(targetId || ""),
      details: details || {},
      created_at: new Date().toISOString()
    });
  } catch (e) {}
}

function sccyberPatchAdminAuditActions() {
  if (window.sccyberAdminAuditActionsPatched) return;
  if (typeof addCompany !== "function" || typeof updateCompany !== "function" || typeof removeLearnerRecord !== "function" || typeof resetLearnerScores !== "function") return;
  window.sccyberAdminAuditActionsPatched = true;

  const originalAddCompany = addCompany;
  addCompany = async function () {
    const name = document.getElementById("newCompanyName")?.value.trim() || "";
    const licences = document.getElementById("newCompanyLicences")?.value || "";
    const premium = document.getElementById("newCompanyPremium")?.value || "";
    const billing = document.getElementById("newCompanyBilling")?.value || "";
    await originalAddCompany.apply(this, arguments);
    await sccyberAudit("company_add", "organisation", name, { name, licences, premium, billing_status: billing });
  };

  const originalUpdateCompany = updateCompany;
  updateCompany = async function (id) {
    const row = document.querySelector(`[data-org-row="${id}"]`);
    const details = row ? {
      licences: row.querySelector(".org-licences")?.value || null,
      premium: row.querySelector(".org-premium")?.value || null,
      billing_status: row.querySelector(".org-billing")?.value || null
    } : {};
    await originalUpdateCompany.apply(this, arguments);
    await sccyberAudit("company_update", "organisation", id, details);
  };

  const originalRemoveLearner = removeLearnerRecord;
  removeLearnerRecord = async function (id, username) {
    await originalRemoveLearner.apply(this, arguments);
    await sccyberAudit("learner_remove", "learner", id, { username: username || "" });
  };

  const originalResetScores = resetLearnerScores;
  resetLearnerScores = async function (id) {
    await originalResetScores.apply(this, arguments);
    await sccyberAudit("learner_scores_reset", "profile", id, { profile_id: id });
  };
}

window.addEventListener("load", () => {
  if (typeof addLearnerRecord === "function") {
    addLearnerRecord = addLearnerRecordWithAssignedFields;
  }

  const btn = document.getElementById("addLearnerBtn");
  if (btn && !btn.dataset.sccyberAssignedFieldsBound) {
    btn.dataset.sccyberAssignedFieldsBound = "true";
    btn.addEventListener("click", addLearnerRecordWithAssignedFields, true);
  }

  sccyberPatchAdminAuditActions();
  setTimeout(sccyberPatchAdminAuditActions, 300);
  setTimeout(sccyberPatchAdminAuditActions, 1000);
});