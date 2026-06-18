const games=[{key:"breach-lockdown",name:"Breach Lockdown",tier:"Easy",focus:"Cyber awareness"},{key:"brute-force-lockdown",name:"Brute Force Lockdown",tier:"Advanced",focus:"Incident response"},{key:"phishing-frenzy",name:"Phishing Frenzy",tier:"Intermediate",focus:"Phishing detection"}];
const storageKey="sccyberPortalProfile";
const PASS_MARK=80;
let currentGameKey=null;
let supabaseClient=null;

const authView=document.getElementById("authView");
const usernameInput=document.getElementById("usernameInput");
const passwordInput=document.getElementById("passwordInput");
const credentialLoginBtn=document.getElementById("credentialLoginBtn");
const demoModeBtn=document.getElementById("demoModeBtn");
const authMessage=document.getElementById("authMessage");
const loginPanel=document.getElementById("loginPanel");
const learnerPanel=document.getElementById("learnerPanel");
const firstNameInput=document.getElementById("firstName");
const surnameInput=document.getElementById("surname");
const departmentRoleInput=document.getElementById("departmentRole");
const loginBtn=document.getElementById("loginBtn");
const learnerDisplay=document.getElementById("learnerDisplay");
const departmentDisplay=document.getElementById("departmentDisplay");
const overallScore=document.getElementById("overallScore");
const gamesCompleted=document.getElementById("gamesCompleted");
const trainingStatus=document.getElementById("trainingStatus");
const reportBadge=document.getElementById("reportBadge");
const reportProgress=document.getElementById("reportProgress");
const reportAttempts=document.getElementById("reportAttempts");
const reportOutput=document.getElementById("reportOutput");
const dashboardView=document.getElementById("dashboardView");
const reportView=document.getElementById("reportView");
const viewReportBtn=document.getElementById("viewReportBtn");
const reportBackBtn=document.getElementById("reportBackBtn");
const gameView=document.getElementById("gameView");
const gameFrame=document.getElementById("gameFrame");
const activeGameTitle=document.getElementById("activeGameTitle");
const backBtn=document.getElementById("backBtn");

function initSupabase(){
  const url=window.SCCYBER_SUPABASE_URL;
  const key=window.SCCYBER_SUPABASE_ANON_KEY;
  if(!url||!key||url.includes("PASTE_")||key.includes("PASTE_")){
    authMessage.textContent="Supabase not connected yet. Use Demo Mode for local testing.";
    return;
  }
  supabaseClient=window.supabase.createClient(url,key);
  authMessage.textContent="Supabase ready. Enter learner credentials.";
}

function usernameToEmail(username){
  const clean=username.trim().toLowerCase();
  return clean.includes("@")?clean:`${clean}@sccyber.training`;
}

function showDashboard(){authView.classList.add("hidden");dashboardView.classList.remove("hidden");reportView.classList.add("hidden");gameView.classList.add("hidden");updateDashboard();}

async function credentialLogin(){
  const username=usernameInput.value.trim();
  const password=passwordInput.value;
  if(!username||!password){authMessage.textContent="Enter username and password.";return;}
  if(!supabaseClient){authMessage.textContent="Supabase is not connected yet. Add the project URL and anon key.";return;}
  authMessage.textContent="Checking credentials...";
  const email=usernameToEmail(username);
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){authMessage.textContent="Login failed. Check username and password.";return;}
  const user=data.user;
  let profile=null;
  const {data:profileData}=await supabaseClient.from("profiles").select("first_name,surname,department_role,username").eq("id",user.id).single();
  if(profileData){profile=createProfile(profileData.first_name,profileData.surname,profileData.department_role);profile.username=profileData.username||username;profile.supabaseUserId=user.id;}
  else{profile=createProfile(username,"Learner","Unassigned");profile.username=username;profile.supabaseUserId=user.id;}
  saveProfile(profile);
  showDashboard();
}

function demoMode(){
  authMessage.textContent="Demo mode active. Scores are stored on this device only.";
  saveProfile(createProfile("Demo","Learner","Demo"));
  showDashboard();
}

function loadProfile(){const p=JSON.parse(localStorage.getItem(storageKey)||"null");if(p&&!p.attempts)p.attempts=[];return p;}
function saveProfile(p){if(!p.attempts)p.attempts=[];localStorage.setItem(storageKey,JSON.stringify(p));}
function validProfile(p){return !!(p&&p.firstName&&p.firstName.trim()&&p.surname&&p.surname.trim()&&p.departmentRole&&p.departmentRole.trim());}
function createProfile(firstName,surname,departmentRole){return{firstName:firstName.trim(),surname:surname.trim(),departmentRole:departmentRole.trim(),name:`${firstName.trim()} ${surname.trim()}`,scores:{},attempts:[],createdAt:new Date().toISOString()};}
function attemptsFor(p,gameKey){return(p.attempts||[]).filter(a=>a.game===gameKey);}
function bestScore(attempts){return attempts.length?Math.max(...attempts.map(a=>Number(a.score||0))):0;}
function attemptAccuracy(a){if(a.accuracy!==null&&a.accuracy!==undefined&&!Number.isNaN(Number(a.accuracy)))return Number(a.accuracy);if(a.answered&&a.correct!==null&&a.correct!==undefined)return Math.round((Number(a.correct)/Number(a.answered))*100);return 0;}
function bestAccuracy(attempts){return attempts.length?Math.max(...attempts.map(attemptAccuracy)):0;}
function latestAccuracy(attempts){return attempts.length?attemptAccuracy(attempts[attempts.length-1]):0;}
function averageAccuracy(attempts){return attempts.length?Math.round(attempts.reduce((s,a)=>s+attemptAccuracy(a),0)/attempts.length):0;}
function trainingGrade(avg,completed){if(completed<games.length)return"IN PROGRESS";return avg>=PASS_MARK?"PASS":"FAIL";}

async function saveAttemptToSupabase(attempt){
  const profile=loadProfile();
  if(!supabaseClient||!profile||!profile.supabaseUserId)return;
  await supabaseClient.from("attempts").insert({user_id:profile.supabaseUserId,game:attempt.game,score:attempt.score,accuracy:attempt.accuracy,correct_count:attempt.correct,wrong_count:attempt.wrong,answered:attempt.answered,duration_seconds:attempt.durationSeconds,passed:attempt.passed,created_at:attempt.createdAt});
}

function addAttemptPayload(data){
  let profile=loadProfile();
  if(!validProfile(profile))return;
  const game=data.game||currentGameKey;
  const score=Number(data.score||0);
  if(!game)return;
  const attempt={firstName:profile.firstName,surname:profile.surname,learnerName:profile.name,departmentRole:profile.departmentRole,game,score,source:data.source||"game",totalQuestions:data.totalQuestions||null,correct:data.correct||null,wrong:data.wrong||null,answered:data.answered||null,accuracy:data.accuracy||null,durationSeconds:data.durationSeconds||null,completed:data.completed===false?false:true,passed:data.passed||false,role:data.role||null,threatsStopped:data.threatsStopped||null,biggestWeakness:data.biggestWeakness||null,createdAt:data.createdAt||new Date().toISOString()};
  const dupe=profile.attempts.some(a=>a.game===attempt.game&&a.score===attempt.score&&a.answered===attempt.answered&&Math.abs(new Date(a.createdAt).getTime()-new Date(attempt.createdAt).getTime())<1500);
  if(dupe)return;
  profile.attempts.push(attempt);
  profile.scores[game]=bestScore(attemptsFor(profile,game));
  saveProfile(profile);
  saveAttemptToSupabase(attempt);
  updateDashboard();
}

function calculateSummary(profile){const completedGames=games.filter(g=>attemptsFor(profile,g.key).length>0);const completed=completedGames.length;const bestAccuracies=completedGames.map(g=>bestAccuracy(attemptsFor(profile,g.key)));const avg=completed?Math.round(bestAccuracies.reduce((a,b)=>a+b,0)/completed):0;return{completed,avg,totalAttempts:(profile.attempts||[]).length,status:completed?trainingGrade(avg,completed):"START TRAINING"};}
function updateReport(profile,summary){if(!validProfile(profile)){reportBadge.textContent="AWAITING PROFILE";reportProgress.textContent=`0 / ${games.length}`;reportAttempts.textContent="0";reportOutput.textContent="Enter learner details to start generating report data.";return;}reportProgress.textContent=`${summary.completed} / ${games.length}`;reportAttempts.textContent=summary.totalAttempts;reportBadge.textContent=summary.status;if(summary.totalAttempts===0){reportOutput.innerHTML="Complete at least one module to generate report data.";return;}const lines=games.map(g=>{const attempts=attemptsFor(profile,g.key);if(!attempts.length)return `<div class="report-line"><strong>${g.name}</strong><span>${g.tier}</span><span>Not started</span><span>Attempts: 0</span></div>`;return `<div class="report-line"><strong>${g.name}</strong><span>${g.tier}</span><span>Best ${bestAccuracy(attempts)}% | Latest ${latestAccuracy(attempts)}% | Avg ${averageAccuracy(attempts)}%</span><span>Attempts: ${attempts.length}</span></div>`;}).join("");const weakGames=games.filter(g=>attemptsFor(profile,g.key).length&&bestAccuracy(attemptsFor(profile,g.key))<PASS_MARK).map(g=>g.name);const missingGames=games.filter(g=>!attemptsFor(profile,g.key).length).map(g=>g.name);let recommendation="Keep completing modules. Final PASS / FAIL appears when all modules are complete.";if(missingGames.length)recommendation=`Next: complete ${missingGames[0]}.`;if(summary.completed===games.length&&summary.avg>=PASS_MARK)recommendation="Passed. Training standard met.";if(summary.completed===games.length&&summary.avg<PASS_MARK)recommendation=`Retake: ${weakGames[0]||"lowest scoring module"}. Overall average must reach 80%.`;reportOutput.innerHTML=`<div class="report-section"><div class="report-section-title">Learner</div><p>${profile.name} · ${profile.departmentRole}</p></div><div class="report-section"><div class="report-section-title">Module Breakdown</div>${lines}</div><div class="report-section"><div class="report-section-title">Recommendation</div><p>${recommendation}</p></div>`;}
function updateDashboard(){const profile=loadProfile();if(!validProfile(profile)){loginPanel.classList.remove("hidden");learnerPanel.classList.add("hidden");overallScore.textContent="--";gamesCompleted.textContent=`0 / ${games.length}`;trainingStatus.textContent="ENTER PROFILE";games.forEach(g=>{const el=document.getElementById(`score-${g.key}`);if(el)el.textContent="Profile required";});updateReport(profile,{completed:0,avg:0,totalAttempts:0,status:"ENTER PROFILE"});return;}loginPanel.classList.add("hidden");learnerPanel.classList.remove("hidden");learnerDisplay.textContent=profile.name;departmentDisplay.textContent=profile.departmentRole;const summary=calculateSummary(profile);overallScore.textContent=summary.completed?`${summary.avg}%`:"--";gamesCompleted.textContent=`${summary.completed} / ${games.length}`;trainingStatus.textContent=summary.completed?summary.status:"START TRAINING";games.forEach(g=>{const el=document.getElementById(`score-${g.key}`);const attempts=attemptsFor(profile,g.key);if(!el)return;if(!attempts.length){el.textContent="No attempts yet";return;}el.innerHTML=`Best: ${bestAccuracy(attempts)}%<br>Latest: ${latestAccuracy(attempts)}%<br>Attempts: ${attempts.length}<br>Average: ${averageAccuracy(attempts)}%`;});updateReport(profile,summary);}
function openReport(){const profile=loadProfile();if(!validProfile(profile)){alert("Enter your learner profile before viewing the report.");firstNameInput.focus();return;}updateDashboard();dashboardView.classList.add("hidden");gameView.classList.add("hidden");reportView.classList.remove("hidden");window.scrollTo(0,0);}
function closeReport(){reportView.classList.add("hidden");dashboardView.classList.remove("hidden");updateDashboard();window.scrollTo(0,0);}
function openGame(title,url,gameKey){const profile=loadProfile();if(!validProfile(profile)){alert("Enter your first name, surname and department/role before starting a game.");firstNameInput.focus();return;}currentGameKey=gameKey;activeGameTitle.textContent=title;gameFrame.src=url;dashboardView.classList.add("hidden");reportView.classList.add("hidden");gameView.classList.remove("hidden");window.scrollTo(0,0);}
function closeGame(){gameFrame.src="";currentGameKey=null;gameView.classList.add("hidden");dashboardView.classList.remove("hidden");updateDashboard();window.scrollTo(0,0);}
function requestAttemptAndClose(){try{gameFrame.contentWindow.postMessage({type:"SCCYBER_REQUEST_ATTEMPT"},"*");}catch(e){}setTimeout(closeGame,650);}

window.addEventListener("message",event=>{const data=event.data||{};if(data.type==="SCCYBER_GAME_ATTEMPT")addAttemptPayload(data);if(data.type==="SCCYBER_RETURN_TO_DASHBOARD")requestAttemptAndClose();});
credentialLoginBtn.addEventListener("click",credentialLogin);
demoModeBtn.addEventListener("click",demoMode);
loginBtn.addEventListener("click",()=>{const firstName=firstNameInput.value.trim();const surname=surnameInput.value.trim();const departmentRole=departmentRoleInput.value.trim();if(!firstName||!surname||!departmentRole){alert("Please enter first name, surname and department/role.");return;}saveProfile(createProfile(firstName,surname,departmentRole));updateDashboard();});
backBtn.addEventListener("click",requestAttemptAndClose);
viewReportBtn.addEventListener("click",openReport);
reportBackBtn.addEventListener("click",closeReport);
document.querySelectorAll(".play-btn").forEach(btn=>btn.addEventListener("click",()=>openGame(btn.dataset.title,btn.dataset.url,btn.closest(".game-card").dataset.game)));
initSupabase();