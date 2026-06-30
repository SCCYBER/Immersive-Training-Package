function sccyberSyncGameRegistryFromCards() {
  if (typeof games === "undefined" || !Array.isArray(games)) return;

  const existing = new Map(games.map(game => [game.key, game]));
  const ordered = [];

  document.querySelectorAll(".game-card[data-game]").forEach(card => {
    if (card.dataset.reporting === "excluded" || card.dataset.status === "admin-preview") return;

    const key = card.dataset.game;
    const current = existing.get(key) || {};
    const meta = Array.from(card.querySelectorAll(".game-meta span")).map(span => span.textContent.trim());
    const title = card.querySelector("h2")?.textContent?.trim() || current.name || key;
    const tier = meta[1] || current.tier || "Basic";
    const premium = card.dataset.premium === "true" || current.premium === true;

    ordered.push({
      key,
      name: current.name || title,
      tier,
      premium
    });
  });

  if (!ordered.length) return;
  games.splice(0, games.length, ...ordered);
}

function sccyberPatchPremiumAccessForAdmins() {
  if (typeof hasPremiumAccess !== "function" || window.sccyberPremiumAccessPatched) return;

  window.sccyberPremiumAccessPatched = true;

  hasPremiumAccess = function patchedPremiumAccess() {
    const profile = typeof loadProfile === "function" ? loadProfile() : null;
    if (!profile || profile.mode === "demo") return false;
    return profile.isAdmin === true || profile.premiumEnabled === true;
  };
}

function sccyberRunArchitectureGuard() {
  sccyberSyncGameRegistryFromCards();
  sccyberPatchPremiumAccessForAdmins();
  if (typeof updateDashboard === "function") updateDashboard();
}

sccyberRunArchitectureGuard();
window.addEventListener("load", sccyberRunArchitectureGuard);
