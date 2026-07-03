(function () {
  function client() {
    return window.supabaseClient || (typeof supabaseClient !== "undefined" ? supabaseClient : null);
  }

  function profile() {
    return typeof loadProfile === "function" ? loadProfile() : null;
  }

  function save(profileData) {
    if (typeof saveProfile === "function") saveProfile(profileData);
  }

  function attemptKey(attempt) {
    return [
      attempt.game || "",
      Number(attempt.score || 0),
      Number(attempt.answered || 0),
      Number(attempt.accuracy || 0),
      attempt.createdAt || attempt.created_at || ""
    ].join("|");
  }

  function payloadFor(attempt, userId) {
    return {
      user_id: userId,
      game: attempt.game,
      score: attempt.score,
      accuracy: attempt.accuracy,
      correct_count: attempt.correct,
      wrong_count: attempt.wrong,
      answered: attempt.answered,
      duration_seconds: attempt.durationSeconds,
      passed: attempt.passed === true,
      created_at: attempt.createdAt || new Date().toISOString()
    };
  }

  async function currentSessionUserId(db) {
    const result = await db.auth.getSession();
    return result?.data?.session?.user?.id || null;
  }

  async function remoteAttemptExists(db, attempt, userId) {
    const createdAt = attempt.createdAt || attempt.created_at || "";
    if (!createdAt || !attempt.game) return false;
    const result = await db
      .from("attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("game", attempt.game)
      .eq("created_at", createdAt)
      .limit(1);
    return !result.error && Array.isArray(result.data) && result.data.length > 0;
  }

  function markAttemptSynced(key) {
    const current = profile();
    if (!current || !Array.isArray(current.attempts)) return;
    current.attempts.forEach(function (attempt) {
      if (attemptKey(attempt) === key) {
        attempt.supabaseSynced = true;
        delete attempt.supabaseSyncError;
      }
    });
    delete current.lastAttemptSyncError;
    save(current);
  }

  async function syncOne(attempt) {
    const db = client();
    const current = profile();
    if (!db || !current || current.mode !== "live" || !current.supabaseUserId || current.mode === "demo") return false;

    const sessionUserId = await currentSessionUserId(db);
    if (!sessionUserId || sessionUserId !== current.supabaseUserId) {
      current.lastAttemptSyncError = "Scores are saved locally until the learner signs in again.";
      save(current);
      return false;
    }

    const key = attemptKey(attempt);
    if (attempt.supabaseSynced === true) return true;

    if (await remoteAttemptExists(db, attempt, current.supabaseUserId)) {
      markAttemptSynced(key);
      return true;
    }

    const result = await db.from("attempts").insert(payloadFor(attempt, current.supabaseUserId));
    if (result.error) {
      const latest = profile();
      if (latest && Array.isArray(latest.attempts)) {
        latest.attempts.forEach(function (item) {
          if (attemptKey(item) === key) item.supabaseSyncError = result.error.message || "Attempt sync failed.";
        });
        latest.lastAttemptSyncError = result.error.message || "Attempt sync failed.";
        save(latest);
      }
      console.warn("SCCYBER attempt sync failed", result.error);
      return false;
    }

    markAttemptSynced(key);
    return true;
  }

  async function syncPendingAttempts() {
    const current = profile();
    if (!current || current.mode !== "live" || !Array.isArray(current.attempts)) return;
    const pending = current.attempts.filter(function (attempt) {
      return attempt && attempt.completed !== false && attempt.supabaseSynced !== true;
    });
    for (const attempt of pending) {
      try {
        await syncOne(attempt);
      } catch (error) {
        console.warn("SCCYBER attempt sync retry failed", error);
      }
    }
    if (typeof updateDashboard === "function") updateDashboard();
  }

  function patchAttemptSaver() {
    if (window.sccyberAttemptSyncPatched || typeof saveAttemptToSupabase !== "function") return;
    window.sccyberAttemptSyncPatched = true;
    saveAttemptToSupabase = async function syncedAttemptSave(attempt) {
      await syncOne(attempt);
    };
  }

  function patchDashboardSync() {
    if (window.sccyberAttemptDashboardSyncPatched || typeof showDashboard !== "function") return;
    window.sccyberAttemptDashboardSyncPatched = true;
    const originalShowDashboard = showDashboard;
    showDashboard = function syncedShowDashboard() {
      originalShowDashboard.apply(this, arguments);
      setTimeout(syncPendingAttempts, 250);
    };
  }

  function install() {
    patchAttemptSaver();
    patchDashboardSync();
    syncPendingAttempts();
  }

  window.sccyberSyncPendingAttempts = syncPendingAttempts;
  install();
  window.addEventListener("load", install);
  setTimeout(install, 500);
  setTimeout(syncPendingAttempts, 1500);
})();
