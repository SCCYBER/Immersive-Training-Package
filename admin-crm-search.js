(function () {
  const state = {
    learners: [],
    query: "",
    type: "all",
    payment: "all",
    login: "all",
    premium: "all",
    training: "all",
    page: 1,
    pageSize: 25,
    active: false
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getOrgs() {
    try { return Array.isArray(adminOrgs) ? adminOrgs : []; } catch (e) { return []; }
  }

  function getProfiles() {
    try { return Array.isArray(adminProfiles) ? adminProfiles : []; } catch (e) { return []; }
  }

  function getAttempts() {
    try { return Array.isArray(adminAttempts) ? adminAttempts : []; } catch (e) { return []; }
  }

  function gamesTotal() {
    return Array.isArray(window.games) ? window.games.length : 5;
  }

  function profileFor(learner) {
    return getProfiles().find(profile => profile.id === learner.user_id) || {};
  }

  function orgForId(id) {
    return getOrgs().find(org => String(org.id || "") === String(id || "")) || null;
  }

  function learnerAttempts(learner) {
    if (!learner.user_id) return [];
    return getAttempts().filter(attempt => attempt.user_id === learner.user_id);
  }

  function completedCount(learner) {
    return new Set(learnerAttempts(learner).map(attempt => attempt.game).filter(Boolean)).size;
  }

  function loginStatus(learner, profile) {
    if (!learner.user_id) return "No login";
    if (!profile.last_login_at) return "Never logged in";
    const last = new Date(profile.last_login_at).getTime();
    if (Date.now() - last >= 30 * 24 * 60 * 60 * 1000) return "Inactive 30+ days";
    return "Login active";
  }

  function trainingStatus(learner) {
    if (!learner.user_id) return "No login";
    const done = completedCount(learner);
    if (done >= gamesTotal()) return "Completed";
    return done > 0 ? "In progress" : "Not started";
  }

  function premiumStatus(org, profile) {
    return org?.premium_enabled || profile?.premium_enabled ? "Premium on" : "Premium off";
  }

  function paymentStatus(org) {
    return String(org?.billing_status || "trial").toLowerCase();
  }

  function resultText(record) {
    return Object.values(record.search || {}).join(" ").toLowerCase();
  }

  function buildCompanyRecords() {
    return getOrgs().map(org => {
      const learners = state.learners.filter(learner => String(learner.organisation_id || "") === String(org.id || ""));
      const payment = paymentStatus(org);
      const premium = premiumStatus(org, {});
      return {
        kind: "company",
        id: org.id || "",
        title: org.name || "Unnamed company",
        status: payment,
        payment,
        premium,
        org,
        login: "company",
        training: "company",
        cells: [
          org.name || "Unnamed company",
          `Payment: ${payment}`,
          `${premium} · Licences: ${Number(org.licence_count || 0)}`,
          `${learners.length} learner${learners.length === 1 ? "" : "s"}`
        ],
        search: {
          name: org.name,
          payment,
          premium,
          licences: org.licence_count,
          address: org.address,
          contact: org.main_contact_name,
          email: org.main_contact_email,
          notes: org.notes,
          info: org.company_info
        }
      };
    });
  }

  function buildLearnerRecords() {
    return state.learners.map(learner => {
      const profile = profileFor(learner);
      const org = orgForId(learner.organisation_id);
      const login = loginStatus(learner, profile);
      const training = trainingStatus(learner);
      const payment = paymentStatus(org);
      const premium = premiumStatus(org, profile);
      const firstName = profile.first_name || learner.first_name || "";
      const surname = profile.surname || learner.surname || "";
      const name = [firstName, surname].filter(Boolean).join(" ") || learner.username || "Learner";
      const complete = learner.user_id ? `${completedCount(learner)} / ${gamesTotal()}` : "No login";
      return {
        kind: "learner",
        id: learner.id || "",
        userId: learner.user_id || "",
        learner,
        title: learner.username || name,
        status: login,
        payment,
        premium,
        login,
        training,
        cells: [
          learner.username || "No username",
          `${name} · ${profile.department_role || learner.department_role || "No role"}`,
          `${org ? org.name : "No company"} · ${payment}`,
          `${login} · ${training} · ${complete}`
        ],
        search: {
          username: learner.username,
          name,
          firstName,
          surname,
          role: profile.department_role || learner.department_role,
          company: org?.name,
          payment,
          premium,
          login,
          training,
          profileId: learner.user_id,
          learnerId: learner.id
        }
      };
    });
  }

  function allRecords() {
    return buildCompanyRecords().concat(buildLearnerRecords());
  }

  function filteredRecords() {
    const term = state.query.trim().toLowerCase();
    return allRecords().filter(record => {
      if (state.type !== "all" && record.kind !== state.type) return false;
      if (state.payment !== "all" && record.payment !== state.payment) return false;
      if (state.premium !== "all" && record.premium.toLowerCase().replace(" ", "-") !== state.premium) return false;
      if (state.login !== "all" && record.login.toLowerCase().replace(/\s+/g, "-").replace("+", "") !== state.login) return false;
      if (state.training !== "all" && record.training.toLowerCase().replace(/\s+/g, "-") !== state.training) return false;
      if (term && !resultText(record).includes(term)) return false;
      return true;
    });
  }

  function addStyles() {
    if (document.getElementById("adminCrmSearchStyles")) return;
    const style = document.createElement("style");
    style.id = "adminCrmSearchStyles";
    style.textContent = `
      .crm-hidden{display:none!important}
      .crm-search-controls{display:grid;grid-template-columns:minmax(220px,1.5fr) repeat(5,minmax(130px,1fr));gap:10px;margin-top:12px}
      .crm-result-row{grid-template-columns:1fr 1.4fr 1.2fr 1.4fr auto}
      .crm-company-row{grid-template-columns:1fr minmax(120px,.7fr) minmax(190px,1fr) auto}
      .crm-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .crm-actions .small-btn{margin:0}
      .crm-kind{font-family:'Press Start 2P',cursive;font-size:8px;color:#59ff9d;display:block;margin-bottom:6px}
      #adminView .game-topbar > button[id="adminCrmOpenBtn"]{display:none!important}
      #adminOutput,#adminLearnerOutput{display:none!important}
      @media(max-width:1050px){.crm-search-controls{grid-template-columns:1fr 1fr}.crm-result-row{grid-template-columns:1fr}}
      @media(max-width:640px){.crm-search-controls{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function controlsHtml(total) {
    return `
      <div class="report-header">
        <div>
          <div class="section-title">CRM SEARCH</div>
          <p>Search companies, learners, payment status, login status, premium access and training progress.</p>
        </div>
        <button class="launch-btn crm-refresh" type="button">Refresh</button>
      </div>
      <div class="crm-search-controls">
        <input id="crmSearchInput" type="text" maxlength="120" placeholder="Search company, learner, contact, role, ID or status" value="${escapeHtml(state.query)}">
        <select id="crmTypeFilter">
          <option value="all" ${state.type === "all" ? "selected" : ""}>All records</option>
          <option value="company" ${state.type === "company" ? "selected" : ""}>Companies</option>
          <option value="learner" ${state.type === "learner" ? "selected" : ""}>Learners</option>
        </select>
        <select id="crmPaymentFilter">
          <option value="all" ${state.payment === "all" ? "selected" : ""}>All payments</option>
          <option value="trial" ${state.payment === "trial" ? "selected" : ""}>Trial</option>
          <option value="pending" ${state.payment === "pending" ? "selected" : ""}>Pending</option>
          <option value="paid" ${state.payment === "paid" ? "selected" : ""}>Paid</option>
          <option value="overdue" ${state.payment === "overdue" ? "selected" : ""}>Overdue</option>
          <option value="removed" ${state.payment === "removed" ? "selected" : ""}>Removed</option>
        </select>
        <select id="crmLoginFilter">
          <option value="all" ${state.login === "all" ? "selected" : ""}>All login states</option>
          <option value="login-active" ${state.login === "login-active" ? "selected" : ""}>Login active</option>
          <option value="no-login" ${state.login === "no-login" ? "selected" : ""}>No login</option>
          <option value="never-logged-in" ${state.login === "never-logged-in" ? "selected" : ""}>Never logged in</option>
          <option value="inactive-30-days" ${state.login === "inactive-30-days" ? "selected" : ""}>Inactive 30+ days</option>
        </select>
        <select id="crmPremiumFilter">
          <option value="all" ${state.premium === "all" ? "selected" : ""}>All premium</option>
          <option value="premium-on" ${state.premium === "premium-on" ? "selected" : ""}>Premium on</option>
          <option value="premium-off" ${state.premium === "premium-off" ? "selected" : ""}>Premium off</option>
        </select>
        <select id="crmTrainingFilter">
          <option value="all" ${state.training === "all" ? "selected" : ""}>All training</option>
          <option value="not-started" ${state.training === "not-started" ? "selected" : ""}>Not started</option>
          <option value="in-progress" ${state.training === "in-progress" ? "selected" : ""}>In progress</option>
          <option value="completed" ${state.training === "completed" ? "selected" : ""}>Completed</option>
        </select>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;">
        <div id="crmSearchCount" class="auth-message" style="margin:0;">${total} matching records</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <button class="small-btn crm-clear" type="button">Clear Search</button>
          <button class="small-btn crm-prev" type="button">Previous</button>
          <span id="crmPageLabel" style="color:#b9a8d5;"></span>
          <button class="small-btn crm-next" type="button">Next</button>
        </div>
      </div>
      <div id="crmSearchRows" style="margin-top:12px;"></div>
    `;
  }

  function companyRowHtml(record) {
    const org = record.org || {};
    const id = String(record.id || "");
    const billing = String(org.billing_status || record.payment || "trial").toLowerCase();
    return `<div class="report-line crm-result-row crm-company-row" data-org-row="${escapeHtml(id)}">
      <strong><span class="crm-kind">COMPANY</span>${escapeHtml(record.cells[0])}</strong>
      <span>
        <input class="org-licences" type="number" min="0" value="${Number(org.licence_count || 0)}">
        <br>${escapeHtml(record.cells[3])}
      </span>
      <span>
        <select class="org-premium">
          <option value="false" ${!org.premium_enabled ? "selected" : ""}>Premium off</option>
          <option value="true" ${org.premium_enabled ? "selected" : ""}>Premium on</option>
        </select>
        <select class="org-billing">
          <option value="trial" ${billing === "trial" ? "selected" : ""}>Trial</option>
          <option value="pending" ${billing === "pending" ? "selected" : ""}>Pending</option>
          <option value="paid" ${billing === "paid" ? "selected" : ""}>Paid</option>
          <option value="overdue" ${billing === "overdue" ? "selected" : ""}>Overdue</option>
          <option value="removed" ${billing === "removed" ? "selected" : ""}>Removed</option>
        </select>
      </span>
      <span class="crm-actions">
        <button class="small-btn admin-update-org" data-id="${escapeHtml(id)}" type="button">Save</button>
        <button class="small-btn admin-delete-company" data-id="${escapeHtml(id)}" type="button">Remove</button>
      </span>
    </div>`;
  }

  function learnerRowHtml(record) {
    const learner = record.learner || {};
    return `<div class="report-line crm-result-row" data-fixed-admin-buttons="true" data-admin-controls-v2="true" data-learner-id="${escapeHtml(learner.id || record.id || "")}" data-username="${escapeHtml(learner.username || record.title || "")}" data-user-id="${escapeHtml(record.userId || "")}" data-org-id="${escapeHtml(learner.organisation_id || "")}">
      <strong><span class="crm-kind">LEARNER</span>${escapeHtml(record.cells[0])}</strong>
      <span>${escapeHtml(record.cells[1])}</span>
      <span>${escapeHtml(record.cells[2])}</span>
      <span>${escapeHtml(record.cells[3])}</span>
      <span class="crm-actions"></span>
    </div>`;
  }

  function rowHtml(record) {
    if (record.kind === "company") return companyRowHtml(record);
    if (record.kind === "learner") return learnerRowHtml(record);
    return `<div class="report-line crm-result-row">
      <strong><span class="crm-kind">${escapeHtml(record.kind.toUpperCase())}</span>${escapeHtml(record.cells[0])}</strong>
      <span>${escapeHtml(record.cells[1])}</span>
      <span>${escapeHtml(record.cells[2])}</span>
      <span>${escapeHtml(record.cells[3])}</span>
      <span></span>
    </div>`;
  }

  function attachCrmLearnerActions() {
    const rowsEl = document.getElementById("crmSearchRows");
    if (!rowsEl || typeof sccyberBuildLearnerButtons !== "function") return;
    rowsEl.querySelectorAll(".report-line[data-admin-controls-v2='true']").forEach(row => {
      sccyberBuildLearnerButtons(row, row.dataset.username, row.dataset.userId, row.dataset.learnerId, row.dataset.orgId);
    });
  }

  function renderRows() {
    const rowsEl = document.getElementById("crmSearchRows");
    if (!rowsEl) return;
    const records = filteredRecords();
    const totalPages = Math.max(1, Math.ceil(records.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;
    const start = (state.page - 1) * state.pageSize;
    const pageRows = records.slice(start, start + state.pageSize);
    rowsEl.innerHTML = pageRows.map(rowHtml).join("") || `<div class="auth-message">No CRM records match the current filters.</div>`;
    attachCrmLearnerActions();

    const count = document.getElementById("crmSearchCount");
    if (count) count.textContent = `${records.length} matching record${records.length === 1 ? "" : "s"}`;
    const label = document.getElementById("crmPageLabel");
    if (label) label.textContent = `Page ${state.page} of ${totalPages}`;
    const view = document.getElementById("adminCrmSearchView");
    const prev = view?.querySelector(".crm-prev");
    const next = view?.querySelector(".crm-next");
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= totalPages;
  }

  function render() {
    const view = document.getElementById("adminCrmSearchView");
    if (!view) return;
    view.innerHTML = controlsHtml(filteredRecords().length);
    renderRows();
  }

  function clearSearch() {
    state.query = "";
    state.type = "all";
    state.payment = "all";
    state.login = "all";
    state.premium = "all";
    state.training = "all";
    state.page = 1;
    render();
  }

  function setCrmMode(active) {
    const admin = document.getElementById("adminView");
    const crm = document.getElementById("adminCrmSearchView");
    if (!admin || !crm) return;
    state.active = active;
    admin.querySelectorAll(":scope > .report-terminal").forEach(section => {
      const belongsToCrm = section.id === "adminCrmSearchView";
      section.classList.toggle("crm-hidden", active && !belongsToCrm);
      section.classList.toggle("hidden", section.classList.contains("crm-managed-terminal") || (!active && belongsToCrm));
    });
    crm.classList.toggle("hidden", !active);
    const open = document.getElementById("adminCrmOpenBtn");
    if (open) open.textContent = active ? "Admin Home" : "CRM";
    if (active) render();
  }

  function normalizeCrmTopbarControls(topbar) {
    const openButtons = Array.from(document.querySelectorAll("#adminCrmOpenBtn"));
    const topbarButton = openButtons.find(button => button.closest(".game-topbar") === topbar) || openButtons[0];

    if (!topbarButton) {
      const controls = document.createElement("div");
      controls.style.cssText = "display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap;";
      controls.innerHTML = `
        <button class="small-btn" id="adminCrmOpenBtn" type="button">CRM</button>
      `;
      topbar.appendChild(controls);
      return;
    }

    topbarButton.textContent = state.active ? "Admin Home" : "CRM";
    openButtons.forEach(button => {
      if (button !== topbarButton) button.remove();
    });
    document.querySelectorAll("#adminCrmHomeBtn").forEach(button => button.remove());
  }

  function moveManagementSection(outputId, afterNode) {
    const output = document.getElementById(outputId);
    const section = output?.closest(".report-terminal");
    if (!section || !afterNode) return afterNode;
    section.classList.add("crm-managed-terminal", "hidden", "crm-hidden");
    afterNode.insertAdjacentElement("afterend", section);
    return section;
  }

  function relocateManagementSections(admin, crm) {
    const companySection = moveManagementSection("adminOutput", crm);
    const learnerSection = moveManagementSection("adminLearnerOutput", companySection);
    const selectedReport = document.getElementById("adminSelectedReport");
    const selectedSection = selectedReport?.closest(".report-terminal");
    if (selectedSection) selectedSection.remove();
    companySection?.classList.add("hidden", "crm-hidden");
    learnerSection?.classList.add("hidden", "crm-hidden");
  }

  function installShell() {
    addStyles();
    const admin = document.getElementById("adminView");
    if (!admin) return;
    const topbar = admin.firstElementChild;
    if (!topbar) return;
    normalizeCrmTopbarControls(topbar);

    const existingView = document.getElementById("adminCrmSearchView");
    if (existingView) {
      relocateManagementSections(admin, existingView);
      return;
    }

    const view = document.createElement("section");
    view.id = "adminCrmSearchView";
    view.className = "report-terminal hidden";
    topbar.insertAdjacentElement("afterend", view);
    relocateManagementSections(admin, view);
    render();
  }

  function patchRenderAdmin() {
    if (typeof renderAdmin !== "function" || window.sccyberCrmSearchPatched) return;
    window.sccyberCrmSearchPatched = true;
    const original = renderAdmin;
    renderAdmin = function crmSearchRenderAdmin(learnerRows, billingRows) {
      state.learners = Array.isArray(learnerRows) ? learnerRows.slice() : [];
      const result = original.apply(this, arguments);
      if (state.active) render();
      return result;
    };
  }

  document.addEventListener("click", async event => {
    const crmButton = event.target.closest("#adminCrmOpenBtn");
    if (crmButton) setCrmMode(!state.active);
    if (event.target.closest(".crm-refresh")) {
      if (!confirm("Refresh CRM data from the database?")) return;
      const count = document.getElementById("crmSearchCount");
      if (count) count.textContent = "Refreshing CRM data...";
      if (typeof loadAdminData === "function") await loadAdminData();
      render();
    }
    if (event.target.closest(".crm-clear")) {
      clearSearch();
    }
    if (event.target.closest(".crm-prev")) {
      state.page -= 1;
      renderRows();
    }
    if (event.target.closest(".crm-next")) {
      state.page += 1;
      renderRows();
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id !== "crmSearchInput") return;
    state.query = event.target.value || "";
    state.page = 1;
    renderRows();
  });

  document.addEventListener("change", event => {
    const map = {
      crmTypeFilter: "type",
      crmPaymentFilter: "payment",
      crmLoginFilter: "login",
      crmPremiumFilter: "premium",
      crmTrainingFilter: "training"
    };
    const key = map[event.target.id];
    if (!key) return;
    state[key] = event.target.value || "all";
    state.page = 1;
    renderRows();
  });

  function install() {
    installShell();
    patchRenderAdmin();
  }

  install();
  window.addEventListener("load", install);
  setTimeout(install, 250);
  setTimeout(install, 1000);
})();
