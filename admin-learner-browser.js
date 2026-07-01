(function () {
  const state = {
    rows: [],
    search: "",
    company: "",
    status: "all",
    page: 1,
    pageSize: 25
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clientRows(rows) {
    return Array.isArray(rows) ? rows : [];
  }

  function profileFor(row) {
    const profiles = window.adminProfiles || (typeof adminProfiles !== "undefined" ? adminProfiles : []);
    return profiles.find(profile => profile.id === row.user_id) || {};
  }

  function orgFor(row) {
    const orgs = window.adminOrgs || (typeof adminOrgs !== "undefined" ? adminOrgs : []);
    return orgs.find(org => org.id === row.organisation_id) || null;
  }

  function attemptsFor(row) {
    if (!row.user_id) return [];
    const attempts = window.adminAttempts || (typeof adminAttempts !== "undefined" ? adminAttempts : []);
    return attempts.filter(attempt => attempt.user_id === row.user_id);
  }

  function completedCount(row) {
    const keys = new Set(attemptsFor(row).map(attempt => attempt.game).filter(Boolean));
    return keys.size;
  }

  function latestAttemptDate(row) {
    const attempts = attemptsFor(row);
    if (!attempts.length) return "";
    const latest = attempts.reduce((max, attempt) => {
      const value = new Date(attempt.created_at || 0).getTime();
      return value > max ? value : max;
    }, 0);
    return latest ? new Date(latest).toLocaleDateString() : "";
  }

  function loginDate(profile) {
    const value = profile?.last_login_at || "";
    return value ? new Date(value).toLocaleDateString() : "";
  }

  function inactiveForDays(profile, days) {
    const value = profile?.last_login_at || "";
    if (!value) return false;
    return Date.now() - new Date(value).getTime() >= days * 24 * 60 * 60 * 1000;
  }

  function rowStatus(row) {
    const profile = profileFor(row);
    const count = completedCount(row);
    const total = Array.isArray(window.games) ? window.games.length : 5;
    if (!row.user_id) return "No login";
    if (!profile.last_login_at) return "Never logged in";
    if (count >= total) return "Completed";
    if (profile.premium_enabled) return "Premium";
    return count > 0 ? "In progress" : "Not started";
  }

  function searchableText(row) {
    const profile = profileFor(row);
    const org = orgFor(row);
    return [
      row.username,
      profile.first_name,
      profile.surname,
      profile.department_role,
      org?.name,
      rowStatus(row)
    ].join(" ").toLowerCase();
  }

  function matchesStatus(row) {
    const profile = profileFor(row);
    const count = completedCount(row);
    const total = Array.isArray(window.games) ? window.games.length : 5;
    if (state.status === "login-active") return !!row.user_id;
    if (state.status === "no-login") return !row.user_id;
    if (state.status === "never-logged-in") return !!row.user_id && !profile.last_login_at;
    if (state.status === "inactive-30") return !!row.user_id && inactiveForDays(profile, 30);
    if (state.status === "premium") return !!profile.premium_enabled;
    if (state.status === "not-started") return !!row.user_id && !!profile.last_login_at && count === 0;
    if (state.status === "in-progress") return !!row.user_id && count > 0 && count < total;
    if (state.status === "completed") return !!row.user_id && count >= total;
    return true;
  }

  function filteredRows() {
    if (!state.company) return [];
    const term = state.search.trim().toLowerCase();
    return state.rows.filter(row => {
      if (String(row.organisation_id || "") !== state.company) return false;
      if (term && !searchableText(row).includes(term)) return false;
      return matchesStatus(row);
    });
  }

  function companyOptions() {
    const orgs = window.adminOrgs || (typeof adminOrgs !== "undefined" ? adminOrgs : []);
    return orgs
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
      .map(org => `<option value="${escapeHtml(org.id)}" ${state.company === String(org.id) ? "selected" : ""}>${escapeHtml(org.name || "Unnamed company")}</option>`)
      .join("");
  }

  function controlsHtml(total, filtered) {
    return `
      <div class="report-section learner-browser-controls">
        <div class="login-row profile-grid" style="margin-top:0;">
          <input id="learnerBrowserSearch" type="text" maxlength="80" placeholder="Search learners, role, company or status" value="${escapeHtml(state.search)}">
          <select id="learnerBrowserCompany">
            <option value="" ${state.company ? "" : "selected"}>Select company</option>
            ${companyOptions()}
          </select>
          <select id="learnerBrowserStatus">
            <option value="all" ${state.status === "all" ? "selected" : ""}>All statuses</option>
            <option value="login-active" ${state.status === "login-active" ? "selected" : ""}>Login active</option>
            <option value="no-login" ${state.status === "no-login" ? "selected" : ""}>No login</option>
            <option value="never-logged-in" ${state.status === "never-logged-in" ? "selected" : ""}>Never logged in</option>
            <option value="inactive-30" ${state.status === "inactive-30" ? "selected" : ""}>Inactive 30+ days</option>
            <option value="not-started" ${state.status === "not-started" ? "selected" : ""}>Not started</option>
            <option value="in-progress" ${state.status === "in-progress" ? "selected" : ""}>In progress</option>
            <option value="completed" ${state.status === "completed" ? "selected" : ""}>Completed</option>
            <option value="premium" ${state.status === "premium" ? "selected" : ""}>Premium</option>
          </select>
          <select id="learnerBrowserPageSize">
            <option value="10" ${state.pageSize === 10 ? "selected" : ""}>10 per page</option>
            <option value="25" ${state.pageSize === 25 ? "selected" : ""}>25 per page</option>
            <option value="50" ${state.pageSize === 50 ? "selected" : ""}>50 per page</option>
          </select>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <div id="learnerBrowserCount" class="auth-message" style="margin:0;">Showing ${filtered} of ${total} learners</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <button class="small-btn learner-page-prev" type="button">Previous</button>
            <span id="learnerBrowserPageLabel" style="color:#b9a8d5;"></span>
            <button class="small-btn learner-page-next" type="button">Next</button>
          </div>
        </div>
      </div>
      <div id="learnerBrowserRows"></div>
    `;
  }

  function rowHtml(row) {
    const profile = profileFor(row);
    const org = orgFor(row);
    const uid = row.user_id || "";
    const total = Array.isArray(window.games) ? window.games.length : 5;
    const count = completedCount(row);
    const status = rowStatus(row);
    const name = [profile.first_name, profile.surname].filter(Boolean).join(" ") || row.username || "Learner";
    const role = profile.department_role || row.department_role || "No role";
    const progress = uid ? `${count} / ${total}` : "Login not created";
    const lastLogin = uid ? loginDate(profile) || "Never logged in" : "No login";
    const latest = latestAttemptDate(row) || "No attempts";

    return `<div class="report-line" data-fixed-admin-buttons="true" data-admin-controls-v2="true" data-learner-id="${escapeHtml(row.id || "")}" data-username="${escapeHtml(row.username || "")}" data-user-id="${escapeHtml(uid)}" data-org-id="${escapeHtml(row.organisation_id || "")}">
      <strong>${escapeHtml(row.username || "No username")}</strong>
      <span>${escapeHtml(name)}<br>${escapeHtml(role)}</span>
      <span>${escapeHtml(org ? org.name : "No company")}<br>${escapeHtml(status)}</span>
      <span>${escapeHtml(progress)}<br>Last login: ${escapeHtml(lastLogin)}<br>Latest game: ${escapeHtml(latest)}</span>
      <span></span>
    </div>`;
  }

  function clampPage(totalPages) {
    if (state.page < 1) state.page = 1;
    if (state.page > totalPages) state.page = totalPages;
  }

  function renderRows() {
    const output = document.getElementById("adminLearnerOutput");
    const list = document.getElementById("learnerBrowserRows");
    if (!output || !list) return;

    const rows = filteredRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    clampPage(totalPages);
    const start = (state.page - 1) * state.pageSize;
    const pageRows = rows.slice(start, start + state.pageSize);

    if (!state.company) {
      list.innerHTML = `<div class="auth-message">Select a company to view learners and reports.</div>`;
    } else {
      list.innerHTML = pageRows.map(rowHtml).join("") || `<div class="auth-message">No learners match the current filters.</div>`;
    }
    list.querySelectorAll(".report-line[data-admin-controls-v2='true']").forEach(row => {
      if (typeof sccyberBuildLearnerButtons === "function") {
        sccyberBuildLearnerButtons(row, row.dataset.username, row.dataset.userId, row.dataset.learnerId, row.dataset.orgId);
      }
    });

    const label = document.getElementById("learnerBrowserPageLabel");
    if (label) {
      const from = rows.length ? start + 1 : 0;
      const to = Math.min(start + pageRows.length, rows.length);
      label.textContent = `Page ${state.page} of ${totalPages} · ${from}-${to}`;
    }

    const count = document.getElementById("learnerBrowserCount");
    if (count) count.textContent = state.company ? `Showing ${rows.length} of ${state.rows.length} learners` : `${state.rows.length} learners available`;

    const prev = output.querySelector(".learner-page-prev");
    const next = output.querySelector(".learner-page-next");
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= totalPages;
  }

  function renderBrowser() {
    const output = document.getElementById("adminLearnerOutput");
    if (!output) return;

    const rows = filteredRows();
    output.innerHTML = controlsHtml(state.rows.length, rows.length);
    renderRows();
  }

  function setRows(rows) {
    state.rows = clientRows(rows);
    state.page = 1;
    renderBrowser();
  }

  function patchRenderer() {
    if (typeof sccyberRenderLearnerRowsV2 !== "function") return;
    if (window.sccyberLearnerBrowserPatched) return;
    window.sccyberLearnerBrowserPatched = true;
    sccyberRenderLearnerRowsV2 = setRows;
  }

  document.addEventListener("input", event => {
    if (event.target.id !== "learnerBrowserSearch") return;
    state.search = event.target.value || "";
    state.page = 1;
    renderRows();
  });

  document.addEventListener("change", event => {
    if (event.target.id === "learnerBrowserCompany") {
      state.company = event.target.value || "";
      state.page = 1;
      renderRows();
    }
    if (event.target.id === "learnerBrowserStatus") {
      state.status = event.target.value || "all";
      state.page = 1;
      renderRows();
    }
    if (event.target.id === "learnerBrowserPageSize") {
      state.pageSize = Number(event.target.value || 25);
      state.page = 1;
      renderRows();
    }
  });

  document.addEventListener("click", event => {
    if (event.target.closest(".learner-page-prev")) {
      state.page -= 1;
      renderRows();
    }
    if (event.target.closest(".learner-page-next")) {
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
