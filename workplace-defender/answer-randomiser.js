(function () {
  function shuffleAnswerButtons() {
    const answers = document.getElementById("answers");
    if (!answers) return;

    const buttons = Array.from(answers.children);
    if (buttons.length < 2) return;

    for (let i = buttons.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }

    buttons.forEach(button => answers.appendChild(button));
  }

  function patchRenderQuestion() {
    if (typeof window.renderQuestion !== "function" || window.__pikAnswersRandomised) return;

    const originalRenderQuestion = window.renderQuestion;
    window.renderQuestion = function () {
      originalRenderQuestion.apply(this, arguments);
      shuffleAnswerButtons();
    };

    window.__pikAnswersRandomised = true;
  }

  patchRenderQuestion();
  window.addEventListener("load", patchRenderQuestion);
  setTimeout(patchRenderQuestion, 250);
})();