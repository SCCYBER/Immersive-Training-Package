function getAdminClient() {
  return window.supabaseClient || supabaseClient;
}

function adminOrganisationProfile() {
  try {
    return JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
  } catch (e) {
    return null;
  }
}

function isPortalAdmin() {
  const p = adminOrganisationProfile();
  return !!(p && p.isAdmin);
}

function ensureCompanyDetailFields() {
  const billing = document.getElementById("newCompanyBilling");
  const row = billing?.closest(".login-row");
  if (!billing || !row || document.getElementById("newCompanyAddress")) return;

  const fields = [
    ["newCompanyAddress", "Company address"],
    ["newCompanyContactNumber", "Contact number"],
    ["newCompanyMainContact", "Main contact"],
    ["newCompanyMainContactEmail", "Main contact email"],
    ["newCompanyNotes", "Notes"]
  ];

  const addBtn = document.getElementById("addCompanyBtn");
  fields.forEach(([id, placeholder]) => {
    const input = document.createElement("input");
    input.id = id;
    input.type = id.includes("Email") ? "email" : "text";
    input.maxLength = id.includes("Notes") ? 300 : 120;
    input.placeholder = placeholder;
    row.insertBefore(input, addBtn);
  });
}

async function addEnhancedCompany(event) {
  const button = event.target.closest("#addCompanyBtn");
  if (!button) return;
  if (!document.getElementById("newCompanyAddress")) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const client = getAdminClient();
  const message = document.getElementById("companyMessage");
  const name = document.getElementById("newCompanyName")?.value.trim();

  if (!isPortalAdmin() || !client) {
    if (message) message.textContent = "Admin access required.";
    return;
  }

  if (!name) {
    if (message) message.textContent = "Enter a company name.";
    return;
  }

  const payload = {
    name,
    licence_count: Number(document.getElementById("newCompanyLicences")?.value || 0),
    premium_enabled: document.getElementById("newCompanyPremium")?.value === "true",
    billing_status: document.getElementById("newCompanyBilling")?.value || "pending",
    address: document.getElementById("newCompanyAddress")?.value.trim() || null,
    contact_number: document.getElementById("newCompanyContactNumber")?.value.trim() || null,
    main_contact_name: document.getElementById("newCompanyMainContact")?.value.trim() || null,
    main_contact_email: document.getElementById("newCompanyMainContactEmail")?.value.trim() || null,
    notes: document.getElementById("newCompanyNotes")?.value.trim() || null
  };

  const { error } = await client.from("organisations").insert(payload);

  if (message) message.textContent = error ? "Could not add company. Check duplicate name or policy." : "Company added.";

  if (!error) {
    ["newCompanyName", "newCompanyLicences", "newCompanyAddress", "newCompanyContactNumber", "newCompanyMainContact", "newCompanyMainContactEmail", "newCompanyNotes"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    if (typeof loadAdminData === "function") await loadAdminData();
    setTimeout(renderEnhancedCompanies, 300);
  }
}

function safeValue(value) {
  return value === null || value === undefined ? "" : String(value).replaceAll('"', '&quot;');
}

async function renderEnhancedCompanies() {
  const output = document.getElementById("adminOutput");
  const client = getAdminClient();
  if (!output || !client || !isPortalAdmin()) return;

  const { data: orgs, error } = await client
    .from("organisations")
    .select("id,name,licence_count,active,premium_enabled,billing_status,address,contact_number,main_contact_name,main_contact_email,notes,created_at")
    .order("created_at", { ascending: false });

  if (error) return;

  output.innerHTML = `
    <div class="report-section" style="margin-bottom:12px;">
      <div class="report-section-title">Search Companies</div>
      <input id="companySearchInput" type="text" placeholder="Search by company, contact, email or phone" style="width:100%;margin-top:10px;">
    </div>
    <div id="enhancedCompanyList">
      ${(orgs || []).map(org => `
        <details class="report-section enhanced-company-card" data-search="${safeValue([org.name, org.main_contact_name, org.main_contact_email, org.contact_number, org.address].join(' ').toLowerCase())}">
          <summary style="cursor:pointer;color:#59ff9d;font-family:'Press Start 2P',cursive;font-size:11px;line-height:1.8;">
            ${org.name} · ${org.licence_count || 0} licences · ${org.billing_status || "pending"} · ${org.premium_enabled ? "premium on" : "premium off"}
          </summary>
          <div class="login-row profile-grid" style="margin-top:14px;">
            <input class="enhanced-org-name" value="${safeValue(org.name)}" placeholder="Company name">
            <input class="enhanced-org-licences" type="number" min="0" value="${org.licence_count || 0}" placeholder="Licences">
            <select class="enhanced-org-premium">
              <option value="false" ${!org.premium_enabled ? "selected" : ""}>Premium off</option>
              <option value="true" ${org.premium_enabled ? "selected" : ""}>Premium on</option>
            </select>
            <select class="enhanced-org-billing">
              <option value="trial" ${org.billing_status === "trial" ? "selected" : ""}>Trial</option>
              <option value="pending" ${org.billing_status === "pending" ? "selected" : ""}>Pending</option>
              <option value="paid" ${org.billing_status === "paid" ? "selected" : ""}>Paid</option>
              <option value="overdue" ${org.billing_status === "overdue" ? "selected" : ""}>Overdue</option>
            </select>
            <input class="enhanced-org-address" value="${safeValue(org.address)}" placeholder="Address">
            <input class="enhanced-org-phone" value="${safeValue(org.contact_number)}" placeholder="Contact number">
            <input class="enhanced-org-contact" value="${safeValue(org.main_contact_name)}" placeholder="Main contact">
            <input class="enhanced-org-email" type="email" value="${safeValue(org.main_contact_email)}" placeholder="Main contact email">
            <input class="enhanced-org-notes" value="${safeValue(org.notes)}" placeholder="Notes">
            <button class="small-btn enhanced-org-save" data-id="${org.id}" type="button">Save Company</button>
          </div>
        </details>
      `).join("") || "No companies created yet."}
    </div>
  `;
}

async function saveEnhancedCompany(button) {
  const card = button.closest(".enhanced-company-card");
  const client = getAdminClient();
  if (!card || !client) return;

  button.disabled = true;
  button.textContent = "Saving...";

  const payload = {
    name: card.querySelector(".enhanced-org-name")?.value.trim(),
    licence_count: Number(card.querySelector(".enhanced-org-licences")?.value || 0),
    premium_enabled: card.querySelector(".enhanced-org-premium")?.value === "true",
    billing_status: card.querySelector(".enhanced-org-billing")?.value || "pending",
    address: card.querySelector(".enhanced-org-address")?.value.trim() || null,
    contact_number: card.querySelector(".enhanced-org-phone")?.value.trim() || null,
    main_contact_name: card.querySelector(".enhanced-org-contact")?.value.trim() || null,
    main_contact_email: card.querySelector(".enhanced-org-email")?.value.trim() || null,
    notes: card.querySelector(".enhanced-org-notes")?.value.trim() || null
  };

  const { error } = await client.from("organisations").update(payload).eq("id", button.dataset.id);

  button.disabled = false;
  button.textContent = error ? "Save Failed" : "Saved";
  setTimeout(() => { button.textContent = "Save Company"; }, 1200);

  if (!error && typeof loadAdminData === "function") {
    await loadAdminData();
    setTimeout(renderEnhancedCompanies, 300);
  }
}

function filterCompanies() {
  const input = document.getElementById("companySearchInput");
  if (!input) return;
  const term = input.value.trim().toLowerCase();
  document.querySelectorAll(".enhanced-company-card").forEach(card => {
    card.style.display = card.dataset.search.includes(term) ? "block" : "none";
  });
}

function ensureLearnerSearch() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output || document.getElementById("learnerSearchInput")) return;
  if (output.textContent.includes("Loading learners")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "report-section";
  wrapper.style.marginBottom = "12px";
  wrapper.innerHTML = `
    <div class="report-section-title">Search Learners</div>
    <input id="learnerSearchInput" type="text" placeholder="Search by username, company or status" style="width:100%;margin-top:10px;">
  `;
  output.prepend(wrapper);
}

function filterLearners() {
  const input = document.getElementById("learnerSearchInput");
  const output = document.getElementById("adminLearnerOutput");
  if (!input || !output) return;
  const term = input.value.trim().toLowerCase();
  output.querySelectorAll(":scope > .report-line").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? "grid" : "none";
  });
}

const adminOrganisationObserver = new MutationObserver(() => {
  ensureCompanyDetailFields();
  ensureLearnerSearch();
});

window.addEventListener("load", () => {
  ensureCompanyDetailFields();
  ensureLearnerSearch();
  const adminView = document.getElementById("adminView");
  if (adminView) adminOrganisationObserver.observe(adminView, { childList: true, subtree: true });
  setTimeout(renderEnhancedCompanies, 800);
});

document.addEventListener("click", addEnhancedCompany, true);

document.addEventListener("click", event => {
  const save = event.target.closest(".enhanced-org-save");
  if (save) saveEnhancedCompany(save);
});

document.addEventListener("input", event => {
  if (event.target.id === "companySearchInput") filterCompanies();
  if (event.target.id === "learnerSearchInput") filterLearners();
});

document.addEventListener("click", event => {
  const adminButton = event.target.closest("#adminBtn, #refreshAdminBtn");
  if (adminButton) setTimeout(renderEnhancedCompanies, 700);
});
