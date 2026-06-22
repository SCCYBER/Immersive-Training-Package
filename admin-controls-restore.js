function attachStableAdminButtons() {
  const output = document.getElementById("adminLearnerOutput");
  if (!output) return;

  output.querySelectorAll(":scope > .report-line").forEach(row => {
    if (row.dataset.fixedAdminButtons === "true") return;

    const username = row.querySelector("strong")?.textContent?.trim()?.toLowerCase();
    const actionCell = row.querySelector("span:last-child");
    if (!username || !actionCell) return;

    const reportButton = row.querySelector(".admin-report, .admin-view-report");
    const removeButton = row.querySelector(".admin-remove-learner, .remove-learner");
    const userId = reportButton?.dataset.id || "";
    const removeId = removeButton?.dataset.id || "";
    const hasLogin = !!userId;

    actionCell.innerHTML = "";

    if (hasLogin) {
      const view = document.createElement("button");
      view.className = "small-btn fixed-view-report";
      view.dataset.id = userId;
      view.textContent = "View Report";
      actionCell.appendChild(view);
      actionCell.appendChild(document.createElement("br"));
    }

    const show = document.createElement("button");
    show.className = "small-btn fixed-show-login";
    show.dataset.username = username;
    show.textContent = "Show Credentials";
    actionCell.appendChild(show);
    actionCell.appendChild(document.createElement("br"));

    if (hasLogin) {
      const reset = document.createElement("button");
      reset.className = "small-btn fixed-reset-login";
      reset.dataset.username = username;
      reset.textContent = "Reset Login";
      actionCell.appendChild(reset);
      actionCell.appendChild(document.createElement("br"));
    } else {
      const create = document.createElement("button");
      create.className = "small-btn fixed-create-login";
      create.dataset.username = username;
      create.textContent = "Create Login";
      actionCell.appendChild(create);
      actionCell.appendChild(document.createElement("br"));
    }

    if (removeId) {
      const remove = document.createElement("button");
      remove.className = "small-btn fixed-remove-learner";
      remove.dataset.id = removeId;
      remove.dataset.username = username;
      remove.textContent = "Remove";
      actionCell.appendChild(remove);
    }

    row.dataset.fixedAdminButtons = "true";
  });
}

window.addEventListener("load", function () {
  setTimeout(attachStableAdminButtons, 300);
});
