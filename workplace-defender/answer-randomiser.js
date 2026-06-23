(function () {
  function makeVisualOrder(count) {
    const order = Array.from({ length: count }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function randomiseAnswerDisplayOnly() {
    const answers = document.getElementById("answers");
    if (!answers) return;

    const buttons = Array.from(answers.children);
    if (buttons.length < 2) return;

    answers.style.display = "flex";
    answers.style.flexDirection = "column";

    const visualOrder = makeVisualOrder(buttons.length);
    buttons.forEach((button, originalIndex) => {
      button.style.order = visualOrder[originalIndex];
    });
  }

  function patchRenderQuestion() {
    if (typeof window.renderQuestion !== "function" || window.__pikAnswersRandomised) return;

    const originalRenderQuestion = window.renderQuestion;
    window.renderQuestion = function () {
      originalRenderQuestion.apply(this, arguments);
      randomiseAnswerDisplayOnly();
    };

    window.__pikAnswersRandomised = true;
  }

  patchRenderQuestion();
  window.addEventListener("load", patchRenderQuestion);
  setTimeout(patchRenderQuestion, 250);
})();