const launchedFromPortal = window.top !== window.self;

const questions = [
  { topic: "OFFICE", scene: "office", q: "You are leaving your desk for a quick chat. A spreadsheet with customer details is open on your screen. What should you do?", a: ["Leave it because you will only be gone for a minute", "Lock the screen before walking away", "Turn the monitor slightly", "Ask a colleague to watch it"], c: 1, why: "Screens should be locked whenever you leave your desk, even briefly." },
  { topic: "OFFICE", scene: "printer", q: "You find a printed document with staff payroll information left near the printer. What is the safest action?", a: ["Read it to see who it belongs to", "Leave it there", "Put it in your drawer", "Hand it to the owner, manager or secure disposal process"], c: 3, why: "Sensitive information should be protected and handled through the correct process." },
  { topic: "OFFICE", scene: "door", q: "A visitor follows closely behind you at the office entrance and says they forgot their pass. What should you do?", a: ["Let them in because they look professional", "Ask them to follow the visitor sign in process", "Hold the door open and tell reception later", "Ignore it"], c: 1, why: "Tailgating can bypass physical security controls." },
  { topic: "REMOTE", scene: "wifi", q: "You are working in a coffee shop and need to access company systems. What is the best approach?", a: ["Use public WiFi with no protection", "Use a trusted connection and approved VPN if required", "Ask the cafe for their admin password", "Turn off MFA to make it easier"], c: 1, why: "Remote access should use approved secure connection methods." },
  { topic: "REMOTE", scene: "train", q: "You are on a train and need to discuss a client issue on a call. What should you do?", a: ["Speak freely because nobody knows the client", "Avoid sensitive details until you are in a private place", "Use the client name but speak quietly", "Send the details to your personal phone"], c: 1, why: "Public spaces are not suitable for sensitive conversations." },
  { topic: "REMOTE", scene: "router", q: "Your home router still uses the default admin password. You regularly work from home. What should you do?", a: ["Leave it because it came from the provider", "Change the router admin password and use strong WiFi security", "Share the WiFi password publicly", "Disable updates"], c: 1, why: "Home networks can affect remote working security." },
  { topic: "DEVICES", scene: "update", q: "Your company laptop says updates are ready, but you are busy. What is the best response?", a: ["Postpone forever", "Install updates at the earliest safe opportunity", "Disable update alerts", "Ask a colleague to log in and do it"], c: 1, why: "Updates often fix known security weaknesses." },
  { topic: "DEVICES", scene: "laptop", q: "Your child asks to use your work laptop for homework because their device is charging. What should you do?", a: ["Allow it for a short time", "Create a separate folder for them", "Do not allow personal or family use of the company device", "Let them use it if WiFi is off"], c: 2, why: "Company devices should only be used for approved work purposes." },
  { topic: "DEVICES", scene: "phone", q: "You lose your company phone while travelling. What should you do first?", a: ["Wait to see if it turns up", "Report it immediately through the correct channel", "Only change your social media passwords", "Buy a replacement before telling anyone"], c: 1, why: "Fast reporting helps the company lock, wipe or protect the device." },
  { topic: "SOFTWARE", scene: "cloud", q: "A free online tool can convert your client spreadsheet faster than approved software. What should you do?", a: ["Upload the file because it saves time", "Use it only once", "Check whether the tool is approved before uploading company data", "Remove the file name first and upload it"], c: 2, why: "Unapproved tools can expose company or client data." },
  { topic: "SOFTWARE", scene: "extension", q: "You receive a browser prompt asking to install an extension to view a document. What is safest?", a: ["Install it quickly", "Check with IT or use approved software only", "Install it then remove it later", "Forward the document to personal email"], c: 1, why: "Browser extensions can access data and should be approved before use." },
  { topic: "SOFTWARE", scene: "login", q: "A colleague shares login details for a paid tool so the team can avoid buying more licences. What should you do?", a: ["Use the shared login", "Save it in your browser", "Refuse and ask for proper access", "Only use it outside work hours"], c: 2, why: "Shared accounts weaken accountability and can breach policy." },
  { topic: "INFRA", scene: "cabinet", q: "You notice a network cabinet door left open in the office corridor. What should you do?", a: ["Ignore it because it is not your job", "Take a photo and post it in chat", "Report it to the right team immediately", "Move cables around to tidy it"], c: 2, why: "Physical access to infrastructure can create serious security risk." },
  { topic: "INFRA", scene: "usb", q: "A contractor asks you to plug an unknown USB device into your company laptop to transfer a file. What should you do?", a: ["Plug it in but do not open files", "Ask them to email it to your personal account", "Use only approved transfer methods", "Scan it at home first"], c: 2, why: "Unknown removable media can introduce malware or data leakage risk." },
  { topic: "INFRA", scene: "incident", q: "You accidentally send a sensitive file to the wrong person. What should you do?", a: ["Delete your sent email and hope it is fine", "Report it immediately and follow the incident process", "Ask the recipient nicely to ignore it", "Wait until someone complains"], c: 1, why: "Mistakes happen, but fast reporting limits harm and supports compliance." }
];

const el = id => document.getElementById(id);
const startScreen = el("startScreen");
const gameShell = el("gameShell");
const gamePanel = el("gamePanel");
const lockPanel = el("lockPanel");
const tag = el("tag");
const question = el("question");
const answers = el("answers");
const feedback = el("feedback");
const nextBtn = el("nextBtn");
const questionNumberBox = el("questionNumberBox");
const totalQuestionsBox = el("totalQuestionsBox");
const scenarioArt = el("scenarioArt");
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

function arcadeStyle() {
  return `
    <style>
      .px{shape-rendering:crispEdges;}
      .glow{filter:drop-shadow(0 0 6px #a94cff)}
      .screenGlow{filter:drop-shadow(0 0 8px #59ff9d)}
      .warn{animation:pulse 1s steps(2,end) infinite;}
      .bob{animation:bob 1.2s steps(2,end) infinite;}
      .walk{animation:walkRight 4.3s steps(7,end) infinite;}
      .slide{animation:slide 2.8s steps(6,end) infinite;}
      .blink{animation:blink 1.1s steps(2,end) infinite;}
      .float{animation:float 1.7s steps(3,end) infinite;}
      .plug{animation:plug 2s steps(4,end) infinite;}
      .mail{animation:mailMove 2.3s steps(6,end) infinite;}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
      @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes walkRight{0%{transform:translateX(0)}18%{transform:translateX(0)}75%{transform:translateX(210px)}100%{transform:translateX(210px)}}
      @keyframes slide{0%{transform:translateX(0)}50%{transform:translateX(70px)}100%{transform:translateX(0)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes plug{0%,100%{transform:translateX(0)}50%{transform:translateX(-24px)}}
      @keyframes mailMove{0%{transform:translateX(0)}70%{transform:translateX(160px)}100%{transform:translateX(160px)}}
    </style>`;
}

function man(x, y, cls = "bob") {
  return `<g class="px ${cls}" transform="translate(${x} ${y})">
    <rect x="16" y="0" width="56" height="18" fill="#1236a8" stroke="#070016" stroke-width="4"/>
    <rect x="12" y="18" width="64" height="58" fill="#c9865c" stroke="#070016" stroke-width="4"/>
    <rect x="24" y="36" width="8" height="8" fill="#070016"/><rect x="56" y="36" width="8" height="8" fill="#070016"/>
    <rect x="36" y="58" width="18" height="6" fill="#070016"/>
    <rect x="15" y="78" width="66" height="58" fill="#1d5fff" stroke="#070016" stroke-width="4"/>
    <rect x="0" y="86" width="18" height="48" fill="#c9865c" stroke="#070016" stroke-width="4"/>
    <rect x="78" y="86" width="18" height="48" fill="#c9865c" stroke="#070016" stroke-width="4"/>
    <rect x="22" y="136" width="20" height="34" fill="#07142e" stroke="#070016" stroke-width="4"/>
    <rect x="54" y="136" width="20" height="34" fill="#07142e" stroke="#070016" stroke-width="4"/>
  </g>`;
}

function woman(x, y, cls = "bob") {
  return `<g class="px ${cls}" transform="translate(${x} ${y})">
    <rect x="6" y="0" width="82" height="72" fill="#ff4fa3" stroke="#070016" stroke-width="4"/>
    <rect x="17" y="26" width="60" height="54" fill="#efaa72" stroke="#070016" stroke-width="4"/>
    <rect x="28" y="43" width="8" height="8" fill="#070016"/><rect x="58" y="43" width="8" height="8" fill="#070016"/>
    <rect x="39" y="62" width="18" height="6" fill="#070016"/>
    <rect x="16" y="82" width="66" height="58" fill="#ffd44d" stroke="#070016" stroke-width="4"/>
    <rect x="0" y="90" width="18" height="48" fill="#efaa72" stroke="#070016" stroke-width="4"/>
    <rect x="80" y="90" width="18" height="48" fill="#efaa72" stroke="#070016" stroke-width="4"/>
    <rect x="24" y="140" width="20" height="34" fill="#601a98" stroke="#070016" stroke-width="4"/>
    <rect x="56" y="140" width="20" height="34" fill="#601a98" stroke="#070016" stroke-width="4"/>
  </g>`;
}

function pc(x, y, label = "CUSTOMER DATA") {
  return `<g class="px screenGlow" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="170" height="100" rx="4" fill="#06142e" stroke="#59ff9d" stroke-width="6"/>
    <rect x="16" y="18" width="138" height="58" fill="#061b16" stroke="#183b39" stroke-width="3"/>
    <text x="24" y="38" fill="#59ff9d" font-size="10" font-family="monospace">${label}</text>
    <rect x="24" y="50" width="90" height="8" fill="#ffd44d"/><rect x="24" y="64" width="120" height="8" fill="#59ff9d"/><rect x="24" y="78" width="70" height="8" fill="#a94cff"/>
    <rect x="70" y="100" width="30" height="30" fill="#1c1550" stroke="#59ff9d" stroke-width="4"/>
    <rect x="44" y="130" width="82" height="12" fill="#a94cff" stroke="#070016" stroke-width="4"/>
  </g>`;
}

function printer(x, y) {
  return `<g class="px glow" transform="translate(${x} ${y})">
    <rect x="25" y="0" width="130" height="55" fill="#07142e" stroke="#59ff9d" stroke-width="5"/>
    <rect x="0" y="48" width="180" height="88" fill="#26358a" stroke="#070016" stroke-width="6"/>
    <rect x="28" y="70" width="124" height="22" fill="#090216" stroke="#59ff9d" stroke-width="4"/>
    <rect class="slide" x="45" y="118" width="90" height="60" fill="#fff" stroke="#ff3b6b" stroke-width="4"/>
    <text x="55" y="142" fill="#090216" font-size="12" font-family="monospace">PAYROLL</text>
  </g>`;
}

function door(x, y) {
  return `<g class="px glow" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="115" height="175" fill="#07142e" stroke="#a94cff" stroke-width="6"/>
    <rect x="78" y="78" width="12" height="12" fill="#ffd44d"/>
    <rect x="20" y="20" width="55" height="65" fill="#112b55" stroke="#59ff9d" stroke-width="4"/>
    <text x="10" y="205" fill="#ffd44d" font-size="14" font-family="monospace">VISITOR?</text>
  </g>`;
}

function wifiSceneIcon(x, y) {
  return `<g class="px glow" transform="translate(${x} ${y})">
    <rect x="40" y="92" width="150" height="54" fill="#07142e" stroke="#59ff9d" stroke-width="5"/>
    <rect x="80" y="110" width="14" height="14" fill="#59ff9d"/><rect x="110" y="110" width="14" height="14" fill="#ffd44d"/><rect x="140" y="110" width="14" height="14" fill="#ff3b6b"/>
    <path class="blink" d="M65 65 Q115 15 165 65" fill="none" stroke="#ffd44d" stroke-width="8"/>
    <path class="blink" d="M85 78 Q115 48 145 78" fill="none" stroke="#59ff9d" stroke-width="8"/>
    <text x="28" y="175" fill="#fff" font-size="14" font-family="monospace">PUBLIC WIFI</text>
  </g>`;
}

function laptop(x, y, label = "UPDATE READY") {
  return `<g class="px screenGlow" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="175" height="98" fill="#06142e" stroke="#59ff9d" stroke-width="6"/>
    <rect x="18" y="18" width="139" height="58" fill="#10135d"/>
    <text x="28" y="50" fill="#ffd44d" font-size="12" font-family="monospace">${label}</text>
    <rect x="-18" y="100" width="215" height="24" fill="#a94cff" stroke="#070016" stroke-width="5"/>
  </g>`;
}

function phone(x, y) {
  return `<g class="px glow float" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="75" height="135" rx="10" fill="#07142e" stroke="#59ff9d" stroke-width="6"/>
    <rect x="12" y="20" width="51" height="80" fill="#10135d" stroke="#a94cff" stroke-width="3"/>
    <rect x="30" y="112" width="16" height="8" fill="#ffd44d"/>
    <text x="-8" y="162" fill="#ff3b6b" font-size="13" font-family="monospace">LOST</text>
  </g>`;
}

function cloud(x, y, label = "UPLOAD?") {
  return `<g class="px glow float" transform="translate(${x} ${y})">
    <rect x="30" y="45" width="150" height="65" rx="28" fill="#a94cff" stroke="#fff" stroke-width="5"/>
    <rect x="60" y="20" width="75" height="75" rx="36" fill="#a94cff" stroke="#fff" stroke-width="5"/>
    <text x="58" y="88" fill="#fff" font-size="18" font-family="monospace">${label}</text>
    <path class="blink" d="M105 135 L105 178 M82 155 L105 178 L128 155" stroke="#ffd44d" stroke-width="8" fill="none"/>
  </g>`;
}

function cabinet(x, y) {
  return `<g class="px glow" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="115" height="190" fill="#07142e" stroke="#59ff9d" stroke-width="6"/>
    <rect x="20" y="18" width="75" height="22" fill="#a94cff"/><rect x="20" y="58" width="75" height="22" fill="#a94cff"/><rect x="20" y="98" width="75" height="22" fill="#a94cff"/>
    <rect class="blink" x="88" y="0" width="90" height="190" fill="#090216" stroke="#ff3b6b" stroke-width="6"/>
    <path d="M28 150 C70 120 90 175 135 125" stroke="#ffd44d" stroke-width="6" fill="none"/>
    <text x="5" y="218" fill="#ff3b6b" font-size="14" font-family="monospace">OPEN CABINET</text>
  </g>`;
}

function usb(x, y) {
  return `<g class="px glow plug" transform="translate(${x} ${y})">
    <rect x="0" y="35" width="130" height="48" fill="#ff3b6b" stroke="#fff" stroke-width="5"/>
    <rect x="130" y="47" width="48" height="25" fill="#ddd" stroke="#070016" stroke-width="5"/>
    <rect x="147" y="52" width="8" height="8" fill="#070016"/><rect x="164" y="52" width="8" height="8" fill="#070016"/>
    <text x="18" y="66" fill="#fff" font-size="14" font-family="monospace">UNKNOWN USB</text>
  </g>`;
}

function mail(x, y) {
  return `<g class="px mail" transform="translate(${x} ${y})">
    <rect x="0" y="0" width="120" height="72" fill="#fff" stroke="#ff3b6b" stroke-width="5"/>
    <path d="M0 0 L60 42 L120 0" fill="none" stroke="#a94cff" stroke-width="5"/>
    <text x="15" y="98" fill="#ff3b6b" font-size="14" font-family="monospace">WRONG SEND</text>
  </g>`;
}

function warning(x, y, text = "!") {
  return `<g class="px warn" transform="translate(${x} ${y})"><rect x="0" y="0" width="60" height="60" fill="#ffd44d" stroke="#070016" stroke-width="5"/><text x="21" y="42" fill="#070016" font-size="36" font-family="monospace">${text}</text></g>`;
}

function baseSvg(inner) {
  return `<svg class="arcade-scene-svg" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated arcade cybersecurity scenario">
    ${arcadeStyle()}
    <rect width="760" height="270" fill="#090216"/>
    <rect width="760" height="270" fill="url(#bg)" opacity=".95"/>
    <defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#051d4d"/><stop offset=".55" stop-color="#17083e"/><stop offset="1" stop-color="#5c064d"/></linearGradient></defs>
    <g opacity=".25">${Array.from({length:18}).map((_, i) => `<rect x="${20 + i * 42}" y="${18 + (i % 6) * 34}" width="28" height="6" fill="${i % 2 ? '#a94cff' : '#59ff9d'}"/>`).join("")}</g>
    ${inner}
  </svg>`;
}

function sceneHtml(scene) {
  const scenes = {
    office: baseSvg(`${pc(55,35)}<rect x="40" y="190" width="220" height="22" fill="#a94cff" stroke="#070016" stroke-width="5"/>${man(260,90,"walk")} ${woman(585,85,"bob")} ${warning(480,35,"!")}`),
    printer: baseSvg(`${printer(55,40)}${man(300,90)}${woman(575,88)}${warning(492,40,"!")}`),
    door: baseSvg(`${door(65,35)}${man(310,88,"slide")} ${woman(520,88)} ${warning(220,45,"!")}`),
    wifi: baseSvg(`${wifiSceneIcon(45,38)}${man(315,88)}${woman(565,88)}${warning(495,36,"!")}`),
    train: baseSvg(`<rect x="40" y="132" width="405" height="82" fill="#07142e" stroke="#59ff9d" stroke-width="6"/><rect x="85" y="150" width="65" height="38" fill="#10135d" stroke="#a94cff" stroke-width="4"/><rect x="180" y="150" width="65" height="38" fill="#10135d" stroke="#a94cff" stroke-width="4"/><text x="92" y="235" fill="#ffd44d" font-size="18" font-family="monospace">PUBLIC TRAIN</text>${man(320,82)}${woman(570,88)}${warning(490,40,"!")}`),
    router: baseSvg(`${wifiSceneIcon(55,42)}${laptop(310,70,"VPN?")} ${woman(590,88)}${warning(500,38,"!")}`),
    update: baseSvg(`${laptop(55,55,"UPDATE READY")} ${man(330,88)} ${woman(575,88)} ${warning(505,35,"!")}`),
    laptop: baseSvg(`${laptop(55,55,"WORK LAPTOP")} ${man(320,88)} ${woman(560,88)} ${warning(500,35,"!")}`),
    phone: baseSvg(`${phone(95,48)} ${man(300,88)} ${woman(555,88)} ${warning(480,35,"!")}`),
    cloud: baseSvg(`${pc(45,45,"CLIENT FILE")} ${cloud(300,30,"UPLOAD?")} ${woman(585,88)} ${warning(505,35,"!")}`),
    extension: baseSvg(`${pc(45,45,"EXTENSION?")} ${cloud(300,30,"INSTALL")} ${woman(585,88)} ${warning(505,35,"!")}`),
    login: baseSvg(`${pc(45,45,"SHARED LOGIN")} ${man(310,88)} ${woman(560,88)} ${warning(500,35,"!")}`),
    cabinet: baseSvg(`${cabinet(55,25)} ${man(330,88)} ${woman(575,88)} ${warning(500,35,"!")}`),
    usb: baseSvg(`${laptop(55,60,"COMPANY PC")} ${usb(315,82)} ${woman(585,88)} ${warning(505,35,"!")}`),
    incident: baseSvg(`${pc(45,45,"SENSITIVE FILE")} ${mail(300,65)} ${woman(590,88)} ${warning(505,35,"!")}`)
  };

  return scenes[scene] || scenes.office;
}

function updateProgress() {
  questionNumberBox.textContent = index + 1;
  totalQuestionsBox.textContent = questions.length;
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
  startScreen.style.display = "none";
  gamePanel.style.display = "block";
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
  scenarioArt.innerHTML = sceneHtml(item.scene || item.topic.toLowerCase());

  item.a.forEach((text, answerIndex) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(answerIndex));
    answers.appendChild(btn);
  });

  updateProgress();
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