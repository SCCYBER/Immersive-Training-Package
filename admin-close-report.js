function closeSelectedLearnerReport() {
  const output = document.getElementById("adminSelectedReport");
  if (output) output.innerHTML = "Select a learner to view their report.";
}

function addCloseButtonToSelectedReport() {
  const output = document.getElementById("adminSelectedReport");
  if (!output) return;
  if (!output.innerHTML || output.textContent.includes("Select a learner")) return;
  if (output.querySelector(".close-selected-learner-report, .close-admin-report")) return;

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

window.addEventListener("load", () => {
  setTimeout(addCloseButtonToSelectedReport, 500);
});

document.addEventListener("click", event => {
  const viewBtn = event.target.closest(".admin-view-report");
  if (viewBtn) setTimeout(addCloseButtonToSelectedReport, 100);

  const closeBtn = event.target.closest(".close-selected-learner-report, .close-admin-report");
  if (closeBtn) closeSelectedLearnerReport();
});
