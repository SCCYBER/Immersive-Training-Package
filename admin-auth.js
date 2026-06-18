function makeTempPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
  return password;
}

function getLearnerDetailsFromRow(button) {
  const row = button.closest(".report-line");
  if (!row) return null;
  const username = button.dataset.username || row.querySelector("strong")?.textContent?.trim();
  const organisationId = button.dataset.org || "";
  return { username, organisationId };
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

  const output = document.getElementById("adminSelectedReport");
  if (output) {
    output.innerHTML = `
      <div class="report-section">
        <div class="report-section-title">LOGIN CREATED</div>
        <p>Give these credentials to the learner. Store them securely.</p>
        <div class="report-line"><strong>Username</strong><span>${details.username}</span><span>Password</span><span>${password}</span></div>
      </div>
    `;
  }

  button.textContent = "Login Created";
  if (typeof loadAdminData === "function") await loadAdminData();
}

function addCreateLoginButtons() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(".report-line").forEach(row => {
    if (!row.textContent.includes("Pending auth")) return;
    if (row.querySelector(".create-login")) return;

    const username = row.querySelector("strong")?.textContent?.trim();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;

    const btn = document.createElement("button");
    btn.className = "small-btn create-login";
    btn.dataset.username = username;
    btn.textContent = "Create Login";
    actionCell.appendChild(document.createElement("br"));
    actionCell.appendChild(btn);
  });
}

const learnerObserver = new MutationObserver(addCreateLoginButtons);
window.addEventListener("load", () => {
  const target = document.getElementById("adminLearnerOutput");
  if (target) learnerObserver.observe(target, { childList: true, subtree: true });
  addCreateLoginButtons();
});

document.addEventListener("click", event => {
  const btn = event.target.closest(".create-login");
  if (btn) createLearnerLogin(btn);
});
