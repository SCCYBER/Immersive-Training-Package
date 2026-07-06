const GAME_KEY = "ai-risk-radar";
const PASS_MARK = 80;
const TOTAL_EVENTS = 10;

const portalParams = new URLSearchParams(window.location.search);
const allowedParentOrigins = ["https://sccyber.github.io", window.location.origin];

function referrerOrigin() {
  try {
    return document.referrer ? new URL(document.referrer).origin : null;
  } catch (e) {
    return null;
  }
}

function loadPortalProfile() {
  try {
    return JSON.parse(localStorage.getItem("sccyberPortalProfile") || "null");
  } catch (e) {
    return null;
  }
}

const parentOrigin = referrerOrigin();
const profile = loadPortalProfile();
const launchedFromPortal = window.top !== window.self && portalParams.get("portal") === "1" && parentOrigin && allowedParentOrigins.includes(parentOrigin);
const adminPreview = portalParams.get("preview") === "admin" && !!(profile && profile.isAdmin === true);
const canPlay = launchedFromPortal && adminPreview;

const events = [
  {
    team: "FINANCE",
    person: "Maya",
    desk: "desk-finance",
    title: "AI payment summary",
    popup: "Maya is using AI to summarise a supplier email that includes new bank details and an urgent payment request.",
    policy: "Payment changes and urgent supplier requests must be verified through trusted channels.",
    context: ["Supplier domain is one letter different", "Bank details changed today", "The AI summary says the request looks urgent"],
    risk: "high",
    riskCost: 3,
    why: "This is high risk because AI may make a fraudulent payment request look cleaner and more trustworthy.",
    weakness: "Deepfake or payment fraud"
  },
  {
    team: "MARKETING",
    person: "Leah",
    desk: "desk-marketing",
    title: "Poster wording polish",
    popup: "Leah is using the approved company AI assistant to improve wording on a public cyber awareness poster.",
    policy: "Approved AI can be used for non-sensitive public content when humans review the output.",
    context: ["No customer data included", "Tool is on the approved list", "Final copy will be reviewed before publishing"],
    risk: "no",
    riskCost: 1,
    why: "This is no risk/low risk because the content is public, the tool is approved and a human review remains in place.",
    weakness: "Approved AI use"
  },
  {
    team: "SUPPORT",
    person: "Omar",
    desk: "desk-support",
    title: "Complaint trend analysis",
    popup: "Omar is about to upload 400 customer complaint emails into a free AI website to find common themes.",
    policy: "Customer data must stay in approved systems or be properly anonymised before AI processing.",
    context: ["Emails include names and contact details", "The AI site is public and unapproved", "Complaint text includes sensitive personal details"],
    risk: "high",
    riskCost: 3,
    why: "This is high risk because sensitive customer data would leave approved company systems.",
    weakness: "Data sharing"
  },
  {
    team: "OPERATIONS",
    person: "Nina",
    desk: "desk-ops",
    title: "Meeting action list",
    popup: "Nina is using an approved AI notes tool to produce actions from a routine internal planning meeting.",
    policy: "Approved AI meeting tools can be used when attendees know and sensitive data is not included.",
    context: ["Meeting contains no client data", "Attendees were told transcription is active", "The AI tool is approved by IT"],
    risk: "no",
    riskCost: 1,
    why: "This is no risk/low risk because the tool, consent and data context are appropriate.",
    weakness: "Meeting data"
  },
  {
    team: "DEVELOPMENT",
    person: "Raj",
    desk: "desk-dev",
    title: "Debug chatbot",
    popup: "Raj has pasted code into an external chatbot. The code includes live API keys and internal endpoints.",
    policy: "Secrets, credentials and internal configuration must never be pasted into public AI tools.",
    context: ["Token starts with a production prefix", "Chatbot account is personal", "Internal endpoint URLs are visible"],
    risk: "high",
    riskCost: 3,
    why: "This is high risk because exposed secrets can create account takeover and incident response work.",
    weakness: "Secrets"
  },
  {
    team: "HR",
    person: "Sofia",
    desk: "desk-hr",
    title: "CV screening site",
    popup: "Sofia wants to upload candidate CVs to a new AI screening site and let it rank applicants.",
    policy: "Recruitment AI needs approved tools, privacy review, fairness checks and human oversight.",
    context: ["CVs include personal data", "The tool cannot explain rankings", "No privacy or fairness review has happened"],
    risk: "high",
    riskCost: 2,
    why: "This is high risk because recruitment AI can create privacy, fairness and bias issues.",
    weakness: "Personal data"
  },
  {
    team: "LEGAL",
    person: "Amira",
    desk: "desk-legal",
    title: "Clause rewrite draft",
    popup: "Amira is using the approved AI assistant to simplify wording in a generic internal policy clause.",
    policy: "AI output can support drafting, but legal or policy text needs competent human review.",
    context: ["No client details included", "Tool is approved", "Amira is treating the output as a draft for review"],
    risk: "no",
    riskCost: 1,
    why: "This is no risk/low risk because the tool is approved, data is non-sensitive and the output is only a draft.",
    weakness: "Accuracy"
  },
  {
    team: "DESIGN",
    person: "Theo",
    desk: "desk-design",
    title: "Client concept image",
    popup: "Theo is uploading a confidential unreleased client product concept to a public AI image generator.",
    policy: "Client confidential material and intellectual property must not be uploaded to unapproved public AI services.",
    context: ["Concept is marked confidential", "Public AI image site is unapproved", "Client launch date is visible on the artwork"],
    risk: "high",
    riskCost: 2,
    why: "This is high risk because client IP and confidential material would be exposed.",
    weakness: "IP risk"
  },
  {
    team: "SALES",
    person: "Ben",
    desk: "desk-sales",
    title: "Email tone helper",
    popup: "Ben is using the approved AI assistant to make a generic follow-up email sound clearer. No client data is included.",
    policy: "Approved AI can support general wording where confidential data is not included and the employee reviews the output.",
    context: ["Message contains no pricing or personal data", "Approved company AI assistant is being used", "Ben will review before sending"],
    risk: "no",
    riskCost: 1,
    why: "This is no risk/low risk because the tool is approved, the content is generic and a human remains responsible.",
    weakness: "Approved AI use"
  },
  {
    team: "ADMIN",
    person: "Ivy",
    desk: "desk-admin",
    title: "AI browser extension",
    popup: "Ivy installs an AI browser extension that offers to read every page and summarise admin work automatically.",
    policy: "Browser extensions and AI tools need approval before they can access work systems, pages or data.",
    context: ["Extension requests access to all websites", "Tool is not on the approved software list", "Admin screens may include employee and company records"],
    risk: "high",
    riskCost: 3,
    why: "This is high risk because the extension may read sensitive portal, browser and company data.",
    weakness: "Shadow AI"
  }
];

const el = id => document.getElementById(id);
const startScreen = el("startScreen");
const accessLock = el("accessLock");
const playNowBtn = el("playNowBtn");
const gameShell = el("gameShell");
const scoreBox = el("scoreBox");
const accuracyBox = el("accuracyBox");
const caseBox = el("caseBox");
const riskBox = el("riskBox");
const caseTitle = el("caseTitle");
const caseCopy = el("caseCopy");
const policyNote = el("policyNote");
const answers = el("answers");
const feedback = el("feedback");
const nextBtn = el("nextBtn");
const resultCard = el("resultCard");
const resultTopline = el("resultTopline");
const resultTitle = el("resultTitle");
const resultScore = el("resultScore");
const resultCopy = el("resultCopy");
const resultBreakdown = el("resultBreakdown");
const riskFlash = el("riskFlash");
const mapStops = el("mapStops");
const sceneStage = el("sceneStage");
const evidenceTray = el("evidenceTray");
const operatorLog = el("operatorLog");
const riskFill = el("riskFill");
const stationTag = el("stationTag");
const signalTag = el("signalTag");
const avatar = el("avatar");

let eventIndex = 0;
let correct = 0;
let wrong = 0;
let score = 0;
let floorRisk = 2;
let answered = false;
let completed = false;
let startedAt = null;
let finalPayload = null;
let attemptSent = false;
let contextOpened = new Set();
let weakness = {};
let activeEvents = [];

if (!canPlay) {
  startScreen.classList.add("hidden");
  gameShell.style.display = "none";
  accessLock.classList.add("active");
}

function accuracy() {
  const done = correct + wrong;
  return done ? Math.round((correct / done) * 100) : 0;
}

function riskLabel() {
  if (floorRisk >= 9) return "CRITICAL";
  if (floorRisk >= 6) return "HIGH";
  if (floorRisk >= 3) return "ELEVATED";
  return "CONTROLLED";
}

function rank(acc = accuracy()) {
  if (acc >= 95) return "AI GOVERNANCE LEAD";
  if (acc >= 85) return "AI RISK DEFENDER";
  if (acc >= 80) return "AI CONTROL OPERATOR";
  if (acc >= 65) return "RISK SPOTTER";
  return "AI TRAINEE";
}

function biggestWeakness() {
  const entries = Object.entries(weakness).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : "None identified";
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function updateHud() {
  scoreBox.textContent = score;
  accuracyBox.textContent = `${accuracy()}%`;
  caseBox.textContent = `${Math.min(eventIndex + 1, TOTAL_EVENTS)} / ${TOTAL_EVENTS}`;
  riskBox.textContent = riskLabel();
  riskFill.style.width = `${Math.min(100, floorRisk * 10)}%`;
  gameShell.classList.toggle("danger-state", floorRisk >= 6);
}

function renderMap() {
  mapStops.innerHTML = activeEvents.map((item, index) => {
    const state = index < eventIndex ? "complete" : index === eventIndex ? "current" : "";
    return `<div class="map-stop ${state}"><span>${index + 1}</span><strong>${item.team}</strong></div>`;
  }).join("");
}

function renderOfficeFloor(activeEvent) {
  const desks = activeEvents.map((item, index) => {
    const current = index === eventIndex ? "active" : index < eventIndex ? "checked" : "";
    const popup = index === eventIndex
      ? `<div class="ai-popup"><span>AI USE</span><strong>${activeEvent.person}</strong></div>`
      : "";
    return `<div class="desk ${item.desk} ${current}">
      <div class="desk-screen"></div>
      <div class="desk-person">${item.person.slice(0, 1)}</div>
      <div class="desk-label">${item.team}</div>
      ${popup}
    </div>`;
  }).join("");

  sceneStage.innerHTML = `
    <div class="office-wall">
      <div class="pixel-clock"></div>
      <div class="office-door"></div>
      <div class="bookcase bookcase-left"><i></i><i></i></div>
      <div class="bookcase bookcase-right"><i></i><i></i></div>
      <div class="water-cooler"><span></span></div>
      <div class="notice-board">AI USE POLICY</div>
      <div class="window-block"></div>
      <div class="window-block second"></div>
    </div>
    <div class="printer furniture"><span></span><strong>PRINT</strong></div>
    <div class="plant plant-left"><span></span></div>
    <div class="plant plant-right"><span></span></div>
    <div class="filing-cabinet"><span></span><span></span><span></span></div>
    <div class="meeting-table"><i></i><i></i><i></i></div>
    <div class="sofa"><span></span></div>
    <div class="coffee-table"></div>
    ${desks}
    <div class="walkway"></div>
    <div class="avatar" id="avatar">YOU</div>
  `;
  const nextAvatar = el("avatar");
  const activeDesk = sceneStage.querySelector(`.${activeEvent.desk}`);
  if (activeDesk) {
    nextAvatar.style.left = `${activeDesk.offsetLeft + activeDesk.offsetWidth / 2}px`;
    nextAvatar.style.top = `${activeDesk.offsetTop + activeDesk.offsetHeight / 2}px`;
  }
}

function renderContext(item) {
  evidenceTray.innerHTML = item.context.map((text, index) => {
    const opened = contextOpened.has(index);
    return `<button class="evidence-chip ${opened ? "found" : ""}" data-context="${index}" type="button">
      <strong>Context ${index + 1}</strong><span>${opened ? text : "Inspect popup detail"}</span>
    </button>`;
  }).join("");
}

function renderDecision() {
  answers.innerHTML = `
    <button class="answer-btn high-risk" data-risk="high" type="button">HIGH RISK</button>
    <button class="answer-btn no-risk" data-risk="no" type="button">NO RISK</button>
  `;
}

function logLine(text) {
  operatorLog.innerHTML = `<span>${text}</span>`;
}

function renderEvent() {
  const item = activeEvents[eventIndex];
  answered = false;
  contextOpened = new Set();
  stationTag.textContent = item.team;
  signalTag.textContent = item.risk === "high" ? "AI POPUP: REVIEW" : "AI POPUP: LOW SIGNAL";
  caseTitle.textContent = item.title;
  caseCopy.textContent = item.popup;
  policyNote.textContent = item.policy;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.style.display = "none";
  renderMap();
  renderOfficeFloor(item);
  renderContext(item);
  renderDecision();
  logLine(`${item.person} is using AI in ${item.team}. Inspect the popup, then classify the risk.`);
  updateHud();
}

function flash(kind) {
  riskFlash.className = "risk-flash";
  void riskFlash.offsetWidth;
  riskFlash.classList.add(kind === "good" ? "active-good" : "active-bad");
}

function inspectContext(index) {
  if (answered) return;
  const item = activeEvents[eventIndex];
  contextOpened.add(index);
  renderContext(item);
  score += 5;
  logLine(item.context[index]);
  updateHud();
}

function chooseRisk(choice) {
  if (answered || completed) return;
  answered = true;
  const item = activeEvents[eventIndex];
  const isCorrect = choice === item.risk;
  const contextBonus = contextOpened.size === item.context.length ? 30 : contextOpened.size * 8;

  if (isCorrect) {
    correct += 1;
    score += (item.risk === "high" ? 170 : 130) + contextBonus;
    floorRisk = Math.max(0, floorRisk - item.riskCost);
    feedback.innerHTML = `Correct classification.<span class="why">${item.why}</span>`;
    feedback.className = "feedback good";
    flash("good");
  } else {
    wrong += 1;
    score = Math.max(0, score - (item.risk === "high" ? 120 : 70));
    floorRisk += item.riskCost;
    weakness[item.weakness] = (weakness[item.weakness] || 0) + 1;
    feedback.innerHTML = `Wrong classification.<span class="why">${item.why}</span>`;
    feedback.className = "feedback bad";
    flash("bad");
  }

  Array.from(answers.children).forEach(button => {
    button.classList.add("disabled");
    if (button.dataset.risk === item.risk) button.classList.add("correct");
    else if (button.dataset.risk === choice) button.classList.add("wrong");
  });

  logLine(isCorrect ? "AI popup classified correctly. Move to the next desk." : "Misclassified popup. Floor exposure increased.");
  updateHud();

  if (eventIndex >= TOTAL_EVENTS - 1) {
    setTimeout(finishGame, 1000);
    return;
  }

  nextBtn.textContent = "WALK TO NEXT AI POPUP";
  nextBtn.style.display = "block";
}

function startGame() {
  if (!canPlay) return;
  eventIndex = 0;
  correct = 0;
  wrong = 0;
  score = 0;
  floorRisk = 2;
  answered = false;
  completed = false;
  finalPayload = null;
  attemptSent = false;
  weakness = {};
  activeEvents = shuffle(events).slice(0, TOTAL_EVENTS);
  startedAt = Date.now();
  resultCard.classList.remove("active", "fail");
  startScreen.classList.add("hidden");
  renderEvent();
}

function finishGame() {
  completed = true;
  const acc = Math.round((correct / TOTAL_EVENTS) * 100);
  const passed = acc >= PASS_MARK;
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const finalRank = rank(acc);
  const weaknessText = biggestWeakness();

  finalPayload = {
    type: "SCCYBER_GAME_ATTEMPT",
    game: GAME_KEY,
    score,
    totalQuestions: TOTAL_EVENTS,
    correct,
    wrong,
    answered: TOTAL_EVENTS,
    accuracy: acc,
    durationSeconds,
    completed: true,
    passed,
    role: finalRank,
    biggestWeakness: weaknessText,
    createdAt: new Date().toISOString()
  };

  resultCard.classList.add("active");
  resultCard.classList.toggle("fail", !passed);
  resultTopline.textContent = passed ? "AI RISK CONTAINED" : "AI RISK ESCALATED";
  resultTitle.textContent = passed ? "MISSION PASSED" : "MISSION FAILED";
  resultScore.textContent = `${acc}% · ${score} POINTS · ${finalRank}`;
  resultCopy.textContent = passed
    ? "You monitored the office floor, read the AI-use popups and kept risky AI behaviour under control."
    : "Too many AI popups were misclassified. Revisit sensitive data, unapproved tools, payment fraud and client IP.";
  resultBreakdown.textContent = `Correct classifications: ${correct} / ${TOTAL_EVENTS} · Final floor risk: ${riskLabel()} · Biggest weakness: ${weaknessText} · Admin preview attempts are not saved.`;
}

function sendAttempt() {
  if (attemptSent || !finalPayload || !finalPayload.completed) return;
  if (adminPreview) return;
  attemptSent = true;
  window.parent.postMessage(finalPayload, parentOrigin);
}

evidenceTray.addEventListener("click", event => {
  const button = event.target.closest("[data-context]");
  if (!button) return;
  inspectContext(Number(button.dataset.context));
});

answers.addEventListener("click", event => {
  const button = event.target.closest("[data-risk]");
  if (!button) return;
  chooseRisk(button.dataset.risk);
});

nextBtn.addEventListener("click", () => {
  eventIndex += 1;
  renderEvent();
});

playNowBtn.addEventListener("click", startGame);

window.addEventListener("message", event => {
  if (!launchedFromPortal || event.source !== window.parent || event.origin !== parentOrigin) return;
  const data = event.data || {};
  if (data.type === "SCCYBER_REQUEST_ATTEMPT") sendAttempt();
});
