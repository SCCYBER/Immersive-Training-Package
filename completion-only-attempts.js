window.addEventListener("load", function () {
  const currentHandler = window.addAttemptPayload;

  if (typeof currentHandler !== "function" || window.sccyberCompletionOnlyAttempts) return;

  window.sccyberCompletionOnlyAttempts = true;

  window.addAttemptPayload = function completionOnlyAttempt(data) {
    const result = data || {};

    if (!result.game && !window.currentGameKey) return;
    if (result.completed !== true) return;

    currentHandler(result);
  };
});