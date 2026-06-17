const games = [
  { key: "breach-lockdown", name: "Breach Lockdown" },
  { key: "brute-force-lockdown", name: "Brute Force Lockdown" },
  { key: "phishing-frenzy", name: "Phishing Frenzy" }
];

const storageKey = "sccyberPortalProfile";
let currentGameKey = null;

const loginPanel = document.getElementById("loginPanel");
const learnerPanel = document.getElementById("learnerPanel");
const learnerName = document.getElementById("learnerName");
const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("resetBtn");
const learnerDisplay = document.getElementById("learnerDisplay");
const overallScore = document.getElementById("overallScore");
const gamesCompleted = document.getElementById("gamesCompleted");
const currentRank = document.getElementById("currentRank");
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

function isFullName(name){
  return name.trim().split(/\s+/).length >= 2;
}

function createProfile(name){
  const parts = name.trim().split(/\s+/);
  return {
    name: name.trim(),
    firstName: parts[0],
    surname: parts.slice(1).join(" "),
    scores: {},
    attempts: [],
    createdAt: new Date().toISOString()
  };
}

function getRank(avg){
  if(avg >= 4000) return "CISO";
  if(avg >= 3000) return "SOC LEAD";
  if(avg >= 2200) return "SENIOR ENGINEER";
  if(avg >= 1500) return "ENGINEER";
  if(avg >= 900) return "ANALYST";
  if(avg >= 400) return "TRAINEE";
  return "INTERN";
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

function addAttemptPayload(data){
  let profile = loadProfile();
  if(!profile || !isFullName(profile.name || "")) return;

  const game = data.game || currentGameKey;
  const score = Number(data.score || 0);
  if(!game) return;

  const attempt = {
    learnerName: profile.name,
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

  if(!profile || !isFullName(profile.name || "")){
    loginPanel.classList.remove("hidden");
    learnerPanel.classList.add("hidden");
    overallScore.textContent = "--";
    gamesCompleted.textContent = "0 / 3";
    currentRank.textContent = "ENTER FULL NAME";
    games.forEach(game => {
      const el = document.getElementById(`score-${game.key}`);
      if(el) el.textContent = "Login required";
    });
    return;
  }

  loginPanel.classList.add("hidden");
  learnerPanel.classList.remove("hidden");
  learnerDisplay.textContent = profile.name;

  const completedGames = games.filter(game => attemptsFor(profile, game.key).length > 0);
  const bestScores = completedGames.map(game => bestScore(attemptsFor(profile, game.key)));
  const completed = completedGames.length;
  const average = completed ? Math.round(bestScores.reduce((a,b) => a + b, 0) / completed) : 0;

  overallScore.textContent = completed ? average : "--";
  gamesCompleted.textContent = `${completed} / ${games.length}`;
  currentRank.textContent = completed ? getRank(average) : "START TRAINING";

  games.forEach(game => {
    const el = document.getElementById(`score-${game.key}`);
    const gameAttempts = attemptsFor(profile, game.key);
    if(!el) return;
    if(!gameAttempts.length){
      el.textContent = "No attempts yet";
      return;
    }
    el.innerHTML = `Best: ${bestScore(gameAttempts)}<br>Latest: ${latestScore(gameAttempts)}<br>Attempts: ${gameAttempts.length}<br>Average: ${averageScore(gameAttempts)}`;
  });
}

function openGame(title, url, gameKey){
  const profile = loadProfile();
  if(!profile || !isFullName(profile.name || "")){
    alert("Enter your first name and surname before starting a game.");
    learnerName.focus();
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
  const name = learnerName.value.trim();
  if(!isFullName(name)){
    alert("Please enter your first name and surname.");
    return;
  }
  saveProfile(createProfile(name));
  updateDashboard();
});

resetBtn.addEventListener("click", () => {
  if(confirm("Reset this learner profile and all local scores?")){
    localStorage.removeItem(storageKey);
    updateDashboard();
  }
});

backBtn.addEventListener("click", requestAttemptAndClose);
document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => openGame(btn.dataset.title, btn.dataset.url, btn.closest(".game-card").dataset.game));
});

updateDashboard();