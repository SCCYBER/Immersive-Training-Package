(function () {
  const state = {
    rows: [],
    learnerRows: [],
    search: "",
    billing: "all",
    premium: "all",
    page: 1,
    pageSize: 10
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function statusLabel(value) {
    const status = String(value || "trial").toLowerCase();
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function learnerCount(orgId) {
    return state.learnerRows.filter(row => String(row.organisation_id || "") === String(orgId || "")).length;
  }

  function searchableText(org) {
    return [
      org.name,
      org.billing_status,
      org.premium_enabled ? "premium on" : "premium off",
      org.licence_count,
      org.address,
      org.main_contact_name,
      org.main_contact_email
    ].join(" ").toLowerCase();
  }

  function filteredRows() {
    const term = state.search.trim().toLowerCase();
    return state.rows.filter(org => {
      if (state.billing !== "all" && String(org.billing_status || "trial") !== state.billing) return false;
      if (state.premium === "premium-on" && !org.premium_enabled) return false;
      if (state.premium === "premium-off" && org.premium_enabled) return false;
      if (term && !searchableText(org).includes(term)) return false;
      return true;
    });
  }

  function option(value, label, selectedValue) {
    return `<option value="${escapeHtml(value)}" ${selectedValue === value ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function controlsHtml(total, filtered) {
    return `
      <div class="report-section company-browser-controls">
        <div class="login-row profile-grid" style="margin-top:0;">
          <input id="companyBrowserSearch" type="text" maxlength="100" placeholder="Search companies, contacts or notes" value="${escapeHtml(state.search)}">
          <select id="companyBrowserBilling">
            ${option("all", "All payment statuses", state.billing)}
            ${option("trial", "Trial", state.billing)}
            ${option("pending", "Pending", state.billing)}
            ${option("paid", "Paid", state.billing)}
            ${option("overdue", "Overdue", state.billing)}
            ${option("removed", "Removed", state.billing)}
          </select>
          <select id="companyBrowserPremium">
            ${option("all", "All premium statuses", state.premium)}
            ${option("premium-on", "Premium on", state.premium)}
            ${option("premium-off", "Premium off", state.premium)}
          </select>
          <select id="companyBrowserPageSize">
            ${option("10", "10 per page", String(state.pageSize))}
            ${option("25", "25 per page", String(state.pageSize))}
            ${option("50", "50 per page", String(state.pageSize))}
          </select>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <div id="companyBrowserCount" class="auth-message" style="margin:0;">Showing ${filtered} of ${total} companies</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <button class="small-btn company-page-prev" type="button">Previous</button>
            <span id="companyBrowserPageLabel" style="color:#b9a8d5;"></span>
            <button class="small-btn company-page-next" type="button">Next</button>
          </div>
        </div>
      </div>
      <div id="companyBrowserRows"></div>
    `;
  }

  function rowHtml(org) {
    const billing = String(org.billing_status || "trial");
    const id = String(org.id || "");
    const learners = learnerCount(id);

    return `<div class="report-line company-browser-row" data-org-row="${escapeHtml(id)}">
      <strong>${escapeHtml(org.name || "Unnamed company")}</strong>
      <span>
        <input class="org-licences" type="number" min="0" value="${Number(org.licence_count || 0)}">
        <br>${escapeHtml(learners)} learner${learners === 1 ? "" : "s"}
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
        <br>${escapeHtml(statusLabel(billing))}
      </span>
      <span>
        <button class="small-btn admin-update-org" data-id="${escapeHtml(id)}" type="button">Save</button>
        <button class="small-btn admin-delete-company" data-id="${escapeHtml(id)}" type="button" style="margin-left:8px;">Remove</button>
      </span>
    </div>`;
  }

  function clampPage(totalPages) {
    if (state.page < 1) state.page = 1;
    if (state.page > totalPages) state.page = totalPages;
  }

  function renderRows() {
    const list = document.getElementById("companyBrowserRows");
    const output = document.getElementById("adminOutput");
    if (!list || !output) return;

    const rows = filteredRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    clampPage(totalPages);

    const start = (state.page - 1) * state.pageSize;
    const pageRows = rows.slice(start, start + state.pageSize);
    list.innerHTML = pageRows.map(rowHtml).join("") || `<div class="auth-message">No companies match the current filters.</div>`;

    const count = document.getElementById("companyBrowserCount");
    if (count) count.textContent = `Showing ${rows.length} of ${state.rows.length} companies`;

    const label = document.getElementById("companyBrowserPageLabel");
    if (label) {
      const from = rows.length ? start + 1 : 0;
      const to = Math.min(start + pageRows.length, rows.length);
      label.textContent = `Page ${state.page} of ${totalPages} · ${from}-${to}`;
    }

    const prev = output.querySelector(".company-page-prev");
    const next = output.querySelector(".company-page-next");
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= totalPages;
  }

  function renderBrowser() {
    const output = document.getElementById("adminOutput");
    if (!output) return;
    const rows = filteredRows();
    output.innerHTML = controlsHtml(state.rows.length, rows.length);
    renderRows();
  }

  function setRows(orgs, learnerRows) {
    state.rows = Array.isArray(orgs) ? orgs.slice() : [];
    state.learnerRows = Array.isArray(learnerRows) ? learnerRows.slice() : [];
    state.page = 1;
    renderBrowser();
  }

  function patchRenderer() {
    if (typeof renderAdmin !== "function" || window.sccyberCompanyBrowserPatched) return;
    window.sccyberCompanyBrowserPatched = true;
    const original = renderAdmin;
    renderAdmin = function patchedCompanyBrowserRender(learnerRows, billingRows) {
      original.apply(this, arguments);
      const orgs = typeof adminOrgs !== "undefined" ? adminOrgs : [];
      setRows(orgs, learnerRows || []);
    };
  }

  document.addEventListener("input", event => {
    if (event.target.id !== "companyBrowserSearch") return;
    state.search = event.target.value || "";
    state.page = 1;
    renderRows();
  });

  document.addEventListener("change", event => {
    if (event.target.id === "companyBrowserBilling") {
      state.billing = event.target.value || "all";
      state.page = 1;
      renderRows();
    }
    if (event.target.id === "companyBrowserPremium") {
      state.premium = event.target.value || "all";
      state.page = 1;
      renderRows();
    }
    if (event.target.id === "companyBrowserPageSize") {
      state.pageSize = Number(event.target.value || 10);
      state.page = 1;
      renderRows();
    }
  });

  document.addEventListener("click", event => {
    if (event.target.closest(".company-page-prev")) {
      state.page -= 1;
      renderRows();
    }
    if (event.target.closest(".company-page-next")) {
      state.page += 1;
      renderRows();
    }
  });

  function install() {
    patchRenderer();
  }

  install();
  window.addEventListener("load", install);
  setTimeout(install, 250);
  setTimeout(install, 1000);
})();
