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

window.addEventListener("load", () => {
  setTimeout(syncPremiumAccessFromDatabase, 800);
  setInterval(syncPremiumAccessFromDatabase, 30000);
});

document.addEventListener("click", event => {
  const premiumButton = event.target.closest(".game-card[data-premium='true'] .play-btn");
  if (!premiumButton) return;

  const profile = JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
  if (!profile || profile.isAdmin || profile.premiumEnabled === true) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  alert("Premium access is not active for this account. Please contact SCCYBER or your organisation admin.");
}, true);
