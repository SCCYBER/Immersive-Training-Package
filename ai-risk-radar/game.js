const TOTAL_CASES = 10;
const PASS_MARK = 80;
const GAME_KEY = "ai-risk-radar";

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

const cases = [
  {
    topic: "DATA SHARING",
    severity: "HIGH",
    title: "Customer complaint summary",
    copy: "A support manager wants to paste 400 customer complaint emails into a free public AI tool to find common themes.",
    policy: "Customer data, contact details and complaint content must stay inside approved company systems.",
    answers: [
      "Approve it because AI will save time",
      "Use an approved company AI tool or anonymise the data first",
      "Paste only the first 50 emails into the free tool",
      "Send the emails to a personal account and try later"
    ],
    correct: 1,
    risk: "Sensitive customer data in a public AI tool can create privacy, contractual and regulatory exposure.",
    category: "Data sharing"
  },
  {
    topic: "DEEPFAKE",
    severity: "HIGH",
    title: "Urgent voice note from the CEO",
    copy: "Finance receives a realistic voice note that sounds like the CEO asking for an urgent supplier payment before 4pm.",
    policy: "Unusual payment requests must be verified through trusted channels before action.",
    answers: [
      "Pay it because the voice sounds genuine",
      "Reply to the voice note asking for confirmation",
      "Verify through a known contact route and escalate if suspicious",
      "Forward it to the whole company"
    ],
    correct: 2,
    risk: "Deepfake audio can imitate trusted leaders. Payment changes need out-of-band verification.",
    category: "Deepfake fraud"
  },
  {
    topic: "APPROVED AI",
    severity: "LOW",
    title: "Policy wording improvement",
    copy: "A team member wants to use the approved company AI assistant to improve wording in a public cyber awareness poster.",
    policy: "Approved AI tools can be used for low-risk content when no confidential data is included.",
    answers: [
      "Reject all AI use",
      "Approve the use and remind them to check the final output",
      "Upload confidential training records for better context",
      "Use a random free AI site instead"
    ],
    correct: 1,
    risk: "Approved tools are useful for non-sensitive content, but humans still need to review accuracy and tone.",
    category: "Approved use"
  },
  {
    topic: "SHADOW AI",
    severity: "MEDIUM",
    title: "Unapproved browser extension",
    copy: "A colleague installs an AI note-taking browser extension because it summarises meetings automatically.",
    policy: "Extensions and AI tools must be approved before they access work data, meetings or browsers.",
    answers: [
      "Allow it because it only takes notes",
      "Ask IT or security to review before use",
      "Share the extension with the team",
      "Disable MFA so the extension works smoothly"
    ],
    correct: 1,
    risk: "Shadow AI tools may collect meeting content, credentials, browser data or client information.",
    category: "Shadow AI"
  },
  {
    topic: "SOURCE CHECK",
    severity: "MEDIUM",
    title: "AI generated legal answer",
    copy: "An employee asks AI for legal wording and plans to send the answer directly to a client.",
    policy: "AI output must be checked by a competent person before it is relied on or sent externally.",
    answers: [
      "Send it immediately because it sounds professional",
      "Treat it as a draft and get appropriate review",
      "Ask AI to add fake citations",
      "Remove the client name and send it without review"
    ],
    correct: 1,
    risk: "AI can hallucinate confident but incorrect answers. Human review is essential for legal or client-facing work.",
    category: "Accuracy"
  },
  {
    topic: "PROMPT SAFETY",
    severity: "HIGH",
    title: "Debugging with an API key",
    copy: "A developer pastes code containing live API keys into an external AI chatbot to debug an error.",
    policy: "Secrets, keys, tokens and credentials must never be pasted into public or unapproved AI tools.",
    answers: [
      "Approve it because debugging is urgent",
      "Remove secrets and use approved tools or internal review",
      "Paste only one API key",
      "Post the same code in a public forum"
    ],
    correct: 1,
    risk: "Secrets exposed to AI tools can lead to account takeover, data access and incident response work.",
    category: "Secrets"
  },
  {
    topic: "HR DATA",
    severity: "HIGH",
    title: "CV screening shortcut",
    copy: "HR wants to upload candidate CVs into a new AI screening site to rank applicants faster.",
    policy: "Personal data and recruitment decisions require approved tools, privacy review and fairness checks.",
    answers: [
      "Use the tool immediately",
      "Use only approved HR systems and complete review first",
      "Upload CVs with names removed but leave phone numbers",
      "Ask the AI to reject weak candidates automatically"
    ],
    correct: 1,
    risk: "AI recruitment tools can create privacy, bias and fairness risks if they are not approved and governed.",
    category: "Personal data"
  },
  {
    topic: "PHISHING",
    severity: "HIGH",
    title: "Polished AI-written email",
    copy: "A supplier email is perfectly written and personalised, but asks staff to sign into a new invoice portal today.",
    policy: "Polished writing is not proof of trust. Links, domains and payment changes must still be verified.",
    answers: [
      "Trust it because the wording is professional",
      "Check the portal domain and verify through a known supplier contact",
      "Forward it to personal email to open safely",
      "Enter only username first"
    ],
    correct: 1,
    risk: "AI can make phishing more convincing. The request and destination still decide the risk.",
    category: "AI phishing"
  },
  {
    topic: "MEETING DATA",
    severity: "MEDIUM",
    title: "Automatic transcript upload",
    copy: "A project lead wants an AI tool to transcribe a meeting that includes client strategy, pricing and staff performance discussion.",
    policy: "Meeting recording and transcription need approved tools, consent and data classification checks.",
    answers: [
      "Record and upload without telling anyone",
      "Use an approved tool and confirm consent and data handling first",
      "Ask AI to remove names after upload",
      "Use a personal phone recorder"
    ],
    correct: 1,
    risk: "Meeting transcripts can contain personal, commercial and confidential information.",
    category: "Meeting data"
  },
  {
    topic: "IP RISK",
    severity: "MEDIUM",
    title: "Client design concept",
    copy: "A design team wants to upload a confidential client product concept to a public AI image generator for inspiration.",
    policy: "Client confidential material and intellectual property must not be uploaded to unapproved public tools.",
    answers: [
      "Upload the concept because it is only an image",
      "Use approved resources and avoid uploading confidential client material",
      "Crop the logo and upload the rest",
      "Ask the AI site not to save it"
    ],
    correct: 1,
    risk: "Confidential client material can expose IP and contractual obligations when shared with public AI services.",
    category: "IP risk"
  }
];

const startScreen = document.getElementById("startScreen");
const accessLock = document.getElementById("accessLock");
const playNowBtn = document.getElementById("playNowBtn");
const gameShell = document.getElementById("gameShell");
const scoreBox = document.getElementById("scoreBox");
const accuracyBox = document.getElementById("accuracyBox");
const caseBox = document.getElementById("caseBox");
const riskBox = document.getElementById("riskBox");
const riskFill = document.getElementById("riskFill");
const radarWrap = document.getElementById("radarWrap");
const signalBlip = document.getElementById("signalBlip");
const tag = document.getElementById("tag");
const difficultyTag = document.getElementById("difficultyTag");
const caseTitle = document.getElementById("caseTitle");
const caseCopy = document.getElementById("caseCopy");
const policyNote = document.getElementById("policyNote");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const resultCard = document.getElementById("resultCard");
const resultTopline = document.getElementById("resultTopline");
const resultTitle = document.getElementById("resultTitle");
const resultScore = document.getElementById("resultScore");
const resultCopy = document.getElementById("resultCopy");
const resultBreakdown = document.getElementById("resultBreakdown");
const riskFlash = document.getElementById("riskFlash");

let deck = [];
let index = 0;
let correct = 0;
let wrong = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let risk = 0;
let answered = false;
let completed = false;
let startedAt = null;
let finalPayload = null;
let attemptSent = false;
let weakness = {};

if (!canPlay) {
  startScreen.classList.add("hidden");
  gameShell.style.display = "none";
  accessLock.classList.add("active");
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function severityCost(severity) {
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  return 1;
}

function accuracy() {
  const done = correct + wrong;
  return done ? Math.round((correct / done) * 100) : 0;
}

function rank(acc = accuracy(), points = score) {
  if (acc === 100) return "AI GOVERNANCE PRO";
  if (acc >= 90) return "AI RISK LEAD";
  if (acc >= 80) return "AI DEFENDER";
  if (acc >= 60) return "RISK SPOTTER";
  return "AI TRAINEE";
}

function biggestWeakness() {
  const entries = Object.entries(weakness).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : "None identified";
}

function updateHud() {
  const acc = accuracy();
  scoreBox.textContent = score;
  accuracyBox.textContent = `${acc}%`;
  caseBox.textContent = `${Math.min(index + 1, TOTAL_CASES)} / ${TOTAL_CASES}`;
  const riskLabel = risk >= 8 ? "CRITICAL" : risk >= 5 ? "HIGH" : risk >= 3 ? "ELEVATED" : "LOW";
  riskBox.textContent = riskLabel;
  riskFill.style.width = `${Math.min(100, risk * 10)}%`;
  radarWrap.classList.toggle("risk", risk >= 5);
}

function setBlip(item) {
  signalBlip.className = "signal-blip";
  if (item.severity === "LOW") signalBlip.classList.add("safe");
  if (item.severity === "HIGH") signalBlip.classList.add("danger");
  const positions = [
    ["64%", "27%"],
    ["31%", "68%"],
    ["72%", "62%"],
    ["39%", "23%"],
    ["55%", "76%"]
  ];
  const pos = positions[index % positions.length];
  signalBlip.style.left = pos[0];
  signalBlip.style.top = pos[1];
}

function flash(kind) {
  riskFlash.className = "risk-flash";
  void riskFlash.offsetWidth;
  riskFlash.classList.add(kind === "good" ? "active-good" : "active-bad");
}

function startGame() {
  if (!canPlay) return;
  deck = shuffle(cases).slice(0, TOTAL_CASES);
  index = 0;
  correct = 0;
  wrong = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  risk = 0;
  answered = false;
  completed = false;
  finalPayload = null;
  attemptSent = false;
  weakness = {};
  startedAt = Date.now();
  startScreen.classList.add("hidden");
  resultCard.classList.remove("active", "fail");
  renderCase();
}

function renderCase() {
  const item = deck[index];
  answered = false;
  tag.textContent = item.topic;
  difficultyTag.textContent = `${item.severity} RISK`;
  caseTitle.textContent = item.title;
  caseCopy.textContent = item.copy;
  policyNote.textContent = item.policy;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.style.display = "none";
  answers.innerHTML = "";
  setBlip(item);

  item.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => choose(answerIndex));
    answers.appendChild(button);
  });

  updateHud();
}

function choose(answerIndex) {
  if (answered || completed) return;
  answered = true;

  const item = deck[index];
  const isCorrect = answerIndex === item.correct;

  if (isCorrect) {
    correct += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    score += 150 + Math.min(75, streak * 25) + (item.severity === "HIGH" ? 50 : 0);
    risk = Math.max(0, risk - (item.severity === "HIGH" ? 1 : 0));
    feedback.innerHTML = `Correct. Risk contained.<span class="why">${item.risk}</span>`;
    feedback.className = "feedback good";
    flash("good");
  } else {
    wrong += 1;
    streak = 0;
    score = Math.max(0, score - (item.severity === "HIGH" ? 100 : 50));
    risk += severityCost(item.severity);
    weakness[item.category] = (weakness[item.category] || 0) + 1;
    feedback.innerHTML = `Not safe. ${item.severity} risk increased.<span class="why">${item.risk}</span>`;
    feedback.className = "feedback bad";
    flash("bad");
  }

  Array.from(answers.children).forEach((button, buttonIndex) => {
    button.classList.add("disabled");
    if (buttonIndex === item.correct) button.classList.add("correct");
    else if (buttonIndex === answerIndex) button.classList.add("wrong");
  });

  updateHud();

  if (index >= TOTAL_CASES - 1) {
    setTimeout(finishGame, 1000);
    return;
  }

  nextBtn.style.display = "block";
}

function finishGame() {
  completed = true;
  const acc = Math.round((correct / TOTAL_CASES) * 100);
  const passed = correct >= 8;
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const finalRank = rank(acc, score);
  const weaknessText = biggestWeakness();

  finalPayload = {
    type: "SCCYBER_GAME_ATTEMPT",
    game: GAME_KEY,
    score,
    totalQuestions: TOTAL_CASES,
    correct,
    wrong,
    answered: TOTAL_CASES,
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
  resultTopline.textContent = passed ? "AI RISK CONTAINED" : "SHADOW AI EXPOSURE";
  resultTitle.textContent = passed ? "MISSION PASSED" : "MODULE FAILED";
  resultScore.textContent = `${acc}% · ${score} POINTS · ${finalRank}`;
  resultCopy.textContent = passed
    ? "Strong judgement. You handled AI requests with the right balance of productivity, privacy and escalation."
    : "The organisation was left exposed. Review data sharing, approved tools and deepfake verification before going live.";
  resultBreakdown.textContent = `Correct: ${correct} / ${TOTAL_CASES} · Risk level: ${riskBox.textContent} · Biggest weakness: ${weaknessText} · Preview attempts are not saved.`;
}

function sendAttempt() {
  if (attemptSent || !finalPayload || !finalPayload.completed) return;
  if (adminPreview) return;
  attemptSent = true;
  window.parent.postMessage(finalPayload, parentOrigin);
}

nextBtn.addEventListener("click", () => {
  index += 1;
  renderCase();
});

playNowBtn.addEventListener("click", startGame);

window.addEventListener("message", event => {
  if (!launchedFromPortal || event.source !== window.parent || event.origin !== parentOrigin) return;
  const data = event.data || {};
  if (data.type === "SCCYBER_REQUEST_ATTEMPT") sendAttempt();
});
