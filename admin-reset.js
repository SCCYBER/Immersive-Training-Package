function makeNewLearnerPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let value = "";
  for (let i = 0; i < length; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

function learnerUsernameFromButton(button) {
  const row = button.closest(".report-line");
  return (button.dataset.username || row?.querySelector("strong")?.textContent || "").trim().toLowerCase();
}

function showNewLoginDetails(username, newSecret) {
  const output = document.getElementById("adminSelectedReport");
  if (!output) return;
  output.innerHTML = `
    <div class="report-section">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div class="report-section-title">NEW LOGIN DETAILS</div>
        <button class="small-btn close-admin-report" type="button">Close</button>
      </div>
      <p>Give these new details to the learner. Their previous login secret will no longer work.</p>
      <div class="report-line"><strong>Username</strong><span>${username}</span><span>New Password</span><span>${newSecret}</span></div>
    </div>
  `;
}

async function resetLearnerLogin(button) {
  const username = learnerUsernameFromButton(button);
  if (!username) {
    alert("Could not identify learner.");
    return;
  }
  if (!confirm(`Generate a new login password for ${username}?`)) return;

  const newSecret = makeNewLearnerPassword();
  const client = window.supabaseClient || supabaseClient;
  button.disabled = true;
  button.textContent = "Resetting...";

  const { data, error } = await client.functions.invoke("create-learner-login", {
    body: {
      action: "reset-password",
      username,
      password: newSecret
    }
  });

  button.disabled = false;
  button.textContent = "Reset Password";

  if (error || data?.error) {
    alert(data?.error || error?.message || "Could not reset login.");
    return;
  }

  if (typeof saveGeneratedCredential === "function") saveGeneratedCredential(username, newSecret);
  showNewLoginDetails(username, newSecret);
}

function addResetButtons() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;
  output.querySelectorAll(".report-line").forEach(row => {
    if (row.textContent.includes("Pending auth") || row.textContent.includes("Login not created yet")) return;
    if (row.querySelector(".reset-login-password")) return;
    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;
    const btn = document.createElement("button");
    btn.className = "small-btn reset-login-password";
    btn.dataset.username = username;
    btn.textContent = "Reset Password";
    actionCell.appendChild(document.createElement("br"));
    actionCell.appendChild(btn);
  });
}

const resetButtonObserver = new MutationObserver(addResetButtons);
window.addEventListener("load", () => {
  const target = document.getElementById("adminLearnerOutput");
  if (target) resetButtonObserver.observe(target, { childList: true, subtree: true });
  addResetButtons();
});

document.addEventListener("click", event => {
  const btn = event.target.closest(".reset-login-password");
  if (btn) resetLearnerLogin(btn);
});
