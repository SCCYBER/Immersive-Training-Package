async function addLearnerRecordWithAssignedFields() {
  const username = document.getElementById("newLearnerUsername")?.value.trim().toLowerCase();
  const firstName = document.getElementById("newLearnerFirstName")?.value.trim();
  const surname = document.getElementById("newLearnerSurname")?.value.trim();
  const role = document.getElementById("newLearnerRole")?.value.trim();
  const organisationId = document.getElementById("newLearnerCompany")?.value || null;
  const learnerMessage = document.getElementById("learnerMessage");

  if (!username) {
    if (learnerMessage) learnerMessage.textContent = "Enter a username.";
    return;
  }

  if (!firstName || !surname || !role) {
    if (learnerMessage) learnerMessage.textContent = "Enter first name, surname and department / role.";
    return;
  }

  const client = window.supabaseClient || supabaseClient;
  const payload = {
    username,
    organisation_id: organisationId,
    active: true,
    first_name: firstName,
    surname,
    department_role: role
  };

  const { error } = await client.from("learners").insert(payload);

  if (learnerMessage) {
    learnerMessage.textContent = error
      ? error.message || "Could not add learner record."
      : `Learner added. Username: ${username}`;
  }

  if (!error) {
    ["newLearnerUsername", "newLearnerFirstName", "newLearnerSurname", "newLearnerRole"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    if (typeof loadAdminData === "function") await loadAdminData();
  }
}

window.addEventListener("load", () => {
  if (typeof addLearnerRecord === "function") {
    addLearnerRecord = addLearnerRecordWithAssignedFields;
  }
});
