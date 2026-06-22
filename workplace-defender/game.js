const launchedFromPortal = window.top !== window.self;

const stages = [
  { name: "OFFICE", lesson: "Protect information, conversations and shared spaces." },
  { name: "REMOTE", lesson: "Keep work secure away from the office." },
  { name: "DEVICES", lesson: "Use company equipment safely and responsibly." },
  { name: "SOFTWARE", lesson: "Only use approved tools and trusted workflows." },
  { name: "INFRA", lesson: "Respect network, access and reporting controls." }
];

const questions = [
  { topic: "OFFICE", q: "You are leaving your desk for a quick chat. A spreadsheet with customer details is open on your screen. What should you do?", a: ["Leave it because you will only be gone for a minute", "Lock the screen before walking away", "Turn the monitor slightly", "Ask a colleague to watch it"], c: 1, why: "Screens should be locked whenever you leave your desk, even briefly." },
  { topic: "OFFICE", q: "You find a printed document with staff payroll information left near the printer. What is the safest action?", a: ["Read it to see who it belongs to", "Leave it there", "Put it in your drawer", "Hand it to the owner, manager or secure disposal process"], c: 3, why: "Sensitive information should be protected and handled through the correct process." },
  { topic: "OFFICE", q: "A visitor follows closely behind you at the office entrance and says they forgot their pass. What should you do?", a: ["Let them in because they look professional", "Ask them to follow the visitor sign in process", "Hold the door open and tell reception later", "Ignore it"], c: 1, why: "Tailgating can bypass physical security controls." },
  { topic: "REMOTE", q: "You are working in a coffee shop and need to access company systems. What is the best approach?", a: ["Use public WiFi with no protection", "Use a trusted connection and approved VPN if required", "Ask the cafe for their admin password", "Turn off MFA to make it easier"], c: 1, why: "Remote access should use approved secure connection methods." },
  { topic: "REMOTE", q: "You are on a train and need to discuss a client issue on a call. What should you do?", a: ["Speak freely because nobody knows the client", "Avoid sensitive details until you are in a private place", "Use the client name but speak quietly", "Send the details to your personal phone"], c: 1, why: "Public spaces are not suitable for sensitive conversations." },
  { topic: "REMOTE", q: "Your home router still uses the default admin password. You regularly work from home. What should you do?", a: ["Leave it because it came from the provider", "Change the router admin password and use strong WiFi security", "Share the WiFi password publicly", "Disable updates"], c: 1, why: "Home networks can affect remote working security." },
  { topic: "DEVICES", q: "Your company laptop says updates are ready, but you are busy. What is the best response?", a: ["Postpone forever", "Install updates at the earliest safe opportunity", "Disable update alerts", "Ask a colleague to log in and do it"], c: 1, why: "Updates often fix known security weaknesses." },
  { topic: "DEVICES", q: "Your child asks to use your work laptop for homework because their device is charging. What should you do?", a: ["Allow it for a short time", "Create a separate folder for them", "Do not allow personal or family use of the company device", "Let them use it if WiFi is off"], c: 2, why: "Company devices should only be used for approved work purposes." },
  { topic: "DEVICES", q: "You lose your company phone while travelling. What should you do first?", a: ["Wait to see if it turns up", "Report it immediately through the correct channel", "Only change your social media passwords", "Buy a replacement before telling anyone"], c: 1, why: "Fast reporting helps the company lock, wipe or protect the device." },
  { topic: "SOFTWARE", q: "A free online tool can convert your client spreadsheet faster than approved software. What should you do?", a: ["Upload the file because it saves time", "Use it only once", "Check whether the tool is approved before uploading company data", "Remove the file name first and upload it"], c: 2, why: "Unapproved tools can expose company or client data." },
  { topic: "SOFTWARE", q: "You receive a browser prompt asking to install an extension to view a document. What is safest?", a: ["Install it quickly", "Check with IT or use approved software only", "Install it then remove it later", "Forward the document to personal email"], c: 1, why: "Browser extensions can access data and should be approved before use." },
  { topic: "SOFTWARE", q: "A colleague shares login details for a paid tool so the team can avoid buying more licences. What should you do?", a: ["Use the shared login", "Save it in your browser", "Refuse and ask for proper access", "Only use it outside work hours"], c: 2, why: "Shared accounts weaken accountability and can breach policy." },
  { topic: "INFRA", q: "You notice a network cabinet door left open in the office corridor. What should you do?", a: ["Ignore it because it is not your job", "Take a photo and post it in chat", "Report it to the right team immediately", "Move cables around to tidy it"], c: 2, why: "Physical access to infrastructure can create serious security risk." },
  { topic: "INFRA", q: "A contractor asks you to plug an unknown USB device into your company laptop to transfer a file. What should you do?", a: ["Plug it in but do not open files", "Ask them to email it to your personal account", "Use only approved transfer methods", "Scan it at home first"], c: 2, why: "Unknown removable media can introduce malware or data leakage risk." },
  { topic: "INFRA", q: "You accidentally send a sensitive file to the wrong person. What should you do?", a: ["Delete your sent email and hope it is fine", "Report it immediately and follow the incident process", "Ask the recipient nicely to ignore it", "Wait until someone complains"], c: 1, why: "Mistakes happen, but fast reporting limits harm and supports compliance." }
];

const el = id => document.getElementById(id);
const startScreen = el("startScreen");
const gameShell = el("gameShell");
const lockPanel = el("lockPanel");
const stageTitle = el("stageTitle");
const stageLesson = el("stageLesson");
const stageTrack = el("stageTrack");
const tag = el("tag");
const question = el("question");
const answers = el("answers");
const feedback = el("feedback");
const nextBtn = el("nextBtn");
const pointsBox = el("pointsBox");
const accuracyBox = el("accuracyBox");
const streakBox = el("streakBox");
const rankBox = el("rankBox");
const resultCard = el("resultCard");
const resultTitle = el("resultTitle");
const resultScore = el("resultScore");
const resultCopy = el("resultCopy");

let index = 0;
let correct = 0;
let wrong = 0;
let streak = 0;
let bestStreak = 0;
let answered = false;
let completed = false;
let startedAt = null;
let finalPayload = null;

if (!launchedFromPortal) {
  startScreen.classList.add("hidden");
  gameShell.style.display = "none";
  lockPanel.style.display = "block";
}

function stageIndex() {
  return Math.min(stages.length - 1, Math.floor(index / 3));
}

function points() {
  return (correct * 150) + (bestStreak * 75) - (wrong * 50);
}

function accuracy() {
  const done = correct + wrong;
  return done ? Math.round((correct / done) * 100) : 0;
}

function rank(score = points(), acc = accuracy()) {
  if (score >= 2200 && acc >= 90) return "WORKPLACE PRO";
  if (score >= 1700 && acc >= 80) return "DEFENDER";
  if (score >= 1200) return "WATCHFUL";
  return "TRAINEE";
}

function updateStage() {
  const idx = stageIndex();
  const stage = stages[idx];
  stageTitle.textContent = `STAGE ${idx + 1}: ${stage.name}`;
  stageLesson.textContent = stage.lesson;
  stageTrack.innerHTML = stages.map((s, i) => `<div class="stage-pill ${i === idx ? "active" : ""}">${s.name}</div>`).join("");
}

function updateStats() {
  const score = points();
  const acc = accuracy();
  pointsBox.textContent = score;
  accuracyBox.textContent = `${acc}%`;
  streakBox.textContent = streak;
  rankBox.textContent = rank(score, acc);
}

function startGame() {
  if (!launchedFromPortal) return;
  index = 0;
  correct = 0;
  wrong = 0;
  streak = 0;
  bestStreak = 0;
  answered = false;
  completed = false;
  finalPayload = null;
  startedAt = Date.now();
  startScreen.classList.add("hidden");
  resultCard.style.display = "none";
  renderQuestion();
}

function renderQuestion() {
  const item = questions[index];
  answered = false;
  tag.textContent = `${item.topic} · ${index + 1}/${questions.length}`;
  question.textContent = item.q;
  feedback.textContent = "";
  nextBtn.style.display = "none";
  answers.innerHTML = "";

  item.a.forEach((text, answerIndex) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(answerIndex));
    answers.appendChild(btn);
  });

  updateStage();
  updateStats();
}

function choose(answerIndex) {
  if (answered) return;
  answered = true;

  const item = questions[index];
  const isCorrect = answerIndex === item.c;

  if (isCorrect) {
    correct += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
  } else {
    wrong += 1;
    streak = 0;
  }

  Array.from(answers.children).forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === item.c) btn.classList.add("correct");
    else if (i === answerIndex) btn.classList.add("wrong");
  });

  if (window.sccyberWorkplaceDefenderFlash) {
    window.sccyberWorkplaceDefenderFlash(isCorrect ? "correct" : "wrong");
  }

  feedback.innerHTML = `${isCorrect ? "Correct." : "Not quite."}<span class="why">Why this matters: ${item.why}</span>`;
  updateStats();

  if (index >= questions.length - 1) {
    nextBtn.style.display = "none";
    setTimeout(finishGame, 1200);
    return;
  }

  nextBtn.textContent = "NEXT QUESTION";
  nextBtn.style.display = "block";
}

function finishGame() {
  completed = true;
  const acc = Math.round((correct / questions.length) * 100);
  const passed = acc >= 80;
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const finalPoints = points();
  const finalRank = rank(finalPoints, acc);

  finalPayload = {
    type: "SCCYBER_GAME_ATTEMPT",
    game: "workplace-defender",
    score: finalPoints,
    totalQuestions: questions.length,
    correct,
    wrong,
    answered: questions.length,
    accuracy: acc,
    durationSeconds,
    completed: true,
    passed,
    createdAt: new Date().toISOString()
  };

  resultTitle.textContent = passed ? "WORKPLACE SECURED" : "RISK EXPOSED";
  resultScore.textContent = `${acc}% · ${finalPoints} POINTS · ${finalRank}`;
  resultCopy.textContent = passed ? "Good work. You made strong workplace security decisions." : "You need 80% to pass. Review the weak points and try again.";
  resultCard.style.display = "block";
  postAttempt();

  if (window.sccyberWorkplaceDefenderResultScreen) {
    setTimeout(() => window.sccyberWorkplaceDefenderResultScreen(passed, acc, finalPoints, finalRank), 350);
  }
}

function postAttempt() {
  if (!completed || !finalPayload) return;
  window.parent.postMessage(finalPayload, "*");
}

nextBtn.addEventListener("click", () => {
  index += 1;
  renderQuestion();
});

el("playNowBtn").addEventListener("click", startGame);

window.addEventListener("message", event => {
  const data = event.data || {};
  if (data.type === "SCCYBER_REQUEST_ATTEMPT") postAttempt();
});