(function () {
  const storageKey = "sccyberPortalProfile";

  function client() {
    try { return window.supabaseClient || supabaseClient; } catch (e) { return null; }
  }

  function profile() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch (e) { return null; }
  }

  function save(profileData) {
    if (!profileData.attempts) profileData.attempts = [];
    localStorage.setItem(storageKey, JSON.stringify(profileData));
  }

  function clearLocalAccess(message) {
    localStorage.removeItem(storageKey);
    try { client()?.auth.signOut(); } catch (e) {}
    const authView = document.getElementById("authView");
    const dashboardView = document.getElementById("dashboardView");
    const reportView = document.getElementById("reportView");
    const gameView = document.getElementById("gameView");
    const adminView = document.getElementById("adminView");
    const authMessage = document.getElementById("authMessage");
    dashboardView?.classList.add("hidden");
    reportView?.classList.add("hidden");
    gameView?.classList.add("hidden");
    adminView?.classList.add("hidden");
    authView?.classList.remove("hidden");
    if (authMessage) authMessage.textContent = message || "This login no longer has portal access.";
  }

  function usernameToEmailSafe(username) {
    if (typeof usernameToEmail === "function") return usernameToEmail(username);
    const clean = String(username || "").trim().toLowerCase();
    return clean.includes("@") ? clean : `${clean}@sccyber.training`;
  }

  async function getAccess(userId) {
    const db = client();
    if (!db || !userId) return { allowed: false, reason: "Secure login is not ready." };

    const profileResult = await db
      .from("profiles")
      .select("id,first_name,surname,department_role,username,is_admin,premium_enabled,organisation,first_login_at,last_login_at,login_count")
      .eq("id", userId)
      .maybeSingle();

    if (profileResult.error || !profileResult.data) {
      return { allowed: false, reason: "This login has been removed from the portal." };
    }

    const userProfile = profileResult.data;
    if (userProfile.is_admin === true) {
      return { allowed: true, profile: userProfile, learner: null, organisation: null, premium: true };
    }

    const learnerResult = await db
      .from("learners")
      .select("id,username,organisation_id,user_id,active")
      .eq("user_id", userId)
      .maybeSingle();

    if (learnerResult.error || !learnerResult.data || learnerResult.data.active === false) {
      return { allowed: false, reason: "This learner has been removed from the portal." };
    }

    const learner = learnerResult.data;
    if (!learner.organisation_id) {
      return { allowed: false, reason: "This learner is not attached to an active company." };
    }

    const orgResult = await db
      .from("organisations")
      .select("id,name,billing_status,premium_enabled")
      .eq("id", learner.organisation_id)
      .maybeSingle();

    if (orgResult.error || !orgResult.data || String(orgResult.data.billing_status || "").toLowerCase() === "removed") {
      return { allowed: false, reason: "This company has been removed from the portal." };
    }

    const premium = userProfile.premium_enabled === true || orgResult.data.premium_enabled === true;
    return { allowed: true, profile: userProfile, learner, organisation: orgResult.data, premium };
  }

  async function buildLiveProfile(user, typedUsername, existingProfile, access) {
    let loginStats = null;
    try {
      const tracked = await client().rpc("record_profile_login");
      loginStats = Array.isArray(tracked.data) ? tracked.data[0] : tracked.data;
    } catch (e) {}

    const source = access.profile;
    const next = typeof createProfile === "function"
      ? createProfile(source.first_name, source.surname, source.department_role)
      : {
        firstName: source.first_name || "",
        surname: source.surname || "",
        departmentRole: source.department_role || "",
        name: `${source.first_name || ""} ${source.surname || ""}`.trim(),
        scores: {},
        attempts: []
      };

    next.username = source.username || typedUsername;
    next.isAdmin = source.is_admin === true;
    next.premiumEnabled = access.premium === true;
    next.organisation = source.organisation || access.organisation?.name || "";
    next.organisationId = access.learner?.organisation_id || access.organisation?.id || "";
    next.firstLoginAt = loginStats?.first_login_at || source.first_login_at || null;
    next.lastLoginAt = loginStats?.last_login_at || source.last_login_at || null;
    next.loginCount = loginStats?.login_count || source.login_count || 0;
    next.supabaseUserId = user.id;
    next.mode = "live";

    if (typeof preserveLearnerAttempts === "function") {
      return preserveLearnerAttempts(next, existingProfile, typedUsername, user.id);
    }

    return next;
  }

  async function patchedCredentialLogin() {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const authMessage = document.getElementById("authMessage");
    const username = usernameInput?.value.trim() || "";
    const password = passwordInput?.value || "";
    const db = client();
    const existingProfile = profile();

    if (!username || !password) {
      if (authMessage) authMessage.textContent = "Enter username and password.";
      return;
    }

    if (!db) {
      if (authMessage) authMessage.textContent = "Supabase is not connected yet.";
      return;
    }

    if (authMessage) authMessage.textContent = "Checking credentials...";
    const signIn = await db.auth.signInWithPassword({ email: usernameToEmailSafe(username), password });
    if (signIn.error || !signIn.data?.user) {
      if (authMessage) authMessage.textContent = "Login failed. Check username and password.";
      return;
    }

    const access = await getAccess(signIn.data.user.id);
    if (!access.allowed) {
      await db.auth.signOut();
      localStorage.removeItem(storageKey);
      if (authMessage) authMessage.textContent = access.reason;
      return;
    }

    const next = await buildLiveProfile(signIn.data.user, username, existingProfile, access);
    save(next);
    if (typeof showDashboard === "function") showDashboard();
  }

  async function validateCurrentSession(showWhenAllowed) {
    const current = profile();
    const db = client();
    if (!current || current.mode !== "live" || !db) return false;

    const session = await db.auth.getSession();
    const user = session.data?.session?.user;
    if (!user) {
      clearLocalAccess("Session expired. Please log in again.");
      return false;
    }

    const access = await getAccess(user.id);
    if (!access.allowed) {
      clearLocalAccess(access.reason);
      return false;
    }

    if (current.premiumEnabled !== access.premium) {
      current.premiumEnabled = access.premium === true;
      save(current);
      if (typeof updateDashboard === "function") updateDashboard();
    }

    if (showWhenAllowed && typeof showDashboard === "function") showDashboard();
    return true;
  }

  function patchAuthFlow() {
    if (window.sccyberAccessLockdownPatched) return;
    window.sccyberAccessLockdownPatched = true;
    if (typeof credentialLogin === "function") credentialLogin = patchedCredentialLogin;
    if (typeof restoreSession === "function") {
      restoreSession = async function lockedRestoreSession() {
        const current = profile();
        if (current?.mode === "demo" && typeof validProfile === "function" && validProfile(current)) {
          if (typeof showDashboard === "function") showDashboard();
          return;
        }
        await validateCurrentSession(true);
      };
    }
  }

  function install() {
    patchAuthFlow();
    setTimeout(() => validateCurrentSession(false), 300);
    setTimeout(() => validateCurrentSession(false), 1500);
  }

  window.sccyberValidatePortalAccess = validateCurrentSession;
  window.addEventListener("load", function () {
    install();
    setInterval(() => validateCurrentSession(false), 30000);
  });

  if (document.readyState === "interactive" || document.readyState === "complete") install();
})();
