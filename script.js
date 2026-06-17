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
  return JSON.parse(localStorage.getItem(storageKey) || "null");
}

function saveProfile(profile){
  localStorage.setItem(storageKey, JSON.stringify(profile));
}

function createProfile(name){
  return { name, scores: {}, createdAt: new Date().toISOString() };
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
      if(el) el.textContent = "No score yet";
    });
    return;
  }

  loginPanel.classList.add("hidden");
  learnerPanel.classList.remove("hidden");
  learnerDisplay.textContent = profile.name;

  const scoreValues = games.map(game => Number(profile.scores[game.key] || 0)).filter(score => score > 0);
  const completed = scoreValues.length;
  const average = completed ? Math.round(scoreValues.reduce((a,b) => a + b, 0) / completed) : 0;

  overallScore.textContent = completed ? average : "--";
  gamesCompleted.textContent = `${completed} / ${games.length}`;
  currentRank.textContent = completed ? getRank(average) : "START TRAINING";

  games.forEach(game => {
    const el = document.getElementById(`score-${game.key}`);
    const score = profile.scores[game.key];
    if(el) el.textContent = score ? `Best score: ${score}` : "No score yet";
  });
}

function saveManualScore(){
  const profile = loadProfile();
  if(!profile){ alert("Create a learner profile first."); return; }
  const game = manualGame.value;
  const score = Number(manualScore.value);
  if(!score || score < 0){ alert("Enter a valid score."); return; }
  const existing = Number(profile.scores[game] || 0);
  profile.scores[game] = Math.max(existing, score);
  saveProfile(profile);
  manualScore.value = "";
  updateDashboard();
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
  let profile = loadProfile();
  if(!profile) profile = createProfile("Guest Learner");
  const existing = Number(profile.scores[game] || 0);
  profile.scores[game] = Math.max(existing, score);
  saveProfile(profile);
  window.history.replaceState({}, document.title, window.location.pathname);
}

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