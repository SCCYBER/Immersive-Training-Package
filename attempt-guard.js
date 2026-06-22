const originalAddAttemptPayload = window.addAttemptPayload;

window.addAttemptPayload = function guardedAddAttemptPayload(data) {
  const payload = data || {};

  if (!payload.game && !window.currentGameKey) {
    return;
  }

  const isCompletedResult =
    payload.completed === true ||
    payload.passed === true;

  if (!isCompletedResult) {
    return;
  }

  originalAddAttemptPayload(payload);
};
