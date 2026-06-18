function closeSelectedLearnerReport() {
  const output = document.getElementById("adminSelectedReport");
  if (output) output.innerHTML = "Select a learner to view their report.";
}

function addCloseButtonToSelectedReport() {
  const output = document.getElementById("adminSelectedReport");
  if (!output) return;
  if (!output.innerHTML || output.textContent.includes("Select a learner")) return;

  const existingClose = output.querySelector(".close-selected-learner-report, .close-admin-report");
  if (existingClose) {
    existingClose.textContent = "Close Report";
    existingClose.classList.add("close-selected-learner-report");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "flex-end";
  wrapper.style.marginBottom = "10px";

  const btn = document.createElement("button");
  btn.className = "small-btn close-selected-learner-report";
  btn.type = "button";
  btn.textContent = "Close Report";

  wrapper.appendChild(btn);
  output.prepend(wrapper);
}

const selectedReportObserver = new MutationObserver(addCloseButtonToSelectedReport);
window.addEventListener("load", () => {
  const target = document.getElementById("adminSelectedReport");
  if (target) selectedReportObserver.observe(target, { childList: true, subtree: true });
  addCloseButtonToSelectedReport();
});

document.addEventListener("click", event => {
  const btn = event.target.closest(".close-selected-learner-report, .close-admin-report");
  if (btn) closeSelectedLearnerReport();
});
