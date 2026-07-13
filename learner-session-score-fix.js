(function () {
  const PROFILE_KEY = "sccyberPortalProfile";
  let refreshInFlight = false;
  let refreshTimer = null;

  function dbClient() {
    return window.supabaseClient || (typeof supabaseClient !== "undefined" ? supabaseClient : null);
  }

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function writeProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function showLoggedOutState() {
    localStorage.removeItem(PROFILE_KEY);
    if (typeof window.sccyberShowLanding === "function") {
      window.sccyberShowLanding();
      return;
    }
    ["dashboardView", "reportView", "gameView", "adminView"].forEach(function (id) {
      const element = document.getElementById(id);
      if (element) element.classList.add("hidden");
    });
    const auth = document.getElementById("authView");
    if (auth) auth.classList.remove("hidden");
    document.body.classList.add("sccyber-login-open");
  }

  function remoteAttemptToLocal(row, profile) {
    const answered = row.answered || null;
    const accuracy = row.accuracy !== null && row.accuracy !== undefined
      ? Number(row.accuracy)
      : answered && row.correct_count !== null && row.correct_count !== undefined
        ? Math.round(Number(row.correct_count) / Number(answered) * 100)
        : null;

    return {
      firstName: profile.firstName,
      surname: profile.surname,
      learnerName: profile.name,
      departmentRole: profile.departmentRole,
      game: row.game,
      score: Number(row.score || 0),
      source: "supabase",
      totalQuestions: null,
      correct: row.correct_count,
      wrong: row.wrong_count,
      answered: row.answered,
      accuracy: accuracy,
      durationSeconds: row.duration_seconds,
      completed: true,
      passed: row.passed === true || Number(accuracy || 0) >= 80,
      role: null,
      threatsStopped: null,
      biggestWeakness: null,
      createdAt: row.created_at || new Date().toISOString(),
      supabaseSynced: true
    };
  }

  async function refreshAuthoritativeLearnerState() {
    if (refreshInFlight) return;
    const profile = readProfile();
    const client = dbClient();

    if (!profile || profile.mode !== "live" || !client) return;

    refreshInFlight = true;
    try {
      const sessionResult = await client.auth.getSession();
      const session = sessionResult && sessionResult.data ? sessionResult.data.session : null;

      if (!session || !session.user) {
        showLoggedOutState();
        return;
      }

      if (profile.supabaseUserId && profile.supabaseUserId !== session.user.id) {
        showLoggedOutState();
        return;
      }

      const profileResult = await client
        .from("profiles")
        .select("first_name,surname,department_role,username,is_admin,premium_enabled,organisation,first_login_at,last_login_at,login_count")
        .eq("id", session.user.id)
        .single();

      const attemptResult = await client
        .from("attempts")
        .select("game,score,accuracy,correct_count,wrong_count,answered,duration_seconds,passed,created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (attemptResult.error || !Array.isArray(attemptResult.data)) return;

      const serverProfile = profileResult && profileResult.data ? profileResult.data : null;
      const clean = {
        firstName: serverProfile && serverProfile.first_name ? serverProfile.first_name : profile.firstName,
        surname: serverProfile && serverProfile.surname ? serverProfile.surname : profile.surname,
        departmentRole: serverProfile && serverProfile.department_role ? serverProfile.department_role : profile.departmentRole,
        name: "",
        username: serverProfile && serverProfile.username ? serverProfile.username : profile.username,
        scores: {},
        attempts: [],
        createdAt: profile.createdAt || new Date().toISOString(),
        isAdmin: !!(serverProfile && serverProfile.is_admin),
        premiumEnabled: !!(serverProfile && serverProfile.premium_enabled),
        organisation: serverProfile && serverProfile.organisation ? serverProfile.organisation : "",
        firstLoginAt: serverProfile ? serverProfile.first_login_at : null,
        lastLoginAt: serverProfile ? serverProfile.last_login_at : null,
        loginCount: serverProfile ? serverProfile.login_count : 0,
        supabaseUserId: session.user.id,
        mode: "live"
      };

      clean.name = `${clean.firstName || ""} ${clean.surname || ""}`.trim();
      clean.attempts = attemptResult.data.map(function (row) {
        return remoteAttemptToLocal(row, clean);
      });

      if (Array.isArray(window.games)) {
        window.games.forEach(function (game) {
          const rows = clean.attempts.filter(function (attempt) { return attempt.game === game.key; });
          clean.scores[game.key] = rows.length
            ? Math.max.apply(null, rows.map(function (attempt) { return Number(attempt.score || 0); }))
            : 0;
        });
      }

      writeProfile(clean);
      if (typeof updateDashboard === "function") updateDashboard();
    } catch (error) {
      console.warn("SCCYBER learner session refresh failed", error);
    } finally {
      refreshInFlight = false;
    }
  }

  function scheduleRefresh(delay) {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshAuthoritativeLearnerState, delay || 700);
  }

  function patchDashboard() {
    if (window.sccyberSessionScoreFixPatched || typeof showDashboard !== "function") return;
    window.sccyberSessionScoreFixPatched = true;
    const originalShowDashboard = showDashboard;
    showDashboard = function fixedShowDashboard() {
      const result = originalShowDashboard.apply(this, arguments);
      scheduleRefresh(900);
      return result;
    };
  }

  function install() {
    patchDashboard();
    scheduleRefresh(500);
    setTimeout(patchDashboard, 1200);
  }

  window.sccyberRefreshLearnerState = refreshAuthoritativeLearnerState;
  window.addEventListener("load", install);
  if (document.readyState === "interactive" || document.readyState === "complete") setTimeout(install, 50);
})();