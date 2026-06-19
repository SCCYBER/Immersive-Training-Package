const originalAddAttemptPayload = window.addAttemptPayload;

window.addAttemptPayload = function guardedAddAttemptPayload(data) {
  const payload = data || {};
  const answered = Number(payload.answered || 0);
  const durationSeconds = Number(payload.durationSeconds || 0);
  const hasAccuracy = payload.accuracy !== null && payload.accuracy !== undefined && !Number.isNaN(Number(payload.accuracy));
  const hasScore = payload.score !== null && payload.score !== undefined && !Number.isNaN(Number(payload.score)) && Number(payload.score) > 0;

  if (!payload.game && !window.currentGameKey) {
    return;
  }

  const hasStartedEvidence =
    payload.completed === true ||
    payload.passed === true ||
    answered > 0 ||
    durationSeconds > 0 ||
    hasAccuracy ||
    hasScore;

  if (!hasStartedEvidence) {
    return;
  }

  originalAddAttemptPayload(payload);
};
