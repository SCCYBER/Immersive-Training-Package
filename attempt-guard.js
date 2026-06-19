const originalAddAttemptPayload = window.addAttemptPayload;

window.addAttemptPayload = function guardedAddAttemptPayload(data) {
  const payload = data || {};
  const answered = Number(payload.answered || 0);
  const totalQuestions = Number(payload.totalQuestions || 0);
  const hasAccuracy = payload.accuracy !== null && payload.accuracy !== undefined && !Number.isNaN(Number(payload.accuracy));
  const hasScore = payload.score !== null && payload.score !== undefined && !Number.isNaN(Number(payload.score));

  const looksLikeCompletedAttempt =
    payload.completed === true ||
    payload.passed === true ||
    answered > 0 ||
    totalQuestions > 0 ||
    hasAccuracy;

  if (!looksLikeCompletedAttempt) {
    return;
  }

  if (!payload.game && !window.currentGameKey) {
    return;
  }

  if (!hasScore && !hasAccuracy && answered <= 0 && totalQuestions <= 0) {
    return;
  }

  originalAddAttemptPayload(payload);
};

window.addEventListener("load", () => {
  if (document.querySelector('script[data-recovery-helper="true"]')) return;
  const script = document.createElement("script");
  script.src = "admin-recovery.js";
  script.dataset.recoveryHelper = "true";
  script.onload = () => {
    if (typeof installAdminRecovery === "function") installAdminRecovery();
    if (typeof showAdminRecoveryUpdate === "function") showAdminRecoveryUpdate();
    const sendBtn = document.getElementById("adminRecoverySendBtn");
    const updateBtn = document.getElementById("adminRecoveryUpdateBtn");
    if (sendBtn && typeof sendAdminRecovery === "function") sendBtn.addEventListener("click", sendAdminRecovery);
    if (updateBtn && typeof updateAdminRecoverySecret === "function") updateBtn.addEventListener("click", updateAdminRecoverySecret);
  };
  document.body.appendChild(script);
});
