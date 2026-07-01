(function () {
  const hiddenCompanyKey = "sccyberHiddenCompanyIds";

  function adminClient() {
    return window.supabaseClient || supabaseClient;
  }

  function savedLogins() {
    try {
      return JSON.parse(localStorage.getItem("sccyberGeneratedCredentials") || "{}");
    } catch (e) {
      return {};
    }
  }

  function forgetSavedLogin(username) {
    if (!username) return;
    const all = savedLogins();
    delete all[String(username).toLowerCase()];
    localStorage.setItem("sccyberGeneratedCredentials", JSON.stringify(all));
  }

  function unhideCompany(id) {
    try {
      const hidden = JSON.parse(localStorage.getItem(hiddenCompanyKey) || "[]");
      localStorage.setItem(hiddenCompanyKey, JSON.stringify(hidden.filter(value => String(value) !== String(id))));
    } catch (e) {}
  }

  async function invokeDelete(targetType, id) {
    const client = adminClient();
    if (!client) throw new Error("Secure database connection not ready. Refresh and try again.");

    const { data, error } = await client.functions.invoke("admin-delete-record", {
      body: { target_type: targetType, id }
    });

    if (error || data?.error) {
      let detail = data?.error || error?.message || "Delete failed.";
      try {
        if (error?.context && typeof error.context.json === "function") {
          const body = await error.context.clone().json();
          detail = body?.error || body?.message || detail;
        }
      } catch (e) {}
      throw new Error(detail);
    }

    return data || {};
  }

  function companyNameForButton(button) {
    const row = button.closest("[data-org-row]");
    if (row) return row.querySelector("strong")?.textContent?.trim() || "this company";
    const card = button.closest(".enhanced-company-card");
    if (card) return card.querySelector("summary")?.textContent?.split("·")[0]?.trim() || "this company";
    return "this company";
  }

  function addCompanyDeleteButtons() {
    const output = document.getElementById("adminOutput");
    if (!output) return;

    output.querySelectorAll("[data-org-row]").forEach(row => {
      if (row.querySelector(".admin-delete-company")) return;
      const save = row.querySelector(".admin-update-org");
      if (!save?.dataset.id || !save.parentElement) return;

      const button = document.createElement("button");
      button.className = "small-btn admin-delete-company";
      button.type = "button";
      button.dataset.id = save.dataset.id;
      button.textContent = "Remove";
      button.style.marginLeft = "8px";
      save.parentElement.appendChild(button);
    });

    output.querySelectorAll(".enhanced-company-card").forEach(card => {
      if (card.querySelector(".admin-delete-company")) return;
      const save = card.querySelector(".enhanced-org-save");
      if (!save?.dataset.id || !save.parentElement) return;

      const button = document.createElement("button");
      button.className = "small-btn admin-delete-company";
      button.type = "button";
      button.dataset.id = save.dataset.id;
      button.textContent = "Remove Company";
      save.parentElement.appendChild(button);
    });
  }

  async function deleteCompany(button) {
    const id = button.dataset.id;
    if (!id) return;

    const name = companyNameForButton(button);
    if (!confirm(`Permanently remove ${name}, its learners, their logins and their reports?`)) return;

    button.disabled = true;
    const previousText = button.textContent;
    button.textContent = "Removing...";

    try {
      const result = await invokeDelete("company", id);
      unhideCompany(id);
      if (typeof loadAdminData === "function") await loadAdminData();
      if (typeof renderEnhancedCompanies === "function") setTimeout(renderEnhancedCompanies, 250);
      addCompanyDeleteButtons();
      alert(`Company removed. Learners deleted: ${result.learners_deleted || 0}. Logins deleted: ${result.auth_users_deleted || 0}.`);
    } catch (e) {
      alert(e.message || "Could not remove company.");
      button.disabled = false;
      button.textContent = previousText;
    }
  }

  async function deleteLearner(id, username) {
    if (!id) return;
    if (!confirm(`Permanently remove learner ${username || ""}, their login and their report data?`)) return;

    try {
      const result = await invokeDelete("learner", id);
      forgetSavedLogin(username || result.username);
      const selected = document.getElementById("adminSelectedReport");
      if (selected) selected.textContent = "Select a learner to view their report.";
      if (typeof loadAdminData === "function") await loadAdminData();
      alert("Learner removed from Supabase.");
    } catch (e) {
      alert(e.message || "Could not remove learner.");
    }
  }

  function patchLearnerDelete() {
    if (window.sccyberSupabaseLearnerDeletePatched || typeof removeLearnerRecord !== "function") return;
    window.sccyberSupabaseLearnerDeletePatched = true;
    removeLearnerRecord = async function (id, username) {
      await deleteLearner(id, username);
    };
  }

  function patchCompanyRender() {
    if (window.sccyberSupabaseCompanyDeleteRenderPatched || typeof renderAdmin !== "function") return;
    window.sccyberSupabaseCompanyDeleteRenderPatched = true;
    const original = renderAdmin;
    renderAdmin = function () {
      original.apply(this, arguments);
      addCompanyDeleteButtons();
    };
  }

  function install() {
    patchLearnerDelete();
    patchCompanyRender();
    addCompanyDeleteButtons();
    ensureLegacyCompanyRemoveHidden();
  }

  function ensureLegacyCompanyRemoveHidden() {
    let style = document.getElementById("sccyberSupabaseDeleteButtonStyles");
    if (!style) {
      style = document.createElement("style");
      style.id = "sccyberSupabaseDeleteButtonStyles";
    }
    style.textContent = "#adminOutput .admin-remove-org,#adminOutput .fixed-remove-company{display:none!important;visibility:hidden!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;width:0!important;height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}";
    document.head.appendChild(style);
  }

  document.addEventListener("click", event => {
    const company = event.target.closest(".admin-delete-company");
    if (!company) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    deleteCompany(company);
  }, true);

  document.addEventListener("click", event => {
    const oldCompany = event.target.closest(".admin-remove-org, .fixed-remove-company");
    if (!oldCompany) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  window.addEventListener("load", () => {
    install();
    setInterval(install, 1000);
  });

  if (document.readyState === "interactive" || document.readyState === "complete") install();
})();
