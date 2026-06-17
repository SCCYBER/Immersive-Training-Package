const games = [
  { key: "breach-lockdown", name: "Breach Lockdown" },
  { key: "brute-force-lockdown", name: "Brute Force Lockdown" },
  { key: "phishing-frenzy", name: "Phishing Frenzy" }
];

const storageKey = "sccyberPortalProfile";

const loginPanel = document.getElementById("loginPanel");
const learnerPanel = document.getElementById("learnerPanel");
const learnerName = document.getElementById("learnerName");
const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("resetBtn");
const learnerDisplay = document.getElementById("learnerDisplay");
const overallScore = document.getElementById("overallScore");
const gamesCompleted = document.getElementById("gamesCompleted");
const currentRank = document.getElementById("currentRank");
const manualGame = document.getElementById("manualGame");
const manualScore = document.getElementById("manualScore");
const saveScoreBtn = document.getElementById("saveScoreBtn");
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

function createProfile(name){
  return { name, scores: {}, attempts: [], createdAt: new Date().toISOString() };
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

function addAttempt(game, score, source = "manual"){
  let profile = loadProfile();
  if(!profile) profile = createProfile("Guest Learner");

  const attempt = {
    game,
    score: Number(score),
    source,
    completed: true,
    createdAt: new Date().toISOString()
  };

  profile.attempts.push(attempt);
  const gameAttempts = attemptsFor(profile, game);
  profile.scores[game] = bestScore(gameAttempts);
  saveProfile(profile);
  updateDashboard();
}

function updateDashboard(){
  const profile = loadProfile();

  if(!profile){
    loginPanel.classList.remove("hidden");
    learnerPanel.classList.add("hidden");
    overallScore.textContent = "--";
    gamesCompleted.textContent = "0 / 3";
    currentRank.textContent = "START TRAINING";
    games.forEach(game => {
      const el = document.getElementById(`score-${game.key}`);
      if(el) el.textContent = "No attempts yet";
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

function saveManualScore(){
  const profile = loadProfile();
  if(!profile){ alert("Create a learner profile first."); return; }
  const game = manualGame.value;
  const score = Number(manualScore.value);
  if(!score || score < 0){ alert("Enter a valid score."); return; }
  addAttempt(game, score, "manual");
  manualScore.value = "";
}

function openGame(title, url){
  activeGameTitle.textContent = title;
  gameFrame.src = url;
  dashboardView.classList.add("hidden");
  gameView.classList.remove("hidden");
  window.scrollTo(0,0);
}

function closeGame(){
  gameFrame.src = "";
  gameView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  updateDashboard();
  window.scrollTo(0,0);
}

function receiveScoreFromUrl(){
  const params = new URLSearchParams(window.location.search);
  const game = params.get("game");
  const score = Number(params.get("score"));
  if(!game || !score) return;
  addAttempt(game, score, "url");
  window.history.replaceState({}, document.title, window.location.pathname);
}

window.addEventListener("message", (event) => {
  const data = event.data || {};
  if(data.type === "SCCYBER_GAME_ATTEMPT" && data.game && data.score){
    addAttempt(data.game, Number(data.score), "game");
  }
  if(data.type === "SCCYBER_RETURN_TO_DASHBOARD"){
    closeGame();
  }
});

loginBtn.addEventListener("click", () => {
  const name = learnerName.value.trim();
  if(!name){ alert("Enter a learner name."); return; }
  saveProfile(createProfile(name));
  updateDashboard();
});

resetBtn.addEventListener("click", () => {
  if(confirm("Reset this learner profile and all local scores?")){
    localStorage.removeItem(storageKey);
    updateDashboard();
  }
});

saveScoreBtn.addEventListener("click", saveManualScore);
backBtn.addEventListener("click", closeGame);
document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", () => openGame(btn.dataset.title, btn.dataset.url));
});

receiveScoreFromUrl();
updateDashboard();