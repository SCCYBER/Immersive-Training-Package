(function(){
function addStyles(){
 if(document.getElementById('comingSoonTileStyles'))return;
 var s=document.createElement('style');
 s.id='comingSoonTileStyles';
 s.textContent='.coming-soon-card{opacity:.92;position:relative;overflow:hidden}.coming-soon-card:after{content:"COMING SOON";position:absolute;top:14px;right:-38px;transform:rotate(35deg);background:#59ff9d;color:#090216;font-family:"Press Start 2P",cursive;font-size:7px;padding:7px 36px;box-shadow:0 0 18px rgba(89,255,157,.45)}.coming-soon-card .launch-btn{opacity:.75;cursor:not-allowed}';
 document.head.appendChild(s);
}
function addTile(){
 addStyles();
 if(document.querySelector('[data-game="ai-risk-radar"]'))return;
 var grid=document.querySelector('.games-grid');
 if(!grid)return;
 var card=document.createElement('article');
 card.className='game-card live coming-soon-card';
 card.setAttribute('data-game','ai-risk-radar');
 card.innerHTML='<div class="game-icon">🤖</div><div class="game-type">PREMIUM MODULE</div><h2>AI Risk Radar</h2><p>Work through 10 AI security scenarios covering data sharing, shadow AI, deepfakes and safe use of AI tools.</p><div class="game-score" id="score-ai-risk-radar">Coming soon</div><div class="game-meta"><span>Premium</span><span>Easy</span><span>AI Security</span></div><button class="launch-btn" type="button" disabled>Coming Soon</button>';
 grid.appendChild(card);
}
window.addEventListener('load',addTile);
if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(addTile,150);
setTimeout(addTile,800);
})();