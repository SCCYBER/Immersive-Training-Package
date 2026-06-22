const launchedFromPortal = window.top !== window.self || new URLSearchParams(location.search).get("portal") === "1";

const stages = [
  { name: "CREATE", lesson: "Use long, unique and hard to guess passwords." },
  { name: "PROTECT", lesson: "Use MFA and a trusted manager to reduce risk." },
  { name: "VERIFY", lesson: "Check login pages before entering details." },
  { name: "RECOVER", lesson: "Act quickly if you think an account is exposed." }
];

const questions = [
  { topic: "CREATE", q: "You need a new work password. Which one is safest?", a: ["Summer2026", "Sccyber123", "Blue!Train7Coffee!Moon", "Password1"], c: 2, why: "Length and uniqueness make guessing much harder." },
  { topic: "REUSE", q: "You used the same password on two services. What should you do?", a: ["Keep it", "Change only one", "Use different passwords for each account", "Write it down anywhere"], c: 2, why: "If one service is breached, reused passwords put other accounts at risk." },
  { topic: "MFA", q: "A service offers multi factor authentication. What is best?", a: ["Turn it on", "Ignore it", "Only use it for banking", "Share the code"], c: 0, why: "MFA adds protection if a password is stolen." },
  { topic: "MANAGER", q: "You have too many passwords to remember. What should you use?", a: ["A note in your browser", "One password everywhere", "A trusted password manager", "A shared spreadsheet"], c: 2, why: "A password manager helps create and store unique passwords safely." },
  { topic: "SHARING", q: "A colleague asks for your login. What should you do?", a: ["Share it once", "Send it in chat", "Say no and ask them to use their own access", "Change it later"], c: 2, why: "Shared accounts remove accountability and increase risk." },
  { topic: "VERIFY", q: "An unexpected email links to a login page. What is safest?", a: ["Login quickly", "Open the site manually from a trusted address", "Forward your password", "Try another browser"], c: 1, why: "Going direct to the trusted site reduces phishing risk." },
  { topic: "RESET", q: "You think an account password has been exposed. What should you do first?", a: ["Wait", "Change it and check MFA", "Tell friends", "Delete the app only"], c: 1, why: "Fast action limits damage." },
  { topic: "DEVICE", q: "You are using a shared computer. What should you avoid?", a: ["Logging out", "Saving the password in the browser", "Using MFA", "Checking the URL"], c: 1, why: "Shared devices should not store your passwords." }
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
const leaderboardList = el("leaderboardList");

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
  return Math.min(stages.length - 1, Math.floor(index / 2));
}

function points() {
  return (correct * 150) + (bestStreak * 75) - (wrong * 50);
}

function accuracy() {
  const done = correct + wrong;
  return done ? Math.round((correct / done) * 100) : 0;
}

function rank(score = points(), acc = accuracy()) {
  if (score >= 1200 && acc >= 90) return "SHIELD PRO";
  if (score >= 900 && acc >= 80) return "GUARDIAN";
  if (score >= 650) return "DEFENDER";
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
  tag.textContent = item.topic;
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

  feedback.innerHTML = `${isCorrect ? "Correct." : "Not quite."}<span class="why">Why this matters: ${item.why}</span>`;
  nextBtn.textContent = index === questions.length - 1 ? "FINISH" : "NEXT QUESTION";
  nextBtn.style.display = "block";
  updateStats();
}

function saveLeaderboard(payload) {
  const board = JSON.parse(localStorage.getItem("sccyberPasswordShieldLeaderboard") || "[]");
  board.push({ points: payload.score, rank: rank(payload.score, payload.accuracy), accuracy: payload.accuracy, time: payload.durationSeconds });
  board.sort((a, b) => b.points - a.points);
  localStorage.setItem("sccyberPasswordShieldLeaderboard", JSON.stringify(board.slice(0, 10)));
  loadLeaderboard();
}

function loadLeaderboard() {
  const board = JSON.parse(localStorage.getItem("sccyberPasswordShieldLeaderboard") || "[]");
  leaderboardList.innerHTML = board.length ? board.slice(0, 5).map((row, i) => `${i + 1}. ${row.points} · ${row.rank} · ${row.accuracy}% · ${row.time}s`).join("<br>") : "No scores yet.";
}

function finishGame() {
  completed = true;
  const acc = Math.round((correct / questions.length) * 100);
  const passed = acc >= 80;
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const finalPoints = points();

  finalPayload = {
    type: "SCCYBER_GAME_ATTEMPT",
    game: "password-shield",
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

  resultTitle.textContent = passed ? "SHIELD UP" : "TRY AGAIN";
  resultScore.textContent = `${acc}% · ${finalPoints} POINTS · ${rank(finalPoints, acc)}`;
  resultCopy.textContent = passed ? "Good work. You showed safe password habits." : "You need 80% to pass. Review the weak points and try again.";
  resultCard.style.display = "block";
  saveLeaderboard(finalPayload);
  postAttempt();
}

function postAttempt() {
  if (!completed || !finalPayload) return;
  window.parent.postMessage(finalPayload, "*");
}

nextBtn.addEventListener("click", () => {
  if (index >= questions.length - 1) finishGame();
  else {
    index += 1;
    renderQuestion();
  }
});

el("playNowBtn").addEventListener("click", startGame);
el("playAgainBtn").addEventListener("click", startGame);
el("dashboardBtn").addEventListener("click", () => {
  postAttempt();
  window.parent.postMessage({ type: "SCCYBER_RETURN_TO_DASHBOARD" }, "*");
});

window.addEventListener("message", event => {
  const data = event.data || {};
  if (data.type === "SCCYBER_REQUEST_ATTEMPT") postAttempt();
});

loadLeaderboard();