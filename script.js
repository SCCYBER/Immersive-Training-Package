const games = [
  { key: "breach-lockdown", name: "Breach Lockdown" },
  { key: "brute-force-lockdown", name: "Brute Force Lockdown" },
  { key: "phishing-frenzy", name: "Phishing Frenzy" }
];

const storageKey = "sccyberPortalProfile";
const PASS_MARK = 80;
let currentGameKey = null;

const loginPanel = document.getElementById("loginPanel");
const learnerPanel = document.getElementById("learnerPanel");
const firstNameInput = document.getElementById("firstName");
const surnameInput = document.getElementById("surname");
const departmentRoleInput = document.getElementById("departmentRole");
const loginBtn = document.getElementById("loginBtn");
const learnerDisplay = document.getElementById("learnerDisplay");
const departmentDisplay = document.getElementById("departmentDisplay");
const overallScore = document.getElementById("overallScore");
const gamesCompleted = document.getElementById("gamesCompleted");
const trainingStatus = document.getElementById("trainingStatus");
const dashboardView = document.getElementById("dashboardView");
const gameView = document.getElementById("gameView");
const gameFrame = document.getElementById("gameFrame");
const activeGameTitle = document.getElementById("activeGameTitle");
const backBtn = document.getElementById("backBtn");

function loadProfile(){
  const profile = JSON.parse(localStorage.getItem(storageKey) || "null");
  if(profile && !profile.attempts) profile.attempts = [];
  return profile;
}

function saveProfile(profile){
  if(!profile.attempts) profile.attempts = [];
  localStorage.setItem(storageKey, JSON.stringify(profile));
}

function validProfile(profile){
  return !!(profile && profile.firstName && profile.firstName.trim() && profile.surname && profile.surname.trim() && profile.departmentRole && profile.departmentRole.trim());
}

function createProfile(firstName, surname, departmentRole){
  return {
    firstName: firstName.trim(),
    surname: surname.trim(),
    departmentRole: departmentRole.trim(),
    name: `${firstName.trim()} ${surname.trim()}`,
    scores: {},
    attempts: [],
    createdAt: new Date().toISOString()
  };
}

function attemptsFor(profile, gameKey){
  return (profile.attempts || []).filter(a => a.game === gameKey);
}

function bestScore(attempts){
  return attempts.length ? Math.max(...attempts.map(a => Number(a.score || 0))) : 0;
}

function latestScore(attempts){
  return attempts.length ? Number(attempts[attempts.length - 1].score || 0) : 0;
}

function averageScore(attempts){
  return attempts.length ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / attempts.length) : 0;
}

function attemptAccuracy(attempt){
  if(attempt.accuracy !== null && attempt.accuracy !== undefined && !Number.isNaN(Number(attempt.accuracy))){
    return Number(attempt.accuracy);
  }
  if(attempt.answered && attempt.correct !== null && attempt.correct !== undefined){
    return Math.round((Number(attempt.correct) / Number(attempt.answered)) * 100);
  }
  return 0;
}

function bestAccuracy(attempts){
  return attempts.length ? Math.max(...attempts.map(attemptAccuracy)) : 0;
}

function latestAccuracy(attempts){
  return attempts.length ? attemptAccuracy(attempts[attempts.length - 1]) : 0;
}

function averageAccuracy(attempts){
  return attempts.length ? Math.round(attempts.reduce((sum, a) => sum + attemptAccuracy(a), 0) / attempts.length) : 0;
}

function trainingGrade(averagePercent){
  return averagePercent >= PASS_MARK ? "PASS" : "FAIL";
}

function addAttemptPayload(data){
  let profile = loadProfile();
  if(!validProfile(profile)) return;

  const game = data.game || currentGameKey;
  const score = Number(data.score || 0);
  if(!game) return;

  const attempt = {
    firstName: profile.firstName,
    surname: profile.surname,
    learnerName: profile.name,
    departmentRole: profile.departmentRole,
    game,
    score,
    source: data.source || "game",
    totalQuestions: data.totalQuestions || null,
    correct: data.correct || null,
    wrong: data.wrong || null,
    answered: data.answered || null,
    accuracy: data.accuracy || null,
    durationSeconds: data.durationSeconds || null,
    completed: data.completed === false ? false : true,
    passed: data.passed || false,
    role: data.role || null,
    threatsStopped: data.threatsStopped || null,
    biggestWeakness: data.biggestWeakness || null,
    createdAt: data.createdAt || new Date().toISOString()
  };

  const duplicate = profile.attempts.some(a =>
    a.game === attempt.game &&
    a.score === attempt.score &&
    a.answered === attempt.answered &&
    Math.abs(new Date(a.createdAt).getTime() - new Date(attempt.createdAt).getTime()) < 1500
  );

  if(duplicate) return;

  profile.attempts.push(attempt);
  const gameAttempts = attemptsFor(profile, game);
  profile.scores[game] = bestScore(gameAttempts);
  saveProfile(profile);
  updateDashboard();
}

function updateDashboard(){
  const profile = loadProfile();

  if(!validProfile(profile)){
    loginPanel.classList.remove("hidden");
    learnerPanel.classList.add("hidden");
    overallScore.textContent = "--";
    gamesCompleted.textContent = "0 / 3";
    trainingStatus.textContent = "ENTER PROFILE";
    games.forEach(game => {
      const el = document.getElementById(`score-${game.key}`);
      if(el) el.textContent = "Profile required";
    });
    return;
  }

  loginPanel.classList.add("hidden");
  learnerPanel.classList.remove("hidden");
  learnerDisplay.textContent = profile.name;
  departmentDisplay.textContent = profile.departmentRole;

  const completedGames = games.filter(game => attemptsFor(profile, game.key).length > 0);
  const bestAccuracies = completedGames.map(game => bestAccuracy(attemptsFor(profile, game.key)));
  const completed = completedGames.length;
  const averagePercent = completed ? Math.round(bestAccuracies.reduce((a,b) => a + b, 0) / completed) : 0;

  overallScore.textContent = completed ? `${averagePercent}%` : "--";
  gamesCompleted.textContent = `${completed} / ${games.length}`;
  trainingStatus.textContent = completed ? trainingGrade(averagePercent) : "START TRAINING";

  games.forEach(game => {
    const el = document.getElementById(`score-${game.key}`);
    const gameAttempts = attemptsFor(profile, game.key);
    if(!el) return;
    if(!gameAttempts.length){
      el.textContent = "No attempts yet";
      return;
    }
    const latestPercent = latestAccuracy(gameAttempts);
    const bestPercent = bestAccuracy(gameAttempts);
    const gameAverage = averageAccuracy(gameAttempts);
    el.innerHTML = `Best: ${bestPercent}%<br>Latest: ${latestPercent}%<br>Attempts: ${gameAttempts.length}<br>Average: ${gameAverage}%`;
  });
}

function openGame(title, url, gameKey){
  const profile = loadProfile();
  if(!validProfile(profile)){
    alert("Enter your first name, surname and department/role before starting a game.");
    firstNameInput.focus();
    return;
  }

  currentGameKey = gameKey;
  activeGameTitle.textContent = title;
  gameFrame.src = url;
  dashboardView.classList.add("hidden");
  gameView.classList.remove("hidden");
  window.scrollTo(0,0);
}

function closeGame(){
  gameFrame.src = "";
  currentGameKey = null;
  gameView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  updateDashboard();
  window.scrollTo(0,0);
}

function requestAttemptAndClose(){
  try {
    gameFrame.contentWindow.postMessage({ type: "SCCYBER_REQUEST_ATTEMPT" }, "*");
  } catch(e) {}
  setTimeout(closeGame, 650);
}

window.addEventListener("message", (event) => {
  const data = event.data || {};
  if(data.type === "SCCYBER_GAME_ATTEMPT"){
    addAttemptPayload(data);
  }
  if(data.type === "SCCYBER_RETURN_TO_DASHBOARD"){
    requestAttemptAndClose();
  }
});

loginBtn.addEventListener("click", () => {
  const firstName = firstNameInput.value.trim();
  const surname = surnameInput.value.trim();
  const departmentRole = departmentRoleInput.value.trim();

  if(!firstName || !surname || !departmentRole){
    alert("Please enter first name, surname and department/role.");
    return;
  }

  saveProfile(createProfile(firstName, surname, departmentRole));
  updateDashboard();
});

backBtn.addEventListener("click", requestAttemptAndClose);
document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => openGame(btn.dataset.title, btn.dataset.url, btn.closest(".game-card").dataset.game));
});

updateDashboard();