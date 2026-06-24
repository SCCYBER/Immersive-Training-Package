async function syncPremiumAccessFromDatabase() {
  try {
    const client = window.supabaseClient || supabaseClient;
    if (!client) return;

    const profile = JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
    if (!profile || profile.mode !== "live" || !profile.supabaseUserId || profile.isAdmin) return;

    const { data, error } = await client
      .from("profiles")
      .select("premium_enabled")
      .eq("id", profile.supabaseUserId)
      .single();

    if (error || !data) return;

    const allowed = data.premium_enabled === true;
    if (profile.premiumEnabled !== allowed) {
      profile.premiumEnabled = allowed;
      localStorage.setItem("sccyberPortalProfile", JSON.stringify(profile));
      if (typeof updateDashboard === "function") updateDashboard();
    }
  } catch (e) {}
}

function cleanLoginMessages() {
  const authMessage = document.getElementById("authMessage");
  if (!authMessage) return;

  const text = authMessage.textContent.trim().toLowerCase();

  if (text.includes("supabase")) {
    authMessage.textContent = "Secure login ready.";
  }

  if (authMessage.textContent.trim() === "Logged out. Enter learner credentials.") {
    authMessage.textContent = "";
  }
}

function loadAdminRefreshFix() {
  if (document.getElementById("sccyberAdminRefreshFixScript")) return;
  const script = document.createElement("script");
  script.id = "sccyberAdminRefreshFixScript";
  script.src = "admin-refresh-fix.js?v=20260624b";
  document.body.appendChild(script);
}

function loadLandingPage() {
  if (document.getElementById("sccyberLandingPageScript")) return;
  const script = document.createElement("script");
  script.id = "sccyberLandingPageScript";
  script.src = "landing-page.js?v=20260624a";
  document.body.appendChild(script);
}

function fixGameLaunchUrls() {
  const brute = document.querySelector(".game-card[data-game='brute-force-lockdown'] .play-btn");
  if (brute) brute.dataset.url = "https://sccyber.github.io/brute-force-breach/bf-core-917a.html?portal=1";

  const breach = document.querySelector(".game-card[data-game='breach-lockdown'] .play-btn");
  if (breach) breach.dataset.url = "https://sccyber.github.io/breach-lockdown/index.html?portal=1";
}

function runPortalHelpers() {
  setTimeout(syncPremiumAccessFromDatabase, 800);
  setInterval(syncPremiumAccessFromDatabase, 30000);
  setInterval(cleanLoginMessages, 300);
  cleanLoginMessages();
  loadLandingPage();
  loadAdminRefreshFix();
  fixGameLaunchUrls();
  setTimeout(fixGameLaunchUrls, 500);
}

window.addEventListener("load", runPortalHelpers);
if (document.readyState === "interactive" || document.readyState === "complete") {
  setTimeout(runPortalHelpers, 50);
}

document.addEventListener("click", event => {
  const premiumButton = event.target.closest(".game-card[data-premium='true'] .play-btn");
  if (!premiumButton) return;

  const profile = JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
  if (!profile || profile.isAdmin || profile.premiumEnabled === true) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  alert("Premium access is not active for this account. Please contact SCCYBER or your organisation admin.");
}, true);