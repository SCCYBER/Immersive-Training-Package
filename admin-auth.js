const credentialsStorageKey = "sccyberGeneratedCredentials";

function loadGeneratedCredentials() {
  return JSON.parse(localStorage.getItem(credentialsStorageKey) || "{}");
}

function saveGeneratedCredential(username, password) {
  const creds = loadGeneratedCredentials();
  creds[username.toLowerCase()] = {
    username: username.toLowerCase(),
    password,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(credentialsStorageKey, JSON.stringify(creds));
}

function getGeneratedCredential(username) {
  return loadGeneratedCredentials()[username.toLowerCase()] || null;
}

function makeTempPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
  return password;
}

function getLearnerDetailsFromRow(button) {
  const row = button.closest(".report-line");
  if (!row) return null;
  const username = (button.dataset.username || row.querySelector("strong")?.textContent || "").trim().toLowerCase();
  const organisationId = button.dataset.org || "";
  return { username, organisationId };
}

function renderCredentials(username, password) {
  const output = document.getElementById("adminSelectedReport");
  if (!output) return;

  output.innerHTML = `
    <div class="report-section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div class="report-section-title">LOGIN CREDENTIALS</div>
        <button class="small-btn close-admin-report" type="button">Close</button>
      </div>
      <p>Give these credentials to the learner. Store them securely.</p>
      <div class="report-line">
        <strong>Username</strong>
        <span>${username}</span>
        <span>Password</span>
        <span>${password}</span>
      </div>
      <p style="color:#b9a8d5;margin-top:10px;">Login format: username only, not email.</p>
    </div>
  `;
}

async function createLearnerLogin(button) {
  if (!window.supabaseClient && typeof supabaseClient === "undefined") {
    alert("Supabase client not available.");
    return;
  }

  const client = window.supabaseClient || supabaseClient;
  const details = getLearnerDetailsFromRow(button);
  if (!details || !details.username) {
    alert("Could not identify learner username.");
    return;
  }

  const existing = getGeneratedCredential(details.username);
  if (existing) {
    renderCredentials(existing.username, existing.password);
    return;
  }

  const password = makeTempPassword();
  button.disabled = true;
  button.textContent = "Creating...";

  const { data, error } = await client.functions.invoke("create-learner-login", {
    body: {
      username: details.username,
      password,
      organisation_id: details.organisationId || null
    }
  });

  if (error || data?.error) {
    button.disabled = false;
    button.textContent = "Create Login";
    alert(data?.error || error?.message || "Could not create login.");
    return;
  }

  saveGeneratedCredential(details.username, password);
  renderCredentials(details.username, password);

  button.disabled = false;
  button.textContent = "Show Credentials";
  if (typeof loadAdminData === "function") await loadAdminData();
}

function showStoredCredentials(button) {
  const details = getLearnerDetailsFromRow(button);
  if (!details?.username) return;
  const creds = getGeneratedCredential(details.username);
  if (!creds) {
    alert("No stored password found on this device. You may need to reset/create a new password later.");
    return;
  }
  renderCredentials(creds.username, creds.password);
}

function addCreateLoginButtons() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(".report-line").forEach(row => {
    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;
    if (row.querySelector(".create-login") || row.querySelector(".show-credentials")) return;

    const creds = getGeneratedCredential(username);

    if (row.textContent.includes("Pending auth") || row.textContent.includes("Login not created yet")) {
      const btn = document.createElement("button");
      btn.className = "small-btn create-login";
      btn.dataset.username = username;
      btn.textContent = creds ? "Show Credentials" : "Create Login";
      actionCell.appendChild(document.createElement("br"));
      actionCell.appendChild(btn);
      return;
    }

    if (creds) {
      const btn = document.createElement("button");
      btn.className = "small-btn show-credentials";
      btn.dataset.username = username;
      btn.textContent = "Show Credentials";
      actionCell.appendChild(document.createElement("br"));
      actionCell.appendChild(btn);
    }
  });
}

function closeAdminReport() {
  const output = document.getElementById("adminSelectedReport");
  if (output) output.innerHTML = "Select a learner to view their report.";
}

const learnerObserver = new MutationObserver(addCreateLoginButtons);
window.addEventListener("load", () => {
  const target = document.getElementById("adminLearnerOutput");
  if (target) learnerObserver.observe(target, { childList: true, subtree: true });
  addCreateLoginButtons();
});

document.addEventListener("click", event => {
  const createBtn = event.target.closest(".create-login");
  if (createBtn) createLearnerLogin(createBtn);

  const showBtn = event.target.closest(".show-credentials");
  if (showBtn) showStoredCredentials(showBtn);

  const closeBtn = event.target.closest(".close-admin-report");
  if (closeBtn) closeAdminReport();
});
